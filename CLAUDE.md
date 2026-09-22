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
