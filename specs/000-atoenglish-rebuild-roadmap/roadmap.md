# AtoEnglish Rebuild — Spec of Specs

## Why this roadmap exists

The rebuild is too large and too interdependent for one specification and one
implementation pass. This roadmap decomposes the product into independently
valuable feature specs. Each child spec MUST run through its own specification,
clarification, plan, tasks, analysis, implementation, and convergence cycle.

No child spec may silently absorb another. A later feature may depend on an
approved contract from an earlier feature, but it must remain independently
reviewable and stoppable.

## Ordered feature specs

### 001 — Private Natural Lesson Compiler

**Outcome**: An authenticated editor turns approved source evidence into a typed,
evidence-bound, owner-private AI lesson draft.

**Independent value**: Safe creation and preview of one draft without public
publication.

**Current branch status**: Active. Existing implementation work on
`agent/rebuild-learning-core` is governed retroactively and prospectively by this
spec.

**Hard boundary**: No public catalog publication, no curriculum sequencing, no
production claim that unreviewed caption scraping is approved.

---

### 002 — Human Review and Publication Gate

**Outcome**: Authorized reviewers inspect source availability, rights,
transcript, timestamps, speakers, safety, authenticity, and pedagogy before an
immutable reviewed lesson is published.

**Independent value**: A small trustworthy public catalog can exist without
trusting generation output.

**Depends on**: 001 draft and evidence contracts.

**Hard boundary**: No automatic approval, no bulk publishing, no learner
progression logic.

---

### 003 — Natural Environment Lesson Runtime

**Outcome**: A learner completes one reviewed lesson through situation setup,
cold listening, scaffolded comprehension, retrieval, spoken production,
changed-context transfer, and honest completion feedback.

**Independent value**: One complete learning experience that can be tested with
real learners.

**Depends on**: 002 reviewed lesson contract. A static reviewed fixture may be
used before the publication UI is complete.

**Hard boundary**: No broad curriculum map, no open-ended chatbot, no claimed
phoneme assessment without an approved provider.

---

### 004 — Invisible Capability Graph

**Outcome**: Reviewed lessons map to communication capabilities and prerequisites.
The system recommends the next environment while hiding academic curriculum
machinery from the learner.

**Independent value**: Natural content becomes a coherent progression rather than
a random catalog.

**Depends on**: 002 reviewed metadata and 003 runtime evidence.

**Hard boundary**: No automatic source fabrication to fill coverage gaps. No
visible grammar-unit navigation as the primary journey.

---

### 005 — Delayed Transfer and Learner Evidence

**Outcome**: The learner returns for reduced-support tasks with a new speaker or
changed context. Immediate comprehension, recall, interactional use, and delayed
transfer are recorded separately.

**Independent value**: The product can distinguish lesson completion from
retention and transfer.

**Depends on**: 003 attempts and 004 capability mapping.

**Hard boundary**: No raw audio retention by default and no mastery claims from a
single attempt.

---

### 006 — Pilot Operations and Product Evidence

**Outcome**: The owner can run a bounded pilot and evaluate activation,
completion, retry, return, delayed transfer, support cost, willingness to pay,
and renewal intent.

**Independent value**: Evidence determines whether to continue, narrow, or stop
the product direction.

**Depends on**: One complete path through specs 001–005, but only for a small
reviewed environment set.

**Hard boundary**: No broad catalog expansion, payments platform, social system,
or vanity-metric roadmap before pilot evidence.

## Delivery gates

A child spec may enter implementation only when:

1. its user stories are independently testable;
2. unresolved decisions are visible or clarified;
3. its plan passes the constitution check;
4. tasks have exact file paths and dependency order;
5. cross-artifact analysis has no unresolved critical conflict;
6. the pull request names what remains unverified.

A child spec may be considered complete only when:

1. all required tasks and acceptance scenarios have observed evidence;
2. technical checks ran against the exact final head;
3. required browser, database, external-service, and human review checks ran;
4. no later spec is being used to hide incomplete scope;
5. the owner accepts the result; and
6. no automatic merge or deployment occurred.

## Current decision

The only active implementation spec is:

```text
specs/001-private-natural-lesson-compiler/
```

Specs 002–006 remain roadmap entries until 001 converges or the owner explicitly
changes priority.
