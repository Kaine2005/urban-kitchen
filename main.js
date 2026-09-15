'use strict';

/* ── NAV scroll state ── */
const nav = document.getElementById('site-nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 48);
  }, { passive: true });
}


/* ── Mobile overlay ── */
const overlay   = document.getElementById('mobile-overlay');
const burgerBtn = document.getElementById('burger');
const closeBtn  = document.getElementById('overlay-close');

if (overlay && burgerBtn && closeBtn) {
  const openOverlay = () => {
    overlay.classList.add('open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeOverlay = () => {
    overlay.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  burgerBtn.addEventListener('click', openOverlay);
  closeBtn.addEventListener('click', closeOverlay);
  document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeOverlay));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOverlay(); });
}


/* ── Hero parallax (home page only, desktop, passive) ── */
const heroBg = document.getElementById('hero-bg');
if (heroBg && window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)').matches) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
  }, { passive: true });
}


/* ── Scroll-triggered animations ──
   Handles .lr (line reveals), .ir (image sweep), .fu (fade-up).
   Groups: if parent has .anim-group, observing the parent fires
   the animation on all children.
── */
const THRESHOLD = 0.12;
const ROOT_MARGIN = '0px 0px -40px 0px';

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: THRESHOLD, rootMargin: ROOT_MARGIN });

document.querySelectorAll('.lr, .ir').forEach(el => revealObserver.observe(el));

const fuObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    setTimeout(() => entry.target.classList.add('in'), i * 60);
    fuObserver.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: ROOT_MARGIN });

document.querySelectorAll('.fu').forEach(el => fuObserver.observe(el));

const groupObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    groupObserver.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: ROOT_MARGIN });

document.querySelectorAll('.anim-group').forEach(el => groupObserver.observe(el));


/* ── Menu filter tabs (menu page) ── */
const tabs = document.querySelectorAll('.menu__tab');
const cats = document.querySelectorAll('.menu-cat');

if (tabs.length && cats.length) {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;

      cats.forEach(cat => {
        const show = filter === 'all' || cat.dataset.section === filter;
        if (show) {
          cat.style.display = '';
          cat.querySelectorAll('.menu-item').forEach((item, i) => {
            item.classList.remove('entering');
            void item.offsetWidth; /* force reflow */
            item.style.animationDelay = `${i * 55}ms`;
            item.classList.add('entering');
          });
        } else {
          cat.style.display = 'none';
        }
      });
    });
  });
}


/* ── Gallery drag-to-scroll (home page) ── */
const track = document.getElementById('gallery-track');
if (track) {
  let isDragging = false, startX = 0, scrollLeft = 0;

  track.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.classList.add('is-dragging');
  });
  track.addEventListener('mouseleave', () => { isDragging = false; track.classList.remove('is-dragging'); });
  track.addEventListener('mouseup',    () => { isDragging = false; track.classList.remove('is-dragging'); });
  track.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    const x    = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.4;
    track.scrollLeft = scrollLeft - walk;
  });
}
