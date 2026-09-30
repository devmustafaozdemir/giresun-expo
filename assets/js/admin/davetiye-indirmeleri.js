/* ==========================================================================
   Yönetim paneli — Davetiye İndirmeleri
   assets/js/admin/davetiye-indirmeleri.js

   davetiye.html'deki her başarılı indirme / galeriye kaydetme bir satır
   (supabase/migrations/006_davetiye_indirme.sql). Üstte özet kartları ve
   firma bazında döküm, altta tüm indirmelerin listesi: hangi firma kimi
   davet etti (007_davetiye_davetli.sql). Salt okunur.
   ========================================================================== */

import { getClient } from '../supabase-client.js';
import { korumaliSayfa, oturumIzle } from './auth.js';
import { listeSayfasi, kunye } from './liste.js';
import { el, kabukKur, tarihSaat, durumKutusu } from './ui.js';

const oturum = await korumaliSayfa();
oturumIzle();

const icerik = kabukKur({ aktif: 'davetiye', baslik: 'Davetiye İndirmeleri', oturum });
const sb = await getClient();

const CIHAZ  = { mobil: 'Telefon', masaustu: 'Bilgisayar' };
const YONTEM = { paylasim: 'Galeriye kaydetme', indirme: 'Dosya indirme' };
const FIRMASIZ = 'Firma seçilmeden';
const ILK_FIRMA = 10;

/* "Davet edilen" sütunu 007 migration'ıyla geldi. Çalıştırılmadıysa
   select hata verip bütün listeyi düşürmesin: sütun yoksa gösterme. */
const davetliVar = !!sb &&
  !(await sb.from('invitation_downloads').select('invitee_name').limit(1)).error;
const davetliAd = (r) => (r.invitee_name || '').trim() || '—';

/* Özet, liste başlığının hemen altına yerleşir (bkz. sondaki after) */
const ozet = el('div');

/* --- Liste --- */
await listeSayfasi(icerik, {
  baslik: 'Davetiye İndirmeleri',
  altBaslik: 'Davetiye sayfasından yapılan her indirme ve galeriye kaydetme: ' +
             'hangi firma kimi davet etti. Paylaşım penceresini kapatıp vazgeçenler sayılmaz.',
  tablo: 'invitation_downloads',
  secim: 'id, exhibitor_slug, exhibitor_name, cihaz, yontem, created_at' +
         (davetliVar ? ', invitee_name' : ''),
  aramaAlanlari: davetliVar ? ['exhibitor_name', 'invitee_name'] : ['exhibitor_name'],
  aramaIpucu: davetliVar ? 'Firma veya davet edilen kişi…' : 'Firma adı…',

  suzgecler: [
    {
      ad: 'cihaz', etiket: 'Tüm cihazlar',
      secenekler: Object.entries(CIHAZ).map(([d, e]) => ({ deger: d, etiket: e })),
      uygula: (q, v) => q.eq('cihaz', v)
    },
    {
      ad: 'yontem', etiket: 'Tüm yöntemler',
      secenekler: Object.entries(YONTEM).map(([d, e]) => ({ deger: d, etiket: e })),
      uygula: (q, v) => q.eq('yontem', v)
    }
  ],

  sutunlar: [
    { baslik: 'Tarih', sirala: 'created_at', sinif: 'tablo__tarih',
      render: (r) => tarihSaat(r.created_at) },
    { baslik: 'Firma', sirala: 'exhibitor_name', render: (r) => r.exhibitor_name || FIRMASIZ },
    ...(davetliVar ? [{ baslik: 'Davet edilen', sirala: 'invitee_name', render: davetliAd }] : []),
    { baslik: 'Cihaz', sirala: 'cihaz', render: (r) =>
        el('span', { class: 'durum durum--' + (r.cihaz === 'mobil' ? 'new' : 'notr') },
           CIHAZ[r.cihaz] || r.cihaz) },
    { baslik: 'Yöntem', sirala: 'yontem', render: (r) => YONTEM[r.yontem] || r.yontem }
  ],

  bosBaslik: 'Henüz davetiye indirilmedi',
  bosMetin: 'Davetiye sayfasından yapılan indirmeler burada listelenecek.',

  csv: {
    dosya: 'giresun-expo-davetiye-indirmeleri',
    basliklar: ['Tarih', 'Firma', ...(davetliVar ? ['Davet edilen'] : []), 'Cihaz', 'Yöntem'],
    satir: (r) => [tarihSaat(r.created_at), r.exhibitor_name || FIRMASIZ,
                   ...(davetliVar ? [(r.invitee_name || '').trim()] : []),
                   CIHAZ[r.cihaz] || r.cihaz, YONTEM[r.yontem] || r.yontem]
  },

  cekmece: (r) => ({
    baslik: r.exhibitor_name || FIRMASIZ,
    govde: el('dl', { class: 'kunye' },
      kunye('Tarih', tarihSaat(r.created_at)),
      kunye('Firma', r.exhibitor_name || FIRMASIZ),
      davetliVar ? kunye('Davet edilen', davetliAd(r)) : null,
      kunye('Cihaz', CIHAZ[r.cihaz] || r.cihaz),
      kunye('Yöntem', YONTEM[r.yontem] || r.yontem))
  })
});

const bas = icerik.querySelector('.sayfa-bas');
if (bas) bas.after(ozet); else icerik.prepend(ozet);
ozetYukle();

/* --- Özet ----------------------------------------------------------------- */

async function ozetYukle() {
  if (!sb) return;

  /* Toplam head+count'tan; döküm için satırlar (10.000'e kadar) */
  const [top, satir] = await Promise.all([
    sb.from('invitation_downloads').select('*', { count: 'exact', head: true }),
    sb.from('invitation_downloads')
      .select('exhibitor_name, cihaz, created_at')
      .order('created_at', { ascending: false }).limit(10000)
  ]);

  if (top.error || satir.error) {
    ozet.replaceChildren(el('section', { class: 'panel', style: 'margin-bottom:var(--space-6)' },
      el('div', { class: 'panel__govde' }, durumKutusu({
        tur: 'hata',
        baslik: 'Sayaç okunamadı',
        metin: 'supabase/migrations/006_davetiye_indirme.sql çalıştırılmamış olabilir. ' +
               (top.error || satir.error).message
      }))));
    return;
  }

  const veri = satir.data || [];
  const bugun = yerelGun(new Date());
  const firma = new Map();
  let mobil = 0, bugunSay = 0;
  for (const s of veri) {
    const ad = s.exhibitor_name || FIRMASIZ;
    const f = firma.get(ad) || { toplam: 0, mobil: 0 };
    f.toplam++;
    if (s.cihaz === 'mobil') { f.mobil++; mobil++; }
    firma.set(ad, f);
    if (yerelGun(new Date(s.created_at)) === bugun) bugunSay++;
  }
  const firmaSayisi = [...firma.keys()].filter((a) => a !== FIRMASIZ).length;

  const kartlar = el('div', { class: 'istatistik-izgara' },
    istKart('Toplam indirme', top.count ?? veri.length),
    istKart('Bugün', bugunSay),
    istKart('Telefon', mobil, 'galeriye kaydetme veya indirme'),
    istKart('Bilgisayar', veri.length - mobil),
    istKart('Firma', firmaSayisi, 'en az bir davetiyesi indirilen')
  );

  ozet.replaceChildren(kartlar, veri.length ? firmaPaneli(firma, top.count, veri.length) : null);
}

function firmaPaneli(firma, toplam, satirSayisi) {
  const sira = [...firma.entries()]
    .sort((a, b) => b[1].toplam - a[1].toplam || a[0].localeCompare(b[0], 'tr'));

  const satirlar = sira.map(([ad, f], i) => el('tr', { hidden: i >= ILK_FIRMA },
    el('td', null, ad),
    el('td', null, String(f.toplam)),
    el('td', null, String(f.mobil)),
    el('td', null, String(f.toplam - f.mobil))
  ));

  const hepsiBtn = sira.length > ILK_FIRMA
    ? el('button', { class: 'btn btn--ghost btn--sm', type: 'button', style: 'margin-left:auto' },
        `Tümünü göster (${sira.length})`)
    : null;
  if (hepsiBtn) {
    hepsiBtn.addEventListener('click', () => {
      satirlar.forEach((tr) => { tr.hidden = false; });
      hepsiBtn.remove();
    });
  }

  return el('section', { class: 'panel', style: 'margin-bottom:var(--space-6)' },
    el('div', { class: 'panel__bas' },
      el('h2', { class: 'panel__baslik' }, 'Firma bazında'),
      hepsiBtn),
    el('div', { class: 'panel__govde panel__govde--sikisik' },
      el('div', { class: 'tablo-sarmal' },
        el('table', { class: 'tablo' },
          el('thead', null, el('tr', null,
            el('th', null, 'Firma'), el('th', null, 'Toplam'),
            el('th', null, 'Telefon'), el('th', null, 'Bilgisayar'))),
          el('tbody', null, satirlar))),
      toplam > satirSayisi
        ? el('p', { class: 'ist-kart__alt', style: 'margin:0;padding:var(--space-3) var(--space-5)' },
            `Döküm son ${satirSayisi} indirmeye göredir.`)
        : null)
  );
}

function istKart(etiket, deger, alt) {
  return el('div', { class: 'ist-kart' },
    el('p', { class: 'ist-kart__etiket' }, etiket),
    el('p', { class: 'ist-kart__deger' }, String(deger)),
    alt ? el('p', { class: 'ist-kart__alt' }, alt) : null
  );
}

/* Yerel (Türkiye) takvim günü */
function yerelGun(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
