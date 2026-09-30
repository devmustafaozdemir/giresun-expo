-- =============================================================================
-- 006 — Davetiye indirme sayacı
--
--   davetiye.html'de "Davetiye Görselini İndir" her başarılı indirmede /
--   galeriye kaydetmede bir satır yazar. Admin panelindeki Pano bu tabloyu okur.
--
--   Tarayıcı tabloya DOĞRUDAN yazamaz (insert politikası yok). Yazma yalnızca
--   davetiye_indirildi() RPC'si üzerinden olur; firma adı istemciden değil,
--   yayındaki katılımcılardan slug ile bulunur — sahte firma adı basılamaz.
--
-- Tekrar çalıştırılabilir (idempotent). SQL Editor'da tek seferde çalıştırın.
-- =============================================================================

create table if not exists public.invitation_downloads (
  id              bigint generated always as identity primary key,
  exhibitor_slug  text,                                    -- firma seçilmediyse null
  exhibitor_name  text not null default '',
  cihaz           text not null check (cihaz in ('mobil', 'masaustu')),
  yontem          text not null check (yontem in ('paylasim', 'indirme')),
  created_at      timestamptz not null default now()
);

create index if not exists invitation_downloads_created_at
  on public.invitation_downloads (created_at desc);

alter table public.invitation_downloads enable row level security;

drop policy if exists invitation_downloads_read on public.invitation_downloads;
create policy invitation_downloads_read on public.invitation_downloads
  for select using (public.is_admin());

drop policy if exists invitation_downloads_delete on public.invitation_downloads;
create policy invitation_downloads_delete on public.invitation_downloads
  for delete using (public.is_admin());

create or replace function public.davetiye_indirildi(
  p_slug text, p_cihaz text, p_yontem text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ad text;
begin
  if p_cihaz not in ('mobil', 'masaustu') or p_yontem not in ('paylasim', 'indirme') then
    raise exception 'GECERSIZ_DEGER';
  end if;

  if p_slug is not null and p_slug <> '' then
    select name into v_ad from public.exhibitors where slug = p_slug and published;
  end if;

  insert into public.invitation_downloads (exhibitor_slug, exhibitor_name, cihaz, yontem)
  values (case when v_ad is null then null else p_slug end, coalesce(v_ad, ''), p_cihaz, p_yontem);
end;
$$;

revoke all on function public.davetiye_indirildi(text, text, text) from public;
grant execute on function public.davetiye_indirildi(text, text, text) to anon, authenticated;

-- Kontrol
select 'invitation_downloads' as tablo, count(*) as satir from public.invitation_downloads;
