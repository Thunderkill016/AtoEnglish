# AtoEnglish 28-day work-speaking journey contract

**Status:** CycleWarden A2 planning artifact  
**Product boundary:** Vietnamese adult beginners who know some English but freeze when speaking at work  
**Daily promise:** 10–15 minutes  
**Final outcome:** deliver a 30–45 second work introduction, spell a Vietnamese name, answer five predictable questions, and independently ask for repetition or slower speech.

## Purpose

This document is the implementation contract between the product roadmap, lesson data, speaking assessment, and future curriculum pull requests.

It does not certify learning effectiveness. It defines what the repository must implement before the 28-day journey can be considered internally coherent.

## Non-goals

- rebuilding the complete A0–B2 curriculum;
- adding an AI conversation tutor;
- redesigning the full lesson renderer;
- adding mobile, payments, leagues, badges, or social features;
- replacing the existing AtoEnglish lesson blueprint;
- storing raw audio, transcripts, names, employer information, or learner free text in analytics.

## Final performance contract

At the end of day 28, the learner must be able to perform this task with no full-script prompt:

1. greet the listener;
2. state their name;
3. spell their name clearly;
4. state their role;
5. state their company or workplace type;
6. state one responsibility;
7. answer five predictable questions;
8. independently use at least one repair phrase when needed:
   - “Could you say that again?”
   - “Could you speak more slowly?”
   - “I don’t understand yet.”
9. close the interaction politely.

The final assessment remains a narrow work-speaking outcome, not a CEFR certification exam.

## Instructional progression

Every week follows the same controlled progression:

```text
model
→ notice useful chunks
→ controlled retrieval
→ supported speaking
→ reduced prompts
→ changed situation
→ checkpoint or final performance
```

Every daily lesson must produce spoken output. Vocabulary and grammar are supporting material, not the completion target.

## Prompt-support scale

| Level | Support | Learner behavior |
|---|---|---|
| P3 | Full model and sentence frame | repeat or substitute one personal detail |
| P2 | Keywords and partial frame | reconstruct the utterance with visible support |
| P1 | Task bullets only | speak from meaning with no complete sentence shown |
| P0 | Situation only | complete the task independently |

The sequence must reduce support over time. A later lesson may briefly return to P2 for a new chunk, but the final week must contain repeated P1 and P0 performance.

## Five predictable questions

The journey must prepare the learner to answer these functions. Exact wording may vary between practice and assessment.

1. What is your name?
2. How do you spell your name?
3. What do you do?
4. Where do you work?
5. What do you do there? / What are you responsible for?

A lesson may introduce natural variants, but it must not expand the first pilot into broad interview English.

## 28-day sequence

### Week 1 — Build the complete introduction

| Day | Can-do outcome | Required spoken output | Support target | Retrieval dependency |
|---|---|---|---|---|
| 1 | greet, say a name, and spell it | “Hello. My name is Minh. M-I-N-H.” | P3 → P2 | none |
| 2 | state a simple work role | “I’m a driver.” / “I’m an office worker.” | P3 → P2 | name + greeting |
| 3 | state a company or workplace | “I work at ABC Company.” / “I work at a restaurant.” | P3 → P2 | name + role |
| 4 | state one responsibility | “I help customers.” / “I deliver orders.” | P3 → P2 | role + workplace |
| 5 | combine a 20–30 second introduction | name + spelling + role + workplace + responsibility | P2 → P1 | days 1–4 |
| 6 | request repair | independently use “say that again”, “speak more slowly”, and “I don’t understand yet” in controlled turns | P2 → P1 | introduction chunks |
| 7 | complete checkpoint 1 | introduction plus one repair response in a changed workplace situation | P1 | all week 1 |

### Week 2 — Answer the five predictable questions

| Day | Can-do outcome | Required spoken output | Support target | Retrieval dependency |
|---|---|---|---|---|
| 8 | answer name and spelling questions | two short answers without reading a full script | P2 → P1 | days 1 and 7 |
| 9 | answer “What do you do?” | role answer with one natural variant | P2 → P1 | day 2 |
| 10 | answer “Where do you work?” | company or workplace answer | P2 → P1 | day 3 |
| 11 | answer responsibility question | one simple responsibility answer | P2 → P1 | day 4 |
| 12 | handle questions in a changed order | answer all five functions from shuffled prompts | P1 | days 8–11 |
| 13 | repair a difficult question | request repetition or slower speech before answering | P1 | day 6 + five questions |
| 14 | complete checkpoint 2 | introduction followed by all five questions | P1 | weeks 1–2 |

### Week 3 — Reduce prompts and change the situation

| Day | Can-do outcome | Required spoken output | Support target | Retrieval dependency |
|---|---|---|---|---|
| 15 | introduce yourself to a receptionist | complete introduction in a reception scenario | P1 | checkpoint 2 |
| 16 | introduce yourself to a new colleague | complete introduction with a natural greeting and closing | P1 | checkpoint 2 |
| 17 | introduce yourself to a client | adapt role/responsibility wording without adding advanced language | P1 | checkpoint 2 |
| 18 | answer a faster question sequence | use repair language when needed, then answer | P1 | days 12–13 |
| 19 | recover after one mistake | restart or correct one sentence without abandoning the task | P2 → P1 | full introduction |
| 20 | speak from task bullets only | 30–45 second introduction with no sentence frame | P1 | weeks 1–3 |
| 21 | complete checkpoint 3 | novel scenario, shuffled questions, one standardized repair opportunity | P1 → P0 | weeks 1–3 |

### Week 4 — Independent performance

| Day | Can-do outcome | Required spoken output | Support target | Retrieval dependency |
|---|---|---|---|---|
| 22 | improve task completion | include every required function once | P1 | checkpoint 3 feedback |
| 23 | improve comprehensibility | repeat the task with slower pace, clear spelling, and complete short sentences | P1 | checkpoint 3 feedback |
| 24 | improve target chunks | use accurate introduction, question-answer, and repair chunks | P1 | checkpoint 3 feedback |
| 25 | improve basic fluency | complete the task with fewer long pauses and restarts | P1 | checkpoint 3 feedback |
| 26 | complete rehearsal 1 | full performance in a new scenario | P0 | all previous days |
| 27 | complete rehearsal 2 | full performance with shuffled questions and repair check | P0 | all previous days |
| 28 | complete final assessment | distinct final scenario measuring the same five functions as baseline | P0 | complete journey |

## First-week language boundary

The first week may introduce only the language required for the checkpoint.

### Required chunks

- Hello. / Hi.
- My name is …
- That’s … [spelling]
- I’m a …
- I work at … / I work in …
- I … [one responsibility]
- Nice to meet you.
- Could you say that again?
- Could you speak more slowly?
- I don’t understand yet.

### Allowed supporting grammar

- `I am / I’m`
- `My name is`
- simple present with `I`
- basic `at / in` for workplace
- `Could you …?` as a memorized repair chunk

Do not turn week 1 into a broad grammar course on the verb `be`, the alphabet, occupations, companies, prepositions, and present simple. Explain only what supports the speaking task.

## Unit A0-1 acceptance contract

The existing `unitA01.ts` must not remain a 40-minute container for the entire first-week journey.

A later implementation PR must choose one of these bounded designs:

### Preferred design — Day 1 lesson

Unit A0-1 becomes a 10–15 minute activation lesson that covers:

- greeting;
- name;
- spelling a Vietnamese name;
- one lightweight “say that again” survival chunk;
- one final spoken output using name and spelling.

Role, company, responsibility, full five-question practice, and complete repair training move to later first-week lessons.

### Acceptable alternative — Explicit multi-session unit

If the product keeps Unit A0-1 as a larger container, the UI and data must expose clear 10–15 minute daily sessions with independent completion boundaries. Merely changing `estimatedTime` is not sufficient.

## Current Unit A0-1 gap record

Repository inspection shows these mismatches:

- `estimatedTime` is 40 minutes rather than the pilot's 10–15 minute daily promise;
- the listed outcomes cover alphabet, name spelling, and a basic introduction but not role, company, responsibility, or five questions;
- the final speaking prompt covers name and spelling only;
- “Can you say that again?” exists, but “Could you speak more slowly?” is absent from the final output contract;
- substantial alphabet, vocabulary, grammar, dialogue, listening, fluency, quiz, reading, and cumulative-review material competes for one first-session completion.

These are scope findings, not a request to delete useful content. Material may be retained, shortened, or moved to later days according to the sequence.

## Lesson implementation requirements

Every lesson PR in this journey must show:

1. the day and can-do outcome it implements;
2. the learner's final spoken output;
3. the starting and ending prompt-support level;
4. which earlier chunks it retrieves;
5. which later performance it prepares;
6. why its content fits 10–15 minutes;
7. which files are intentionally out of scope.

## Completion evidence

A daily lesson is not complete merely because the learner opened every section or passed a multiple-choice quiz.

The daily completion path must include the required spoken task or an explicit manual fallback when browser speech capability is unavailable. Analytics may record bounded event names and numeric or boolean outcomes only, following the existing pilot privacy boundary.

## Repository verification gates

A curriculum implementation PR must run the relevant gates:

```bash
npm run test:content-standard
bash scripts/audit-lesson-content.sh
npx tsc --noEmit
npm run lint
npm run test
npm run build
```

It must also run targeted Unit A0-1 tests and relevant production lesson smoke checks.

Checks must verify outcome alignment in addition to field counts. At minimum, future targeted assertions should confirm:

- daily time scope is compatible with 10–15 minutes;
- the required spoken output exists;
- week 1 covers all required introduction functions across the sequence;
- all three repair phrases have a defined practice point;
- the five predictable questions have a defined retrieval point;
- day 28 remains comparable with the baseline assessment without reusing the same scenario.

## Change-control rule

Only one bounded curriculum outcome should be implemented per pull request. Do not combine lesson content changes with authentication, database, analytics infrastructure, XP, FSRS, payment, or architecture refactors.

The first code PR governed by this contract should change only Unit A0-1 and its direct targeted tests. Later first-week units should be handled separately.