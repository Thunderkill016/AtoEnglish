# Unit A0-1 pilot outcome review

## Decision

Do not expand `Unit A0-1` into another large all-in-one lesson.

The recommended product direction is:

1. shorten `Unit A0-1` from a nominal 40-minute experience to a 10–15 minute activation lesson;
2. keep its strongest existing outcome: say a name, spell it, and recover when communication breaks down;
3. distribute role, company, responsibility, and five predictable follow-up questions across the first-week pilot sequence;
4. measure the complete work-speaking outcome at the checkpoint and final assessment rather than pretending one first lesson proves the 28-day promise.

This review changes documentation only. It does not change curriculum, routes, lesson rendering, analytics, XP, FSRS, Supabase, or learner progress.

## Product outcome being reviewed

Roadmap #20 defines the validated outcome as a Vietnamese adult beginner being able to:

- introduce their name and work context;
- spell their Vietnamese name clearly;
- answer five predictable questions about their work;
- ask for repetition or slower speech;
- improve between a baseline and a different final speaking task.

The first visit should also reach the lesson in no more than two intentional actions, and the public promise is 10–15 minutes per day.

## Current Unit A0-1 baseline

Source: `src/lib/data/units/unitA01.ts`.

| Area | Current state |
|---|---|
| Title | `Bảng Chữ Cái & Âm Cơ Bản` |
| Estimated time | 40 minutes |
| Lesson sections | 10: warmup, vocabulary, grammar, practice, dialogue, reflex, translation, shadowing, speaking, completion |
| Declared outcomes | read 26 letters, spell a Vietnamese name, introduce name/origin |
| Vocabulary | 10 entries |
| Dialogues | 2 |
| Speaking output | guided name introduction and spelling |
| Final quiz | 7 items, mainly name, `be`, `/θ/`, origin, and basic repair recognition |
| Additional review | reading passage, four cumulative questions, job-scenario example |

The current dashboard-to-warmup E2E already reaches a lesson in one tap and gates the path at no more than 15 seconds. The route and entry architecture are therefore not the current product blocker.

## What the current lesson already does well

### 1. Name introduction and spelling are taught repeatedly

The situation, warmup, vocabulary, dialogues, controlled practice, speaking prompt, and quiz repeatedly use:

- `My name is ...`
- `Can you spell that?`
- letter-by-letter spelling;
- `Nice to meet you.`

This is the clearest and most coherent part of the unit.

### 2. Basic communication repair is present

The lesson already teaches or rehearses:

- `I don't understand.`
- `Can you say that again, please?`

These appear in vocabulary examples, matching, translation, dialogues, listening discrimination, fluency practice, and quiz recognition.

### 3. The speaking surface already supports a guided and freer attempt

`SpeakingSection` exposes a level-one frame and a level-two situation. The product does not need a new speaking engine to improve the first lesson; the next content batch can use the existing boundary.

### 4. The learning route is already fast enough to test activation

`e2e/time-to-lesson.spec.ts` verifies dashboard to warmup in one tap and no more than 15 seconds. The next iteration should preserve that path rather than redesign navigation.

## Gap matrix

| Pilot function | Current evidence | Assessment |
|---|---|---|
| Say name | Strong coverage across the whole lesson | Keep |
| Spell Vietnamese name | Strong coverage and explicit final speaking instruction | Keep |
| State role | Only a late `jobScenarios` example mentions `marketing assistant`; it is not taught or assessed | Missing from the learning path |
| State company or study context | No reusable target chunk in the core sequence | Missing |
| State one responsibility | No target chunk, practice item, dialogue turn, or speaking requirement | Missing |
| Answer five predictable work questions | No five-question interaction or equivalent speaking task | Missing |
| Ask for repetition | Strong coverage of `Can you say that again?` | Keep and standardize wording |
| Ask for slower speech | No `Could you speak more slowly?` target found | Missing |
| Say they still do not understand | `I don't understand` is present; `yet` is absent | Partially covered |
| Novel final speaking task | Level-two hint exposes nearly the full answer and repeats the lesson scenario | Too supported to demonstrate transfer |
| 10–15 minute daily promise | Unit metadata says 40 minutes and content contains many overlapping activity sets | Misaligned |

## Why the lesson feels longer than the product promise

The problem is not the ten-section renderer by itself. The content inside those sections duplicates the same narrow language through many formats:

- full alphabet cultural reference;
- 10 vocabulary entries;
- grammar explanation and CCQ;
- matching;
- practice quiz;
- translation;
- sentence correction;
- listen-and-arrange;
- word bank;
- scramble;
- two dialogues;
- five listen-and-choose items;
- pronunciation focus;
- seven-item fluency drill;
- two-level speaking;
- seven-item final quiz;
- reading passage;
- cumulative review;
- job-scenario example.

Several items are also off the shortest path to the pilot outcome. For example, the age correction exercise and broad greeting review do not help the learner complete the first work-speaking task.

## Recommended first-week split

### Day 1 — Unit A0-1 activation, 10–15 minutes

Target outcome:

> The learner can say their name, spell it clearly, and independently ask for repetition or slower speech.

Keep:

- one real work-entry situation;
- 5–8 reusable chunks at most;
- one short model dialogue;
- one controlled retrieval activity;
- one pronunciation focus directly connected to spelling intelligibility;
- guided speaking;
- reduced-prompt speaking;
- a concise completion check.

Required repair set:

- `Could you say that again?`
- `Could you speak more slowly?`
- `I don't understand yet.`

The reduced-prompt task should not display a complete model answer.

### Day 2 — Work identity

Target chunks:

- `I work as a ...`
- `I work at/for ...`
- `I study at ...`

Target questions:

- `What do you do?`
- `Where do you work or study?`

### Day 3 — One responsibility

Target chunks:

- `I help ...`
- `I work with ...`
- `My main job is ...`

Target questions:

- `What do you do at work?`
- `Who do you work with?`

### Day 4 — Five-question guided interaction

Use five predictable questions in a fixed order for rehearsal, but do not reuse the exact final-assessment scenario.

Suggested question set:

1. `What's your name?`
2. `How do you spell it?`
3. `What do you do?`
4. `Where do you work or study?`
5. `What do you do there?`

Insert one standardized fast utterance after question three so the learner has a real opportunity to request repetition or slower speech.

### Day 7 — Checkpoint

Use a different situation and reduced support. Record only approved numeric/boolean analytics. Do not send audio, transcript, employer, name, or free-text learner content to analytics.

## Proposed Unit A0-1 content cuts

The next production-content PR should review these as relocation/removal candidates, not delete them blindly:

- the full 26-letter HTML reference block;
- `letter`, `thank`, `nice`, and `meet` as separate vocabulary entries when they do not directly drive the first output;
- the second dialogue;
- duplicate sentence-building formats that test the same sentence;
- the age sentence-correction item;
- the separate reading passage;
- cumulative questions about `How are you?` and goodbye;
- the broad `/θ/` focus if it consumes time without improving name spelling or repair intelligibility.

Any cut must continue to satisfy the repository content-standard tests. The next implementation should use those tests as constraints rather than weakening them.

## Proposed Unit A0-1 content additions

The next content PR should add only the language needed for the activation outcome:

- `Could you speak more slowly?`
- `I don't understand yet.`
- a repair opportunity inside the speaking task;
- reduced-prompt level-two instructions;
- an explicit success condition for name, spelling, and one independently produced repair phrase.

Role, company, responsibility, and the five-question sequence should be added to the first-week journey, not crammed into the same 10–15 minute activation lesson.

## Sequencing constraints

1. Review and merge the baseline/final assessment PR before changing the lesson target, so teaching and scoring stay aligned.
2. Make the next production PR content-only where possible.
3. Preserve the current route, storage keys, section order, scoring, XP, FSRS, completion transaction, and analytics event names.
4. Do not refactor `UnitTemplate` or `SpeakingSection` merely to shorten the lesson.
5. Add focused content assertions before deleting large content blocks.
6. Keep all current units available; only the pilot journey is being validated.

## Suggested implementation batches

### P1A — This review

- documentation only;
- establish the target and current gaps;
- no learner-visible change.

### P1B — Characterize the current A0-1 output

- add focused tests for current speaking prompt, repair language, estimated time, and core outcome fields;
- tests should describe the transition boundary without locking obvious defects forever.

### P1C — Shorten A0-1 activation

- content-only change;
- set realistic 10–15 minute metadata;
- reduce duplicate activities;
- add slower-speech repair language;
- make level-two speaking a reduced-prompt transfer task.

### P1D — First-week work-speaking sequence

- adapt the smallest suitable existing units for role, company, responsibility, and five follow-up questions;
- add checkpoint instrumentation only when the checkpoint surface exists;
- preserve the modular monolith.

## Acceptance criteria for the next production iteration

- a learner reaches A0-1 warmup within the existing route gate;
- the lesson advertises 10–15 minutes rather than 40;
- a learner can complete the first speaking attempt without reading a full answer;
- name and spelling remain intact;
- all three repair phrases are available;
- production build, content-standard tests, full unit tests, and desktop/mobile lesson smoke E2E pass;
- no sensitive learner content is added to analytics;
- no route, auth, database transaction, XP, FSRS, or storage behavior changes.

## Not in scope yet

- AI conversation tutor;
- audio upload or transcript storage;
- new payment infrastructure;
- a new lesson renderer;
- a wholesale UnitTemplate refactor;
- broad A0–B2 curriculum rewriting;
- automatic merging.
