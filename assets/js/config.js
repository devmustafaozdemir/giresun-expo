/* ==========================================================================
   Giresun EXPO 2026 — Supabase yapılandırması

   BURAYI DOLDURUN. İki değer de Supabase panelinde:
     Project Settings -> API
       Project URL            -> SUPABASE_URL
       Project API keys -> anon / publishable  -> SUPABASE_ANON_KEY

   GÜVENLİK
   - anon (publishable) anahtarı tarayıcıda durmak ÜZERE tasarlanmıştır;
     burada bulunması normaldir. Güvenliğin tamamı RLS politikalarına dayanır
     (bkz. supabase/migrations/001_init.sql bölüm 6).
   - service_role anahtarı ASLA bu dosyaya veya repoya girmez. O anahtar RLS'i
     tamamen atlar; tarayıcıya konursa tüm başvuru ve kayıtlar okunabilir hale
     gelir.

   BOŞ BIRAKILIRSA
   Site çalışmaya devam eder: içerik data/*.json dosyalarından okunur,
   formlar "gönderim etkin değil" uyarısı gösterir. Yani bu dosya
   doldurulmadan da site yayında durabilir.
   ========================================================================== */
window.GE_CONFIG = {
  SUPABASE_URL: 'https://ktjchovsqvjeuurhxvck.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_uX8oYyG6RUOzvkmQH4te9g_I_OA3CWk'
};

/* Yapılandırma gerçekten dolu mu? Yer tutucu metinler "dolu" sayılmaz. */
window.GE_CONFIG.hazir = (function () {
  var c = window.GE_CONFIG;
  var u = (c.SUPABASE_URL || '').trim();
  var k = (c.SUPABASE_ANON_KEY || '').trim();
  if (!u || !k) return false;
  if (u.indexOf('XXXX') !== -1 || k.indexOf('XXXX') !== -1) return false;
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(u)) return false;
  return true;
})();
