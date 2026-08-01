# AtoEnglish Mission Engine v1

Mission Engine v1 applies the researched lesson-design patterns to Gold Mission 01: a bounded can-do outcome, context-first chunks, guided and independent speaking, deterministic intent evaluation, at most two corrections, mandatory retry, checkpoint-aligned mastery, FSRS review, and transfer tests after 1/7/30 days.

## Gold Mission 01

The learner states their name and role, asks the other person's name, and requests repetition when they do not understand.

Required intents: `introduce_name`, `state_role`, `ask_name`, and `repair_request`.

The lesson uses eight communication chunks, four bounded roleplay turns, immediate feedback, and a full-task retry.

## Evidence boundaries

The evaluator may score required intents and task completion from a transcript. It deliberately does not infer pronunciation, accent quality, or comprehensibility from transcript evidence. Raw audio and transcripts are not persisted in `learning_attempts`.

A retry is scored independently. Transfer completion requires a first evaluation, feedback, and a passing retry in the same `session_id`; evidence from separate sessions is never combined.

## Review and transfer

After the aligned checkpoint verifies mastery, the eight chunks are inserted into the existing FSRS deck. Transfer tests change the context after 1, 7, and 30 days and remain visible until a same-session retry passes.

## Migration strategy

Only `unit-a0-1` uses Mission Engine v1 initially. Other lessons remain on the legacy runner until they have a validated mission, aligned checkpoint, transfer plan, independent pedagogical review, and learner pilot evidence.

## Verification

Verified: Vercel production compilation, TypeScript compilation, transfer route generation, and HTTP 200 server render for `/learn/unit-a0-1`.

Not yet verified: the complete latest test suite, interactive microphone behavior, hosted Supabase migration, authenticated transfer with production-like data, and learner pilot outcomes.
