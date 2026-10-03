/* ==========================================================================
   Yönetim paneli — Araç ve Yaka Kartları
   assets/js/admin/arac-yaka-kartlari.js

   yaka-karti.html formundan gelen kayıtlar: firma başına 1 araç plakası ve
   stantta görevli en fazla 4 personel (supabase/migrations/008_stant_personel.sql).
   Kartlar stant tesliminde verilir; buradan teslim edildi olarak işaretlenir.
   ========================================================================== */

import { getClient } from '../supabase-client.js';
import { korumaliSayfa, oturumIzle } from './auth.js';
import { gunlukYaz } from './gunluk.js';
import { listeSayfasi, kunye } from './liste.js';
import { el, kabukKur, tarihSaat, toast, onayla, durumKutusu } from './ui.js';

const oturum = await korumaliSayfa();
oturumIzle();

const icerik = kabukKur({ aktif: 'kart', baslik: 'Araç ve Yaka Kartları', oturum });
const sb = await getClient();

const TABLO = 'stand_staff_cards';
const ozet = el('div');

const personel = (r) => (r.staff || []).filter(Boolean);
const teslimRozeti = (r) => r.delivered_at
  ? el('span', { class: 'durum durum--approved' }, 'Teslim edildi')
  : el('span', { class: 'durum durum--new' }, 'Bekliyor');

/* --- Liste --- */
await listeSayfasi(icerik, {
  baslik: 'Araç ve Yaka Kartları',
  altBaslik: 'Katılımcı firmaların araç plakası ve stantta görevli personel bilgileri. ' +
             'Form adresi: giresunexpo.com/yakakarti',
  tablo: TABLO,
  secim: 'id, exhibitor_slug, exhibitor_name, plate, staff, delivered_at, created_at',
  aramaAlanlari: ['exhibitor_name', 'plate'],
  aramaIpucu: 'Firma adı veya plaka…',

  suzgecler: [{
    ad: 'teslim', etiket: 'Tüm durumlar',
    secenekler: [
      { deger: 'bekliyor', etiket: 'Bekliyor' },
      { deger: 'teslim', etiket: 'Teslim edildi' }
    ],
    uygula: (q, v) => (v === 'teslim' ? q.not('delivered_at', 'is', null)
                                      : q.is('delivered_at', null))
  }],

  sutunlar: [
    { baslik: 'Firma', sirala: 'exhibitor_name', render: (r) => r.exhibitor_name },
    { baslik: 'Plaka', sirala: 'plate', sinif: 'tablo__no', render: (r) => r.plate },
    { baslik: 'Görevli personel', render: (r) => personel(r).join(', ') || '—' },
    { baslik: 'Kart', render: teslimRozeti },
    { baslik: 'Gönderim', sirala: 'created_at', sinif: 'tablo__tarih',
      render: (r) => tarihSaat(r.created_at) }
  ],

  bosBaslik: 'Henüz bilgi gönderilmedi',
  bosMetin: 'Firmalar giresunexpo.com/yakakarti formunu doldurdukça burada listelenecek.',

  csv: {
    dosya: 'giresun-expo-arac-yaka-kartlari',
    basliklar: ['Firma', 'Plaka', 'Personel 1', 'Personel 2', 'Personel 3', 'Personel 4',
                'Personel sayısı', 'Kart durumu', 'Teslim zamanı', 'Gönderim'],
    satir: (r) => {
      const p = personel(r);
      return [r.exhibitor_name, r.plate, p[0] || '', p[1] || '', p[2] || '', p[3] || '',
              p.length, r.delivered_at ? 'Teslim edildi' : 'Bekliyor',
              r.delivered_at ? tarihSaat(r.delivered_at) : '', tarihSaat(r.created_at)];
    }
  },
  csvGunluk: (n) => gunlukYaz({
    tablo: TABLO, islem: 'export', ozet: `${n} araç/yaka kartı kaydı CSV olarak indirildi`
  }),

  cekmece: (r, arac) => {
    const geriAl = !!r.delivered_at;
    const teslimBtn = el('button', {
      class: geriAl ? 'btn btn--ghost' : 'btn btn--primary', type: 'button'
    }, geriAl ? 'Teslimi geri al' : 'Kartlar teslim edildi');

    teslimBtn.addEventListener('click', async () => {
      if (geriAl) {
        const eminMi = await onayla({
          baslik: 'Teslim kaydı geri alınsın mı?',
          metin: `${r.exhibitor_name} için kartlar "bekliyor" durumuna dönecek.`,
          onayMetni: 'Evet, geri al'
        });
        if (!eminMi) return;
      }

      teslimBtn.disabled = true;
      teslimBtn.classList.add('is-loading');
      const { error } = await sb.from(TABLO)
        .update({ delivered_at: geriAl ? null : new Date().toISOString() })
        .eq('id', r.id);
      teslimBtn.disabled = false;
      teslimBtn.classList.remove('is-loading');

      if (error) { toast('Kaydedilemedi: ' + error.message, 'hata', 8000); return; }

      gunlukYaz({
        tablo: TABLO, kayit_id: String(r.id), islem: 'update',
        ozet: `${r.exhibitor_name} (${r.plate}): ${geriAl ? 'kart teslimi geri alındı' : 'kartlar teslim edildi'}`
      });
      toast(geriAl ? 'Teslim geri alındı.' : 'Kartlar teslim edildi olarak işaretlendi.', 'basari');
      arac.kapat(); arac.yenile(); ozetYukle();
    });

    const silBtn = oturum.admin.role === 'owner'
      ? el('button', { class: 'btn btn--tehlike btn--sm', type: 'button' }, 'Sil')
      : null;

    if (silBtn) {
      silBtn.addEventListener('click', async () => {
        const eminMi = await onayla({
          baslik: 'Kayıt silinsin mi?',
          metin: `${r.exhibitor_name} firmasının ${tarihSaat(r.created_at)} tarihli gönderimi ` +
                 'kalıcı olarak silinecek. Bu işlem geri alınamaz.',
          onayMetni: 'Evet, sil', tehlike: true
        });
        if (!eminMi) return;

        const { error } = await sb.from(TABLO).delete().eq('id', r.id);
        if (error) { toast('Silinemedi: ' + error.message, 'hata', 8000); return; }

        gunlukYaz({
          tablo: TABLO, kayit_id: String(r.id), islem: 'delete',
          ozet: `${r.exhibitor_name} (${r.plate}) araç/yaka kartı kaydı silindi`
        });
        toast('Kayıt silindi.', 'basari');
        arac.kapat(); arac.yenile(); ozetYukle();
      });
    }

    const p = personel(r);
    return {
      baslik: r.exhibitor_name,
      govde: el('dl', { class: 'kunye' },
        kunye('Firma', r.exhibitor_name),
        kunye('Araç plakası', r.plate),
        kunye('Görevli personel', p.length
          ? el('ol', { style: 'margin:0;padding-left:1.25em' }, p.map((a) => el('li', null, a)))
          : '—'),
        kunye('Kart durumu', r.delivered_at
          ? `Teslim edildi — ${tarihSaat(r.delivered_at)}` : 'Bekliyor'),
        kunye('Gönderim', tarihSaat(r.created_at))),
      eylemler: [teslimBtn, silBtn]
    };
  }
});

const bas = icerik.querySelector('.sayfa-bas');
if (bas) bas.after(ozet); else icerik.prepend(ozet);
ozetYukle();

/* --- Özet ----------------------------------------------------------------- */

async function ozetYukle() {
  if (!sb) return;

  const { data, error } = await sb.from(TABLO)
    .select('exhibitor_slug, staff, delivered_at').limit(5000);

  if (error) {
    ozet.replaceChildren(el('section', { class: 'panel', style: 'margin-bottom:var(--space-6)' },
      el('div', { class: 'panel__govde' }, durumKutusu({
        tur: 'hata',
        baslik: 'Kayıtlar okunamadı',
        metin: 'supabase/migrations/008_stant_personel.sql çalıştırılmamış olabilir. ' + error.message
      }))));
    return;
  }

  const satirlar = data || [];
  const firma = new Set(satirlar.map((s) => s.exhibitor_slug)).size;
  const yaka = satirlar.reduce((t, s) => t + personel(s).length, 0);
  const teslim = satirlar.filter((s) => s.delivered_at).length;

  ozet.replaceChildren(el('div', { class: 'istatistik-izgara' },
    istKart('Firma', firma, satirlar.length > firma
      ? `${satirlar.length} gönderim (bazı firmalar birden fazla gönderdi)` : null),
    istKart('Araç kartı', satirlar.length),
    istKart('Yaka kartı', yaka),
    istKart('Teslim edildi', teslim, `${satirlar.length - teslim} gönderim bekliyor`)
  ));
}

function istKart(etiket, deger, alt) {
  return el('div', { class: 'ist-kart' },
    el('p', { class: 'ist-kart__etiket' }, etiket),
    el('p', { class: 'ist-kart__deger' }, String(deger)),
    alt ? el('p', { class: 'ist-kart__alt' }, alt) : null
  );
}
