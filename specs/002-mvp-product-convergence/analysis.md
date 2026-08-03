# Cross-Artifact Analysis: YouTube-to-Private-Lesson MVP

**Analyzed:** 2026-08-03 after owner correction  
**Artifacts:** constitution, roadmap, Spec 001 evidence, revised Spec 002 spec/plan/research/data model/contract/quickstart/tasks/checklist, current priority, owner decision

## Executive Result

```text
Core owner product decision: CONFIRMED
Specification completeness:  PASS
Constitution alignment:      PASS FOR PRIVATE AI-DRAFT FLOW
Task coverage:               PASS
Critical contradictions:     0
Implementation readiness:    CONDITIONAL
Implementation authorization: NOT YET RECORDED
```

## Corrected Product Consistency

Every revised artifact now defines the same journey:

```text
truthful YouTube-to-lesson landing
→ authentication
→ URL-first dashboard
→ supported YouTube validation
→ timed transcript acquisition
→ bounded natural interaction selection
→ live Gemini structured generation
→ source-evidence validation
→ atomic owner-private ai_draft
→ first listen / support / retrieval / speech / transfer
→ bounded progress
→ private library and return
```

No artifact treats a fixed public catalog as the MVP. Human review/publication is
reserved for later sharing/catalog scope.

## Constitution Alignment

| Principle | Revised MVP response |
| --- | --- |
| Natural Communication First | The learner chooses a real YouTube interaction; the lesson begins from its situation and practical goal. |
| Evidence-Bound Generation | Source-dependent generated content validates against bounded timed cues; unsupported output is rejected. |
| Transfer Before Completion | Retrieval, speak confirmation, and changed-context transfer are completion gates. |
| Rights, Privacy, Safety | Official playback, no re-hosting, private AI drafts, visible warnings, owner RLS, no raw learner audio/free text. |
| Small Testable Delivery | One supported URL-to-private-lesson vertical slice. |
| Measurable Evidence | Repo checks, live provider evidence, browser behavior, and product/learning outcomes remain distinct. |

Potential tension between human review and learner-visible AI content is resolved by
the existing private-draft boundary: generated content is visibly unreviewed,
owner-private, source-evidence checked, and not eligible for public publication.
Public/shared use still requires human review.

## Requirement-to-Task Coverage

| Requirement area | Primary tasks | Result |
| --- | --- | --- |
| Owner decision/fresh-main integration | T001–T010 | Covered |
| Truthful landing/auth/bootstrap | T011–T020 | Covered |
| URL-first dashboard/navigation | T021–T025 | Covered |
| YouTube URL/source/playback | T026–T029 | Covered |
| Transcript adapter/policy/failures | T030–T040 | Covered |
| Compiler/Gemini/schema/evidence | T041–T048 | Covered |
| Deterministic atomic private draft | T049–T058 | Covered |
| Environment-first lesson runtime | T059–T069 | Covered |
| Bounded progress/private library/return | T070–T076 | Covered |
| Privacy-safe analytics/resilience/pruning | T077–T082 | Covered |
| Exact-head repo/hosted/live/browser gates | T083–T096 | Covered |
| Convergence/owner/merge/deploy gates | T097–T102 | Covered |

No functional requirement is orphaned.

## User Story Independence

- **US1** can prove landing/auth/URL-first dashboard with controlled generation stubs while preserving provider gates.
- **US2** can prove supported/unsupported source handling, transcript, live compiler, evidence validation, and atomic private persistence.
- **US3** can run against one persisted controlled private draft and prove learning completion semantics.
- **US4** can prove library/return and two-user isolation with one generated lesson.
- **US5** adds final hosted/live/Vercel evidence without changing product semantics.

## Branch and Toolchain Consistency

All artifacts agree:

- implementation begins from current `main`;
- PR #54 is not merged wholesale;
- main's Node/npm/package-lock baseline is retained;
- selected Spec 001 code is ported through a manifest;
- hosted Supabase/Vercel projects are reused;
- environment/types must point to the same Supabase project;
- migration, preview, merge, and production deploy remain owner-gated.

## Data Consistency

The revised data model reuses the hosted private draft tables and atomic RPC rather
than designing around a public catalog. A bounded attempt table is conditional on
an explicit storage decision. Static fixtures cannot satisfy live generation or
private-library acceptance.

## Remaining Hard Decisions

1. Exact transcript adapter/private-production decision: mode, supported video conditions, reliability/terms/rights risks, warnings, rollback.
2. Availability of a bounded `GEMINI_API_KEY` workflow for live success/failure verification.
3. Existing progress/evidence storage versus a small `real_talk_attempts` table.
4. Exact treatment of legacy routes outside primary navigation.
5. Explicit authorization to begin implementation.

Each decision has a task gate; none is silently assumed.

## Scope-Escape Checks

Blocked without a new approved spec:

- public/shared lesson catalog;
- automatic publication;
- full reviewer UI;
- bulk YouTube crawling/generation;
- support for every YouTube video;
- media download/re-hosting;
- broad curriculum/gamification/social/payment/native-app expansion;
- pronunciation scoring or raw learner audio retention.

## Planning Convergence Decision

```text
Planning artifacts:         CONVERGED AFTER OWNER CORRECTION
Core product direction:     YOUTUBE URL → PRIVATE LESSON
Implementation scope:       WELL-BOUNDED
Implementation start:       BLOCKED UNTIL EXPLICIT AUTHORIZATION
Merge recommendation:       NOT APPLICABLE — PLANNING ONLY
Deployment recommendation:  DO NOT DEPLOY
```

After implementation authorization, execute T003–T010 before changing learner-facing code.