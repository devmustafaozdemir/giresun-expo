-- =============================================================================
-- 005 — Eylül 2026 revizyonu
--
--   1. Referans numaraları: GE-XXXX (4 haneli, rastgele, iki tabloda da benzersiz)
--   2. Firma kayıt formu: "Unvan / Görev" alanı + submit_firma_kaydi() RPC'si
--   3. Katılımcılar: hall sütunu stand numarasından otomatik türetilir
--   4. Site ayarları: istatistikler (Stand sayısı), stant alanları, metinler
--   5. SSS: "Girişler ücretli mi?" eklendi; program ve salon soruları yayından kalktı
--
-- Tekrar çalıştırılabilir (idempotent). SQL Editor'da tek seferde çalıştırın.
-- =============================================================================

-- 1. Referans numarası -------------------------------------------------------
create or replace function public.rastgele_referans()
returns text
language plpgsql
as $$
declare
  v text;
  deneme int := 0;
begin
  loop
    v := 'GE-' || (floor(random() * 9000) + 1000)::int::text;          -- GE-1000 … GE-9999
    exit when not exists (select 1 from public.stand_applications   where application_no  = v)
          and not exists (select 1 from public.visitor_registrations where registration_no = v);
    deneme := deneme + 1;
    if deneme > 500 then                                                 -- 4 hane dolarsa 5'e geç
      v := 'GE-' || (floor(random() * 90000) + 10000)::int::text;
      exit;
    end if;
  end loop;
  return v;
end;
$$;

create or replace function public.set_application_no()
returns trigger language plpgsql as $$
begin
  if new.application_no is null or new.application_no = '' then
    new.application_no := public.rastgele_referans();
  end if;
  return new;
end;
$$;

create or replace function public.set_registration_no()
returns trigger language plpgsql as $$
begin
  if new.registration_no is null or new.registration_no = '' then
    new.registration_no := public.rastgele_referans();
  end if;
  return new;
end;
$$;

-- 2. Firma kayıt ---------------------------------------------------------------
alter table public.stand_applications
  add column if not exists title text not null default '';
do $$ begin
  alter table public.stand_applications
    add constraint stand_applications_title_len check (length(title) <= 120);
exception when duplicate_object then null; end $$;

create or replace function public.submit_firma_kaydi(
  p_contact_name text, p_company text, p_title text,
  p_phone text, p_email text, p_sector text, p_area_m2 integer
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_no text;
  v_acik boolean;
begin
  select stant_basvuru_acik into v_acik from public.site_settings where id;
  if v_acik is false then
    raise exception 'BASVURU_KAPALI';
  end if;

  insert into public.stand_applications
    (contact_name, company, title, phone, email, sector, area_m2)
  values
    (trim(p_contact_name), trim(p_company), coalesce(trim(p_title), ''),
     trim(p_phone), lower(trim(p_email)), coalesce(p_sector, ''), p_area_m2)
  returning application_no into v_no;

  return v_no;
end;
$$;

revoke all on function public.submit_firma_kaydi(text,text,text,text,text,text,integer) from public;
grant execute on function public.submit_firma_kaydi(text,text,text,text,text,text,integer) to anon, authenticated;

-- 3. Salon (hall) stand numarasından türetilsin ------------------------------
create or replace function public.exhibitors_hall_turet()
returns trigger language plpgsql as $$
declare h text;
begin
  new.stands := coalesce(array(select upper(trim(s)) from unnest(new.stands) s where trim(s) <> ''), '{}');
  h := upper(left(coalesce(new.stands[1], ''), 1));
  new.hall := case when h in ('A','T','G','P','E') then h else null end;
  return new;
end;
$$;

drop trigger if exists exhibitors_hall on public.exhibitors;
create trigger exhibitors_hall before insert or update of stands on public.exhibitors
  for each row execute function public.exhibitors_hall_turet();

-- 4. Site ayarları ---------------------------------------------------------------
update public.site_settings set
  istatistikler = '[
    {"deger":"","etiket_tr":"Katılımcı firma","etiket_en":"Exhibiting companies"},
    {"deger":"4","etiket_tr":"Gün","etiket_en":"Days"},
    {"deger":"3","etiket_tr":"Paydaş kuruluş","etiket_en":"Partner institutions"},
    {"deger":"100","etiket_tr":"Stand sayısı","etiket_en":"Stands"}
  ]'::jsonb,
  stant_fiyatlari = '[
    {"tip_tr":"15 m²","tip_en":"15 m²","fiyat":"100.000 TL + KDV","aciklama_tr":"","aciklama_en":""},
    {"tip_tr":"25 m²","tip_en":"25 m²","fiyat":"150.000 TL + KDV","aciklama_tr":"","aciklama_en":""},
    {"tip_tr":"40 m²","tip_en":"40 m²","fiyat":"200.000 TL + KDV","aciklama_tr":"","aciklama_en":""}
  ]'::jsonb,
  stant_baslik_tr    = 'Firma Kayıt',
  stant_baslik_en    = 'Company Registration',
  durum_sirasinda_tr = 'Fuar devam ediyor — 8–11 Ekim 2026, Dr. Mimar Kadir Topbaş Gösteri ve Sanat Merkezi',
  durum_sirasinda_en = 'The fair is open — 8–11 October 2026, Dr. Mimar Kadir Topbaş Arts and Performance Centre',
  durum_sonrasi_tr   = 'Giresun EXPO için teşekkürler. 2027''de görüşmek üzere.',
  durum_sonrasi_en   = 'Thank you for Giresun EXPO. See you in 2027.'
where id;

-- Yanlışlıkla kaydedilmiş deneme değeri varsa düzelt
update public.site_settings set etkinlik_adi = 'Giresun EXPO 2026'
where id and etkinlik_adi like '%*%';

-- 5. SSS -------------------------------------------------------------------------
update public.faqs set
  cevap_tr = 'Katılımcı firmalar fuar alanında stant açıyor. Fuar; kamu kurumlarını, özel sektörü, yatırımcıları, üreticileri, sanayicileri, girişimcileri, üniversiteleri, kooperatifleri ve sivil toplum kuruluşlarını aynı çatı altında buluşturuyor.',
  cevap_en = 'Exhibiting companies have stands at the venue. The fair brings together public institutions, the private sector, investors, producers, industrialists, entrepreneurs, universities, cooperatives and civil society organisations.'
where slug = 'kimler-katiliyor';

update public.faqs set soru_tr = 'Giresun EXPO ne zaman ve nerede düzenleniyor?',
                       soru_en = 'When and where is Giresun EXPO held?'
where slug = 'ne-zaman-nerede';

insert into public.faqs (slug, soru_tr, soru_en, cevap_tr, cevap_en, sira, published) values
  ('giris-ucretli-mi', 'Girişler ücretli mi?', 'Is admission free?',
   'Hayır. Giresun EXPO''ya giriş ücretsizdir; tüm ziyaretçilerimizi fuar alanına bekliyoruz.',
   'Yes. Admission to Giresun EXPO is free of charge; all visitors are welcome.', 6, true)
on conflict (slug) do update set soru_tr = excluded.soru_tr, soru_en = excluded.soru_en,
  cevap_tr = excluded.cevap_tr, cevap_en = excluded.cevap_en, published = true;

update public.faqs set sira = 7 where slug = 'kim-duzenliyor';
update public.faqs set published = false where slug in ('program', 'salonlar');

-- 6. Paydaş sırası: Vakıf, ŞEBİNSİAD (ortada), Federasyon -----------------------
update public.sponsors set sira = 1 where ad_tr = 'Giresun Vakfı';
update public.sponsors set sira = 2 where ad_tr = 'ŞEBİNSİAD';
update public.sponsors set sira = 3 where ad_tr = 'Giresun Federasyonu';

-- 7. Ana sayfada öne çıkan firmalar (hiç seçilmemişse varsayılan dört firma) -----
update public.exhibitors set featured = true
where slug in ('izya-ic-mimarlik', 'meksan-savunma-metal-sac-sanayi', 'titanic-otel', 'bahat-saglik-grubu')
  and not exists (select 1 from public.exhibitors where featured);

-- Kontrol
select 'referans örneği' as kontrol, public.rastgele_referans() as deger
union all select 'yayındaki SSS', count(*)::text from public.faqs where published
union all select 'stand sayısı (toplam)', sum(coalesce(array_length(stands,1),0))::text from public.exhibitors where published;
