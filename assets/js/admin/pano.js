/* ==========================================================================
   Yönetim paneli — Pano
   assets/js/admin/pano.js

   Özet kartları, 30 günlük başvuru grafiği, son kayıtlar, hızlı eylemler.
   Grafik elle üretilen SVG'dir; kütüphane/CDN bağımlılığı yok (açık soru #30).
   ========================================================================== */

import { getClient } from '../supabase-client.js';
import { korumaliSayfa, oturumIzle } from './auth.js';
import {
  el, kabukKur, sayacGuncelle, durumKutusu, iskelet, gorece, durumRozeti
} from './ui.js';

const oturum = await korumaliSayfa();
oturumIzle();

const icerik = kabukKur({ aktif: 'pano', baslik: 'Pano', oturum });
const sb = await getClient();

/* Ad varsa adla selamla, yoksa e-postanın @ öncesiyle */
const ad = (oturum.admin.ad_soyad || '').trim() || oturum.admin.email.split('@')[0];

icerik.append(
  el('div', { class: 'sayfa-bas' },
    el('div', { class: 'sayfa-bas__metin' },
      el('h1', null, `Merhaba, ${ad}`),
      el('p', { class: 'sayfa-bas__alt' }, 'Fuar başvurularının ve site içeriğinin özeti.')
    )
  )
);

const istAlan   = el('div', { class: 'istatistik-izgara' });
const grafikAlan = el('section', { class: 'panel', style: 'margin-bottom:var(--space-6)' });
const altIzgara = el('div', {
  style: 'display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:var(--space-4)'
});

icerik.append(istAlan, grafikAlan, altIzgara);

istAlan.append(...[1, 2, 3, 4].map(() => el('div', { class: 'ist-kart' },
  el('div', { class: 'iskelet iskelet--satir', style: 'width:60%' }),
  el('div', { class: 'iskelet iskelet--satir', style: 'width:40%;height:28px' })
)));
grafikAlan.append(iskelet(4));

yukle();

async function yukle() {
  if (!sb) {
    istAlan.replaceChildren();
    grafikAlan.replaceChildren(durumKutusu({
      tur: 'hata',
      baslik: 'Sunucuya bağlanılamadı',
      metin: 'Supabase yapılandırması okunamadı. assets/js/config.js dosyasını kontrol edin.'
    }));
    return;
  }

  /* Sayımlar tek tek değil paralel çekilir. head+count ile satır gövdesi
     indirilmez; yalnızca Content-Range başlığındaki sayı okunur. */
  const say = (tablo, filtre) => {
    let s = sb.from(tablo).select('*', { count: 'exact', head: true });
    if (filtre) s = filtre(s);
    return s;
  };

  const otuzGunOnce = new Date(Date.now() - 30 * 864e5).toISOString();

  const [
    stantTop, stantYeni, ziyTop, mesajOkunmamis,
    katTop, stantSon, mesajSon, stantSeri
  ] = await Promise.all([
    say('stand_applications'),
    say('stand_applications', (s) => s.eq('status', 'new')),
    say('visitor_registrations'),
    say('contact_messages', (s) => s.eq('is_read', false)),
    say('exhibitors', (s) => s.eq('published', true)),
    sb.from('stand_applications')
      .select('id, application_no, company, status, created_at')
      .order('created_at', { ascending: false }).limit(5),
    sb.from('contact_messages')
      .select('id, name, subject, is_read, created_at')
      .order('created_at', { ascending: false }).limit(5),
    sb.from('stand_applications')
      .select('created_at').gte('created_at', otuzGunOnce).limit(2000)
  ]);

  const hata = [stantTop, ziyTop, katTop].find((r) => r.error);
  if (hata) {
    istAlan.replaceChildren();
    grafikAlan.replaceChildren(durumKutusu({
      tur: 'hata',
      baslik: 'Veriler okunamadı',
      metin: hata.error.message
    }));
    return;
  }

  /* --- Özet kartları --- */
  istAlan.replaceChildren(
    istKart('Firma kaydı', stantTop.count, `${stantYeni.count ?? 0} tanesi yeni`),
    istKart('Ziyaretçi kaydı', ziyTop.count),
    istKart('Okunmamış mesaj', mesajOkunmamis.count),
    istKart('Yayındaki katılımcı', katTop.count)
  );

  sayacGuncelle('stant', stantYeni.count ?? 0);
  sayacGuncelle('mesaj', mesajOkunmamis.count ?? 0);

  /* --- 30 günlük grafik --- */
  grafikAlan.replaceChildren(
    el('div', { class: 'panel__bas' },
      el('h2', { class: 'panel__baslik' }, 'Son 30 günde firma kayıtları')),
    el('div', { class: 'panel__govde' },
      stantSeri.error
        ? durumKutusu({ tur: 'hata', baslik: 'Grafik yüklenemedi', metin: stantSeri.error.message })
        : sutunGrafik(gunlukSay(stantSeri.data || [], 30)))
  );

  /* --- Son başvurular ve mesajlar --- */
  altIzgara.replaceChildren(
    sonBasvurular(stantSon),
    sonMesajlar(mesajSon)
  );
}

/* --- Parçalar ------------------------------------------------------------- */

function istKart(etiket, deger, alt) {
  return el('div', { class: 'ist-kart' },
    el('p', { class: 'ist-kart__etiket' }, etiket),
    el('p', { class: 'ist-kart__deger' }, deger === null || deger === undefined ? '—' : String(deger)),
    alt ? el('p', { class: 'ist-kart__alt' }, alt) : null
  );
}

/** ISO tarih listesini son N günün günlük sayımına çevirir. */
function gunlukSay(satirlar, gun) {
  const kova = new Map();
  const bugun = new Date(); bugun.setHours(0, 0, 0, 0);

  for (let i = gun - 1; i >= 0; i--) {
    const d = new Date(bugun.getTime() - i * 864e5);
    kova.set(d.toISOString().slice(0, 10), 0);
  }
  for (const s of satirlar) {
    const k = new Date(s.created_at).toISOString().slice(0, 10);
    if (kova.has(k)) kova.set(k, kova.get(k) + 1);
  }
  return [...kova.entries()].map(([tarih, sayi]) => ({ tarih, sayi }));
}

/** Elle üretilen SVG sütun grafik — kütüphane yok. */
function sutunGrafik(veri) {
  const G = 640, Y = 160, PAD = 24;
  const enBuyuk = Math.max(1, ...veri.map((v) => v.sayi));
  const genislik = (G - PAD * 2) / veri.length;
  const ns = 'http://www.w3.org/2000/svg';

  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${G} ${Y + 28}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label',
    `Son ${veri.length} günde toplam ${veri.reduce((t, v) => t + v.sayi, 0)} başvuru`);
  svg.style.display = 'block';
  svg.style.overflow = 'visible';

  /* Yatay kılavuz çizgileri */
  for (let i = 0; i <= 2; i++) {
    const y = PAD + (Y - PAD * 2) * (i / 2);
    const c = document.createElementNS(ns, 'line');
    c.setAttribute('x1', PAD); c.setAttribute('x2', G - PAD);
    c.setAttribute('y1', y);   c.setAttribute('y2', y);
    // CSS değişkeni sunum özniteliğinde güvenilir çözülmez; inline style kullanılır
    c.style.stroke = 'var(--color-border)';
    c.setAttribute('stroke-width', '1');
    svg.append(c);
  }

  veri.forEach((v, i) => {
    const h = v.sayi === 0 ? 2 : Math.max(3, (Y - PAD * 2) * (v.sayi / enBuyuk));
    const x = PAD + i * genislik;
    const r = document.createElementNS(ns, 'rect');
    r.setAttribute('x', x + genislik * 0.18);
    r.setAttribute('y', Y - PAD - h);
    r.setAttribute('width', genislik * 0.64);
    r.setAttribute('height', h);
    r.setAttribute('rx', '2');
    r.style.fill = v.sayi === 0 ? 'var(--color-border-mid)' : 'var(--color-primary)';
    const t = document.createElementNS(ns, 'title');
    t.textContent = `${v.tarih}: ${v.sayi} başvuru`;
    r.append(t);
    svg.append(r);
  });

  /* İlk ve son günün etiketi */
  const etiket = (metin, x, anchor) => {
    const t = document.createElementNS(ns, 'text');
    t.setAttribute('x', x); t.setAttribute('y', Y + 6);
    t.setAttribute('font-size', '11');
    t.style.fill = 'var(--color-muted)';
    t.setAttribute('text-anchor', anchor);
    t.textContent = metin;
    return t;
  };
  const gun = (iso) => iso.slice(8, 10) + '.' + iso.slice(5, 7);
  if (veri.length) {
    svg.append(etiket(gun(veri[0].tarih), PAD, 'start'));
    svg.append(etiket(gun(veri[veri.length - 1].tarih), G - PAD, 'end'));
  }

  const toplam = veri.reduce((t, v) => t + v.sayi, 0);
  return el('div', null,
    svg,
    el('p', { class: 'ist-kart__alt', style: 'margin-top:var(--space-3)' },
      toplam === 0
        ? 'Son 30 günde başvuru yok.'
        : `Son 30 günde toplam ${toplam} başvuru.`)
  );
}

function sonBasvurular({ data, error }) {
  const govde = error
    ? durumKutusu({ tur: 'hata', baslik: 'Okunamadı', metin: error.message })
    : !data || !data.length
      ? durumKutusu({ baslik: 'Henüz başvuru yok',
                      metin: 'Firma kayıtları burada görünecek.' })
      : el('div', { class: 'tablo-sarmal' },
          el('table', { class: 'tablo' },
            el('thead', null, el('tr', null,
              el('th', null, 'No'), el('th', null, 'Firma'),
              el('th', null, 'Durum'), el('th', null, 'Tarih'))),
            el('tbody', null, data.map((r) => el('tr', null,
              el('td', { class: 'tablo__no' }, r.application_no || '—'),
              el('td', null, r.company),
              el('td', null, durumRozeti(r.status)),
              el('td', { class: 'tablo__tarih' }, gorece(r.created_at))
            )))
          ));

  return el('section', { class: 'panel' },
    el('div', { class: 'panel__bas' },
      el('h2', { class: 'panel__baslik' }, 'Son firma kayıtları'),
      el('a', { class: 'btn btn--ghost btn--sm', href: 'stant-basvurulari.html',
                style: 'margin-left:auto' }, 'Tümü')),
    el('div', { class: 'panel__govde panel__govde--sikisik' }, govde)
  );
}

function sonMesajlar({ data, error }) {
  const govde = error
    ? durumKutusu({ tur: 'hata', baslik: 'Okunamadı', metin: error.message })
    : !data || !data.length
      ? durumKutusu({ baslik: 'Henüz mesaj yok',
                      metin: 'İletişim formundan gelen mesajlar burada görünecek.' })
      : el('div', { class: 'tablo-sarmal' },
          el('table', { class: 'tablo' },
            el('thead', null, el('tr', null,
              el('th', null, 'Gönderen'), el('th', null, 'Konu'), el('th', null, 'Tarih'))),
            el('tbody', null, data.map((r) => el('tr', null,
              el('td', null,
                r.is_read ? null : el('span', { class: 'durum durum--new',
                                                style: 'margin-right:6px' }, 'Yeni'),
                r.name),
              el('td', null, r.subject || '—'),
              el('td', { class: 'tablo__tarih' }, gorece(r.created_at))
            )))
          ));

  return el('section', { class: 'panel' },
    el('div', { class: 'panel__bas' },
      el('h2', { class: 'panel__baslik' }, 'Son mesajlar'),
      el('a', { class: 'btn btn--ghost btn--sm', href: 'mesajlar.html',
                style: 'margin-left:auto' }, 'Tümü')),
    el('div', { class: 'panel__govde panel__govde--sikisik' }, govde)
  );
}
