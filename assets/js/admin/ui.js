/* ==========================================================================
   Yönetim paneli — ortak arayüz katmanı
   assets/js/admin/ui.js

   Public sitede header/footer her dosyada tekrarlanıyor ve sapma denetleyicisi
   (tools/check-partials.mjs) gerekiyor. Panelde bu sorun hiç doğmasın diye
   kabuk TEK KAYNAKTAN, buradan üretiliyor. Panel zaten JS olmadan çalışmaz.

   XSS: Hiçbir yerde innerHTML kullanılmaz. Metin daima textContent'tir.
   ========================================================================== */

/* --- DOM yardımcıları ----------------------------------------------------- */

/**
 * Güvenli eleman üreteci.
 *   el('div', {class: 'x'}, 'metin', el('span', null, 'iç'))
 * Metin çocuklar textContent olarak eklenir; asla ayrıştırılmaz.
 */
export function el(etiket, ozellik, ...cocuklar) {
  const d = document.createElement(etiket);
  if (ozellik) {
    for (const [k, v] of Object.entries(ozellik)) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') d.className = v;
      else if (k === 'dataset') Object.assign(d.dataset, v);
      else if (k === 'html') throw new Error('innerHTML yasak — metin için çocuk düğüm verin');
      else if (k.startsWith('on') && typeof v === 'function') d.addEventListener(k.slice(2), v);
      else if (k === 'hidden' || k === 'disabled' || k === 'checked' || k === 'required') d[k] = !!v;
      else d.setAttribute(k, v);
    }
  }
  for (const c of cocuklar.flat()) {
    if (c === null || c === undefined || c === false) continue;
    d.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return d;
}

/** Lucide ikonu — inline SVG, sayfaya gömülür (CDN yok). */
export function ikon(ad, sinif = 'yan__ikon') {
  const yollar = IKONLAR[ad] || IKONLAR.nokta;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.75');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  if (sinif) svg.setAttribute('class', sinif);
  for (const d of yollar) {
    const p = document.createElementNS(ns, d.t || 'path');
    for (const [k, v] of Object.entries(d)) { if (k !== 't') p.setAttribute(k, v); }
    svg.append(p);
  }
  return svg;
}

/* Lucide v1.47.0, stroke 1.75 — yalnızca panelde kullanılanlar */
const IKONLAR = {
  pano:      [{ d: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z' }],
  stant:     [{ d: 'M3 21h18M5 21V10M19 21V10M3 10l2-6h14l2 6H3M9 21v-6h6v6' }],
  ziyaretci: [{ d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }, { t: 'circle', cx: '9', cy: '7', r: '4' }, { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }],
  mesaj:     [{ d: 'M4 4h16v12H5.2L4 17.5V4Z' }],
  katilimci: [{ d: 'M3 21V7l9-4 9 4v14M9 21v-6h6v6' }, { t: 'circle', cx: '12', cy: '11', r: '1.5' }],
  ayar:      [{ t: 'circle', cx: '12', cy: '12', r: '3' }, { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z' }],
  sayfa:     [{ d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }, { d: 'M14 2v6h6M9 13h6M9 17h6' }],
  kullanici: [{ d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }, { t: 'circle', cx: '12', cy: '7', r: '4' }],
  gunluk:    [{ d: 'M12 8v4l3 2' }, { t: 'circle', cx: '12', cy: '12', r: '9' }],
  cikis:     [{ d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9' }],
  menu:      [{ d: 'M3 6h18M3 12h18M3 18h18' }],
  kapat:     [{ d: 'M18 6 6 18M6 6l12 12' }],
  bos:       [{ d: 'M21 8v13H3V8M1 3h22v5H1zM10 12h4' }],
  hata:      [{ t: 'circle', cx: '12', cy: '12', r: '9' }, { d: 'M12 8v4M12 16h.01' }],
  indir:     [{ d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3' }],
  nokta:     [{ t: 'circle', cx: '12', cy: '12', r: '3' }]
};


/* --- Kabuk (yan menü + üst çubuk) ---------------------------------------- */

/**
 * Menü tanımı — TEK KAYNAK. Sırası kullanıcının belirlediği öncelik sırası.
 * `rol: 'owner'` olanlar yalnızca owner'a gösterilir.
 */
export const MENU = [
  { grup: 'Genel', ogeler: [
    { id: 'pano', ad: 'Pano', dosya: 'pano.html', ikon: 'pano' }
  ]},
  { grup: 'Başvurular', ogeler: [
    { id: 'stant',     ad: 'Stant Başvuruları', dosya: 'stant-basvurulari.html', ikon: 'stant',     sayac: 'stant' },
    { id: 'ziyaretci', ad: 'Ziyaretçi Kayıtları', dosya: 'ziyaretci-kayitlari.html', ikon: 'ziyaretci' },
    { id: 'mesaj',     ad: 'Mesajlar',          dosya: 'mesajlar.html',          ikon: 'mesaj',     sayac: 'mesaj' }
  ]},
  { grup: 'İçerik', ogeler: [
    { id: 'katilimci', ad: 'Katılımcılar', dosya: 'katilimcilar.html', ikon: 'katilimci' },
    { id: 'ayar',      ad: 'Site Ayarları', dosya: 'ayarlar.html',     ikon: 'ayar' },
    { id: 'sayfa',     ad: 'Diğer İçerik',  dosya: 'icerik.html',      ikon: 'sayfa' }
  ]},
  { grup: 'Yönetim', ogeler: [
    { id: 'kullanici', ad: 'Kullanıcılar',   dosya: 'kullanicilar.html', ikon: 'kullanici', rol: 'owner' },
    { id: 'gunluk',    ad: 'Etkinlik Günlüğü', dosya: 'gunluk.html',     ikon: 'gunluk' }
  ]}
];

/**
 * Sayfanın kabuğunu kurar. <body class="yonetim"> içine yan menü ve üst çubuk
 * ekler, içerik alanını döndürür.
 *
 * @param {{aktif: string, baslik: string, oturum: object}} ayar
 * @returns {HTMLElement} içerik alanı
 */
export function kabukKur({ aktif, baslik, oturum }) {
  document.body.classList.add('yonetim');

  /* --- Yan menü --- */
  const liste = [];
  for (const g of MENU) {
    const ogeler = g.ogeler.filter((o) => !o.rol || o.rol === oturum.admin.role);
    if (!ogeler.length) continue;

    liste.push(el('div', { class: 'yan__grup' },
      el('p', { class: 'yan__grup-baslik' }, g.grup),
      el('ul', { class: 'yan__liste' },
        ogeler.map((o) => el('li', null,
          el('a', {
            class: 'yan__link' + (o.id === aktif ? ' is-active' : ''),
            href: o.dosya,
            'aria-current': o.id === aktif ? 'page' : null
          },
            ikon(o.ikon),
            el('span', null, o.ad),
            o.sayac ? el('span', { class: 'yan__sayac', hidden: true, dataset: { sayac: o.sayac } }) : null
          )
        ))
      )
    ));
  }

  const yan = el('aside', { class: 'yan', id: 'yan-menu' },
    el('div', { class: 'yan__marka' },
      el('span', { class: 'yan__logo' },
        el('img', { src: '../assets/img/brand/giresun-expo-logo-tarihsiz.png',
                    alt: 'Giresun EXPO', width: '104', height: '35' })),
      el('span', { class: 'yan__etiket' }, 'Yönetim')
    ),
    el('nav', { class: 'yan__menu', 'aria-label': 'Panel menüsü' }, liste)
  );

  /* --- Üst çubuk --- */
  const menuBtn = el('button', {
    class: 'ust__menu-btn', type: 'button',
    'aria-label': 'Menüyü aç', 'aria-expanded': 'false', 'aria-controls': 'yan-menu'
  }, ikon('menu', ''));

  menuBtn.addEventListener('click', () => {
    const acik = yan.classList.toggle('is-acik');
    menuBtn.setAttribute('aria-expanded', String(acik));
    menuBtn.setAttribute('aria-label', acik ? 'Menüyü kapat' : 'Menüyü aç');
  });

  const cikisBtn = el('button', { class: 'btn btn--ghost btn--sm', type: 'button' },
    ikon('cikis', ''), el('span', null, 'Çıkış'));
  cikisBtn.addEventListener('click', async () => {
    const { cikisYap } = await import('./auth.js');
    cikisYap();
  });

  const ust = el('header', { class: 'ust' },
    menuBtn,
    el('h1', { class: 'ust__baslik' }, baslik),
    el('div', { class: 'ust__sag' },
      el('span', { class: 'ust__kullanici' },
        el('span', { class: 'ust__eposta' }, oturum.admin.email),
        el('span', { class: 'ust__rol' }, oturum.admin.role === 'owner' ? 'Sahip' : 'Editör')
      ),
      cikisBtn
    )
  );

  const icerik = el('div', { class: 'yonetim__icerik', id: 'main' });
  const ana = el('div', { class: 'yonetim__ana' }, ust, icerik);

  document.body.prepend(yan, ana);
  document.title = baslik + ' — Giresun EXPO Yönetim';

  /* Mobilde menü dışına tıklayınca kapat */
  document.addEventListener('click', (e) => {
    if (!yan.classList.contains('is-acik')) return;
    if (yan.contains(e.target) || menuBtn.contains(e.target)) return;
    yan.classList.remove('is-acik');
    menuBtn.setAttribute('aria-expanded', 'false');
  });

  return icerik;
}

/** Yan menüdeki sayaç rozetini günceller (0 ise gizler). */
export function sayacGuncelle(ad, deger) {
  for (const e of document.querySelectorAll(`[data-sayac="${ad}"]`)) {
    e.textContent = deger > 99 ? '99+' : String(deger);
    e.hidden = !deger;
  }
}


/* --- Toast ---------------------------------------------------------------- */

let toastAlan = null;

export function toast(metin, tur = 'bilgi', sure = 4500) {
  if (!toastAlan) {
    toastAlan = el('div', { class: 'toast-alan', role: 'status', 'aria-live': 'polite' });
    document.body.append(toastAlan);
  }
  const kapat = el('button', { class: 'toast__kapat', type: 'button', 'aria-label': 'Kapat' },
    ikon('kapat', ''));
  const t = el('div', { class: 'toast toast--' + tur }, el('span', null, metin), kapat);
  const sil = () => { t.remove(); };
  kapat.addEventListener('click', sil);
  toastAlan.append(t);
  if (sure) setTimeout(sil, sure);
  return t;
}


/* --- Onay modalı ---------------------------------------------------------- */

/**
 * Geri alınamaz işlemler için onay ister. Focus kapanı içerir.
 * @returns {Promise<boolean>}
 */
export function onayla({ baslik, metin, onayMetni = 'Evet, devam et', tehlike = false }) {
  return new Promise((coz) => {
    const oncekiOdak = document.activeElement;

    const iptalBtn = el('button', { class: 'btn btn--ghost', type: 'button' }, 'Vazgeç');
    const tamamBtn = el('button', {
      class: 'btn ' + (tehlike ? 'btn--tehlike' : 'btn--primary'), type: 'button'
    }, onayMetni);

    const kutu = el('div', {
      class: 'onay', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'onay-baslik'
    },
      el('h2', { class: 'onay__baslik', id: 'onay-baslik' }, baslik),
      el('p', { class: 'onay__metin' }, metin),
      el('div', { class: 'onay__eylem' }, iptalBtn, tamamBtn)
    );
    const ortu = el('div', { class: 'onay-ortu' }, kutu);

    function bitir(sonuc) {
      document.removeEventListener('keydown', tus, true);
      ortu.remove();
      if (oncekiOdak && oncekiOdak.focus) oncekiOdak.focus();
      coz(sonuc);
    }

    function tus(e) {
      if (e.key === 'Escape') { e.preventDefault(); bitir(false); return; }
      if (e.key !== 'Tab') return;
      const odaklanabilir = kutu.querySelectorAll('button, [href], input, select, textarea');
      if (!odaklanabilir.length) return;
      const ilk = odaklanabilir[0], son = odaklanabilir[odaklanabilir.length - 1];
      if (e.shiftKey && document.activeElement === ilk) { e.preventDefault(); son.focus(); }
      else if (!e.shiftKey && document.activeElement === son) { e.preventDefault(); ilk.focus(); }
    }

    iptalBtn.addEventListener('click', () => bitir(false));
    tamamBtn.addEventListener('click', () => bitir(true));
    ortu.addEventListener('click', (e) => { if (e.target === ortu) bitir(false); });
    document.addEventListener('keydown', tus, true);

    document.body.append(ortu);
    tamamBtn.focus();
  });
}


/* --- Durum / boş / hata kutuları ------------------------------------------ */

export function durumKutusu({ baslik, metin, tur = 'bos', eylem = null }) {
  return el('div', { class: 'durum-kutu' + (tur === 'hata' ? ' durum-kutu--hata' : '') },
    el('div', { class: 'durum-kutu__ikon' }, ikon(tur === 'hata' ? 'hata' : 'bos', '')),
    el('p', { class: 'durum-kutu__baslik' }, baslik),
    metin ? el('p', { class: 'durum-kutu__metin' }, metin) : null,
    eylem
  );
}

export function iskelet(satir = 5) {
  const k = el('div', { class: 'panel__govde', 'aria-busy': 'true', 'aria-label': 'Yükleniyor' });
  for (let i = 0; i < satir; i++) {
    k.append(el('div', { class: 'iskelet iskelet--satir', style: `width:${60 + (i * 7) % 35}%` }));
  }
  return k;
}


/* --- Biçimlendirme -------------------------------------------------------- */

const TR = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit', month: '2-digit', year: 'numeric',
  hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul'
});
const TR_GUN = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Istanbul'
});

export function tarihSaat(iso) { return iso ? TR.format(new Date(iso)) : '—'; }
export function tarih(iso)     { return iso ? TR_GUN.format(new Date(iso)) : '—'; }

/** "3 dakika önce" biçiminde göreli zaman. */
export function gorece(iso) {
  if (!iso) return '—';
  const fark = (Date.now() - new Date(iso).getTime()) / 1000;
  if (fark < 60) return 'az önce';
  if (fark < 3600) return `${Math.floor(fark / 60)} dakika önce`;
  if (fark < 86400) return `${Math.floor(fark / 3600)} saat önce`;
  if (fark < 604800) return `${Math.floor(fark / 86400)} gün önce`;
  return tarih(iso);
}

export const DURUM_ETIKET = {
  new: 'Yeni',
  inceleniyor: 'İnceleniyor',
  onaylandi: 'Onaylandı',
  reddedildi: 'Reddedildi'
};

export function durumRozeti(durum) {
  const sinif = DURUM_ETIKET[durum] ? durum : 'notr';
  return el('span', { class: 'durum durum--' + sinif }, DURUM_ETIKET[durum] || durum || '—');
}


/* --- CSV dışa aktarma ----------------------------------------------------- */

/**
 * CSV indirir. Excel'in Türkçe karakterleri doğru okuması için UTF-8 BOM ve
 * noktalı virgül ayracı kullanılır (Excel TR yerel ayarının beklediği biçim).
 */
export function csvIndir(dosyaAdi, basliklar, satirlar) {
  const kacir = (v) => {
    if (v === null || v === undefined) return '';
    let s = String(v);
    // Formül enjeksiyonu: = + - @ ile başlayan hücreleri Excel formül sanır
    if (/^[=+\-@]/.test(s)) s = "'" + s;
    return /[";\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };

  const metin = [basliklar, ...satirlar]
    .map((s) => s.map(kacir).join(';'))
    .join('\r\n');

  const blob = new Blob(['﻿' + metin], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = el('a', { href: url, download: dosyaAdi });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Dosya adı için bugünün tarihi: 2026-09-22 */
export function bugun() {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'),
          String(d.getDate()).padStart(2, '0')].join('-');
}


/* --- Kaydedilmemiş değişiklik uyarısı ------------------------------------- */

let kirli = false;

export function kirliIsaretle(durum = true) {
  kirli = durum;
  document.body.classList.toggle('is-kirli', durum);
}
export function kirliMi() { return kirli; }

window.addEventListener('beforeunload', (e) => {
  if (!kirli) return;
  e.preventDefault();
  e.returnValue = '';
});
