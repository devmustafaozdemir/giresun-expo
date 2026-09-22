/* ==========================================================================
   Yönetim paneli HTML kabuklarını üretir.
   node tools/build-admin.mjs

   Admin sayfalarının <head>'i ve noscript bloğu birebir aynı. Public sitede
   header/footer her dosyada tekrarlandığı için tools/check-partials.mjs
   gerekiyor; burada aynı sorunu hiç doğurmamak için kabuk tek kaynaktan
   üretiliyor. Sayfaya özgü tek şey başlık ve yüklenen modül.

   Giriş sayfası (admin/index.html) bu üreticinin dışında: kendine ait bir
   formu ve satır içi scripti var, kabuk kullanmıyor.
   ========================================================================== */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const kok = join(dirname(fileURLToPath(import.meta.url)), '..');

const SAYFALAR = [
  { dosya: 'pano.html',               baslik: 'Pano',                 modul: 'pano.js' },
  { dosya: 'stant-basvurulari.html',  baslik: 'Stant Başvuruları',    modul: 'stant-basvurulari.js' },
  { dosya: 'ziyaretci-kayitlari.html', baslik: 'Ziyaretçi Kayıtları', modul: 'ziyaretci-kayitlari.js' },
  { dosya: 'mesajlar.html',           baslik: 'Mesajlar',             modul: 'mesajlar.js' },
  { dosya: 'katilimcilar.html',       baslik: 'Katılımcılar',         modul: 'katilimcilar.js' },
  { dosya: 'ayarlar.html',            baslik: 'Site Ayarları',        modul: 'ayarlar.js' },
  { dosya: 'icerik.html',             baslik: 'Diğer İçerik',         modul: 'icerik.js' },
  { dosya: 'kullanicilar.html',       baslik: 'Kullanıcılar',         modul: 'kullanicilar.js' },
  { dosya: 'gunluk.html',             baslik: 'Etkinlik Günlüğü',     modul: 'gunluk-sayfa.js' },
  { dosya: 'yetkiniz-yok.html',       baslik: 'Yetkiniz Yok',         modul: 'yetkiniz-yok.js' }
];

const kabuk = ({ baslik, modul }) => `<!doctype html>
<html lang="tr" data-root="../">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${baslik} — Giresun EXPO Yönetim</title>
<meta name="robots" content="noindex, nofollow">
<script>document.documentElement.classList.add('js')</script>
<link rel="icon" href="../assets/img/brand/favicon-32.png" sizes="32x32">
<link rel="stylesheet" href="../assets/css/style.css">
<link rel="stylesheet" href="../assets/css/admin.css">
</head>
<body>

<noscript>
  <div style="max-width:560px;margin:15vh auto;padding:2rem;font-family:system-ui,sans-serif;
              border:1px solid #DCE4DE;border-radius:16px;background:#fff;text-align:center">
    <h1 style="font-size:1.25rem;margin:0 0 .75rem;color:#12211B">JavaScript gerekli</h1>
    <p style="margin:0;color:#38453E;line-height:1.6">
      Yönetim paneli veritabanına tarayıcıdan bağlanır ve JavaScript olmadan çalışamaz.
      Lütfen tarayıcınızda JavaScript'i etkinleştirin.
    </p>
  </div>
</noscript>

<script src="../assets/js/config.js"></script>
<script type="module" src="../assets/js/admin/${modul}"></script>

</body>
</html>
`;

mkdirSync(join(kok, 'admin'), { recursive: true });

for (const s of SAYFALAR) {
  writeFileSync(join(kok, 'admin', s.dosya), kabuk(s), 'utf8');
  console.log('  admin/' + s.dosya.padEnd(26) + ' -> ' + s.modul);
}

console.log(`\n${SAYFALAR.length} admin kabuğu yazıldı (giriş sayfası hariç).`);
