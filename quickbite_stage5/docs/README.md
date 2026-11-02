# QuickBite — Project Documentation

**Status:** Stage 4 approval pending. Stage 5 is not authorized.

QuickBite is a premium, single-restaurant food-ordering application. This documentation set is the living project record and must be maintained as the project evolves.

## Read in this order
1. `PROJECT_BRIEF.md` — product definition, scope and quality target.
2. `MANDATORY_RULES.md` — non-negotiable development and QA rules.
3. `REFERENCE_DESIGN_SPEC.md` — visual authority and 12-screen requirements.
4. `ARCHITECTURE.md` — frontend, backend and offline architecture.
5. `DATA_MODEL.md` — Firestore and IndexedDB contracts.
6. `SECURITY.md` — identity, permissions and trust boundaries.
7. `QA_GOLDFISH.md` — independent QA rules and evidence.
8. `WORKFLOW_AND_APPROVALS.md` — mandatory five-stage workflow.
9. `DECISIONS_AND_OPEN_QUESTIONS.md` — unresolved restaurant and deployment decisions.
10. `CHANGELOG.md` — chronological project history.

## Stage status
| Stage | Status |
|---|---|
| 1 — Architect | Completed |
| 2 — Critical Reviewer | Completed |
| 3 — Improvement | Completed |
| 4 — Approval | Specification prepared; **not approved** |
| 5 — Implementation | Not authorized; not started |

## Documentation control
These files are project requirements, not proof that functionality has been implemented. After each stage is completed and explicitly approved by the user:
- Update the relevant specification files.
- Record the stage outcome and approval status.
- Add a dated entry to `CHANGELOG.md`.
- Record changed requirements, rationale, evidence, risks and open questions.
- Never change an approved requirement silently.

The user's explicit approval is required before moving into Stage 5 implementation.
