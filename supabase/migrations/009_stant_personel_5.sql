-- =============================================================================
-- 009 — Yaka kartı sınırı 4'ten 5'e
--
--   008'in üzerine. yaka-karti.html artık en fazla 5 görevli personel alır;
--   tablo kısıtı ve submit_stant_personel() buna göre güncellenir. Mevcut
--   kayıtlara dokunulmaz.
--
-- Tekrar çalıştırılabilir (idempotent). SQL Editor'da tek seferde çalıştırın.
-- =============================================================================

alter table public.stand_staff_cards
  drop constraint if exists stand_staff_cards_staff_len;
alter table public.stand_staff_cards
  add constraint stand_staff_cards_staff_len check (cardinality(staff) between 1 and 5);

create or replace function public.submit_stant_personel(
  p_slug text, p_plaka text, p_personel text[]
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ad     text;
  v_plaka  text;
  v_liste  text[];
begin
  select name into v_ad from public.exhibitors
  where slug = coalesce(p_slug, '') and published;
  if v_ad is null then
    raise exception 'FIRMA_YOK';
  end if;

  /* Plaka: büyük harf (Türkçe i → İ), boşluklar teke indirilir */
  v_plaka := regexp_replace(upper(trim(coalesce(p_plaka, ''))), '\s+', ' ', 'g');
  if v_plaka !~ '^[0-9A-ZÇĞİÖŞÜ ]{2,15}$' then
    raise exception 'PLAKA_GECERSIZ';
  end if;

  /* Ad soyadlar: kırpılır, boşlar atılır, her biri en fazla 60 karakter */
  select coalesce(array_agg(left(regexp_replace(trim(a), '\s+', ' ', 'g'), 60) order by o), '{}')
    into v_liste
  from unnest(coalesce(p_personel, '{}')) with ordinality as t(a, o)
  where trim(coalesce(a, '')) <> '';

  if cardinality(v_liste) not between 1 and 5
     or exists (select 1 from unnest(v_liste) a where length(a) < 3) then
    raise exception 'PERSONEL_GECERSIZ';
  end if;

  if (select count(*) from public.stand_staff_cards
      where created_at > now() - interval '1 minute') >= 20 then
    raise exception 'COK_FAZLA_ISTEK';
  end if;

  insert into public.stand_staff_cards (exhibitor_slug, exhibitor_name, plate, staff)
  values (p_slug, v_ad, v_plaka, v_liste);
end;
$$;

revoke all on function public.submit_stant_personel(text, text, text[]) from public;
grant execute on function public.submit_stant_personel(text, text, text[]) to anon, authenticated;

notify pgrst, 'reload schema';

-- Kontrol: 'between 1 and 5' görünmeli
select pg_get_constraintdef(oid) as kisit
from pg_constraint where conname = 'stand_staff_cards_staff_len';
