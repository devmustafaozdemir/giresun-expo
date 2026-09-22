-- =============================================================================
-- Giresun EXPO 2026 — seed.sql
--
-- BU DOSYA ELLE DÜZENLENMEZ. tools/build-seed.mjs tarafından data/*.json'dan
-- üretilir. Değişiklik için JSON'u düzenleyip script'i yeniden çalıştırın.
--
-- Üretim: 2026-09-22
-- Kaynak: Giresun Expo 2026 A5 El Kitapçığı, s.14-19
--
-- 001_init.sql ve 002_storage.sql'den SONRA çalıştırılır.
-- Tekrar çalıştırılabilir: mevcut kayıtlar güncellenir, kopya oluşmaz.
-- =============================================================================

-- Sektörler ------------------------------------------------------------------
insert into public.sectors (id, name_tr, name_en, ikon, sira) values
  ('gida', 'Gıda & İçecek', 'Food & Beverage', 'sektor-gida', 1)
on conflict (id) do update set name_tr=excluded.name_tr, name_en=excluded.name_en,
  ikon=excluded.ikon, sira=excluded.sira;
insert into public.sectors (id, name_tr, name_en, ikon, sira) values
  ('yapi', 'Yapı & İnşaat', 'Construction & Building', 'sektor-yapi', 2)
on conflict (id) do update set name_tr=excluded.name_tr, name_en=excluded.name_en,
  ikon=excluded.ikon, sira=excluded.sira;
insert into public.sectors (id, name_tr, name_en, ikon, sira) values
  ('metal', 'Metal, Makine & Sanayi', 'Metal, Machinery & Industry', 'sektor-metal', 3)
on conflict (id) do update set name_tr=excluded.name_tr, name_en=excluded.name_en,
  ikon=excluded.ikon, sira=excluded.sira;
insert into public.sectors (id, name_tr, name_en, ikon, sira) values
  ('enerji', 'Enerji & Elektrik', 'Energy & Electrical', 'sektor-enerji', 4)
on conflict (id) do update set name_tr=excluded.name_tr, name_en=excluded.name_en,
  ikon=excluded.ikon, sira=excluded.sira;
insert into public.sectors (id, name_tr, name_en, ikon, sira) values
  ('mobilya', 'Mobilya & İç Mimari', 'Furniture & Interior Design', 'sektor-mobilya', 5)
on conflict (id) do update set name_tr=excluded.name_tr, name_en=excluded.name_en,
  ikon=excluded.ikon, sira=excluded.sira;
insert into public.sectors (id, name_tr, name_en, ikon, sira) values
  ('otomotiv', 'Otomotiv & Lojistik', 'Automotive & Logistics', 'sektor-otomotiv', 6)
on conflict (id) do update set name_tr=excluded.name_tr, name_en=excluded.name_en,
  ikon=excluded.ikon, sira=excluded.sira;
insert into public.sectors (id, name_tr, name_en, ikon, sira) values
  ('turizm', 'Turizm & Konaklama', 'Tourism & Hospitality', 'sektor-turizm', 7)
on conflict (id) do update set name_tr=excluded.name_tr, name_en=excluded.name_en,
  ikon=excluded.ikon, sira=excluded.sira;
insert into public.sectors (id, name_tr, name_en, ikon, sira) values
  ('saglik', 'Sağlık', 'Healthcare', 'sektor-saglik', 8)
on conflict (id) do update set name_tr=excluded.name_tr, name_en=excluded.name_en,
  ikon=excluded.ikon, sira=excluded.sira;
insert into public.sectors (id, name_tr, name_en, ikon, sira) values
  ('kimya', 'Kimya, Boya & Plastik', 'Chemicals, Paints & Plastics', 'sektor-kimya', 9)
on conflict (id) do update set name_tr=excluded.name_tr, name_en=excluded.name_en,
  ikon=excluded.ikon, sira=excluded.sira;
insert into public.sectors (id, name_tr, name_en, ikon, sira) values
  ('reklam', 'Reklam, Medya & Basım', 'Advertising, Media & Print', 'sektor-reklam', 10)
on conflict (id) do update set name_tr=excluded.name_tr, name_en=excluded.name_en,
  ikon=excluded.ikon, sira=excluded.sira;
insert into public.sectors (id, name_tr, name_en, ikon, sira) values
  ('denizcilik', 'Denizcilik & Gemi İnşa', 'Maritime & Shipbuilding', 'sektor-denizcilik', 11)
on conflict (id) do update set name_tr=excluded.name_tr, name_en=excluded.name_en,
  ikon=excluded.ikon, sira=excluded.sira;
insert into public.sectors (id, name_tr, name_en, ikon, sira) values
  ('teknoloji', 'Teknoloji & Bilişim', 'Technology & IT', 'sektor-teknoloji', 12)
on conflict (id) do update set name_tr=excluded.name_tr, name_en=excluded.name_en,
  ikon=excluded.ikon, sira=excluded.sira;
insert into public.sectors (id, name_tr, name_en, ikon, sira) values
  ('tekstil', 'Tekstil', 'Textiles', 'sektor-tekstil', 13)
on conflict (id) do update set name_tr=excluded.name_tr, name_en=excluded.name_en,
  ikon=excluded.ikon, sira=excluded.sira;
insert into public.sectors (id, name_tr, name_en, ikon, sira) values
  ('su', 'Su & Çevre Teknolojileri', 'Water & Environmental Tech', 'sektor-su', 14)
on conflict (id) do update set name_tr=excluded.name_tr, name_en=excluded.name_en,
  ikon=excluded.ikon, sira=excluded.sira;
insert into public.sectors (id, name_tr, name_en, ikon, sira) values
  ('tarim', 'Tarım', 'Agriculture', 'sektor-tarim', 15)
on conflict (id) do update set name_tr=excluded.name_tr, name_en=excluded.name_en,
  ikon=excluded.ikon, sira=excluded.sira;
insert into public.sectors (id, name_tr, name_en, ikon, sira) values
  ('hizmet', 'Hizmet, Finans & Ticaret', 'Services, Finance & Trade', 'sektor-hizmet', 16)
on conflict (id) do update set name_tr=excluded.name_tr, name_en=excluded.name_en,
  ikon=excluded.ikon, sira=excluded.sira;
insert into public.sectors (id, name_tr, name_en, ikon, sira) values
  ('diger', 'Diğer', 'Other', 'sektor-diger', 17)
on conflict (id) do update set name_tr=excluded.name_tr, name_en=excluded.name_en,
  ikon=excluded.ikon, sira=excluded.sira;

-- Katılımcılar (86 firma) -------------------------------------------
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Tok Ticaret (Hırdavat Malzemeleri)', 'tok-ticaret-hirdavat-malzemeleri', 'yapi', '{"A1-14"}', 'A',
   '', false, true, 1)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Noma Yapı', 'noma-yapi', 'yapi', '{"A2-02"}', 'A',
   '', false, true, 2)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Hisar Plastik', 'hisar-plastik', 'kimya', '{"A2-12"}', 'A',
   '', false, true, 3)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Burak Sigorta', 'burak-sigorta', 'hizmet', '{"A3-02"}', 'A',
   '', false, true, 4)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Anadolu İndiksiyon', 'anadolu-indiksiyon', 'metal', '{"A3-03"}', 'A',
   '', false, true, 5)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Asır Taahhüt', 'asir-taahhut', 'yapi', '{"A3-05"}', 'A',
   '', false, true, 6)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Osed Elektrik', 'osed-elektrik', 'enerji', '{"A3-07"}', 'A',
   '', false, true, 7)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Tiryaki Matbaacılık', 'tiryaki-matbaacilik', 'reklam', '{"A3-08"}', 'A',
   '', false, true, 8)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('İzya İç Mimarlık', 'izya-ic-mimarlik', 'mobilya', '{"A3-10","A3-12"}', 'A',
   'assets/img/exhibitors/izya-ic-mimarlik.png', false, true, 9)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Simurg Mobilya', 'simurg-mobilya', 'mobilya', '{"A3-13"}', 'A',
   '', false, true, 10)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Ansan Primanova (Mutfak ve Banyo Aksesuarları)', 'ansan-primanova-mutfak-ve-banyo-aksesuarlari', 'yapi', '{"A3-14"}', 'A',
   'assets/img/exhibitors/ansan-primanova-mutfak-ve-banyo-aksesuarlari.png', false, true, 11)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('En Boya', 'en-boya', 'kimya', '{"T1-07"}', 'T',
   'assets/img/exhibitors/en-boya.png', false, true, 12)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Eksen Kimya', 'eksen-kimya', 'kimya', '{"T1-08"}', 'T',
   'assets/img/exhibitors/eksen-kimya.png', false, true, 13)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('KBT Konveyör ve Otomasyon Sistemleri', 'kbt-konveyor-ve-otomasyon-sistemleri', 'metal', '{"T1-09"}', 'T',
   '', false, true, 14)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Meksan Savunma Metal Sac Sanayi', 'meksan-savunma-metal-sac-sanayi', 'metal', '{"T1-10"}', 'T',
   'assets/img/exhibitors/meksan-savunma-metal-sac-sanayi.png', false, true, 15)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Giteks (Damat Tween)', 'giteks-damat-tween', 'tekstil', '{"T1-11"}', 'T',
   'assets/img/exhibitors/giteks-damat-tween.png', false, true, 16)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Yıl-Ka (Tirebolu Çayı)', 'yil-ka-tirebolu-cayi', 'gida', '{"T1-12"}', 'T',
   'assets/img/exhibitors/yil-ka-tirebolu-cayi.png', false, true, 17)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Endow (Kapı ve Pencere Aksesuarları)', 'endow-kapi-ve-pencere-aksesuarlari', 'yapi', '{"T1-14"}', 'T',
   'assets/img/exhibitors/endow-kapi-ve-pencere-aksesuarlari.png', false, true, 18)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Chef Erdal Restaurant', 'chef-erdal-restaurant', 'gida', '{"T2-05"}', 'T',
   '', false, true, 19)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Karancı Kauçuk', 'karanci-kaucuk', 'kimya', '{"T2-06"}', 'T',
   'assets/img/exhibitors/karanci-kaucuk.png', false, true, 20)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Titanic Otel', 'titanic-otel', 'turizm', '{"T2-07"}', 'T',
   'assets/img/exhibitors/titanic-otel.png', false, true, 21)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Öztürk Yemek / Balo / Davet', 'ozturk-yemek-balo-davet', 'gida', '{"T2-08"}', 'T',
   '', false, true, 22)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Eka Metal', 'eka-metal', 'metal', '{"T2-09"}', 'T',
   '', false, true, 23)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Maslak Peugeot', 'maslak-peugeot', 'otomotiv', '{"T2-10"}', 'T',
   '', false, true, 24)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Bayramlar Alüminyum', 'bayramlar-aluminyum', 'metal', '{"T2-11"}', 'T',
   '', false, true, 25)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('As Bakır', 'as-bakir', 'metal', '{"T2-12"}', 'T',
   '', false, true, 26)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Bahat Sağlık Grubu', 'bahat-saglik-grubu', 'saglik', '{"T2-13"}', 'T',
   'assets/img/exhibitors/bahat-saglik-grubu.png', false, true, 27)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Gen Yatırım', 'gen-yatirim', 'hizmet', '{"T2-14"}', 'T',
   'assets/img/exhibitors/gen-yatirim.png', false, true, 28)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Assu', 'assu', 'gida', '{"G1-02"}', 'G',
   'assets/img/exhibitors/assu.png', false, true, 29)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Koçel Çelik Eşya', 'kocel-celik-esya', 'metal', '{"G1-05"}', 'G',
   'assets/img/exhibitors/kocel-celik-esya.png', false, true, 30)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Tuna Alüminyum', 'tuna-aluminyum', 'metal', '{"G1-06"}', 'G',
   'assets/img/exhibitors/tuna-aluminyum.png', false, true, 31)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Hyundai Kaynak', 'hyundai-kaynak', 'metal', '{"G1-07","G1-09"}', 'G',
   'assets/img/exhibitors/hyundai-kaynak.png', false, true, 32)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('SMS Grup İnşaat', 'sms-grup-insaat', 'yapi', '{"G1-08","G2-07"}', 'G',
   'assets/img/exhibitors/sms-grup-insaat.png', false, true, 33)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('ToptanTR', 'toptantr', 'hizmet', '{"G2-01"}', 'G',
   'assets/img/exhibitors/toptantr.png', false, true, 34)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Micansan Tanker', 'micansan-tanker', 'otomotiv', '{"G2-03"}', 'G',
   '', false, true, 35)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Konut Tesis Yönetim', 'konut-tesis-yonetim', 'hizmet', '{"G2-04"}', 'G',
   '', false, true, 36)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Ateş Neon Reklamcılık', 'ates-neon-reklamcilik', 'reklam', '{"G2-05"}', 'G',
   'assets/img/exhibitors/ates-neon-reklamcilik.png', false, true, 37)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Freşa', 'fresa', 'gida', '{"G2-06"}', 'G',
   'assets/img/exhibitors/fresa.png', false, true, 38)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Alfa Solar Enerji', 'alfa-solar-enerji', 'enerji', '{"G2-08"}', 'G',
   'assets/img/exhibitors/alfa-solar-enerji.png', false, true, 39)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Alpi Diş', 'alpi-dis', 'saglik', '{"G2-09"}', 'G',
   'assets/img/exhibitors/alpi-dis.png', false, true, 40)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('By Toom Mobilya', 'by-toom-mobilya', 'mobilya', '{"G3-02"}', 'G',
   '', false, true, 41)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Akpınar Cıvata', 'akpinar-civata', 'metal', '{"G3-03"}', 'G',
   '', false, true, 42)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Bi Ofis Büro Mobilyaları', 'bi-ofis-buro-mobilyalari', 'mobilya', '{"G3-04"}', 'G',
   'assets/img/exhibitors/bi-ofis-buro-mobilyalari.png', false, true, 43)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Giresun Teknopark', 'giresun-teknopark', 'teknoloji', '{"G3-05"}', 'G',
   'assets/img/exhibitors/giresun-teknopark.png', false, true, 44)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Kapela Şemsiye', 'kapela-semsiye', 'diger', '{"G3-06"}', 'G',
   '', false, true, 45)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Teknik Fuarcılık', 'teknik-fuarcilik', 'reklam', '{"G3-07","G3-09"}', 'G',
   'assets/img/exhibitors/teknik-fuarcilik.png', false, true, 46)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Mir Water', 'mir-water', 'su', '{"G3-08"}', 'G',
   'assets/img/exhibitors/mir-water.png', false, true, 47)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Karlı Metal', 'karli-metal', 'metal', '{"P1-01"}', 'P',
   '', false, true, 48)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Yunus Gemi İnşaat', 'yunus-gemi-insaat', 'denizcilik', '{"P1-02"}', 'P',
   'assets/img/exhibitors/yunus-gemi-insaat.png', false, true, 49)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Resun Otel', 'resun-otel', 'turizm', '{"P1-03","P1-06"}', 'P',
   'assets/img/exhibitors/resun-otel.png', false, true, 50)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Bilir Basım', 'bilir-basim', 'reklam', '{"P1-04"}', 'P',
   '', false, true, 51)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Makro BYC İnşaat', 'makro-byc-insaat', 'yapi', '{"P1-05"}', 'P',
   '', false, true, 52)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Alp Tekstil', 'alp-tekstil', 'tekstil', '{"P1-07"}', 'P',
   '', false, true, 53)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('CRK Otomotiv', 'crk-otomotiv', 'otomotiv', '{"P1-08"}', 'P',
   'assets/img/exhibitors/crk-otomotiv.png', false, true, 54)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Bayramlar Metal', 'bayramlar-metal', 'metal', '{"P1-09"}', 'P',
   '', false, true, 55)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Turkuaz Gemi İnşa', 'turkuaz-gemi-insa', 'denizcilik', '{"P1-10"}', 'P',
   'assets/img/exhibitors/turkuaz-gemi-insa.png', false, true, 56)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Özgüneş Sürücü Kursu', 'ozgunes-surucu-kursu', 'hizmet', '{"P1-11"}', 'P',
   '', false, true, 57)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Agrapar Tarım', 'agrapar-tarim', 'tarim', '{"P1-12"}', 'P',
   '', false, true, 58)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Güneş Metal', 'gunes-metal', 'metal', '{"P1-13"}', 'P',
   'assets/img/exhibitors/gunes-metal.png', false, true, 59)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Abramak Bilgi Teknolojileri', 'abramak-bilgi-teknolojileri', 'teknoloji', '{"P1-14"}', 'P',
   'assets/img/exhibitors/abramak-bilgi-teknolojileri.png', false, true, 60)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Fındıko Gıda', 'findiko-gida', 'gida', '{"P1-15"}', 'P',
   '', false, true, 61)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Özdemir Makina', 'ozdemir-makina', 'metal', '{"P1-16"}', 'P',
   'assets/img/exhibitors/ozdemir-makina.png', false, true, 62)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Göresun Seyahat', 'goresun-seyahat', 'turizm', '{"P1-17"}', 'P',
   '', false, true, 63)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Brosis Lazer Kesim', 'brosis-lazer-kesim', 'metal', '{"P1-18"}', 'P',
   'assets/img/exhibitors/brosis-lazer-kesim.png', false, true, 64)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Heatemp (Bina Otomasyonu ve Endüstriyel İklimlendirme Çözümleri)', 'heatemp-bina-otomasyonu-ve-endustriyel-iklimlendirme-cozumleri', 'enerji', '{"P1-19"}', 'P',
   '', false, true, 65)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Switch Elektronik', 'switch-elektronik', 'enerji', '{"P1-20"}', 'P',
   '', false, true, 66)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Arstek Metal', 'arstek-metal', 'metal', '{"P1-21"}', 'P',
   'assets/img/exhibitors/arstek-metal.png', false, true, 67)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Enes Cıvata', 'enes-civata', 'metal', '{"P1-22"}', 'P',
   'assets/img/exhibitors/enes-civata.png', false, true, 68)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('İnovoltis Enerji ve Elektronik', 'inovoltis-enerji-ve-elektronik', 'enerji', '{"P1-23"}', 'P',
   'assets/img/exhibitors/inovoltis-enerji-ve-elektronik.png', false, true, 69)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Tusaser Su Arıtma Sistemleri', 'tusaser-su-aritma-sistemleri', 'su', '{"P1-24"}', 'P',
   'assets/img/exhibitors/tusaser-su-aritma-sistemleri.png', false, true, 70)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Müjdat Karayılan', 'mujdat-karayilan', 'diger', '{"P2-01","P2-02","P2-03","P2-04","P2-05","P2-06"}', 'P',
   '', false, true, 71)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('NOK Grup İnşaat', 'nok-grup-insaat', 'yapi', '{"P2-07"}', 'P',
   'assets/img/exhibitors/nok-grup-insaat.png', false, true, 72)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Hakan Reklam', 'hakan-reklam', 'reklam', '{"P2-09"}', 'P',
   '', false, true, 73)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Abega Nuclear (Radyoaktif ve Nükleer Hizmetler)', 'abega-nuclear-radyoaktif-ve-nukleer-hizmetler', 'enerji', '{"P2-10"}', 'P',
   'assets/img/exhibitors/abega-nuclear-radyoaktif-ve-nukleer-hizmetler.png', false, true, 74)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Cesurlar Mühendislik', 'cesurlar-muhendislik', 'yapi', '{"P2-13"}', 'P',
   '', false, true, 75)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Syvera Fındık İşleme ve Lezzet Atölyesi', 'syvera-findik-isleme-ve-lezzet-atolyesi', 'gida', '{"P2-16"}', 'P',
   'assets/img/exhibitors/syvera-findik-isleme-ve-lezzet-atolyesi.png', false, true, 76)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('KKG Elektrik ve Aydınlatma', 'kkg-elektrik-ve-aydinlatma', 'enerji', '{"P2-19"}', 'P',
   'assets/img/exhibitors/kkg-elektrik-ve-aydinlatma.png', false, true, 77)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Hıdır Fındık', 'hidir-findik', 'gida', '{"P2-22"}', 'P',
   '', false, true, 78)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Aydın Grup İnşaat', 'aydin-grup-insaat', 'yapi', '{"E-07"}', 'E',
   'assets/img/exhibitors/aydin-grup-insaat.png', false, true, 79)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Asır Otomotiv', 'asir-otomotiv', 'otomotiv', '{"E-08","E-09"}', 'E',
   'assets/img/exhibitors/asir-otomotiv.png', false, true, 80)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Sazak Yemek', 'sazak-yemek', 'gida', '{"E-10"}', 'E',
   '', false, true, 81)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Ocak Kalıp', 'ocak-kalip', 'metal', '{"E-18","E-19"}', 'E',
   'assets/img/exhibitors/ocak-kalip.png', false, true, 82)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Ajanssis / Mecra Medya', 'ajanssis-mecra-medya', 'reklam', '{"E-32","E-33"}', 'E',
   '', false, true, 83)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Tıkla Gelsin', 'tikla-gelsin', 'hizmet', '{"E-35"}', 'E',
   '', false, true, 84)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('DMR Tüketim', 'dmr-tuketim', 'hizmet', '{"E-38"}', 'E',
   '', false, true, 85)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;
insert into public.exhibitors
  (name, slug, sector_id, stands, hall, logo_url, featured, published, sira) values
  ('Ford Kent Oto', 'ford-kent-oto', 'otomotiv', '{"E-43","E-44"}', 'E',
   '', false, true, 86)
on conflict (slug) do update set name=excluded.name, sector_id=excluded.sector_id,
  stands=excluded.stands, hall=excluded.hall, logo_url=excluded.logo_url,
  featured=excluded.featured, published=excluded.published, sira=excluded.sira;

-- Paydaşlar (EK §5: sponsors tablosunda seviye=partner) ----------------------
insert into public.sponsors (ad_tr, ad_en, aciklama_tr, aciklama_en, seviye, logo_url, web, sira) values
  ('Giresun Vakfı', 'Giresun Foundation', 'Kalkınma, Eğitim, Kültür, Spor ve Tanıtım', 'Development, Education, Culture, Sport and Promotion',
   'partner', 'assets/img/partners/giresun-vakfi.png', '', 1)
on conflict (ad_tr) do update set
  ad_en=excluded.ad_en, aciklama_tr=excluded.aciklama_tr,
  aciklama_en=excluded.aciklama_en, seviye=excluded.seviye,
  logo_url=excluded.logo_url, web=excluded.web, sira=excluded.sira;
insert into public.sponsors (ad_tr, ad_en, aciklama_tr, aciklama_en, seviye, logo_url, web, sira) values
  ('Giresun Federasyonu', 'Giresun Federation', '', '',
   'partner', 'assets/img/partners/giresun-federasyonu.png', '', 2)
on conflict (ad_tr) do update set
  ad_en=excluded.ad_en, aciklama_tr=excluded.aciklama_tr,
  aciklama_en=excluded.aciklama_en, seviye=excluded.seviye,
  logo_url=excluded.logo_url, web=excluded.web, sira=excluded.sira;
insert into public.sponsors (ad_tr, ad_en, aciklama_tr, aciklama_en, seviye, logo_url, web, sira) values
  ('ŞEBİNSİAD', 'ŞEBİNSİAD', 'Şebinkarahisar Sanayici ve İş İnsanları Derneği', 'Şebinkarahisar Association of Industrialists and Businesspeople',
   'partner', 'assets/img/partners/sebinsiad.png', '', 3)
on conflict (ad_tr) do update set
  ad_en=excluded.ad_en, aciklama_tr=excluded.aciklama_tr,
  aciklama_en=excluded.aciklama_en, seviye=excluded.seviye,
  logo_url=excluded.logo_url, web=excluded.web, sira=excluded.sira;

-- SSS (8 soru — hepsi kitapçıktan doğrulanabilir) ---------------------
insert into public.faqs (slug, soru_tr, soru_en, cevap_tr, cevap_en, sira) values
  ('ne-zaman-nerede', 'Giresun EXPO 2026 ne zaman ve nerede düzenleniyor?', 'When and where is Giresun EXPO 2026 held?', '8–11 Ekim 2026 tarihlerinde, İstanbul Yenikapı Etkinlik Alanı''ndaki Dr. Mimar Kadir Topbaş Gösteri ve Sanat Merkezi''nde düzenlenecek.', 'From 8 to 11 October 2026, at the Dr. Mimar Kadir Topbaş Arts and Performance Centre in the Yenikapı Event Area, Istanbul.', 1)
on conflict (slug) do update set soru_tr=excluded.soru_tr, soru_en=excluded.soru_en,
  cevap_tr=excluded.cevap_tr, cevap_en=excluded.cevap_en, sira=excluded.sira;
insert into public.faqs (slug, soru_tr, soru_en, cevap_tr, cevap_en, sira) values
  ('ziyaret-saatleri', 'Fuar hangi saatlerde açık?', 'What are the opening hours?', 'Perşembe ve Cuma 10.00–19.00, Cumartesi 10.00–20.00, Pazar 10.00–18.00 saatleri arasında ziyarete açık.', 'Thursday and Friday 10:00–19:00, Saturday 10:00–20:00, Sunday 10:00–18:00.', 2)
on conflict (slug) do update set soru_tr=excluded.soru_tr, soru_en=excluded.soru_en,
  cevap_tr=excluded.cevap_tr, cevap_en=excluded.cevap_en, sira=excluded.sira;
insert into public.faqs (slug, soru_tr, soru_en, cevap_tr, cevap_en, sira) values
  ('ulasim', 'Fuar alanına nasıl ulaşabilirim?', 'How do I get to the venue?', 'Yenikapı, Marmaray ile M1A, M1B ve M2 metro hatlarının kesiştiği bir aktarma noktasıdır. Anadolu Yakası''ndan M4 ile Ayrılık Çeşmesi''ne gelip Marmaray''a aktarma yapabilir, Üsküdar''dan doğrudan Marmaray''a binebilirsiniz. Çevrede 30D, 31, 31Y, 50Y, 70FY ve 70KY İETT hatları hizmet veriyor.', 'Yenikapı is an interchange where the Marmaray line meets the M1A, M1B and M2 metro lines. From the Anatolian side you can take the M4 to Ayrılık Çeşmesi and change to the Marmaray, or board the Marmaray directly at Üsküdar. IETT bus lines 30D, 31, 31Y, 50Y, 70FY and 70KY serve the area.', 3)
on conflict (slug) do update set soru_tr=excluded.soru_tr, soru_en=excluded.soru_en,
  cevap_tr=excluded.cevap_tr, cevap_en=excluded.cevap_en, sira=excluded.sira;
insert into public.faqs (slug, soru_tr, soru_en, cevap_tr, cevap_en, sira) values
  ('otopark', 'Otopark imkânı var mı?', 'Is there parking?', 'Evet. Özel aracıyla gelecek ziyaretçiler için Yenikapı Etkinlik Alanı çevresinde otopark imkânı bulunuyor.', 'Yes. Parking is available around the Yenikapı Event Area for visitors arriving by car.', 4)
on conflict (slug) do update set soru_tr=excluded.soru_tr, soru_en=excluded.soru_en,
  cevap_tr=excluded.cevap_tr, cevap_en=excluded.cevap_en, sira=excluded.sira;
insert into public.faqs (slug, soru_tr, soru_en, cevap_tr, cevap_en, sira) values
  ('kimler-katiliyor', 'Fuarda kimler yer alıyor?', 'Who takes part in the fair?', '86 katılımcı firma beş salonda stant açıyor. Fuar; kamu kurumlarını, özel sektörü, yatırımcıları, üreticileri, sanayicileri, girişimcileri, üniversiteleri, kooperatifleri ve sivil toplum kuruluşlarını aynı çatı altında buluşturuyor.', '86 exhibiting companies have stands across five halls. The fair brings together public institutions, the private sector, investors, producers, industrialists, entrepreneurs, universities, cooperatives and civil society organisations.', 5)
on conflict (slug) do update set soru_tr=excluded.soru_tr, soru_en=excluded.soru_en,
  cevap_tr=excluded.cevap_tr, cevap_en=excluded.cevap_en, sira=excluded.sira;
insert into public.faqs (slug, soru_tr, soru_en, cevap_tr, cevap_en, sira) values
  ('kim-duzenliyor', 'Fuarı kim düzenliyor?', 'Who organises the fair?', 'Organizasyon; Giresun Vakfı, Giresun Federasyonu ve Şebinkarahisar Sanayici ve İş İnsanları Derneği (ŞEBİNSİAD) ortaklığıyla hayata geçiriliyor.', 'The fair is organised jointly by the Giresun Foundation, the Giresun Federation and the Şebinkarahisar Association of Industrialists and Businesspeople (ŞEBİNSİAD).', 6)
on conflict (slug) do update set soru_tr=excluded.soru_tr, soru_en=excluded.soru_en,
  cevap_tr=excluded.cevap_tr, cevap_en=excluded.cevap_en, sira=excluded.sira;
insert into public.faqs (slug, soru_tr, soru_en, cevap_tr, cevap_en, sira) values
  ('salonlar', 'Salonlar nasıl düzenlenmiş?', 'How are the halls organised?', 'Stantlar A, T, G, P ve E olmak üzere beş alana dağılmış durumda. Stant numarasının ilk harfi bulunduğu alanı gösterir; Katılımcılar sayfasından salona göre filtreleyebilirsiniz.', 'Stands are spread across five areas: A, T, G, P and E. The first letter of a stand number indicates its area; you can filter by hall on the Exhibitors page.', 7)
on conflict (slug) do update set soru_tr=excluded.soru_tr, soru_en=excluded.soru_en,
  cevap_tr=excluded.cevap_tr, cevap_en=excluded.cevap_en, sira=excluded.sira;
insert into public.faqs (slug, soru_tr, soru_en, cevap_tr, cevap_en, sira) values
  ('program', 'Etkinlik programı açıklandı mı?', 'Has the event programme been announced?', 'Panel, sunum ve oturum programı henüz açıklanmadı. Açıklandığında bu sitede yayımlanacak.', 'The programme of panels, presentations and sessions has not been announced yet. It will be published on this site once available.', 8)
on conflict (slug) do update set soru_tr=excluded.soru_tr, soru_en=excluded.soru_en,
  cevap_tr=excluded.cevap_tr, cevap_en=excluded.cevap_en, sira=excluded.sira;

-- Ulaşım seçenekleri (kitapçık §4) -------------------------------------------
insert into public.transport_options (slug, ikon, baslik_tr, baslik_en, metin_tr, metin_en, hatlar, sira) values
  ('anadolu-yakasi', 'ulasim-metro', 'Anadolu Yakası''ndan', 'From the Anatolian Side',
   'Kadıköy''den M4 metrosu ile Ayrılık Çeşmesi durağına gelerek Marmaray''a aktarma yapabilirsiniz. Üsküdar''dan ise Marmaray''a doğrudan binerek Yenikapı durağında inebilirsiniz.', 'Take the M4 metro from Kadıköy to Ayrılık Çeşmesi and change to the Marmaray. From Üsküdar you can board the Marmaray directly and get off at Yenikapı.', '{"M4","Marmaray"}', 1)
on conflict (slug) do update set ikon=excluded.ikon, baslik_tr=excluded.baslik_tr,
  baslik_en=excluded.baslik_en, metin_tr=excluded.metin_tr, metin_en=excluded.metin_en,
  hatlar=excluded.hatlar, sira=excluded.sira;
insert into public.transport_options (slug, ikon, baslik_tr, baslik_en, metin_tr, metin_en, hatlar, sira) values
  ('avrupa-yakasi', 'ulasim-metro', 'Avrupa Yakası''ndan', 'From the European Side',
   'M1A, M1B ve M2 metro hatlarıyla Yenikapı''ya ulaşabilirsiniz. Taksim''den M2 metrosu, Bağcılar yönünden ise M1B metrosu Yenikapı durağına gelir.', 'The M1A, M1B and M2 metro lines all reach Yenikapı. Take the M2 from Taksim, or the M1B from the Bağcılar direction.', '{"M1A","M1B","M2","Marmaray"}', 2)
on conflict (slug) do update set ikon=excluded.ikon, baslik_tr=excluded.baslik_tr,
  baslik_en=excluded.baslik_en, metin_tr=excluded.metin_tr, metin_en=excluded.metin_en,
  hatlar=excluded.hatlar, sira=excluded.sira;
insert into public.transport_options (slug, ikon, baslik_tr, baslik_en, metin_tr, metin_en, hatlar, sira) values
  ('otobus', 'ulasim-otobus', 'Otobüsle', 'By Bus',
   'Yenikapı Etkinlik Alanı çevresinde 30D, 31, 31Y, 50Y, 70FY ve 70KY gibi çeşitli İETT hatları hizmet veriyor.', 'Several IETT bus lines serve the area around the Yenikapı Event Area, including 30D, 31, 31Y, 50Y, 70FY and 70KY.', '{"30D","31","31Y","50Y","70FY","70KY"}', 3)
on conflict (slug) do update set ikon=excluded.ikon, baslik_tr=excluded.baslik_tr,
  baslik_en=excluded.baslik_en, metin_tr=excluded.metin_tr, metin_en=excluded.metin_en,
  hatlar=excluded.hatlar, sira=excluded.sira;
insert into public.transport_options (slug, ikon, baslik_tr, baslik_en, metin_tr, metin_en, hatlar, sira) values
  ('ozel-arac', 'ulasim-arac', 'Özel araçla', 'By Car',
   'Özel aracıyla gelecek ziyaretçiler için Yenikapı Etkinlik Alanı çevresinde otopark imkânı bulunuyor.', 'Parking is available around the Yenikapı Event Area for visitors arriving by car.', '{}', 4)
on conflict (slug) do update set ikon=excluded.ikon, baslik_tr=excluded.baslik_tr,
  baslik_en=excluded.baslik_en, metin_tr=excluded.metin_tr, metin_en=excluded.metin_en,
  hatlar=excluded.hatlar, sira=excluded.sira;

-- Site ayarları (tek satır) ---------------------------------------------------
insert into public.site_settings (
  id, etkinlik_adi, baslangic_tarihi, bitis_tarihi, geri_sayim_hedefi,
  manset_tr, manset_en, slogan_tr, slogan_en,
  mekan_ad_tr, mekan_ad_en, mekan_alan_tr, mekan_alan_en, mekan_sehir,
  adres_tr, adres_en, harita_sorgusu,
  telefon, eposta, web, sosyal,
  ziyaret_saatleri, istatistikler,
  duyuru_aktif, duyuru_metin_tr, duyuru_metin_en, duyuru_link,
  durum_oncesi_tr, durum_oncesi_en, durum_sirasinda_tr, durum_sirasinda_en,
  durum_sonrasi_tr, durum_sonrasi_en,
  stant_basvuru_acik, stant_baslik_tr, stant_baslik_en, stant_kapali_tr, stant_kapali_en,
  ziyaretci_kaydi_acik, program_yayinda
) values (
  true, 'Giresun EXPO 2026', '2026-10-08', '2026-10-11', '2026-10-08T10:00:00+03:00',
  'Giresun İş Dünyası İstanbul''da Buluşuyor', 'Giresun''s Business Community Meets in Istanbul', 'Giresun İçin İş Birliği, Türkiye İçin Güç Birliği', 'Cooperation for Giresun, Strength for Türkiye',
  'Dr. Mimar Kadir Topbaş Gösteri ve Sanat Merkezi', 'Dr. Mimar Kadir Topbaş Arts and Performance Centre', 'Yenikapı Etkinlik Alanı', 'Yenikapı Event Area', 'İstanbul',
  'Aksaray Mahallesi, Yenikapı Etkinlik Alanı, Kennedy Caddesi No: 11/1, Fatih/İstanbul', 'Aksaray Mahallesi, Yenikapı Event Area, Kennedy Caddesi No: 11/1, Fatih/Istanbul', 'Dr. Mimar Kadir Topbaş Gösteri ve Sanat Merkezi, Yenikapı, Fatih, İstanbul',
  '0541 662 28 28', '', 'giresunexpo.com', '{"_not":"Kitapçıkta yok. Hepsi boş olduğu sürece sosyal medya bölümü sitede hiç render edilmez.","instagram":"","linkedin":"","x":"","facebook":"","youtube":""}'::jsonb,
  '[{"tarih":"2026-10-08","gun_tr":"Perşembe","gun_en":"Thursday","acilis":"10:00","kapanis":"19:00"},{"tarih":"2026-10-09","gun_tr":"Cuma","gun_en":"Friday","acilis":"10:00","kapanis":"19:00"},{"tarih":"2026-10-10","gun_tr":"Cumartesi","gun_en":"Saturday","acilis":"10:00","kapanis":"20:00"},{"tarih":"2026-10-11","gun_tr":"Pazar","gun_en":"Sunday","acilis":"10:00","kapanis":"18:00"}]'::jsonb, '[{"deger":"86","etiket_tr":"Katılımcı firma","etiket_en":"Exhibiting companies"},{"deger":"4","etiket_tr":"Gün","etiket_en":"Days"},{"deger":"3","etiket_tr":"Paydaş kuruluş","etiket_en":"Partner institutions"},{"deger":"5","etiket_tr":"Salon","etiket_en":"Halls"}]'::jsonb,
  false, '', '', '',
  'Fuara kalan süre', 'Time until the fair', 'Fuar devam ediyor — 8–11 Ekim 2026, Yenikapı', 'The fair is open — 8–11 October 2026, Yenikapı',
  'Giresun EXPO 2026 için teşekkürler. 2027''de görüşmek üzere.', 'Thank you for Giresun EXPO 2026. See you in 2027.',
  true, 'Katılımcı Olun: Giresun EXPO 2027 ön başvurusu', 'Become an Exhibitor: Giresun EXPO 2027 pre-application', 'Başvurular şu anda kapalı. Yeniden açıldığında bu sayfadan duyurulacak.', 'Applications are currently closed. They will be announced here when they reopen.',
  true, false
)
on conflict (id) do update set
  etkinlik_adi=excluded.etkinlik_adi, baslangic_tarihi=excluded.baslangic_tarihi,
  bitis_tarihi=excluded.bitis_tarihi, geri_sayim_hedefi=excluded.geri_sayim_hedefi,
  manset_tr=excluded.manset_tr, manset_en=excluded.manset_en,
  slogan_tr=excluded.slogan_tr, slogan_en=excluded.slogan_en,
  mekan_ad_tr=excluded.mekan_ad_tr, mekan_ad_en=excluded.mekan_ad_en,
  mekan_alan_tr=excluded.mekan_alan_tr, mekan_alan_en=excluded.mekan_alan_en,
  mekan_sehir=excluded.mekan_sehir, adres_tr=excluded.adres_tr, adres_en=excluded.adres_en,
  harita_sorgusu=excluded.harita_sorgusu, telefon=excluded.telefon,
  ziyaret_saatleri=excluded.ziyaret_saatleri, istatistikler=excluded.istatistikler,
  durum_oncesi_tr=excluded.durum_oncesi_tr, durum_oncesi_en=excluded.durum_oncesi_en,
  durum_sirasinda_tr=excluded.durum_sirasinda_tr, durum_sirasinda_en=excluded.durum_sirasinda_en,
  durum_sonrasi_tr=excluded.durum_sonrasi_tr, durum_sonrasi_en=excluded.durum_sonrasi_en,
  stant_baslik_tr=excluded.stant_baslik_tr, stant_baslik_en=excluded.stant_baslik_en;

-- =============================================================================
-- Özet: 17 sektör · 86 katılımcı · 3 paydaş · 8 SSS · 4 ulaşım · 1 site ayarı satırı
-- Logolu katılımcı: 45 / 86
-- =============================================================================
