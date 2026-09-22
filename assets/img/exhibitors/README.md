# Katılımcı logoları

**Bu klasör şu an boş — 86 firmanın hiçbirinin logosu elimizde yok**
(bkz. `docs/acik-sorular.md` #20).

Logosu olmayan firmalar, kartlarda firma adının baş harflerinden oluşan bir
**monogram** ile gösterilir. Bu geçici bir çözüm değil, kalıcı bir yedektir:
logosu hiç gelmeyen firmalar da düzgün görünür.

## Logo geldiğinde ne yapılmalı?

1. **Dosyayı buraya kaydedin.** Ad, firmanın `slug` değeriyle aynı olmalı:

   ```
   assets/img/exhibitors/tok-ticaret-hirdavat-malzemeleri.png
   ```

   `slug` değerlerini `data/exhibitors.json` içinde bulabilirsiniz.

2. **`data/exhibitors.json` içinde o firmanın `logo` alanını doldurun:**

   ```json
   {
     "name": "Tok Ticaret (Hırdavat Malzemeleri)",
     "slug": "tok-ticaret-hirdavat-malzemeleri",
     "logo": "assets/img/exhibitors/tok-ticaret-hirdavat-malzemeleri.png",
     ...
   }
   ```

   Yol **kökten** yazılır; EN sayfası için `../` öneki otomatik eklenir.

3. **Kartları yeniden üretin:**

   ```bash
   node tools/build-exhibitors.mjs
   ```

   Çıktı kaç firmanın logolu, kaçının monogramlı olduğunu bildirir.

Tek tek eklenebilir; hepsinin aynı anda gelmesi gerekmez.

## Dosya biçimi

| | |
|---|---|
| Biçim | PNG (şeffaf zemin tercih edilir) veya SVG |
| Genişlik | en az 400px |
| En-boy | serbest — kart `16:9` kutuya sığdırır, kırpmaz (`object-fit: contain`) |
| Zemin | Kart zemini **beyazdır**; koyu zeminli logolar sorun çıkarmaz |
| Boyut | tercihen 100 KB altı |

## C aşamasından sonra

Supabase devreye girdiğinde logolar `public-media` bucket'ına yüklenecek ve
`exhibitors.logo_url` alanından gelecek. Bu klasör ve script o zaman yedek
katman olarak kalacak.
