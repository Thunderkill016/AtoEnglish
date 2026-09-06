# AtoEnglish — Current Project State

**Effective:** 2026-09-06  
**Project:** AtoEnglish

## Current state

The repository has completed the source-of-truth and stale-document cleanup phase. Historical product/R&D programs are no longer kept as active documentation in the working tree.

There is intentionally **no automatic product roadmap**. Existing features and curriculum describe what the codebase currently contains, not what AtoEnglish must build next.

## Runtime reality

`main` contains the current Next.js/React/TypeScript/Supabase application, existing A0–B2 curriculum data, learning surfaces, progress/review systems, tests and migrations.

Do not infer product value, learner efficacy or future priority merely because a subsystem already exists.

## Production consistency

The September canonical learning-attempt boundary is reconciled across repository and production:

- legacy attempt logging routes through `record_learning_attempt(...)` rather than direct authenticated table inserts;
- compatibility attempts are attempt-only and do not fabricate canonical evidence/mastery;
- production includes migration `20260906115406_learner_evidence_coverage`;
- repository migration history uses the same version;
- authenticated callers can execute `get_learner_evidence_coverage(text[])`; anonymous callers cannot.

The Vercel release path was restored by PR #157:

- reviewed pushes to `main` create production deployments through the Vercel Git integration;
- `preview/**` branches create preview deployments;
- other Git branches remain disabled by default in `vercel.json`;
- the restored path was verified against exact Git metadata, production aliases, `/api/health`, `/learn`, `/login`, Supabase connectivity and Vercel runtime logs.

Issue #152 is resolved by this reconciled release path. The release invariant is now: **production must be traceable to an exact reviewed `main` commit, the required Supabase state must exist, and the resulting Vercel deployment must be verified after promotion.**

Do not silently re-enable the old GitHub Actions Vercel deployment experiment. The repository does not rely on a `VERCEL_TOKEN` workflow for the current release path.

## Governance

- `.agent-autopilot-disabled` remains authoritative.
- No historical roadmap/spec/agent backlog in Git history automatically becomes active work.
- `main` code/migrations/tests are implementation truth; verified production facts are production truth.
- New product work requires an explicit current decision and bounded task.
- Security/privacy/data-integrity defects may interrupt normal prioritization.

## Active work

There is no inherited P0 release-consistency task remaining after #152. Only newly discovered security/privacy/data-integrity/release-blocking defects may interrupt the next explicit product decision.

Product direction should now be researched and selected from current learner needs, product evidence and repository reality rather than inherited historical momentum.
