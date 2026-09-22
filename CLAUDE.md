# CLAUDE.md — Giresun Expo

Statik (build step'siz) HTML/CSS/JS fuar sitesi. Derleyici, paket yöneticisi veya
framework yok — dosyalar doğrudan tarayıcıda/sunucuda çalışır.

## Klasör Yapısı

```
giresun-expo/
├── CLAUDE.md                    # bu dosya — yapı ve kurallar
├── README.md
├── .gitignore
├── index.html                   # TR — Ana Sayfa
├── hakkinda.html                # TR — Fuar Hakkında
├── katilimcilar.html            # TR — Katılımcılar
├── ziyaretci.html               # TR — Ziyaretçi Bilgileri
├── program.html                 # TR — Etkinlik Programı
├── galeri.html                  # TR — Galeri
├── haberler.html                # TR — Haberler
├── iletisim.html                # TR — İletişim
├── stant-basvurusu.html         # TR — Stant Başvurusu (form)
├── en/
│   ├── index.html               # EN — Home
│   ├── about.html               # EN — About
│   ├── exhibitors.html          # EN — Exhibitors
│   ├── visitors.html            # EN — Visitors
│   ├── program.html             # EN — Programme
│   ├── gallery.html             # EN — Gallery
│   ├── news.html                # EN — News
│   ├── contact.html             # EN — Contact
│   └── stand-application.html   # EN — Stand Application
├── assets/
│   ├── css/style.css            # tek dosya tasarım sistemi
│   ├── js/main.js               # mobil menü + footer yılı
│   └── img/                     # görseller
└── tasks/
    ├── todo.md
    └── lessons.md
```

## Dil Yapısı

- **TR kökte, EN `en/` altında.** Kök `index.html` Türkçedir.
- Her TR sayfasının bir EN karşılığı vardır; eşleşme yukarıdaki sırayla birebirdir.
- Dil değiştirici **karşılık gelen sayfaya** linklenir (`katilimcilar.html` ↔ `en/exhibitors.html`),
  asla ana sayfaya değil. `<link rel="alternate" hreflang>` etiketleri de aynı eşleşmeyi kullanır.
- Aynı dil içindeki linkler **öneksizdir** (aynı klasördedirler).
  Sadece diller arası linkler ve `assets/` yolları `../` öneki alır (EN sayfalarında).

## Yayın: GitHub Pages — alt yol (`/giresun-expo/`)

Site **alan adının kökünde değil**, `https://<kullanıcı>.github.io/giresun-expo/`
alt yolunda yayınlanır. Bunun tek ama katı bir sonucu var:

> **Kök-göreli yol (`/` ile başlayan) kullanma. Hiçbir yerde.**

`/assets/css/style.css` yayında `https://<kullanıcı>.github.io/assets/css/style.css`
adresine çözümlenir ve 404 verir. Doğrusu sayfanın konumuna göre görelidir:

| Nerede | Asset yolu | Aynı dildeki sayfa | Diğer dildeki sayfa |
|---|---|---|---|
| Kök (TR) | `assets/css/style.css` | `hakkinda.html` | `en/about.html` |
| `en/` (EN) | `../assets/css/style.css` | `about.html` | `../hakkinda.html` |

Bu kural şunların hepsi için geçerlidir: `href`, `src`, CSS `url(...)`,
`<link rel="alternate" hreflang>`, ileride eklenecek `fetch()` / JSON veri yolları,
`og:image` ve favicon.

**İleride JS'ten veri çekilirse** (ör. katılımcı listesi için `data/exhibitors.json`),
yolu string olarak gömmek yerine dokümanın konumuna göre çöz:

```js
// dogru — sayfa kokte de en/ icinde de calisir
const url = new URL('data/exhibitors.json', document.baseURI);
// en/ icindeki bir sayfadan kok seviyesindeki veriye: '../data/exhibitors.json'
const res = await fetch(url);
```

`.nojekyll` dosyası repoda bulunur; GitHub Pages'in Jekyll işlemesini atlayıp
dosyaları olduğu gibi sunmasını sağlar, silinmemeli.

**Bilinen tuzak — `404.html`:** GitHub Pages özel 404 sayfasını her derinlikteki
bilinmeyen adres için sunar (`/giresun-expo/en/olmayan-sayfa` dahil). Göreli asset
yolu olan bir `404.html` bu durumda stilsiz görünür. Böyle bir sayfa eklenecekse
CSS'i `<style>` olarak sayfa içine gömülmelidir.

## Marka ve Tasarım Sistemi (v2)

Kaynak önceliği: `docs/BRIEF-v2-EK.md` → `docs/KITAPCIK-ICERIK.md` → `docs/BRIEF-v2.md`.
Tüm bileşenlerin canlı vitrini: `docs/ui-kit.html` (noindex).

### Renkler

Logodan birebir ölçüldü. `:root` token'ları dışında renk yazma.

| Token | Değer | Kullanım |
|---|---|---|
| `--color-primary` | `#005E44` | Ana marka yeşili — butonlar, linkler, başlıklar |
| `--color-secondary` | `#184181` | Marka lacivert — eyebrow, başlık altı çizgi, duyuru çubuğu |
| `--color-accent-blue` / `-earth` | `#085494` / `#3D351C` | Küçük vurgular |
| `--color-accent-green` | `#6A9F2F` | **YALNIZCA grafik** — asla metin rengi değil |

> `--color-accent-green` beyaz üzerinde **3.18** kontrastla AA'dan kalır. Halka motifi,
> ikon ve grafik vurgu dışında kullanılmaz.

**Kenarlık token'ları üç kademelidir ve karıştırılmamalıdır:**
`--color-border` dekoratif (kart çerçevesi) · `--color-border-mid` görünür dekoratif
(kesikli yer tutucu, ayraç) · `--color-border-strong` **etkileşimli bileşen sınırı**
(form alanları, hamburger) — WCAG 1.4.11 gereği zemine karşı ≥3:1.

Her renk değişikliğinden sonra: `node tools/contrast.mjs` (kalırsa çıkış kodu 1).

### Logo — yeniden çizilmez, renkleri değiştirilmez

| Dosya | Nerede |
|---|---|
| `giresun-expo-logo-tarihsiz.png` | **Header** ve favicon türetimi |
| `giresun-expo-logo.png` (tarihli) | Hero, footer, OG görseli |
| `favicon-32/180/192/512.png` | Logodaki halka işaretinden kırpıldı |
| `og-image.png` | 1200×630 |

Logo **yalnızca açık zeminde** kullanılır. Koyu bantta (footer gibi) `.footer-logo`
sarmalayıcısıyla beyaz kartın içine alınır. CSS ile kırpma yapılmaz.

`desen-halka.svg` logodan esinlenen **dekoratif** bir grafiktir; logo yerine geçmez.

### Tipografi ve ikonlar

- Başlık **Poppins** (600/700), gövde **Inter** (değişken 100–900). Self-hosted,
  `assets/fonts/`. **CDN yok.** `latin-ext` alt kümesi Türkçe için zorunludur
  (ğ Ğ ş Ş İ yalnızca orada).
- İkonlar: Lucide v1.47.0 (ISC), `assets/icons/*.svg`, stroke **1.75**. Sayfaya
  **inline SVG** olarak gömülür. Yeni ikon için `tools/icons.mjs`.

### Her sayfanın `<head>`'inde bulunması ZORUNLU

```html
<script>document.documentElement.classList.add('js')</script>
```

`.reveal` gizlemesi yalnızca `.js` sınıfı varken devreye girer. Bu satır olmazsa ve
JS yüklenemezse `.reveal` öğeleri `opacity: 0`'da kalır ve **sayfa boş görünür**.
Stylesheet'ten önce, `<head>` içinde olmalı.

### Veriyi DOM'a basarken — XSS

Kullanıcıdan veya veritabanından gelen veri **asla `innerHTML` ile** basılmaz.
`textContent` veya güvenli bir `h()` yardımcısı kullanılır. Bu, `data/*.json`'dan
gelen katılımcı adları için de geçerlidir.

## Dosya Adlandırma

- TR sayfa adları Türkçe ama **ASCII**: `stant-basvurusu.html` (ş/ı/ğ kullanma), kebab-case.
- EN sayfa adları İngilizce, kebab-case.
- CSS sınıfları BEM: `.block`, `.block__element`, `.block--modifier`. Durum sınıfları `.is-*`.

## CSS Kuralları (`assets/css/style.css`)

- Dosya numaralı bölümlerden oluşur (01 Tokens … 12 Responsive). Yeni stil, ait olduğu bölüme eklenir.
- **Renk, boşluk, yarıçap, gölge değerlerini doğrudan yazma** — daima `:root` içindeki
  `--color-*`, `--space-*`, `--radius-*`, `--shadow-*` token'larını kullan.
- Mobil menü kırılım noktası **1024px**. Değiştirilirse `main.js` içindeki
  `DESKTOP_BREAKPOINT` sabiti de güncellenmeli.
- Harici font/CDN yok; sistem font yığını kullanılır.

## Ortak Header / Footer

Build step olmadığı için header ve footer markup'ı **her HTML dosyasında birebir tekrarlanır**.
Bir sayfada değiştirirsen **18 dosyanın hepsinde** aynı değişikliği yap. Sayfadan sayfaya
farklılaşan yalnızca şunlardır:

1. `<html lang>`, `<title>`, `<meta name="description">`, `og:*`
2. `hreflang` / dil değiştirici hedefleri
3. Aktif nav linkindeki `is-active` sınıfı ve `aria-current="page"`
4. EN sayfalarında `assets/` ve diller arası linklerin `../` öneki

## İçerik Durumu

Sayfa gövdeleri şu an **yer tutucu** (`.placeholder`) blokları içerir. Gerçek içerik
eklendikçe bu bloklar kaldırılır; `.placeholder` stili yayın öncesinde CSS'ten silinmelidir.

## Erişilebilirlik

- Her sayfada "İçeriğe geç" skip-link'i ve `<main id="main">` bulunur.
- Hamburger butonu `aria-expanded` ve `aria-controls` taşır; JS bunu senkron tutar.
- Odak halkaları (`:focus-visible`) kaldırılmaz.
- Dekoratif öğelerde `aria-hidden="true"`.

## Kontrol Listesi — yeni sayfa eklerken

1. TR ve EN dosyalarını **birlikte** oluştur.
2. Header/footer'ı mevcut bir sayfadan kopyala; yalnızca yukarıdaki 4 maddeyi değiştir.
3. Yeni sayfa menüye girecekse **18 dosyanın hepsindeki** nav listesine ekle.
4. Her iki dosyaya da karşılıklı `hreflang` etiketlerini koy.
5. Tarayıcıda hem masaüstü hem <640px genişlikte kontrol et; konsolda hata olmamalı.
