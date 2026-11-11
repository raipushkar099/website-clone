(function () {
  const header = document.getElementById("site-header");
  const toggle = document.getElementById("nav-toggle");
  const mobile = document.getElementById("mobile-nav");
  const year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("nav-scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && mobile) {
    toggle.addEventListener("click", () => {
      const open = mobile.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", open);
    });
    mobile.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobile.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        document.body.classList.remove("nav-open");
      });
    });
  }

  const filters = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-category]");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.getAttribute("data-filter");
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      cards.forEach((card) => {
        const match = value === "all" || card.getAttribute("data-category") === value;
        card.classList.toggle("hidden-card", !match);
      });
    });
  });

  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (form && status) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const message = String(data.get("message") || "").trim();

      if (name.length < 2) return show("Please enter your full name.", false);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return show("Enter a valid email address.", false);
      if (!/^[0-9+\-\s]{10,15}$/.test(phone)) return show("Enter a valid 10–15 digit phone number.", false);
      if (message.length < 10) return show("Please describe your requirement in a bit more detail.", false);

      show("Thank you. Your enquiry has been noted. Our IT team in Lucknow will reach you shortly.", true);
      form.reset();
    });

    function show(text, ok) {
      status.textContent = text;
      status.className = "is-visible " + (ok ? "ok" : "err");
    }
  }

  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const end = Number(el.getAttribute("data-count"));
          const suffix = el.getAttribute("data-suffix") || "";
          let start = 0;
          const step = Math.max(1, Math.ceil(end / 48));
          const tick = () => {
            start = Math.min(end, start + step);
            el.textContent = start + suffix;
            if (start < end) requestAnimationFrame(tick);
          };
          tick();
          io.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => io.observe(el));
  }
})();
