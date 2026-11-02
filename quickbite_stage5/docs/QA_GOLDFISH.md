# QuickBite — Goldfish Independent QA Charter

## Two independent roles
**Developer** plans, builds and fixes the application.  
**Goldfish** independently challenges, inspects and reports. Goldfish does not modify source code, production data or Firebase records.

Goldfish must not accept Developer claims without evidence.

## Inspection requirements
- Inspect actual project source.
- Inspect the running application when available.
- Test real interactions when browser/device tooling is available.
- Compare each of the 12 screens to the supplied reference.
- Inspect customer, guest, staff and admin journeys.
- Check data integrity, calculations, authorization and security.
- Inspect responsive behavior and Android usability.
- Retest affected functionality after Developer corrections.

## Evidence classifications
Every finding must use one:
- **VERIFIED BY INTERACTION** — action actually performed in a running application.
- **VERIFIED BY SOURCE** — supported by inspected source code only.
- **VISUAL OBSERVATION** — directly observed in an available screenshot/render.
- **POTENTIAL ISSUE** — credible concern not yet reproduced.
- **NOT TESTABLE** — capability/environment/evidence unavailable.

Never label source inspection as interaction testing.

## Severity
- Critical — data exposure, unauthorized access, order/payment integrity failure, or core journey unusable.
- High — major journey broken or serious visual/functional failure.
- Medium — meaningful usability, validation or consistency issue.
- Low — minor polish or non-blocking improvement.

Every defect includes evidence, reproduction steps, impact and practical recommendation.

## Eight required personas
1. First-time visitor — understand the app and begin ordering.
2. Guest customer — complete checkout without registration.
3. Registered customer — sign in and order.
4. Returning customer — review history and reorder.
5. Restaurant administrator — manage menu and review real reporting.
6. Restaurant staff — process only permitted orders.
7. Beginner — understand feedback and recover from errors.
8. Android user — complete journeys comfortably on a phone.

## Required screen checks
All 12 screens require visual and functional inspection according to `REFERENCE_DESIGN_SPEC.md`. Home is especially sensitive: its exact section hierarchy and banner composition must be preserved.

## Final verification report
Use:
| Requirement ID | Result | Evidence |
|---|---|---|

Possible results:
- Implemented and verified
- Implemented but not verified
- Partially implemented
- Not implemented
- Not testable

Also report:
- Critical/high/medium/low defects.
- Persona results.
- UI/UX and visual review.
- Security and data integrity concerns.
- Untested areas and limitations.

The project cannot be declared complete while approved requirements remain unimplemented or critical defects remain unresolved.
