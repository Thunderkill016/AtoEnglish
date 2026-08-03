# Cross-Artifact Analysis: AtoEnglish MVP Product Convergence

**Analyzed:** 2026-08-03  
**Artifacts:** constitution, roadmap, Spec 001 evidence, Spec 002 specification,
plan, research, data model, product contract, quickstart, requirements checklist,
and task ledger

## Executive Result

```text
Specification completeness: PASS
Constitution alignment:     PASS
Task coverage:              PASS
Implementation readiness:   CONDITIONAL
Critical contradictions:    1 roadmap numbering conflict to reconcile
Owner authorization:        NOT GRANTED
```

The MVP has a coherent product boundary and dependency-ordered plan. It is not yet
authorized for implementation because owner decisions, initial source feasibility,
and roadmap priority must be confirmed.

## Product Consistency

All Spec 002 artifacts define the same critical learner journey:

```text
truthful landing
→ authentication and idempotent bootstrap
→ focused dashboard
→ database-only reviewed catalog
→ environment-first lesson
→ first encounter
→ progressive support
→ productive retrieval
→ speak-and-confirm
→ changed-context transfer
→ bounded private persistence
→ return/continue/review
```

No artifact requires XP, streak, leagues, flashcards, grammar, writing, broad
speaking tools, notifications, payments, or social systems for MVP completion.

## Constitution Alignment Matrix

| Constitution principle | Spec 002 implementation |
| --- | --- |
| Natural Communication First | One environment and reviewed natural lessons are the entire learner-facing learning surface. |
| Evidence-Bound Generation | Database catalog fails closed; static samples and unreviewed drafts are forbidden. |
| Transfer Before Completion | Runtime and database completion require a changed-context attempt. |
| Rights, Privacy, Safety | Provider-neutral lawful playback, human review, RLS, bounded attempt data, no raw audio/free text. |
| Small Independently Testable Delivery | One environment, three lessons, one complete journey, legacy modules deferred. |
| Measurable Learner/Product Evidence | Funnel events and attempts are bounded; CI is not treated as effectiveness evidence. |

No constitutional waiver is required.

## Requirement-to-Task Coverage

| Requirement | Primary tasks | Coverage result |
| --- | --- | --- |
| FR-001 truthful promise | T011–T014, T075 | Covered |
| FR-002 protected MVP routes | T020–T021, T027 | Covered |
| FR-003 server/idempotent bootstrap | T015–T019 | Covered |
| FR-004 focused navigation | T022, T075–T076 | Covered |
| FR-005 DB-only catalog/no static fallback | T035–T037, T043 | Covered |
| FR-006 reviewed publication eligibility | T035, T039–T044 | Covered |
| FR-007 lawful official playback | T030–T034 | Covered |
| FR-008 provider-neutral sources | T030–T034, T044 | Covered |
| FR-009 traceable learner claims | T039–T043, T091 | Covered |
| FR-010 completion gates | T049–T055, T089–T090 | Covered |
| FR-011 microphone-independent speech | T052, T056 | Covered |
| FR-012 bounded owner-private persistence | T058–T068 | Covered |
| FR-013 idempotent writes | T016–T017, T059–T066 | Covered |
| FR-014 focused dashboard | T023–T025 | Covered |
| FR-015 deferred routes not MVP | T022, T075–T076 | Covered |
| FR-016 reuse hosted infrastructure | T006–T007, T044, T079 | Covered |
| FR-017 same project/types/environment | T006–T007, T079 | Covered |
| FR-018 fresh-main selective port | T002–T005, T028 | Covered |
| FR-019 disable experimental ingestion/generation | T036–T038, T043 | Covered |
| FR-020 three human-reviewed lessons | T039–T044, T091 | Covered |
| FR-021 privacy-safe events | T070–T073 | Covered |
| FR-022 complete verification gate | T080–T093 | Covered |
| FR-023 preview runtime health | T094–T097 | Covered |
| FR-024 owner release gates | T098–T104 | Covered |

All functional requirements map to one or more exact implementation/verification
tasks. No orphan requirement was found.

## User Story Independence

### US1 — Entry/auth/dashboard

Can be developed and demonstrated with controlled reviewed-lesson fixtures before
hosted publication. It creates value by proving activation and shell coherence.

### US2 — Reviewed catalog

Can be verified independently with hosted reviewed/public/private rows. It does
not require learner attempt persistence.

### US3 — Lesson runtime

Can be tested against a reviewed immutable fixture/package before final hosted
publication. Completion semantics are independent of dashboard complexity.

### US4 — Persistence/return

Can be tested with one reviewed lesson and two authenticated users. It does not
require analytics or broad catalog expansion.

### US5 — Pilot operations

Depends on the first four stories but does not change their product semantics. It
adds bounded instrumentation, resilience, preview, and operational evidence.

The story split is independently stoppable and respects the constitution.

## Data-Model Consistency

The product contract requires bounded progress fields. The data model offers two
valid implementation paths:

1. strict typed reuse of existing evidence storage; or
2. a small `real_talk_attempts` table.

Task T058 forces a recorded decision before DDL. This is not a contradiction; it
is an intentionally deferred implementation choice with the same external
contract.

Provider-neutral source fields are required because the verified source pipeline
already uses Wikimedia/DVIDS while the current video table requires YouTube
identity. Tasks T030–T034 and T044 cover the migration, playback, and hosted
verification.

## Branch and Toolchain Consistency

All artifacts agree that:

- implementation begins from current `main`;
- PR #54/Real Talk branch is not merged wholesale;
- the current main package/lock/toolchain baseline is retained;
- selected Real Talk security/domain/runtime work is ported through a manifest;
- hosted Supabase and Vercel projects are reused;
- deployment and migration remain owner-gated.

No artifact authorizes branch-level merge, automatic deployment, or replacement
infrastructure.

## Critical Conflict: Roadmap Numbering

The existing rebuild roadmap defines its planned `002` as **Human Review and
Publication Gate**. This planning branch introduces `002-mvp-product-convergence`.
The new MVP spec includes only the minimum controlled publication operation and
runtime necessary for a usable product; it does not implement the future full
reviewer/publication system.

**Required resolution before implementation**:

- update `specs/000-atoenglish-rebuild-roadmap/roadmap.md` to record the owner
  reprioritization;
- make `002 — MVP Product Convergence` the active spec;
- move the full reviewer/publication operations to a later spec number;
- preserve Spec 001 as reusable compiler/provenance evidence rather than claiming
  it converged.

Task T008 covers this change after owner acceptance. Until then, implementation
readiness remains conditional.

## Non-Critical Open Decisions

These decisions are bounded and do not change the MVP promise:

1. **Initial environment** — default `Meet someone new`; owner/source feasibility
   may select another initial environment.
2. **Three source packages** — must pass lawful-use and human-review gates.
3. **Attempt storage** — strict reuse versus new bounded table.
4. **Publication status values** — reconcile exact existing constraints before
   writing the public query/migration.
5. **Deferred routes** — hide only versus redirect/feature flag when direct access
   creates a critical contradiction.
6. **Playback composition** — final mix of YouTube embed versus direct reviewed
   public-domain/owned media.

Each decision has an explicit owner/task gate and no task assumes its outcome.

## Scope-Escape Checks

The following potential expansions are explicitly blocked:

- broad curriculum/capability graph;
- five-environment catalog;
- delayed transfer scheduler;
- full reviewer dashboard;
- arbitrary source ingestion;
- pronunciation assessment;
- raw audio/transcript retention;
- XP/streak/league redesign;
- removal/refactor of every legacy route;
- new microservice or analytics platform;
- payments/social/native apps.

A task requiring one of these must stop and create a separate approved spec.

## Verification Completeness

The task ledger distinguishes:

- local/unit/contract evidence;
- hosted Supabase migration/RLS/advisor/type evidence;
- human content review;
- production-build browser evidence;
- Vercel preview/runtime-log evidence;
- owner product acceptance;
- merge and production deployment authorization.

No mock or old branch check is accepted as a substitute for final exact-head
browser, hosted, human, or owner evidence.

## Planning Convergence Decision

```text
Planning artifacts:       CONVERGED
Implementation scope:     WELL-BOUNDED
Implementation start:     BLOCKED ON OWNER ACCEPTANCE + ROADMAP RECONCILIATION
Merge recommendation:     NOT APPLICABLE — PLANNING ONLY
Deployment recommendation: DO NOT DEPLOY
```

After owner acceptance, complete T001–T010 before changing learner-facing code.