# Agent Plan — Current Work Only

**Canonical state:** `docs/project/PROJECT_STATE.md`  
**Current task:** PROJECT-RESET-001 (#151)

## Goal

Audit, synchronize and clean AtoEnglish before any new product development.

## Current scope

- establish one AtoEnglish source of truth;
- mark Nếp and other competing product directions historical/R&D;
- clean stale agent planning state;
- archive superseded Draft PRs/issues while preserving branches/history;
- isolate real production/security/data-integrity blockers;
- verify the reset branch.

## Active P0 follow-up

Release consistency is tracked separately in #152.

PR #87 remains open as a concrete compatibility candidate because production canonical learner tables reject authenticated direct inserts while current `main` still contains a legacy direct-insert path.

## Forbidden during reset

- no new product roadmap;
- no learner-facing feature development;
- no Nếp/Core expansion;
- no OpenPronounce/pronunciation expansion;
- no production migration/write/deploy;
- no automatic merge;
- no automated backlog refill.

## Done when

`docs/project/PROJECT_STATE.md` and `SOURCE_OF_TRUTH.md` accurately describe the cleaned repository, stale active work is archived, genuine P0 blockers are isolated, and the reset PR is reviewable against current `main`.
