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


## Follow-up inspection — modular catalogue and cart phase

### GF-S5-008 — Cart and order history separation
- **Severity:** Low (design safeguard verified)
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** The header Cart button opens the cart preview. The Orders navigation item no longer opens the cart and instead explains that order history is not implemented.
- **Goldfish assessment:** This corrects the earlier conceptual collision between basket and placed orders. Real order history remains NOT IMPLEMENTED.

### GF-S5-009 — Combined catalogue filtering and native category controls
- **Severity:** Low (source-level improvement verified)
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** Search and category state are applied together by one filtering function. Category chips are native buttons and expose `aria-pressed` state.
- **Limitation:** Actual keyboard/screen-reader behavior has not been tested in a browser.

### GF-S5-010 — Local cart preview is not a production order cart
- **Severity:** High if misrepresented; currently mitigated by explicit preview labeling and disabled checkout
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** Cart lines and quantities persist in IndexedDB, but the catalogue and prices are hardcoded demonstration values. There is no server-side price revalidation, order creation, user ownership or cross-device synchronization.
- **Goldfish assessment:** This is acceptable as an interim UI foundation only. Keep checkout disabled until authoritative restaurant data and trusted backend validation exist.

### GF-S5-011 — Automated build initially failed; corrected and CI-verified
- **Severity:** Resolved implementation defect; retain regression monitoring
- **Evidence:** VERIFIED BY SOURCE (GitHub Actions job steps and logs)
- **Finding:** Initial GitHub Actions build failed because top-level await was unsupported by Vite's configured browser target. Application initialization was changed to an async bootstrap function.
- **Retest:** GitHub Actions run #12 completed successfully; dependency installation and `npm run build` both passed for implementation commit `4ef2a3060c026121d519b4aa8173b0575315d944`.
- **Status:** Corrected and build-verified. This does not constitute browser/device interaction verification.

### Updated persona simulation

| Persona | Current result |
|---|---|
| First-time visitor | Can inspect sample catalogue; restaurant details are not configured |
| Guest customer | Can add/remove sample cart lines locally; checkout unavailable |
| Registered customer | Sign-in/account journeys not implemented |
| Returning customer | Local cart persistence is designed; reload behavior not interaction-tested |
| Restaurant administrator | Admin interface not implemented |
| Restaurant staff | Staff queue not implemented |
| Beginner | Preview labels and empty/notice feedback exist in source; usability not interaction-tested |
| Android user | Responsive/safe-area CSS exists; real device test NOT TESTABLE |

Goldfish did not modify source files, Firebase, production data or repository implementation.


## Follow-up inspection — product customization phase

### GF-S5-012 — Product options are demo configuration, not authoritative menu data
- **Severity:** High if used for real orders; mitigated while checkout remains disabled
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** Product option groups and price deltas are hardcoded in `demo-options.js` for four sample products. No backend catalogue or server validation exists.
- **Recommendation:** Keep the explicit preview state and disabled checkout. When Firebase/backend work begins, validate product/option IDs, active status, required selections, quantity and current price on the trusted server.

### GF-S5-013 — Required option selection and cart variant separation
- **Severity:** Medium
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** Product dialog preselects one choice in required single-select groups, validates min/max selection counts and stores option snapshots. Cart line keys include product ID plus sorted option IDs, allowing different variants to remain separate.
- **Recommendation:** Test same product/same options merging, same product/different options separation, max selections, missing required options, and quantity/remove controls in a real browser before treating the feature as verified.

### GF-S5-014 — Local cart schema compatibility is source-only
- **Severity:** Medium
- **Evidence:** VERIFIED BY SOURCE; runtime NOT TESTABLE
- **Finding:** Existing local cart rows without option IDs/line keys are normalized when read. Actual IndexedDB upgrade and recovery behavior has not been exercised.
- **Recommendation:** Add browser-level IndexedDB migration tests and test interrupted writes/storage quota failures.

### Goldfish interaction-testing boundary

The product details dialog, keyboard selection, cart variant controls and IndexedDB persistence have not been exercised in a browser. These remain NOT TESTABLE in this environment. A passing Vite build proves bundling only.

### GF-S5-015 — Product options implementation build
- **Severity:** Resolved build verification item
- **Evidence:** VERIFIED BY SOURCE (GitHub Actions run #35)
- **Finding:** The Vite production build passed after the product customization and option-aware cart modules were added.
- **Limit:** No browser-level tests were run. Build success does not prove dialog behavior, form validation, IndexedDB persistence or responsive layout.


## Follow-up inspection — Firebase/security foundation

### GF-S5-016 — Public settings document is an all-fields public read
- **Severity:** High
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** Rules allow public reads of the complete `settings/public` document. Firestore Rules do not provide field-level redaction.
- **Recommendation:** Store only public storefront data in this document. Keep private settings, staff data and credentials in non-public documents or a secret manager. Add a schema test that rejects private keys.

### GF-S5-017 — Catalogue access is active-record gated
- **Severity:** Medium (positive control; verification pending)
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** Public category/product reads require `active == true`; repository queries include that constraint and order by `sortOrder`. Client writes are denied.
- **Recommendation:** Verify query behavior and inactive-document denial in the Firestore Emulator Suite.

### GF-S5-018 — Customer and order ownership rules
- **Severity:** High until emulator-tested
- **Evidence:** VERIFIED BY SOURCE; runtime NOT TESTABLE
- **Finding:** Customer documents are owner/admin-readable; orders are owner-readable by `customerUid` and readable by active staff/admin; client order writes are denied. Guest order retrieval is not exposed through Firestore.
- **Recommendation:** Add emulator tests for cross-user denial, staff-role revocation, list query constraints, guest denial and order event access before any deployment.

### GF-S5-019 — Staff/admin authorization depends on staff documents
- **Severity:** High until emulator-tested
- **Evidence:** VERIFIED BY SOURCE; runtime NOT TESTABLE
- **Finding:** Staff access depends on an active staff document and role. Client writes to staff documents are denied.
- **Recommendation:** Trusted functions must independently authorize every privileged action; Admin SDK bypasses Firestore Rules. Test inactive staff, role changes and unauthorized direct requests.

### GF-S5-020 — Storage upload policy is closed by default
- **Severity:** Low (positive control; verification pending)
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** Menu media is publicly readable and client writes are denied; all other storage paths are denied.
- **Recommendation:** Add emulator tests for public menu reads and denied upload/read of private paths.

### GF-S5-021 — Security rules are not emulator-verified
- **Severity:** High
- **Evidence:** NOT TESTABLE in current session
- **Finding:** Rules and emulator configuration are present, but no rules-unit tests or emulator execution evidence exists.
- **Recommendation:** Before connecting a real Firebase project or enabling any account/order UI, add automated Firestore and Storage rules tests and execute them in CI.

### Goldfish verdict

The security baseline follows a sensible default-deny/trusted-write direction, but it is **not production-approved** until emulator tests prove ownership, staff authorization, public-data boundaries and denial cases. Goldfish has not modified the rules or any Firebase data.


## Follow-up inspection — automated Firestore rules tests added

### GF-S5-022 — Firestore and Storage security tests pass in CI
- **Severity:** Resolved verification item
- **Evidence:** VERIFIED BY INTERACTION (GitHub Actions Emulator execution)
- **Finding:** Emulator-based tests cover public catalogue access, inactive catalogue denial, client write denial, customer/order ownership, guest direct-order denial, active/inactive staff order reads, saved-item ownership, active/inactive option groups, public menu media reads and denied Storage uploads/private reads.
- **Recommendation:** Expand test coverage as new rules and collections are added. Do not treat Emulator success as production deployment approval.
- **Status:** RESOLVED. GitHub Actions run #94 passed all 11 Firestore/Storage Emulator security tests (8 Firestore, 3 Storage); run #102 passed the same suite with the latest application source. Initial dependency and ArrayBuffer assertion defects were corrected.


## Follow-up inspection — live catalogue and currency-aware cart

### GF-S5-023 — Live catalogue is gated by complete Firebase configuration and public settings
- **Severity:** Medium
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** The app uses the sample catalogue only when Firebase is not configured. When configured, it loads public settings, active categories and products; missing/invalid public settings cause a visible load failure rather than silently presenting sample products.
- **Recommendation:** Keep `settings/public` limited to information safe for every visitor. Validate a dedicated non-production Firebase project before production setup.

### GF-S5-024 — Product option groups are checked before a product can be added
- **Severity:** Medium (positive control)
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** Live option groups and choices are loaded from Firestore. Inactive/missing groups, malformed selection types, invalid min/max values and malformed option data mark the affected product unavailable.
- **Recommendation:** Trusted checkout functions must repeat every validation and recalculate totals; browser validation is not a security boundary.

### GF-S5-025 — Local cart prices can become stale
- **Severity:** High if checkout is enabled; currently mitigated because checkout is disabled
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** Cart rows persist price/currency snapshots. Re-adding the same product/variant refreshes its display snapshot, but an old cart line is not automatically re-priced on every cart open.
- **Recommendation:** Before enabling checkout, fetch/revalidate all current products, options, availability and currency through a trusted server operation. Show price changes and require customer acknowledgement where appropriate.

### GF-S5-026 — Currency consistency and rapid cart updates
- **Severity:** Medium (positive control; runtime not yet verified)
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** Catalogue, product options and cart display use configured currency codes. Mixed-currency saved lines do not produce a misleading single-currency subtotal. Cart writes are serialized and quantity adjustments are computed inside the mutation queue.
- **Recommendation:** Add IndexedDB/browser tests for concurrent rapid taps, legacy cart normalization, currency changes and storage failures.

### GF-S5-027 — Emulator test assertion defect was corrected
- **Severity:** Resolved test defect
- **Evidence:** VERIFIED BY INTERACTION (GitHub Actions Emulator execution)
- **Finding:** The first combined run executed all Firestore tests successfully and two Storage tests successfully, but one Storage read assertion failed because `getBytes()` returns an `ArrayBuffer`, not an iterable. The test was corrected to inspect a `Uint8Array`.
- **Retest:** GitHub Actions run #94 and the later latest-source run #102 passed the Vite build and all 11 Firestore/Storage security tests (8 Firestore, 3 Storage).
- **Status:** Corrected and CI-verified for the security rules/test revision.

### GF-S5-028 — Real Firebase data and user interactions remain untested
- **Severity:** High before production release
- **Evidence:** NOT TESTABLE
- **Finding:** No Firebase project credentials are configured in this repository environment. The live repository path is source-reviewed but has not been exercised against real Firestore data. No browser or Android device session was available.
- **Recommendation:** Use a dedicated non-production Firebase project and safe test records, then test catalogue loading, option selection, cart persistence, currency display, network errors and Android viewport/keyboard behavior before enabling real ordering.

### Updated persona simulation

| Persona | Current evidence-based result |
|---|---|
| First-time visitor | Demo menu without Firebase configuration; live menu path is implemented but requires configured Firebase data |
| Guest customer | Can browse and maintain a local cart preview; guest checkout is not implemented |
| Registered customer | Authentication service functions exist; account screens and complete account journeys are outstanding |
| Returning customer | IndexedDB cart persistence is implemented in source; reload behavior is not browser-tested |
| Restaurant administrator | Admin interface and management operations outstanding |
| Restaurant staff | Staff interface and order queue outstanding |
| Beginner | Loading/error/empty states and preview limitations are expressed in source; usability not interaction-tested |
| Android user | Responsive CSS exists; real Android viewport, keyboard and safe-area tests remain NOT TESTABLE |

### Goldfish verdict

The live catalogue integration is a meaningful step beyond the sample-only menu, and the Emulator security suite now passes. The application is still **not a production food-ordering system**: no Firebase project is connected, no account UI or trusted order functions exist, and cart snapshots are not authoritative. Keep checkout disabled. Goldfish did not modify source files, Firebase records or production data.


## Follow-up inspection — customer authentication interface

### GF-S5-029 — Account UI preserves guest browsing when Firebase is not configured
- **Severity:** Low (positive control)
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** Profile navigation opens an account dialog. Without complete Firebase configuration, sign-in and registration controls are disabled and the user is told guest browsing remains available.
- **Recommendation:** Keep guest browsing independent of account availability. Test the configured and unconfigured states in a real browser.

### GF-S5-030 — Firebase Auth account is not yet a Firestore customer profile
- **Severity:** High before profile, saved-items or order-history features rely on it
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** Registration creates a Firebase Authentication user and updates the Auth display name. It does not create a `customers/{uid}` Firestore document; direct client writes to customer documents are denied by rules.
- **Recommendation:** Add trusted customer-profile provisioning and controlled profile update operations. Do not loosen customer Firestore rules to permit arbitrary client writes.

### GF-S5-031 — Sign-in, registration and recovery feedback is present in source
- **Severity:** Medium (runtime verification outstanding)
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** The account dialog includes labelled email/password fields, registration name, minimum password length, sign-in, sign-out, password reset, pending feedback and mapped common Auth errors.
- **Recommendation:** Test duplicate email, invalid credentials, weak password, disabled account, throttling, offline/network failure, password-reset delivery and sign-out state with the Firebase Auth Emulator or a dedicated test project.

### GF-S5-032 — Authentication has not been exercised against Firebase or in a browser
- **Severity:** High before production release
- **Evidence:** NOT TESTABLE
- **Finding:** No Firebase project configuration is present and no browser/device interaction environment was available. Source inspection and Vite CI cannot prove real account creation, sign-in persistence or password reset delivery.
- **Recommendation:** Add Auth Emulator integration tests and real browser tests using synthetic test accounts before marking QB-REQ-009 complete.
- **CI evidence:** GitHub Actions run #123 passed dependency installation, Vite build and all 11 Firestore/Storage Emulator tests. This verifies compilation and existing data rules only; it does not test Firebase Auth or account form interactions.

### Updated persona simulation

| Persona | Current evidence-based result |
|---|---|
| First-time visitor | Can browse demo menu; live catalogue requires configured Firebase |
| Guest customer | Guest browsing and local cart preview remain available; guest checkout outstanding |
| Registered customer | Sign-in/register/reset UI and Auth service calls are implemented; Firebase connection and runtime tests outstanding |
| Returning customer | Auth state observer and local cart persistence exist in source; session persistence not interaction-tested |
| Restaurant administrator | Admin interface and role-specific operations outstanding |
| Restaurant staff | Staff interface and order queue outstanding |
| Beginner | Account forms have labels, hints and feedback in source; usability not interaction-tested |
| Android user | Responsive layout source exists; actual device, keyboard and safe-area testing NOT TESTABLE |

### Goldfish verdict

The customer account interface now has a real Firebase Auth integration path and preserves guest access. It is not yet a verified account journey: Firebase is not connected, no Auth Emulator tests exist, and a Firestore customer profile is not provisioned. Do not mark customer accounts complete or rely on Firestore customer records until those gaps are addressed. Goldfish did not modify implementation files or Firebase data.


## Independent inspection — authenticated trusted order creation

### Scope inspected
Goldfish reviewed the actual source for `functions/src/order-service.js`, `functions/src/index.js`, the order unit tests, Firebase Emulator integration tests, Firestore rules and current project documentation. This was source and automated-test evidence; no browser or customer-facing checkout interaction was available.

### GF-S5-033 — Guest checkout is not implemented
- **Severity:** High — QB-REQ-008 and guest portion of QB-REQ-012 remain incomplete.
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** The callable rejects unauthenticated users and the service requires a UID. This is a deliberate secure boundary, but it means a guest cannot place an order even though guest checkout is an approved requirement.
- **Recommendation:** Complete the guest credential lifecycle design (high-entropy secret, hashed storage, expiry, retrieval, recovery, account claiming, rate limits and privacy-safe responses) before exposing guest order creation. Do not weaken order read rules or accept a phone number/order ID as a credential.

### GF-S5-034 — Server-owned pricing and immutable order snapshot
- **Severity:** Positive control
- **Evidence:** VERIFIED BY SOURCE; automated tests in CI
- **Finding:** The order service reloads current product, category, option group, option and public settings documents; ignores client-supplied prices; computes totals in integer minor units; writes an order snapshot, unpaid payment state, initial order status and an audit event.
- **Recommendation:** Retain server-side authority. Add full real Firestore transaction integration tests for concurrent duplicate submissions and concurrent catalogue price/availability changes before production.

### GF-S5-035 — Idempotency replay behavior
- **Severity:** Positive control with production hardening outstanding
- **Evidence:** VERIFIED BY SOURCE; unit tests
- **Finding:** The idempotency key is scoped by customer UID, hashed before storage and bound to a canonical request fingerprint. Same-payload retries return the existing order; changed-payload key reuse is rejected.
- **Recommendation:** Define retention/cleanup for idempotency records and verify concurrent duplicate requests against the real Firestore Emulator transaction engine.

### GF-S5-036 — Restaurant settings fail closed
- **Severity:** Medium
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** Ordering, currency, fulfilment, delivery fee/area and explicit tax configuration are required. Missing tax policy prevents order creation rather than silently assuming zero tax.
- **Recommendation:** Add a guided admin setup/validation screen and a pre-launch readiness report so operators know exactly which settings block ordering.

### GF-S5-037 — Product option schema validation
- **Severity:** Medium; corrected in the current implementation revision
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** Independent review identified that malformed option group names/required flags or invalid min/max values could produce unusable selections or an undefined field in an order snapshot. The Developer added explicit name, boolean and bounded integer validation and tightened contact validation in the follow-up source revision.
- **Recommendation:** Keep malformed catalogue configuration fail-closed and add regression tests for missing group names, non-boolean required flags, min greater than max, too many groups/options and invalid phone strings.

### GF-S5-038 — Guest and authenticated checkout UI is still absent
- **Severity:** High before customer ordering can be considered usable.
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** The current customer interface has a local cart preview but no checkout form, fulfilment selector, address/contact capture, price revalidation acknowledgement, submission progress, confirmation screen or order history.
- **Recommendation:** Build the approved checkout journey against the trusted callable. Show a stable idempotency key during uncertain network retries and never tell customers an order succeeded until the callable confirms it.

### GF-S5-039 — Large Firebase bundle warning
- **Severity:** Medium
- **Evidence:** VERIFIED BY CI BUILD LOG
- **Finding:** The Vite build succeeds but emits a 709.86 kB minified Firebase client chunk (175.85 kB gzip), exceeding the default 500 kB warning threshold.
- **Recommendation:** Split Firebase SDK modules into intentional chunks or lazy-load services only when configured. Measure actual Android load performance; do not merely suppress the warning.

### GF-S5-040 — Production transaction behavior and ordering policy remain unverified
- **Severity:** High before launch
- **Evidence:** NOT TESTABLE
- **Finding:** CI verifies the service with a deterministic fake transaction adapter and verifies callable authentication/fail-closed behavior with emulators. It does not yet execute a successful complete order through real Firestore Emulator catalogue/settings records. Opening hours, minimum order, delivery-zone-specific fee policy, cancellation rules and idempotency retention are not finalized.
- **Recommendation:** Add end-to-end emulator tests with synthetic catalogue/settings documents, concurrent submissions and price/availability changes; confirm the missing business policies before enabling ordering.

### Persona simulation after this phase

| Persona | Result |
|---|---|
| First-time visitor | Catalogue preview available; live menu requires Firebase configuration |
| Guest customer | Can preview cart; cannot place an order yet |
| Registered customer | Account/Auth/profile and authenticated order callable paths exist; no checkout UI |
| Returning customer | Local cart is bound to auth identity; order history and order status UI outstanding |
| Restaurant administrator | No admin settings/catalogue management UI; settings must be provisioned outside the app |
| Restaurant staff | No staff queue or status transition UI |
| Beginner | Auth feedback exists; ordering setup/checkout guidance is not yet available |
| Android user | Responsive source exists; browser, keyboard, touch and device interaction testing NOT TESTABLE |

### Goldfish verdict

The trusted order callable is a substantial backend foundation and correctly rejects guest access rather than implementing weak guest security. It is **not a complete ordering journey**. Guest checkout, customer checkout UI, successful full Firestore transaction integration tests, order history, staff/admin operations and Android/browser interaction testing remain outstanding. No production deployment or real data use was performed. Goldfish did not modify application source, Firebase records or production data.


## Independent inspection — staff order workflow

### GF-S5-041 — Staff role is checked by trusted workflow callable
- **Severity:** Positive control
- **Evidence:** VERIFIED BY SOURCE and automated tests
- **Finding:** The callable checks the active staff membership document and allows only staff/admin roles. An authenticated customer is denied by the Firebase Emulator integration test.
- **Recommendation:** Keep role assignment/revocation in trusted admin operations. Add real seeded staff membership integration tests before production.

### GF-S5-042 — Order transitions are server-enforced and audited
- **Severity:** Positive control with operational gaps
- **Evidence:** VERIFIED BY SOURCE; unit tests
- **Finding:** The happy-path status map enforces pickup/delivery-specific states and appends actor/timestamp events. Invalid transitions and fulfilment mismatches are rejected.
- **Recommendation:** Add a complete Firestore Emulator integration test for each permitted transition and concurrency/replay cases. Define rejected/cancelled transitions only after the restaurant policy is supplied.

### GF-S5-043 — Cash payment state is tied to fulfilment completion
- **Severity:** Positive control
- **Evidence:** VERIFIED BY SOURCE; unit tests
- **Finding:** Order placement stores paymentStatus=unpaid. The trusted transition callable requires explicit staff cash-collection confirmation before marking an order completed and paid in the same transaction.
- **Recommendation:** The future staff UI must require a clear confirmation action and provide a correction/escalation path for payment disputes without allowing arbitrary client writes.

### GF-S5-044 — Staff and admin interfaces are not implemented
- **Severity:** High before operations can use the system
- **Evidence:** VERIFIED BY SOURCE
- **Finding:** Backend transitions exist, but no staff queue, order detail, cash collection screen, admin staff membership provisioning or operator feedback UI exists.
- **Recommendation:** Build the operations UI with clear status labels, queue filters, disabled invalid actions, loading/retry states and role-specific navigation.

### Updated verification note
- GitHub Actions run #183 passed 23 Cloud Functions tests, 5 IndexedDB cart tests, Vite production build and 11 Firestore/Storage Emulator tests.
- The staff transition logic tests use a deterministic transaction adapter; the Firebase Emulator integration confirms customer denial but does not yet exercise a seeded active staff account through a successful real Firestore transaction.
- The CI build still reports a 709.86 kB minified Firebase client chunk (175.85 kB gzip); performance optimization remains recommended.
