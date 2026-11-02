# QuickBite — Mandatory Project Rules

These rules govern all project work. A change requires explicit user approval and a changelog entry.

## 1. Product identity and quality
1. QuickBite is a single-restaurant application, not a marketplace.
2. The supplied 12-screen reference is the visual authority, not loose inspiration.
3. Target the craftsmanship and completeness expected of a $5,000 bespoke commercial application.
4. Do not replace the reference with a generic food-ordering template.
5. Treat typography, spacing, imagery, iconography, component geometry, hierarchy and interaction states as part of the product quality.
6. Use high-quality, realistic and visually consistent food images. Avoid random mismatched stock imagery, stretched images, watermarks, low-resolution assets and emoji substitutes.
7. Do not fabricate customer reviews, ratings, sales, discounts, stock, ETA or operational status.
8. Do not invent restaurant policies or capabilities.

## 2. Technology and architecture
1. Use HTML5, CSS3, Vanilla JavaScript ES modules and Vite.
2. Use IndexedDB for appropriate local persistence.
3. Use Firebase Authentication, Firestore, Storage, Cloud Functions and security rules as approved.
4. Keep code modular, cohesive and maintainable.
5. Do not place the entire application in one monolithic HTML file.
6. Do not reuse abandoned QuickBite source code, CSS, JavaScript or database.
7. Preserve approved architecture unless a change is reviewed and approved.

## 3. Customer journeys
1. Guest checkout must not require registration.
2. Support pickup and delivery.
3. Initially support Cash on Delivery and Cash on Pickup only.
4. Unsupported payment methods must not appear operational.
5. A locally saved cart is not a confirmed order.
6. Order submission and authoritative price verification require connectivity.
7. Explain errors and provide a practical recovery path.

## 4. Data and financial integrity
1. Store authoritative monetary values as integer paisa.
2. The trusted backend recalculates product prices, options, fees, discounts, taxes and totals.
3. Preserve immutable order item and price snapshots.
4. Protect customer and guest order data.
5. Prevent duplicate order creation through idempotency.
6. Validate order status transitions server-side.
7. Do not silently rewrite historical orders when menu items change.
8. Never fabricate reporting data.

## 5. Security
1. Never trust client-side role claims or prices.
2. Users cannot grant themselves staff or administrator permissions.
3. Order numbers alone cannot authorize guest order access.
4. Protect, expire and revoke guest access credentials.
5. Enforce Firestore and Storage access through security rules.
6. Keep privileged secrets server-side.
7. Do not expose sensitive credentials in logs, analytics or URLs unnecessarily.
8. Validate input and safely render user-supplied content.

## 6. Visual and responsive quality
1. Reconstruct each reference screen individually.
2. Measure layout relative to the reference crop; do not invent original CSS measurements.
3. Compare implementation screenshots against equivalent reference crops.
4. Check image crop, aspect ratio, section order, margins, type scale, controls and navigation.
5. Test 320, 360, 390, 430, 768, 1024 and 1440 CSS-pixel widths.
6. Prevent horizontal overflow, clipped controls and bottom-navigation overlap.
7. Respect Android safe areas and virtual keyboard behavior.
8. Include loading, empty, error, success, disabled and offline states where relevant.

## 7. Developer and Goldfish separation
1. Developer builds and fixes.
2. Goldfish independently inspects and reports; Goldfish does not modify source code or production data.
3. Goldfish challenges assumptions rather than endorsing Developer claims.
4. Do not claim interaction tests if only source inspection was possible.
5. Use the evidence labels defined in `QA_GOLDFISH.md`.

## 8. Workflow and approvals
1. The five-stage workflow is mandatory.
2. No coding during Stages 1–4.
3. Stage 5 begins only after explicit user approval of the final plan.
4. Do not treat a request to prepare documentation as approval to implement.
5. Do not interpret silence or ambiguous language as approval.
6. Update these project documents after each stage approval/completion and record it in `CHANGELOG.md`.
7. Do not silently expand scope or alter approved requirements.

## 9. Honesty and completion
1. Never invent test results, screenshots, files, integrations or deployment status.
2. Distinguish implemented, verified, partially verified, not verified and not implemented.
3. Never declare the project complete with unresolved critical defects or unimplemented approved requirements.
