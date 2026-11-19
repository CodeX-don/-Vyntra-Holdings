'use strict';

import { qs, qsa, on } from '../utils/helpers.js';
import {
  showFieldError,
  clearFieldError,
  isBlank,
  isValidEmail,
  isValidPhone,
  isBot,
  focusFirstInvalid,
} from './validation.js';

/**
 * Bookable services. Prices are hardcoded from the PRD (§5.1).
 * Wig Sales is the only ranged price (flow §5.4).
 */
const SERVICES = [
  { id: 'wig-install', name: 'Wig Installation', type: 'fixed', price: 250 },
  { id: 'lashes', name: 'Eyelash Extensions', type: 'fixed', price: 250 },
  { id: 'nails-hands', name: 'Nails (Hands)', type: 'fixed', price: 160 },
  { id: 'nails-toes', name: 'Nails (Toes)', type: 'fixed', price: 80 },
  { id: 'wig-sales', name: 'Wig Sales', type: 'range', price: 1800, maxPrice: 2800 },
];

/** Client WhatsApp number — digits only, country code first, no "+". */
const WHATSAPP_NUMBER = '264818321277';

/** Appended to the WhatsApp message when a ranged price is part of the booking. */
const RANGE_NOTE =
  'Wig Sales starts at N$1,800 — the final price depends on the length and texture you choose.';

/** @param {number} value @returns {string} e.g. 1800 -> "N$1,800" */
const formatPrice = (value) => `N$${value.toLocaleString('en-US')}`;

/**
 * Builds the WhatsApp deep link from the collected booking state (TDD §5.1).
 * @param {{services: Array, customer: Object, dateTime: Object, notes: string, total: number, hasRange: boolean}} payload
 * @returns {string}
 */
const generateWhatsAppLink = (payload) => {
  let message = '*New Booking Request*\n\n';
  message += `*Name:* ${payload.customer.name}\n`;
  message += `*Phone:* ${payload.customer.phone}\n`;
  message += `*Email:* ${payload.customer.email || 'Not provided'}\n\n`;
  message += '*Requested Services:*\n';

  payload.services.forEach((service) => {
    message += `- ${service.name} (N$${service.price})\n`;
  });

  message += `\n*Total Estimate:* N$${payload.total.toLocaleString('en-US')}${
    payload.hasRange ? '+' : ''
  }\n`;
  message += `*Preferred Date:* ${payload.dateTime.date || 'Flexible'}\n`;
  message += `*Preferred Time:* ${payload.dateTime.time || 'Flexible'}\n`;
  message += `\n*Notes:* ${payload.notes || 'None'}`;

  if (payload.hasRange) {
    message += `\n\n(Note: ${RANGE_NOTE})`;
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

/**
 * Wires the booking form: dynamic service rows, live price calculator and the
 * WhatsApp hand-off. No-ops when the booking markup is not on the page.
 */
export const initBooking = () => {
  const form = qs('[data-booking-form]');
  if (!form) return;

  const rowsContainer = qs('[data-service-rows]', form);
  const addButton = qs('[data-add-service]', form);
  const template = qs('#service-row-template');
  const summaryItems = qs('[data-summary-items]');
  const summaryEmpty = qs('[data-summary-empty]');
  const summaryTotal = qs('[data-summary-total]');
  const summaryNote = qs('[data-summary-note]');
  if (!rowsContainer || !template || !summaryItems || !summaryTotal) return;

  const name = qs('#booking-name', form);
  const phone = qs('#booking-phone', form);
  const email = qs('#booking-email', form);
  const date = qs('#booking-date', form);
  const time = qs('#booking-time', form);
  const notes = qs('#booking-notes', form);
  const servicesError = qs('[data-services-error]', form);

  /** Selected services, recalculated on every change. */
  const state = { services: [], total: 0, hasRange: false };

  /* ---------------------------------------------------------------------- */
  /* Service rows                                                            */
  /* ---------------------------------------------------------------------- */

  /**
   * Clone the template into the form and populate its dropdown.
   * @param {string} [preselectId] Service id to preselect (from ?service=…).
   * @returns {HTMLElement}
   */
  const createRow = (preselectId) => {
    const row = template.content.firstElementChild.cloneNode(true);
    const select = qs('[data-service-select]', row);

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select a service…';
    select.appendChild(placeholder);

    SERVICES.forEach((service) => {
      const option = document.createElement('option');
      option.value = service.id;
      option.textContent =
        service.type === 'range'
          ? `${service.name} (from ${formatPrice(service.price)})`
          : `${service.name} (${formatPrice(service.price)})`;
      select.appendChild(option);
    });

    if (preselectId) select.value = preselectId;

    on(select, 'change', () => {
      resetServiceErrors();
      sync();
    });

    on(qs('[data-remove-service]', row), 'click', () => {
      row.remove();
      renumberRows();
      resetServiceErrors();
      sync();
    });

    rowsContainer.appendChild(row);
    return row;
  };

  /** Refresh ids/labels/aria wiring after a row is added or removed. */
  const renumberRows = () => {
    const rows = qsa('[data-service-row]', rowsContainer);

    rows.forEach((row, index) => {
      const select = qs('[data-service-select]', row);
      const label = qs('[data-service-label]', row);
      const error = qs('[data-service-error]', row);
      const selectId = `booking-service-${index + 1}`;
      const errorId = `${selectId}-error`;

      select.id = selectId;
      select.setAttribute('aria-describedby', errorId);
      label.setAttribute('for', selectId);
      label.textContent = index === 0 ? 'Service' : `Additional service ${index + 1}`;
      error.id = errorId;
    });

    // A single row cannot be removed — there is nothing to fall back to.
    rows.forEach((row) => {
      const removeButton = qs('[data-remove-service]', row);
      if (removeButton) removeButton.hidden = rows.length === 1;
    });
  };

  /* ---------------------------------------------------------------------- */
  /* State + summary                                                         */
  /* ---------------------------------------------------------------------- */

  /** @returns {Object[]} Services currently chosen across every row. */
  const collectServices = () =>
    qsa('[data-service-select]', rowsContainer)
      .map((select) => SERVICES.find((service) => service.id === select.value))
      .filter(Boolean);

  /** Recalculate state from the DOM and repaint the summary. */
  const sync = () => {
    state.services = collectServices();
    state.total = state.services.reduce((sum, service) => sum + service.price, 0);
    state.hasRange = state.services.some((service) => service.type === 'range');
    renderSummary();
  };

  /** Repaint the booking summary (sidebar + mobile bar). */
  const renderSummary = () => {
    const items = state.services.map((service) => {
      const item = document.createElement('li');
      item.className = 'summary__item';

      const label = document.createElement('span');
      label.textContent = service.name;

      const price = document.createElement('span');
      price.className = 'summary__item-price';
      price.textContent =
        service.type === 'range'
          ? `from ${formatPrice(service.price)}`
          : formatPrice(service.price);

      item.append(label, price);
      return item;
    });

    summaryItems.replaceChildren(...items);

    const hasServices = state.services.length > 0;
    summaryEmpty.hidden = hasServices;
    summaryTotal.textContent = hasServices
      ? `${formatPrice(state.total)}${state.hasRange ? '+' : ''}`
      : formatPrice(0);

    if (summaryNote) {
      summaryNote.hidden = !state.hasRange;
      summaryNote.textContent = state.hasRange ? RANGE_NOTE : '';
    }
  };

  /** Clear the fieldset-level error styling. */
  const resetServiceErrors = () => {
    if (servicesError) servicesError.classList.remove('is-visible');
    qsa('[data-service-select]', rowsContainer).forEach((select) => {
      select.classList.remove('is-invalid');
    });
  };

  /* ---------------------------------------------------------------------- */
  /* Validation + submission                                                 */
  /* ---------------------------------------------------------------------- */

  /** @returns {boolean} True when the form is ready to be sent. */
  const validate = () => {
    let isValid = true;

    if (isBlank(name.value)) {
      showFieldError(name);
      isValid = false;
    } else {
      clearFieldError(name);
    }

    if (!isValidPhone(phone.value)) {
      showFieldError(phone);
      isValid = false;
    } else {
      clearFieldError(phone);
    }

    // Email is optional, but must be well formed when provided.
    if (!isBlank(email.value) && !isValidEmail(email.value)) {
      showFieldError(email);
      isValid = false;
    } else {
      clearFieldError(email);
    }

    if (state.services.length === 0) {
      isValid = false;
      if (servicesError) servicesError.classList.add('is-visible');
      qsa('[data-service-select]', rowsContainer).forEach((select) => {
        select.classList.add('is-invalid');
      });
    } else {
      resetServiceErrors();
    }

    return isValid;
  };

  /** @returns {Object} Snapshot of the form, shaped for the WhatsApp payload. */
  const buildPayload = () => ({
    services: state.services.map((service) => ({
      name: service.name,
      price:
        service.type === 'range'
          ? `${service.price.toLocaleString('en-US')}+`
          : service.price.toLocaleString('en-US'),
    })),
    customer: {
      name: name.value.trim(),
      phone: phone.value.trim(),
      email: email.value.trim(),
    },
    dateTime: { date: date.value, time: time.value },
    notes: notes.value.trim(),
    total: state.total,
    hasRange: state.hasRange,
  });

  on(form, 'submit', (event) => {
    event.preventDefault();

    // Silently drop bot submissions caught by the honeypot.
    if (isBot(form)) return;

    if (!validate()) {
      focusFirstInvalid(form);
      return;
    }

    const link = generateWhatsAppLink(buildPayload());
    window.open(link, '_blank', 'noopener');
    window.location.href = 'thank-you.html';
  });

  // Clear errors as the visitor corrects a field.
  on(name, 'input', () => clearFieldError(name));
  on(phone, 'input', () => clearFieldError(phone));
  on(email, 'input', () => clearFieldError(email));

  if (addButton) {
    on(addButton, 'click', () => {
      createRow();
      renumberRows();
      sync();
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Initial render                                                          */
  /* ---------------------------------------------------------------------- */

  const preselect = new URLSearchParams(window.location.search).get('service');
  createRow(preselect);
  renumberRows();
  sync();
};
