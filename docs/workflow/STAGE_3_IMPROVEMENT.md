# Stage 3 — Improvement and Consolidated Architecture

**Project:** QuickBite  
**Repository:** ipukhtoon/QuickBite  
**Stage:** 3 — Improvement  
**Status:** COMPLETE — Stage 4 approval required  
**Implementation authorization:** NOT GRANTED

> This planning document incorporates the Stage 2 Critical Reviewer and independent Goldfish findings. It does not authorize coding, file renaming, Firebase provisioning, production data changes or deployment.

## 1. Fixed project direction

- QuickBite is a fresh, single-restaurant food-ordering application, not a marketplace.
- The existing food_delivery_ui.html is the sole visual design authority.
- Preserve its coral/red, white and light-gray visual language, Plus Jakarta Sans typography, rounded cards, soft shadows, food-photography-led product cards and navigation style.
- Extend the design language consistently to every new screen. Do not introduce an unrelated theme.
- The fixed 390 × 844 phone frame is only a mockup container, not a production layout constraint.
- Guest ordering and registered customer accounts are required.
- Initial payment scope: Cash on Delivery and Cash on Pickup. No online gateway is assumed configured.
- Delivery and pickup are intended options, subject to real restaurant configuration.
- Never invent restaurant identity, prices, currency, fees, tax rules, opening hours, service areas, ratings or delivery estimates.

## 2. Stage 2 findings disposition

| Finding | Improved-plan disposition |
|---|---|
| CR-001 source of truth | Backend/Firestore authoritative for catalogue, availability, order state and totals; IndexedDB limited to local cart draft and explicitly selected cache. |
| CR-002 trusted order creation | Trusted server operation validates current catalogue/options, calculates totals using integer minor units and enforces idempotency. |
| CR-003 guest privacy | High-entropy guest access credential or secure anonymous identity; no public order reads or phone-number-only lookup. |
| CR-004 schema/query design | Define bounded documents, ownership, collection paths, query patterns, indexes and retention before implementation. |
| CR-005 authorization | Customer, staff and administrator roles; trusted role assignment/revocation; backend and rules enforce permissions. |
| CR-006 offline behavior | Cached browsing may be available with stale-state indication; cart draft may persist locally; order submission requires connectivity and fresh server validation. |
| CR-007 order lifecycle | Explicit server-enforced status state machine, actor permissions, timestamps and audit trail. |
| CR-008 financial rules | Integer minor-unit calculations, configurable currency/tax/fees and immutable order snapshots. |
| CR-009 product options | Option groups support required/min/max selections, price deltas and availability; backend validates selections. |
| CR-010 fulfilment | Delivery/pickup eligibility, zones, hours, fees and temporary closure are configurable and server-validated. |
| CR-011 promotions | Promotion UI inactive unless a genuine server-validated promotion is configured. |
| CR-012 search | Bounded single-restaurant catalogue can be filtered client-side using one combined filter state. |
| CR-013 media | Licensed assets, optimized variants, consistent ratios, lazy loading, alt text and fallback states. |
| CR-014 observability/recovery | Low-PII structured logs, error monitoring, backup/export and restore rehearsal. |
| CR-015 environments | Separate non-production and production Firebase environments; emulator tests where feasible. Production deployment needs separate authorization. |
| CR-016 hosting | Select hosting target and configure Vite build, routing, environment and rollback. Do not assume GitHub Pages meets backend needs. |
| CR-017 screen contracts | Each screen defines routes, permissions, data dependencies and loading/empty/error/offline states. |
| CR-018 cart refresh | Cart stores IDs/options/quantities; authoritative price and availability refresh at review/checkout; customer acknowledges changes. |
| CR-019 accessibility | Semantic controls, keyboard support, focus management, live announcements, field labels/errors and adequate contrast/touch targets. |
| CR-020 responsive UI | Fluid layouts, tested breakpoints, safe areas, keyboard-aware forms and non-obstructive sticky controls. |
| CR-021 admin boundary | Customer and operations layouts may share a frontend, but privileged routes and APIs are protected by backend authorization and rules. |

## 3. Improved architecture

### Frontend layers
- Application shell: bootstrap, route resolution, global state and error handling.
- Design system: tokens from the existing HTML; reusable buttons, inputs, cards, badges, dialogs, navigation and feedback.
- Customer features: home, catalogue, search/filter, product details, cart, checkout, confirmation, orders, saved items, profile and authentication.
- Operations features: staff order queue, admin overview, products, categories, order management and restaurant configuration.
- Service layer: Firebase access, authentication, catalogue reads, customer data, local cart persistence and trusted function calls.
- Validation layer: client-side usability validation; backend repeats all security-sensitive validation.

Suggested project layout is provisional:

    QuickBite/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── public/assets/{brand,food,categories,banners,icons}/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── features/{home,catalogue,product,cart,checkout,orders,saved,profile,auth,operations}/
    │   ├── services/
    │   ├── database/
    │   └── styles/
    ├── functions/
    ├── firebase/
    ├── tests/
    └── docs/

The planned rename from food_delivery_ui.html to index.html is allowed only after Stage 4 approval. Preserve its design and content as the starting point before modularization.

### Backend trust boundaries
- Firebase Authentication establishes identity, not privileges by itself.
- Customer records are private to their owner.
- Staff/admin membership is provisioned by an authorized administrator or trusted process.
- Privileged backend operations validate current role/membership, not client-supplied role data.
- Firestore rules deny access by default and restrict paths to required owners/roles.
- Sensitive order creation and status transitions use trusted server-side functions.
- Client totals are previews only; backend totals are canonical.
- No service-account credentials or private secrets in frontend code.

### Local persistence and connectivity
- Backend/Firestore is authoritative for shared restaurant data and confirmed orders.
- IndexedDB stores a customer cart draft and only explicitly approved cache data.
- Cached catalogue data is identified as potentially stale while offline.
- The UI never implies an order is placed while offline.
- Order submission requires connectivity and fresh server validation.
- Logout/account switching clears private local data belonging to the previous identity.

## 4. Data model direction

The final schema must be specified before implementation. Initial logical entities:

- restaurantSettings: service hours, fulfilment options, fees, currency and operational configuration.
- categories: name, display order, active state and media reference.
- products: name, description, category, media, base price in minor units, availability and option-group references.
- optionGroups/options: required/min/max selections, price deltas and availability.
- customers: profile fields owned by authenticated customer.
- staffMemberships: staff identity, role, active state and restaurant scope.
- orders: customer/guest reference, fulfilment, canonical financial summary, status and timestamps.
- order item snapshots: product and option labels, identifiers, quantities and purchase-time prices.
- order events: meaningful status/audit events, bounded and access-controlled.
- savedItems: customer-owned product references.
- promotions: only if a genuine validated promotion feature is enabled.

Avoid unbounded arrays/documents. Define indexes from documented queries. Catalogue edits must never rewrite historical order snapshots.

## 5. Trusted order placement contract

The client submits only necessary identifiers and selections: product IDs, option IDs, quantities, fulfilment, required customer/guest reference and idempotency key.

The backend must:
1. Authenticate or validate guest access context.
2. Validate request shape, quantity limits and fulfilment.
3. Load current product and option records.
4. Reject inactive/unavailable products and invalid options.
5. Calculate items, fees, tax and discounts using integer minor units and configured rules.
6. Create immutable order snapshots and initial status.
7. Enforce idempotency so retries do not create duplicate orders.
8. Return canonical order ID, status and server-calculated summary.

If a network timeout makes the outcome uncertain, the client checks the original idempotent submission rather than blindly creating another order.

## 6. Order lifecycle proposal

Candidate states, to be reconciled with real restaurant operations:

pending_confirmation → accepted → preparing → ready_for_pickup → completed

Delivery may include out_for_delivery between preparation and completion. Exception states may include rejected and cancelled.

Every transition must be valid from the prior state, authorized, backend-validated and auditable with actor/timestamp and reason where appropriate. Internal state names must map to clear customer-facing labels. Payment status must be distinct from order status. Cash is collected at fulfilment; order placement must not mark an order paid.

## 7. Initial roles and permissions

| Capability | Guest | Customer | Staff | Admin |
|---|---:|---:|---:|---:|
| Browse active catalogue | Yes | Yes | Yes | Yes |
| Manage own cart | Yes | Yes | No | No |
| Place order | Yes | Yes | No | No |
| Read own orders | Secure scoped access | Yes | Operational scope | Yes |
| Manage order workflow | No | No | Allowed transitions | Yes |
| Manage products/categories | No | No | No by default | Yes |
| Manage staff/roles | No | No | No | Authorized admin |
| Change restaurant settings | No | No | No | Yes |

Role assignment, staff invitations and revocation are trusted administrative operations. Final staff-role granularity is specified in the permissions design.

## 8. Screen and route contracts

Initial scope:
- Home, menu/catalogue, search, product details.
- Cart, checkout, order confirmation.
- Orders, saved items, profile.
- Sign in, registration, password recovery.
- Admin dashboard, product management, category management, order management and restaurant settings.

Every screen must define route and allowed roles, navigation/back behavior, data dependencies, loading/empty/validation/error/offline states, responsive behavior, keyboard/focus behavior and acceptance tests.

Cart must be distinct from order history. Cart entry must be prominent and its badge must represent a clearly defined actual item count.

## 9. Visual and asset contract

- Preserve the original HTML visual language and extracted CSS tokens.
- Reuse existing search, category-chip, promo, card and navigation patterns where appropriate.
- New screens must look like extensions of the same product.
- Do not invent a different palette or typography system.
- Replace sample identity/address/profile with configurable real values before production.
- Use approved/licensed food imagery, consistent ratios, dimensions, alt text, loading behavior and fallbacks.
- Promotions remain hidden or non-claiming until genuinely configured.
- Never fabricate ratings, reviews, discounts, delivery estimates or stock.

## 10. Stable requirements and acceptance criteria

| ID | Requirement | Acceptance criterion |
|---|---|---|
| QB-REQ-001 | Preserve reference design | Original visual tokens/patterns retained; new screens visually consistent. |
| QB-REQ-002 | Responsive customer UI | No fixed phone frame; core journeys usable on narrow Android, tablet and desktop. |
| QB-REQ-003 | Catalogue | Active products/categories load from authoritative data with loading/empty/error states. |
| QB-REQ-004 | Combined search/filter | Search, category and availability filters compose and clear correctly. |
| QB-REQ-005 | Product options | Required/min/max choices and price changes validated client and server side. |
| QB-REQ-006 | Functional cart | Add/update/remove and line totals work; cart draft persists appropriately. |
| QB-REQ-007 | Cart revalidation | Changed prices/availability explained and acknowledged before submission. |
| QB-REQ-008 | Guest checkout | Guest can order without mandatory registration, with secure guest identity. |
| QB-REQ-009 | Customer accounts | Registration, sign-in/out and recovery use supported Firebase Auth flows. |
| QB-REQ-010 | Fulfilment | Delivery/pickup eligibility is configured and server-validated. |
| QB-REQ-011 | Cash payment | Initial methods are Cash on Delivery and Cash on Pickup; no online gateway implied. |
| QB-REQ-012 | Trusted order creation | Server calculates totals and creates immutable order snapshots. |
| QB-REQ-013 | Idempotency | Repeated submission with same idempotency key does not duplicate an order. |
| QB-REQ-014 | Order lifecycle | Only valid, authorized transitions are accepted and audited. |
| QB-REQ-015 | Order privacy | Customer/guest can access only authorized order data. |
| QB-REQ-016 | Saved/profile | Customer-owned records remain isolated across sign-in/out. |
| QB-REQ-017 | Staff operations | Staff can perform only explicitly permitted order operations. |
| QB-REQ-018 | Admin catalogue | Admin manages products/categories without rewriting historical orders. |
| QB-REQ-019 | Restaurant settings | Hours, fulfilment, currency and fees configurable; no invented business values. |
| QB-REQ-020 | Security rules | Unauthorized direct reads/writes denied; backend revalidates sensitive operations. |
| QB-REQ-021 | Local persistence | Offline state is explicit; no offline order appears confirmed. |
| QB-REQ-022 | Accessibility | Semantic controls, keyboard, focus, labels and dynamic announcements support core journeys. |
| QB-REQ-023 | Media quality | Images licensed, optimized, consistent and have loading/fallback behavior. |
| QB-REQ-024 | Operational recovery | Non-production tests, logs, backup/restore and failure handling documented. |
| QB-REQ-025 | Documentation governance | Stage files, QA reports, requirements, decisions, changelog and status maintained under docs/. |

## 11. Test plan and Goldfish scenarios

Functional/data tests:
- Combined search/category filters.
- Product option validation and unavailable products.
- Cart persistence, quantity updates and stale-price revalidation.
- Backend total calculation and integer rounding.
- Duplicate submission/idempotency.
- Guest order privacy and account linking.
- Customer ownership and staff/admin permission boundaries.
- Valid/invalid order transitions.
- Delivery/pickup eligibility.
- Logout and shared-device local-data cleanup.
- Firebase rules/functions tests in non-production emulator/environment where feasible.

Visual/accessibility/device tests:
- Compare all implemented screens against the original HTML design authority.
- Food image crop, dimensions and fallback.
- Keyboard-only core journey.
- Screen-reader labels and dynamic cart/order announcements.
- Narrow Android viewport and virtual keyboard.
- Tablet and desktop layouts.
- Loading, empty, offline, error and success states.

Goldfish personas: first-time visitor, guest customer, registered customer, returning customer, restaurant administrator, restaurant staff, beginner user and Android mobile user. Goldfish tests actual interactions only when a real browser/test environment is available; otherwise reports source-only evidence and marks interactions NOT TESTABLE.

## 12. Unresolved restaurant inputs

| ID | Input | Treatment |
|---|---|---|
| QB-OPEN-001 | Restaurant name, logo, contact and address | Configurable; real values needed before production |
| QB-OPEN-002 | Currency | Configurable; confirm before financial implementation |
| QB-OPEN-003 | Tax and receipt rules | Confirm with restaurant |
| QB-OPEN-004 | Delivery zones, fees and minimum order | Configurable; supply before production ordering |
| QB-OPEN-005 | Operating hours/temporary closure | Configurable; real schedule required |
| QB-OPEN-006 | Preparation estimates/support details | Do not invent |
| QB-OPEN-007 | Exact staff role granularity | Finalize permission matrix |
| QB-OPEN-008 | Hosting provider and production domain | Select before deployment |
| QB-OPEN-009 | Guest credential expiry/recovery/account claiming | Specify before implementation |
| QB-OPEN-010 | Cancellation/rejection policy | Define before operational launch |

Initial payment methods are Cash on Delivery and Cash on Pickup. Online payment is excluded unless separately configured and approved.

## 13. Documentation and approval governance

Stage 4 must present the final plan with requirement IDs, files/modules, implementation sequence, UI/UX, database/backend, security, tests, risks and unresolved inputs. The docs/ tree must contain separate stage and Goldfish reports, architecture, schema, Firebase/security, design, requirements, testing, decisions, changelog and status documentation.

The rename from food_delivery_ui.html to index.html must be explicitly included in Stage 4 and performed only after approval. Preserve the original design/content as the starting point.

## 14. Stage 3 exit status

**Stage 3 — Improvement: COMPLETE.**

The consolidated plan is ready for Stage 4 final approval. No coding, rename, Firebase provisioning, production data changes or deployment is authorized.
