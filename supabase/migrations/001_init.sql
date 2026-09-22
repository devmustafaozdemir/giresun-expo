-- =============================================================================
-- Giresun EXPO 2026 — Supabase şeması
-- 001_init.sql
--
-- Supabase SQL Editor'da BİR KEZ, bütün olarak çalıştırılır.
-- Ardından 002_storage.sql, sonra seed.sql, en son 003_admin.sql.
-- Ayrıntı: docs/SUPABASE-KURULUM.md
--
-- Tasarım kararları:
--   * Çok dilli alanlar _tr / _en sütun çifti (ayrı satır değil) — public site
--     tek sorguda iki dili de alır, admin panelde yan yana düzenlenir.
--   * Anon (ziyaretçi) rolü: yalnızca published=true içeriği OKUR; başvuru,
--     kayıt, mesaj ve bülten tablolarına SADECE INSERT yapar. Kendi yazdığını
--     bile geri okuyamaz — başvuru listeleri sızmaz.
--   * Başvuru/kayıt numaraları VERİTABANINDA üretilir; istemciye güvenilmez.
-- =============================================================================

-- Supabase'de zaten kurulu; emin olmak için:
create extension if not exists "pgcrypto";

-- =============================================================================
-- 0. Ortak yardımcılar
-- =============================================================================

-- updated_at'i her UPDATE'te tazeler
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- E-posta biçimi — check constraint'lerde kullanılır
create or replace function public.is_email(v text)
returns boolean
language sql
immutable
as $$
  select v ~ '^[^@[:space:]]+@[^@[:space:]]+\.[a-zA-Z]{2,}$';
$$;


-- =============================================================================
-- 1. Yönetim: admins + is_admin()
--    RLS politikalarının tamamı bu iki şeye dayanır, o yüzden en başta.
-- =============================================================================

create table if not exists public.admins (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  email       text not null,
  ad_soyad    text,
  role        text not null default 'editor' check (role in ('owner', 'editor')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint admins_email_gecerli check (public.is_email(email))
);

create or replace trigger admins_updated_at before update on public.admins
  for each row execute function public.set_updated_at();

-- Oturumdaki kullanıcı admin mi?
-- security definer: RLS'i atlayarak admins tablosunu okur, yoksa sonsuz döngü olur.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Oturumdaki kullanıcının rolü ('owner' | 'editor' | null)
create or replace function public.admin_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.admins where user_id = auth.uid();
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.admin_role() from public;
grant execute on function public.is_admin() to authenticated, anon;
grant execute on function public.admin_role() to authenticated;


-- =============================================================================
-- 2. Site ayarları — tek satır
-- =============================================================================

create table if not exists public.site_settings (
  id                    boolean primary key default true check (id),  -- tek satır güvencesi
  -- Künye
  etkinlik_adi          text not null default 'Giresun EXPO 2026',
  baslangic_tarihi      date not null,
  bitis_tarihi          date not null,
  geri_sayim_hedefi     timestamptz not null,
  -- Manşet ve slogan (EK §5)
  manset_tr             text not null default '',
  manset_en             text not null default '',
  slogan_tr             text not null default '',
  slogan_en             text not null default '',
  -- Mekân
  mekan_ad_tr           text not null default '',
  mekan_ad_en           text not null default '',
  mekan_alan_tr         text not null default '',
  mekan_alan_en         text not null default '',
  mekan_sehir           text not null default '',
  adres_tr              text not null default '',
  adres_en              text not null default '',
  harita_sorgusu        text not null default '',
  harita_lat            numeric(9,6),
  harita_lng            numeric(9,6),
  -- İletişim: boş bırakılanlar sitede HİÇ render edilmez
  telefon               text not null default '',
  eposta                text not null default '',
  web                   text not null default '',
  sosyal                jsonb not null default '{}'::jsonb,
  -- Ziyaret saatleri (EK §5): [{tarih, gun_tr, gun_en, acilis, kapanis}]
  ziyaret_saatleri      jsonb not null default '[]'::jsonb,
  -- İstatistikler: [{deger, etiket_tr, etiket_en}] — yalnızca doğrulanabilir olanlar
  istatistikler         jsonb not null default '[]'::jsonb,
  -- Duyuru çubuğu
  duyuru_aktif          boolean not null default false,
  duyuru_metin_tr       text not null default '',
  duyuru_metin_en       text not null default '',
  duyuru_link           text not null default '',
  -- Etkinlik durumu metinleri (EK §4): öncesi / sırasında / sonrası
  durum_oncesi_tr       text not null default '',
  durum_oncesi_en       text not null default '',
  durum_sirasinda_tr    text not null default '',
  durum_sirasinda_en    text not null default '',
  durum_sonrasi_tr      text not null default '',
  durum_sonrasi_en      text not null default '',
  -- Stant başvurusu (EK §4)
  stant_basvuru_acik    boolean not null default true,
  stant_baslik_tr       text not null default '',
  stant_baslik_en       text not null default '',
  stant_kapali_tr       text not null default '',
  stant_kapali_en       text not null default '',
  stant_fiyatlari       jsonb not null default '[]'::jsonb,
  -- Ziyaretçi kaydı
  ziyaretci_kaydi_acik  boolean not null default true,
  -- Program yayında mı (EK §4: değilse menüde Program yerine Ziyaret Bilgileri)
  program_yayinda       boolean not null default false,
  updated_at            timestamptz not null default now(),
  constraint tarih_sirasi check (bitis_tarihi >= baslangic_tarihi)
);

create or replace trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();


-- =============================================================================
-- 3. İçerik tabloları
-- =============================================================================

create table if not exists public.sectors (
  id          text primary key,                       -- 'gida', 'yapi' ...
  name_tr     text not null check (length(name_tr) between 1 and 120),
  name_en     text not null check (length(name_en) between 1 and 120),
  ikon        text not null default '',               -- assets/icons/ dosya adı
  sira        integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create or replace trigger sectors_updated_at before update on public.sectors
  for each row execute function public.set_updated_at();

create table if not exists public.exhibitors (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (length(name) between 1 and 200),
  slug          text not null unique check (slug ~ '^[a-z0-9-]+$'),
  sector_id     text references public.sectors(id) on delete set null,
  stands        text[] not null default '{}',         -- EK §5
  hall          text check (hall in ('A','T','G','P','E')),  -- EK §5
  logo_url      text not null default '',
  aciklama_tr   text not null default '',
  aciklama_en   text not null default '',
  web           text not null default '',
  sosyal        jsonb not null default '{}'::jsonb,
  featured      boolean not null default false,
  published     boolean not null default true,
  sira          integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create or replace trigger exhibitors_updated_at before update on public.exhibitors
  for each row execute function public.set_updated_at();
create index if not exists exhibitors_hall_idx on public.exhibitors(hall);
create index if not exists exhibitors_sector_idx on public.exhibitors(sector_id);
create index if not exists exhibitors_published_idx on public.exhibitors(published);

create table if not exists public.speakers (
  id            uuid primary key default gen_random_uuid(),
  ad_soyad      text not null check (length(ad_soyad) between 1 and 160),
  unvan_tr      text not null default '',
  unvan_en      text not null default '',
  kurum         text not null default '',
  foto_url      text not null default '',
  biyografi_tr  text not null default '',
  biyografi_en  text not null default '',
  published     boolean not null default true,
  sira          integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create or replace trigger speakers_updated_at before update on public.speakers
  for each row execute function public.set_updated_at();

create table if not exists public.program_sessions (
  id            uuid primary key default gen_random_uuid(),
  gun           date not null,
  baslangic     time not null,
  bitis         time,
  baslik_tr     text not null check (length(baslik_tr) between 1 and 300),
  baslik_en     text not null default '',
  aciklama_tr   text not null default '',
  aciklama_en   text not null default '',
  tur           text not null default 'panel'
                check (tur in ('acilis','panel','atolye','b2b','kulturel','kapanis')),
  salon         text not null default '',
  published     boolean not null default true,
  sira          integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint saat_sirasi check (bitis is null or bitis > baslangic)
);
create or replace trigger program_sessions_updated_at before update on public.program_sessions
  for each row execute function public.set_updated_at();
create index if not exists program_sessions_gun_idx on public.program_sessions(gun, baslangic);

create table if not exists public.program_session_speakers (
  session_id  uuid not null references public.program_sessions(id) on delete cascade,
  speaker_id  uuid not null references public.speakers(id) on delete cascade,
  sira        integer not null default 0,
  primary key (session_id, speaker_id)
);

create table if not exists public.sponsors (
  id          uuid primary key default gen_random_uuid(),
  ad_tr       text not null check (length(ad_tr) between 1 and 200),
  ad_en       text not null default '',
  aciklama_tr text not null default '',
  aciklama_en text not null default '',
  -- 'partner' = kurucu paydaş (Giresun Vakfı, Federasyon, ŞEBİNSİAD) — EK §5
  seviye      text not null default 'destekci'
              check (seviye in ('partner','ana','altin','gumus','destekci')),
  logo_url    text not null default '',
  web         text not null default '',
  published   boolean not null default true,
  sira        integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  -- seed.sql'in "on conflict (ad_tr)" cümlesi buna dayanır. Kısıt olmazsa
  -- hedefsiz on conflict hiç tetiklenmez ve seed her koşumda satır kopyalar.
  constraint sponsors_ad_tr_benzersiz unique (ad_tr)
);
create or replace trigger sponsors_updated_at before update on public.sponsors
  for each row execute function public.set_updated_at();

create table if not exists public.faqs (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9-]+$'),
  soru_tr     text not null check (length(soru_tr) between 1 and 300),
  soru_en     text not null default '',
  cevap_tr    text not null check (length(cevap_tr) between 1 and 3000),
  cevap_en    text not null default '',
  published   boolean not null default true,
  sira        integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create or replace trigger faqs_updated_at before update on public.faqs
  for each row execute function public.set_updated_at();

create table if not exists public.gallery_albums (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9-]+$'),
  baslik_tr   text not null check (length(baslik_tr) between 1 and 200),
  baslik_en   text not null default '',
  published   boolean not null default true,
  sira        integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create or replace trigger gallery_albums_updated_at before update on public.gallery_albums
  for each row execute function public.set_updated_at();

create table if not exists public.gallery_images (
  id          uuid primary key default gen_random_uuid(),
  album_id    uuid references public.gallery_albums(id) on delete cascade,
  url         text not null check (length(url) between 1 and 500),
  alt_tr      text not null default '',
  alt_en      text not null default '',
  published   boolean not null default true,
  sira        integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create or replace trigger gallery_images_updated_at before update on public.gallery_images
  for each row execute function public.set_updated_at();

create table if not exists public.press_releases (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9-]+$'),
  baslik_tr   text not null check (length(baslik_tr) between 1 and 300),
  baslik_en   text not null default '',
  ozet_tr     text not null default '',
  ozet_en     text not null default '',
  tarih       date not null default current_date,
  dosya_url   text not null default '',
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create or replace trigger press_releases_updated_at before update on public.press_releases
  for each row execute function public.set_updated_at();

-- Ulaşım seçenekleri (kitapçık §4) — admin panelden düzenlenebilsin diye tablo
create table if not exists public.transport_options (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9-]+$'),
  ikon        text not null default '',
  baslik_tr   text not null check (length(baslik_tr) between 1 and 200),
  baslik_en   text not null default '',
  metin_tr    text not null default '',
  metin_en    text not null default '',
  hatlar      text[] not null default '{}',
  published   boolean not null default true,
  sira        integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create or replace trigger transport_options_updated_at before update on public.transport_options
  for each row execute function public.set_updated_at();


-- =============================================================================
-- 4. Form tabloları + numara üretimi
--    Numaralar İSTEMCİDEN GELMEZ; trigger üretir.
-- =============================================================================

create sequence if not exists public.stand_application_seq start 1;
create sequence if not exists public.visitor_registration_seq start 1;

-- Stant başvurusu: GE-<gönderim yılı>-0001, ör. 2026'da GE-2026-0001
create or replace function public.set_application_no()
returns trigger
language plpgsql
as $$
begin
  if new.application_no is null or new.application_no = '' then
    new.application_no := 'GE-' || to_char(now() at time zone 'Europe/Istanbul', 'YYYY')
                          || '-' || lpad(nextval('public.stand_application_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

-- Ziyaretçi ön kaydı: GE-Z-2026-00001
create or replace function public.set_registration_no()
returns trigger
language plpgsql
as $$
begin
  if new.registration_no is null or new.registration_no = '' then
    new.registration_no := 'GE-Z-' || to_char(now() at time zone 'Europe/Istanbul', 'YYYY')
                            || '-' || lpad(nextval('public.visitor_registration_seq')::text, 5, '0');
  end if;
  return new;
end;
$$;

create table if not exists public.stand_applications (
  id              uuid primary key default gen_random_uuid(),
  application_no  text unique,
  -- Firma
  company         text not null check (length(company) between 2 and 200),
  sector          text not null default '' check (length(sector) <= 120),
  website         text not null default '' check (length(website) <= 300),
  -- Yetkili
  contact_name    text not null check (length(contact_name) between 2 and 160),
  email           text not null check (public.is_email(email)),
  phone           text not null check (length(phone) between 7 and 30),
  -- Talep
  stand_type      text check (stand_type in ('hazir','bos','acik')),
  area_m2         integer check (area_m2 is null or (area_m2 between 1 and 1000)),
  note            text not null default '' check (length(note) <= 2000),
  -- Süreç
  status          text not null default 'new'
                  check (status in ('new','reviewing','approved','rejected','contracted')),
  admin_note      text not null default '' check (length(admin_note) <= 4000),
  kvkk_onay_at    timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create or replace trigger stand_applications_no before insert on public.stand_applications
  for each row execute function public.set_application_no();
create or replace trigger stand_applications_updated_at before update on public.stand_applications
  for each row execute function public.set_updated_at();
create index if not exists stand_applications_status_idx on public.stand_applications(status);
create index if not exists stand_applications_created_idx on public.stand_applications(created_at desc);

create table if not exists public.visitor_registrations (
  id                uuid primary key default gen_random_uuid(),
  registration_no   text unique,
  full_name         text not null check (length(full_name) between 2 and 160),
  email             text not null check (public.is_email(email)),
  phone             text not null default '' check (length(phone) <= 30),
  city              text not null default '' check (length(city) <= 80),
  sector            text not null default '' check (length(sector) <= 120),
  days              date[] not null default '{}',
  checked_in_at     timestamptz,
  kvkk_onay_at      timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create or replace trigger visitor_registrations_no before insert on public.visitor_registrations
  for each row execute function public.set_registration_no();
create or replace trigger visitor_registrations_updated_at before update on public.visitor_registrations
  for each row execute function public.set_updated_at();
create index if not exists visitor_registrations_created_idx on public.visitor_registrations(created_at desc);

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (length(name) between 2 and 160),
  email       text not null check (public.is_email(email)),
  subject     text not null default '' check (length(subject) <= 200),
  message     text not null check (length(message) between 1 and 4000),
  is_read     boolean not null default false,
  is_archived boolean not null default false,
  kvkk_onay_at timestamptz not null default now(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create or replace trigger contact_messages_updated_at before update on public.contact_messages
  for each row execute function public.set_updated_at();
create index if not exists contact_messages_read_idx on public.contact_messages(is_read, is_archived);

create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique check (public.is_email(email)),
  lang        text not null default 'tr' check (lang in ('tr','en')),
  created_at  timestamptz not null default now()
);


-- =============================================================================
-- 5. Etkinlik günlüğü
-- =============================================================================

create table if not exists public.activity_log (
  id          bigserial primary key,
  user_id     uuid references auth.users(id) on delete set null,
  user_email  text not null default '',
  tablo       text not null,
  kayit_id    text not null default '',
  islem       text not null check (islem in ('insert','update','delete','login','export')),
  ozet        text not null default '',
  created_at  timestamptz not null default now()
);
create index if not exists activity_log_created_idx on public.activity_log(created_at desc);


-- =============================================================================
-- 6. RLS — EN KRİTİK BÖLÜM
--
-- Kural özeti:
--   anon  : published=true içeriği ve site_settings'i OKUR.
--           Form tablolarına SADECE INSERT. SELECT/UPDATE/DELETE YOK.
--   admin : her şeye tam erişim.
--   editor: başvuru/kayıt SİLEMEZ, admin EKLEYEMEZ.
-- =============================================================================

alter table public.admins                   enable row level security;
alter table public.site_settings            enable row level security;
alter table public.sectors                  enable row level security;
alter table public.exhibitors               enable row level security;
alter table public.speakers                 enable row level security;
alter table public.program_sessions         enable row level security;
alter table public.program_session_speakers enable row level security;
alter table public.sponsors                 enable row level security;
alter table public.faqs                     enable row level security;
alter table public.gallery_albums           enable row level security;
alter table public.gallery_images           enable row level security;
alter table public.press_releases           enable row level security;
alter table public.transport_options        enable row level security;
alter table public.stand_applications       enable row level security;
alter table public.visitor_registrations    enable row level security;
alter table public.contact_messages         enable row level security;
alter table public.newsletter_subscribers   enable row level security;
alter table public.activity_log             enable row level security;

-- Bu dosya public şemasındaki politikaların TAMAMINI tanımlar. PostgreSQL'de
-- "create or replace policy" yoktur; dosyanın ikinci kez çalıştırılabilmesi için
-- mevcut politikaları önce topluca düşürüyoruz. Aşağıdaki create'ler hepsini
-- yeniden kurduğu için arada güvenlik boşluğu oluşmaz (tek işlem içinde).
do $$
declare r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
  loop
    execute format('drop policy if exists %I on %I.%I',
                   r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

-- --- admins: yalnızca adminler görür; yalnızca owner değiştirir --------------
create policy admins_select on public.admins
  for select using (public.is_admin());
create policy admins_insert on public.admins
  for insert with check (public.admin_role() = 'owner');
create policy admins_update on public.admins
  for update using (public.admin_role() = 'owner') with check (public.admin_role() = 'owner');
create policy admins_delete on public.admins
  for delete using (public.admin_role() = 'owner');

-- --- site_settings: herkes okur, admin yazar --------------------------------
create policy site_settings_read on public.site_settings
  for select using (true);
create policy site_settings_write on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- --- Yayındaki içerik: herkes okur, admin yazar -----------------------------
-- sectors ve transport_options'ta published sütunu farklı, ayrı ele alınıyor.
create policy sectors_read on public.sectors for select using (true);
create policy sectors_write on public.sectors
  for all using (public.is_admin()) with check (public.is_admin());

create policy exhibitors_read on public.exhibitors
  for select using (published or public.is_admin());
create policy exhibitors_write on public.exhibitors
  for all using (public.is_admin()) with check (public.is_admin());

create policy speakers_read on public.speakers
  for select using (published or public.is_admin());
create policy speakers_write on public.speakers
  for all using (public.is_admin()) with check (public.is_admin());

create policy program_sessions_read on public.program_sessions
  for select using (published or public.is_admin());
create policy program_sessions_write on public.program_sessions
  for all using (public.is_admin()) with check (public.is_admin());

create policy pss_read on public.program_session_speakers for select using (true);
create policy pss_write on public.program_session_speakers
  for all using (public.is_admin()) with check (public.is_admin());

create policy sponsors_read on public.sponsors
  for select using (published or public.is_admin());
create policy sponsors_write on public.sponsors
  for all using (public.is_admin()) with check (public.is_admin());

create policy faqs_read on public.faqs
  for select using (published or public.is_admin());
create policy faqs_write on public.faqs
  for all using (public.is_admin()) with check (public.is_admin());

create policy gallery_albums_read on public.gallery_albums
  for select using (published or public.is_admin());
create policy gallery_albums_write on public.gallery_albums
  for all using (public.is_admin()) with check (public.is_admin());

create policy gallery_images_read on public.gallery_images
  for select using (published or public.is_admin());
create policy gallery_images_write on public.gallery_images
  for all using (public.is_admin()) with check (public.is_admin());

create policy press_releases_read on public.press_releases
  for select using (published or public.is_admin());
create policy press_releases_write on public.press_releases
  for all using (public.is_admin()) with check (public.is_admin());

create policy transport_options_read on public.transport_options
  for select using (published or public.is_admin());
create policy transport_options_write on public.transport_options
  for all using (public.is_admin()) with check (public.is_admin());

-- --- Form tabloları ---------------------------------------------------------
-- SELECT politikası YALNIZCA admin için var. Anon select denerse boş döner.
--
-- Stant başvurusu, ziyaretçi kaydı ve bülten için anon'un DOĞRUDAN insert hakkı
-- YOK; tek yol §7'deki RPC'ler. Sebepleri:
--   1. "Başvurular kapalı" / "kayıt kapalı" anahtarı RPC içinde kontrol ediliyor.
--      Doğrudan insert açık kalsaydı bu anahtar tarayıcıdan bir POST ile
--      atlanabilirdi.
--   2. Bültende doğrudan insert, unique ihlali hatasıyla bir e-postanın zaten
--      abone olup olmadığını ele verirdi. RPC'deki "on conflict do nothing"
--      bu sızıntıyı kapatıyor.
-- RPC'ler security definer ve tabloların sahibi postgres olduğu için bu
-- politikalara takılmadan yazarlar.
--
-- İletişim mesajı istisna: kapatma anahtarı ve benzersizlik kısıtı yok,
-- istemci doğrudan insert ediyor.

create policy stand_applications_insert on public.stand_applications
  for insert to authenticated with check (public.is_admin());
create policy stand_applications_select on public.stand_applications
  for select using (public.is_admin());
create policy stand_applications_update on public.stand_applications
  for update using (public.is_admin()) with check (public.is_admin());
create policy stand_applications_delete on public.stand_applications
  for delete using (public.admin_role() = 'owner');   -- editor silemez

create policy visitor_registrations_insert on public.visitor_registrations
  for insert to authenticated with check (public.is_admin());
create policy visitor_registrations_select on public.visitor_registrations
  for select using (public.is_admin());
create policy visitor_registrations_update on public.visitor_registrations
  for update using (public.is_admin()) with check (public.is_admin());
create policy visitor_registrations_delete on public.visitor_registrations
  for delete using (public.admin_role() = 'owner');

create policy contact_messages_insert on public.contact_messages
  for insert to anon, authenticated with check (true);
create policy contact_messages_select on public.contact_messages
  for select using (public.is_admin());
create policy contact_messages_update on public.contact_messages
  for update using (public.is_admin()) with check (public.is_admin());
create policy contact_messages_delete on public.contact_messages
  for delete using (public.admin_role() = 'owner');

create policy newsletter_insert on public.newsletter_subscribers
  for insert to authenticated with check (public.is_admin());
create policy newsletter_select on public.newsletter_subscribers
  for select using (public.is_admin());
create policy newsletter_delete on public.newsletter_subscribers
  for delete using (public.is_admin());

-- --- activity_log: admin okur, sistem yazar ---------------------------------
create policy activity_log_select on public.activity_log
  for select using (public.is_admin());
create policy activity_log_insert on public.activity_log
  for insert to authenticated with check (public.is_admin());


-- =============================================================================
-- 7. Form gönderimi için RPC'ler
--
-- SORUN: anon'un SELECT hakkı olmadığı için "insert ... returning" ile
-- başvuru numarasını geri alamaz. Ama kullanıcıya numarayı göstermemiz gerek.
-- ÇÖZÜM: security definer fonksiyon YALNIZCA üretilen numarayı döndürür,
-- satırın tamamını değil. Böylece anon hâlâ hiçbir kaydı okuyamaz.
-- =============================================================================

create or replace function public.submit_stand_application(
  p_company text, p_sector text, p_website text,
  p_contact_name text, p_email text, p_phone text,
  p_stand_type text, p_area_m2 integer, p_note text
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_no text;
  v_acik boolean;
begin
  select stant_basvuru_acik into v_acik from public.site_settings where id;
  if v_acik is false then
    raise exception 'BASVURU_KAPALI';
  end if;

  insert into public.stand_applications
    (company, sector, website, contact_name, email, phone, stand_type, area_m2, note)
  values
    (p_company, coalesce(p_sector,''), coalesce(p_website,''), p_contact_name,
     lower(trim(p_email)), p_phone, nullif(p_stand_type,''), p_area_m2, coalesce(p_note,''))
  returning application_no into v_no;

  return v_no;
end;
$$;

create or replace function public.submit_visitor_registration(
  p_full_name text, p_email text, p_phone text, p_city text,
  p_sector text, p_days date[]
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_no text;
  v_acik boolean;
begin
  select ziyaretci_kaydi_acik into v_acik from public.site_settings where id;
  if v_acik is false then
    raise exception 'KAYIT_KAPALI';
  end if;

  insert into public.visitor_registrations
    (full_name, email, phone, city, sector, days)
  values
    (p_full_name, lower(trim(p_email)), coalesce(p_phone,''), coalesce(p_city,''),
     coalesce(p_sector,''), coalesce(p_days,'{}'))
  returning registration_no into v_no;

  return v_no;
end;
$$;

-- Bülten: aynı e-posta tekrar gelirse hata verme, sessizce yoksay
create or replace function public.subscribe_newsletter(p_email text, p_lang text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.newsletter_subscribers (email, lang)
  values (lower(trim(p_email)), coalesce(nullif(p_lang,''), 'tr'))
  on conflict (email) do nothing;
end;
$$;

revoke all on function public.submit_stand_application(text,text,text,text,text,text,text,integer,text) from public;
revoke all on function public.submit_visitor_registration(text,text,text,text,text,date[]) from public;
revoke all on function public.subscribe_newsletter(text,text) from public;

grant execute on function public.submit_stand_application(text,text,text,text,text,text,text,integer,text) to anon, authenticated;
grant execute on function public.submit_visitor_registration(text,text,text,text,text,date[]) to anon, authenticated;
grant execute on function public.subscribe_newsletter(text,text) to anon, authenticated;

-- Derinlemesine savunma: RLS zaten engelliyor, ama tablo düzeyindeki yetkiyi de
-- geri alıyoruz. Böylece ileride yanlışlıkla gevşek bir politika eklenirse anon
-- yine de bu üç tabloya doğrudan yazamaz. RPC'ler etkilenmez (sahibi postgres).
revoke insert on public.stand_applications    from anon;
revoke insert on public.visitor_registrations from anon;
revoke insert on public.newsletter_subscribers from anon;

-- Anon hiçbir form tablosunu okuyamaz, güncelleyemez, silemez.
revoke select, update, delete on public.stand_applications     from anon;
revoke select, update, delete on public.visitor_registrations  from anon;
revoke select, update, delete on public.contact_messages       from anon;
revoke select, update, delete on public.newsletter_subscribers from anon;
revoke all on public.admins       from anon;
revoke all on public.activity_log from anon;


-- =============================================================================
-- Bitti. Sıradaki: 002_storage.sql
-- =============================================================================
