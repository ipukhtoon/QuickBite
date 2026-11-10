# QuickBite

A mobile-first, single-restaurant food-ordering application. QuickBite is not a multi-vendor marketplace.

## Design authority

`food_delivery_ui.html` is the preserved visual reference. `index.html` is the Vite application entry. New customer and operations screens must extend the same coral/red, white and light-gray visual language and Plus Jakarta Sans typography.

## Current implementation

- Responsive customer catalogue preview.
- Combined search and category filtering.
- Firestore-backed catalogue integration when a complete Firebase configuration and public restaurant settings are supplied; demo preview otherwise.
- Product customization with required/optional options and configured currency formatting.
- IndexedDB-backed local cart preview with option-specific lines and serialized quantity updates.
- Customer account interface for sign-in, registration, sign-out and password reset (requires Firebase configuration).
- Trusted authenticated order creation callable with server-side catalogue/option/price validation, COD/COP, immutable order snapshots and idempotent retries.
- Role-checked staff order transition callable with audit events and cash collection confirmation before completion.
- Firebase client/Auth services, Firestore catalogue repository, initial Firestore/Storage rules and indexes.
- GitHub Actions production build, 11 Firestore/Storage Emulator security tests, 23 Cloud Functions tests and 5 cart tests currently pass.

## Important limitations

- Without Firebase configuration, the app shows sample menu data and demo amounts.
- Live catalogue integration has not been tested against a real Firebase project.
- Checkout is deliberately disabled.
- No Firebase project has been provisioned or connected.
- Customer authentication and trusted profile provisioning are implemented and tested with Firebase emulators; production Firebase setup remains unconfigured.
- Authenticated order creation is implemented and emulator/unit tested; guest checkout and the customer checkout UI remain outstanding.
- Guest order creation/retrieval and its credential lifecycle, checkout UI, order history, saved-item UI, full profile management, admin and staff workflows remain incomplete.
- Firestore and Storage rules pass the current Emulator Suite tests, but remain an initial baseline requiring production review before deployment.
- No production deployment or production data migration is authorized.

## Local development

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

To enable Firebase client services, copy `.env.example` to `.env.local` and enter the configuration values for a dedicated non-production Firebase project. Do not commit `.env.local` or any private credentials.

```bash
npm run build
npm run test:security
```

`npm run test:security` starts Firestore and Storage emulators through Firebase CLI and runs the automated rules tests. Use only the `demo-quickbite` emulator project ID for the test suite; it is not a production project.

## Project governance

- Stage 1 Architect: complete.
- Stage 2 Critical Reviewer: complete.
- Stage 3 Improvement: complete.
- Stage 4 Approval: approved by the user on 2026-11-10.
- Stage 5 Implementation: in progress.

Implementation record: `docs/workflow/STAGE_5_IMPLEMENTATION.md`.
Independent QA: `docs/QA/GOLDFISH_STAGE_5.md`.
Firestore data model: `docs/architecture/FIRESTORE_DATA_MODEL.md`.

Every material implementation phase and QA result must be recorded in `docs/` and `docs/CHANGELOG.md`. Goldfish findings are independent and must not be represented as interaction-tested unless real browser/device testing occurred.
