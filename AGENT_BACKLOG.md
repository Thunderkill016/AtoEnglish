# Agent Backlog — Active Tasks Only

> Use `PROJECT_MEMORY.md` for cross-session state, `docs/product/CURRENT_PRIORITY.md` for ordering, `docs/product/YOUTUBE_TO_CURRICULUM.md` for architecture, and `docs/product/DO_NOT_BUILD.md` for deferred scope.

## Rules

1. Use a dedicated branch and reviewed PR.
2. Never merge or deploy automatically.
3. Keep one bounded outcome per PR.
4. Every task must name the current learner, source, curriculum, or development blocker.
5. Do not add infrastructure or abstraction without a current pilot need.
6. Stop and document ambiguity instead of guessing.
7. Completed work belongs in Git history and PRs.
8. Do not create standalone video lessons outside the seven-day graph.
9. Do not silently return to the old 28-day roadmap.
10. Do not allow AI to publish source-derived curriculum without human review.

## Active queue

### CONTEXT-002 — Canonical product memory and direction

- **Status:** `in_progress`
- **Branch:** `docs/persist-project-memory`
- **PR:** `#47`
- **Outcome:** Every new session recovers YouTube-to-Curriculum as canonical, the current GitHub state, durable boundaries, and the next task.
- **Scope:** Documentation and agent guidance only.

### CONTRACT-001 — Communication Clip and source contract

- **Status:** `next_after_context_002`
- **Outcome:** Define the smallest stable model for source, permission, attribution, transcript provenance, timestamps, speaker segments, level treatments, functions, prerequisites, context, review state, and evidence links.
- **Required:** Domain validation and targeted tests.
- **Forbidden:** Full ingestion pipeline, database migration without proof, public catalog, autonomous publication.

### CONTRACT-002 — Curriculum graph and advancement contract

- **Status:** `blocked_by_contract_001`
- **Outcome:** Define capability nodes, prerequisite edges, clip-treatment eligibility, repeated exposure, fading support, delayed retrieval, unseen recognition, transfer evidence, and advancement rules.
- **Scope:** Five A0 capabilities only.
- **Forbidden:** Full A0–B1 graph or grammar-first ordering.

### CORPUS-001 — Reviewed seven-day A0 clip corpus

- **Status:** `blocked_by_contract_001`
- **Outcome:** Curate 20–30 reviewed clips from multiple videos, speakers, and contexts.
- **Capabilities:** greeting, saying one's name, asking another's name, saying where one is from, asking for repetition.
- **Required per clip:** rights evidence, source URL, timestamps, attribution, transcript provenance, human transcript/speaker/name/translation review, learning metadata.
- **Default:** Manual or semi-manual authoring before automation.

### GRAPH-001 — Compile the seven-day progression

- **Status:** `blocked_by_contract_002_and_corpus_001`
- **Outcome:** Order clip treatments into a coherent prerequisite graph with 3–5 varied exposures per capability, controlled variants, support fading, delayed retrieval, unseen-speaker recognition, and transfer.
- **Forbidden:** Independent video quizzes or random recommendation.

### RUNTIME-001 — Mini-curriculum learner slice

- **Status:** `blocked_by_graph_001`
- **Outcome:** Deliver comprehension, acquisition, and transfer across the seven-day graph.
- **Reuse:** Bounded playback and provenance ideas from PR #46; diagnosis/fading/repair/cold-transfer ideas from PR #45; speaking/feedback/retry/checkpoint patterns from merged #43.
- **Required:** Typed fallback, FSRS integration where appropriate, exact evidence links, desktop/mobile browser checks.
- **Forbidden:** Polishing the radio lesson as a standalone destination.

### PILOT-OPS-001 — Test authentic-input curriculum acquisition

- **Status:** `blocked_by_runtime_001`
- **Outcome:** Measure comprehension across speakers, delayed retrieval, unseen recognition, changed-situation transfer, completion, support needs, and media/microphone blockers.
- **Default:** Small moderated pilot before scaling corpus or infrastructure.

## Existing pull-request disposition

### PR #46

- **Role:** one-clip authentic-media technical proof;
- **Status:** draft, unmerged;
- **Action:** preserve evidence and reusable code; do not merge as the product endpoint; resolve or supersede through the mini-curriculum work.

### PR #45

- **Role:** mastery mechanisms experiment;
- **Status:** draft, unmerged;
- **Action:** extract only mechanisms required by the canonical runtime; do not adopt as a separate product direction.

### PR #43

- **Role:** merged reusable speaking, feedback, retry, checkpoint, and pilot patterns;
- **Action:** reuse selectively; do not preserve its synthetic source model as the roadmap.

### PR #35

- **Role:** stale older Gold Day 1 branch;
- **Action:** close as superseded unless explicitly revived.

## Interrupt policy

Only these may interrupt the queue:

- source-rights or licensing risk;
- transcript or attribution integrity defect;
- production defect blocking existing users;
- security, privacy, or data-integrity defect;
- repeated development blocker observed in at least two real tasks.

An interrupt still requires explicit scope, acceptance criteria, verification, handoff, and a separate PR.