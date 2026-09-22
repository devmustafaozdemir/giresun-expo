# Katılımcı logoları

**43 / 86 firmanın logosu mevcut.** Kalan 43 firma, kartlarda firma adının baş
harflerinden oluşan bir **monogram** ile gösterilir. Monogram geçici bir yama değil,
kalıcı bir yedektir: logosu hiç gelmeyen firmalar da düzgün görünür.

## Logolar nereden geldi?

Resmî el kitapçığının **"Katılımcı Firmalarımızdan Bazıları"** sayfasından (8. sayfa)
çıkarıldı. İnternetten aranmadı — yanlış firmanın logosunu koymak, logosuz bırakmaktan
kötüdür. Kitapçık organizatörün kendi yayını olduğu için hem eşleşme doğru hem de
kullanım hakkı fuarda mevcut.

Logolar PDF'te **vektör** olarak çizilmişti (gömülü görsel değil), bu yüzden sayfa
4 kat çözünürlükte render edilip logolar otomatik tespit edilerek kesildi:

```bash
# 1. Sayfayı render et, logo kutularını bul, tek tek kes
node tools/logo-cikar.mjs docs/<kitapcik>.pdf 8 <klasör> 4

# 2. Kesilenleri numaralı bir kontakt sayfasında topla (gözle eşleştirmek için)
node tools/logo-kontakt.mjs <klasör> kontakt.png 8 200

# 3. Eşleştirme tablosuna göre firma slug'ıyla kaydet
node tools/logo-uret.mjs docs/<kitapcik>.pdf 8 <hedef> --yaz
```

**Eşleştirme `tools/logo-uret.mjs` içinde elle yapılmıştır.** Her kutu kontakt
sayfasından okunarak doğru firmayla eşleştirildi; otomatik tahmin kullanılmadı.

### Kitapçıkta olup listede olmayan markalar

Logo sayfasında görünen ama katılımcı/stant listesinde bulunmayan üç marka atlandı:
**Irmak**, **Hız İnşaat**, **FAR Elektrik Teknolojileri**. Bkz. `docs/acik-sorular.md` #21.

## Yeni logo eklemek

1. Dosyayı buraya, firmanın `slug` değeriyle kaydedin:

   ```
   assets/img/exhibitors/tok-ticaret-hirdavat-malzemeleri.png
   ```

   `slug` değerleri `data/exhibitors.json` içindedir.

2. `data/exhibitors.json` içinde o firmanın `logo` alanını doldurun:

   ```json
   "logo": "assets/img/exhibitors/tok-ticaret-hirdavat-malzemeleri.png"
   ```

   Yol **kökten** yazılır; EN sayfası için `../` öneki otomatik eklenir.

3. Kartları yeniden üretin:

   ```bash
   node tools/build-exhibitors.mjs
   ```

Çıktı kaç firmanın logolu, kaçının monogramlı olduğunu bildirir. Tek tek eklenebilir.

## Dosya biçimi

| | |
|---|---|
| Biçim | PNG |
| Zemin | **Beyaz** — kart zemini de beyaz, dikişsiz görünür |
| Uzun kenar | 440px (200px gösterim için 2×) |
| Pay | %6 — kart içinde nefes alması için |
| Boyut | ortalama 27 KB |

Daha yüksek çözünürlüklü orijinaller organizatörden istenirse bu dosyalar
değiştirilebilir; kart düzeni `object-fit: contain` kullandığı için en-boy oranı serbesttir.

## C aşamasından sonra

Supabase devreye girdiğinde logolar `public-media` bucket'ına taşınacak ve
`exhibitors.logo_url` alanından gelecek. Bu klasör yedek katman olarak kalacak.
