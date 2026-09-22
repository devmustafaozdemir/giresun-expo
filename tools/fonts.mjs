// Google Fonts CSS'ini ayristir, latin + latin-ext woff2 dosyalarini indir,
// self-hosted @font-face blogunu uret.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = process.argv[2];
const OUTDIR = process.argv[3];
const WANT = new Set(['latin', 'latin-ext']);

const css = readFileSync(SRC, 'utf8');

// Her @font-face blogu, onundeki /* subset */ yorumuyla birlikte
const blocks = [...css.matchAll(/\/\*\s*([a-z0-9-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g)];

const pick = (body, prop) => {
  const m = body.match(new RegExp(prop + '\\s*:\\s*([^;]+);'));
  return m ? m[1].trim() : null;
};

const faces = [];
for (const [, subset, body] of blocks) {
  if (!WANT.has(subset)) continue;
  const family = pick(body, 'font-family').replace(/['"]/g, '');
  const weight = pick(body, 'font-weight');
  const style = pick(body, 'font-style');
  const range = pick(body, 'unicode-range');
  const url = body.match(/url\((https:[^)]+\.woff2)\)/)[1];
  const slug = family.toLowerCase().replace(/\s+/g, '-');
  const file = `${slug}-${weight}-${subset}.woff2`;
  faces.push({ family, weight, style, subset, range, url, file });
}

mkdirSync(OUTDIR, { recursive: true });

let total = 0;
for (const f of faces) {
  const res = await fetch(f.url);
  if (!res.ok) throw new Error(`${f.url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(join(OUTDIR, f.file), buf);
  f.size = buf.length;
  total += buf.length;
  console.log(`${f.file.padEnd(32)} ${String(buf.length).padStart(7)} B`);
}
console.log(`\nToplam: ${faces.length} dosya, ${(total / 1024).toFixed(1)} KB`);

// @font-face CSS'i uret (goreli yol: style.css assets/css/ icinde, fontlar assets/fonts/)
const out = faces.map(f => `@font-face {
  font-family: '${f.family}';
  font-style: ${f.style};
  font-weight: ${f.weight};
  font-display: swap;
  src: url('../fonts/${f.file}') format('woff2');
  unicode-range: ${f.range};
}`).join('\n\n');

writeFileSync(join(OUTDIR, '_fontface.css'), out + '\n');
console.log('\n@font-face CSS -> _fontface.css');

// Turkce karakterlerin hangi alt kumede oldugunu dogrula
const tr = { 'ğ': 0x011F, 'Ğ': 0x011E, 'ş': 0x015F, 'Ş': 0x015E, 'ı': 0x0131, 'İ': 0x0130, 'ç': 0x00E7, 'ö': 0x00F6, 'ü': 0x00FC };
const inRange = (cp, rangeStr) => rangeStr.split(',').some(part => {
  const t = part.trim().replace(/^U\+/i, '');
  if (t.includes('-')) { const [a, b] = t.split('-').map(x => parseInt(x, 16)); return cp >= a && cp <= b; }
  return parseInt(t, 16) === cp;
});
console.log('\nTurkce karakter kapsamasi (Inter 400):');
const probe = faces.filter(f => f.family === 'Inter' && f.weight === '400');
for (const [ch, cp] of Object.entries(tr)) {
  const hit = probe.filter(f => inRange(cp, f.range)).map(f => f.subset);
  console.log(`  ${ch}  U+${cp.toString(16).toUpperCase().padStart(4, '0')}  ${hit.length ? hit.join(', ') : 'KAPSANMIYOR'}`);
}
