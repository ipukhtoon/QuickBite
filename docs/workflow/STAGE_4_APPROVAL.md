# Stage 4 — Final Implementation Plan and Approval Request

**Project:** QuickBite  
**Repository:** ipukhtoon/QuickBite  
**Stage:** 4 — Approval  
**Status:** APPROVED BY USER — 2026-11-10  
**Implementation authorization:** GRANTED WITHIN THIS APPROVED PLAN

 > User explicitly instructed: “Save everything and move to stage 5.” This records approval to begin Stage 5 within the scope below. Production deployment, live payment activation, production data migration and unrelated changes remain unauthorized.

## 1. Project objective

Build a complete, responsive, single-restaurant food-ordering application using the existing food_delivery_ui.html as the sole visual design authority.

Preserve its coral/red, white and light-gray design language, Plus Jakarta Sans typography, rounded cards, soft shadows, food photography and navigation patterns. Extend the same design system consistently to all customer and restaurant operations screens.

The application must provide real working journeys, secure data handling and clear customer/staff feedback rather than simulated alerts or static sample interactions.

## 2. Proposed technology

- HTML5 and CSS3.
- Vanilla JavaScript ES modules.
- Vite build tooling.
- Firebase Authentication.
- Cloud Firestore.
- Firebase Storage.
- Trusted Firebase server-side functions for order creation and privileged state transitions.
- Firestore and Storage Security Rules.
- IndexedDB for local cart draft and specifically approved local cache.
- Firebase Emulator Suite and automated tests where feasible.

Any technology substitution requires a documented reason and user approval before implementation.

## 3. Requirements checklist

| ID | Requirement | Planned result |
|---|---|---|
| QB-REQ-001 | Preserve reference design | Extract tokens and components from existing HTML; extend consistently |
| QB-REQ-002 | Responsive UI | Mobile-first responsive customer and operations layouts |
| QB-REQ-003 | Catalogue | Firestore-backed active categories/products |
| QB-REQ-004 | Combined search/filter | Search, category and availability filters work together |
| QB-REQ-005 | Product options | Required/min/max choices, availability and price deltas |
| QB-REQ-006 | Functional cart | Actual line items, quantities, options, totals and remove/update |
| QB-REQ-007 | Cart revalidation | Refresh price/availability and ask customer to acknowledge changes |
| QB-REQ-008 | Guest checkout | No mandatory account registration |
| QB-REQ-009 | Customer accounts | Registration, sign-in, sign-out and recovery |
| QB-REQ-010 | Fulfilment | Configurable delivery/pickup with server validation |
| QB-REQ-011 | Cash payment | Cash on Delivery and Cash on Pickup initially |
| QB-REQ-012 | Trusted order creation | Server-side validation and canonical total calculation |
| QB-REQ-013 | Idempotency | Retry-safe order submission |
| QB-REQ-014 | Order lifecycle | Validated, role-authorized and audited status transitions |
| QB-REQ-015 | Order privacy | Customer and guest access scoped securely |
| QB-REQ-016 | Saved/profile | Customer-owned saved items and profile |
| QB-REQ-017 | Staff operations | Restricted order queue and allowed actions |
| QB-REQ-018 | Admin catalogue | Product/category management without rewriting historical orders |
| QB-REQ-019 | Restaurant settings | Configurable hours, fulfilment, currency and fees |
| QB-REQ-020 | Security rules | Default-deny access, backend authorization and validation |
| QB-REQ-021 | Local persistence | Explicit offline state; offline orders never appear confirmed |
| QB-REQ-022 | Accessibility | Semantic controls, keyboard, focus, labels and announcements |
| QB-REQ-023 | Media quality | Approved/licensed optimized imagery with fallbacks |
| QB-REQ-024 | Operational recovery | Logs, backup/restore, non-production testing and error handling |
| QB-REQ-025 | Documentation | Maintain complete docs/ governance and traceability |

## 4. Files and modules affected

### Repository root
- Rename food_delivery_ui.html to index.html, preserving its original content as the starting point.
- Add package.json and Vite configuration.
- Add appropriate ignore/config files.
- Add test and build scripts.

### Public assets
- public/assets/brand/
- public/assets/food/
- public/assets/categories/
- public/assets/banners/
- public/assets/icons/

Only approved/licensed image assets will be included. Real restaurant branding and operational facts remain configurable until supplied.

### Frontend
- src/app/: bootstrap, router, global state and route guards.
- src/styles/: design tokens, global styles, components and responsive rules.
- src/components/: shared buttons, cards, inputs, dialogs, navigation, badges and feedback.
- src/features/home/: home and promotions display.
- src/features/catalogue/: menu, category and search/filter.
- src/features/product/: product details and options.
- src/features/cart/: persistent local cart draft and cart review.
- src/features/checkout/: fulfilment, customer details and payment selection.
- src/features/orders/: confirmation, order history and order detail.
- src/features/saved/: favourites.
- src/features/profile/: customer profile.
- src/features/auth/: registration, sign-in, sign-out and recovery.
- src/features/operations/: staff queue, admin dashboard, products, categories, order management and settings.
- src/services/: Firebase client, authentication, catalogue, customer, order and storage adapters.
- src/database/: IndexedDB schema and migrations.

### Backend and Firebase
- functions/: trusted order creation, idempotency, order transitions, role-protected administrative operations as approved.
- firebase/firestore.rules: owner/role-based access.
- firebase/storage.rules: authorized upload/read access.
- firebase/firestore.indexes.json: query indexes.
- firebase configuration and emulator setup.
- Tests for rules, functions and critical data contracts.

### Tests
- tests/unit/
- tests/integration/
- tests/security/
- tests/e2e/ where browser tooling is available.

The final exact file list may be refined during implementation only when the change does not alter approved scope or architecture. Material changes return for approval.

## 5. Screen implementation scope

### Customer
1. Home.
2. Menu/catalogue.
3. Search and filtering.
4. Product details/options.
5. Cart.
6. Checkout.
7. Order confirmation.
8. Orders and order details.
9. Saved items.
10. Profile.
11. Sign in.
12. Registration.
13. Password recovery.

### Restaurant operations
14. Admin dashboard.
15. Product management.
16. Category management.
17. Order management.
18. Restaurant settings.
19. Staff order queue and restricted staff actions.

Each screen must include loading, empty, validation, success and error states where relevant, plus responsive and accessibility behavior.

## 6. Database/backend contracts

Logical entities:
- restaurantSettings
- categories
- products
- optionGroups/options
- customers
- staffMemberships
- orders
- immutable order item snapshots
- order status/audit events
- savedItems
- promotions only if configured and approved

Trusted order creation:
1. Validate authenticated or guest identity.
2. Validate request and fulfilment.
3. Load authoritative products/options.
4. Validate availability and selections.
5. Calculate all totals using integer minor currency units and configured rules.
6. Create immutable order snapshot.
7. Enforce idempotency.
8. Return canonical order result.

Firestore remains authoritative for shared data and confirmed orders. IndexedDB stores only the cart draft and specifically approved cache. Client-side totals are estimates only.

## 7. Security requirements

- Default-deny Firestore and Storage rules.
- Customers can access only their own private data.
- Guest order access must use a high-entropy, non-guessable credential or secure anonymous identity.
- Guest credential expiry, recovery and account-claiming behavior must be specified before guest order lookup is released.
- Staff/admin privileges are assigned and revoked through trusted operations.
- Client role flags are never trusted.
- Privileged actions are validated server-side.
- Order totals and product prices are never accepted as client authority.
- Idempotency prevents duplicate orders.
- Validate input, quantities, option selections, file type/size and object ownership.
- Avoid unnecessary PII in logs and analytics.
- Clear private local data on logout/account switch.
- Use separate non-production and production Firebase environments.
- No production deployment or live payment integration without separate explicit authorization.

## 8. UI/UX requirements

- Match the current HTML design authority, not a newly invented theme.
- Replace the fixed phone frame with fluid responsive layouts.
- Keep Cart distinct from Orders and make cart access discoverable.
- Use combined search/filter state.
- Preserve customer selections when possible if catalogue data changes; explain changed prices/unavailable items.
- Show clear order confirmation and safe recovery from uncertain network submission.
- Distinguish order status from cash payment status.
- Show only real configured promotions.
- Use licensed, consistent food imagery, stable aspect ratios, lazy loading and fallback images.
- Use semantic controls, visible focus, keyboard support, labels, field errors, live announcements and practical touch targets.
- Ensure virtual keyboard does not obscure checkout fields/actions.

## 9. Business configuration inputs

These must be configurable and must not be fabricated:
- Restaurant name, logo, address and contact details.
- Currency and tax/receipt policy.
- Delivery zones, delivery fee and minimum order.
- Operating hours and temporary closure.
- Preparation estimates and support details.
- Guest credential expiry/recovery/account claiming.
- Staff permission granularity.
- Cancellation/rejection policy.
- Hosting provider and production domain.

Initial payment scope is Cash on Delivery and Cash on Pickup. Online payments are excluded unless separately configured and approved.

## 10. Implementation sequence after approval

1. Establish project scaffold and preserve/rename the existing HTML entry.
2. Extract design tokens and reusable UI components; reproduce the current home screen responsively.
3. Build customer catalogue, search, product details and cart.
4. Implement authentication and secure guest identity/access.
5. Define and implement Firestore schema, indexes, rules and local cart persistence.
6. Implement trusted order creation, idempotency, order snapshots and status lifecycle.
7. Build checkout, order confirmation and customer order history.
8. Build staff order queue and admin operations.
9. Add restaurant configuration and approved media assets.
10. Add accessibility, responsive, security, failure-recovery and regression tests.
11. Run independent Goldfish review and fix defects through the approval workflow.
12. Update documentation, changelog and project status with verified evidence.

Production deployment, payment gateway activation and live data migration are outside this approval and require separate authorization.

## 11. Goldfish inspection criteria

Goldfish independently inspects:
- First-time visitor: restaurant identity, menu discovery and service availability.
- Guest: no forced registration, secure order access, retry recovery and privacy.
- Registered customer: account lifecycle and order ownership.
- Returning customer: cart recovery, stale prices and order history.
- Administrator: safe catalogue/settings/order management and role controls.
- Staff: clear queue, permitted status actions and accidental-action safeguards.
- Beginner: understandable language, validation and recovery.
- Android user: responsive layout, keyboard, touch targets, scrolling and safe areas.

Evidence must be classified as VERIFIED BY INTERACTION, VERIFIED BY SOURCE, VISUAL OBSERVATION, POTENTIAL ISSUE or NOT TESTABLE. Goldfish must not claim interaction tests without actually performing them.

## 12. Acceptance and verification

Stage 5 cannot be declared complete until:
- Every QB-REQ requirement has a recorded result.
- Critical security and data integrity tests pass.
- Core guest and registered customer journeys work.
- Staff/admin authorization is verified.
- Search/filter, cart and checkout work with real data contracts.
- Idempotency and server-side price calculation are tested.
- Responsive and accessibility checks are completed to the available test capability.
- No critical defects remain unresolved.
- Goldfish verification report records evidence and untested areas.
- Documentation, changelog and status reflect the actual implementation.

## 13. Approval boundaries and unresolved risks

Approval of this plan would authorize only the Stage 5 implementation scope described above. It would not authorize:
- Online payment gateway activation.
- Production deployment or DNS changes.
- Use of real customer data for testing.
- Destructive changes to production Firebase.
- Unapproved third-party services or paid subscriptions.
- New features outside the listed scope.
- A visual redesign away from the existing HTML reference.

Unresolved restaurant inputs may be represented as configurable settings and safe setup requirements during development. Production ordering must remain disabled until required real values and policies are supplied.

## 14. Explicit approval required

**Current status: APPROVED BY USER — 2026-11-10.**

The user explicitly approved this plan and authorized Stage 5 on 2026-11-10. Material changes outside the approved scope must be re-presented for approval.


## 13. Approval record

- Decision: APPROVED
- Approval date: 2026-11-10
- Approval evidence: User instruction in project conversation: “Save everything and move to stage 5.”
- Scope: Stage 5 implementation may begin according to this plan.
- Exclusions: Production deployment, live payment gateway activation, production data migration and any material scope/architecture change require separate explicit authorization.
