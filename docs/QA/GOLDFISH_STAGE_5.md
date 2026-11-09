# Goldfish QA — Stage 5 Independent Inspection

**Project:** QuickBite  
**Stage:** 5 — Implementation  
**Inspection:** Initial foundation review  
**Role:** Independent QA; no source modifications made.

## Evidence and capability statement

- Evidence available: GitHub source files and repository directory listings.
- Browser automation/runtime and an Android device session were not available.
- No real interaction, visual rendering, build or device tests are claimed.
- Findings below are source-level inspection unless explicitly stated otherwise.

## Initial inspection

### GF-S5-001 — Demo content is still presented as real restaurant information
- **Severity:** High
- **Evidence:** VERIFIED BY SOURCE
- **Location:** `index.html`, preserved markup copied from `food_delivery_ui.html`.
- **Finding:** The page contains San Francisco delivery location, a profile portrait, a 50% discount claim, sample food products and USD prices. These are design-demo values, not verified restaurant configuration.
- **Risk:** Users may be misled if the page is treated as production-ready.
- **Recommendation:** Replace with explicit configurable restaurant data and approved product records before public release. Hide promotions unless genuinely configured.

### GF-S5-002 — Cart remains a counter, not a cart
- **Severity:** High
- **Evidence:** VERIFIED BY SOURCE
- **Location:** Inline script in `index.html`.
- **Finding:** `addToCart` increments a number and logs a product name; it does not create cart lines, quantities, option selections or totals.
- **Risk:** The cart badge can imply a functioning basket when no orderable cart exists.
- **Recommendation:** Implement a real cart domain with stable product/option IDs, quantities, price snapshots for display only, and authoritative revalidation at checkout.

### GF-S5-003 — Search and category filtering overwrite one another
- **Severity:** Medium
- **Evidence:** VERIFIED BY SOURCE
- **Location:** Inline search and category event handlers in `index.html`.
- **Finding:** Each handler independently sets card display state. Typing a search can disregard the selected category, and selecting a category can disregard the current search.
- **Risk:** Results become inconsistent and confusing.
- **Recommendation:** Use one combined filter state and one render/filter function.

### GF-S5-004 — Navigation routes are placeholders
- **Severity:** High
- **Evidence:** VERIFIED BY SOURCE
- **Location:** Inline `switchNav` handler in `index.html`.
- **Finding:** Orders, Saved and Profile invoke alerts; Orders displays cart information rather than order history.
- **Risk:** Customer journeys cannot be completed.
- **Recommendation:** Implement distinct routes/screens for Cart, Orders, Saved and Profile with appropriate empty/loading/error states.

### GF-S5-005 — Fake promotional success action
- **Severity:** Medium
- **Evidence:** VERIFIED BY SOURCE
- **Location:** Promo button inline alert in `index.html`.
- **Finding:** Claim Now reports success without validating or applying a real promotion.
- **Risk:** False commercial claims and misleading feedback.
- **Recommendation:** Remove the success claim until a real server-validated promotion exists.

### GF-S5-006 — Responsive foundation is source-only verified
- **Severity:** Medium
- **Evidence:** VERIFIED BY SOURCE; interaction/visual behavior NOT TESTABLE
- **Location:** Responsive CSS added to `index.html`.
- **Finding:** Fixed frame dimensions are overridden, responsive grid breakpoints and safe-area padding are defined.
- **Risk:** CSS source alone cannot prove layout correctness at real viewport sizes or with the Android keyboard.
- **Recommendation:** Run build, browser viewport checks and actual Android keyboard/safe-area tests when a test environment is available.

### GF-S5-007 — Build and dependency installation not verified
- **Severity:** Medium
- **Evidence:** NOT TESTABLE
- **Location:** `package.json`, `vite.config.js`.
- **Finding:** Vite scripts and configuration exist, but dependency installation and `vite build` were not executed.
- **Risk:** Syntax, dependency or build issues may remain.
- **Recommendation:** Run clean install and production build in CI or an available local environment; record logs.

## Persona simulation status

| Persona | Current evidence-based result |
|---|---|
| First-time visitor | Static demo content visible in source; real restaurant context not verified |
| Guest customer | Cannot complete checkout; no guest order flow |
| Registered customer | Cannot sign in; authentication absent |
| Returning customer | No persistent cart or order history |
| Restaurant administrator | No admin interface or authorization |
| Restaurant staff | No staff queue or role enforcement |
| Beginner | Placeholder alerts do not provide complete journeys |
| Android user | Responsive CSS source exists; real device test NOT TESTABLE |

## Goldfish verdict

The initial repository foundation is a valid first implementation step, but it is **not a functioning food-ordering application**. The most urgent next work is to replace the static demo behavior with real screen/state architecture while preserving the reference visual design. Do not represent the app as production-ready.

Goldfish did not modify source code, Firebase, repository data or production records.
