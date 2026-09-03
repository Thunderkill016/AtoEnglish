# Adaptive Produce Conversation V1

## Goal

Move the first bounded Realtime tutor interaction from a standalone preview into the canonical adaptive proving surface without widening the trust boundary.

## Activation policy

Only a planner-selected practice with both:

- `kind = produce`
- `modality = speech`

uses Realtime `conversation` mode.

All other speech practice remains capture-only in this slice:

- `retrieve` -> capture
- `repair` -> capture
- `transfer` -> capture

Non-speech practice does not enter the voice policy.

The policy is centralized in `adaptive-voice-policy.ts` and regression-tested so later UI edits cannot silently make retrieval interactive.

## Conversation boundary

For eligible produce practice, the browser sends only canonical task identity:

- lesson id
- lesson version
- action id

The `/api/realtime/session` server route resolves the task again, compiles tutor instructions and—through the PR #96 sideband guard—fails closed unless a trusted server monitor is attached.

The one-turn budget remains server-controlled:

1. AI partner opening response
2. learner spoken turn
3. one short AI partner response
4. call closes

The browser does not receive evaluator targets, evidence type, mastery values, hidden answer keys or a generic Realtime send primitive.

## Evidence boundary

Realtime remains interaction transport, not mastery authority.

After the learner transcript is captured:

- transcript stays transient in component state;
- `recordNếpPracticeAttempt()` receives canonical lesson/action identity and observed response;
- the trusted canonical evaluator recomputes success;
- the DB/RPC decides whether evidence is allowed;
- editing the transcript changes `responseSource` to `text`, so it cannot masquerade as speaking evidence;
- assistant transcript is not persisted or used for grading;
- no pronunciation score is produced.

## Fallback behavior

If a conversation session cannot be opened, the surface may fall back to capture-only Realtime and then browser speech recognition.

The UI explicitly labels this downgrade as **not interactive roleplay**. The captured learner speech may still be evaluated as ordinary speaking evidence under the existing canonical policy.

If the provider fails after the conversation has already started, the current interaction is closed. The client does not silently splice a new capture session into the same roleplay.

## Scope intentionally deferred

This slice does not activate interactive conversation for repair or transfer. Those require separate review because the tutor behavior and evidence leakage risks differ from a simple produce turn.

Live provider validation still requires an authenticated AtoEnglish browser session, microphone permission and a working server-only Preview `OPENAI_API_KEY`; repository CI cannot substitute for that external smoke test.
