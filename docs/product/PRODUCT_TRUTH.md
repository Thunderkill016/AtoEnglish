# AtoEnglish product truth

**Status:** product summary; governed by Spec Kit  
**Updated:** 2026-08-02  
**Primary product:** Natural Communication / Real Talk

## Authority order

When documents conflict, use this order:

1. `.specify/memory/constitution.md`
2. the active feature under `specs/`
3. `specs/000-atoenglish-rebuild-roadmap/roadmap.md`
4. this product summary
5. older blueprints, plans, comments, and legacy implementation

The active feature is:

```text
specs/001-private-natural-lesson-compiler/
```

No non-trivial implementation may bypass its requirements and task ledger.

## What AtoEnglish is rebuilding into

AtoEnglish is a Vietnamese-first web product that helps adults understand and
act inside natural English communication environments.

The learner sees:

```text
real situation
→ people and practical goal
→ short authentic interaction
→ scaffolded listening
→ retrieval of useful language
→ spoken response
→ changed-context transfer
→ delayed return
```

The learner does not primarily navigate a grammar syllabus. Grammar, vocabulary,
speech features, capability prerequisites, and review scheduling remain invisible
infrastructure.

## Product promise

Each reviewed lesson helps the learner understand one short real interaction and
use a small set of source-supported language in a comparable but changed
situation.

AtoEnglish does not promise native pronunciation, CEFR certification, IELTS
results, fluency, mastery from one lesson, or transcript correctness from AI
alone.

## Source and generation contract

- A public URL is not automatically permission to store media, captions, or
  derivatives.
- Source playback uses an official embed or direct source link.
- The system does not download or re-host YouTube media.
- Timed transcript evidence is required for accurate lesson generation.
- Transcript acquisition modes must be explicit and reviewed; unofficial methods
  remain experimental until approved.
- AI output is an owner-private `ai_draft`, not a public lesson.
- Typed schema and source-evidence checks happen before persistence.
- Human review is required for transcript accuracy, speakers, timestamps,
  authenticity, rights, safety, level, translation, and pedagogy.

## Learning contract

Every core reviewed lesson must contain:

- one natural communication environment;
- learner role, partner role, and real-world goal;
- observed communication events linked to source evidence;
- a bounded source segment;
- cold listening and scaffolded comprehension;
- retrieval rather than recognition only;
- source-backed spoken production;
- reduced support before the final task;
- a changed-context transfer attempt;
- concise Vietnamese guidance and retry;
- honest completion language;
- later delayed transfer evidence when that roadmap phase exists.

A lesson cannot become complete through video watching, multiple choice, cloze,
or repetition alone.

## Speech evidence contract

There are separate evidence modes:

1. **Speak-and-confirm practice**: the learner says a phrase and confirms the
   attempt. No score is claimed.
2. **Transcript-match mode**: browser speech recognition compares recognized
   words with a model phrase. It may report sentence match and missing words. It
   is not pronunciation assessment.
3. **Acoustic pronunciation assessment**: an approved provider may report
   acoustic measures only after provider tests, calibration, privacy review, and
   a separate specification.

The UI must always name the active mode and preserve a useful fallback.

## Privacy and publication contract

- Generated drafts are private to their owner by default.
- Ordinary authenticated users cannot approve or publish drafts.
- Public publication belongs to a separate human-review feature.
- RLS remains enabled and user identity is derived server-side.
- Raw recordings, unrestricted learner transcripts, names, employers, and free
  text are not stored by default.
- Schema changes use versioned migrations; generated Supabase types are not
  edited manually.

## Invisible curriculum contract

Natural sources are annotated before they are mapped to capabilities.

```text
natural source
→ observed communication events
→ capability mapping
→ prerequisites and coverage
→ ordered learner experience
```

The system records a coverage gap when no suitable source exists. It does not
force an irrelevant clip, manufacture dialogue, or hunt only for phrases from a
prewritten lesson.

## Evidence hierarchy

1. **Technical evidence**: schema, RLS, tests, and runtime behavior.
2. **Lesson evidence**: source, activities, feedback, and outcome alignment.
3. **Learner evidence**: completion, retry, return, delayed recall, and transfer.
4. **Product evidence**: willingness to continue, pay, renew, and refer.

Passing repository checks proves only internal consistency. It does not prove
learning effectiveness or product-market fit.
