# QuickBite — Project Brief

## Product definition
QuickBite is a professional **single-restaurant food-ordering application**. It is not a multi-vendor marketplace.

## Quality and scope ambition
The project quality target is comparable to a **$5,000 bespoke commercial application**. This is a quality benchmark for completeness, craftsmanship and polish; it is not a budget quote, market valuation, delivery guarantee or permission to activate paid services.

The target requires:
- High-fidelity reconstruction of the supplied 12-screen reference.
- Premium, cohesive UI/UX rather than a generic food-ordering template.
- High-quality, realistic food photography and consistent image treatment.
- A complete customer ordering journey, including guest checkout.
- Functional restaurant administration and staff workflows.
- Secure backend validation, authorization and data integrity.
- Reliable local persistence and clear online/offline behavior.
- Responsive Android-first implementation, with tablet and desktop support.
- Meaningful loading, empty, success and error states.
- Independent Goldfish QA and evidence-based acceptance.
- Maintainable source code, project documentation and changelog.

A polished screenshot or static mockup alone does not meet the quality target.

## Technology
- HTML5
- CSS3
- Vanilla JavaScript ES modules
- Vite
- IndexedDB
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Cloud Functions
- Firestore and Storage Security Rules

## Confirmed requirements
- Guest checkout; account registration is not compulsory for an order.
- Registered customer accounts.
- Home delivery and pickup.
- Initial payment methods: Cash on Delivery and Cash on Pickup.
- Mobile-first admin experience.
- Android is the primary usage platform.
- Responsive tablet and desktop layouts.

## Initial 12 screens
1. Welcome
2. Sign In
3. Create Account
4. Home
5. Menu
6. Product Details
7. Cart
8. Checkout
9. Order Tracking
10. My Orders
11. Admin Dashboard
12. Manage Menu

## Out of scope unless separately approved
- Multi-vendor marketplace functionality.
- Reuse or migration of the abandoned previous QuickBite implementation.
- Fabricated reviews, ratings, promotions, sales, ETA or live GPS tracking.
- Treating browser-calculated totals as authoritative.
- Activating paid services or deploying production services without required approval.

## Platform and working constraints
Development must be manageable through the user's Android-based workflow. Instructions and handoffs should be incremental, precise and copy-paste friendly where practical. Do not assume access to a PC or laptop.

## Current status
Stages 1–3 are complete. Stage 4 has been prepared but the user has explicitly **not approved it**. Stage 5 implementation has not started and is not authorized.
