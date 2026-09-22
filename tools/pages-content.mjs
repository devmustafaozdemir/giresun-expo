/**
 * Sayfa meta verileri ve yeni sayfalarin <main> icerigi.
 * build-pages.mjs bu dosyayi okur.
 *
 * Icerik kurallari (brief §2, EK §3):
 *   - Olgular yalnizca docs/KITAPCIK-ICERIK.md'den
 *   - Dogrulanamayan istatistik veya iddia YOK
 *   - "ucretsiz" giris iddiasi YOK (acik soru #18)
 *   - Bos sifat YOK
 * tools/check-content.mjs bunlari makineyle denetler.
 */

export const PAGES = {
  index: {
    tr: { file: 'index.html', nav: 'Ana Sayfa', title: 'Giresun EXPO 2026 — Giresun İş Dünyası İstanbul\'da Buluşuyor',
          desc: 'Giresun EXPO 2026, 8–11 Ekim 2026 tarihlerinde İstanbul Yenikapı\'da düzenleniyor. 86 katılımcı firma, üretim, yatırım, ticaret ve iş birliği tek çatı altında.',
          ogDesc: '8–11 Ekim 2026, İstanbul Yenikapı. 86 katılımcı firma, 5 salon, 4 gün.' },
    en: { file: 'index.html', nav: 'Home', title: 'Giresun EXPO 2026 — Giresun\'s Business Community Meets in Istanbul',
          desc: 'Giresun EXPO 2026 takes place from 8 to 11 October 2026 at Yenikapı, Istanbul. 86 exhibiting companies across production, investment, trade and cooperation.',
          ogDesc: '8–11 October 2026, Yenikapı, Istanbul. 86 companies, 5 halls, 4 days.' },
  },
  about: {
    tr: { file: 'hakkinda.html', nav: 'Hakkında', title: 'Fuar Hakkında — Giresun EXPO 2026',
          desc: 'Giresun EXPO 2026\'nın amacı, vizyonu ve organizatörleri. Giresun Vakfı, Giresun Federasyonu ve ŞEBİNSİAD ortaklığı.' },
    en: { file: 'about.html', nav: 'About', title: 'About the Expo — Giresun EXPO 2026',
          desc: 'The purpose, vision and organisers of Giresun EXPO 2026, held jointly by the Giresun Foundation, the Giresun Federation and ŞEBİNSİAD.' },
  },
  exhibitors: {
    tr: { file: 'katilimcilar.html', nav: 'Katılımcılar', title: 'Katılımcılar — Giresun EXPO 2026',
          desc: 'Giresun EXPO 2026\'da yer alan 86 katılımcı firma. Sektöre ve salona göre filtreleyin, stant numaralarını görün.',
          ogDesc: '86 katılımcı firma, 5 salon, 17 sektör.', scripts: ['katilimcilar.js'] },
    en: { file: 'exhibitors.html', nav: 'Exhibitors', title: 'Exhibitors — Giresun EXPO 2026',
          desc: 'The 86 companies exhibiting at Giresun EXPO 2026. Filter by sector and hall, and find stand numbers.',
          ogDesc: '86 exhibiting companies, 5 halls, 17 sectors.', scripts: ['katilimcilar.js'] },
  },
  visit: {
    tr: { file: 'ziyaret-bilgileri.html', nav: 'Ziyaret Bilgileri', title: 'Ziyaret Bilgileri — Giresun EXPO 2026',
          desc: 'Giresun EXPO 2026 ziyaret saatleri, adres ve ulaşım. Yenikapı\'ya Marmaray, M1A, M1B, M2 metro hatları ve İETT otobüsleriyle ulaşım.' },
    en: { file: 'plan-your-visit.html', nav: 'Plan Your Visit', title: 'Plan Your Visit — Giresun EXPO 2026',
          desc: 'Opening hours, address and travel information for Giresun EXPO 2026. Yenikapı is served by the Marmaray and the M1A, M1B and M2 metro lines.' },
  },
  gallery: {
    tr: { file: 'galeri.html', nav: 'Galeri', title: 'Galeri — Giresun EXPO 2026',
          desc: 'Giresun EXPO 2026 fuar alanı ve Giresun\'dan kareler.', scripts: ['galeri.js'] },
    en: { file: 'gallery.html', nav: 'Gallery', title: 'Gallery — Giresun EXPO 2026',
          desc: 'Images from the Giresun EXPO 2026 venue and from Giresun.', scripts: ['galeri.js'] },
  },
  press: {
    tr: { file: 'basin.html', nav: 'Basın', title: 'Basın — Giresun EXPO 2026',
          desc: 'Giresun EXPO 2026 basın kiti: logo paketi, el kitapçığı ve künye bilgileri.' },
    en: { file: 'press.html', nav: 'Press', title: 'Press — Giresun EXPO 2026',
          desc: 'Giresun EXPO 2026 press kit: logo pack, handbook and event details.' },
  },
  contact: {
    tr: { file: 'iletisim.html', nav: 'İletişim', title: 'İletişim — Giresun EXPO 2026',
          desc: 'Giresun EXPO 2026 organizasyon ekibine ulaşın. Telefon, adres ve iletişim formu.' },
    en: { file: 'contact.html', nav: 'Contact', title: 'Contact — Giresun EXPO 2026',
          desc: 'Get in touch with the Giresun EXPO 2026 team. Phone, address and contact form.' },
  },
  register: {
    tr: { file: 'ziyaretci-kaydi.html', nav: 'Ziyaretçi Ön Kaydı', title: 'Ziyaretçi Ön Kaydı — Giresun EXPO 2026',
          desc: 'Giresun EXPO 2026 için ziyaretçi ön kaydı. Kaydınızı yapın, fuar günü doğrudan stantlara gidin.' },
    en: { file: 'visitor-registration.html', nav: 'Visitor Pre-registration', title: 'Visitor Pre-registration — Giresun EXPO 2026',
          desc: 'Pre-register as a visitor for Giresun EXPO 2026 and head straight to the stands on the day.' },
  },
  stand: {
    tr: { file: 'stant-basvurusu.html', nav: 'Stant Başvurusu', title: 'Stant Başvurusu — Giresun EXPO 2027',
          desc: 'Giresun EXPO 2027 için stant ön başvurusu. Firma bilgilerinizi bırakın, satış ekibimiz sizinle iletişime geçsin.', scripts: ['form-adimlar.js'] },
    en: { file: 'stand-application.html', nav: 'Stand Application', title: 'Stand Application — Giresun EXPO 2027',
          desc: 'Pre-apply for a stand at Giresun EXPO 2027. Leave your company details and our team will get in touch.', scripts: ['form-adimlar.js'] },
  },
  program: {
    tr: { file: 'program.html', nav: 'Program', title: 'Etkinlik Programı — Giresun EXPO 2026',
          desc: 'Giresun EXPO 2026 etkinlik programı. Panel ve oturum programı açıklandığında burada yayımlanacak.' },
    en: { file: 'program.html', nav: 'Programme', title: 'Programme — Giresun EXPO 2026',
          desc: 'The Giresun EXPO 2026 programme. Panels and sessions will be published here once announced.' },
  },
  kvkk: {
    tr: { file: 'kvkk.html', nav: 'KVKK Aydınlatma Metni', title: 'KVKK Aydınlatma Metni — Giresun EXPO 2026',
          desc: 'Giresun EXPO 2026 kişisel verilerin korunması aydınlatma metni.' },
    en: { file: 'data-protection.html', nav: 'Data Protection Notice', title: 'Data Protection Notice — Giresun EXPO 2026',
          desc: 'Personal data protection notice for Giresun EXPO 2026.' },
  },
  cookies: {
    tr: { file: 'cerez-politikasi.html', nav: 'Çerez Politikası', title: 'Çerez Politikası — Giresun EXPO 2026',
          desc: 'Giresun EXPO 2026 sitesinde kullanılan çerezler.' },
    en: { file: 'cookie-policy.html', nav: 'Cookie Policy', title: 'Cookie Policy — Giresun EXPO 2026',
          desc: 'Cookies used on the Giresun EXPO 2026 website.' },
  },
  privacy: {
    tr: { file: 'gizlilik.html', nav: 'Gizlilik', title: 'Gizlilik — Giresun EXPO 2026',
          desc: 'Giresun EXPO 2026 gizlilik açıklaması.' },
    en: { file: 'privacy.html', nav: 'Privacy', title: 'Privacy — Giresun EXPO 2026',
          desc: 'Privacy statement for Giresun EXPO 2026.' },
  },
};

/* ======================================================================== */
/* Yardimci parcalar                                                        */
/* ======================================================================== */

const pageHeader = (lang, title, lead, crumb) => `    <section class="page-header">
      <div class="container">
        <nav aria-label="${lang === 'tr' ? 'Sayfa yolu' : 'Breadcrumb'}">
          <ol class="breadcrumb">
            <li><a href="${lang === 'tr' ? 'index.html' : 'index.html'}">${lang === 'tr' ? 'Ana Sayfa' : 'Home'}</a></li>
            <li aria-hidden="true">›</li>
            <li>${crumb}</li>
          </ol>
        </nav>
        <h1>${title}</h1>
        <p class="lead">${lead}</p>
      </div>
    </section>`;

const legalNotice = (lang) => `        <div class="notice notice--warning">
          <svg class="icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          <p><strong>${lang === 'tr' ? 'Taslak metin.' : 'Draft text.'}</strong> ${lang === 'tr'
    ? 'Bu metin genel geçer bir taslaktır ve yayına alınmadan önce hukuki danışman tarafından gözden geçirilmelidir. Veri sorumlusu, saklama süreleri ve başvuru kanalları organizasyon tarafından kesinleştirilmelidir.'
    : 'This is a general draft and must be reviewed by legal counsel before publication. The data controller, retention periods and contact channels must be finalised by the organisers.'}</p>
        </div>`;

const icon = (path) => `<svg class="icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
const I = {
  phone: icon('<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>'),
  pin: icon('<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>'),
  clock: icon('<path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/>'),
  download: icon('<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>'),
  calendar: icon('<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>'),
  image: icon('<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>'),
};

/* Galeri: mevcut 6 fotograf */
const PHOTOS = [
  { f: 'fuar-giris', w: 625, h: 370, tr: 'Giresun EXPO bayraklarıyla fuar girişi', en: 'Fair entrance with Giresun EXPO flags' },
  { f: 'fuar-alani-havadan', w: 941, h: 652, tr: 'Yenikapı Etkinlik Alanı, havadan görünüm', en: 'Yenikapı Event Area, aerial view' },
  { f: 'giresun-sahil', w: 1050, h: 509, tr: 'Giresun sahil panoraması', en: 'Panorama of the Giresun coastline' },
  { f: 'ziyaretciler', w: 844, h: 547, tr: 'Fuar alanındaki ziyaretçiler', en: 'Visitors at the fairground' },
  { f: 'uretim-sanayi', w: 783, h: 457, tr: 'Robotik üretim hattı', en: 'Robotic production line' },
  { f: 'yatirim-insaat', w: 428, h: 673, tr: 'Vinç ve inşaat alanı', en: 'Crane and construction site' },
];

const galleryItems = (lang, r) => PHOTOS.map((p, i) => `          <figure class="gallery__item">
            <button class="gallery__btn" type="button" data-lightbox="${i}"
                    data-full="${r}assets/img/photos/${p.f}.jpg" data-alt="${p[lang]}">
              <picture>
                <source srcset="${r}assets/img/photos/${p.f}.webp" type="image/webp">
                <img src="${r}assets/img/photos/${p.f}.jpg" alt="${p[lang]}" width="${p.w}" height="${p.h}" loading="lazy" decoding="async">
              </picture>
              <span class="visually-hidden">${lang === 'tr' ? 'Büyüt' : 'Enlarge'}</span>
            </button>
          </figure>`).join('\n');

/* ======================================================================== */
/* MAIN icerikleri                                                          */
/* ======================================================================== */

export const MAIN = {};

/* ---------- Ana sayfa (EN) ----------------------------------------------
   TR ana sayfası elle yazıldı ve burada tanımlı DEĞİL; build-pages.mjs onun
   yalnızca kabuğunu tazeler. EN karşılığı burada üretilir.
   ------------------------------------------------------------------------ */
MAIN['index:en'] = `    <section class="hero">
      <div class="hero__pattern" style="background-image:url('../assets/img/brand/desen-halka.svg')" aria-hidden="true"></div>
      <div class="container">
        <div class="hero__inner">
          <p class="hero__logo">
            <img src="../assets/img/brand/giresun-expo-logo.png" alt="Giresun EXPO 2026, 8–11 October 2026" width="1207" height="703">
          </p>
          <h1>Giresun's Business Community Meets in Istanbul</h1>
          <p class="hero__slogan">Cooperation for Giresun, Strength for Türkiye</p>

          <div class="hero__meta">
            <span class="hero__meta-item">${I.calendar} 8–11 October 2026</span>
            <span class="hero__meta-item">${I.pin} Yenikapı Event Area, Istanbul</span>
          </div>

          <div class="hero__actions">
            <a class="btn btn--primary btn--lg" href="plan-your-visit.html">Plan Your Visit</a>
            <a class="btn btn--secondary btn--lg" href="exhibitors.html">Explore Exhibitors</a>
          </div>
        </div>
      </div>
    </section>

    <section class="countdown" id="countdown"
             data-start="2026-10-08T10:00:00+03:00"
             data-end="2026-10-11T18:00:00+03:00"
             data-text-before="Time until the fair"
             data-text-during="The fair is open — 8–11 October 2026, Yenikapı"
             data-text-after="Thank you for Giresun EXPO 2026. See you in 2027."
             data-label-gun="Days" data-label-saat="Hours" data-label-dakika="Minutes" data-label-saniye="Seconds"
             aria-label="Time until the fair">
      <div class="container countdown__inner" data-countdown-body>
        <p class="countdown__status">8–11 October 2026 · Yenikapı Event Area, Istanbul</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head section-head--center reveal">
          <p class="eyebrow">Giresun EXPO</p>
          <h2 class="section-title">Built on four pillars</h2>
          <p class="section-subtitle">The fair brings Giresun's economic strength together under four themes.</p>
        </div>

        <div class="grid grid--4 reveal">
          <div class="pillar">
            <span class="pillar__icon">${icon('<path d="M12 16h.01"/><path d="M16 16h.01"/><path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><path d="M8 16h.01"/>')}</span>
            <h3 class="pillar__title">Production</h3>
            <p class="pillar__text">Giresun's experience in industry, agriculture and food production.</p>
          </div>
          <div class="pillar">
            <span class="pillar__icon">${icon('<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>')}</span>
            <h3 class="pillar__title">Investment</h3>
            <p class="pillar__text">Making new investment opportunities visible and connecting them with investors.</p>
          </div>
          <div class="pillar">
            <span class="pillar__icon">${icon('<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10"/>')}</span>
            <h3 class="pillar__title">Trade</h3>
            <p class="pillar__text">Building new trade networks and supporting exports.</p>
          </div>
          <div class="pillar">
            <span class="pillar__icon">${icon('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>')}</span>
            <h3 class="pillar__title">Cooperation</h3>
            <p class="pillar__text">Institutions acting together towards shared goals.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="split">
          <div class="reveal">
            <p class="eyebrow">About the fair</p>
            <h2 class="section-title">What is Giresun EXPO 2026?</h2>
            <p>Giresun EXPO 2026 is a comprehensive business gathering that sets out to present
              Giresun's economic, commercial and entrepreneurial potential on a national and
              international scale.</p>
            <p>By bringing investors, producers and entrepreneurs together, it aims to help new
              partnerships form and to strengthen Giresun's standing as a brand.</p>
            <p class="mt-6"><a class="btn btn--secondary" href="about.html">More about the fair</a></p>
          </div>

          <figure class="media media--4x3 reveal">
            <picture>
              <source srcset="../assets/img/photos/fuar-giris.webp" type="image/webp">
              <img src="../assets/img/photos/fuar-giris.jpg" alt="Fair entrance with Giresun EXPO flags" width="625" height="370" loading="lazy" decoding="async">
            </picture>
          </figure>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <div class="section-head section-head--center reveal">
          <h2 class="section-title">The fair in numbers</h2>
        </div>
        <div class="grid grid--4 reveal">
          <div class="stat"><span class="stat__num">86</span><span class="stat__label">Exhibiting companies</span></div>
          <div class="stat"><span class="stat__num">4</span><span class="stat__label">Days</span></div>
          <div class="stat"><span class="stat__num">3</span><span class="stat__label">Partner institutions</span></div>
          <div class="stat"><span class="stat__num">5</span><span class="stat__label">Halls</span></div>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head section-head--center reveal">
          <p class="eyebrow">Organisation</p>
          <h2 class="section-title">Our partners</h2>
          <p class="section-subtitle">Giresun EXPO is delivered jointly by three civil society
            organisations from Giresun.</p>
        </div>
        <div class="grid grid--3 reveal">
          <div class="partner"><img src="../assets/img/partners/giresun-vakfi.png" alt="Giresun Foundation" width="320" height="120" loading="lazy"></div>
          <div class="partner"><img src="../assets/img/partners/giresun-federasyonu.png" alt="Giresun Federation" width="320" height="120" loading="lazy"></div>
          <div class="partner"><img src="../assets/img/partners/sebinsiad.png" alt="Şebinkarahisar Association of Industrialists and Businesspeople" width="320" height="120" loading="lazy"></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">Exhibitors</p>
          <h2 class="section-title">86 companies, five halls</h2>
          <p class="section-subtitle">Companies from 17 sectors — from food to metal, tourism to
            healthcare — are exhibiting at Yenikapı.</p>
        </div>

        <div class="grid grid--4 reveal">
          <article class="card exhibitor">
            <div class="monogram">İM</div>
            <div class="card__body">
              <h3 class="card__title">İzya İç Mimarlık</h3>
              <p class="card__text">Furniture &amp; Interior Design</p>
              <div class="exhibitor__stands"><span class="hall-badge">A</span><span class="badge">A3-10</span><span class="badge">A3-12</span></div>
            </div>
          </article>
          <article class="card exhibitor">
            <div class="monogram monogram--navy">MS</div>
            <div class="card__body">
              <h3 class="card__title">Meksan Savunma</h3>
              <p class="card__text">Metal, Machinery &amp; Industry</p>
              <div class="exhibitor__stands"><span class="hall-badge">T</span><span class="badge">T1-10</span></div>
            </div>
          </article>
          <article class="card exhibitor">
            <div class="monogram">TO</div>
            <div class="card__body">
              <h3 class="card__title">Titanic Otel</h3>
              <p class="card__text">Tourism &amp; Hospitality</p>
              <div class="exhibitor__stands"><span class="hall-badge">T</span><span class="badge">T2-07</span></div>
            </div>
          </article>
          <article class="card exhibitor">
            <div class="monogram monogram--navy">BS</div>
            <div class="card__body">
              <h3 class="card__title">Bahat Sağlık Grubu</h3>
              <p class="card__text">Healthcare</p>
              <div class="exhibitor__stands"><span class="hall-badge">T</span><span class="badge">T2-13</span></div>
            </div>
          </article>
        </div>

        <p class="mt-8"><a class="btn btn--primary" href="exhibitors.html">See all exhibitors</a></p>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="split">
          <div class="reveal">
            <p class="eyebrow">Visiting</p>
            <h2 class="section-title">Opening hours</h2>
            <p class="section-subtitle mb-6">The fair is open to visitors for four days.</p>

            <div class="scroll-x">
              <table class="hours">
                <caption class="visually-hidden">Daily opening hours for Giresun EXPO 2026</caption>
                <thead><tr><th scope="col">Day</th><th scope="col">Date</th><th scope="col">Hours</th></tr></thead>
                <tbody>
                  <tr><th scope="row">Thursday</th><td>8 October 2026</td><td>10:00 – 19:00</td></tr>
                  <tr><th scope="row">Friday</th><td>9 October 2026</td><td>10:00 – 19:00</td></tr>
                  <tr><th scope="row">Saturday</th><td>10 October 2026</td><td>10:00 – 20:00</td></tr>
                  <tr><th scope="row">Sunday</th><td>11 October 2026</td><td>10:00 – 18:00</td></tr>
                </tbody>
              </table>
            </div>

            <p class="mt-6"><a class="btn btn--secondary" href="plan-your-visit.html">Travel and visit information</a></p>
          </div>

          <figure class="media media--4x3 reveal">
            <picture>
              <source srcset="../assets/img/photos/ziyaretciler.webp" type="image/webp">
              <img src="../assets/img/photos/ziyaretciler.jpg" alt="Visitors at the fairground" width="844" height="547" loading="lazy" decoding="async">
            </picture>
          </figure>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">Location</p>
          <h2 class="section-title">At Yenikapı, in the centre of the city</h2>
          <p class="section-subtitle">Yenikapı is an interchange where the Marmaray line meets
            the M1A, M1B and M2 metro lines.</p>
        </div>

        <div class="split">
          <div class="reveal">
            <address class="venue">
              <strong class="venue__name">Dr. Mimar Kadir Topbaş Arts and Performance Centre</strong>
              <span class="venue__area">Yenikapı Event Area</span>
              <span class="venue__addr">Aksaray Mahallesi, Kennedy Caddesi No: 11/1, Fatih/Istanbul</span>
            </address>

            <ul class="transport-list mt-6">
              <li>${icon('<rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><path d="M8 15h.01"/><path d="M16 15h.01"/>')}<span><span class="line-badge">M1A</span> <span class="line-badge">M1B</span> <span class="line-badge">M2</span> <span class="line-badge line-badge--marmaray">Marmaray</span> — Yenikapı station</span></li>
              <li>${icon('<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>')}<span>IETT bus lines: 30D, 31, 31Y, 50Y, 70FY, 70KY</span></li>
              <li>${icon('<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>')}<span>Parking is available around the event area</span></li>
            </ul>
          </div>

          <figure class="media media--4x3 reveal">
            <picture>
              <source srcset="../assets/img/photos/fuar-alani-havadan.webp" type="image/webp">
              <img src="../assets/img/photos/fuar-alani-havadan.jpg" alt="Aerial view of the Yenikapı Event Area" width="941" height="652" loading="lazy" decoding="async">
            </picture>
          </figure>
        </div>

        <div class="map mt-8 reveal" id="map"
             data-query="Dr. Mimar Kadir Topbaş Gösteri ve Sanat Merkezi, Yenikapı, Fatih, İstanbul"
             data-title="Map showing the location of the venue">
          <div class="map__prompt">
            ${I.pin.replace('class="icon"', 'class="icon icon--xl"')}
            <p class="map__text">The map is loaded from Google Maps. Clicking will open a
              connection to Google.</p>
            <button class="btn btn--secondary" type="button" data-map-load>Load map</button>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">Frequently asked</p>
          <h2 class="section-title">Common questions</h2>
        </div>

        <div class="accordion reveal">
          <div class="accordion__item">
            <h3><button class="accordion__btn" type="button" aria-expanded="false" aria-controls="faq-1">
              When and where is Giresun EXPO 2026 held?
              ${icon('<path d="m6 9 6 6 6-6"/>').replace('class="icon"', 'class="accordion__icon"')}
            </button></h3>
            <div class="accordion__panel" id="faq-1" hidden>
              <p>From 8 to 11 October 2026, at the Dr. Mimar Kadir Topbaş Arts and Performance
                Centre in the Yenikapı Event Area, Istanbul.</p>
            </div>
          </div>
          <div class="accordion__item">
            <h3><button class="accordion__btn" type="button" aria-expanded="false" aria-controls="faq-2">
              What are the opening hours?
              ${icon('<path d="m6 9 6 6 6-6"/>').replace('class="icon"', 'class="accordion__icon"')}
            </button></h3>
            <div class="accordion__panel" id="faq-2" hidden>
              <p>Thursday and Friday 10:00–19:00, Saturday 10:00–20:00, Sunday 10:00–18:00.</p>
            </div>
          </div>
          <div class="accordion__item">
            <h3><button class="accordion__btn" type="button" aria-expanded="false" aria-controls="faq-3">
              How do I get to the venue?
              ${icon('<path d="m6 9 6 6 6-6"/>').replace('class="icon"', 'class="accordion__icon"')}
            </button></h3>
            <div class="accordion__panel" id="faq-3" hidden>
              <p>Yenikapı is an interchange where the Marmaray line meets the M1A, M1B and M2
                metro lines. From the Anatolian side take the M4 to Ayrılık Çeşmesi and change
                to the Marmaray, or board the Marmaray directly at Üsküdar. IETT bus lines 30D,
                31, 31Y, 50Y, 70FY and 70KY serve the area.</p>
            </div>
          </div>
          <div class="accordion__item">
            <h3><button class="accordion__btn" type="button" aria-expanded="false" aria-controls="faq-4">
              Is there parking?
              ${icon('<path d="m6 9 6 6 6-6"/>').replace('class="icon"', 'class="accordion__icon"')}
            </button></h3>
            <div class="accordion__panel" id="faq-4" hidden>
              <p>Yes. Parking is available around the Yenikapı Event Area for visitors arriving
                by car.</p>
            </div>
          </div>
          <div class="accordion__item">
            <h3><button class="accordion__btn" type="button" aria-expanded="false" aria-controls="faq-5">
              Who takes part in the fair?
              ${icon('<path d="m6 9 6 6 6-6"/>').replace('class="icon"', 'class="accordion__icon"')}
            </button></h3>
            <div class="accordion__panel" id="faq-5" hidden>
              <p>86 exhibiting companies have stands across five halls. The fair brings together
                public institutions, the private sector, investors, producers, industrialists,
                entrepreneurs, universities, cooperatives and civil society organisations.</p>
            </div>
          </div>
          <div class="accordion__item">
            <h3><button class="accordion__btn" type="button" aria-expanded="false" aria-controls="faq-6">
              Has the programme been announced?
              ${icon('<path d="m6 9 6 6 6-6"/>').replace('class="icon"', 'class="accordion__icon"')}
            </button></h3>
            <div class="accordion__panel" id="faq-6" hidden>
              <p>The programme of panels, presentations and sessions has not been announced yet.
                It will be published on this site once available.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--brand on-dark">
      <div class="container text-center">
        <h2 class="section-title">See you at Giresun EXPO 2026</h2>
        <p class="lead" style="margin-inline:auto">Plan your visit now and head straight to the
          stands on the day.</p>
        <div class="cluster mt-6" style="justify-content:center">
          <a class="btn btn--light btn--lg" href="visitor-registration.html">Visitor Pre-registration</a>
          <a class="btn btn--outline-light btn--lg" href="plan-your-visit.html">Plan Your Visit</a>
        </div>
      </div>
    </section>`;

/* ---------- Hakkinda ---------------------------------------------------- */
MAIN['about:tr'] = `${pageHeader('tr', 'Fuar Hakkında', 'Giresun EXPO 2026, Giresun\'un ekonomik ve ticari potansiyelini İstanbul\'da tanıtan bir iş dünyası buluşmasıdır.', 'Hakkında')}

    <section class="section">
      <div class="container container--narrow">
        <div class="reveal">
          <p class="eyebrow">Amaç</p>
          <h2 class="section-title">Giresun EXPO 2026 nedir?</h2>
          <p>Giresun EXPO 2026, Giresun'un ekonomik, ticari ve girişimcilik potansiyelini
            ulusal ve uluslararası ölçekte tanıtmayı amaçlayan kapsamlı bir iş dünyası
            buluşmasıdır. Organizasyon; yatırımcıları, üreticileri ve girişimcileri bir araya
            getirerek yeni iş birliklerinin kurulmasına ve Giresun'un marka değerinin
            güçlenmesine katkı sunacaktır.</p>

          <h2 class="section-title mt-8">Neden Giresun EXPO?</h2>
          <p>Giresun; üretimi, sanayisi, tarımı, turizmi ve girişimcilik kültürüyle önemli bir
            potansiyele sahiptir. EXPO'nun temel amacı, bu gücü görünür kılmak, yeni yatırım
            fırsatları oluşturmak ve şehrin ekonomik gelişimine katkı sağlayacak kalıcı bir
            organizasyon oluşturmaktır.</p>

          <h2 class="section-title mt-8">Kimleri buluşturacak?</h2>
          <p>Giresun EXPO; kamu kurumlarını, özel sektörü, yatırımcıları, üreticileri,
            sanayicileri, girişimcileri, üniversiteleri, kooperatifleri ve sivil toplum
            kuruluşlarını aynı çatı altında buluşturacaktır. Organizasyon, yeni iş birlikleri
            ve ticari bağlantılar için güçlü bir zemin oluşturacaktır.</p>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="split">
          <div class="reveal">
            <p class="eyebrow">Vizyon</p>
            <h2 class="section-title">Her yıl büyüyen bir marka</h2>
            <p>Giresun EXPO, tek seferlik bir fuar değil; her yıl büyüyen, uluslararası
              katılımı artıran ve Karadeniz'in önemli ticaret organizasyonlarından biri olmayı
              hedefleyen sürdürülebilir bir markadır.</p>
            <ul class="list-check mt-6">
              <li>${I.pin}<span>Yatırım fırsatlarını öne çıkarmak</span></li>
              <li>${I.pin}<span>Yeni ticaret ağları oluşturmak</span></li>
              <li>${I.pin}<span>İhracatı desteklemek</span></li>
              <li>${I.pin}<span>İnovasyonu teşvik etmek</span></li>
              <li>${I.pin}<span>Giresun'un marka değerini güçlendirmek</span></li>
            </ul>
          </div>

          <figure class="media media--4x3 reveal">
            <picture>
              <source srcset="assets/img/photos/uretim-sanayi.webp" type="image/webp">
              <img src="assets/img/photos/uretim-sanayi.jpg" alt="Robotik üretim hattı" width="783" height="457" loading="lazy" decoding="async">
            </picture>
          </figure>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">Hedef</p>
          <h2 class="section-title">Gelecek hedefi</h2>
          <p class="section-subtitle">Giresun EXPO'nun hedefi, Giresun'u ticaret ve yatırım
            alanında uluslararası ölçekte tanınan bir merkez hâline getirmektir. Her yıl
            gelişen yapısıyla organizasyonun, Karadeniz'in üretim gücünü Türkiye'ye ve dünyaya
            tanıtan prestijli bir marka olması hedeflenmektedir.</p>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head section-head--center reveal">
          <p class="eyebrow">Organizasyon</p>
          <h2 class="section-title">Paydaşlarımız</h2>
          <p class="section-subtitle">Organizasyon, Giresun'un üç güçlü sivil toplum
            kuruluşunun ortaklığıyla hayata geçirilmektedir. Bu iş birliği, Giresun'un ortak
            hedefler doğrultusunda hareket etme iradesini ortaya koymaktadır.</p>
        </div>

        <div class="grid grid--3 reveal">
          <div class="partner-card">
            <div class="partner"><img src="assets/img/partners/giresun-vakfi.png" alt="Giresun Vakfı" width="320" height="120" loading="lazy"></div>
            <h3 class="partner-card__name">Giresun Vakfı</h3>
            <p class="partner-card__desc">Kalkınma, Eğitim, Kültür, Spor ve Tanıtım</p>
          </div>
          <div class="partner-card">
            <div class="partner"><img src="assets/img/partners/giresun-federasyonu.png" alt="Giresun Federasyonu" width="320" height="120" loading="lazy"></div>
            <h3 class="partner-card__name">Giresun Federasyonu</h3>
            <p class="partner-card__desc">&nbsp;</p>
          </div>
          <div class="partner-card">
            <div class="partner"><img src="assets/img/partners/sebinsiad.png" alt="ŞEBİNSİAD" width="320" height="120" loading="lazy"></div>
            <h3 class="partner-card__name">ŞEBİNSİAD</h3>
            <p class="partner-card__desc">Şebinkarahisar Sanayici ve İş İnsanları Derneği</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--brand on-dark">
      <div class="container text-center">
        <h2 class="section-title">Giresun EXPO 2026'da buluşalım</h2>
        <p class="lead" style="margin-inline:auto">8–11 Ekim 2026, İstanbul Yenikapı.</p>
        <div class="cluster mt-6" style="justify-content:center">
          <a class="btn btn--light btn--lg" href="ziyaret-bilgileri.html">Ziyaret Bilgileri</a>
          <a class="btn btn--outline-light btn--lg" href="katilimcilar.html">Katılımcılar</a>
        </div>
      </div>
    </section>`;

MAIN['about:en'] = `${pageHeader('en', 'About the Expo', 'Giresun EXPO 2026 is a business gathering that presents Giresun\'s economic and commercial potential in Istanbul.', 'About')}

    <section class="section">
      <div class="container container--narrow">
        <div class="reveal">
          <p class="eyebrow">Purpose</p>
          <h2 class="section-title">What is Giresun EXPO 2026?</h2>
          <p>Giresun EXPO 2026 is a comprehensive business gathering that sets out to present
            Giresun's economic, commercial and entrepreneurial potential on a national and
            international scale. By bringing investors, producers and entrepreneurs together,
            it aims to help new partnerships form and to strengthen Giresun's standing as a
            brand.</p>

          <h2 class="section-title mt-8">Why Giresun EXPO?</h2>
          <p>Giresun holds considerable potential in production, industry, agriculture, tourism
            and entrepreneurial culture. The purpose of the EXPO is to make that capacity
            visible, to create new investment opportunities and to establish a lasting
            organisation that contributes to the city's economic development.</p>

          <h2 class="section-title mt-8">Who will it bring together?</h2>
          <p>Giresun EXPO brings public institutions, the private sector, investors, producers,
            industrialists, entrepreneurs, universities, cooperatives and civil society
            organisations under one roof, creating solid ground for new partnerships and
            commercial connections.</p>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="split">
          <div class="reveal">
            <p class="eyebrow">Vision</p>
            <h2 class="section-title">A brand that grows each year</h2>
            <p>Giresun EXPO is not a one-off fair. It is a sustainable brand intended to grow
              every year, to increase international participation and to become one of the
              significant trade organisations of the Black Sea region.</p>
            <ul class="list-check mt-6">
              <li>${I.pin}<span>Highlighting investment opportunities</span></li>
              <li>${I.pin}<span>Building new trade networks</span></li>
              <li>${I.pin}<span>Supporting exports</span></li>
              <li>${I.pin}<span>Encouraging innovation</span></li>
              <li>${I.pin}<span>Strengthening Giresun as a brand</span></li>
            </ul>
          </div>

          <figure class="media media--4x3 reveal">
            <picture>
              <source srcset="../assets/img/photos/uretim-sanayi.webp" type="image/webp">
              <img src="../assets/img/photos/uretim-sanayi.jpg" alt="Robotic production line" width="783" height="457" loading="lazy" decoding="async">
            </picture>
          </figure>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">Goal</p>
          <h2 class="section-title">Looking ahead</h2>
          <p class="section-subtitle">The goal of Giresun EXPO is to establish Giresun as a
            centre recognised internationally for trade and investment. With a structure that
            develops each year, the organisation aims to become a respected brand that presents
            the production capacity of the Black Sea region to Türkiye and the wider world.</p>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head section-head--center reveal">
          <p class="eyebrow">Organisation</p>
          <h2 class="section-title">Our partners</h2>
          <p class="section-subtitle">The event is delivered jointly by three civil society
            organisations from Giresun. This partnership reflects a shared commitment to acting
            towards common goals.</p>
        </div>

        <div class="grid grid--3 reveal">
          <div class="partner-card">
            <div class="partner"><img src="../assets/img/partners/giresun-vakfi.png" alt="Giresun Foundation" width="320" height="120" loading="lazy"></div>
            <h3 class="partner-card__name">Giresun Foundation</h3>
            <p class="partner-card__desc">Development, Education, Culture, Sport and Promotion</p>
          </div>
          <div class="partner-card">
            <div class="partner"><img src="../assets/img/partners/giresun-federasyonu.png" alt="Giresun Federation" width="320" height="120" loading="lazy"></div>
            <h3 class="partner-card__name">Giresun Federation</h3>
            <p class="partner-card__desc">&nbsp;</p>
          </div>
          <div class="partner-card">
            <div class="partner"><img src="../assets/img/partners/sebinsiad.png" alt="ŞEBİNSİAD" width="320" height="120" loading="lazy"></div>
            <h3 class="partner-card__name">ŞEBİNSİAD</h3>
            <p class="partner-card__desc">Şebinkarahisar Association of Industrialists and Businesspeople</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--brand on-dark">
      <div class="container text-center">
        <h2 class="section-title">Join us at Giresun EXPO 2026</h2>
        <p class="lead" style="margin-inline:auto">8–11 October 2026, Yenikapı, Istanbul.</p>
        <div class="cluster mt-6" style="justify-content:center">
          <a class="btn btn--light btn--lg" href="plan-your-visit.html">Plan Your Visit</a>
          <a class="btn btn--outline-light btn--lg" href="exhibitors.html">Exhibitors</a>
        </div>
      </div>
    </section>`;

/* ---------- Program ----------------------------------------------------- */
MAIN['program:tr'] = `${pageHeader('tr', 'Etkinlik Programı', 'Panel, sunum ve oturum programı henüz açıklanmadı.', 'Program')}

    <section class="section">
      <div class="container container--narrow">
        <div class="empty reveal">
          ${I.calendar.replace('class="icon"', 'class="empty__icon"')}
          <p class="empty__title">Program yakında açıklanacak</p>
          <p class="empty__text">Giresun EXPO 2026'nın panel, sunum ve oturum programı
            organizasyon tarafından hazırlanıyor. Açıklandığında bu sayfada yayımlanacak.</p>
          <div class="cluster mt-4" style="justify-content:center">
            <a class="btn btn--primary" href="ziyaret-bilgileri.html">Ziyaret Bilgileri</a>
            <a class="btn btn--secondary" href="katilimcilar.html">Katılımcılar</a>
          </div>
        </div>

        <div class="mt-8 reveal">
          <h2 class="section-title">Şimdilik bilinenler</h2>
          <p>Fuar 8–11 Ekim 2026 tarihleri arasında dört gün boyunca ziyarete açık olacak.
            Günlük ziyaret saatlerini ve ulaşım bilgilerini
            <a href="ziyaret-bilgileri.html">Ziyaret Bilgileri</a> sayfasından görebilirsiniz.</p>
        </div>
      </div>
    </section>`;

MAIN['program:en'] = `${pageHeader('en', 'Programme', 'The programme of panels, presentations and sessions has not been announced yet.', 'Programme')}

    <section class="section">
      <div class="container container--narrow">
        <div class="empty reveal">
          ${I.calendar.replace('class="icon"', 'class="empty__icon"')}
          <p class="empty__title">The programme will be announced soon</p>
          <p class="empty__text">The programme of panels, presentations and sessions for
            Giresun EXPO 2026 is being prepared by the organisers and will be published on this
            page once announced.</p>
          <div class="cluster mt-4" style="justify-content:center">
            <a class="btn btn--primary" href="plan-your-visit.html">Plan Your Visit</a>
            <a class="btn btn--secondary" href="exhibitors.html">Exhibitors</a>
          </div>
        </div>

        <div class="mt-8 reveal">
          <h2 class="section-title">What we know so far</h2>
          <p>The fair will be open to visitors for four days, from 8 to 11 October 2026. Daily
            opening hours and travel information are on the
            <a href="plan-your-visit.html">Plan Your Visit</a> page.</p>
        </div>
      </div>
    </section>`;

/* ---------- Galeri ------------------------------------------------------ */
MAIN['gallery:tr'] = `${pageHeader('tr', 'Galeri', 'Fuar alanından ve Giresun\'dan kareler.', 'Galeri')}

    <section class="section">
      <div class="container">
        <div class="gallery reveal">
${galleryItems('tr', '')}
        </div>
        <p class="text-muted mt-8" style="font-size:.875rem">
          Fuar sırasında çekilecek fotoğraflar etkinlik sonrasında bu sayfaya eklenecektir.
        </p>
      </div>
    </section>`;

MAIN['gallery:en'] = `${pageHeader('en', 'Gallery', 'Images from the fairground and from Giresun.', 'Gallery')}

    <section class="section">
      <div class="container">
        <div class="gallery reveal">
${galleryItems('en', '../')}
        </div>
        <p class="text-muted mt-8" style="font-size:.875rem">
          Photographs taken during the fair will be added to this page afterwards.
        </p>
      </div>
    </section>`;

/* ---------- Basin ------------------------------------------------------- */
MAIN['press:tr'] = `${pageHeader('tr', 'Basın', 'Giresun EXPO 2026 hakkında haber yapacak basın mensupları için kaynaklar.', 'Basın')}

    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">Basın kiti</p>
          <h2 class="section-title">İndirilebilir kaynaklar</h2>
        </div>

        <div class="grid grid--2 reveal">
          <article class="card">
            <div class="card__body">
              <span class="pillar__icon">${I.download}</span>
              <h3 class="card__title">El Kitapçığı (PDF)</h3>
              <p class="card__text">Fuarın resmî el kitapçığı: künye, ziyaret saatleri,
                ulaşım, paydaşlar ve katılımcı listesi. 12 sayfa, 2,2 MB.</p>
              <p class="card__footer">
                <a class="btn btn--primary" href="assets/files/giresun-expo-2026-el-kitapcigi.pdf" download>
                  ${I.download.replace('class="icon"', 'class="icon btn__icon"')}
                  Kitapçığı indir
                </a>
              </p>
            </div>
          </article>

          <article class="card">
            <div class="card__body">
              <span class="pillar__icon">${I.image}</span>
              <h3 class="card__title">Logo paketi</h3>
              <p class="card__text">Giresun EXPO logosunun tarihli ve tarihsiz sürümleri,
                şeffaf zeminli PNG. Logo yeniden çizilmemeli, renkleri değiştirilmemelidir.</p>
              <p class="card__footer">
                <span class="cluster">
                  <a class="btn btn--secondary btn--sm" href="assets/img/brand/giresun-expo-logo.png" download>Tarihli logo</a>
                  <a class="btn btn--secondary btn--sm" href="assets/img/brand/giresun-expo-logo-tarihsiz.png" download>Tarihsiz logo</a>
                </span>
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">Künye</p>
          <h2 class="section-title">Hızlı bilgiler</h2>
        </div>
        <div class="scroll-x reveal">
          <table class="hours">
            <caption class="visually-hidden">Giresun EXPO 2026 künye bilgileri</caption>
            <tbody>
              <tr><th scope="row">Etkinlik</th><td colspan="2">Giresun EXPO 2026</td></tr>
              <tr><th scope="row">Tarih</th><td colspan="2">8–11 Ekim 2026</td></tr>
              <tr><th scope="row">Yer</th><td colspan="2">Dr. Mimar Kadir Topbaş Gösteri ve Sanat Merkezi, Yenikapı Etkinlik Alanı, İstanbul</td></tr>
              <tr><th scope="row">Katılımcı</th><td colspan="2">86 firma, 5 salon</td></tr>
              <tr><th scope="row">Organizasyon</th><td colspan="2">Giresun Vakfı, Giresun Federasyonu, ŞEBİNSİAD</td></tr>
              <tr><th scope="row">Slogan</th><td colspan="2">Giresun İçin İş Birliği, Türkiye İçin Güç Birliği</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container container--narrow">
        <div class="section-head reveal">
          <p class="eyebrow">İletişim</p>
          <h2 class="section-title">Basın iletişimi</h2>
          <p class="section-subtitle">Röportaj talebi, akreditasyon ve ek görsel istekleri için
            organizasyon ekibine ulaşabilirsiniz.</p>
        </div>
        <p class="reveal">
          <a class="btn btn--primary" href="tel:+905416622828">
            ${I.phone.replace('class="icon"', 'class="icon btn__icon"')}
            0541 662 28 28
          </a>
        </p>
      </div>
    </section>`;

MAIN['press:en'] = `${pageHeader('en', 'Press', 'Resources for journalists covering Giresun EXPO 2026.', 'Press')}

    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">Press kit</p>
          <h2 class="section-title">Downloadable resources</h2>
        </div>

        <div class="grid grid--2 reveal">
          <article class="card">
            <div class="card__body">
              <span class="pillar__icon">${I.download}</span>
              <h3 class="card__title">Handbook (PDF)</h3>
              <p class="card__text">The official handbook: event details, opening hours,
                travel information, partners and the exhibitor list. 12 pages, 2.2 MB.</p>
              <p class="card__footer">
                <a class="btn btn--primary" href="../assets/files/giresun-expo-2026-el-kitapcigi.pdf" download>
                  ${I.download.replace('class="icon"', 'class="icon btn__icon"')}
                  Download handbook
                </a>
              </p>
            </div>
          </article>

          <article class="card">
            <div class="card__body">
              <span class="pillar__icon">${I.image}</span>
              <h3 class="card__title">Logo pack</h3>
              <p class="card__text">The Giresun EXPO logo with and without the event dates, as
                transparent PNG files. The logo must not be redrawn or recoloured.</p>
              <p class="card__footer">
                <span class="cluster">
                  <a class="btn btn--secondary btn--sm" href="../assets/img/brand/giresun-expo-logo.png" download>Logo with dates</a>
                  <a class="btn btn--secondary btn--sm" href="../assets/img/brand/giresun-expo-logo-tarihsiz.png" download>Logo without dates</a>
                </span>
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">Fact sheet</p>
          <h2 class="section-title">Key details</h2>
        </div>
        <div class="scroll-x reveal">
          <table class="hours">
            <caption class="visually-hidden">Giresun EXPO 2026 key details</caption>
            <tbody>
              <tr><th scope="row">Event</th><td colspan="2">Giresun EXPO 2026</td></tr>
              <tr><th scope="row">Dates</th><td colspan="2">8–11 October 2026</td></tr>
              <tr><th scope="row">Venue</th><td colspan="2">Dr. Mimar Kadir Topbaş Arts and Performance Centre, Yenikapı Event Area, Istanbul</td></tr>
              <tr><th scope="row">Exhibitors</th><td colspan="2">86 companies, 5 halls</td></tr>
              <tr><th scope="row">Organisers</th><td colspan="2">Giresun Foundation, Giresun Federation, ŞEBİNSİAD</td></tr>
              <tr><th scope="row">Tagline</th><td colspan="2">Cooperation for Giresun, Strength for Türkiye</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container container--narrow">
        <div class="section-head reveal">
          <p class="eyebrow">Contact</p>
          <h2 class="section-title">Press enquiries</h2>
          <p class="section-subtitle">For interview requests, accreditation and additional
            imagery, please contact the organising team.</p>
        </div>
        <p class="reveal">
          <a class="btn btn--primary" href="tel:+905416622828">
            ${I.phone.replace('class="icon"', 'class="icon btn__icon"')}
            +90 541 662 28 28
          </a>
        </p>
      </div>
    </section>`;

/* ======================================================================== */
/* Formlar                                                                  */
/*                                                                          */
/* Formlar eksiksiz kurulur: etiketler, dogrulama oznitelikleri, bal kupu,  */
/* basari ekrani. Gonderim hedefi C asamasinda Supabase olacak.             */
/* O zamana kadar <form data-submit="pending"> ve form-gonder.js kullaniciya*/
/* durumu DURUSTCE bildirip telefona yonlendirir — sessizce yutmaz.         */
/* ======================================================================== */

const pendingNotice = (lang) => `            <div class="notice notice--info" data-submit-pending>
              ${I.clock}
              <p>${lang === 'tr'
    ? 'Çevrim içi gönderim henüz etkin değil. Bu forma kaydettiğiniz bilgiler gönderilmez. Şimdilik <a href="tel:+905416622828">0541 662 28 28</a> numarasından bize ulaşabilirsiniz.'
    : 'Online submission is not active yet. Information entered here is not sent. For now, please call <a href="tel:+905416622828">+90 541 662 28 28</a>.'}</p>
            </div>`;

const honeypot = (lang) => `            <div class="hp-field" aria-hidden="true">
              <label for="hp-website">${lang === 'tr' ? 'Bu alanı boş bırakın' : 'Leave this field empty'}</label>
              <input id="hp-website" name="website_url" type="text" tabindex="-1" autocomplete="off">
            </div>`;

/* ---------- Iletisim ---------------------------------------------------- */
const contactBody = (lang, r) => {
  const tr = lang === 'tr';
  return `${pageHeader(lang, tr ? 'İletişim' : 'Contact',
    tr ? 'Sorularınız için organizasyon ekibine ulaşabilirsiniz.'
       : 'Get in touch with the organising team with any questions.',
    tr ? 'İletişim' : 'Contact')}

    <section class="section">
      <div class="container">
        <div class="grid grid--3 reveal">
          <article class="card">
            <div class="card__body">
              <span class="pillar__icon">${I.phone}</span>
              <h2 class="card__title">${tr ? 'Telefon' : 'Phone'}</h2>
              <p class="card__text"><a href="tel:+905416622828">${tr ? '0541 662 28 28' : '+90 541 662 28 28'}</a></p>
            </div>
          </article>

          <article class="card">
            <div class="card__body">
              <span class="pillar__icon">${I.pin}</span>
              <h2 class="card__title">${tr ? 'Adres' : 'Address'}</h2>
              <p class="card__text">${tr
      ? 'Dr. Mimar Kadir Topbaş Gösteri ve Sanat Merkezi<br>Yenikapı Etkinlik Alanı<br>Kennedy Caddesi No: 11/1, Fatih / İstanbul'
      : 'Dr. Mimar Kadir Topbaş Arts and Performance Centre<br>Yenikapı Event Area<br>Kennedy Caddesi No: 11/1, Fatih / Istanbul'}</p>
            </div>
          </article>

          <article class="card">
            <div class="card__body">
              <span class="pillar__icon">${I.clock}</span>
              <h2 class="card__title">${tr ? 'Fuar tarihleri' : 'Fair dates'}</h2>
              <p class="card__text">${tr ? '8–11 Ekim 2026' : '8–11 October 2026'}<br>
                <a href="${tr ? 'ziyaret-bilgileri.html' : 'plan-your-visit.html'}">${tr ? 'Ziyaret saatleri' : 'Opening hours'}</a></p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container container--narrow">
        <div class="section-head reveal">
          <p class="eyebrow">${tr ? 'Mesaj' : 'Message'}</p>
          <h2 class="section-title">${tr ? 'Bize yazın' : 'Write to us'}</h2>
        </div>

        <form class="form reveal" data-submit="pending" novalidate>
${pendingNotice(lang)}

          <div class="form__row">
            <div class="form__group">
              <label class="form__label" for="c-name">${tr ? 'Ad soyad' : 'Full name'} <span class="req">*</span></label>
              <input class="form__control" id="c-name" name="name" type="text" required autocomplete="name" maxlength="120">
            </div>
            <div class="form__group">
              <label class="form__label" for="c-mail">${tr ? 'E-posta' : 'E-mail'} <span class="req">*</span></label>
              <input class="form__control" id="c-mail" name="email" type="email" required autocomplete="email" maxlength="160">
            </div>
          </div>

          <div class="form__group">
            <label class="form__label" for="c-subject">${tr ? 'Konu' : 'Subject'}</label>
            <input class="form__control" id="c-subject" name="subject" type="text" maxlength="160">
          </div>

          <div class="form__group">
            <label class="form__label" for="c-msg">${tr ? 'Mesajınız' : 'Your message'} <span class="req">*</span></label>
            <textarea class="form__control" id="c-msg" name="message" required maxlength="2000"></textarea>
          </div>

${honeypot(lang)}

          <label class="form__check">
            <input type="checkbox" name="consent" required>
            <span>${tr
      ? '<a href="kvkk.html">KVKK Aydınlatma Metni</a>\'ni okudum, kişisel verilerimin bu talep kapsamında işlenmesini kabul ediyorum.'
      : 'I have read the <a href="data-protection.html">Data Protection Notice</a> and consent to my personal data being processed for this enquiry.'} <span class="req">*</span></span>
          </label>

          <div class="form__actions">
            <button class="btn btn--primary btn--lg" type="submit">${tr ? 'Mesajı Gönder' : 'Send Message'}</button>
          </div>
        </form>
      </div>
    </section>`;
};

MAIN['contact:tr'] = contactBody('tr', '');
MAIN['contact:en'] = contactBody('en', '../');

/* ---------- Ziyaretci on kaydi ------------------------------------------ */
const registerBody = (lang) => {
  const tr = lang === 'tr';
  return `${pageHeader(lang, tr ? 'Ziyaretçi Ön Kaydı' : 'Visitor Pre-registration',
    tr ? 'Ön kaydınızı bırakın; fuar yaklaştığında ziyaret bilgilerini sizinle paylaşalım.'
       : 'Leave your details and we will share visit information with you as the fair approaches.',
    tr ? 'Ziyaretçi Ön Kaydı' : 'Visitor Pre-registration')}

    <section class="section">
      <div class="container container--narrow">
        <div class="reveal">
          <p>${tr
    ? 'Giresun EXPO 2026, 8–11 Ekim 2026 tarihlerinde İstanbul Yenikapı\'da düzenleniyor. Giriş koşulları organizasyon tarafından ayrıca duyurulacaktır.'
    : 'Giresun EXPO 2026 takes place from 8 to 11 October 2026 at Yenikapı, Istanbul. Entry conditions will be announced separately by the organisers.'}</p>
        </div>

        <form class="form mt-8 reveal" data-submit="pending" novalidate>
${pendingNotice(lang)}

          <div class="form__row">
            <div class="form__group">
              <label class="form__label" for="v-name">${tr ? 'Ad soyad' : 'Full name'} <span class="req">*</span></label>
              <input class="form__control" id="v-name" name="fullName" type="text" required autocomplete="name" maxlength="120">
            </div>
            <div class="form__group">
              <label class="form__label" for="v-mail">${tr ? 'E-posta' : 'E-mail'} <span class="req">*</span></label>
              <input class="form__control" id="v-mail" name="email" type="email" required autocomplete="email" maxlength="160">
            </div>
          </div>

          <div class="form__row">
            <div class="form__group">
              <label class="form__label" for="v-phone">${tr ? 'Telefon' : 'Phone'}</label>
              <input class="form__control" id="v-phone" name="phone" type="tel" autocomplete="tel" maxlength="30">
            </div>
            <div class="form__group">
              <label class="form__label" for="v-city">${tr ? 'Şehir' : 'City'}</label>
              <input class="form__control" id="v-city" name="city" type="text" autocomplete="address-level2" maxlength="80">
            </div>
          </div>

          <fieldset class="form__group">
            <legend class="form__label">${tr ? 'Hangi gün(ler) geleceksiniz?' : 'Which day(s) will you attend?'}</legend>
            <div class="chips chips--wrap">
              <label class="chip"><input type="checkbox" name="days" value="2026-10-08"><span>${tr ? '8 Ekim · Per' : '8 Oct · Thu'}</span></label>
              <label class="chip"><input type="checkbox" name="days" value="2026-10-09"><span>${tr ? '9 Ekim · Cum' : '9 Oct · Fri'}</span></label>
              <label class="chip"><input type="checkbox" name="days" value="2026-10-10"><span>${tr ? '10 Ekim · Cmt' : '10 Oct · Sat'}</span></label>
              <label class="chip"><input type="checkbox" name="days" value="2026-10-11"><span>${tr ? '11 Ekim · Paz' : '11 Oct · Sun'}</span></label>
            </div>
            <p class="form__hint">${tr ? 'İsteğe bağlı. Birden fazla gün seçebilirsiniz.' : 'Optional. You may select more than one day.'}</p>
          </fieldset>

${honeypot(lang)}

          <label class="form__check">
            <input type="checkbox" name="consent" required>
            <span>${tr
    ? '<a href="kvkk.html">KVKK Aydınlatma Metni</a>\'ni okudum, kişisel verilerimin ön kayıt kapsamında işlenmesini kabul ediyorum.'
    : 'I have read the <a href="data-protection.html">Data Protection Notice</a> and consent to my personal data being processed for pre-registration.'} <span class="req">*</span></span>
          </label>

          <div class="form__actions">
            <button class="btn btn--primary btn--lg" type="submit">${tr ? 'Ön Kaydı Tamamla' : 'Complete Pre-registration'}</button>
            <a class="btn btn--ghost" href="${tr ? 'ziyaret-bilgileri.html' : 'plan-your-visit.html'}">${tr ? 'Ziyaret bilgileri' : 'Visit information'}</a>
          </div>
        </form>
      </div>
    </section>`;
};

MAIN['register:tr'] = registerBody('tr');
MAIN['register:en'] = registerBody('en');

/* ---------- Stant basvurusu (cok adimli) -------------------------------- */
const standBody = (lang) => {
  const tr = lang === 'tr';
  return `${pageHeader(lang, tr ? 'Katılımcı Olun' : 'Become an Exhibitor',
    tr ? 'Giresun EXPO 2026 stantları dağıtılmıştır. Aşağıdaki form 2027 ön başvurusu içindir.'
       : 'Stands for Giresun EXPO 2026 have been allocated. The form below is a pre-application for 2027.',
    tr ? 'Stant Başvurusu' : 'Stand Application')}

    <section class="section section--tight">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">${tr ? 'Neden katılmalı?' : 'Why exhibit?'}</p>
          <h2 class="section-title">${tr ? 'Giresun EXPO 2027' : 'Giresun EXPO 2027'}</h2>
        </div>
        <div class="grid grid--3 reveal">
          <div class="pillar">
            <span class="pillar__icon">${I.pin}</span>
            <h3 class="pillar__title">${tr ? 'Doğru kitle' : 'The right audience'}</h3>
            <p class="pillar__text">${tr
    ? 'Kamu kurumları, yatırımcılar, üreticiler ve sanayiciler aynı çatı altında.'
    : 'Public institutions, investors, producers and industrialists under one roof.'}</p>
          </div>
          <div class="pillar">
            <span class="pillar__icon">${I.calendar}</span>
            <h3 class="pillar__title">${tr ? 'Dört gün' : 'Four days'}</h3>
            <p class="pillar__text">${tr
    ? 'Dört gün boyunca kesintisiz ziyaretçi akışı ve ikili görüşme imkânı.'
    : 'Four days of continuous visitor flow and one-to-one meetings.'}</p>
          </div>
          <div class="pillar">
            <span class="pillar__icon">${I.clock}</span>
            <h3 class="pillar__title">${tr ? 'Erken başvuru' : 'Early application'}</h3>
            <p class="pillar__text">${tr
    ? '2026\'da 86 firma stant açtı. 2027 için erken başvuru yer seçiminde avantaj sağlar.'
    : '86 companies exhibited in 2026. Applying early for 2027 gives you more choice of location.'}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">${tr ? 'Süreç' : 'Process'}</p>
          <h2 class="section-title">${tr ? 'Dört adım' : 'Four steps'}</h2>
        </div>
        <ol class="process reveal">
          <li class="process__step"><span class="process__num">1</span>
            <h3 class="process__title">${tr ? 'Başvuru' : 'Application'}</h3>
            <p class="process__text">${tr ? 'Aşağıdaki formu doldurun.' : 'Fill in the form below.'}</p></li>
          <li class="process__step"><span class="process__num">2</span>
            <h3 class="process__title">${tr ? 'Değerlendirme' : 'Review'}</h3>
            <p class="process__text">${tr ? 'Ekibimiz başvurunuzu inceler ve sizinle iletişime geçer.' : 'Our team reviews your application and contacts you.'}</p></li>
          <li class="process__step"><span class="process__num">3</span>
            <h3 class="process__title">${tr ? 'Sözleşme' : 'Agreement'}</h3>
            <p class="process__text">${tr ? 'Stant tipi ve alan birlikte belirlenir.' : 'Stand type and space are agreed together.'}</p></li>
          <li class="process__step"><span class="process__num">4</span>
            <h3 class="process__title">${tr ? 'Kurulum' : 'Build-up'}</h3>
            <p class="process__text">${tr ? 'Fuar öncesi kurulum takvimi paylaşılır.' : 'The build-up schedule is shared before the fair.'}</p></li>
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container container--narrow">
        <div class="section-head reveal">
          <p class="eyebrow">${tr ? 'Başvuru' : 'Application'}</p>
          <h2 class="section-title">${tr ? 'Ön başvuru formu' : 'Pre-application form'}</h2>
        </div>

        <form class="form reveal" id="stand-form" data-submit="pending" data-steps novalidate>
${pendingNotice(lang)}

          <ol class="steps" data-steps-nav>
            <li class="steps__item is-active">1. ${tr ? 'Firma bilgileri' : 'Company details'}</li>
            <li class="steps__item">2. ${tr ? 'Stant tercihi' : 'Stand preference'}</li>
            <li class="steps__item">3. ${tr ? 'Onay ve gönder' : 'Confirm and send'}</li>
          </ol>

          <fieldset class="fieldset form" data-step="1">
            <legend>${tr ? 'Firma bilgileri' : 'Company details'}</legend>
            <div class="form__row">
              <div class="form__group">
                <label class="form__label" for="s-company">${tr ? 'Firma adı' : 'Company name'} <span class="req">*</span></label>
                <input class="form__control" id="s-company" name="company" type="text" required maxlength="160" autocomplete="organization">
              </div>
              <div class="form__group">
                <label class="form__label" for="s-sector">${tr ? 'Sektör' : 'Sector'} <span class="req">*</span></label>
                <input class="form__control" id="s-sector" name="sector" type="text" required maxlength="80">
              </div>
            </div>
            <div class="form__row">
              <div class="form__group">
                <label class="form__label" for="s-contact">${tr ? 'Yetkili ad soyad' : 'Contact person'} <span class="req">*</span></label>
                <input class="form__control" id="s-contact" name="contactName" type="text" required maxlength="120" autocomplete="name">
              </div>
              <div class="form__group">
                <label class="form__label" for="s-mail">${tr ? 'E-posta' : 'E-mail'} <span class="req">*</span></label>
                <input class="form__control" id="s-mail" name="email" type="email" required maxlength="160" autocomplete="email">
              </div>
            </div>
            <div class="form__row">
              <div class="form__group">
                <label class="form__label" for="s-phone">${tr ? 'Telefon' : 'Phone'} <span class="req">*</span></label>
                <input class="form__control" id="s-phone" name="phone" type="tel" required maxlength="30" autocomplete="tel">
              </div>
              <div class="form__group">
                <label class="form__label" for="s-web">${tr ? 'Web sitesi' : 'Website'}</label>
                <input class="form__control" id="s-web" name="website" type="url" placeholder="https://" maxlength="200">
              </div>
            </div>
          </fieldset>

          <fieldset class="fieldset form" data-step="2" hidden>
            <legend>${tr ? 'Stant tercihi' : 'Stand preference'}</legend>
            <div class="form__row">
              <div class="form__group">
                <label class="form__label" for="s-type">${tr ? 'Stant tipi' : 'Stand type'} <span class="req">*</span></label>
                <select class="form__control" id="s-type" name="standType" required>
                  <option value="">${tr ? 'Seçiniz' : 'Select'}</option>
                  <option value="hazir">${tr ? 'Hazır stant' : 'Shell scheme'}</option>
                  <option value="bos">${tr ? 'Boş alan' : 'Bare space'}</option>
                  <option value="acik">${tr ? 'Açık alan' : 'Outdoor space'}</option>
                </select>
              </div>
              <div class="form__group">
                <label class="form__label" for="s-area">${tr ? 'Yaklaşık alan (m²)' : 'Approximate area (m²)'}</label>
                <input class="form__control" id="s-area" name="area" type="number" min="1" max="500" step="1" inputmode="numeric">
              </div>
            </div>
            <div class="form__group">
              <label class="form__label" for="s-note">${tr ? 'Eklemek istedikleriniz' : 'Anything to add'}</label>
              <textarea class="form__control" id="s-note" name="note" maxlength="1500"></textarea>
              <p class="form__hint">${tr
    ? 'Fiyatlandırma için ekibimiz sizinle iletişime geçecektir.'
    : 'Our team will contact you regarding pricing.'}</p>
            </div>
          </fieldset>

          <fieldset class="fieldset form" data-step="3" hidden>
            <legend>${tr ? 'Onay ve gönder' : 'Confirm and send'}</legend>
            <dl class="summary" data-summary></dl>
${honeypot(lang)}
            <label class="form__check">
              <input type="checkbox" name="consent" required>
              <span>${tr
    ? '<a href="kvkk.html">KVKK Aydınlatma Metni</a>\'ni okudum, firma ve iletişim bilgilerimin başvuru sürecinde işlenmesini kabul ediyorum.'
    : 'I have read the <a href="data-protection.html">Data Protection Notice</a> and consent to my company and contact details being processed for this application.'} <span class="req">*</span></span>
            </label>
          </fieldset>

          <div class="form__actions">
            <button class="btn btn--ghost" type="button" data-step-prev hidden>${tr ? 'Geri' : 'Back'}</button>
            <button class="btn btn--primary btn--lg" type="button" data-step-next>${tr ? 'Devam et' : 'Continue'}</button>
            <button class="btn btn--primary btn--lg" type="submit" data-step-submit hidden>${tr ? 'Başvuruyu Gönder' : 'Submit Application'}</button>
          </div>
        </form>
      </div>
    </section>`;
};

MAIN['stand:tr'] = standBody('tr');
MAIN['stand:en'] = standBody('en');

/* ---------- Yasal ------------------------------------------------------- */
const legalPage = (lang, title, crumb, lead, body) => `${pageHeader(lang, title, lead, crumb)}

    <section class="section">
      <div class="container container--narrow">
${legalNotice(lang)}

        <div class="prose mt-8">
${body}
        </div>
      </div>
    </section>`;

MAIN['kvkk:tr'] = legalPage('tr', 'KVKK Aydınlatma Metni', 'KVKK Aydınlatma Metni',
  '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında hazırlanmıştır.', `
          <h2>Veri sorumlusu</h2>
          <p>Giresun EXPO organizasyonu; Giresun Vakfı, Giresun Federasyonu ve Şebinkarahisar
            Sanayici ve İş İnsanları Derneği (ŞEBİNSİAD) ortaklığıyla yürütülmektedir.
            Veri sorumlusu sıfatını taşıyan tüzel kişi organizasyon tarafından
            kesinleştirilecektir.</p>

          <h2>Hangi veriler işleniyor?</h2>
          <p>Bu sitedeki formlar aracılığıyla yalnızca sizin ilettiğiniz veriler işlenir:</p>
          <ul>
            <li><strong>Ziyaretçi ön kaydı:</strong> ad soyad, e-posta, telefon, şehir, katılmayı planladığınız günler</li>
            <li><strong>Stant başvurusu:</strong> firma adı, sektör, yetkili adı, e-posta, telefon, web sitesi, stant tercihi</li>
            <li><strong>İletişim formu:</strong> ad soyad, e-posta, konu, mesaj içeriği</li>
          </ul>

          <h2>İşleme amacı ve hukuki sebebi</h2>
          <p>Veriler; ön kayıt ve başvuru taleplerinin karşılanması, sizinle iletişim kurulması
            ve organizasyonun planlanması amacıyla, açık rızanıza dayanarak işlenir.</p>

          <h2>Aktarım</h2>
          <p>Veriler yalnızca organizasyonun yürütülmesi için gerekli olduğu ölçüde paydaş
            kuruluşlarla paylaşılır. Yurt dışına aktarım, kullanılan barındırma altyapısı
            netleştiğinde bu metinde açıkça belirtilecektir.</p>

          <h2>Saklama süresi</h2>
          <p>Saklama süreleri organizasyon tarafından belirlenecek ve bu metne eklenecektir.</p>

          <h2>Haklarınız</h2>
          <p>Kanun'un 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme,
            işlenmişse bilgi talep etme, düzeltilmesini veya silinmesini isteme ve işlemeye
            itiraz etme haklarına sahipsiniz. Taleplerinizi
            <a href="tel:+905416622828">0541 662 28 28</a> numarası üzerinden iletebilirsiniz.</p>`);

MAIN['kvkk:en'] = legalPage('en', 'Data Protection Notice', 'Data Protection Notice',
  'Prepared under Turkish Law No. 6698 on the Protection of Personal Data.', `
          <h2>Data controller</h2>
          <p>Giresun EXPO is organised jointly by the Giresun Foundation, the Giresun Federation
            and the Şebinkarahisar Association of Industrialists and Businesspeople (ŞEBİNSİAD).
            The legal entity acting as data controller will be confirmed by the organisers.</p>

          <h2>What data is processed?</h2>
          <p>Only the information you submit through the forms on this site is processed:</p>
          <ul>
            <li><strong>Visitor pre-registration:</strong> name, e-mail, phone, city, days you plan to attend</li>
            <li><strong>Stand application:</strong> company name, sector, contact name, e-mail, phone, website, stand preference</li>
            <li><strong>Contact form:</strong> name, e-mail, subject, message</li>
          </ul>

          <h2>Purpose and legal basis</h2>
          <p>Data is processed on the basis of your explicit consent, in order to handle
            pre-registration and application requests, to contact you and to plan the event.</p>

          <h2>Transfers</h2>
          <p>Data is shared with the partner organisations only to the extent necessary to run
            the event. Any transfer abroad will be stated explicitly here once the hosting
            infrastructure is confirmed.</p>

          <h2>Retention</h2>
          <p>Retention periods will be determined by the organisers and added to this notice.</p>

          <h2>Your rights</h2>
          <p>Under Article 11 of the Law you have the right to learn whether your personal data
            is processed, to request information, to ask for correction or deletion, and to
            object to processing. You may submit requests by calling
            <a href="tel:+905416622828">+90 541 662 28 28</a>.</p>`);

MAIN['cookies:tr'] = legalPage('tr', 'Çerez Politikası', 'Çerez Politikası',
  'Bu sitede takip veya reklam çerezi kullanılmaz.', `
          <h2>Kullanılan çerezler</h2>
          <p>Bu site, çalışması için gereken en az sayıda veriyi tarayıcınızda saklar.
            Reklam, profilleme veya üçüncü taraf takip çerezi kullanılmaz.</p>
          <div class="scroll-x">
            <table class="hours">
              <thead><tr><th scope="col">Ad</th><th scope="col">Amaç</th><th scope="col">Süre</th></tr></thead>
              <tbody>
                <tr><th scope="row">ge-cerez-onay</th><td>Çerez bildirimini kapattığınızı hatırlar</td><td>Kalıcı (tarayıcı deposu)</td></tr>
              </tbody>
            </table>
          </div>

          <h2>Üçüncü taraf içerik</h2>
          <p>Ziyaret Bilgileri ve Ana Sayfa'daki harita, <strong>siz "Haritayı yükle"
            düğmesine basmadan yüklenmez</strong>. Düğmeye bastığınızda Google Haritalar'a
            bağlantı kurulur ve Google kendi çerezlerini kullanabilir. Düğmeye basmadığınız
            sürece bu site hiçbir üçüncü tarafa istek göndermez.</p>

          <h2>Yazı tipleri ve görseller</h2>
          <p>Yazı tipleri, ikonlar ve görsellerin tamamı bu sitenin kendi sunucusundan
            yüklenir; harici bir içerik ağı (CDN) kullanılmaz.</p>

          <h2>Çerezleri silmek</h2>
          <p>Tarayıcınızın ayarlarından site verilerini temizleyerek bu kaydı silebilirsiniz.
            Sildiğinizde çerez bildirimi yeniden görünür.</p>`);

MAIN['cookies:en'] = legalPage('en', 'Cookie Policy', 'Cookie Policy',
  'This site uses no tracking or advertising cookies.', `
          <h2>Cookies in use</h2>
          <p>This site stores the minimum amount of data in your browser needed for it to work.
            No advertising, profiling or third-party tracking cookies are used.</p>
          <div class="scroll-x">
            <table class="hours">
              <thead><tr><th scope="col">Name</th><th scope="col">Purpose</th><th scope="col">Duration</th></tr></thead>
              <tbody>
                <tr><th scope="row">ge-cerez-onay</th><td>Remembers that you dismissed the cookie notice</td><td>Persistent (browser storage)</td></tr>
              </tbody>
            </table>
          </div>

          <h2>Third-party content</h2>
          <p>The map on the Plan Your Visit and Home pages <strong>is not loaded until you press
            the "Load map" button</strong>. Pressing it opens a connection to Google Maps, which
            may set its own cookies. Until you do, this site makes no third-party requests.</p>

          <h2>Fonts and images</h2>
          <p>All fonts, icons and images are served from this site's own domain; no external
            content delivery network is used.</p>

          <h2>Clearing cookies</h2>
          <p>You can clear this record by clearing site data in your browser settings. The
            cookie notice will then appear again.</p>`);

MAIN['privacy:tr'] = legalPage('tr', 'Gizlilik', 'Gizlilik',
  'Bu sitenin verilerinizi nasıl ele aldığına dair kısa açıklama.', `
          <h2>Kısaca</h2>
          <p>Bu site yalnızca formlar aracılığıyla sizin ilettiğiniz bilgileri toplar.
            Analitik, reklam veya profilleme aracı kullanılmaz.</p>

          <h2>Sunucu kayıtları</h2>
          <p>Site GitHub Pages üzerinde barındırılmaktadır. Barındırma sağlayıcısı, hizmetin
            işletilmesi amacıyla standart erişim kayıtları tutabilir.</p>

          <h2>Dış bağlantılar</h2>
          <p>Bu sitedeki dış bağlantılara tıkladığınızda ilgili sitenin kendi gizlilik
            uygulamaları geçerli olur.</p>

          <h2>İletişim</h2>
          <p>Gizlilikle ilgili sorularınız için
            <a href="tel:+905416622828">0541 662 28 28</a> numarasını arayabilirsiniz.
            Ayrıntılı bilgi için <a href="kvkk.html">KVKK Aydınlatma Metni</a>'ne bakınız.</p>`);

MAIN['privacy:en'] = legalPage('en', 'Privacy', 'Privacy',
  'A short statement on how this site handles your information.', `
          <h2>In short</h2>
          <p>This site collects only the information you submit through its forms. No analytics,
            advertising or profiling tools are used.</p>

          <h2>Server logs</h2>
          <p>The site is hosted on GitHub Pages. The hosting provider may keep standard access
            logs for the purpose of operating the service.</p>

          <h2>External links</h2>
          <p>When you follow an external link from this site, the privacy practices of that
            site apply.</p>

          <h2>Contact</h2>
          <p>For privacy questions you may call
            <a href="tel:+905416622828">+90 541 662 28 28</a>. For more detail see the
            <a href="data-protection.html">Data Protection Notice</a>.</p>`);
