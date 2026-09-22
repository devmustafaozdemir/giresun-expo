/**
 * Kitapcik logo sayfasindaki logolari kesip firma slug'iyla kaydeder.
 *
 *   node logo-uret.mjs <pdf> <sayfa> <hedef-klasor> [--yaz]
 *
 * --yaz verilmezse yalnizca rapor basar, dosya yazmaz.
 *
 * Eslestirme ELLE yapilmistir: her kutu, kontakt sayfasindan okunarak
 * dogru firmayla eslestirildi. Otomatik tahmin YOK — yanlis firmaya logo
 * koymak logosuz birakmaktan kotudur.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

const [, , PDF, SAYFA, HEDEF, ...bayrak] = process.argv;
const YAZ = bayrak.includes('--yaz');
const SCALE = 4;

/* --- Eslestirme tablosu -------------------------------------------------
   kutu: logo-cikar.mjs'in bulduğu bileşen numarası (1 tabanlı)
   bolge: elle verilmiş {x,y,w,h} — parçalanmış veya birleşmiş logolar için
   ------------------------------------------------------------------------ */
const ESLESME = [
  { kutu: 2,  slug: 'brosis-lazer-kesim' },
  { kutu: 3,  slug: 'ocak-kalip' },
  { kutu: 4,  slug: 'assu' },
  { kutu: 5,  slug: 'alfa-solar-enerji' },
  { kutu: 6,  slug: 'meksan-savunma-metal-sac-sanayi' },
  { kutu: 7,  slug: 'gunes-metal' },
  { kutu: 10, slug: 'asir-otomotiv' },
  { kutu: 11, slug: 'inovoltis-enerji-ve-elektronik' },
  { kutu: 12, slug: 'bi-ofis-buro-mobilyalari' },
  { kutu: 14, slug: 'teknik-fuarcilik' },
  { kutu: 15, slug: 'tusaser-su-aritma-sistemleri' },
  { kutu: 16, slug: 'nok-grup-insaat' },
  { kutu: 17, slug: 'enes-civata' },
  { kutu: 18, slug: 'sms-grup-insaat' },
  { kutu: 19, slug: 'titanic-otel' },
  { kutu: 20, slug: 'toptantr' },
  { kutu: 21, slug: 'arstek-metal' },
  { kutu: 22, slug: 'hyundai-kaynak' },
  { kutu: 23, slug: 'karanci-kaucuk' },
  { kutu: 25, slug: 'tuna-aluminyum' },
  { kutu: 26, slug: 'mir-water' },
  { kutu: 27, slug: 'izya-ic-mimarlik' },
  { kutu: 28, slug: 'kocel-celik-esya' },
  { kutu: 29, slug: 'alpi-dis' },
  { kutu: 35, slug: 'abramak-bilgi-teknolojileri' },
  { kutu: 41, slug: 'endow-kapi-ve-pencere-aksesuarlari' },
  { kutu: 50, slug: 'bahat-saglik-grubu' },
  { kutu: 52, slug: 'gen-yatirim' },
  { kutu: 53, slug: 'yunus-gemi-insaat' },
  { kutu: 54, slug: 'crk-otomotiv' },
  { kutu: 55, slug: 'ates-neon-reklamcilik' },
  { kutu: 56, slug: 'kkg-elektrik-ve-aydinlatma' },
  { kutu: 57, slug: 'en-boya' },
  { kutu: 58, slug: 'turkuaz-gemi-insa' },
  { kutu: 59, slug: 'giresun-teknopark' },
  { kutu: 61, slug: 'aydin-grup-insaat' },
  { kutu: 62, slug: 'ozdemir-makina' },
  { kutu: 63, slug: 'eksen-kimya' },

  /* Parcalanmis / birlesmis olanlar — elle bolge */
  /* RESUN HOTEL: harfleri genis araliklı, 14 parcaya bolunmustu */
  { bolge: { x: 630, y: 1405, w: 445, h: 190 }, slug: 'resun-otel' },
  /* DAMAT + ayrac + TWEEN alt alta */
  { bolge: { x: 1850, y: 1450, w: 380, h: 205 }, slug: 'giteks-damat-tween' },
  /* SYVERA + "Fındık İşleme ve Lezzet Atölyesi" alt satiri */
  { bolge: { x: 968, y: 1968, w: 565, h: 200 }, slug: 'syvera-findik-isleme-ve-lezzet-atolyesi' },
  /* 49 numarali kutuda Fresa (ust) ve Abega Nuclear (alt) birlesmisti */
  { bolge: { x: 628, y: 1600, w: 415, h: 118 }, slug: 'fresa' },
  { bolge: { x: 628, y: 1755, w: 415, h: 215 }, slug: 'abega-nuclear-radyoaktif-ve-nukleer-hizmetler' },
];

/* Logo sayfasinda gorunup katilimci listesinde OLMAYAN markalar — atlanir */
const LISTEDE_YOK = { 8: 'Irmak', 24: 'FAR Elektrik', 40: 'Hız İnşaat' };
/* Logo olmayan ogeler */
const LOGO_DEGIL = { 1: 'GİRESUN EXPO logosu', 9: 'slogan', 13: 'başlık bandı', 48: 'ayraç çizgisi' };

/* --- Sayfayi render et --------------------------------------------------- */
const data = new Uint8Array(readFileSync(PDF));
const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
const page = await doc.getPage(parseInt(SAYFA, 10));
const vp = page.getViewport({ scale: SCALE });
const canvas = createCanvas(Math.ceil(vp.width), Math.ceil(vp.height));
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, canvas.width, canvas.height);
await page.render({ canvasContext: ctx, viewport: vp }).promise;

const liste = JSON.parse(readFileSync(join(process.argv[3] ? '.' : '.', 'logolar/_liste.json'), 'utf8'));
const kutuIndeks = new Map(liste.map((b) => [b.i, b]));

/* --- Beyaz kenarlari kirp ------------------------------------------------ */
function kirp(src, x, y, w, h) {
  const c0 = createCanvas(w, h);
  const g0 = c0.getContext('2d');
  g0.fillStyle = '#fff';
  g0.fillRect(0, 0, w, h);
  g0.drawImage(src, x, y, w, h, 0, 0, w, h);

  const d = g0.getImageData(0, 0, w, h).data;
  const E = 244;
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      const i = (py * w + px) * 4;
      if (d[i] < E || d[i + 1] < E || d[i + 2] < E) {
        if (px < x0) x0 = px; if (px > x1) x1 = px;
        if (py < y0) y0 = py; if (py > y1) y1 = py;
      }
    }
  }
  if (x1 < 0) return null;
  return { c: c0, x0, y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

/* --- Uret ---------------------------------------------------------------- */
const HEDEF_UZUN = 440;      // uzun kenar (200px gosterim icin 2x)
const PAY_ORAN = 0.06;

mkdirSync(HEDEF, { recursive: true });
const sonuc = [];

for (const e of ESLESME) {
  let bx, by, bw, bh;
  if (e.bolge) {
    ({ x: bx, y: by, w: bw, h: bh } = e.bolge);
  } else {
    const b = kutuIndeks.get(e.kutu);
    if (!b) { console.log(`  ! kutu ${e.kutu} bulunamadı`); continue; }
    ({ x: bx, y: by, w: bw, h: bh } = b);
  }

  const t = kirp(canvas, bx, by, bw, bh);
  if (!t) { console.log(`  ! boş bölge: ${e.slug}`); continue; }

  const k = Math.min(HEDEF_UZUN / Math.max(t.w, t.h), 1);
  const iw = Math.round(t.w * k), ih = Math.round(t.h * k);
  const pay = Math.round(Math.max(iw, ih) * PAY_ORAN);
  const ow = iw + pay * 2, oh = ih + pay * 2;

  const out = createCanvas(ow, oh);
  const og = out.getContext('2d');
  og.fillStyle = '#fff';
  og.fillRect(0, 0, ow, oh);
  og.drawImage(t.c, t.x0, t.y0, t.w, t.h, pay, pay, iw, ih);

  const buf = out.toBuffer('image/png');
  if (YAZ) writeFileSync(join(HEDEF, `${e.slug}.png`), buf);
  sonuc.push({ slug: e.slug, w: ow, h: oh, kb: (buf.length / 1024).toFixed(1) });
}

console.log(`\n${sonuc.length} logo üretildi${YAZ ? '' : ' (KURU ÇALIŞMA — dosya yazılmadı)'}\n`);
console.log('slug                                              boyut       KB');
for (const s of sonuc) {
  console.log(`${s.slug.padEnd(50)} ${String(s.w).padStart(4)}x${String(s.h).padEnd(4)} ${s.kb.padStart(7)}`);
}
console.log('\nAtlananlar:');
for (const [k, v] of Object.entries(LOGO_DEGIL)) console.log(`  #${k} ${v} — logo değil`);
for (const [k, v] of Object.entries(LISTEDE_YOK)) console.log(`  #${k} ${v} — logo sayfasında var ama katılımcı listesinde YOK`);
