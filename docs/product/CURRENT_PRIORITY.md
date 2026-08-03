# AtoEnglish current priority

**Updated:** 2026-08-03  
**Owner:** Thunderkill016  
**Development method:** GitHub Spec Kit / Spec-Driven Development

## Governing artifacts

```text
.specify/memory/constitution.md
specs/000-atoenglish-rebuild-roadmap/roadmap.md
specs/001-private-natural-lesson-compiler/
specs/002-mvp-product-convergence/
```

## North star

Help a Vietnamese adult understand and respond inside a natural English
communication environment, then attempt the same practical goal with changed data
or context.

## Proposed active feature: 002 — MVP Product Convergence

The repository already contains substantial UI, authentication, Supabase,
learning, Real Talk, analytics, test, and Vercel infrastructure. The current
problem is not a missing platform. It is that the product surface is fragmented
across conflicting landing promises, legacy curriculum/navigation, broad feature
routes, experimental authoring, and unreviewed static lesson fallback.

The proposed MVP outcome is:

```text
truthful landing
→ signup/login
→ idempotent account bootstrap
→ focused dashboard
→ reviewed natural lesson catalog
→ first listening encounter
→ progressive support
→ productive retrieval
→ speak-and-confirm
→ changed-context transfer
→ bounded private progress
→ return and continue/review
```

The first release is intentionally small:

- one natural communication environment;
- at least three human-reviewed lessons;
- at least two speakers or contexts;
- one complete desktop/mobile learner journey;
- the existing hosted Supabase and Vercel projects;
- one owner-reviewed preview.

## Relationship to Spec 001

Spec 001 produced valuable verified contracts and infrastructure for:

- authenticated private generation;
- evidence validation;
- owner-private draft persistence and RLS;
- transcript provenance and independent review;
- approved reviewed-source adapter;
- persisted desktop/mobile preview.

It is not a branch that should be merged wholesale. Its current implementation
branch is diverged hundreds of commits from `main` and carries conflicting legacy
state. Spec 002 requires a fresh integration branch from current `main` and a
file-level port manifest.

## Ordered next actions

1. Owner reviews and accepts or changes the MVP promise and scope.
2. Confirm the initial environment, defaulting to **Meet someone new**.
3. Confirm that at least three source packages can receive lawful-use and full
   human review.
4. Create a fresh implementation branch from current `main`.
5. Complete Phase 1 of `specs/002-mvp-product-convergence/tasks.md` before learner
   code changes.
6. Implement by user story and stop at each independent checkpoint.
7. Create exactly one intentional Vercel preview only after technical and hosted
   gates pass.
8. Obtain owner acceptance before preparing a main-targeted merge PR.

## Explicit MVP exclusions

- broad A0–B2 curriculum or capability graph;
- arbitrary YouTube generation in the learner product;
- automatic transcript approval/publication;
- unrestricted chatbot;
- pronunciation scoring;
- raw learner audio or free-text storage;
- XP, streak, league, achievement, challenge, certificate, or social expansion;
- grammar, writing, broad speaking tools, business track, and push-notification
  systems as core MVP surfaces;
- subscriptions, payments, native apps;
- whole-branch merge of PR #54;
- automatic merge or deployment.

## Decision status

```text
Spec quality:             prepared
Planning convergence:     pass
Implementation approval:  pending owner acceptance
Implementation branch:    not created
Hosted migration:         not authorized
Vercel preview:           not authorized
Merge:                    not authorized
Production deployment:    not authorized
```

Until the owner accepts Spec 002, the repository remains in planning/review mode.
No task may infer implementation permission merely because the plan exists.