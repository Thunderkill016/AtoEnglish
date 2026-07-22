# Agent Plan — Current Work Only

> Historical cleanup and product work are recorded in merged pull requests, issue #20, and durable reports.

## Current task

| Field | Value |
|---|---|
| Task | PILOT-P1A — Review Unit A0-1 against the 28-day speaking outcome |
| Status | in progress — documentation-only pull request |
| Goal | Decide how to shorten or split the current 40-minute first lesson without changing learner behavior yet |

## Verified baseline

- Login metadata/title repair is merged.
- The 28-day, 10–15 minute pilot promise is aligned across entry surfaces.
- Minimal privacy-safe pilot analytics is merged and has passed focused tests, TypeScript, lint, full unit tests, content-standard tests, production build, and desktop/mobile lesson smoke E2E.
- The baseline/final speaking assessment exists in PR #23 but remains unmerged.
- Unit A0-1 currently advertises 40 minutes and strongly teaches name introduction, spelling, and asking for repetition.
- Unit A0-1 does not yet teach role, company/study context, one responsibility, five predictable work questions, or asking for slower speech through its core learning path.

## Scope

This phase changes review and planning documentation only. It must not change:

- Unit A0-1 production content;
- lesson routes, section order, or renderer behavior;
- authentication, Supabase, RLS, migrations, or analytics taxonomy;
- XP, stars, streaks, FSRS, completion, or storage keys.

## Decision

Treat Unit A0-1 as a 10–15 minute activation lesson focused on name, spelling, and communication repair. Distribute role, company, responsibility, and five follow-up questions across the first-week pilot sequence, then assess the combined outcome at checkpoint and final.

## Next action

Review `reports/unit-a0-1-pilot-review.md`. After the assessment boundary in PR #23 is accepted, add focused content characterization tests before making the first learner-visible A0-1 change.
