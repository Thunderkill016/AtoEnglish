# AtoEnglish Rebuild — Spec of Specs

## Why this roadmap exists

The rebuild is too large and too interdependent for one specification and one
implementation pass. This roadmap decomposes the product into independently
valuable feature specs. Each child spec MUST run through its own specification,
clarification, plan, tasks, analysis, implementation, and convergence cycle.

No child spec may silently absorb another. A later feature may depend on an
approved contract from an earlier feature, but it must remain independently
reviewable and stoppable.

## Proposed owner reprioritization — 2026-08-03

Repository and infrastructure audit found that AtoEnglish already has substantial
compiler, auth, database, UI, learning, analytics, and deployment infrastructure,
but it does not yet present one coherent usable product. The Real Talk branch is
also diverged hundreds of commits from `main`, and the current learner surface
contains conflicting product promises and unreviewed static lesson fallbacks.

The proposed next active feature is therefore:

```text
002 — MVP Product Convergence
```

This is a bounded orchestration spec, not permission for a broad rewrite. It
combines only the minimum slices required to prove one complete learner value
loop:

- truthful landing and authentication;
- focused dashboard/navigation;
- one environment with at least three human-reviewed lessons;
- reviewed learner catalog and lawful playback;
- environment-first runtime with retrieval, speech confirmation, and transfer;
- bounded private progress and return;
- privacy-safe pilot evidence and one preview.

This reprioritization remains **proposed** until the owner accepts
`specs/002-mvp-product-convergence/`. Until that decision, no implementation,
hosted migration, preview, merge, or deployment is authorized by this roadmap
change.

## Ordered feature specs

### 001 — Private Natural Lesson Compiler

**Outcome**: An authenticated editor turns approved source evidence into a typed,
evidence-bound, owner-private AI lesson draft.

**Independent value**: Safe creation and preview of one draft without public
publication.

**Current evidence status**: Substantial implementation and hosted verification
exist on `agent/rebuild-learning-core`, including private drafts, provenance,
trusted transcript review, an approved source adapter, RLS, atomic persistence,
and desktop/mobile persisted preview. The spec is not fully converged because
live Gemini, final human lesson review, public learner routing, and owner
acceptance remain open.

**Relationship to MVP**: Spec 001 is a source of contracts, security mechanisms,
tests, and evidence. Its diverged branch MUST NOT be merged wholesale. Spec 002
selectively ports only accepted work onto current `main`.

**Hard boundary**: No automatic publication and no production claim that an
experimental transcript path is approved.

---

### 002 — MVP Product Convergence

**Outcome**: A Vietnamese beginner completes one coherent hosted product journey
from truthful landing and authentication through one reviewed natural lesson,
changed-context transfer, bounded persistence, and return.

**Independent value**: A small real product can be tested with learners instead
of continuing to accumulate disconnected routes, tools, and experiments.

**Depends on**:

- current `main` product/auth/database foundation;
- selected Spec 001 provenance, private-draft, reviewed-source, and runtime work;
- actual human review of at least three lessons in one environment;
- connected Supabase and Vercel projects.

**Hard boundary**:

- one environment and a tiny reviewed corpus;
- no whole-branch merge of the diverged Real Talk work;
- no arbitrary learner-facing generation;
- no broad curriculum graph;
- no XP/streak/league, writing, notification, payment, social, or native-app
  expansion;
- no automatic merge or deployment.

**Status**: Planning artifacts prepared on `spec/mvp-product-convergence`; owner
acceptance is required before implementation.

---

### 003 — Full Human Review and Publication Operations

**Outcome**: Authorized reviewers can inspect, correct, approve, reject, publish,
unpublish, and audit source/lesson packages through a durable operational
interface.

**Independent value**: The owner can grow a trustworthy reviewed catalog without
controlled scripts or ad-hoc database operations.

**Depends on**: Spec 001 evidence contracts and the minimal controlled
publication boundary proven by Spec 002.

**Hard boundary**: No automatic approval, no bulk autonomous publishing, and no
curriculum sequencing.

---

### 004 — Invisible Capability Graph

**Outcome**: Reviewed lessons map to communication capabilities and prerequisites.
The system recommends the next environment while hiding academic curriculum
machinery from the learner.

**Independent value**: Natural content becomes a coherent progression rather than
a random catalog.

**Depends on**: Reviewed metadata and the learner runtime/attempt evidence proven
by Specs 002–003.

**Hard boundary**: No automatic source fabrication to fill coverage gaps. No
visible grammar-unit navigation as the primary journey.

---

### 005 — Delayed Transfer and Learner Evidence

**Outcome**: The learner returns for reduced-support tasks with a new speaker or
changed context. Immediate comprehension, recall, interactional use, and delayed
transfer are recorded separately.

**Independent value**: The product can distinguish lesson completion from
retention and transfer.

**Depends on**: Spec 002 attempts and Spec 004 capability mapping.

**Hard boundary**: No raw audio retention by default and no mastery claims from a
single attempt.

---

### 006 — Pilot Expansion and Product Evidence

**Outcome**: The owner expands beyond the first environment only when activation,
completion, retry, return, transfer, support cost, willingness to pay, and renewal
signals justify it.

**Independent value**: Evidence determines whether to continue, narrow, or stop
the product direction.

**Depends on**: A converged Spec 002 MVP and, when needed, Specs 003–005.

**Hard boundary**: No broad catalog expansion, payments platform, social system,
or vanity-metric roadmap before pilot evidence.

## Delivery gates

A child spec may enter implementation only when:

1. its user stories are independently testable;
2. unresolved decisions are visible or clarified;
3. its plan passes the constitution check;
4. tasks have exact file paths and dependency order;
5. cross-artifact analysis has no unresolved critical conflict;
6. the pull request names what remains unverified; and
7. the owner accepts the scope when the spec changes roadmap priority.

A child spec may be considered complete only when:

1. all required tasks and acceptance scenarios have observed evidence;
2. technical checks ran against the exact final head;
3. required browser, database, external-service, and human review checks ran;
4. no later spec is being used to hide incomplete scope;
5. the owner accepts the result; and
6. no automatic merge or deployment occurred.

## Current decision boundary

Planning for Spec 002 is complete enough for owner review. Implementation remains
blocked until the owner explicitly accepts its promise, scope, first environment,
and fresh-main selective-port strategy.

```text
Planning branch:        spec/mvp-product-convergence
Implementation branch:  not created
Merge:                  not authorized
Preview deployment:     not authorized
Production deployment:  not authorized
```