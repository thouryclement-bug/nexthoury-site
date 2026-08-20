// Dropdown "Compétences" — façon Noiise (2 colonnes, familles + sous-compétences)
document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.getElementById('competences-trigger');
  const toggle = trigger.querySelector('.dropdown-toggle');
  const familyItems = trigger.querySelectorAll('.family-item');
  const subPanels = trigger.querySelectorAll('.dropdown-sub-panel');

  function openDropdown() {
    trigger.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  }
  function closeDropdown() {
    trigger.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    trigger.classList.contains('is-open') ? closeDropdown() : openDropdown();
  });

  familyItems.forEach((item) => {
    item.addEventListener('mouseenter', () => activateFamily(item.dataset.family));
    item.addEventListener('click', () => activateFamily(item.dataset.family));
  });

  function activateFamily(family) {
    familyItems.forEach((i) => i.classList.toggle('is-active', i.dataset.family === family));
    subPanels.forEach((p) => p.classList.toggle('is-active', p.dataset.family === family));
  }

  document.addEventListener('click', (e) => {
    if (!trigger.contains(e.target)) closeDropdown();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdown();
  });

  // Mobile burger — simple toggle of the main nav as an off-canvas list
  const burger = document.getElementById('burger');
  const mainNav = document.getElementById('main-nav');
  burger.addEventListener('click', () => {
    mainNav.classList.toggle('is-mobile-open');
    document.body.classList.toggle('mobile-nav-open');
  });

  // Accordéon mobile "Compétences" — le nom de la famille est un lien direct (navigue),
  // seul le bouton "+" déplie/replie la liste des sous-compétences. Un seul ouvert à la fois.
  const mobileAccordion = document.getElementById('competences-mobile-accordion');
  if (mobileAccordion) {
    const mobileItems = Array.from(mobileAccordion.querySelectorAll('.dropdown-mobile-item'));
    mobileItems.forEach((item) => {
      const expandBtn = item.querySelector('.dropdown-mobile-expand');
      expandBtn.addEventListener('click', () => {
        const willOpen = !item.classList.contains('is-open');
        mobileItems.forEach((other) => {
          other.classList.remove('is-open');
          other.querySelector('.dropdown-mobile-expand').setAttribute('aria-expanded', 'false');
        });
        item.classList.toggle('is-open', willOpen);
        expandBtn.setAttribute('aria-expanded', String(willOpen));
      });
    });
  }

  // Header becomes more transparent once content scrolls underneath it
  const header = document.getElementById('site-header');
  function updateHeaderOnScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  updateHeaderOnScroll();
  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });

  // Intro cinématique (accueil) — le nom, centré sur l'image, apparaît en simple fondu au
  // premier mouvement de souris (pas de glissement, pas lié au scroll). Le kicker "FREELANCE…"
  // et l'indicateur de scroll restent visibles dès le chargement. Sur mobile/tactile (pas de
  // souris), révélation automatique après un court délai. Le header devient un menu translucide
  // sombre tant que l'intro occupe une bonne partie de l'écran.
  const introReveal = document.getElementById('intro');
  const introName = document.querySelector('.intro-name');
  if (introReveal && introName) {
    function revealIntroName() { introName.classList.add('is-revealed'); }
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setTimeout(revealIntroName, 500);
    } else {
      introReveal.addEventListener('mousemove', revealIntroName, { once: true });
    }

    if ('IntersectionObserver' in window) {
      const headerLogo = document.getElementById('headerLogo');
      const introObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          header.classList.toggle('header-on-dark', entry.isIntersecting);
          if (headerLogo) headerLogo.src = entry.isIntersecting ? 'assets/logo-wordmark-white.png' : 'assets/logo-wordmark.png';
        });
      }, { threshold: 0.35 });
      introObserver.observe(introReveal);
    }
  }

  // Projets — filtre latéral par catégorie
  const projetsFilters = document.getElementById('projets-filters');
  if (projetsFilters) {
    const filterButtons = projetsFilters.querySelectorAll('.projets-filter-btn');
    const rows = document.querySelectorAll('#projets-list .projets-row');
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const filter = btn.dataset.filter;
        rows.forEach((row) => {
          const show = filter === 'tous' || row.dataset.category === filter;
          row.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

  // Accueil — showcase pinné des 9 compétences (défile au scroll, façon Apple)
  const showcasePin = document.getElementById('showcasePin');
  if (showcasePin && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);

    const showcaseImgs = Array.from(document.querySelectorAll('.showcase-img'));
    const showcaseItems = Array.from(document.querySelectorAll('.showcase-item'));
    const showcaseDots = Array.from(document.querySelectorAll('.showcase-dot-btn'));
    const showcaseTag = document.getElementById('showcaseTag');
    const isDesktop = () => window.innerWidth >= 981;
    let current = 0;
    let st = null;

    function setActive(i) {
      if (i === current || !showcaseItems[i]) return;
      const prev = current;
      current = i;
      if (showcaseImgs[prev]) gsap.to(showcaseImgs[prev], { opacity: 0, scale: 1.08, duration: 0.6, ease: 'power2.inOut' });
      if (showcaseImgs[i]) gsap.to(showcaseImgs[i], { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.inOut' });
      showcaseItems[prev].classList.remove('is-active');
      showcaseItems[i].classList.add('is-active');
      if (showcaseDots[prev]) showcaseDots[prev].classList.remove('is-active');
      if (showcaseDots[i]) showcaseDots[i].classList.add('is-active');
      if (showcaseTag) {
        const item = showcaseItems[i];
        showcaseTag.textContent = item.dataset.label || '';
        showcaseTag.style.setProperty('--tag', item.dataset.color || '#3f76e8');
      }
    }

    showcaseDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        if (!st) { setActive(i); restartAutoplay(); return; }
        const progress = (i + 0.5) / showcaseItems.length;
        const target = st.start + progress * (st.end - st.start);
        window.scrollTo({ top: target, behavior: 'smooth' });
      });
    });

    // Navigation mobile : flèches précédent/suivant + défilement automatique, pour voir
    // les 9 compétences sans avoir à tout dérouler à la main sur un petit écran.
    const showcasePrevBtn = document.getElementById('showcasePrev');
    const showcaseNextBtn = document.getElementById('showcaseNext');
    const showcaseTotal = showcaseItems.length;
    function showcaseGoTo(i) { setActive((i + showcaseTotal) % showcaseTotal); }
    if (showcasePrevBtn) showcasePrevBtn.addEventListener('click', () => { showcaseGoTo(current - 1); restartAutoplay(); });
    if (showcaseNextBtn) showcaseNextBtn.addEventListener('click', () => { showcaseGoTo(current + 1); restartAutoplay(); });

    let showcaseAutoplayTimer = null;
    function stopAutoplay() {
      if (showcaseAutoplayTimer) clearInterval(showcaseAutoplayTimer);
      showcaseAutoplayTimer = null;
    }
    function startAutoplay() {
      if (isDesktop()) return;
      stopAutoplay();
      showcaseAutoplayTimer = setInterval(() => showcaseGoTo(current + 1), 4500);
    }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    if ('IntersectionObserver' in window) {
      const showcaseObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => { entry.isIntersecting ? startAutoplay() : stopAutoplay(); });
      }, { threshold: 0.4 });
      showcaseObserver.observe(showcasePin);
    }

    // Balayage tactile : glisser à gauche/droite change de compétence (en plus des flèches).
    let showcaseTouchStartX = null;
    showcasePin.addEventListener('touchstart', (e) => {
      if (isDesktop()) return;
      showcaseTouchStartX = e.touches[0].clientX;
    }, { passive: true });
    showcasePin.addEventListener('touchend', (e) => {
      if (isDesktop() || showcaseTouchStartX === null) return;
      const delta = e.changedTouches[0].clientX - showcaseTouchStartX;
      showcaseTouchStartX = null;
      if (Math.abs(delta) < 40) return;
      showcaseGoTo(delta < 0 ? current + 1 : current - 1);
      restartAutoplay();
    }, { passive: true });

    function initShowcasePin() {
      if (st) { st.kill(); st = null; }
      if (!isDesktop()) return;
      const total = showcaseItems.length;
      st = ScrollTrigger.create({
        trigger: showcasePin,
        start: 'top top',
        end: '+=' + total * 78 + '%',
        pin: showcasePin,
        pinSpacing: true,
        scrub: 0.4,
        onUpdate(self) {
          const idx = Math.min(total - 1, Math.floor(self.progress * total));
          setActive(idx);
        },
      });
    }
    initShowcasePin();

    let showcaseResizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(showcaseResizeTimer);
      showcaseResizeTimer = setTimeout(() => {
        initShowcasePin();
        ScrollTrigger.refresh();
        if (isDesktop()) stopAutoplay();
      }, 200);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
    window.addEventListener('load', () => ScrollTrigger.refresh());
    const showcasePhotos = showcaseImgs.filter((img) => !img.complete);
    if (showcasePhotos.length) {
      let remaining = showcasePhotos.length;
      showcasePhotos.forEach((img) => {
        img.addEventListener('load', () => {
          remaining -= 1;
          if (remaining === 0) ScrollTrigger.refresh();
        }, { once: true });
      });
    }
  }

  // Témoignages spotlight — la bordure de chaque carte suit la souris
  document.querySelectorAll('.spotlight-card').forEach((card) => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--sx', `${e.clientX - r.left}px`);
      card.style.setProperty('--sy', `${e.clientY - r.top}px`);
    });
  });

  // Témoignages — carrousel avec flèches de navigation
  const testimonialTrack = document.getElementById('testimonialTrack');
  const testimonialPrev = document.getElementById('testimonialPrev');
  const testimonialNext = document.getElementById('testimonialNext');
  if (testimonialTrack && testimonialPrev && testimonialNext) {
    const trackWrap = testimonialTrack.parentElement;
    const cards = Array.from(testimonialTrack.children);
    const gap = 24;
    let index = 0;

    function updateCarousel() {
      const wrapWidth = trackWrap.getBoundingClientRect().width;
      const cardWidth = cards[0].getBoundingClientRect().width;
      const visibleCount = Math.max(1, Math.round((wrapWidth + gap) / (cardWidth + gap)));
      const maxIndex = Math.max(0, cards.length - visibleCount);
      index = Math.min(index, maxIndex);
      testimonialTrack.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
      testimonialPrev.disabled = index <= 0;
      testimonialNext.disabled = index >= maxIndex;
    }

    testimonialPrev.addEventListener('click', () => {
      index = Math.max(0, index - 1);
      updateCarousel();
    });
    testimonialNext.addEventListener('click', () => {
      index += 1;
      updateCarousel();
    });
    window.addEventListener('resize', updateCarousel);
    updateCarousel();
  }
});

// Bandeau + fenêtre de cookies — 3 choix : tout accepter (dont publicité),
// tout refuser (usage professionnel uniquement), ou personnaliser par catégorie.
// Les catégories publicité/analytics suivent les signaux Google Consent Mode v2,
// prêts à l'emploi le jour où un tag Google Ads / Analytics est ajouté au site.
document.addEventListener('DOMContentLoaded', () => {
  const CONSENT_KEY = 'nx-cookie-consent';
  const CATEGORIES = ['ad_personalization', 'ad_user_data', 'ad_storage', 'analytics_storage'];

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });

  function readConsent() {
    try {
      const raw = JSON.parse(localStorage.getItem(CONSENT_KEY));
      if (raw && CATEGORIES.every((c) => typeof raw[c] === 'boolean')) return raw;
    } catch (e) { /* valeur absente ou corrompue */ }
    return null;
  }

  function applyConsent(consent) {
    gtag('consent', 'update', {
      ad_storage: consent.ad_storage ? 'granted' : 'denied',
      ad_user_data: consent.ad_user_data ? 'granted' : 'denied',
      ad_personalization: consent.ad_personalization ? 'granted' : 'denied',
      analytics_storage: consent.analytics_storage ? 'granted' : 'denied'
    });
  }

  function saveConsent(consent) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...consent, savedAt: Date.now() }));
    applyConsent(consent);
  }

  const existing = readConsent();
  if (existing) applyConsent(existing);

  // ---- Bandeau (1er niveau) ----
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Gestion des cookies');
  banner.innerHTML = `
    <p class="cookie-banner-text">
      Les cookies essentiels (calendrier de réservation) servent uniquement un but
      professionnel. Vous choisissez aussi si vos données peuvent être utilisées pour la
      publicité et la mesure d'audience — voir notre
      <a href="confidentialite.html">politique de confidentialité</a>.
    </p>
    <div class="cookie-banner-actions">
      <button type="button" class="btn btn-secondary" data-cookie-action="refuse-all">Tout refuser</button>
      <button type="button" class="btn btn-secondary" data-cookie-action="customize">Personnaliser</button>
      <button type="button" class="btn btn-primary" data-cookie-action="accept-all">Tout accepter</button>
    </div>
  `;

  // ---- Fenêtre de personnalisation (2e niveau) ----
  const overlay = document.createElement('div');
  overlay.className = 'cookie-modal-overlay';
  overlay.innerHTML = `
    <div class="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookieModalTitle">
      <div class="cookie-modal-header">
        <h2 id="cookieModalTitle">Personnaliser les cookies</h2>
        <button type="button" class="cookie-modal-close" aria-label="Fermer">&times;</button>
      </div>
      <p class="cookie-modal-intro">
        Ces réglages ne concernent que la publicité et la mesure d'audience. Le calendrier de
        réservation reste toujours actif, quel que soit votre choix.
      </p>

      <label class="cookie-toggle-row cookie-toggle-master">
        <span class="cookie-toggle-title">Tout cocher</span>
        <span class="cookie-switch">
          <input type="checkbox" id="cookieToggleAll">
          <span class="cookie-switch-track"></span>
        </span>
      </label>

      <div class="cookie-toggle-row">
        <div class="cookie-toggle-copy">
          <p class="cookie-toggle-title">Personnalisation des publicités</p>
          <p class="cookie-toggle-desc">Adapter les publicités montrées ailleurs en fonction de votre visite sur ce site.</p>
        </div>
        <span class="cookie-switch">
          <input type="checkbox" data-consent="ad_personalization">
          <span class="cookie-switch-track"></span>
        </span>
      </div>

      <div class="cookie-toggle-row">
        <div class="cookie-toggle-copy">
          <p class="cookie-toggle-title">Données utilisateur pour la publicité</p>
          <p class="cookie-toggle-desc">Partager des données d'activité avec des partenaires publicitaires pour des annonces ciblées.</p>
        </div>
        <span class="cookie-switch">
          <input type="checkbox" data-consent="ad_user_data">
          <span class="cookie-switch-track"></span>
        </span>
      </div>

      <div class="cookie-toggle-row">
        <div class="cookie-toggle-copy">
          <p class="cookie-toggle-title">Stockage de publicité</p>
          <p class="cookie-toggle-desc">Autoriser l'enregistrement d'informations publicitaires sur votre appareil.</p>
        </div>
        <span class="cookie-switch">
          <input type="checkbox" data-consent="ad_storage">
          <span class="cookie-switch-track"></span>
        </span>
      </div>

      <div class="cookie-toggle-row">
        <div class="cookie-toggle-copy">
          <p class="cookie-toggle-title">Mesure d'audience</p>
          <p class="cookie-toggle-desc">Autoriser la mesure de fréquentation du site pour l'améliorer (analytics).</p>
        </div>
        <span class="cookie-switch">
          <input type="checkbox" data-consent="analytics_storage">
          <span class="cookie-switch-track"></span>
        </span>
      </div>

      <div class="cookie-toggle-row cookie-toggle-locked">
        <div class="cookie-toggle-copy">
          <p class="cookie-toggle-title">Cookies essentiels</p>
          <p class="cookie-toggle-desc">Nécessaires au fonctionnement du calendrier de réservation. Toujours actifs, but professionnel uniquement.</p>
        </div>
        <span class="cookie-switch">
          <input type="checkbox" checked disabled>
          <span class="cookie-switch-track"></span>
        </span>
      </div>

      <div class="cookie-modal-actions">
        <button type="button" class="btn btn-secondary" data-cookie-action="refuse-all">Tout refuser</button>
        <button type="button" class="btn btn-primary" data-cookie-action="save-prefs">Enregistrer mes choix</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);
  document.body.appendChild(overlay);

  const categoryInputs = Array.from(overlay.querySelectorAll('[data-consent]'));
  const masterInput = overlay.querySelector('#cookieToggleAll');

  function setToggles(consent) {
    categoryInputs.forEach((input) => { input.checked = !!consent[input.dataset.consent]; });
    masterInput.checked = categoryInputs.every((input) => input.checked);
  }

  function readToggles() {
    const consent = {};
    categoryInputs.forEach((input) => { consent[input.dataset.consent] = input.checked; });
    return consent;
  }

  setToggles(existing || {});

  function showBanner() { requestAnimationFrame(() => banner.classList.add('is-visible')); }
  function hideBanner() { banner.classList.remove('is-visible'); }
  function openModal() { overlay.classList.add('is-visible'); }
  function closeModal() { overlay.classList.remove('is-visible'); }

  masterInput.addEventListener('change', () => {
    categoryInputs.forEach((input) => { input.checked = masterInput.checked; });
  });
  categoryInputs.forEach((input) => {
    input.addEventListener('change', () => {
      masterInput.checked = categoryInputs.every((i) => i.checked);
    });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  overlay.querySelector('.cookie-modal-close').addEventListener('click', closeModal);

  document.addEventListener('click', (e) => {
    const action = e.target.closest('[data-cookie-action]')?.dataset.cookieAction;
    if (action === 'accept-all') {
      const all = { ad_personalization: true, ad_user_data: true, ad_storage: true, analytics_storage: true };
      saveConsent(all);
      setToggles(all);
      closeModal();
      hideBanner();
    } else if (action === 'refuse-all') {
      const none = { ad_personalization: false, ad_user_data: false, ad_storage: false, analytics_storage: false };
      saveConsent(none);
      setToggles(none);
      closeModal();
      hideBanner();
    } else if (action === 'customize') {
      openModal();
    } else if (action === 'save-prefs') {
      saveConsent(readToggles());
      closeModal();
      hideBanner();
    }

    // Lien "Gérer les cookies" (footer) — rouvre la fenêtre à tout moment.
    if (e.target.closest('[data-cookie-settings]')) {
      e.preventDefault();
      setToggles(readConsent() || {});
      openModal();
    }
  });

  if (!existing) showBanner();
});
