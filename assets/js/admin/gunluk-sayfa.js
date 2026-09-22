/* ==========================================================================
   Yönetim paneli — Etkinlik Günlüğü
   assets/js/admin/gunluk-sayfa.js

   Kim, ne zaman, neyi değiştirdi. Salt okunur: günlük satırları panelden
   değiştirilemez ve silinemez (RLS'te de yalnızca select ve insert var).
   ========================================================================== */

import { korumaliSayfa, oturumIzle } from './auth.js';
import { listeSayfasi, kunye } from './liste.js';
import { el, kabukKur, tarihSaat, gorece } from './ui.js';

const oturum = await korumaliSayfa();
oturumIzle();

const icerik = kabukKur({ aktif: 'gunluk', baslik: 'Etkinlik Günlüğü', oturum });

const ISLEM = {
  insert: 'Ekleme', update: 'Güncelleme', delete: 'Silme',
  login: 'Giriş',   export: 'Dışa aktarma'
};
const ISLEM_SINIF = {
  insert: 'approved', update: 'reviewing', delete: 'rejected',
  login: 'notr',      export: 'new'
};
const TABLO_ADI = {
  stand_applications: 'Firma kayıtları',
  visitor_registrations: 'Ziyaretçi kayıtları',
  contact_messages: 'Mesajlar',
  exhibitors: 'Katılımcılar',
  site_settings: 'Site ayarları',
  admins: 'Kullanıcılar',
  sectors: 'Sektörler',
  faqs: 'SSS',
  sponsors: 'Paydaşlar',
  transport_options: 'Ulaşım',
  program_sessions: 'Program'
};

await listeSayfasi(icerik, {
  baslik: 'Etkinlik Günlüğü',
  altBaslik: 'Panelde yapılan değişikliklerin kaydı. Bu liste salt okunurdur.',
  tablo: 'activity_log',
  secim: 'id, user_email, tablo, kayit_id, islem, ozet, created_at',
  aramaAlanlari: ['user_email', 'ozet', 'tablo'],
  aramaIpucu: 'Kullanıcı, tablo veya açıklama içinde…',
  varsayilanSirala: 'created_at',

  suzgecler: [
    {
      ad: 'islem', etiket: 'Tüm işlemler',
      secenekler: Object.entries(ISLEM).map(([d, e]) => ({ deger: d, etiket: e })),
      uygula: (q, v) => q.eq('islem', v)
    },
    {
      ad: 'tablo', etiket: 'Tüm bölümler',
      secenekler: Object.entries(TABLO_ADI).map(([d, e]) => ({ deger: d, etiket: e })),
      uygula: (q, v) => q.eq('tablo', v)
    }
  ],

  sutunlar: [
    { baslik: 'Ne zaman', sirala: 'created_at', sinif: 'tablo__tarih',
      render: (r) => gorece(r.created_at) },
    { baslik: 'Kim', sirala: 'user_email', render: (r) => r.user_email || '—' },
    { baslik: 'İşlem', sirala: 'islem', render: (r) =>
        el('span', { class: 'durum durum--' + (ISLEM_SINIF[r.islem] || 'notr') },
           ISLEM[r.islem] || r.islem) },
    { baslik: 'Bölüm', sirala: 'tablo', render: (r) => TABLO_ADI[r.tablo] || r.tablo },
    { baslik: 'Açıklama', render: (r) => r.ozet || '—' }
  ],

  bosBaslik: 'Günlük boş',
  bosMetin: 'Panelde bir değişiklik yapıldığında burada görünecek.',

  csv: {
    dosya: 'giresun-expo-etkinlik-gunlugu',
    basliklar: ['Tarih', 'Kullanıcı', 'İşlem', 'Bölüm', 'Kayıt', 'Açıklama'],
    satir: (r) => [tarihSaat(r.created_at), r.user_email,
                   ISLEM[r.islem] || r.islem, TABLO_ADI[r.tablo] || r.tablo,
                   r.kayit_id, r.ozet]
  },

  cekmece: (r) => ({
    baslik: (ISLEM[r.islem] || r.islem) + ' — ' + (TABLO_ADI[r.tablo] || r.tablo),
    govde: el('dl', { class: 'kunye' },
      kunye('Tarih', tarihSaat(r.created_at)),
      kunye('Kullanıcı', r.user_email || '—'),
      kunye('İşlem', ISLEM[r.islem] || r.islem),
      kunye('Bölüm', TABLO_ADI[r.tablo] || r.tablo),
      kunye('Kayıt kimliği', r.kayit_id || '—'),
      kunye('Açıklama', r.ozet || '—'))
  })
});
