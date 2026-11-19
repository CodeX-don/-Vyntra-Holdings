# ENGINEERING & DEVELOPMENT GUIDELINES
## Project: "Beauty Salon" Official Website
**Version:** 1.0
**Date:** November 16, 2026
**Status:** Ready for Development

---

## 1. DEVELOPMENT ENVIRONMENT & TOOLING
To ensure a smooth development experience and consistent code output, the following environment setup is required.

### 1.1 Recommended IDE & Extensions
*   **IDE:** Visual Studio Code (VS Code).
*   **Required Extensions:**
    *   **Prettier - Code formatter:** For consistent HTML/CSS/JS formatting.
    *   **Live Server:** To run a local development server with hot-reloading.
    *   **ESLint:** For JavaScript linting and error catching.
    *   **HTMLHint:** For HTML validation.
    *   **W3C Web Validation:** To check for standard compliance.

### 1.2 Local Development Setup
1.  Clone the repository.
2.  Open the root folder in VS Code.
3.  Right-click `index.html` and select "Open with Live Server".
4.  Do not open HTML files directly via the `file://` protocol, as this breaks JavaScript modules and CORS policies.

---

## 2. CODING STANDARDS & CONVENTIONS
Strict adherence to these standards is required to keep the codebase clean, maintainable, and easy for the AI agent to parse.

### 2.1 HTML Standards
*   **Semantic Tags:** Always use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`. Avoid excessive `<div>` soup.
*   **Attributes:** Use double quotes for attributes (`class="card"`).
*   **Accessibility:** Every `<img>` must have an `alt` attribute. Use `aria-label` for icon-only buttons.
*   **Formatting:** 2-space indentation. Lowercase tags.

### 2.2 CSS Standards
*   **Methodology:** BEM (Block Element Modifier). Example: `.service-card__title--highlight`.
*   **Variables:** **NEVER** hardcode hex colors or pixel values for spacing in component files. Always use `var(--token-name)` from `02-tokens.css`.
*   **Mobile-First:** Write base styles for mobile. Use `@media (min-width: ...)` for larger screens.
*   **Forbidden:** Do not use `!important`. Do not use inline styles (`style="..."`). Do not use ID selectors for styling (`#header`).

### 2.3 JavaScript Standards
*   **Syntax:** ES6+ (Arrow functions, `const`/`let`, template literals, destructuring). **Never use `var`.**
*   **Strict Mode:** Always include `'use strict';` at the top of JS files.
*   **Modularity:** Keep logic separated into modules (`/js/modules/`). Do not write 500 lines of code in a single file.
*   **DOM Manipulation:** Cache DOM elements in variables if they are used more than once. 
    *   *Bad:* `document.querySelector('.btn').addEventListener...` (twice)
    *   *Good:* `const btn = document.querySelector('.btn'); btn.addEventListener...`

---

## 3. AI AGENT COLLABORATION WORKFLOW
Since this project is being built with an AI coding agent (Qoder, OpenCode, Claude Code), follow these rules to prevent the AI from generating messy or hallucinated code.

### 3.1 The "One File at a Time" Rule
*   **Never** ask the AI to "build the whole website". 
*   **Always** prompt it to build one specific file or component at a time.
*   *Example Prompt:* "Read `tdd.md`. Now, generate the code for `css/02-tokens.css` and `css/01-reset.css` only. Wait for my approval before moving on."

### 3.2 Context Injection
AI agents have limited context windows. If the agent starts forgetting the rules, re-inject the context:
*   *Prompt:* "Reminder: We are building a static HTML/CSS/JS site. No frameworks. No makeup services. Currency is N$. Follow BEM CSS. Review `prd.md` if you are unsure about the pricing."

### 3.3 Handling AI Errors
If the AI generates broken code:
1.  **Do not** just say "fix it".
2.  **Do** provide the exact error message and the specific file name.
3.  *Prompt:* "In `js/modules/booking.js`, line 45 throws a 'Cannot read property of null' error. The element `.summary-total` is missing in the HTML. Please fix the JS to check if the element exists before updating it."

---

## 4. VERSION CONTROL (GIT) WORKFLOW
Even for a static site, version control is mandatory for tracking changes and rolling back mistakes.

### 4.1 Branching Strategy
*   `main`: Production-ready code. Only merge here when the site is fully tested.
*   `develop`: Staging branch. This is where the AI agent should commit its daily work.
*   `feature/*`: (Optional) If building a complex feature (e.g., the booking calculator), branch off `develop`.

### 4.2 Commit Message Convention
Use **Conventional Commits** to keep the git history clean.
*   `feat:` A new feature (e.g., `feat: add booking form calculator`)
*   `fix:` A bug fix (e.g., `fix: mobile nav not closing on link click`)
*   `style:` Formatting, missing semi-colons, etc. (e.g., `style: format css with prettier`)
*   `docs:` Documentation only (e.g., `docs: update engineering guidelines`)
*   `refactor:` Code change that neither fixes a bug nor adds a feature.

---

## 5. TESTING & QUALITY ASSURANCE (QA)
Before deploying, the site must pass the following QA checks.

### 5.1 Functional QA Checklist
- [ ] **The Golden Rule:** Search the entire codebase for the words "makeup", "cosmetics", and "makeup artist". **Result must be 0.**
- [ ] **Pricing Check:** Verify all prices match the PRD exactly (Wigs: 1800-2800, Install: 250, Lashes: 250, Hands: 160, Toes: 80, Hampers: 980-4800). Currency must be **N$**.
- [ ] **Booking Flow:** Fill out the booking form, select multiple services, verify the total calculates correctly, and ensure the WhatsApp link generates the correct text.
- [ ] **Contact Flow:** Ensure the contact form triggers the `mailto:` action correctly.
- [ ] **Navigation:** Ensure all anchor links smooth-scroll to the correct sections without overlapping the sticky header.

### 5.2 Responsive & Cross-Browser QA
- [ ] **Breakpoints:** Test at 320px (small mobile), 375px (standard mobile), 768px (tablet), 1024px (laptop), and 1440px (desktop).
- [ ] **Browsers:** Test on Chrome, Firefox, Safari, and Edge.
- [ ] **Images:** Ensure no images overflow their containers on small screens (`max-width: 100%; height: auto;`).

### 5.3 Performance & Accessibility (Lighthouse)
Run Chrome DevTools -> Lighthouse. Target scores:
- **Performance:** > 90
- **Accessibility:** > 95 (Check color contrast and missing alt tags)
- **Best Practices:** > 90
- **SEO:** > 90 (Check meta tags and semantic HTML)

---

## 6. DEPLOYMENT & HOSTING
Since this is a static site, deployment should be free, fast, and automated.

### 6.1 Recommended Platforms
1.  **Netlify** (Recommended): Drag-and-drop the folder, or connect to GitHub for automatic deployments.
2.  **Vercel:** Excellent for static sites, connects easily to GitHub.
3.  **GitHub Pages:** Free, but requires a bit more configuration for custom domains.

### 6.2 Deployment Steps (Netlify Example)
1.  Push the final `main` branch to GitHub.
2.  Log in to Netlify and click "Add new site" -> "Import an existing project".
3.  Connect the GitHub repository.
4.  Build settings: Leave blank (no build command, publish directory is `/`).
5.  Click Deploy.

### 6.3 Environment Variables (If needed)
If using a form backend like Formspree later, store the API endpoint in a `.env` file and inject it via the build process, or simply hardcode it in `forms.js` if keeping it purely static. For WhatsApp, the phone number is hardcoded in `booking.js` as per the TDD.

---

## 7. CLIENT HANDOVER & MAINTENANCE
The client will not have a CMS (like WordPress). They will need to edit the HTML directly or ask you to make changes. Provide them with a simple guide.

### 7.1 How the Client Can Update Content
Create a `client-guide.md` for them, explaining:
*   **Changing Text:** Open `index.html`, look for the text between tags (e.g., `<h1>Change this text</h1>`), and update it.
*   **Changing Prices:** Open `index.html` and `booking.html`, search for "N$" and update the numbers.
*   **Changing Images:** Replace the image files in the `/assets/images/` folder. **Crucial:** The new image must have the *exact same filename* as the old one, or they must update the `src` attribute in the HTML.

### 7.2 Future Enhancements (Out of Scope for v1.0)
Document these for future phases so the client knows what is possible later:
*   Integrating a real backend for booking (e.g., Calendly, Acuity Scheduling).
*   Adding an e-commerce cart for Hampers (e.g., Shopify Lite, Snipcart).
*   Adding a blog for SEO and lash care tips.

---

## 8. AI AGENT EXECUTION RULES FOR ENGINEERING
1.  **Linting:** Before finishing a file, the AI must mentally "lint" the code against the standards in Section 2.
2.  **No Shortcuts:** Do not use placeholder text like "Lorem Ipsum" unless explicitly told to. Use the exact copy from `prd.md`.
3.  **Dry Code:** Do not repeat CSS or JS. If a style is used twice, make it a utility class or a variable.
4.  **Comments:** Add brief, helpful comments for complex JS logic (e.g., the WhatsApp payload generator). Do not comment obvious things (e.g., `// This is the header`).