# AtoEnglish Lesson System V2

Status: research-backed architecture draft

This document replaces the current assumption that every lesson should use the same ten-section flow and the same minimum content counts. It is the single design reference for rebuilding all AtoEnglish lessons from the legacy A0 label through B2.

## 1. Product decision

AtoEnglish will be built around **real communicative missions**, not around lists of vocabulary and grammar topics.

Each core lesson must answer one question:

> What useful thing can the learner do in English after this session that they could not do before it?

The default session should be short enough for a busy Vietnamese adult to finish in one sitting, but it must include genuine language production. Optional deep practice and spaced review are separate from the core lesson.

## 2. Why the current system must be replaced

The current architecture has several structural problems:

1. `UnitData` is one large interface containing vocabulary, grammar, two dialogues, listening, translation, shadowing, speaking, quizzes, cultural notes, job scenarios and review fields. This encourages content authors to fill fields instead of designing a coherent learning task.
2. `LESSON_SECTIONS` forces the same ten sections on every level: warm-up, vocabulary, grammar, practice, dialogue, fluency, translation, shadowing, speaking and quiz.
3. The content validator rewards quantity: every unit needs at least eight vocabulary items, two dialogues, five listening questions, five quiz questions, three translations and five fluency items. Passing the validator does not prove that the learner achieved the lesson outcome.
4. The legacy `A0` label is not an official CEFR level. The CEFR Companion Volume uses **Pre-A1**.
5. Lesson outcomes are free text and are not linked to official CEFR descriptors, communicative activities or assessment evidence.
6. The same lesson shape is used for true beginners and B2 learners, although the cognitive, linguistic and interaction demands should be very different.
7. The current speaking score is word overlap between an expected sentence and an ASR transcript. It does not measure pronunciation, comprehensibility, fluency or task achievement and must not be presented as a pronunciation score.
8. Vocabulary and grammar are commonly taught as separate blocks before the learner performs a meaningful task. This creates long lessons and delays the first spoken output.
9. Review is largely content-driven rather than error-driven. A learner may review every item even when only a few chunks caused difficulty.
10. A single reference lesson (`unit1.ts`) is treated as the gold sample for all levels. V2 needs a separate gold sample for Pre-A1, A1, A2, B1 and B2.

## 3. Research principles translated into product rules

### 3.1 CEFR: learner as a social agent

The CEFR is not a grammar sequence. It describes what learners can do through reception, production, interaction and mediation in personal, public, occupational and educational domains.

Product rule:

- every lesson has one primary `can-do` outcome;
- curriculum, lesson activities and assessment evidence must all align to that outcome;
- grammar and vocabulary are supporting resources, not the lesson goal;
- the legacy database value `A0` may remain temporarily for compatibility, but all pedagogy and UI copy should use `Pre-A1`.

### 3.2 Action-oriented and task-based learning

Learners need to use language to complete a purposeful task, not merely demonstrate knowledge about language.

Product rule:

- every core lesson ends with a realistic performance task;
- the learner performs the task at least twice when speaking is the primary skill;
- attempt one reveals the gap, feedback targets the gap, and attempt two builds fluency and confidence;
- tasks must have a clear role, goal, context and success criteria.

### 3.3 Useful chunks before abstract rules

Real conversation relies heavily on formulaic sequences and lexical bundles. Beginners especially need complete phrases that can be used immediately.

Product rule:

- teach a small set of high-value chunks tied to the mission;
- show grammar through patterns inside those chunks;
- add a short explanation only when it helps the learner notice or repair a predictable error;
- do not require a standalone grammar section in every lesson.

### 3.4 Retrieval and spacing

Retrieval practice and spaced encounters improve long-term retention. Repeating an item immediately many times is not a substitute for later retrieval.

Product rule:

- move from recognition to cued recall to free production;
- schedule review of chunks and errors after the lesson;
- interleave old language into later missions;
- review should prioritise items the learner failed, hesitated on or requested help with;
- FSRS should schedule meaningful chunks and repair items, not automatically seed every field from every unit.

### 3.5 Speaking develops through repetition with changed support

Task repetition can improve oral fluency. Repetition should reduce support rather than ask the learner to read the identical sentence indefinitely.

Product rule:

- attempt one may include a model or sentence frame;
- attempt two should remove some support or vary the context;
- feedback prioritises meaning and comprehensibility before minor grammatical accuracy;
- the learner should speak from the first lesson, not only after several content sections.

### 3.6 Vietnamese-specific support should target intelligibility

Vietnamese learners benefit from explicit comparison when English contrasts are absent or expressed differently in Vietnamese. Pronunciation support should focus on intelligibility, including final consonants, clusters, stress, rhythm and selected difficult consonants.

Product rule:

- L1 notes are attached only to a real predicted difficulty;
- do not force an L1 note onto every vocabulary item;
- pronunciation goals are phrased as intelligibility goals, not accent elimination;
- a spelling-based heuristic must never claim to diagnose a sound accurately;
- all Vietnamese explanations must be short and actionable.

### 3.7 Short core lesson, separate optional practice

Strong commercial products commonly use short, practical sessions and separate targeted review or conversation modes.

Product rule:

- the core lesson should normally take 8–20 minutes depending on level;
- optional pronunciation, vocabulary review, extended conversation and exam practice are separate sessions;
- the learner should never need to complete ten mandatory sections to earn progress for one small outcome.

## 4. V2 lesson loop

A core lesson is assembled dynamically from the following blocks. Not every lesson requires every block.

1. **Need** — a concrete role, situation and goal; show the can-do outcome.
2. **Model** — short audio or dialogue demonstrating successful task completion.
3. **Notice** — identify a small number of chunks, one pattern and any critical pragmatic or pronunciation feature.
4. **Guided practice** — recognition and cued recall with immediate feedback.
5. **Rehearse** — build or personalise the learner's response.
6. **Perform** — complete the real task; capture evidence.
7. **Repair and repeat** — targeted feedback followed by a second attempt with less support.
8. **Exit check** — confirm the can-do outcome and schedule spaced review.

The engine must support branching. A learner who already succeeds can skip extra guided practice. A learner who struggles receives an easier scaffold rather than simply more questions of the same type.

## 5. Level design budgets

These are AtoEnglish product budgets informed by the research, not official CEFR requirements.

| Level | Core lesson | New high-priority targets | Spoken performance | Typical support |
|---|---:|---:|---:|---|
| Pre-A1 | 8–12 min | 3–5 chunks | 10–25 seconds | full model, pictures, Vietnamese, word bank |
| A1 | 10–15 min | 4–7 chunks | 20–45 seconds | model, sentence frames, limited choices |
| A2 | 12–18 min | 5–8 chunks | 40–75 seconds | prompts, key words, repair phrases |
| B1 | 15–20 min | 6–10 chunks/discourse moves | 60–120 seconds | outline and feedback rubric |
| B2 | 18–25 min | 6–12 lexical/discourse targets | 90–180 seconds | task brief, authentic input, minimal frames |

Rules:

- these are maximum new targets for a core lesson, not quotas;
- familiar words used in a model do not automatically become lesson targets;
- a complex B2 task may contain rich input but still focus assessment on a small number of discourse moves;
- lesson duration is calculated from actual steps rather than typed manually.

## 6. Curriculum architecture

### 6.1 Keep compatibility, change the mental model

The existing 50 unit IDs can remain during migration so progress records and routes do not break. Each legacy unit becomes a **mission**. A mission may contain:

- one core lesson;
- one targeted practice session;
- one performance or conversation session;
- scheduled smart reviews.

The core lesson is required. Other sessions are recommended or unlocked based on learner evidence.

### 6.2 Level focus

#### Pre-A1 (legacy A0)

Goal: survive the first seconds of a simple interaction using memorised expressions and clear repair strategies.

Focus:

- identity, numbers, time, basic needs, directions and emergencies;
- understanding slow repeated speech;
- isolated words and basic expressions;
- asking for repetition and slower speech;
- intelligible production of names, numbers and critical final sounds.

#### A1

Goal: handle simple predictable exchanges about personal and everyday needs.

Focus:

- asking and answering simple questions;
- short linked turns rather than isolated sentence translation;
- basic politeness and turn-taking;
- high-frequency present, past and future meanings only as needed by tasks.

#### A2

Goal: manage routine transactions and short conversations on familiar matters.

Focus:

- connected sequences of sentences;
- clarification and confirmation;
- simple narratives, plans, comparisons and explanations;
- workplace and public-service interactions relevant to Vietnamese adults.

#### B1

Goal: maintain interaction and explain experiences, reasons and opinions on familiar professional and social topics.

Focus:

- discourse organisation;
- storytelling and problem–solution language;
- handling less predictable follow-up questions;
- mediation of straightforward information;
- intelligibility, pausing and repair under time pressure.

#### B2

Goal: participate effectively in extended discussion, argument, negotiation and professional communication.

Focus:

- stance, hedging, challenge and agreement;
- synthesis and mediation of information;
- register and pragmatic appropriacy;
- extended turns with coherent discourse;
- flexible recovery when wording is unavailable.

## 7. Assessment model

### 7.1 Evidence types

A lesson records evidence, not just completion clicks:

- selected response;
- constructed written response;
- ASR transcript;
- recorded audio when the learner consents;
- task checklist;
- learner confidence and self-assessment;
- attempt-one versus attempt-two change.

### 7.2 Speaking rubric

For speaking tasks, V2 uses a small level-appropriate rubric:

1. **Task achievement** — did the learner communicate the required information or accomplish the goal?
2. **Comprehensibility** — can a sympathetic listener understand the message?
3. **Fluency** — can the learner continue without excessive breakdown for the target level?
4. **Language control** — are target chunks and structures usable enough for the task?
5. **Interaction and repair** — when relevant, can the learner respond, clarify, confirm or ask for help?

Pronunciation is part of comprehensibility. Browser speech recognition may provide practice hints, but word overlap alone is not a pronunciation assessment.

### 7.3 Exit decision

A lesson can be completed when the task is achieved, even with language errors. The system records repair needs and schedules them for review. Completion and mastery are separate concepts.

## 8. New content schema requirements

Every V2 lesson must include:

- stable lesson and mission IDs;
- CEFR level plus optional legacy level;
- domain and communicative activity;
- one official or locally adapted can-do descriptor;
- prerequisites;
- a small set of language targets;
- a dynamic sequence of typed steps;
- a performance task with two attempts for speaking-first lessons;
- explicit success criteria;
- review items derived from targets and learner errors;
- analytics events tied to outcomes, attempts and help usage.

The validator must test alignment and coherence, not minimum content bulk.

## 9. Rebuild sequence

### Phase 0 — freeze and inventory

- keep legacy lessons available;
- do not add new mandatory fields to `UnitData`;
- inventory every unit's topic, promised outcome, actual task, duration, vocabulary load and assessment method;
- flag unsupported claims and incorrect language.

### Phase 1 — V2 engine and schema

- add typed V2 lesson schema and validator;
- add a renderer that composes only the steps defined by a lesson;
- support progress migration and feature flags;
- separate core lesson, practice and review modes;
- replace the current word-overlap label “pronunciation accuracy” with honest practice feedback.

### Phase 2 — five gold lessons

Build and test one gold lesson per level:

- Pre-A1: introduce yourself and ask for slower speech;
- A1: meet a new colleague and exchange basic details;
- A2: solve a routine delivery or shopping problem;
- B1: explain a workplace problem and proposed solution;
- B2: negotiate priorities and challenge an idea politely.

Each gold lesson must be tested with Vietnamese adults before it becomes a template.

### Phase 3 — curriculum map

- map all 50 mission IDs to CEFR can-do outcomes;
- remove duplicate topics and fill missing communicative functions;
- establish prerequisites and spiral review links;
- decide which legacy units should be merged, split or renamed.

### Phase 4 — batch rewrite

Rewrite in level batches only after the gold lesson for that level passes product and learning checks. Use one long-lived implementation branch and controlled review batches; do not generate one pull request per lesson.

### Phase 5 — pilot and iterate

Measure:

- time to first meaningful spoken output;
- core lesson completion rate;
- performance attempt rate;
- second-attempt improvement;
- help and replay usage;
- delayed retrieval after 1, 3, 7 and 21 days;
- seven-day return;
- user-reported usefulness in a real situation.

## 10. Definition of done for one rebuilt lesson

A lesson is not complete merely because all fields exist. It is complete when:

- the can-do outcome is clear and level-appropriate;
- every target is necessary for the task;
- the learner reaches meaningful output early;
- the task resembles a real communicative need;
- assessment evidence matches the outcome;
- support decreases between attempts;
- Vietnamese notes address genuine transfer or pragmatic risk;
- duration fits the level budget;
- all audio and language have been reviewed;
- automated schema, alignment and content tests pass;
- at least one learner can complete the task without author guidance.

## 11. Source foundation

Primary and authoritative references used for this architecture:

- Council of Europe, *CEFR Companion Volume* and official descriptor search: https://www.coe.int/en/web/common-european-framework-reference-languages
- British Council LearnEnglish speaking lessons and TeachingEnglish speaking resources: https://learnenglish.britishcouncil.org/free-resources/speaking and https://www.teachingenglish.org.uk/
- Rod Ellis, “Principles of Instructed Language Learning,” *System* 33 (2005).
- Paul Nation, the Four Strands framework for a balanced language course.
- Lambert, Kormos and Minn, “Task Repetition and Second Language Speech Processing,” *Studies in Second Language Acquisition* (2017 issue; published online 2016).
- Nakata, “Effects of Expanding and Equal Spacing on Second Language Vocabulary Learning,” *Studies in Second Language Acquisition* 37 (2015).
- Bahrick et al., “Maintenance of Foreign Language Vocabulary and the Spacing Effect,” *Psychological Science* 4 (1993).
- Do Anh Tuan, “Intelligible Pronunciation: Teaching English to Vietnamese Learners,” *VNU Journal of Foreign Studies* 37 (2021).

Product benchmarks were used only for interaction patterns, not as scientific proof:

- Duolingo: communication goals, progressive exercise difficulty, speaking from early lessons and separate targeted practice;
- Babbel: short practical lessons, contextual language and scheduled review;
- Busuu: communicative focus, chunks, controlled-to-free practice and CEFR organisation;
- Speak: learn–practice–conversation loop and speaking-first positioning.
