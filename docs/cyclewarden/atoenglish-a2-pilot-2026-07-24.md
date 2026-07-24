# CycleWarden A2 pilot — AtoEnglish

**Date:** 2026-07-24  
**Cycle ID:** `atoenglish:20260724-a2-pilot`  
**Objective:** Identify the highest-value bounded next experiment for validating AtoEnglish's 28-day work-speaking outcome.  
**Autonomy:** A2 — research and decision only  
**Risk:** R1 — documentation and user-research planning only  
**Resulting stage:** `planned`

## Execution note

This is a connector-backed dry run of the current CycleWarden A2 decision process against the private AtoEnglish repository. It does **not** claim that the local CycleWarden CLI executed repository checks: the CLI currently requires a local checkout and this run had read-only GitHub repository evidence. No product code, production data, secrets, deployment, or database state was modified.

## Decision question

Which bounded experiment should AtoEnglish run next to maximize decision value without treating repository evidence as proof of user demand?

## Repository evidence inspected

- `README.md`: current stack, 50 lesson units, lesson surfaces, known `UnitTemplate` debt, cleanup policy, CI/deployment entry points.
- `package.json`: deterministic scripts for TypeScript/lint, Vitest, content standards, Playwright, build, audit, inventory, integration tests, and lesson smoke checks.
- Product roadmap issue #20: one 28-day speaking outcome, explicit stop conditions, ordered queue, and a ban on premature AI tutor/mobile/payment/gamification expansion.
- Merged PR #21: deterministic `/login` metadata and production E2E coverage.
- Merged PR #22: one consistent 28-day pilot promise.
- Merged PR #23: baseline/final speaking assessment, rubric, privacy protocol, and deterministic comparison helpers.
- Merged PR #28: recovered minimal privacy-safe pilot analytics implementation.
- Merged PR #30: hardened Supabase/RLS and production database security.
- Closed PR #31: rejected a narrow Unit A0-1 implementation in favor of a broader research-led rebuild.
- Current `main` observed at commit `bebef60bb8fcbaa6b9297a566e29036d2dbd4c05`.

## Evidence-backed claims

1. **The repository already has enough engineering infrastructure to run a pilot.** It exposes a production app, lesson system, authentication, progress persistence, assessment primitives, analytics, database migrations, and broad verification scripts.
2. **The product decision is explicit and durable.** Issue #20 defines one measurable 28-day outcome, success metrics, stop conditions, and a deliberately narrow implementation queue.
3. **Several P0 prerequisites are already implemented.** Funnel messaging, assessment, analytics, login metadata, and database security have been addressed through merged PRs.
4. **Current repository evidence does not establish demand or learning value.** Passing checks and having curriculum cannot prove that target learners will pay, complete speaking tasks, improve, or remain supportable.
5. **Broad curriculum rebuilding has high opportunity cost.** The current roadmap says to validate one journey first, while PR #31 was closed after moving toward a complete A0–B2 rebuild before shipping one lesson.
6. **Autonomous code execution should remain disabled for this cycle.** The project has recently removed autonomous agent runs, and CycleWarden itself is currently A2 rather than A3.

## Uncertainty and contradiction

There is a live tension between two directions:

- issue #20 says to validate one focused 28-day pilot and build only measured blockers;
- the reason recorded for closing PR #31 says the project is pivoting toward a research-led rebuild of the complete A0–B2 lesson system before an individual lesson ships.

Repository evidence cannot resolve that contradiction. Direct target-user evidence must decide whether the next investment belongs in Unit A0-1, the first-week journey, the broader curriculum, or a product stop/pivot.

## Opportunity portfolio

### 1. Close the highest repository-readiness gap

**Candidate:** run a fresh full verification baseline and publish the result.  
**Value:** confirms that current `main` remains technically healthy after the latest merges.  
**Limitation:** technical readiness is unlikely to change the main product decision.

### 2. Publish a reproducible CycleWarden audit

**Candidate:** preserve this cycle's evidence, claims, alternatives, decision, guardrails, and stop reason.  
**Value:** makes the reasoning reviewable and tests CycleWarden on a second real repository.  
**Limitation:** auditability alone does not produce learner evidence.

### 3. Collect direct target-user evidence before feature expansion — **selected**

**Candidate:** observe five recent, consented workflows with Vietnamese adults who understand some English but freeze when speaking at work.  
**Value:** can confirm, change, or stop the current product ranking before more curriculum or architecture work.  
**Limitation:** five observations reveal direction but do not estimate the whole market.

## Decision

Select **Opportunity 3: collect direct target-user evidence before feature expansion**.

The repository is ready enough for research, while the largest decision-changing gap is not code quality. It is whether the focused speaking journey solves a painful problem strongly enough for learners to complete it, improve, pay, and refer others.

Do **not** resume a complete A0–B2 rebuild from repository evidence alone. Do **not** add an AI tutor, mobile app, payment platform, broader gamification, or a major `UnitTemplate` rewrite during this experiment.

## Smallest reversible experiment

### Hypothesis

Five observed target-user sessions will reveal whether the current opportunity ranking should remain focused on Unit A0-1 and the first-week pilot journey, shift to another learner problem, or stop expansion.

### Method

1. Recruit five people from the issue #20 target segment as the first batch within the planned 12–15 interviews.
2. Obtain consent and record only the minimum decision-relevant evidence.
3. Ask each person to complete the existing baseline speaking assessment.
4. Observe the path from landing page to first speaking attempt without coaching unless they become blocked.
5. Record atomic observations: time to start, point of confusion, whether first speaking is completed, support required, perceived work relevance, and willingness to pay for the 28-day pilot.
6. Use existing privacy-safe analytics for bounded funnel events; do not send audio, transcripts, names, employer details, or free text into analytics.
7. Rerank the next opportunity after all five sessions.

### Success criteria

- Five consented sessions are completed.
- Every learner-problem claim links to a direct observation rather than an assumption.
- The evidence clearly records one of three verdicts: **continue focused pilot**, **change segment/promise**, or **stop expansion**.
- The next implementation task is tied to a repeated observed blocker, not a speculative architecture preference.
- The work remains compatible with issue #20's goal of selling at least eight pilot seats before building payment infrastructure.

### Guardrails

- No secrets or unnecessary personal data.
- No raw audio/transcript storage in product analytics.
- No automatic merge, deployment, production write, or database migration.
- No broad A0–B2 rebuild during the experiment.
- No claim that five sessions prove market prevalence.
- Keep human feedback and manual pilot operations within the roadmap's support-cost constraints.

### Rollback

Delete unauthorized personal data, retain only approved anonymized decision evidence, and make no product-code rollback necessary because this experiment changes no product behavior.

## Execution handoff

**Allowed scope**

- `docs/product-research/**`
- consented interview/session notes with anonymization
- issue #20 progress updates
- a subsequent narrowly scoped Unit A0-1 or first-week PR only after repeated evidence identifies the blocker

**Forbidden scope**

- secrets and production credentials
- production database writes outside the existing app flow
- autonomous coding/merging/deployment
- complete A0–B2 reconstruction
- AI tutor, mobile app, custom payments, new gamification breadth
- unapproved audio, transcripts, names, employer information, or learner free text in analytics

**Verification plan**

- review all five evidence records for consent, minimization, and source linkage;
- compare observed blockers against issue #20 assumptions and stop conditions;
- record rejected alternatives and remaining uncertainty;
- create at most one bounded implementation handoff from repeated evidence;
- run the normal AtoEnglish checks only when that later code change exists.

## CycleWarden verdict

CycleWarden is useful here primarily as a **stop-building decision gate**. The A2 cycle correctly prevents the repository's size and test coverage from being mistaken for product proof and selects direct user evidence as the next highest-value action.

The main product gap exposed by this dogfood run is that CycleWarden still needs a first-class remote/private-repository adapter or an installed local runner to execute its native `inspect → assess → research-repository` path without manually reconstructing evidence through GitHub.