# QuickBite — Architecture

## Principles
- Greenfield implementation.
- Single restaurant.
- Mobile-first, responsive.
- Vanilla JavaScript ES modules with Vite.
- Clear separation of UI, features, services, persistence and backend.
- Firebase is authoritative for shared business records.
- IndexedDB supports local persistence and useful offline browsing.
- Trusted backend validates orders and privileged operations.

## Proposed source structure
```text
quickbite/
  public/assets/{brand,food,categories,banners,icons}/
  src/
    app/{main.js,bootstrap.js,router.js,state.js}
    styles/{tokens.css,reset.css,typography.css,layout.css,components.css,animations.css,responsive.css}
    components/
      navigation/
      buttons/
      forms/
      products/
      shopping/
      feedback/
      overlays/
      administration/
    features/
      onboarding/
      authentication/
      home/
      menu/
      products/
      cart/
      checkout/
      orders/
      tracking/
      admin/
    services/
      firebase.js
      authService.js
      userService.js
      menuService.js
      cartService.js
      orderService.js
      storageService.js
      offlineService.js
    database/{indexedDB.js,repositories/,migrations/}
    utils/{currency.js,validation.js,formatting.js,imageUtils.js}
  functions/src/
  firebase/{firestore.rules,firestore.indexes.json,storage.rules}
  tests/{unit,integration,visual,e2e}/
  index.html
  package.json
  vite.config.js
  firebase.json
  .env.example
```

This is the planned structure; actual files are created only after Stage 4 approval.

## Shared component system
Central reusable components include:
- Header, BottomNavigation, AdminSidebar
- PrimaryButton, SecondaryButton, IconButton
- FormField, PasswordField, PhoneField
- ProductCard, ProductGrid, ProductHero
- QuantityControl, CartItem, PriceSummary
- CategoryChips, FilterTabs
- StatusBadge, OrderTimeline
- LoadingState, EmptyState, ErrorState, Toast
- Modal, ConfirmationDialog
- StatCard, SalesChart, AdminProductRow, ProductEditor, ImageUploader

Shared components must have consistent states and behavior, not just shared appearance.

## Frontend responsibilities
- Render the approved reference layouts.
- Manage navigation and ephemeral UI state.
- Read cached data and use service modules.
- Maintain a local cart.
- Show clear network/sync states.
- Never be the authority for final price or permissions.

## Backend responsibilities
- Validate identity and permissions.
- Retrieve authoritative product and configuration records.
- Validate availability and customization.
- Recalculate order totals.
- Enforce idempotency.
- Create immutable order snapshots.
- Validate status transitions.
- Record status history.
- Perform privileged staff/admin operations.

## Offline behavior
Available offline when previously cached:
- Menu and categories.
- Product browsing and local search.
- Cart editing and persistence.

Requires connectivity:
- New order submission.
- Authoritative price verification.
- Payment confirmation.
- Live order status.
- Admin writes.

Clearly distinguish locally saved, sync pending and server confirmed. Never show a locally stored cart as a confirmed order.

## Order creation flow
1. Client submits cart and a unique idempotency key.
2. Trusted backend loads current products and settings.
3. Backend validates items, options, fulfilment and payment.
4. Backend calculates totals using integer paisa.
5. Backend creates the order and initial status history atomically where supported.
6. Backend returns the confirmed order result.
7. Retries with the same idempotency key return the existing result rather than creating duplicates.

## Proposed order lifecycle
Pending → Confirmed → Preparing → Ready → Completed.

Cancellation transitions depend on the restaurant-approved policy. Invalid transitions are rejected server-side.

## Responsive targets
320, 360, 390, 430, 768, 1024 and 1440 CSS pixels. Respect Android safe areas, keyboard resizing and bottom navigation insets.
