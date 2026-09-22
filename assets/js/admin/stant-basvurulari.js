/* ==========================================================================
   Yönetim paneli — Stant Başvuruları
   assets/js/admin/stant-basvurulari.js

   Tablo, arama, durum filtresi, sıralama, sayfalama, detay çekmecesi,
   durum değiştirme, admin notu, CSV dışa aktarma.

   Sayfalama SUNUCU tarafında: .range() ile yalnızca görünen sayfa indirilir.
   Başvuru sayısı büyüdüğünde hepsini çekip istemcide dilimlemek çökerdi.
   ========================================================================== */

import { getClient } from '../supabase-client.js';
import { korumaliSayfa, oturumIzle } from './auth.js';
import { gunlukYaz } from './gunluk.js';
import {
  el, ikon, kabukKur, sayacGuncelle, durumKutusu, iskelet, toast, onayla,
  tarihSaat, durumRozeti, DURUM_ETIKET, DURUM_SIRA, csvIndir, bugun
} from './ui.js';

const oturum = await korumaliSayfa();
oturumIzle();

const icerik = kabukKur({ aktif: 'stant', baslik: 'Firma Kayıtları', oturum });
const sb = await getClient();

const SAYFA_BOYU = 25;
const STANT_TIPI = { hazir: 'Hazır stant', bos: 'Boş alan', acik: 'Açık alan' };

/* Durum: URL'de tutulur, böylece sayfa yenilense ve paylaşılsa da korunur */
const durum = {
  q: '',
  status: '',
  sirala: 'created_at',
  yon: false,          // false = azalan (yeniden eskiye)
  sayfa: 0,
  toplam: 0
};

/* --- Sayfa iskeleti ------------------------------------------------------- */

const araKutu = el('input', {
  class: 'form__control', type: 'search', placeholder: 'Firma, yetkili, e-posta veya no…',
  'aria-label': 'Başvurularda ara'
});

const durumSecim = el('select', {
  class: 'form__control arac-cubugu__suzgec', 'aria-label': 'Duruma göre süz'
},
  el('option', { value: '' }, 'Tüm durumlar'),
  DURUM_SIRA.map((d) => el('option', { value: d }, DURUM_ETIKET[d]))
);

const csvBtn = el('button', { class: 'btn btn--secondary btn--sm', type: 'button' },
  ikon('indir', ''), el('span', null, 'CSV indir'));

const sonucBilgi = el('span', { class: 'sayfalama__bilgi' });

icerik.append(
  el('div', { class: 'sayfa-bas' },
    el('div', { class: 'sayfa-bas__metin' },
      el('h1', null, 'Firma Kayıtları'),
      el('p', { class: 'sayfa-bas__alt' },
        'Satıra tıklayarak ayrıntıyı açın, durumu değiştirin ve not ekleyin.'))
  ),
  el('div', { class: 'arac-cubugu' },
    el('div', { class: 'arac-cubugu__ara' }, araKutu),
    durumSecim,
    el('div', { class: 'arac-cubugu__sag' }, csvBtn)
  )
);

const panel = el('section', { class: 'panel' });
icerik.append(panel);

/* --- Olaylar -------------------------------------------------------------- */

let aramaZamanlayici;
araKutu.addEventListener('input', () => {
  clearTimeout(aramaZamanlayici);
  aramaZamanlayici = setTimeout(() => {
    durum.q = araKutu.value.trim();
    durum.sayfa = 0;
    urlYaz();
    yukle();
  }, 300);
});

durumSecim.addEventListener('change', () => {
  durum.status = durumSecim.value;
  durum.sayfa = 0;
  urlYaz();
  yukle();
});

csvBtn.addEventListener('click', csvAktar);

/* URL durumu — geri tuşu da çalışsın */
function urlOku() {
  const p = new URLSearchParams(location.search);
  durum.q = p.get('q') || '';
  durum.status = p.get('durum') || '';
  durum.sirala = p.get('sirala') || 'created_at';
  durum.yon = p.get('yon') === 'asc';
  durum.sayfa = Math.max(0, parseInt(p.get('s') || '0', 10) || 0);
  araKutu.value = durum.q;
  durumSecim.value = durum.status;
}
function urlYaz() {
  const p = new URLSearchParams();
  if (durum.q) p.set('q', durum.q);
  if (durum.status) p.set('durum', durum.status);
  if (durum.sirala !== 'created_at') p.set('sirala', durum.sirala);
  if (durum.yon) p.set('yon', 'asc');
  if (durum.sayfa) p.set('s', String(durum.sayfa));
  const yeni = location.pathname + (p.toString() ? '?' + p : '');
  history.replaceState(null, '', yeni);
}
window.addEventListener('popstate', () => { urlOku(); yukle(); });

urlOku();
yukle();

/* --- Veri ----------------------------------------------------------------- */

function sorgu(sayimIcin = false) {
  let s = sb.from('stand_applications').select(
    'id, application_no, company, sector, website, contact_name, title, email, phone,' +
    ' stand_type, area_m2, note, status, admin_note, created_at',
    sayimIcin ? { count: 'exact', head: true } : { count: 'exact' }
  );

  if (durum.status) s = s.eq('status', durum.status);

  if (durum.q) {
    const q = durum.q.replace(/[%,()]/g, ' ').trim();
    if (q) {
      s = s.or(
        `company.ilike.%${q}%,contact_name.ilike.%${q}%,` +
        `email.ilike.%${q}%,application_no.ilike.%${q}%,phone.ilike.%${q}%,sector.ilike.%${q}%`
      );
    }
  }
  return s;
}

async function yukle() {
  panel.replaceChildren(iskelet(6));

  if (!sb) {
    panel.replaceChildren(durumKutusu({
      tur: 'hata', baslik: 'Sunucuya bağlanılamadı',
      metin: 'assets/js/config.js dosyasını kontrol edin.'
    }));
    return;
  }

  const bas = durum.sayfa * SAYFA_BOYU;
  const { data, error, count } = await sorgu()
    .order(durum.sirala, { ascending: durum.yon })
    .range(bas, bas + SAYFA_BOYU - 1);

  if (error) {
    panel.replaceChildren(durumKutusu({
      tur: 'hata', baslik: 'Başvurular okunamadı', metin: error.message
    }));
    return;
  }

  durum.toplam = count ?? 0;

  /* Yan menüdeki "yeni" sayacı — filtreden bağımsız */
  sb.from('stand_applications')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')
    .then(({ count: yeni }) => sayacGuncelle('stant', yeni ?? 0));

  if (!data.length) {
    panel.replaceChildren(durumKutusu({
      baslik: durum.q || durum.status ? 'Eşleşen başvuru yok' : 'Henüz başvuru yok',
      metin: durum.q || durum.status
        ? 'Arama veya filtreyi değiştirip tekrar deneyin.'
        : 'Siteden gelen firma kayıtları burada listelenecek.',
      eylem: (durum.q || durum.status)
        ? el('button', {
            class: 'btn btn--ghost btn--sm', type: 'button',
            onclick: () => {
              durum.q = ''; durum.status = ''; durum.sayfa = 0;
              araKutu.value = ''; durumSecim.value = '';
              urlYaz(); yukle();
            }
          }, 'Filtreyi temizle')
        : null
    }));
    return;
  }

  panel.replaceChildren(tabloYap(data), sayfalamaYap());
}

/* --- Tablo ---------------------------------------------------------------- */

function baslikHucre(etiket, alan) {
  if (!alan) return el('th', null, etiket);

  const aktif = durum.sirala === alan;
  const btn = el('button', {
    class: 'tablo__sirala', type: 'button',
    'aria-sort': aktif ? (durum.yon ? 'ascending' : 'descending') : 'none'
  },
    el('span', null, etiket),
    el('span', { class: 'tablo__ok', 'aria-hidden': 'true' }, '▼')
  );

  btn.addEventListener('click', () => {
    if (durum.sirala === alan) durum.yon = !durum.yon;
    else { durum.sirala = alan; durum.yon = false; }
    durum.sayfa = 0;
    urlYaz();
    yukle();
  });

  return el('th', null, btn);
}

function tabloYap(satirlar) {
  const govde = el('tbody');

  for (const r of satirlar) {
    const tr = el('tr', { tabindex: '0', role: 'button',
      'aria-label': `${r.company} başvurusunun ayrıntısı` },
      el('td', { class: 'tablo__no' }, r.application_no || '—'),
      el('td', null, r.company),
      el('td', null, r.contact_name),
      el('td', null, r.area_m2 ? r.area_m2 + ' m²' : (STANT_TIPI[r.stand_type] || '—')),
      el('td', null, durumRozeti(r.status)),
      el('td', { class: 'tablo__tarih' }, tarihSaat(r.created_at))
    );
    tr.style.cursor = 'pointer';
    tr.addEventListener('click', () => cekmeceAc(r));
    tr.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cekmeceAc(r); }
    });
    govde.append(tr);
  }

  return el('div', { class: 'tablo-sarmal' },
    el('table', { class: 'tablo' },
      el('thead', null, el('tr', null,
        baslikHucre('No', 'application_no'),
        baslikHucre('Firma', 'company'),
        baslikHucre('Yetkili', 'contact_name'),
        baslikHucre('Stant alanı', 'area_m2'),
        baslikHucre('Durum', 'status'),
        baslikHucre('Tarih', 'created_at')
      )),
      govde
    ));
}

function sayfalamaYap() {
  const sonSayfa = Math.max(0, Math.ceil(durum.toplam / SAYFA_BOYU) - 1);
  const bas = durum.sayfa * SAYFA_BOYU + 1;
  const son = Math.min(durum.toplam, (durum.sayfa + 1) * SAYFA_BOYU);

  sonucBilgi.textContent = `${durum.toplam} başvurudan ${bas}–${son} arası`;

  const git = (n) => { durum.sayfa = n; urlYaz(); yukle(); window.scrollTo({ top: 0 }); };

  return el('div', { class: 'sayfalama' },
    sonucBilgi,
    el('button', {
      class: 'btn btn--ghost btn--sm', type: 'button',
      disabled: durum.sayfa === 0, onclick: () => git(durum.sayfa - 1)
    }, '← Önceki'),
    el('span', { style: 'font-size:.875rem;color:var(--color-muted)' },
      `${durum.sayfa + 1} / ${sonSayfa + 1}`),
    el('button', {
      class: 'btn btn--ghost btn--sm', type: 'button',
      disabled: durum.sayfa >= sonSayfa, onclick: () => git(durum.sayfa + 1)
    }, 'Sonraki →')
  );
}

/* --- Detay çekmecesi ------------------------------------------------------ */

let acikCekmece = null;

function cekmeceAc(r) {
  cekmeceKapat();

  const oncekiOdak = document.activeElement;

  const durumSec = el('select', { class: 'form__control', id: 'cek-durum' },
    DURUM_SIRA.map((d) => el('option', { value: d, selected: d === r.status }, DURUM_ETIKET[d]))
  );

  const notAlan = el('textarea', {
    class: 'form__control', id: 'cek-not', rows: '4', maxlength: '4000',
    placeholder: 'Bu başvuruyla ilgili iç not… (ziyaretçiye gösterilmez)'
  });
  notAlan.value = r.admin_note || '';

  const kaydetBtn = el('button', { class: 'btn btn--primary', type: 'button' }, 'Kaydet');
  const kapatBtn = el('button', { class: 'btn btn--ghost', type: 'button' }, 'Kapat');

  const silBtn = oturum.admin.role === 'owner'
    ? el('button', { class: 'btn btn--tehlike btn--sm', type: 'button' }, 'Sil')
    : null;

  const govde = el('div', { class: 'cekmece__govde' },
    el('dl', { class: 'kunye' },
      kunye('Başvuru no', r.application_no || '—'),
      kunye('Firma', r.company),
      kunye('Sektör', r.sector || '—'),
      kunye('Web sitesi', r.website
        ? el('a', { href: guvenliUrl(r.website), target: '_blank', rel: 'noopener noreferrer' }, r.website)
        : '—'),
      kunye('Yetkili', r.contact_name),
      kunye('Unvan / Görev', r.title || '—'),
      kunye('E-posta', el('a', { href: 'mailto:' + r.email }, r.email)),
      kunye('Telefon', el('a', { href: 'tel:' + r.phone.replace(/\s/g, '') }, r.phone)),
      kunye('Stant tipi', STANT_TIPI[r.stand_type] || '—'),
      kunye('Alan', r.area_m2 ? r.area_m2 + ' m²' : '—'),
      kunye('Başvuru notu', r.note || '—'),
      kunye('Geliş tarihi', tarihSaat(r.created_at))
    ),

    el('div', { class: 'form__group', style: 'margin-top:var(--space-6)' },
      el('label', { class: 'form__label', for: 'cek-durum' }, 'Durum'),
      durumSec),

    el('div', { class: 'form__group', style: 'margin-top:var(--space-4)' },
      el('label', { class: 'form__label', for: 'cek-not' }, 'Yönetim notu'),
      notAlan,
      el('p', { class: 'form__hint' }, 'Yalnızca panelde görünür.'))
  );

  const cekmece = el('aside', {
    class: 'cekmece', role: 'dialog', 'aria-modal': 'true',
    'aria-labelledby': 'cek-baslik'
  },
    el('div', { class: 'cekmece__bas' },
      el('h2', { class: 'cekmece__baslik', id: 'cek-baslik' }, r.company),
      el('button', {
        class: 'toast__kapat', type: 'button', 'aria-label': 'Kapat',
        style: 'margin-left:auto', onclick: () => cekmeceKapat()
      }, ikon('kapat', ''))
    ),
    govde,
    el('div', { class: 'cekmece__alt' }, kaydetBtn, kapatBtn, silBtn)
  );

  const ortu = el('div', { class: 'cekmece-ortu' });
  ortu.addEventListener('click', () => cekmeceKapat());

  document.body.append(ortu, cekmece);
  requestAnimationFrame(() => {
    ortu.classList.add('is-acik');
    cekmece.classList.add('is-acik');
  });

  /* Focus kapanı + Escape */
  function tus(e) {
    if (e.key === 'Escape') { e.preventDefault(); cekmeceKapat(); return; }
    if (e.key !== 'Tab') return;
    const o = cekmece.querySelectorAll('button, [href], input, select, textarea');
    if (!o.length) return;
    const ilk = o[0], son = o[o.length - 1];
    if (e.shiftKey && document.activeElement === ilk) { e.preventDefault(); son.focus(); }
    else if (!e.shiftKey && document.activeElement === son) { e.preventDefault(); ilk.focus(); }
  }
  document.addEventListener('keydown', tus, true);

  acikCekmece = () => {
    document.removeEventListener('keydown', tus, true);
    ortu.remove();
    cekmece.remove();
    if (oncekiOdak && oncekiOdak.focus) oncekiOdak.focus();
  };

  kapatBtn.addEventListener('click', () => cekmeceKapat());
  durumSec.focus();

  kaydetBtn.addEventListener('click', async () => {
    const yeniDurum = durumSec.value;
    const yeniNot = notAlan.value;
    if (yeniDurum === r.status && yeniNot === (r.admin_note || '')) {
      toast('Değişiklik yok.', 'bilgi');
      return;
    }

    kaydetBtn.disabled = true;
    kaydetBtn.classList.add('is-loading');

    const { error } = await sb.from('stand_applications')
      .update({ status: yeniDurum, admin_note: yeniNot })
      .eq('id', r.id);

    kaydetBtn.disabled = false;
    kaydetBtn.classList.remove('is-loading');

    if (error) { toast('Kaydedilemedi: ' + error.message, 'hata', 8000); return; }

    const parcalar = [];
    if (yeniDurum !== r.status) {
      parcalar.push(`durum: ${DURUM_ETIKET[r.status] || r.status} → ${DURUM_ETIKET[yeniDurum]}`);
    }
    if (yeniNot !== (r.admin_note || '')) parcalar.push('not güncellendi');

    gunlukYaz({
      tablo: 'stand_applications', kayit_id: r.id, islem: 'update',
      ozet: `${r.application_no || r.company}: ${parcalar.join(', ')}`
    });

    toast('Kaydedildi.', 'basari');
    cekmeceKapat();
    yukle();
  });

  if (silBtn) {
    silBtn.addEventListener('click', async () => {
      const eminMi = await onayla({
        baslik: 'Başvuru silinsin mi?',
        metin: `${r.company} (${r.application_no || 'numarasız'}) kalıcı olarak silinecek. ` +
               'Bu işlem geri alınamaz.',
        onayMetni: 'Evet, sil',
        tehlike: true
      });
      if (!eminMi) return;

      const { error } = await sb.from('stand_applications').delete().eq('id', r.id);
      if (error) { toast('Silinemedi: ' + error.message, 'hata', 8000); return; }

      gunlukYaz({
        tablo: 'stand_applications', kayit_id: r.id, islem: 'delete',
        ozet: `${r.application_no || r.company} silindi`
      });

      toast('Başvuru silindi.', 'basari');
      cekmeceKapat();
      yukle();
    });
  }
}

function cekmeceKapat() {
  if (acikCekmece) { acikCekmece(); acikCekmece = null; }
}

function kunye(etiket, deger) {
  return el('div', { class: 'kunye__satir' },
    el('dt', { class: 'kunye__etiket' }, etiket),
    el('dd', { class: 'kunye__deger' }, deger)
  );
}

/** Kullanıcıdan gelen adresi güvenli hâle getirir (javascript: vb. engellenir) */
function guvenliUrl(v) {
  const s = String(v).trim();
  if (/^https?:\/\//i.test(s)) return s;
  if (/^[\w.-]+\.[a-z]{2,}/i.test(s)) return 'https://' + s;
  return '#';
}

/* --- CSV ------------------------------------------------------------------ */

async function csvAktar() {
  csvBtn.disabled = true;
  csvBtn.classList.add('is-loading');

  /* Dışa aktarma GÖRÜNEN sayfayı değil, filtreye uyan TÜM satırları alır.
     Kullanıcı "CSV indir" derken ekrandaki 25 satırı değil, süzdüğü kümenin
     tamamını bekler. */
  const { data, error } = await sorgu()
    .order(durum.sirala, { ascending: durum.yon })
    .range(0, 4999);

  csvBtn.disabled = false;
  csvBtn.classList.remove('is-loading');

  if (error) { toast('Dışa aktarılamadı: ' + error.message, 'hata', 8000); return; }
  if (!data.length) { toast('Dışa aktarılacak kayıt yok.', 'uyari'); return; }

  csvIndir(
    `giresun-expo-stant-basvurulari-${bugun()}.csv`,
    ['Başvuru No', 'Firma', 'Sektör', 'Web', 'Yetkili', 'Unvan / Görev', 'E-posta', 'Telefon',
     'Stant tipi', 'Alan (m²)', 'Başvuru notu', 'Durum', 'Yönetim notu', 'Tarih'],
    data.map((r) => [
      r.application_no, r.company, r.sector, r.website, r.contact_name, r.title || '', r.email, r.phone,
      STANT_TIPI[r.stand_type] || '', r.area_m2 ?? '', r.note,
      DURUM_ETIKET[r.status] || r.status, r.admin_note, tarihSaat(r.created_at)
    ])
  );

  gunlukYaz({
    tablo: 'stand_applications', islem: 'export',
    ozet: `${data.length} başvuru CSV olarak indirildi`
  });

  toast(`${data.length} kayıt indirildi.`, 'basari');
}
