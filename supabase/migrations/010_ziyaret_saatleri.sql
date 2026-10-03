-- =============================================================================
-- 010 — Ziyaret saatleri güncellendi
--
--   Perşembe, Cuma, Pazar 10:00–18:00 · Cumartesi 10:00–19:00
--
--   Sitedeki saat tablosu site_settings.ziyaret_saatleri'nden, "Fuar hangi
--   saatlerde açık?" cevabı faqs tablosundan okunur. Yalnızca kapanış saatleri
--   değiştirilir; panelden düzenlenmiş diğer alanlara (gün adı, açılış) dokunulmaz.
--
-- Tekrar çalıştırılabilir (idempotent). SQL Editor'da tek seferde çalıştırın.
-- =============================================================================

update public.site_settings s set ziyaret_saatleri = (
  select jsonb_agg(
           case e->>'tarih'
             when '2026-10-08' then jsonb_set(e, '{kapanis}', '"18:00"')
             when '2026-10-09' then jsonb_set(e, '{kapanis}', '"18:00"')
             when '2026-10-10' then jsonb_set(e, '{kapanis}', '"19:00"')
             when '2026-10-11' then jsonb_set(e, '{kapanis}', '"18:00"')
             else e
           end order by o)
  from jsonb_array_elements(s.ziyaret_saatleri) with ordinality as t(e, o)
)
where s.id and jsonb_array_length(s.ziyaret_saatleri) > 0;

update public.faqs set
  cevap_tr = 'Perşembe, Cuma ve Pazar 10.00–18.00, Cumartesi 10.00–19.00 saatleri arasında ziyarete açık.',
  cevap_en = 'Thursday, Friday and Sunday 10:00–18:00, Saturday 10:00–19:00.'
where slug = 'ziyaret-saatleri';

-- Kontrol: dört gün ve SSS cevabı
select e->>'gun_tr' as gun, e->>'acilis' as acilis, e->>'kapanis' as kapanis
from public.site_settings, jsonb_array_elements(ziyaret_saatleri) e
where id
union all
select 'SSS', null, cevap_tr from public.faqs where slug = 'ziyaret-saatleri';
