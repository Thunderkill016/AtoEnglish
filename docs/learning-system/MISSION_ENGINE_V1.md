# AtoEnglish Mission Engine v1

Mission Engine v1 translates the repository research into one enforceable learning system for all six A0 pilot lessons. Every lesson has a bounded can-do outcome, context-first chunks, guided and independent speaking, deterministic intent evaluation, at most two corrections, a mandatory full-task retry, an aligned checkpoint, FSRS review, and delayed transfer tests after 1/7/30 days.

## Six pilot missions

| Lesson | Mission | Observable outcome |
| --- | --- | --- |
| `unit-a0-1` | Gặp đồng nghiệp mới | State name and role, ask the other person's name, and repair a misunderstanding. |
| `unit-a0-2` | Mua đồ và thanh toán | Ask the price, confirm a purchase, choose payment, and ask for the price again. |
| `unit-a0-3` | Chọn quần áo đúng màu và kích cỡ | State the item, color and size, ask availability, and make a choice. |
| `unit-a0-4` | Chào hỏi và nói chuyện ngắn ở công ty | Greet, answer a wellbeing question, reciprocate, and close politely. |
| `unit-a0-5` | Trả lời thông tin cá nhân tại sân bay | State identity, origin, job and location, and ask for a question to be repeated. |
| `unit-a0-6` | Giới thiệu gia đình qua một bức ảnh | Introduce family members with he/she/they and ask the other person about siblings. |

Each mission contains:

- four to eight reusable communication chunks;
- required task and interaction intents;
- four bounded roleplay turns;
- mission-specific feedback rules;
- a full-task retry scored independently from the first attempt;
- a checkpoint covering every required intent;
- three fully changed transfer dialogue frames at day 1, day 7 and day 30.

## Shared architecture

`mission-catalog.ts` is the single registry for the six pilot missions. The lesson page, checkpoint route, FSRS seeding, transfer queue, transfer route and quality gate all resolve missions from this catalog rather than hard-coding one lesson.

`MissionRunner` and `MissionTransferRunner` are data-driven. Partner name, number of chunks, roleplay turns, intent evidence, corrections and transfer dialogue lines come from `MissionSpecV1`.

The initial evaluator is turn-aware: an intent only counts in the roleplay turn that asks for it. A full-task retry is evaluated by itself, so correct language from the first attempt cannot hide a failed retry.

## Evidence boundaries

The evaluator may score required intents and task completion from a transcript. It deliberately does not infer pronunciation, accent quality or comprehensibility from transcript evidence. Raw audio and transcripts are not persisted in `learning_attempts`.

Transfer completion requires a first evaluation, feedback and a passing retry in the same `session_id`. Evidence from different sessions is never combined. Transfer windows are sequential: day 7 cannot clear while day 1 remains unverified.

## Mastery and review

Completing a roleplay does not itself record mastery. The learner must pass the mission-aligned checkpoint. Only then is the lesson marked complete and that mission's communication chunks inserted into the existing FSRS deck.

The learning page shows a queue of due transfer tests across all completed pilot missions. A transfer item remains visible until its same-session retry passes.

## Publication contract

Automated QA rejects a mission when it lacks:

- a concrete can-do outcome;
- four to eight unique chunks;
- at least one required interaction intent;
- roleplay evidence for every required intent;
- checkpoint evidence for every required intent;
- feedback bounded to two corrections;
- mandatory retry;
- complete day 1/7/30 transfer dialogue frames;
- the explicit prohibition on pronunciation scoring from transcript evidence.

Automated pass is not publication. Independent pedagogical review of the same lesson version is still required before release.

## Verification pipeline

Vercel preview deployment is gated by:

```text
ESLint
→ TypeScript
→ Vitest unit and filesystem suites
→ content-standard suite
→ Next.js production build
```

Filesystem-based curriculum and migration tests run in the Node test environment; UI and logic tests run in jsdom.

## Still outside v1

- Acoustic pronunciation scoring calibrated against Vietnamese learners.
- Raw audio storage or speech biometrics.
- Free-form realtime AI conversation deciding its own lesson progression.
- Hosted Supabase migration application and authenticated production-data verification.
- Independent pedagogical approval and learner pilot evidence.

The PR remains draft until those release conditions that are required for publication are completed. The six mission implementations themselves now share one engine and one verification contract instead of using a legacy runner or six copied flows.
