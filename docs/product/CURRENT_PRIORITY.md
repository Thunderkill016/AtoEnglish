# AtoEnglish Current Priority — PROJECT RESET

**Status:** reset pointer  
**Effective:** 2026-09-06  
**Canonical state:** `docs/project/PROJECT_STATE.md`

The previous contents of this file prioritized the 28-day speaking pilot, a verification wrapper, Gold Day 1, the first week, and pilot operations.

That queue is no longer current.

## Current priority

Complete **PROJECT-RESET-001 (#151)** before new product development.

The reset must:

1. establish one AtoEnglish source of truth;
2. remove Nếp and other historical directions from the active queue without deleting useful history;
3. clean stale agent plan/backlog/roadmap/report state;
4. archive superseded Draft PRs/issues;
5. isolate real P0 production/security/data-integrity blockers;
6. leave the repository ready for a fresh product-direction decision.

## Separate P0 blocker

#152 tracks GitHub/Supabase/Vercel release consistency. PR #87 remains a compatibility candidate pending current review.

## Not current work

During reset, do not automatically continue:

- the old 28-day queue;
- Gold Day 1 implementation;
- YouTube/Real Talk/private-lesson work;
- adaptive Nếp or learner-model work;
- Realtime tutor work;
- pronunciation/OpenPronounce expansion;
- Nếp Core/ontology/provenance/benchmark/native-evidence work.

Historical details remain in Git history and `docs/project/ARCHIVE_INDEX.md`.
