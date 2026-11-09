# Stage 2 — Critical Reviewer

**Project:** QuickBite  
**Repository:** `ipukhtoon/QuickBite`  
**Stage:** 2 — Critical Reviewer  
**Status:** REVIEW COMPLETE — findings must be addressed in Stage 3  
**Implementation authorization:** NOT GRANTED

> This is a challenge of the Stage 1 proposal, not an implementation plan approval. No application code, Firebase configuration, production data or repository application structure was changed.

## 1. Review scope and evidence

The reviewer re-fetched the current `main` branch files:
- `food_delivery_ui.html`
- `docs/workflow/STAGE_1_ARCHITECT.md`
- `docs/QA/GOLDFISH_STAGE_1.md`

The HTML remains a single static page with embedded CSS/JavaScript, hardcoded sample products and simulated navigation/cart behavior. Its source SHA at review time was `e9a2c4a9296ec37c52bad0d5fb06c7c123a225c0`.

**Evidence classification:** VERIFIED BY SOURCE for statements about the inspected HTML and repository documents.  
**Runtime/browser testing:** Not performed.  
**Architecture assessments:** Reviewer analysis and recommendations, not observed production defects.

## 2. Overall critical-review verdict

The Stage 1 direction is broadly suitable as a starting point, but it is not sufficiently specified for implementation approval.

The most important weaknesses are:
1. The proposal names Firebase services without defining the exact trust boundaries and write paths.
2. IndexedDB and Firestore responsibilities could create two competing sources of truth.
3. The order lifecycle, pricing rules, fulfilment rules and failure/retry behavior are not specified.
4. Guest order access and customer identity linking need a secure design.
5. Admin/staff role assignment and authorization need an explicit threat model.
6. Product modifiers, availability, delivery fees and promotion rules are under-specified.
7. The screen inventory does not yet define route guards, state variants, accessibility behavior or responsive layouts.
8. Search, image management, observability, backups and operational recovery need decisions.

**Recommendation:** Do not begin implementation from the Stage 1 proposal alone. Resolve or explicitly defer the findings below during Stage 3.

## 3. Architecture and backend challenge

### CR-001 — Define a single authority for order data
- **Severity:** Critical
- **Challenge:** The proposal mentions IndexedDB and Firestore but does not yet define which is authoritative for each entity.
- **Risk:** Stale local product data or locally calculated totals could be mistaken for confirmed server state.
- **Required improvement:** Firestore/backend is authoritative for catalogue, availability, order status and order totals. IndexedDB may cache catalogue data and retain a local cart draft, but must never establish a confirmed order or override server prices/status. Label cached/offline data clearly.
- **Acceptance direction:** A client cannot create a confirmed order by writing directly to Firestore or editing local storage.

### CR-002 — Define trusted order creation and idempotency
- **Severity:** Critical
- **Challenge:** “Trusted backend functions” is too broad without a concrete contract.
- **Risk:** Forged totals, stale prices, duplicate orders after retry, unauthorized discounts or invalid product options.
- **Required improvement:** Use a callable/HTTPS trusted backend operation (or equivalent) that accepts product IDs, selected option IDs, quantities, fulfilment choice, customer/guest reference and an idempotency key. It must load authoritative product/option data, validate availability and constraints, calculate all amounts using integer minor currency units, create the order transactionally where supported, and return the canonical order identifier/status. Do not accept client totals as authoritative.
- **Acceptance direction:** Replaying the same idempotency key does not create another order; altered client prices do not affect the total.

### CR-003 — Guest checkout identity and order privacy
- **Severity:** Critical
- **Challenge:** Guest checkout is desirable, but “secure order access” is not yet designed.
- **Risk:** Guessable order IDs or public read rules could expose names, phone numbers, addresses and order contents.
- **Required improvement:** Choose and document a guest identity model. A practical option is a short-lived/anonymous Firebase identity or server-issued high-entropy guest access secret bound to the order, with rate-limited lookup and carefully scoped authorization. Do not expose an order through an easily guessed sequential ID or phone number alone. Define account-linking and guest-to-account order claiming.
- **Acceptance direction:** One guest cannot read another guest's order by changing an ID or request parameter.

### CR-004 — Firestore schema and query design
- **Severity:** High
- **Challenge:** The data domains are listed, but relationships, ownership, document paths, indexes and retention are absent.
- **Risk:** Expensive fan-out reads, unbounded documents, weak authorization checks and difficult reporting.
- **Required improvement:** Define a schema with explicit ownership and bounded documents. Consider top-level or restaurant-scoped collections for products/categories/orders and user-scoped customer data. Decide how order line snapshots, status events, staff memberships and settings are represented. Define composite indexes from actual screen queries. Avoid growing arrays for order history or unbounded logs inside one document.
- **Acceptance direction:** Every query needed by customer/admin screens has a documented path, index and security rule.

### CR-005 — Authentication is not authorization
- **Severity:** Critical
- **Challenge:** Firebase Authentication alone does not establish admin or staff privileges.
- **Risk:** A customer could alter a client-side role flag or gain privileged access.
- **Required improvement:** Define role assignment as a trusted administrative operation. Use server-controlled custom claims and/or authoritative role documents with rules and backend checks. Deny access by default. Document staff invitation, revocation, role changes and account recovery. Never let a user promote their own role.
- **Acceptance direction:** A normal customer cannot read/write admin data or invoke privileged operations, even after manipulating browser state or direct API requests.

### CR-006 — IndexedDB offline strategy
- **Severity:** High
- **Challenge:** “Offline-first” or “offline-friendly” is not defined, and Firestore's own cache may overlap with a custom IndexedDB layer.
- **Risk:** Duplicate persistence layers, stale availability, confusing conflict resolution and accidental display of unconfirmed orders.
- **Required improvement:** Choose one explicit local persistence strategy for each data type. Prefer Firestore's supported persistence/cache for Firestore-managed records if compatible with requirements; use a separate IndexedDB store only for data it genuinely owns, such as a cart draft or local queue. Define cache freshness, logout cleanup, device-sharing behavior and what actions are blocked offline. Never queue order submission for silent later execution without renewed validation and explicit customer feedback.
- **Acceptance direction:** Offline state is visibly identified; no offline action is presented as a confirmed order.

### CR-007 — Order state machine and operational lifecycle
- **Severity:** High
- **Challenge:** “Update order statuses” is not a defined process.
- **Risk:** Orders may jump from pending to completed, be cancelled after preparation, or be modified without audit.
- **Required improvement:** Define allowed statuses and transitions, actor permissions, timestamps, cancellation/refund policy, customer notifications and exception handling. Example candidate states: `pending_confirmation`, `accepted`, `preparing`, `ready_for_pickup`, `out_for_delivery`, `completed`, `rejected`, `cancelled`. This list must be reconciled with actual operations; do not assume every restaurant needs every state.
- **Acceptance direction:** Invalid transitions are rejected by the trusted backend and all meaningful status changes are auditable.

### CR-008 — Price, currency, tax, fees and rounding
- **Severity:** High
- **Challenge:** The source uses dollar sample prices, but the real restaurant currency and financial rules are not specified.
- **Risk:** Wrong currency, floating-point rounding errors, incorrect tax/delivery fee calculations or inconsistent receipts.
- **Required improvement:** Confirm currency and store money as integer minor units. Document tax inclusion, delivery fees, service charges, minimum order, discounts, rounding and refund behavior before implementation. Keep order snapshots immutable.
- **Acceptance direction:** UI, backend order, receipt and admin order detail reconcile to the same server-calculated amount.

### CR-009 — Product options and availability model
- **Severity:** High
- **Challenge:** Product details are proposed, but the catalogue model does not explain sizes, add-ons, required choices, option prices or sold-out behavior.
- **Risk:** Invalid combinations and incorrect pricing.
- **Required improvement:** Define product option groups, required/min/max selections, option availability and price deltas. Decide whether availability is simple in-stock/sold-out or quantity-managed. Validate all selections on the backend.
- **Acceptance direction:** Invalid or unavailable combinations cannot be submitted even if the client is manipulated.

### CR-010 — Fulfilment and delivery rules
- **Severity:** High
- **Challenge:** Delivery and pickup are mentioned, but delivery zones, address validation, hours, minimums, fees and order cut-off behavior are unspecified.
- **Risk:** Orders accepted outside service area/hours or with misleading delivery promises.
- **Required improvement:** Model fulfilment as configurable restaurant settings. Define delivery-area validation (manual area/postcode/zone rules or a confirmed provider), operating hours, temporary closure, pickup instructions, fee calculation and customer-facing unavailable states. Do not claim live GPS/ETA unless a real provider and data source exist.
- **Acceptance direction:** The backend independently validates fulfilment eligibility at order placement.

### CR-011 — Promotions and discounts
- **Severity:** High
- **Challenge:** The current HTML's claim-success alert is not a real promotion system.
- **Risk:** Misleading discount claims, abuse and inconsistent totals.
- **Required improvement:** Either implement a clearly scoped server-validated promotion model or remove/disable the promotion claim until configured. Define eligibility, expiry, usage limits, stacking and order minimums.
- **Acceptance direction:** The UI only confirms a discount after trusted validation and shows its actual effect in the canonical total.

### CR-012 — Search implementation
- **Severity:** Medium
- **Challenge:** The current source filters four cards in memory; the proposed catalogue may grow.
- **Risk:** A future Firestore implementation may incorrectly assume it provides general full-text search.
- **Required improvement:** For a small single-restaurant catalogue, load a bounded active catalogue and perform normalized client-side filtering, with combined category/search/availability filters. If catalogue scale or language requirements outgrow this, evaluate a dedicated search service as a separate approved decision.
- **Acceptance direction:** Search and filters compose correctly, handle empty results and remain usable with keyboard/screen readers.

### CR-013 — Media storage, licensing and performance
- **Severity:** Medium
- **Challenge:** “Curated licensed images” needs a repeatable asset workflow.
- **Risk:** Copyright uncertainty, huge image downloads, broken remote links and layout shifts.
- **Required improvement:** Record asset source/license/permission, generate responsive optimized variants, set dimensions/aspect ratios, lazy-load below-fold images and provide fallbacks. Restrict admin uploads by authorization, MIME type, size and safe object path.
- **Acceptance direction:** No broken image state blocks product discovery; images do not cause major layout shifts.

### CR-014 — Observability, backup and recovery
- **Severity:** High
- **Challenge:** The Stage 1 plan omits operational monitoring and recovery.
- **Risk:** Failed order functions, permission denials or accidental data loss go unnoticed.
- **Required improvement:** Define structured server logs without unnecessary PII, error monitoring, alerting for order-creation failures, Firestore export/backup strategy, retention, restore rehearsal and incident procedures. Do not log full payment details or sensitive customer fields.
- **Acceptance direction:** Operators can identify failed order creation and restore from a documented backup process.

### CR-015 — Firebase environment separation and deployment
- **Severity:** High
- **Challenge:** No environment/configuration strategy is defined.
- **Risk:** Development tests may write to production; rules/functions may be deployed inconsistently.
- **Required improvement:** Separate development/test and production Firebase projects or clearly isolated environments, use Firebase Emulator Suite for rules/functions tests where feasible, document environment configuration and require explicit production deployment approval.
- **Acceptance direction:** Automated tests run against non-production data; production deployment is separately approved.

### CR-016 — Vite and deployment path
- **Severity:** Medium
- **Challenge:** Vite is proposed but hosting/build/deployment constraints are not established.
- **Risk:** Broken asset paths, incorrect SPA fallback or deployment from the wrong branch.
- **Required improvement:** Decide hosting target, base path, SPA rewrites, build command, environment variable handling and CI checks. Keep secrets out of frontend environment variables. Do not assume GitHub Pages is suitable for every Firebase function/hosting requirement.
- **Acceptance direction:** Reproducible production build and documented deployment rollback, with no deployment performed during planning.

## 4. Frontend and UX architecture challenge

### CR-017 — Screen inventory needs state and route definitions
- **Severity:** High
- **Challenge:** A screen list alone does not define a complete application.
- **Required improvement:** For every screen document route, entry points, required data, permissions, loading/empty/error/offline states, back behavior, responsive variants and success/failure transitions.
- **Acceptance direction:** Each screen can be traced to user journeys and acceptance tests.

### CR-018 — Cart behavior when catalogue changes
- **Severity:** High
- **Challenge:** A persistent cart may contain products whose prices or availability change.
- **Required improvement:** Store product/option identifiers and selected quantities in the cart; treat displayed cached prices as provisional. On cart review and checkout, refresh authoritative prices/availability and clearly explain changes before order submission.
- **Acceptance direction:** No stale price is silently charged and no unavailable item is silently removed.

### CR-019 — Accessibility and form validation
- **Severity:** Medium
- **Challenge:** The source uses clickable elements and visual feedback without a full accessibility contract.
- **Required improvement:** Define semantic controls, keyboard support, focus management, visible focus, labels, error associations, announcements for cart updates, sufficient contrast and touch targets. Validate forms both client-side for usability and server-side for security.
- **Acceptance direction:** Core journeys are keyboard operable and errors are announced and associated with fields.

### CR-020 — Responsive behavior and Android browser realities
- **Severity:** Medium
- **Challenge:** Responsive support is stated but no breakpoints or Android-specific behavior is defined.
- **Required improvement:** Define fluid widths and breakpoints from content needs, mobile safe-area handling, virtual keyboard behavior, sticky navigation behavior, touch feedback and orientation behavior. Avoid fixed device mockup dimensions.
- **Acceptance direction:** Customer and staff journeys remain usable at narrow phone widths and common tablet/desktop widths.

### CR-021 — Customer and admin application boundaries
- **Severity:** High
- **Challenge:** A single application may be workable, but customer navigation and admin workflows have different information density and authorization needs.
- **Required improvement:** Decide whether admin is a separate route/layout shell within the same app or a separately deployed frontend. Whichever is chosen, keep authorization in backend/rules and do not rely on hiding navigation.
- **Acceptance direction:** Direct navigation to protected routes and direct API calls are denied for unauthorized users.

## 5. Requirements that must be resolved in Stage 3

The following cannot be silently assumed:

| ID | Decision required |
|---|---|
| DEC-01 | Official restaurant name, logo and contact details |
| DEC-02 | Currency and financial/tax rules |
| DEC-03 | Initial payment methods and whether any online gateway is actually configured |
| DEC-04 | Delivery and pickup availability, zones, fees and operating hours |
| DEC-05 | Guest order lookup and guest-to-account linking model |
| DEC-06 | Admin/staff roles and exact permission matrix |
| DEC-07 | Product modifiers and stock/availability model |
| DEC-08 | Order statuses, cancellation and refund policy |
| DEC-09 | Promotion feature scope (or disabled until configured) |
| DEC-10 | Hosting target and environment/deployment approach |
| DEC-11 | Whether offline support is limited to browsing/cart draft or includes any additional behavior |
| DEC-12 | Restaurant-specific policies: minimum order, preparation estimates, delivery instructions and customer support |

Where the user has not provided operational facts, Stage 3 should design configurable settings and clearly mark the values that require real restaurant input. It must not invent business facts.

## 6. Critical reviewer conclusion

**Stage 2 review is complete.**

The proposed stack can support a single-restaurant ordering product, but the architecture is not ready for implementation until the trust boundaries, order lifecycle, guest privacy, financial rules, fulfilment settings, role permissions, offline behavior and operational recovery are defined.

Stage 3 must incorporate these findings, retain the HTML's visual authority, address Goldfish findings independently and produce a consolidated plan with stable requirement IDs and testable acceptance criteria.

No coding, file renaming, Firebase provisioning, deployment or application source changes are authorized by this review.
