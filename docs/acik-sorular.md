# Açık Sorular

**Kaynak önceliği:** `docs/BRIEF-v2-EK.md` → `docs/KITAPCIK-ICERIK.md` → `docs/BRIEF-v2.md`
Plan: `tasks/todo.md`

**Kural:** cevap gelmeden ilgili maddeye sıra gelirse buradaki öneriyle ilerlenir, kodda/metinde
işaretlenir ve burada "varsayımla ilerlendi" notu düşülür.

**Durum:** 🔴 cevap bekliyor · 🟡 varsayımla ilerlendi · ✅ kapandı

---

## ✅ Kapananlar

| # | Konu | Karar | Tarih |
|---|---|---|---|
| 1 | Font | Self-hosted Poppins + Inter, CDN yok | 22.09 |
| 2 | Ortak markup (43 dosya) | Elle tekrar + `tools/check-partials.mjs` | 22.09 |
| 3 | Lighthouse | Node.js LTS kurulacak, CLI'dan ölçülecek | 22.09 |
| 4 | Boşluk skalası | **Mevcut 12 adım korunuyor** | 22.09 |
| 5 | **Logo var mı?** | **VAR** — `assets/img/brand/giresun-expo-logo.png`. Tasarım iptal; yalnızca favicon (halka işaretinden) + OG görseli üretilecek | 22.09 |
| 6 | **Marka renkleri** | v1'deki yeşil/altın **iptal**. `#005E44` yeşil + `#184181` lacivert ana; `#085494`, `#6A9F2F`, `#3D351C` küçük vurgu. `--color-sea` → `--color-secondary` | 22.09 |
| 7 | **Fuar tarihi ve yeri** | **8–11 Ekim 2026**, İstanbul Yenikapı Dr. Mimar Kadir Topbaş Gösteri ve Sanat Merkezi. `TODO` değil | 22.09 |
| 8 | **Geri sayım** | Açık. Hedef: 8 Ekim 2026 10:00, `Europe/Istanbul` | 22.09 |
| 9 | **İstatistikler** | Yalnızca doğrulanabilir 4 tanesi: 86 katılımcı firma · 4 gün · 3 paydaş kuruluş · 5 salon (A/T/G/P/E) | 22.09 |
| 10 | Organizatör | Giresun Vakfı + Giresun Federasyonu + ŞEBİNSİAD ortaklığı | 22.09 |
| 11 | Telefon | 0541 662 28 28 (`tel:+905416622828`) | 22.09 |
| 12 | Sektör listesi | Kitapçıkta yok; firma adlarından türetilen **17 sektör** `data/exhibitors.json` içinde | 22.09 |
| 13 | Stant fiyatları | Konu değişti: stantlar dağıtılmış. Form "Giresun EXPO **2027** ön başvurusu" olarak çalışacak | 22.09 |
| 14 | Öncelik sırası | **A + B → YAYIN → C + D → E** (EK §6) | 22.09 |

---

## 🔴 Kitapçıktan doğan yeni sorular (EK §7)

| # | Soru | Durum | Etki / varsayım |
|---|---|---|---|
| 15 | **Logonun vektörel orijinali** (SVG/AI/PDF) ve **paydaş logolarının yüksek çözünürlüklü** halleri | 🔴 | PNG 1207×703; retina ekranda ve OG görselinde yumuşak görünecek. Paydaş logoları daha da düşük çözünürlüklü. Gelene kadar PNG ile ilerlenir |
| 16 | **Fotoğrafların yüksek çözünürlüklü orijinalleri** | 🔴 | Mevcutlar en geniş ~1050px. Hero'da tam genişlik kullanılamaz → marka renginde overlay + sınırlı boyut (A16) |
| 17 | **E-posta adresi ve sosyal medya hesapları** | 🔴 | EK §4 gereği alanlar boş kalır ve **sitede hiç görünmez**. Kırık link veya "TODO" yazısı olmayacak |
| 18 | **Ziyaretçi girişi ücretli mi, ücretsiz mi? Kayıt zorunlu mu?** | 🔴 | O zamana kadar **"Ön kayıt"** olarak çalışır, **"ücretsiz" iddiası yazılmaz** (EK §4) |
| 19 | **Etkinlik programı, konuşmacılar, paneller var mı?** | 🔴 | Program sayfası "yakında açıklanacak" durumunda; oturum eklenmezse menüde **Program yerine Ziyaret Bilgileri** görünür |
| 20 | **86 firmanın logoları toplanacak mı?** | 🔴 | Logosuz firmalar için baş harflerden **monogram kartı** kullanılacak (A18) |
| 21 | **Irmak** ve **Hız İnşaat** stant listesinde neden yok? | 🔴 | Kitapçığın logo sayfasında var, stant listesinde yok. Şu an `exhibitors.json`'da yoklar → 86 sayısı bu ikisi olmadan |
| 22 | **"ANADOLU İNDİKSİYON"** yazımı doğru mu? | 🔴 | "İndüksiyon" olabilir. Kitapçıktaki hâliyle bırakıldı; teyit gerekiyor. ("ALİMİNYUM" → "Alüminyum" olarak düzeltilmiş) |
| 23 | **Salon planı (A/T/G/P/E krokisi)** var mı? | 🔴 | Varsa Ziyaret Bilgileri sayfasına kroki eklenir; yoksa yalnızca salon filtresi ve stant numarası |
| 24 | **Firma sektörlerinin doğrulanması** | 🔴 | 17 sektör firma adından **tahmin**. Admin panelde (D9) doğrulama akışı olacak. Sitede sektör filtresi çalışır ama hata payı var |

---

## 🔴 Benim tespit ettiğim yeni sorunlar

### 25. Verilen marka hex değerleri logodaki gerçek piksellerle uyuşmuyor — **A4'ten önce karar gerek**

Logo PNG'sinde renk profili yok (`iCCP`/`sRGB`/`gAMA`/`cHRM` chunk'ı yok), yani ölçülen
piksel değerleri dosyanın gerçek sRGB değerleri.

| Öğe | Belirtilen | Logoda ölçülen | ΔE76 | Değerlendirme |
|---|---|---|---|---|
| Yeşil (GİRESUN) | `#005E44` | `#005E44` | **0** | aynı ✅ |
| **Lacivert (EXPO)** | `#184181` | `#002D73` | **10.7** | çok farklı |
| Mavi (halka) | `#085494` | `#004E90` | 3.1 | dikkatle bakınca fark edilir |
| **Açık yeşil (halka)** | `#6A9F2F` | `#488900` | **11.0** | çok farklı |
| **Toprak kahve (halka)** | `#3D351C` | `#251C00` | **11.7** | çok farklı |

**Neden önemli:** lacivert ana marka rengi ve logonun hemen yanında kullanılacak. Site
lacivertı `#184181`, logodaki "EXPO" `#002D73` olursa yan yana durduklarında fark görünür —
tam olarak brief'in "özür dilenmemeli" ölçütüne takılan cinsten bir kusur.

**Öneri:** logodan ölçülen değerler kullanılsın (`#002D73`, `#004E90`, `#488900`, `#251C00`).
İkisi de WCAG AA geçiyor, ölçülen değerler biraz daha koyu ve kontrastı daha yüksek.
**Alternatif:** vektörel orijinal (#15) gelince ondan yeniden ölçülür — en doğrusu bu.

### 26. Açık yeşil metin rengi olarak WCAG AA'dan kalıyor

`#6A9F2F` / beyaz = **3.18** (normal metin için 4.5 gerekiyor). Ölçülen `#488900` de 4.33 ile kalıyor.

**Karar (varsayımla ilerlenecek):** 🟡 Açık yeşil **asla metin rengi olarak kullanılmayacak** —
yalnızca halka motifi, ikon ve grafik vurgu (grafik öğe eşiği 3:1'i geçiyor). EK'in
"yalnızca küçük vurgularda, logodaki halka gibi" ifadesiyle zaten uyumlu.

### 27. Logoda tarih gömülü — header boyutu sorunu

Logo 1207×703 (1.72:1) ve içinde **"8 - 11 Ekim 2026"** yazısı var. Header'da ~180px
genişlikte kullanılırsa tarih satırı okunamaz hale gelir (yaklaşık 5px yükseklik).

EK §2: *"Logoyu yeniden çizme veya renklerini değiştirme."*

Seçenekler:
- **(a)** Header'da logo büyük kullanılır (yüksek header) — sayfa üstünde çok yer kaplar
- **(b)** Header'da logonun üst kısmı (GİRESUN EXPO + halka, tarihsiz) kırpılarak kullanılır;
  tam tarihli logo hero'da ve footer'da görünür — **önerim bu**
- **(c)** Header'da logo yerine metin logotipi; tam logo yalnızca hero'da

🔴 Kırpmanın "yeniden çizme" sayılıp sayılmadığı organizatöre sorulmalı. Cevap gelmezse
**(b)** ile ilerlenir ve orijinal dosya değiştirilmez (CSS ile kırpma).

### 28. `docs/` içinde aynı adlı iki PDF var

İki dosya görsel olarak aynı ada sahip ama **farklı Unicode normalizasyonunda** (NFC ve NFD):
biri 34, diğeri 32 karakter. İkisi de 8.4 MB → repoda **16.9 MB gereksiz yük**.

**Karar (A1'de uygulanacak):** 🟡 biri silinecek, kalan `docs/giresun-expo-2026-el-kitapcigi.pdf`
olarak ASCII adla yeniden adlandırılacak (CLAUDE.md'nin ASCII dosya adı kuralı + URL'de
yüzde-kodlama ve normalizasyon sorunlarını önlemek için). Basın sayfasından indirme linki
verileceği için adın stabil olması gerekiyor.

### 29. GitHub repo ve yayın adresi — **yayın için gerekli**

| Soru | Durum |
|---|---|
| GitHub hesabı ve repo adı | 🔴 push yapılamıyor |
| Yayın `giresunexpo.com` özel alan adına mı bağlanacak, yoksa `github.io/giresun-expo/` mi kalacak? | 🔴 |

Kitapçık **giresunexpo.com** yazıyor. Özel alan adı kullanılacaksa:
- CNAME dosyası gerekir ve site **kök dizinde** yayınlanır → `/giresun-expo/` alt yol varsayımı düşer
- Canonical ve `og:image` mutlak URL'leri buna göre yazılır

🟡 Cevap gelene kadar `/giresun-expo/` alt yolu varsayımıyla ilerlenir (tüm yollar göreli
olduğu için alan adı değişse de site çalışır; yalnızca canonical/OG mutlak URL'leri güncellenir).

---

## 🔴 Devam eden (önceki listeden)

| # | Soru | Durum | Not |
|---|---|---|---|
| 30 | Pano grafiği: elle SVG mi, kütüphane mi? | 🟡 | Öneri: elle SVG — CDN bağımlılığı yok. D aşamasında |
| 31 | Bültende çift onay (double opt-in)? | 🟡 | Varsayım: hayır. Çift onay e-posta servisi gerektirir, brief'te yok |
| 32 | Başvuru/kayıt sonrası otomatik e-posta? | 🟡 | Varsayım: hayır — başarı ekranındaki numara yeterli |
| 33 | `.ics` saat dilimi | 🟡 | `Europe/Istanbul` |
| 34 | KVKK/Çerez/Gizlilik metinlerini kim onaylayacak? | 🔴 | Taslaklar "hukuki danışman gözden geçirmeli" uyarısıyla yazılacak |
| 35 | Veri sorumlusu hangi tüzel kişi? | 🔴 | Üç paydaştan hangisi? Aydınlatma metninin zorunlu alanı |
| 36 | Başvuru/kayıt verileri ne kadar saklanacak? | 🔴 | KVKK metninde belirtilmesi gerekiyor; varsayım yapılmayacak |
| 37 | Admin oturumu için özel süre/2FA beklentisi? | 🟡 | Varsayım: Supabase varsayılanları |

---

## Not — BRIEF-v2 ile gerçek durum arasındaki uyuşmazlıklar

Orijinal brief'in "mevcut" saydığı 8 öğenin hiçbiri gerçekte yoktu (Poppins/Inter,
`--color-sea`, Formspree, honeypot, JSON veri dosyaları, kayıtlı crawl testi, seed kaynağı,
`--color-warning`/`info`). Bunlar varsayım yerine ayrı iş kalemi olarak plana girdi.

EK bunların bir kısmını çözdü: JSON veri artık **var** (`data/exhibitors.json`, 86 firma),
`--color-sea` yerine `--color-secondary` geldi, logo sorusu kapandı.
