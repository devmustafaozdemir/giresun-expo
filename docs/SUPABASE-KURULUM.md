# Supabase Kurulumu — Giresun EXPO 2026

Bu dosya, veritabanını sıfırdan ayağa kaldırmak için izlenecek adımları sırayla anlatır.
Toplam süre: yaklaşık 15 dakika. Terminal gerekmez, her şey Supabase panelinden yapılır.

> **Güvenlik kuralı (değişmez):** `service_role` / `secret` anahtar hiçbir dosyaya,
> hiçbir commit'e, hiçbir tarayıcı koduna girmez. Sitede yalnızca `anon` (publishable)
> anahtar kullanılır ve o anahtar zaten herkese açıktır — güvenliğin tamamı RLS'tedir.

---

## Özet: yapıştırma sırası

SQL Editor'da **bu sırayla** ve **her birini ayrı ayrı** çalıştırın.
Bir adım hata verirse durun; sonrakine geçmeyin.

| Sıra | Dosya | Ne yapar | Süre |
|------|-------|----------|------|
| 1 | `supabase/migrations/001_init.sql` | 18 tablo, kısıtlar, numara üreteçleri, `is_admin()`, RLS politikaları, 3 form RPC'si | ~10 sn |
| 2 | `supabase/migrations/002_storage.sql` | `public-media` bucket'ı ve erişim kuralları | ~2 sn |
| 3 | `supabase/seed.sql` | Gerçek içerik: 17 sektör, 86 katılımcı, 3 paydaş, 8 SSS, 4 ulaşım seçeneği, site ayarları | ~5 sn |
| 4 | **(panelden)** Auth kullanıcısı oluştur | `0mustafaozdemirr@gmail.com` | ~1 dk |
| 5 | `supabase/migrations/003_admin.sql` | O kullanıcıyı `admins` tablosuna `owner` olarak ekler | ~1 sn |

**4. adım 5'ten önce gelmeli.** `003_admin.sql`, `auth.users` içinde o e-postayı arar;
kullanıcı yoksa açık bir hata mesajıyla durur (yanlışlıkla boş kayıt oluşturmaz).

Hepsi tekrar çalıştırılabilir (idempotent): yanlışlıkla iki kez çalıştırırsanız
veri bozulmaz, `seed.sql` mevcut satırları günceller.

---

## Adım adım

### 1. `001_init.sql` — şema ve güvenlik

1. Supabase panelinde projeyi açın → sol menüden **SQL Editor**
2. **New query**
3. `supabase/migrations/001_init.sql` dosyasının **tamamını** kopyalayıp yapıştırın
4. **Run** (Ctrl+Enter)

Beklenen çıktı: `Success. No rows returned`

Bu adım şunları kurar:

- **18 tablo** — `admins`, `site_settings`, `sectors`, `exhibitors`, `speakers`,
  `program_sessions`, `program_session_speakers`, `sponsors`, `faqs`,
  `gallery_albums`, `gallery_images`, `press_releases`, `transport_options`,
  `stand_applications`, `visitor_registrations`, `contact_messages`,
  `newsletter_subscribers`, `activity_log`
- **Kısıtlar** — e-posta biçimi, alan uzunlukları, durum değerleri (`check`)
- **Numara üreteçleri** — başvuru `GE-2026-0001`, ziyaretçi `GE-Z-2026-00001`.
  Numara veritabanında trigger ile üretilir; tarayıcıya güvenilmez.
- **`is_admin()` ve `admin_role()`** — `security definer`, RLS politikalarının dayanağı
- **Tüm tablolarda RLS açık** — politikasız hiçbir tablo yok
- **3 RPC** — `submit_stand_application`, `submit_visitor_registration`,
  `subscribe_newsletter`

> **RPC'ler neden var?** Üç sebep:
>
> 1. Anon'un başvuru tablolarında SELECT yetkisi yok (olmamalı da), ama başarı
>    ekranında başvuru numarasını göstermemiz gerekiyor. `insert ... returning`
>    çalışmaz çünkü dönen satırı okuma yetkisi yok. Numara, `security definer`
>    bir fonksiyondan **tek değer** olarak dönüyor — satırın tamamı değil.
> 2. "Başvurular kapalı" anahtarı RPC içinde kontrol ediliyor. Bu yüzden anon'un
>    tabloya doğrudan INSERT hakkı **bilerek kapatıldı**; açık kalsaydı anahtar
>    kapalıyken bile tarayıcıdan bir POST ile başvuru yazılabilirdi.
> 3. Bültende doğrudan INSERT, unique ihlali hatasıyla bir e-postanın zaten abone
>    olup olmadığını ele verirdi. RPC'deki `on conflict do nothing` bunu kapatıyor.
>
> Sonuç: stant, ziyaretçi ve bülten yazmalarının **tek yolu** RPC'dir. İletişim
> mesajı istisna (kapatma anahtarı ve benzersizlik kısıtı yok), doğrudan yazılır.

### 2. `002_storage.sql` — dosya deposu

Aynı şekilde yapıştırıp çalıştırın. Kurduğu şey:

- `public-media` adında **public okuma** yetkili bucket
- Dosya başına **5 MB** sınırı
- Yazma yalnızca admin (logo yükleme, galeri görselleri)
- Silme yalnızca `owner`

### 3. `seed.sql` — gerçek içerik

Bu dosya `data/*.json` içindeki gerçek verilerden üretildi
(`node tools/build-seed.mjs` ile yeniden üretilebilir). Yaklaşık 800 satır;
tamamını yapıştırın.

Sonrasında **Table Editor**'dan doğrulayın:

| Tablo | Beklenen satır |
|-------|----------------|
| `sectors` | 17 |
| `exhibitors` | 86 |
| `sponsors` | 3 |
| `faqs` | 8 |
| `transport_options` | 4 |
| `site_settings` | 1 |

### 4. Auth kullanıcısını oluşturun (panelden)

1. Sol menü → **Authentication** → **Users** → **Add user** → **Create new user**
2. E-posta: `0mustafaozdemirr@gmail.com`
3. Güçlü bir parola belirleyin ve **parola yöneticinize kaydedin**
4. **Auto Confirm User** seçeneğini işaretleyin (doğrulama e-postası beklemeyin)

Sonra kayıt olmayı kapatın:

5. **Authentication** → **Sign In / Providers** → **Email**
6. **Allow new users to sign up** → **kapalı**

> Bu kapatma önemli: açık kalırsa isteyen kendi hesabını oluşturabilir. Hesap tek
> başına panele erişim vermez (`admins` tablosunda olmak gerekir), ama kapalı
> tutmak gereksiz hesap birikmesini önler.

### 5. `003_admin.sql` — kendinizi owner yapın

Dosya dört numaralı adımdan oluşuyor. **ADIM 1 ve ADIM 2'yi çalıştırın.**

ADIM 2 bir satır döndürmeli:

| email | role | created_at | last_sign_in_at |
|-------|------|-----------|-----------------|
| 0mustafaozdemirr@gmail.com | owner | … | _(null — henüz giriş yapılmadı)_ |

**ADIM 2 boş dönerse** admin eklenmemiştir. ADIM 3'ü çalıştırın:
`auth_kullanicisi_var = false` çıkarsa 4. adım atlanmış ya da e-posta farklı
yazılmıştır — ADIM 4 ile Auth'taki kullanıcıları listeleyip karşılaştırın.

> Bu dosya önce bir `do $$ … $$` bloğu kullanıyordu ve ilk denemede kullanıcıyı
> eklemedi. Artık DO bloğu ve plpgsql değişkeni yok: tek bir `insert … select`,
> e-posta doğrudan `auth.users`'tan geliyor.

---

## Kurulum sonrası doğrulama

### RLS testi

Proje klasöründe:

```
node tools/rls-test.mjs
```

Senaryolar ve beklenen sonuçlar: `supabase/tests/rls-checklist.md`.
Hepsi geçmeden siteyi canlı veriyle kullanmayın.

### Sitede kontrol

1. `index.html` → bülten formuna bir e-posta girin → teşekkür ekranı
2. `ziyaretci-kaydi.html` → formu doldurun → `GE-Z-2026-00001` biçiminde numara
3. `stant-basvurusu.html` → 3 adımı tamamlayın → `GE-2026-0001` biçiminde numara
4. `iletisim.html` → mesaj gönderin
5. Supabase **Table Editor**'dan dört kaydın da düştüğünü görün
6. Test kayıtlarını silin

---

## Site ayarlarındaki anahtarlar

`site_settings` tablosunda iki anahtar var. Panelden (**Site Ayarları**) veya
Table Editor'dan değiştirilebilir:

| Sütun | Etkisi |
|-------|--------|
| `stant_basvuru_acik` | `false` yapılırsa stant formu nazikçe kapanır, gönderim reddedilir |
| `ziyaretci_kaydi_acik` | `false` yapılırsa ziyaretçi kaydı kapanır |

Kontrol veritabanında: formu tarayıcıdan zorlasanız bile RPC `BASVURU_KAPALI`
hatası döndürür.

---

## Bağlantı kesilirse ne olur

Site Supabase'e ulaşamazsa **çökmez**. `assets/js/data.js` her okuma için 6 saniyelik
bir zaman aşımı uygular ve cevap gelmezse `data/*.json` dosyalarına düşer. Katılımcı
listesi, SSS, ulaşım bilgileri ve site ayarları statik HTML'e zaten gömülü olduğu için
ziyaretçi bir eksiklik görmez.

Bu durumda çalışmayan tek şey **form gönderimi**dir; kullanıcıya "şu anda gönderilemedi,
lütfen daha sonra tekrar deneyin" uyarısı ve e-posta adresi gösterilir.

---

## Anahtarlar nerede

`assets/js/config.js`:

```js
window.GE_CONFIG = {
  SUPABASE_URL: 'https://ktjchovsqvjeuurhxvck.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_...'
};
```

Bu dosya repoda ve olmalı — anon anahtar tasarımı gereği herkese açık.
`service_role` anahtarı **hiçbir zaman** buraya veya başka bir dosyaya yazılmaz.

Anahtarı değiştirmeniz gerekirse: Supabase → **Project Settings** → **API Keys**.

---

## Sık karşılaşılan hatalar

| Hata | Sebep | Çözüm |
|------|-------|-------|
| `PGRST205 Could not find the table 'public.site_settings'` | `001_init.sql` çalıştırılmamış | 1. adımı yapın |
| `Auth kullanıcısı bulunamadı` | 4. adım atlanmış | Önce Auth kullanıcısını oluşturun |
| `duplicate key value violates unique constraint` | `seed.sql` iki kez çalıştı ama eski sürüm | Güncel `seed.sql` idempotenttir; dosyayı yeniden kopyalayın |
| `BASVURU_KAPALI` | `stant_basvuru_acik = false` | `site_settings`'ten açın |
| Form "gönderilemedi" diyor | Ağ / yanlış URL veya anahtar | Tarayıcı konsoluna bakın; `config.js`'i doğrulayın |
| Panelde "Yetkiniz yok" | Auth kullanıcısı var ama `admins`'te yok | `003_admin.sql`'i çalıştırın |
