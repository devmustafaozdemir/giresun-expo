#!/usr/bin/env node
/**
 * data/exhibitors.json -> katilimcilar.html ve en/exhibitors.html icindeki
 * kart listesini ve sektor <option>'larini uretir.
 *
 *   node tools/build-exhibitors.mjs
 *
 * NEDEN STATIK HTML?
 * 86 kart JS ile render edilseydi arama motorlari ve JS'siz tarayicilar
 * firma adlarini goremezdi. Kartlar statik basilir; JS yalnizca var olan
 * DOM dugumlerini gizleyip gosterir. Boylece SEO ve dayaniklilik korunur.
 *
 * Sayfadaki su isaretciler arasini degistirir:
 *   <!-- exhibitors:start --> ... <!-- exhibitors:end -->
 *   <!-- sectors:start --> ... <!-- sectors:end -->
 *
 * C asamasinda Supabase birincil kaynak olunca bu script yerine data.js
 * devreye girecek; JSON yedek katman olarak kalacak.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const db = JSON.parse(readFileSync(join(ROOT, 'data/exhibitors.json'), 'utf8'));

/* --- Turkce duyarli yardimcilar ------------------------------------------ */

/** Turkce buyuk harf: i -> I DEGIL, i -> İ */
const trUpper = (s) => s.replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase();

/** Arama icin ASCII'ye indirger: "Sağlık" -> "saglik" */
const fold = (s) =>
  s.toLowerCase()
    .replace(/ı/g, 'i').replace(/İ/g, 'i').replace(/i̇/g, 'i')
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ö/g, 'o').replace(/ç/g, 'c')
    .normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Firma adindan monogram: ilk iki anlamli kelimenin bas harfi */
const ATLA = new Set(['ve', 'ile', 'the', 'of', 'a.ş.', 'as', 'ltd.', 'ltd', 'şti.', 'sti']);
function monogram(name) {
  const words = name
    .replace(/\(.*?\)/g, ' ')            // parantez icini at
    .split(/[\s\-–]+/)
    .filter((w) => w && !ATLA.has(w.toLowerCase()) && /[a-zçğıöşüA-ZÇĞİÖŞÜ0-9]/.test(w));
  if (!words.length) return '?';
  if (words.length === 1) return trUpper(words[0].slice(0, 2));
  return trUpper(words[0][0] + words[1][0]);
}

/** Stant numarasini dogal siralama icin anahtara cevirir: "A3-10" -> "A 003 010" */
function standKey(stand) {
  const m = String(stand).match(/^([A-Z])(\d*)-?(\d*)/i);
  if (!m) return String(stand);
  return `${m[1].toUpperCase()} ${String(m[2] || '0').padStart(3, '0')} ${String(m[3] || '0').padStart(3, '0')}`;
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/* --- Kart uretimi -------------------------------------------------------- */

const sectorsById = Object.fromEntries(db.sectors.map((s) => [s.id, s]));

function card(ex, lang, depth) {
  const sector = sectorsById[ex.sector] || { name_tr: 'Diğer', name_en: 'Other' };
  const sectorName = lang === 'tr' ? sector.name_tr : sector.name_en;

  /* Logo varsa logo, yoksa baş harflerden monogram. */
  let gorsel;
  if (ex.logo) {
    gorsel = `<div class="exhibitor__logo"><img src="${depth}${esc(ex.logo)}" alt="${esc(ex.name)}" loading="lazy" decoding="async"></div>`;
  } else {
    const variant = ex.sort % 2 === 0 ? ' monogram--navy' : '';
    gorsel = `<div class="monogram${variant}" aria-hidden="true">${esc(monogram(ex.name))}</div>`;
  }
  const search = fold(`${ex.name} ${sectorName} ${ex.stands.join(' ')}`);
  const featured = ex.in_booklet_logo_page ? ' data-featured="1"' : '';

  return `        <article class="card exhibitor" data-ex
                 data-search="${esc(search)}"
                 data-sector="${esc(ex.sector)}"
                 data-sector-name="${esc(fold(sectorName))}"
                 data-name="${esc(fold(ex.name))}"
                 data-stand="${esc(standKey(ex.stands[0]))}"${featured}>
          ${gorsel}
          <div class="card__body">
            <h3 class="card__title">${esc(ex.name)}</h3>
            <p class="card__text">${esc(sectorName)}</p>
            <p class="exhibitor__stand">${lang === 'tr' ? 'Stand No' : 'Stand No'}: <strong>${esc(ex.stands.join(', '))}</strong></p>
          </div>
        </article>`;
}

function sectorOptions(lang) {
  const used = new Set(db.exhibitors.map((e) => e.sector));
  return db.sectors
    .filter((s) => used.has(s.id))
    .map((s) => {
      const name = lang === 'tr' ? s.name_tr : s.name_en;
      const n = db.exhibitors.filter((e) => e.sector === s.id).length;
      return `            <option value="${esc(s.id)}">${esc(name)} (${n})</option>`;
    })
    .join('\n');
}

/* --- Dosyalara yaz ------------------------------------------------------- */

function replaceRegion(html, name, content) {
  const re = new RegExp(`(<!-- ${name}:start -->)[\\s\\S]*?(<!-- ${name}:end -->)`);
  if (!re.test(html)) throw new Error(`İşaretçi bulunamadı: ${name}`);
  return html.replace(re, `$1\n${content}\n$2`);
}

/* depth: sayfanin koke gore yolu — logo src'leri icin */
const targets = [
  { file: 'katilimcilar.html', lang: 'tr', depth: '' },
  { file: 'en/exhibitors.html', lang: 'en', depth: '../' },
];

/* Varsayilan sira: firma adina gore alfabetik (Turkce) */
const sorted = db.exhibitors.filter((e) => e.published !== false)
  .sort((a, b) => a.name.localeCompare(b.name, 'tr'));

for (const t of targets) {
  const path = join(ROOT, t.file);
  let html;
  try { html = readFileSync(path, 'utf8'); }
  catch { console.log(`atlandı (dosya yok): ${t.file}`); continue; }

  html = replaceRegion(html, 'exhibitors', sorted.map((e) => card(e, t.lang, t.depth)).join('\n'));
  html = replaceRegion(html, 'sectors', sectorOptions(t.lang));
  writeFileSync(path, html);
  const logolu = db.exhibitors.filter((e) => e.logo).length;
  console.log(`${t.file.padEnd(22)} ${sorted.length} kart (${logolu} logolu, ${sorted.length - logolu} monogram), ${new Set(db.exhibitors.map(e => e.sector)).size} sektör`);
}

/* Monogram kontrolu: tekrar edenleri bildir (kart ayirt edilebilirligi icin) */
const monos = {};
for (const e of db.exhibitors) {
  const m = monogram(e.name);
  (monos[m] = monos[m] || []).push(e.name);
}
const dupes = Object.entries(monos).filter(([, v]) => v.length > 2);
if (dupes.length) {
  console.log('\nÜçten fazla tekrar eden monogramlar (kartlar yine de ada göre ayırt edilir):');
  for (const [m, names] of dupes) console.log(`  ${m}: ${names.length} firma`);
}
