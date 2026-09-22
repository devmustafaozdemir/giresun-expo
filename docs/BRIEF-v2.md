# Giresun Expo — v2 Brief: Profesyonel Arayüz, İçerik ve Admin Paneli

> Bu dosyayı proje içinde `docs/BRIEF-v2.md` olarak sakla. Claude Code her aşamada buraya bakar.
> Mevcut `CLAUDE.md` kuralları (statik site, göreli yollar, GitHub Pages, TR/EN ayrı dosyalar) geçerliliğini korur.
> Bu brief ile çelişen bir kural görürsen **dur ve sor**, kendi başına karar verme.

---

## 0. Hedef

Şu anki site çalışıyor ama "şablon gibi" duruyor. v2'nin hedefi:

- **Profesyonel ama sade:** kurumsal bir fuar organizatörünün sitesi gibi güven veren, kalabalık olmayan, nefes alan bir tasarım.
- **Gerçek içerik:** lorem ipsum veya "Başlık buraya" yok. Her bölümün yayına hazır, iyi yazılmış Türkçe ve İngilizce metni olacak.
- **Admin paneli:** organizatör kod bilmeden başvuruları yönetebilecek, katılımcıları, programı, sponsorları, galeriyi ve site ayarlarını düzenleyebilecek.

**Ölçüt:** Site bir fuar yönetimine "bu bizim sitemiz" diye gösterildiğinde hiçbir bölüm için özür dilenmemeli.

---

## 1. Tasarım Yönü

### 1.1 Karakter

- Anahtar kelimeler: güvenilir, ferah, yerel ama modern, net.
- İlham: iyi kurgulanmış uluslararası fuar siteleri ve modern SaaS landing sayfaları. Hiçbir siteyi kopyalama.
- Kaçınılacaklar: her yerde gradyan, gereksiz animasyon, kart içinde kart, 5 farklı buton stili, ortalanmış uzun paragraflar, stok "el sıkışan iş insanları" hissi.

### 1.2 Renk (mevcut değişkenleri koru, kullanımı disipline et)

- Sayfanın %80'i nötr: `--color-bg`, `--color-surface`, metin renkleri.
- `--color-primary` (Karadeniz yeşili): ana butonlar, linkler, vurgu başlıkları.
- `--color-accent` (fındık): yalnızca küçük vurgular, rozetler, ikon arka planları. Büyük alanlarda kullanma.
- `--color-sea`: ikincil bölüm arka planları (koyu bant, footer) için.
- Durum renkleri ekle: `--color-success`, `--color-warning`, `--color-danger`, `--color-info` (admin panelde de kullanılacak).
- Tüm metin/arka plan kombinasyonları WCAG AA kontrastını geçmeli. Kontrol et, sonucu raporla.

### 1.3 Tipografi

- Başlıklar Poppins, metin Inter (mevcut). Ağırlıkları sınırla: 400, 500, 600, 700.
- `clamp()` ile akışkan ölçek: h1 ≈ 40→64px, h2 ≈ 30→44px, h3 ≈ 20→24px, gövde 16→18px.
- Satır uzunluğu en fazla ~70 karakter (`max-width: 65ch`).
- Her bölüm başlığının üstünde küçük bir "eyebrow" etiketi (ör. `SEKTÖRLER`, harf aralığı açık, accent renk).

### 1.4 Boşluk ve düzen

- 8px ızgara: `--space-1: 4px` … `--space-10: 128px` token'ları tanımla, sabit px kullanma.
- Bölümler arası dikey boşluk masaüstünde 96–128px, mobilde 64px.
- Container 1200px; metin ağırlıklı içerik için dar container (760px).
- Kart köşe yarıçapı ve gölge tek tip olmalı. Gölgeler çok hafif, hover'da hafif yükselme.

### 1.5 Görseller ve ikonlar

Gerçek fotoğraf henüz yok. Uydurma stok görsel ekleme, telifli görsel hotlink etme. Onun yerine:

- **Özenli SVG çizimler ve desenler üret:** fındık yaprağı motifi, Karadeniz dalga çizgisi, Giresun Adası silueti, sade topografik doku. Hero ve bant arka planlarında düşük opaklıkla kullan.
- **Fotoğraf gelecek yerler için** oranı sabit görsel yuvaları (`aspect-ratio`) yap. Yumuşak nötr zeminli, küçük bir ikon ve "Fotoğraf eklenecek" etiketli, şık bir yer tutucu olsun. Admin panelden görsel yüklenince otomatik yerine geçsin.
- **İkonlar:** Lucide ikonlarından gerekenleri inline SVG olarak `assets/icons/` altına kopyala (kütüphane yükleme). Tek çizgi kalınlığı (1.75), tek boyut sistemi.
- **Logo:** "Giresun Expo" için sade bir SVG logotip tasarla (fındık/yaprak ile birleşen bir işaret + kelime işareti). Açık ve koyu zemin versiyonu, favicon (SVG + 32px PNG) ve OG görseli (1200×630) üret.

### 1.6 Hareket

- Sadece anlamlı mikro etkileşimler: buton hover, kart hover, menü açılışı, bölümlere girişte hafif fade/slide (IntersectionObserver).
- Süreler 150–300ms. `prefers-reduced-motion` altında hepsi kapanır.

### 1.7 Bileşen kütüphanesi

`style.css` içinde, BEM benzeri net isimlerle, tek bir tutarlı set:

- **Buton:** primary, secondary (outline), ghost, küçük/büyük boyut, ikonlu, yükleniyor durumu, disabled.
- **Kart:** bilgi kartı, katılımcı kartı, konuşmacı kartı, istatistik kartı.
- Rozet/etiket, sekme (tabs), akordeon (SSS), modal/lightbox, toast bildirimi, form alanları (hata, yardım metni, başarılı durumları), boş durum (empty state), iskelet yükleyici (skeleton).
- `docs/ui-kit.html` diye (noindex) bir sayfa yap ve tüm bileşenleri orada göster. Bu hem senin kontrol listen hem de organizatöre sunulacak bir referans.

---

## 2. Sayfa Sayfa İçerik ve Yapı

Her sayfa TR ve EN olarak eksiksiz yapılır. İngilizce metin birebir çeviri değil, doğal İngilizce olmalı.

### Yazım kuralları

- Ton: kurumsal, sıcak, net. Abartılı reklam dili yok ("eşsiz", "muhteşem", "en iyi" gibi boş sıfatlar yok).
- Kısa paragraflar (2–3 cümle), taranabilir başlıklar, eylem odaklı buton metinleri ("Stant Başvurusu Yap", "Ücretsiz Kayıt Ol").
- Doğrulanamayan istatistik veya iddia uydurma. Ziyaretçi sayısı, katılımcı sayısı, m² gibi rakamlar admin panelindeki "Site Ayarları"ndan gelsin ve varsayılan değerleri `TODO` olarak işaretli olsun.
- Giresun hakkında yalnızca genel kabul görmüş bilgileri kullan: Karadeniz kıyısında olması, fındık üretimindeki önemi, Giresun Adası, doğa ve yayla turizmi, Aksu Festivali gibi. Emin olmadığın hiçbir tarih veya rakamı yazma.
- Tüm metinleri ayrıca `docs/icerik-metinleri.md` dosyasında (TR + EN) topla ki organizatör tek yerden okuyup onaylayabilsin.

### 2.1 Ana Sayfa

- **Duyuru çubuğu** (isteğe bağlı, admin'den açılıp kapanır): ör. "Erken kayıt indirimi 31 Mart'a kadar."
- **Hero:** güçlü başlık + tek cümlelik alt başlık, tarih ve yer bilgisi (ikonlu), iki CTA (Stant Başvurusu / Ziyaretçi Kaydı), sağda veya arka planda SVG illüstrasyon. Geri sayım hero'nun altında zarif bir şerit olarak yer alsın.
- **Rakamlarla fuar:** 4 istatistik (Site Ayarları'ndan).
- **Fuar hakkında kısa özet:** 2 sütun (metin + görsel yuvası), "Daha fazla bilgi" linki.
- **Sektörler:** 6–8 sektör kartı, ikonlu, kısa açıklamalı (Fındık & Gıda, Tarım & Hayvancılık, Turizm & Konaklama, Yöresel Ürünler & El Sanatları, Yapı & İnşaat, Teknoloji & Girişimcilik, Lojistik & Ticaret, Kamu & Yerel Yönetimler).
- **Neden katılmalısınız?** Katılımcı ve ziyaretçi için iki sekmeli fayda listesi.
- **Öne çıkan katılımcılar** (admin'de "öne çıkan" işaretliler).
- **Program önizlemesi:** ilk günün 3–4 oturumu + "Tüm program" linki.
- **Sponsorlar:** seviyelere göre (Ana Sponsor, Altın, Gümüş, Destekçiler); logo yoksa şık yer tutucu.
- **SSS:** 6–8 soru, akordeon (admin'den yönetilebilir).
- **Konum ve ulaşım:** harita (tıklanınca yüklenen, gizlilik dostu embed) + havalimanı, otogar ve otopark bilgisi.
- **Bülten/CTA bandı:** "Fuar haberlerinden haberdar olun" (e-posta toplama → Supabase).

### 2.2 Hakkında

Fuarın amacı, vizyon ve misyon, organizatör hakkında, neden Giresun, geçmiş yıllar/zaman çizelgesi (ilk yılsa "İlk kez düzenleniyor" vurgusu), ekip/iletişim kişileri (yer tutucu).

### 2.3 Katılımcılar

Arama + sektör filtresi + A–Z sıralama; kart ızgarası (logo, ad, sektör, stant no); karta tıklayınca detay modalı (açıklama, web sitesi, sosyal medya). Sonuç yoksa özenli boş durum ekranı.

### 2.4 Program

Gün sekmeleri, zaman çizelgesi görünümü, oturum türü rozetleri (Açılış, Panel, Atölye, B2B, Kültürel), salon filtresi, konuşmacı kartları. "Takvime ekle" (`.ics` indirme) özelliği.

### 2.5 Katılımcı Ol (Stant Başvurusu)

Üstte ikna edici bölüm: neden stant açmalı, stant tipleri tablosu (Hazır Stant / Boş Alan / Açık Alan; fiyatlar Site Ayarları'ndan gelsin ya da "Fiyat için iletişime geçin"), süreç adımları (Başvuru → Değerlendirme → Sözleşme → Kurulum). Altta çok adımlı form (1. Firma bilgileri, 2. Stant tercihi, 3. Onay ve gönder), ilerleme göstergesi, adım adım doğrulama, başarı ekranı ve başvuru numarası.

### 2.6 Ziyaretçi Kaydı

Kısa form, KVKK onayı, başarı ekranında "Kayıt numaranız" ve takvime ekle butonu.

### 2.7 Galeri

Albümlere göre (admin'den), masonry veya düzenli ızgara, erişilebilir lightbox. Görsel yoksa boş durum ekranı.

### 2.8 Basın (yeni)

Basın bültenleri listesi, basın kiti indirme (logo paketi), basın iletişim kişisi.

### 2.9 İletişim

İletişim kartları (adres, telefon, e-posta, çalışma saatleri), form, harita, sosyal medya.

### 2.10 Yasal

KVKK Aydınlatma Metni, Çerez Politikası, Gizlilik (TR/EN). Genel geçer ve makul bir taslak yaz, en üste "Hukuki danışman tarafından gözden geçirilmelidir" notunu ekle (yalnızca HTML yorumu olarak değil, organizatörün göreceği şekilde `docs/` altında da belirt). Basit bir çerez bildirimi ekle (yalnızca gerekli çerezler kullanıldığını söyleyen, sade bir bant).

### 2.11 404

Stili sayfa içine gömülü (CLAUDE.md'deki not), ana sayfaya ve iletişime link.

---

## 3. Admin Paneli (Supabase)

### 3.1 Mimari

- Site GitHub Pages'te statik kalır. Veri ve kimlik doğrulama Supabase ile yapılır (tarayıcıdan `@supabase/supabase-js`, jsDelivr üzerinden sabit sürüm ile ESM import).
- `assets/js/config.js`: `SUPABASE_URL` ve `SUPABASE_ANON_KEY` (yer tutucu). Anon key tarayıcıda durabilir. `service_role` key asla repoya girmez.
- **Yedekli çalışma:** `config.js` boşsa veya Supabase'e ulaşılamıyorsa public site mevcut JSON dosyalarından okumaya devam etsin. Site Supabase kurulmadan da düzgün görünmeli.
- Formlar Formspree yerine Supabase'e yazar. Honeypot ve istemci doğrulaması aynen kalır.

### 3.2 Veritabanı (`supabase/migrations/001_init.sql`)

Tablolar (hepsinde `id uuid`, `created_at`, `updated_at`; çok dilli alanlar `_tr` / `_en` sütunları):

- `site_settings` (tek satır): fuar adı, tarih başlangıç/bitiş, yer, adres, harita koordinatı, telefon, e-posta, sosyal linkler, istatistikler (4 adet etiket + değer), duyuru çubuğu (metin TR/EN + aktif mi), stant fiyatları, başvurular açık mı?
- `exhibitors`: ad, slug, sektör, stant no, logo_url, açıklama TR/EN, web, sosyal linkler, öne çıkan mı, yayında mı, sıra.
- `sectors`: ad TR/EN, ikon adı, sıra.
- `program_sessions`: gün, başlangıç/bitiş saati, başlık TR/EN, açıklama TR/EN, tür, salon, konuşmacılar (ilişki), yayında mı.
- `speakers`: ad, unvan TR/EN, kurum, fotoğraf_url, biyografi TR/EN.
- `sponsors`: ad, seviye, logo_url, web, sıra.
- `faqs`: soru TR/EN, cevap TR/EN, sıra, yayında mı.
- `gallery_albums`, `gallery_images` (url, alt metin TR/EN, sıra).
- `press_releases`: başlık, tarih, özet, dosya_url.
- `stand_applications`: firma alanları, stant tercihi, m², not, durum (`new`, `reviewing`, `approved`, `rejected`, `contracted`), admin notu, başvuru numarası (ör. `GE-2027-0001`, veritabanında otomatik üretilsin), KVKK onay zamanı.
- `visitor_registrations`: ad soyad, e-posta, telefon, şehir, sektör, katılım günleri, kayıt numarası, check-in zamanı (boş olabilir).
- `contact_messages`: ad, e-posta, konu, mesaj, okundu mu, arşiv mi.
- `newsletter_subscribers`: e-posta (benzersiz), dil.
- `admins`: `user_id` (auth.users referansı), rol (`owner`, `editor`).
- `activity_log`: kim, ne zaman, hangi tabloda, ne yaptı.

Veritabanı kısıtları: e-posta formatı, metin uzunluk sınırları, zorunlu alanlar, geçerli durum değerleri (check constraint).

### 3.3 Güvenlik (RLS — en kritik kısım)

- Tüm tablolarda RLS açık.
- `is_admin()` SQL fonksiyonu: `auth.uid()` `admins` tablosunda var mı?
- **Public (anon):** yalnızca `published = true` içerikleri ve `site_settings` tablosunu okuyabilir. Başvuru, kayıt, iletişim ve bülten tablolarına sadece INSERT yapabilir, asla SELECT, UPDATE veya DELETE yapamaz.
- **Admin:** her şeye tam erişim. `editor` rolü başvuruları silemez, admin ekleyemez.
- Supabase Auth'ta kayıt olma (sign up) kapalı olacak. Adminler Supabase panelinden davetle eklenecek (kurulum rehberinde anlat).
- **Storage:** `public-media` bucket'ı (logolar, galeri, konuşmacılar). Herkes okuyabilir, yalnızca admin yükleyebilir. Dosya tipi ve boyut (ör. 5 MB) sınırı olsun.
- `supabase/tests/rls-checklist.md`: anon anahtarla denenmesi gereken senaryolar ve beklenen sonuçlar (ör. "anon başvuruları listeleyemez → boş sonuç veya hata").

### 3.4 Admin arayüzü (`/admin/`)

- `admin/index.html` giriş sayfası (e-posta + şifre, "şifremi unuttum"). Diğer sayfalar oturum yoksa girişe yönlendirir, admin değilse "Yetkiniz yok" gösterir.
- Tüm admin sayfalarında `<meta name="robots" content="noindex, nofollow">`; `robots.txt`'de `/admin/` engelli, sitemap'te yok.
- Yalnızca Türkçe olabilir.
- Düzen: solda daraltılabilir kenar menüsü, üstte sayfa başlığı ve kullanıcı menüsü, mobilde hamburger. Public siteyle aynı tasarım token'larını kullanır ama daha yoğun, veri odaklı bir görünümü olur.

**Sayfalar:**

- **Pano:** özet kartları (yeni başvuru, toplam başvuru, ziyaretçi kaydı, okunmamış mesaj, bülten abonesi), son 7/30 günün kayıt grafiği (sade, SVG veya küçük bir kütüphane, tek renk), son 5 başvuru ve mesaj, hızlı eylemler.
- **Stant Başvuruları:** tablo (numara, firma, sektör, stant tipi, m², tarih, durum rozeti), arama, durum ve sektör filtresi, sıralama, sayfalama. Satıra tıklayınca detay paneli açılsın: tüm bilgiler, durum değiştirme, admin notu, e-posta/telefon için tek tıkla `mailto:`/`tel:`. CSV/Excel dışa aktarma (Türkçe karakterler bozulmadan, UTF-8 BOM ile).
- **Ziyaretçi Kayıtları:** liste, arama, CSV dışa aktarma, günlere göre sayılar, check-in işaretleme.
- **Mesajlar:** gelen kutusu görünümü, okundu/okunmadı, arşivle, yanıtla (`mailto:`).
- **Katılımcılar:** CRUD, logo yükleme (önizlemeli), sürükle-bırak sıralama, öne çıkar/yayından kaldır. Onaylanan bir başvurudan "Katılımcıya dönüştür" butonuyla tek tıkla kayıt oluşturma.
- **Program ve Konuşmacılar:** gün bazlı liste, oturum CRUD, konuşmacı atama.
- **Sponsorlar, SSS, Sektörler, Galeri** (albüm + çoklu görsel yükleme), **Basın:** CRUD.
- **Bülten Aboneleri:** liste ve CSV dışa aktarma.
- **Site Ayarları:** tarih, yer, iletişim, istatistikler, duyuru çubuğu, stant fiyatları, "başvurular açık/kapalı" anahtarı (kapalıysa public formda zarif bir "Başvurular kapandı" mesajı çıksın).
- **Kullanıcılar** (yalnızca `owner`): admin listesi, rol değiştirme (yeni admin ekleme talimatı gösterilsin).
- **Etkinlik Günlüğü:** son işlemler.

**UX detayları:** her kaydetme ve silme sonrası toast bildirimi; silmeden önce onay modalı (tarayıcı `confirm()` değil, özel modal); formlarda kaydedilmemiş değişiklik uyarısı; yükleniyor/boş/hata durumlarının her biri tasarlanmış olsun; TR ve EN alanları yan yana sekmeli düzenlensin.

### 3.5 Kod düzeni

```
admin/
  index.html          # giriş
  dashboard.html
  applications.html
  visitors.html
  messages.html
  exhibitors.html
  program.html
  sponsors.html
  faqs.html
  gallery.html
  press.html
  subscribers.html
  settings.html
  users.html
  activity.html
assets/
  css/admin.css       # public style.css token'larını kullanır
  js/config.js
  js/supabase-client.js
  js/data.js          # public site: Supabase → JSON yedekli okuma
  js/admin/
    auth.js           # oturum kontrolü, yönlendirme
    ui.js             # toast, modal, tablo, form yardımcıları
    <sayfa>.js        # her sayfanın mantığı
supabase/
  migrations/001_init.sql
  seed.sql            # mevcut JSON verilerini ve örnek içerikleri aktarır
  tests/rls-checklist.md
docs/
  SUPABASE-KURULUM.md # adım adım, ekran ekran kurulum (Türkçe)
  ADMIN-KULLANIM.md   # organizatör için panel kullanım kılavuzu
```

- ES modülleri (`type="module"`) kullanılabilir. Build aracı yine yok.
- **XSS:** kullanıcıdan gelen veriyi DOM'a asla `innerHTML` ile basma. `textContent` ya da güvenli bir `h()` yardımcı fonksiyonu kullan.
- Tekrarlayan tablo, form ve modal kodunu `ui.js` içinde tek yerde topla.

---

## 4. Kalite Kontrol (her aşama sonunda)

- [ ] 360, 768, 1024 ve 1440px genişliklerde yatay kaydırma yok, düzen bozulmuyor.
- [ ] TR ↔ EN tüm sayfalarda karşılıklı, metinler eksiksiz, `hreflang` doğru.
- [ ] Klavye ile tüm menü, form, modal ve lightbox kullanılabiliyor. Focus görünür ve modallarda focus kapanı var.
- [ ] Lighthouse (mobil): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. Skorları raporla.
- [ ] Konsol hatası yok, kırık link yok (mevcut crawl testini `/giresun-expo/` alt yolunda tekrar çalıştır).
- [ ] Supabase yapılandırılmamışken public site JSON'dan düzgün çalışıyor.
- [ ] RLS kontrol listesi: anon kullanıcı özel verileri okuyamıyor.
- [ ] Mümkünse her ana sayfanın mobil ve masaüstü ekran görüntüsünü alıp kendin eleştirel gözle değerlendir. Hizalama, boşluk tutarlılığı, tipografi hiyerarşisi ve kontrastta gördüğün sorunları düzelt.

---

## 5. Çalışma Şekli

- **Önce plan:** kod yazmadan önce bu brief'i ve mevcut kodu incele, `tasks/todo.md`'yi aşamalara bölünmüş ayrıntılı bir plana dönüştür, bana göster ve onay bekle.
- **Aşamalar:** A) tasarım sistemi ve UI kit → B) public sayfaların yeniden tasarımı ve metinler → C) Supabase şeması, RLS ve veri katmanı → D) admin paneli → E) kalite kontrol ve dokümantasyon.
- **Her aşama sonunda:** kısa özet, ekran görüntüsü veya kontrol sonuçları, commit. Sonra onay bekle.
- Küçük ve anlamlı commit'ler at. Her aşama sonunda `git push` yapmadan önce sor.
- `CLAUDE.md`'yi yeni kurallarla güncelle (Supabase, admin, XSS kuralı, tasarım token'ları), ama mevcut GitHub Pages bölümünü koru.
- Belirsiz kalan her şeyi `docs/acik-sorular.md` dosyasına yaz. Tahminle ilerlediğin yerleri orada belirt.
