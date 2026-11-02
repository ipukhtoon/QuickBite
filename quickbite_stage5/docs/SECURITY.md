# QuickBite — Security Specification

## Trust boundaries
The browser is untrusted. It may display estimated totals and collect input, but it cannot authoritatively set prices, grant roles, confirm payments or authorize access to another person's records.

## Roles
- Guest: can create an order and access only that order using a valid guest credential.
- Customer: can manage permitted profile data and access only their own orders.
- Staff: can perform explicitly assigned operational actions.
- Administrator: can manage approved restaurant settings, menu, reports and staff permissions.

Role assignment must occur through trusted administrative processes. Users cannot promote themselves.

## Guest order access
- Order number alone is never sufficient authorization.
- Generate a high-entropy random credential.
- Protect credential storage and transmission.
- Verify access through trusted backend logic.
- Apply expiry, revocation and rate limiting.
- Avoid exposing credentials in logs, analytics, referrers or screenshots.
- Define the expiry policy with the user before production use.

## Order integrity
- Backend retrieves current product prices and availability.
- Backend validates customization selections.
- Backend calculates totals using integer paisa.
- Backend enforces idempotency.
- Order snapshots are immutable.
- Status transitions are checked server-side.

## Firebase controls
- Firestore rules enforce ownership and role permissions.
- Storage rules restrict uploads by role, path, content type and size as appropriate.
- Cloud Functions verify authentication/claims and validate all payloads.
- Privileged service credentials remain server-side.
- Firebase client configuration is not treated as a security boundary.

## Required security tests
- SEC-01: Guest cannot access another order.
- SEC-02: Customer cannot access admin functions.
- SEC-03: Customer cannot alter their role.
- SEC-04: Manipulated client price is ignored/rejected.
- SEC-05: Repeated idempotent request creates one order.
- SEC-06: Unauthorized staff menu edit is denied.
- SEC-07: Expired guest credential is denied.
- SEC-08: Unauthorized Firestore write is denied.
- SEC-09: Unauthorized Storage upload is denied.
- SEC-10: Invalid order status transition is rejected.
- SEC-11: Product unavailable at checkout is rejected or safely corrected.
- SEC-12: Customer cannot read another customer's private data.

Security tests must use safe test accounts and test data, not production customer records.
