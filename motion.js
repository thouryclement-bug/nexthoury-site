/* NexThoury — "Motion" concept homepage interactions */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = () => window.innerWidth >= 900;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (typeof gsap !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- Nav ---------- */
  const nav = document.getElementById("mxNav");
  const burger = document.getElementById("mxBurger");
  const mobileMenu = document.getElementById("mxMobileMenu");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  }, { passive: true });

  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      mobileMenu.classList.toggle("is-open");
    });
    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => mobileMenu.classList.remove("is-open"));
    });
  }

  /* ---------- Hero kinetic reveal + counters ---------- */
  const heroLines = document.querySelectorAll(".mx-line");
  if (typeof gsap !== "undefined" && heroLines.length) {
    gsap.to(heroLines, {
      y: "0%",
      duration: reduceMotion ? 0 : 1,
      ease: "power4.out",
      stagger: reduceMotion ? 0 : 0.12,
      delay: reduceMotion ? 0 : 0.15,
    });
  }

  function animateCount(el) {
    const target = parseFloat(el.dataset.count || "0");
    const decimals = parseInt(el.dataset.decimal || "0", 10);
    const suffix = el.dataset.suffix || "";
    if (reduceMotion || typeof gsap === "undefined") {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }
    gsap.to(el, {
      textContent: target,
      duration: 1.4,
      ease: "power2.out",
      snap: { textContent: decimals ? 1 / Math.pow(10, decimals) : 1 },
      onUpdate() {
        el.textContent = parseFloat(el.textContent).toFixed(decimals) + suffix;
      },
    });
  }
  document.querySelectorAll(".mx-stat strong").forEach(animateCount);

  /* ---------- Magnetic buttons ---------- */
  if (hasFinePointer && !reduceMotion && typeof gsap !== "undefined") {
    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.35);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      btn.addEventListener("mouseleave", () => {
        xTo(0);
        yTo(0);
      });
    });
  }

  /* ---------- Portrait tilt ---------- */
  const heroVisual = document.getElementById("mxHeroVisual");
  const portrait = heroVisual ? heroVisual.querySelector(".mx-hero-portrait") : null;
  if (heroVisual && portrait && hasFinePointer && !reduceMotion && typeof gsap !== "undefined") {
    const rxTo = gsap.quickTo(portrait, "rotationX", { duration: 0.6, ease: "power3" });
    const ryTo = gsap.quickTo(portrait, "rotationY", { duration: 0.6, ease: "power3" });
    heroVisual.addEventListener("mousemove", (e) => {
      const r = heroVisual.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rxTo(py * -8);
      ryTo(px * 8);
    });
    heroVisual.addEventListener("mouseleave", () => {
      rxTo(0);
      ryTo(0);
    });
  }

  /* ---------- Pinned showcase ---------- */
  const showcaseWrap = document.querySelector(".mx-showcase-wrap");
  const showcasePin = document.getElementById("mxShowcasePin");
  const showcaseImgs = Array.from(document.querySelectorAll(".mx-showcase-img"));
  const showcaseItems = Array.from(document.querySelectorAll(".mx-showcase-item"));
  const showcaseDots = Array.from(document.querySelectorAll(".mx-dot-btn"));
  const showcaseTag = document.getElementById("mxShowcaseTag");

  if (showcaseWrap && showcasePin && showcaseItems.length && typeof gsap !== "undefined") {
    let current = 0;

    function setActive(i) {
      if (i === current || !showcaseItems[i]) return;
      const prev = current;
      current = i;

      if (showcaseImgs[prev]) {
        gsap.to(showcaseImgs[prev], { opacity: 0, scale: 1.08, duration: 0.6, ease: "power2.inOut" });
      }
      if (showcaseImgs[i]) {
        gsap.to(showcaseImgs[i], { opacity: 1, scale: 1, duration: 0.6, ease: "power2.inOut" });
      }

      showcaseItems[prev].classList.remove("is-active");
      showcaseItems[i].classList.add("is-active");

      if (showcaseDots[prev]) showcaseDots[prev].classList.remove("is-active");
      if (showcaseDots[i]) showcaseDots[i].classList.add("is-active");

      if (showcaseTag) {
        const item = showcaseItems[i];
        showcaseTag.textContent = item.dataset.label || "";
        showcaseTag.style.setProperty("--tag", item.dataset.color || "#3f76e8");
      }
    }

    showcaseDots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        if (!st) { setActive(i); return; }
        const progress = (i + 0.5) / showcaseItems.length;
        const target = st.start + progress * (st.end - st.start);
        window.scrollTo({ top: target, behavior: "smooth" });
      });
    });

    let st = null;
    function initPin() {
      if (st) { st.kill(); st = null; }
      if (!isDesktop()) return;
      const total = showcaseItems.length;
      st = ScrollTrigger.create({
        trigger: showcasePin,
        start: "top top",
        end: "+=" + total * 78 + "%",
        pin: showcasePin,
        pinSpacing: true,
        scrub: 0.4,
        onUpdate(self) {
          const idx = Math.min(total - 1, Math.floor(self.progress * total));
          setActive(idx);
        },
      });
    }
    initPin();
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initPin();
        ScrollTrigger.refresh();
      }, 200);
    });

    /* Web fonts and images loading after GSAP's first measurement shift
       layout — refresh so the pin's width/position stay accurate. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
    window.addEventListener("load", () => ScrollTrigger.refresh());
    const showcasePhotos = showcaseImgs.filter((img) => !img.complete);
    if (showcasePhotos.length) {
      let remaining = showcasePhotos.length;
      showcasePhotos.forEach((img) => {
        img.addEventListener("load", () => {
          remaining -= 1;
          if (remaining === 0) ScrollTrigger.refresh();
        }, { once: true });
      });
    }
  }

  /* ---------- Marquee (direction reverses with scroll direction) ---------- */
  const marqueeTrack = document.getElementById("mxMarqueeTrack");
  if (marqueeTrack && typeof gsap !== "undefined") {
    const marqueeTween = gsap.to(marqueeTrack, {
      xPercent: -50,
      duration: reduceMotion ? 0 : 22,
      ease: "none",
      repeat: -1,
    });
    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      marqueeTween.timeScale(y < lastY ? -1 : 1);
      lastY = y;
    }, { passive: true });
  }

  /* ---------- Testimonial spotlight border ---------- */
  const spotlight = document.getElementById("mxSpotlightCard");
  if (spotlight && hasFinePointer) {
    spotlight.addEventListener("mousemove", (e) => {
      const r = spotlight.getBoundingClientRect();
      spotlight.style.setProperty("--mx-x", `${e.clientX - r.left}px`);
      spotlight.style.setProperty("--mx-y", `${e.clientY - r.top}px`);
    });
  }

  /* ---------- Generic reveal-on-scroll ---------- */
  const revealEls = document.querySelectorAll(".mx-reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  }
})();
