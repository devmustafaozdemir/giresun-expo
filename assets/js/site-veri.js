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

   XSS: veritabanından gelen hiçbir değer innerHTML ile basılmaz.
   ========================================================================== */
import { siteAyarlari, katilimcilar, sss, sektorler } from './data.js';

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
  const [ayar, kat] = await Promise.all([siteAyarlari(), katilimcilar()]);
  const sayilar = sayilariHesapla(kat);
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
  }

  sssYukle();
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
    for (const l of $$('[data-ayar-telefon]')) { l.textContent = a.telefon; l.href = tel; }
  }
  for (const p of $$('[data-ayar-eposta]')) {
    if (a.eposta) {
      p.replaceChildren(h('a', { href: 'mailto:' + a.eposta }, a.eposta));
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

baslat().catch((e) => console.warn('[GE] Site verisi uygulanamadı:', e && e.message));
