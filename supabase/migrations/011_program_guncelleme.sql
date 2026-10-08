-- =============================================================================
-- 011 — Etkinlik programı güncellemesi (8 Ekim 2026 afişi)
--
--   Organizasyonun gönderdiği güncel program afişine göre 010'daki oturumlar
--   düzeltilir (assets/img/program/giresun-expo-2026-program.jpg da güncellendi):
--     - Fuar açılışı 12.00 → 13.00
--     - Kobiler ve Finans Yönetimi: Selahattin SÜLEYMANOĞLU çıktı, Gürkan ÇAKIR ünvanı
--     - Sıfır Atık ve Karbon: Prof. Dr. Fuat ALARÇİN eklendi
--     - Yaşam Alanları Tasarımı: moderatör Mehmet YİĞİT; Koray ÇALIŞKAN çıktı,
--       İsmail CAN (önceki "İsmail BAŞKAN"), Barış KARAYAĞMURLAR eklendi
--     - Savunma Sanayii: Prof. Dr. Fuat ALARÇİN çıktı (9 Ekim'e), Ufuk BECERİKLİ eklendi
--     - Siber Güvenlik ve Yapay Zeka: Çağatay BÜYÜKTOĞÇU çıktı
--     - Hammadde'den Yüksek Katma Değere Üretim: Yalçın ENGİN ve Hülya KOÇEL çıktı,
--       Altan GÜNEŞ eklendi
--
--   Oturumlar gün + Türkçe başlıkla bulunur. Tekrar çalıştırılabilir.
-- =============================================================================

update public.program_sessions set baslangic = '13:00'
where gun = '2026-10-08' and baslik_tr = 'Fuar Açılış Programı';

update public.program_sessions set
  aciklama_tr = E'Fatma ÖZBAYRAM | Moderatör\nGürkan ÇAKIR | Ziraat Katılım Bankası Strateji Planlama Bölüm Bşk.\nDr. M. Anıl KAYA | Giresun Teknopark Gen. Md.',
  aciklama_en = E'Fatma ÖZBAYRAM | Moderator\nGürkan ÇAKIR | Head of Strategic Planning, Ziraat Katılım Bankası\nDr. M. Anıl KAYA | General Manager, Giresun Teknopark'
where gun = '2026-10-09' and baslik_tr = 'Kobiler ve Finans Yönetimi';

update public.program_sessions set
  aciklama_tr = E'Av. Arb. Hakan Arif AYIK | Moderatör\nAv. Arb. İlker ÇAĞLARIRMAK | Hukukçu\nMert GÜLLER | Sürdürülebilirlik Danışmanı, ESGPM Kurucu Ortak\nProf. Dr. Durmuş Çağrı YILDIRIM | İktisat Bölümü Öğr. Üyesi\nMustafa GÖZTOKLUSU | Abega Genel Müdürü\nProf. Dr. Fuat ALARÇİN | Kamu Yöneticisi',
  aciklama_en = E'Av. Arb. Hakan Arif AYIK | Moderator\nAv. Arb. İlker ÇAĞLARIRMAK | Lawyer\nMert GÜLLER | Sustainability Consultant, Co-founder of ESGPM\nProf. Dr. Durmuş Çağrı YILDIRIM | Faculty Member, Department of Economics\nMustafa GÖZTOKLUSU | General Manager, Abega\nProf. Dr. Fuat ALARÇİN | Public Administrator'
where gun = '2026-10-09' and baslik_tr = 'Sıfır Atık ve Karbon';

update public.program_sessions set
  aciklama_tr = E'Mehmet YİĞİT | Trend Home Mağazacılık A.Ş. YK Başkanı - Moderatör\nİzzet YAYLA | İzya İç Mimarlık YK Başkanı\nİsmail CAN | Biofis YK Başkanı\nBarış KARAYAĞMURLAR | Cafe Nero - Baş Mimar',
  aciklama_en = E'Mehmet YİĞİT | Chairman, Trend Home Mağazacılık A.Ş. – Moderator\nİzzet YAYLA | Chairman, İzya İç Mimarlık\nİsmail CAN | Chairman, Biofis\nBarış KARAYAĞMURLAR | Chief Architect, Cafe Nero'
where gun = '2026-10-09' and baslik_tr = 'Yaşam Alanları Tasarımı';

update public.program_sessions set
  aciklama_tr = E'Ramazan Demir | E. Inovoltis Genel Müdürü - Moderatör\nDr. Eray GÜÇLÜER | ASAM Başkanı\nOnur KABAK | Abramak Kurucu Ortak\nZafer GÜRÇAY | Emekli Albay\nUfuk BECERİKLİ | BMC Power İş Geliştirme',
  aciklama_en = E'Ramazan Demir | General Manager, E. Inovoltis – Moderator\nDr. Eray GÜÇLÜER | President, ASAM\nOnur KABAK | Co-founder, Abramak\nZafer GÜRÇAY | Retired Colonel\nUfuk BECERİKLİ | Business Development, BMC Power'
where gun = '2026-10-10' and baslik_tr = 'Savunma Sanayii';

update public.program_sessions set
  aciklama_tr = E'Samet ÖZDEMİR | Heatemp Genel Müdür - Moderatör\nSezgin ŞENER | Toptan TR YK Başkanı\nÇetin YILMAZ | Authority Partners Dijital Dönüşüm Lideri\nAhmet OKTAY | Aiotech AI Solutions Kurucu Ortak / CEO ve Yapay Zeka Platformu Bşk. Yardımcısı',
  aciklama_en = E'Samet ÖZDEMİR | General Manager, Heatemp – Moderator\nSezgin ŞENER | Chairman, Toptan TR\nÇetin YILMAZ | Digital Transformation Lead, Authority Partners\nAhmet OKTAY | Co-founder & CEO, Aiotech AI Solutions; Vice President, Artificial Intelligence Platform'
where gun = '2026-10-11' and baslik_tr = 'Siber Güvenlik ve Yapay Zeka';

update public.program_sessions set
  aciklama_tr = E'Hidayet TAŞKIN | Brosis Kurucu Ortak - Moderatör\nAlparslan YILMAZ | Enes Civata Kurucu Ortak\nAslan KARAARSLAN | AS Metal Genel Müdürü\nAltan GÜNEŞ | Güneş Metal Genel Müdür',
  aciklama_en = E'Hidayet TAŞKIN | Co-founder, Brosis – Moderator\nAlparslan YILMAZ | Co-founder, Enes Civata\nAslan KARAARSLAN | General Manager, AS Metal\nAltan GÜNEŞ | General Manager, Güneş Metal'
where gun = '2026-10-11' and baslik_tr = 'Hammadde''den Yüksek Katma Değere Üretim';

-- Kontrol: 18 oturum; açılış 13.00
select gun, to_char(baslangic, 'HH24:MI') as saat, baslik_tr,
       array_length(string_to_array(aciklama_tr, E'\n'), 1) as konusmaci
from public.program_sessions
where gun between '2026-10-08' and '2026-10-11'
order by gun, baslangic;
