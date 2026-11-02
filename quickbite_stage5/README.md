# QuickBite

Premium, Android-first, single-restaurant food ordering application. This project follows the approved Stage 4 implementation authorization and the mandatory Developer + independent Goldfish five-stage workflow.

## Technology
- HTML5, CSS3 and Vanilla JavaScript ES modules
- Vite
- IndexedDB
- Firebase Authentication, Cloud Firestore, Firebase Storage and trusted Cloud Functions (integration pending)

## Current implementation status
- Stage 4: approved by the user.
- Stage 5: in progress.
- P0: available-file inventory completed.
- P1: Vite/Vanilla foundation and route registry created.
- P2: shared UI foundations created.
- P3: Welcome, Sign In, Create Account and guest-entry UI created.
- Home/menu, product, cart, checkout, order, tracking, admin, Firebase and production workflows remain incomplete.

Authentication screens intentionally do not transmit or save credentials until Firebase Authentication is configured. Guest entry clearly states that the menu is not yet connected. No sample products, prices, ratings, promotions or sales metrics are fabricated.

## Commands
```bash
npm install
npm run dev
npm run check
npm test
npm run build
```

The Vite production build has not yet been verified in the current development runtime because dependency installation timed out. See `docs/IMPLEMENTATION_LOG.md` and `docs/CHANGELOG.md` for evidence and limitations.

## Mandatory project rules
Read `docs/MANDATORY_RULES.md`, `docs/STAGE_4_IMPLEMENTATION_AUTHORIZATION.md` and `docs/QA_GOLDFISH.md` before continuing implementation. Do not reduce or silently omit any QB-001–QB-022, IMP-01–IMP-14 or the 12 approved screen contracts.


## Current implementation
- P1 foundation, P2 shared UI, P3 onboarding/authentication UI and P4 Home/Menu are implemented in source.
- Home and Menu use an empty catalog until real restaurant data and Firebase/IndexedDB adapters are configured. Search/filter logic is ready against normalized catalog records.
- Authentication, product detail, cart, checkout, order tracking, order history and admin workflows are not yet operational.

### Current implementation status
- P1 foundation, P2 shared UI, P3 onboarding/authentication UI, P4 Home/Menu, and P5 Product Details/local cart storage primitives are implemented.
- Product catalog and Firebase are not configured. Product details therefore show an explicit empty/unavailable state; no demo products or prices are fabricated.
- Cart storage uses IndexedDB, but the full cart, checkout and order flow are not implemented yet.
- Source syntax checks and 11 automated tests pass. Vite production build and real browser/device interaction testing remain outstanding.

## Current implementation status

P1–P6 are implemented as source modules: foundation, shared UI, onboarding/authentication UI, Home/Menu, Product Details and Cart. The Cart supports IndexedDB-backed line retrieval, quantity changes, removal, customization display and integer-paisa subtotal calculation. Checkout is intentionally disabled until its approved phase and backend price verification are implemented. Firebase/catalog integration and browser/device interaction QA are still outstanding; do not treat this build as production-ready.

Run `npm install`, then `npm run check`, `npm test`, and `npm run build` in a Vite-capable environment.


### Current implementation status
P7 checkout UI is implemented. It collects fulfillment, customer details, payment choice and notes, and summarizes cart contents. Order placement is intentionally disabled until Firebase/Cloud Functions verify prices, delivery settings and permissions.

## UI testing demo (local only)

This milestone includes a clearly labelled sample catalog for testing the customer screens. It is not the restaurant's real menu. Admin preview edits are stored only in this browser's local storage. No account, order, payment or Firebase operation is performed. Use `npm install`, `npm run dev`, then open the Vite URL. See `docs/UI_MILESTONE_GOLDFISH_REPORT.md` for the evidence-based QA report and outstanding browser tests.
