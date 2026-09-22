# tools/

Tek seferlik veya tekrarlanan bakım script'leri. Node.js ile çalışır (v24 LTS).
**Sitenin çalışması bunlara bağlı değildir** — üretilen çıktılar repoda durur,
çalışma anında hiçbir CDN'e bağlanılmaz.

## Denetim araçları — değişiklikten sonra çalıştırılır

| Script | Ne yapar | Bağımlılık |
|---|---|---|
| `contrast.mjs` | `style.css`'teki token'ları okur, WCAG AA/1.4.11 kontrastını denetler. Kalan varsa çıkış kodu **1** | yok |
| `check-partials.mjs` | Header/footer markup'ının tüm HTML dosyalarında aynı kaldığını doğrular (TR ve EN ayrı). Sapma varsa çıkış kodu **1** | yok |

```bash
node tools/contrast.mjs
node tools/check-partials.mjs
```

Build adımı olmadığı için ortak markup her sayfada tekrarlanır; `check-partials.mjs`
bu tekrarların ayrışmasını yakalayan güvenlik ağıdır. Sayfa eklendikten veya
header/footer değiştirildikten sonra mutlaka çalıştırın.

## Varlık üretimi — yalnızca gerektiğinde

| Script | Ne yapar | Bağımlılık |
|---|---|---|
| `fonts.mjs` | Google Fonts CSS'ini ayrıştırıp `latin` + `latin-ext` woff2 dosyalarını `assets/fonts/` altına indirir | yok |
| `icons.mjs` | Lucide ikonlarını indirir, `stroke-width`'i 1.75 yapar, `assets/icons/` altına yazar | yok |
| `pdf-optimize.mjs` | PDF'ten Illustrator gömülü düzenleme verisini ve yetim nesneleri atar | **`pdf-lib`** |

```bash
# Font ekleme/güncelleme (Google Fonts CSS'i önce indirilir)
node tools/fonts.mjs <gf.css> assets/fonts

# İkon ekleme: önce icons.mjs içindeki ICONS listesine ekleyin
node tools/icons.mjs assets/icons

# PDF sıkıştırma (pdf-lib gerekir: npm i pdf-lib)
node tools/pdf-optimize.mjs <kaynak.pdf> <hedef.pdf>
```

### `fonts.mjs` — dikkat

Inter **değişken fonttur**; Google Fonts her ağırlık için aynı dosyayı döndürür.
Script indirdikten sonra dosyaları tekilleştirmeyi unutmayın (SHA256 karşılaştırın):
4 ağırlık × 2 alt küme = 8 dosya yerine **2 dosya** yeterlidir (546 KB → 156 KB).

`latin-ext` alt kümesi Türkçe için **zorunludur**: ğ Ğ ş Ş İ yalnızca orada bulunur.

### `pdf-optimize.mjs` — dikkat

Görüntüleme açısından kayıpsızdır: görsel küçültmez, metni rasterleştirmez.
Yalnızca `/PieceInfo` (Illustrator private data) ve referanssız kalan nesneleri atar.
Dosyanın Illustrator'da katmanlı açılabilme özelliği kaybolur — orijinali saklayın.
