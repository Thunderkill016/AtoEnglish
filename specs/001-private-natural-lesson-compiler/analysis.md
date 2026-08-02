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

The active artifacts agree on one bounded outcome: authenticated, evidence-bound,
owner-private AI lesson drafting and private preview. Publication, curriculum
sequencing, delayed transfer scheduling, rewards, payments, and deployment remain
outside spec 001.

The transcript runtime has an explicit adapter and fail-closed policy. The current
unofficial YouTube adapter is isolated, disabled by default, allowed only through
explicit non-production opt-in, and rejected in production regardless of the
flag.

Generation uses a discriminated machine-readable result contract. Application
orchestration owns the order `validate → auth → rate → compile → persist` and
injects provider/repository dependencies. Required write failure remains failure;
there is no successful preview-only fallback. Repeated generation uses one
current draft per owner, YouTube source, and requested level.

Schema and evidence artifact coverage is now complete for the compiler boundary:
invalid required branches, all eleven evidence failure codes, duplicate-code
deduplication, deep interaction-window selection, conservative normalization,
and prompt-injection-like source data. Metadata and captions are escaped as
JSON/JSONL inside one delimiter pair, with governing instructions before and
after the source block.

These are code and test artifacts only. No exact-head lint, TypeScript, Vitest,
build, live Gemini, database, browser, or human-review result is recorded.

## Constitution alignment

| Principle | Status | Evidence / gap |
|---|---|---|
| Natural Communication First | Aligned | Environment, roles, practical goal, communication events, and transfer are required across schema, compiler, persistence, and preview |
| Evidence-Bound Generation | Partially aligned | Runtime schema, complete evidence-code fixtures, escaped source prompt boundary, adapter metadata, and no-write orchestration exist; execution, approved source, and human verification remain open |
| Transfer Before Completion | Aligned in code, unverified | Preview requires phrase production and changed-context response; component/browser proof remains open |
| Rights, Privacy, Safety | Partially aligned | Official playback, private draft design, production transcript fail-closed policy, and bounded prompt data exist; production source approval and RLS proof remain open |
| Small Independent Delivery | Aligned | Compiler, application orchestration, prompt builder, transcript policy, and repository are bounded modules; later roadmap features remain excluded |
| Measurable Evidence | Aligned in requirements, unverified | Stable codes, controlled fixtures, success criteria, and exact-head gates exist; observed final results are absent |

No constitution exception has been approved.

## Requirement coverage

### Fully represented in code and artifacts

- request validation before auth/provider work;
- authentication before rate limit, transcript, Gemini, or persistence;
- deterministic application orchestration;
- stable generation failure codes, retry guidance, and safe messages;
- typed transcript adapter metadata and typed source failures;
- experimental transcript default block and production fail-closed policy;
- bounded cue normalization and interaction-window selection;
- deep-source fixture proving selection is not hardcoded to the opening;
- environment-first Gemini structured-output request;
- runtime Zod parsing and required-branch rejection fixture;
- complete automated evidence failure matrix:
  - invalid transcript range;
  - transcript outside source window;
  - duplicate transcript index;
  - unknown speaker;
  - unsupported transcript text;
  - unknown activity segment;
  - unsupported vocabulary context;
  - key moment outside source window;
  - unsupported speaking phrase;
  - unsupported completed fill sentence;
  - unsupported transfer language;
- evidence failure deduplication;
- conservative punctuation, contraction, selected entity, and caption-artifact
  matching fixture;
- escaped JSON metadata and JSONL caption prompt boundary;
- literal source delimiter spoofing prevented by `<`, `>`, and `&` escaping;
- post-source instruction boundary;
- prompt-injection-like compiler failure cannot reach persistence;
- actual successful Gemini model tracking;
- deterministic owner+source+level current-draft identity;
- dedicated private draft repository;
- explicit persistence failure with no saved/preview success;
- private AI-draft migration and RLS design;
- environment-first preview, phrase acknowledgement, and transfer attempt;
- no fake microphone, pronunciation, mastery, or automatic-SRS claim.

These observations do not count as passing technical evidence until the relevant
commands run on the exact final commit.

### Incomplete implementation or evidence

1. **Production transcript source**
   - Adapter and policy boundaries exist.
   - The only concrete adapter is experimental and blocked in production.
   - At least one production-approved mode or an explicit permanent
     non-production decision remains required.

2. **Exact-head execution**
   - Compiler, evidence, prompt, orchestration, transcript-policy, result-code,
     and identity test files exist.
   - They have not run on the exact current head.
   - Lint, TypeScript, full tests, content-standard tests, and build remain open.

3. **Direct Gemini behavior**
   - Mocked orchestration covers stable failure propagation.
   - Raw HTTP status, malformed payload, schema failure, evidence failure, and
     adversarial prompt-source behavior still require controlled provider tests.
   - Prompt framing is hardening, not proof of complete prompt-injection defense.

4. **Persistence and RLS proof**
   - Repository, deterministic identity, migration, and temporary app-level types
     exist.
   - Migration dry-run/application, two-user RLS, repeated-generation behavior,
     partial-write reconciliation, reload mapping, and regenerated types remain
     unobserved.

5. **Preview proof**
   - Runtime implements environment, retrieval, production, and transfer.
   - Component and browser tests remain missing.
   - No desktop/mobile or human lesson-coherence review has been recorded.

## Success-criteria evidence map

| Criterion | Planned evidence | Current result |
|---|---|---|
| SC-001 authenticated external calls | mocked orchestration spies + exact-head run | Artifact exists; not executed |
| SC-002 all persisted drafts private | migration assertions + RLS integration | Designed; not observed |
| SC-003 private drafts absent from public catalog | query mapping test + DB run | Code observed; not verified |
| SC-004 unsupported content rejected | complete evidence matrix + no-write assertion | Artifacts exist; not executed |
| SC-005 valid fixture produces complete persisted draft | mocked happy path + repository integration | Mock artifact exists; not executed |
| SC-006 cross-user access denied | non-production ownerA/ownerB RLS run | Not run |
| SC-007 reload preserves fields and repeated generation updates same draft | mapping/repository tests + DB reload | Identity artifact exists; DB proof missing |
| SC-008 transfer required | component and browser test | Code observed; not verified |
| SC-009 exact-head checks pass | lint, tsc, tests, content standard, build | Not run |
| SC-010 reviewer can inspect provenance/warnings/failures | browser/manual inspection | UI/code exists; not observed |

## Prompt-boundary finding

The previous prompt appended raw caption text after a plain `SOURCE CAPTION:`
label. A caption could contain instruction-like text or a fake delimiter with no
structural escaping.

The current prompt builder:

```text
governing rules
→ escaped untrusted metadata JSON
→ escaped untrusted caption JSONL
→ explicit end-of-untrusted-data instruction
→ structured JSON request
```

The controlled fixture includes instruction override text and fake closing tags.
Assertions require exactly one real delimiter pair and require the fake tags to
remain Unicode-escaped inside the source block.

Residual risk remains because a model can still react incorrectly to adversarial
content even when data is framed correctly. T082 must include live adversarial
provider verification and must not claim absolute immunity.

## Ambiguities and decisions still needed

### Critical before merge consideration

- Approve and implement at least one production transcript mode, or keep the
  feature explicitly non-production.
- Run exact-head technical gates.
- Verify migration and owner isolation in an authorized non-production database.

### Important before convergence

- Decide draft retention and owner deletion behavior.
- Decide whether failed partial writes require retry-only reconciliation,
  cleanup, or a transaction/RPC.
- Decide whether future immutable generation-attempt history belongs in a later
  authoring/observability spec.

### Deferred correctly to spec 002

- reviewer authorization;
- approval checklist UI;
- immutable publication review history;
- publish, retire, and restore transitions;
- reviewed public lesson contract.

## Task quality findings

- Test-artifact tasks remain separate from exact-head execution tasks.
- T013, T016–T018, T030–T033, T044–T046, and T052 now match concrete files and
  controlled fixtures.
- T019, T053–T055, T062–T068, and T074–T075 remain open and visible.
- No task authorizes publication, production deployment, or later curriculum
  work.

## Result

**Specification readiness**: Ready for bounded implementation and testing.

**Compiler/evidence artifact coverage**: Complete for the current spec boundary.

**Implementation convergence**: Not ready.

**Production readiness**: Not claimed.

**Critical next tasks**:

1. T019 and T053–T055: database/RLS scaffolding, migration assertions, and reload
   mapping tests;
2. T065–T068: preview component tests;
3. T076–T082: exact-head technical and direct provider verification;
4. T084: production transcript source decision;
5. T062–T063: authorized migration/type reconciliation;
6. browser and human review evidence.

Re-run this analysis after the next material implementation slice. Final
convergence requires observed evidence, not only artifacts.
