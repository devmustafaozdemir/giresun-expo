-- =============================================================================
-- Giresun EXPO 2026 — İlk admin kullanıcısı
-- 003_admin.sql   (001_init.sql, 002_storage.sql ve seed.sql'den SONRA)
--
-- ÖN KOŞUL: Bu e-postayla Supabase Auth'ta bir kullanıcı ZATEN OLUŞTURULMUŞ
-- olmalı (Authentication -> Users -> Add user). Sign-up kapalı olduğu için
-- kullanıcı yalnızca panelden elle eklenebilir.
--
-- Bu dosya o kullanıcıyı admins tablosuna 'owner' olarak bağlar.
-- Tekrar çalıştırılabilir: ikinci kez çalıştırılırsa rolü günceller.
--
-- NOT (2026-09-22): Bu dosya önce "do $$ ... $$" bloğu ve plpgsql değişkenleri
-- kullanıyordu ve ilk denemede kullanıcıyı EKLEMEDİ. Artık değişken de, DO
-- bloğu da yok: tek bir INSERT ... SELECT. E-posta değeri doğrudan
-- auth.users'tan geliyor, yani admins.email (not null) hiçbir koşulda boş
-- kalamaz.
-- =============================================================================

-- ############################################################################
-- ADIM 1 — Admini ekle
--
-- Aşağıdaki e-postayı değiştirmeniz gerekmiyorsa olduğu gibi çalıştırın.
-- ############################################################################

insert into public.admins (user_id, email, role)
select u.id, lower(u.email), 'owner'
from auth.users u
where lower(u.email) = lower('0mustafaozdemirr@gmail.com')
  and u.email is not null
on conflict (user_id) do update
  set role  = 'owner',
      email = excluded.email;


-- ############################################################################
-- ADIM 2 — Doğrulama (BUNU DA ÇALIŞTIRIN)
--
-- Bir satır dönmeli. BOŞ dönerse admin eklenmemiştir; sebebini ADIM 3 söyler.
-- ############################################################################

select a.email, a.role, a.created_at, u.last_sign_in_at
from public.admins a
join auth.users u on u.id = a.user_id
order by a.created_at;


-- ############################################################################
-- ADIM 3 — ADIM 2 boş döndüyse teşhis
--
-- Bu sorgu, aranan e-postanın Auth'ta olup olmadığını söyler.
-- "auth_kullanicisi_var = false" ise: Authentication -> Users -> Add user
-- adımı atlanmış ya da e-posta farklı yazılmış demektir. Listeyi görmek için
-- ADIM 4'ü çalıştırın.
-- ############################################################################

select
  exists (
    select 1 from auth.users
    where lower(email) = lower('0mustafaozdemirr@gmail.com')
  ) as auth_kullanicisi_var,
  (select count(*) from public.admins) as admins_satir_sayisi;


-- ############################################################################
-- ADIM 4 — Auth'taki kullanıcıları listele (yalnızca gerekirse)
--
-- E-postanın Auth'ta tam olarak nasıl kayıtlı olduğunu görmek için.
-- ############################################################################

-- select id, email, created_at, last_sign_in_at
-- from auth.users
-- order by created_at;


-- =============================================================================
-- YENİ ADMIN EKLEMEK (ileride)
--
-- 1. Supabase paneli -> Authentication -> Users -> Add user
--    (sign-up kapalı olduğu için kullanıcı kendi kaydolamaz)
-- 2. Aşağıyı e-posta ve rolü değiştirerek çalıştırın:
--
--    insert into public.admins (user_id, email, role)
--    select u.id, lower(u.email), 'editor'          -- <<< rol
--    from auth.users u
--    where lower(u.email) = lower('yeni@ornek.com') -- <<< e-posta
--      and u.email is not null
--    on conflict (user_id) do update set role = excluded.role;
--
-- 3. ADIM 2 ile doğrulayın.
--
-- Roller:
--   owner  — her şey. Başvuru/kayıt silebilir, admin ekleyip çıkarabilir,
--            Storage'dan dosya silebilir.
--   editor — içerik yönetir. Başvuru/kayıt SİLEMEZ, admin EKLEYEMEZ,
--            Storage'dan dosya SİLEMEZ.
--
-- Admin ÇIKARMAK (yetkiyi almak; Auth hesabı silinmez):
--   delete from public.admins where lower(email) = lower('eski@ornek.com');
-- =============================================================================
