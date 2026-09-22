# Dersler

Kullanıcı düzeltmelerinden çıkan, tekrarı önleyecek kurallar. Her madde:
**Ne oldu → Neden yanlıştı → Bundan sonra ne yapılacak.**

## Giresun Expo

### Var olmayan bir dosyaya referans verildiğinde önce doğrula

**Ne oldu:** Görev "CLAUDE.md'deki klasör yapısını oluştur" diyordu; projede böyle bir
dosya yoktu, yalnızca global `~/.claude/CLAUDE.md` vardı ve o da site yapısını içermiyordu.

**Neden önemli:** Varsayılan bir yapı uydurup ilerlemek, 18 dosyalık bir iskeleti
yanlış temel üzerine kurma riski taşıyordu.

**Bundan sonra:** Bir görev belirli bir dosyaya/spesifikasyona atıf yapıyorsa, iş
başlamadan önce o dosyanın varlığı doğrulanır; yoksa durum söylenir ve eksik karar
(sayfa listesi, dil yapısı, tema) kullanıcıya sorulur. Sonuç `CLAUDE.md` olarak
projeye yazılır ki referans bir sonraki sefer gerçekten var olsun.
