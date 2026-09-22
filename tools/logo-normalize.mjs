#!/usr/bin/env node
/**
 * Dışarıdan gelen bir logoyu kart standardına getirir.
 *
 *   node tools/logo-normalize.mjs <kaynak.png> <hedef.png>
 *
 * Yapılanlar:
 *   - Saydamlık BEYAZ zemine yerleştirilir (kart zemini de beyaz)
 *   - Beyaz/boş kenarlar kırpılır
 *   - Uzun kenar 440px'e ölçeklenir (BÜYÜTMEZ — küçük kaynak küçük kalır)
 *   - %6 pay eklenir
 *
 * Böylece kitapçıktan çıkarılan logolarla dışarıdan gelenler aynı görünür.
 * Kaynak 440px'ten küçükse çıktı da küçük kalır; rapor bunu bildirir.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const [, , SRC, DST] = process.argv;
if (!SRC || !DST) { console.error('Kullanım: logo-normalize.mjs <kaynak> <hedef>'); process.exit(1); }

const HEDEF_UZUN = 440;
const PAY_ORAN = 0.06;
const ESIK = 244;

const img = await loadImage(readFileSync(SRC));

/* Beyaz zemine yerleştir */
const flat = createCanvas(img.width, img.height);
const fx = flat.getContext('2d');
fx.fillStyle = '#fff';
fx.fillRect(0, 0, img.width, img.height);
fx.drawImage(img, 0, 0);

/* Kenarları kırp */
const d = fx.getImageData(0, 0, img.width, img.height).data;
let x0 = img.width, y0 = img.height, x1 = -1, y1 = -1;
for (let y = 0; y < img.height; y++) {
  for (let x = 0; x < img.width; x++) {
    const i = (y * img.width + x) * 4;
    if (d[i] < ESIK || d[i + 1] < ESIK || d[i + 2] < ESIK) {
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
  }
}
if (x1 < 0) { console.error('Kaynak tamamen boş görünüyor.'); process.exit(1); }

const cw = x1 - x0 + 1, ch = y1 - y0 + 1;
const k = Math.min(HEDEF_UZUN / Math.max(cw, ch), 1);
const iw = Math.round(cw * k), ih = Math.round(ch * k);
const pay = Math.round(Math.max(iw, ih) * PAY_ORAN);

const out = createCanvas(iw + pay * 2, ih + pay * 2);
const og = out.getContext('2d');
og.fillStyle = '#fff';
og.fillRect(0, 0, out.width, out.height);
og.drawImage(flat, x0, y0, cw, ch, pay, pay, iw, ih);

writeFileSync(DST, out.toBuffer('image/png'));

const kucuk = k === 1 && Math.max(cw, ch) < HEDEF_UZUN;
console.log(
  `${SRC.split(/[\\/]/).pop()} (${img.width}x${img.height}) -> ` +
  `${DST.split(/[\\/]/).pop()} (${out.width}x${out.height})` +
  (kucuk ? `  ⚠ kaynak ${HEDEF_UZUN}px'ten küçük, büyütülmedi` : '')
);
