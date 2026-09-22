# Giresun Expo — Yapılacaklar

## Aşama 1 — İskelet (tamamlandı)

- [x] Klasör yapısını oluştur (TR kökte, EN `en/` altında)
- [x] `assets/css/style.css` — tasarım sistemi (token, tipografi, container, buton, kart, form)
- [x] Ortak header: hamburger menü + TR|EN dil değiştirici + "Stant Başvurusu" butonu
- [x] Ortak footer: 4 sütun + telif satırı
- [x] Header/footer'ı 18 sayfanın tamamına ekle
- [x] `assets/js/main.js` — mobil menü (aç/kapat, Esc, dışa tıklama, resize, aria-expanded)
- [x] 9 TR + 9 EN sayfa şablonu (yer tutucu içerikle)
- [x] `CLAUDE.md`, `README.md`, `.gitignore`
- [x] İç link doğrulaması — kırık link yok
- [x] Tarayıcı doğrulaması (masaüstü + mobil, konsol temiz)
- [x] `git init` + ilk commit (`main` dalı, commit `02dda87`)

## Aşama 2 — İçerik

- [ ] Fuar kimliği: kesin tarih, yer, slogan, logo dosyası
- [ ] Ana sayfa: hero metni, rakamlar, öne çıkanlar
- [ ] Fuar Hakkında: amaç, kapsam, düzenleyici kurumlar
- [ ] Katılımcılar: firma listesi + filtreleme
- [ ] Ziyaretçi: saatler, giriş koşulları, ulaşım, konaklama
- [ ] Program: gün gün oturumlar
- [ ] Galeri: görseller (`assets/img/`)
- [ ] Haberler: duyuru/bülten listesi
- [ ] İletişim: gerçek adres, telefon, e-posta, harita
- [ ] Tüm yer tutucuları (`.placeholder`) kaldır, CSS'ten stili sil

## Aşama 2.5 — GitHub Pages alt yolu (tamamlandı)

- [x] Tüm `href`/`src` değerlerini denetle — kök-göreli yol yok
- [x] CSS `url(...)` ve `@import` denetimi — yalnızca data-URI
- [x] `fetch`/JSON yolu denetimi — henüz kullanılmıyor, kural CLAUDE.md'ye yazıldı
- [x] Siteyi `/giresun-expo/` alt yolunda sunup 18 sayfayı gezerek doğrula
- [x] `.nojekyll` ekle
- [x] CLAUDE.md'ye "Yayın: GitHub Pages" kuralları
- [ ] Repoyu GitHub'a push et, Pages'i `main` dalından yayına al

## Aşama 3 — Teknik tamamlama

- [ ] Logo + favicon
- [ ] Stant başvuru ve iletişim formları için gönderim altyapısı (backend / form servisi)
- [ ] KVKK / gizlilik politikası sayfası (footer linki şu an `#`)
- [ ] Sosyal medya hesap linkleri (şu an `#`)
- [ ] OG görseli (`og:image`) ve canonical URL'ler (domain belli olunca)
- [ ] `sitemap.xml` + `robots.txt`
- [ ] Erişilebilirlik ve Lighthouse denetimi
- [ ] Yayın / hosting

## Review

### Aşama 1 — 22.09.2026

Boş klasörden çalışır iskelete geçildi. 18 HTML sayfası, tek dosyalık tasarım sistemi
ve bağımlılıksız bir mobil menü scripti üretildi.

**Yaklaşım:** Build step olmadığı için header/footer her dosyada tekrarlanmak zorunda.
Bunu elle 18 kez yazmak yerine sayfalar tek seferlik bir üretici scriptle
(scratchpad'de, repoya girmedi) üretildi — böylece ortak markup'ın 18 dosyada birebir
aynı olması garanti altına alındı. Bundan sonraki değişiklikler elle yapılacağı için
`CLAUDE.md` bu tekrarı ve hangi 4 alanın sayfadan sayfaya değiştiğini açıkça yazıyor.

**Doğrulama:** Tüm `href`/`src` değerleri dosya sistemine karşı kontrol edildi (kırık
link yok); sayfalar tarayıcıda masaüstü ve mobil genişlikte açıldı, mobil menünün
açılıp kapanması ve `aria-expanded` senkronu doğrulandı, konsol temiz.

**Git:** Makinede Git kurulu değildi; kullanıcı onayıyla `winget install Git.Git`
ile kuruldu (2.55.0), `user.name`/`user.email` global olarak ayarlandı, repo `main`
dalında başlatılıp tek commit atıldı. Satır sonu gürültüsünü önlemek için
`.gitattributes` (`* text=auto eol=lf`) eklendi.

**Not — bu oturumdan sonrası:** `git` PATH'e kurulum sırasında eklendi ama mevcut
kabuk oturumunda görünmeyebilir; yeni bir terminal açmak yeterli.
