/**
 * Kitapcigin "KATILIMCI FIRMALARIMIZDAN BAZILARI" sayfasini yuksek cozunurlukte
 * render eder, beyaz zemindeki logolari otomatik tespit edip tek tek PNG olarak
 * keser.
 *
 *   node logo-cikar.mjs <pdf> <sayfa> <cikti-klasoru> [olcek]
 *
 * Yontem:
 *   1. pdf.js ile sayfayi <olcek> katinda canvas'a cizer
 *   2. Beyaz olmayan pikselleri isaretler (esik ile)
 *   3. Yatay/dikey genisletme (dilate) ile ayni logonun parcalarini birlestirir
 *   4. Baglantili bilesenleri bulur, kucuk gurultuyu eler
 *   5. Her kutuyu ORIJINAL (genisletilmemis) goruntuden pay birakarak keser
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

const [, , PDF, SAYFA, OUT, OLCEK = '4'] = process.argv;
const scale = parseFloat(OLCEK);
mkdirSync(OUT, { recursive: true });

/* --- 1) Sayfayi render et --------------------------------------------- */
const data = new Uint8Array(readFileSync(PDF));
const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
const page = await doc.getPage(parseInt(SAYFA, 10));
const vp = page.getViewport({ scale });

const canvas = createCanvas(Math.ceil(vp.width), Math.ceil(vp.height));
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, canvas.width, canvas.height);
await page.render({ canvasContext: ctx, viewport: vp }).promise;

const W = canvas.width, H = canvas.height;
console.log(`Sayfa ${SAYFA} render edildi: ${W} x ${H} (ölçek ${scale})`);
writeFileSync(join(OUT, '_sayfa.png'), canvas.toBuffer('image/png'));

/* --- 2) Mürekkep maskesi ---------------------------------------------- */
const img = ctx.getImageData(0, 0, W, H).data;
const ESIK = 238;                       // bunun altindaki her kanal "murekkep"
const ink = new Uint8Array(W * H);
for (let i = 0, p = 0; i < img.length; i += 4, p++) {
  if (img[i] < ESIK || img[i + 1] < ESIK || img[i + 2] < ESIK) ink[p] = 1;
}

/* --- 3) Genisletme: logo parcalarini birlestir ------------------------- */
/* Yatayda daha genis: harfler arasi bosluk yatayda daha buyuk */
const DX = Math.round(18 * scale / 4);
const DY = Math.round(10 * scale / 4);

const rowRun = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  let son = -1e9;
  for (let x = 0; x < W; x++) { if (ink[y * W + x]) son = x; if (x - son <= DX) rowRun[y * W + x] = 1; }
  son = 1e9;
  for (let x = W - 1; x >= 0; x--) { if (ink[y * W + x]) son = x; if (son - x <= DX) rowRun[y * W + x] = 1; }
}
const dil = new Uint8Array(W * H);
for (let x = 0; x < W; x++) {
  let son = -1e9;
  for (let y = 0; y < H; y++) { if (rowRun[y * W + x]) son = y; if (y - son <= DY) dil[y * W + x] = 1; }
  son = 1e9;
  for (let y = H - 1; y >= 0; y--) { if (rowRun[y * W + x]) son = y; if (son - y <= DY) dil[y * W + x] = 1; }
}

/* --- 4) Baglantili bilesenler (yineleme yok, yigin ile) ---------------- */
const etiket = new Int32Array(W * H).fill(-1);
const kutular = [];
const yigin = new Int32Array(W * H);

for (let s = 0; s < W * H; s++) {
  if (!dil[s] || etiket[s] !== -1) continue;
  const id = kutular.length;
  let tepe = 0;
  yigin[tepe++] = s;
  etiket[s] = id;
  let x0 = W, x1 = 0, y0 = H, y1 = 0, alan = 0, murekkep = 0;

  while (tepe > 0) {
    const p = yigin[--tepe];
    const px = p % W, py = (p / W) | 0;
    if (px < x0) x0 = px; if (px > x1) x1 = px;
    if (py < y0) y0 = py; if (py > y1) y1 = py;
    alan++;
    if (ink[p]) murekkep++;

    if (px > 0 && dil[p - 1] && etiket[p - 1] === -1) { etiket[p - 1] = id; yigin[tepe++] = p - 1; }
    if (px < W - 1 && dil[p + 1] && etiket[p + 1] === -1) { etiket[p + 1] = id; yigin[tepe++] = p + 1; }
    if (py > 0 && dil[p - W] && etiket[p - W] === -1) { etiket[p - W] = id; yigin[tepe++] = p - W; }
    if (py < H - 1 && dil[p + W] && etiket[p + W] === -1) { etiket[p + W] = id; yigin[tepe++] = p + W; }
  }
  kutular.push({ x0, y0, x1, y1, alan, murekkep });
}

/* --- 5) Ele: cok kucuk / cok buyuk / cok seyrek ------------------------ */
const MIN_W = 40 * scale / 4, MIN_H = 18 * scale / 4;
const secilen = kutular.filter((b) => {
  const w = b.x1 - b.x0 + 1, h = b.y1 - b.y0 + 1;
  if (w < MIN_W || h < MIN_H) return false;
  if (w > W * 0.75 && h > H * 0.5) return false;      // tum sayfa
  if (b.murekkep / (w * h) < 0.02) return false;      // neredeyse bos
  return true;
});

/* Okuma sirasi: satir satir, soldan saga */
const SATIR_TOL = 40 * scale / 4;
secilen.sort((a, b) => (Math.abs(a.y0 - b.y0) < SATIR_TOL ? a.x0 - b.x0 : a.y0 - b.y0));

console.log(`${kutular.length} bileşen bulundu, ${secilen.length} tanesi logo adayı.\n`);
console.log('#    konum (x,y)        boyut      doluluk');

const PAY = Math.round(6 * scale / 4);
const liste = [];

secilen.forEach((b, i) => {
  const x = Math.max(0, b.x0 - PAY), y = Math.max(0, b.y0 - PAY);
  const w = Math.min(W - x, b.x1 - b.x0 + 1 + PAY * 2);
  const h = Math.min(H - y, b.y1 - b.y0 + 1 + PAY * 2);

  const c = createCanvas(w, h);
  const cc = c.getContext('2d');
  cc.fillStyle = '#fff';
  cc.fillRect(0, 0, w, h);
  cc.drawImage(canvas, x, y, w, h, 0, 0, w, h);

  const ad = `logo-${String(i + 1).padStart(2, '0')}.png`;
  writeFileSync(join(OUT, ad), c.toBuffer('image/png'));
  liste.push({ i: i + 1, ad, x, y, w, h });
  console.log(
    `${String(i + 1).padStart(3)}  (${String(x).padStart(4)},${String(y).padStart(4)})  ` +
    `${String(w).padStart(4)}x${String(h).padEnd(4)}  ${(b.murekkep / (w * h) * 100).toFixed(0)}%`
  );
});

writeFileSync(join(OUT, '_liste.json'), JSON.stringify(liste, null, 2));
console.log(`\n${liste.length} logo kesildi -> ${OUT}`);
