#!/usr/bin/env node
/**
 * WCAG kontrast denetimi.
 *
 * assets/css/style.css icindeki :root token'larini okur ve asagida tanimli
 * kombinasyonlari denetler. Gercekten kullanilan eslesmeler listelenmistir;
 * yeni bir renk eslesmesi eklendiginde buraya da eklenmelidir.
 *
 *   node tools/contrast.mjs
 *
 * Esikler (WCAG 2.1 AA):
 *   4.5  normal metin
 *   3.0  buyuk metin (>=24px veya >=18.66px bold) ve grafik/UI bileseni
 *
 * Bir kombinasyon kalirsa cikis kodu 1 olur.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(ROOT, 'assets/css/style.css'), 'utf8');

/* --- token'lari :root blogundan oku --- */
const rootBlock = css.match(/:root\s*\{([\s\S]*?)\n\}/)[1];
const tok = {};
for (const m of rootBlock.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9A-Fa-f]{3,8})\s*;/g)) {
  tok[m[1]] = m[2];
}

/* --- renk yardimcilari --- */
const hex2rgb = (h) => {
  let s = h.replace('#', '');
  if (s.length === 3) s = [...s].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
};
const lum = (hex) => {
  const c = hex2rgb(hex).map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (fg, bg) => {
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
};
/** yari saydam on plani zemine harmanla */
const over = (fg, alpha, bg) => {
  const f = hex2rgb(fg), b = hex2rgb(bg);
  const o = f.map((v, i) => Math.round(v * alpha + b[i] * (1 - alpha)));
  return '#' + o.map((v) => v.toString(16).padStart(2, '0')).join('');
};

const T = (name) => {
  const v = tok[`--color-${name}`];
  if (!v) throw new Error(`Token bulunamadi: --color-${name}`);
  return v;
};
const WHITE = '#FFFFFF';

/* --- denetlenecek kombinasyonlar ---------------------------------------- */
// [aciklama, on plan, arka plan, esik]
const checks = [
  ['--- Gövde metni ---'],
  ['ink / bg', T('ink'), T('bg'), 4.5],
  ['ink / surface', T('ink'), T('surface'), 4.5],
  ['ink / surface-2', T('ink'), T('surface-2'), 4.5],
  ['body / bg', T('body'), T('bg'), 4.5],
  ['body / surface', T('body'), T('surface'), 4.5],
  ['muted / bg', T('muted'), T('bg'), 4.5],
  ['muted / surface', T('muted'), T('surface'), 4.5],
  ['muted / surface-2', T('muted'), T('surface-2'), 4.5],

  ['--- Marka renkleri metin olarak ---'],
  ['primary / bg (link, başlık)', T('primary'), T('bg'), 4.5],
  ['primary / surface (hero h1)', T('primary'), T('surface'), 4.5],
  ['primary / primary-soft (monogram)', T('primary'), T('primary-soft'), 4.5],
  ['secondary / bg (eyebrow)', T('secondary'), T('bg'), 4.5],
  ['secondary / surface (hero slogan)', T('secondary'), T('surface'), 4.5],
  ['secondary / secondary-soft', T('secondary'), T('secondary-soft'), 4.5],
  ['accent-blue / bg', T('accent-blue'), T('bg'), 4.5],
  ['accent-earth / bg', T('accent-earth'), T('bg'), 4.5],

  ['--- Beyaz metin koyu zeminde ---'],
  ['beyaz / primary (btn, countdown)', WHITE, T('primary'), 4.5],
  ['beyaz / primary-dark (footer)', WHITE, T('primary-dark'), 4.5],
  ['beyaz / secondary (announce, hall)', WHITE, T('secondary'), 4.5],
  ['beyaz / secondary-dark', WHITE, T('secondary-dark'), 4.5],
  ['beyaz / ink (cookie bar)', WHITE, T('ink'), 4.5],
  ['beyaz / accent-blue (line-badge)', WHITE, T('accent-blue'), 4.5],
  ['beyaz / accent-earth (line-badge)', WHITE, T('accent-earth'), 4.5],

  ['--- Yarı saydam metinler ---'],
  ['footer metni %78 / primary-dark', over(WHITE, 0.78, T('primary-dark')), T('primary-dark'), 4.5],
  ['section--brand %86 / primary', over(WHITE, 0.86, T('primary')), T('primary'), 4.5],
  ['section--navy %86 / secondary', over(WHITE, 0.86, T('secondary')), T('secondary'), 4.5],
  ['countdown birim %85 / primary', over(WHITE, 0.85, T('primary')), T('primary'), 4.5],
  ['cookie-bar %85 / ink', over(WHITE, 0.85, T('ink')), T('ink'), 4.5],
  ['on-dark lead %82 / primary', over(WHITE, 0.82, T('primary')), T('primary'), 4.5],

  ['--- Durum rozetleri ---'],
  ['success / success-soft', T('success'), T('success-soft'), 4.5],
  ['warning / warning-soft', T('warning'), T('warning-soft'), 4.5],
  ['danger / danger-soft', T('danger'), T('danger-soft'), 4.5],
  ['info / info-soft', T('info'), T('info-soft'), 4.5],
  ['success / bg', T('success'), T('bg'), 4.5],
  ['warning / bg', T('warning'), T('bg'), 4.5],
  ['warning / surface', T('warning'), T('surface'), 4.5],
  ['danger / bg (form hata)', T('danger'), T('bg'), 4.5],
  ['info / bg', T('info'), T('bg'), 4.5],

  ['--- Etkileşimli öğe sınırları (WCAG 1.4.11, eşik 3.0) ---'],
  // Form alanlari ve hamburger butonu yalnizca bg veya surface uzerinde durur.
  ['border-strong / bg (form çerçevesi)', T('border-strong'), T('bg'), 3.0],
  ['border-strong / surface (form çerçevesi)', T('border-strong'), T('surface'), 3.0],
  ['secondary / bg (odak halkası)', T('secondary'), T('bg'), 3.0],
  ['primary / bg (aktif sekme çizgisi)', T('primary'), T('bg'), 3.0],
  ['primary / surface (aktif sekme çizgisi)', T('primary'), T('surface'), 3.0],
];

/**
 * Dekoratif renkler — WCAG 1.4.11 kapsamı DIŞINDA.
 * Bunlar bilgi taşımaz: logodaki halka motifi (görsel), arka plan deseni,
 * başlık altı ayraç çizgisi. Yine de raporlanır ki bir gün metin veya anlamlı
 * ikon için kullanılmaya kalkılırsa oranın düşüklüğü görünür olsun.
 *
 * KURAL: --color-accent-green ASLA metin veya anlamlı ikon rengi değildir.
 */
const decorative = [
  ['accent-green / bg', T('accent-green'), T('bg')],
  ['accent-green / surface', T('accent-green'), T('surface')],
  ['accent-green / primary', T('accent-green'), T('primary')],
  ['border-mid / bg (kesikli yer tutucu)', T('border-mid'), T('bg')],
  ['border / bg (kart çerçevesi)', T('border'), T('bg')],
];

/* --- calistir --- */
let fail = 0, pass = 0;
const w = 42;
console.log('');
console.log(`${'Kombinasyon'.padEnd(w)} ${'Ön'.padEnd(9)} ${'Arka'.padEnd(9)} ${'Oran'.padStart(6)}  Eşik  Sonuç`);
console.log('-'.repeat(w + 42));

for (const row of checks) {
  if (row.length === 1) { console.log(`\n${row[0]}`); continue; }
  const [label, fg, bg, min] = row;
  const r = ratio(fg, bg);
  const ok = r >= min;
  ok ? pass++ : fail++;
  const mark = ok ? 'GEÇER' : 'KALIR';
  console.log(
    `${label.padEnd(w)} ${fg.padEnd(9)} ${bg.padEnd(9)} ${r.toFixed(2).padStart(6)}  ${min.toFixed(1)}   ${mark}`
  );
}

console.log('\n--- Dekoratif (WCAG kapsamı dışı, yalnızca bilgi) ---');
for (const [label, fg, bg] of decorative) {
  console.log(`${label.padEnd(w)} ${fg.padEnd(9)} ${bg.padEnd(9)} ${ratio(fg, bg).toFixed(2).padStart(6)}    —   bilgi`);
}

console.log('');
console.log(`Sonuç: ${pass} geçti, ${fail} kaldı (toplam ${pass + fail} denetlenen kombinasyon).`);
if (fail > 0) {
  console.error('\nHATA: WCAG AA eşiğini geçemeyen kombinasyon var.');
  process.exit(1);
}
console.log('Tüm denetlenen kombinasyonlar WCAG AA eşiğini geçiyor.');
