-- =============================================================================
-- Giresun EXPO 2026 — İlk admin kullanıcısı
-- 003_admin.sql   (001_init.sql, 002_storage.sql ve seed.sql'den SONRA)
--
-- ÖN KOŞUL: Bu e-postayla Supabase Auth'ta bir kullanıcı ZATEN OLUŞTURULMUŞ
-- olmalı (Authentication -> Users -> Add user). Sign-up kapalı olduğu için
-- kullanıcı yalnızca panelden davetle/elle eklenebilir.
--
-- Bu dosya yalnızca o kullanıcıyı admins tablosuna 'owner' olarak bağlar.
-- Tekrar çalıştırılabilir: ikinci kez çalıştırılırsa rolü günceller.
-- =============================================================================

do $$
declare
  v_email text := '0mustafaozdemirr@gmail.com';   -- <<< İLK ADMIN
  v_uid   uuid;
begin
  select id into v_uid
  from auth.users
  where lower(email) = lower(v_email)
  limit 1;

  if v_uid is null then
    raise exception
      'Auth kullanıcısı bulunamadı: %. Önce Supabase panelinde Authentication -> Users -> Add user ile bu e-postayla kullanıcı oluşturun, sonra bu dosyayı tekrar çalıştırın.',
      v_email;
  end if;

  insert into public.admins (user_id, email, role)
  values (v_uid, lower(v_email), 'owner')
  on conflict (user_id) do update
    set role = 'owner', email = excluded.email;

  raise notice 'Admin eklendi: % (owner)', v_email;
end $$;


-- Doğrulama: aşağıdaki sorgu bir satır dönmeli
select a.email, a.role, a.created_at, u.last_sign_in_at
from public.admins a
join auth.users u on u.id = a.user_id;


-- =============================================================================
-- YENİ ADMIN EKLEMEK (ileride)
--
-- 1. Supabase paneli -> Authentication -> Users -> Add user
--    (sign-up kapalı olduğu için kullanıcı kendi kaydolamaz)
-- 2. Aşağıdaki bloğu e-posta ve rolü değiştirerek çalıştırın:
--
--    do $$
--    declare v_email text := 'yeni@ornek.com'; v_rol text := 'editor'; v_uid uuid;
--    begin
--      select id into v_uid from auth.users where lower(email)=lower(v_email);
--      if v_uid is null then raise exception 'Auth kullanıcısı yok: %', v_email; end if;
--      insert into public.admins (user_id, email, role) values (v_uid, lower(v_email), v_rol)
--      on conflict (user_id) do update set role = excluded.role;
--    end $$;
--
-- Roller:
--   owner  — her şey. Başvuru/kayıt silebilir, admin ekleyip çıkarabilir,
--            Storage'dan dosya silebilir.
--   editor — içerik yönetir. Başvuru/kayıt SİLEMEZ, admin EKLEYEMEZ,
--            Storage'dan dosya SİLEMEZ.
-- =============================================================================
