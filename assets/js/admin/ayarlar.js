/* ==========================================================================
   Yönetim paneli — Site Ayarları
   assets/js/admin/ayarlar.js

   site_settings tek satırlık bir tablodur (id boolean primary key check(id)).
   Bu sayfa o tek satırı düzenler.

   Tasarım kararı: alanlar bölümlere ayrıldı ve TR/EN çiftleri yan yana
   konuldu. Bir metni tek dilde güncelleyip diğerini unutmak, iki ayrı sekmede
   çalışırken çok kolay; yan yana olunca eksik kalan hemen görülüyor.
   ========================================================================== */

import { getClient } from '../supabase-client.js';
import { korumaliSayfa, oturumIzle } from './auth.js';
import { gunlukYaz } from './gunluk.js';
import {
  el, kabukKur, durumKutusu, iskelet, toast, onayla, kirliIsaretle, kirliMi
} from './ui.js';

const oturum = await korumaliSayfa();
oturumIzle();

const icerik = kabukKur({ aktif: 'ayar', baslik: 'Site Ayarları', oturum });
const sb = await getClient();

/* Formdaki her alanın DOM karşılığı burada toplanır */
const alanlar = {};
let ilkDeger = {};

icerik.append(
  el('div', { class: 'sayfa-bas' },
    el('div', { class: 'sayfa-bas__metin' },
      el('h1', null, 'Site Ayarları'),
      el('p', { class: 'sayfa-bas__alt' },
        'Buradaki değişiklikler siteye anında yansır.')))
);

const govde = el('div');
icerik.append(govde);
govde.append(iskelet(8));

yukle();

async function yukle() {
  if (!sb) {
    govde.replaceChildren(durumKutusu({
      tur: 'hata', baslik: 'Sunucuya bağlanılamadı',
      metin: 'assets/js/config.js dosyasını kontrol edin.'
    }));
    return;
  }

  const { data, error } = await sb.from('site_settings').select('*').limit(1).maybeSingle();

  if (error) {
    govde.replaceChildren(durumKutusu({
      tur: 'hata', baslik: 'Ayarlar okunamadı', metin: error.message
    }));
    return;
  }
  if (!data) {
    govde.replaceChildren(durumKutusu({
      tur: 'hata', baslik: 'Ayar satırı yok',
      metin: 'site_settings tablosu boş. supabase/seed.sql dosyasını çalıştırın.'
    }));
    return;
  }

  ilkDeger = data;
  formKur(data);
}

/* --- Alan üreticileri ----------------------------------------------------- */

let sayac = 0;
const yeniId = () => 'a' + (++sayac);

/* --- Saat dilimi ----------------------------------------------------------
   geri_sayim_hedefi timestamptz; veritabanında UTC tutulur. <input
   type="datetime-local"> ise YEREL duvar saati ister ve saat dilimi taşımaz.

   Bu alan bir ANA sayfa geri sayımını belirliyor ve fuar İstanbul'da. Bu yüzden
   tarayıcının saat dilimine hiç güvenmiyoruz: alan her zaman Türkiye saatini
   gösterir ve girileni Türkiye saati sayar. Yöneticinin nerede olduğu sonucu
   değiştirmez.

   Türkiye 2016'dan beri yaz saati uygulamıyor; sabit UTC+03.

   ÖNCEKİ HATA: UTC dizesi .slice(0,16) ile doğrudan alana basılıyor, kaydederken
   de new Date(...) onu YEREL sanıp tekrar çeviriyordu. Her kaydetme saati
   3 saat geri kaydırıyordu.                                                  */
const TR_OFSET_DK = 180;   // UTC+03:00

/** UTC ISO → "YYYY-MM-DDTHH:mm" (Türkiye duvar saati) */
function utcToTrYerel(iso) {
  if (!iso) return '';
  const t = new Date(iso);
  if (isNaN(t)) return '';
  const tr = new Date(t.getTime() + TR_OFSET_DK * 60000);
  return tr.toISOString().slice(0, 16);
}

/** "YYYY-MM-DDTHH:mm" (Türkiye duvar saati) → UTC ISO */
function trYerelToUtc(yerel) {
  if (!yerel) return null;
  const t = new Date(yerel + ':00.000Z');          // önce UTC gibi oku
  if (isNaN(t)) return null;
  return new Date(t.getTime() - TR_OFSET_DK * 60000).toISOString();
}

function metin(ad, etiket, deger, { tip = 'text', ipucu, cokSatir = false, maxlength } = {}) {
  const id = yeniId();

  /* type="url" KULLANMIYORUZ. Kullanıcılar adresi "giresunexpo.com" diye yazar;
     type=url şema istediği için alan geçersiz olur ve form SESSİZCE gönderilmez.
     Bunun yerine metin alanı + kaydederken https:// ekleme (bkz. urlDuzelt).
     Veritabanında da URL biçim kısıtı yok. */
  const gercekTip = tip === 'url' ? 'text' : tip;

  const giris = cokSatir
    ? el('textarea', { class: 'form__control', id, rows: '3', maxlength: maxlength || 600 })
    : el('input', {
        class: 'form__control', id, type: gercekTip, maxlength: maxlength || 300,
        inputmode: tip === 'url' ? 'url' : null,
        autocapitalize: tip === 'url' ? 'off' : null,
        spellcheck: tip === 'url' ? 'false' : null
      });
  if (tip === 'url') giris.dataset.url = '1';
  giris.value = deger ?? '';
  giris.addEventListener('input', () => kirliIsaretle(true));
  alanlar[ad] = giris;

  return el('div', { class: 'form__group' },
    el('label', { class: 'form__label', for: id }, etiket),
    giris,
    ipucu ? el('p', { class: 'form__hint' }, ipucu) : null
  );
}

/** TR/EN çifti yan yana */
function ikili(temelAd, etiket, veri, secenek = {}) {
  return el('div', { class: 'dil-ikili' },
    el('div', null,
      el('p', { class: 'dil-ikili__bayrak' }, 'Türkçe'),
      metin(temelAd + '_tr', etiket, veri[temelAd + '_tr'], secenek)),
    el('div', null,
      el('p', { class: 'dil-ikili__bayrak' }, 'English'),
      metin(temelAd + '_en', etiket, veri[temelAd + '_en'], secenek))
  );
}

/**
 * Açma/kapama anahtarı.
 *
 * DİKKAT: deger ZORUNLU ve boolean olmalı. Bu fonksiyon önce
 * (ad, etiket, deger, aciklama) imzasına sahipken üç argümanla çağrılmıştı;
 * açıklama metni deger yerine geçti, her kutu "açık" göründü ve kaydedince
 * ziyaretci_kaydi_acik kapandı, program_yayinda açıldı. Tip denetimi olmadığı
 * için hata sessizce veriye yazıldı. Artık yanlış tip gelirse patlar.
 */
function anahtar(ad, etiket, deger, aciklama = null) {
  if (typeof deger !== 'boolean') {
    throw new TypeError(
      `anahtar('${ad}'): deger boolean olmalı, '${typeof deger}' geldi. ` +
      'Açıklamayı 4. argüman olarak verin.'
    );
  }
  const id = yeniId();
  const kutu = el('input', { type: 'checkbox', id });
  kutu.checked = deger;
  kutu.addEventListener('change', () => kirliIsaretle(true));
  alanlar[ad] = kutu;

  return el('div', { class: 'alan--genis', style: 'display:flex;gap:var(--space-3);align-items:flex-start' },
    kutu,
    el('div', null,
      el('label', { class: 'form__label', for: id, style: 'margin:0' }, etiket),
      aciklama ? el('p', { class: 'form__hint' }, aciklama) : null)
  );
}

function bolum(baslik, aciklama, ...cocuklar) {
  return el('section', { class: 'panel', style: 'margin-bottom:var(--space-5)' },
    el('div', { class: 'panel__bas' },
      el('div', null,
        el('h2', { class: 'panel__baslik' }, baslik),
        aciklama ? el('p', { class: 'form__hint', style: 'margin:2px 0 0' }, aciklama) : null)),
    el('div', { class: 'panel__govde' },
      el('div', { class: 'alan-izgara' }, cocuklar))
  );
}

/* --- Tekrarlanabilir satır listesi (JSONB alanlar için) ------------------- */

/**
 * istatistikler, ziyaret_saatleri, stant_fiyatlari ve sosyal alanlarının hepsi
 * "nesne listesi" biçiminde. Dördü için ayrı editör yazmak yerine tek bir
 * tekrarlayıcı: sütun tanımını alır, satır ekle/sil düğmeleriyle liste kurar.
 */
function tekrarlayici(ad, baslik, sutunlar, mevcut, bosMetin) {
  const liste = el('div');
  const satirlar = [];

  function satirEkle(deger = {}) {
    const girisler = {};
    const hucreler = sutunlar.map((s) => {
      const id = yeniId();
      const g = el('input', {
        class: 'form__control', id, type: s.tip || 'text',
        placeholder: s.ornek || '', maxlength: s.maxlength || 200
      });
      g.value = deger[s.ad] ?? '';
      g.addEventListener('input', () => kirliIsaretle(true));
      girisler[s.ad] = g;
      return el('div', { class: 'form__group', style: 'margin:0' },
        el('label', { class: 'form__label', for: id,
                      style: 'font-size:.75rem' }, s.etiket),
        g);
    });

    const silBtn = el('button', {
      class: 'btn btn--ghost btn--sm', type: 'button', 'aria-label': 'Bu satırı sil'
    }, 'Sil');

    const satir = el('div', {
      style: 'display:grid;grid-template-columns:repeat(' + sutunlar.length +
             ',1fr) auto;gap:var(--space-3);align-items:end;padding:var(--space-3) 0;' +
             'border-bottom:1px solid var(--color-border)'
    }, hucreler, silBtn);

    const kayit = { satir, girisler };
    silBtn.addEventListener('click', () => {
      satir.remove();
      satirlar.splice(satirlar.indexOf(kayit), 1);
      kirliIsaretle(true);
      bosKontrol();
    });

    satirlar.push(kayit);
    liste.append(satir);
    bosKontrol();
  }

  const bosNot = el('p', { class: 'form__hint', style: 'padding:var(--space-4) 0' }, bosMetin);
  function bosKontrol() { bosNot.hidden = satirlar.length > 0; }

  (Array.isArray(mevcut) ? mevcut : []).forEach((d) => satirEkle(d));

  const ekleBtn = el('button', { class: 'btn btn--secondary btn--sm', type: 'button' },
    '+ Satır ekle');
  ekleBtn.addEventListener('click', () => { satirEkle(); kirliIsaretle(true); });

  alanlar[ad] = {
    topla: () => satirlar
      .map((k) => {
        const o = {};
        for (const s of sutunlar) o[s.ad] = k.girisler[s.ad].value.trim();
        return o;
      })
      // Tamamen boş satırlar kaydedilmez — kullanıcı ekleyip vazgeçmiş olabilir
      .filter((o) => Object.values(o).some((v) => v !== ''))
  };

  return el('section', { class: 'panel', style: 'margin-bottom:var(--space-5)' },
    el('div', { class: 'panel__bas' }, el('h2', { class: 'panel__baslik' }, baslik)),
    el('div', { class: 'panel__govde' }, liste, bosNot, ekleBtn)
  );
}

/* --- Form ----------------------------------------------------------------- */

function formKur(v) {
  const sosyal = v.sosyal && typeof v.sosyal === 'object' ? v.sosyal : {};

  const form = el('form', { id: 'ayar-formu' },

    bolum('Künye', 'Etkinliğin adı ve tarihleri. Geri sayım bu tarihlere göre çalışır.',
      metin('etkinlik_adi', 'Etkinlik adı', v.etkinlik_adi, { ipucu: 'Basın sayfasındaki künyede görünür. Tarihler ana sayfa, geri sayım ve künyede kullanılır.' }),
      metin('baslangic_tarihi', 'Başlangıç tarihi', v.baslangic_tarihi, { tip: 'date' }),
      metin('bitis_tarihi', 'Bitiş tarihi', v.bitis_tarihi, { tip: 'date' }),
      metin('geri_sayim_hedefi', 'Geri sayım hedefi (Türkiye saati)',
            utcToTrYerel(v.geri_sayim_hedefi), { tip: 'datetime-local',
            ipucu: 'Genellikle açılış günü ve saati. Her zaman Türkiye saatidir.' })
    ),

    bolum('Manşet ve slogan', 'Ana sayfadaki büyük başlık ve altındaki cümle.',
      ikili('manset', 'Manşet', v),
      ikili('slogan', 'Slogan', v)
    ),

    bolum('Mekân ve adres', null,
      ikili('mekan_ad', 'Mekân adı', v),
      ikili('mekan_alan', 'Salon / alan', v),
      metin('mekan_sehir', 'Şehir', v.mekan_sehir),
      ikili('adres', 'Açık adres', v, { cokSatir: true }),
      metin('harita_sorgusu', 'Harita arama metni', v.harita_sorgusu,
            { ipucu: 'Haritada aranacak metin. Örn: Yenikapı Etkinlik Alanı, İstanbul' }),
      metin('harita_lat', 'Enlem', v.harita_lat, { tip: 'number' }),
      metin('harita_lng', 'Boylam', v.harita_lng, { tip: 'number' })
    ),

    bolum('İletişim',
      'Boş bırakılan alanlar sitede HİÇ görünmez — boş bir telefon satırı basılmaz.',
      metin('telefon', 'Telefon', v.telefon),
      metin('eposta', 'E-posta', v.eposta, { tip: 'email' }),
      metin('web', 'Web sitesi', v.web, { tip: 'url' })
    ),

    bolum('Sosyal medya',
      'Yalnızca dolu olanlar sitede görünür. Tam adres yazın (https:// ile).',
      metin('sosyal_instagram', 'Instagram', sosyal.instagram, { tip: 'url' }),
      metin('sosyal_linkedin', 'LinkedIn', sosyal.linkedin, { tip: 'url' }),
      metin('sosyal_x', 'X (Twitter)', sosyal.x, { tip: 'url' }),
      metin('sosyal_youtube', 'YouTube', sosyal.youtube, { tip: 'url' }),
      metin('sosyal_facebook', 'Facebook', sosyal.facebook, { tip: 'url' })
    ),

    tekrarlayici('ziyaret_saatleri', 'Ziyaret saatleri', [
      { ad: 'tarih',   etiket: 'Tarih',    tip: 'date' },
      { ad: 'gun_tr',  etiket: 'Gün (TR)', ornek: 'Perşembe' },
      { ad: 'gun_en',  etiket: 'Gün (EN)', ornek: 'Thursday' },
      { ad: 'acilis',  etiket: 'Açılış',   tip: 'time' },
      { ad: 'kapanis', etiket: 'Kapanış',  tip: 'time' }
    ], v.ziyaret_saatleri, 'Henüz saat eklenmedi. Boş kalırsa sitede bu bölüm görünmez.'),

    tekrarlayici('istatistikler', 'İstatistikler', [
      { ad: 'deger',     etiket: 'Değer',      ornek: '86' },
      { ad: 'etiket_tr', etiket: 'Etiket (TR)', ornek: 'Katılımcı firma' },
      { ad: 'etiket_en', etiket: 'Etiket (EN)', ornek: 'Exhibitors' }
    ], v.istatistikler, 'İstatistik yok. Değer boş bırakılırsa "Katılımcı firma" ve "Stand sayısı" katılımcı listesinden otomatik hesaplanır.'),

    bolum('Duyuru çubuğu', 'Sitenin en üstünde çıkan ince şerit.',
      anahtar('duyuru_aktif', 'Duyuru çubuğu görünsün', !!v.duyuru_aktif,
              'Kapalıyken şerit hiç render edilmez.'),
      ikili('duyuru_metin', 'Duyuru metni', v),
      metin('duyuru_link', 'Duyuru bağlantısı', v.duyuru_link,
            { ipucu: 'Boş bırakılırsa şerit tıklanabilir olmaz.' })
    ),

    bolum('Etkinlik durumu metinleri',
      'Geri sayım bu üç duruma göre farklı metin gösterir: fuardan önce, fuar sırasında, fuardan sonra.',
      ikili('durum_oncesi', 'Fuardan önce', v),
      ikili('durum_sirasinda', 'Fuar sırasında', v),
      ikili('durum_sonrasi', 'Fuardan sonra', v)
    ),

    bolum('Başvuru ve kayıt anahtarları',
      'Bu anahtarlar veritabanında zorlanır: kapalıyken form tarayıcıdan zorlansa bile gönderim reddedilir.',
      anahtar('stant_basvuru_acik', 'Firma kayıtları açık', !!v.stant_basvuru_acik,
              'Kapatılırsa form yerine kapalı mesajı gösterilir.'),
      anahtar('ziyaretci_kaydi_acik', 'Ziyaretçi kaydı açık', !!v.ziyaretci_kaydi_acik,
              'Kapatılırsa ziyaretçi kayıt formu kapanır.'),
      anahtar('program_yayinda', 'Program yayında', !!v.program_yayinda,
              'Fuar Bilgileri sayfasındaki Etkinlik programı sayfası için; program eklendiğinde açın.'),
      ikili('stant_baslik', 'Firma Kayıt sayfası başlığı', v),
      ikili('stant_kapali', 'Başvuru kapalı mesajı', v, { cokSatir: true })
    ),

    tekrarlayici('stant_fiyatlari', 'Firma Kayıt — stant alanı seçenekleri', [
      { ad: 'tip_tr',    etiket: 'Alan (TR)',   ornek: '15 m²' },
      { ad: 'tip_en',    etiket: 'Alan (EN)',   ornek: '15 m²' },
      { ad: 'fiyat',     etiket: 'Fiyat',       ornek: '100.000 TL + KDV' },
      { ad: 'aciklama_tr', etiket: 'Açıklama (TR)' },
      { ad: 'aciklama_en', etiket: 'Açıklama (EN)' }
    ], v.stant_fiyatlari, 'Seçenek yok. Firma Kayıt formunda varsayılan alanlar (15/25/40 m²) gösterilir.')
  );

  const kaydetBtn = el('button', { class: 'btn btn--primary', type: 'submit' }, 'Kaydet');
  const geriAlBtn = el('button', { class: 'btn btn--ghost', type: 'button' }, 'Değişiklikleri geri al');
  const not = el('span', { class: 'kaydet-cubugu__not' }, 'Kaydedilmemiş değişiklikler var.');
  not.hidden = true;

  const cubuk = el('div', { class: 'kaydet-cubugu' }, not, geriAlBtn, kaydetBtn);
  form.append(cubuk);

  geriAlBtn.addEventListener('click', async () => {
    kirliIsaretle(false);
    govde.replaceChildren(iskelet(8));
    await yukle();
    toast('Değişiklikler geri alındı.', 'bilgi');
  });

  /* Kirli durumu çubuğa yansıt */
  const gozlem = new MutationObserver(() => { not.hidden = !kirliMi(); });
  gozlem.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    /* Geçersiz bir alan varsa tarayıcı requestSubmit()'i SESSİZCE reddeder.
       75 alanlı bir formda bu, "Kaydet çalışmıyor" demektir. Hatayı açıkça
       gösterip alana götürüyoruz. */
    if (!form.checkValidity()) {
      const ilk = form.querySelector(':invalid');
      const etiketMetni = ilk
        ? (form.querySelector(`label[for="${ilk.id}"]`)?.textContent || 'Bir alan')
        : 'Bir alan';
      toast(`${etiketMetni}: ${ilk?.validationMessage || 'geçersiz değer'}`, 'hata', 9000);
      if (ilk) {
        ilk.scrollIntoView({ block: 'center', behavior: 'smooth' });
        ilk.focus({ preventScroll: true });
        ilk.reportValidity();
      }
      return;
    }

    await kaydet(kaydetBtn);
  });

  govde.replaceChildren(form);
  kirliIsaretle(false);
  not.hidden = true;
}

/* --- Kaydetme ------------------------------------------------------------- */

function degerAl(ad) {
  const a = alanlar[ad];
  if (!a) return null;
  if (a.topla) return a.topla();
  if (a.type === 'checkbox') return a.checked;
  return a.value;
}

async function kaydet(btn) {
  const yama = {};

  /* Düz metin ve anahtarlar */
  const duzAlanlar = [
    'etkinlik_adi', 'baslangic_tarihi', 'bitis_tarihi',
    'manset_tr', 'manset_en', 'slogan_tr', 'slogan_en',
    'mekan_ad_tr', 'mekan_ad_en', 'mekan_alan_tr', 'mekan_alan_en', 'mekan_sehir',
    'adres_tr', 'adres_en', 'harita_sorgusu',
    'telefon', 'eposta', 'web',
    'duyuru_metin_tr', 'duyuru_metin_en', 'duyuru_link',
    'durum_oncesi_tr', 'durum_oncesi_en', 'durum_sirasinda_tr', 'durum_sirasinda_en',
    'durum_sonrasi_tr', 'durum_sonrasi_en',
    'stant_baslik_tr', 'stant_baslik_en', 'stant_kapali_tr', 'stant_kapali_en'
  ];
  for (const a of duzAlanlar) yama[a] = String(degerAl(a) ?? '').trim();

  /* URL alanları: kullanıcı "giresunexpo.com" yazar, siteye bağlantı olarak
     basılacağı için şema gerekir. Boşsa boş kalır — "https://" basmayız. */
  yama.web = urlDuzelt(yama.web);

  for (const a of ['duyuru_aktif', 'stant_basvuru_acik', 'ziyaretci_kaydi_acik', 'program_yayinda']) {
    yama[a] = !!degerAl(a);
  }

  /* Sayısal: boş string NULL olmalı, 0 olmamalı */
  for (const a of ['harita_lat', 'harita_lng']) {
    const v = String(degerAl(a) ?? '').trim();
    yama[a] = v === '' ? null : Number(v);
  }

  /* Alandaki değer Türkiye duvar saati; sunucuya UTC gider. */
  const gs = String(degerAl('geri_sayim_hedefi') ?? '').trim();
  if (gs) {
    const utc = trYerelToUtc(gs);
    if (!utc) { toast('Geri sayım hedefi geçersiz.', 'hata', 7000); return; }
    yama.geri_sayim_hedefi = utc;
  }

  /* Sosyal: boş olanlar nesneye HİÇ girmesin — sitede boş ikon çıkmasın */
  const sosyal = {};
  for (const ag of ['instagram', 'linkedin', 'x', 'youtube', 'facebook']) {
    const v = urlDuzelt(String(degerAl('sosyal_' + ag) ?? '').trim());
    if (v) sosyal[ag] = v;
  }
  yama.sosyal = sosyal;

  yama.ziyaret_saatleri = degerAl('ziyaret_saatleri') || [];
  yama.istatistikler    = degerAl('istatistikler') || [];
  yama.stant_fiyatlari  = degerAl('stant_fiyatlari') || [];

  /* İstemci tarafı ön kontrol — asıl kısıt veritabanında */
  if (yama.baslangic_tarihi && yama.bitis_tarihi &&
      yama.bitis_tarihi < yama.baslangic_tarihi) {
    toast('Bitiş tarihi başlangıçtan önce olamaz.', 'hata', 7000);
    return;
  }

  /* Herkese açık bir formu KAPATMAK dışarıdan görünür bir etki. Yanlışlıkla
     olmasın diye onay isteriz. Açmak için onay gerekmez. */
  const kritik = [
    ['stant_basvuru_acik',   'Firma kayıtları'],
    ['ziyaretci_kaydi_acik', 'Ziyaretçi kaydı']
  ];
  const kapananlar = kritik
    .filter(([k]) => ilkDeger[k] === true && yama[k] === false)
    .map(([, ad]) => ad);

  if (kapananlar.length) {
    const eminMi = await onayla({
      baslik: 'Form kapatılsın mı?',
      metin: `${kapananlar.join(' ve ')} kapatılacak. Ziyaretçiler formu göremeyecek ` +
             've gönderim veritabanı tarafından reddedilecek. Bu ayarı istediğiniz ' +
             'zaman tekrar açabilirsiniz.',
      onayMetni: 'Evet, kapat',
      tehlike: true
    });
    if (!eminMi) return;
  }

  btn.disabled = true;
  btn.classList.add('is-loading');

  const { error } = await sb.from('site_settings').update(yama).eq('id', true);

  btn.disabled = false;
  btn.classList.remove('is-loading');

  if (error) {
    toast('Kaydedilemedi: ' + hataCevir(error), 'hata', 9000);
    return;
  }

  /* Neyin değiştiğini günlüğe yaz */
  const degisen = Object.keys(yama).filter(
    (k) => JSON.stringify(yama[k]) !== JSON.stringify(ilkDeger[k])
  );
  gunlukYaz({
    tablo: 'site_settings', kayit_id: 'true', islem: 'update',
    ozet: degisen.length ? 'Güncellenen alanlar: ' + degisen.join(', ') : 'Değişiklik yok'
  });

  kirliIsaretle(false);
  ilkDeger = { ...ilkDeger, ...yama };
  toast('Ayarlar kaydedildi. Site anında güncellendi.', 'basari');
}

/**
 * "giresunexpo.com" → "https://giresunexpo.com". Zaten şemalıysa dokunmaz.
 * Boşsa boş döner. javascript: gibi şemalar kabul edilmez.
 */
function urlDuzelt(v) {
  const s = String(v || '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  if (/^[a-z][a-z0-9+.-]*:/i.test(s)) return '';   // javascript:, data:, mailto: …
  return 'https://' + s.replace(/^\/+/, '');
}

function hataCevir(error) {
  const m = (error.message || '').toLowerCase();
  if (m.includes('tarih_sirasi')) return 'Bitiş tarihi başlangıç tarihinden önce olamaz.';
  if (m.includes('invalid input syntax for type date')) return 'Tarih alanlarından biri geçersiz.';
  if (m.includes('invalid input syntax for type numeric')) return 'Enlem/boylam sayı olmalı.';
  if (m.includes('permission denied') || m.includes('row-level security')) {
    return 'Bu değişiklik için yetkiniz yok.';
  }
  return error.message;
}
