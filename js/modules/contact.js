'use strict';

import { qs, on } from '../utils/helpers.js';
import {
  showFieldError,
  clearFieldError,
  isBlank,
  isValidEmail,
  isBot,
  focusFirstInvalid,
} from './validation.js';

/** Receiving email address for contact-form submissions. */
const CONTACT_EMAIL = 'charlinepedro247@gmail.com';

/** Delay before handing the visitor over to the thank-you page (flow §3.3). */
const REDIRECT_DELAY = 1200;

/**
 * Contact page: validates the enquiry, hands it to the visitor's mail app and
 * then resolves to thank-you.html. No-ops when the form is absent.
 */
export const initContactForm = () => {
  const form = qs('[data-contact-form]');
  if (!form) return;

  const name = qs('#contact-name', form);
  const email = qs('#contact-email', form);
  const message = qs('#contact-message', form);
  if (!name || !email || !message) return;

  /** @returns {boolean} True when the enquiry can be sent. */
  const validate = () => {
    let isValid = true;

    if (isBlank(name.value)) {
      showFieldError(name);
      isValid = false;
    } else {
      clearFieldError(name);
    }

    if (!isValidEmail(email.value)) {
      showFieldError(email);
      isValid = false;
    } else {
      clearFieldError(email);
    }

    if (isBlank(message.value)) {
      showFieldError(message);
      isValid = false;
    } else {
      clearFieldError(message);
    }

    return isValid;
  };

  on(form, 'submit', (event) => {
    event.preventDefault();

    if (isBot(form)) return;

    if (!validate()) {
      focusFirstInvalid(form);
      return;
    }

    const subject = `Website enquiry from ${name.value.trim()}`;
    const body = `${message.value.trim()}\n\n—\n${name.value.trim()}\n${email.value.trim()}`;

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.setTimeout(() => {
      window.location.href = 'thank-you.html';
    }, REDIRECT_DELAY);
  });

  on(name, 'input', () => clearFieldError(name));
  on(email, 'input', () => clearFieldError(email));
  on(message, 'input', () => clearFieldError(message));
};
