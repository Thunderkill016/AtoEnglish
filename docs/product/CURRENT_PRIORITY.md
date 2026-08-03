# AtoEnglish current priority

**Updated:** 2026-08-02  
**Owner:** Thunderkill016  
**Development method:** GitHub Spec Kit / Spec-Driven Development

## Governing artifacts

```text
.specify/memory/constitution.md
specs/000-atoenglish-rebuild-roadmap/spec.md
specs/000-atoenglish-rebuild-roadmap/roadmap.md
specs/001-private-natural-lesson-compiler/
```

The task ledger at
`specs/001-private-natural-lesson-compiler/tasks.md` is the only active delivery
queue. This document summarizes it; it does not replace it.

## North star

Help a Vietnamese adult understand and respond inside a natural English
communication environment, then demonstrate the same goal with changed data or
context.

## Active feature: 001 — Private Natural Lesson Compiler

The immediate outcome is:

```text
authenticated editor
→ approved source evidence
→ bounded natural interaction window
→ Gemini environment lesson proposal
→ typed and source-evidence validation
→ owner-private ai_draft
→ human-reviewable preview with transfer
```

The current branch already contains substantial implementation. It is not
converged and not production-ready.

## Ordered work

### 1. Complete compiler contracts and tests

- extract a real `TranscriptSourceAdapter` boundary;
- isolate the current unofficial transcript mechanism as experimental;
- add stable machine-readable failure codes;
- make persistence failure explicit;
- complete the invalid-output and prompt-injection fixture matrix;
- test that authentication happens before transcript/Gemini calls.

### 2. Verify owner-private persistence

- run the migration in an authorized non-production Supabase project;
- verify anonymous, ownerA, and ownerB RLS behavior;
- verify ordinary users cannot approve or publish drafts;
- verify environment, communication events, transfer, warnings, and model survive reload;
- regenerate Supabase types after migration.

### 3. Verify the natural lesson preview

- add component tests for environment-first presentation;
- require source-backed phrase production acknowledgement;
- require a changed-context response before completion;
- verify no pronunciation or mastery claim appears;
- run desktop and mobile browser preview with one controlled draft.

### 4. Run exact-head convergence checks

- lint;
- TypeScript;
- unit tests;
- content-standard tests;
- production build;
- live Gemini success and failure paths with a bounded test key;
- manual source, transcript, speaker, translation, safety, and pedagogy review;
- final requirement-to-evidence mapping.

## Explicit blockers

Spec 001 cannot converge while any of these remain unresolved:

1. production policy for transcript acquisition;
2. experimental adapter isolation;
3. stable failure and persistence behavior;
4. full automated test coverage;
5. non-production RLS and migration evidence;
6. exact-head repository checks;
7. live Gemini and browser evidence;
8. human source and lesson review.

## What comes next

Only after spec 001 converges may work start on:

```text
002 — Human Review and Publication Gate
```

Specs for curriculum sequencing, delayed transfer, analytics, rewards, payments,
social systems, or catalog expansion are not active.

## Out of scope now

- automatic publication;
- broad source scraping infrastructure;
- downloading or re-hosting YouTube media;
- visible grammar-first curriculum rebuild;
- unrestricted AI conversation tutor;
- phoneme or pronunciation claims without an approved acoustic provider;
- XP, streak, league, payment, or social expansion;
- production migration, merge, or deployment by an agent.

## Completion rule

The active phase is complete only when all required tasks in
`specs/001-private-natural-lesson-compiler/tasks.md` are checked from observed
evidence, the requirements checklist is complete, cross-artifact analysis finds
no critical conflict, and the owner accepts the exact final state.
