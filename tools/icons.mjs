// Lucide ikonlarini indirir, stroke-width'i 1.75 yapar, assets/icons/ altina yazar.
// Calisma aninda CDN yok; dosyalar repoya girer. Lucide ISC lisansli.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const VERSION = '1.47.0';
const BASE = `https://cdn.jsdelivr.net/npm/lucide-static@${VERSION}/icons`;
const OUT = process.argv[2];

// [lucide adi, yerel ad]  — yerel ad kullanim yerini anlatir
const ICONS = [
  // Dört sütun
  ['factory', 'sutun-uretim'],
  ['trending-up', 'sutun-yatirim'],
  ['handshake', 'sutun-ticaret'],
  ['users', 'sutun-isbirligi'],
  // Sektörler (17)
  ['utensils', 'sektor-gida'],
  ['building-2', 'sektor-yapi'],
  ['cog', 'sektor-metal'],
  ['zap', 'sektor-enerji'],
  ['armchair', 'sektor-mobilya'],
  ['truck', 'sektor-otomotiv'],
  ['palmtree', 'sektor-turizm'],
  ['heart-pulse', 'sektor-saglik'],
  ['flask-conical', 'sektor-kimya'],
  ['megaphone', 'sektor-reklam'],
  ['ship', 'sektor-denizcilik'],
  ['cpu', 'sektor-teknoloji'],
  ['shirt', 'sektor-tekstil'],
  ['droplets', 'sektor-su'],
  ['sprout', 'sektor-tarim'],
  ['briefcase', 'sektor-hizmet'],
  ['package', 'sektor-diger'],
  // Ulaşım
  ['train-front', 'ulasim-metro'],
  ['bus', 'ulasim-otobus'],
  ['car', 'ulasim-arac'],
  ['square-parking', 'ulasim-otopark'],
  // Künye / iletişim
  ['calendar-days', 'takvim'],
  ['clock', 'saat'],
  ['map-pin', 'konum'],
  ['phone', 'telefon'],
  ['mail', 'eposta'],
  ['globe', 'web'],
  // Arayüz
  ['search', 'ara'],
  ['list-filter', 'filtre'],
  ['x', 'kapat'],
  ['chevron-down', 'ok-asagi'],
  ['chevron-left', 'ok-sol'],
  ['chevron-right', 'ok-sag'],
  ['arrow-right', 'ok-ileri'],
  ['download', 'indir'],
  ['external-link', 'dis-link'],
  ['check', 'onay'],
  ['circle-check', 'durum-basarili'],
  ['circle-alert', 'durum-uyari'],
  ['triangle-alert', 'durum-hata'],
  ['info', 'durum-bilgi'],
  ['image', 'gorsel'],
  ['inbox', 'bos-kutu'],
  ['loader-circle', 'yukleniyor'],
];

mkdirSync(OUT, { recursive: true });

let ok = 0;
const missing = [];
for (const [name, local] of ICONS) {
  const res = await fetch(`${BASE}/${name}.svg`);
  if (!res.ok) { missing.push(`${name} (${res.status})`); continue; }
  let svg = await res.text();
  // Tek cizgi kalinligi: 1.75
  svg = svg.replace(/stroke-width="[^"]*"/g, 'stroke-width="1.75"');
  // currentColor zaten varsayilan; boyut sinifla verilecek, sabit width/height kaldir
  svg = svg.replace(/\s(width|height)="24"/g, '');
  svg = svg.replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
  writeFileSync(join(OUT, `${local}.svg`), svg.trim() + '\n');
  ok++;
}

console.log(`Indirilen: ${ok} / ${ICONS.length}`);
if (missing.length) console.log('BULUNAMAYAN: ' + missing.join(', '));
