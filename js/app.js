'use strict';

import { initScroll } from './modules/scroll.js';
import { initNavigation } from './modules/navigation.js';
import { initBooking } from './modules/booking.js';
import { initContactForm } from './modules/contact.js';
import { initGallery } from './modules/gallery.js';

// Signals to CSS that JS is live, so scroll-reveal hiding only applies when the
// module actually executed. Content stays visible if modules are blocked.
document.documentElement.classList.add('js');

/**
 * Application entry point.
 * Every feature module no-ops when its markup is missing, so the same bundle
 * can be loaded on all four pages.
 */
const init = () => {
  initScroll();
  initNavigation();
  initBooking();
  initContactForm();
  initGallery();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
