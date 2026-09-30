-- =============================================================================
-- 007 — Davetiye indirmelerine "davet edilen kişi"
--
--   006'nın üzerine. davetiye.html'deki "Davet edilen kişi" alanı artık
--   indirme kaydıyla birlikte saklanır; admin panelindeki Davetiye
--   İndirmeleri sayfası firmanın kimi davet ettiğini gösterir.
--
--   RPC'nin eski 3 parametreli hali kaldırılıp 4 parametreli (sonuncusu
--   isteğe bağlı) hali kurulur. Önbellekteki eski sayfa 3 parametreyle
--   çağırsa da çalışmaya devam eder.
--
-- Tekrar çalıştırılabilir (idempotent). SQL Editor'da tek seferde çalıştırın.
-- =============================================================================

alter table public.invitation_downloads
  add column if not exists invitee_name text not null default '';

do $$ begin
  alter table public.invitation_downloads
    add constraint invitation_downloads_invitee_len check (length(invitee_name) <= 60);
exception when duplicate_object then null; end $$;

drop function if exists public.davetiye_indirildi(text, text, text);

create or replace function public.davetiye_indirildi(
  p_slug text, p_cihaz text, p_yontem text, p_davetli text default null
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ad text;
begin
  if coalesce(p_cihaz, '') not in ('mobil', 'masaustu')
     or coalesce(p_yontem, '') not in ('paylasim', 'indirme') then
    raise exception 'GECERSIZ_DEGER';
  end if;

  if (select count(*) from public.invitation_downloads
      where created_at > now() - interval '1 minute') >= 30 then
    return;
  end if;

  if p_slug is not null and p_slug <> '' then
    select name into v_ad from public.exhibitors where slug = p_slug and published;
  end if;

  insert into public.invitation_downloads
    (exhibitor_slug, exhibitor_name, invitee_name, cihaz, yontem)
  values
    (case when v_ad is null then null else p_slug end, coalesce(v_ad, ''),
     left(coalesce(trim(p_davetli), ''), 60), p_cihaz, p_yontem);
end;
$$;

revoke all on function public.davetiye_indirildi(text, text, text, text) from public;
grant execute on function public.davetiye_indirildi(text, text, text, text) to anon, authenticated;

-- PostgREST şema önbelleğini tazele (yeni imza hemen görünsün)
notify pgrst, 'reload schema';

-- Kontrol
select 'invitee_name sütunu' as kontrol,
       exists (select 1 from information_schema.columns
               where table_schema = 'public' and table_name = 'invitation_downloads'
                 and column_name = 'invitee_name')::text as deger;
