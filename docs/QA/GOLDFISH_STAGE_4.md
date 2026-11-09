# Goldfish QA — Stage 4 Approval Inspection Criteria

**Project:** QuickBite  
**Stage:** 4 — Approval  
**Status:** Independent acceptance checklist; Stage 4 user approval recorded  
**Implementation authorization:** User approval recorded; Goldfish does not grant authorization

## Goldfish's independent conditions

Goldfish reviewed the proposed Stage 4 plan and requires the following to remain explicit in the approved scope:

1. Guest checkout must not force account registration.
2. Guest order access must not rely on guessable order IDs or phone number alone.
3. Guest credential expiry, recovery, device-change and account-claiming behavior must be specified before release.
4. Cart and order history must be separate concepts and destinations.
5. Price and availability changes must be explained before order placement.
6. An uncertain checkout response must recover the original idempotent submission, not create a duplicate.
7. Cash payment status must be separate from order status; cash is not collected at order placement.
8. Staff queue actions must be clear and protected against accidental taps.
9. Historical order snapshots must not change when catalogue products are edited.
10. Admin/staff authorization must be tested using direct requests, not only hidden UI controls.
11. Customer private data must be cleared appropriately on logout/account switching on shared phones.
12. Customer-facing order statuses must use understandable labels.
13. External notifications must not be promised until provider, consent and delivery behavior are configured.
14. Food imagery must be approved/licensed, optimized and have reliable fallback behavior.
15. Keyboard-only core journey, labels/errors, focus visibility, dynamic announcements and touch targets must be tested.
16. Android virtual keyboard and safe-area behavior must be inspected on an actual device/browser if available.

## Required persona test record

| Persona | Minimum journey to verify |
|---|---|
| First-time visitor | Open app, identify restaurant, browse and find service availability |
| Guest customer | Browse, add items, checkout without account, receive confirmation and retrieve own order |
| Registered customer | Register/sign in, place order, view own history, sign out |
| Returning customer | Restore cart, handle changed price/availability, view prior order |
| Restaurant administrator | Manage product/category, review orders, configure settings, manage staff access |
| Restaurant staff | View new orders and perform only permitted status transitions |
| Beginner | Understand forms, errors, empty states and order outcome without assistance |
| Android user | Complete core journey with narrow viewport, touch and virtual keyboard |

## Evidence and honesty

- VERIFIED BY INTERACTION only after real interaction in an accessible test environment.
- VERIFIED BY SOURCE for source-code inspection only.
- VISUAL OBSERVATION for inspected screenshots/rendered screens.
- POTENTIAL ISSUE for unconfirmed concerns.
- NOT TESTABLE when environment or capability is unavailable.

No browser/device interaction tests have been performed at Stage 4. This document is a QA checklist, not a test pass report.

## Goldfish verdict

The plan is suitable to present for user approval provided all open inputs and approval boundaries remain visible. The user subsequently approved Stage 4 and explicitly authorized Stage 5. Goldfish remains independent and will inspect the actual implementation; this report itself does not grant authorization.
