# AtoEnglish — Current Project State

**Status:** canonical during project reset  
**Effective:** 2026-09-06  
**Reset issue:** #151  
**Base audited:** `main@b6db4731471f5e454b1c732cac595fd538f89c1a`

## Project identity

The current project is **AtoEnglish**.

**Nếp is historical/R&D work.** It is not the current product name, product identity, roadmap, architecture mandate, or automatic source of future tasks. Nếp branches, issues, pull requests, specs, benchmarks, and research remain available as historical evidence and reusable R&D only.

## Current mode

AtoEnglish is in **project reset / audit mode**.

No new product roadmap is active during this reset. In particular, none of the following historical directions is currently authoritative:

- the 28-day work-speaking pilot;
- YouTube-to-Curriculum / private lesson generation;
- Real Talk / authentic-media product directions;
- adaptive Nếp runtime and learner-model expansion;
- Realtime tutor expansion;
- OpenPronounce/pronunciation-engine expansion;
- Nếp English Intelligence Engine / ontology / provenance / benchmark / native-evidence programs.

These may contain useful work. Reuse requires a new bounded AtoEnglish decision after the reset; history does not grant current authority.

## Runtime repository baseline

`main` remains the production-oriented AtoEnglish web codebase and currently contains:

- Next.js 16 / React 19 / TypeScript application;
- Supabase authentication and PostgreSQL integration;
- the existing A0–B2 curriculum data and lesson surfaces;
- speaking, vocabulary, grammar, dialogue, translation, shadowing, quiz, review and progress features;
- FSRS, XP/streak/progress and existing learner-state/planner code that already reached `main`;
- Vitest, content-standard checks, Playwright coverage and GitHub Verify workflow.

This inventory describes what exists. It does **not** declare every existing subsystem valuable, validated, or part of the next roadmap.

## Confirmed production consistency blockers

### P0 — GitHub / Supabase mismatch

Supabase production project `AtoEnglish` is healthy and currently has the September learning-core migrations through:

- `20260902130000_learning_core_foundation`;
- `20260902133000_record_learning_attempt`;
- `20260902133500_learning_evidence_constraints`;
- `20260902134000_privacy_safe_oral_observation`.

Repository `main` also contains `20260903090000_learner_evidence_coverage`, but production does not currently expose `get_learner_evidence_coverage(text[])`.

Authenticated direct INSERT/UPDATE/DELETE on `learning_attempts`, `learning_evidence_events`, and `learner_skill_states` is revoked. The `record_learning_attempt(...)` RPC exists and authenticated callers can execute it.

Current `main` still has a legacy `recordLearningAttempts()` path that performs direct table inserts. Draft PR #87 is therefore a concrete compatibility candidate, not speculative R&D. It remains open for independent review under release-consistency issue #152.

### P0 — Vercel / GitHub mismatch

The latest observed Vercel **production** deployment is commit:

`1e462367d365d03e01d2b211da2499ac612a57ff`

while audited GitHub `main` is:

`b6db4731471f5e454b1c732cac595fd538f89c1a`

Newer Vercel deployments observed during the audit are previews (`target: null`), not production promotions. No deployment is authorized by this reset.

### P1 governance — `main` is unprotected

GitHub reports `main` branch protection disabled and no required status checks enforced at branch-protection level. The repository does have `.github/workflows/verify.yml`, but workflow existence is not equivalent to protected merge policy.

The current connector does not expose a safe branch-protection write path, so this remains an explicit governance finding rather than a falsely claimed fix.

## Production learner-data reality

Read-only production counts on 2026-09-06:

- `learning_attempts`: **0**;
- `learning_evidence_events`: **0**;
- `learner_skill_states`: **0**;
- `card_review_logs`: **0**;
- `pilot_events`: **44**.

Therefore learner-model, calibration, predictive-value, retention, transfer, or efficacy claims cannot be inferred from production usage. Synthetic and repository tests remain technical evidence only.

## Autonomy state

Repository autopilot is already disabled through `.agent-autopilot-disabled`. `AGENT_AUTOPILOT.md` records that daemon/orchestrator flows must remain disabled unless the owner intentionally restores them through review.

The old `AGENT_ROADMAP.md` auto-refill task-pool semantics are superseded by this reset and must not select work.

## What may happen during the reset

Allowed:

- read-only audit;
- documentation/source-of-truth cleanup;
- closing or archiving superseded GitHub issues and Draft PRs while preserving history and branches;
- isolating real P0 production/security/data-integrity blockers;
- verification of the reset branch.

Not allowed:

- choosing a new product roadmap;
- adding new learner-facing features;
- expanding Nếp/Core R&D;
- deploying previews or `main` to production;
- writing or migrating production data/schema as part of cleanup;
- merging the reset automatically;
- re-enabling autonomous backlog/task generation.

## Active work during reset

Only these are active by default:

1. **#151 — PROJECT-RESET-001**: audit, synchronize, and clean the project.
2. **#152 — P0-RELEASE-CONSISTENCY**: reconcile GitHub, Supabase and Vercel before the next production release.
3. **PR #87**: retain as a concrete compatibility candidate until reviewed against current main + production RPC.

Any security/privacy defect discovered during the reset may also interrupt this list.

## Exit condition

The reset is complete when:

- AtoEnglish has one unambiguous source-of-truth hierarchy;
- Nếp is clearly historical/R&D everywhere it can otherwise be mistaken for current authority;
- stale automated planning documents cannot create work;
- superseded PR/issue clutter is archived without deleting useful history;
- production/repository divergence is explicitly bounded;
- the repository is clean enough to research and decide the next AtoEnglish product direction from evidence rather than inherited momentum.
