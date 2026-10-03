-- =============================================================================
-- 008 — Araç kartı ve yaka kartı bilgileri
--
--   Katılımcı firmalar yaka-karti.html formundan 1 araç plakası ve stantta
--   görevli en fazla 4 personelin ad soyadını gönderir. Kartlar stant
--   tesliminde verilir; admin panelindeki "Araç ve Yaka Kartları" sayfası
--   listeyi gösterir ve teslim edildi olarak işaretler.
--
--   Tarayıcı tabloya DOĞRUDAN yazamaz (insert politikası yok). Yazma yalnızca
--   submit_stant_personel() RPC'si üzerinden olur; firma adı istemciden değil,
--   yayındaki katılımcılardan slug ile bulunur — listede olmayan firma adına
--   kayıt açılamaz.
--
--   Şişirmeye karşı: son 1 dakikada 20 kayıt varsa yenisi reddedilir.
--
-- Tekrar çalıştırılabilir (idempotent). SQL Editor'da tek seferde çalıştırın.
-- =============================================================================

create table if not exists public.stand_staff_cards (
  id              bigint generated always as identity primary key,
  exhibitor_slug  text not null,
  exhibitor_name  text not null,
  plate           text not null,
  staff           text[] not null,
  delivered_at    timestamptz,                     -- kartlar teslim edildiyse dolu
  created_at      timestamptz not null default now(),
  constraint stand_staff_cards_plate_len check (length(plate) between 2 and 15),
  constraint stand_staff_cards_staff_len check (cardinality(staff) between 1 and 4)
);

create index if not exists stand_staff_cards_created_at
  on public.stand_staff_cards (created_at desc);

alter table public.stand_staff_cards enable row level security;

drop policy if exists stand_staff_cards_select on public.stand_staff_cards;
create policy stand_staff_cards_select on public.stand_staff_cards
  for select using (public.is_admin());

drop policy if exists stand_staff_cards_update on public.stand_staff_cards;
create policy stand_staff_cards_update on public.stand_staff_cards
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists stand_staff_cards_delete on public.stand_staff_cards;
create policy stand_staff_cards_delete on public.stand_staff_cards
  for delete using (public.admin_role() = 'owner');   -- editor silemez

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

  if cardinality(v_liste) not between 1 and 4
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

-- PostgREST şema önbelleğini tazele (yeni fonksiyon hemen görünsün)
notify pgrst, 'reload schema';

-- Kontrol
select 'stand_staff_cards' as tablo, count(*) as satir from public.stand_staff_cards;
