#!/usr/bin/env node
/**
 * Ortak header/footer sapma denetleyicisi.
 *
 * Bu projede build adimi yok; header ve footer markup'i her HTML dosyasinda
 * tekrarlanir. Bu arac, tekrarlarin birbirinden ayrismadigini dogrular.
 *
 *   node tools/check-partials.mjs
 *
 * TR ve EN gruplari AYRI karsilastirilir (metinler ve yollar dile gore farkli).
 * Sayfadan sayfaya degismesi MESRU olan farklar normalize edilir:
 *   - aktif nav linkindeki is-active / aria-current
 *   - dil degistirici ve hreflang hedefleri
 *
 * Fark bulunursa cikis kodu 1 olur.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Ortak header/footer tasimayan sayfalar */
const SKIP = [
  '404.html',              // stili gomulu, sadelestirilmis header
  'docs/ui-kit.html',      // bilesen vitrini
  'davetiye.html',         // gizli davetiye uretici (menude yok)
];
const SKIP_DIRS = ['admin', 'node_modules', '.git', 'assets', 'data', 'supabase', 'tools'];

/* --- HTML dosyalarini topla --- */
function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = relative(ROOT, full).split('\\').join('/');
    if (statSync(full).isDirectory()) {
      if (SKIP_DIRS.includes(entry)) continue;
      walk(full, acc);
    } else if (entry.endsWith('.html') && !SKIP.includes(rel)) {
      acc.push(rel);
    }
  }
  return acc;
}

/* --- blok cikar --- */
const extract = (html, tag, cls) => {
  const re = new RegExp(`<${tag}[^>]*class="[^"]*${cls}[^"]*"[\\s\\S]*?</${tag}>`);
  const m = html.match(re);
  return m ? m[0] : null;
};

/* --- sayfaya ozgu mesru farklari normalize et --- */
const normalize = (s) =>
  s
    .replace(/\s*\bis-active\b/g, '')                       // aktif nav linki
    .replace(/\s*aria-current="page"/g, '')                 // aktif nav linki
    .replace(/(class="lang-switch__link)[^"]*(")/g, '$1$2') // dil degistirici aktif durumu
    .replace(/(<a[^>]*class="lang-switch__link"[^>]*href=")[^"]*(")/g, '$1@$2') // dil hedefi
    .replace(/\s+/g, ' ')
    .trim();

/* --- gruplara ayir --- */
const files = walk(ROOT).sort();
const groups = { TR: [], EN: [] };
for (const f of files) (f.startsWith('en/') ? groups.EN : groups.TR).push(f);

let problems = 0;
console.log(`\n${files.length} HTML dosyasi tarandi (admin ve ui-kit haric).\n`);

for (const [name, list] of Object.entries(groups)) {
  if (list.length === 0) { console.log(`${name}: dosya yok, atlandi.`); continue; }
  console.log(`--- ${name} grubu (${list.length} dosya) ---`);

  for (const part of [
    { label: 'header', tag: 'header', cls: 'site-header' },
    { label: 'footer', tag: 'footer', cls: 'site-footer' },
  ]) {
    const seen = new Map();   // normalize edilmis icerik -> [dosyalar]
    const missing = [];

    for (const f of list) {
      const html = readFileSync(join(ROOT, f), 'utf8');
      const block = extract(html, part.tag, part.cls);
      if (!block) { missing.push(f); continue; }
      const key = normalize(block);
      if (!seen.has(key)) seen.set(key, []);
      seen.get(key).push(f);
    }

    if (missing.length) {
      problems++;
      console.log(`  ${part.label}: ${missing.length} dosyada BULUNAMADI -> ${missing.join(', ')}`);
    }

    if (seen.size === 0) continue;
    if (seen.size === 1) {
      const n = [...seen.values()][0].length;
      console.log(`  ${part.label}: ${n}/${list.length} aynı  OK`);
    } else {
      problems++;
      // en kalabalik varyant "dogru" kabul edilir, digerleri raporlanir
      const variants = [...seen.entries()].sort((a, b) => b[1].length - a[1].length);
      const [refKey, refFiles] = variants[0];
      console.log(`  ${part.label}: ${seen.size} FARKLI varyant`);
      console.log(`     referans (${refFiles.length} dosya): ${refFiles.slice(0, 3).join(', ')}${refFiles.length > 3 ? ' …' : ''}`);
      for (const [key, fs] of variants.slice(1)) {
        console.log(`     SAPAN (${fs.length}): ${fs.join(', ')}`);
        // ilk farkli karakterin etrafini goster
        let i = 0;
        while (i < key.length && i < refKey.length && key[i] === refKey[i]) i++;
        const ctx = (s) => s.slice(Math.max(0, i - 50), i + 70).replace(/\s+/g, ' ');
        console.log(`       beklenen: …${ctx(refKey)}…`);
        console.log(`       bulunan : …${ctx(key)}…`);
      }
    }
  }
  console.log('');
}

if (problems > 0) {
  console.error(`HATA: ${problems} sapma bulundu. Ortak markup tüm dosyalarda aynı olmalı.`);
  process.exit(1);
}
console.log('Tüm dosyalarda header ve footer tutarlı.');
