# QuickBite

A mobile-first, single-restaurant food-ordering application. QuickBite is not a multi-vendor marketplace.

## Design authority

`food_delivery_ui.html` is the preserved visual reference. `index.html` is the Vite application entry. New customer and operations screens must extend the same coral/red, white and light-gray visual language and Plus Jakarta Sans typography.

## Current implementation

- Responsive customer catalogue preview.
- Combined search and category filtering.
- Product customization preview with required and optional sample options.
- IndexedDB-backed local cart preview with option-specific cart lines.
- Firebase client/authentication services and active catalogue repository scaffold.
- Initial Firestore and Storage security rules, indexes and emulator configuration.
- GitHub Actions production build and Firestore rules test workflow.

## Important limitations

- The menu and prices are demonstration data, not a real restaurant catalogue.
- Demo amounts are not a configured currency.
- Checkout is deliberately disabled.
- No Firebase project has been provisioned or connected.
- Authentication UI, trusted Cloud Functions, order creation, guest order retrieval, order history, saved items, profile, admin and staff workflows remain incomplete.
- Firebase rules are an initial baseline and must pass Emulator Suite tests before deployment.
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

`npm run test:security` starts the Firestore Emulator through Firebase CLI and runs the automated rules tests. Use only the `demo-quickbite` emulator project ID for the test suite; it is not a production project.

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
