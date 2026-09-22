# Açık Sorular

Kaynak: `docs/BRIEF-v2.md` · Plan: `tasks/todo.md`

Brief'te net olmayan ve cevabı işi değiştiren noktalar. **Kural:** cevap gelmeden ilgili
maddeye sıra gelirse, buradaki öneriyle ilerlenir ve o yer koda/metne
`TODO` olarak işaretlenir; burada da "varsayımla ilerlendi" notu düşülür.

**Durum etiketleri:** 🔴 cevap bekliyor · 🟡 varsayımla ilerlendi · ✅ kapandı

---

## Kapanmış olanlar

| # | Konu | Karar | Tarih |
|---|---|---|---|
| ✅ | Font: brief "Poppins/Inter (mevcut)" diyordu, ikisi de yoktu; CLAUDE.md "harici font/CDN yok" diyor | **Self-hosted Poppins + Inter** — `assets/fonts/*.woff2`, `@font-face`. CDN yok, her iki kural da korunuyor | 22.09.2026 |
| ✅ | Ortak markup: 41 dosyada header/footer elle senkron tutulamaz, brief "build aracı yok" diyor | **Elle tekrar + `tools/check-partials.mjs` sapma denetleyicisi.** HTML statik kalır | 22.09.2026 |
| ✅ | Sayfa envanteri: brief §2'de Haberler ve Ziyaretçi Bilgileri yok | **Brief'e birebir uyulur.** `haberler.html` → `basin.html`, `ziyaretci.html` → `ziyaretci-kaydi.html`; ziyaret bilgileri ana sayfadaki "Konum ve ulaşım"a taşınır | 22.09.2026 |
| ✅ | Lighthouse: makinede Node yok, skor üretilemiyordu | **Node.js LTS kurulur**, `npx lighthouse` ile mobil skorlar raporlanır | 22.09.2026 |

---

## 1. Fuar bilgileri — B aşamasından önce gerekli

Bunlar metinlere ve `data/site-ayarlari.json`'a doğrudan giriyor. Brief "doğrulanamayan
istatistik veya iddia uydurma" dediği için boş bırakılanlar `TODO` olarak işaretlenecek.

| # | Soru | Durum | Varsayım / not |
|---|---|---|---|
| 1 | **Fuar yılı, kesin tarih aralığı ve yeri** | 🔴 | Brief'teki `GE-2027-0001` formatı **2027**'yi ima ediyor. Doğrulanana kadar tarihler `TODO`, geri sayım gizli kalır |
| 2 | Fuar alanının açık adresi ve harita koordinatı | 🔴 | Harita bölümü koordinat gelene kadar yer tutucu |
| 3 | Organizatör kurum adı (ve varsa kurumsal kimliği) | 🔴 | Hakkında ve yasal metinlerde "veri sorumlusu" olarak geçecek |
| 4 | Fuar ilk kez mi düzenleniyor? | 🔴 | Evet varsayılıyor → Hakkında'da zaman çizelgesi yerine "İlk kez düzenleniyor" vurgusu |
| 5 | Stant fiyatları yazılacak mı? | 🔴 | Varsayım: **"Fiyat için iletişime geçin"**. Site Ayarları'nda fiyat alanları yine de hazır olacak |
| 6 | 4 istatistiğin (rakamlarla fuar) etiket ve değerleri | 🔴 | Brief gereği Site Ayarları'ndan gelir, varsayılanlar `TODO` |
| 7 | Sosyal medya hesap adresleri | 🔴 | Footer ve İletişim'de şu an `#` |
| 8 | Basın iletişim kişisi (ad, unvan, e-posta, telefon) | 🔴 | Basın sayfası için |
| 9 | Sektör listesi brief'teki 8 başlıkla aynı kalsın mı? | 🔴 | Varsayım: evet — Fındık & Gıda, Tarım & Hayvancılık, Turizm & Konaklama, Yöresel Ürünler & El Sanatları, Yapı & İnşaat, Teknoloji & Girişimcilik, Lojistik & Ticaret, Kamu & Yerel Yönetimler |

## 2. Tasarım

| # | Soru | Durum | Varsayım / not |
|---|---|---|---|
| 10 | **`--color-sea` hangi renk?** Brief "mevcut değişkenleri koru" diyor ama bu token hiç yoktu | 🔴 | Öneri: `#0B3D62` (koyu lacivert). Üzerinde beyaz metin AA geçer, `--color-primary` ile çakışmaz, "Karadeniz" göndermesini karşılar |
| 11 | Boşluk skalası: mevcut 12 adım (4px→128px) korunsun mu, brief'teki 10 adıma (`--space-10: 128px`) yeniden numaralandırılsın mı? | 🔴 | **Öneri: korunsun.** Aralık zaten brief'in istediği 4px–128px; yeniden adlandırma `style.css`'in tamamını dolaylı etkiler, görünür fayda yok. Brief'in asıl amacı ("sabit px kullanma, 8px ızgara") zaten sağlanıyor |
| 12 | Hazır bir logo / kurumsal kimlik var mı? | 🔴 | Yoksa A12'de brief'in tarifine göre (fındık/yaprak işareti + kelime işareti) tasarlanacak. **Varsa gönderilmesi A12'yi gereksiz kılar** |
| 13 | Marka rengi olarak mevcut yeşil (#1F5F3F) + altın (#D4A017) onaylanıyor mu? | 🔴 | v1'de seçilmişti; logo tasarımı buna dayanacağı için A12'den önce teyit iyi olur |

## 3. Teknik

| # | Soru | Durum | Varsayım / not |
|---|---|---|---|
| 14 | **Supabase projesi açıldı mı?** `SUPABASE_URL` + anon key | 🔴 | C aşamasına kadar gerekli değil; `config.js` yer tutucuyla yazılır ve site JSON yedeğiyle çalışır |
| 15 | Yayın alan adı (canonical ve `og:image` mutlak URL'leri için) | 🔴 | Varsayım: `https://<kullanıcı>.github.io/giresun-expo/`. Özel alan adı gelirse B19 tekrarlanır |
| 16 | GitHub repo adı ve hesabı (push için) | 🔴 | v1'den beri açık; Pages yayını buna bağlı |
| 17 | Pano grafiği: elle yazılmış SVG mi, küçük bir kütüphane mi? | 🔴 | **Öneri: elle SVG** — CDN bağımlılığı eklemez, tek renkli basit bir çubuk/alan grafiği için yeterli |
| 18 | Bülten aboneliğinde çift onay (double opt-in) olacak mı? | 🔴 | Varsayım: hayır (tek adımlı kayıt). Çift onay e-posta gönderimi gerektirir → Supabase Edge Function + e-posta servisi, brief'te yok |
| 19 | `.ics` dosyaları için saat dilimi | 🟡 | `Europe/Istanbul` varsayılıyor |
| 20 | Başvuru/kayıt sonrası otomatik e-posta gönderilecek mi? | 🔴 | Brief'te yok. Varsayım: **hayır** — başarı ekranındaki numara yeterli. Gerekirse Edge Function ile sonradan eklenir |
| 21 | Admin oturumu için özel bir süre/2FA beklentisi var mı? | 🔴 | Varsayım: Supabase varsayılanları |

## 4. Hukuki

| # | Soru | Durum | Varsayım / not |
|---|---|---|---|
| 22 | KVKK / Çerez / Gizlilik metinlerini hangi hukuk danışmanı onaylayacak? | 🔴 | Taslaklar brief gereği "**Hukuki danışman tarafından gözden geçirilmelidir**" uyarısıyla yazılacak; uyarı hem sayfada hem burada duruyor |
| 23 | Veri sorumlusu olarak hangi tüzel kişi yazılacak? | 🔴 | Aydınlatma metninin zorunlu alanı; #3 ile birlikte cevaplanmalı |
| 24 | Başvuru ve kayıt verileri ne kadar süre saklanacak? | 🔴 | KVKK aydınlatma metninde belirtilmesi gerekiyor; varsayım yapılmayacak, `TODO` kalacak |

---

## Not — brief ile gerçek kod arasındaki uyuşmazlıklar

Brief birkaç yerde var olmayan bir temele atıf yapıyordu. Bunlar soru değil, tespit;
plana ayrı iş kalemi olarak girdiler:

| Brief'te | Gerçek |
|---|---|
| "Poppins, Inter **(mevcut)**" | Yoktu — sistem font yığını kullanılıyordu |
| `--color-sea` ("mevcut değişkenleri koru") | Token yoktu |
| `--color-warning`, `--color-info` | Yoktu (`success` / `danger` vardı) |
| "**Formspree yerine** Supabase'e yazar" | Formspree yoktu; formlarda `action` bile yoktu |
| "Honeypot ve istemci doğrulaması **aynen kalır**" | İkisi de yoktu |
| "public site **mevcut JSON dosyalarından** okumaya devam etsin" | `data/` klasörü ve hiç JSON yoktu |
| "`seed.sql` **mevcut JSON verilerini** aktarır" | Aynı sebeple kaynak yoktu |
| "**mevcut crawl testini** tekrar çalıştır" | Kaydedilmemişti, tek seferlik konsol snippet'iydi |

**Sonuç:** JSON katmanı B aşamasında içerik yazımının doğal çıktısı olarak üretilecek;
C'de Supabase birincil kaynağa geçecek, JSON yedeğe düşecek ve aynı dosyalar `seed.sql`'i
besleyecek. Böylece brief'in varsaydığı sıra tutarlı hâle geliyor.
