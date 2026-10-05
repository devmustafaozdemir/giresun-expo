-- =============================================================================
-- 010 — Etkinlik programı (8–11 Ekim 2026)
--
--   Organizasyonun gönderdiği program afişinden (assets/img/program/
--   giresun-expo-2026-program.jpg) aktarıldı. Konuşmacılar açıklama alanında
--   her satıra bir kişi olacak şekilde "Ad SOYAD | Görev" biçiminde durur;
--   site bunları liste olarak gösterir (site-veri.js → programYaz).
--
--   Ayrıca "Protokol Töreni" ve "İmza Töreni" için yeni bir oturum türü:
--   'toren' (Tören / Ceremony).
--
--   Program sitede yalnızca Site Ayarları'ndaki "Program yayında" anahtarı
--   açıkken görünür; bu betik anahtara dokunmaz.
--
-- Tekrar çalıştırılabilir (idempotent): aynı gün, saat ve başlıkta oturum
-- varsa yeniden eklenmez. SQL Editor'da tek seferde çalıştırın.
-- =============================================================================

alter table public.program_sessions
  drop constraint if exists program_sessions_tur_check;
alter table public.program_sessions
  add constraint program_sessions_tur_check
  check (tur in ('acilis','panel','atolye','b2b','kulturel','toren','kapanis'));

insert into public.program_sessions
  (gun, baslangic, baslik_tr, baslik_en, aciklama_tr, aciklama_en, tur, sira)
select v.gun::date, v.baslangic::time, v.baslik_tr, v.baslik_en, v.aciklama_tr, v.aciklama_en, v.tur, v.sira
from (values
  -- 8 Ekim Perşembe ----------------------------------------------------------
  ('2026-10-08', '12:00', 'Fuar Açılış Programı', 'Opening Ceremony', '', '', 'acilis', 1),
  ('2026-10-08', '14:30', 'Yerel Medya', 'Local Media',
   E'Sadi TOYGAR | Moderatör\nAydın KÖMÜRCÜ | Giresun Medya Platformu Bşk.\nMedya Mensupları',
   E'Sadi TOYGAR | Moderator\nAydın KÖMÜRCÜ | President, Giresun Media Platform\nMembers of the press',
   'panel', 2),
  ('2026-10-08', '16:00', 'Kurumsal İtibar ve Marka', 'Corporate Reputation and Brand',
   E'Dr. Zafer TAHMAZ | Moderatör\nRecep YETER | Refik Danışmanlık Kurucusu\nGiresun Expo Katılımcısı İş İnsanları',
   E'Dr. Zafer TAHMAZ | Moderator\nRecep YETER | Founder, Refik Danışmanlık\nBusiness people exhibiting at Giresun EXPO',
   'panel', 3),

  -- 9 Ekim Cuma --------------------------------------------------------------
  ('2026-10-09', '14:30', 'Kobiler ve Finans Yönetimi', 'SMEs and Financial Management',
   E'Fatma ÖZBAYRAM | Moderatör\nGürkan ÇAKIR | Ziraat Katılım Bankası\nDr. M. Anıl KAYA | Giresun Teknopark Gen. Md.\nSelahattin SÜLEYMANOĞLU | Finansal Kur. Bir. Gen. Sekreteri',
   E'Fatma ÖZBAYRAM | Moderator\nGürkan ÇAKIR | Ziraat Katılım Bankası\nDr. M. Anıl KAYA | General Manager, Giresun Teknopark\nSelahattin SÜLEYMANOĞLU | Secretary General, Association of Financial Institutions',
   'panel', 1),
  ('2026-10-09', '15:30', 'Sıfır Atık ve Karbon', 'Zero Waste and Carbon',
   E'Av. Arb. Hakan Arif AYIK | Moderatör\nAv. Arb. İlker ÇAĞLARIRMAK | Hukukçu\nMert GÜLLER | Sürdürülebilirlik Danışmanı, ESGPM Kurucu Ortak\nProf. Dr. Durmuş Çağrı YILDIRIM | İktisat Bölümü Öğr. Üyesi\nMustafa GÖZTOKLUSU | Abega Genel Müdürü',
   E'Av. Arb. Hakan Arif AYIK | Moderator\nAv. Arb. İlker ÇAĞLARIRMAK | Lawyer\nMert GÜLLER | Sustainability Consultant, Co-founder of ESGPM\nProf. Dr. Durmuş Çağrı YILDIRIM | Faculty Member, Department of Economics\nMustafa GÖZTOKLUSU | General Manager, Abega',
   'panel', 2),
  ('2026-10-09', '16:30', 'Yaşam Alanları Tasarımı', 'Living Space Design',
   E'Koray ÇALIŞKAN | Modoko - Moderatör\nİzzet YAYLA | İzya İç Mimarlık YK Başkanı\nMehmet YİĞİT | Simurg Mobilya YK Başkanı\nİsmail BAŞKAN | Biofis YK Başkanı',
   E'Koray ÇALIŞKAN | Modoko – Moderator\nİzzet YAYLA | Chairman, İzya İç Mimarlık\nMehmet YİĞİT | Chairman, Simurg Mobilya\nİsmail BAŞKAN | Chairman, Biofis',
   'panel', 3),

  -- 10 Ekim Cumartesi --------------------------------------------------------
  ('2026-10-10', '11:00', 'Organize Sanayi Bölgeleri', 'Organised Industrial Zones',
   E'Hüseyin DÖNER | Moderatör\nM. Bahadır YILMAZ | Giresun 2. OSB Başkanı\nSezai ÜNLÜ | İkitelli OSB YK Üyesi\nErdal BOYACI | Dudullu OSB YK Üyesi\nSebahattin KAYAS | İkitelli OSB Eski YK Üyesi\nSelahattin ÇEKİÇ | Perpa A Blok YK Bşk.',
   E'Hüseyin DÖNER | Moderator\nM. Bahadır YILMAZ | Chairman, Giresun 2nd Organised Industrial Zone\nSezai ÜNLÜ | Board Member, İkitelli OIZ\nErdal BOYACI | Board Member, Dudullu OIZ\nSebahattin KAYAS | Former Board Member, İkitelli OIZ\nSelahattin ÇEKİÇ | Chairman, Perpa Block A',
   'panel', 1),
  ('2026-10-10', '12:00', 'Turizm ve Gastronomi', 'Tourism and Gastronomy',
   E'Erdal DEMİR | Lezzet Ustası/Şef - Moderatör\nErdem KILAVUZ | Giresun İl Kültür ve Turizm Md.\nZiya MUSAOĞLU | Resun Hotel YK Başkanı\nMuzaffer AYGÜN | Titanic Hotels YK Bşk.\nSamet ÖZDEMİR | GeziBilen Genel Müdür',
   E'Erdal DEMİR | Chef – Moderator\nErdem KILAVUZ | Provincial Director of Culture and Tourism, Giresun\nZiya MUSAOĞLU | Chairman, Resun Hotel\nMuzaffer AYGÜN | Chairman, Titanic Hotels\nSamet ÖZDEMİR | General Manager, GeziBilen',
   'panel', 2),
  ('2026-10-10', '13:30', 'Protokol Töreni', 'Protocol Ceremony', '', '', 'toren', 3),
  ('2026-10-10', '16:00', 'Yatırım ve Teşvikler', 'Investment and Incentives',
   E'Sezgin ŞENER | Toptan TR YK Başkanı - Moderatör\nProf. Dr. Ayşe Yiğit ŞAKAR | Rektör Yardımcısı\nKemal AKPINAR | DOKA Genel Sekreteri\nVeysel KARABAŞ | Alfa Solar YK Başkanı',
   E'Sezgin ŞENER | Chairman, Toptan TR – Moderator\nProf. Dr. Ayşe Yiğit ŞAKAR | Vice Rector\nKemal AKPINAR | Secretary General, DOKA\nVeysel KARABAŞ | Chairman, Alfa Solar',
   'panel', 4),
  ('2026-10-10', '17:00', 'Savunma Sanayii', 'Defence Industry',
   E'Ramazan Demir | E. Inovoltis Genel Müdürü - Moderatör\nDr. Eray GÜÇLÜER | ASAM Başkanı\nProf. Dr. Fuat ALARÇİN | Kamu Yöneticisi\nOnur KABAK | Abramak Kurucu Ortak\nZafer GÜRÇAY | Emekli Albay',
   E'Ramazan Demir | General Manager, E. Inovoltis – Moderator\nDr. Eray GÜÇLÜER | President, ASAM\nProf. Dr. Fuat ALARÇİN | Public Administrator\nOnur KABAK | Co-founder, Abramak\nZafer GÜRÇAY | Retired Colonel',
   'panel', 5),
  ('2026-10-10', '18:00', 'Canlı Müzik Programı', 'Live Music', '', '', 'kulturel', 6),

  -- 11 Ekim Pazar ------------------------------------------------------------
  ('2026-10-11', '11:30', 'Fındık', 'Hazelnuts',
   E'İbrahim ALTINOK | Agrapar Genel Müdürü - Moderatör\nAli DENİZ | Fiskobirlik\nMuhammet KOCA | Bulnut\nMurat BOLAT | Borsa İstanbul (Geçmiş Dönem) Bşk. Yrd.',
   E'İbrahim ALTINOK | General Manager, Agrapar – Moderator\nAli DENİZ | Fiskobirlik\nMuhammet KOCA | Bulnut\nMurat BOLAT | Former Vice Chairman, Borsa İstanbul',
   'panel', 1),
  ('2026-10-11', '13:00', 'Siber Güvenlik ve Yapay Zeka', 'Cybersecurity and Artificial Intelligence',
   E'Samet ÖZDEMİR | Heatemp Genel Müdür - Moderatör\nSezgin ŞENER | Toptan TR YK Başkanı\nÇağatay BÜYÜKTOĞÇU | CyberWhiz SEO\nÇetin YILMAZ | Authority Partners Dijital Dönüşüm Lideri\nAhmet OKTAY | Aiotech AI Solutions Kurucu Ortak / CEO ve Yapay Zeka Platformu Bşk. Yardımcısı',
   E'Samet ÖZDEMİR | General Manager, Heatemp – Moderator\nSezgin ŞENER | Chairman, Toptan TR\nÇağatay BÜYÜKTOĞÇU | CyberWhiz SEO\nÇetin YILMAZ | Digital Transformation Lead, Authority Partners\nAhmet OKTAY | Co-founder & CEO, Aiotech AI Solutions; Vice President, Artificial Intelligence Platform',
   'panel', 2),
  ('2026-10-11', '14:00', 'İmza Töreni (Ticaret Anlaşmaları)', 'Signing Ceremony (Trade Agreements)', '', '', 'toren', 3),
  ('2026-10-11', '15:00', 'Hammadde''den Yüksek Katma Değere Üretim', 'From Raw Materials to High Value-Added Production',
   E'Hidayet TAŞKIN | Brosis Kurucu Ortak - Moderatör\nAlparslan YILMAZ | Enes Civata Kurucu Ortak\nAslan KARAARSLAN | AS Metal Genel Müdürü\nYalçın ENGİN | Endow Genel Müdürü\nHülya KOÇEL | Koçel Genel Müdür',
   E'Hidayet TAŞKIN | Co-founder, Brosis – Moderator\nAlparslan YILMAZ | Co-founder, Enes Civata\nAslan KARAARSLAN | General Manager, AS Metal\nYalçın ENGİN | General Manager, Endow\nHülya KOÇEL | General Manager, Koçel',
   'panel', 4),
  ('2026-10-11', '16:00', 'Giresun EXPO', 'Giresun EXPO',
   E'Müjdat KARAYILAN | ŞebinSİAD Bşk. - Moderatör\nMuhterem MEMİŞ | Giresun Fed. Gen. Bşk.\nBahattin ŞENER | Giresun Vakfı Başkanı',
   E'Müjdat KARAYILAN | President, ŞebinSİAD – Moderator\nMuhterem MEMİŞ | President, Giresun Federation\nBahattin ŞENER | President, Giresun Foundation',
   'panel', 5),
  ('2026-10-11', '17:00', 'Kapanış Programı ve Plaket Takdimi', 'Closing Ceremony and Plaque Presentation', '', '', 'kapanis', 6)
) as v(gun, baslangic, baslik_tr, baslik_en, aciklama_tr, aciklama_en, tur, sira)
where not exists (
  select 1 from public.program_sessions p
  where p.gun = v.gun::date and p.baslangic = v.baslangic::time and p.baslik_tr = v.baslik_tr
);

-- Kontrol: 18 oturum (8 Ekim: 3, 9 Ekim: 3, 10 Ekim: 6, 11 Ekim: 6)
select gun, count(*) as oturum from public.program_sessions
where gun between '2026-10-08' and '2026-10-11' group by gun order by gun;
