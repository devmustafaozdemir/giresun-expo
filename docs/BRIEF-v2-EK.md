# BRIEF-v2 — EK: Resmî Kitapçık Bilgileri (ÖNCELİKLİ)

> Bu ek, `docs/BRIEF-v2.md` ile çelişen her noktada **geçerlidir**.
> Resmî bilgiler: `docs/KITAPCIK-ICERIK.md`. Kitapçığın kendisi: `docs/Giresun Expo A5 El Kitapçığı.pdf`.

## 1. Değişen temel olgular
- Fuar **İstanbul'da** yapılıyor: **8–11 Ekim 2026**, Yenikapı Dr. Mimar Kadir Topbaş Gösteri ve Sanat Merkezi. Önceki "Giresun Fuar Alanı / Mayıs 2027" yer tutucularının tamamı kaldırılacak.
- Konsept: **"Giresun İş Dünyası İstanbul'da Buluşuyor"**. Giresun'un üretim, yatırım ve ticaret gücünü İstanbul'da tanıtan bir iş dünyası buluşması. Site bu hikâyeyi anlatmalı: Giresun kimliği + İstanbul buluşması.
- Slogan: **Giresun İçin İş Birliği / Türkiye İçin Güç Birliği.** Hero'da ve footer'da kullan.
- Dört sütun: **Üretim · Yatırım · Ticaret · İş Birliği.** Ana sayfadaki "sektörler" bölümünün üstünde bu dört sütun ikonlu olarak yer alsın.
- Organizatör: Giresun Vakfı, Giresun Federasyonu ve ŞEBİNSİAD ortaklığı. "Paydaşlarımız" bölümü logolarıyla birlikte ana sayfada ve Hakkında sayfasında yer alsın.

## 2. Marka ve tasarım
- **Yeni logo TASARLAMA.** Resmî logo var: `assets/img/brand/giresun-expo-logo.png`. Brief'in 1.5 bölümündeki logo maddesi iptal. Favicon'u logodaki halka (figür) işaretinden türet. OG görselini logoyla üret.
- Logo koyu zeminde okunmuyor. Logoyu yalnızca açık zeminde kullan. Koyu footer gibi alanlarda logoyu beyaz bir kart içine yerleştir ya da koyu zemin kullanma. Logoyu yeniden çizme veya renklerini değiştirme.
- Renk token'larını logoya göre güncelle:
  ```css
  --color-primary: #005E44;      /* marka yeşili */
  --color-primary-dark: #00432F;
  --color-secondary: #184181;    /* marka lacivert */
  --color-accent-blue: #085494;
  --color-accent-green: #6A9F2F;
  --color-accent-earth: #3D351C;
  ```
  Yeşil ve lacivert ana renkler olsun. Açık yeşil, mavi ve kahve yalnızca küçük vurgularda kullanılsın (logodaki halka gibi). Eski fındık ve deniz tonlarını kaldır veya nötrlere indir.
- Kitapçığın görsel dilini referans al: açık zemin, yeşil büyük harfli başlıklar, başlık altında kısa lacivert çizgi, sade ikonlar. Bunu web'e modern ve sade bir şekilde uyarla.
- Fotoğraflar artık var (`assets/img/photos/`). Görsel yuvalarını bunlarla doldur. Çözünürlük sınırlı olduğu için büyük alanlarda marka renginde overlay kullan, görseli gereğinden fazla büyütme.

## 3. İçerik kuralları
- Kitapçıktaki olgular (tarih, saat, adres, ulaşım, paydaşlar, katılımcılar, stantlar) **birebir** kullanılacak. Sen yeni olgu ekleme.
- Kitapçık metinleri web için akıcı hale getirilebilir. Ek tanıtım metinleri de yazabilirsin, ama bunlar kitapçığın söylediklerinin dışına çıkmamalı.
- **İstatistikler:** yalnızca doğrulanabilir olanları kullan: "86 katılımcı firma", "4 gün", "3 paydaş kuruluş", "5 salon/alan (A, T, G, P, E)". Ziyaretçi sayısı veya m² gibi rakamlar uydurulmayacak.
- İngilizce sürüm: kitapçık metinlerinin doğal ve profesyonel İngilizcesi.

## 4. Sayfa değişiklikleri
- **Ana sayfa:** Hero (logo, manşet, slogan, tarih + mekân, CTA'lar: "Ziyaret Planla" ve "Katılımcıları Keşfet") → geri sayım (8 Ekim 2026 10:00, Europe/Istanbul) → dört sütun → Giresun EXPO nedir? → rakamlar → paydaşlar → öne çıkan katılımcılar → ziyaret saatleri → ulaşım özeti ve harita → SSS.
- **Etkinlik bitince:** geri sayım sıfırlandığında "Fuar devam ediyor" (8–11 Ekim), sonrasında "Giresun EXPO 2026 için teşekkürler. 2027'de görüşmek üzere" durumuna otomatik geçsin. Bu metinler Site Ayarları'ndan düzenlenebilsin.
- **Katılımcılar:** `data/exhibitors.json` içindeki 86 firma. Arama + sektör filtresi + **salon filtresi (A/T/G/P/E)** + stant numarasına göre sıralama. Logosu olmayan firmalar için baş harflerden oluşan şık bir monogram kartı kullan.
- **Program:** kitapçıkta program ve konuşmacı yok. Sayfa "Ziyaret Saatleri + Etkinlik programı yakında açıklanacak" şeklinde çalışsın. Admin'den oturum eklenince program otomatik görünsün, eklenmezse menüde "Program" yerine "Ziyaret Bilgileri" görünsün.
- **Yeni sayfa: Ziyaret Bilgileri / Plan Your Visit.** Tarih ve saatler, adres, ulaşım (Anadolu Yakası, Avrupa Yakası, otobüs, özel araç; hat rozetleriyle: M1A, M1B, M2, M4, Marmaray), harita, "Takvime ekle" (.ics).
- **Stant başvurusu:** fuar yakın ve stantlar dağıtılmış durumda. Form kalsın ama başlığı Site Ayarları'ndan yönetilsin. Varsayılan: "Katılımcı Olun: Giresun EXPO 2027 ön başvurusu". "Başvurular açık/kapalı" anahtarı da olsun.
- **Ziyaretçi kaydı:** giriş ücretli mi, ücretsiz mi, kayıt zorunlu mu bilinmiyor. `docs/acik-sorular.md`'ye ekle. O zamana kadar "Ön kayıt" olarak çalışsın ve "ücretsiz" iddiası yazılmasın.
- **İletişim:** telefon 0541 662 28 28, adres, web. E-posta ve sosyal medya henüz yok: bu alanlar Site Ayarları'nda boş kalsın, boşsa sitede hiç görünmesin (kırık link veya "TODO" yazısı görünmemeli).

## 5. Admin ve veri
- `seed.sql` gerçek verilerle doldurulacak: 86 katılımcı (JSON'dan), 17 sektör, 3 paydaş (sponsors tablosunda seviye `partner`), site ayarları (tarih, saatler, adres, telefon), SSS (ziyaret saatleri, ulaşım, otopark, adres gibi kitapçıktan cevaplanabilen sorular).
- `site_settings` tablosuna şu alanları ekle: günlük ziyaret saatleri (JSON), slogan TR/EN, manşet TR/EN, etkinlik durumu metinleri (öncesi, sırası, sonrası).
- `exhibitors` tablosunda `stands text[]` ve `hall` alanları olsun.

## 6. Öncelik (ÖNEMLİ)
Fuar **8 Ekim 2026'da** başlıyor. Sıralama:
1. **Önce public site:** Aşama A + B, gerçek içerikle, JSON veri kaynağıyla. Fuardan önce yayına hazır olmalı.
2. Sonra Aşama C + D (Supabase ve admin paneli). Public site bu aşamalar olmadan da eksiksiz çalışmalı.
3. Planı bu önceliğe göre yeniden sırala.

## 7. Açık sorulara eklenecekler
- Logonun vektörel orijinali ve paydaş logolarının yüksek çözünürlüklü halleri
- Fotoğrafların yüksek çözünürlüklü orijinalleri
- E-posta adresi ve sosyal medya hesapları
- Ziyaretçi girişi ücretli mi, ücretsiz mi? Kayıt zorunlu mu?
- Etkinlik programı, konuşmacılar ve paneller var mı?
- Katılımcı logoları (86 firma) toplanacak mı?
- Irmak ve Hız İnşaat stant listesinde neden yok? "Anadolu İndiksiyon" yazımı doğru mu?
- Salon planı (A/T/G/P/E krokisi) var mı?
- Firma sektörlerinin doğrulanması
