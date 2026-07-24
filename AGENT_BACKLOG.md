# Agent Backlog — Active Tasks Only

> Use `docs/product/CURRENT_PRIORITY.md` for ordering and `docs/product/DO_NOT_BUILD.md` for deferred scope.

## Rules

1. Use a dedicated branch and reviewed pull request.
2. Never merge or deploy automatically.
3. Keep one bounded outcome per pull request.
4. Every task must name the current AtoEnglish blocker it resolves.
5. Do not add cleanup, abstraction, infrastructure, or agent capability without a current product need.
6. Stop and document ambiguous behavior instead of guessing.
7. Completed work belongs in Git history and pull requests, not the active backlog.

## Active queue

### PRODUCT-001 — Product truth and agent constitution

- **Status:** `in_progress`
- **Outcome:** Repository-owned product truth, active priority, do-not-build boundary, and agent operating contract.
- **Scope:** Documentation only.
- **Blocked by:** Nothing.

### TOOLING-001 — Focused verification entry point

- **Status:** `ready_after_product_001`
- **Outcome:** One command or manifest that selects and reports existing checks for a focused AtoEnglish change.
- **Initial consumer:** The Gold Day 1 curriculum pull request.
- **Required behavior:** Report executed, passed, failed, and unavailable checks; distinguish technical checks from manual product review.
- **Forbidden scope:** Product behavior, new CI platform, generic orchestration framework, remote sandbox, auto-merge, auto-deploy.

### CURRICULUM-001 — Gold Day 1 lesson

- **Status:** `blocked`
- **Blocked by:** PRODUCT-001 and TOOLING-001.
- **Outcome:** A 10–15 minute Day 1 lesson for greeting, name, Vietnamese-name spelling, one lightweight repeat request, and one final spoken output.
- **Expected scope:** `src/lib/data/units/unitA01.ts`, direct targeted tests, and the smallest relevant lesson smoke assertion.
- **Forbidden scope:** Role, company, responsibility, all five questions, full repair training, auth, database, analytics infrastructure, XP, FSRS, unrelated units, and major `UnitTemplate` refactor.

### PILOT-OPS-001 — Recruit and operate the first learner pilot

- **Status:** `planned`
- **Starts when:** The first-week journey and baseline flow are usable enough for real learners.
- **Outcome:** Obtain learner, learning, support-cost, and payment evidence.
- **Default approach:** Manual operations before new infrastructure.

## Interrupt policy

Only these may interrupt the queue:

- a production defect blocking the pilot journey;
- a security, privacy, or data-integrity defect;
- a repeated development blocker observed in at least two real AtoEnglish tasks.

An interrupt still requires explicit scope, acceptance criteria, verification, and a separate pull request.
