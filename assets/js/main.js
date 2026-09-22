/* ==========================================================================
   Giresun Expo — main.js
   Harici bağımlılık yok. <script defer> ile yüklenir.
   İçerik: mobil menü (aç/kapat, erişilebilirlik, kapanma senaryoları) + footer yılı.
   ========================================================================== */
(function () {
  "use strict";

  var DESKTOP_BREAKPOINT = 1024; /* style.css bölüm 12 ile aynı olmalı */

  /* ---- Mobil menü ------------------------------------------------------ */
  function initNav() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var toggle = header.querySelector(".nav-toggle");
    var nav = header.querySelector(".site-nav");
    var overlay = header.querySelector(".nav-overlay");
    if (!toggle || !nav) return;

    function isOpen() {
      return header.classList.contains("is-open");
    }

    function setOpen(open) {
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("is-locked", open);
    }

    function close(refocus) {
      if (!isOpen()) return;
      setOpen(false);
      if (refocus) toggle.focus();
    }

    toggle.addEventListener("click", function () {
      setOpen(!isOpen());
    });

    /* Örtüye tıklama */
    if (overlay) {
      overlay.addEventListener("click", function () {
        close(false);
      });
    }

    /* Menü içindeki bir linke tıklanınca kapat */
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) close(false);
    });

    /* Esc ile kapat, odağı hamburgere geri ver */
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" || event.key === "Esc") close(true);
    });

    /* Menü dışına tıklama (örtünün olmadığı durumlar için güvence) */
    document.addEventListener("click", function (event) {
      if (!isOpen()) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      close(false);
    });

    /* Masaüstü genişliğine çıkılınca durumu sıfırla */
    var resizeTimer = null;
    window.addEventListener("resize", function () {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (window.innerWidth >= DESKTOP_BREAKPOINT) close(false);
      }, 150);
    });
  }

  /* ---- Footer telif yılı ----------------------------------------------- */
  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---- Bölümlere girişte hafif fade/slide ------------------------------
     .reveal sınıfı olan öğeler görünür alana girince .is-visible alır.
     prefers-reduced-motion altında hiç gözlem açılmaz, hepsi anında görünür
     (CSS zaten .reveal'ı nötrler, burada sınıfı da ekleyip garantiye alıyoruz). */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add("is-visible");
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) continue;
        entries[i].target.classList.add("is-visible");
        observer.unobserve(entries[i].target);   /* bir kez oynar */
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });

    for (var j = 0; j < items.length; j++) observer.observe(items[j]);
  }

  initNav();
  initYear();
  initReveal();
})();
