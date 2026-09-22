/* ==========================================================================
   Yönetim paneli — Yetkiniz yok
   assets/js/admin/yetkiniz-yok.js

   korumaliSayfa('owner') bir editörü buraya yollar. Sayfa kabuğu kurulur ki
   kullanıcı menüden erişebildiği yerlere geçebilsin — çıkmaz sokak olmasın.
   ========================================================================== */

import { korumaliSayfa, oturumIzle } from './auth.js';
import { el, kabukKur, durumKutusu } from './ui.js';

const oturum = await korumaliSayfa();
oturumIzle();

const icerik = kabukKur({ aktif: null, baslik: 'Yetkiniz Yok', oturum });

icerik.append(
  el('section', { class: 'panel' },
    durumKutusu({
      tur: 'hata',
      baslik: 'Bu sayfaya erişim yetkiniz yok',
      metin: 'Bu bölüm yalnızca "sahip" rolündeki kullanıcılara açık. ' +
             `Sizin rolünüz: ${oturum.admin.role === 'owner' ? 'sahip' : 'editör'}. ` +
             'Erişim gerekiyorsa panel sahibinden rolünüzü yükseltmesini isteyin.',
      eylem: el('a', { class: 'btn btn--primary', href: 'pano.html' }, 'Panoya dön')
    }))
);
