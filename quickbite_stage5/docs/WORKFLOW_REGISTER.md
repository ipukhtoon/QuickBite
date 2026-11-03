# QuickBite — Development Workflow Register

## Canonical project record
This document is the navigation index for the mandatory five-stage workflow and its durable project records. Update it at every stage transition, approval, completion, and material decision. Keep detailed stage evidence in the linked stage documents; do not replace historical records.

Repository: https://github.com/ipukhtoon/QuickBite  
Application source: `quickbite_stage5/`  
Default branch: `main`

## Product and operating constraints
- QuickBite is a single-restaurant food-ordering application, not a marketplace.
- Technology: HTML5, CSS3, Vanilla JavaScript ES modules, Vite, IndexedDB and Firebase services as approved.
- Android-first; user works primarily from Android and should not be assumed to have a PC.
- The supplied 12-screen reference montage and its completed Version 1.5 reconstruction are the visual authority.
- Preserve existing functionality. Do not invent restaurant policies, live data, prices, reviews, ratings, discounts, order statuses, ETA or GPS.
- Developer implements; Goldfish independently inspects and reports, never edits source or production data.
- No implementation during Stages 1–4. Stage 5 requires explicit user approval of the final Stage 4 plan.
- A request to document, inspect or plan is not implementation approval.

## Five-stage workflow
1. **Stage 1 — Architect:** inspect actual files, architecture, dependencies, current functionality and risks. Goldfish maps personas, journeys, accessibility, usability and test scenarios. No coding.
2. **Stage 2 — Critical Reviewer:** independently challenge the Stage 1 architecture, assumptions, security, data integrity, performance, maintainability and customer/staff/admin journeys. Goldfish must disagree where evidence warrants it. No coding.
3. **Stage 3 — Improvement:** incorporate valid criticism, resolve design weaknesses, define consolidated requirements, acceptance criteria and tests. No coding.
4. **Stage 4 — Approval:** present final plan, unique requirement IDs, affected files, UI/backend/security changes, Goldfish criteria, acceptance tests and unresolved risks. Wait for explicit user approval. No coding.
5. **Stage 5 — Implementation:** implement only the approved plan. Goldfish independently verifies actual output, reports evidence and defects, and retests fixes. Goldfish never modifies code or data.

## Goldfish evidence and severity
Evidence labels:
- VERIFIED BY INTERACTION
- VERIFIED BY SOURCE
- VISUAL OBSERVATION
- POTENTIAL ISSUE
- NOT TESTABLE

Severity:
- Critical: data exposure, unauthorized access, order/payment integrity failure, or core journey unusable.
- High: major journey broken or serious visual/functional failure.
- Medium: meaningful usability, validation or consistency issue.
- Low: minor polish or non-blocking improvement.

Required personas: first-time visitor, guest customer, registered customer, returning customer, restaurant administrator, restaurant staff, beginner, Android user.

## Stage records
| Stage | Record | Status at last update |
|---|---|---|
| Stage 1 — Reference Reconstruction | `docs/REFERENCE_DESIGN_SPEC.md` plus Version 1.5 handoff | COMPLETE |
| Stage 1 — Actual Architecture Inspection | `docs/STAGE_1_ARCHITECTURE_INSPECTION.md` | COMPLETE |
| Stage 2 — Critical Reviewer | `docs/STAGE_2_CRITICAL_REVIEW.md` | COMPLETE — review recorded |
| Stage 3 — Improvement | `docs/STAGE_3_IMPROVED_ARCHITECTURE.md` | COMPLETE — consolidated architecture, 29 requirements, 32 acceptance tests |
| Stage 4 — Approval | To be recorded when prepared | NOT STARTED |
| Stage 5 — Implementation | To be recorded when authorized | NOT STARTED |

## Stage transition rules
- Do not advance stages automatically.
- At each stage completion, update this register and append a dated entry to `docs/CHANGELOG.md`.
- Keep requirements, decisions, risks, evidence and approval state traceable.
- If GitHub cannot be updated, state that clearly and do not claim persistence.
- This repository is the durable source of truth for project workflow records. ChatGPT's internal Memory cannot be directly edited by a repository commit; use this register as the recovery point when continuing in a new chat.

## Current authorization state
- Stage 1: complete.
- Stage 2: complete.
- Stage 3: complete.
- Stage 4: not started; final implementation authorization package not yet approved.
- Stage 5: not authorized; no implementation may begin.

## Supporting project records
- `docs/PROJECT_BRIEF.md`
- `docs/MANDATORY_RULES.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/SECURITY.md`
- `docs/QA_GOLDFISH.md`
- `docs/REFERENCE_DESIGN_SPEC.md`
- `docs/STAGE_3_IMPROVED_ARCHITECTURE.md`
- `docs/CHANGELOG.md`
