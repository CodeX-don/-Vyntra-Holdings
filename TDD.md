# TECHNICAL DESIGN DOCUMENT (TDD)
## Project: "Beauty Salon" Official Website
**Version:** 1.0
**Date:** November 16, 2026
**Status:** Ready for Implementation

---

## 1. SYSTEM ARCHITECTURE
**Type:** Static, Client-Side Single Page Application (SPA) feel with multi-page routing.
**Backend:** None. All data processing (form validation, price calculation) happens client-side via JavaScript. External communication relies on client-side URL redirection (WhatsApp API, `mailto:`).
**Hosting:** Static hosting (Netlify, Vercel, GitHub Pages, or standard cPanel).

---

## 2. DIRECTORY STRUCTURE & FILE ORGANIZATION
The project will use a modular, flat-file structure. No build tools (Webpack/Vite) are required for development, but files should be written cleanly for easy minification later.

```text
/beauty-salon
│
├── index.html                 # Homepage
├── booking.html               # Booking form
├── contact.html               # Contact & location
├── thank-you.html             # Success state
│
├── /assets
│   ├── /images                # .webp and .jpg formats
│   ├── /icons                 # SVG icons (inline or external)
│   └── /fonts                 # Local font files (if not using Google Fonts CDN)
│
├── /css
│   ├── 01-reset.css           # CSS reset / normalize
│   ├── 02-tokens.css          # CSS Custom Properties (Variables)
│   ├── 03-typography.css      # Font imports and base text styles
│   ├── 04-layout.css          # Grid system, containers, wrappers
│   ├── 05-components.css      # Buttons, cards, forms, nav
│   └── 06-utilities.css       # Margin/padding helpers, text-align, display
│
└── /js
    ├── app.js                 # Main entry point, initializes modules
    ├── modules/
    │   ├── navigation.js      # Mobile menu, sticky header, active links
    │   ├── scroll.js          # Smooth scroll, intersection observer reveals
    │   ├── booking.js         # Form state, price calculator, WhatsApp logic
    │   └── validation.js      # Form validation utilities
    └── utils/
        └── helpers.js         # DOM selectors, event listeners wrappers

        3. CSS ARCHITECTURE & METHODOLOGY
We will use a simplified BEM (Block Element Modifier) methodology combined with a Layered CSS approach to keep styles predictable and prevent specificity wars.
3.1 Naming Conventions (BEM)
Block: .card, .nav, .form
Element: .card__image, .nav__link, .form__input
Modifier: .card--featured, .nav__link--active, .btn--primary
3.2 CSS Loading Order
01-reset.css: Erases browser defaults.
02-tokens.css: Defines :root variables. Rule: No hardcoded colors or spacing values allowed in other files; use var(--token-name).
03-typography.css: Base body, h1-h6, p, a styles.
04-layout.css: .container, .grid, .section classes.
05-components.css: Specific UI blocks.
06-utilities.css: .u-mt-2, .u-text-center, .u-hidden-mobile.
3.3 Responsive Strategy
Mobile-first approach. Base styles are for mobile. Use min-width media queries for larger screens.
css
/* Example */
.grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
@media (min-width: 768px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }
4. JAVASCRIPT ARCHITECTURE
Vanilla ES6+ JavaScript using the Module Pattern (or ES6 Modules if using <script type="module">). No global scope pollution.
4.1 State Management (Booking Form)
Since there is no backend, state is managed in a simple JS object within booking.js.
javascript
const bookingState = {
  services: [], // Array of selected service objects { id, name, price }
  customer: { name: '', phone: '', email: '' },
  dateTime: { date: '', time: '' },
  total: 0
};
4.2 Module Responsibilities
navigation.js: Handles the hamburger toggle. Adds/removes .is-open class on the <nav>. Handles closing the menu when a link is clicked.
scroll.js:
Adds .is-scrolled class to <header> when window.scrollY > 50.
Uses IntersectionObserver to add .is-visible to elements with .reveal class.
booking.js:
Listens to changes on the <select> dropdowns.
Updates bookingState.services and recalculates bookingState.total.
Updates the DOM elements in the "Booking Summary" sidebar.
validation.js:
Checks for empty required fields, valid email regex, and valid phone numbers.
Toggles .is-invalid class on inputs and displays error messages.
5. INTEGRATIONS & DATA FLOW
5.1 WhatsApp Booking Integration
Instead of a backend, the booking form submits to WhatsApp.
Flow:
User fills form and clicks "Confirm via WhatsApp".
validation.js checks inputs. If invalid, stop.
booking.js constructs the message payload.
Browser redirects to the WhatsApp API URL.
Payload Construction Logic:
javascript
function generateWhatsAppLink(state) {
  const phoneNumber = "264000000000"; // Replace with actual client number (no +)
  
  let message = `*New Booking Request*\n\n`;
  message += `*Name:* ${state.customer.name}\n`;
  message += `*Phone:* ${state.customer.phone}\n`;
  message += `*Email:* ${state.customer.email}\n\n`;
  message += `*Requested Services:*\n`;
  
  state.services.forEach(service => {
    message += `- ${service.name} (N$${service.price})\n`;
  });
  
  message += `\n*Total Estimate:* N$${state.total}\n`;
  message += `*Preferred Date:* ${state.dateTime.date}\n`;
  message += `*Preferred Time:* ${state.dateTime.time}\n`;
  message += `\n*Notes:* ${state.notes || 'None'}`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
5.2 Contact Form (Mailto)
The contact form on contact.html will use a simple mailto: fallback or a free service like Formspree if the client prefers. For pure static, mailto: is the baseline.
6. PERFORMANCE & OPTIMIZATION STRATEGY
6.1 Image Optimization
Formats: Serve images in .webp with .jpg fallbacks using the <picture> element.
Sizing: Use srcset for responsive images (e.g., hero image needs different sizes for mobile vs desktop).
Loading: All images below the fold must have loading="lazy".
Dimensions: Always specify width and height attributes on <img> tags to prevent Cumulative Layout Shift (CLS).
6.2 CSS & JS Optimization
Keep CSS in the <head> to prevent FOUC (Flash of Unstyled Content).
Place <script> tags at the end of the <body> or use defer.
Use will-change: transform, opacity; sparingly on elements that will be animated via Intersection Observer.
6.3 Core Web Vitals Targets
LCP (Largest Contentful Paint): < 2.5s (Optimize hero image, preload critical fonts).
CLS (Cumulative Layout Shift): < 0.1 (Strict image dimensions, reserve space for dynamic content).
INP (Interaction to Next Paint): < 200ms (Keep JS event listeners lightweight).
7. ACCESSIBILITY (A11Y) IMPLEMENTATION
7.1 Semantic HTML
Use <main> to wrap page content.
Use <section aria-labelledby="section-title"> for distinct page areas.
Use <nav aria-label="Primary Navigation">.
7.2 Focus Management
Mobile Menu: When opened, trap focus inside the menu. When closed, return focus to the hamburger button.
Skip Link: Include a hidden "Skip to main content" link at the very top of the <body>.
Form Errors: When a form fails validation, move focus to the first invalid input and use aria-describedby to link the input to its error message.
7.3 Screen Readers
Hide decorative icons from screen readers using aria-hidden="true".
Ensure all images have descriptive alt text (e.g., alt="Close up of a classic lash extension application").
8. SECURITY & PRIVACY
8.1 Form Spam Prevention
Since there is no backend CAPTCHA, implement a Honeypot field in the forms.
Add a hidden input: <input type="text" name="website_url" tabindex="-1" autocomplete="off" style="display:none;">
In JS validation: If this field has a value, block submission (it's a bot).
8.2 Data Handling
Do not store customer PII (Personally Identifiable Information) in localStorage or sessionStorage.
The WhatsApp link generates the message on the client side; no data is sent to a third-party server before the user explicitly hits "Send" in the WhatsApp app.
9. TESTING & QA CHECKLIST
9.1 Functional Testing
Mobile hamburger menu opens/closes smoothly.
Clicking nav links smooth-scrolls to the correct section.
Booking form calculates total price correctly when services are added/removed.
Booking form generates a correctly formatted WhatsApp link.
Form validation prevents submission of empty required fields.
"No makeup" rule verified (search codebase for 'makeup', 'cosmetics' to ensure zero instances).
9.2 Cross-Browser & Responsive Testing
Chrome, Firefox, Safari, Edge (Desktop).
Safari iOS, Chrome Android (Mobile).
Layout holds up at 320px, 375px, 768px, 1024px, and 1440px widths.
9.3 Performance Testing
Run Lighthouse audit. Target: 90+ for Performance, Accessibility, Best Practices, and SEO.
Verify no layout shifts occur during page load.
10. AI AGENT EXECUTION RULES
Read First: Read prd.md and tdd.md completely before generating any code.
File by File: Generate one file at a time. Wait for user confirmation before moving to the next file.
No Hallucinations: Do not invent new CSS variables or JS functions not defined in this document.
Strict Pricing: Hardcode the prices exactly as specified in the PRD. Do not use variables for prices unless explicitly requested.
Clean Code: Write clean, well-commented code. Use JSDoc for complex JS functions.