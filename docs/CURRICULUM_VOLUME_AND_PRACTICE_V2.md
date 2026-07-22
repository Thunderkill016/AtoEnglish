# AtoEnglish Curriculum Volume and Practice Dosage V2

Status: design contract for `agent/lesson-system-v2`  
Audience: curriculum authors, engineers, reviewers, and pilot evaluators

## 1. Decision

The legacy course has 50 routes. That is not enough as the final lesson count for a practical Pre-A1-to-B2 course.

The 50 routes remain useful as an audit of broad mission families, but V2 expands and rebalances the curriculum into:

| Level | Mission modules | Lessons per module | Checkpoints | Fixed required lessons |
|---|---:|---:|---:|---:|
| Pre-A1 | 8 | 3 | 2 | 26 |
| A1 | 12 | 4 | 3 | 51 |
| A2 | 12 | 4 | 3 | 51 |
| B1 | 16 | 4 | 4 | 68 |
| B2 | 16 | 4 | 4 | 68 |
| **Total** | **64** | — | **16** | **264** |

The fixed curriculum therefore contains **264 required lesson sessions**.

This number does not include adaptive remediation, optional extensive listening/reading, pronunciation clinics, or additional real-world practice. A learner who has not retained or transferred a target receives extra review lessons.

## 2. Why there is no universal official lesson count

The CEFR is non-prescriptive. It describes observable proficiency and supports curriculum alignment, but it does not prescribe a syllabus, exact lesson duration, or exact number of exercises.

Cambridge English publishes broad cumulative guided-learning-hour estimates of roughly:

- A1: 90–100 hours from beginner;
- A2: 180–200 hours;
- B1: 350–400 hours;
- B2: 500–600 hours.

Those estimates vary by learner background, intensity, age, support, and exposure outside lessons. AtoEnglish must not convert them mechanically into a false promise that completing a fixed number of micro-lessons certifies a CEFR level.

Primary planning references:

- Council of Europe, CEFR introduction and context: https://www.coe.int/en/web/common-european-framework-reference-languages/introduction-and-context
- Cambridge English, guided learning hours: https://support.cambridgeenglish.org/hc/en-gb/articles/202838506-Guided-learning-hours

The 264-lesson count is therefore a **minimum product architecture**. Level completion still requires task evidence, checkpoint performance, delayed recall, and transfer.

## 3. Module structure

### Pre-A1: three lessons per mission module

1. **Encounter** — understand the situation, model and 3–5 core chunks.
2. **Communicate** — retrieve the chunks, rehearse and complete a supported task twice.
3. **Retain and transfer** — delayed recall plus the same function in a changed detail or setting.

### A1–B2: four lessons per mission module

1. **Encounter** — scenario, model input, noticing and comprehension.
2. **Retrieve** — successful effortful recall, listening discrimination, form–meaning control and short construction.
3. **Communicate** — rehearsal, independent performance, focused feedback and second attempt.
4. **Retain and transfer** — delayed retrieval and a new scenario, audience, constraint or source.

A checkpoint follows every four mission modules. It combines skills and recycles earlier functions instead of testing only the last module.

## 4. What counts as enough practice

There is no single research-backed magic number of questions that fits every target and proficiency level. The system therefore combines quantity ranges with required learning events.

Every core target must pass through:

1. model exposure;
2. noticing;
3. successful retrieval;
4. guided use;
5. independent performance;
6. delayed recall;
7. transfer use.

A target is not learned merely because the learner selected it correctly or repeated a model immediately.

### Required dosage by level

| Level | Controlled items in a core lesson | Practice opportunities across a module | Successful retrievals per core target | Distinct contexts | Delayed reviews |
|---|---:|---:|---:|---:|---|
| Pre-A1 | 4–7 | 14–20 | 4–6 | 2 | days 1, 7 |
| A1 | 5–8 | 20–28 | 5–7 | 2 | days 2, 7, 21 |
| A2 | 5–9 | 24–34 | 5–8 | 3 | days 3, 10, 30 |
| B1 | 5–10 | 28–40 | 5–8 | 3 | days 7, 21, 45 |
| B2 | 5–10 | 30–44 | 5–8 | 4 | days 7, 28, 60 |

These ranges count meaningful opportunities, not pages or button taps. One complex task can cover several targets, while one difficult target can receive additional focused remediation.

## 5. Why higher levels do not simply receive more multiple-choice questions

Difficulty must increase through the nature of performance:

- Pre-A1 identifies information and uses short formulaic chunks.
- A1 generates simple sentences and maintains a short familiar exchange.
- A2 connects events, reasons and options and solves a predictable complication.
- B1 explains, summarises, defends, negotiates and repairs within connected discourse.
- B2 qualifies claims, compares trade-offs, synthesises sources and adapts to changed constraints.

At B1–B2, an effective practice opportunity is often a summary, decision, reformulation, evidence-based response, or follow-up question rather than another isolated grammar item.

## 6. Research implications for dosage

Repeated retrieval supports L2 vocabulary learning, but successful effortful retrieval matters more than merely seeing the answer again. Spaced encounters usually support durable memory better than massed exposure.

Oral task repetition can improve fluency, particularly over the first few performances. However, massed repetition can also increase verbatim repetition and does not by itself prove transfer. AtoEnglish therefore uses two immediate performance attempts, followed by delayed recall and a changed transfer task.

Research references:

- Nakata, within-session repeated retrieval and L2 vocabulary learning: https://doi.org/10.1017/S0272263116000243
- Koval, successful effortful retrieval and the lag effect: https://doi.org/10.1017/S0142716421000370
- Lambert, Kormos, and Minn, oral task repetition and fluency: https://doi.org/10.1017/S0272263116000085
- Suzuki and Hanzawa, risks of massed task repetition: https://doi.org/10.1017/S0272263121000358

Product rule: no more than three immediate successful retrievals of the same target in one session. Further encounters should be spaced or placed in a changed context.

## 7. Level completion gates

Opening or finishing all fixed lessons is not sufficient.

A level is complete only when the learner demonstrates:

- required checkpoint tasks;
- independent task achievement and comprehensibility;
- retained performance after delay;
- transfer to at least one changed scenario;
- enough evidence across reception, interaction, production and mediation for that level;
- no unresolved critical target cluster blocking later missions.

The exact number of assigned lessons is therefore:

`fixed required lessons + adaptive review/remediation lessons`

Two learners can complete the same level with different total lesson counts.

## 8. Authoring rules

### Required

- Build each mission module as a connected four-session learning arc, not four unrelated lessons.
- Map every exercise to one or more core targets.
- Track successful retrieval rather than raw exposure count.
- Include listening and recall in every core lesson.
- Use at least two performance attempts for speaking/interaction.
- Change the transfer context enough to prevent memorised replay.
- Schedule review targets rather than dumping every target into one exit quiz.
- Add remediation only for failed or fragile targets.

### Prohibited

- Treating 264 lessons as automatic CEFR certification.
- Adding exercises solely to reach a number.
- Using only recognition or multiple choice.
- Repeating the same sentence many times in one sitting and marking it retained.
- Giving Pre-A1 and B2 the same exercise shape.
- Keeping A2 at six broad units or putting 60 vocabulary items into one lesson.

## 9. Implementation files

- `src/lib/lessons/v2/curriculum-volume.ts`
- `src/lib/lessons/v2/exercise-dosage.ts`
- `src/lib/lessons/v2/production-validator.ts`
- `src/lib/lessons/v2/curriculum-volume.test.ts`
- `src/lib/lessons/v2/production-validator.test.ts`

The next curriculum implementation target is the full Pre-A1 level: 8 mission modules, 24 module lessons and 2 checkpoints. That level must prove the module arc, dosage tracking, adaptive review and visible progression before A1 content is rebuilt.
