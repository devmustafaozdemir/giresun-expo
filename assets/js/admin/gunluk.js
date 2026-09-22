/* ==========================================================================
   Yönetim paneli — etkinlik günlüğü yazıcı
   assets/js/admin/gunluk.js

   Günlük kaydı YAN ETKİDİR: yazılamazsa asıl işlem geri alınmaz ve kullanıcıya
   hata gösterilmez (yalnızca konsola uyarı düşer). Bir başvurunun durumu
   değişti ama günlük satırı yazılamadıysa, doğru davranış işlemi iptal etmek
   değil, iz kaybını sessizce kabul etmektir.
   ========================================================================== */

import { getClient } from '../supabase-client.js';
import { mevcutAdmin } from './auth.js';

/**
 * @param {object} kayit
 * @param {string} kayit.tablo     etkilenen tablo adı
 * @param {string} [kayit.kayit_id] etkilenen satırın kimliği
 * @param {'insert'|'update'|'delete'|'login'|'export'} kayit.islem
 * @param {string} [kayit.ozet]    insan tarafından okunacak kısa açıklama
 */
export async function gunlukYaz({ tablo, kayit_id = '', islem, ozet = '' }) {
  try {
    const sb = await getClient();
    if (!sb) return;

    const oturum = await mevcutAdmin();
    if (!oturum) return;

    const { error } = await sb.from('activity_log').insert({
      user_id: oturum.user.id,
      user_email: oturum.admin.email,
      tablo,
      kayit_id: String(kayit_id || ''),
      islem,
      ozet: String(ozet).slice(0, 500)
    });

    if (error) console.warn('[GE] Günlük yazılamadı:', error.message);
  } catch (e) {
    console.warn('[GE] Günlük yazılamadı:', e && e.message);
  }
}
