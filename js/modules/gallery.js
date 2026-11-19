'use strict';

import { qs, qsa, on } from '../utils/helpers.js';

/**
 * Drives the portfolio lightbox with prev/next navigation and a focus trap.
 *
 * Hooks expected in the markup:
 *   [data-lightbox-open]   — a gallery tile button (holds the <img> + data-caption)
 *   [data-lightbox]        — the lightbox container (role="dialog")
 *   [data-lightbox-image]  — the <img> shown in the lightbox
 *   [data-lightbox-caption] — the caption element
 *   [data-lightbox-close]  — any close trigger (overlay + X button)
 *   [data-lightbox-prev]   — previous image button
 *   [data-lightbox-next]   — next image button
 *
 * No-ops on pages where the gallery markup is absent (booking, contact, etc.).
 */
export const initGallery = () => {
  const lightbox = qs('[data-lightbox]');
  if (!lightbox) return;

  const image = qs('[data-lightbox-image]', lightbox);
  const caption = qs('[data-lightbox-caption]', lightbox);
  const prevButton = qs('[data-lightbox-prev]', lightbox);
  const nextButton = qs('[data-lightbox-next]', lightbox);
  if (!image) return;

  const triggers = qsa('[data-lightbox-open]');
  if (!triggers.length) return;

  /** Index of the currently shown image within the `triggers` array. */
  let currentIndex = 0;
  /** The tile that opened the lightbox — focus returns here on close. */
  let lastTrigger = null;

  /**
   * Populate the lightbox image + caption from the trigger at `index`.
   * @param {number} index Position in the `triggers` array.
   */
  const show = (index) => {
    const trigger = triggers[index];
    if (!trigger) return;

    const tileImage = qs('img', trigger);
    if (!tileImage) return;

    image.src = tileImage.currentSrc || tileImage.src;
    image.alt = tileImage.alt || '';
    if (caption) caption.textContent = trigger.dataset.caption || '';
    currentIndex = index;
  };

  const showPrev = () => {
    const next = (currentIndex - 1 + triggers.length) % triggers.length;
    show(next);
  };

  const showNext = () => {
    const next = (currentIndex + 1) % triggers.length;
    show(next);
  };

  const open = (trigger) => {
    const index = triggers.indexOf(trigger);
    show(index === -1 ? 0 : index);

    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add('is-open'));
    document.body.classList.add('u-no-scroll');
    lastTrigger = trigger;

    // Move focus into the dialog so keyboard users are inside the viewer.
    if (nextButton) nextButton.focus();
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('u-no-scroll');

    window.setTimeout(() => {
      if (!lightbox.classList.contains('is-open')) {
        lightbox.hidden = true;
        image.src = '';
      }
    }, 260);

    if (lastTrigger) lastTrigger.focus();
  };

  /* ----- Event wiring ------------------------------------------------- */

  triggers.forEach((trigger) => {
    on(trigger, 'click', () => open(trigger));
  });

  qsa('[data-lightbox-close]', lightbox).forEach((closer) => {
    on(closer, 'click', close);
  });

  if (prevButton) on(prevButton, 'click', showPrev);
  if (nextButton) on(nextButton, 'click', showNext);

  /* ----- Keyboard: arrows + Escape + focus trap ----------------------- */

  const focusableSelector =
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  on(document, 'keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      close();
      return;
    }

    if (event.key === 'ArrowLeft') {
      showPrev();
      return;
    }

    if (event.key === 'ArrowRight') {
      showNext();
      return;
    }

    // Basic focus trap: keep Tab inside the lightbox.
    if (event.key === 'Tab') {
      const focusable = qsa(focusableSelector, lightbox).filter(
        (el) => !el.hasAttribute('hidden')
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
};
