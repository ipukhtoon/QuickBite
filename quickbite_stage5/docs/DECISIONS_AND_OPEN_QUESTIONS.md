# QuickBite — Decisions and Open Questions

This file distinguishes confirmed product requirements from business decisions that must not be guessed.

## Confirmed
| ID | Decision |
|---|---|
| D-001 | Single-restaurant application, not marketplace |
| D-002 | Greenfield implementation; abandoned project is not reused |
| D-003 | HTML/CSS/Vanilla JS ES modules/Vite |
| D-004 | IndexedDB and Firebase architecture |
| D-005 | Guest checkout |
| D-006 | Pickup and delivery |
| D-007 | Cash on Delivery and Cash on Pickup initially |
| D-008 | Android-first, responsive tablet/desktop |
| D-009 | Supplied 12-screen montage is visual authority |
| D-010 | Premium dark espresso/amber visual direction |
| D-011 | Independent Goldfish QA |
| D-012 | Five-stage workflow and explicit Stage 4 approval gate |

## Open business decisions
| ID | Question | Why it matters |
|---|---|---|
| OQ-001 | What is the official restaurant name and logo? | Branding and customer-facing identity |
| OQ-002 | What are opening hours and closed-day rules? | Ordering availability |
| OQ-003 | What locations/postcodes are in delivery coverage? | Delivery validation |
| OQ-004 | What is the delivery fee model? | Checkout totals |
| OQ-005 | Is there a minimum order? | Checkout validation |
| OQ-006 | Are taxes/service charges applied? | Accurate totals |
| OQ-007 | What is the cancellation/refund policy? | Order transitions and customer support |
| OQ-008 | How long should guest order access remain valid? | Security and usability |
| OQ-009 | What pickup instructions should be displayed? | Customer instructions |
| OQ-010 | Will genuine ratings/reviews be collected? | Product detail presentation |
| OQ-011 | What promotions/discount rules are authorized? | Home banners and price calculations |
| OQ-012 | Is any real driver tracking/ETA integration planned? | Tracking claims |
| OQ-013 | Which Firebase project and region should be used? | Backend configuration |
| OQ-014 | Which hosting platform should be used? | Deployment |
| OQ-015 | Should future payment methods be hidden or shown disabled as Coming Soon? | Checkout visual treatment |

## Safe defaults pending decisions
- Do not invent delivery fee, minimum order, tax, opening hours or coverage.
- Do not fabricate ratings, reviews, discounts, sales or ETAs.
- Do not claim live tracking unless real tracking exists.
- Initially enable only COD and Cash on Pickup.
- Keep production deployment and paid services unapproved until explicitly authorized.
