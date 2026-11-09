# QuickBite — Firestore Data Model (Implementation Contract)

**Status:** Initial schema contract for Stage 5; not deployed to any Firebase project.
**Architecture:** One restaurant / one ordering business. No marketplace tenant model.

## Collection map

| Path | Purpose | Client access |
|---|---|---|
| `settings/public` | Public storefront identity, operating state and enabled fulfilment methods | Public read only |
| `settings/private` | Private operational configuration and secrets/references | No direct client access |
| `categories/{categoryId}` | Menu categories | Active records read only |
| `products/{productId}` | Menu products and current prices | Active records read only |
| `optionGroups/{groupId}` | Reusable product option groups | Active records read only |
| `optionGroups/{groupId}/options/{optionId}` | Choices and price deltas | Active records read only |
| `customers/{uid}` | Customer profile | Owner read; trusted writes only |
| `staff/{uid}` | Staff role and active membership | Own record read; trusted writes only |
| `orders/{orderId}` | Canonical order and immutable item/price snapshots | Owner/staff read; trusted writes only |
| `orders/{orderId}/events/{eventId}` | Append-only order status/audit events | Owner/staff read; trusted writes only |
| `savedItems/{uid}/items/{productId}` | Customer saved products | Owner read/create/delete |
| `idempotencyKeys/{key}` | Retry protection for trusted order creation | No direct client access |

## Document contracts

### `settings/public`
Only information safe for every visitor:
- `displayName`, `logoUrl`, public address/contact details.
- `currencyCode` and configured tax/fee display policy.
- `operatingStatus`, public opening-hours summary.
- `fulfilmentMethods` (delivery/pickup) and public support details.

Never place API secrets, private staff data, private policies or payment credentials in this document. Firestore rules cannot hide individual fields within a readable document.

### `categories/{categoryId}`
- `name`, `slug`, `imageUrl`, `sortOrder`, `active`.
- Server-managed `createdAt`, `updatedAt`.

### `products/{productId}`
- `name`, `description`, `categoryId`, `imageUrl`.
- `priceMinor`: non-negative integer in the restaurant's configured currency minor unit.
- `active`, `available`, `sortOrder`, `optionGroupIds`.
- Server-managed timestamps.

### `optionGroups/{groupId}` and nested `options/{optionId}`
- Group: `name`, `selectionType` (single/multiple), `required`, `minSelections`, `maxSelections`, `active`, `sortOrder`.
- Option: `name`, `priceDeltaMinor` (integer), `active`, `sortOrder`.
- Backend validates group ownership, active state, cardinality and all price deltas against current documents.

### `customers/{uid}`
- `displayName`, `email`, `phone`, timestamps.
- Do not store passwords or authentication secrets in Firestore.

### `staff/{uid}`
- `role` limited to `staff` or `admin`, `active`, display metadata and timestamps.
- Role changes are trusted administrative operations, never client profile updates.

### `orders/{orderId}`
- `customerUid` for registered customers; absent/null for guest orders.
- `status`, `paymentMethod` (COD/COP), `paymentStatus` separately.
- `fulfilmentType`, customer/fulfilment snapshot, immutable `items[]`.
- `totals`: subtotal, delivery fee, tax and total in integer minor units plus `currencyCode`.
- `idempotencyKeyHash`, timestamps and any guest access credential hash metadata needed by trusted functions.

Each item snapshot stores product ID, name, selected option IDs/names, quantity, unit price, option deltas and line total as accepted at order placement. Editing a catalogue product must never rewrite a historical order.

### `orders/{orderId}/events/{eventId}`
- Append-only status transition, actor UID/role, timestamp and safe reason metadata.
- No client-created or client-edited events.

### `savedItems/{uid}/items/{productId}`
- Product reference and created timestamp only. Catalogue details are loaded from the current public catalogue.

### `idempotencyKeys/{key}`
- Created/read only by trusted backend.
- Stores request fingerprint and resulting order reference; never expose guest credentials or raw idempotency secrets in public documents.

## Query/index contracts

- Public category listing: `active == true`, ordered by `sortOrder`.
- Public product listing: `active == true`, ordered by `sortOrder`.
- Category product listing: `active == true` and `categoryId == selectedCategory`, ordered by `sortOrder`.
- Customer order history: `customerUid == request.auth.uid`, ordered by `createdAt` descending; add the composite index when this query is implemented.
- Staff order queue: authorized staff query by allowed status and created time; exact index follows the final queue filters.

## Trust boundaries

1. Browser values are display hints, never trusted price or permission authority.
2. Firestore client writes to orders, events, products, categories, staff and settings are denied.
3. Trusted Cloud Functions validate customer/guest identity, fulfilment, product/options, current prices, integer arithmetic, idempotency and status transitions.
4. Guest order retrieval must use a high-entropy credential through a trusted function; never phone number or guessable order ID alone.
5. Admin SDK bypasses Firestore Rules. Every function must independently authenticate and authorize its caller.
6. Production Firebase provisioning, rules deployment and real customer data use are not authorized by the current implementation step.

## Open schema decisions before production
- Final currency minor-unit policy and tax rounding.
- Exact address and delivery zone schema.
- Guest credential expiry, recovery and account claiming.
- Cancellation/rejection policy and allowed status transitions.
- Staff permission granularity and order queue filters.
- Data retention and privacy policy.
