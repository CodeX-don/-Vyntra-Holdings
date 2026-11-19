'use strict';

import { qs, qsa, on, getHeaderHeight } from '../utils/helpers.js';

/** Elements that can receive keyboard focus inside the mobile menu. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

/** Desktop breakpoint (matches the 1024px media query in components.css). */
const DESKTOP_QUERY = '(min-width: 1024px)';

/**
 * Mobile menu (slide-in panel), sticky-header interaction helpers and
 * scroll-spy for the homepage section links.
 */
export const initNavigation = () => {
  const nav = qs('[data-nav]');
  const toggle = qs('[data-nav-toggle]');
  const backdrop = qs('[data-nav-backdrop]');
  const closeButton = qs('[data-nav-close]');
  if (!nav || !toggle) return;

  let isOpen = false;

  const openMenu = () => {
    isOpen = true;
    nav.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-open');
    document.body.classList.add('u-no-scroll');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');

    const firstFocusable = qs(FOCUSABLE, nav);
    if (firstFocusable) firstFocusable.focus();
  };

  /**
   * @param {boolean} [returnFocus=true] Send focus back to the hamburger button.
   */
  const closeMenu = (returnFocus = true) => {
    if (!isOpen) return;

    isOpen = false;
    nav.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-open');
    document.body.classList.remove('u-no-scroll');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');

    if (returnFocus) toggle.focus();
  };

  /** Keep Tab and Shift+Tab cycling inside the open menu (flow §2). */
  const trapFocus = (event) => {
    if (!isOpen || event.key !== 'Tab') return;

    const focusables = qsa(FOCUSABLE, nav);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  on(toggle, 'click', () => (isOpen ? closeMenu() : openMenu()));
  if (backdrop) on(backdrop, 'click', () => closeMenu());
  if (closeButton) on(closeButton, 'click', () => closeMenu());

  on(document, 'keydown', (event) => {
    if (event.key === 'Escape' && isOpen) closeMenu();
    trapFocus(event);
  });

  // Selecting a link closes the menu before the link action runs (flow §2).
  qsa('a', nav).forEach((link) => {
    on(link, 'click', () => closeMenu(false));
  });

  // Reset state if the viewport grows past the mobile breakpoint.
  const desktop = window.matchMedia(DESKTOP_QUERY);
  on(desktop, 'change', (event) => {
    if (event.matches) closeMenu(false);
  });

  initActiveLink();
};

/**
 * Highlights the navigation link for the section currently in view.
 * Only runs on pages whose nav links carry `data-nav-section`.
 */
const initActiveLink = () => {
  const links = qsa('[data-nav-section]');
  if (!links.length) return;

  const entries = links
    .map((link) => ({ link, section: document.getElementById(link.dataset.navSection) }))
    .filter((entry) => entry.section);
  if (!entries.length) return;

  const update = () => {
    const marker = window.scrollY + getHeaderHeight() + 40;
    let current = null;

    entries.forEach((entry) => {
      if (entry.section.offsetTop <= marker) current = entry.link;
    });

    links.forEach((link) => {
      link.classList.toggle('nav__link--active', link === current);
    });
  };

  on(window, 'scroll', update, { passive: true });
  update();
};
