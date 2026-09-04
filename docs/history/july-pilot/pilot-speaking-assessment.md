# Pilot speaking assessment protocol

> **Document status:** historical; superseded and retained for provenance
> **Governing authority:** [constitution](../../../.specify/memory/constitution.md); it wins on conflict

This document defines the manual baseline and final speaking assessment for the first 28-day AtoEnglish program.

The source of truth for prompt text, rubric anchors, scoring and comparison logic is:

- `src/lib/pilot/speaking-assessment.ts`
- `src/lib/pilot/speaking-assessment.test.ts`

## Purpose

The assessment answers one product question:

> After 28 days, can a Vietnamese adult beginner complete the target work-speaking task more successfully and more clearly than at baseline?

It is not a CEFR certification exam and must not be marketed as one. CEFR descriptors are adapted to this specific beginner work-speaking context.

## Construct measured

Both prompts measure the same five functions:

1. introduce a name and spell it clearly;
2. state a role, company or study context;
3. describe one work responsibility;
4. answer five predictable follow-up questions;
5. ask for repetition or slower speech during a standardized repair check.

The baseline and final scenarios are deliberately different. This reduces the chance that a memorized script is mistaken for transferable speaking improvement.

## Administration rules

Use the same conditions at baseline and final:

- a quiet room and the same recording device where practical;
- 30 seconds of preparation;
- up to 90 seconds for the main response;
- five follow-up questions in the stored order;
- one standardized repair check after the third follow-up question;
- no grammar, vocabulary or pronunciation correction during the recording;
- the first complete recording is the scored attempt;
- do not show a full model answer;
- do not show the final prompt before the final assessment day.

### Standardized repair check

The repair check exists because the assessment must observe whether the learner can independently ask for repetition or slower speech. Waiting for a naturally occurring misunderstanding would make this criterion inconsistent across learners.

For each stage, use the stored `repairCheck` object exactly as written:

1. After the third follow-up question, read the repair-check utterance once.
2. Use a natural but slightly brisk pace.
3. Do not display the utterance as text.
4. Pause for up to five seconds.
5. Repeat or slow down only after the learner independently asks in English.
6. Do not teach, translate or suggest a repair phrase during the recording.
7. Continue with the fourth and fifth follow-up questions whether or not the learner used a repair phrase.

The baseline and final utterances are different but use the same delivery conditions. The learner is not scored on understanding the repair-check sentence itself; the evidence is whether they recognize a breakdown and use an appropriate repair request.

## Rubric

Score each criterion from 0 to 3 using the anchored descriptions in code:

- task completion;
- comprehensibility;
- target chunks;
- basic fluency.

Maximum total: 12.

A learner meets the minimum pilot outcome only when both conditions are true:

- task completion is at least 2;
- comprehensibility is at least 2.

A high score in memorized chunks or fluency must not compensate for failure to complete the task or communicate an understandable message.

## Rater guidance

- Score communicative success, not native-accent imitation.
- Accept functional equivalents instead of requiring one exact sentence.
- Ignore isolated grammar mistakes when the intended meaning remains clear.
- Lower comprehensibility only when pronunciation, missing final sounds, stress or delivery makes the message harder to understand.
- Give repair-language credit only when the learner produces it independently during the repair check.
- Use evidence from the recording. Do not infer ability from lesson completion, XP or prior interaction with the learner.
- Write one short evidence note per criterion before assigning the final score.

For the first cohort, one assessor may score all recordings. When possible, re-score a mixed sample of baseline and final recordings without looking at the stage or learner name to check rating consistency.

## Improvement reporting

Report:

- baseline and final criterion scores;
- total-score change;
- percentage-point change;
- which criteria improved;
- whether task completion or comprehensibility improved by at least one level;
- whether the learner meets the minimum pilot outcome at final;
- whether the learner independently used a repair phrase at baseline and final.

Do not claim broad English proficiency growth from this assessment. It measures one narrow work-speaking outcome.

## Privacy and analytics

- Do not send audio, transcripts, names, employers or free-text learner content to analytics.
- Analytics may record only non-sensitive status events and numeric/boolean results approved in the later analytics batch.
- Until an explicit storage design is approved, collect recordings through the manual cohort process and document who can access them and when they will be deleted.

## Reference basis

- Council of Europe CEFR descriptors and spoken-language qualitative features: https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors
- Council of Europe guidance that CEFR use must be adapted to the specific context: https://www.coe.int/en/web/common-european-framework-reference-languages/uses-and-objectives
- Council of Europe testing and examination guidance: https://www.coe.int/en/web/common-european-framework-reference-languages/tests-and-examinations
