-- =============================================================================
-- Giresun EXPO 2026 — sponsors tablosu benzersizlik düzeltmesi
-- 004_sponsors_unique.sql
--
-- SORUN: sponsors tablosunda benzersiz kısıt yoktu ve seed.sql hedefsiz bir
-- "on conflict do nothing" kullanıyordu. PostgreSQL'de hedefsiz on conflict
-- yalnızca bir benzersizlik ihlali olduğunda tetiklenir; kısıt olmayınca ihlal
-- de olmaz. Sonuç: seed.sql her çalıştırıldığında 3 paydaş SATIRI KOPYALANDI.
-- (Ölçüm: tabloda 3 yerine 6 satır vardı.)
--
-- Bu dosya mükerrerleri temizler ve kısıtı ekler. Tekrar çalıştırılabilir.
-- =============================================================================

-- 1. Mükerrerleri temizle: aynı ad_tr için en eski satırı tut.
--    Silinen satırlara bağlı başka kayıt yok (sponsors'a FK veren tablo yok).
delete from public.sponsors a
using public.sponsors b
where a.ad_tr = b.ad_tr
  and a.created_at > b.created_at;

-- created_at aynıysa (aynı saniyede eklenmişlerse) ctid ile ayıkla
delete from public.sponsors a
using public.sponsors b
where a.ad_tr = b.ad_tr
  and a.created_at = b.created_at
  and a.ctid > b.ctid;

-- 2. Bir daha olmasın: ad_tr benzersiz olsun.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'sponsors_ad_tr_benzersiz'
      and conrelid = 'public.sponsors'::regclass
  ) then
    alter table public.sponsors
      add constraint sponsors_ad_tr_benzersiz unique (ad_tr);
  end if;
end $$;

-- 3. Doğrulama: her ad bir kez geçmeli
select ad_tr, seviye, sira, count(*) as satir
from public.sponsors
group by ad_tr, seviye, sira
order by sira;
