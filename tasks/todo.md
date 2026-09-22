# Giresun Expo — Yapılacaklar

**Kaynak önceliği:** `docs/BRIEF-v2-EK.md` → `docs/KITAPCIK-ICERIK.md` → `docs/BRIEF-v2.md`
(EK, BRIEF-v2 ile çeliştiği her yerde geçerlidir.) Açık sorular: `docs/acik-sorular.md`

---

## ⚠ Öncelik: fuar 8 Ekim 2026'da başlıyor

Bugün **22 Eylül 2026** → **16 gün** kaldı.

1. **A + B önce.** Public site, gerçek içerik, `data/*.json` veri kaynağıyla. Fuardan önce yayında olmalı.
2. **YAYIN kapısı** — B biter bitmez push + GitHub Pages.
3. **C + D sonra.** Supabase ve admin paneli. Public site bunlar olmadan da eksiksiz çalışır.
4. **E** son cila ve dokümantasyon.

Bu sıralama EK §6 gereği; önceki plandaki A→B→C→D→E sırası C ve D'yi yayının önüne koyuyordu, düzeltildi.

---

## v1 — İskelet (tamamlandı)

<details>
<summary>18 sayfalık statik iskelet, tasarım sistemi, mobil menü, GitHub Pages alt yolu</summary>

- [x] Klasör yapısı (TR kökte, EN `en/` altında)
- [x] `assets/css/style.css` — token tabanlı tasarım sistemi
- [x] Ortak header ve footer, 18 sayfanın tamamında
- [x] `assets/js/main.js` — mobil menü
- [x] 9 TR + 9 EN sayfa şablonu
- [x] `CLAUDE.md`, `README.md`, `.gitignore`, `.gitattributes`
- [x] `git init` + ilk commit (`main`, `02dda87`)
- [x] GitHub Pages `/giresun-expo/` alt yolu denetimi (`cd52e92`)
- [x] v2 planlama: brief, A–E plan, açık sorular (`a08bf46`)

</details>

---

## v2 — Kararlar

| # | Konu | Karar |
|---|---|---|
| 1 | Font | Self-hosted Poppins + Inter (`assets/fonts/*.woff2`). CDN yok |
| 2 | Ortak markup | Elle tekrar + `tools/check-partials.mjs` sapma denetleyicisi. Build adımı yok |
| 3 | Lighthouse | Node.js LTS kurulur; `npx lighthouse` ile mobil skorlar |
| 4 | Boşluk skalası | **Mevcut 12 adım korunur** (onaylandı) |
| 5 | Logo | **Tasarlanmayacak.** Resmî logo var. Yalnızca favicon (halka işaretinden) + OG görseli üretilecek |
| 6 | Öncelik | **A + B → YAYIN → C + D → E** (EK §6) |

### Marka renkleri (v1'deki yeşil/altın iptal)

```css
--color-primary:       #005E44;  /* marka yeşili — "GİRESUN" */
--color-primary-dark:  #00432F;
--color-secondary:     #184181;  /* marka lacivert — "EXPO" */
--color-accent-blue:   #085494;  /* halka */
--color-accent-green:  #6A9F2F;  /* halka — YALNIZCA grafik, metin değil */
--color-accent-earth:  #3D351C;  /* halka */
```

Kaldırılacak: `--color-accent` (altın), `--color-accent-dark/soft`, fındık tonları,
`--color-sea` (yerine `--color-secondary`).

**Ölçülen WCAG AA sonuçları (yeni palet):**

| Kombinasyon | Oran | AA |
|---|---|---|
| beyaz / `#005E44` | 7.82 | ✅ |
| beyaz / `#00432F` | 11.39 | ✅ |
| beyaz / `#184181` | 9.94 | ✅ |
| `#085494` / beyaz | 7.76 | ✅ |
| `#3D351C` / beyaz | 12.18 | ✅ |
| **`#6A9F2F` / beyaz** | **3.18** | ❌ metin olarak kalır · ✅ grafik öğe (3:1) olarak geçer |

→ **Kural:** açık yeşil asla metin rengi değil; yalnızca halka, ikon ve grafik vurgu.

> ✅ **Doğrulandı (22.09):** Önceki ölçümde 4 renk sapıyordu; sebebi logo PNG'sinin
> yarı saydam düz alanlarıydı. Logo düzeltilip yeniden yazıldıktan sonra yapılan
> ölçümde **beş rengin beşi de birebir tuttu** (ΔE 0). Token'lar bu değerlerle yazıldı.
> Vektörel orijinal (`docs/acik-sorular.md` #15) gelirse yeniden doğrulanacak.

### Sayfa envanteri (43 HTML)

| TR | EN | Not |
|---|---|---|
| `index.html` | `en/index.html` | |
| `hakkinda.html` | `en/about.html` | |
| `katilimcilar.html` | `en/exhibitors.html` | 86 firma, salon filtresi |
| `ziyaret-bilgileri.html` | `en/plan-your-visit.html` | **YENİ** (EK §4) |
| `program.html` | `en/program.html` | Koşullu — oturum yoksa menüde görünmez |
| `stant-basvurusu.html` | `en/stand-application.html` | 2027 ön başvurusu |
| `ziyaretci-kaydi.html` | `en/visitor-registration.html` | "Ön kayıt" — ücret iddiası yok |
| `galeri.html` | `en/gallery.html` | |
| `basin.html` | `en/press.html` | |
| `iletisim.html` | `en/contact.html` | |
| `kvkk.html` | `en/data-protection.html` | |
| `cerez-politikasi.html` | `en/cookie-policy.html` | |
| `gizlilik.html` | `en/privacy.html` | |

Ayrıca `404.html` · `docs/ui-kit.html` (noindex) · `admin/` 15 sayfa.

Yeniden adlandırma: `haberler.html`→`basin.html`, `ziyaretci.html`→`ziyaret-bilgileri.html`
(`git mv`). Site henüz push edilmediği için kırılacak canlı URL yok.

### Resmî olgular (kitapçıktan — uydurma yok)

- **8–11 Ekim 2026**, Dr. Mimar Kadir Topbaş Gösteri ve Sanat Merkezi, Yenikapı Etkinlik Alanı
- Adres: Aksaray Mah., Kennedy Cad. No: 11/1, Fatih/İstanbul · Tel: `tel:+905416622828`
- Saatler: Per 10–19 · Cum 10–19 · Cmt 10–20 · Paz 10–18
- Slogan: *Giresun İçin İş Birliği / Türkiye İçin Güç Birliği* · Manşet: *Giresun İş Dünyası İstanbul'da Buluşuyor*
- Dört sütun: Üretim · Yatırım · Ticaret · İş Birliği
- Paydaşlar: Giresun Vakfı, Giresun Federasyonu, ŞEBİNSİAD
- **İstatistikler (yalnızca bunlar):** 86 katılımcı firma · 4 gün · 3 paydaş kuruluş · 5 salon (A/T/G/P/E)
- E-posta ve sosyal medya **yok** → alanlar boş kalır, boşsa sitede hiç görünmez

---

## A) Tasarım sistemi ve UI kit

- [x] **A1** PDF ikilemesini çöz: `docs/` içinde aynı adlı iki PDF var (NFC/NFD Unicode farkı, 2 × 8.4 MB). Birini sil, kalanı `docs/giresun-expo-2026-el-kitapcigi.pdf` olarak ASCII adla yeniden adlandır, atıfları güncelle
- [x] **A2** `docs/acik-sorular.md`'yi güncel tut (kitapçıktan doğan yeni sorular eklendi)
- [x] **A3** Node.js LTS kur (onay alarak), `tools/` altyapısı
- [x] **A4** Renk token'larını yenile: marka yeşili + lacivert ana, 3 halka rengi vurgu. Altın/fındık/`--color-sea` kaldır. **Önce #25 kararı**
- [x] **A5** Durum renkleri: `--color-success`, `--color-warning`, `--color-danger`, `--color-info`
- [x] **A6** Kontrast tablosunu tüm yeni kombinasyonlar için hesapla, ≥4.5 (grafik öğeler ≥3.0) — raporla
- [x] **A7** Poppins + Inter woff2 → `assets/fonts/`, `@font-face`, `font-display: swap`
- [x] **A8** Tipografi: h1 40→64, h2 30→44, h3 20→24, gövde 16→18px; ağırlık 400/500/600/700
- [x] **A9** Kitapçık görsel dili: yeşil büyük harfli başlık + altında kısa lacivert çizgi (`.section-title` varyantı), açık zemin, bol beyaz alan
- [x] **A10** `max-width: 65ch`; bölüm dikey boşluğu masaüstü 96–128px / mobil 64px
- [x] **A11** Yarıçap ve gölge setini tek tipe indir
- [x] **A12** Favicon: logodaki **halka işaretinden** SVG + 32px PNG. OG görseli 1200×630 (logo + açık zemin)
- [x] **A13** Logo kullanım kuralları: yalnızca açık zemin; koyu bantta beyaz kart içinde; yeniden çizme/renk değiştirme yok. Header'da kullanılacak boyut kararı (**#27**)
- [x] **A14** Grafik öğeler: halka motifinden türetilen sade desen + lacivert çizgi sistemi. *(Brief §1.5'teki fındık yaprağı / Giresun Adası illüstrasyonları **iptal** — konsept "İstanbul'da iş dünyası buluşması"na döndü ve gerçek fotoğraflar geldi)*
- [x] **A15** Lucide ikonları → `assets/icons/*.svg`, stroke 1.75. Gerekenler: dört sütun (4), sektörler (17), ulaşım (metro/otobüs/araba/otopark), saat, konum, telefon, takvim
- [x] **A16** Fotoğraf sistemi: `<picture>` + webp/jpg, `aspect-ratio`, marka renginde overlay, `loading="lazy"`, boyut sınırı (orijinaller ~1050px — büyütme yok)
- [x] **A17** Butonlar: `primary` / `secondary` / `ghost` × boyut × (ikonlu, loading, disabled)
- [x] **A18** Kartlar: bilgi, katılımcı (+**monogram varyantı** logosuz firmalar için), paydaş, istatistik
- [x] **A19** Yeni bileşenler: rozet (salon/sektör), sekme, akordeon, modal, lightbox, toast, empty state, skeleton, geri sayım şeridi
- [x] **A20** Form alanları: hata / yardım metni / başarılı durumları
- [x] **A21** Hareket: IntersectionObserver reveal, 150–300ms, `prefers-reduced-motion` altında kapalı
- [x] **A22** `tools/check-partials.mjs` — header/footer sapma denetleyicisi
- [x] **A23** `docs/ui-kit.html` (noindex)
- [x] **A24** QC: ui-kit masaüstü + mobil ekran görüntüsü, kontrast raporu, konsol temiz

## B) Public site — gerçek içerik (YAYIN hedefi)

### B-1 Altyapı ve veri
- [ ] **B1** `git mv` yeniden adlandırmalar + yeni sayfalar + nav/`hreflang` güncellemesi (43 dosya)
- [ ] **B2** `data/site-ayarlari.json`: tarih, saatler, adres, telefon, slogan/manşet TR-EN, istatistikler, etkinlik durumu metinleri (öncesi/sırası/sonrası), boş e-posta ve sosyal alanlar
- [ ] **B3** `data/` tamamla: `sektorler.json` (17), `paydaslar.json` (3), `sss.json`, `ulasim.json`. `exhibitors.json` hazır (86 firma)
- [ ] **B4** `assets/js/data.js` — JSON okuma katmanı (C'de Supabase birincil olunca yedeğe düşecek)
- [ ] **B5** Etkinlik durumu mantığı: geri sayım → "Fuar devam ediyor" (8–11 Ekim) → "2027'de görüşmek üzere". `Europe/Istanbul`, 8 Ekim 2026 10:00

### B-2 İçerik yazımı
- [ ] **B6** TR metinleri: kitapçık metinleri web için akıcılaştırılır, olgular değişmez
- [ ] **B7** EN metinleri: doğal, profesyonel İngilizce (birebir çeviri değil)
- [ ] **B8** `docs/icerik-metinleri.md` — TR + EN tek onay kaynağı

### B-3 Sayfalar (öncelik sırasıyla)
- [ ] **B9** **Ana sayfa** — hero (logo, manşet, slogan, tarih + mekân, CTA: "Ziyaret Planla" / "Katılımcıları Keşfet")
- [ ] **B10** Ana sayfa — geri sayım şeridi → dört sütun → "Giresun EXPO nedir?" → rakamlar (4 istatistik)
- [ ] **B11** Ana sayfa — paydaşlar (3 logo) → öne çıkan katılımcılar (logo sayfasındaki 43'ten seçim)
- [ ] **B12** Ana sayfa — ziyaret saatleri → ulaşım özeti + harita → SSS akordeonu
- [ ] **B13** **Katılımcılar** — 86 firma, arama + sektör filtresi + **salon filtresi (A/T/G/P/E)** + stant no sıralama + detay modalı + monogram kartları + empty state
- [ ] **B14** **Ziyaret Bilgileri** (YENİ) — tarih/saatler, adres, ulaşım (hat rozetleri: M1A, M1B, M2, M4, Marmaray; İETT 30D/31/31Y/50Y/70FY/70KY; otopark), harita, "Takvime ekle" (.ics)
- [ ] **B15** **Hakkında** — kitapçık metinleri (nedir, neden, ne zaman/nerede, salon, kimleri buluşturacak, vizyon, hedef) + paydaşlar
- [ ] **B16** **İletişim** — telefon, adres, harita, form. E-posta/sosyal boş → görünmez
- [ ] **B17** **Program** — "Etkinlik programı yakında açıklanacak"; oturum yoksa menüde gizli, yerine Ziyaret Bilgileri
- [ ] **B18** **Stant başvurusu** — "Katılımcı Olun: Giresun EXPO 2027 ön başvurusu", stant tipleri, süreç, çok adımlı form, başarı ekranı
- [ ] **B19** **Ziyaretçi ön kaydı** — kısa form, KVKK onayı, başarı ekranı + takvime ekle. **"Ücretsiz" yazılmayacak** (#28)
- [ ] **B20** **Galeri** — mevcut 6 fotoğraf, lightbox, empty state
- [ ] **B21** **Basın** — basın kiti (logo + kitapçık PDF), iletişim kişisi (#8 bekliyor), bülten listesi boş durumu
- [ ] **B22** **Yasal** 3 sayfa + "hukuki danışman gözden geçirmeli" uyarısı + çerez bandı
- [ ] **B23** **404** — CSS gömülü

### B-4 Yayın hazırlığı
- [ ] **B24** `robots.txt` (+`/admin/` engeli), `sitemap.xml`, canonical, JSON-LD (`Event` + `Organization`)
- [ ] **B25** EN paritesi + `hreflang` doğrulaması
- [ ] **B26** `tools/crawl.mjs` — kırık link + konsol hatası, `/giresun-expo/` alt yolunda
- [ ] **B27** QC: 360/768/1024/1440 yatay kaydırma yok; klavye turu; `npx lighthouse` mobil skorları
- [ ] **B28** Ekran görüntüsü öz-eleştiri turu ve düzeltmeler

## 🚀 YAYIN

- [ ] **Y1** GitHub repo adı + hesap onayı (#16), remote ekle
- [ ] **Y2** `git push`, GitHub Pages'i `main` dalından aç
- [ ] **Y3** Canlı adreste crawl + Lighthouse tekrarı, konsol kontrolü
- [ ] **Y4** Canlı URL'lerle canonical/OG doğrulaması

## C) Supabase şeması, RLS ve veri katmanı *(yayından sonra)*

- [ ] **C1** `supabase/migrations/001_init.sql` — 15 tablo, `_tr`/`_en`, `updated_at` trigger
- [ ] **C2** `site_settings` ek alanları (EK §5): günlük ziyaret saatleri (JSON), slogan TR/EN, manşet TR/EN, etkinlik durumu metinleri (öncesi/sırası/sonrası), stant başvuru başlığı
- [ ] **C3** `exhibitors` tablosunda `stands text[]` ve `hall` alanları (EK §5)
- [ ] **C4** Kısıtlar: e-posta formatı, uzunluk, zorunlu alanlar, durum `check`
- [ ] **C5** Başvuru/kayıt numarası DB tarafında (`GE-2027-0001` — 2027 ön başvurusu)
- [ ] **C6** `is_admin()` + tüm tablolarda RLS açık
- [ ] **C7** Anon: yalnızca `published = true` + `site_settings` SELECT
- [ ] **C8** Anon: başvuru/kayıt/mesaj/bülten tablolarına **yalnızca INSERT**
- [ ] **C9** Admin politikaları + `editor` kısıtları
- [ ] **C10** Storage `public-media`: herkes okur, admin yazar, tip + 5 MB limiti
- [ ] **C11** `supabase/seed.sql` — 86 katılımcı, 17 sektör, 3 paydaş (`sponsors`, seviye `partner`), site ayarları, kitapçıktan cevaplanabilen SSS'ler
- [ ] **C12** `assets/js/config.js` (yer tutucu) — `service_role` asla repoda değil
- [ ] **C13** `assets/js/supabase-client.js` — jsDelivr sabit sürüm ESM
- [ ] **C14** `data.js`'i Supabase birincil / JSON yedekli hale getir
- [ ] **C15** Formları Supabase'e bağla + honeypot + istemci doğrulaması
- [ ] **C16** "Başvurular açık/kapalı" anahtarını public forma bağla
- [ ] **C17** `supabase/tests/rls-checklist.md` + anon anahtarla **fiili** test
- [ ] **C18** `docs/SUPABASE-KURULUM.md`
- [ ] **C19** QC: `config.js` boşken site JSON'dan eksiksiz çalışıyor

## D) Admin paneli *(yayından sonra)*

- [ ] **D1** `assets/css/admin.css`
- [ ] **D2** `admin/index.html` giriş + şifremi unuttum
- [ ] **D3** `auth.js` — oturum, yönlendirme, rol, "Yetkiniz yok"
- [ ] **D4** `ui.js` — toast, onay modalı, tablo, form, CSV (UTF-8 BOM), upload, sürükle-bırak, kaydedilmemiş değişiklik uyarısı
- [ ] **D5** Pano: özet kartları, 7/30 gün grafiği, son 5 başvuru/mesaj
- [ ] **D6** Stant Başvuruları: tablo, arama, filtre, detay paneli, durum, admin notu, CSV
- [ ] **D7** Ziyaretçi Kayıtları: liste, arama, gün sayıları, check-in, CSV
- [ ] **D8** Mesajlar: gelen kutusu, okundu/arşiv, `mailto:`
- [ ] **D9** Katılımcılar: CRUD, logo yükleme, sürükle-bırak sıra, öne çıkar/yayından kaldır, **sektör doğrulama akışı** (17 sektör tahminî — #24)
- [ ] **D10** "Onaylanan başvurudan katılımcıya dönüştür"
- [ ] **D11** Program + Konuşmacılar CRUD (eklenince public program otomatik görünür)
- [ ] **D12** Sponsorlar/Paydaşlar, SSS, Sektörler, Basın: CRUD
- [ ] **D13** Galeri: albüm + çoklu yükleme + sıralama
- [ ] **D14** Bülten aboneleri + CSV
- [ ] **D15** Site Ayarları: tarih, saatler, adres, telefon, e-posta, sosyal, istatistikler, duyuru çubuğu, etkinlik durumu metinleri, stant başvuru başlığı, başvuru anahtarı
- [ ] **D16** Kullanıcılar (`owner`) + rol değiştirme
- [ ] **D17** Etkinlik Günlüğü
- [ ] **D18** `noindex, nofollow` tüm admin sayfalarında
- [ ] **D19** TR/EN alanları yan yana sekmeli
- [ ] **D20** Yükleniyor / boş / hata durumları
- [ ] **D21** QC: `innerHTML` taraması 0; oturumsuz ve `editor` erişim testleri

## E) Son kalite kontrol ve dokümantasyon

- [ ] **E1** 360/768/1024/1440 tam tur
- [ ] **E2** Klavye: menü, form, modal, lightbox, sekme, akordeon; focus kapanı
- [ ] **E3** TR ↔ EN parite + `hreflang`
- [ ] **E4** Lighthouse mobil: Perf ≥90, A11y ≥95, BP ≥95, SEO ≥95 — raporla
- [ ] **E5** RLS kontrol listesinin fiili koşumu
- [ ] **E6** Supabase kapalıyken JSON yedek testi
- [ ] **E7** `CLAUDE.md`: marka renkleri, Supabase, admin, XSS kuralı, yeni sayfa envanteri, logo kullanım kuralı — **GitHub Pages bölümü korunarak**
- [ ] **E8** `docs/ADMIN-KULLANIM.md`
- [ ] **E9** `docs/acik-sorular.md` kapanış
- [ ] **E10** Final commit + push onayı

---

## Aşama başına doğrulama

| Aşama | Kanıt |
|---|---|
| A | Kontrast tablosu · `ui-kit.html` ekran görüntüsü · `check-partials.mjs` temiz |
| B | 4 genişlikte ekran görüntüsü · `crawl.mjs` 0 kırık link · TR/EN parite · Lighthouse |
| YAYIN | Canlı URL'de crawl + Lighthouse + konsol temiz |
| C | `config.js` boşken site çalışıyor · anon RLS senaryoları beklenen sonucu veriyor |
| D | `innerHTML` sayacı 0 · yetkisiz erişim reddediliyor |
| E | Tam tur skorlar + öz-eleştiri |

---

## Review

### v1 — 22.09.2026
Boş klasörden 18 sayfalık çalışır iskelete. Tek seferlik üretici scriptle ortak markup'ın
birebir aynılığı garantilendi. Tüm yollar göreli; `/giresun-expo/` alt yolunda 18 sayfa
gezilerek doğrulandı. Git kuruldu, `.nojekyll` ve Pages kuralları eklendi.

### v2 planlama — 22.09.2026
Brief mevcut kodla karşılaştırıldı; brief'in "mevcut" saydığı 8 öğenin hiçbiri yoktu.
Mevcut palette WCAG AA denetimi yapıldı, 3 hata bulundu. 4 çelişki karara bağlandı.

### v2 planlama revizyonu — resmî kitapçık sonrası
Kitapçık, EK ve 86 firmalık veri geldi; planın varsayımlarının çoğu geçersizleşti:

**Değişenler:** fuar Giresun değil **İstanbul**, Mayıs 2027 değil **8–11 Ekim 2026**;
logo tasarımı iptal (resmî logo var); marka renkleri yeşil/altın değil **yeşil/lacivert**;
tarih ve istatistikler artık `TODO` değil; öncelik **A+B → yayın → C+D** olarak yeniden
sıralandı; fındık/Giresun Adası illüstrasyonları iptal (konsept değişti, gerçek fotoğraflar geldi);
yeni "Ziyaret Bilgileri" sayfası eklendi; program sayfası koşullu hale geldi.

**Yeni ölçümler:**
- Yeni paletin AA denetimi: açık yeşil `#6A9F2F` metin olarak **3.18 → kalır**, grafik öğe
  olarak geçer. Kural: asla metin rengi değil.
- **Verilen marka hex'lerinin 4'ü logodaki gerçek piksellerle uyuşmuyor** — yeşil ΔE 0 ama
  lacivert 10.7, açık yeşil 11.0, kahve 11.7. PNG'de renk profili yok, yani ölçülen değerler
  dosyanın gerçek sRGB değerleri. A4'ten önce karar gerekiyor (#25).
- `docs/` içinde aynı adlı **iki PDF** var (NFC/NFD Unicode farkı), 2 × 8.4 MB (A1).
- Logoda **tarih gömülü** ("8 - 11 Ekim 2026"); header'da küçük boyutta okunmaz hale gelecek (#27).
