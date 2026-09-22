/* ==========================================================================
   Yönetim paneli — Kullanıcılar (yalnızca owner)
   assets/js/admin/kullanicilar.js

   Panel yeni Auth hesabı OLUŞTURAMAZ: bunun için service_role anahtarı
   gerekirdi ve o anahtar hiçbir zaman tarayıcıya girmez. Hesap Supabase
   panelinden açılır, buradan yalnızca yetki verilir/alınır.
   ========================================================================== */

import { getClient } from '../supabase-client.js';
import { korumaliSayfa, oturumIzle } from './auth.js';
import { gunlukYaz } from './gunluk.js';
import { el, kabukKur, durumKutusu, iskelet, tarihSaat, toast, onayla } from './ui.js';

const oturum = await korumaliSayfa('owner');
oturumIzle();

const icerik = kabukKur({ aktif: 'kullanici', baslik: 'Kullanıcılar', oturum });
const sb = await getClient();

icerik.append(
  el('div', { class: 'sayfa-bas' },
    el('div', { class: 'sayfa-bas__metin' },
      el('h1', null, 'Kullanıcılar'),
      el('p', { class: 'sayfa-bas__alt' },
        'Panele kimlerin erişebileceğini buradan yönetirsiniz.')))
);

/* Hesap açma akışı — panelden yapılamayacağı için açıkça anlatılıyor */
icerik.append(
  el('section', { class: 'panel', style: 'margin-bottom:var(--space-5)' },
    el('div', { class: 'panel__bas' },
      el('h2', { class: 'panel__baslik' }, 'Yeni yönetici nasıl eklenir?')),
    el('div', { class: 'panel__govde' },
      el('p', { style: 'margin-top:0' },
        'Yeni hesabı bu panel açamaz: hesap oluşturmak service_role anahtarı ' +
        'gerektirir ve o anahtar güvenlik gereği hiçbir zaman tarayıcıya girmez. ' +
        'İki adım:'),
      el('ol', { style: 'margin:0;padding-left:1.25rem;line-height:1.9' },
        el('li', null, 'Supabase paneli → Authentication → Users → Add user ile ' +
                       'hesabı oluşturun (Auto Confirm işaretli).'),
        el('li', null, 'SQL Editor’da aşağıdaki sorguyu e-posta ve rolü ' +
                       'değiştirerek çalıştırın.')),
      sqlKutusu(),
      el('p', { class: 'form__hint' },
        'Kayıt olma (sign-up) kapalı tutulmalı; aksi halde isteyen kendi hesabını açar. ' +
        'Hesabı olmak panele erişim vermez — bu tabloda satırı olması gerekir.')))
);

function sqlKutusu() {
  const sql =
    "insert into public.admins (user_id, email, role)\n" +
    "select u.id, lower(u.email), 'editor'\n" +
    "from auth.users u\n" +
    "where lower(u.email) = lower('yeni@ornek.com')\n" +
    "  and u.email is not null\n" +
    "on conflict (user_id) do update set role = excluded.role;";

  const pre = el('pre', {
    style: 'background:var(--color-surface);border:1px solid var(--color-border);' +
           'border-radius:var(--radius);padding:var(--space-4);overflow-x:auto;' +
           'font-size:.8125rem;line-height:1.6;margin:var(--space-4) 0'
  }, el('code', null, sql));

  const kopyala = el('button', { class: 'btn btn--secondary btn--sm', type: 'button' },
    'SQL’i kopyala');
  kopyala.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(sql);
      toast('SQL panoya kopyalandı.', 'basari');
    } catch {
      toast('Kopyalanamadı. Metni elle seçip kopyalayın.', 'uyari');
    }
  });

  return el('div', null, pre, kopyala);
}

const panel = el('section', { class: 'panel' });
icerik.append(panel);
panel.append(iskelet(4));

yukle();

async function yukle() {
  if (!sb) {
    panel.replaceChildren(durumKutusu({
      tur: 'hata', baslik: 'Sunucuya bağlanılamadı', metin: 'config.js kontrol edin.'
    }));
    return;
  }

  const { data, error } = await sb.from('admins')
    .select('id, user_id, email, ad_soyad, role, created_at')
    .order('created_at');

  if (error) {
    panel.replaceChildren(durumKutusu({
      tur: 'hata', baslik: 'Kullanıcılar okunamadı', metin: error.message
    }));
    return;
  }

  const ownerSayisi = data.filter((a) => a.role === 'owner').length;

  const govde = el('tbody', null, data.map((a) => {
    const benMi = a.user_id === oturum.user.id;

    const rolSec = el('select', { class: 'form__control',
      'aria-label': `${a.email} rolü`, style: 'max-width:150px' },
      el('option', { value: 'editor', selected: a.role === 'editor' }, 'Editör'),
      el('option', { value: 'owner',  selected: a.role === 'owner'  }, 'Sahip'));

    /* Son owner'ın rolü düşürülemez: kimse admin ekleyemez hâle gelirdi. */
    const sonOwner = a.role === 'owner' && ownerSayisi === 1;
    if (sonOwner) {
      rolSec.disabled = true;
      rolSec.title = 'Tek sahip. Rolü düşürülemez.';
    }

    rolSec.addEventListener('change', async () => {
      const yeni = rolSec.value;
      const eminMi = await onayla({
        baslik: 'Rol değiştirilsin mi?',
        metin: `${a.email} → ${yeni === 'owner' ? 'Sahip' : 'Editör'}.` +
               (benMi && yeni === 'editor'
                 ? ' DİKKAT: kendi rolünüzü düşürüyorsunuz; bu sayfaya bir daha giremezsiniz.'
                 : ''),
        onayMetni: 'Evet, değiştir',
        tehlike: benMi && yeni === 'editor'
      });
      if (!eminMi) { rolSec.value = a.role; return; }

      const { error: hata } = await sb.from('admins').update({ role: yeni }).eq('id', a.id);
      if (hata) {
        rolSec.value = a.role;
        toast('Değiştirilemedi: ' + hata.message, 'hata', 8000);
        return;
      }
      gunlukYaz({ tablo: 'admins', kayit_id: a.id, islem: 'update',
                  ozet: `${a.email} rolü ${a.role} → ${yeni}` });
      toast('Rol güncellendi.', 'basari');
      if (benMi && yeni === 'editor') { location.replace('pano.html'); return; }
      yukle();
    });

    const cikarBtn = el('button', {
      class: 'btn btn--tehlike btn--sm', type: 'button',
      disabled: benMi || sonOwner,
      title: benMi ? 'Kendi yetkinizi kaldıramazsınız'
                   : (sonOwner ? 'Tek sahip kaldırılamaz' : '')
    }, 'Yetkiyi kaldır');

    cikarBtn.addEventListener('click', async () => {
      const eminMi = await onayla({
        baslik: 'Yetki kaldırılsın mı?',
        metin: `${a.email} artık panele giremeyecek. Supabase'deki hesabı silinmez, ` +
               'yalnızca yetkisi alınır; istenirse aynı yöntemle geri verilebilir.',
        onayMetni: 'Evet, kaldır', tehlike: true
      });
      if (!eminMi) return;

      const { error: hata } = await sb.from('admins').delete().eq('id', a.id);
      if (hata) { toast('Kaldırılamadı: ' + hata.message, 'hata', 8000); return; }

      gunlukYaz({ tablo: 'admins', kayit_id: a.id, islem: 'delete',
                  ozet: `${a.email} yetkisi kaldırıldı` });
      toast('Yetki kaldırıldı.', 'basari');
      yukle();
    });

    return el('tr', null,
      el('td', null, el('span', null, a.email,
        benMi ? el('span', { class: 'durum durum--approved',
                             style: 'margin-left:8px' }, 'Siz') : null)),
      el('td', null, a.ad_soyad || '—'),
      el('td', null, rolSec),
      el('td', { class: 'tablo__tarih' }, tarihSaat(a.created_at)),
      el('td', { class: 'tablo__sag' }, cikarBtn)
    );
  }));

  panel.replaceChildren(
    el('div', { class: 'panel__bas' },
      el('h2', { class: 'panel__baslik' }, `Yetkili kullanıcılar (${data.length})`)),
    el('div', { class: 'tablo-sarmal' },
      el('table', { class: 'tablo' },
        el('thead', null, el('tr', null,
          el('th', null, 'E-posta'), el('th', null, 'Ad soyad'),
          el('th', null, 'Rol'), el('th', null, 'Eklenme'),
          el('th', { class: 'tablo__sag' }, ''))),
        govde))
  );
}
