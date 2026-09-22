/* ==========================================================================
   Yönetim paneli — genel liste sayfası
   assets/js/admin/liste.js

   Ziyaretçi kayıtları, mesajlar, katılımcılar ve etkinlik günlüğü aynı iskeleti
   paylaşıyor: araç çubuğu, sunucu taraflı sayfalama, arama, süzgeçler, sıralama,
   satıra tıklayınca açılan çekmece, CSV. Her sayfaya ayrı ayrı kopyalamak yerine
   burada bir kez kuruyoruz; sayfalar yalnızca yapılandırma veriyor.

   Sayfalama SUNUCU tarafında (.range): tabloda kaç satır olursa olsun yalnızca
   görünen sayfa indirilir.

   XSS: her hücre textContent veya DOM düğümü. innerHTML yok.
   ========================================================================== */

import { getClient } from '../supabase-client.js';
import {
  el, ikon, sayacGuncelle, durumKutusu, iskelet, toast, csvIndir, bugun
} from './ui.js';

const SAYFA_BOYU = 25;

/**
 * @param {HTMLElement} kok           içerik alanı (kabukKur'un döndürdüğü)
 * @param {object} ayar
 * @param {string} ayar.baslik
 * @param {string} [ayar.altBaslik]
 * @param {string} ayar.tablo         Supabase tablo adı
 * @param {string} ayar.secim         select() sütun listesi
 * @param {string[]} [ayar.aramaAlanlari] ilike ile aranacak sütunlar
 * @param {string} [ayar.varsayilanSirala='created_at']
 * @param {boolean} [ayar.varsayilanArtan=false]
 * @param {Array}  ayar.sutunlar      [{baslik, sirala?, render(r), sinif?}]
 * @param {Array}  [ayar.suzgecler]   [{ad, etiket, secenekler, uygula(q,deger)}]
 * @param {object} [ayar.csv]         {dosya, basliklar, satir(r)}
 * @param {Function} [ayar.cekmece]   (r, arac) => DOM; arac={kapat, yenile}
 * @param {string} [ayar.bosBaslik]
 * @param {string} [ayar.bosMetin]
 * @param {Function} [ayar.sayac]     (sb) => Promise<{ad, deger}> yan menü rozeti
 * @param {Function} [ayar.satirSinifi] (r) => string|null
 */
export async function listeSayfasi(kok, ayar) {
  const sb = await getClient();

  const durum = {
    q: '',
    suzgec: {},
    sirala: ayar.varsayilanSirala || 'created_at',
    artan: !!ayar.varsayilanArtan,
    sayfa: 0,
    toplam: 0
  };

  /* --- Araç çubuğu --- */
  const araKutu = ayar.aramaAlanlari
    ? el('input', {
        class: 'form__control', type: 'search',
        placeholder: ayar.aramaIpucu || 'Ara…', 'aria-label': 'Listede ara'
      })
    : null;

  const suzgecKutulari = (ayar.suzgecler || []).map((s) => {
    const sec = el('select', {
      class: 'form__control arac-cubugu__suzgec', 'aria-label': s.etiket
    },
      el('option', { value: '' }, s.etiket),
      s.secenekler.map((o) => el('option', { value: o.deger }, o.etiket))
    );
    sec.addEventListener('change', () => {
      durum.suzgec[s.ad] = sec.value;
      durum.sayfa = 0;
      urlYaz(); yukle();
    });
    return { tanim: s, eleman: sec };
  });

  const csvBtn = ayar.csv
    ? el('button', { class: 'btn btn--secondary btn--sm', type: 'button' },
        ikon('indir', ''), el('span', null, 'CSV indir'))
    : null;

  if (araKutu) {
    let zaman;
    araKutu.addEventListener('input', () => {
      clearTimeout(zaman);
      zaman = setTimeout(() => {
        durum.q = araKutu.value.trim();
        durum.sayfa = 0;
        urlYaz(); yukle();
      }, 300);
    });
  }
  if (csvBtn) csvBtn.addEventListener('click', csvAktar);

  kok.append(
    el('div', { class: 'sayfa-bas' },
      el('div', { class: 'sayfa-bas__metin' },
        el('h1', null, ayar.baslik),
        ayar.altBaslik ? el('p', { class: 'sayfa-bas__alt' }, ayar.altBaslik) : null),
      ayar.sayfaEylemi ? el('div', { class: 'sayfa-bas__eylem' }, ayar.sayfaEylemi) : null)
  );

  if (araKutu || suzgecKutulari.length || csvBtn) {
    kok.append(el('div', { class: 'arac-cubugu' },
      araKutu ? el('div', { class: 'arac-cubugu__ara' }, araKutu) : null,
      suzgecKutulari.map((s) => s.eleman),
      csvBtn ? el('div', { class: 'arac-cubugu__sag' }, csvBtn) : null
    ));
  }

  const panel = el('section', { class: 'panel' });
  kok.append(panel);

  /* --- URL durumu --- */
  function urlOku() {
    const p = new URLSearchParams(location.search);
    durum.q = p.get('q') || '';
    durum.sirala = p.get('sirala') || (ayar.varsayilanSirala || 'created_at');
    durum.artan = p.get('yon') === 'asc';
    durum.sayfa = Math.max(0, parseInt(p.get('s') || '0', 10) || 0);
    for (const s of suzgecKutulari) {
      durum.suzgec[s.tanim.ad] = p.get(s.tanim.ad) || '';
      s.eleman.value = durum.suzgec[s.tanim.ad];
    }
    if (araKutu) araKutu.value = durum.q;
  }
  function urlYaz() {
    const p = new URLSearchParams();
    if (durum.q) p.set('q', durum.q);
    for (const [k, v] of Object.entries(durum.suzgec)) if (v) p.set(k, v);
    if (durum.sirala !== (ayar.varsayilanSirala || 'created_at')) p.set('sirala', durum.sirala);
    if (durum.artan) p.set('yon', 'asc');
    if (durum.sayfa) p.set('s', String(durum.sayfa));
    history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : ''));
  }
  window.addEventListener('popstate', () => { urlOku(); yukle(); });

  /* --- Sorgu --- */
  function sorgu() {
    let s = sb.from(ayar.tablo).select(ayar.secim, { count: 'exact' });

    for (const sz of suzgecKutulari) {
      const v = durum.suzgec[sz.tanim.ad];
      if (v) s = sz.tanim.uygula(s, v);
    }

    if (durum.q && ayar.aramaAlanlari) {
      const q = durum.q.replace(/[%,()]/g, ' ').trim();
      if (q) {
        /* text[] sütunlarda ilike çalışmaz (sorgu hata verir, arama "çalışmıyor"
           gibi görünür). Dizi sütunları için tam eleman eşleşmesi (cs) kullanılır. */
        const kosul = ayar.aramaAlanlari.map((a) => `${a}.ilike.%${q}%`);
        for (const d of (ayar.aramaDiziAlanlari || [])) {
          const t = q.replace(/[{}"\s]/g, '').toUpperCase();
          if (t) kosul.push(`${d}.cs.{${t}}`);
        }
        s = s.or(kosul.join(','));
      }
    }
    return s;
  }

  /* --- Yükleme --- */
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
      .order(durum.sirala, { ascending: durum.artan })
      .range(bas, bas + SAYFA_BOYU - 1);

    if (error) {
      panel.replaceChildren(durumKutusu({
        tur: 'hata', baslik: 'Kayıtlar okunamadı', metin: error.message
      }));
      return;
    }

    durum.toplam = count ?? 0;

    if (ayar.sayac) {
      ayar.sayac(sb).then((r) => { if (r) sayacGuncelle(r.ad, r.deger); });
    }

    if (!data.length) {
      const suzuluyor = durum.q || Object.values(durum.suzgec).some(Boolean);
      panel.replaceChildren(durumKutusu({
        baslik: suzuluyor ? 'Eşleşen kayıt yok' : (ayar.bosBaslik || 'Henüz kayıt yok'),
        metin: suzuluyor ? 'Arama veya süzgeci değiştirip tekrar deneyin.' : ayar.bosMetin,
        eylem: suzuluyor
          ? el('button', {
              class: 'btn btn--ghost btn--sm', type: 'button',
              onclick: () => {
                durum.q = ''; durum.suzgec = {}; durum.sayfa = 0;
                if (araKutu) araKutu.value = '';
                for (const s of suzgecKutulari) s.eleman.value = '';
                urlYaz(); yukle();
              }
            }, 'Süzgeci temizle')
          : null
      }));
      return;
    }

    panel.replaceChildren(tabloYap(data), sayfalamaYap());
  }

  function baslikHucre(s) {
    if (!s.sirala) return el('th', { class: s.sinif }, s.baslik);
    const aktif = durum.sirala === s.sirala;
    const btn = el('button', {
      class: 'tablo__sirala', type: 'button',
      'aria-sort': aktif ? (durum.artan ? 'ascending' : 'descending') : 'none'
    }, el('span', null, s.baslik), el('span', { class: 'tablo__ok', 'aria-hidden': 'true' }, '▼'));
    btn.addEventListener('click', () => {
      if (durum.sirala === s.sirala) durum.artan = !durum.artan;
      else { durum.sirala = s.sirala; durum.artan = false; }
      durum.sayfa = 0;
      urlYaz(); yukle();
    });
    return el('th', { class: s.sinif }, btn);
  }

  function tabloYap(satirlar) {
    const govde = el('tbody');

    for (const r of satirlar) {
      const ek = ayar.satirSinifi ? ayar.satirSinifi(r) : null;
      const tr = el('tr', { class: ek },
        ayar.sutunlar.map((s) => el('td', { class: s.sinif }, s.render(r))));

      if (ayar.cekmece) {
        tr.tabIndex = 0;
        tr.setAttribute('role', 'button');
        tr.style.cursor = 'pointer';
        tr.addEventListener('click', () => cekmeceAc(r));
        tr.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cekmeceAc(r); }
        });
      }
      govde.append(tr);
    }

    return el('div', { class: 'tablo-sarmal' },
      el('table', { class: 'tablo' },
        el('thead', null, el('tr', null, ayar.sutunlar.map(baslikHucre))),
        govde));
  }

  function sayfalamaYap() {
    const sonSayfa = Math.max(0, Math.ceil(durum.toplam / SAYFA_BOYU) - 1);
    const bas = durum.sayfa * SAYFA_BOYU + 1;
    const son = Math.min(durum.toplam, (durum.sayfa + 1) * SAYFA_BOYU);
    const git = (n) => { durum.sayfa = n; urlYaz(); yukle(); window.scrollTo({ top: 0 }); };

    return el('div', { class: 'sayfalama' },
      el('span', { class: 'sayfalama__bilgi' },
        `${durum.toplam} kayıttan ${bas}–${son} arası`),
      el('button', { class: 'btn btn--ghost btn--sm', type: 'button',
        disabled: durum.sayfa === 0, onclick: () => git(durum.sayfa - 1) }, '← Önceki'),
      el('span', { style: 'font-size:.875rem;color:var(--color-muted)' },
        `${durum.sayfa + 1} / ${sonSayfa + 1}`),
      el('button', { class: 'btn btn--ghost btn--sm', type: 'button',
        disabled: durum.sayfa >= sonSayfa, onclick: () => git(durum.sayfa + 1) }, 'Sonraki →')
    );
  }

  /* --- Çekmece --- */
  let acik = null;

  function cekmeceKapat() { if (acik) { acik(); acik = null; } }

  function cekmeceAc(r) {
    cekmeceKapat();
    const oncekiOdak = document.activeElement;

    const kapatBtn = el('button', {
      class: 'toast__kapat', type: 'button', 'aria-label': 'Kapat', style: 'margin-left:auto'
    }, ikon('kapat', ''));

    const arac = { kapat: cekmeceKapat, yenile: yukle };
    const { baslik, govde, eylemler } = ayar.cekmece(r, arac);

    const cekmece = el('aside', {
      class: 'cekmece', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'cek-baslik'
    },
      el('div', { class: 'cekmece__bas' },
        el('h2', { class: 'cekmece__baslik', id: 'cek-baslik' }, baslik), kapatBtn),
      el('div', { class: 'cekmece__govde' }, govde),
      eylemler ? el('div', { class: 'cekmece__alt' }, eylemler) : null
    );

    const ortu = el('div', { class: 'cekmece-ortu' });
    ortu.addEventListener('click', cekmeceKapat);
    kapatBtn.addEventListener('click', cekmeceKapat);

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

    document.body.append(ortu, cekmece);
    requestAnimationFrame(() => {
      ortu.classList.add('is-acik');
      cekmece.classList.add('is-acik');
    });

    acik = () => {
      document.removeEventListener('keydown', tus, true);
      ortu.remove(); cekmece.remove();
      if (oncekiOdak && oncekiOdak.focus) oncekiOdak.focus();
    };

    const ilkOdak = cekmece.querySelector('select, input, textarea, button');
    if (ilkOdak) ilkOdak.focus();
  }

  /* --- CSV --- */
  async function csvAktar() {
    csvBtn.disabled = true;
    csvBtn.classList.add('is-loading');

    /* Görünen sayfa değil, süzgece uyan TÜM satırlar. */
    const { data, error } = await sorgu()
      .order(durum.sirala, { ascending: durum.artan })
      .range(0, 4999);

    csvBtn.disabled = false;
    csvBtn.classList.remove('is-loading');

    if (error) { toast('Dışa aktarılamadı: ' + error.message, 'hata', 8000); return; }
    if (!data.length) { toast('Dışa aktarılacak kayıt yok.', 'uyari'); return; }

    csvIndir(`${ayar.csv.dosya}-${bugun()}.csv`, ayar.csv.basliklar, data.map(ayar.csv.satir));

    if (ayar.csvGunluk) ayar.csvGunluk(data.length);
    toast(`${data.length} kayıt indirildi.`, 'basari');
  }

  urlOku();
  await yukle();

  return { yukle, cekmeceKapat, cekmeceAc, durum };
}

/** Çekmecelerde kullanılan etiket/değer satırı */
export function kunye(etiket, deger) {
  return el('div', { class: 'kunye__satir' },
    el('dt', { class: 'kunye__etiket' }, etiket),
    el('dd', { class: 'kunye__deger' }, deger)
  );
}
