# Gold Day 1 user pilot

> **Document status:** historical; superseded and retained for provenance
> **Governing authority:** [constitution](../../../.specify/memory/constitution.md); it wins on conflict

## Product question

Can a Vietnamese beginner complete one useful workplace-English outcome in 10–15 minutes, receive understandable feedback, and perform the full task better on the required retry?

## Participants

Recruit 5–10 people who match all of these conditions:

- Vietnamese is their first language.
- They describe themselves as mất gốc, A0, or very early A1.
- They use a phone for the session.
- They have not previously seen the Gold Day 1 lesson.

Do not include team members, English teachers, or experienced language-app users in the first signal set.

## Test route

1. Open the preview link on a phone.
2. Start `Bài A0-1: Gặp đồng nghiệp mới` without an account.
3. Complete scenario, six target chunks, guided roleplay, independent roleplay, feedback, and full-task retry.
4. Continue to checkpoint and sign in only when prompted.
5. Return to the checkpoint after sign-in.

The facilitator must not translate the English prompts, suggest an answer, or operate the phone unless the participant is blocked by a technical failure.

## Evidence to record

Record one row per participant. Do not store raw audio or a full transcript.

| Field | Allowed value |
| --- | --- |
| `participant_id` | anonymous code |
| `device` | Android / iPhone |
| `browser` | Chrome / Safari / other |
| `completed_without_help` | yes / no |
| `first_attempt_required_intents` | 0–4 |
| `retry_required_intents` | 0–4 |
| `feedback_understood` | yes / partly / no |
| `microphone_worked` | yes / no |
| `checkpoint_return_worked` | yes / no |
| `minutes_to_retry` | whole minutes |
| `largest_blocker` | one short note |

## Success gate

Gold Day 1 is ready for a wider pilot only when all conditions are met:

- At least 70% complete the full retry without facilitator language help.
- Median time to retry is 15 minutes or less.
- At least 70% improve or maintain the number of required intents on retry.
- At least 80% say the two corrections are understandable.
- No participant loses progress during sign-in and checkpoint return.
- Microphone failure does not block completion because the spoken-text fallback remains usable.

## Stop conditions

Stop the session and log a blocker when any of these occur:

- The participant cannot understand what action the screen requests.
- The microphone permission path has no recovery action.
- Feedback asks for more than two corrections.
- Retry can be skipped.
- Checkpoint is reachable without completing retry.
- Sign-in returns to the wrong page.

## Decision after 5–10 sessions

- **Ship:** all success gates pass and there is no repeated blocker.
- **Revise:** completion works but one comprehension or microphone issue repeats twice.
- **Reject the lesson design:** fewer than half complete the retry without language help.

The primary outcome is not test completion. It is whether a beginner can perform the four communication intents after one short learning session.
