/* ==========================================================================
   Yönetim paneli — Sektörler
   assets/js/admin/sektorler.js

   Katılımcıların bağlandığı sektör listesi. Sitedeki Katılımcılar sayfasının
   sektör süzgeci ve firma kartlarındaki sektör adı buradan beslenir.

   Önceden "Diğer İçerik" altında bir sekmeydi. Kendi sayfasına taşındı ki her
   sektörün kaç katılımcıya bağlı olduğu görülsün ve bir sektör silinmeden önce
   kaç firmayı etkileyeceği bilinsin.

   Kimlik (sectors.id) katılımcıların sector_id'sine ve sitedeki ?sektor=
   adresine bağlı olduğu için yalnızca eklerken yazılır, sonra kilitlenir.
   ========================================================================== */

import { getClient } from '../supabase-client.js';
import { korumaliSayfa, oturumIzle } from './auth.js';
import { gunlukYaz } from './gunluk.js';
import { listeSayfasi, kunye } from './liste.js';
import { el, kabukKur, tarihSaat, toast, onayla } from './ui.js';

const oturum = await korumaliSayfa();
oturumIzle();

const icerik = kabukKur({ aktif: 'sektor', baslik: 'Sektörler', oturum });
const sb = await getClient();

/* assets/icons/ altındaki sektör ikonları (tools/icons.mjs ile üretildi) */
const IKONLAR = [
  { deger: 'sektor-gida',       etiket: 'Çatal bıçak (gıda)' },
  { deger: 'sektor-yapi',       etiket: 'Bina (yapı)' },
  { deger: 'sektor-metal',      etiket: 'Dişli (metal, makine)' },
  { deger: 'sektor-enerji',     etiket: 'Şimşek (enerji)' },
  { deger: 'sektor-mobilya',    etiket: 'Koltuk (mobilya)' },
  { deger: 'sektor-otomotiv',   etiket: 'Kamyon (otomotiv, lojistik)' },
  { deger: 'sektor-turizm',     etiket: 'Palmiye (turizm)' },
  { deger: 'sektor-saglik',     etiket: 'Kalp atışı (sağlık)' },
  { deger: 'sektor-kimya',      etiket: 'Deney şişesi (kimya)' },
  { deger: 'sektor-reklam',     etiket: 'Megafon (reklam, medya)' },
  { deger: 'sektor-denizcilik', etiket: 'Gemi (denizcilik)' },
  { deger: 'sektor-teknoloji',  etiket: 'İşlemci (teknoloji)' },
  { deger: 'sektor-tekstil',    etiket: 'Gömlek (tekstil)' },
  { deger: 'sektor-su',         etiket: 'Su damlası (su, çevre)' },
  { deger: 'sektor-tarim',      etiket: 'Filiz (tarım)' },
  { deger: 'sektor-hizmet',     etiket: 'Evrak çantası (hizmet, finans)' },
  { deger: 'sektor-diger',      etiket: 'Paket (diğer)' }
];
const IKON_VAR = new Set(IKONLAR.map((i) => i.deger));

const KIMLIK_DESEN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KIMLIK_UZUNLUK = 40;
const AD_UZUNLUK = 120;   // 001_init.sql: name_tr / name_en 1–120 karakter

function kimlikYap(ad) {
  return String(ad || '').toLocaleLowerCase('tr')
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ö/g, 'o').replace(/ç/g, 'c').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, KIMLIK_UZUNLUK).replace(/-+$/, '');
}

/* --- Özet ve katılımcı sayıları ------------------------------------------ */

/* sector_id -> bağlı katılımcı sayısı. Tablodaki "Katılımcı" sütunu ve silme
   uyarısı bunu kullanır; her kayıt/silme sonrasında yeniden okunur. */
let sayilar = {};
let sonSira = 0;

const ozet = el('div', { class: 'istatistik-izgara' });
icerik.append(ozet);
await ozetYukle();

async function ozetYukle() {
  if (!sb) { ozet.remove(); return; }
  const [firmalar, sektorler] = await Promise.all([
    sb.from('exhibitors').select('sector_id').range(0, 4999),
    sb.from('sectors').select('id, sira')
  ]);
  if (firmalar.error || sektorler.error) { ozet.replaceChildren(); return; }

  sayilar = {};
  let sektorsuz = 0;
  for (const r of firmalar.data) {
    if (r.sector_id) sayilar[r.sector_id] = (sayilar[r.sector_id] || 0) + 1;
    else sektorsuz++;
  }
  sonSira = sektorler.data.reduce((m, s) => Math.max(m, s.sira || 0), 0);

  const toplam = sektorler.data.length;
  const kullanilan = sektorler.data.filter((s) => sayilar[s.id]).length;
  const bos = toplam - kullanilan;
  ozet.replaceChildren(
    kart('Toplam sektör', toplam),
    kart('Katılımcısı olan', kullanilan, bos ? `${bos} sektörde henüz firma yok` : 'Hepsinde firma var'),
    kart('Sektörü seçilmemiş firma', sektorsuz,
      sektorsuz ? 'Katılımcılar sayfasından atayabilirsiniz' : 'Hepsi tamam')
  );
}

function kart(etiket, deger, alt) {
  return el('div', { class: 'ist-kart' },
    el('p', { class: 'ist-kart__etiket' }, etiket),
    el('p', { class: 'ist-kart__deger' }, String(deger)),
    alt ? el('p', { class: 'ist-kart__alt' }, alt) : null);
}

/* --- Liste ---------------------------------------------------------------- */

const liste = await listeSayfasi(icerik, {
  baslik: 'Sektörler',
  altBaslik: 'Sitedeki katılımcı listesinin sektör süzgeci ve firma kartlarındaki ' +
             'sektör adları buradan gelir. Düzenlemek için satıra tıklayın.',
  tablo: 'sectors',
  secim: 'id, name_tr, name_en, ikon, sira, updated_at',
  aramaAlanlari: ['name_tr', 'name_en', 'id'],
  aramaIpucu: 'Sektör adı veya kimlik…',
  varsayilanSirala: 'sira',
  varsayilanArtan: true,
  sayfaEylemi: el('button', {
    class: 'btn btn--primary btn--sm', type: 'button',
    onclick: () => liste.cekmeceAc({
      yeni: true, id: '', name_tr: '', name_en: '', ikon: 'sektor-diger', sira: sonSira + 1
    })
  }, '+ Yeni sektör'),

  sutunlar: [
    { baslik: 'Sıra', sirala: 'sira', sinif: 'tablo__no', render: (r) => String(r.sira ?? '') },
    { baslik: 'İkon', render: (r) => ikonGorseli(r.ikon) },
    { baslik: 'Sektör', sirala: 'name_tr', render: (r) => r.name_tr },
    { baslik: 'İngilizce', sirala: 'name_en', render: (r) => r.name_en || '—' },
    { baslik: 'Kimlik', sirala: 'id', render: (r) => el('code', null, r.id) },
    { baslik: 'Katılımcı', sinif: 'tablo__sag', render: (r) => katilimciBagi(r) }
  ],

  bosBaslik: 'Sektör yok',
  bosMetin: '"+ Yeni sektör" düğmesiyle ekleyin. supabase/seed.sql çalıştırıldıysa 17 sektör görünmeli.',

  cekmece: (r, arac) => duzenleCekmecesi(r, arac)
});

function ikonGorseli(ad, boyut = 20) {
  if (!IKON_VAR.has(ad)) return '—';
  return el('img', { src: `../assets/icons/${ad}.svg`, alt: '',
                     width: String(boyut), height: String(boyut) });
}

/* Sayı, Katılımcılar sayfasına o sektörün süzgeciyle gider */
function katilimciBagi(r) {
  const n = sayilar[r.id] || 0;
  if (!n) return el('span', { style: 'color:var(--color-muted)' }, '0');
  const a = el('a', {
    href: 'katilimcilar.html?sektor=' + encodeURIComponent(r.id),
    title: `${r.name_tr} sektöründeki katılımcıları göster`
  }, String(n));
  /* Satır tıklanınca/Enter'da çekmece açılıyor; bağlantı onu tetiklemesin */
  a.addEventListener('click', (e) => e.stopPropagation());
  a.addEventListener('keydown', (e) => e.stopPropagation());
  return a;
}

/* --- Düzenleme / ekleme çekmecesi ---------------------------------------- */

function duzenleCekmecesi(r, arac) {
  const yeni = !!r.yeni;
  const bagli = yeni ? 0 : (sayilar[r.id] || 0);

  const girdi = (id, deger, ek = {}) => {
    const g = el('input', { class: 'form__control', id, type: 'text', ...ek });
    g.value = deger ?? '';
    return g;
  };
  const grup = (id, etiket, g, ipucu) => el('div', { class: 'form__group' },
    el('label', { class: 'form__label', for: id }, etiket), g,
    ipucu ? el('p', { class: 'form__hint' }, ipucu) : null);

  const adTr = girdi('s-ad-tr', r.name_tr, { maxlength: String(AD_UZUNLUK), required: true });
  const adEn = girdi('s-ad-en', r.name_en, { maxlength: String(AD_UZUNLUK), required: true });
  const kimlik = girdi('s-kimlik', r.id, {
    maxlength: String(KIMLIK_UZUNLUK), disabled: !yeni, spellcheck: 'false',
    autocomplete: 'off', placeholder: yeni ? 'ör. gida' : null
  });
  if (!yeni) kimlik.title = 'Kimlik sonradan değiştirilemez.';

  /* Yeni kayıtta kimlik, elle yazılana kadar Türkçe addan türetilir */
  let kimlikElle = false;
  kimlik.addEventListener('input', () => { kimlikElle = kimlik.value.trim() !== ''; });
  adTr.addEventListener('input', () => {
    if (yeni && !kimlikElle) kimlik.value = kimlikYap(adTr.value);
  });

  const ikonSec = el('select', { class: 'form__control', id: 's-ikon' },
    el('option', { value: '', selected: !r.ikon }, 'İkon yok'),
    IKONLAR.map((o) => el('option', { value: o.deger, selected: o.deger === r.ikon }, o.etiket)));
  /* Listede olmayan eski bir değer varsa kaybolmasın */
  if (r.ikon && !IKON_VAR.has(r.ikon)) {
    ikonSec.append(el('option', { value: r.ikon, selected: true }, r.ikon));
  }
  const ikonOnizleme = el('span', {
    style: 'display:grid;place-items:center;width:44px;height:44px;flex:none;' +
           'border:1px solid var(--color-border);border-radius:var(--radius-sm);background:var(--color-bg)'
  });
  const onizle = () => ikonOnizleme.replaceChildren(ikonGorseli(ikonSec.value, 24));
  onizle();
  ikonSec.addEventListener('change', onizle);

  const sira = el('input', { class: 'form__control', id: 's-sira', type: 'number', step: '1' });
  sira.value = r.sira ?? 0;

  const govde = el('div', null,
    el('div', { class: 'alan-izgara alan-izgara--tek' },
      grup('s-ad-tr', 'Ad (TR)', adTr),
      grup('s-ad-en', 'Ad (EN)', adEn, 'İngilizce sitede gösterilir.'),
      grup('s-kimlik', 'Kimlik', kimlik, yeni
        ? 'Küçük harf, rakam ve tire. Boş bırakırsanız Türkçe addan üretilir. Sonradan değiştirilemez.'
        : 'Katılımcılar ve sitedeki süzgeç adresi bu kimliğe bağlı olduğu için değiştirilemez.'),
      el('div', { class: 'form__group' },
        el('label', { class: 'form__label', for: 's-ikon' }, 'İkon'),
        el('div', { style: 'display:flex;gap:var(--space-3);align-items:center' },
          ikonOnizleme, el('div', { style: 'flex:1;min-width:0' }, ikonSec))),
      grup('s-sira', 'Sıra', sira, 'Küçük sayı önce gösterilir.')
    ),
    yeni ? null : el('dl', { class: 'kunye', style: 'margin-top:var(--space-5)' },
      kunye('Bağlı katılımcı', bagli ? katilimciBagi(r) : 'Yok'),
      kunye('Son güncelleme', tarihSaat(r.updated_at)))
  );

  const kaydetBtn = el('button', { class: 'btn btn--primary', type: 'button' },
    yeni ? 'Ekle' : 'Kaydet');

  kaydetBtn.addEventListener('click', async () => {
    const yama = {
      name_tr: adTr.value.trim(),
      name_en: adEn.value.trim(),
      ikon: ikonSec.value,
      sira: parseInt(sira.value, 10) || 0
    };
    if (!yama.name_tr) { toast('Türkçe ad boş olamaz.', 'hata'); adTr.focus(); return; }
    if (!yama.name_en) { toast('İngilizce ad boş olamaz.', 'hata'); adEn.focus(); return; }

    const id = yeni ? (kimlik.value.trim() || kimlikYap(yama.name_tr)) : r.id;
    if (yeni) {
      if (!KIMLIK_DESEN.test(id)) {
        toast('Kimlik yalnızca küçük harf, rakam ve tire içerebilir (ör. gida, su-cevre).', 'hata', 7000);
        kimlik.focus(); return;
      }
      yama.id = id;
    }

    kaydetBtn.disabled = true;
    kaydetBtn.classList.add('is-loading');
    const { error } = yeni
      ? await sb.from('sectors').insert(yama)
      : await sb.from('sectors').update(yama).eq('id', r.id);
    kaydetBtn.disabled = false;
    kaydetBtn.classList.remove('is-loading');

    if (error) { toast('Kaydedilemedi: ' + hataCevir(error), 'hata', 9000); return; }

    const degisen = yeni ? ['yeni kayıt']
      : Object.keys(yama).filter((k) => yama[k] !== r[k]);
    gunlukYaz({ tablo: 'sectors', kayit_id: id, islem: yeni ? 'insert' : 'update',
                ozet: `${yama.name_tr}: ${degisen.join(', ') || 'değişiklik yok'}` });

    toast(yeni ? 'Sektör eklendi.' : 'Kaydedildi.', 'basari');
    arac.kapat();
    await ozetYukle();
    arac.yenile();
  });

  /* Silme yalnızca sahipte — Diğer İçerik'teki eski sekmeyle aynı kural */
  const silBtn = (!yeni && oturum.admin.role === 'owner')
    ? el('button', { class: 'btn btn--ghost', type: 'button', style: 'margin-right:auto' }, 'Sil')
    : null;

  if (silBtn) {
    silBtn.addEventListener('click', async () => {
      const ok = await onayla({
        baslik: `${r.name_tr} silinsin mi?`,
        metin: bagli
          ? `Bu sektöre bağlı ${bagli} katılımcı var. Silerseniz bu firmaların sektörü ` +
            'boşalır ve sitede "Diğer" olarak görünürler. Önce firmaları başka bir ' +
            'sektöre taşımanız önerilir.'
          : 'Bu sektöre bağlı katılımcı yok. Sektör kalıcı olarak silinir.',
        onayMetni: 'Evet, sil', tehlike: true
      });
      if (!ok) return;

      const { error } = await sb.from('sectors').delete().eq('id', r.id);
      if (error) { toast('Silinemedi: ' + hataCevir(error), 'hata', 9000); return; }

      gunlukYaz({ tablo: 'sectors', kayit_id: r.id, islem: 'delete',
                  ozet: `${r.name_tr} silindi` + (bagli ? ` (${bagli} katılımcının sektörü boşaldı)` : '') });
      toast('Sektör silindi.', 'basari');
      arac.kapat();
      await ozetYukle();
      arac.yenile();
    });
  }

  return {
    baslik: yeni ? 'Yeni sektör' : r.name_tr,
    govde,
    eylemler: [silBtn, kaydetBtn].filter(Boolean)
  };
}

function hataCevir(error) {
  const m = (error.message || '').toLowerCase();
  if (m.includes('duplicate key')) return 'Bu kimlikle bir sektör zaten var. Başka bir kimlik yazın.';
  if (m.includes('violates check constraint')) {
    return `Ad alanları boş olamaz ve en fazla ${AD_UZUNLUK} karakter olabilir.`;
  }
  if (m.includes('row-level security') || m.includes('permission denied')) {
    return 'Bu işlem için yetkiniz yok.';
  }
  return error.message;
}
