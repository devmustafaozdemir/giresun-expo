/* ==========================================================================
   Giresun EXPO 2026 — main.js
   Harici bağımlılık yok. Her sayfada <script src="…/main.js" defer>.

   İçerik:
     01. Mobil menü          04. Sekmeler
     02. Geri sayım          05. Çerez bandı
     03. Akordeon            06. Reveal + footer yılı

   KURAL: Kullanıcıdan/veriden gelen metin DOM'a asla innerHTML ile basılmaz.
   ========================================================================== */
(function () {
  "use strict";

  var DESKTOP_BREAKPOINT = 1140;  /* style.css bölüm 21 ile eş olmalı */

  /* =======================================================================
     01. Mobil menü
     ======================================================================= */
  function initNav() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var toggle = header.querySelector(".nav-toggle");
    var nav = header.querySelector(".site-nav");
    var overlay = header.querySelector(".nav-overlay");
    if (!toggle || !nav) return;

    function isOpen() { return header.classList.contains("is-open"); }

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

    toggle.addEventListener("click", function () { setOpen(!isOpen()); });

    if (overlay) overlay.addEventListener("click", function () { close(false); });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) close(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" || e.key === "Esc") close(true);
    });

    document.addEventListener("click", function (e) {
      if (!isOpen()) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      close(false);
    });

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (window.innerWidth >= DESKTOP_BREAKPOINT) close(false);
      }, 150);
    });
  }

  /* =======================================================================
     02. Geri sayım — üç durum: öncesi / sırasında / sonrası
     Markup, JS çalışmazsa anlamlı bir yedek metin içerir; JS yalnızca
     o metnin yerine canlı sayacı koyar.
     ======================================================================= */
  function initCountdown() {
    var el = document.getElementById("countdown");
    if (!el) return;

    var body = el.querySelector("[data-countdown-body]");
    var start = Date.parse(el.dataset.start || "");
    var end = Date.parse(el.dataset.end || "");
    if (!body || isNaN(start) || isNaN(end)) return;

    var labels = {
      gun: el.dataset.labelGun || "Gün",
      saat: el.dataset.labelSaat || "Saat",
      dakika: el.dataset.labelDakika || "Dakika",
      saniye: el.dataset.labelSaniye || "Saniye"
    };

    function statusNode(text) {
      var p = document.createElement("p");
      p.className = "countdown__status";
      p.textContent = text;
      return p;
    }

    function unitNode(value, label) {
      var wrap = document.createElement("div");
      wrap.className = "countdown__unit";
      var num = document.createElement("span");
      num.className = "countdown__num";
      num.textContent = value < 10 ? "0" + value : String(value);
      var lab = document.createElement("span");
      lab.className = "countdown__unit-label";
      lab.textContent = label;
      wrap.appendChild(num);
      wrap.appendChild(lab);
      return wrap;
    }

    var timer = null;

    function render() {
      var now = Date.now();

      /* Fuar bitti */
      if (now > end) {
        body.replaceChildren(statusNode(el.dataset.textAfter || ""));
        if (timer) window.clearInterval(timer);
        return;
      }

      /* Fuar devam ediyor */
      if (now >= start) {
        el.classList.add("countdown--live");
        body.replaceChildren(statusNode(el.dataset.textDuring || ""));
        return;   /* saat başı tekrar bakmaya devam et, bitişi yakalasın */
      }

      /* Fuara var */
      var diff = Math.floor((start - now) / 1000);
      var gun = Math.floor(diff / 86400);
      var saat = Math.floor((diff % 86400) / 3600);
      var dakika = Math.floor((diff % 3600) / 60);
      var saniye = diff % 60;

      var label = document.createElement("span");
      label.className = "countdown__label";
      label.textContent = el.dataset.textBefore || "";

      var units = document.createElement("div");
      units.className = "countdown__units";
      units.appendChild(unitNode(gun, labels.gun));
      units.appendChild(unitNode(saat, labels.saat));
      units.appendChild(unitNode(dakika, labels.dakika));
      units.appendChild(unitNode(saniye, labels.saniye));

      body.replaceChildren(label, units);
    }

    render();
    timer = window.setInterval(render, 1000);
  }

  /* =======================================================================
     03. Akordeon (SSS)
     ======================================================================= */
  function initAccordions() {
    var buttons = document.querySelectorAll(".accordion__btn");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        var open = this.getAttribute("aria-expanded") === "true";
        this.setAttribute("aria-expanded", open ? "false" : "true");
        var panel = document.getElementById(this.getAttribute("aria-controls"));
        if (panel) panel.hidden = open;
      });
    }
  }

  /* =======================================================================
     04. Sekmeler — ok tuşlarıyla gezinme dahil
     ======================================================================= */
  function initTabs() {
    var lists = document.querySelectorAll('[role="tablist"]');

    for (var i = 0; i < lists.length; i++) {
      (function (list) {
        var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
        if (!tabs.length) return;

        function select(tab) {
          for (var j = 0; j < tabs.length; j++) {
            var on = tabs[j] === tab;
            tabs[j].setAttribute("aria-selected", on ? "true" : "false");
            tabs[j].tabIndex = on ? 0 : -1;
            var panel = document.getElementById(tabs[j].getAttribute("aria-controls"));
            if (panel) panel.hidden = !on;
          }
        }

        list.addEventListener("click", function (e) {
          var tab = e.target.closest('[role="tab"]');
          if (tab) select(tab);
        });

        list.addEventListener("keydown", function (e) {
          var idx = tabs.indexOf(document.activeElement);
          if (idx === -1) return;
          var next = null;
          if (e.key === "ArrowRight") next = tabs[(idx + 1) % tabs.length];
          else if (e.key === "ArrowLeft") next = tabs[(idx - 1 + tabs.length) % tabs.length];
          else if (e.key === "Home") next = tabs[0];
          else if (e.key === "End") next = tabs[tabs.length - 1];
          if (!next) return;
          e.preventDefault();
          next.focus();
          select(next);
        });
      })(lists[i]);
    }
  }

  /* =======================================================================
     05. Çerez bandı — yalnızca gerekli çerezler, tek onay
     ======================================================================= */
  function initCookieBar() {
    var bar = document.getElementById("cookie-bar");
    if (!bar) return;

    var KEY = "ge-cerez-onay";
    var stored = null;
    try { stored = window.localStorage.getItem(KEY); } catch (e) { /* engelli olabilir */ }
    if (stored === "1") return;

    bar.hidden = false;
    var btn = bar.querySelector("[data-cookie-accept]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      bar.hidden = true;
      try { window.localStorage.setItem(KEY, "1"); } catch (e) { /* yoksay */ }
    });
  }

  /* =======================================================================
     05b. Gizlilik dostu harita — kullanıcı tıklayana kadar dış istek yok
     ======================================================================= */
  function initMap() {
    var map = document.getElementById("map");
    if (!map) return;
    var btn = map.querySelector("[data-map-load]");
    if (!btn) return;

    btn.addEventListener("click", function () {
      var q = map.dataset.query || "";
      var frame = document.createElement("iframe");
      frame.src = "https://maps.google.com/maps?q=" + encodeURIComponent(q) + "&output=embed";
      frame.title = map.dataset.title || "Harita";
      frame.loading = "lazy";
      frame.referrerPolicy = "no-referrer-when-downgrade";
      frame.setAttribute("allowfullscreen", "");
      map.replaceChildren(frame);
    });
  }

  /* =======================================================================
     05c. Form gönderimi — ortak kapı

     Bu blok HER ZAMAN çalışır ve üç şeyi garanti eder:
       1. Native gönderim engellenir (action yok, sayfa yenilenmez)
       2. Bal küpü kontrolü
       3. Tarayıcı doğrulaması + ilk hatalı alana odak

     Gerçek gönderimi assets/js/form-gonder.js modülü üstlenir ve
     window.GE_SUBMIT olarak kendini tanıtır. Modül yüklenemezse (eski
     tarayıcı, ağ hatası, yapılandırma eksik) kullanıcıya DÜRÜST bir mesaj
     gösterilir ve telefona yönlendirilir — form sessizce kaybolmaz.
     ======================================================================= */
  function initForms() {
    var forms = document.querySelectorAll("form[data-form]");
    if (!forms.length) return;

    var tr = document.documentElement.lang !== "en";

    function yedekUyari(form) {
      var box = form.querySelector("[data-submit-fallback]");
      if (!box) {
        box = document.createElement("div");
        box.className = "notice notice--warning";
        box.setAttribute("data-submit-fallback", "");
        box.setAttribute("role", "alert");
        box.appendChild(document.createElement("p"));
        form.prepend(box);
      }
      box.hidden = false;
      /* textContent — veri DOM'a innerHTML ile basılmaz */
      box.querySelector("p").textContent = tr
        ? "Form şu anda gönderilemiyor. Lütfen 0541 662 28 28 numarasından bize ulaşın."
        : "This form cannot be submitted right now. Please call +90 541 662 28 28.";
      box.scrollIntoView({ block: "center", behavior: "smooth" });
    }

    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener("submit", function (e) {
        e.preventDefault();
        var form = this;

        /* Bal küpü dolduysa bot — sessizce yut, hiçbir şey gönderme */
        var hp = form.querySelector('[name="website_url"]');
        if (hp && hp.value) return;

        /* Tarayıcı doğrulaması */
        if (!form.checkValidity()) {
          var bad = form.querySelector(":invalid");
          if (bad) {
            var group = bad.closest(".form__group") || bad.closest(".form__check");
            if (group) group.classList.add("has-error");
            bad.focus();
            if (bad.reportValidity) bad.reportValidity();
          }
          return;
        }

        if (typeof window.GE_SUBMIT === "function") {
          window.GE_SUBMIT(form);
        } else {
          yedekUyari(form);
        }
      });
    }
  }

  /* =======================================================================
     06. Reveal + footer yılı
     ======================================================================= */
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
        observer.unobserve(entries[i].target);
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

    for (var j = 0; j < items.length; j++) observer.observe(items[j]);
  }

  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  initNav();
  initCountdown();
  initAccordions();
  initTabs();
  initCookieBar();
  initMap();
  initForms();
  initReveal();
  initYear();
})();
