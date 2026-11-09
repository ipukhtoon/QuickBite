# Goldfish QA — Stage 1 Independent Inspection

**Project:** QuickBite  
**Inspection target:** `food_delivery_ui.html` in `ipukhtoon/QuickBite`  
**Role:** Independent user-experience and quality inspector  
**Stage:** 1 — Architect  
**Status:** Initial findings recorded; challenge continues in Stage 2

> Goldfish is an independent reviewer. This report is not a developer approval and does not claim browser interaction testing.

## Evidence standard

The findings below are based on inspection of the HTML source and its visible implementation logic.

**Evidence classification used:** VERIFIED BY SOURCE.  
**Browser interaction evidence:** None. No live browser interaction test was performed for this report.

## Findings

### GF-S1-001 — Cart is not a usable cart
- **Severity:** Critical
- **Evidence:** VERIFIED BY SOURCE
- **Observation:** The add-to-cart function increments a global count and logs a product name. It does not create cart line items, track quantities, calculate subtotals or retain product selections.
- **User impact:** A customer cannot reliably review what they intend to purchase.
- **Recommendation:** Implement a real cart model with product identifiers, option selections, quantities, validated prices and clear update/remove actions. Persist cart state appropriately.

### GF-S1-002 — Checkout and order completion are absent
- **Severity:** Critical
- **Evidence:** VERIFIED BY SOURCE
- **Observation:** No checkout form, order submission or confirmation journey exists in the inspected HTML.
- **User impact:** Customers cannot complete the primary purpose of a food-ordering application.
- **Recommendation:** Design and implement a complete, validated checkout and order-confirmation flow, with trusted backend order creation and duplicate-submission protection.

### GF-S1-003 — Search and category filters can conflict
- **Severity:** Medium
- **Evidence:** VERIFIED BY SOURCE
- **Observation:** Category clicks and search input each independently set product-card display styles.
- **User impact:** Applying a category after searching, or searching after selecting a category, can produce inconsistent results.
- **Recommendation:** Use one combined filter state and derive visible results from all active criteria.

### GF-S1-004 — Navigation labels do not lead to screens
- **Severity:** High
- **Evidence:** VERIFIED BY SOURCE
- **Observation:** Orders, Saved and Profile navigation trigger alert dialogs rather than navigating to functional views.
- **User impact:** Customers may believe the application is broken or that their information is unavailable.
- **Recommendation:** Implement real routes/views and consistent navigation state, loading, empty and error states.

### GF-S1-005 — Promotion action claims success without applying a promotion
- **Severity:** Medium
- **Evidence:** VERIFIED BY SOURCE
- **Observation:** The promotional button displays a success alert without validating or applying a promotion.
- **User impact:** Misleading feedback can cause customers to expect a discount that is not reflected in their order.
- **Recommendation:** Do not show success until a promotion is validated and its effect is reflected in an authoritative order calculation. Otherwise provide an honest informational action.

### GF-S1-006 — Hardcoded identity and location
- **Severity:** Medium
- **Evidence:** VERIFIED BY SOURCE
- **Observation:** The page displays a fixed San Francisco address and sample profile identity.
- **User impact:** The interface does not represent the actual restaurant or the current customer's details.
- **Recommendation:** Replace sample identity/location with configurable restaurant information and customer-provided or account-backed details. Do not request device location unnecessarily.

### GF-S1-007 — Fixed phone frame is not a responsive application
- **Severity:** High
- **Evidence:** VERIFIED BY SOURCE
- **Observation:** The main frame is fixed at 390 × 844 pixels with a heavy phone border.
- **User impact:** The design may not use the full screen and may fail on smaller phones, landscape, tablets and desktop.
- **Recommendation:** Preserve the visual design tokens while building fluid responsive layouts and suitable breakpoints.

### GF-S1-008 — Product imagery and loading behavior need production treatment
- **Severity:** High
- **Evidence:** VERIFIED BY SOURCE
- **Observation:** Product images are external Unsplash URLs and there is no visible loading, failure or fallback strategy in the inspected source.
- **User impact:** Broken or slow image delivery can make the menu appear incomplete.
- **Recommendation:** Establish a curated, licensed image library, consistent crop ratios, optimized assets, lazy loading where appropriate, descriptive alt text and fallback states.

### GF-S1-009 — Cart feedback is temporary and incomplete
- **Severity:** Medium
- **Evidence:** VERIFIED BY SOURCE
- **Observation:** The add button temporarily changes to a checkmark, while the cart badge only reflects a count.
- **User impact:** The customer cannot confirm which product/variant was added or inspect the cart from this feedback alone.
- **Recommendation:** Provide accessible confirmation, meaningful cart badge semantics and a direct route to the cart.

### GF-S1-010 — Accessibility and touch usability are not established
- **Severity:** Medium
- **Evidence:** VERIFIED BY SOURCE / POTENTIAL ISSUE
- **Observation:** The inspected source uses clickable divs and anchors with JavaScript handlers, and does not establish a complete keyboard, screen-reader or focus-management strategy.
- **User impact:** Some customers may have difficulty using navigation, filters and controls.
- **Recommendation:** Use semantic buttons/links, accessible names, visible focus, keyboard operation, sufficient contrast and practical touch target sizes.

## Persona challenge

| Persona | Stage 1 concern | Evidence |
|---|---|---|
| First-time visitor | Understand restaurant identity, menu and ordering path | POTENTIAL ISSUE |
| Guest customer | Browse and order without forced registration | NOT IMPLEMENTED IN SOURCE |
| Registered customer | Sign in, manage profile and see private orders | NOT IMPLEMENTED IN SOURCE |
| Returning customer | Recover cart and find previous orders | NOT IMPLEMENTED IN SOURCE |
| Restaurant administrator | Manage catalogue and process orders | NOT IMPLEMENTED IN SOURCE |
| Restaurant staff | Use restricted order workflow | NOT IMPLEMENTED IN SOURCE |
| Beginner user | Receive clear validation and recovery guidance | POTENTIAL ISSUE |
| Android mobile user | Use full screen with accessible controls and responsive layout | POTENTIAL ISSUE |

## Independent questions for Stage 2

1. Is the proposed screen list complete for guest ordering, order tracking and restaurant operations?
2. How will guest customers securely retrieve order information without creating an account?
3. Which order status transitions are allowed, and who can perform each transition?
4. How will product modifiers, unavailable items, delivery fees and minimum-order rules be represented?
5. How will customers recover from a failed or interrupted order submission?
6. How will the cart behave when product prices or availability change?
7. What is the exact distinction between IndexedDB offline state and authoritative Firestore state?
8. How will admin and staff permissions be tested independently?
9. What image licensing, optimization and fallback requirements apply?
10. What accessible empty, loading, success and error states are required on every journey?

## Goldfish conclusion

The inspected HTML is a useful visual starting point, but it is not yet a complete ordering application. The highest-priority gaps are the real cart, checkout/order creation, functional navigation, responsive behavior and secure customer/restaurant workflows.

Goldfish does not approve the proposed architecture at Stage 1. These findings must be independently considered during Stage 2 and addressed or explicitly dispositioned during Stage 3.

No source files, Firebase records or production data were changed by Goldfish.
