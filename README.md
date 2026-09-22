# Giresun Expo

Giresun Expo fuarının tanıtım sitesi. Statik HTML/CSS/JS — derleme adımı, paket
yöneticisi veya framework yoktur.

## Durum

İskelet aşaması: tüm sayfalar TR ve EN olarak mevcut, ortak header/footer ve tasarım
sistemi hazır, sayfa gövdeleri yer tutucu içeriyor.

## Çalıştırma

Dosyaları doğrudan tarayıcıda açabilirsin:

```
index.html
```

Göreli yolların yayındaki gibi davranması için basit bir yerel sunucu önerilir:

```powershell
# Python varsa
python -m http.server 8000
# → http://localhost:8000
```

## Yapı

```
index.html … stant-basvurusu.html   TR sayfalar (9)
en/                                 EN sayfalar (9)
assets/css/style.css                tasarım sistemi
assets/js/main.js                   mobil menü
assets/img/                         görseller
tasks/                              todo & lessons
```

Ayrıntılı yapı, adlandırma ve katkı kuralları için `CLAUDE.md` dosyasına bak.

## Yayın

GitHub Pages, `/giresun-expo/` alt yolunda. Bu yüzden **tüm yollar görelidir** —
`/` ile başlayan bir yol eklenirse yayında 404 verir. Ayrıntı: `CLAUDE.md` →
"Yayın: GitHub Pages".

## Yapılacaklar

Açık işler `tasks/todo.md` içinde takip ediliyor.
