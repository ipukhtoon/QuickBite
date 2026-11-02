# QuickBite — Data Model and Contracts

## General rules
- Firestore is authoritative for shared business data.
- IndexedDB is used for local cache and cart persistence.
- Use stable document IDs.
- Validate all input at trusted boundaries.
- Monetary values are integer paisa.
- Preserve order snapshots; do not rewrite history when menu data changes.

## Proposed Firestore layout
```text
restaurants/{restaurantId}
restaurants/{restaurantId}/categories/{categoryId}
restaurants/{restaurantId}/products/{productId}
restaurants/{restaurantId}/promotions/{promotionId}
users/{userId}
orders/{orderId}
orders/{orderId}/statusHistory/{historyId}
guestOrderAccess/{accessId}
staff/{staffId}
reports/{reportId}
```

The application remains single-restaurant. The restaurant document is a configuration boundary, not a marketplace tenant system.

## Restaurant settings
Proposed fields:
- `name`: string
- `logoUrl`: string
- `currency`: string
- `timezone`: string
- `openingHours`: structured object
- `fulfilmentOptions`: structured object
- `paymentMethods`: array
- `deliveryPolicy`: structured object
- `updatedAt`: timestamp

Operational values must be supplied or approved by the user.

## Product
Path: `restaurants/{restaurantId}/products/{productId}`

Proposed fields:
- `name`: string
- `description`: string
- `categoryId`: string
- `basePricePaisa`: integer
- `imageUrl`: string
- `imageVariants`: object
- `available`: boolean
- `customizationGroups`: array
- `featured`: boolean
- `sortOrder`: integer
- `archived`: boolean
- `createdAt`: timestamp
- `updatedAt`: timestamp

Customization contracts must define option IDs, labels, price adjustments in paisa, required/optional status, selection limits and availability.

## Category
Path: `restaurants/{restaurantId}/categories/{categoryId}`

Proposed fields:
- `name`
- `description`
- `imageUrl`
- `sortOrder`
- `active`
- `createdAt`
- `updatedAt`

## User profile
Path: `users/{userId}`

Proposed fields:
- `displayName`
- `email`
- `phone`
- `createdAt`
- `updatedAt`
- optional saved addresses and preferences

Private data must not be publicly readable.

## Order
Path: `orders/{orderId}`

Proposed fields:
- `customerId`: string or null
- `guestOrder`: boolean
- `fulfilmentType`: approved enum
- `paymentMethod`: approved enum
- `paymentStatus`: approved enum
- `orderStatus`: approved enum
- `items`: immutable snapshot array
- `subtotalPaisa`: integer
- `deliveryFeePaisa`: integer
- `discountPaisa`: integer
- `taxPaisa`: integer
- `totalPaisa`: integer
- `customerNotes`: string
- `deliveryAddress`: structured object or null
- `createdAt`: timestamp
- `updatedAt`: timestamp

Each item snapshot preserves product ID, name, image reference, base unit price, selected options, option prices, quantity, final unit price and line total.

## Status history
Path: `orders/{orderId}/statusHistory/{historyId}`

Fields:
- `previousStatus`
- `newStatus`
- `changedBy`
- `timestamp`
- optional staff note

## Guest access
Guest access must use a cryptographically secure credential, not an order ID alone. Store only a protected representation where appropriate. Define expiry, revocation, rate limits and verification in trusted backend logic. Do not leak credentials in logs or analytics.

## Idempotency
Store or otherwise enforce an idempotency record bound to the authenticated/guest request context. Repeated submissions with the same key must not create another order.

## IndexedDB
Proposed local stores:
- cached categories
- cached products
- cart
- non-sensitive UI preferences
- cache metadata/schema version

Do not cache sensitive guest credentials or private order information without an explicit, reviewed security design.

## Indexes and validation
Required composite indexes must be defined from actual query patterns. Validate integer money fields, allowed enums, required fields, string lengths, ownership and document size. Final field-level contracts and indexes are confirmed during implementation planning before coding.
