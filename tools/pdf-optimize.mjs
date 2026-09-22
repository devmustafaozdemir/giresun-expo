// Kitapcik PDF'inden Adobe Illustrator'in gomulu duzenleme verisini (/PieceInfo)
// temizler, ardindan artik referans verilmeyen nesneleri atar.
//
// Goruntuleme acisindan KAYIPSIZDIR: metin, vektor ve gorseller aynen kalir.
// Kaybolan tek sey dosyanin Illustrator'da katmanli olarak yeniden acilabilmesi.
// Orijinal docs/ altinda duruyor (git disinda), bu ozellik gerekirse oradan alinir.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { PDFDocument, PDFName, PDFRef, PDFDict, PDFArray, PDFStream } from 'pdf-lib';

const SRC = process.argv[2];
const OUT = process.argv[3];

const src = readFileSync(SRC);
const doc = await PDFDocument.load(src, { updateMetadata: false });
const ctx = doc.context;

/* 1) Illustrator private verisini tasiyan girdileri kaldir */
let stripped = 0;
const strip = (dict) => {
  if (!dict || typeof dict.has !== 'function') return;
  for (const key of ['PieceInfo', 'LastModified']) {
    if (dict.has(PDFName.of(key))) { dict.delete(PDFName.of(key)); stripped++; }
  }
};
strip(doc.catalog);
const pages = doc.getPages();
for (const p of pages) strip(p.node);
for (const [, obj] of ctx.enumerateIndirectObjects()) {
  if (obj instanceof PDFStream) strip(obj.dict);
  else if (obj instanceof PDFDict) strip(obj);
}

/* 2) Trailer'dan baslayip erisilebilir nesneleri topla */
const reachable = new Set();
const queue = [];
const seed = (v) => { if (v instanceof PDFRef) queue.push(v); };

seed(ctx.trailerInfo.Root);
seed(ctx.trailerInfo.Info);
seed(ctx.trailerInfo.Encrypt);

const visit = (node, depth = 0) => {
  if (!node || depth > 200) return;
  if (node instanceof PDFRef) { queue.push(node); return; }
  if (node instanceof PDFStream) { visit(node.dict, depth + 1); return; }
  if (node instanceof PDFDict) { for (const [, v] of node.entries()) visit(v, depth + 1); return; }
  if (node instanceof PDFArray) { for (let i = 0; i < node.size(); i++) visit(node.get(i), depth + 1); return; }
};

while (queue.length) {
  const ref = queue.pop();
  const key = ref.tag;
  if (reachable.has(key)) continue;
  reachable.add(key);
  visit(ctx.lookup(ref));
}

/* 3) Erisilemeyenleri sil */
let deleted = 0, freedBytes = 0;
for (const [ref, obj] of ctx.enumerateIndirectObjects()) {
  if (reachable.has(ref.tag)) continue;
  if (obj instanceof PDFStream) {
    const len = obj.dict.get(PDFName.of('Length'));
    freedBytes += (len && typeof len.asNumber === 'function') ? len.asNumber() : 0;
  }
  ctx.delete(ref);
  deleted++;
}

const out = await doc.save({ useObjectStreams: true, addDefaultPage: false });
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, out);

const mb = (b) => (b / 1024 / 1024).toFixed(2);
console.log(`Silinen /PieceInfo + /LastModified girdisi : ${stripped}`);
console.log(`Erişilebilir nesne                        : ${reachable.size}`);
console.log(`Silinen yetim nesne                       : ${deleted}  (~${mb(freedBytes)} MB stream)`);
console.log(`Sayfa sayısı                              : ${pages.length}`);
console.log('');
console.log(`Kaynak : ${mb(src.length)} MB`);
console.log(`Çıktı  : ${mb(out.length)} MB   (%${Math.round((1 - out.length / src.length) * 100)} azalma)`);
console.log(out.length < 3 * 1024 * 1024 ? '3 MB hedefi TUTTU' : '3 MB hedefi TUTMADI');
