/* ==========================================================================
   Katılımcı Firmalar sayfası — arama, sektör filtresi, sıralama.

   1) Sayfada STATİK kartlar var (tools/build-exhibitors.mjs üretir): JS
      çalışmazsa ya da Supabase'e ulaşılamazsa firmalar yine görünür.
   2) Supabase'e ulaşılırsa kartlar veritabanından YENİDEN çizilir. Böylece
      yönetim panelinde yapılan değişiklikler (yeni firma, logo, stand no,
      sektör, yayından kaldırma) siteye anında yansır.

   XSS: veritabanından gelen hiçbir değer innerHTML ile basılmaz.
   Durum URL'de tutulur (?q=…&sektor=…&sira=…).
   ========================================================================== */
import { katilimcilar, sektorler } from './data.js';

const form = document.getElementById('ex-toolbar');
const grid = document.getElementById('ex-grid');

if (form && grid) baslat();

function baslat() {
  const DIL = document.documentElement.lang === 'en' ? 'en' : 'tr';
  const KOK = document.documentElement.dataset.root || '';
  const search = document.getElementById('ex-search');
  const sector = document.getElementById('ex-sector');
  const sort = document.getElementById('ex-sort');
  const count = document.getElementById('ex-count');
  const empty = document.getElementById('ex-empty');
  const reset = document.getElementById('ex-reset');
  const intro = document.getElementById('ex-intro');

  const LABEL = DIL === 'en' ? 'companies' : 'firma';
  let cards = Array.from(grid.querySelectorAll('[data-ex]'));

  /* Türkçe karakterleri ASCII'ye indirger (build script'indeki fold ile aynı) */
  const fold = (s) => String(s || '').toLowerCase()
    .replace(/ı/g, 'i').replace(/İ/g, 'i').replace(/i̇/g, 'i')
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ö/g, 'o').replace(/ç/g, 'c')
    .normalize('NFD').replace(/[̀-ͯ]/g, '');

  const standKey = (s) => {
    const m = String(s || '').match(/^([A-Z])(\d*)-?(\d*)/i);
    if (!m) return String(s || 'ZZZ');
    return `${m[1].toUpperCase()} ${String(m[2] || '0').padStart(3, '0')} ${String(m[3] || '0').padStart(3, '0')}`;
  };

  /* --- Sıralama --------------------------------------------------------- */
  function orderBy(mode) {
    const coll = new Intl.Collator(DIL === 'en' ? 'en' : 'tr');
    const sirali = cards.slice().sort((a, b) => {
      if (mode === 'stand') return a.dataset.stand < b.dataset.stand ? -1 : a.dataset.stand > b.dataset.stand ? 1 : 0;
      if (mode === 'sector') {
        const c = coll.compare(a.dataset.sectorName || '', b.dataset.sectorName || '');
        if (c) return c;
      }
      return coll.compare(a.querySelector('.card__title').textContent, b.querySelector('.card__title').textContent);
    });
    const frag = document.createDocumentFragment();
    sirali.forEach((c) => frag.appendChild(c));
    grid.appendChild(frag);
    if (intro && intro.dataset[mode]) intro.textContent = intro.dataset[mode];
  }

  /* --- Filtre ----------------------------------------------------------- */
  function apply(yaz) {
    const q = fold(search.value.trim());
    const sec = sector.value;
    let gorunen = 0;
    for (const c of cards) {
      const ok = (!q || (c.dataset.search || '').includes(q)) && (!sec || c.dataset.sector === sec);
      c.hidden = !ok;
      if (ok) gorunen++;
    }
    empty.hidden = gorunen !== 0;
    grid.hidden = gorunen === 0;
    count.textContent = gorunen === cards.length
      ? `${cards.length} ${LABEL}`
      : `${gorunen} / ${cards.length} ${LABEL}`;
    if (yaz !== false) urlYaz();
  }

  function urlYaz() {
    const p = new URLSearchParams();
    if (search.value.trim()) p.set('q', search.value.trim());
    if (sector.value) p.set('sektor', sector.value);
    if (sort.value && sort.value !== 'name') p.set('sira', sort.value);
    const qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  function urlOku() {
    const p = new URLSearchParams(location.search);
    if (p.get('q')) search.value = p.get('q');
    if (p.get('sektor')) sector.value = p.get('sektor');
    if (p.get('sira') && sort.querySelector(`option[value="${CSS.escape(p.get('sira'))}"]`)) sort.value = p.get('sira');
  }

  /* --- Olaylar ---------------------------------------------------------- */
  let zaman = null;
  search.addEventListener('input', () => { clearTimeout(zaman); zaman = setTimeout(() => apply(), 120); });
  sector.addEventListener('change', () => apply());
  sort.addEventListener('change', () => { orderBy(sort.value); apply(); });
  form.addEventListener('submit', (e) => { e.preventDefault(); apply(); });
  reset.addEventListener('click', () => {
    search.value = ''; sector.value = ''; apply(); search.focus();
  });

  urlOku();
  orderBy(sort.value || 'name');
  apply(false);

  /* --- Supabase: kartları veritabanından yeniden çiz --------------------- */
  supabaseIleCiz().catch((e) => console.warn('[GE] Katılımcılar Supabase\'den okunamadı:', e && e.message));

  async function supabaseIleCiz() {
    const [k, s] = await Promise.all([katilimcilar(), sektorler()]);
    if (k.kaynak !== 'supabase' || !Array.isArray(k.veri) || !k.veri.length) return;

    const sekAd = {};
    for (const x of (s.veri || [])) sekAd[x.id] = DIL === 'en' ? (x.name_en || x.name_tr) : x.name_tr;

    const yeni = k.veri.map((ex, i) => kart(ex, sekAd[ex.sector_id] || (DIL === 'en' ? 'Other' : 'Diğer'), i));
    grid.replaceChildren(...yeni);
    cards = yeni;

    /* Sektör seçenekleri — yalnızca kullanılanlar, sayılarıyla */
    const sayi = {};
    for (const ex of k.veri) sayi[ex.sector_id] = (sayi[ex.sector_id] || 0) + 1;
    const secili = sector.value;
    const ilk = sector.options[0];
    const secenekler = (s.veri || []).filter((x) => sayi[x.id]).map((x) => {
      const o = document.createElement('option');
      o.value = x.id;
      o.textContent = `${sekAd[x.id]} (${sayi[x.id]})`;
      return o;
    });
    sector.replaceChildren(ilk, ...secenekler);
    sector.value = secili;

    orderBy(sort.value || 'name');
    apply(false);
  }

  function logoAdresi(yol) {
    if (!yol) return '';
    if (/^https?:\/\//i.test(yol)) return yol;
    if (yol.startsWith('assets/')) return KOK + yol;
    const c = window.GE_CONFIG || {};
    return c.SUPABASE_URL ? `${c.SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/public-media/${yol}` : '';
  }

  function monogram(ad) {
    const atla = new Set(['ve', 'ile', 'the', 'of']);
    const w = String(ad).replace(/\(.*?\)/g, ' ').split(/[\s\-–]+/)
      .filter((x) => x && !atla.has(x.toLowerCase()) && /[\p{L}\p{N}]/u.test(x));
    const up = (t) => t.replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase();
    if (!w.length) return '?';
    return w.length === 1 ? up(w[0].slice(0, 2)) : up(w[0][0] + w[1][0]);
  }

  function kart(ex, sektorAdi, i) {
    const stands = Array.isArray(ex.stands) ? ex.stands : String(ex.stands || '').split(/[,;]\s*/).filter(Boolean);
    const a = document.createElement('article');
    a.className = 'card exhibitor';
    a.setAttribute('data-ex', '');
    a.dataset.search = fold(`${ex.name} ${sektorAdi} ${stands.join(' ')}`);
    a.dataset.sector = ex.sector_id || '';
    a.dataset.sectorName = fold(sektorAdi);
    a.dataset.stand = standKey(stands[0]);

    const url = logoAdresi(ex.logo_url);
    if (url) {
      const kutu = document.createElement('div');
      kutu.className = 'exhibitor__logo';
      const img = document.createElement('img');
      img.src = url; img.alt = ex.name; img.loading = 'lazy'; img.decoding = 'async';
      kutu.appendChild(img);
      a.appendChild(kutu);
    } else {
      const m = document.createElement('div');
      m.className = 'monogram' + (i % 2 ? '' : ' monogram--navy');
      m.setAttribute('aria-hidden', 'true');
      m.textContent = monogram(ex.name);
      a.appendChild(m);
    }

    const govde = document.createElement('div');
    govde.className = 'card__body';
    const h = document.createElement('h3'); h.className = 'card__title'; h.textContent = ex.name;
    const p = document.createElement('p'); p.className = 'card__text'; p.textContent = sektorAdi;
    const st = document.createElement('p'); st.className = 'exhibitor__stand';
    st.append('Stand No: ');
    const b = document.createElement('strong'); b.textContent = stands.join(', ') || '—';
    st.appendChild(b);
    govde.append(h, p, st);
    a.appendChild(govde);
    return a;
  }
}
