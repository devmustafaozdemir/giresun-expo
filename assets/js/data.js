/* ==========================================================================
   Veri katmanı — Supabase birincil, JSON yedek.

   Public sitenin Supabase'e BAĞIMLI OLMAMASI şart (EK/brief §3.1):
   Supabase kapalıysa, yapılandırılmamışsa veya yavaşsa site data/*.json
   dosyalarından okumaya devam eder. Hiçbir çağrı hata fırlatmaz.

   Yol çözümü: sayfa kökte de en/ içinde de olabildiği için JSON yolları
   <html data-root> değerine göre çözülür (CLAUDE.md → GitHub Pages kuralı).
   ========================================================================== */
import { getClient, yapilandirildiMi } from './supabase-client.js';

const ZAMAN_ASIMI = 6000;   // ms — yavaş Supabase yüzünden sayfa beklemesin

/** JSON dosyasının sayfa konumuna göre mutlak URL'si */
function jsonYolu(ad) {
  const kok = document.documentElement.dataset.root || '';
  return new URL(`${kok}data/${ad}.json`, document.baseURI).href;
}

const onbellek = new Map();

async function jsonOku(ad) {
  if (onbellek.has(ad)) return onbellek.get(ad);
  try {
    const r = await fetch(jsonYolu(ad));
    if (!r.ok) throw new Error(`${r.status}`);
    const v = await r.json();
    onbellek.set(ad, v);
    return v;
  } catch (e) {
    console.warn(`[GE] data/${ad}.json okunamadı:`, e && e.message);
    return null;
  }
}

/** Supabase sorgusunu zaman aşımıyla sarar; hata veya gecikmede null döner */
async function supabaseDene(fn) {
  if (!yapilandirildiMi()) return null;
  const sb = await getClient();
  if (!sb) return null;

  try {
    const sonuc = await Promise.race([
      fn(sb),
      new Promise((_, red) => setTimeout(() => red(new Error('zaman aşımı')), ZAMAN_ASIMI))
    ]);
    if (sonuc && sonuc.error) throw sonuc.error;
    return sonuc ? sonuc.data : null;
  } catch (e) {
    console.warn('[GE] Supabase sorgusu başarısız, JSON yedeğine düşülüyor:', e && e.message);
    return null;
  }
}

/* ==========================================================================
   Genel okuyucular — her biri {kaynak: 'supabase'|'json', veri} döndürür
   ========================================================================== */

export async function siteAyarlari() {
  const sb = await supabaseDene((c) =>
    c.from('site_settings').select('*').limit(1).maybeSingle()
  );
  if (sb) return { kaynak: 'supabase', veri: sb };

  const j = await jsonOku('site-ayarlari');
  return { kaynak: 'json', veri: j };
}

export async function katilimcilar() {
  const sb = await supabaseDene((c) =>
    c.from('exhibitors')
      .select('name, slug, sector_id, stands, hall, logo_url, featured, sira')
      .eq('published', true)
      .order('sira', { ascending: true })
  );
  if (sb) return { kaynak: 'supabase', veri: sb };

  const j = await jsonOku('exhibitors');
  return { kaynak: 'json', veri: j ? j.exhibitors.filter((e) => e.published) : [] };
}

export async function sektorler() {
  const sb = await supabaseDene((c) =>
    c.from('sectors').select('*').order('sira', { ascending: true })
  );
  if (sb) return { kaynak: 'supabase', veri: sb };

  const j = await jsonOku('exhibitors');
  return { kaynak: 'json', veri: j ? j.sectors : [] };
}

export async function sss() {
  const sb = await supabaseDene((c) =>
    c.from('faqs').select('*').eq('published', true).order('sira', { ascending: true })
  );
  if (sb) return { kaynak: 'supabase', veri: sb };

  const j = await jsonOku('sss');
  return { kaynak: 'json', veri: j ? j.sorular : [] };
}

export async function paydaslar() {
  const sb = await supabaseDene((c) =>
    c.from('sponsors').select('*').eq('seviye', 'partner').eq('published', true)
      .order('sira', { ascending: true })
  );
  if (sb) return { kaynak: 'supabase', veri: sb };

  const j = await jsonOku('paydaslar');
  return { kaynak: 'json', veri: j ? j.paydaslar : [] };
}

export async function programOturumlari() {
  const sb = await supabaseDene((c) =>
    c.from('program_sessions').select('*').eq('published', true)
      .order('gun', { ascending: true }).order('baslangic', { ascending: true })
  );
  /* Program için JSON yedeği yok: kitapçıkta program yok. Boş dizi döner. */
  return { kaynak: sb ? 'supabase' : 'yok', veri: sb || [] };
}

/* ==========================================================================
   Form gönderimi — RPC üzerinden.

   Neden RPC? anon rolünün form tablolarında SELECT hakkı YOK (RLS), bu yüzden
   "insert ... returning" ile başvuru numarası geri alınamaz. RPC yalnızca
   üretilen numarayı döndürür, satırın tamamını değil.
   ========================================================================== */

/** Ortak hata çevirisi — kullanıcıya teknik mesaj gösterilmez */
function hataMesaji(e, dil) {
  const tr = dil !== 'en';
  const m = String((e && e.message) || '');
  if (m.includes('BASVURU_KAPALI')) {
    return tr ? 'Başvurular şu anda kapalı.' : 'Applications are currently closed.';
  }
  if (m.includes('KAYIT_KAPALI')) {
    return tr ? 'Ön kayıt şu anda kapalı.' : 'Pre-registration is currently closed.';
  }
  if (m.includes('duplicate') || m.includes('unique')) {
    return tr ? 'Bu kayıt zaten alınmış.' : 'This entry already exists.';
  }
  if (m.includes('violates check constraint') || m.includes('is_email')) {
    return tr ? 'Girdiğiniz bilgilerden biri geçerli değil. Lütfen kontrol edin.'
              : 'One of the values is not valid. Please check and try again.';
  }
  return tr
    ? 'Gönderim sırasında bir sorun oluştu. Lütfen tekrar deneyin veya 0541 662 28 28 numarasını arayın.'
    : 'Something went wrong. Please try again or call +90 541 662 28 28.';
}

async function rpc(ad, parametreler, dil) {
  const sb = await getClient();
  if (!sb) {
    throw new Error(dil !== 'en'
      ? 'Form gönderimi şu anda yapılandırılmamış. Lütfen 0541 662 28 28 numarasını arayın.'
      : 'Form submission is not configured. Please call +90 541 662 28 28.');
  }
  const { data, error } = await sb.rpc(ad, parametreler);
  if (error) throw new Error(hataMesaji(error, dil));
  return data;
}

/** Stant ön başvurusu → başvuru numarası (gönderim yılı: GE-2026-0001) */
export function stantBasvurusu(v, dil) {
  return rpc('submit_stand_application', {
    p_company: v.company,
    p_sector: v.sector || '',
    p_website: v.website || '',
    p_contact_name: v.contactName,
    p_email: v.email,
    p_phone: v.phone,
    p_stand_type: v.standType || '',
    p_area_m2: v.area ? parseInt(v.area, 10) : null,
    p_note: v.note || ''
  }, dil);
}

/** Ziyaretçi ön kaydı → kayıt numarası (GE-Z-2026-00001) */
export function ziyaretciKaydi(v, dil) {
  return rpc('submit_visitor_registration', {
    p_full_name: v.fullName,
    p_email: v.email,
    p_phone: v.phone || '',
    p_city: v.city || '',
    p_sector: v.sector || '',
    p_days: v.days && v.days.length ? v.days : []
  }, dil);
}

/** İletişim mesajı — numara döndürmez, doğrudan INSERT yeterli */
export async function iletisimMesaji(v, dil) {
  const sb = await getClient();
  if (!sb) {
    throw new Error(dil !== 'en'
      ? 'Form gönderimi şu anda yapılandırılmamış. Lütfen 0541 662 28 28 numarasını arayın.'
      : 'Form submission is not configured. Please call +90 541 662 28 28.');
  }
  const { error } = await sb.from('contact_messages').insert({
    name: v.name, email: v.email, subject: v.subject || '', message: v.message
  });
  if (error) throw new Error(hataMesaji(error, dil));
}

/** Bülten aboneliği — aynı e-posta tekrar gelirse sessizce yoksayılır */
export function bultenAbonesi(eposta, dil) {
  return rpc('subscribe_newsletter', { p_email: eposta, p_lang: dil === 'en' ? 'en' : 'tr' }, dil);
}
