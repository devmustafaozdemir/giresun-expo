/* ==========================================================================
   Yönetim paneli — oturum katmanı
   assets/js/admin/auth.js

   Güvenlik modeli:
     Auth kullanıcısı olmak panele erişim VERMEZ. Erişim için kullanıcının
     ayrıca public.admins tablosunda bir satırı olması gerekir. O satırı
     okumak da RLS ile korunuyor (admins_select using is_admin()), yani
     admin olmayan bir oturum sorguyu çalıştırsa bile 0 satır görür.

     Bu kontrol istemcide "gizle/göster" olarak yapılmaz; veritabanı zaten
     reddeder. Buradaki yönlendirme sadece kullanıcı deneyimi içindir.
   ========================================================================== */

import { getClient } from '../supabase-client.js';

/** Panelin kökü, sayfanın derinliğinden bağımsız (GitHub Pages alt yolu). */
function girisUrl() {
  return new URL('index.html', document.baseURI).href;
}

let _onbellek = null;   // { user, admin } — sayfa ömrü boyunca

/**
 * Oturumdaki kullanıcıyı ve admin kaydını döndürür.
 * Yetkisi yoksa veya oturum yoksa null döner. Hata fırlatmaz.
 */
export async function mevcutAdmin({ tazele = false } = {}) {
  if (_onbellek && !tazele) return _onbellek;

  const sb = await getClient();
  if (!sb) return null;

  const { data: { session } } = await sb.auth.getSession();
  if (!session) return null;

  const { data, error } = await sb
    .from('admins')
    .select('id, user_id, email, ad_soyad, role')
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (error || !data) return null;

  _onbellek = { user: session.user, admin: data };
  return _onbellek;
}

/**
 * Korumalı sayfaların en başında çağrılır.
 * Yetki yoksa giriş sayfasına yollar ve asla çözülmeyen bir söz döndürür
 * (böylece çağıran sayfa içeriği kurmaya devam etmez).
 *
 * @param {'owner'|'editor'} [gerekliRol] verilirse rol de denetlenir
 */
export async function korumaliSayfa(gerekliRol) {
  const oturum = await mevcutAdmin();

  if (!oturum) {
    const nereye = location.href;
    location.replace(girisUrl() + '?devam=' + encodeURIComponent(nereye));
    return new Promise(() => {});          // sayfa kurulumunu durdur
  }

  if (gerekliRol === 'owner' && oturum.admin.role !== 'owner') {
    location.replace(new URL('yetkiniz-yok.html', document.baseURI).href);
    return new Promise(() => {});
  }

  return oturum;
}

/**
 * E-posta + parola ile giriş.
 * @returns {Promise<{tamam: boolean, mesaj?: string}>}
 */
export async function girisYap(eposta, sifre) {
  const sb = await getClient();
  if (!sb) {
    return { tamam: false, mesaj: 'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.' };
  }

  const { data, error } = await sb.auth.signInWithPassword({
    email: String(eposta).trim().toLowerCase(),
    password: sifre
  });

  if (error) return { tamam: false, mesaj: girisHatasi(error) };
  if (!data || !data.session) return { tamam: false, mesaj: 'Oturum açılamadı. Tekrar deneyin.' };

  // Auth başarılı, ama admin mi? Değilse oturumu hemen kapat.
  const { data: kayit } = await sb
    .from('admins')
    .select('id, role')
    .eq('user_id', data.session.user.id)
    .maybeSingle();

  if (!kayit) {
    await sb.auth.signOut();
    return {
      tamam: false,
      mesaj: 'Bu hesabın yönetim paneline erişim yetkisi yok. Panel yöneticisiyle görüşün.'
    };
  }

  _onbellek = null;
  return { tamam: true };
}

/** Oturumu kapatır ve giriş sayfasına döner. */
export async function cikisYap() {
  const sb = await getClient();
  if (sb) { try { await sb.auth.signOut(); } catch { /* yoksay */ } }
  _onbellek = null;
  location.replace(girisUrl());
}

/** Parola sıfırlama bağlantısı gönderir. */
export async function sifreSifirla(eposta) {
  const sb = await getClient();
  if (!sb) return { tamam: false, mesaj: 'Sunucuya bağlanılamadı.' };

  const donus = new URL('sifre-yenile.html', document.baseURI).href;
  const { error } = await sb.auth.resetPasswordForEmail(
    String(eposta).trim().toLowerCase(),
    { redirectTo: donus }
  );

  if (error) return { tamam: false, mesaj: girisHatasi(error) };

  // Kasten her zaman aynı mesaj: adresin kayıtlı olup olmadığını ele vermeyiz.
  return {
    tamam: true,
    mesaj: 'Adres kayıtlıysa parola sıfırlama bağlantısı gönderildi. E-postanızı kontrol edin.'
  };
}

/** Supabase auth hatalarını kullanıcıya gösterilebilir Türkçeye çevirir. */
function girisHatasi(error) {
  const m = (error && error.message ? error.message : '').toLowerCase();

  if (m.includes('invalid login credentials')) return 'E-posta veya parola hatalı.';
  if (m.includes('email not confirmed'))       return 'E-posta adresi henüz doğrulanmamış.';
  if (m.includes('too many requests') || m.includes('rate limit'))
    return 'Çok fazla deneme yapıldı. Birkaç dakika sonra tekrar deneyin.';
  if (m.includes('failed to fetch') || m.includes('networkerror'))
    return 'Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin.';
  if (m.includes('signups not allowed') || m.includes('signup is disabled'))
    return 'Kayıt kapalı. Hesabınızı panel yöneticisi oluşturmalı.';

  return 'Giriş yapılamadı. Lütfen tekrar deneyin.';
}

/** Oturum düştüğünde (başka sekmede çıkış, token süresi) giriş sayfasına at. */
export async function oturumIzle() {
  const sb = await getClient();
  if (!sb) return;
  sb.auth.onAuthStateChange((olay) => {
    if (olay === 'SIGNED_OUT') {
      _onbellek = null;
      location.replace(girisUrl());
    }
  });
}
