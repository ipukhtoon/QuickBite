# QuickBite — Stage 2 Critical Reviewer

**Status:** REVIEW COMPLETED — not approved as-is. Stage 3 has NOT started.  
**Review basis:** independent challenge of Stage 1 architecture and direct inspection of source/docs on `main`. No code or production data changed.

## Reviewer conclusion
The modular Vite prototype is a reasonable starting point, but the architecture is not yet precise enough to become an implementation plan. The current app is a local UI demo, not a production ordering system. Findings describe readiness gaps and credible risks, not proof of a live production breach.

## Critical findings

### CR-01 — Trusted order boundary is undefined
**Severity: Critical | Evidence: VERIFIED BY SOURCE**  
Checkout disables order submission; no trusted order backend was found. “Use Cloud Functions” is not a complete contract. Define request/response schema, authentication context, authoritative catalogue lookup, option validation, integer-paisa calculation, atomic order creation, idempotency persistence, retry semantics and error handling before enabling Place Order.

### CR-02 — Firebase authorization is underspecified
**Severity: Critical | Evidence: VERIFIED BY SOURCE / POTENTIAL ISSUE**  
No Firebase rules/config were found in the inspected source. The proposed data model lacks a collection-by-collection read/write matrix. Define default-deny rules for guest/customer/staff/admin/server; keep authoritative order, status, role and report writes server-only; test with Firebase Emulator before deployment.

### CR-03 — Guest identity and order access lifecycle is missing
**Severity: High | Evidence: VERIFIED BY SOURCE**  
Guest navigation exists, but no secure guest-order credential flow exists. Define credential generation, delivery, protected storage, lookup, expiry, revocation, rate limits, recovery on another device and account linking. An order number alone must never grant access.

### CR-04 — Admin/staff permissions and workflow are incomplete
**Severity: High | Evidence: VERIFIED BY SOURCE**  
Admin routes are public in the demo router and currently have no role guard; screens are labelled local demo. No staff workflow exists. Define least-privilege role/action matrix, trusted provisioning/revocation, server enforcement, staff order queue, allowed status transitions and audit history. Client route guards are UX only, never security.

### CR-05 — Money is not integer-paisa end-to-end
**Severity: High | Evidence: VERIFIED BY SOURCE**  
Cart stores rupee values as JavaScript Numbers and converts with `Math.round(rupees * 100)`; customization deltas are also numeric rupees. This conflicts with mandatory integer-paisa rules. Use integer paisa in catalog, options, cart, cache, API and immutable order snapshots; format only at display boundaries.

### CR-06 — Workflow documentation conflicts
**Severity: Medium | Evidence: VERIFIED BY SOURCE**  
Project documents contain historical Stage 4/5 authorization statements inconsistent with the current user-directed state. A canonical register is required; preserve historical changelog entries and append corrections rather than silently rewriting history.

## High-priority architecture and UX findings

### CR-07 — Demo/production data-source boundary is absent
**Severity: High | Evidence: VERIFIED BY SOURCE**  
Bootstrap calls `getDemoCatalog()` for customer screens. Define explicit demo/development/production modes. Production must never silently fall back to demo data; distinguish remote, cached, offline, empty and error states.

### CR-08 — Welcome and Account journeys are incomplete
**Severity: Medium | Evidence: VERIFIED BY SOURCE**  
Welcome Get Started routes to Home, no Account route exists, and Account navigation leads to sign-in. Specify welcome decision tree, guest path and real Account destination for signed-in, signed-out and guest states.

### CR-09 — Async route rendering may become stale
**Severity: Medium | Evidence: VERIFIED BY SOURCE / POTENTIAL ISSUE**  
Bootstrap invokes async cart/checkout loaders during route rendering without an obvious route-generation guard in the inspected bootstrap. A slow IndexedDB response may overwrite a newer route unless loaders guard completion. Test rapid navigation under delayed storage responses.

### CR-10 — IndexedDB migration and reconciliation strategy is incomplete
**Severity: Medium | Evidence: VERIFIED BY SOURCE**  
Cart DB is version 1; broader migrations, malformed legacy records, multi-tab behavior and stale product reconciliation are unspecified. Define versioned migrations and preserve cart intent, but revalidate all items and prices with the server at order submission.

### CR-11 — Visual acceptance lacks measurable thresholds
**Severity: High | Evidence: VERIFIED BY SOURCE**  
Reference spec requires screenshot comparison but does not set measurable tolerances or required evidence naming. Define per-screen crop/viewport, overlay or difference procedure, geometry/spacing/type checks and explicit blockers for missing reference photography. Do not claim pixel-perfect identity without evidence.

### CR-12 — Production image asset pipeline is missing
**Severity: High | Evidence: VERIFIED BY SOURCE**  
Welcome/demo use remote Unsplash; Home hero is a CSS QB placeholder; a consistent bundled asset library was not found. Define licensed/provenance-tracked local assets, canonical product images, responsive variants, optimization, focal points, cache/offline behavior and fallbacks.

### CR-13 — Staff workflows are absent from product scope
**Severity: High | Evidence: VERIFIED BY SOURCE**  
The product ambition includes staff, but no staff module or kitchen/order queue exists in the 12-screen reference. Define required staff screens, order alerts, concurrency handling, status transitions and audit history before Stage 4.

### CR-14 — Restaurant operational configuration is unresolved
**Severity: High | Evidence: VERIFIED BY SOURCE**  
Checkout explicitly says delivery fee, coverage, taxes and final total are not configured. Define restaurant hours/timezone, pickup location, delivery zones/fees, minimum order, tax policy and acceptance rules as user-approved settings. Keep ordering disabled until required values are configured and server-validated.

## Medium/low findings

### CR-15 — Router has no explicit not-found/access policy
**Severity: Medium | Evidence: VERIFIED BY SOURCE**  
Unknown routes silently fall back to Home; Account and not-found routes are absent. Specify unknown-route behavior, query parsing, route metadata, focus and browser history.

### CR-16 — Shared validation/phone contract is missing
**Severity: Medium | Evidence: VERIFIED BY SOURCE**  
Forms use native validity but have no shared client/server phone normalization and field-error contract. Define only after confirming the restaurant's accepted phone formats.

### CR-17 — Green CI is not a product release gate
**Severity: Medium | Evidence: VERIFIED BY SOURCE**  
Current checks are unit/source tests and Vite build. They do not prove browser, Android, Firebase rules, security or visual fidelity. Add browser E2E, Firebase Emulator, screenshot regression, Android device and release smoke gates; mark unavailable gates honestly.

### CR-18 — Global stylesheet is accumulating
**Severity: Low | Evidence: VERIFIED BY SOURCE**  
Large combined stylesheet increases regression risk. Plan modular organization only alongside visual regression coverage.

### CR-19 — No package lockfile
**Severity: Medium | Evidence: VERIFIED BY SOURCE**  
A lockfile was not found in the inspected tree. Commit a package manager lockfile and use deterministic CI installation.

## Goldfish independent persona challenge

| Persona | Finding | Severity |
|---|---|---|
| First-time visitor | Get Started meaning and registration requirement unclear | Medium |
| Guest customer | Secure guest order access/recovery absent; checkout cannot submit | High |
| Registered customer | Verification, reset, session expiry and account lifecycle undefined | High |
| Returning customer | No Account route, order history or reorder | Medium |
| Restaurant administrator | Provisioning, least privilege, audit and self-promotion prevention undefined | High |
| Restaurant staff | No queue, status controls or staff permissions | High |
| Beginner | Demo/live/offline/failure feedback needs clearer recovery | Medium |
| Android user | Keyboard, safe areas, slow network, rapid route changes and storage failures not interaction-tested | High |

## Stage 3 must resolve
1. Explicit demo/production source boundary and no silent demo fallback.
2. Guest identity, access, expiry, recovery and account linking.
3. Customer/staff/admin/server permission matrix and Firebase rules.
4. Versioned order API, atomic persistence and idempotency/retry contract.
5. Integer-paisa canonical data contract and rounding policy.
6. Order state machine, cancellation policy ownership and audit trail.
7. Restaurant configuration schema and required operational values.
8. Staff screen/workflow scope.
9. Welcome decision tree and Account route.
10. IndexedDB migrations and async route lifecycle.
11. Asset provenance/pipeline and objective visual acceptance thresholds.
12. Browser, emulator, visual and Android test gates.
13. Reproducible dependency lockfile/CI.
14. Canonical workflow register and changelog discipline.

## Stage 2 outcome
**Not approved as-is.** The architecture direction is viable but requires these decisions before it can become a safe, testable implementation plan.

This review does not begin Stage 3. No source code, Firebase data or deployment was changed. Stage 3 begins only on explicit user instruction.
