/* ==========================================================================
   Yönetim paneli — Katılımcılar
   assets/js/admin/katilimcilar.js

   Liste, arama, sektör/yayın/logo süzgeçleri, düzenleme, logo yükleme.

   Logo yükleme: dosya Storage'daki public-media bucket'ına
   exhibitors/<slug>.<uzanti> yolunda yazılır, ardından exhibitors.logo_url
   güncellenir. Bucket 5 MB ve sabit MIME listesiyle sınırlı (002_storage.sql);
   burada ayrıca istemci tarafında kontrol ediyoruz ki kullanıcı 20 MB'lık bir
   dosyayı boşuna yüklemeye çalışmasın.
   ========================================================================== */

import { getClient } from '../supabase-client.js';
import { korumaliSayfa, oturumIzle } from './auth.js';
import { gunlukYaz } from './gunluk.js';
import { listeSayfasi, kunye } from './liste.js';
import { el, kabukKur, tarihSaat, toast, onayla } from './ui.js';

const oturum = await korumaliSayfa();

/* Stand numaraları veritabanında text[] olarak tutulur. Formda "P1-03, P1-06"
   gibi düz metin yazılır; buradan diziye çevrilir. (Önceki sürüm düz metni
   gönderiyordu ve Supabase "malformed array literal" hatası veriyordu.) */
function standDizisi(metin) {
  return String(metin || '').split(/[,;\s]+/).map((x) => x.trim().toUpperCase()).filter(Boolean);
}
function standMetni(d) {
  return Array.isArray(d) ? d.join(', ') : String(d || '');
}
function slugYap(ad) {
  const t = String(ad).toLowerCase()
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ö/g, 'o').replace(/ç/g, 'c').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return (t || 'firma') + '-' + Math.random().toString(36).slice(2, 6);
}
oturumIzle();

const icerik = kabukKur({ aktif: 'katilimci', baslik: 'Katılımcılar', oturum });
const sb = await getClient();

const BUCKET = 'public-media';
const MAKS_BAYT = 5 * 1024 * 1024;
const IZINLI_TIP = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

/* Sektörler süzgeç ve düzenleme formu için bir kez okunur */
const sektorler = sb
  ? ((await sb.from('sectors').select('id, name_tr').order('sira')).data || [])
  : [];
const sektorAdi = Object.fromEntries(sektorler.map((s) => [s.id, s.name_tr]));

/* Logosu olmayan firma sayısı — kullanıcının asıl işi bu */
const ozet = el('div', { class: 'istatistik-izgara' });
icerik.append(ozet);
ozetYukle();

async function ozetYukle() {
  if (!sb) { ozet.remove(); return; }
  const [top, logolu, yayinda] = await Promise.all([
    sb.from('exhibitors').select('*', { count: 'exact', head: true }),
    sb.from('exhibitors').select('*', { count: 'exact', head: true }).neq('logo_url', ''),
    sb.from('exhibitors').select('*', { count: 'exact', head: true }).eq('published', true)
  ]);
  const eksik = (top.count ?? 0) - (logolu.count ?? 0);
  ozet.replaceChildren(
    kart('Toplam katılımcı', top.count ?? 0),
    kart('Yayında', yayinda.count ?? 0),
    kart('Logosu olan', logolu.count ?? 0),
    kart('Logosu eksik', eksik, eksik ? 'Listeden süzüp yükleyebilirsiniz' : 'Hepsi tamam')
  );
}

function kart(etiket, deger, alt) {
  return el('div', { class: 'ist-kart' },
    el('p', { class: 'ist-kart__etiket' }, etiket),
    el('p', { class: 'ist-kart__deger' }, String(deger)),
    alt ? el('p', { class: 'ist-kart__alt' }, alt) : null);
}

/* --- Liste --- */
const liste = await listeSayfasi(icerik, {
  baslik: 'Katılımcılar',
  altBaslik: 'Satıra tıklayarak bilgileri düzenleyin ve logo yükleyin.',
  tablo: 'exhibitors',
  secim: 'id, name, slug, sector_id, stands, hall, logo_url, aciklama_tr, aciklama_en,' +
         ' web, featured, published, sira, created_at',
  aramaAlanlari: ['name', 'slug', 'hall'],
  aramaDiziAlanlari: ['stands'],
  aramaIpucu: 'Firma adı, sektör ya da stand no (ör. P1-10)…',
  /* Sektör adı ve parçalı stand numarası ile de aranabilsin: ikisi de
     exhibitors tablosunda metin olarak durmadığı için önce eşleşen
     sektör kimliklerini ve tam stand numaralarını buluyoruz. */
  aramaGenislet: async (sb, q) => {
    const kucuk = (x) => String(x || '').toLocaleLowerCase('tr')
      .replace(/ı/g, 'i').replace(/İ/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
      .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
    const aranan = kucuk(q);
    const kosul = [];

    const [sektorler, standlar] = await Promise.all([
      sb.from('sectors').select('id, name_tr, name_en'),
      sb.from('exhibitors').select('stands')
    ]);

    const idler = (sektorler.data || [])
      .filter((s) => kucuk(s.name_tr).includes(aranan) || kucuk(s.name_en).includes(aranan))
      .map((s) => s.id);
    if (idler.length && idler.length < 40) kosul.push(`sector_id.in.(${idler.join(',')})`);

    const buyuk = q.replace(/[{}"\s]/g, '').toUpperCase();
    if (buyuk) {
      const eslesen = new Set();
      for (const r of (standlar.data || [])) {
        for (const st of (r.stands || [])) {
          const t = String(st).toUpperCase();
          if (t !== buyuk && t.includes(buyuk)) eslesen.add(t);
        }
      }
      for (const t of [...eslesen].slice(0, 30)) kosul.push(`stands.cs.{${t}}`);
    }
    return kosul;
  },
  sayfaEylemi: el('button', {
    class: 'btn btn--primary btn--sm', type: 'button',
    onclick: () => liste.cekmeceAc({
      yeni: true, name: '', slug: '', sector_id: null, stands: [], hall: null, logo_url: '',
      aciklama_tr: '', aciklama_en: '', web: '', featured: false, published: true, sira: 999
    })
  }, '+ Yeni katılımcı'),
  varsayilanSirala: 'name',
  varsayilanArtan: true,

  suzgecler: [
    {
      ad: 'sektor', etiket: 'Tüm sektörler',
      secenekler: sektorler.map((s) => ({ deger: s.id, etiket: s.name_tr })),
      uygula: (q, v) => q.eq('sector_id', v)
    },
    {
      ad: 'logo', etiket: 'Logo durumu',
      secenekler: [
        { deger: 'yok', etiket: 'Logosu eksik' },
        { deger: 'var', etiket: 'Logosu olan' }
      ],
      uygula: (q, v) => (v === 'yok' ? q.eq('logo_url', '') : q.neq('logo_url', ''))
    },
    {
      ad: 'yayin', etiket: 'Yayın durumu',
      secenekler: [
        { deger: 'var', etiket: 'Yayında' },
        { deger: 'yok', etiket: 'Taslak' }
      ],
      uygula: (q, v) => q.eq('published', v === 'var')
    }
  ],

  sutunlar: [
    { baslik: 'Logo', render: (r) => logoKutusu(r, 40) },
    { baslik: 'Firma', sirala: 'name', render: (r) => el('span', null,
        r.name,
        r.featured ? el('span', { class: 'durum durum--approved',
                                  style: 'margin-left:8px' }, 'Öne çıkan') : null) },
    { baslik: 'Sektör', sirala: 'sector_id',
      render: (r) => sektorAdi[r.sector_id] || '—' },
    { baslik: 'Stand No', sirala: 'stands', render: (r) => standMetni(r.stands) || '—' },
    { baslik: 'Salon', sirala: 'hall', render: (r) => r.hall
        ? el('span', { class: 'durum durum--notr' }, r.hall) : '—' },
    { baslik: 'Durum', render: (r) => r.published
        ? el('span', { class: 'durum durum--approved' }, 'Yayında')
        : el('span', { class: 'durum durum--notr' }, 'Taslak') }
  ],

  bosBaslik: 'Katılımcı yok',
  bosMetin: 'supabase/seed.sql çalıştırıldıysa 86 katılımcı görünmeli.',

  csv: {
    dosya: 'giresun-expo-katilimcilar',
    basliklar: ['Firma', 'Slug', 'Sektör', 'Stant', 'Salon', 'Logo', 'Web',
                'Öne çıkan', 'Yayında'],
    satir: (r) => [r.name, r.slug, sektorAdi[r.sector_id] || '', standMetni(r.stands), r.hall,
                   r.logo_url || '', r.web, r.featured ? 'Evet' : 'Hayır',
                   r.published ? 'Evet' : 'Hayır']
  },
  csvGunluk: (n) => gunlukYaz({
    tablo: 'exhibitors', islem: 'export', ozet: `${n} katılımcı CSV olarak indirildi`
  }),

  cekmece: (r, arac) => duzenleCekmecesi(r, arac)
});

/* --- Logo görüntüsü ------------------------------------------------------- */

function logoUrl(yol) {
  if (!yol) return null;
  if (/^https?:\/\//i.test(yol)) return yol;
  /* seed'den gelen yollar site köküne göreli (assets/img/...), Storage'a
     yüklenenler ise bucket yolu. İkisini de destekliyoruz. */
  if (yol.startsWith('assets/')) return new URL('../' + yol, document.baseURI).href;
  return sb ? sb.storage.from(BUCKET).getPublicUrl(yol).data.publicUrl : null;
}

function logoKutusu(r, boyut) {
  const url = logoUrl(r.logo_url);
  const cerceve = {
    width: boyut + 'px', height: boyut + 'px', display: 'grid', placeItems: 'center',
    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
    background: '#fff', overflow: 'hidden', flex: 'none'
  };
  const kutu = el('span');
  Object.assign(kutu.style, cerceve);

  if (url) {
    const g = el('img', { src: url, alt: '', loading: 'lazy' });
    g.style.maxWidth = '100%'; g.style.maxHeight = '100%'; g.style.objectFit = 'contain';
    /* Bozuk/silinmiş dosyada kırık görsel ikonu yerine baş harf */
    g.addEventListener('error', () => kutu.replaceChildren(basHarf(r.name)));
    kutu.append(g);
  } else {
    kutu.append(basHarf(r.name));
  }
  return kutu;
}

function basHarf(ad) {
  const h = el('span', null, (ad || '?').trim().charAt(0).toLocaleUpperCase('tr'));
  h.style.color = 'var(--color-muted)';
  h.style.fontWeight = '700';
  return h;
}

/* --- Düzenleme çekmecesi -------------------------------------------------- */

function duzenleCekmecesi(r, arac) {
  const alan = {};
  const yap = (ad, etiket, deger, secenek = {}) => {
    const id = 'k-' + ad;
    const g = secenek.cokSatir
      ? el('textarea', { class: 'form__control', id, rows: '3', maxlength: '1000' })
      : el('input', { class: 'form__control', id, type: 'text', maxlength: '300' });
    g.value = deger ?? '';
    alan[ad] = g;
    return el('div', { class: 'form__group' },
      el('label', { class: 'form__label', for: id }, etiket), g,
      secenek.ipucu ? el('p', { class: 'form__hint' }, secenek.ipucu) : null);
  };

  const sektorSec = el('select', { class: 'form__control', id: 'k-sektor' },
    el('option', { value: '' }, 'Sektör seçilmedi'),
    sektorler.map((s) => el('option', { value: s.id, selected: s.id === r.sector_id },
      s.name_tr)));
  alan.sector_id = sektorSec;

  const yayinKutu = el('input', { type: 'checkbox', id: 'k-yayin' });
  yayinKutu.checked = !!r.published;
  const oneKutu = el('input', { type: 'checkbox', id: 'k-one' });
  oneKutu.checked = !!r.featured;

  /* --- Logo yükleme alanı --- */
  const onizleme = el('div');
  Object.assign(onizleme.style, {
    width: '120px', height: '120px', display: 'grid', placeItems: 'center',
    border: '1px solid var(--color-border)', borderRadius: 'var(--radius)',
    background: '#fff', overflow: 'hidden', flex: 'none'
  });
  onizleme.append(logoKutusu(r, 118));

  const dosyaGiris = el('input', {
    type: 'file', id: 'k-logo', class: 'form__control',
    accept: IZINLI_TIP.join(','), disabled: !!r.yeni
  });

  const yukleDurum = el('p', { class: 'form__hint' },
    r.yeni ? 'Logo, firma kaydedildikten sonra yüklenebilir.'
    : r.logo_url ? 'Mevcut logo yukarıda. Yenisini seçerek değiştirebilirsiniz.'
               : 'Logo yok. PNG, JPEG, WEBP veya SVG — en fazla 5 MB.');

  const logoSilBtn = r.logo_url
    ? el('button', { class: 'btn btn--ghost btn--sm', type: 'button' }, 'Logoyu kaldır')
    : null;

  dosyaGiris.addEventListener('change', async () => {
    const dosya = dosyaGiris.files && dosyaGiris.files[0];
    if (!dosya) return;

    if (!IZINLI_TIP.includes(dosya.type)) {
      toast('Yalnızca PNG, JPEG, WEBP veya SVG yüklenebilir.', 'hata', 7000);
      dosyaGiris.value = '';
      return;
    }
    if (dosya.size > MAKS_BAYT) {
      toast(`Dosya çok büyük (${(dosya.size / 1048576).toFixed(1)} MB). Sınır 5 MB.`,
            'hata', 7000);
      dosyaGiris.value = '';
      return;
    }

    yukleDurum.textContent = 'Yükleniyor…';
    dosyaGiris.disabled = true;

    const uzanti = ({ 'image/png': 'png', 'image/jpeg': 'jpg',
                      'image/webp': 'webp', 'image/svg+xml': 'svg' })[dosya.type];
    const yol = `exhibitors/${r.slug}.${uzanti}`;

    const { error: yuklemeHatasi } = await sb.storage.from(BUCKET)
      .upload(yol, dosya, { upsert: true, contentType: dosya.type, cacheControl: '3600' });

    if (yuklemeHatasi) {
      dosyaGiris.disabled = false;
      dosyaGiris.value = '';
      yukleDurum.textContent = 'Yükleme başarısız.';
      toast('Logo yüklenemedi: ' + yuklemeCevir(yuklemeHatasi), 'hata', 9000);
      return;
    }

    const { error: kayitHatasi } = await sb.from('exhibitors')
      .update({ logo_url: yol }).eq('id', r.id);

    dosyaGiris.disabled = false;

    if (kayitHatasi) {
      yukleDurum.textContent = 'Dosya yüklendi ama kayda bağlanamadı.';
      toast('Logo yüklendi fakat kaydedilemedi: ' + kayitHatasi.message, 'hata', 9000);
      return;
    }

    r.logo_url = yol;
    /* Önbelleği atlatmak için sorgu parametresi — aynı yola yazdık */
    const taze = logoUrl(yol) + '?t=' + Date.now();
    const g = el('img', { src: taze, alt: '' });
    g.style.maxWidth = '100%'; g.style.maxHeight = '100%'; g.style.objectFit = 'contain';
    onizleme.replaceChildren(g);
    yukleDurum.textContent = 'Logo yüklendi.';

    gunlukYaz({ tablo: 'exhibitors', kayit_id: r.id, islem: 'update',
                ozet: `${r.name}: logo yüklendi` });
    toast('Logo yüklendi.', 'basari');
    liste.yukle();
    ozetYukle();
  });

  if (logoSilBtn) {
    logoSilBtn.addEventListener('click', async () => {
      const eminMi = await onayla({
        baslik: 'Logo kaldırılsın mı?',
        metin: `${r.name} firmasının logosu sitede görünmeyecek; yerine firma adının ` +
               'baş harfi gösterilecek.',
        onayMetni: 'Evet, kaldır', tehlike: true
      });
      if (!eminMi) return;

      const { error } = await sb.from('exhibitors').update({ logo_url: '' }).eq('id', r.id);
      if (error) { toast('Kaldırılamadı: ' + error.message, 'hata', 8000); return; }

      /* Storage'daki dosyayı silmiyoruz: editor'ın silme yetkisi yok ve eski
         dosyayı tutmak zararsız. Bağ koptuğu için sitede görünmez. */
      r.logo_url = '';
      onizleme.replaceChildren(basHarf(r.name));
      yukleDurum.textContent = 'Logo kaldırıldı.';
      logoSilBtn.remove();
      gunlukYaz({ tablo: 'exhibitors', kayit_id: r.id, islem: 'update',
                  ozet: `${r.name}: logo kaldırıldı` });
      toast('Logo kaldırıldı.', 'basari');
      liste.yukle();
      ozetYukle();
    });
  }

  const kaydetBtn = el('button', { class: 'btn btn--primary', type: 'button' }, 'Kaydet');
  kaydetBtn.addEventListener('click', async () => {
    const stands = standDizisi(alan.stands.value);
    const ilkHarf = (stands[0] || '').charAt(0);
    const yama = {
      name: alan.name.value.trim(),
      sector_id: sektorSec.value || null,
      stands,
      hall: ['A', 'T', 'G', 'P', 'E'].includes(ilkHarf) ? ilkHarf : null,
      sira: parseInt(alan.sira.value, 10) || 0,
      web: alan.web.value.trim(),
      aciklama_tr: alan.aciklama_tr.value.trim(),
      aciklama_en: alan.aciklama_en.value.trim(),
      published: yayinKutu.checked,
      featured: oneKutu.checked
    };

    if (!yama.name) { toast('Firma adı boş olamaz.', 'hata'); alan.name.focus(); return; }

    kaydetBtn.disabled = true;
    kaydetBtn.classList.add('is-loading');
    let error, yeniId = r.id;
    if (r.yeni) {
      yama.slug = slugYap(yama.name);
      const sonuc = await sb.from('exhibitors').insert(yama).select('id').single();
      error = sonuc.error; yeniId = sonuc.data && sonuc.data.id;
    } else {
      ({ error } = await sb.from('exhibitors').update(yama).eq('id', r.id));
    }
    kaydetBtn.disabled = false;
    kaydetBtn.classList.remove('is-loading');

    if (error) {
      const m = /duplicate|unique/i.test(error.message)
        ? 'Bu adla bir firma zaten var.' : error.message;
      toast('Kaydedilemedi: ' + m, 'hata', 9000); return;
    }

    const degisen = r.yeni ? ['yeni kayıt']
      : Object.keys(yama).filter((k) => JSON.stringify(yama[k]) !== JSON.stringify(r[k]));
    gunlukYaz({ tablo: 'exhibitors', kayit_id: yeniId, islem: r.yeni ? 'insert' : 'update',
                ozet: `${yama.name}: ${degisen.join(', ') || 'değişiklik yok'}` });

    toast('Kaydedildi.', 'basari');
    arac.kapat(); arac.yenile(); ozetYukle();
  });

  const govde = el('div', null,
    el('div', { style: 'display:flex;gap:var(--space-5);align-items:flex-start;' +
                       'margin-bottom:var(--space-5)' },
      onizleme,
      el('div', { style: 'flex:1;min-width:0' },
        el('label', { class: 'form__label', for: 'k-logo' }, 'Logo'),
        dosyaGiris, yukleDurum, logoSilBtn)),

    el('div', { class: 'alan-izgara alan-izgara--tek' },
      yap('name', 'Firma adı', r.name),
      el('div', { class: 'form__group' },
        el('label', { class: 'form__label', for: 'k-sektor' }, 'Sektör'), sektorSec),
      el('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)' },
        yap('stands', 'Stand no', standMetni(r.stands),
            { ipucu: 'Birden fazlaysa virgülle ayırın: P1-03, P1-06' }),
        yap('sira', 'Sıra', String(r.sira ?? ''), { ipucu: 'Küçük sayı önce gelir' })),
      yap('web', 'Web sitesi', r.web),
      yap('aciklama_tr', 'Açıklama (TR)', r.aciklama_tr, { cokSatir: true }),
      yap('aciklama_en', 'Açıklama (EN)', r.aciklama_en, { cokSatir: true }),

      el('div', { style: 'display:flex;gap:var(--space-3);align-items:center' },
        yayinKutu, el('label', { class: 'form__label', for: 'k-yayin',
                                 style: 'margin:0' }, 'Yayında')),
      el('div', { style: 'display:flex;gap:var(--space-3);align-items:center' },
        oneKutu, el('label', { class: 'form__label', for: 'k-one',
                               style: 'margin:0' }, 'Ana sayfada öne çıkar'))
    ),

    r.yeni ? null : el('dl', { class: 'kunye', style: 'margin-top:var(--space-5)' },
      kunye('Slug', r.slug),
      kunye('Logo yolu', r.logo_url || '—'),
      kunye('Eklenme', tarihSaat(r.created_at)))
  );

  const silBtn = r.yeni ? null
    : el('button', { class: 'btn btn--ghost', type: 'button', style: 'margin-right:auto' }, 'Sil');
  if (silBtn) {
    silBtn.addEventListener('click', async () => {
      const ok = await onayla({
        baslik: `${r.name} silinsin mi?`,
        metin: 'Firma sitedeki listeden kalıcı olarak kaldırılır. Yalnızca geçici olarak gizlemek için "Yayında" kutusunu kaldırmanız yeterli.',
        onayMetni: 'Evet, sil', tehlike: true
      });
      if (!ok) return;
      const { error } = await sb.from('exhibitors').delete().eq('id', r.id);
      if (error) { toast('Silinemedi: ' + error.message, 'hata', 9000); return; }
      gunlukYaz({ tablo: 'exhibitors', kayit_id: r.id, islem: 'delete', ozet: `${r.name} silindi` });
      toast('Firma silindi.', 'basari');
      arac.kapat(); arac.yenile(); ozetYukle();
    });
  }

  return { baslik: r.yeni ? 'Yeni katılımcı' : r.name, govde, eylemler: [silBtn, kaydetBtn].filter(Boolean) };
}

function yuklemeCevir(error) {
  const m = (error.message || '').toLowerCase();
  if (m.includes('exceeded the maximum allowed size')) return 'Dosya 5 MB sınırını aşıyor.';
  if (m.includes('mime type') || m.includes('not allowed')) return 'Bu dosya tipi kabul edilmiyor.';
  if (m.includes('bucket not found')) {
    return 'public-media bucket\'ı yok. supabase/migrations/002_storage.sql çalıştırılmalı.';
  }
  if (m.includes('new row violates row-level security') || m.includes('unauthorized')) {
    return 'Yükleme yetkiniz yok.';
  }
  return error.message;
}
