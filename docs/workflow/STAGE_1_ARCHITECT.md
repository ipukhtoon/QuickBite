# Stage 1 — Architect

**Project:** QuickBite  
**Repository:** `ipukhtoon/QuickBite`  
**Branch inspected:** `main`  
**Stage status:** COMPLETE — ready for Stage 2  
**Implementation authorization:** NOT GRANTED

> This document records discovery and a proposed architecture only. It does not authorize application implementation, repository restructuring, Firebase provisioning, deployment, or production changes.

## 1. Project direction

QuickBite is a fresh, single-restaurant food-ordering application. It is not a multi-vendor marketplace.

The existing GitHub file `food_delivery_ui.html` is the sole current visual design authority. Its visual language must be preserved and extended consistently when additional screens are designed. Historical QuickBite archives and unrelated showcase designs are not design authorities for this fresh project.

The goal is to turn the visual starting point into a complete, functional, secure and responsive application without replacing its design with an unrelated template.

## 2. Repository inspection

At the time of inspection, the repository's known application entry was:

- `food_delivery_ui.html`

The file is a standalone HTML document with embedded CSS and JavaScript. It imports Plus Jakarta Sans from Google Fonts and Font Awesome 6.4.0 from a CDN.

The page uses a fixed 390 × 844 phone frame for presentation. That frame is a mockup container, not a suitable production layout constraint.

### 2.1 Extracted visual tokens

| Token | Value |
|---|---|
| Primary | `#FF4757` |
| Primary light | `#FF6B81` |
| Page background | `#F8F9FA` |
| Card background | `#FFFFFF` |
| Main text | `#2D3436` |
| Secondary text | `#636E72` |
| Font | Plus Jakarta Sans |
| Card radius | `20px` |
| Main card shadow | `0 10px 30px rgba(0, 0, 0, 0.05)` |

### 2.2 Visual characteristics to preserve

- Light, clean surfaces with coral/red accents.
- Plus Jakarta Sans typography.
- Rounded cards and controls.
- Soft shadows and restrained borders.
- Horizontal category chips.
- Two-column food-card grid at appropriate mobile widths.
- Prominent food photography.
- Clear product names, descriptions and prices.
- Bottom navigation pattern, adapted responsibly for different screen sizes.
- Consistent spacing, hierarchy and interaction feedback.

Do not preserve the fixed phone-frame dimensions as a production constraint. The app must use responsive layouts for Android phones, tablets and desktop browsers.

## 3. Existing functionality and limitations

| Area | Observed state in source |
|---|---|
| Home layout | Static home screen exists |
| Search | Filters the currently hardcoded cards |
| Category selection | Filters cards independently |
| Product catalogue | Four hardcoded sample cards |
| Add to cart | Increments a count; does not maintain cart line items |
| Cart | Not implemented |
| Orders navigation | Alert simulation |
| Saved navigation | Alert simulation |
| Profile navigation | Alert with hardcoded sample identity |
| Promotion action | Displays a success alert without validating a promotion |
| Authentication | Not implemented |
| Checkout/order creation | Not implemented |
| Admin/staff journeys | Not implemented |
| Backend/persistence | Not implemented |

The search and category filters operate independently and can override each other's displayed results. The current cart count does not represent actual cart contents, prices or quantities.

## 4. Proposed screen inventory

The following is an initial scope proposal to be challenged during Stage 2 and consolidated during Stage 3.

| ID | Screen / area | Purpose |
|---|---|---|
| QB-S01 | Home | Discovery, promotions and popular products |
| QB-S02 | Menu | Browse the full catalogue |
| QB-S03 | Search | Search and combine catalogue filters |
| QB-S04 | Product details | Images, descriptions, options and quantity |
| QB-S05 | Cart | Review, update and remove cart lines |
| QB-S06 | Checkout | Customer details, fulfilment and payment choice |
| QB-S07 | Order confirmation | Show a confirmed order outcome |
| QB-S08 | Orders | Current and historical customer orders |
| QB-S09 | Saved items | Manage favourites |
| QB-S10 | Profile | Customer information and preferences |
| QB-S11 | Sign in | Customer authentication |
| QB-S12 | Registration | Create an account |
| QB-S13 | Password recovery | Recover account access |
| QB-S14 | Admin dashboard | Restaurant operations overview |
| QB-S15 | Product management | Create and manage products and availability |
| QB-S16 | Category management | Manage catalogue categories |
| QB-S17 | Order management | Review and process orders |
| QB-S18 | Restaurant settings | Configure restaurant-level settings |

Final screen count, navigation and role-specific access remain subject to review and approval.

## 5. User journeys to support

### Customer
1. Discover the restaurant catalogue without signing in.
2. Search and filter products.
3. Open product details and select available options.
4. Add products to a persistent cart and change quantities.
5. Select pickup or delivery, where enabled.
6. Enter and validate required customer details.
7. Select an enabled payment method.
8. Submit an order once and receive a clear confirmation or actionable error.
9. Access order details and history according to the chosen guest/account model.
10. Register or sign in without losing valid cart progress.

### Restaurant administrator
1. Sign in with an authorized administrative account.
2. View relevant operational information.
3. Manage products, categories and availability.
4. Review and update order statuses within permitted transitions.
5. Configure supported restaurant settings.
6. Review meaningful validation and error feedback.

### Restaurant staff
1. Sign in with a restricted staff account.
2. View only the operational data needed for their role.
3. Process permitted order actions.
4. Be prevented from accessing administrative settings or customer data outside their authorization.

## 6. Proposed technology and architecture

This proposal follows the project's established technology direction and requires Stage 2 scrutiny before approval.

### Frontend
- HTML5 and CSS3.
- Vanilla JavaScript ES modules.
- Vite for local development and production builds.
- Modular feature and component boundaries.
- Responsive, accessible UI based on the existing HTML design.

### Data and backend candidates
- Firebase Authentication for supported account flows.
- Cloud Firestore for application records.
- Firebase Storage for approved restaurant/product media.
- Trusted server-side functions for sensitive order operations.
- Firestore and Storage Security Rules for access enforcement.
- IndexedDB for carefully selected local persistence and offline-friendly experience.

### Proposed responsibility boundaries
- The UI collects input and presents server-confirmed state.
- Local storage may improve continuity but is not an authority for prices, permissions or final order totals.
- Trusted backend logic validates product availability and current prices and calculates authoritative totals.
- Order records preserve item name, selected options, unit price and other relevant purchase-time snapshots.
- Security Rules and backend authorization enforce customer, staff and administrator boundaries.

The exact Firebase data model, offline behavior, function boundaries, indexing and rules must be designed and critically reviewed before implementation.

## 7. Initial data domains

The application is expected to require data for:

- Restaurant configuration.
- Customer accounts and customer profile data.
- Staff identities and roles.
- Products and product availability.
- Categories.
- Product options and modifiers, if required.
- Customer carts and saved items, where persistence is appropriate.
- Delivery addresses, if delivery is supported.
- Orders and order line-item snapshots.
- Order status history or audit events.
- Product/category media metadata.
- Administrative activity records where justified.

This is a domain inventory, not an approved final database schema.

## 8. Security and integrity requirements to carry forward

- Never trust client-submitted prices, discounts, fees or totals.
- Revalidate product status, options and prices on the trusted backend when placing an order.
- Prevent duplicate order creation on retries.
- Restrict customer access to their own private records.
- Enforce staff and administrator permissions server-side and through security rules.
- Do not expose privileged credentials in frontend code.
- Validate and normalize all user input.
- Avoid storing unnecessary personal information.
- Define secure guest-order lookup/access before offering guest order tracking.
- Protect media uploads with authorization, file-type/size constraints and appropriate paths.
- Define safe handling for network failures and interrupted checkout.

## 9. Initial technical risks

| ID | Risk | Initial severity | Review focus |
|---|---|---|---|
| QB-TR-01 | Inadequate database/security rules | Critical | Threat model and authorization matrix |
| QB-TR-02 | Client-authoritative prices or totals | Critical | Trusted order calculation |
| QB-TR-03 | Duplicate order submissions | High | Idempotency and transaction strategy |
| QB-TR-04 | Weak guest-order access model | High | Secure order lookup and privacy |
| QB-TR-05 | Unclear offline/online consistency | High | IndexedDB/Firestore responsibilities |
| QB-TR-06 | Inadequate role separation | High | Admin/staff permission matrix |
| QB-TR-07 | Unoptimized food media | Medium | Image formats, sizes and loading |
| QB-TR-08 | Missing schema migration strategy | High | Versioning and recovery |
| QB-TR-09 | Fixed-width UI assumptions | High | Responsive layouts and device testing |
| QB-TR-10 | CDN dependency failures | Medium | Font/icon fallback strategy |

## 10. Documentation governance

The repository must maintain project documentation under `/docs`, including:

- A separate file for each of the five workflow stages.
- Separate Goldfish QA records and verification reports.
- Architecture, application structure, database and Firebase documentation.
- Design system and reference-design documentation.
- Requirements with stable IDs and acceptance criteria.
- Test plans, test cases and known issues.
- Architectural decision records.
- `CHANGELOG.md` and `PROJECT_STATUS.md`.

Every approval and meaningful approved change must be recorded. Requirements must not silently disappear. Documentation must distinguish proposed decisions from approved decisions.

## 11. Stage 1 limitations and evidence

- Repository source was inspected.
- Design tokens and current source behavior were inspected from the HTML.
- Architecture and journeys in this document are proposals.
- Goldfish's separate source-informed findings are recorded in `docs/QA/GOLDFISH_STAGE_1.md`.
- No browser interaction testing was performed as part of this inspection.
- No application source, Firebase project, production data or repository application structure was modified.
- No implementation is authorized by this document.

## 12. Stage 1 exit status

**Stage 1 — Architect: COMPLETE.**

Next required stage: **Stage 2 — Critical Reviewer**, including an independent challenge of the proposed architecture and Goldfish's independent usability challenge.

Stage 2 and Stage 3 remain no-code stages. Stage 4 must present the consolidated implementation plan and obtain the user's explicit approval before Stage 5 implementation begins.
