# QuickBite — Stage 4 Final Implementation Authorization Specification

**Document status:** APPROVED BY USER — HISTORICAL AUTHORIZATION  
**Workflow stage:** Stage 4 — Approval (completed)  
**Implementation status:** Original Stage 5 authorized; current work is limited by the separately approved UI Testing Milestone  
**Project:** QuickBite — premium single-restaurant food ordering application  
**Specification date:** 2026-11-03  
**Authority:** This document is the proposed implementation contract. If approved, Stage 5 must follow it exactly. Any material scope change requires renewed user approval.

---

## 1. Authorization gate and mandatory operating rules

This document records the original Stage 4 implementation contract and the user subsequently authorized Stage 5 in conversation with:

> **APPROVED — BEGIN STAGE 5 IMPLEMENTATION**

This original authorization remains in force. The user later approved a separate UI Testing Milestone. That narrower approval authorizes UI-only demo work and testing; Firebase/backend integration, production data, deployment and paid service activation remain excluded until separately approved.

The mandatory five-stage workflow remains in force:

1. **Architect:** inspect project, understand requirements and risks; no coding.
2. **Critical Reviewer:** independently challenge architecture and user journeys; no coding.
3. **Improvement:** incorporate valid criticism and consolidate plan; no coding.
4. **Approval:** present this specification and wait; no coding.
5. **Implementation:** Developer implements only the approved scope; Goldfish independently inspects and retests.

### Developer / Goldfish separation

- **Developer:** responsible for architecture, implementation, corrections and developer-side verification.
- **Goldfish:** independent third-person QA inspector. Goldfish challenges Developer claims, inspects actual source and running behavior where available, reports evidence and defects, and never modifies source code, production data or Firebase records.
- Goldfish findings return to Developer for correction. Goldfish then retests the affected behavior.
- Neither role may invent test results or claim interaction testing when only source inspection was possible.

### Evidence labels

Every QA finding and verification result must use one of:

- `VERIFIED BY INTERACTION`
- `VERIFIED BY SOURCE`
- `VISUAL OBSERVATION`
- `POTENTIAL ISSUE`
- `NOT TESTABLE`

Defects must include a unique ID, severity (Critical / High / Medium / Low), evidence, reproduction steps, impact, practical recommendation and retest result.

---

## 2. Product definition and fixed scope

QuickBite is a **single-restaurant** food ordering application. It is not a multi-vendor marketplace and must not acquire marketplace workflows, vendor onboarding, vendor commissions or multi-restaurant discovery.

### Confirmed product requirements

- Premium, bespoke commercial quality benchmark comparable to a carefully commissioned **$5,000-quality** product. This is a quality target, not a price, valuation or guarantee.
- High-fidelity implementation of the supplied 12-screen visual reference.
- Premium, consistent, realistic food photography.
- Guest checkout; creating an account is not compulsory to place an order.
- Registered customer accounts and order history.
- Home delivery and pickup.
- Initial payment methods: **Cash on Delivery** and **Cash on Pickup**.
- Mobile-first administration.
- Android-first responsive experience, also supporting tablet and desktop.
- Customer and admin journeys must be functional, not static mockups.
- Living Markdown project documentation and a changelog updated at stage approvals/completions and material approved changes.
- Independent Goldfish QA throughout Stage 5.

### Technology contract

- HTML5
- CSS3
- Vanilla JavaScript using ES modules
- Vite for development and production builds
- IndexedDB for appropriate local persistence/cache
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Cloud Functions or an equivalent trusted server-side Firebase execution path
- Firestore Security Rules and Storage Security Rules

No framework substitution or architectural migration is included in this approval. Any proposed change must be explained and approved before adoption.

### Explicit exclusions

Unless separately approved, do not implement:
- Multi-vendor or multi-restaurant marketplace features.
- Reuse or migration of abandoned prior QuickBite code.
- Fake reviews, ratings, discounts, sales, stock, delivery estimates or live GPS.
- Frontend-authoritative prices or order totals.
- Unconfigured payment gateways or social login providers.
- Paid service activation, production deployment or irreversible production changes.
- A driver application or courier dispatch platform.

---

## 3. Core requirement register — QB-001 to QB-022

| ID | Mandatory requirement | Acceptance evidence |
|---|---|---|
| QB-001 | Single-restaurant product only | No marketplace/vendor workflows or multi-restaurant discovery. |
| QB-002 | $5,000-quality commercial benchmark | Coherent premium design, robust flows, reliable data handling and documented QA; no claim based on appearance alone. |
| QB-003 | Supplied 12-screen reference is authoritative | All 12 screens implemented and visually compared against reference at defined viewport sizes. |
| QB-004 | Premium food photography | Consistent, high-quality, correctly cropped product/category/banner assets with fallbacks. |
| QB-005 | HTML5 and CSS3 | Semantic, maintainable HTML/CSS; responsive and accessible structures. |
| QB-006 | Vanilla JavaScript ES modules | Modular native JavaScript; no unapproved frontend framework. |
| QB-007 | Vite | Reproducible development/build configuration and successful production build. |
| QB-008 | IndexedDB | Local persistence/cache with explicit ownership, schema/versioning and failure handling. |
| QB-009 | Firebase backend | Auth, Firestore, Storage, trusted backend operations and security rules configured for approved environment. |
| QB-010 | Guest checkout | Guest can complete an order without creating an account. |
| QB-011 | Registered customers | Sign-up/sign-in and customer-specific order access work securely. |
| QB-012 | Delivery and pickup | Both fulfilment modes have correct fields, validation, fees/rules and order snapshots. |
| QB-013 | COD and Cash on Pickup | These are the only initially operational payment methods. |
| QB-014 | Admin functionality | Authorized admin can manage menu and orders through protected workflows. |
| QB-015 | Android-first | Core customer and admin journeys work on Android mobile, including keyboard and safe-area behavior. |
| QB-016 | Responsive tablet/desktop | Layouts remain usable at tablet and desktop widths. |
| QB-017 | Independent Goldfish | Goldfish inspects evidence independently and does not modify implementation. |
| QB-018 | Mandatory five-stage workflow | No implementation before explicit Stage 4 approval; stage gates documented. |
| QB-019 | Data integrity | Server-side validation, immutable order snapshots, idempotency and safe state transitions. |
| QB-020 | Security | Least privilege, backend authorization, protected guest access, validated uploads and safe diagnostics. |
| QB-021 | Living Markdown documentation | Architecture, decisions, security, data, QA and workflow documents remain current. |
| QB-022 | Changelog | Material approved changes and stage outcomes are dated and recorded. |

---

## 4. Improvement contracts — IMP-01 to IMP-14

All 14 Critical Reviewer improvements are incorporated as mandatory implementation contracts.

| ID | Required improvement | Required implementation / acceptance |
|---|---|---|
| IMP-01 | Measurable visual specifications | Create per-screen measurement sheets from the supplied montage: section order, normalized X/Y/W/H, margins, typography, image crop, radii, controls and navigation. Do not invent original CSS values. |
| IMP-02 | Controlled photography pipeline | Use approved asset set, responsive variants, stable aspect ratios, lazy loading, placeholders and fallbacks. Same product imagery must remain consistent across screens. |
| IMP-03 | Order pricing and idempotency | Trusted backend recalculates all totals from current product data using integer paisa. Persist immutable item/price snapshots. Idempotency key prevents duplicate orders. |
| IMP-04 | Secure guest access lifecycle | Guest order access uses high-entropy credentials, server verification, expiry/revocation, rate limiting and secure recovery. Order number alone never grants access. |
| IMP-05 | Role/permission matrix | Define and enforce customer, guest, staff and admin permissions in trusted backend and Firebase rules. UI hiding is not authorization. |
| IMP-06 | Checkout failure/retry/recovery | Show actionable validation, network, price-change and submission errors. Retry must reuse idempotency key and must not duplicate orders. |
| IMP-07 | Admin audit/destructive protection | Confirm destructive actions, validate sensitive edits, record sensitive admin changes and protect order transitions. |
| IMP-08 | Secure image upload | Validate file type, size and dimensions; enforce authenticated role/storage path rules; show preview, progress, failure and retry; prevent unsafe public writes. |
| IMP-09 | Accessibility | Semantic labels, sufficient contrast, keyboard/focus support, accessible control names, usable touch targets and screen-reader structure. |
| IMP-10 | Price change/reconfirmation | If server-calculated price differs from displayed checkout price, do not silently submit. Return revised total and require explicit customer reconfirmation. |
| IMP-11 | Backup/recovery | Document Firestore backup/export and restoration, access controls, retention and recovery limits. Verify restore procedure in a safe test environment. |
| IMP-12 | Monitoring/safe diagnostics | Capture actionable operational failures without logging passwords, guest credentials, tokens or unnecessary personal data. |
| IMP-13 | Firestore indexes/query contracts | Document indexes from actual screens and queries; deploy required indexes and verify queries against realistic safe test data. |
| IMP-14 | Reporting definitions | Define timezone/date boundaries, included order statuses, treatment of cancelled/unpaid orders, refunds/discounts/fees and gross/net sales before displaying metrics. |

---

## 5. Twelve screen contracts

The reference montage is the visual authority. Baseline comparison viewport is **390 × 844 CSS px**. Also inspect 320, 360, 430, 768, 1024 and 1440 CSS px. Original source CSS/measurements are unavailable; the team must measure the supplied image rather than claim access to original design tokens.

### QB-S01 — Welcome
- QuickBite brand and logo treatment.
- Premium burger hero image.
- Tagline and clear hierarchy.
- Get Started, Sign In and Continue as Guest actions.
- All actions navigate to real flows; no decorative dead buttons.

### QB-S02 — Sign In
- Email and password.
- Remember-me behavior only if implemented safely.
- Forgot-password recovery.
- Sign-up navigation.
- Social sign-in only if a provider is configured, secured and approved; otherwise omit rather than fake it.
- Clear validation, loading, error and success feedback.

### QB-S03 — Create Account
- Full name, email, phone and password fields as approved.
- Validation, password handling and duplicate-account feedback.
- Successful registration leads to a usable authenticated state.
- Registration remains optional for checkout.

### QB-S04 — Home
- Header/brand and cart entry.
- Promotional banner only for genuine configured promotion.
- Search.
- Categories.
- Popular items from real menu data.
- Secondary banner only if real content exists.
- Bottom navigation with working destinations.
- Empty/loading/error states.

### QB-S05 — Menu
- Page title and search.
- Category chips/filter.
- Two-column product grid at suitable mobile widths.
- Real product image, name and price.
- Availability state.
- Add control with feedback and quantity/cart consistency.
- No invented products or prices.

### QB-S06 — Product Details
- Product hero image and back navigation.
- Favourite control only if persisted and functional.
- Name, description and price from current product data.
- Rating/review display only when genuine data and moderation model exist; otherwise omit.
- Customization options validated against product configuration.
- Quantity control and correct calculated total.
- Add-to-cart feedback.

### QB-S07 — Cart
- Product rows, image, selected options and quantities.
- Edit/remove controls.
- Subtotal, delivery fee where applicable and total.
- Persisted cart behavior.
- Clear empty-cart state.
- No final price authority on client.

### QB-S08 — Checkout
- Delivery or pickup selection.
- Address/contact fields appropriate to delivery; pickup instructions where configured.
- COD for delivery and Cash on Pickup for pickup.
- Order notes with length/validation limits.
- Server-calculated order summary.
- Price-change reconfirmation.
- Place Order with loading, duplicate-tap protection, error recovery and success confirmation.

### QB-S09 — Order Tracking
- Real order status and status history timeline.
- Actual timestamps.
- Map/ETA only if a genuine location/ETA service is configured and approved. Otherwise provide clear status progress without simulated live tracking.
- Secure guest or authenticated access.
- Refresh/retry and unavailable states.

### QB-S10 — My Orders
- All / Completed / Cancelled filters, with status definitions agreed.
- Order cards with product image, order ID, total, status and date.
- Authenticated customer sees only own orders.
- Guest order access uses secure recovery/access mechanism.
- Empty/loading/error states.

### QB-S11 — Admin Dashboard
- Mobile-friendly admin layout/navigation.
- Real order and sales metrics only.
- Chart derived from documented reporting definitions.
- Recent orders.
- Role-protected access and loading/empty/error states.
- No fabricated sample metrics in production.

### QB-S12 — Manage Menu
- Items and Categories views.
- Product images, names, prices and availability.
- Add/edit/archive workflows with validation.
- Secure image upload pipeline.
- Confirm destructive actions.
- Admin-only permission enforced server-side.
- Changes reflected consistently in customer menu after successful persistence.

### Shared screen quality requirements
Every screen must include appropriate loading, empty, validation, failure and success feedback. Controls must have clear pressed/disabled states. Navigation must not strand users. Avoid horizontal overflow, clipped content, image distortion, inaccessible overlays and keyboard-obscured inputs.

---

## 6. Design system and visual fidelity contract

### Proposed calibration tokens

These are starting points for visual calibration, **not measurements extracted from the original image**.

| Token | Proposed value |
|---|---|
| Main background | `#100B08` |
| Secondary background | `#18110D` |
| Elevated card | `#211710` |
| Input surface | `#261B14` |
| Accent | `#FF981F` |
| Accent highlight | `#FFB34D` |
| Deep accent | `#C96813` |
| Primary text | `#FFF8F0` |
| Secondary text | `#B9AAA0` |
| Muted text | `#82746A` |
| Border | `#493326` |
| Success | `#42C77A` |
| Error | `#F06A61` |

Typography proposal: Plus Jakarta Sans for display/headings and Inter for supporting/data text, subject to asset availability and visual comparison. Spacing calibration scale: 4, 8, 12, 16, 20, 24, 32, 40 and 48 px.

### Visual acceptance
- Reconstruct each reference screen individually; do not merely apply matching colors to a generic layout.
- Capture implementation screenshots at the reference baseline and responsive widths.
- Compare structure, dimensions, alignment, typography, image crop, density, hierarchy, controls and navigation.
- Record visible deviations and fix them before sign-off.
- Food photography must be high quality, consistent, correctly cropped and optimized. No emoji substitutes, stretched images, watermarks or random unrelated imagery.
- Same product uses consistent imagery across Home, Menu, Details and Cart.
- Use stable aspect ratios, responsive image sizes, modern formats where supported, lazy loading and meaningful fallback states.

Proposed asset organization:
`public/assets/{brand,food,categories,banners,icons}/`

Proposed source image targets (subject to actual crop needs): hero 1200×1000, banners 1400×650, category tiles 500×500, product images 800×800.

---

## 7. Proposed repository/file manifest

This is the approved target structure proposal. Existing project files must be inspected before creating or replacing anything. Preserve existing user work unless the user explicitly authorizes a change. No repository/source files have yet been inspected in this Stage 4 document.

```text
quickbite/
├── public/
│   └── assets/
│       ├── brand/
│       ├── food/
│       ├── categories/
│       ├── banners/
│       └── icons/
├── src/
│   ├── app/
│   │   ├── bootstrap.js
│   │   ├── router.js
│   │   └── state.js
│   ├── components/
│   │   ├── buttons/
│   │   ├── cards/
│   │   ├── forms/
│   │   ├── navigation/
│   │   ├── feedback/
│   │   └── overlays/
│   ├── features/
│   │   ├── onboarding/
│   │   ├── authentication/
│   │   ├── home/
│   │   ├── menu/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── tracking/
│   │   └── admin/
│   ├── services/
│   │   ├── firebase/
│   │   ├── auth/
│   │   ├── catalog/
│   │   ├── orders/
│   │   ├── storage/
│   │   └── reporting/
│   ├── database/
│   │   ├── indexeddb.js
│   │   ├── schema.js
│   │   └── migrations/
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── reset.css
│   │   ├── global.css
│   │   ├── components/
│   │   └── screens/
│   └── utils/
├── functions/
│   └── src/
├── firebase/
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   └── storage.rules
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── security/
│   └── visual/
├── docs/
│   ├── PROJECT_BRIEF.md
│   ├── ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   ├── SECURITY.md
│   ├── REFERENCE_DESIGN_SPEC.md
│   ├── QA_GOLDFISH.md
│   ├── DECISIONS_AND_OPEN_QUESTIONS.md
│   ├── WORKFLOW_AND_APPROVALS.md
│   ├── CHANGELOG.md
│   └── STAGE_4_IMPLEMENTATION_AUTHORIZATION.md
├── index.html
├── package.json
├── vite.config.js
└── firebase.json
```

### File ownership and change rules
- `src/features/` owns feature-specific screen behavior.
- `src/components/` contains reusable presentation and interaction components, not business authority.
- `src/services/` isolates Firebase and backend interactions.
- `src/database/` owns IndexedDB schema, migrations and cache operations.
- `functions/` owns trusted operations including authoritative order validation/calculation and guest access verification.
- `firebase/` contains rules and index definitions.
- `tests/` contains automated checks and fixtures using safe test data.
- `docs/` is maintained as part of delivery.
- Firebase secrets/private service credentials must never be committed to frontend source or public repository.
- The exact manifest may be adjusted only to fit an inspected existing project architecture without reducing any approved requirement. Material architecture changes require user approval.

---

## 8. Data model and backend contracts

### Proposed Firestore structure

```text
restaurants/{restaurantId}
  settings
  categories/{categoryId}
  products/{productId}
  promotions/{promotionId}

users/{userId}
orders/{orderId}
  statusHistory/{historyId}
guestOrderAccess/{accessId}
staff/{staffId}
```

The restaurant document is a configuration boundary for one restaurant, not a multi-vendor tenancy system.

### Product record contract

Minimum fields:
- `name`
- `description`
- `categoryId`
- `basePricePaisa` — integer
- `imageUrl` and/or `imageVariants`
- `available`
- `customizationGroups`
- `featured`
- `sortOrder`
- `archived`
- `createdAt`
- `updatedAt`

Validation must reject invalid prices, malformed customization data, missing required fields and unauthorized writes.

### Order record contract

Minimum logical fields:
- Order ID and creation timestamp.
- Customer identity or guest-order reference (never store plaintext access credential).
- Fulfilment type: delivery or pickup.
- Payment method: COD or Cash on Pickup.
- Payment state and order state.
- Contact details and delivery address only when required.
- Customer notes subject to limits.
- Immutable item snapshots.
- Subtotal, delivery fee, discount, tax/service charges if later approved, and total — all integer paisa.
- Status timestamps/history.
- Idempotency reference or protected deduplication record.

Each item snapshot must preserve product ID, name, image reference, base price, selected options and their prices, quantity, final unit price and line total at order time. Later product edits must not rewrite historical order values.

### Trusted order creation contract

1. Client sends cart identifiers/selections, fulfilment details and a unique idempotency key.
2. Trusted backend authenticates customer or validates guest flow.
3. Backend loads current product/settings data.
4. Backend validates availability, option selections, quantity limits, fulfilment and payment method.
5. Backend calculates every amount using integer paisa; client totals are informational only.
6. Backend applies only configured and approved fees, taxes and discounts.
7. If authoritative total differs from the amount shown to the customer, return a price-change response; require explicit reconfirmation before creating the order.
8. Backend creates immutable order and initial status-history entry atomically where supported.
9. Repeated submission with the same idempotency key returns the existing result and never creates a duplicate.
10. Client displays success only after receiving confirmed backend result.

### Proposed order lifecycle

`Pending → Confirmed → Preparing → Ready → Completed`

Cancellation and refund transitions must be explicitly defined before implementation of cancellation/refund actions. Invalid transitions must be rejected server-side and recorded.

### IndexedDB contract
- Cache only data suitable for local persistence (e.g., catalog cache and cart).
- Version schema and provide safe migrations.
- Handle quota, corruption, unavailable storage and transaction failures.
- Do not treat local cart or locally queued submission as a confirmed order.
- Never store plaintext passwords, auth tokens or guest order credentials in IndexedDB.
- Define cache invalidation and stale-data indicators.
- Online server remains authoritative for price, availability, order status and permissions.

---

## 9. Security rules and access-control contract

Security is a release blocker. Frontend checks and hidden buttons do not provide authorization.

### Authentication and identity
- Use Firebase Authentication for registered accounts.
- Guest ordering must not require account creation.
- Enforce secure password/reset flows through Firebase-supported mechanisms.
- Do not expose secrets, service-account keys or privileged credentials in browser code.
- Avoid collecting unnecessary personal information.

### Role model
- **Guest:** browse public menu; submit guest order through trusted flow; access only the specific order through secure guest credential verification.
- **Customer:** browse, order and read only their own orders; cannot alter authoritative prices, status, payment state or another user's data.
- **Staff:** only explicitly assigned operational permissions; cannot grant roles, change protected settings or access unrestricted customer data.
- **Admin:** authorized menu/category/order/staff/settings/report operations within approved scope; privileged changes are authenticated, validated and audited.

Role assignment and privileged actions must be enforced by trusted backend and Firebase rules. A user must not be able to self-promote by editing a client-side profile field.

### Firestore rules
- Default deny; explicitly allow only required reads/writes.
- Public reads limited to approved public restaurant/menu data.
- Client writes to authoritative orders, order status, prices, roles and financial fields are denied unless a narrowly scoped trusted path is used.
- Customer reads are owner-scoped.
- Guest access is not granted merely by knowing an order ID.
- Validate immutable fields and permitted state transitions server-side.
- Prevent cross-user and cross-role access.
- Test rules with positive and negative cases.

### Storage rules
- Require authenticated authorized role for admin uploads.
- Restrict allowed content types and file sizes.
- Restrict paths to approved restaurant/menu asset locations.
- Prevent unauthorized overwrite/delete.
- Do not trust file extensions alone; validate content and metadata through approved pipeline.
- Avoid exposing private customer uploads publicly.

### Guest order access
- Generate cryptographically strong, high-entropy access secret.
- Store only a secure verifier/hash where applicable; never plaintext credential.
- Verify on trusted backend.
- Rate-limit attempts and avoid revealing whether an order/credential exists.
- Define expiry, revocation and recovery policy before release.
- Order number alone is never a secret and never grants access.

### Application and operational security
- Validate and normalize all user input on trusted boundary.
- Escape/render untrusted text safely; avoid unsafe HTML injection.
- Apply abuse/rate controls to authentication, guest access and order submission.
- Use HTTPS in deployment.
- Do not log passwords, tokens, guest credentials, payment secrets or unnecessary personal data.
- Admin destructive actions require confirmation and audit record.
- Production credentials/data must not be used for development tests without explicit approval.

---

## 10. Goldfish independent QA acceptance contract

Goldfish must inspect actual implementation evidence, not Developer assurances.

### Persona journeys

| Persona | Required journey |
|---|---|
| First-time visitor | Understand restaurant offering, browse menu and identify how to order. |
| Guest customer | Browse, customize, add to cart, choose pickup/delivery, submit and securely retrieve order without registration. |
| Registered customer | Register/sign in, order, view own order history and track status. |
| Returning customer | Recover session safely, revisit menu/cart as designed, place another order and access prior orders. |
| Restaurant administrator | Securely sign in, review dashboard, manage products/categories/images and oversee orders. |
| Restaurant staff | Access only assigned operational tasks and perform permitted order updates. |
| Beginner | Complete core ordering without needing technical knowledge; errors and next steps are understandable. |
| Android mobile user | Complete all relevant flows with touch, virtual keyboard, safe areas, back navigation and variable network conditions. |

### Required QA domains
1. Every screen and navigation path.
2. Guest and registered checkout.
3. Delivery/pickup and payment-method validation.
4. Price calculation, price change and reconfirmation.
5. Duplicate taps, retry and idempotency.
6. Order status transition and history integrity.
7. Customer/guest/staff/admin access isolation.
8. Firestore and Storage rules.
9. Image upload validation and failure recovery.
10. IndexedDB persistence, migration and failure handling.
11. Offline/stale-data behavior.
12. Responsive layout and visual reference comparison.
13. Accessibility and keyboard behavior.
14. Admin destructive-action safety and audit trail.
15. Reporting definitions and calculations.
16. Backup/restore evidence and monitoring privacy.

### Goldfish rules
- Do not edit source, production data or Firebase records.
- Use safe test accounts and test data.
- Report exact reproduction steps and evidence.
- Do not label source inspection as interaction testing.
- If browser or device interaction is unavailable, mark the test `NOT TESTABLE` or `VERIFIED BY SOURCE` as appropriate and state what remains outstanding.
- Return defects to Developer; independently retest after correction.

### Required final verification matrix

| Requirement ID | Result | Evidence |
|---|---|---|
| QB/IMP/Screen requirement ID | Implemented and verified / Implemented but not verified / Not implemented | Source path, test ID, screenshot or interaction evidence |

The final report must also contain:
- Critical defects.
- High-priority defects.
- Medium/low improvements.
- Persona-by-persona results.
- UI/UX review.
- Security and data-integrity concerns.
- Untested areas and reason.
- Retest results for corrected defects.

No completion declaration while approved requirements remain unimplemented or Critical defects remain unresolved.

---

## 11. Testing and verification plan

### A. Static/source checks
- Project structure and dependency review.
- JavaScript syntax and module import checks.
- HTML/CSS validation where tooling is available.
- Production Vite build.
- No secrets or privileged credentials in public bundles/repository.
- No unapproved dependencies or frameworks.
- Review error handling and unsafe rendering patterns.

### B. Unit tests
- Currency/paisa arithmetic and rounding.
- Product/customization validation.
- Cart quantity and line totals.
- Delivery/pickup eligibility and fee calculation.
- Order status transition rules.
- Date/time and reporting boundaries.
- IndexedDB schema/migration behavior.
- Input validation and normalization.

### C. Integration tests
- Authentication and account recovery.
- Catalog reads and admin writes.
- Guest order creation and retrieval.
- Registered order creation and owner-only reads.
- Trusted order calculation and immutable snapshots.
- Idempotent duplicate submission.
- Price-change/reconfirmation flow.
- Status history and role-specific actions.
- Storage upload and access restrictions.

### D. Security tests
- Unauthenticated access attempts.
- Customer A attempting to read Customer B order.
- Guest guessing/using order ID without credential.
- Staff attempting admin-only action.
- Customer attempting price/status/role manipulation.
- Direct Firestore writes bypassing UI.
- Invalid/oversized/mislabelled uploads.
- Repeated guest access and order submission attempts.
- XSS/injection and malformed input tests.
- Secret leakage and sensitive log review.

### E. Visual and responsive tests
- Reference comparison at 390×844 baseline.
- Additional widths: 320, 360, 430, 768, 1024 and 1440 CSS px.
- Check section geometry, spacing, typography, imagery, crops, contrast, hierarchy, controls and navigation.
- Check portrait orientation, browser chrome, safe areas and virtual keyboard.
- Record screenshots and deviations; do not claim pixel-perfect without comparison evidence.

### F. Functional end-to-end tests
- Guest delivery COD order.
- Guest pickup Cash on Pickup order.
- Registered customer order and order history.
- Product customization and cart edits.
- Price changes between cart and checkout.
- Network interruption during submission and safe retry.
- Duplicate tap/submission.
- Admin creates/edits/archives product.
- Admin uploads valid and invalid images.
- Staff permitted and forbidden actions.
- Customer/guest order tracking access.

### G. Offline and resilience tests
- Cached menu browsing while offline.
- Cart persistence across reload/restart.
- Stale catalog indication and refresh.
- IndexedDB unavailable/quota error.
- Network failure during checkout.
- Firebase permission-denied and service failure feedback.
- Never show a pending local action as a confirmed order.

### H. Backup/recovery and release checks
- Document export/backup procedure.
- Restore into isolated safe test environment.
- Verify restored data and permissions.
- Confirm monitoring avoids sensitive information.
- Confirm all approved requirements mapped to evidence.
- Confirm no unresolved Critical defect.
- User approval required for production deployment and irreversible operations.

### Test honesty
A test is not passed merely because code exists. If no browser/device environment is available, Goldfish must clearly identify source-verified behavior and interaction tests still outstanding. Never invent test counts, screenshots, test accounts or results.

---

## 12. Implementation phases after approval

Implementation must be incremental. Each phase requires Developer evidence, Goldfish inspection, defect correction and retesting before moving on where dependencies permit.

| Phase | Scope | Required exit evidence |
|---|---|---|
| P0 | Inspect uploaded/current project files, confirm repo state, dependencies and preserve existing work | Architecture/file inventory and any required plan adjustment submitted; no destructive changes. |
| P1 | Vite foundation, app bootstrap, design tokens, shared shell | Build succeeds; responsive foundation and design token evidence. |
| P2 | Shared components, navigation and feedback states | Reusable controls, routing/navigation and accessibility baseline verified. |
| P3 | Welcome, sign-in, registration and guest entry | All onboarding/auth journeys and errors work. |
| P4 | Home, categories, search and menu | Real catalog rendering, responsive layout and image pipeline. |
| P5 | Product details, customization and cart | Cart calculations, persistence and interactions verified. |
| P6 | Firebase setup, auth, data contracts, rules and indexes | Safe environment, rules tests, role checks and data validation. |
| P7 | Checkout, trusted pricing, guest access and order creation | COD/pickup, price reconfirmation, idempotency and snapshots verified. |
| P8 | My Orders and tracking | Secure access, status timeline and history verified. |
| P9 | Admin dashboard, order operations and menu management | Role protection, audit, upload and destructive-action checks. |
| P10 | Offline, responsive, accessibility, reporting and recovery | Resilience, calculations, backup/restore and viewport evidence. |
| P11 | Full Goldfish regression and release readiness | Complete requirement matrix, defect report, retests and unresolved-test disclosure. |

Phase ordering may be adjusted only to resolve dependencies without dropping requirements. Scope changes require approval.

---

## 13. Acceptance criteria and release blockers

The project can be proposed as complete only when all of the following are true:

- All QB-001–QB-022 requirements are implemented.
- All IMP-01–IMP-14 improvements are implemented.
- All 12 screen contracts are implemented and visually reviewed.
- Customer, guest, staff and admin permissions are enforced by trusted backend/rules.
- Guest checkout works without registration and guest order access is secure.
- Server-side order pricing and immutable snapshots are correct.
- Idempotency prevents duplicate orders.
- Price changes require reconfirmation.
- Pickup and delivery workflows work.
- COD and Cash on Pickup are correctly enforced.
- IndexedDB persistence and offline behavior are honest and safe.
- Image pipeline meets quality and security requirements.
- Responsive and accessibility checks are completed.
- Backup/recovery and monitoring documentation exists and is tested to the available extent.
- Reporting calculations are documented and verified.
- Markdown documentation and changelog are current.
- Goldfish provides independent evidence-based verification.
- No Critical defect remains unresolved.
- Every untested area is disclosed.
- Production deployment or paid activation has separate explicit user authorization.

A visually polished screen cannot compensate for broken ordering, insecure data access or incorrect totals.

---

## 14. Unresolved business decisions — user input required

These decisions must not be guessed, fabricated or silently hard-coded. They must be resolved before the dependent feature is finalized. Safe placeholders or disabled states may be used during development only if clearly identified and never misrepresented as live functionality.

| ID | Decision required | Why it matters | Safe default until confirmed |
|---|---|---|---|
| DEC-01 | Official restaurant name and approved logo | Brand identity, welcome/header/receipt assets | Use QuickBite project branding only; do not invent restaurant identity. |
| DEC-02 | Opening hours and closed days | Ordering eligibility and customer messaging | No invented hours; clearly show “hours not configured” in admin/dev state. |
| DEC-03 | Delivery coverage/areas | Address validation and order eligibility | Do not claim delivery everywhere; delivery eligibility requires configuration. |
| DEC-04 | Delivery fee and calculation rules | Correct checkout total | No fabricated fee; require configured rule before enabling delivery checkout. |
| DEC-05 | Minimum order | Cart validation | No assumed minimum. |
| DEC-06 | Taxes/service charges and inclusion policy | Financial correctness and displayed total | No assumed tax/charge; show only explicitly configured values. |
| DEC-07 | Cancellation/refund policy and permitted statuses | Order lifecycle and customer expectations | Do not expose unapproved cancellation/refund promises or actions. |
| DEC-08 | Guest credential expiry and recovery policy | Secure order retrieval lifecycle | Secure high-entropy credential; expiry/recovery must be set before production. |
| DEC-09 | Pickup instructions and collection process | Pickup UX and readiness state | No invented collection location/process. |
| DEC-10 | Genuine ratings/reviews and moderation | Whether rating UI can be shown | Omit ratings/reviews until genuine data and moderation exist. |
| DEC-11 | Promotion/discount rules | Banner and pricing integrity | No fake promotions; no discount without approved rule and backend calculation. |
| DEC-12 | Live driver tracking/ETA integration | Tracking screen capability | Show actual status timeline only; no simulated live map/ETA. |
| DEC-13 | Firebase project, environment and region | Backend deployment and data residency | Use a safe development project only after user provides/approves it. |
| DEC-14 | Hosting provider and domain | Deployment configuration | No production deployment until selected and separately approved. |
| DEC-15 | Future payment methods: hide or disabled “Coming Soon” | Avoid misleading payment options | Only COD and Cash on Pickup operational; omit other methods unless user chooses otherwise. |

Additional operational inputs may be required during implementation (e.g., restaurant contact details, admin/staff identities and product catalog), but they must be requested only when needed and must not be fabricated.

---

## 15. Risks and controls

| Risk | Impact | Required control |
|---|---|---|
| Original reference lacks source measurements | Visual mismatch | Measure supplied montage and retain comparison evidence. |
| Restaurant operating rules not yet supplied | Incorrect availability/fees | Keep dependent features unconfigured until user decides. |
| Frontend manipulates prices | Financial loss | Trusted backend recalculation and server-authoritative records. |
| Duplicate checkout retries | Duplicate orders | Idempotency key and atomic trusted operation. |
| Guest order enumeration | Privacy breach | High-entropy credential, verification, rate limits and non-disclosing errors. |
| Weak Firestore/Storage rules | Unauthorized access/data modification | Default-deny rules and negative security tests. |
| Poor image assets | Low perceived quality/slow app | Controlled optimized asset pipeline and fallbacks. |
| Android keyboard/safe-area issues | Checkout failure | Real Android viewport and interaction tests. |
| Offline state misrepresented | Customer believes order was placed | Explicit pending/error state; only backend confirmation means order exists. |
| Reporting ambiguity | Incorrect business decisions | Written calculation definitions and test fixtures. |
| Backup not restorable | Data loss | Documented isolated restore test. |
| No browser/device access | Incomplete interaction evidence | Mark NOT TESTABLE; do not claim pass. |

---

## 16. Stage 4 approval checklist

The user is asked to approve the complete specification, not an informal summary.

- [ ] QB-001 to QB-022 accepted.
- [ ] IMP-01 to IMP-14 accepted.
- [ ] All 12 screen contracts accepted.
- [ ] Proposed technology and architecture accepted.
- [ ] Proposed file/module manifest accepted subject to initial repository inspection.
- [ ] Data model and order integrity contracts accepted.
- [ ] Security and role/permission contracts accepted.
- [ ] Goldfish independence and evidence requirements accepted.
- [ ] Testing and acceptance plan accepted.
- [ ] Implementation phases accepted.
- [ ] Unresolved business decisions acknowledged as unresolved and not to be invented.
- [ ] Explicit authorization to begin Stage 5 given.

### Approval status

**CURRENT STATUS: PENDING — NOT APPROVED**

No Stage 5 implementation is permitted until the user provides the explicit authorization phrase:

> **APPROVED — BEGIN STAGE 5 IMPLEMENTATION**

If the user rejects or changes any part, revise this document and resubmit it for approval. This approval does not authorize production deployment, paid services, irreversible data changes or use of production customer data; those require separate explicit authorization.

---

## 17. Stage 4 changelog entry

**2026-11-03 — Stage 4 final authorization specification prepared**
- Consolidated QB-001–QB-022.
- Incorporated IMP-01–IMP-14.
- Defined all 12 screen contracts.
- Added file/module manifest, data/backend contracts and security rules.
- Defined Goldfish persona journeys, evidence labels and final verification matrix.
- Added testing plan, implementation phases, acceptance criteria, risks and unresolved business decisions.
- Status remains **PENDING USER APPROVAL**.
- Stage 5 remains **NOT AUTHORIZED**.

## Approval record

**2026-11-03 — APPROVED BY USER**

The user explicitly authorized Stage 5 with the exact phrase `APPROVED — BEGIN STAGE 5 IMPLEMENTATION`. This authorization applies to the approved scope in this document. Production deployment, paid services, irreversible production data changes and use of production customer data still require separate explicit authorization.


## 2026-11-03 — User clarification: current approval is UI testing only

The user clarified the scope of the current approval with: **“Just ui testing”.**

This clarification governs the current work and must be read together with the historical approval record above. For the current authorization:

### Authorized
- UI-only demo and walkthrough work within the previously defined UI Testing Milestone.
- Visual refinement and comparison against the approved 12-screen reference.
- Frontend-only navigation and local demo interactions needed to exercise the UI.
- Safe demo fixtures clearly labelled as demo data and stored locally only.
- Source-level, automated UI tests and browser/device UI testing where tools are available.
- Goldfish independent UI/UX inspection and reporting.

### Explicitly not authorized by this clarification
- Firebase Authentication, Firestore, Storage or Cloud Functions integration or changes.
- Firebase Security Rules, production database or Firebase project changes.
- Real order submission, live guest-order credentials, production catalogue or customer records.
- Payment processing, live delivery/pickup configuration, real fees/taxes or operational restaurant settings.
- Production deployment, domain/hosting changes, paid service activation or irreversible data changes.
- Expansion beyond the existing UI Testing Milestone without separate approval.

### Data and behavior boundaries
- Demo catalogues, orders, users, metrics and admin edits must be visibly identified as simulated.
- Demo data remains local to the browser and must never be represented as real restaurant data.
- Checkout/order placement remains a non-production preview; no real order may be created.
- No secrets, credentials or production customer data may be introduced.

### Authorization interpretation
This is a scope clarification, not a new authorization for backend or production implementation. The historical broad Stage 5 approval remains in the record, but the **current active work authorization is limited to UI testing only**. Any expansion requires a new explicit user approval before work begins.
