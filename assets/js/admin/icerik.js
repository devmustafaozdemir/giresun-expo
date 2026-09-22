/* ==========================================================================
   Yönetim paneli — Diğer İçerik
   assets/js/admin/icerik.js

   SSS, sektörler, ulaşım seçenekleri, paydaşlar ve etkinlik programı tek
   sayfada sekmeli olarak yönetilir. Hepsi de "kısa kayıt listesi + TR/EN alanlar + sıra" biçiminde
   olduğu için ortak bir CRUD üzerinden kuruluyor; her sekme yalnızca alan
   tanımını veriyor.
   ========================================================================== */

import { getClient } from '../supabase-client.js';
import { korumaliSayfa, oturumIzle } from './auth.js';
import { gunlukYaz } from './gunluk.js';
import { el, kabukKur, durumKutusu, iskelet, toast, onayla } from './ui.js';

const oturum = await korumaliSayfa();
oturumIzle();

const icerik = kabukKur({ aktif: 'sayfa', baslik: 'Diğer İçerik', oturum });
const sb = await getClient();

/* --- Sekme tanımları ------------------------------------------------------ */

const SEKMELER = [
  {
    id: 'sss', ad: 'SSS', tablo: 'faqs',
    secim: 'id, slug, soru_tr, soru_en, cevap_tr, cevap_en, published, sira',
    baslikAlan: 'soru_tr',
    yayinVar: true,
    alanlar: [
      { ad: 'slug', etiket: 'Slug', ipucu: 'Küçük harf, rakam ve tire. Boş bırakırsanız sorudan üretilir.' },
      { ad: 'soru_tr', etiket: 'Soru (TR)' },
      { ad: 'soru_en', etiket: 'Soru (EN)' },
      { ad: 'cevap_tr', etiket: 'Cevap (TR)', cokSatir: true },
      { ad: 'cevap_en', etiket: 'Cevap (EN)', cokSatir: true }
    ]
  },
  {
    id: 'sektor', ad: 'Sektörler', tablo: 'sectors',
    secim: 'id, name_tr, name_en, ikon, sira',
    baslikAlan: 'name_tr',
    kimlikAlan: 'id',          // uuid değil, elle verilen metin kimlik
    yayinVar: false,
    alanlar: [
      { ad: 'id', etiket: 'Kimlik', ipucu: 'Küçük harf, tire. Örn: gida. Sonradan değiştirmeyin.' },
      { ad: 'name_tr', etiket: 'Ad (TR)' },
      { ad: 'name_en', etiket: 'Ad (EN)' }
    ]
  },
  {
    id: 'ulasim', ad: 'Ulaşım', tablo: 'transport_options',
    secim: 'id, slug, ikon, baslik_tr, baslik_en, metin_tr, metin_en, hatlar, published, sira',
    baslikAlan: 'baslik_tr',
    yayinVar: true,
    alanlar: [
      { ad: 'slug', etiket: 'Slug', ipucu: 'Küçük harf, rakam ve tire. Boş bırakırsanız başlıktan üretilir.' },
      { ad: 'ikon', etiket: 'İkon',
        secenekler: [
          { deger: 'ulasim-metro', etiket: 'Metro / Marmaray' },
          { deger: 'ulasim-otobus', etiket: 'Otobüs' },
          { deger: 'ulasim-arac', etiket: 'Özel araç / otopark' },
          { deger: 'ulasim-vapur', etiket: 'Vapur / deniz yolu' },
          { deger: 'ulasim-konum', etiket: 'Genel (konum)' }
        ] },
      { ad: 'baslik_tr', etiket: 'Başlık (TR)' },
      { ad: 'baslik_en', etiket: 'Başlık (EN)' },
      { ad: 'metin_tr', etiket: 'Metin (TR)', cokSatir: true },
      { ad: 'metin_en', etiket: 'Metin (EN)', cokSatir: true },
      { ad: 'hatlar', etiket: 'Hatlar', dizi: true,
        ipucu: 'Virgülle ayırın. Örn: M2, T1, Marmaray' }
    ]
  },
  {
    id: 'paydas', ad: 'Paydaşlar', tablo: 'sponsors',
    secim: 'id, ad_tr, ad_en, aciklama_tr, aciklama_en, seviye, logo_url, web, published, sira',
    baslikAlan: 'ad_tr',
    yayinVar: true,
    alanlar: [
      { ad: 'ad_tr', etiket: 'Ad (TR)' },
      { ad: 'ad_en', etiket: 'Ad (EN)' },
      { ad: 'aciklama_tr', etiket: 'Açıklama (TR)', cokSatir: true },
      { ad: 'aciklama_en', etiket: 'Açıklama (EN)', cokSatir: true },
      { ad: 'seviye', etiket: 'Seviye',
        secenekler: [
          { deger: 'partner', etiket: 'Kurucu paydaş' },
          { deger: 'ana', etiket: 'Ana sponsor' },
          { deger: 'altin', etiket: 'Altın sponsor' },
          { deger: 'gumus', etiket: 'Gümüş sponsor' },
          { deger: 'destekci', etiket: 'Destekçi' }
        ],
        ipucu: 'Sitede önce kurucu paydaşlar, sonra sırasıyla sponsorlar gösterilir.' },
      { ad: 'logo_url', etiket: 'Logo', yukleme: 'sponsors',
        ipucu: 'Dosya seçin (PNG, JPG, WEBP, SVG — en fazla 5 MB) ya da hazır bir yol yazın.' },
      { ad: 'web', etiket: 'Web sitesi', ipucu: 'https:// ile. Doluysa logo bu adrese bağlanır.' }
    ]
  },
  {
    id: 'program', ad: 'Program', tablo: 'program_sessions',
    secim: 'id, gun, baslangic, bitis, baslik_tr, baslik_en, aciklama_tr, aciklama_en, tur, salon, published, sira',
    baslikAlan: 'baslik_tr',
    yayinVar: true,
    siralama: [['gun', true], ['baslangic', true]],
    siraGoster: (r) => `${String(r.gun || '').slice(8, 10)}.${String(r.gun || '').slice(5, 7)} ${String(r.baslangic || '').slice(0, 5)}`,
    zorunlu: ['gun', 'baslangic', 'baslik_tr'],
    not: 'Program sayfası yalnızca Site Ayarları\'ndaki "Program yayında" anahtarı açıkken ' +
         've en az bir yayında oturum varken görünür.',
    alanlar: [
      { ad: 'gun', etiket: 'Gün', tip: 'date' },
      { ad: 'baslangic', etiket: 'Başlangıç saati', tip: 'time' },
      { ad: 'bitis', etiket: 'Bitiş saati', tip: 'time', bosIseNull: true, ipucu: 'İsteğe bağlı.' },
      { ad: 'baslik_tr', etiket: 'Başlık (TR)' },
      { ad: 'baslik_en', etiket: 'Başlık (EN)' },
      { ad: 'tur', etiket: 'Tür',
        secenekler: [
          { deger: 'acilis', etiket: 'Açılış' }, { deger: 'panel', etiket: 'Panel' },
          { deger: 'atolye', etiket: 'Atölye' }, { deger: 'b2b', etiket: 'B2B görüşmeler' },
          { deger: 'kulturel', etiket: 'Kültürel etkinlik' }, { deger: 'kapanis', etiket: 'Kapanış' }
        ] },
      { ad: 'salon', etiket: 'Salon / yer', ipucu: 'İsteğe bağlı.' },
      { ad: 'aciklama_tr', etiket: 'Açıklama (TR)', cokSatir: true },
      { ad: 'aciklama_en', etiket: 'Açıklama (EN)', cokSatir: true }
    ]
  }
];

const BUCKET = 'public-media';
const slugla = (t) => String(t || '').toLocaleLowerCase('tr')
  .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'kayit';

/* --- Sekme çubuğu --------------------------------------------------------- */

const ilkId = new URLSearchParams(location.search).get('sekme') || SEKMELER[0].id;
let aktifSekme = SEKMELER.find((s) => s.id === ilkId) || SEKMELER[0];

icerik.append(
  el('div', { class: 'sayfa-bas' },
    el('div', { class: 'sayfa-bas__metin' },
      el('h1', null, 'Diğer İçerik'),
      el('p', { class: 'sayfa-bas__alt' },
        'Sık sorulan sorular, sektörler, ulaşım bilgileri, paydaşlar ve etkinlik programı.')))
);

const sekmeCubugu = el('div', {
  role: 'tablist', 'aria-label': 'İçerik bölümleri',
  style: 'display:flex;gap:var(--space-2);flex-wrap:wrap;margin-bottom:var(--space-4)'
});
icerik.append(sekmeCubugu);

const panel = el('section', { class: 'panel' });
icerik.append(panel);

function sekmeleriCiz() {
  sekmeCubugu.replaceChildren(...SEKMELER.map((s) => {
    const secili = s.id === aktifSekme.id;
    const b = el('button', {
      class: 'btn btn--sm ' + (secili ? 'btn--primary' : 'btn--ghost'),
      type: 'button', role: 'tab', 'aria-selected': String(secili)
    }, s.ad);
    b.addEventListener('click', () => {
      aktifSekme = s;
      history.replaceState(null, '', location.pathname + '?sekme=' + s.id);
      sekmeleriCiz();
      yukle();
    });
    return b;
  }));
}

sekmeleriCiz();
yukle();

/* --- Liste ---------------------------------------------------------------- */

async function yukle() {
  panel.replaceChildren(iskelet(5));

  if (!sb) {
    panel.replaceChildren(durumKutusu({
      tur: 'hata', baslik: 'Sunucuya bağlanılamadı', metin: 'config.js kontrol edin.'
    }));
    return;
  }

  const s = aktifSekme;
  let sorgu = sb.from(s.tablo).select(s.secim);
  for (const [alan, artan] of (s.siralama || [['sira', true]])) sorgu = sorgu.order(alan, { ascending: artan });
  const { data, error } = await sorgu;

  if (error) {
    panel.replaceChildren(durumKutusu({
      tur: 'hata', baslik: s.ad + ' okunamadı', metin: error.message
    }));
    return;
  }

  const ekleBtn = el('button', { class: 'btn btn--primary btn--sm', type: 'button' },
    '+ Yeni ekle');
  ekleBtn.addEventListener('click', () => duzenle(null));

  const bas = el('div', { class: 'panel__bas' },
    el('h2', { class: 'panel__baslik' }, `${s.ad} (${data.length})`),
    el('div', { style: 'margin-left:auto' }, ekleBtn));
  const not = s.not ? el('p', { class: 'form__hint', style: 'margin:0 0 var(--space-3)' }, s.not) : null;

  if (!data.length) {
    panel.replaceChildren(bas, not || '', durumKutusu({
      baslik: s.ad + ' listesi boş',
      metin: 'Yukarıdaki "Yeni ekle" düğmesiyle ilk kaydı oluşturabilirsiniz.'
    }));
    return;
  }

  const govde = el('tbody', null, data.map((r, i) => {
    const tr = el('tr', { tabindex: '0', role: 'button' },
      el('td', { class: 'tablo__no' }, s.siraGoster ? s.siraGoster(r) : String(r.sira ?? i)),
      el('td', null, r[s.baslikAlan] || '—'),
      el('td', null, s.yayinVar
        ? (r.published
            ? el('span', { class: 'durum durum--approved' }, 'Yayında')
            : el('span', { class: 'durum durum--notr' }, 'Taslak'))
        : '—'),
      el('td', { class: 'tablo__sag' },
        el('span', { style: 'color:var(--color-muted);font-size:.8125rem' }, 'Düzenle'))
    );
    tr.style.cursor = 'pointer';
    tr.addEventListener('click', () => duzenle(r));
    tr.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); duzenle(r); }
    });
    return tr;
  }));

  panel.replaceChildren(bas, not || '',
    el('div', { class: 'tablo-sarmal' },
      el('table', { class: 'tablo' },
        el('thead', null, el('tr', null,
          el('th', null, s.siraGoster ? 'Gün / saat' : 'Sıra'), el('th', null, 'Başlık'),
          el('th', null, 'Durum'), el('th', { class: 'tablo__sag' }, ''))),
        govde)));
}

/* --- Düzenleme / ekleme çekmecesi ---------------------------------------- */

let acik = null;
function kapat() { if (acik) { acik(); acik = null; } }

function duzenle(r) {
  kapat();
  const s = aktifSekme;
  const yeniMi = !r;
  const kayit = r || {};
  const oncekiOdak = document.activeElement;

  const giris = {};

  const alanlar = s.alanlar.map((a) => {
    const id = 'i-' + a.ad;
    let g;

    if (a.secenekler) {
      const secenekler = a.secenekler.map((o) => (typeof o === 'string' ? { deger: o, etiket: o } : o));
      /* Listede olmayan eski bir değer varsa kaybolmasın */
      if (kayit[a.ad] && !secenekler.some((o) => o.deger === kayit[a.ad])) {
        secenekler.push({ deger: kayit[a.ad], etiket: kayit[a.ad] });
      }
      g = el('select', { class: 'form__control', id },
        secenekler.map((o) => el('option', { value: o.deger, selected: kayit[a.ad] === o.deger }, o.etiket)));
    } else if (a.tip === 'date' || a.tip === 'time') {
      g = el('input', { class: 'form__control', id, type: a.tip });
      g.value = a.tip === 'time' ? String(kayit[a.ad] ?? '').slice(0, 5) : (kayit[a.ad] ?? '');
    } else if (a.cokSatir) {
      g = el('textarea', { class: 'form__control', id, rows: '4', maxlength: '3000' });
      g.value = kayit[a.ad] ?? '';
    } else {
      g = el('input', { class: 'form__control', id, type: 'text', maxlength: '300' });
      g.value = a.dizi
        ? (Array.isArray(kayit[a.ad]) ? kayit[a.ad].join(', ') : '')
        : (kayit[a.ad] ?? '');
    }

    /* Kimlik alanı mevcut kayıtta kilitli: değiştirmek bağları koparır */
    if (!yeniMi && (a.ad === s.kimlikAlan)) {
      g.disabled = true;
      g.title = 'Kimlik sonradan değiştirilemez.';
    }

    giris[a.ad] = { eleman: g, tanim: a };

    /* Dosya yükleme: Storage'a yazar, yolu metin alanına koyar (kaydet ile kalıcı olur) */
    let yukleyici = null, onizleme = null;
    if (a.yukleme) {
      onizleme = el('img', { alt: '', style: 'max-height:64px;max-width:220px;object-fit:contain;display:block;margin-bottom:var(--space-2)' });
      const goster = () => {
        const v = g.value.trim();
        const url = !v ? '' : /^https?:\/\//i.test(v) ? v
          : v.startsWith('assets/') ? '../' + v
          : sb.storage.from(BUCKET).getPublicUrl(v).data.publicUrl;
        onizleme.hidden = !url;
        if (url) onizleme.src = url;
      };
      goster();
      g.addEventListener('change', goster);
      yukleyici = el('input', { type: 'file', class: 'form__control', accept: 'image/png,image/jpeg,image/webp,image/svg+xml',
        'aria-label': a.etiket + ' dosyası' });
      yukleyici.addEventListener('change', async () => {
        const dosya = yukleyici.files && yukleyici.files[0];
        if (!dosya) return;
        if (dosya.size > 5 * 1024 * 1024) { toast('Dosya 5 MB\'tan büyük olamaz.', 'hata'); yukleyici.value = ''; return; }
        const uzanti = (dosya.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
        const ad = slugla(giris[s.baslikAlan] && giris[s.baslikAlan].eleman.value);
        const yol = `${a.yukleme}/${ad}.${uzanti}`;
        yukleyici.disabled = true;
        const { error } = await sb.storage.from(BUCKET)
          .upload(yol, dosya, { upsert: true, contentType: dosya.type, cacheControl: '3600' });
        yukleyici.disabled = false;
        if (error) { toast('Yüklenemedi: ' + error.message, 'hata', 9000); return; }
        g.value = yol;
        goster();
        onizleme.src = onizleme.src.split('?')[0] + '?t=' + Date.now();
        toast('Dosya yüklendi. Kalıcı olması için "Kaydet"e basın.', 'basari');
      });
    }

    return el('div', { class: 'form__group' },
      el('label', { class: 'form__label', for: id }, a.etiket), onizleme, g, yukleyici,
      a.ipucu ? el('p', { class: 'form__hint' }, a.ipucu) : null);
  });

  const siraGiris = el('input', { class: 'form__control', id: 'i-sira', type: 'number' });
  siraGiris.value = kayit.sira ?? 0;

  const yayinKutu = el('input', { type: 'checkbox', id: 'i-yayin' });
  yayinKutu.checked = kayit.published !== false;

  const kaydetBtn = el('button', { class: 'btn btn--primary', type: 'button' },
    yeniMi ? 'Ekle' : 'Kaydet');

  const silBtn = (!yeniMi && oturum.admin.role === 'owner')
    ? el('button', { class: 'btn btn--tehlike btn--sm', type: 'button' }, 'Sil')
    : null;

  kaydetBtn.addEventListener('click', async () => {
    const yama = {};
    for (const [ad, { eleman, tanim }] of Object.entries(giris)) {
      if (eleman.disabled) continue;
      const ham = String(eleman.value || '').trim();
      yama[ad] = tanim.dizi
        ? ham.split(',').map((x) => x.trim()).filter(Boolean)
        : (tanim.bosIseNull && !ham) ? null : ham;
    }
    /* Slug boş bırakıldıysa başlıktan üret */
    if (giris.slug && !giris.slug.eleman.disabled && !yama.slug) yama.slug = slugla(yama[s.baslikAlan]);
    yama.sira = parseInt(siraGiris.value, 10) || 0;
    if (s.yayinVar) yama.published = yayinKutu.checked;

    /* Zorunlu alan ön kontrolü — asıl kısıt veritabanında */
    const baslik = yama[s.baslikAlan];
    for (const zorunluAlan of (s.zorunlu || [s.baslikAlan])) {
      if (giris[zorunluAlan] && !giris[zorunluAlan].eleman.disabled && !yama[zorunluAlan]) {
        toast(`${s.alanlar.find((a) => a.ad === zorunluAlan).etiket} boş olamaz.`, 'hata');
        giris[zorunluAlan].eleman.focus();
        return;
      }
    }

    kaydetBtn.disabled = true;
    kaydetBtn.classList.add('is-loading');

    const { error } = yeniMi
      ? await sb.from(s.tablo).insert(yama)
      : await sb.from(s.tablo).update(yama).eq(s.kimlikAlan || 'id', kayit[s.kimlikAlan || 'id']);

    kaydetBtn.disabled = false;
    kaydetBtn.classList.remove('is-loading');

    if (error) { toast('Kaydedilemedi: ' + icerikHatasi(error), 'hata', 9000); return; }

    gunlukYaz({
      tablo: s.tablo, kayit_id: kayit[s.kimlikAlan || 'id'] || '',
      islem: yeniMi ? 'insert' : 'update',
      ozet: `${s.ad}: ${baslik}`
    });
    toast(yeniMi ? 'Eklendi.' : 'Kaydedildi.', 'basari');
    kapat(); yukle();
  });

  if (silBtn) {
    silBtn.addEventListener('click', async () => {
      const eminMi = await onayla({
        baslik: 'Kayıt silinsin mi?',
        metin: `"${kayit[s.baslikAlan]}" kalıcı olarak silinecek. ` +
               (s.yayinVar ? 'Yayından kaldırmak çoğu durumda daha iyidir.' : ''),
        onayMetni: 'Evet, sil', tehlike: true
      });
      if (!eminMi) return;

      const { error } = await sb.from(s.tablo).delete()
        .eq(s.kimlikAlan || 'id', kayit[s.kimlikAlan || 'id']);
      if (error) { toast('Silinemedi: ' + icerikHatasi(error), 'hata', 9000); return; }

      gunlukYaz({ tablo: s.tablo, kayit_id: kayit[s.kimlikAlan || 'id'] || '',
                  islem: 'delete', ozet: `${s.ad}: ${kayit[s.baslikAlan]} silindi` });
      toast('Silindi.', 'basari');
      kapat(); yukle();
    });
  }

  const kapatBtn = el('button', {
    class: 'toast__kapat', type: 'button', 'aria-label': 'Kapat', style: 'margin-left:auto'
  }, el('span', null, '✕'));
  kapatBtn.addEventListener('click', kapat);

  const cekmece = el('aside', {
    class: 'cekmece', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'ic-baslik'
  },
    el('div', { class: 'cekmece__bas' },
      el('h2', { class: 'cekmece__baslik', id: 'ic-baslik' },
        yeniMi ? `Yeni ${s.ad.toLocaleLowerCase('tr')} kaydı` : kayit[s.baslikAlan]),
      kapatBtn),
    el('div', { class: 'cekmece__govde' },
      el('div', { class: 'alan-izgara alan-izgara--tek' },
        alanlar,
        el('div', { class: 'form__group' },
          el('label', { class: 'form__label', for: 'i-sira' }, 'Sıra'),
          siraGiris,
          el('p', { class: 'form__hint' }, 'Küçük sayı önce gösterilir.')),
        s.yayinVar
          ? el('div', { style: 'display:flex;gap:var(--space-3);align-items:center' },
              yayinKutu,
              el('label', { class: 'form__label', for: 'i-yayin', style: 'margin:0' },
                'Sitede yayında'))
          : null)),
    el('div', { class: 'cekmece__alt' }, kaydetBtn, silBtn)
  );

  const ortu = el('div', { class: 'cekmece-ortu' });
  ortu.addEventListener('click', kapat);

  function tus(e) {
    if (e.key === 'Escape') { e.preventDefault(); kapat(); return; }
    if (e.key !== 'Tab') return;
    const o = cekmece.querySelectorAll(
      'button, [href], input:not([disabled]), select, textarea');
    if (!o.length) return;
    const ilk = o[0], son = o[o.length - 1];
    if (e.shiftKey && document.activeElement === ilk) { e.preventDefault(); son.focus(); }
    else if (!e.shiftKey && document.activeElement === son) { e.preventDefault(); ilk.focus(); }
  }
  document.addEventListener('keydown', tus, true);

  document.body.append(ortu, cekmece);
  requestAnimationFrame(() => {
    ortu.classList.add('is-acik');
    cekmece.classList.add('is-acik');
  });

  acik = () => {
    document.removeEventListener('keydown', tus, true);
    ortu.remove(); cekmece.remove();
    if (oncekiOdak && oncekiOdak.focus) oncekiOdak.focus();
  };

  const ilkAlan = cekmece.querySelector('input:not([disabled]), textarea, select');
  if (ilkAlan) ilkAlan.focus();
}

function icerikHatasi(error) {
  const m = (error.message || '').toLowerCase();
  if (m.includes('duplicate key') && m.includes('slug')) {
    return 'Bu slug zaten kullanılıyor. Başka bir slug yazın.';
  }
  if (m.includes('duplicate key')) return 'Bu kayıt zaten var.';
  if (m.includes('violates check constraint') && m.includes('slug')) {
    return 'Slug yalnızca küçük harf, rakam ve tire içerebilir.';
  }
  if (m.includes('violates check constraint')) {
    return 'Alanlardan biri kabul edilen aralığın dışında.';
  }
  if (m.includes('violates foreign key')) return 'Bağlı bir kayıt var; önce onu düzenleyin.';
  if (m.includes('row-level security') || m.includes('permission denied')) {
    return 'Bu işlem için yetkiniz yok.';
  }
  return error.message;
}
