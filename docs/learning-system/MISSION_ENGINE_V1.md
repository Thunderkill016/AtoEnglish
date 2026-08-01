# AtoEnglish Mission Engine v1

## Product outcome

AtoEnglish does not claim general fluency after a short course. Each mission promises one bounded, observable communication outcome.

## Applied research

- CEFR action-oriented can-do outcomes.
- British Council-style staged speaking lessons.
- LibreLingo/OpenWords content-as-data contracts.
- Immergo-style bounded roleplay.
- Everyone Can Use English spoken self-training.
- Immediate corrective feedback and retrieval retry.
- FSRS delayed review.
- Deterministic state-machine progression.
- Prompt regression principles before AI evaluators.
- Privacy-first evidence without raw audio or transcript persistence.

## Mission contract

A valid mission includes one scenario, one can-do outcome, four to eight reusable chunks, required intents, bounded roleplay, at most two corrections, mandatory retry, transfer variants after 1/7/30 days, and no pronunciation score from transcript evidence.

## Learning loop

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

## Gold Mission 01

The learner states their name and role, asks the other person's name, and requests repetition when they do not understand.

Required intents:

- `introduce_name`
- `state_role`
- `ask_name`
- `repair_request`

Target chunks:

- Hi, I'm ...
- I work as a ...
- I work at ...
- What's your name?
- Nice to meet you.
- Could you say that again?
- How do you spell that?
- Sorry, I didn't catch that.

## Evidence boundaries

Allowed evidence:

- Required intent present or absent.
- Task-completion percentage.
- Bounded rule-based corrections.
- Deterministic checkpoint answers.
- Retry result scored independently.

Unavailable until human calibration with Vietnamese learners:

- Phoneme accuracy.
- Accent quality.
- Comprehensibility from transcript alone.
- CEFR certification.
- General fluency claims.

## Retry and transfer integrity

A retry is scored independently. Transfer completion requires a first evaluation, feedback, a retry in the same `session_id`, and a passing latest retry score. Evidence from separate sessions is never combined.

Transfer contexts change after 1, 7, and 30 days. The learning path surfaces the latest due variant from lesson completion time and clears it only after verified retry evidence.

## FSRS

After the aligned checkpoint verifies mastery, the eight communication chunks are inserted into the existing FSRS card deck. Raw audio and transcripts are not persisted.

## Migration

Only `unit-a0-1` uses Mission Engine v1 initially. Other units remain on the legacy runner until they have a validated mission, aligned checkpoint, transfer plan, independent review, and pilot evidence.

## Deferred

- Free-form realtime AI conversation.
- LLM-based mastery decisions.
- GOP/GOPT pronunciation scores.
- Raw audio persistence.
- Self-hosted Whisper/Kokoro/LiveKit.
- Importing an entire LMS.

## Verification

Verified on a Vercel production build of the implementation code:

- Next.js production compilation.
- TypeScript compilation.
- Transfer route generation.
- HTTP 200 server render for `/learn/unit-a0-1` with mission title, scenario, can-do outcome, and guest entry.

Not verified in the current environment:

- Complete Vitest/content-standard suite after latest changes.
- Interactive click and microphone behavior due preview-domain browser restrictions.
- Hosted Supabase migration application.
- Authenticated transfer behavior with production-like data.
- Independent pedagogical review or learner pilot outcomes.
