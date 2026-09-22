# İkon Lisansı

Bu klasördeki SVG ikonlar **Lucide** ikon setinden alınmıştır.

- Kaynak: https://lucide.dev
- Paket: `lucide-static` **v1.47.0**
- Lisans: **ISC**

Dosyalar build zamanında indirilip repoya alınmıştır; çalışma anında hiçbir CDN'e
bağlanılmaz. Kaynak dosyalar üzerinde yapılan tek değişiklik:

- `stroke-width` 2 → **1.75** (tasarım sistemi kuralı: tek çizgi kalınlığı)
- Sabit `width`/`height` kaldırıldı — boyut `.icon` sınıfından gelir
- `aria-hidden="true" focusable="false"` eklendi (ikonlar dekoratiftir, yanlarında
  her zaman metin bulunur; anlamı yalnızca ikon taşıyorsa `aria-label`'lı bir
  sarmalayıcı kullanılmalıdır)
- Lisans yorumu dosyalardan çıkarılıp bu dosyaya taşındı (ikonlar HTML'e gömüldüğü
  için her sayfada tekrarlanmasın diye)

## ISC License

```
ISC License

Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of
Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors
2022.

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT,
OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE,
DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS
ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS
SOFTWARE.
```

## Yeniden indirme

İkon eklemek veya güncellemek için `tools/icons.mjs` kullanılır.
