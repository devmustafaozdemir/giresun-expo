/* ==========================================================================
   Supabase istemcisi — tek örnek (singleton).

   Sürüm SABİTLENMİŞTİR. "latest" kullanılmaz: kütüphane bir gün kırıcı
   değişiklik yaparsa site sessizce bozulur. Sürüm yükseltmesi bilinçli
   bir commit olmalıdır.

   config.js boşsa null döner — çağıran taraf JSON yedeğine düşer.
   ========================================================================== */

const SURUM = '2.58.0';
const CDN = `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@${SURUM}/+esm`;

let istemci = null;
let denendi = false;

/**
 * Supabase istemcisini döndürür; yapılandırma yoksa veya kütüphane
 * yüklenemezse null döner. Hiçbir zaman hata fırlatmaz — public site
 * Supabase olmadan da çalışmak zorunda.
 */
export async function getClient() {
  if (denendi) return istemci;
  denendi = true;

  const cfg = window.GE_CONFIG;
  if (!cfg || !cfg.hazir) return null;

  try {
    const { createClient } = await import(/* @vite-ignore */ CDN);
    istemci = createClient(cfg.SUPABASE_URL.replace(/\/$/, ''), cfg.SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
      global: { headers: { 'x-client-info': 'giresun-expo-web' } }
    });
    return istemci;
  } catch (e) {
    console.warn('[GE] Supabase yüklenemedi, JSON yedeğine düşülüyor:', e && e.message);
    istemci = null;
    return null;
  }
}

/** Supabase yapılandırılmış mı? (ağ denemesi yapmaz) */
export function yapilandirildiMi() {
  return !!(window.GE_CONFIG && window.GE_CONFIG.hazir);
}
