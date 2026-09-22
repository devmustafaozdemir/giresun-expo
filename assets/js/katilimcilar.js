/* ==========================================================================
   Katılımcılar sayfası — arama, sektör/salon filtresi, sıralama.

   Kartlar sayfada STATİK olarak bulunur (tools/build-exhibitors.mjs üretir).
   Bu script yeni DOM üretmez; yalnızca var olan kartları gizler, gösterir ve
   yeniden sıralar. Dolayısıyla:
     - JS çalışmazsa 86 firmanın tamamı yine görünür
     - Arama motorları firma adlarını görür
     - innerHTML hiç kullanılmaz (XSS yüzeyi yok)

   Durum URL'de tutulur (?q=…&sektor=…&salon=…), böylece filtreli bir görünüm
   paylaşılabilir ve geri tuşu çalışır.
   ========================================================================== */
(function () {
  "use strict";

  var form = document.getElementById("ex-toolbar");
  var grid = document.getElementById("ex-grid");
  if (!form || !grid) return;

  var search = document.getElementById("ex-search");
  var sector = document.getElementById("ex-sector");
  var sort = document.getElementById("ex-sort");
  var count = document.getElementById("ex-count");
  var empty = document.getElementById("ex-empty");
  var reset = document.getElementById("ex-reset");

  var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-ex]"));
  if (!cards.length) return;

  var LABEL = form.dataset.labelCount || "firma";
  var LABEL_ALL = form.dataset.labelAll || "firma";

  /* Arama için Türkçe karakterleri ASCII'ye indirger — build script'indeki
     fold() ile aynı davranmalı, yoksa eşleşme tutmaz. */
  function fold(s) {
    return String(s).toLowerCase()
      .replace(/ı/g, "i").replace(/İ/g, "i")
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
      .replace(/ö/g, "o").replace(/ç/g, "c")
      .normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function selectedHall() {
    var checked = form.querySelector('input[name="hall"]:checked');
    return checked ? checked.value : "";
  }

  /* --- Sıralama: DOM düğümlerini yeniden yerleştirir --------------------- */
  var sorted = { stand: null, name: null };
  function orderBy(mode) {
    if (!sorted[mode]) {
      sorted[mode] = cards.slice().sort(function (a, b) {
        var ka = a.dataset[mode === "name" ? "name" : "stand"];
        var kb = b.dataset[mode === "name" ? "name" : "stand"];
        return ka < kb ? -1 : ka > kb ? 1 : 0;
      });
    }
    var frag = document.createDocumentFragment();
    sorted[mode].forEach(function (c) { frag.appendChild(c); });
    grid.appendChild(frag);
  }

  /* --- Filtre ----------------------------------------------------------- */
  function apply(pushUrl) {
    var q = fold(search.value.trim());
    var sec = sector.value;
    var hall = selectedHall();
    var visible = 0;

    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      var ok =
        (!q || c.dataset.search.indexOf(q) !== -1) &&
        (!sec || c.dataset.sector === sec) &&
        (!hall || c.dataset.hall === hall);
      c.hidden = !ok;
      if (ok) visible++;
    }

    empty.hidden = visible !== 0;
    grid.hidden = visible === 0;

    /* textContent — veri DOM'a asla innerHTML ile basılmaz */
    count.textContent = visible === cards.length
      ? cards.length + " " + LABEL_ALL
      : visible + " / " + cards.length + " " + LABEL;

    if (pushUrl !== false) syncUrl(q ? search.value.trim() : "", sec, hall);
  }

  /* --- URL durumu ------------------------------------------------------- */
  function syncUrl(q, sec, hall) {
    var p = new URLSearchParams();
    if (q) p.set("q", q);
    if (sec) p.set("sektor", sec);
    if (hall) p.set("salon", hall);
    var qs = p.toString();
    var url = location.pathname + (qs ? "?" + qs : "");
    history.replaceState(null, "", url);
  }

  function readUrl() {
    var p = new URLSearchParams(location.search);
    if (p.get("q")) search.value = p.get("q");
    if (p.get("sektor")) sector.value = p.get("sektor");
    var hall = p.get("salon");
    if (hall) {
      var radio = form.querySelector('input[name="hall"][value="' + CSS.escape(hall) + '"]');
      if (radio) radio.checked = true;
    }
  }

  /* --- Olaylar ---------------------------------------------------------- */
  var debounce = null;
  search.addEventListener("input", function () {
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(function () { apply(); }, 120);
  });

  sector.addEventListener("change", function () { apply(); });
  form.addEventListener("change", function (e) {
    if (e.target.name === "hall") apply();
  });

  sort.addEventListener("change", function () {
    orderBy(sort.value);
    apply(false);
  });

  form.addEventListener("submit", function (e) { e.preventDefault(); apply(); });

  reset.addEventListener("click", function () {
    form.reset();
    apply();
    search.focus();
  });

  /* --- Başlat ----------------------------------------------------------- */
  readUrl();
  apply(false);
})();
