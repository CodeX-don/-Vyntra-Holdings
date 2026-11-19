'use strict';

/**
 * Shared DOM / event helpers.
 * Keeps every module free of repeated querySelector and addEventListener noise.
 */

/**
 * Query a single element.
 * @param {string} selector CSS selector.
 * @param {ParentNode} [scope=document] Optional root to search within.
 * @returns {Element|null}
 */
export const qs = (selector, scope = document) => scope.querySelector(selector);

/**
 * Query all matching elements as a real array (so .map/.filter work).
 * @param {string} selector CSS selector.
 * @param {ParentNode} [scope=document] Optional root to search within.
 * @returns {Element[]}
 */
export const qsa = (selector, scope = document) =>
  Array.from(scope.querySelectorAll(selector));

/**
 * Attach an event listener.
 * @param {EventTarget} target
 * @param {string} type
 * @param {EventListenerOrEventListenerObject} handler
 * @param {AddEventListenerOptions|boolean} [options]
 */
export const on = (target, type, handler, options) => {
  target.addEventListener(type, handler, options);
};

/** @returns {boolean} True when the visitor has asked for reduced motion. */
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Height of the sticky header, used to offset anchor scrolling.
 * @returns {number} Pixels.
 */
export const getHeaderHeight = () => {
  const header = qs('[data-header]');
  return header ? header.offsetHeight : 0;
};
