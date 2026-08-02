# Requirement-to-Evidence Convergence Review — Spec 001

**Review date:** 2026-08-02  
**Evidence baseline:** Verify run #126 on parent head
`872602b057f2f1e0284a09fcef1354e5eae7fcde`  
**Decision:** NOT CONVERGED  
**Production readiness:** NOT CLAIMED

## Review method

Each functional requirement and success criterion is classified as:

- **PASS** — implementation exists and the required evidence class was observed;
- **PARTIAL** — implementation or some evidence exists, but one required evidence
  class remains missing;
- **BLOCKED** — a required external dependency, decision, or human observation is
  absent.

A green unit suite cannot substitute for database, provider, browser, or human
evidence. A database-role transaction cannot be relabelled as a signed-session
PostgREST test. A blocked live provider workflow cannot be relabelled as a live
provider pass.

## Evidence inventory

| Evidence class | Observed state |
| --- | --- |
| Exact-head lint, typecheck, targeted tests, full tests, content standards, build | PASS in Verify #126 |
| Targeted Real Talk suite | PASS — 11 files, 91 tests |
| Full unit suite | PASS — 37 files, 355 tests |
| Content standards | PASS — 1 file, 50 tests |
| Next.js production build without deployment | PASS — 89/89 pages |
| Hosted Real Talk migrations | PASS |
| PostgreSQL role/JWT-claim rollback RLS matrix | PASS |
| Post-test database cleanup | PASS — no temporary users or Real Talk rows |
| Signed-session PostgREST RLS suite | NOT RUN |
| Hosted Supabase type generation | OBSERVED |
| Full local `src/types/supabase.ts` replacement | NOT DONE |
| Live YouTube oEmbed | PASS |
| Live desktop IFrame playback | PASS |
| Live Android-mobile IFrame playback | PASS after one retained transient error 150 |
| Live Gemini provider response | BLOCKED before provider call; secret absent |
| Persisted application-route Playwright preview | NOT RUN |
| Human source-rights review | NOT RUN |
| Human lesson-coherence review | NOT RUN |
| Application deployment | NOT PERFORMED |

## Functional requirements

| Requirement | Status | Implementation and observed evidence | Remaining gap |
| --- | --- | --- | --- |
| FR-001 Auth before transcript/Gemini | PASS | Application orchestration and exact-head auth-order tests prove anonymous requests stop before rate, transcript, provider, and persistence dependencies | Live provider remains independently blocked, but auth ordering itself is observed |
| FR-002 Typed URL and level validation | PASS | Canonical YouTube URL schema and invalid-host/raw-ID/HTTP fixtures pass on exact head | None for spec boundary |
| FR-003 Replaceable adapter with mode/review status | PARTIAL | Typed adapter contract, metadata, and experimental implementation exist | No registered production-approved adapter or persisted provenance contract |
| FR-004 Unapproved adapter experimental and publication-disabled | PASS | Adapter is explicitly experimental, default-blocked, non-production opt-in only, and production fail-closed | Publication remains out of scope as intended |
| FR-005 Captions normalized, bounded, delimited as untrusted | PASS | Normalization, escaped JSONL, delimiter escaping, prompt-injection fixtures, and exact-head tests pass | Live adversarial Gemini behavior remains T082 |
| FR-006 Window ≤180 seconds and item limit | PASS | Deterministic window selector and controlled long-source tests pass | None |
| FR-007 Interaction-favoring deterministic selection | PASS | Deep interaction-rich fixture proves selection is not opening-biased | None |
| FR-008 Structured Gemini output plus runtime validation | PARTIAL | Structured-output provider, Gemini-schema sanitizer, Zod validation, malformed/missing-output tests pass | No live successful Gemini response observed |
| FR-009 Complete environment-first draft | PASS | Zod schema and controlled fixtures require environment, roles, goal, events, transcript, phases, transfer, warnings | Human coherence remains separate |
| FR-010 Every learner-facing quote/answer/timestamp source-bound | PASS | Complete evidence-code matrix, duplicate suppression, normalization, and no-write assertions pass | Live adversarial provider observation remains open |
| FR-011 Unsupported content rejected before persistence | PASS | Compiler/action tests prove invalid schema, evidence, and prompt-injection-like output cannot call persistence | Real database failure injection remains separate |
| FR-012 Human review remains required | PASS as policy | UI warnings, review state, source decision, and production blocker keep automated output unapproved | Human review itself has not occurred |
| FR-013 Successful drafts owner-private `ai_draft` | PARTIAL | Hosted defaults, RLS, migration repair, and role-level owner insert/reload are observed | Real server-action generation and persistence not executed end to end |
| FR-014 Cross-owner RLS isolation | PARTIAL | PostgreSQL role/JWT matrix denies owner B reads, updates, deletes, and foreign-parent writes | Signed-session PostgREST scaffold not run |
| FR-015 Ordinary users cannot approve/publish | PASS | Hosted transaction denies `is_public=true`, approved update, and pre-approved insert | Signed-session client proof remains desirable but database invariant is observed |
| FR-016 Public catalog excludes private drafts | PARTIAL | Query boundary and RLS design exist; anonymous private reads were denied in database transaction | Repository PostgREST catalog assertion not run |
| FR-017 Actual model and warnings stored | PASS in contract | Repository, mapping, schema, and exact-head tests cover model and warnings | Live successful model identifier not observed |
| FR-018 Versioned migration and type coverage without editing generated types | PARTIAL | Three hosted migrations applied; hosted types generated; app-level generated fragment reconciled | Full local generated file replacement remains T063 |
| FR-019 Failures create no partial public records | PARTIAL | Application no-write and persistence-failure tests pass; hosted rows remain private | Controlled real database partial-write/reconciliation test not run |
| FR-020 Official playback; no download/re-host | PASS for external gate | Live oEmbed and official IFrame playback passed on desktop/mobile; harness records no media storage | Persisted app-route playback remains T074 |
| FR-021 Changed-context attempt required | PASS in component evidence | Every phrase acknowledgement, minimum response, independent attempt confirmation, and final callback ordering pass | Browser route not observed |
| FR-022 No pronunciation/mastery claim | PASS | Component assertions and copy review reject unsupported scoring/mastery/SRS claims | Human UX review remains open |
| FR-023 Explicit unresolved warnings | PASS | AI draft status, transcript/source warnings, evidence codes, and review requirements are surfaced and tested | Human review has not resolved them |
| FR-024 Required unit/contract coverage | PASS | Schema, evidence, selection, auth, persistence, migration, mapping, provider, and preview suites pass on exact head | External evidence gaps remain separate requirements |

### Functional requirement result

```text
PASS:    15
PARTIAL: 9
BLOCKED: 0 as written requirements
```

No FR is absent from the implementation plan, but nine are not fully evidenced
at the required integration/provider/browser level.

## Success criteria

| Criterion | Status | Observed evidence | Remaining gap |
| --- | --- | --- | --- |
| SC-001 100% Gemini-reaching requests authenticated | PASS in application boundary | Dependency-injected exact-head tests prove provider cannot run before auth | No live request was sent, but the ordering invariant is enforced before provider selection |
| SC-002 100% persisted generated lessons private `ai_draft` | PARTIAL | Hosted defaults and role-level owner insert are observed | Real server-action persistence sample absent |
| SC-003 0 generated drafts in public catalog | PARTIAL | Anonymous private reads denied; catalog code excludes private drafts | Signed PostgREST catalog integration not run |
| SC-004 All unsupported fixtures rejected | PASS | Full controlled evidence matrix passes | Applies to defined fixture corpus, not universal model behavior |
| SC-005 Valid source produces complete preview in one request | PARTIAL | Mocked compiler/application path passes without JSON repair | Live Gemini plus real persistence absent |
| SC-006 Second user cannot select/update/approve/publish/delete | PARTIAL | Database-role transaction denies cross-owner read/update/delete and approval/publication paths | Signed-session PostgREST run absent |
| SC-007 Reload preserves environment/events/transfer/model/warnings | PARTIAL | Mapping tests preserve all fields | Real persisted repeat-generation/reload absent |
| SC-008 Completion requires changed-context production | PASS in component evidence | Component tests block completion until transfer attempt and confirmation | Persisted browser route absent |
| SC-009 Exact-head repository checks pass | PASS | Verify #126: lint, typecheck, 11/91 targeted, 37/355 full, 1/50 content, build 89/89 | This documentation-only review commit must also pass Verify before PR metadata is final |
| SC-010 Manual reviewer can identify provenance/window/model/warnings | BLOCKED | Current preview exposes model/warnings/window-related content; production provenance contract is documented | Complete provenance persistence and manual review absent |

### Success criterion result

```text
PASS:    3
PARTIAL: 6
BLOCKED: 1
```

## Constitution review

| Principle | Status | Reason |
| --- | --- | --- |
| Natural Communication First | PARTIAL | Environment-first runtime and transfer exist; human lesson-coherence review is absent |
| AI Drafts Must Be Evidence-Bound | PARTIAL | Technical evidence gates pass; live Gemini/adversarial observation is blocked |
| Transfer Before Completion | PARTIAL | Component evidence passes; persisted browser route is unobserved |
| Rights, Privacy, and Safety by Default | PARTIAL | RLS and fail-closed transcript policy are observed; production provenance adapter and signed-session integration are absent |
| Small Independently Testable Delivery | PASS | Spec 001 remains bounded; publication and later systems are excluded |
| Honest Claims and Layered Evidence | PASS | Mock, database, provider, browser, and human evidence are kept distinct; failures are retained |

No constitution exception is approved.

## Requirements checklist review — T085

The original checklist remains useful as a quality template but several unchecked
execution items are now stale because exact-head CI, hosted migration/RLS, hosted
type generation, and controlled live YouTube checks have since occurred.

This review does not mass-check the old file because:

1. a checklist item may combine evidence that is now partly observed and partly
   open;
2. preserving the historical checklist avoids rewriting the sequence of
   evidence;
3. this matrix records the current result with finer-grained statuses.

Current checklist decision:

```text
Requirements quality: sufficient
Implementation evidence: substantial
Ready for convergence: no
Ready for production: no
Ready to merge: no
```

## Cross-artifact consistency review — T086

### Consistent

- Constitution, roadmap, spec, plan, data model, contracts, implementation, and
  PR all retain the private-draft-only boundary.
- No publication behavior is hidden in spec 001.
- Environment, communication events, source evidence, transfer, warnings,
  privacy, and human-review requirements remain aligned.
- The experimental transcript adapter is consistently production-blocked.
- T084 is resolved by an explicit blocker and provenance contract, not by a
  false production approval.
- Live Gemini is consistently described as blocked before provider work.
- Live YouTube failure #1 and success #2 are both retained.

### Known artifact debt

- `analysis.md` describes the pre-execution state and is historical rather than
  current; this review supersedes its final-state claims.
- The original requirements checklist contains stale unchecked execution items;
  this review supersedes their current status without altering history.
- `tasks.md` does not yet mark T085–T087 because this report itself requires an
  exact-head Verify and final review.
- The spec assumption that caption acquisition approval was outside the feature
  is now refined: the policy decision is made, but implementation remains
  blocked inside spec 001.

No contradiction permits publication, deployment, or merge.

## Convergence decision — T087

**Result: FAIL / NOT CONVERGED.**

The feature has strong technical and database evidence, but convergence requires
all critical user-story outcomes, success criteria, and constitution gates to be
satisfied by their correct evidence classes.

### Blocking gates

1. **T054 — signed-session RLS**
   - Run the repository's owner A / owner B / anonymous PostgREST integration
     scaffold against the migrated authorized project.

2. **T063 — generated type replacement**
   - Replace the full local generated Supabase type and prove equivalence before
     removing the reconciliation fragment.

3. **T064 — lifecycle decision**
   - Specify retention, owner deletion, partial-write reconciliation, and
     immutable attempt-history boundaries.

4. **T074 — persisted application browser flow**
   - Observe authenticated generation/reload/preview on desktop and mobile.

5. **T075 — human lesson review**
   - Review source suitability, transcript, speakers, pragmatic meaning,
     Vietnamese guidance, and transfer coherence.

6. **T082 — live Gemini**
   - Configure an authorized server-only CI secret and observe success, invalid
     output, provider failure, 429, adversarial source, and persistence failure
     without exposing the key or writing public data.

7. **Production transcript implementation**
   - Implement approved acquisition, provenance persistence/reload, cue digest,
     rights/reviewer fields, tamper tests, and one controlled reviewed source.

8. **SC-010 manual provenance review**
   - Demonstrate that a reviewer can identify the exact source, selected cues,
     model, rights basis, warnings, and unresolved checks without server logs.

9. **Owner acceptance**
   - Keep PR #54 draft until the owner explicitly accepts the remaining risk and
     scope; do not merge or deploy automatically.

## Final state

```text
Specification quality:       PASS
Implementation completeness: PARTIAL
Technical exact-head checks: PASS on parent evidence head
Hosted database evidence:    PARTIAL but strong
External playback evidence:  PASS for controlled source
Live generation evidence:    BLOCKED
Human evidence:              BLOCKED
Convergence:                 FAIL
Production readiness:        NOT CLAIMED
Merge recommendation:        DO NOT MERGE
Deployment recommendation:   DO NOT DEPLOY
```
