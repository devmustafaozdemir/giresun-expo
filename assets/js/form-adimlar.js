/* ==========================================================================
   Çok adımlı form (stant başvurusu).

   JS yoksa: tüm adımlar aynı anda görünür ve form tek parça olarak çalışır.
   Bunu saglamak icin adim gizleme JS tarafindan yapilir, HTML'deki hidden
   oznitelikleri ilk kurulumda temizlenir.

   Her adımda yalnızca o adımın zorunlu alanları doğrulanır; kullanıcı
   ileri gidemiyorsa ilk hatalı alana odaklanılır.
   ========================================================================== */
(function () {
  "use strict";

  var form = document.querySelector("[data-steps]");
  if (!form) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll("[data-step]"));
  var navItems = Array.prototype.slice.call(form.querySelectorAll("[data-steps-nav] li"));
  var btnPrev = form.querySelector("[data-step-prev]");
  var btnNext = form.querySelector("[data-step-next]");
  var btnSubmit = form.querySelector("[data-step-submit]");
  var summary = form.querySelector("[data-summary]");
  if (steps.length < 2 || !btnNext || !btnSubmit) return;

  var tr = document.documentElement.lang !== "en";
  var current = 0;

  function render() {
    steps.forEach(function (s, i) { s.hidden = i !== current; });
    navItems.forEach(function (li, i) {
      li.classList.toggle("is-active", i === current);
      li.classList.toggle("is-done", i < current);
    });
    btnPrev.hidden = current === 0;
    btnNext.hidden = current === steps.length - 1;
    btnSubmit.hidden = current !== steps.length - 1;
    if (current === steps.length - 1) buildSummary();
  }

  /** Yalnizca gorunur adimdaki alanlari dogrula */
  function validateStep() {
    var fields = steps[current].querySelectorAll("input, select, textarea");
    var firstBad = null;

    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      var group = f.closest(".form__group");
      var ok = f.checkValidity();
      if (group) {
        group.classList.toggle("has-error", !ok);
        var msg = group.querySelector("[data-error]");
        if (!ok && !msg) {
          msg = document.createElement("p");
          msg.className = "form__error";
          msg.setAttribute("data-error", "");
          group.appendChild(msg);
        }
        if (msg) {
          msg.textContent = ok ? "" : (f.validationMessage ||
            (tr ? "Bu alan zorunlu." : "This field is required."));
          msg.hidden = ok;
        }
      }
      if (!ok && !firstBad) firstBad = f;
    }

    if (firstBad) { firstBad.focus(); return false; }
    return true;
  }

  /** Son adimda girilenleri ozetle — textContent ile, innerHTML yok */
  function buildSummary() {
    if (!summary) return;
    summary.replaceChildren();
    for (var i = 0; i < steps.length - 1; i++) {
      var fields = steps[i].querySelectorAll("input, select, textarea");
      for (var j = 0; j < fields.length; j++) {
        var f = fields[j];
        if (!f.value || f.type === "checkbox" || f.name === "website_url") continue;
        var label = form.querySelector('label[for="' + f.id + '"]');
        var row = document.createElement("div");
        row.className = "summary__row";
        var dt = document.createElement("dt");
        dt.textContent = label ? label.textContent.replace("*", "").trim() : f.name;
        var dd = document.createElement("dd");
        dd.textContent = f.tagName === "SELECT" && f.selectedOptions.length
          ? f.selectedOptions[0].textContent
          : f.value;
        row.appendChild(dt);
        row.appendChild(dd);
        summary.appendChild(row);
      }
    }
  }

  btnNext.addEventListener("click", function () {
    if (!validateStep()) return;
    current = Math.min(current + 1, steps.length - 1);
    render();
    form.scrollIntoView({ block: "start", behavior: "smooth" });
  });

  btnPrev.addEventListener("click", function () {
    current = Math.max(current - 1, 0);
    render();
    form.scrollIntoView({ block: "start", behavior: "smooth" });
  });

  render();
})();
