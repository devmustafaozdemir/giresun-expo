/* ==========================================================================
   Yönetim paneli — Mesajlar
   assets/js/admin/mesajlar.js

   Gelen kutusu: okundu/okunmadı, arşiv, mailto: ile yanıt.
   Çekmece açıldığında mesaj otomatik olarak okundu işaretlenir.
   ========================================================================== */

import { getClient } from '../supabase-client.js';
import { korumaliSayfa, oturumIzle } from './auth.js';
import { gunlukYaz } from './gunluk.js';
import { listeSayfasi, kunye } from './liste.js';
import { el, kabukKur, tarihSaat, toast, onayla } from './ui.js';

const oturum = await korumaliSayfa();
oturumIzle();

const icerik = kabukKur({ aktif: 'mesaj', baslik: 'Mesajlar', oturum });
const sb = await getClient();

const liste = await listeSayfasi(icerik, {
  baslik: 'Mesajlar',
  altBaslik: 'İletişim formundan gelen mesajlar. Satıra tıklayınca okundu sayılır.',
  tablo: 'contact_messages',
  secim: 'id, name, email, subject, message, is_read, is_archived, created_at',
  aramaAlanlari: ['name', 'email', 'subject', 'message'],
  aramaIpucu: 'Gönderen, e-posta, konu veya mesaj içinde…',

  suzgecler: [
    {
      ad: 'okundu', etiket: 'Okunma durumu',
      secenekler: [
        { deger: 'yok', etiket: 'Okunmamış' },
        { deger: 'var', etiket: 'Okunmuş' }
      ],
      uygula: (q, v) => q.eq('is_read', v === 'var')
    },
    {
      ad: 'arsiv', etiket: 'Arşiv',
      secenekler: [
        { deger: 'haric', etiket: 'Arşiv hariç' },
        { deger: 'sadece', etiket: 'Yalnızca arşiv' }
      ],
      uygula: (q, v) => q.eq('is_archived', v === 'sadece')
    }
  ],

  satirSinifi: (r) => (r.is_read ? null : 'is-okunmamis'),

  sutunlar: [
    { baslik: 'Gönderen', sirala: 'name', render: (r) => el('span', null,
        r.is_read ? null : el('span', { class: 'durum durum--new',
                                        style: 'margin-right:6px' }, 'Yeni'),
        r.name) },
    { baslik: 'Konu', sirala: 'subject', render: (r) => r.subject || '—' },
    { baslik: 'Özet', render: (r) => kisalt(r.message, 70) },
    { baslik: 'Durum', render: (r) => r.is_archived
        ? el('span', { class: 'durum durum--notr' }, 'Arşiv')
        : el('span', { class: 'durum durum--' + (r.is_read ? 'notr' : 'new') },
             r.is_read ? 'Okundu' : 'Okunmadı') },
    { baslik: 'Tarih', sirala: 'created_at', sinif: 'tablo__tarih',
      render: (r) => tarihSaat(r.created_at) }
  ],

  bosBaslik: 'Henüz mesaj yok',
  bosMetin: 'İletişim formundan gelen mesajlar burada listelenecek.',

  sayac: async (sbx) => {
    const { count } = await sbx.from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false).eq('is_archived', false);
    return { ad: 'mesaj', deger: count ?? 0 };
  },

  csv: {
    dosya: 'giresun-expo-mesajlar',
    basliklar: ['Gönderen', 'E-posta', 'Konu', 'Mesaj', 'Okundu', 'Arşiv', 'Tarih'],
    satir: (r) => [r.name, r.email, r.subject, r.message,
                   r.is_read ? 'Evet' : 'Hayır', r.is_archived ? 'Evet' : 'Hayır',
                   tarihSaat(r.created_at)]
  },
  csvGunluk: (n) => gunlukYaz({
    tablo: 'contact_messages', islem: 'export', ozet: `${n} mesaj CSV olarak indirildi`
  }),

  cekmece: (r, arac) => {
    /* Açılınca okundu say. Kullanıcı mesajı gördü; ayrıca tıklaması gereksiz. */
    if (!r.is_read) {
      sb.from('contact_messages').update({ is_read: true }).eq('id', r.id)
        .then(({ error }) => {
          if (!error) { r.is_read = true; liste.yukle(); }
        });
    }

    /* Yanıt: mailto:. Konu ve alıntı hazır gelir. */
    const konu = 'Re: ' + (r.subject || 'Giresun EXPO 2026');
    const govdeMetni =
      `\n\n--- ${tarihSaat(r.created_at)} tarihinde ${r.name} yazdı ---\n` +
      r.message.split('\n').map((s) => '> ' + s).join('\n');

    const yanitBtn = el('a', {
      class: 'btn btn--primary',
      href: `mailto:${encodeURIComponent(r.email)}` +
            `?subject=${encodeURIComponent(konu)}&body=${encodeURIComponent(govdeMetni)}`
    }, 'E-posta ile yanıtla');

    const okunmamisBtn = el('button', { class: 'btn btn--ghost', type: 'button' },
      'Okunmadı olarak işaretle');
    okunmamisBtn.addEventListener('click', async () => {
      const { error } = await sb.from('contact_messages')
        .update({ is_read: false }).eq('id', r.id);
      if (error) { toast('Kaydedilemedi: ' + error.message, 'hata', 8000); return; }
      toast('Okunmadı olarak işaretlendi.', 'basari');
      arac.kapat(); arac.yenile();
    });

    const arsivBtn = el('button', { class: 'btn btn--secondary', type: 'button' },
      r.is_archived ? 'Arşivden çıkar' : 'Arşivle');
    arsivBtn.addEventListener('click', async () => {
      const { error } = await sb.from('contact_messages')
        .update({ is_archived: !r.is_archived }).eq('id', r.id);
      if (error) { toast('Kaydedilemedi: ' + error.message, 'hata', 8000); return; }
      gunlukYaz({
        tablo: 'contact_messages', kayit_id: r.id, islem: 'update',
        ozet: `${r.name} mesajı ${r.is_archived ? 'arşivden çıkarıldı' : 'arşivlendi'}`
      });
      toast(r.is_archived ? 'Arşivden çıkarıldı.' : 'Arşivlendi.', 'basari');
      arac.kapat(); arac.yenile();
    });

    const silBtn = oturum.admin.role === 'owner'
      ? el('button', { class: 'btn btn--tehlike btn--sm', type: 'button' }, 'Sil')
      : null;

    if (silBtn) {
      silBtn.addEventListener('click', async () => {
        const eminMi = await onayla({
          baslik: 'Mesaj silinsin mi?',
          metin: `${r.name} tarafından gönderilen mesaj kalıcı olarak silinecek. ` +
                 'Arşivlemek çoğu durumda daha iyidir.',
          onayMetni: 'Evet, sil', tehlike: true
        });
        if (!eminMi) return;
        const { error } = await sb.from('contact_messages').delete().eq('id', r.id);
        if (error) { toast('Silinemedi: ' + error.message, 'hata', 8000); return; }
        gunlukYaz({
          tablo: 'contact_messages', kayit_id: r.id, islem: 'delete',
          ozet: `${r.name} mesajı silindi`
        });
        toast('Mesaj silindi.', 'basari');
        arac.kapat(); arac.yenile();
      });
    }

    return {
      baslik: r.subject || `${r.name} — mesaj`,
      govde: el('div', null,
        el('dl', { class: 'kunye' },
          kunye('Gönderen', r.name),
          kunye('E-posta', el('a', { href: 'mailto:' + r.email }, r.email)),
          kunye('Konu', r.subject || '—'),
          kunye('Tarih', tarihSaat(r.created_at))
        ),
        el('div', { style: 'margin-top:var(--space-5)' },
          el('p', { class: 'form__label' }, 'Mesaj'),
          /* white-space: pre-wrap — satır sonları korunur, innerHTML gerekmez */
          el('div', {
            style: 'white-space:pre-wrap;background:var(--color-surface);' +
                   'border:1px solid var(--color-border);border-radius:var(--radius);' +
                   'padding:var(--space-4);line-height:1.65;overflow-wrap:anywhere'
          }, r.message))
      ),
      eylemler: [yanitBtn, arsivBtn, okunmamisBtn, silBtn]
    };
  }
});

function kisalt(s, n) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n) + '…' : (t || '—');
}
