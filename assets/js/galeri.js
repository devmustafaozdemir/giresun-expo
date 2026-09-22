/* ==========================================================================
   Galeri lightbox — erişilebilir büyütme.
   Görseller sayfada statik olarak durur; bu script yalnızca büyütme katmanını
   açar. JS yoksa görseller yine görünür, yalnızca büyütme çalışmaz.
   ========================================================================== */
(function () {
  "use strict";

  var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (!buttons.length) return;

  var tr = document.documentElement.lang !== "en";
  var T = {
    close: tr ? "Kapat" : "Close",
    prev: tr ? "Önceki görsel" : "Previous image",
    next: tr ? "Sonraki görsel" : "Next image",
    of: tr ? " / " : " / ",
  };

  var index = 0;
  var lastFocus = null;

  /* --- Katmanı bir kez kur --------------------------------------------- */
  var box = document.createElement("div");
  box.className = "modal lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", tr ? "Görsel büyütme" : "Image viewer");
  box.hidden = true;

  var inner = document.createElement("div");
  inner.style.cssText = "display:flex;flex-direction:column;align-items:center";

  var img = document.createElement("img");
  img.className = "lightbox__img";
  /* alt niteliği daha sonra, lightbox açılınca doldurulur. Ama öğe sayfa
     yüklenirken DOM'a giriyor; nitelik hiç yoksa o aralıkta alt'sız bir görsel
     olarak denetimlere takılır. Boş dize "dekoratif" demektir, doğru başlangıç. */
  img.alt = "";

  var caption = document.createElement("p");
  caption.className = "lightbox__caption";

  var btnClose = mkBtn("modal__close", T.close, "M18 6 6 18 M6 6l12 12");
  var btnPrev = mkBtn("lightbox__nav lightbox__nav--prev", T.prev, "m15 18-6-6 6-6");
  var btnNext = mkBtn("lightbox__nav lightbox__nav--next", T.next, "m9 18 6-6-6-6");

  inner.appendChild(img);
  inner.appendChild(caption);
  box.appendChild(inner);
  box.appendChild(btnClose);
  box.appendChild(btnPrev);
  box.appendChild(btnNext);
  document.body.appendChild(box);

  function mkBtn(cls, label, d) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.setAttribute("aria-label", label);
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.75");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("aria-hidden", "true");
    d.split(" M").forEach(function (seg, i) {
      var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", (i === 0 ? "" : "M") + seg);
      svg.appendChild(p);
    });
    b.appendChild(svg);
    return b;
  }

  /* --- Göster ----------------------------------------------------------- */
  function show(i) {
    index = (i + buttons.length) % buttons.length;
    var btn = buttons[index];
    /* textContent / setAttribute — innerHTML kullanılmaz */
    img.src = btn.dataset.full;
    img.alt = btn.dataset.alt || "";
    caption.textContent = (btn.dataset.alt || "") + "  (" + (index + 1) + T.of + buttons.length + ")";
  }

  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    box.hidden = false;
    document.body.classList.add("is-locked");
    btnClose.focus();
  }

  function close() {
    box.hidden = true;
    document.body.classList.remove("is-locked");
    if (lastFocus) lastFocus.focus();
  }

  buttons.forEach(function (btn, i) {
    btn.addEventListener("click", function () { open(i); });
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", function () { show(index - 1); });
  btnNext.addEventListener("click", function () { show(index + 1); });
  box.addEventListener("click", function (e) { if (e.target === box) close(); });

  document.addEventListener("keydown", function (e) {
    if (box.hidden) return;
    if (e.key === "Escape") { close(); return; }
    if (e.key === "ArrowLeft") { show(index - 1); return; }
    if (e.key === "ArrowRight") { show(index + 1); return; }
    if (e.key !== "Tab") return;
    /* Odak kapanı */
    var f = [btnClose, btnPrev, btnNext];
    var pos = f.indexOf(document.activeElement);
    e.preventDefault();
    f[(pos + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
  });
})();
