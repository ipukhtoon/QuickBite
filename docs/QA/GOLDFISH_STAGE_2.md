# Goldfish QA — Stage 2 Independent Critical Review

**Project:** QuickBite  
**Stage:** 2 — Critical Reviewer  
**Status:** Independent challenge complete; findings must be addressed in Stage 3  
**Inspection target:** Current GitHub `main` branch HTML and Stage 1 documentation

> Goldfish challenges the proposed product from real-user perspectives. This report is independent of the Developer's Stage 2 report. It does not claim browser testing.

## Evidence and limitations

- Current HTML and Stage 1 documents were re-fetched from GitHub.
- Source-derived observations are marked **VERIFIED BY SOURCE**.
- User journey concerns not demonstrated in a running application are marked **POTENTIAL ISSUE** or **NOT TESTABLE**.
- No live browser, mobile device, Firebase emulator or production environment interaction was performed.

## Independent findings

### GF-S2-001 — First-time visitor cannot establish restaurant context
- **Severity:** High
- **Evidence:** VERIFIED BY SOURCE
- **Observation:** The page contains a hardcoded San Francisco delivery address and sample profile image, but no confirmed restaurant identity, service hours, contact information or service availability.
- **Impact:** A visitor may not know which restaurant they are ordering from or whether it serves their location.
- **Recommendation:** Make real restaurant identity, operating status and service area clear. Use approved restaurant content; never fabricate address, hours or ratings.

### GF-S2-002 — Guest checkout security is unresolved
- **Severity:** Critical
- **Evidence:** POTENTIAL ISSUE
- **Observation:** The Stage 1 plan wants guest checkout but does not define secure access to order details or what happens when a guest changes devices.
- **Impact:** Private order and address information could be exposed, or legitimate guests could lose access.
- **Recommendation:** Specify a secure guest identity/access mechanism, recovery path and account-claiming process before implementation.

### GF-S2-003 — Cart can become misleading after product changes
- **Severity:** High
- **Evidence:** POTENTIAL ISSUE
- **Observation:** A persistent cart is proposed, but no complete customer-facing behavior is defined for a price increase, sold-out product or removed option after an item was added.
- **Impact:** Customers may encounter unexpected totals at checkout or lose carefully configured items.
- **Recommendation:** Revalidate at cart review and checkout, explain each change, preserve the customer's choices where possible and require confirmation before placing the order.

### GF-S2-004 — Checkout needs a clear failure and recovery journey
- **Severity:** Critical
- **Evidence:** POTENTIAL ISSUE
- **Observation:** The proposal mentions duplicate prevention and error feedback but not the actual customer experience when submission times out and the server may have accepted the order.
- **Impact:** Customers may submit twice, abandon a valid order or remain unsure whether the restaurant received it.
- **Recommendation:** Use an idempotent submission flow and a recoverable pending/confirmed state. Show a clear status and a safe way to check the same submission rather than blindly retrying.

### GF-S2-005 — Delivery and pickup may not be available at all times
- **Severity:** High
- **Evidence:** POTENTIAL ISSUE
- **Observation:** Delivery and pickup are proposed, but operating hours, temporary closure, service area and capacity behavior are undecided.
- **Impact:** Customers may build a cart only to discover at the final step that the restaurant cannot fulfill it.
- **Recommendation:** Surface service availability early, validate again at checkout and explain why a fulfilment option is unavailable.

### GF-S2-006 — Product option complexity is missing from the user journey
- **Severity:** High
- **Evidence:** POTENTIAL ISSUE
- **Observation:** Product details are listed, but there is no interaction specification for required choices, add-ons, quantity limits or unavailable options.
- **Impact:** Customers may submit incomplete or invalid orders.
- **Recommendation:** Make required selections obvious, show price changes as choices are made, prevent invalid combinations and summarize selected options in cart and order history.

### GF-S2-007 — Staff workflow needs speed and operational clarity
- **Severity:** High
- **Evidence:** NOT TESTABLE
- **Observation:** Staff are included as a persona, but the plan does not yet define a fast order queue, priority cues, status transitions, sound/visual alerts or recovery from accidental status changes.
- **Impact:** Staff may miss orders or make irreversible mistakes during busy periods.
- **Recommendation:** Define the real restaurant's staff workflow, role-specific screens, clear new-order indication and confirmation/undo policy where operationally safe.

### GF-S2-008 — Admin operations need safeguards
- **Severity:** High
- **Evidence:** POTENTIAL ISSUE
- **Observation:** Product and category management are proposed without specifying what happens when an admin edits or disables a product already present in active carts or orders.
- **Impact:** Existing orders could be corrupted or customers could see inconsistent information.
- **Recommendation:** Preserve order snapshots; distinguish catalogue edits from historical order records; confirm destructive actions and define active-order impact.

### GF-S2-009 — Search/filter and empty states need usable guidance
- **Severity:** Medium
- **Evidence:** VERIFIED BY SOURCE for independent filter handlers; POTENTIAL ISSUE for future screens
- **Observation:** Search and category handlers overwrite each other's display decisions. The source has no designed no-results state or clear-filter recovery.
- **Impact:** Users may see confusing results or believe the menu is empty.
- **Recommendation:** Compose filters, show active filter context, provide a clear-all action and a helpful empty state.

### GF-S2-010 — Navigation and cart discoverability
- **Severity:** Medium
- **Evidence:** VERIFIED BY SOURCE
- **Observation:** The bottom navigation has Home, Orders, Saved and Profile; the cart is represented by a badge attached to Orders, while Orders itself only triggers an alert.
- **Impact:** Customers may confuse their cart with their order history.
- **Recommendation:** Separate Cart and Orders concepts clearly. Keep a prominent cart entry point and make order history a distinct destination.

### GF-S2-011 — Accessibility needs to cover dynamic feedback
- **Severity:** Medium
- **Evidence:** POTENTIAL ISSUE
- **Observation:** Cart count changes, filters, validation and order status updates will be dynamic, but no announcement/focus contract exists.
- **Impact:** Screen-reader and keyboard users may miss important changes.
- **Recommendation:** Define accessible names, live announcements, focus placement after navigation/errors, keyboard support and semantic controls.

### GF-S2-012 — Mobile keyboard and sticky controls can obstruct checkout
- **Severity:** Medium
- **Evidence:** POTENTIAL ISSUE
- **Observation:** The source uses a scroll area and absolute bottom navigation in a fixed frame. Checkout forms have not been designed or tested.
- **Impact:** The keyboard or bottom navigation may obscure fields and submit buttons on Android.
- **Recommendation:** Specify mobile viewport/keyboard behavior, safe-area insets, scroll-to-invalid-field behavior and a non-obstructive checkout action area.

### GF-S2-013 — Customer order history requires durable snapshots
- **Severity:** High
- **Evidence:** POTENTIAL ISSUE
- **Observation:** Order history is proposed, but the data contract is not yet detailed.
- **Impact:** Renaming a product or changing its price later could rewrite what the customer believes they ordered.
- **Recommendation:** Store immutable item name, option labels, unit price, quantity, tax/fee allocation and total snapshots with each order.

### GF-S2-014 — Customer privacy on shared phones
- **Severity:** High
- **Evidence:** POTENTIAL ISSUE
- **Observation:** The application is mobile-first and may be used on shared family devices, but local cart/profile persistence and logout cleanup are undefined.
- **Impact:** The next person using the phone may see a previous customer's personal information or cart.
- **Recommendation:** Define what persists across logout, clear private cached data on account switch, and avoid persisting addresses or sensitive profile fields unnecessarily.

## Persona simulation review

| Persona | Independent challenge | Result |
|---|---|---|
| First-time visitor | Identify restaurant, service availability and menu | POTENTIAL ISSUE |
| Guest customer | Place order and securely retrieve confirmation | NOT TESTABLE; flow not implemented |
| Registered customer | Sign in, manage account and see own orders only | NOT TESTABLE; flow not implemented |
| Returning customer | Recover cart and understand changed prices/availability | POTENTIAL ISSUE |
| Restaurant administrator | Safely edit catalogue without changing historical orders | NOT TESTABLE |
| Restaurant staff | Reliably receive and process orders during busy service | NOT TESTABLE |
| Beginner user | Understand validation, errors and order confirmation | POTENTIAL ISSUE |
| Android mobile user | Use checkout with keyboard, touch and narrow viewport | NOT TESTABLE |

## Goldfish Stage 2 conclusion

Goldfish does not consider the Stage 1 proposal ready to implement. The highest-priority user risks are guest privacy, uncertain order submission, cart price/availability changes, unclear fulfilment eligibility, staff operational flow and customer privacy on shared devices.

Stage 3 must address these findings explicitly, or record a reasoned deferral with its risk and acceptance boundary. No finding should be silently dropped.

Goldfish did not modify source files, documentation, Firebase data or production records.
