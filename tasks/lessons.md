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

### Varsayilan degeri olan opsiyonel parametre, sessiz veri bozulmasi uretir

**Ne oldu:** `ayarlar.js` icindeki `anahtar(ad, etiket, deger, aciklama)` fonksiyonu
dort cagrinin hepsinde UC argumanla cagrildi. Aciklama metni `deger` parametresine
dustu; `kutu.checked = !!deger` oldugu icin her onay kutusu "acik" gorundu
(`null` gecilen birinde de "kapali"). Form kaydedilince bu yanlis degerler
veritabanina yazildi: `ziyaretci_kaydi_acik` KAPANDI, `program_yayinda` ve
`duyuru_aktif` ACILDI. Canli sitede ziyaretci kaydi bir sure kapali kaldi.

**Neden onemli:** Hicbir yerde hata olusmadi. Sayfa acildi, form gorundu, kaydetme
basarili oldu, toast "kaydedildi" dedi. JavaScript'te fazladan/eksik argumanin
sessiz kalmasi, bu sinifi hatalari ancak VERI kontrol edilince gorunur kiliyor.

**Bundan sonra:**
1. Bir yardimci fonksiyon veriyi DOM'a tasiyorsa ve parametrelerden biri o verinin
   kendisiyse, tipini fonksiyonun basinda dogrula ve uymuyorsa `throw` et. Sessiz
   kabul, veri bozulmasina donusur.
2. Formu kaydettikten sonra "toast cikti mi" degil, "veritabanindaki deger ne oldu"
   diye dogrula. Kaydetme testinin olcusu her zaman veritabanidir.
3. Yaziyi gormek icin degil, ROUND-TRIP icin test et: yukle -> degistirme -> kaydet
   -> geri oku -> dokunulmayan alanlar aynen duruyor mu?
4. Herkese acik bir davranisi kapatan anahtarlar (form kapatma gibi) kaydetmeden
   once onay istesin; yanlislikla kapanma en azindan gorunur olsun.
