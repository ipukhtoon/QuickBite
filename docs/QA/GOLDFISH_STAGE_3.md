# Goldfish QA — Stage 3 Improvement Review

**Project:** QuickBite  
**Stage:** 3 — Improvement  
**Status:** Independent plan review complete  
**Implementation authorization:** NOT GRANTED

> Goldfish independently evaluates whether Stage 2 usability and customer-risk findings were addressed. This is a documentation review, not application interaction testing.

## Evidence classification

The improved plan is reviewed as a documentation artifact. Plan coverage is VERIFIED BY SOURCE (document review). Real application behavior remains NOT TESTABLE because no implementation/browser test environment was inspected.

## 1. Stage 2 findings disposition

| Finding | Improved-plan disposition | Goldfish assessment |
|---|---|---|
| GF-S2-001 restaurant context | Configurable real identity, operating status and service area; no fabricated values | Addressed in planning; real inputs remain open |
| GF-S2-002 guest privacy | High-entropy guest access/anonymous identity, no public reads, account claiming | Partially addressed; expiry, recovery and UX must be finalized |
| GF-S2-003 cart catalogue changes | Refresh authoritative prices/availability and require acknowledgement | Addressed in planning |
| GF-S2-004 uncertain submission | Idempotent backend operation and safe result recovery | Addressed in planning; UI states need acceptance tests |
| GF-S2-005 fulfilment eligibility | Configurable hours, zones, fees and server validation | Addressed; restaurant values remain open |
| GF-S2-006 product options | Required/min/max option rules, price deltas and server validation | Addressed in planning |
| GF-S2-007 staff workflow | Role boundaries and status lifecycle proposed | Partially addressed; queue sorting, alerts and accidental-action recovery need screen design |
| GF-S2-008 admin safeguards | Immutable order snapshots and catalogue/order separation | Addressed in planning |
| GF-S2-009 search/empty states | Combined filters, clear-all and screen states | Addressed in planning |
| GF-S2-010 cart vs orders | Cart is a distinct screen and persistent entry point | Addressed in planning |
| GF-S2-011 accessibility | Semantic controls, focus, labels, announcements and keyboard support | Addressed as requirement; not yet testable |
| GF-S2-012 mobile keyboard | Responsive layouts, safe areas and keyboard-aware forms | Addressed as requirement; requires device testing |
| GF-S2-013 order snapshots | Immutable item/option/price snapshots | Addressed in planning |
| GF-S2-014 shared-device privacy | Clear private local data on logout/account switch | Addressed; guest cart ownership needs detailed tests |

## 2. Remaining Goldfish concerns

### GF-S3-001 — Guest access lifecycle
- **Severity:** High
- **Evidence:** VERIFIED BY SOURCE (plan review)
- **Concern:** Guest credential expiry, rotation, recovery, device change and order claiming are not fully specified.
- **Recommendation:** Stage 4 must include a guest access lifecycle and explicit UX acceptance cases. Never expose raw access secrets in logs or analytics.

### GF-S3-002 — Staff queue usability
- **Severity:** Medium
- **Evidence:** VERIFIED BY SOURCE (plan review)
- **Concern:** Role boundaries/statuses exist, but high-volume queue behavior is not defined.
- **Recommendation:** Specify new-order visibility, refresh, sorting, status action confirmation and safe handling of accidental taps. Do not promise push notifications unless configured.

### GF-S3-003 — Customer-facing order statuses
- **Severity:** Medium
- **Evidence:** VERIFIED BY SOURCE (plan review)
- **Concern:** Internal identifiers are not customer-friendly language.
- **Recommendation:** Map internal states to concise labels and explain rejection/cancellation without exposing internal staff details.

### GF-S3-004 — Cash collection workflow
- **Severity:** Medium
- **Evidence:** VERIFIED BY SOURCE (plan review)
- **Concern:** Payment status must be distinct from order status; the plan says cash is collected at fulfilment but does not define the staff recording flow.
- **Recommendation:** Define authorized cash-collected recording and reconciliation. Never mark an order paid at placement.

### GF-S3-005 — Customer notifications
- **Severity:** Medium
- **Evidence:** NOT TESTABLE
- **Concern:** External notification channels are not configured.
- **Recommendation:** Provide in-app order status refresh at minimum. Treat SMS/email/push/WhatsApp as optional until provider, consent and cost are approved.

### GF-S3-006 — Measurable accessibility checks
- **Severity:** Medium
- **Evidence:** VERIFIED BY SOURCE (plan review)
- **Concern:** Accessibility is required but measurable test steps need more detail.
- **Recommendation:** Stage 4 acceptance criteria must include keyboard-only completion, visible focus, programmatic labels/errors, screen-reader announcement checks and touch-target review.

## 3. Persona readiness

| Persona | Improved-plan readiness | Remaining verification |
|---|---|---|
| First-time visitor | Restaurant context and availability planned | Verify visual clarity/discovery |
| Guest customer | Guest ordering and privacy model planned | Verify recovery, secure access and no forced registration |
| Registered customer | Auth and private orders planned | Verify ownership/account lifecycle |
| Returning customer | Cart and order snapshots planned | Verify stale cart and shared-device privacy |
| Restaurant administrator | Catalogue/settings/order management planned | Verify destructive safeguards and permissions |
| Restaurant staff | Restricted order workflow planned | Verify queue speed and accidental-action recovery |
| Beginner | Validation and feedback planned | Verify copy, recovery and error comprehension |
| Android mobile user | Responsive/keyboard-aware requirements planned | Test on actual Android browser/device |

## 4. Goldfish Stage 3 verdict

The improved plan materially addresses the major customer risks. Stage 4 must retain these unresolved items: guest credential lifecycle, staff queue interaction design, customer-facing order/payment status distinction, cash collection workflow, notification scope and measurable accessibility checks.

Goldfish accepts the improved plan as a basis for Stage 4 planning, not as implementation approval. No runtime behavior has been verified. Goldfish made no source-code, Firebase or production-data changes.
