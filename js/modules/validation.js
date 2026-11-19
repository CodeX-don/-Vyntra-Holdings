'use strict';

import { qs } from '../utils/helpers.js';

/** Pragmatic email pattern — rejects blanks and obvious typos. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Allows +264…, 081…, (061) 123 456 — digits plus the usual separators. */
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

/**
 * The error paragraph linked to a field through aria-describedby.
 * @param {HTMLElement} field
 * @returns {HTMLElement|null}
 */
export const getErrorElement = (field) => {
  const id = field.getAttribute('aria-describedby');
  return id ? document.getElementById(id) : null;
};

/**
 * Flag a field as invalid and reveal its inline message.
 * @param {HTMLElement} field
 */
export const showFieldError = (field) => {
  field.classList.add('is-invalid');
  field.classList.remove('is-valid');
  field.setAttribute('aria-invalid', 'true');

  const error = getErrorElement(field);
  if (error) error.classList.add('is-visible');
};

/**
 * Reset a field back to its untouched state.
 * @param {HTMLElement} field
 */
export const clearFieldError = (field) => {
  field.classList.remove('is-invalid', 'is-valid');
  field.removeAttribute('aria-invalid');

  const error = getErrorElement(field);
  if (error) error.classList.remove('is-visible');
};

/**
 * Mark a field as successfully validated.
 * @param {HTMLElement} field
 */
export const markFieldValid = (field) => {
  clearFieldError(field);
  field.classList.add('is-valid');
};

/** @param {string} value */
export const isBlank = (value) => value.trim().length === 0;

/** @param {string} value */
export const isValidEmail = (value) => EMAIL_PATTERN.test(value.trim());

/** @param {string} value */
export const isValidPhone = (value) => PHONE_PATTERN.test(value.trim());

/**
 * Honeypot check (TDD §8.1): a filled hidden field means the sender is a bot.
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
export const isBot = (form) => {
  const honeypot = qs('[name="website_url"]', form);
  return Boolean(honeypot && honeypot.value.trim() !== '');
};

/**
 * Move focus to the first invalid field and bring it into view (flow §5.2).
 * @param {HTMLFormElement} form
 * @returns {HTMLElement|null} The focused field, if any.
 */
export const focusFirstInvalid = (form) => {
  const field = qs('.is-invalid', form);
  if (!field) return null;

  field.focus({ preventScroll: true });
  field.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return field;
};
