# AtoEnglish Mission Engine v1

## 1. Product outcome

AtoEnglish does not claim that a learner becomes generally fluent after a short course. A mission promises one bounded communication outcome:

> After the lesson and delayed transfer checks, the learner can complete a named real-world communication task with simple, comprehensible English.

The first implementation is **Gold Mission 01 — Gặp đồng nghiệp mới**.

## 2. Research translated into product rules

| Research/repository pattern | AtoEnglish implementation |
| --- | --- |
| CEFR action-oriented can-do outcomes | Every mission starts with one observable `canDoVi`. |
| British Council-style staged speaking lesson | Scenario → model input → guided practice → independent roleplay. |
| LibreLingo/OpenWords content-as-data | `MissionSpecV1` separates lesson content from UI code and can be validated. |
| Immergo-style bounded roleplay | The partner has a role, the learner has required intents, and the conversation stays inside the mission. |
| Everyone Can Use English self-training | The learner must produce spoken output rather than only choose answers. |
| Retrieval practice and corrective feedback | Feedback is limited to two corrections and is followed by a mandatory retry. |
| FSRS | Verified target chunks are seeded into the existing `cards` deck after checkpoint mastery. |
| XState/state-machine architecture | Mission progression is implemented as a deterministic transition system; the LLM cannot silently change lesson order. |
| Prompt evaluation practice | Deterministic regression tests cover the evaluator before an AI evaluator is introduced. |
| Privacy-first speech systems | Raw audio and transcripts are intentionally excluded from `learning_attempts`. |

These projects are design inputs, not wholesale dependencies. AtoEnglish should not fork an LMS, a Duolingo clone, or a realtime-agent framework into the learning core.

## 3. Mission contract

A valid mission must contain:

- One concrete communication scenario.
- One observable can-do outcome.
- Four to eight reusable chunks.
- At least one required communication intent.
- A bounded roleplay with explicit expected intents.
- At most two feedback corrections.
- Mandatory immediate retry.
- Transfer variants at day 1, day 7, and day 30.
- An explicit rule that transcript evidence cannot produce pronunciation scores.

`validateMissionSpec()` enforces these invariants. `evaluateLessonQuality()` blocks automated QA when an attached mission violates the contract or its required intents are missing from the lesson evidence manifest.

## 4. Learning loop

```text
Scenario
→ Model language in context
→ Guided roleplay
→ Independent roleplay
→ Task/intent evaluation
→ At most two corrections
→ Mandatory full-task retry
→ Checkpoint
→ FSRS chunk review
→ Transfer roleplay after 1/7/30 days
```

A learner cannot complete Gold Mission 01 by clicking “I spoke”. The runner requires speech recognition evidence when supported. The fallback instructs the learner to speak aloud and then type what was said, while clearly marking that text as content evidence only.

## 5. Evidence hierarchy

### Deterministic evidence currently allowed

- Required intent present or absent in the transcript.
- Task-completion percentage.
- Bounded, rule-based corrections for known A0 errors.
- Deterministic checkpoint answers.
- Retry result, scored independently from the first attempt.

### Evidence deliberately unavailable

- Phoneme accuracy.
- Accent quality.
- Intelligibility/comprehensibility from transcript alone.
- CEFR certification.
- A claim of general conversational fluency.

The evaluator returns `null` for pronunciation and comprehensibility until an acoustic model has been calibrated against human ratings from Vietnamese learners.

## 6. Gold Mission 01

### Can-do

The learner can state their name and role, ask the other person's name, and request repetition when they do not understand.

### Required intents

- `introduce_name`
- `state_role`
- `ask_name`
- `repair_request`

### Target chunks

- Hi, I'm ...
- I work as a ...
- I work at ...
- What's your name?
- Nice to meet you.
- Could you say that again?
- How do you spell that?
- Sorry, I didn't catch that.

### Completion

The lesson roleplay generates evidence but does not itself mark mastery. Mastery is recorded only after the mission-aligned checkpoint passes. The verified chunks are then inserted into the existing FSRS deck.

## 7. Retry integrity

A retry is scored independently. Earlier correct sentences cannot hide an incomplete or incorrect retry.

For transfer tests, completion requires:

1. A first roleplay evaluation.
2. Feedback.
3. A retry evaluation.
4. The latest retry score meeting the mission pass threshold.

Abandoning a transfer test on the feedback screen does not clear it from the learning path.

## 8. Delayed transfer

Transfer tests use the original mission intents but change the context, partner opening, and communication conditions.

- Day 1: new colleague in a café.
- Day 7: audio-only call with a faster speaker.
- Day 30: first meeting with a client and fewer supports.

The learning page derives the latest due variant from `user_lesson_progress.completed_at` and hides it only after verified retry evidence exists in `learning_attempts`.

## 9. Data and privacy

`learning_attempts` stores:

- user/session/lesson/activity IDs;
- modality and scoring status;
- bounded score and error tags;
- evaluator name/version;
- timestamp and optional latency.

It intentionally does not store:

- raw microphone audio;
- speech transcript;
- generated voice biometrics;
- unsupported pronunciation claims.

If raw audio is introduced for research, it requires separate consent, retention limits, deletion controls, and a dataset governance review.

## 10. Authoring the next mission

Do not begin from vocabulary or grammar. Begin from a real task.

1. Write one can-do statement.
2. Define the learner and partner roles.
3. Define four to eight high-frequency chunks.
4. Define required intents and deterministic examples/matchers.
5. Write a short model dialogue.
6. Write bounded roleplay turns.
7. Define at most two high-value feedback rules.
8. Create a full-task retry.
9. Create a checkpoint aligned to the same outcome.
10. Create day 1/7/30 transfer variants.
11. Run mission contract and regression tests.
12. Obtain independent pedagogical review and pilot evidence before publication.

## 11. Migration strategy

Only `unit-a0-1` uses Mission Engine v1 initially. The remaining pilot units stay on the legacy runner until each has:

- a real communication outcome;
- a validated mission spec;
- aligned checkpoint evidence;
- a transfer plan;
- independent review.

This avoids converting 42 units into a new untested format at once.

## 12. Deferred deliberately

The following are not part of v1:

- Free-form realtime AI conversation.
- An LLM deciding whether the learner mastered a mission.
- GOP/GOPT pronunciation scores.
- Raw audio persistence.
- Self-hosted Whisper/Kokoro/LiveKit infrastructure.
- Importing LibreLingo, Oppia, H5P, or another LMS.

They may be evaluated after Gold Mission 01 produces real pilot data. Any AI evaluator must be added behind a structured schema and a prompt regression suite; it must not replace deterministic task evidence without human calibration.
