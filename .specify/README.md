# AtoEnglish Spec Kit Workflow

This repository uses the sequence:

```text
constitution
→ specification
→ clarification/checklist
→ plan/research/data/contracts
→ dependency-ordered tasks
→ cross-artifact analysis
→ implementation by user story
→ convergence and owner review
```

## Governing product decision

The owner confirmed on 2026-08-03 that the core product remains:

```text
Paste a YouTube URL
→ generate an owner-private personal English lesson
→ learn, save, and return
```

A fixed reviewed catalog does not replace this workflow. Public sharing and human
publication review are later features.

## Current artifacts

```text
.specify/memory/constitution.md
specs/000-atoenglish-rebuild-roadmap/
specs/001-private-natural-lesson-compiler/
specs/002-mvp-product-convergence/
```

- Spec 001 contains reusable compiler, transcript, Gemini, evidence, private-draft,
  RLS, hosted, and browser work.
- Spec 002 converges that work onto current main as the learner-facing
  YouTube-to-private-lesson MVP.

Implementation must start from current `main` and selectively port accepted work.
The diverged Real Talk branch/PR #54 must not be merged wholesale.

## Repository Rules

- No non-trivial implementation begins without an active spec and task mapping.
- Checked tasks require observed evidence, not code existence.
- Live transcript/Gemini/browser/hosted checks are not replaced by mocks.
- Generated lessons remain private AI drafts unless a later human-review feature
  approves publication.
- Hosted migrations, Vercel preview, merge, and production deployment require
  explicit authorization at their respective gates.
- Agents do not merge or deploy automatically.

## Planning State

```text
Core direction:           confirmed
Spec 002 planning:        revised and converged
Implementation permission: not yet recorded
Implementation branch:    not created
Preview/merge/deploy:     not authorized
```