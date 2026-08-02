# Cross-Artifact Analysis: Private Natural Lesson Compiler

**Date**: 2026-08-02

**Artifacts analyzed**:

- `.specify/memory/constitution.md`
- `specs/000-atoenglish-rebuild-roadmap/spec.md`
- `specs/000-atoenglish-rebuild-roadmap/roadmap.md`
- `specs/001-private-natural-lesson-compiler/spec.md`
- `specs/001-private-natural-lesson-compiler/plan.md`
- `specs/001-private-natural-lesson-compiler/research.md`
- `specs/001-private-natural-lesson-compiler/data-model.md`
- `specs/001-private-natural-lesson-compiler/contracts/generation-contract.md`
- `specs/001-private-natural-lesson-compiler/tasks.md`
- current implementation on `agent/rebuild-learning-core`

## Summary

The artifacts agree on the primary boundary: authenticated, evidence-bound,
owner-private AI lesson drafting and private preview. Publication, curriculum
sequencing, delayed transfer scheduling, rewards, payments, and deployment remain
outside spec 001.

The feature is sufficiently specified for bounded implementation and testing. It
is not ready for convergence or production. Critical implementation and evidence
gaps remain visible in the task ledger.

## Constitution alignment

| Principle | Status | Evidence / gap |
|---|---|---|
| Natural Communication First | Aligned | Environment, roles, practical goal, communication events, and transfer are required across spec, schema, persistence, and preview |
| Evidence-Bound Generation | Partially aligned | Zod and source checks exist; transcript adapter policy, complete fixtures, and human verification remain open |
| Transfer Before Completion | Aligned in code, unverified | Preview implementation requires a transfer response; component/browser tests remain open |
| Rights, Privacy, Safety | Partially aligned | Official playback and private RLS design exist; transcript acquisition remains experimental and migration is unverified |
| Small Independent Delivery | Aligned | Roadmap separates publication and later capabilities; spec 001 has independent stories |
| Measurable Evidence | Aligned in requirements, unverified | Success criteria and exact-head checks exist; observed results are absent |

No constitution violation has been approved as an exception.

## Requirement coverage

### Fully represented in artifacts and current code

- authenticated generation gate;
- validated URL and level;
- bounded interaction-window selection;
- structured environment-first model output;
- Zod runtime validation;
- source-evidence checks for transcript and activities;
- actual generation model tracking;
- private `ai_draft` data model and migration intent;
- environment, events, transfer, warnings, and model persistence fields;
- owner-facing AI draft warnings;
- environment-first preview;
- phrase production acknowledgement;
- changed-context transfer before preview completion;
- no fabricated microphone score or mastery copy.

These are implementation observations only. They are not marked as technically
verified unless the corresponding tasks are checked from an actual run.

### Requirements with incomplete implementation

1. **FR-003/FR-004 — Transcript adapter and policy**
   - Current action dynamically imports `youtube-transcript` directly.
   - No explicit acquisition-mode contract is active in the runtime path.
   - No development/production policy gate isolates the experimental adapter.
   - Tasks T023–T025 remain blocking.

2. **FR-019 and failure contract — Stable failures and persistence**
   - Current behavior primarily returns human-readable error strings.
   - The specified discriminated failure codes are not fully implemented.
   - Persistence behavior must not silently downgrade to an in-memory success.
   - Tasks T041–T043 remain blocking.

3. **FR-024 — Required tests**
   - Initial domain tests exist.
   - Action, auth-ordering, failure, RLS, mapping, prompt-injection, component,
     and browser tests are missing.
   - Tasks T013–T019, T030–T033, T044–T046, T052–T055, and T065–T068 remain open.

4. **Persistence schema proof**
   - A migration and app-level table types exist.
   - Hosted/non-production application, RLS behavior, and generated-type
     reconciliation have not been observed.
   - Tasks T062–T063 remain blocking.

5. **Preview proof**
   - Runtime code contains the required flow.
   - No component or browser evidence proves completion is correctly blocked.
   - Tasks T065–T075 remain open.

## Success-criteria evidence map

| Criterion | Planned evidence | Current result |
|---|---|---|
| SC-001 authenticated external calls | mocked action test with call spies | Not run / test missing |
| SC-002 all persisted drafts private | migration + repository assertion + RLS test | Designed; not observed |
| SC-003 no draft in public catalog | catalog query test and two-user DB run | Code observed; not verified |
| SC-004 reject unsupported content | domain fixture matrix | Partial tests only |
| SC-005 valid fixture produces complete draft | mocked action happy path | Missing |
| SC-006 cross-user access denied | non-production RLS integration | Not run |
| SC-007 reload preserves fields | mapping test + DB reload | Code observed; not verified |
| SC-008 transfer required | component/browser test | Code observed; not verified |
| SC-009 exact-head checks pass | lint, tsc, tests, content, build | Not run on latest head |
| SC-010 review can inspect provenance/warnings | manual draft inspection | Not run |

## Ambiguities and decisions still needed

### Critical before merge consideration

- Decide which transcript acquisition modes are production-approved.
- Decide whether the experimental adapter is disabled outside development or
  removed from the merge candidate.
- Define persistence failure semantics and stable error codes.

### Important before convergence

- Define repeated-generation and slug-collision behavior.
- Define draft retention and owner deletion behavior.
- Decide whether generation should be one draft per source/user or versioned
  attempts.

### Deferred correctly to spec 002

- reviewer role and authorization;
- approval checklist UI;
- immutable review history;
- publication and retirement transitions;
- public reviewed-lesson contract.

These deferred decisions do not belong in spec 001 implementation.

## Duplication and terminology findings

- `docs/product/PRODUCT_TRUTH.md` and `CURRENT_PRIORITY.md` now summarize and point
  to Spec Kit artifacts rather than competing with them.
- Older `docs/real-talk-spec.md`, `docs/real-talk-expansion-plan.md`, and full
  blueprints may contain obsolete authority language. They should be labelled
  historical or reconciled in a separate documentation-only task, not silently
  used to expand spec 001.
- The code currently uses `RealTalkLesson` for both draft preview and reviewed
  lesson-shaped content. This is acceptable during spec 001 but spec 002 should
  introduce an explicit reviewed/public contract rather than assuming draft and
  publication are the same entity.
- Terms `source evidence`, `transcript evidence`, `ai_draft`, `review warning`,
  `communication event`, and `transfer task` are consistent across active
  artifacts.

## Task quality findings

- Tasks are ordered by foundation and independently testable user story.
- Checked implementation tasks are separated from unchecked verification tasks.
- Exact file paths are provided.
- No task in spec 001 authorizes publication or later roadmap work.
- T029 should be treated as a bounded extraction, not a broad folder refactor.
- T064 is deliberately conditional and must not become scope expansion unless
  retention verification requires it.

## Result

**Specification readiness**: Ready for bounded implementation and testing.

**Implementation convergence**: Not ready.

**Production readiness**: Not claimed.

**Critical next tasks**:

1. T023–T025: transcript adapter and policy boundary;
2. T041–T043: stable failure and persistence semantics;
3. missing action/domain/RLS/component tests;
4. authorized non-production migration and RLS verification;
5. exact-head repository checks;
6. live Gemini, browser, and human review evidence.

Re-run this analysis after those tasks or any material spec/plan change. Final
convergence requires an updated requirement-to-evidence table with actual results.
