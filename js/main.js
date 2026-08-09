/* EliteClouds Trading — interactions */
(function () {
  "use strict";

  var WHOP = "https://whop.com/eliteclouds-trading-education/";

  var toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(function (i) {
        i.classList.remove("open");
        var b = i.querySelector(".faq-q");
        if (b) b.setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  window.addEventListener(
    "scroll",
    function () {
      if (window.scrollY > 560) document.body.classList.add("scrolled");
      else document.body.classList.remove("scrolled");
    },
    { passive: true }
  );

  window.copyCoupon = function (code, btn) {
    if ((!code || !String(code).trim()) && btn) {
      var el = btn.closest(".coupon") && btn.closest(".coupon").querySelector(".code");
      if (el) code = (el.textContent || "").trim();
    }
    code = String(code || "").trim();
    if (!code) return;
    function done() {
      if (btn) {
        var prev = btn.getAttribute("data-label") || "Copy";
        btn.setAttribute("data-label", prev);
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = prev; }, 1800);
      }
      var toast = document.getElementById("copy-toast");
      if (toast) {
        toast.textContent = "Code " + code + " copied — paste at checkout";
        toast.classList.add("show");
        setTimeout(function () { toast.classList.remove("show"); }, 2200);
      }
      if (typeof fbq !== "undefined") {
        fbq("trackCustom", "PropFirmCodeCopied", { code: code });
      }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(done).catch(done);
    } else {
      done();
    }
  };

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(
    ".section-head, .plan, .testimonial, .diff, .path-card, .partner, .curr-row, .stat, .comp-table, .yt-card, .about-portrait, .about-content, .cta-band, .faq-item, .rating-bar, .hero-chart"
  );
  if (!prefersReduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -36px 0px" }
    );
    reveals.forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("reveal", "in");
    });
  }

  document.querySelectorAll('a[href*="whop.com"]').forEach(function (a) {
    a.addEventListener("click", function () {
      if (typeof fbq !== "undefined") {
        fbq("track", "InitiateCheckout", {
          content_name: a.getAttribute("data-plan") || "Live Trading",
          content_category: "whop",
        });
      }
    });
  });

  document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener("click", function () {
      if (typeof fbq !== "undefined") {
        fbq("track", "Contact", {
          content_name: "Phone Call",
          source: a.getAttribute("data-source") || "site",
        });
      }
    });
  });

  window.ELITE_WHOP = WHOP;
})();
