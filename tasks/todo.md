# Giresun Expo — Yapılacaklar

Kaynak: `docs/BRIEF-v2.md` · Açık sorular: `docs/acik-sorular.md`

**Çalışma şekli:** Her aşama sonunda kısa özet + ekran görüntüsü/ölçüm + commit, sonra
onay beklenir. `git push` her seferinde ayrıca sorulur. Küçük ve anlamlı commit'ler.

---

## v1 — İskelet (tamamlandı)

<details>
<summary>18 sayfalık statik iskelet, tasarım sistemi, mobil menü, GitHub Pages alt yolu</summary>

- [x] Klasör yapısı (TR kökte, EN `en/` altında)
- [x] `assets/css/style.css` — token tabanlı tasarım sistemi
- [x] Ortak header (hamburger + TR|EN + CTA) ve footer, 18 sayfanın tamamında
- [x] `assets/js/main.js` — mobil menü (aç/kapat, Esc, örtü, link, resize, `aria-expanded`)
- [x] 9 TR + 9 EN sayfa şablonu
- [x] `CLAUDE.md`, `README.md`, `.gitignore`, `.gitattributes`
- [x] İç link doğrulaması — kırık link yok
- [x] Tarayıcı doğrulaması (masaüstü + mobil, konsol temiz)
- [x] `git init` + ilk commit (`main`, `02dda87`)
- [x] GitHub Pages `/giresun-expo/` alt yolu denetimi — kök-göreli yol yok, 18 sayfa gezilerek doğrulandı
- [x] `.nojekyll` + CLAUDE.md "Yayın: GitHub Pages" kuralları (`cd52e92`)
- [ ] Repoyu GitHub'a push et, Pages'i `main` dalından yayına al

</details>

---

## v2 — Kararlar

Plan onayında netleşen ve tüm aşamaları bağlayan kararlar:

| # | Konu | Karar |
|---|---|---|
| 1 | Font | **Self-hosted Poppins + Inter** (`assets/fonts/*.woff2`, `@font-face`, `font-display: swap`). CDN yok — CLAUDE.md kuralı korunur. İkisi de OFL lisanslı. |
| 2 | Ortak markup | **Elle tekrar + `tools/check-partials.mjs` sapma denetleyicisi.** Build adımı yok, HTML statik kalır. Toplu değişiklik tek seferlik scriptle. |
| 3 | Sayfa envanteri | **Brief §2'ye birebir uyulur.** `haberler.html` → `basin.html`, `ziyaretci.html` → `ziyaretci-kaydi.html`. Ziyaret bilgileri ana sayfadaki "Konum ve ulaşım"a taşınır. `news` tablosu yok. |
| 4 | Lighthouse | **Node.js LTS kurulur**; `npx lighthouse` ile mobil skorlar raporlanır. `tools/*.mjs` de bu sayede çalışır. |

### Sayfa envanteri (son hâli — 41 HTML)

| TR | EN |
|---|---|
| `index.html` | `en/index.html` |
| `hakkinda.html` | `en/about.html` |
| `katilimcilar.html` | `en/exhibitors.html` |
| `program.html` | `en/program.html` |
| `stant-basvurusu.html` | `en/stand-application.html` |
| `ziyaretci-kaydi.html` *(yeniden adlandırma)* | `en/visitor-registration.html` |
| `galeri.html` | `en/gallery.html` |
| `basin.html` *(yeniden adlandırma)* | `en/press.html` |
| `iletisim.html` | `en/contact.html` |
| `kvkk.html` | `en/data-protection.html` |
| `cerez-politikasi.html` | `en/cookie-policy.html` |
| `gizlilik.html` | `en/privacy.html` |

Ayrıca: `404.html` (kök, CSS gömülü) · `docs/ui-kit.html` (noindex) · `admin/` 15 sayfa.

> Yeniden adlandırmalar `git mv` ile. Site henüz push edilmediği için kırılacak canlı URL yok.

---

## A) Tasarım sistemi ve UI kit

- [ ] **A1** `docs/BRIEF-v2.md` olarak brief'i repoya kaydet
- [ ] **A2** `docs/acik-sorular.md` oluştur; aşamalar boyunca güncel tut
- [ ] **A3** Node.js LTS kur (onay alarak) ve `tools/` altyapısını hazırla
- [ ] **A4** Renk token'ları: `--color-sea`, `--color-warning`, `--color-info` ekle
- [ ] **A5** WCAG AA hatalarını düzelt — ölçülen 3 hata:
  - `--color-muted` #6B776F / `--color-surface` #F5F7F4 = **4.34**
  - `.btn--accent:hover` beyaz / #B2860F = **3.33**
  - `.hero .lead` beyaz %82 / gradyan açık ucu #2E7C55 = **3.98**
- [ ] **A6** Kontrast tablosunu yeniden hesapla — tüm kombinasyonlar ≥ 4.5, sonucu raporla
- [ ] **A7** Poppins + Inter woff2 dosyaları `assets/fonts/` altına; `@font-face`, `--font-display` / `--font-sans`
- [ ] **A8** Tipografi ölçeği: h1 40→64, h2 30→44, h3 20→24, gövde 16→18px; ağırlık 400/500/600/700
- [ ] **A9** `max-width: 65ch` metin bloklarına sistematik uygulanır
- [ ] **A10** Boşluk: 8px ızgara doğrulaması + bölüm dikey boşluğu masaüstü 96–128px / mobil 64px
- [ ] **A11** Yarıçap ve gölge setini tek tipe indir
- [ ] **A12** Logo SVG (açık + koyu zemin), favicon (SVG + 32px PNG), OG görseli 1200×630
- [ ] **A13** SVG illüstrasyonlar: fındık yaprağı, Karadeniz dalgası, Giresun Adası silueti, topografik doku
- [ ] **A14** Lucide ikonları → `assets/icons/*.svg`, stroke 1.75, tek boyut sistemi
- [ ] **A15** Butonlar: `primary` / `secondary` / `ghost` × boyut × (ikonlu, loading, disabled)
- [ ] **A16** Kart tipleri: bilgi, katılımcı, konuşmacı, istatistik
- [ ] **A17** Yeni bileşenler: rozet, sekme, akordeon, modal, lightbox, toast, empty state, skeleton
- [ ] **A18** Form alanları: hata / yardım metni / başarılı durumları
- [ ] **A19** Şık foto yer tutucu (`aspect-ratio` + ikon + "Fotoğraf eklenecek")
- [ ] **A20** Hareket: IntersectionObserver reveal, 150–300ms, `prefers-reduced-motion` altında kapalı
- [ ] **A21** `tools/check-partials.mjs` — header/footer sapma denetleyicisi
- [ ] **A22** `docs/ui-kit.html` (noindex) — tüm bileşenler tek sayfada
- [ ] **A23** QC: ui-kit masaüstü + mobil ekran görüntüsü, konsol temiz, kontrast raporu

## B) Public sayfaların yeniden tasarımı ve metinler

- [ ] **B1** TR + EN tüm metinleri yaz → `docs/icerik-metinleri.md` (organizatör onay kaynağı)
- [ ] **B2** `data/*.json` üret: `site-ayarlari`, `sektorler`, `katilimcilar`, `program`, `konusmacilar`, `sponsorlar`, `sss`, `galeri`, `basin`
- [ ] **B3** `git mv` yeniden adlandırmalar + tüm dosyalarda nav / `hreflang` güncellemesi
- [ ] **B4** Ana sayfa: duyuru çubuğu, hero + geri sayım şeridi, istatistikler, hakkında özeti
- [ ] **B5** Ana sayfa: sektör kartları, "neden katılmalısınız" sekmeleri, öne çıkan katılımcılar
- [ ] **B6** Ana sayfa: program önizlemesi, sponsorlar, SSS akordeonu, konum/ulaşım + harita, bülten bandı
- [ ] **B7** Hakkında
- [ ] **B8** Katılımcılar: arama + sektör filtresi + A–Z + ızgara + detay modalı + empty state
- [ ] **B9** Program: gün sekmeleri, zaman çizelgesi, tür rozetleri, salon filtresi, konuşmacı kartları, `.ics`
- [ ] **B10** Stant başvurusu: ikna bölümü + stant tipleri tablosu + süreç adımları
- [ ] **B11** Stant başvurusu: 3 adımlı form, ilerleme göstergesi, adım doğrulaması, başarı ekranı + başvuru no
- [ ] **B12** Ziyaretçi kaydı: form + KVKK onayı + başarı ekranı + takvime ekle
- [ ] **B13** Galeri: albümler, ızgara, erişilebilir lightbox, empty state
- [ ] **B14** Basın: bültenler, basın kiti, iletişim kişisi
- [ ] **B15** İletişim: iletişim kartları, form, tıklayınca yüklenen gizlilik dostu harita, sosyal
- [ ] **B16** Yasal 3 sayfa (KVKK / Çerez / Gizlilik) + "hukuki danışman gözden geçirmeli" uyarısı
- [ ] **B17** Çerez bildirimi bandı (yalnızca gerekli çerezler)
- [ ] **B18** `404.html` — CSS gömülü (CLAUDE.md kuralı)
- [ ] **B19** `robots.txt` (+`/admin/` engeli), `sitemap.xml`, canonical, JSON-LD (`Event`, `Organization`)
- [ ] **B20** EN paritesi: doğal İngilizce + `hreflang` doğrulaması
- [ ] **B21** QC: 360/768/1024/1440 yatay kaydırma yok; `tools/crawl.mjs` 0 kırık link; konsol temiz

## C) Supabase şeması, RLS ve veri katmanı

- [ ] **C1** `supabase/migrations/001_init.sql` — 15 tablo, `_tr`/`_en` sütunlar, `updated_at` trigger'ı
- [ ] **C2** Kısıtlar: e-posta formatı, uzunluk sınırları, zorunlu alanlar, durum `check` kısıtları
- [ ] **C3** Başvuru/kayıt numarası DB tarafında üretilsin (`GE-<yıl>-0001`, sequence + trigger)
- [ ] **C4** `is_admin()` fonksiyonu + tüm tablolarda RLS açık
- [ ] **C5** Anon: yalnızca `published = true` içerik + `site_settings` SELECT
- [ ] **C6** Anon: başvuru / kayıt / mesaj / bülten tablolarına **yalnızca INSERT**
- [ ] **C7** Admin politikaları + `editor` kısıtları (başvuru silemez, admin ekleyemez)
- [ ] **C8** Storage `public-media`: herkes okur, admin yazar, dosya tipi + 5 MB limiti
- [ ] **C9** `supabase/seed.sql` — `data/*.json` içeriğini aktarır
- [ ] **C10** `assets/js/config.js` (yer tutucu) — `service_role` asla repoda değil
- [ ] **C11** `assets/js/supabase-client.js` — jsDelivr'dan **sabit sürüm** ESM import
- [ ] **C12** `assets/js/data.js` — Supabase → JSON yedekli okuma katmanı
- [ ] **C13** Formları Supabase'e bağla + honeypot + istemci doğrulaması
- [ ] **C14** "Başvurular kapalı" anahtarını public forma bağla (zarif kapalı mesajı)
- [ ] **C15** `supabase/tests/rls-checklist.md` — senaryolar + beklenen sonuçlar
- [ ] **C16** Anon anahtarla **fiili** RLS testi, sonuçları raporla
- [ ] **C17** `docs/SUPABASE-KURULUM.md` — Türkçe, adım adım, sign-up kapatma + davetle admin ekleme
- [ ] **C18** QC: `config.js` boşken site JSON'dan eksiksiz çalışıyor

## D) Admin paneli

- [ ] **D1** `assets/css/admin.css` — public token'lar üzerine yoğun, veri odaklı düzen
- [ ] **D2** `admin/index.html` giriş + "şifremi unuttum"
- [ ] **D3** `assets/js/admin/auth.js` — oturum, yönlendirme, rol, "Yetkiniz yok"
- [ ] **D4** `assets/js/admin/ui.js` — toast, onay modalı, tablo, form, CSV (UTF-8 BOM), upload, sürükle-bırak, kaydedilmemiş değişiklik uyarısı
- [ ] **D5** Pano: özet kartları, 7/30 gün grafiği, son 5 başvuru/mesaj, hızlı eylemler
- [ ] **D6** Stant Başvuruları: tablo, arama, filtre, sıralama, sayfalama, detay paneli, durum, admin notu, CSV
- [ ] **D7** Ziyaretçi Kayıtları: liste, arama, gün sayıları, check-in, CSV
- [ ] **D8** Mesajlar: gelen kutusu, okundu/arşiv, `mailto:` yanıt
- [ ] **D9** Katılımcılar: CRUD, logo yükleme + önizleme, sürükle-bırak sıra, öne çıkar/yayından kaldır
- [ ] **D10** "Onaylanan başvurudan katılımcıya dönüştür" tek tık akışı
- [ ] **D11** Program + Konuşmacılar: gün bazlı liste, oturum CRUD, konuşmacı atama
- [ ] **D12** Sponsorlar, SSS, Sektörler, Basın: CRUD
- [ ] **D13** Galeri: albüm CRUD + çoklu görsel yükleme + sıralama
- [ ] **D14** Bülten aboneleri: liste + CSV
- [ ] **D15** Site Ayarları: tarih, yer, iletişim, istatistikler, duyuru çubuğu, stant fiyatları, başvuru anahtarı
- [ ] **D16** Kullanıcılar (yalnızca `owner`) + rol değiştirme + yeni admin ekleme talimatı
- [ ] **D17** Etkinlik Günlüğü
- [ ] **D18** Tüm admin sayfalarına `noindex, nofollow`
- [ ] **D19** TR/EN alanları yan yana sekmeli düzen (tüm CRUD formlarında)
- [ ] **D20** Yükleniyor / boş / hata durumlarının her biri tasarlanmış
- [ ] **D21** QC: `innerHTML` taraması **0 olmalı**; oturumsuz ve `editor` erişim testleri

## E) Kalite kontrol ve dokümantasyon

- [ ] **E1** 360 / 768 / 1024 / 1440px — yatay kaydırma yok, düzen bozulmuyor
- [ ] **E2** Klavye: menü, form, modal, lightbox, sekme, akordeon; focus görünür, modallarda focus kapanı
- [ ] **E3** TR ↔ EN parite + `hreflang` otomatik doğrulaması
- [ ] **E4** `tools/crawl.mjs` — kırık link + konsol hatası, `/giresun-expo/` alt yolunda
- [ ] **E5** `npx lighthouse` mobil: Performance ≥ 90, A11y ≥ 95, BP ≥ 95, SEO ≥ 95 — skorları raporla
- [ ] **E6** Supabase yapılandırılmamışken JSON yedek testi
- [ ] **E7** RLS kontrol listesinin fiili koşumu
- [ ] **E8** Her ana sayfanın mobil + masaüstü ekran görüntüsü, öz-eleştiri ve düzeltme turu
- [ ] **E9** `CLAUDE.md`: Supabase, admin, XSS kuralı, tasarım token'ları, yeni sayfa envanteri, `.placeholder` kuralının güncellenmesi — **GitHub Pages bölümü korunarak**
- [ ] **E10** `docs/ADMIN-KULLANIM.md` — organizatör kılavuzu
- [ ] **E11** `docs/acik-sorular.md` güncel; kapatılan maddeler işaretli
- [ ] **E12** Final commit; `git push` için ayrıca onay iste

---

## Aşama başına doğrulama

| Aşama | Kanıt |
|---|---|
| A | Kontrast tablosu (hepsi ≥ 4.5) · `ui-kit.html` ekran görüntüsü · `check-partials.mjs` temiz · konsol temiz |
| B | 4 genişlikte ekran görüntüsü · `crawl.mjs` 0 kırık link · TR/EN parite çıktısı |
| C | `config.js` boşken site çalışıyor · anon anahtarla RLS senaryoları beklenen sonucu veriyor |
| D | `innerHTML` sayacı 0 · oturumsuz/`editor` erişim denemeleri reddediliyor |
| E | Lighthouse skorları · klavye turu · ekran görüntüsü öz-eleştirisi |

Yerel önizleme `/giresun-expo/` alt yolu altında yapılır (junction + TcpListener tabanlı
`serve.ps1`; yönetici yetkisi gerektirmez).

---

## Review

### v1 — 22.09.2026

Boş klasörden çalışır iskelete geçildi: 18 HTML sayfası, tek dosyalık tasarım sistemi,
bağımlılıksız mobil menü.

**Yaklaşım:** Build step olmadığı için header/footer her dosyada tekrarlanmak zorunda.
Elle 18 kez yazmak yerine sayfalar tek seferlik bir üretici scriptle üretildi (scratchpad'de,
repoya girmedi) — ortak markup'ın 18 dosyada birebir aynı olması böyle garanti altına alındı.

**Doğrulama:** Tüm `href`/`src` dosya sistemine karşı kontrol edildi; tarayıcıda masaüstü ve
mobil genişlikte açıldı; mobil menünün açılıp kapanması ve `aria-expanded` senkronu doğrulandı;
konsol temiz.

**Git:** Makinede Git kurulu değildi; onayla `winget install Git.Git` (2.55.0) ile kuruldu,
kimlik global ayarlandı, `main` dalında commit atıldı. `.gitattributes` ile satır sonu
normalize edildi.

### v1 — GitHub Pages alt yolu

Site dosyalarında değişiklik gerekmedi: tüm yollar zaten göreliydi, kök-göreli yol yoktu,
CSS'te yalnızca data-URI vardı, `fetch`/JSON kullanımı yoktu. Site `/giresun-expo/` alt
yolunda sunulup 18 sayfanın tamamı gezilerek, her `href`/`src` ayrıca `fetch` ile 200
kontrolünden geçirilerek doğrulandı. `.nojekyll` eklendi, kurallar CLAUDE.md'ye yazıldı.

### v2 — Planlama, 22.09.2026

Brief mevcut kodla satır satır karşılaştırıldı. Brief'in "mevcut" saydığı **8 öğenin
hiçbiri gerçekte yoktu** (Poppins/Inter, `--color-sea`, Formspree, honeypot, JSON veri
dosyaları, kayıtlı crawl testi…); bunlar varsayım yerine ayrı iş kalemi olarak plana girdi.
En önemli sonucu: JSON yedek katmanı B'de içerik yazımının çıktısı olarak üretilecek, C'de
Supabase birincil kaynağa geçip JSON yedeğe düşecek ve aynı dosyalar `seed.sql`'i besleyecek.

Brief'in istediği WCAG AA denetimi yapıldı; **3 gerçek hata** ölçüldü (A5'te listeli).

Brief ile `CLAUDE.md` arasında 4 çelişki bulundu ve brief'in "dur ve sor" talimatı gereği
karara bağlandı (yukarıdaki "v2 — Kararlar" tablosu).
