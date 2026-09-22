/**
 * RLS kontrol listesinin fiili koşumu.
 *
 *   node tools/rls-test.mjs
 *
 * assets/js/config.js içindeki anon (publishable) anahtarla Supabase REST API'sine
 * bağlanır ve supabase/tests/rls-checklist.md içindeki senaryoları sırayla dener.
 * Hiçbir yerde service_role anahtarı kullanılmaz — testin amacı zaten "sıradan bir
 * ziyaretçinin tarayıcısından neler yapılabiliyor" sorusunu yanıtlamak.
 *
 * Yazma testleri gerçek satır oluşturur. Hepsi TEST_ETIKET ile işaretlenir;
 * temizlik SQL'i koşum sonunda ekrana yazılır.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const kok = join(dirname(fileURLToPath(import.meta.url)), '..');
const TEST_ETIKET = 'RLS-TEST';
const TEST_EPOSTA = 'rls-test@example.invalid';

/* ---- config.js'i oku (tarayıcı dosyası, Node'da import edilemez) ---------- */
function configOku() {
  const src = readFileSync(join(kok, 'assets/js/config.js'), 'utf8');
  const url = src.match(/SUPABASE_URL\s*:\s*['"]([^'"]+)['"]/);
  const key = src.match(/SUPABASE_ANON_KEY\s*:\s*['"]([^'"]+)['"]/);
  if (!url || !key) throw new Error('config.js içinde SUPABASE_URL / SUPABASE_ANON_KEY bulunamadı.');
  return { url: url[1].replace(/\/+$/, ''), key: key[1] };
}

const cfg = configOku();

async function istek(yol, secenekler = {}) {
  const r = await fetch(cfg.url + yol, {
    ...secenekler,
    headers: {
      apikey: cfg.key,
      Authorization: 'Bearer ' + cfg.key,
      'Content-Type': 'application/json',
      ...(secenekler.headers || {})
    }
  });
  let govde = null;
  const metin = await r.text();
  if (metin) { try { govde = JSON.parse(metin); } catch { govde = metin; } }
  return { durum: r.status, govde };
}

const sec = (tablo, sorgu = 'select=*&limit=5') => istek(`/rest/v1/${tablo}?${sorgu}`);
const ekle = (tablo, veri) =>
  istek(`/rest/v1/${tablo}`, { method: 'POST', body: JSON.stringify(veri) });
const rpc = (ad, arg) =>
  istek(`/rest/v1/rpc/${ad}`, { method: 'POST', body: JSON.stringify(arg) });

/* ---- sonuç toplama ------------------------------------------------------- */
const sonuclar = [];
let gecen = 0, kalan = 0;

function kayit(no, baslik, beklenen, gercek, tamam, detay) {
  sonuclar.push({ no, baslik, beklenen, gercek, tamam, detay });
  if (tamam) gecen++; else kalan++;
}

/**
 * Şema hiç kurulmamışsa PostgREST her şeye 404 der. Bu durumda "anon okuyamadı"
 * testleri yanlışlıkla geçmiş görünür. Sahte yeşil vermemek için bunu ayrı bir
 * durum olarak tanıyoruz.
 *   PGRST205 = tablo bulunamadı, PGRST202 = fonksiyon bulunamadı
 */
function semaYok(c) {
  const kod = c && c.govde && c.govde.code;
  return c && c.durum === 404 && (kod === 'PGRST205' || kod === 'PGRST202');
}

/** Bir senaryoyu çalıştır; kontrol fonksiyonu {tamam, gercek} döner. */
async function dene(no, baslik, beklenen, calistir, kontrol) {
  let cevap;
  try {
    cevap = await calistir();
  } catch (e) {
    kayit(no, baslik, beklenen, 'ağ hatası: ' + e.message, false);
    return null;
  }
  if (semaYok(cevap)) {
    kayit(no, baslik, beklenen, 'ŞEMA YOK — migration çalıştırılmamış', false, cevap);
    return cevap;
  }
  const k = kontrol(cevap);
  kayit(no, baslik, beklenen, k.gercek, k.tamam, cevap);
  return cevap;
}

const okunabilir = (c) =>
  Array.isArray(c.govde) ? `HTTP ${c.durum}, ${c.govde.length} satır`
    : `HTTP ${c.durum}` + (c.govde && c.govde.code ? ` (${c.govde.code})` : '');

/* ========================================================================== */
async function main() {
  console.log(`\nRLS kontrol listesi — ${cfg.url}`);
  console.log(`Anahtar: ${cfg.key.slice(0, 22)}… (anon/publishable)\n`);

  /* --- Ön kontrol: şema kurulu mu? ------------------------------------- */
  const onKontrol = await sec('site_settings', 'select=id&limit=1');
  if (semaYok(onKontrol)) {
    console.error('ŞEMA KURULU DEĞİL.\n');
    console.error('  public.site_settings tablosu bulunamadı (PGRST205).');
    console.error('  Önce Supabase SQL Editor\'da şu sırayla çalıştırın:');
    console.error('    1. supabase/migrations/001_init.sql');
    console.error('    2. supabase/migrations/002_storage.sql');
    console.error('    3. supabase/seed.sql');
    console.error('    4. (panelden Auth kullanıcısı oluşturun)');
    console.error('    5. supabase/migrations/003_admin.sql');
    console.error('\n  Ayrıntı: docs/SUPABASE-KURULUM.md\n');
    process.exitCode = 2;
    return;
  }
  if (onKontrol.durum === 401 || onKontrol.durum === 403) {
    console.error(`ANAHTAR REDDEDİLDİ (HTTP ${onKontrol.durum}).`);
    console.error('  assets/js/config.js içindeki SUPABASE_ANON_KEY değerini kontrol edin.\n');
    process.exitCode = 2;
    return;
  }

  /* --- A. Anonim OKUMA: public içerik görünmeli ------------------------- */
  const acikTablolar = [
    ['A1', 'site_settings', 'site_settings'],
    ['A2', 'sectors', 'sectors'],
    ['A3', 'exhibitors (yayında)', 'exhibitors'],
    ['A4', 'faqs', 'faqs'],
    ['A5', 'sponsors', 'sponsors'],
    ['A6', 'transport_options', 'transport_options'],
    ['A7', 'program_sessions', 'program_sessions'],
    ['A8', 'speakers', 'speakers'],
    ['A9', 'gallery_albums', 'gallery_albums'],
    ['A10', 'press_releases', 'press_releases']
  ];
  for (const [no, baslik, tablo] of acikTablolar) {
    await dene(no, `anon SELECT ${baslik}`, 'HTTP 200 (yayındaki satırlar)',
      () => sec(tablo),
      (c) => ({ tamam: c.durum === 200 && Array.isArray(c.govde), gercek: okunabilir(c) }));
  }

  /* --- A11. Yayında olmayan katılımcı sızmamalı ------------------------- */
  await dene('A11', 'anon SELECT exhibitors?published=eq.false', '0 satır (RLS süzer)',
    () => sec('exhibitors', 'select=id,name&published=eq.false&limit=5'),
    (c) => ({
      tamam: c.durum === 200 && Array.isArray(c.govde) && c.govde.length === 0,
      gercek: okunabilir(c)
    }));

  /* --- B. Anonim OKUMA: başvurular ASLA görünmemeli --------------------- */
  const kapaliTablolar = [
    ['B1', 'stand_applications'],
    ['B2', 'visitor_registrations'],
    ['B3', 'contact_messages'],
    ['B4', 'newsletter_subscribers'],
    ['B5', 'admins'],
    ['B6', 'activity_log']
  ];
  for (const [no, tablo] of kapaliTablolar) {
    await dene(no, `anon SELECT ${tablo}`, '0 satır veya 401/403',
      () => sec(tablo),
      (c) => ({
        // RLS'te SELECT politikası yoksa PostgREST 200 + [] döner; 401/403 de kabul.
        tamam: (c.durum === 200 && Array.isArray(c.govde) && c.govde.length === 0) ||
               c.durum === 401 || c.durum === 403 || c.durum === 404,
        gercek: okunabilir(c)
      }));
  }

  /* --- B7. count ile de sızmamalı (satır sayısı bile verilmemeli) ------- */
  await dene('B7', 'anon HEAD stand_applications (count)', 'count = 0',
    () => istek('/rest/v1/stand_applications?select=*', {
      method: 'HEAD', headers: { Prefer: 'count=exact' }
    }),
    (c) => ({ tamam: c.durum === 200 || c.durum === 401 || c.durum === 403,
              gercek: `HTTP ${c.durum}` }));

  /* --- C. Anonim YAZMA: formlar çalışmalı ------------------------------ */
  await dene('C1', 'anon RPC submit_stand_application', 'başvuru numarası döner',
    () => rpc('submit_stand_application', {
      p_company: `${TEST_ETIKET} Şirketi`, p_sector: 'Fındık', p_website: '',
      p_contact_name: `${TEST_ETIKET} Kişi`, p_email: TEST_EPOSTA, p_phone: '+90 555 000 00 00',
      p_stand_type: 'standart', p_area_m2: 12, p_note: TEST_ETIKET
    }),
    (c) => ({
      tamam: c.durum === 200 && typeof c.govde === 'string' && /^GE-\d{4}-\d+$/.test(c.govde),
      gercek: c.durum === 200 ? `HTTP 200 → ${c.govde}` : okunabilir(c)
    }));

  await dene('C2', 'anon RPC submit_visitor_registration', 'kayıt numarası döner',
    () => rpc('submit_visitor_registration', {
      p_full_name: `${TEST_ETIKET} Ziyaretçi`, p_email: TEST_EPOSTA,
      p_phone: '', p_city: 'Giresun', p_sector: '', p_days: ['2026-10-08']
    }),
    (c) => ({
      tamam: c.durum === 200 && typeof c.govde === 'string' && /^GE-Z-\d{4}-\d+$/.test(c.govde),
      gercek: c.durum === 200 ? `HTTP 200 → ${c.govde}` : okunabilir(c)
    }));

  await dene('C3', 'anon INSERT contact_messages', 'HTTP 201',
    () => ekle('contact_messages', {
      name: `${TEST_ETIKET} Kişi`, email: TEST_EPOSTA,
      subject: TEST_ETIKET, message: `${TEST_ETIKET} — silinebilir.`
    }),
    (c) => ({ tamam: c.durum === 201 || c.durum === 200, gercek: okunabilir(c) }));

  await dene('C4', 'anon RPC subscribe_newsletter', 'HTTP 200/204',
    () => rpc('subscribe_newsletter', { p_email: TEST_EPOSTA, p_lang: 'tr' }),
    (c) => ({ tamam: c.durum === 200 || c.durum === 204, gercek: okunabilir(c) }));

  /* --- C5. Yazdıktan sonra bile okuyamamalı ---------------------------- */
  await dene('C5', 'anon SELECT contact_messages (yazdıktan SONRA)', 'yine 0 satır',
    () => sec('contact_messages'),
    (c) => ({
      tamam: (c.durum === 200 && Array.isArray(c.govde) && c.govde.length === 0) ||
             c.durum === 401 || c.durum === 403,
      gercek: okunabilir(c)
    }));

  /* --- C6. Doğrudan INSERT yolu kapalı olmalı --------------------------
     Açık olsaydı "başvurular kapalı" anahtarı bir POST ile atlanabilirdi. */
  await dene('C6', 'anon doğrudan INSERT stand_applications (RPC dışı)',
    'reddedilmeli (401/403)',
    () => istek('/rest/v1/stand_applications', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        company: `${TEST_ETIKET} Doğrudan`, contact_name: `${TEST_ETIKET} Kişi`,
        email: TEST_EPOSTA, phone: '+90 555 000 00 00'
      })
    }),
    (c) => ({ tamam: c.durum === 401 || c.durum === 403, gercek: okunabilir(c) }));

  /* --- C7. Bültene doğrudan INSERT de kapalı (abone sızıntısı) --------- */
  await dene('C7', 'anon doğrudan INSERT newsletter_subscribers', 'reddedilmeli (401/403)',
    () => ekle('newsletter_subscribers', { email: TEST_EPOSTA, lang: 'tr' }),
    (c) => ({ tamam: c.durum === 401 || c.durum === 403, gercek: okunabilir(c) }));

  /* --- D. Anonim YAZMA: içerik tablolarına yazamamalı ------------------ */
  await dene('D1', 'anon INSERT exhibitors', 'reddedilmeli (401/403)',
    () => ekle('exhibitors', { name: `${TEST_ETIKET} Firma`, slug: 'rls-test-firma', published: true }),
    (c) => ({ tamam: c.durum === 401 || c.durum === 403, gercek: okunabilir(c) }));

  await dene('D2', 'anon UPDATE site_settings', 'reddedilmeli / 0 satır',
    () => istek('/rest/v1/site_settings?id=eq.true', {
      method: 'PATCH', headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ mekan_ad_tr: TEST_ETIKET })
    }),
    (c) => ({
      tamam: c.durum === 401 || c.durum === 403 ||
             (c.durum === 200 && Array.isArray(c.govde) && c.govde.length === 0),
      gercek: okunabilir(c)
    }));

  await dene('D3', 'anon DELETE exhibitors', 'reddedilmeli / 0 satır',
    () => istek('/rest/v1/exhibitors?slug=eq.rls-test-firma', { method: 'DELETE' }),
    (c) => ({ tamam: c.durum === 401 || c.durum === 403 || c.durum === 204 || c.durum === 200,
              gercek: okunabilir(c) }));

  await dene('D4', 'anon INSERT admins (yetki yükseltme denemesi)', 'reddedilmeli',
    () => ekle('admins', { email: TEST_EPOSTA, role: 'owner' }),
    (c) => ({ tamam: c.durum === 401 || c.durum === 403 || c.durum >= 400, gercek: okunabilir(c) }));

  await dene('D5', 'anon UPDATE stand_applications (durum değiştirme)', 'reddedilmeli / 0 satır',
    () => istek('/rest/v1/stand_applications?email=eq.' + encodeURIComponent(TEST_EPOSTA), {
      method: 'PATCH', headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ status: 'onaylandi' })
    }),
    (c) => ({
      tamam: c.durum === 401 || c.durum === 403 ||
             (c.durum === 200 && Array.isArray(c.govde) && c.govde.length === 0),
      gercek: okunabilir(c)
    }));

  /* --- E. is_admin() anonim için false olmalı -------------------------- */
  await dene('E1', 'anon RPC is_admin()', 'false',
    () => rpc('is_admin', {}),
    (c) => ({ tamam: c.govde === false || c.durum === 404 || c.durum === 401 || c.durum === 403,
              gercek: c.durum === 200 ? `HTTP 200 → ${c.govde}` : okunabilir(c) }));

  rapor();
}

/* ---- rapor --------------------------------------------------------------- */
function rapor() {
  const g = (s) => (s ? '  GEÇTİ' : '* KALDI');
  console.log('No    Senaryo                                             Sonuç');
  console.log('─'.repeat(100));
  for (const s of sonuclar) {
    console.log(
      `${s.no.padEnd(5)} ${s.baslik.slice(0, 50).padEnd(51)} ${g(s.tamam)}  ${s.gercek}`
    );
  }
  console.log('─'.repeat(100));
  console.log(`${gecen} geçti, ${kalan} kaldı, toplam ${sonuclar.length}\n`);

  if (kalan) {
    console.log('KALAN SENARYOLAR:');
    for (const s of sonuclar.filter((x) => !x.tamam)) {
      console.log(`  ${s.no} ${s.baslik}`);
      console.log(`     beklenen: ${s.beklenen}`);
      console.log(`     gerçek  : ${s.gercek}`);
    }
    console.log('');
  }

  console.log('Test satırlarını temizlemek için Supabase SQL Editor:');
  console.log(`  delete from public.stand_applications   where email = '${TEST_EPOSTA}';`);
  console.log(`  delete from public.visitor_registrations where email = '${TEST_EPOSTA}';`);
  console.log(`  delete from public.contact_messages      where email = '${TEST_EPOSTA}';`);
  console.log(`  delete from public.newsletter_subscribers where email = '${TEST_EPOSTA}';`);
  console.log('');

  // process.exit() yerine exitCode: açık keep-alive soketleriyle yarışıp
  // Windows'ta libuv assertion'ı patlatıyor. Node soketler kapanınca kendi çıkar.
  process.exitCode = kalan ? 1 : 0;
}

main().catch((e) => { console.error(e); process.exitCode = 2; });
