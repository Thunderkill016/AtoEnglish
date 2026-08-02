# Agent Backlog — Active Tasks Only

> Use `PROJECT_MEMORY.md` for live state, `docs/product/CURRENT_PRIORITY.md` for ordering, `docs/product/NATURAL_COMMUNICATION_LEARNING_SYSTEM.md` for architecture, and `docs/product/DO_NOT_BUILD.md` for deferred scope.

## Rules

1. Use a dedicated branch and reviewed PR.
2. Never merge or deploy automatically.
3. Keep one bounded outcome per PR.
4. Name the current learner, source, interaction, curriculum, or development blocker.
5. Do not add infrastructure without a current product need.
6. Stop and document ambiguity instead of guessing.
7. Completed work belongs in Git history and PRs.
8. Do not create standalone phrase lessons outside an environment experience.
9. Do not return to the fixed 28-day roadmap.
10. Do not let AI publish source-derived curriculum without human review.
11. Do not build the corpus by searching isolated target phrases.
12. Do not confuse naturalness evidence with usage rights.

## Active queue

### PRODUCT-ENV-001 — Natural communication product reset

- **Status:** `in_progress`
- **Branch:** `product/natural-communication-environments`
- **PR:** `#53`
- **Base:** PR #50
- **Outcome:** Make environment-first learning and the invisible curriculum canonical across product truth, agent instructions, project memory, and branch state.
- **Forbidden:** runtime, scraping, database, deployment, merge.

### CONTRACT-ENV-001 — Communication event contract

- **Status:** `next_after_product_env_001`
- **Outcome:** Define bounded types and validation for source recordings, naturalness evidence, communication events, event boundaries, participants, interactional functions, and context.
- **Required:** explicit separation of observed behaviour from inferred teaching use; targeted tests.
- **Forbidden:** automatic source acceptance, phrase-search corpus generation, database migration without proof.

### CONTRACT-ENV-002 — Environment experience and invisible curriculum

- **Status:** `blocked_by_contract_env_001`
- **Outcome:** Define environment goals, event/clip selection, prerequisites, support policy, multi-turn response, changed-context transfer, delayed evidence, and next-experience selection.
- **Initial scope:** five environments only.
- **Forbidden:** full A0–B1 graph, grammar-first navigation, autonomous publication.

### CORPUS-ENV-001 — Environment-first natural corpus sample

- **Status:** `blocked_by_contract_env_001`
- **Outcome:** Review a small number of complete natural recordings across the five initial environments, then annotate every useful communication event that actually occurs.
- **Required:** source context, naturalness evidence, rights status, transcript provenance, timestamps, speakers, suitability, and rejection reasons.
- **Rule:** coverage quality determines size; preserve gaps instead of filling quotas with misleading sources.
- **Forbidden:** starting from target sentence searches or treating PR #49/#51 as the canonical corpus.

### EXPERIENCE-001 — Meet someone new

- **Status:** `blocked_by_contract_env_002_and_corpus_env_001`
- **Outcome:** Build one coherent learner-facing environment: enter situation, first encounter, support, retrieval, response, follow-up, repair, changed-context transfer, delayed re-exposure.
- **Reuse:** playback/provenance from PR #46, fading/repair/cold-transfer from PR #45, speaking/retry/checkpoint patterns from merged #43.
- **Forbidden:** standalone greeting phrase quiz.

### EXPERIENCE-002 — Buy or order something

- **Status:** `blocked_by_experience_001_evidence`
- **Outcome:** Prove the environment contract generalizes to service interaction without rewriting the engine.

### EXPERIENCE-003 — Find a place

- **Status:** `blocked_by_experience_001_evidence`
- **Outcome:** Test location information, clarification, confirmation, and changed-context listening.

### EXPERIENCE-004 — Recover from listening failure

- **Status:** `blocked_by_experience_001_evidence`
- **Outcome:** Make repair a real continuation skill rather than an isolated phrase lesson.

### EXPERIENCE-005 — Talk briefly about oneself

- **Status:** `blocked_by_experience_001_evidence`
- **Outcome:** Answer, add one detail, return a question, and sustain several turns.

### PILOT-ENV-001 — Environment learning pilot

- **Status:** `blocked_by_initial_experiences`
- **Outcome:** Measure first-encounter comprehension, support usage, retrieval, next-turn production, repair, changed-speaker performance, changed-context transfer, delayed use, abandonment, and technical blockers.
- **Default:** small moderated pilot before scaling corpus or infrastructure.

## Existing PR disposition

### PR #47

- Previous YouTube-to-Curriculum documentation reset.
- PR #53 supersedes its learner-facing product identity.
- Preserve historical architecture evidence; do not merge both as conflicting canonical truth without reconciliation.

### PR #48

- Reusable compiler contracts and validation.
- Extend later with communication-event and environment concepts rather than replacing blindly.

### PR #49

- First phrase/capability-targeted source batch.
- Preserve as evidence of discovery bias and source-yield findings.
- Do not promote directly to canonical corpus.

### PR #50

- Current stack base for licensed core, YouTube Companion, and source-library fallbacks.
- Rights-safe completeness rules remain relevant.

### PR #51

- Natural-interaction candidates with stronger authenticity evidence.
- Still shaped by predetermined A0 targets and not manually verified.
- Use as exploratory comparison material only.

### PR #52

- Authorized media/caption TypeScript experiment.
- Base restored to PR #50; draft; exact head `a874120a389c451cc39ac7a4cbd1fb4692f0fcce`; Verify #78 passed.
- Not the canonical product direction.

### PR #45 / #46 / merged #43

- Mechanism and technical proofs only.
- Reuse selectively inside environment sessions.

## Interrupt policy

Only these may interrupt the queue:

- source-rights or licensing risk;
- naturalness, transcript, attribution, or speaker-integrity defect;
- production defect blocking existing users;
- security, privacy, or data-integrity defect;
- repeated development blocker observed in at least two real tasks.

Every interrupt still requires explicit scope, acceptance criteria, verification, handoff, and a separate PR.