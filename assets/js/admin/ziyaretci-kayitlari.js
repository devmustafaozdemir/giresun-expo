/* ==========================================================================
   Yönetim paneli — Ziyaretçi Kayıtları
   assets/js/admin/ziyaretci-kayitlari.js

   Liste, arama, gün süzgeci, gün bazlı sayımlar, check-in, CSV.
   ========================================================================== */

import { getClient } from '../supabase-client.js';
import { korumaliSayfa, oturumIzle } from './auth.js';
import { gunlukYaz } from './gunluk.js';
import { listeSayfasi, kunye } from './liste.js';
import { el, kabukKur, tarihSaat, tarih, toast, onayla } from './ui.js';

const oturum = await korumaliSayfa();
oturumIzle();

const icerik = kabukKur({ aktif: 'ziyaretci', baslik: 'Ziyaretçi Kayıtları', oturum });
const sb = await getClient();

/* Fuar günleri site ayarlarından okunur; elle yazılmaz. */
const ayar = sb
  ? (await sb.from('site_settings').select('baslangic_tarihi, bitis_tarihi').maybeSingle()).data
  : null;

const gunler = [];
if (ayar) {
  const bas = new Date(ayar.baslangic_tarihi + 'T00:00:00Z');
  const bit = new Date(ayar.bitis_tarihi + 'T00:00:00Z');
  for (let d = new Date(bas); d <= bit; d.setUTCDate(d.getUTCDate() + 1)) {
    gunler.push(d.toISOString().slice(0, 10));
  }
}

/* --- Gün bazlı özet: hangi güne kaç kişi kayıtlı --- */
const ozetAlan = el('div', { class: 'istatistik-izgara' });
icerik.append(ozetAlan);
ozetYukle();

async function ozetYukle() {
  if (!sb || !gunler.length) { ozetAlan.remove(); return; }

  const sonuc = await Promise.all(
    gunler.map((g) =>
      sb.from('visitor_registrations')
        .select('*', { count: 'exact', head: true })
        .contains('days', [g]))
  );

  const kartlar = gunler.map((g, i) => el('div', { class: 'ist-kart' },
    el('p', { class: 'ist-kart__etiket' }, tarih(g + 'T12:00:00Z')),
    el('p', { class: 'ist-kart__deger' }, String(sonuc[i].count ?? 0)),
    el('p', { class: 'ist-kart__alt' }, 'ziyaretçi')
  ));

  ozetAlan.replaceChildren(...kartlar);
}

/* --- Liste --- */
await listeSayfasi(icerik, {
  baslik: 'Ziyaretçi Kayıtları',
  altBaslik: 'Siteden gelen ziyaretçi ön kayıtları. Satıra tıklayarak ayrıntıyı açın.',
  tablo: 'visitor_registrations',
  secim: 'id, registration_no, full_name, email, phone, city, sector, days,' +
         ' checked_in_at, created_at',
  aramaAlanlari: ['full_name', 'email', 'city', 'registration_no'],
  aramaIpucu: 'Ad, e-posta, şehir veya kayıt no…',

  suzgecler: [
    ...(gunler.length ? [{
      ad: 'gun', etiket: 'Tüm günler',
      secenekler: gunler.map((g) => ({ deger: g, etiket: tarih(g + 'T12:00:00Z') })),
      uygula: (q, v) => q.contains('days', [v])
    }] : []),
    {
      ad: 'giris', etiket: 'Giriş durumu',
      secenekler: [
        { deger: 'var', etiket: 'Giriş yaptı' },
        { deger: 'yok', etiket: 'Giriş yapmadı' }
      ],
      uygula: (q, v) => (v === 'var' ? q.not('checked_in_at', 'is', null)
                                     : q.is('checked_in_at', null))
    }
  ],

  sutunlar: [
    { baslik: 'Kayıt no', sirala: 'registration_no', sinif: 'tablo__no',
      render: (r) => r.registration_no || '—' },
    { baslik: 'Ad soyad', sirala: 'full_name', render: (r) => r.full_name },
    { baslik: 'Şehir', sirala: 'city', render: (r) => r.city || '—' },
    { baslik: 'Günler', render: (r) => gunRozetleri(r.days) },
    { baslik: 'Giriş', render: (r) => r.checked_in_at
        ? el('span', { class: 'durum durum--approved' }, 'Giriş yaptı')
        : el('span', { class: 'durum durum--notr' }, '—') },
    { baslik: 'Kayıt tarihi', sirala: 'created_at', sinif: 'tablo__tarih',
      render: (r) => tarihSaat(r.created_at) }
  ],

  bosBaslik: 'Henüz ziyaretçi kaydı yok',
  bosMetin: 'Siteden gelen ön kayıtlar burada listelenecek.',

  csv: {
    dosya: 'giresun-expo-ziyaretci-kayitlari',
    basliklar: ['Kayıt No', 'Ad soyad', 'E-posta', 'Telefon', 'Şehir', 'Sektör',
                'Günler', 'Giriş zamanı', 'Kayıt tarihi'],
    satir: (r) => [
      r.registration_no, r.full_name, r.email, r.phone, r.city, r.sector,
      (r.days || []).join(', '),
      r.checked_in_at ? tarihSaat(r.checked_in_at) : '',
      tarihSaat(r.created_at)
    ]
  },
  csvGunluk: (n) => gunlukYaz({
    tablo: 'visitor_registrations', islem: 'export',
    ozet: `${n} ziyaretçi kaydı CSV olarak indirildi`
  }),

  cekmece: (r, arac) => {
    const girisBtn = el('button', {
      class: r.checked_in_at ? 'btn btn--ghost' : 'btn btn--primary', type: 'button'
    }, r.checked_in_at ? 'Girişi geri al' : 'Giriş yaptı olarak işaretle');

    girisBtn.addEventListener('click', async () => {
      const geriAl = !!r.checked_in_at;

      if (geriAl) {
        const eminMi = await onayla({
          baslik: 'Giriş kaydı geri alınsın mı?',
          metin: `${r.full_name} için giriş kaydı silinecek.`,
          onayMetni: 'Evet, geri al'
        });
        if (!eminMi) return;
      }

      girisBtn.disabled = true;
      girisBtn.classList.add('is-loading');

      const { error } = await sb.from('visitor_registrations')
        .update({ checked_in_at: geriAl ? null : new Date().toISOString() })
        .eq('id', r.id);

      girisBtn.disabled = false;
      girisBtn.classList.remove('is-loading');

      if (error) { toast('Kaydedilemedi: ' + error.message, 'hata', 8000); return; }

      gunlukYaz({
        tablo: 'visitor_registrations', kayit_id: r.id, islem: 'update',
        ozet: `${r.registration_no || r.full_name}: ${geriAl ? 'giriş geri alındı' : 'giriş yapıldı'}`
      });

      toast(geriAl ? 'Giriş geri alındı.' : 'Giriş kaydedildi.', 'basari');
      arac.kapat();
      arac.yenile();
      ozetYukle();
    });

    const silBtn = oturum.admin.role === 'owner'
      ? el('button', { class: 'btn btn--tehlike btn--sm', type: 'button' }, 'Sil')
      : null;

    if (silBtn) {
      silBtn.addEventListener('click', async () => {
        const eminMi = await onayla({
          baslik: 'Kayıt silinsin mi?',
          metin: `${r.full_name} (${r.registration_no || 'numarasız'}) kalıcı olarak silinecek. ` +
                 'Bu işlem geri alınamaz.',
          onayMetni: 'Evet, sil', tehlike: true
        });
        if (!eminMi) return;

        const { error } = await sb.from('visitor_registrations').delete().eq('id', r.id);
        if (error) { toast('Silinemedi: ' + error.message, 'hata', 8000); return; }

        gunlukYaz({
          tablo: 'visitor_registrations', kayit_id: r.id, islem: 'delete',
          ozet: `${r.registration_no || r.full_name} silindi`
        });
        toast('Kayıt silindi.', 'basari');
        arac.kapat(); arac.yenile(); ozetYukle();
      });
    }

    return {
      baslik: r.full_name,
      govde: el('dl', { class: 'kunye' },
        kunye('Kayıt no', r.registration_no || '—'),
        kunye('Ad soyad', r.full_name),
        kunye('E-posta', el('a', { href: 'mailto:' + r.email }, r.email)),
        kunye('Telefon', r.phone
          ? el('a', { href: 'tel:' + r.phone.replace(/\s/g, '') }, r.phone) : '—'),
        kunye('Şehir', r.city || '—'),
        kunye('Sektör', r.sector || '—'),
        kunye('Gelmeyi planladığı günler', gunRozetleri(r.days)),
        kunye('Giriş zamanı', r.checked_in_at ? tarihSaat(r.checked_in_at) : 'Henüz giriş yapmadı'),
        kunye('Kayıt tarihi', tarihSaat(r.created_at))
      ),
      eylemler: [girisBtn, silBtn]
    };
  }
});

function gunRozetleri(gunlerDizi) {
  if (!gunlerDizi || !gunlerDizi.length) return '—';
  return el('span', { style: 'display:flex;gap:4px;flex-wrap:wrap' },
    gunlerDizi.map((g) => el('span', { class: 'durum durum--notr' },
      String(g).slice(8, 10) + '.' + String(g).slice(5, 7))));
}
