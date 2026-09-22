# RLS Kontrol Listesi

**Amaç:** Anon (publishable) anahtar tarayıcıda herkese açık. Sitenin tüm güvenliği
bu yüzden RLS politikalarında. Bu liste tek bir soruyu yanıtlar:

> Sıradan bir ziyaretçi, tarayıcısının konsolundan bu anahtarla neler yapabiliyor?

**Beklenen cevap:** Form gönderebiliyor, yayındaki içeriği okuyabiliyor.
**Hiçbir başvuruyu, kaydı, mesajı, aboneyi veya admin listesini okuyamıyor.**

---

## Nasıl çalıştırılır

```
node tools/rls-test.mjs
```

Script `assets/js/config.js` içindeki anon anahtarı kullanır — service_role anahtarı
hiçbir yerde geçmez, zaten geçmemeli. Tüm senaryolar geçerse çıkış kodu 0.

Yazma senaryoları gerçek satır oluşturur; hepsi `RLS-TEST` etiketli ve
`rls-test@example.invalid` e-postalıdır. Koşum sonunda temizlik SQL'i ekrana yazılır.

---

## A — Anonim okuma: public içerik görünmeli

| No | Senaryo | Beklenen |
|----|---------|----------|
| A1 | `select * from site_settings` | 200, 1 satır |
| A2 | `select * from sectors` | 200, satırlar döner |
| A3 | `select * from exhibitors` | 200, **yalnızca** `published = true` |
| A4 | `select * from faqs` | 200, yalnızca yayındakiler |
| A5 | `select * from sponsors` | 200 |
| A6 | `select * from transport_options` | 200 |
| A7 | `select * from program_sessions` | 200, yalnızca yayındakiler |
| A8 | `select * from speakers` | 200 |
| A9 | `select * from gallery_albums` | 200 |
| A10 | `select * from press_releases` | 200 |
| A11 | `exhibitors?published=eq.false` | **0 satır** — taslak katılımcı sızmamalı |

A11 kritik: taslak bir katılımcı kaydı (henüz onaylanmamış firma adı) yayına
alınmadan görünürse bu bir veri sızıntısıdır.

## B — Anonim okuma: başvurular ASLA görünmemeli

| No | Senaryo | Beklenen |
|----|---------|----------|
| B1 | `select * from stand_applications` | **0 satır** (veya 401/403) |
| B2 | `select * from visitor_registrations` | **0 satır** |
| B3 | `select * from contact_messages` | **0 satır** |
| B4 | `select * from newsletter_subscribers` | **0 satır** |
| B5 | `select * from admins` | **0 satır** |
| B6 | `select * from activity_log` | **0 satır** |
| B7 | `HEAD stand_applications` + `Prefer: count=exact` | satır sayısı bile sızmamalı |

> **Neden 403 değil 200 + boş liste?** PostgREST'te RLS bir SELECT politikası
> bulamazsa hata vermez, süzgeçten hiçbir satır geçmez. Yani doğru sonuç
> "yetkiniz yok" değil, **boş liste**. Test her ikisini de kabul eder; kabul
> etmediği tek şey içinde satır olan bir cevaptır.

## C — Anonim yazma: formlar çalışmalı

| No | Senaryo | Beklenen |
|----|---------|----------|
| C1 | `rpc/submit_stand_application` | 200 → `GE-2026-0001` biçiminde numara |
| C2 | `rpc/submit_visitor_registration` | 200 → `GE-Z-2026-00001` biçiminde numara |
| C3 | `insert into contact_messages` | 201 |
| C4 | `rpc/subscribe_newsletter` | 200/204 (aynı e-posta tekrar gelirse de hata yok) |
| C5 | Yazdıktan **sonra** `select contact_messages` | yine **0 satır** |
| C6 | `insert stand_applications` (RPC dışı, doğrudan) | **reddedilmeli** (401/403) |
| C7 | `insert newsletter_subscribers` (RPC dışı, doğrudan) | **reddedilmeli** (401/403) |

C5 bu listenin can damarı: yazma yetkisi okuma yetkisi doğurmamalı.

C6 ve C7, anon'un tabloya **yalnızca RPC üzerinden** yazabildiğini doğrular.
Doğrudan insert yolu bilerek kapatıldı, iki sebeple:

- **C6** — "Başvurular kapalı" anahtarı (`site_settings.stant_basvuru_acik`)
  yalnızca RPC içinde kontrol ediliyor. Doğrudan insert açık kalsaydı, bu anahtar
  kapalıyken bile tarayıcı konsolundan bir POST ile başvuru yazılabilirdi.
- **C7** — Bülten tablosunda `email` benzersiz. Doğrudan insert açık olsaydı,
  dönen unique-ihlali hatası bir e-postanın **zaten abone olup olmadığını** ele
  verirdi; sıradan bir abone listesi numaralandırma açığı. RPC'deki
  `on conflict do nothing` bu farkı ortadan kaldırıyor.

İletişim mesajı istisna: kapatma anahtarı ve benzersizlik kısıtı olmadığı için
istemci doğrudan insert ediyor (C3).

## D — Anonim yazma: içerik ve yetki tablolarına yazamamalı

| No | Senaryo | Beklenen |
|----|---------|----------|
| D1 | `insert into exhibitors` | 401/403 |
| D2 | `update site_settings` | 401/403 veya 0 satır etkilendi |
| D3 | `delete from exhibitors` | 401/403 veya 0 satır silindi |
| D4 | `insert into admins (role='owner')` | **reddedilmeli** — yetki yükseltme |
| D5 | `update stand_applications set status='onaylandi'` | 401/403 veya 0 satır |

D4 en ciddi senaryo: anon kendini admin yapabiliyorsa panelin tamamı düşer.

## E — Yardımcı fonksiyon

| No | Senaryo | Beklenen |
|----|---------|----------|
| E1 | `rpc/is_admin()` | `false` (veya çağrılamaz) |

---

## Admin tarafı (oturum açıkken, elle)

Bunlar tarayıcıda panele giriş yaptıktan sonra konsoldan denenir; scripte dahil
değil çünkü oturum gerektirir.

| No | Rol | Senaryo | Beklenen |
|----|-----|---------|----------|
| F1 | owner | `select * from stand_applications` | satırlar döner |
| F2 | owner | `delete from stand_applications` | başarılı |
| F3 | owner | `insert into admins` | başarılı |
| F4 | editor | `select * from stand_applications` | satırlar döner |
| F5 | editor | `update stand_applications set status=...` | başarılı |
| F6 | editor | `delete from stand_applications` | **reddedilmeli** |
| F7 | editor | `insert into admins` | **reddedilmeli** |
| F8 | editor | Storage'dan dosya silme | **reddedilmeli** |
| F9 | oturumsuz | `admin/pano.html` açma | giriş sayfasına yönlendirme |

F6–F8, `editor` rolünün DB tarafında gerçekten kısıtlı olduğunu doğrular.
Panelde butonu gizlemek yeterli değildir; kısıt veritabanında olmalı.

---

## Koşum kaydı

| Tarih | Koşan | Sonuç | Not |
|-------|-------|-------|-----|
| _(SQL çalıştırıldıktan sonra doldurulacak)_ | | | |
