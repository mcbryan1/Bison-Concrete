/* ============================================================
   BISON CONCRETE LTD — site interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- Sticky header shadow ---- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Accordion ---- */
  document.querySelectorAll(".acc__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".acc__item");
      var panel = item.querySelector(".acc__panel");
      var isOpen = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      panel.style.maxHeight = isOpen ? panel.scrollHeight + "px" : null;
    });
  });

  /* ---- Duplicate marquee content for seamless loop ---- */
  document.querySelectorAll(".strip__track").forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });

  /* ---- Quote / contact form ---- */
  var forms = document.querySelectorAll("form[data-enquiry]");
  forms.forEach(function (form) {
    var status = form.querySelector(".form-status");

    var setInvalid = function (field, on) {
      if (field) field.classList.toggle("invalid", on);
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var firstBad = null;

      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var ok = true;
        if (input.type === "email") {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        } else if (input.type === "checkbox") {
          ok = input.checked;
        } else {
          ok = input.value.trim().length > 0;
        }
        setInvalid(field, !ok);
        if (!ok) { valid = false; if (!firstBad) firstBad = input; }
      });

      if (!valid) {
        if (firstBad) firstBad.focus();
        return;
      }

      var btn = form.querySelector("button[type=submit]");
      var original = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }
      if (status) { status.className = "form-status"; status.textContent = ""; }

      var endpoint = form.getAttribute("action");
      var usable = endpoint && endpoint.indexOf("REPLACE") === -1;

      var done = function (ok) {
        if (btn) { btn.disabled = false; btn.innerHTML = original; }
        if (!status) return;
        if (ok) {
          status.className = "form-status ok";
          status.textContent = "Thank you. Your request has been received. Our team will respond with a quotation shortly.";
          form.reset();
        } else {
          status.className = "form-status bad";
          status.innerHTML = "We could not send your message. Please call or WhatsApp us on the number below, or email us directly.";
        }
        status.scrollIntoView({ behavior: "smooth", block: "center" });
      };

      if (!usable) {
        // No live endpoint configured yet — simulate success for the demo build.
        setTimeout(function () { done(true); }, 700);
        return;
      }

      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (r) { done(r.ok); })
        .catch(function () { done(false); });
    });

    // clear invalid state as user types
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field) field.classList.remove("invalid");
      });
    });
  });

  /* ---- Footer year ---- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
