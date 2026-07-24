# Agent Plan — Current Work Only

> Product direction is defined in `docs/product/PRODUCT_TRUTH.md`. Ordered work is defined in `docs/product/CURRENT_PRIORITY.md`.

## Current task

| Field | Value |
|---|---|
| Task | PRODUCT-001 — Encode AtoEnglish product truth and agent development rules |
| Status | in progress — documentation-only pull request |
| Goal | Make the current 28-day pilot direction discoverable and prevent agents from selecting stale cleanup or premature feature work |

## Scope

This task may change only repository guidance and planning documents:

- `AGENTS.md`
- `AGENT_PLAN.md`
- `AGENT_BACKLOG.md`
- `docs/product/**`

It must not change product runtime, lesson data, tests, dependencies, database, authentication, analytics, XP, FSRS, payment, or deployment behavior.

## Acceptance

- The target learner, 28-day promise, final speaking outcome, and evidence hierarchy are explicit.
- Agents have one mandatory reading order and one task-contract format.
- The active priority and deferred scope are explicit.
- Historical cleanup tasks no longer appear as current work.
- No runtime source or configuration changes are included.

## Completed baseline

The repository already contains:

- aligned pilot promise;
- baseline/final speaking assessment and rubric;
- privacy-bounded pilot analytics;
- Supabase security hardening;
- a repository-owned 28-day speaking-journey contract;
- an explicit Day 1 lesson boundary.

## Next action

Review and merge this documentation reset. The next separate task is TOOLING-001: create one small verification entry point for a focused AtoEnglish curriculum slice without changing product behavior.
