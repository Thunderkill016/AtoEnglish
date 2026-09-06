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

### GitHub + Supabase

The September canonical learning-attempt boundary has been reconciled:

- legacy attempt logging routes through `record_learning_attempt(...)` rather than direct authenticated table inserts;
- compatibility attempts are attempt-only and do not fabricate canonical evidence/mastery;
- production includes migration `20260906115406_learner_evidence_coverage`;
- repository migration history uses the same version;
- authenticated callers can execute `get_learner_evidence_coverage(text[])`; anonymous callers cannot.

### Remaining release blocker — Vercel

Issue #152 remains the active release-consistency tracker.

The last verified Vercel production deployment observed during the reset is still based on Git commit:

`1e462367d365d03e01d2b211da2499ac612a57ff`

Do not assume the live site matches current `main`. A future production release must verify the exact GitHub commit, Supabase state and resulting Vercel production deployment together.

The previous GitHub Actions deployment experiment also established that the repository does not currently have a usable `VERCEL_TOKEN` secret for that workflow, so do not silently re-enable it and create a permanently failing deploy gate.

## Governance

- `.agent-autopilot-disabled` remains authoritative.
- No historical roadmap/spec/agent backlog in Git history automatically becomes active work.
- `main` code/migrations/tests are implementation truth; verified production facts are production truth.
- New product work requires an explicit current decision and bounded task.
- Security/privacy/data-integrity defects may interrupt normal prioritization.

## Active work

1. **#152 — P0 release consistency:** reconcile and verify the next Vercel production release.
2. Newly discovered security/privacy/data-integrity/release-blocking defects, if any.

After #152 is resolved, product direction should be researched and selected from current learner needs, product evidence and repository reality rather than inherited historical momentum.
