#!/usr/bin/env node
/**
 * İçerik kuralı denetleyicisi.
 *
 *   node tools/check-content.mjs
 *
 * Brief ve EK'in içerik kuralları makineyle denetlenebilir olanlar için burada
 * zorlanır. Bu araç, yazarken gözden kaçan iddiaları yakalamak içindir —
 * gerçekten bir kez gözden kaçtı ve sayfaya "ücretsiz" yazıldı.
 *
 * Denetlenenler:
 *   1. Doğrulanmamış iddialar    — giriş ücreti, ziyaretçi sayısı, m²
 *   2. Boş sıfatlar              — brief §2 "abartılı reklam dili yok"
 *   3. Kullanıcıya görünen TODO  — EK §4 "TODO yazısı görünmemeli"
 *   4. Ölü bağlantılar           — href="#" (sosyal/e-posta boşsa hiç olmamalı)
 *   5. Eski marka izleri         — v1'den kalan fındık/altın, eski tarih/yer
 *
 * Bulgu varsa çıkış kodu 1.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = ['node_modules', '.git', 'assets', 'data', 'supabase', 'tools'];
const SKIP_FILES = ['docs/ui-kit.html'];   // vitrin sayfası, gerçek içerik değil

/* --- Kurallar ------------------------------------------------------------ */
const RULES = [
  {
    id: 'ucret-iddiasi',
    // "ücretsiz giriş", "giriş ücretsizdir", "free entry", "free admission"
    re: /(ücretsiz\s+(giriş|gez|ziyaret|katıl)|giriş\s+ücretsiz|ücretsiz\s+olarak\s+gez|free\s+(entry|admission)|admission\s+is\s+free)/gi,
    mesaj: 'Giriş ücreti bilinmiyor (açık soru #18). "ücretsiz" iddiası yazılamaz.',
  },
  {
    id: 'uydurma-istatistik',
    // "X ziyaretçi", "X m²" — kitapçıkta bu veriler yok
    re: /(\d[\d.\s]*\s*(bin|binden fazla|thousand)?\s*ziyaretçi(?!\s+(ön\s+)?kay)|\d[\d.,]*\s*m²|\d[\d.,]*\s*metrekare|\d[\d.\s]*\s*visitors)/gi,
    mesaj: 'Ziyaretçi sayısı ve m² kitapçıkta yok (EK §3). Uydurulamaz.',
  },
  {
    id: 'bos-sifat',
    re: /\b(eşsiz|muhteşem|en iyi|mükemmel|devasa|efsane|rakipsiz|unrivalled|world-class|the best)\b/gi,
    mesaj: 'Brief §2: abartılı reklam dili ve boş sıfat kullanılmaz.',
  },
  {
    id: 'gorunur-todo',
    // Yalnızca HTML yorumu DIŞINDAKİ TODO'lar
    re: /TODO/g,
    mesaj: 'Kullanıcıya görünen "TODO" olamaz (EK §4).',
    yorumlariAtla: true,
  },
  {
    id: 'olu-baglanti',
    re: /href="#"/g,
    mesaj: 'href="#" ölü bağlantıdır. Veri yoksa öğe hiç render edilmemeli (EK §4).',
  },
  {
    id: 'eski-marka',
    re: /(#1F5F3F|#D4A017|--color-accent\b(?!-)|fındık\s+(yeşili|tonu)|Giresun\s+Fuar\s+Alanı|Mayıs\s+2027)/gi,
    mesaj: 'v1 markasından/yer bilgisinden kalıntı. EK §1 ve §2 ile çelişiyor.',
  },
];

/* --- Dosyaları topla ----------------------------------------------------- */
function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = relative(ROOT, full).split('\\').join('/');
    if (statSync(full).isDirectory()) {
      if (SKIP_DIRS.includes(entry)) continue;
      walk(full, acc);
    } else if (entry.endsWith('.html') && !SKIP_FILES.includes(rel)) {
      acc.push(rel);
    }
  }
  return acc;
}

/** HTML yorumlarını boşlukla değiştirir — konumlar korunur */
const stripComments = (s) => s.replace(/<!--[\s\S]*?-->/g, (m) => ' '.repeat(m.length));

/** Satır numarası bul */
const lineOf = (text, index) => text.slice(0, index).split('\n').length;

/* --- Çalıştır ------------------------------------------------------------ */
const files = walk(ROOT).sort();
let bulgu = 0;

console.log(`\n${files.length} HTML dosyası içerik kurallarına karşı denetleniyor.\n`);

for (const file of files) {
  const raw = readFileSync(join(ROOT, file), 'utf8');
  const hits = [];

  for (const rule of RULES) {
    const hay = rule.yorumlariAtla ? stripComments(raw) : raw;
    rule.re.lastIndex = 0;
    let m;
    while ((m = rule.re.exec(hay)) !== null) {
      hits.push({
        rule,
        line: lineOf(hay, m.index),
        text: m[0].replace(/\s+/g, ' ').slice(0, 60),
      });
      if (!rule.re.global) break;
    }
  }

  if (!hits.length) continue;
  bulgu += hits.length;
  console.log(`${file}`);
  for (const h of hits) {
    console.log(`  satır ${String(h.line).padStart(4)}  [${h.rule.id}]  "${h.text}"`);
    console.log(`              ${h.rule.mesaj}`);
  }
  console.log('');
}

if (bulgu > 0) {
  console.error(`HATA: ${bulgu} içerik kuralı ihlali bulundu.`);
  process.exit(1);
}
console.log('İçerik kuralları temiz: doğrulanmamış iddia, boş sıfat, görünür TODO veya ölü bağlantı yok.');
