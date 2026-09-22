#!/usr/bin/env node
/**
 * Sayfa kabugu ureticisi — ortak header/footer/head icin TEK KAYNAK.
 *
 *   node tools/build-pages.mjs
 *
 * Build adimi DEGILDIR: urettigi HTML repoya commit'lenir ve site statik kalir.
 * Amaci, 26 sayfada elle tekrarlanan markup'in ayrismasini onlemek.
 * check-partials.mjs bu uretimin dogrulayicisidir.
 *
 * Iki kipte calisir:
 *   - Sayfa zaten varsa : yalnizca header, footer, cerez bandi ve <head>
 *                         degistirilir; <main> ICERIGI KORUNUR.
 *   - Sayfa yoksa       : tools/pages-content.mjs'teki main icerigiyle
 *                         sifirdan olusturulur.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PAGES, MAIN } from './pages-content.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://devmustafaozdemir.github.io/giresun-expo';

/* --- Menu: sirasi ve etiketleri ----------------------------------------- */
const NAV = ['index', 'about', 'exhibitors', 'visit', 'gallery', 'press', 'contact'];

const L = {
  tr: {
    skip: 'İçeriğe geç', menu: 'Menüyü aç/kapat', nav: 'Ana menü',
    logoAria: 'Giresun EXPO 2026 — ana sayfa',
    cta: 'Ziyaretçi Ön Kaydı', ctaKey: 'register',
    footAbout: 'Giresun\'un üretim, yatırım ve ticaret gücünü İstanbul\'da tanıtan iş dünyası buluşması.',
    slogan: 'Giresun İçin İş Birliği,<br>Türkiye İçin Güç Birliği',
    colA: 'Keşfet', colB: 'Katılım', colC: 'İletişim',
    addr: 'Yenikapı Etkinlik Alanı<br>Kennedy Caddesi No: 11/1<br>Fatih / İstanbul',
    phone: '0541 662 28 28',
    rights: 'Tüm hakları saklıdır.',
    cookie: 'Bu sitede yalnızca sitenin çalışması için gerekli çerezler kullanılır; takip veya reklam çerezi yoktur. Ayrıntı için',
    cookieLink: 'Çerez Politikası', cookieBtn: 'Anladım', cookieAria: 'Çerez bildirimi',
    partners: ['Giresun Vakfı', 'Giresun Federasyonu', 'ŞEBİNSİAD'],
  },
  en: {
    skip: 'Skip to content', menu: 'Toggle menu', nav: 'Main menu',
    logoAria: 'Giresun EXPO 2026 — home',
    cta: 'Visitor Pre-registration', ctaKey: 'register',
    footAbout: 'A business gathering presenting Giresun\'s production, investment and trade capacity in Istanbul.',
    slogan: 'Cooperation for Giresun,<br>Strength for Türkiye',
    colA: 'Explore', colB: 'Take Part', colC: 'Contact',
    addr: 'Yenikapı Event Area<br>Kennedy Caddesi No: 11/1<br>Fatih / Istanbul',
    phone: '+90 541 662 28 28',
    rights: 'All rights reserved.',
    cookie: 'This site uses only the cookies required for it to work; there are no tracking or advertising cookies. See the',
    cookieLink: 'Cookie Policy', cookieBtn: 'Got it', cookieAria: 'Cookie notice',
    partners: ['Giresun Foundation', 'Giresun Federation', 'ŞEBİNSİAD'],
  },
};

const P = (key, lang) => PAGES[key][lang].file;
const T = (key, lang) => PAGES[key][lang].nav;
const root = (lang) => (lang === 'en' ? '../' : '');

/* --- Header -------------------------------------------------------------- */
function header(key, lang) {
  const t = L[lang];
  const r = root(lang);
  const other = lang === 'tr' ? 'en' : 'tr';
  const selfHref = P(key, lang);
  const otherHref = lang === 'tr' ? 'en/' + P(key, 'en') : '../' + P(key, 'tr');

  const links = NAV.map((k) => {
    const active = k === key;
    const cls = active ? 'nav__link is-active' : 'nav__link';
    const cur = active ? ' aria-current="page"' : '';
    return `          <li><a class="${cls}" href="${P(k, lang)}"${cur}>${T(k, lang)}</a></li>`;
  }).join('\n');

  const trCls = lang === 'tr' ? 'lang-switch__link is-active' : 'lang-switch__link';
  const enCls = lang === 'en' ? 'lang-switch__link is-active' : 'lang-switch__link';
  const trHref = lang === 'tr' ? selfHref : otherHref;
  const enHref = lang === 'en' ? selfHref : otherHref;

  return `  <header class="site-header">
    <div class="container site-header__inner">
      <a class="logo" href="${P('index', lang)}" aria-label="${t.logoAria}">
        <img src="${r}assets/img/brand/giresun-expo-logo-tarihsiz.png" alt="Giresun EXPO" width="1206" height="703">
      </a>

      <button class="nav-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="${t.menu}">
        <span class="nav-toggle__box"></span>
      </button>

      <nav class="site-nav" id="site-nav" aria-label="${t.nav}">
        <ul class="nav-list">
${links}
        </ul>

        <div class="nav__actions">
          <div class="lang-switch">
            <a class="${trCls}" href="${trHref}" lang="tr" hreflang="tr">TR</a>
            <span class="lang-switch__sep" aria-hidden="true">|</span>
            <a class="${enCls}" href="${enHref}" lang="en" hreflang="en">EN</a>
          </div>
          <a class="btn btn--primary btn--sm" href="${P('register', lang)}">${t.cta}</a>
        </div>
      </nav>

      <div class="nav-overlay" aria-hidden="true"></div>
    </div>
  </header>`;
}

/* --- Footer -------------------------------------------------------------- */
function footer(lang) {
  const t = L[lang];
  const r = root(lang);
  const li = (k) => `          <li><a href="${P(k, lang)}">${T(k, lang)}</a></li>`;
  const partner = (file, alt) =>
    `      <div class="partner"><img src="${r}assets/img/partners/${file}" alt="${alt}" width="320" height="120" loading="lazy"></div>`;

  return `  <footer class="site-footer">
    <div class="container site-footer__grid">
      <div class="site-footer__brand">
        <span class="footer-logo">
          <img src="${r}assets/img/brand/giresun-expo-logo.png" alt="Giresun EXPO 2026" width="1207" height="703" loading="lazy">
        </span>
        <p class="site-footer__text">${t.footAbout}</p>
        <p class="site-footer__slogan">${t.slogan}</p>
      </div>

      <div>
        <h2 class="site-footer__title">${t.colA}</h2>
        <ul class="site-footer__list">
${li('index')}
${li('about')}
${li('exhibitors')}
${li('gallery')}
        </ul>
      </div>

      <div>
        <h2 class="site-footer__title">${t.colB}</h2>
        <ul class="site-footer__list">
${li('visit')}
${li('register')}
${li('stand')}
${li('press')}
        </ul>
      </div>

      <div>
        <h2 class="site-footer__title">${t.colC}</h2>
        <address>
          <p>${t.addr}</p>
          <p><a href="tel:+905416622828">${t.phone}</a></p>
        </address>
      </div>
    </div>

    <div class="container site-footer__partners">
${partner('giresun-vakfi.png', t.partners[0])}
${partner('giresun-federasyonu.png', t.partners[1])}
${partner('sebinsiad.png', t.partners[2])}
    </div>

    <div class="container site-footer__bottom">
      <p>&copy; <span id="year">2026</span> Giresun EXPO. ${t.rights}</p>
      <p>
        <a href="${P('kvkk', lang)}">${T('kvkk', lang)}</a> ·
        <a href="${P('cookies', lang)}">${T('cookies', lang)}</a> ·
        <a href="${P('privacy', lang)}">${T('privacy', lang)}</a>
      </p>
    </div>
  </footer>`;
}

/* --- Cerez bandi --------------------------------------------------------- */
function cookieBar(lang) {
  const t = L[lang];
  return `  <div class="cookie-bar" id="cookie-bar" role="region" aria-label="${t.cookieAria}" hidden>
    <div class="container cookie-bar__inner">
      <p>${t.cookie} <a href="${P('cookies', lang)}">${t.cookieLink}</a>.</p>
      <button class="btn btn--light btn--sm" type="button" data-cookie-accept>${t.cookieBtn}</button>
    </div>
  </div>`;
}

/* --- <head> -------------------------------------------------------------- */
function head(key, lang) {
  const p = PAGES[key][lang];
  const r = root(lang);
  const trUrl = `${SITE}/${PAGES[key].tr.file === 'index.html' ? '' : PAGES[key].tr.file}`;
  const enUrl = `${SITE}/en/${PAGES[key].en.file === 'index.html' ? '' : PAGES[key].en.file}`;
  const selfUrl = lang === 'tr' ? trUrl : enUrl;
  const extra = (p.scripts || []).map((s) => `  <script src="${r}assets/js/${s}" defer></script>`).join('\n');
  const noindex = p.noindex ? '\n  <meta name="robots" content="noindex, nofollow">' : '';

  return `<!doctype html>
<html lang="${lang}" data-root="${r}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script>document.documentElement.classList.add('js')</script>${noindex}

  <title>${p.title}</title>
  <meta name="description" content="${p.desc}">

  <link rel="canonical" href="${selfUrl}">
  <link rel="alternate" hreflang="tr" href="${trUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="x-default" href="${trUrl}">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Giresun EXPO 2026">
  <meta property="og:locale" content="${lang === 'tr' ? 'tr_TR' : 'en_US'}">
  <meta property="og:title" content="${p.title}">
  <meta property="og:description" content="${p.ogDesc || p.desc}">
  <meta property="og:url" content="${selfUrl}">
  <meta property="og:image" content="${SITE}/assets/img/brand/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" type="image/png" sizes="32x32" href="${r}assets/img/brand/favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="${r}assets/img/brand/favicon-180.png">

  <link rel="preload" as="font" type="font/woff2" href="${r}assets/fonts/inter-var-latin-ext.woff2" crossorigin>
  <link rel="preload" as="font" type="font/woff2" href="${r}assets/fonts/poppins-700-latin-ext.woff2" crossorigin>
  <link rel="stylesheet" href="${r}assets/css/style.css">
  <script src="${r}assets/js/main.js" defer></script>
${extra}${p.jsonLd ? '\n' + p.jsonLd : ''}
</head>`;
}

/* --- Yazma ---------------------------------------------------------------
   İki kip:
     MAIN[key:lang] VARSA  -> sayfa tümüyle üretilir (içerik burada tanımlı)
     MAIN[key:lang] YOKSA  -> yalnızca kabuk tazelenir, <main> korunur
                              (içeriği elle yazılmış sayfalar: ana sayfa,
                               katılımcılar, ziyaret bilgileri)
   Böylece header/footer tek kaynaktan gelirken elle yazılmış içerik ezilmez.
   -------------------------------------------------------------------------- */

/** Bloğu satır başındaki girintisiyle birlikte değiştirir (girinti ikilenmesin) */
const replaceBlock = (html, tag, cls, block, zorunlu = true) => {
  const re = new RegExp(`^[ \\t]*<${tag}[^>]*class="[^"]*${cls}[^"]*"[\\s\\S]*?</${tag}>`, 'm');
  if (!re.test(html)) {
    if (zorunlu) throw new Error(`${tag}.${cls} bulunamadı`);
    return null;
  }
  return html.replace(re, block);
};

const fullPage = (key, lang, main) => `${head(key, lang)}
<body>
  <a class="skip-link" href="#main">${L[lang].skip}</a>

${header(key, lang)}

  <main id="main">
${main}
  </main>

${footer(lang)}

${cookieBar(lang)}
</body>
</html>
`;

let uretildi = 0, tazelendi = 0;

for (const key of Object.keys(PAGES)) {
  for (const lang of ['tr', 'en']) {
    const rel = (lang === 'en' ? 'en/' : '') + P(key, lang);
    const path = join(ROOT, rel);
    const main = MAIN[`${key}:${lang}`];

    if (main) {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, fullPage(key, lang, main));
      uretildi++;
      continue;
    }

    if (!existsSync(path)) {
      console.log(`  ! içerik tanımlı değil ve dosya yok, atlandı: ${rel}`);
      continue;
    }

    let html = readFileSync(path, 'utf8');
    html = html.replace(/^[\s\S]*?<\/head>/, head(key, lang));
    html = replaceBlock(html, 'header', 'site-header', header(key, lang));
    html = replaceBlock(html, 'footer', 'site-footer', footer(lang));

    /* Çerez bandı yoksa </body> öncesine eklenir */
    const withBar = replaceBlock(html, 'div', 'cookie-bar', cookieBar(lang), false);
    html = withBar !== null ? withBar : html.replace('</body>', `${cookieBar(lang)}\n</body>`);

    writeFileSync(path, html);
    tazelendi++;
  }
}

/* --- sitemap.xml + robots.txt -------------------------------------------
   Tüm URL'ler tek bir SITE sabitinden üretilir; alan adı değişirse yalnızca
   o sabit güncellenir (docs/acik-sorular.md #29).
   -------------------------------------------------------------------------- */
const url = (key, lang) => {
  const f = P(key, lang);
  const base = lang === 'en' ? `${SITE}/en/` : `${SITE}/`;
  return f === 'index.html' ? base : base + f;
};

const entries = [];
for (const key of Object.keys(PAGES)) {
  for (const lang of ['tr', 'en']) {
    const alts = ['tr', 'en']
      .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${url(key, l)}"/>`)
      .join('\n');
    entries.push(`  <url>
    <loc>${url(key, lang)}</loc>
${alts}
    <xhtml:link rel="alternate" hreflang="x-default" href="${url(key, 'tr')}"/>
    <changefreq>weekly</changefreq>
    <priority>${key === 'index' ? '1.0' : key === 'exhibitors' || key === 'visit' ? '0.9' : '0.6'}</priority>
  </url>`);
  }
}

writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`);

writeFileSync(join(ROOT, 'robots.txt'), `# Giresun EXPO 2026
User-agent: *
Allow: /

# Yönetim paneli ve iç dokümanlar dizine girmez
Disallow: /giresun-expo/admin/
Disallow: /giresun-expo/docs/

Sitemap: ${SITE}/sitemap.xml
`);

console.log(`Tümüyle üretilen: ${uretildi} sayfa · Kabuğu tazelenen: ${tazelendi} sayfa`);
console.log(`sitemap.xml: ${entries.length} URL · robots.txt yazıldı`);
console.log('Doğrulama: node tools/check-partials.mjs && node tools/check-content.mjs');
