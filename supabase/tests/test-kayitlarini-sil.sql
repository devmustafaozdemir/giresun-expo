-- =============================================================================
-- Test kayıtlarını silme
--
-- Supabase SQL Editor'da çalıştırın. Yalnızca test e-postalarıyla eşleşen
-- satırları siler; gerçek başvurulara dokunmaz.
--
-- Test e-postaları:
--   rls-test@example.invalid    → tools/rls-test.mjs koşumları
--   canli-test@example.invalid  → canlı sitede elle yapılan form testleri
-- (.invalid uzantısı RFC 2606 gereği hiçbir zaman gerçek bir alan adı olamaz,
--  yani bu adreslerle gerçek bir başvuru gelmesi mümkün değil.)
-- =============================================================================

-- Önce ne silineceğini görün:
select 'stant'     as tablo, application_no  as no, company   as ad, email, created_at
  from public.stand_applications      where email like '%@example.invalid'
union all
select 'ziyaretci', registration_no, full_name, email, created_at
  from public.visitor_registrations   where email like '%@example.invalid'
union all
select 'mesaj',     null, name, email, created_at
  from public.contact_messages        where email like '%@example.invalid'
union all
select 'bulten',    null, null, email, created_at
  from public.newsletter_subscribers  where email like '%@example.invalid'
order by created_at;


-- Yukarıdaki liste doğruysa silin:
delete from public.stand_applications      where email like '%@example.invalid';
delete from public.visitor_registrations   where email like '%@example.invalid';
delete from public.contact_messages        where email like '%@example.invalid';
delete from public.newsletter_subscribers  where email like '%@example.invalid';


-- =============================================================================
-- Numara sayaçlarını başa almak (İSTEĞE BAĞLI)
--
-- Testler sayaçları ilerletti: gerçek ilk başvuru GE-2026-0005 olur.
-- Sorun değilse hiçbir şey yapmayın — numaralar tekil olmaya devam eder.
-- Gerçek başvuruların 0001'den başlamasını istiyorsanız, TABLOLAR BOŞKEN:
--
--   select setval('public.stand_application_seq',  1, false);
--   select setval('public.visitor_registration_seq', 1, false);
--
-- Tablolarda gerçek kayıt varken ÇALIŞTIRMAYIN — numara çakışması olur.
-- =============================================================================
