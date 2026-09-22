// Kesilen logolari numarali bir izgarada tek PNG'de toplar (kontakt sayfasi).
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const DIR = process.argv[2];
const OUT = process.argv[3];
const SUT = parseInt(process.argv[4] || '8', 10);
const HUC = parseInt(process.argv[5] || '260', 10);
const ETK = 30;

const files = readdirSync(DIR).filter((f) => /^logo-\d+\.png$/.test(f))
  .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

const rows = Math.ceil(files.length / SUT);
const c = createCanvas(SUT * HUC, rows * (HUC + ETK));
const ctx = c.getContext('2d');
ctx.fillStyle = '#eef1ee';
ctx.fillRect(0, 0, c.width, c.height);

for (let i = 0; i < files.length; i++) {
  const img = await loadImage(join(DIR, files[i]));
  const cx = (i % SUT) * HUC, cy = Math.floor(i / SUT) * (HUC + ETK);

  ctx.fillStyle = '#fff';
  ctx.fillRect(cx + 4, cy + 4, HUC - 8, HUC - 8);

  const k = Math.min((HUC - 24) / img.width, (HUC - 24) / img.height, 1.6);
  const w = img.width * k, h = img.height * k;
  ctx.drawImage(img, cx + (HUC - w) / 2, cy + (HUC - h) / 2, w, h);

  ctx.fillStyle = '#12211B';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${i + 1}`, cx + HUC / 2, cy + HUC + 20);
}

writeFileSync(OUT, c.toBuffer('image/png'));
console.log(`${files.length} logo -> ${OUT} (${c.width}x${c.height})`);
