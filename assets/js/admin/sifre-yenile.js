/* ==========================================================================
   Yönetim paneli — Parola yenileme
   assets/js/admin/sifre-yenile.js

   Parola sıfırlama e-postasındaki bağlantı buraya düşer. supabase-js
   (detectSessionInUrl varsayılan olarak açık) adresteki kurtarma belirtecini
   okuyup geçici bir oturum kurar; biz de updateUser ile yeni parolayı yazarız.

   Bağlantı tek kullanımlıktır ve kısa ömürlüdür: süresi geçmişse veya
   e-posta istemcisi bağlantıyı önceden açıp tükettiyse oturum kurulmaz.
   O durumda sessizce boş bir form göstermek yerine ne olduğunu söylüyoruz.
   ========================================================================== */

import { getClient } from '../supabase-client.js';

const form  = document.getElementById('yenile-formu');
const alan1 = document.getElementById('sifre1');
const alan2 = document.getElementById('sifre2');
const btn   = document.getElementById('yenile-btn');
const kutu  = document.getElementById('mesaj');

const ASGARI = 8;

function mesaj(metin, tur) {
  kutu.textContent = metin;
  kutu.className = tur === 'bilgi' ? 'form__hint' : 'giris__hata';
  kutu.hidden = false;
}
function temizle() { kutu.hidden = true; kutu.textContent = ''; }

const sb = await getClient();

if (!sb) {
  form.hidden = true;
  mesaj('Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edip sayfayı yenileyin.');
} else {
  /* Belirteç işlenene kadar kısa bir an geçebilir; oturumu bekleyip kontrol et. */
  let oturum = (await sb.auth.getSession()).data.session;
  if (!oturum) {
    oturum = await new Promise((coz) => {
      const zaman = setTimeout(() => coz(null), 2500);
      sb.auth.onAuthStateChange((olay, s) => {
        if (s && (olay === 'PASSWORD_RECOVERY' || olay === 'SIGNED_IN')) {
          clearTimeout(zaman);
          coz(s);
        }
      });
    });
  }

  if (!oturum) {
    form.hidden = true;
    mesaj(
      'Bu bağlantı geçersiz veya süresi dolmuş. Parola sıfırlama bağlantıları ' +
      'tek kullanımlıktır ve kısa süre geçerlidir. Giriş sayfasından yeniden ' +
      'sıfırlama isteyin.'
    );
    document.getElementById('geri-don').hidden = false;
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  temizle();

  const s1 = alan1.value, s2 = alan2.value;

  if (s1.length < ASGARI) {
    mesaj(`Parola en az ${ASGARI} karakter olmalı.`);
    alan1.focus();
    return;
  }
  if (s1 !== s2) {
    mesaj('İki parola aynı değil.');
    alan2.focus();
    alan2.select();
    return;
  }

  btn.disabled = true;
  btn.classList.add('is-loading');

  const { error } = await sb.auth.updateUser({ password: s1 });

  btn.disabled = false;
  btn.classList.remove('is-loading');

  if (error) {
    const m = (error.message || '').toLowerCase();
    if (m.includes('should be different') || m.includes('same as the old')) {
      mesaj('Yeni parola eskisiyle aynı olamaz.');
    } else if (m.includes('weak') || m.includes('password')) {
      mesaj('Parola yeterince güçlü değil. Daha uzun bir parola deneyin.');
    } else if (m.includes('expired') || m.includes('invalid')) {
      mesaj('Bağlantının süresi dolmuş. Giriş sayfasından yeniden sıfırlama isteyin.');
    } else {
      mesaj('Parola değiştirilemedi: ' + error.message);
    }
    return;
  }

  form.hidden = true;
  mesaj('Parolanız değiştirildi. Giriş sayfasına yönlendiriliyorsunuz…', 'bilgi');
  setTimeout(() => location.replace('index.html'), 1800);
});

/* Parola göster/gizle */
document.getElementById('sifre-goster').addEventListener('click', function () {
  const acik = alan1.type === 'text';
  alan1.type = acik ? 'password' : 'text';
  alan2.type = acik ? 'password' : 'text';
  this.setAttribute('aria-pressed', String(!acik));
  this.setAttribute('aria-label', acik ? 'Parolaları göster' : 'Parolaları gizle');
});
