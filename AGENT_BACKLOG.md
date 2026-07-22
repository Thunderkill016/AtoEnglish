# Agent Backlog — Active Tasks Only

## Rules

1. Use a dedicated branch and reviewed pull request.
2. Never merge automatically.
3. Align assessment, teaching, and analytics before expanding feature breadth.
4. Add focused characterization tests before changing behavior-sensitive lesson content.
5. Do not refactor architecture unless a measured product blocker requires it.
6. Stop and document ambiguity instead of guessing.

## Active queue

### PILOT-P1A — Review Unit A0-1 against the pilot outcome
- **Status:** `in_progress`
- **Scope:** Documentation only.
- **Deliverable:** `reports/unit-a0-1-pilot-review.md`.
- **Decision:** Shorten A0-1 to a 10–15 minute activation lesson; distribute the complete work-speaking outcome across the first-week journey.

### PILOT-P0C — Baseline/final speaking assessment
- **Status:** `awaiting_review`
- **Pull request:** #23.
- **Scope:** Assessment prompts, rubric, comparison helpers, tests, and manual protocol.
- **Dependency:** Review before changing the A0-1 teaching target.

### PILOT-P1B — Characterize current A0-1 content boundary
- **Status:** `blocked`
- **Blocked by:** PILOT-P1A review and assessment alignment.
- **Scope:** Focused tests for estimated time, speaking prompts, repair phrases, and declared outcomes; no production behavior change.

### PILOT-P1C — Shorten A0-1 activation
- **Status:** `blocked`
- **Blocked by:** PILOT-P1B.
- **Scope:** Content-only first iteration where possible.
- **Target:** Name, spelling, repetition/slower-speech repair, reduced-prompt speaking, 10–15 minutes.
- **Do not change:** Routes, section order, UnitTemplate architecture, XP, FSRS, completion, storage, or analytics event names.

### PILOT-P1D — First-week work-speaking sequence
- **Status:** `blocked`
- **Blocked by:** PILOT-P1C and observed learner evidence.
- **Scope:** Role, company/study context, one responsibility, five predictable follow-up questions, and checkpoint transfer task using the smallest suitable existing units.

### PILOT-OPS-001 — Manual recruitment and cohort operations
- **Status:** `ready`
- **Scope:** Recruit 12–15 target-segment interviews, sell at least eight pilot seats manually, and run baseline/checkpoint/final operations without building payment or audio-upload infrastructure.

### ARCH-P2 — Architecture extraction
- **Status:** `blocked`
- **Blocked by:** A measured product blocker.
- **Scope:** No speculative UnitTemplate or unit-action refactor.
