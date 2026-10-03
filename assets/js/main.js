/* ============================================================
   BISON CONCRETE LTD — site interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- Splash / preloader ---- */
  var splash = document.getElementById("splash");
  if (splash) {
    var doc = document.documentElement;
    var heroVideo = document.querySelector(".hero__video");
    var started = Date.now();
    var MIN_MS = 1000;   // don't flash the splash away too fast
    var MAX_MS = 6000;   // never block the page if the video stalls
    var dismissed = false;

    doc.classList.add("splash-lock");

    var dismiss = function () {
      if (dismissed) return;
      dismissed = true;
      var wait = Math.max(0, MIN_MS - (Date.now() - started));
      setTimeout(function () {
        splash.classList.add("splash--done");
        doc.classList.remove("splash-lock");
        setTimeout(function () {
          if (splash && splash.parentNode) splash.parentNode.removeChild(splash);
        }, 650);
      }, wait);
    };

    if (heroVideo) {
      // readyState >= 3 (HAVE_FUTURE_DATA) means it can play through smoothly
      if (heroVideo.readyState >= 3) dismiss();
      heroVideo.addEventListener("canplaythrough", dismiss);
      heroVideo.addEventListener("canplay", dismiss);
      heroVideo.addEventListener("loadeddata", dismiss);
      heroVideo.addEventListener("error", dismiss);
      try { heroVideo.load(); } catch (e) {}
    }
    window.addEventListener("load", dismiss);
    setTimeout(dismiss, MAX_MS);
  }

  /* ---- Sticky / overlay header ---- */
  var header = document.querySelector(".site-header");
  if (header) {
    var isOverlay = header.classList.contains("site-header--overlay");
    var onScroll = function () {
      // overlay nav stays transparent over the hero, then solidifies near its end
      var trigger = isOverlay ? window.innerHeight * 0.6 : 8;
      header.classList.toggle("scrolled", window.scrollY > trigger);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Hero scroll cue: smooth-scroll without writing a #hash to the URL
          (so a reload always starts at the top, keeping the nav transparent) ---- */
  var scrollCue = document.querySelector(".hero__scroll");
  if (scrollCue) {
    scrollCue.addEventListener("click", function (e) {
      var target = document.querySelector(scrollCue.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    var setMenu = function (open) {
      links.classList.toggle("open", open);
      if (header) header.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };
    toggle.addEventListener("click", function () {
      setMenu(!links.classList.contains("open"));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
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
