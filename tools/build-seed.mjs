#!/usr/bin/env node
/**
 * data/*.json -> supabase/seed.sql
 *
 *   node tools/build-seed.mjs
 *
 * Seed dosyası ELLE YAZILMAZ; JSON'dan üretilir. Böylece public sitenin yedek
 * veri katmanı ile Supabase'deki veri aynı kaynaktan gelir ve ayrışmaz.
 *
 * Üretilen SQL tekrar çalıştırılabilir (idempotent): her tablo için
 * "on conflict ... do update" kullanılır.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));

/** SQL string literali — tek tırnaklar ikilenir */
const s = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
/** text[] literali */
const arr = (a) => (!a || !a.length ? `'{}'` : `'{${a.map((x) => `"${String(x).replace(/"/g, '\\"')}"`).join(',')}}'`);
/** jsonb literali */
const js = (o) => `${s(JSON.stringify(o ?? null))}::jsonb`;
const b = (v) => (v ? 'true' : 'false');
const n = (v) => (v === null || v === undefined || v === '' ? 'null' : Number(v));

const ex = oku('data/exhibitors.json');
const ayar = oku('data/site-ayarlari.json');
const paydas = oku('data/paydaslar.json');
const sss = oku('data/sss.json');
const ulasim = oku('data/ulasim.json');

const out = [];
const yaz = (...x) => out.push(...x);

yaz(
  '-- =============================================================================',
  '-- Giresun EXPO — seed.sql',
  '--',
  '-- BU DOSYA ELLE DÜZENLENMEZ. tools/build-seed.mjs tarafından data/*.json\'dan',
  '-- üretilir. Değişiklik için JSON\'u düzenleyip script\'i yeniden çalıştırın.',
  '--',
  `-- Üretim: ${new Date().toISOString().slice(0, 10)}`,
  `-- Kaynak: ${ex._source || 'data/exhibitors.json'}`,
  '--',
  '-- 001_init.sql ve 002_storage.sql\'den SONRA çalıştırılır.',
  '-- Tekrar çalıştırılabilir: mevcut kayıtlar güncellenir, kopya oluşmaz.',
  '-- =============================================================================',
  ''
);

/* --- Sektörler ----------------------------------------------------------- */
yaz('-- Sektörler ------------------------------------------------------------------');
ex.sectors.forEach((x, i) => {
  yaz(
    `insert into public.sectors (id, name_tr, name_en, ikon, sira) values`,
    `  (${s(x.id)}, ${s(x.name_tr)}, ${s(x.name_en)}, ${s('sektor-' + x.id)}, ${i + 1})`,
    `on conflict (id) do update set name_tr=excluded.name_tr, name_en=excluded.name_en,`,
    `  ikon=excluded.ikon, sira=excluded.sira;`
  );
});
yaz('');

/* --- Katılımcılar --------------------------------------------------------- */
yaz(`-- Katılımcılar (${ex.exhibitors.length} firma) -------------------------------------------`);
for (const e of ex.exhibitors) {
  yaz(
    `insert into public.exhibitors`,
    `  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values`,
    `  (${s(e.name)}, ${s(e.slug)}, ${s(e.sector)}, ${arr(e.stands)}, ${s(e.hall)},`,
    `   ${s(e.logo || '')}, ${b(e.featured)}, ${b(e.published)}, ${e.sort})`,
    `on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,`,
    `  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,`,
    `  featured=excluded.featured, published=excluded.published, sira=excluded.sira;`
  );
}
yaz('');

/* --- Paydaşlar (sponsors, seviye='partner') ------------------------------- */
yaz('-- Paydaşlar (EK §5: sponsors tablosunda seviye=partner) ----------------------');
for (const p of paydas.paydaslar) {
  yaz(
    `insert into public.sponsors (ad_tr, ad_en, aciklama_tr, aciklama_en, seviye, logo_url, web, sira) values`,
    `  (${s(p.ad_tr)}, ${s(p.ad_en)}, ${s(p.aciklama_tr)}, ${s(p.aciklama_en)},`,
    `   'partner', ${s(p.logo)}, ${s(p.web)}, ${p.sira})`,
    // Hedefsiz "on conflict do nothing" HİÇBİR ZAMAN tetiklenmez (unique kısıt
    // yoksa çakışma da olmaz) — seed her koşumda mükerrer satır üretirdi.
    // ad_tr üzerindeki benzersizlik kısıtı 004_sponsors_unique.sql ile eklendi.
    `on conflict (ad_tr) do update set`,
    `  ad_en=excluded.ad_en, aciklama_tr=excluded.aciklama_tr,`,
    `  aciklama_en=excluded.aciklama_en, seviye=excluded.seviye,`,
    `  logo_url=excluded.logo_url, web=excluded.web, sira=excluded.sira;`
  );
}
yaz('');

/* --- SSS ------------------------------------------------------------------ */
yaz(`-- SSS (${sss.sorular.length} soru — hepsi kitapçıktan doğrulanabilir) ---------------------`);
for (const q of sss.sorular) {
  yaz(
    `insert into public.faqs (slug, soru_tr, soru_en, cevap_tr, cevap_en, sira) values`,
    `  (${s(q.slug)}, ${s(q.soru_tr)}, ${s(q.soru_en)}, ${s(q.cevap_tr)}, ${s(q.cevap_en)}, ${q.sira})`,
    `on conflict (slug) do update set soru_tr=excluded.soru_tr, soru_en=excluded.soru_en,`,
    `  cevap_tr=excluded.cevap_tr, cevap_en=excluded.cevap_en, sira=excluded.sira;`
  );
}
yaz('');

/* --- Ulaşım --------------------------------------------------------------- */
yaz('-- Ulaşım seçenekleri (kitapçık §4) -------------------------------------------');
ulasim.secenekler.forEach((u, i) => {
  yaz(
    `insert into public.transport_options (slug, ikon, baslik_tr, baslik_en, metin_tr, metin_en, hatlar, sira) values`,
    `  (${s(u.slug)}, ${s(u.ikon)}, ${s(u.baslik_tr)}, ${s(u.baslik_en)},`,
    `   ${s(u.metin_tr)}, ${s(u.metin_en)}, ${arr(u.hatlar)}, ${i + 1})`,
    `on conflict (slug) do update set ikon=excluded.ikon, baslik_tr=excluded.baslik_tr,`,
    `  baslik_en=excluded.baslik_en, metin_tr=excluded.metin_tr, metin_en=excluded.metin_en,`,
    `  hatlar=excluded.hatlar, sira=excluded.sira;`
  );
});
yaz('');

/* --- Site ayarları (tek satır) -------------------------------------------- */
const et = ayar.etkinlik, mk = ayar.mekan, il = ayar.iletisim, du = ayar.duyuru_cubugu,
      ed = ayar.etkinlik_durumu, sb = ayar.stant_basvurusu;

yaz(
  '-- Site ayarları (tek satır) ---------------------------------------------------',
  `insert into public.site_settings (`,
  `  id, etkinlik_adi, baslangic_tarihi, bitis_tarihi, geri_sayim_hedefi,`,
  `  manset_tr, manset_en, slogan_tr, slogan_en,`,
  `  mekan_ad_tr, mekan_ad_en, mekan_alan_tr, mekan_alan_en, mekan_sehir,`,
  `  adres_tr, adres_en, harita_sorgusu,`,
  `  telefon, eposta, web, sosyal,`,
  `  ziyaret_saatleri, istatistikler,`,
  `  duyuru_aktif, duyuru_metin_tr, duyuru_metin_en, duyuru_link,`,
  `  durum_oncesi_tr, durum_oncesi_en, durum_sirasinda_tr, durum_sirasinda_en,`,
  `  durum_sonrasi_tr, durum_sonrasi_en,`,
  `  stant_basvuru_acik, stant_baslik_tr, stant_baslik_en, stant_kapali_tr, stant_kapali_en,`,
  `  ziyaretci_kaydi_acik, program_yayinda`,
  `) values (`,
  `  true, ${s(et.ad)}, ${s(et.baslangic)}, ${s(et.bitis)}, ${s(et.geri_sayim_hedefi)},`,
  `  ${s(ayar.manset_tr)}, ${s(ayar.manset_en)}, ${s(ayar.slogan_tr)}, ${s(ayar.slogan_en)},`,
  `  ${s(mk.ad_tr)}, ${s(mk.ad_en)}, ${s(mk.alan_tr)}, ${s(mk.alan_en)}, ${s(mk.sehir)},`,
  `  ${s(mk.adres_tr)}, ${s(mk.adres_en)}, ${s(mk.harita_sorgusu)},`,
  `  ${s(il.telefon)}, ${s(il.eposta)}, ${s(il.web)}, ${js(ayar.sosyal)},`,
  `  ${js(ayar.ziyaret_saatleri)}, ${js(ayar.istatistikler)},`,
  `  ${b(du.aktif)}, ${s(du.metin_tr)}, ${s(du.metin_en)}, ${s(du.link)},`,
  `  ${s(ed.oncesi_tr)}, ${s(ed.oncesi_en)}, ${s(ed.sirasinda_tr)}, ${s(ed.sirasinda_en)},`,
  `  ${s(ed.sonrasi_tr)}, ${s(ed.sonrasi_en)},`,
  `  ${b(sb.acik)}, ${s(sb.baslik_tr)}, ${s(sb.baslik_en)}, ${s(sb.kapali_mesaji_tr)}, ${s(sb.kapali_mesaji_en)},`,
  `  ${b(ayar.ziyaretci_kaydi.acik)}, ${b(ayar.program.yayinda)}`,
  `)`,
  `on conflict (id) do update set`,
  `  etkinlik_adi=excluded.etkinlik_adi, baslangic_tarihi=excluded.baslangic_tarihi,`,
  `  bitis_tarihi=excluded.bitis_tarihi, geri_sayim_hedefi=excluded.geri_sayim_hedefi,`,
  `  manset_tr=excluded.manset_tr, manset_en=excluded.manset_en,`,
  `  slogan_tr=excluded.slogan_tr, slogan_en=excluded.slogan_en,`,
  `  mekan_ad_tr=excluded.mekan_ad_tr, mekan_ad_en=excluded.mekan_ad_en,`,
  `  mekan_alan_tr=excluded.mekan_alan_tr, mekan_alan_en=excluded.mekan_alan_en,`,
  `  mekan_sehir=excluded.mekan_sehir, adres_tr=excluded.adres_tr, adres_en=excluded.adres_en,`,
  `  harita_sorgusu=excluded.harita_sorgusu, telefon=excluded.telefon,`,
  `  ziyaret_saatleri=excluded.ziyaret_saatleri, istatistikler=excluded.istatistikler,`,
  `  durum_oncesi_tr=excluded.durum_oncesi_tr, durum_oncesi_en=excluded.durum_oncesi_en,`,
  `  durum_sirasinda_tr=excluded.durum_sirasinda_tr, durum_sirasinda_en=excluded.durum_sirasinda_en,`,
  `  durum_sonrasi_tr=excluded.durum_sonrasi_tr, durum_sonrasi_en=excluded.durum_sonrasi_en,`,
  `  stant_baslik_tr=excluded.stant_baslik_tr, stant_baslik_en=excluded.stant_baslik_en;`,
  ''
);

/* --- Özet ---------------------------------------------------------------- */
yaz(
  '-- =============================================================================',
  `-- Özet: ${ex.sectors.length} sektör · ${ex.exhibitors.length} katılımcı · ` +
  `${paydas.paydaslar.length} paydaş · ${sss.sorular.length} SSS · ` +
  `${ulasim.secenekler.length} ulaşım · 1 site ayarı satırı`,
  `-- Logolu katılımcı: ${ex.exhibitors.filter((e) => e.logo).length} / ${ex.exhibitors.length}`,
  '-- ============================================================================='
);

mkdirSync(join(ROOT, 'supabase'), { recursive: true });
writeFileSync(join(ROOT, 'supabase/seed.sql'), out.join('\n') + '\n');

console.log(`supabase/seed.sql yazıldı (${out.length} satır)`);
console.log(`  ${ex.sectors.length} sektör, ${ex.exhibitors.length} katılımcı ` +
            `(${ex.exhibitors.filter((e) => e.logo).length} logolu), ` +
            `${paydas.paydaslar.length} paydaş, ${sss.sorular.length} SSS, ` +
            `${ulasim.secenekler.length} ulaşım seçeneği`);
