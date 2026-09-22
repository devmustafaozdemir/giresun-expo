/* ==========================================================================
   Form gönderimi — Supabase'e bağlanır.

   main.js formun native gönderimini her durumda engeller ve doğrulamayı
   yapar; gerçek gönderimi window.GE_SUBMIT üstlenir. Bu modül onu tanımlar.
   Modül yüklenmezse main.js dürüst bir "gönderim etkin değil" mesajı
   gösterir — form sessizce kaybolmaz.

   XSS: hiçbir yerde innerHTML kullanılmaz (CLAUDE.md kuralı).
   ========================================================================== */
import { stantBasvurusu, ziyaretciKaydi, iletisimMesaji, bultenAbonesi } from './data.js';

const DIL = document.documentElement.lang === 'en' ? 'en' : 'tr';
const T = DIL === 'en'
  ? {
      gonderiliyor: 'Sending…',
      basariBaslik: 'Thank you — your submission has been received.',
      numaraEtiket: 'Your reference number',
      numaraNot: 'Please keep this number. We will use it when we contact you.',
      basvuruBaslik: 'Your application has been received.',
      kayitBaslik: 'Your registration is complete.',
      mesajBaslik: 'Your message has been sent.',
      mesajNot: 'We will get back to you as soon as possible.',
      bultenBaslik: 'You are subscribed.',
      bultenNot: 'We will let you know about fair news.',
      yazdir: 'Print this page'
    }
  : {
      gonderiliyor: 'Gönderiliyor…',
      basariBaslik: 'Teşekkürler — gönderiniz alındı.',
      numaraEtiket: 'Referans numaranız',
      numaraNot: 'Bu numarayı saklayın. Sizinle iletişime geçerken kullanacağız.',
      basvuruBaslik: 'Başvurunuz alındı.',
      kayitBaslik: 'Kaydınız tamamlandı.',
      mesajBaslik: 'Mesajınız gönderildi.',
      mesajNot: 'En kısa sürede size dönüş yapacağız.',
      bultenBaslik: 'Aboneliğiniz alındı.',
      bultenNot: 'Fuar haberlerinden sizi haberdar edeceğiz.',
      yazdir: 'Bu sayfayı yazdır'
    };

/* --- Küçük DOM yardımcıları (innerHTML yok) ----------------------------- */
function el(tag, cls, metin) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (metin !== undefined) e.textContent = metin;
  return e;
}

function ikon(d) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.75');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', 'icon icon--xl');
  d.forEach((p) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', p);
    svg.appendChild(path);
  });
  return svg;
}

const ONAY = ['M21.801 10A10 10 0 1 1 17 3.335', 'm9 11 3 3L22 4'];

/** Formu başarı ekranıyla değiştirir */
function basariEkrani(form, baslik, numara, not) {
  const kutu = el('div', 'basari');
  kutu.setAttribute('role', 'status');
  kutu.setAttribute('tabindex', '-1');

  const i = ikon(ONAY);
  i.classList.add('basari__icon');
  kutu.appendChild(i);
  kutu.appendChild(el('h2', 'basari__title', baslik));

  if (numara) {
    const n = el('div', 'basari__no');
    n.appendChild(el('span', 'basari__no-label', T.numaraEtiket));
    n.appendChild(el('strong', 'basari__no-value', numara));
    kutu.appendChild(n);
    kutu.appendChild(el('p', 'basari__text', T.numaraNot));
  }
  if (not) kutu.appendChild(el('p', 'basari__text', not));

  if (numara) {
    const btn = el('button', 'btn btn--secondary mt-4', T.yazdir);
    btn.type = 'button';
    btn.addEventListener('click', () => window.print());
    kutu.appendChild(btn);
  }

  form.replaceWith(kutu);
  kutu.focus();
  kutu.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

/** Form alanlarını düz bir nesneye toplar */
function degerler(form) {
  const fd = new FormData(form);
  const o = {};
  for (const [k, v] of fd.entries()) {
    if (k === 'days') { (o.days = o.days || []).push(v); continue; }
    o[k] = typeof v === 'string' ? v.trim() : v;
  }
  return o;
}

function hataGoster(form, mesaj) {
  let kutu = form.querySelector('[data-submit-error]');
  if (!kutu) {
    kutu = el('div', 'notice notice--danger');
    kutu.setAttribute('data-submit-error', '');
    kutu.setAttribute('role', 'alert');
    kutu.appendChild(ikon(['M12 9v4', 'M12 17h.01',
      'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3']));
    kutu.appendChild(el('p'));
    form.prepend(kutu);
  }
  kutu.querySelector('p').textContent = mesaj;
  kutu.hidden = false;
  kutu.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

/* --- Ana gönderim ------------------------------------------------------- */
window.GE_SUBMIT = async function (form) {
  const tur = form.dataset.form;                 // stand | visitor | contact | newsletter
  const btn = form.querySelector('[type="submit"]') ||
              form.querySelector('[data-step-submit]');
  const eskiMetin = btn ? btn.textContent : '';

  const hata = form.querySelector('[data-submit-error]');
  if (hata) hata.hidden = true;

  if (btn) { btn.classList.add('is-loading'); btn.disabled = true; }

  try {
    const v = degerler(form);
    let numara = null;

    if (tur === 'stand') {
      numara = await stantBasvurusu(v, DIL);
      basariEkrani(form, T.basvuruBaslik, numara);
    } else if (tur === 'visitor') {
      numara = await ziyaretciKaydi(v, DIL);
      basariEkrani(form, T.kayitBaslik, numara);
    } else if (tur === 'contact') {
      await iletisimMesaji(v, DIL);
      basariEkrani(form, T.mesajBaslik, null, T.mesajNot);
    } else if (tur === 'newsletter') {
      await bultenAbonesi(v.email, DIL);
      basariEkrani(form, T.bultenBaslik, null, T.bultenNot);
    } else {
      throw new Error('Bilinmeyen form türü: ' + tur);
    }
  } catch (e) {
    hataGoster(form, (e && e.message) || 'Bilinmeyen hata');
    if (btn) { btn.classList.remove('is-loading'); btn.disabled = false; btn.textContent = eskiMetin; }
  }
};

/* Modül yüklendi: main.js artık "gönderim etkin değil" demeyecek */
document.documentElement.classList.add('ge-forms-ready');
