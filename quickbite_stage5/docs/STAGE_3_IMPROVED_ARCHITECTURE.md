# QuickBite — Stage 3 Improved Architecture and Acceptance Baseline

**Status:** Stage 3 planning complete. No coding performed.  
**Inputs:** Stage 1 inspection and Reference Reconstruction v1.5; Stage 2 CR-01–CR-19; existing architecture, data model, security, mandatory rules and Goldfish charter.

## 1. Consolidated architecture

Retain the existing Vite + Vanilla JavaScript modular application. Do not rewrite wholesale. Separate UI, feature orchestration, domain rules, repositories, local persistence and trusted backend operations.

Logical architecture:

```
Customer UI / Guest UI                 Restaurant Operations UI
Welcome · Auth · Home                  Admin · Menu · Staff Queue*
Menu · Product · Cart
Checkout · Tracking · Orders
             |                                      |
             +----------- App Router ---------------+
                            |
                 Feature / UI Components
                            |
                  Application Use Cases
      Auth · Catalog · Cart · Checkout · Orders · Account
                   Admin · Staff · Reporting
                            |
                   Domain / Validation
    Money(paisa) · Options · Order State · Permissions
                            |
                   Repository Interfaces
             /                              \
      IndexedDB                         Firebase
 cart · cached catalog          Auth · Firestore · Storage
 preferences · metadata         Cloud Functions · Rules
             \                              /
                    Sync / Connectivity
                            |
               Trusted backend boundary
    price · availability · fees · order · idempotency
           roles · status transitions · audit
```

*Staff queue is reserved architecturally; exact screens and inclusion require user scope approval because it is not among the 12 reference screens.*

## 2. Runtime modes and data provenance

- Development: fixtures only when explicitly enabled.
- Preview/demo: visibly labelled fixtures and local-only demo edits.
- Production: Firebase-backed catalogue and services only.
- Production must never silently substitute demo fixtures when configuration/network fails.
- Cached production catalogue may be browsed offline with a visible offline/freshness state.
- Empty remote catalogue, loading, cache, offline and remote error are distinct states.
- Demo edits must never sync to production.
- Runtime mode is explicit configuration, not inferred from network failure.

## 3. Canonical data and financial integrity

- All persisted/transmitted authoritative money is integer paisa with explicit PKR currency and safe-integer/range validation.
- Convert to rupees only for display. Define explicit server-side rounding for percentage calculations.
- Catalog options use stable IDs; the server resolves authoritative prices and validates required groups, selection limits and availability.
- Cart stores customer intent, product/option IDs and quantities. Any displayed price is a timestamped estimate, never authoritative.
- Before submission, revalidate every line. Changed or unavailable items require clear customer acknowledgement; never silently alter the basket.
- Orders store immutable item, option, name and price snapshots. Menu edits never rewrite order history.
- Stock enforcement is not assumed until its source of truth and business policy are confirmed.

## 4. Trusted order submission contract

Use a versioned trusted backend operation (transport choice finalized in Stage 4).

Conceptual request: idempotency key, authenticated customer or guest context, product IDs, quantities, option IDs, fulfilment selection, customer contact/address details, supported payment method and bounded notes.

Never trust client-supplied price, fee, tax, discount, total, role or order status.

Server must:
1. Authenticate customer or validate guest checkout context.
2. Validate schema, sizes, strings, quantities and enums.
3. Load authoritative products, options and restaurant settings.
4. Validate availability, option constraints, fulfilment and payment.
5. Calculate all amounts in integer paisa.
6. Atomically persist order, initial status history and idempotency result where supported.
7. Return canonical order ID, server totals and safe guest-access handoff.
8. Return the original result for same-scope/same-key retries; reject key reuse with a different payload.
9. Define idempotency retention and cleanup.

Stable error codes are required for invalid input, unavailable item, changed price, closed restaurant, out-of-zone delivery, unsupported payment, duplicate/conflicting request, expired guest context, rate limiting and temporary server failure. Never show order success until server confirmation.

## 5. Guest access lifecycle

Guest checkout remains registration-free. Guest order access requires a high-entropy unguessable credential; order number alone never authorizes access. Issuance and verification are trusted-backend operations. Protect credential delivery/storage, prevent exposure in logs/analytics/referrers/public URLs, rate-limit attempts, and support expiry/revocation and cross-device recovery. Account linking requires proof of guest credential control. Exact expiry, delivery channel and recovery policy are unresolved business decisions.

## 6. Roles and authorization

Proposed least-privilege roles:
- Guest: submit and access only orders with a valid guest credential.
- Customer: manage permitted profile fields and read own orders.
- Staff: view operational order fields and perform assigned status actions.
- Administrator: manage approved menu/settings/staff and authorized reports.
- Server: trusted privileged operations; credentials never enter the client.

Backend and Firestore/Storage rules enforce every operation. Client route guards are UX only. Role provisioning/revocation is trusted. Default deny. Client cannot write authoritative order totals, roles, status history or privileged report aggregates. Privileged actions record actor, action, target and timestamp with safe audit metadata.

## 7. Order lifecycle and staff scope

Proposed normal path: Pending → Confirmed → Preparing → Ready → Completed. Cancellation transitions and authorized actors require restaurant policy. Server validates transitions and appends status history. Concurrent updates use transaction/version checks; stale actions return conflict and refresh. No fabricated ETA or GPS; illustrative map graphics must be labelled as such.

A staff order queue is a scope decision for Stage 4, not silently added to the approved 12 screens.

## 8. Restaurant settings required before live checkout

Protected configuration must cover restaurant identity/contact/timezone, operating hours, ordering enabled/paused state, pickup location/instructions, delivery zones/fees, minimum order if any, tax and rounding policy if applicable, accepted fulfilment/payment methods, order acceptance/cancellation policy and support details.

All actual values remain unresolved user inputs. Do not invent defaults. Checkout stays disabled until required values exist and are server-validated.

## 9. Authentication, welcome and account journeys

Welcome decision target:
- Sign In → Sign In.
- Create Account → Create Account.
- Continue as Guest → Home/Menu with visible guest state.
- Get Started → primary onboarding choice, not an unexplained bypass.

Add a real Account destination:
- signed out: sign-in/create-account actions;
- guest: guest-order access/help and account creation without losing order access;
- signed in: profile basics, order history, sign-out and permitted account actions.

Define verification, password reset, session persistence/expiry and recovery. Social sign-in remains unavailable unless configured and approved. Final CTA behavior and Account content require Stage 4 confirmation against the reference.

## 10. Router, IndexedDB and offline behavior

- Preserve modular router; define route metadata, not-found behavior, focus management and browser history.
- Guard async screen loads with route-generation/lifecycle checks so stale storage responses cannot replace a newer route.
- Version IndexedDB schema and define forward migrations, malformed-record handling, multi-tab behavior, quota/storage-denial states and cache invalidation.
- Cart persists across reloads. Do not cache guest credentials/private order data without separate security review.
- Offline browsing is limited to previously cached production catalogue. New order submission, live status and admin writes require connectivity.
- Distinguish local cart, cached data, pending request and server-confirmed order.

## 11. Visual system, assets and measurable acceptance

The supplied 12-screen montage and Version 1.5 reconstruction remain authoritative. Preserve premium espresso-dark, warm-white and amber/orange direction, QuickBite branding, hierarchy and high-quality realistic food photography.

Use a curated licensed/provenance-recorded local asset library. One canonical product image family must be reused across Home, Menu, Details and Cart. Use optimized responsive variants, stable aspect ratios, focal points, lazy loading below fold, eager loading for hero and graceful placeholders. Avoid third-party remote production dependencies unless explicitly approved. Never present generic stock imagery as actual restaurant dishes.

For each screen:
1. Compare the matching reference crop at the same state and viewport.
2. Baseline 390×844 CSS px; also test 320, 360, 430, 768, 1024 and 1440.
3. Save side-by-side and 50% overlay; save difference image where tooling permits.
4. Record major component bounds. Target deviation ≤4 CSS px or ≤2% of relevant dimension, whichever is larger; deviations require review.
5. Check typography, wrapping, hierarchy, section order, spacing, image identity/crop, iconography and navigation.
6. Missing required hero/product imagery, wrong section hierarchy, clipped controls, horizontal page overflow or bottom-nav obstruction are visual blockers.
7. Document uncertainty rather than guessing. No screen is visually verified without captured implementation evidence.

## 12. Accessibility and Android baseline

Semantic landmarks/headings/labels, visible keyboard focus, touch targets aiming for 44×44 CSS px, WCAG AA contrast where applicable, accessible live feedback, field-associated errors, and no color-only status. Android keyboard must not hide focused fields/actions; safe areas and bottom navigation must not obscure content. Test back navigation, resizing, slow network, image failure, storage denial, repeated taps and no horizontal overflow.

## 13. Layered testing and release gates

1. Unit: paisa math, validation, cart identity, options, state machine and permission helpers.
2. Service integration: repositories, IndexedDB migration/cache invalidation and route lifecycle.
3. Firebase Emulator: Firestore/Storage rules, roles, guest isolation and trusted functions.
4. Backend contract: price tampering, unavailable/changed products, idempotent retries, concurrent status updates and invalid transitions.
5. Browser E2E: customer, guest, account, admin, staff (if approved), error and recovery journeys.
6. Visual regression: all 12 screens and required widths.
7. Android manual: touch, keyboard, safe areas, network changes, back behavior and persistence.
8. Release smoke: production config, no demo fallback, no secrets in client bundle, critical rules and order integrity.

Release blockers: critical security/data-integrity defect; client writes authoritative orders/roles; duplicate order on retry; price mismatch; guest cross-access; production demo fallback; checkout enabled without required settings; major visual blockers; critical persona journey failure; or tests falsely reported as verified. Green CI alone is not release approval.

## 14. Consolidated requirement register

| ID | Requirement | Priority | Acceptance evidence |
|---|---|---|---|
| QB3-001 | Preserve single-restaurant boundary | Must | No marketplace/vendor flows |
| QB3-002 | Preserve modular Vite/Vanilla foundation | Must | Incremental changes; existing journeys retained |
| QB3-003 | Explicit dev/demo/production modes | Must | Production never falls back to fixtures |
| QB3-004 | Remote production catalogue | Must | Remote/cache/offline/empty/error distinct |
| QB3-005 | Integer-paisa canonical money | Must | End-to-end integer tests |
| QB3-006 | Server-authoritative price/options/totals | Must | Tampered client money ignored/rejected |
| QB3-007 | Atomic idempotent order creation | Must | Same-key retry creates exactly one order |
| QB3-008 | Immutable order snapshots | Must | Menu edit does not alter history |
| QB3-009 | Guest checkout without registration | Must | Guest can order without account |
| QB3-010 | Secure guest access lifecycle | Must | Isolation, expiry, revocation, rate-limit tests |
| QB3-011 | Customer ownership enforcement | Must | Customer A cannot access B's records |
| QB3-012 | Least-privilege admin/staff roles | Must | Role matrix and emulator denial tests |
| QB3-013 | Server-side status state machine/audit | Must | Invalid/concurrent transitions rejected |
| QB3-014 | Restaurant settings gate checkout | Must | Missing/closed/out-of-zone blocks submission |
| QB3-015 | Welcome flow and Account route | Must | Auth/guest/account routes behave correctly |
| QB3-016 | IndexedDB migration/failure handling | Must | Upgrade, malformed data and quota tests |
| QB3-017 | Async route lifecycle protection | Must | Stale request cannot replace current route |
| QB3-018 | Curated local asset pipeline | Must | Consistent image family and provenance |
| QB3-019 | 12-screen reference fidelity | Must | Per-screen comparison evidence; blockers fixed |
| QB3-020 | Responsive/Android behavior | Must | Width matrix and device checklist |
| QB3-021 | Accessibility baseline | Must | Keyboard, labels, focus, contrast, announcements |
| QB3-022 | Layered test/release gates | Must | Reports with honest evidence labels |
| QB3-023 | Reproducible dependency install | Should | Lockfile and deterministic CI |
| QB3-024 | Maintainable CSS organization | Should | Modular CSS with no visual regression |
| QB3-025 | Staff queue and operational UI | Scope decision | Explicit Stage 4 scope approval |
| QB3-026 | Restaurant policies/fees/taxes | User input | Confirmed values; no invented defaults |
| QB3-027 | Guest credential expiry/delivery/recovery | User input | Approved lifecycle |
| QB3-028 | Cancellation and status policy | User input | Approved actor/transition matrix |
| QB3-029 | Production deployment/paid services | Separate approval | Explicit activation approval |

## 14A. Acceptance test catalogue

| Test | Scenario | Expected result |
|---|---|---|
| AT-01 | Production build missing Firebase config | Safe failure; no demo fallback |
| AT-02 | Preview/demo mode | Visible disclosure; local-only writes |
| AT-03 | Remote catalogue unavailable | Cache or explicit error, never fixtures |
| AT-04 | Fractional/unsafe paisa | Rejected |
| AT-05 | Client tampers with price/total | Server ignores/rejects |
| AT-06 | Price changes before checkout | Recalculate; customer acknowledges |
| AT-07 | Product/option unavailable | Submission blocked with recovery |
| AT-08 | Same order key retried | Exactly one order |
| AT-09 | Same key, changed payload | Conflict/rejection |
| AT-10 | Guest submits without account | Order succeeds if server rules pass |
| AT-11 | Guest credential used on another order | Denied |
| AT-12 | Expired/revoked guest credential | Denied |
| AT-13 | Customer reads another customer's order | Denied |
| AT-14 | Customer calls admin operation | Denied |
| AT-15 | Staff exceeds assigned permission | Denied and safely audited |
| AT-16 | Client writes role/status/total | Denied |
| AT-17 | Invalid order transition | Rejected; history unchanged |
| AT-18 | Concurrent staff updates | Conflict handled safely |
| AT-19 | Closed/out-of-zone order | Blocked accurately |
| AT-20 | Required settings missing | Order submission disabled |
| AT-21 | Navigate away during delayed load | Old result cannot replace current route |
| AT-22 | IndexedDB schema upgrade | Data migrated or safe error |
| AT-23 | Storage unavailable/quota exceeded | Recoverable error; no crash |
| AT-24 | Rapid repeated cart/order actions | Consistent cart; no duplicate order |
| AT-25 | 320px and 390px viewport | No overflow/clipped primary action |
| AT-26 | Android keyboard on checkout | Focused field/action remains usable |
| AT-27 | Safe area and bottom navigation | Content not obscured |
| AT-28 | All 12 screens compared | Evidence saved; blockers resolved |
| AT-29 | Product image reused across screens | Same canonical product image family |
| AT-30 | Back button/unknown route | Correct history and accessible not-found |
| AT-31 | Keyboard/screen-reader form use | Labels, focus, errors and announcements work |
| AT-32 | Production bundle inspection | No secrets/demo fixtures/privileged logic |

## 15. Open decisions — cannot be invented

| ID | Required decision |
|---|---|
| OD-01 | Restaurant name, address, contact and timezone |
| OD-02 | Opening hours and pause behavior |
| OD-03 | Pickup location and instructions |
| OD-04 | Delivery coverage and fee policy |
| OD-05 | Minimum order, taxes and rounding |
| OD-06 | Cancellation/decline policy and actors |
| OD-07 | Guest credential expiry, delivery and recovery |
| OD-08 | Staff screens, roles and permitted transitions |
| OD-09 | Real menu, options, photos and prices |
| OD-10 | Firebase project/configuration and ownership |
| OD-11 | Production domain/deployment and paid-service approval |
| OD-12 | Final Get Started behavior and Account content |

## 16. Stage 2 risk disposition

CR-01 order trust boundary: contract now defined; implementation/tests open.  
CR-02 Firebase authorization: default-deny role model defined; exact rules/tests open.  
CR-03 guest access: lifecycle defined; policy values/implementation open.  
CR-04 admin/staff: least privilege defined; staff scope awaits decision.  
CR-05 money: integer-paisa contract established.  
CR-06 workflow: canonical register established; changelog remains append-only.  
CR-07 demo/production: explicit modes and no-fallback rule established.  
CR-08 welcome/account: target journey defined; final reference reconciliation open.  
CR-09 stale rendering: lifecycle guard and test defined.  
CR-10 IndexedDB: migration/reconciliation requirements defined.  
CR-11 visuals: measurable evidence procedure and blockers defined.  
CR-12 assets: provenance/local pipeline defined.  
CR-13 staff: scope awaits user decision.  
CR-14 settings: required values listed; actual values unresolved.  
CR-15 router: not-found/history/access UX requirements included.  
CR-16 phone validation: shared contract required; accepted formats await confirmation.  
CR-17 testing: layered gates and blockers defined.  
CR-18 CSS: controlled organization planned.  
CR-19 lockfile: reproducibility requirement added.

## 17. Stage 3 outcome

Stage 2 findings have been incorporated into a consolidated architecture, 29-item requirement register, 32 acceptance tests, risk disposition and open-decision list.

**Stage 3 planning is complete. No coding or implementation has occurred.** Stage 4 must convert this baseline into the final implementation authorization package, identify exact affected files/modules and phases, resolve or explicitly defer user-dependent decisions, and request approval. Stage 5 remains unauthorized until explicit Stage 4 approval.
