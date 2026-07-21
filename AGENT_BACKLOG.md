# Agent Backlog — Active Tasks Only

## Rules

1. Use a dedicated branch and reviewed pull request.
2. Never merge automatically.
3. Add characterization tests before moving behavior-sensitive logic.
4. Do not change product behavior merely to reduce line count.
5. Stop and document ambiguous behavior instead of guessing.

## Active queue

### CLEANUP-018 — UnitTemplate completion-flow characterization
- **Status:** `in_progress`
- **Scope:** Tests and documentation only.
- **Coverage:** Star/XP derivation, authenticated success and failure, guest fallback, nextRoute, streak/achievement coordination, completion-status loading, duplicate prevention where currently enforced, and active-unit progress cleanup.

### CLEANUP-019 — `/login` metadata/title investigation
- **Status:** `ready`
- **Scope:** Independent bug investigation; do not mix with lesson refactoring.

### CLEANUP-004D — Extract pure completion calculations
- **Status:** `blocked`
- **Blocked by:** CLEANUP-018 review and merge.

### CLEANUP-015 — Review unit action transaction boundaries
- **Status:** `blocked`
- **Blocked by:** Completion characterization and focused server-action transaction tests.
