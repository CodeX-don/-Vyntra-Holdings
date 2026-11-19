# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Project: "Beauty Salon" Official Website
**Version:** 1.0
**Date:** November 16, 2026
**Status:** Ready for Development

---

## 1. PROJECT OVERVIEW
**Objective:** Build a static, multi-page, responsive website for a Namibian beauty salon and gifting boutique. The site must showcase services (wigs, lashes, nails) and products (hampers), introduce the founder, and facilitate bookings/inquiries.
**Target Audience:** Women and men in Namibia seeking premium beauty services and luxury gift hampers.
**Core Constraint:** **ABSOLUTELY NO MAKEUP SERVICES.** Do not include makeup artists, makeup pricing, or makeup booking options anywhere in the code or UI.

---

## 2. TECHNICAL STACK & CONSTRAINTS
- **HTML:** Semantic HTML5.
- **CSS:** Vanilla CSS3. Use CSS Variables (Custom Properties) for all design tokens. No CSS frameworks (no Tailwind, no Bootstrap).
- **JavaScript:** Vanilla ES6+ JavaScript. No libraries (no jQuery, no GSAP).
- **Build Tools:** None. Pure static files.
- **Currency:** Namibian Dollar (N$). Do not use $ or R.
- **Backend:** None. Form submissions must use client-side validation and redirect to a WhatsApp deep link or `mailto:`.

---

## 3. DESIGN SYSTEM & UI/UX GUIDELINES
**Aesthetic:** "Soft & Elegant" (Inspired by minimalist, high-end spa/editorial designs). Clean, luxurious, calming, with a touch of editorial typography.

### 3.1 Color Palette (CSS Variables)
```css
:root {
  --bg-primary: #F9F5F0;       /* Soft cream/off-white for main background */
  --bg-secondary: #F2E8E0;     /* Slightly darker beige for alternating sections */
  --bg-card: #FFFFFF;          /* Pure white for cards */
  --text-primary: #2C241F;     /* Deep warm brown/black for headings */
  --text-secondary: #6B5D52;   /* Muted brown for body text */
  --accent-primary: #B88A7E;   /* Dusty mauve/rose for primary buttons & highlights */
  --accent-hover: #9A6D62;     /* Darker mauve for hover states */
  --accent-gold: #C5A059;      /* Subtle gold for tiny accents/dividers */
  --border-light: #EAE0D5;     /* Soft borders */
}

3.2 Typography
Headings (Display): 'Playfair Display', serif. (Use for H1, H2, H3).
Body (Sans): 'Jost' or 'Inter', sans-serif. (Use for paragraphs, buttons, UI).
Accents: Italicized 'Playfair Display' for single emphasis words in headings (e.g., "Everything you need for complete beauty").
3.3 Spacing & Layout
Max Width: 1200px container.
Border Radius: 12px for cards, 50px (pill) for buttons.
Shadows: Soft, diffuse shadows for cards (box-shadow: 0 10px 30px rgba(44, 36, 31, 0.06);).
4. SITEMAP & NAVIGATION
Pages:
index.html (Homepage)
booking.html (Booking Form)
contact.html (Contact & Location)
thank-you.html (Post-submission confirmation)
Global Navigation (Sticky Header):
Left: Logo (Text: "Beauty Salon" in Playfair Display).
Center (Desktop): Home | Services | About | Hampers | Contact
Right: [BOOK NOW] button (Links to booking.html).
Mobile: Hamburger menu that slides in from the right.
5. DETAILED PAGE SPECIFICATIONS
5.1 Homepage (index.html)
Section 1: Hero
Background: High-quality, soft-focus beauty/spa image with a subtle dark gradient overlay on the left for text readability.
Content:
H1: "Enhance Your Natural Beauty, Perfect Your Style." (Italicize "Perfect").
Subtext: "Premium wigs, flawless lashes, pristine nails, and curated hampers. Your one-stop destination for elegance in Namibia."
Buttons: [Book Appointment] (Primary) | [View Hampers] (Secondary/Outline).
Section 2: Quick Service Strip
A thin, clean row of 5 icons + text linking to homepage anchors: Wigs | Installation | Lashes | Nails | Hampers.
Section 3: About the Founder
Layout: 2-column (Image Left, Text Right).
Image: Placeholder for a professional, warm portrait of the founder. Add a subtle decorative border or offset background shape.
Content:
Small overline: "MEET THE FOUNDER"
H2: "Behind the Brand"
Text: "Welcome to Beauty Salon. I am [Founder Name], the creative director behind this brand. My passion is helping you look and feel your absolute best, whether that’s through a flawless set of lashes, a stunning new wig, or the perfect gift. Every service is curated with quality and care."
Signature/Name at the bottom.
Section 4: Our Services (Grid)
Layout: 3-column grid (responsive to 2, then 1).
Card Design: Image top (16:10 ratio), padding inside, title, 1-line description, Price in bold accent color, small [Book] button.
Data (Strictly follow this):
Wig Sales: "Quality wigs in various lengths & textures." | N$1,800 – N$2,800
Wig Installation: "Professional, secure, and seamless fit." | N$250
Eyelash Extensions: "All styles, from natural to dramatic." | N$250
Nails (Hands): "Pristine manicure and nail care." | N$160
Nails (Toes): "Relaxing and revitalizing pedicure." | N$80
Section 5: Curated Hampers (Product Showcase)
Background: --bg-secondary to separate from services.
Layout: Large featured image on left, text on right. Below it, a 4-image mini-gallery of different hamper types.
Content:
H2: "The Art of Gifting"
Text: "Beautifully packaged hampers for men, women, children, and fully customised requests."
Price: N$980 – N$4,800
Button: [Enquire / Order Hamper] (Links to contact.html).
Section 6: Delivery Banner
Background: --accent-primary (Mauve). Text: White.
Content: "🚚 Nationwide Delivery Available. We deliver our beauty services and hampers to all towns across Namibia."
5.2 Booking Page (booking.html)
Layout: 2-column. Form on the left (60%), Booking Summary on the right (40%).
Form Fields:
Full Name (Required)
Phone Number (Required)
Email Address
Service Selection (Dropdown: Wig Install, Lashes, Nails Hands, Nails Toes)
Preferred Date (Date picker)
Preferred Time (Time picker)
Additional Notes (Textarea)
Right Column (JS Powered):
"Booking Summary" box.
When a service is selected, display the exact price.
If multiple services are selected (add a "+ Add another service" button), calculate the Total Estimated Price.
Submit Button: "Confirm via WhatsApp".
JS Logic: On submit, validate fields, format a message string, and open https://wa.me/[PHONE_NUMBER]?text=[ENCODED_MESSAGE].
5.3 Contact Page (contact.html)
Layout: 2-column. Contact Info & Map on left, Contact Form on right.
Left Column:
Address placeholder.
Phone placeholder.
Email placeholder.
Operating Hours (Mon-Sat: 9 AM - 6 PM, Sun: Closed).
Embedded Google Map iframe (placeholder).
Right Column: Simple contact form (Name, Email, Message) that uses mailto: on submit.
6. FUNCTIONAL REQUIREMENTS (JAVASCRIPT)
Mobile Navigation: Toggle class to slide menu in/out. Close menu when a link is clicked.
Sticky Header: Add a subtle shadow and slightly reduce padding when the user scrolls past 50px.
Smooth Scrolling: All anchor links (#services) must smooth scroll, offset by the height of the sticky header.
Scroll Reveal Animations: Use IntersectionObserver to fade in and translate up sections as they enter the viewport. (Respect prefers-reduced-motion).
Booking Calculator: Dynamically update the "Total Price" on the booking page based on dropdown selections.
Form Validation: Prevent default form submission if required fields are empty. Show subtle inline error messages.
7. ACCESSIBILITY & PERFORMANCE
Semantic HTML: Use <header>, <nav>, <main>, <section>, <footer>.
Images: All <img> tags must have descriptive alt attributes. Use loading="lazy" for images below the fold.
Contrast: Ensure text contrast ratio is at least 4.5:1 against backgrounds.
Focus States: All interactive elements (buttons, links, inputs) must have a clear, visible :focus outline.
Performance: Keep CSS and JS minified in production (though raw is fine for dev). No render-blocking resources.
8. STRICT RULES FOR AI AGENT
DO NOT generate any code, text, or UI related to makeup, cosmetics, or makeup artists.
DO NOT use external CSS frameworks (Tailwind, Bootstrap) or JS libraries (jQuery, React).
DO use the exact pricing provided in Section 5.4.
DO use the CSS variables defined in Section 3.1 for all colors.
DO structure the project exactly as requested.
9. IMPLEMENTATION PHASES (Execute in this order)
Phase 1: Setup file structure, reset.css, tokens.css, and global Header/Footer.
Phase 2: Build Homepage Hero, Quick Strip, and Founder sections.
Phase 3: Build Homepage Services Grid and Hampers section.
Phase 4: Build Booking Page (HTML structure + JS calculator + WhatsApp logic).
Phase 5: Build Contact Page and Thank You page.
Phase 6: Implement global JS (Mobile nav, sticky header, scroll reveal).
Phase 7: Responsive QA (Mobile, Tablet, Desktop) and Accessibility check.