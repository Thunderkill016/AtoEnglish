# Cross-Artifact Analysis: Private Natural Lesson Compiler

**Date**: 2026-08-02

## Scope analyzed

- `.specify/memory/constitution.md`
- `specs/000-atoenglish-rebuild-roadmap/`
- `specs/001-private-natural-lesson-compiler/`
- current code on `agent/rebuild-learning-core`
- `supabase/migrations/20260802190000_real_talk_private_draft_gate.sql`
- Real Talk unit, contract, and integration-test artifacts

## Current conclusion

The active artifacts still agree on one bounded outcome:

```text
authenticated editor
→ bounded source evidence
→ private environment-first AI draft
→ schema and evidence gates
→ owner-private persistence
→ private preview with transfer
```

Publication, curriculum sequencing, delayed review, rewards, payments, and
deployment remain outside spec 001.

Compiler and evidence artifacts are substantially complete. This iteration also
adds the missing private-database boundary artifacts:

- canonical RLS migration design;
- migration contract tests;
- isolated persisted-row mapping;
- reload mapping tests;
- two-owner plus anonymous integration scaffolding.

None of those artifacts has been executed against the exact current head or an
authorized migrated Supabase project. Spec 001 therefore remains unverified and
not converged.

## Constitution alignment

| Principle | Status | Evidence / remaining gap |
|---|---|---|
| Natural Communication First | Aligned in design | Environment, roles, practical goal, communication events, retrieval, production, and transfer are present; browser and human review remain open |
| Evidence-Bound Generation | Aligned in code, unverified | Zod, eleven-code evidence matrix, source normalization, escaped prompt framing, and no-write orchestration artifacts exist; exact-head and live-provider runs remain open |
| Transfer Before Completion | Aligned in code, unverified | Preview requires phrase acknowledgement and changed-context response; component/browser tests remain open |
| Rights, Privacy, Safety | Partially aligned | Official playback, production transcript fail-closed behavior, private draft repository, canonical RLS design, and owner-isolation scaffold exist; approved production transcript and observed RLS evidence remain open |
| Small Independent Delivery | Aligned | Compiler, application orchestration, prompt builder, transcript policy, repository, mapping, and migration boundaries are separated; spec 002 remains excluded |
| Measurable Evidence | Aligned in artifacts, unverified | Stable codes, controlled fixtures, migration assertions, RLS scaffold, and exact-head gates exist; observed results are absent |

No constitution exception has been approved.

## Implemented and represented

### Generation boundary

- validated request contract;
- authentication before rate limit, transcript, Gemini, or persistence;
- dependency-injected orchestration;
- stable machine-readable failures;
- bounded retry guidance and safe client messages;
- experimental transcript adapter isolated and production-blocked;
- deterministic interaction-window selection;
- environment-first structured Gemini request;
- actual successful model tracking;
- no saved or preview success after persistence failure.

### Evidence and prompt boundary

- runtime Zod validation;
- invalid required-branch fixture;
- complete eleven-code source-evidence rejection matrix;
- duplicate failure-code suppression;
- conservative punctuation, contraction, selected entity, and caption-artifact
  matching;
- long-source fixture with the useful conversation deep in the source;
- metadata encoded as escaped JSON;
- captions encoded as escaped JSONL with source indices and timings;
- `<`, `>`, and `&` escaped to prevent literal delimiter spoofing;
- governing instructions before and after the untrusted source block;
- prompt-injection-like compiler failure cannot reach persistence.

Prompt framing is a hardening boundary, not proof of universal model-level prompt
injection immunity.

### Persistence identity and reload

- one current draft per owner + YouTube source + requested level;
- identity independent of AI-generated title;
- dedicated private draft repository;
- environment, communication events, transfer, warnings, model, and review state
  are persisted;
- `src/features/real-talk/server/draft-mapping.ts` owns DB-row to domain mapping;
- action code no longer duplicates reload mapping;
- mapping tests preserve environment, events, transfer, warnings, model, status,
  source segment, and conservative fallbacks.

### Migration and RLS design

The migration now:

- defaults generated video rows to private;
- returns existing user-created rows to private state;
- clears unverified review metadata on those lessons;
- constrains lesson generation status;
- explicitly enables RLS on both Real Talk tables;
- removes every previous policy before creating the canonical policy set;
- allows public reads while limiting private reads to the owner;
- requires authenticated ownership for video inserts;
- prevents ordinary users from setting `is_public = true`;
- requires ordinary lesson inserts and updates to remain unreviewed `ai_draft`;
- prevents cross-owner lesson writes through another user's video;
- limits owner deletion to private draft rows.

Removing every previous policy is necessary because PostgreSQL combines
permissive policies with OR. Leaving an older policy under a different name could
silently bypass a new restrictive-looking policy.

### Database test artifacts

`src/__tests__/real-talk-migration-contract.test.ts` statically locks:

- private defaults and legacy repair;
- RLS enablement;
- complete old-policy reset;
- canonical select, insert, update, and delete invariants;
- prevention of publication and review-state elevation.

`src/__tests__/integration/real-talk-draft-rls.integration.test.ts` prepares a
real non-production run with temporary owner A, owner B, and anonymous clients.
It covers:

- anonymous insert denial;
- owner reload;
- cross-owner and anonymous read isolation;
- cross-owner update/delete denial;
- owner publication denial;
- owner review-state elevation denial;
- approved lesson insert denial;
- foreign-parent lesson insert denial;
- public catalog exclusion;
- cleanup of rows and temporary users.

The integration scaffold uses unique video IDs per run to reduce collision risk
after interrupted cleanup.

## Remaining gaps

### 1. Exact-head technical execution

No recorded result exists for:

- ESLint;
- TypeScript;
- targeted Vitest suites;
- full unit tests;
- content-standard tests;
- production build.

Test files existing in the repository do not satisfy these gates.

### 2. Supabase migration and RLS evidence

The migration has not been applied or dry-run in an authorized non-production
project. Therefore the following remain unobserved:

- SQL compatibility with the actual hosted schema;
- canonical policy replacement;
- owner A/B/anonymous behavior;
- service-role cleanup behavior;
- repeated-generation updates;
- partial video-write and lesson-write failure behavior;
- generated type reconciliation.

T054, T062, and T063 remain blocking.

### 3. Direct Gemini behavior

Mocked orchestration does not prove raw provider handling. Required live checks
still include valid JSON, missing candidates, malformed JSON, schema failure,
429, provider failure, evidence failure, and adversarial source content.

### 4. Production transcript source

The only concrete transcript adapter remains experimental and is blocked in
production. Spec 001 cannot be production-ready until an approved mode is
implemented or the feature is explicitly retained as non-production.

### 5. Preview evidence

Environment and transfer code exists, but component tests, desktop/mobile browser
runs, and human lesson-coherence review remain open.

### 6. Legacy and lifecycle decisions

The following decisions remain explicit rather than hidden:

- owner draft retention and deletion UX;
- partial-write reconciliation strategy;
- immutable generation-attempt history;
- treatment of legacy creatorless public database rows when spec 002 introduces
  explicit review/publication state;
- immutable columns for current-draft identity if direct client editing becomes
  a supported workflow.

## Success-criteria evidence map

| Criterion | Planned evidence | Current state |
|---|---|---|
| SC-001 auth before external work | mocked orchestration + exact-head run | Artifact exists; not executed |
| SC-002 drafts private | migration contract + migrated RLS run | Design and artifacts exist; not observed |
| SC-003 private drafts absent from catalog | anonymous RLS integration query | Scaffold exists; not run |
| SC-004 unsupported content rejected | evidence matrix + no-write tests | Artifacts exist; not run |
| SC-005 valid fixture persists complete draft | mocked happy path + DB integration | Mock artifact exists; DB proof absent |
| SC-006 cross-user access denied | owner A/B/anonymous integration | Scaffold exists; not run |
| SC-007 reload preserves fields and repeat generation updates one draft | mapping tests + DB repeat/reload | Mapping artifact exists; DB proof absent |
| SC-008 transfer required | component/browser tests | Code exists; tests missing |
| SC-009 exact-head checks pass | lint, tsc, tests, content, build | Not run |
| SC-010 provenance/warnings visible | browser/manual inspection | UI/code exists; not observed |

## Task consistency

The task ledger now correctly distinguishes:

- implemented code;
- test/scaffold artifacts;
- exact-head execution;
- hosted database evidence;
- live provider evidence;
- browser and human evidence.

T019, T053, and T055 are implemented artifacts. T054 and T062 remain unchecked
because no non-production database run has occurred.

## Result

**Specification readiness**: Ready for bounded implementation and testing.

**Compiler/evidence artifacts**: Complete for the current boundary.

**Private database artifacts**: Implemented but unexecuted.

**Implementation convergence**: Not ready.

**Production readiness**: Not claimed.

## Critical next tasks

1. T065–T068: preview component tests;
2. T076–T081: exact-head technical execution;
3. T062 then T054/T063: authorized migration, RLS run, and type regeneration;
4. T082: direct Gemini success/failure/adversarial verification;
5. T084: production transcript-source decision;
6. desktop/mobile and human review evidence;
7. final requirement-to-evidence convergence mapping.
