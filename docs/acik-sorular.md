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
| 25 | Marka hex'leri logoyla uyuşmuyordu | **Çözüldü.** Sapma, PNG'nin yarı saydam düz alanlarındandı (alfa ≈ .9). Logo düzeltilip yeniden yazıldı; 5 rengin beşi de yeniden ölçümde birebir tuttu. Token'lar kitapçık değerleriyle yazıldı | 22.09 |
| 26 | Açık yeşil metin olarak AA'dan kalıyor | **Çözüldü.** `#6A9F2F` asla metin rengi değil; yalnızca grafik/ikon vurgusu. Kural CSS başlığına ve `tools/contrast.mjs`'in dekoratif bölümüne yazıldı | 22.09 |
| 27 | Logoda tarih gömülü, header'da okunmuyor | **Çözüldü.** CSS ile kırpma yapılmadı; `giresun-expo-logo-tarihsiz.png` eklendi. Header ve favicon türetimi tarihsiz, hero/footer/OG tarihli logoyu kullanır | 22.09 |
| 28 | `docs/` içinde ikiz PDF | **Çözüldü.** İçerikleri birebir aynıydı (SHA256 eşleşti). NFD kopya silindi, kalan ASCII adla yeniden adlandırıldı, `.gitignore`'a `docs/*.pdf` eklendi | 22.09 |
| 29a | GitHub repo | **Çözüldü.** `github.com/devmustafaozdemir/giresun-expo`, `origin` ayarlı, Pages `main`/root'tan açık | 22.09 |

---

## 🔴 Kitapçıktan doğan yeni sorular (EK §7)

| # | Soru | Durum | Etki / varsayım |
|---|---|---|---|
| 15 | **Logonun vektörel orijinali** (SVG/AI/PDF) ve **paydaş logolarının yüksek çözünürlüklü** halleri | 🔴 | PNG 1207×703; retina ekranda ve OG görselinde yumuşak görünecek. Paydaş logoları daha da düşük çözünürlüklü. Gelene kadar PNG ile ilerlenir |
| 16 | **Fotoğrafların yüksek çözünürlüklü orijinalleri** | 🔴 | Mevcutlar en geniş ~1050px. Hero'da tam genişlik kullanılamaz → marka renginde overlay + sınırlı boyut (A16) |
| 17 | **E-posta adresi ve sosyal medya hesapları** | 🔴 | EK §4 gereği alanlar boş kalır ve **sitede hiç görünmez**. Kırık link veya "TODO" yazısı olmayacak |
| 18 | **Ziyaretçi girişi ücretli mi, ücretsiz mi? Kayıt zorunlu mu?** | 🔴 | O zamana kadar **"Ön kayıt"** olarak çalışır, **"ücretsiz" iddiası yazılmaz** (EK §4) |
| 19 | **Etkinlik programı, konuşmacılar, paneller var mı?** | 🔴 | Program sayfası "yakında açıklanacak" durumunda; oturum eklenmezse menüde **Program yerine Ziyaret Bilgileri** görünür |
| 20 | **86 firmanın logoları toplanacak mı?** | 🟡 | **43/86 tamam.** Logolar kitapçığın 8. sayfasındaki "Katılımcı Firmalarımızdan Bazıları" bölümünden çıkarıldı (vektör oldukları için sayfa 4× render edilip otomatik kesildi, eşleştirme elle yapıldı). Kalan **43 firma monogramla** gösteriliyor; logoları organizatörden gelirse `assets/img/exhibitors/README.md`'deki adımlarla tek tek eklenir |
| 21 | **Irmak**, **Hız İnşaat** ve **FAR Elektrik** stant listesinde neden yok? | 🔴 | Kitapçığın logo sayfasında var, stant listesinde yok. **FAR Elektrik Teknolojileri'ni logoları çıkarırken ben buldum** — `KITAPCIK-ICERIK.md` yalnızca ilk ikisini not etmişti. Üçü de `exhibitors.json`'da yok → 86 sayısı bunlar olmadan. Logoları da kullanılmadı |
| 22 | **"ANADOLU İNDİKSİYON"** yazımı doğru mu? | 🔴 | "İndüksiyon" olabilir. Kitapçıktaki hâliyle bırakıldı; teyit gerekiyor. ("ALİMİNYUM" → "Alüminyum" olarak düzeltilmiş) |
| 23 | **Salon planı (A/T/G/P/E krokisi)** var mı? | 🔴 | Varsa Ziyaret Bilgileri sayfasına kroki eklenir; yoksa yalnızca salon filtresi ve stant numarası |
| 24 | **Firma sektörlerinin doğrulanması** | 🔴 | 17 sektör firma adından **tahmin**. Admin panelde (D9) doğrulama akışı olacak. Sitede sektör filtresi çalışır ama hata payı var |

---

## Benim tespit ettiğim sorunlar

### ✅ 25–28 — A aşamasında kapandı

Ayrıntıları yukarıdaki kapananlar tablosunda. Kısaca:

- **25** Marka hex sapması: PNG'nin yarı saydam düz alanlarından kaynaklanıyordu. Logo
  düzeltildi, yeniden ölçüldü, beş renk de birebir tuttu (ΔE 0).
- **26** `#6A9F2F` metin olarak 3.18 ile AA'dan kalıyor → yalnızca grafik/ikon vurgusu.
  Kural `style.css` başlığında ve `tools/contrast.mjs`'in dekoratif bölümünde yazılı.
- **27** Logodaki gömülü tarih: CSS kırpma yerine `giresun-expo-logo-tarihsiz.png` geldi.
- **28** İkiz PDF: içerik aynıydı (SHA256 eşleşti), NFD kopya silindi, ASCII ada geçildi.

### ✅ 30. Basın sayfasından kitapçık indirmesi — çözüldü

`assets/files/giresun-expo-2026-el-kitapcigi.pdf` eklendi: **8.07 MB → 2.17 MB (%73)**.

**Sıkıştırma yöntemi — görüntüleme açısından kayıpsız.** Dosyanın %76'sının tek bir
nesne olduğu tespit edildi: `/PieceInfo … /Private` altında **Adobe Illustrator'ın
gömülü düzenleme verisi** (6.1 MB). Hiçbir PDF görüntüleyici bu veriyi okumaz;
yalnızca dosyanın Illustrator'da katmanlı olarak yeniden açılmasını sağlar.
Bu veri ve referanssız kalan 4 nesne atıldı.

- **Hiçbir görsel küçültülmedi, hiçbir metin rasterleştirilmedi.**
- Metin vektör olarak kaldı: seçilebilir, aranabilir, her yakınlaştırmada net.
- 12 sayfanın tamamı tarayıcıda doğrulandı.
- Kaybolan tek şey: Illustrator'da katmanlı açılabilme. Orijinal `docs/` altında
  duruyor (git dışında), gerekirse oradan alınır.

Üretim script'i: `tools/pdf-optimize.mjs`. Orijinal PDF'ler `.gitignore`'da kalmaya
devam ediyor (`docs/*.pdf`).

### 29. Özel alan adı — 🟡 alt yol varsayımıyla ilerleniyor

Repo ve Pages hazır: `https://devmustafaozdemir.github.io/giresun-expo/`

Kitapçık **giresunexpo.com** yazıyor ama alan adı şimdilik bağlanmayacak.
Bağlandığında site **kök dizine** taşınır ve `/giresun-expo/` alt yolu düşer.

**Alınan önlem:** canonical, `og:image` ve `sitemap.xml` URL'leri tek bir `SITE_URL`
sabitinden üretilecek (B19), böylece alan adı değiştiğinde tek yerden güncellenir.
Sayfa içi yolların tamamı göreli olduğu için taşınma sitenin çalışmasını etkilemez.

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
| 38 | **Başvuru numarasındaki yıl: gönderim yılı mı, fuar yılı mı?** | 🟡 | Stant formu **2027 ön başvurusu** (2026 stantları dağıtıldı), ama numara üreteci **gönderim yılını** alıyor. Yani 2026'da gelen bir 2027 başvurusu `GE-2026-0001` oluyor. **Mevcut varsayım: gönderim yılı** (numara bir referans/bilet numarası; zaman içinde tekilliği korur, sabit bir yıl gömmek gerekmez). Fuar yılı istenirse `001_init.sql` içindeki `set_application_no()` fonksiyonunda tek satır: `to_char(now() ...,'YYYY')` yerine `'2027'`. Ziyaretçi kaydı için soru yok — o 2026 fuarı için |

---

## Not — BRIEF-v2 ile gerçek durum arasındaki uyuşmazlıklar

Orijinal brief'in "mevcut" saydığı 8 öğenin hiçbiri gerçekte yoktu (Poppins/Inter,
`--color-sea`, Formspree, honeypot, JSON veri dosyaları, kayıtlı crawl testi, seed kaynağı,
`--color-warning`/`info`). Bunlar varsayım yerine ayrı iş kalemi olarak plana girdi.

EK bunların bir kısmını çözdü: JSON veri artık **var** (`data/exhibitors.json`, 86 firma),
`--color-sea` yerine `--color-secondary` geldi, logo sorusu kapandı.
