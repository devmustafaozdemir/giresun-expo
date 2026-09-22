/* ==========================================================================
   Site verisi — yönetim panelindeki ayarları public siteye uygular.

   Sayfalar statik HTML olarak eksiksiz gelir (SEO ve dayanıklılık için).
   Bu modül Supabase'e ulaşabilirse şu alanları veritabanındaki değerlerle
   günceller; ulaşamazsa sayfa olduğu gibi kalır:

     Site Ayarları  → tarih, manşet, slogan, mekân, adres, harita, telefon,
                      e-posta, sosyal medya, ziyaret saatleri, istatistikler,
                      duyuru çubuğu, geri sayım ve durum metinleri,
                      başvuru/kayıt açık-kapalı, firma kayıt başlığı ve
                      stant alanı seçenekleri
     Katılımcılar   → firma / stand sayıları, ana sayfadaki öne çıkanlar
     SSS            → ana sayfadaki "Merak edilenler"
     Paydaşlar      → footer, ana sayfa ve Hakkında logoları, basın künyesi
     Ulaşım         → Ziyaret Bilgileri'ndeki ulaşım kartları
     Program        → Program sayfası ("Program yayında" açıksa)

   XSS: veritabanından gelen hiçbir değer innerHTML ile basılmaz.
   ========================================================================== */
import { siteAyarlari, katilimcilar, sss, sektorler, paydaslar, ulasimSecenekleri, programOturumlari } from './data.js';

const DIL = document.documentElement.lang === 'en' ? 'en' : 'tr';
const KOK = document.documentElement.dataset.root || '';
const $ = (s, k = document) => k.querySelector(s);
const $$ = (s, k = document) => Array.from(k.querySelectorAll(s));
const dil = (o, ad) => (o ? (DIL === 'en' ? (o[ad + '_en'] || o[ad + '_tr']) : o[ad + '_tr']) : '') || '';

function h(tag, attrs, ...cocuk) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v; else e.setAttribute(k, v === true ? '' : v);
  }
  for (const c of cocuk.flat()) if (c != null) e.append(c);
  return e;
}

const AYLAR = {
  tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};
function tarihAraligi(bas, bit) {
  const a = new Date(bas + 'T12:00:00'), b = new Date(bit + 'T12:00:00');
  if (isNaN(a) || isNaN(b)) return '';
  const ay = AYLAR[DIL];
  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
    return `${a.getDate()}–${b.getDate()} ${ay[b.getMonth()]} ${b.getFullYear()}`;
  }
  return `${a.getDate()} ${ay[a.getMonth()]} – ${b.getDate()} ${ay[b.getMonth()]} ${b.getFullYear()}`;
}
function tekTarih(t) {
  const a = new Date(t + 'T12:00:00');
  return isNaN(a) ? t : `${a.getDate()} ${AYLAR[DIL][a.getMonth()]} ${a.getFullYear()}`;
}
const saat = (s) => String(s || '').slice(0, 5).replace(':', DIL === 'en' ? ':' : '.');

function metinYaz(sec, deger) {
  if (!deger) return;
  for (const e of $$(sec)) e.textContent = deger;
}

/* ---------------------------------------------------------------------- */

async function baslat() {
  const [ayar, kat, pay] = await Promise.all([siteAyarlari(), katilimcilar(), paydaslar()]);
  const sayilar = sayilariHesapla(kat);
  if (pay && pay.kaynak === 'supabase') {
    sayilar.paydas = pay.veri.length;
    paydaslariYaz(pay.veri);
  }
  const a = ayar && ayar.kaynak === 'supabase' ? ayar.veri : null;

  sayilariYaz(sayilar, a);
  if (kat.kaynak === 'supabase') oneCikanlar(kat.veri);

  if (a) {
    kunye(a);
    iletisim(a);
    saatler(a);
    istatistikler(a, sayilar);
    duyuru(a);
    geriSayim(a);
    basvurular(a);
    programYaz(a);
  }

  sssYukle();
  ulasimYaz();
}

/* --- Firma / stand sayıları --------------------------------------------- */
function sayilariHesapla(kat) {
  const liste = Array.isArray(kat && kat.veri) ? kat.veri : [];
  let stand = 0;
  for (const e of liste) stand += Array.isArray(e.stands) ? e.stands.length : (e.stands ? 1 : 0);
  return { firma: liste.length, stand };
}

function istatistikDegeri(ist, sayilar) {
  const d = String(ist.deger ?? '').trim();
  if (d) return d;
  /* Değer boşsa etikete göre otomatik hesapla */
  const e = `${ist.etiket_tr || ''} ${ist.etiket_en || ''}`.toLowerCase();
  if (/firma|compan|exhibit|katılımcı/.test(e)) return String(sayilar.firma);
  if (/stand|stant/.test(e)) return String(sayilar.stand);
  if (/paydaş|paydas|partner/.test(e) && sayilar.paydas) return String(sayilar.paydas);
  return '';
}

function sayilariYaz(sayilar, a) {
  let stand = sayilar.stand;
  /* Yönetim panelinde "Stand sayısı" istatistiğine değer girildiyse o geçerli */
  if (a && Array.isArray(a.istatistikler)) {
    const st = a.istatistikler.find((i) => /stand|stant/i.test(`${i.etiket_tr} ${i.etiket_en}`));
    if (st && String(st.deger || '').trim()) stand = String(st.deger).trim();
  }
  if (sayilar.firma) metinYaz('[data-sayi="firma"]', String(sayilar.firma));
  if (stand) metinYaz('[data-sayi="stand"]', String(stand));
}

/* --- Künye: tarih, manşet, slogan, mekân -------------------------------- */
function kunye(a) {
  const aralik = tarihAraligi(a.baslangic_tarihi, a.bitis_tarihi);
  metinYaz('[data-ayar="tarih"]', aralik);
  metinYaz('[data-ayar="etkinlik_adi"]', a.etkinlik_adi);
  metinYaz('[data-ayar="manset"]', dil(a, 'manset'));
  metinYaz('[data-ayar="slogan"]', dil(a, 'slogan'));
  metinYaz('[data-ayar="mekan_ad"]', dil(a, 'mekan_ad'));
  metinYaz('.venue__name', dil(a, 'mekan_ad'));
  metinYaz('.venue__area', dil(a, 'mekan_alan'));
  metinYaz('.venue__addr', dil(a, 'adres'));
  metinYaz('[data-ayar="yer"]', [dil(a, 'mekan_ad'), dil(a, 'mekan_alan'), a.mekan_sehir]
    .filter(Boolean).filter((x, i, d) => d.indexOf(x) === i).join(', '));
  metinYaz('[data-ayar="mekan_sehir"]', a.mekan_sehir);
  if (dil(a, 'mekan_ad') || dil(a, 'adres')) {
    for (const p of $$('[data-ayar-adres]')) {
      const satirlar = [dil(a, 'mekan_ad'), dil(a, 'adres')].filter(Boolean);
      p.replaceChildren(...satirlar.flatMap((x, i) => (i ? [h('br'), x] : [x])));
    }
  }

  const q = (a.harita_lat && a.harita_lng) ? `${a.harita_lat},${a.harita_lng}` : a.harita_sorgusu;
  if (q) {
    const src = 'https://maps.google.com/maps?q=' + encodeURIComponent(q) + '&output=embed';
    for (const f of $$('#map iframe')) if (f.getAttribute('src') !== src) f.src = src;
  }
}

/* --- İletişim ------------------------------------------------------------ */
function iletisim(a) {
  if (a.telefon) {
    const tel = 'tel:' + a.telefon.replace(/[^\d+]/g, '').replace(/^0/, '+90');
    for (const l of $$('[data-ayar-telefon]')) {
      l.textContent = a.telefon;
      const baglanti = l.closest('a');
      if (baglanti) baglanti.href = tel;
    }
  }
  for (const p of $$('[data-ayar-eposta]')) {
    if (a.eposta) {
      p.replaceChildren(h('a', { href: 'mailto:' + a.eposta }, a.eposta));
      p.hidden = false;
    } else p.hidden = true;
  }
  for (const p of $$('[data-ayar-web]')) {
    if (/^https?:\/\//i.test(a.web || '')) {
      const gorunen = a.web.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
      p.replaceChildren(h('a', { href: a.web, target: '_blank', rel: 'noopener' }, gorunen));
      p.hidden = false;
    } else p.hidden = true;
  }
  const ADLAR = { instagram: 'Instagram', linkedin: 'LinkedIn', x: 'X', youtube: 'YouTube', facebook: 'Facebook' };
  const sosyal = a.sosyal && typeof a.sosyal === 'object' ? a.sosyal : {};
  const linkler = Object.keys(ADLAR).filter((k) => /^https?:\/\//i.test(sosyal[k] || ''));
  for (const ul of $$('[data-ayar-sosyal]')) {
    ul.replaceChildren(...linkler.map((k) =>
      h('li', null, h('a', { href: sosyal[k], target: '_blank', rel: 'noopener noreferrer' }, ADLAR[k]))));
    ul.hidden = !linkler.length;
  }
}

/* --- Ziyaret saatleri tablosu ------------------------------------------- */
function saatler(a) {
  const liste = Array.isArray(a.ziyaret_saatleri) ? a.ziyaret_saatleri.filter((s) => s.tarih) : [];
  if (!liste.length) return;
  for (const tb of $$('table[data-ayar-saatler] tbody')) {
    tb.replaceChildren(...liste.map((s) => h('tr', null,
      h('th', { scope: 'row' }, DIL === 'en' ? (s.gun_en || s.gun_tr) : s.gun_tr),
      h('td', null, tekTarih(s.tarih)),
      h('td', null, `${saat(s.acilis)} – ${saat(s.kapanis)}`))));
  }
}

/* --- Sayılarla Giresun EXPO --------------------------------------------- */
function istatistikler(a, sayilar) {
  const liste = Array.isArray(a.istatistikler) ? a.istatistikler : [];
  if (!liste.length) return;
  for (const kutu of $$('[data-istatistikler]')) {
    kutu.replaceChildren(...liste.map((i) => {
      const deger = istatistikDegeri(i, sayilar);
      const st = /stand|stant/i.test(`${i.etiket_tr} ${i.etiket_en}`) ? 'stand'
        : /firma|compan|exhibit/i.test(`${i.etiket_tr} ${i.etiket_en}`) ? 'firma' : null;
      return h('div', { class: 'stat' },
        h('span', { class: 'stat__num', 'data-sayi': st }, deger),
        h('span', { class: 'stat__label' }, dil(i, 'etiket')));
    }));
  }
}

/* --- Duyuru çubuğu -------------------------------------------------------- */
function duyuru(a) {
  const metin = dil(a, 'duyuru_metin');
  if (!a.duyuru_aktif || !metin || $('.announce')) return;
  const ic = /^https?:\/\//i.test(a.duyuru_link || '') || /^[\w-]+\.html/.test(a.duyuru_link || '')
    ? h('a', { href: a.duyuru_link }, metin)
    : h('span', null, metin);
  const bar = h('div', { class: 'announce', role: 'region', 'aria-label': DIL === 'en' ? 'Announcement' : 'Duyuru' },
    h('div', { class: 'container announce__inner' }, ic));
  const header = $('.site-header');
  if (header) header.before(bar);
}

/* --- Geri sayım ----------------------------------------------------------- */
function geriSayim(a) {
  const el = $('#countdown');
  if (!el) return;
  if (a.geri_sayim_hedefi) el.dataset.start = new Date(a.geri_sayim_hedefi).toISOString();
  const son = (Array.isArray(a.ziyaret_saatleri) ? a.ziyaret_saatleri : [])
    .filter((s) => s.tarih === a.bitis_tarihi)[0];
  if (a.bitis_tarihi) el.dataset.end = `${a.bitis_tarihi}T${(son && son.kapanis ? son.kapanis.slice(0, 5) : '23:59')}:00+03:00`;
  if (dil(a, 'durum_oncesi')) el.dataset.textBefore = dil(a, 'durum_oncesi');
  if (dil(a, 'durum_sirasinda')) el.dataset.textDuring = dil(a, 'durum_sirasinda');
  if (dil(a, 'durum_sonrasi')) el.dataset.textAfter = dil(a, 'durum_sonrasi');
}

/* --- Başvuru / kayıt açık-kapalı, firma kayıt seçenekleri ----------------- */
function kapaliGoster(form, mesaj) {
  const kutu = h('div', { class: 'notice notice--info', role: 'status' }, h('p', null, mesaj));
  form.replaceWith(kutu);
}

function basvurular(a) {
  const stand = $('form[data-form="stand"]');
  if (stand) {
    const baslik = dil(a, 'stant_baslik');
    if (baslik) metinYaz('.page-header h1', baslik);

    const fiyat = (Array.isArray(a.stant_fiyatlari) ? a.stant_fiyatlari : [])
      .map((f) => ({ ...f, m2: parseInt(String(f.tip_tr || f.tip_en || '').replace(/\D+/g, ''), 10) }))
      .filter((f) => f.m2 > 0);
    const kutu = $('[data-stant-alanlari]', stand);
    if (kutu && fiyat.length) {
      kutu.replaceChildren(...fiyat.map((f) => h('label', { class: 'stand-opt' },
        h('input', { type: 'radio', name: 'area', value: String(f.m2), required: true }),
        h('span', { class: 'stand-opt__box' },
          h('span', { class: 'stand-opt__m2' }, dil(f, 'tip') || `${f.m2} m²`),
          h('span', { class: 'stand-opt__price' }, f.fiyat || '')))));
    }

    if (a.stant_basvuru_acik === false) {
      kapaliGoster(stand, dil(a, 'stant_kapali') ||
        (DIL === 'en' ? 'Applications are currently closed.' : 'Başvurular şu anda kapalı.'));
    }
  }

  const ziyaretci = $('form[data-form="visitor"]');
  if (ziyaretci && a.ziyaretci_kaydi_acik === false) {
    kapaliGoster(ziyaretci, DIL === 'en'
      ? 'Visitor registration is currently closed.'
      : 'Ziyaretçi kaydı şu anda kapalı.');
  }
}

/* --- Ana sayfa: öne çıkan katılımcılar ------------------------------------ */
async function oneCikanlar(liste) {
  const kutu = $('[data-one-cikan]');
  if (!kutu || !Array.isArray(liste)) return;
  const secili = liste.filter((e) => e.featured).slice(0, 8);
  if (!secili.length) return;
  const sek = await sektorler();
  const ad = {};
  for (const s of (sek.veri || [])) ad[s.id] = DIL === 'en' ? (s.name_en || s.name_tr) : s.name_tr;

  const logo = (yol) => {
    if (!yol) return '';
    if (/^https?:\/\//i.test(yol)) return yol;
    if (yol.startsWith('assets/')) return KOK + yol;
    const c = window.GE_CONFIG || {};
    return c.SUPABASE_URL ? `${c.SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/public-media/${yol}` : '';
  };

  kutu.replaceChildren(...secili.map((e, i) => {
    const url = logo(e.logo_url);
    const stands = Array.isArray(e.stands) ? e.stands : [];
    const gorsel = url
      ? h('div', { class: 'exhibitor__logo' }, h('img', { src: url, alt: e.name, loading: 'lazy' }))
      : h('div', { class: 'monogram' + (i % 2 ? ' monogram--navy' : ''), 'aria-hidden': 'true' },
          e.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toLocaleUpperCase('tr'));
    return h('article', { class: 'card exhibitor' }, gorsel,
      h('div', { class: 'card__body' },
        h('h3', { class: 'card__title' }, e.name),
        h('p', { class: 'card__text' }, ad[e.sector_id] || ''),
        h('p', { class: 'exhibitor__stand' }, 'Stand No: ', h('strong', null, stands.join(', ')))));
  }));
}

/* --- SSS ------------------------------------------------------------------ */
async function sssYukle() {
  const kutu = $('[data-sss]');
  if (!kutu) return;
  const r = await sss();
  if (r.kaynak !== 'supabase' || !Array.isArray(r.veri) || !r.veri.length) return;
  const ikon = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'accordion__icon'); svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.75'); svg.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', 'm6 9 6 6 6-6'); svg.appendChild(p);
    return svg;
  };
  kutu.replaceChildren(...r.veri.map((q, i) => {
    const id = `sss-db-${i + 1}`;
    const panel = h('div', { class: 'accordion__panel', id, hidden: true }, h('p', null, dil(q, 'cevap')));
    return h('div', { class: 'accordion__item' },
      h('h3', null, h('button', { class: 'accordion__btn', type: 'button', 'aria-expanded': 'false', 'aria-controls': id },
        dil(q, 'soru'), ikon())),
      panel);
  }));
}

/* --- Görsel yolu: assets/… (sitede), https://… veya Storage yolu ------- */
function gorselAdresi(yol) {
  if (!yol) return '';
  if (/^https?:\/\//i.test(yol)) return yol;
  if (yol.startsWith('assets/')) return KOK + yol;
  const c = window.GE_CONFIG || {};
  return c.SUPABASE_URL ? `${c.SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/public-media/${yol}` : '';
}

/* --- Paydaşlar ------------------------------------------------------------ */
const SEVIYE_SIRA = { partner: 0, ana: 1, altin: 2, gumus: 3, destekci: 4 };
function paydaslariYaz(liste) {
  const sirali = liste.slice().sort((x, y) =>
    ((SEVIYE_SIRA[x.seviye] ?? 9) - (SEVIYE_SIRA[y.seviye] ?? 9)) || ((x.sira || 0) - (y.sira || 0)));

  const logo = (p) => {
    const ad = dil(p, 'ad');
    const url = gorselAdresi(p.logo_url);
    const ic = url
      ? h('img', { src: url, alt: ad, width: '320', height: '120', loading: 'lazy' })
      : h('span', { class: 'partner__ad' }, ad);
    const sar = /^https?:\/\//i.test(p.web || '')
      ? h('a', { href: p.web, target: '_blank', rel: 'noopener', 'aria-label': ad }, ic) : ic;
    return h('div', { class: 'partner' }, sar);
  };

  for (const kutu of $$('[data-paydas="logo"]')) kutu.replaceChildren(...sirali.map(logo));
  for (const kutu of $$('[data-paydas="kart"]')) {
    kutu.replaceChildren(...sirali.map((p) => h('div', { class: 'partner-card' },
      logo(p),
      /* Logosu olmayan paydaşın adı zaten kutunun içinde yazıyor */
      gorselAdresi(p.logo_url) ? h('h3', { class: 'partner-card__name' }, dil(p, 'ad')) : null,
      dil(p, 'aciklama') ? h('p', { class: 'partner-card__desc' }, dil(p, 'aciklama')) : null)));
  }
  for (const e of $$('[data-paydas="ad"]')) e.textContent = sirali.map((p) => dil(p, 'ad')).join(', ');
}

/* --- Ulaşım kartları ------------------------------------------------------ */
const SVG_NS = 'http://www.w3.org/2000/svg';
const IKONLAR = {
  metro: [['rect', { width: 16, height: 16, x: 4, y: 3, rx: 2 }], ['path', { d: 'M4 11h16' }], ['path', { d: 'M12 3v8' }],
    ['path', { d: 'm8 19-2 3' }], ['path', { d: 'm18 22-2-3' }], ['path', { d: 'M8 15h.01' }], ['path', { d: 'M16 15h.01' }]],
  otobus: [['path', { d: 'M8 6v6' }], ['path', { d: 'M15 6v6' }], ['path', { d: 'M2 12h19.6' }],
    ['path', { d: 'M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3' }],
    ['circle', { cx: 7, cy: 18, r: 2 }], ['path', { d: 'M9 18h5' }], ['circle', { cx: 16, cy: 18, r: 2 }]],
  arac: [['path', { d: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2' }],
    ['circle', { cx: 7, cy: 17, r: 2 }], ['path', { d: 'M9 17h6' }], ['circle', { cx: 17, cy: 17, r: 2 }]],
  vapur: [['path', { d: 'M12 10.189V14' }], ['path', { d: 'M12 2v3' }], ['path', { d: 'M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6' }],
    ['path', { d: 'M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76' }],
    ['path', { d: 'M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1' }]],
  konum: [['path', { d: 'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0' }],
    ['circle', { cx: 12, cy: 10, r: 3 }]]
};
function ulasimIkonu(ad) {
  const k = String(ad || '').toLowerCase();
  const tur = /metro|tren|marmaray|rail/.test(k) ? 'metro'
    : /otob|bus/.test(k) ? 'otobus'
    : /arac|araç|otopark|car|taksi/.test(k) ? 'arac'
    : /vapur|deniz|feribot|ship|ferry/.test(k) ? 'vapur' : 'konum';
  const svg = document.createElementNS(SVG_NS, 'svg');
  for (const [a, v] of Object.entries({ class: 'icon', 'aria-hidden': 'true', focusable: 'false', viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })) {
    svg.setAttribute(a, v);
  }
  for (const [etiket, nit] of IKONLAR[tur]) {
    const e = document.createElementNS(SVG_NS, etiket);
    for (const [a, v] of Object.entries(nit)) e.setAttribute(a, String(v));
    svg.appendChild(e);
  }
  return svg;
}
function hatRozeti(hat) {
  const sinif = /marmaray/i.test(hat) ? ' line-badge--marmaray' : /^\d/.test(hat) ? ' line-badge--bus' : '';
  return h('span', { class: 'line-badge' + sinif }, hat);
}
async function ulasimYaz() {
  const kutu = $('[data-ulasim]');
  if (!kutu) return;
  const r = await ulasimSecenekleri();
  if (r.kaynak !== 'supabase') return;
  kutu.replaceChildren(...r.veri.map((u) => {
    const hatlar = Array.isArray(u.hatlar) ? u.hatlar.filter(Boolean) : [];
    return h('article', { class: 'card' }, h('div', { class: 'card__body' },
      h('span', { class: 'pillar__icon' }, ulasimIkonu(u.ikon || u.slug)),
      h('h3', { class: 'card__title' }, dil(u, 'baslik')),
      hatlar.length ? h('p', { class: 'cluster' }, hatlar.map(hatRozeti)) : null,
      dil(u, 'metin') ? h('p', { class: 'card__text' }, dil(u, 'metin')) : null));
  }));
  kutu.hidden = !r.veri.length;
}

/* --- Program -------------------------------------------------------------- */
const TUR_AD = {
  tr: { acilis: 'Açılış', panel: 'Panel', atolye: 'Atölye', b2b: 'B2B görüşmeler', kulturel: 'Kültürel etkinlik', kapanis: 'Kapanış' },
  en: { acilis: 'Opening', panel: 'Panel', atolye: 'Workshop', b2b: 'B2B meetings', kulturel: 'Cultural event', kapanis: 'Closing' }
};
const GUN_AD = {
  tr: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
};
async function programYaz(a) {
  const liste = $('[data-program-liste]');
  if (!liste) return;
  const bos = $$('[data-program-bos]');
  if (!a.program_yayinda) return;              // kapalıysa "yakında açıklanacak" kalır
  const r = await programOturumlari();
  if (r.kaynak !== 'supabase' || !r.veri.length) return;

  const gunler = new Map();
  for (const o of r.veri) {
    if (!gunler.has(o.gun)) gunler.set(o.gun, []);
    gunler.get(o.gun).push(o);
  }
  liste.replaceChildren(...[...gunler.entries()].map(([gun, oturumlar]) => {
    const d = new Date(gun + 'T12:00:00');
    return h('section', { class: 'program__gun' },
      h('h2', { class: 'program__tarih' }, `${tekTarih(gun)}${isNaN(d) ? '' : ' · ' + GUN_AD[DIL][d.getDay()]}`),
      h('ol', { class: 'program__liste' }, oturumlar.map((o) => h('li', { class: 'program__oturum' },
        h('p', { class: 'program__saat' }, saat(o.baslangic) + (o.bitis ? ` – ${saat(o.bitis)}` : '')),
        h('div', { class: 'program__govde' },
          h('p', { class: 'program__tur' }, [TUR_AD[DIL][o.tur] || o.tur, o.salon].filter(Boolean).join(' · ')),
          h('h3', { class: 'program__baslik' }, dil(o, 'baslik')),
          dil(o, 'aciklama') ? h('p', { class: 'program__aciklama' }, dil(o, 'aciklama')) : null)))));
  }));
  liste.hidden = false;
  for (const e of bos) e.hidden = true;
  metinYaz('.page-header .lead', DIL === 'en'
    ? 'Panels, presentations and sessions at Giresun EXPO.'
    : 'Giresun EXPO panel, sunum ve oturum programı.');
}

baslat().catch((e) => console.warn('[GE] Site verisi uygulanamadı:', e && e.message));
