'use strict';

import { qs, qsa, on, prefersReducedMotion, getHeaderHeight } from '../utils/helpers.js';

/** Scroll distance (px) before the header turns solid (TDD §4.2). */
const SCROLL_THRESHOLD = 50;

/** Breathing room left above a scrolled-to section. */
const ANCHOR_GAP = 16;

/**
 * Adds `.is-scrolled` to the header once the page has scrolled past the
 * threshold, which triggers the solid background + shadow.
 */
const initStickyHeader = () => {
  const header = qs('[data-header]');
  if (!header) return;

  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  on(window, 'scroll', update, { passive: true });
  update();
};

/**
 * Smooth-scroll to an element, offset by the sticky header height.
 * @param {HTMLElement} target
 */
const scrollToTarget = (target) => {
  const top =
    target.getBoundingClientRect().top + window.scrollY - getHeaderHeight() - ANCHOR_GAP;

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  });
};

/**
 * Intercept in-page anchor links so they land below the sticky header.
 * Links pointing at another page are left to the browser.
 */
const initSmoothAnchors = () => {
  qsa('a[href*="#"]').forEach((link) => {
    on(link, 'click', (event) => {
      const url = new URL(link.href, window.location.href);
      const hash = url.hash.slice(1);

      if (!hash || url.pathname !== window.location.pathname) return;

      const target = document.getElementById(decodeURIComponent(hash));
      if (!target) return;

      event.preventDefault();
      scrollToTarget(target);
      window.history.pushState(null, '', url.hash);
    });
  });
};

/**
 * Fade + lift `.reveal` elements into view once they enter the viewport.
 * Falls back to showing everything when motion is reduced.
 */
const initReveal = () => {
  const items = qsa('.reveal');
  if (!items.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );

  items.forEach((item) => observer.observe(item));
};

/** Initialises sticky header, smooth anchors and scroll reveals. */
export const initScroll = () => {
  initStickyHeader();
  initSmoothAnchors();
  initReveal();
};
