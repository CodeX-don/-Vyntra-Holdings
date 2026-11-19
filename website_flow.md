# WEBSITE USER FLOW & INTERACTION DESIGN
## Project: "Beauty Salon" Official Website
**Version:** 1.0
**Date:** November 16, 2026
**Status:** Ready for Implementation

---

## 1. USER PERSONAS & CORE JOURNEYS
Understanding the user's intent dictates the flow. There are three primary user types for this site:

### Persona A: The Service Client (Lashes, Nails, Wig Install)
*   **Goal:** Book an appointment for a specific beauty service.
*   **Primary Flow:** Homepage -> Scroll to "Services" -> Click "Book" on a specific card -> Booking Page -> Select Service -> Fill Details -> Click "Confirm via WhatsApp" -> WhatsApp App Opens.

### Persona B: The Gift Buyer (Hampers)
*   **Goal:** Purchase a curated gift hamper for a special occasion.
*   **Primary Flow:** Homepage -> Scroll to "Hampers" -> Click "Enquire / Order" -> Contact Page (or WhatsApp) -> Discuss customization -> Finalize order off-platform.

### Persona C: The Brand Connector (Info Seeker)
*   **Goal:** Learn about the business, see the founder's face, and find the location/hours.
*   **Primary Flow:** Homepage -> Read "About the Founder" -> Scroll to Footer/Contact -> Check Address/Hours.

---

## 2. GLOBAL NAVIGATION FLOW

### Desktop (> 1024px)
1.  **Header:** Sticky at the top. Background is transparent over the Hero, transitions to solid `--bg-primary` with a subtle shadow on scroll.
2.  **Links:** Clicking `Home`, `Services`, `About`, `Hampers` triggers a smooth scroll to the respective `#section-id` on the Homepage.
3.  **Links:** Clicking `Contact` navigates to `contact.html`.
4.  **CTA:** Clicking `[BOOK NOW]` navigates directly to `booking.html`.

### Mobile (< 1024px)
1.  **Header:** Logo on the left, Hamburger icon on the right.
2.  **Menu Open:** Clicking the hamburger slides a full-height or dropdown menu from the right. Background blurs.
3.  **Menu Close:** Clicking a link inside the menu automatically closes the menu and executes the link action (scroll or page navigate).
4.  **Focus Trap:** When the menu is open, keyboard focus is trapped inside the menu. Closing it returns focus to the hamburger button.

---

## 3. PAGE-BY-PAGE USER FLOWS

### 3.1 Homepage (`index.html`) - The Scroll Journey
The homepage is a linear, storytelling scroll.

1.  **Hero Section:** 
    *   User lands. Sees H1, subtext, and two buttons.
    *   *Action:* Clicks `[Book Appointment]` -> Goes to `booking.html`.
    *   *Action:* Clicks `[View Hampers]` -> Smooth scrolls to `#hampers`.
    *   *Action:* Scrolls down -> Quick Service Strip appears.
2.  **Quick Service Strip:**
    *   User sees 5 icons. Clicks an icon (e.g., Lashes) -> Smooth scrolls to `#services` (specifically highlighting the Lash card if possible, or just the section).
3.  **About the Founder:**
    *   User reads the intro. Builds trust. No primary CTA here, just a subtle `[Read our story]` (can just scroll to contact or be a dummy link for now).
4.  **Services Grid:**
    *   User browses the 5 service cards.
    *   *Action:* Clicks `[Book]` on any card -> Goes to `booking.html` with the specific service pre-selected (optional advanced feature) or just lands on the page.
5.  **Hampers Section:**
    *   User sees the large product showcase.
    *   *Action:* Clicks `[Enquire / Order Hamper]` -> Goes to `contact.html`.
6.  **Delivery Banner:**
    *   Passive reading. Reinforces nationwide capability.
7.  **Final CTA:**
    *   User reaches the bottom.
    *   *Action:* Clicks `[BOOK NOW]` -> `booking.html`.
    *   *Action:* Clicks `[WhatsApp Us]` -> Opens WhatsApp with a generic "Hi, I'm interested in your services" message.

### 3.2 Booking Page (`booking.html`) - The Conversion Flow
This is the most interactive page. 

1.  **Initial State:** 
    *   Left side: Empty form. Right side: "Booking Summary" shows "No services selected. Total: N$0".
2.  **Service Selection:**
    *   User clicks the "Service" dropdown.
    *   *Action:* Selects "Wig Installation (N$250)".
    *   *System Response:* Right sidebar updates immediately. Shows "Wig Installation - N$250". Total updates to "N$250".
    *   *Action:* User clicks `[+ Add another service]`. A second dropdown appears.
    *   *Action:* User selects "Nails - Hands (N$160)".
    *   *System Response:* Sidebar adds the item. Total updates to "N$410".
3.  **Personal Details:**
    *   User fills Name, Phone, Email, Date, Time.
4.  **Validation & Submission:**
    *   User clicks `[Confirm via WhatsApp]`.
    *   *System Check:* JS validates required fields.
    *   *Error State:* If Phone is empty, the Phone input border turns red, an error message appears below it ("Please enter your phone number"), and focus moves to the Phone input. Submission halts.
    *   *Success State:* If all valid, JS constructs the WhatsApp URL.
    *   *Action:* Browser opens a new tab to `https://wa.me/...`.
    *   *Action:* Current tab redirects to `thank-you.html`.

### 3.3 Contact Page (`contact.html`) - The Information Flow
1.  **Layout:** User sees contact details and map on the left, form on the right.
2.  **Form Interaction:**
    *   User fills Name, Email, Message.
    *   Clicks `[Send Message]`.
    *   *System Response:* Validates email format. If valid, triggers `window.location.href = 'mailto:...'` with the subject and body pre-filled.
    *   *Action:* Redirects to `thank-you.html`.

### 3.4 Thank You Page (`thank-you.html`) - The Resolution
1.  **Content:** "Thank you! Your request has been initiated. Please complete sending the message in WhatsApp/your email app."
2.  **Action:** User clicks `[Back to Home]` -> Navigates to `index.html`.

---

## 4. UI COMPONENT STATES & INTERACTIONS

To ensure consistent CSS, every interactive element must have the following states defined:

### 4.1 Buttons (Primary & Secondary)
*   **Default:** Base colors (Mauve bg / White text for primary).
*   **Hover:** Background darkens slightly (`--accent-hover`), cursor changes to `pointer`, slight upward translate (`transform: translateY(-2px)`).
*   **Active/Pressed:** Translates back down (`transform: translateY(0)`), background darkens further.
*   **Focus:** Visible outline (`outline: 2px solid var(--accent-gold); outline-offset: 2px;`).
*   **Disabled:** Opacity 0.5, `cursor: not-allowed`, no hover effects.

### 4.2 Form Inputs
*   **Default:** White bg, light border (`--border-light`), standard padding.
*   **Focus:** Border changes to `--accent-primary`, subtle box-shadow glow.
*   **Valid:** (Optional) Border turns subtle green.
*   **Invalid/Error:** Border turns red (`#D32F2F`), small red error text appears below the input.

### 4.3 Service Cards
*   **Default:** White bg, soft shadow.
*   **Hover:** Shadow deepens, card translates up slightly (`transform: translateY(-4px)`). Image might have a very subtle zoom (`transform: scale(1.03)` with `overflow: hidden` on parent).

---

## 5. EDGE CASES & ERROR HANDLING

### 5.1 WhatsApp Not Installed
*   **Scenario:** User clicks "Confirm via WhatsApp" on a desktop that doesn't have the WhatsApp desktop app installed.
*   **Fallback:** The `wa.me` link will automatically open WhatsApp Web in the browser. No extra code needed, but the UI should say "Confirm via WhatsApp" rather than just "Submit".

### 5.2 Form Validation Failures
*   **Scenario:** User submits the booking form with missing required fields.
*   **Handling:** Prevent default submission. Scroll the viewport smoothly to the *first* invalid input at the top of the form. Display inline error messages. Do not use ugly browser default `alert()` boxes.

### 5.3 Image Loading Failures
*   **Scenario:** A service image fails to load (broken link).
*   **Handling:** The `<img>` tag must have a descriptive `alt` attribute. CSS should set a fallback background color (`--bg-secondary`) on the image container so the layout doesn't collapse.

### 5.4 Dynamic Pricing Edge Cases
*   **Scenario:** User selects "Wig Sales" on the booking form.
*   **Handling:** Because Wig Sales is a range (N$1,800 - N$2,800), the booking calculator should display "N$1,800+" or "Starting at N$1,800" in the summary, and append a note in the WhatsApp message: *(Note: Final wig price depends on length/texture selected)*.

---

## 6. MOBILE-SPECIFIC FLOW ADJUSTMENTS

1.  **Touch Targets:** All buttons and clickable links must have a minimum touch target size of 44x44px.
2.  **Booking Form Layout:** The 2-column layout (Form left, Summary right) collapses to a 1-column stack. The "Booking Summary" should become a **sticky bottom bar** or a collapsible accordion at the top of the form so the user can always see their total while scrolling through the long form.
3.  **Date/Time Pickers:** On mobile, rely on the native OS date/time pickers (`<input type="date">` and `<input type="time">`) rather than custom JS calendars for better UX.
4.  **Gallery/Maps:** Embedded Google Maps must be responsive and not break the horizontal scroll of the page.

---

## 7. AI AGENT EXECUTION INSTRUCTIONS FOR FLOW

When building the UI, the AI agent must follow this sequence for every interactive component:
1.  Write the HTML structure.
2.  Write the CSS for the **Default** state.
3.  Write the CSS for the **Hover/Focus** states.
4.  Write the JS to handle the **Interaction/State Change** (e.g., adding the `.is-invalid` class).
5.  Test the **Edge Case** (e.g., what happens if I click submit with empty fields?).

*Do not proceed to the next component until the current component's flow and states are fully coded and verified.*