-- =============================================================================
-- Giresun EXPO 2026 — Storage
-- 002_storage.sql   (001_init.sql'den SONRA çalıştırılır)
--
-- public-media: katılımcı logoları, galeri görselleri, konuşmacı fotoğrafları,
-- basın dosyaları. Herkes OKUR, yalnızca admin YAZAR.
-- =============================================================================

-- Bucket: herkese açık okuma, 5 MB sınırı, yalnızca görsel + PDF
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'public-media',
  'public-media',
  true,
  5242880,                                   -- 5 MB
  array['image/png','image/jpeg','image/webp','image/svg+xml','application/pdf']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Eski politikalar varsa temizle (bu dosya tekrar çalıştırılabilir olsun)
drop policy if exists "public-media herkes okur"    on storage.objects;
drop policy if exists "public-media admin yukler"   on storage.objects;
drop policy if exists "public-media admin gunceller" on storage.objects;
drop policy if exists "public-media admin siler"    on storage.objects;

-- Okuma: herkes (anon dahil)
create policy "public-media herkes okur"
  on storage.objects for select
  using (bucket_id = 'public-media');

-- Yazma: yalnızca admin
create policy "public-media admin yukler"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'public-media' and public.is_admin());

create policy "public-media admin gunceller"
  on storage.objects for update to authenticated
  using (bucket_id = 'public-media' and public.is_admin())
  with check (bucket_id = 'public-media' and public.is_admin());

-- Silme: yalnızca owner (editor dosya silemez)
create policy "public-media admin siler"
  on storage.objects for delete to authenticated
  using (bucket_id = 'public-media' and public.admin_role() = 'owner');

-- =============================================================================
-- Klasör düzeni (kural, teknik kısıt değil):
--   exhibitors/<slug>.png    katılımcı logoları
--   speakers/<slug>.jpg      konuşmacı fotoğrafları
--   gallery/<album>/<ad>.jpg galeri
--   press/<ad>.pdf           basın dosyaları
-- =============================================================================
