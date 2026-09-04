# Nếp Core Benchmark & Promotion Contract v1

No subsystem is "good" because it runs, and no model is "best" because a paper reports a high score on another population. Promotion is construct-, population- and task-specific.

## Promotion states

```text
idea
-> research
-> shadow
-> calibrated
-> hint-only
-> assessment-candidate
-> mastery-candidate
-> production-authority
```

Skipping states requires explicit human approval and evidence explaining why earlier gates do not apply.

## Universal benchmark record

Every experiment records:

- hypothesis;
- construct definition;
- target learner population;
- frozen data/version and speaker/user split policy;
- artifact/model/code fingerprint;
- baseline(s);
- primary and secondary metrics;
- subgroup/context metrics;
- confidence intervals or uncertainty estimates;
- latency/resource measurements where relevant;
- failure analysis;
- license/provenance status;
- promotion decision and rationale.

## English-knowledge / linguistic analysis

Measure separately by construct:

- tokenization/segmentation;
- POS/morphology;
- dependency/syntax;
- lexical sense/relations;
- grammar/error category;
- collocation/phraseology;
- discourse/pragmatic classification.

Use precision/recall/F1 or task-appropriate metrics. Learner-facing error accusation defaults to precision-first evaluation.

## Speech

### Audio quality/VAD
Evaluate false speech/non-speech decisions, boundary quality and robustness by device/noise class.

### ASR
WER/CER can validate transcript support, but ASR accuracy cannot validate pronunciation diagnosis.

### Pronunciation / MDD
Evaluate each promoted target/context with blind human labels:

- precision/positive predictive value;
- recall;
- false-positive and false-negative rates;
- confusion matrix for suspected substitutions;
- confidence calibration;
- speaker-disjoint evaluation;
- position/context/device subgroups.

Initial learner-facing corrective hints remain precision-first. A working target can be >= 0.90 held-out precision and >= 0.60 useful recall, with confidence intervals, until product evidence justifies changing the gate.

### Fluency/prosody
Compare automatic features/scores with multi-rater human judgments. Report inter-rater reliability before claiming model validity.

## Reading and listening

A comprehension item must distinguish task quality from language difficulty.

Track:

- item difficulty/discrimination;
- distractor behavior;
- reliability across forms;
- lexical/syntactic complexity;
- support dependence;
- changed-text/speaker transfer;
- delayed retention where used for learning claims.

Do not infer comprehension from exposure time, scroll position, playback completion or ASR transcript alone.

## Writing and spoken language use

Separate:

- task completion/meaning;
- lexical range/appropriateness;
- grammar/morphosyntax;
- discourse/coherence;
- register/pragmatics;
- fluency for speech;
- mechanics for writing.

Automated corrective feedback is benchmarked against expert/human-grounded labels. Measure false corrections explicitly; a fluent rewrite is not evidence that the original was wrong.

## Learner model

The learner model is a probabilistic prediction system and must be tested as one.

Evaluate:

- next-attempt prediction/log loss/Brier score where appropriate;
- calibration by evidence type and modality;
- retention prediction by delay;
- cold-start/unknown handling;
- subgroup calibration;
- robustness to missing evidence;
- resistance to support/reveal leakage;
- transfer prediction in changed contexts.

A model that ranks learners correctly but is badly calibrated cannot silently drive high-stakes mastery thresholds.

## Adaptive planner

Offline ranking metrics are insufficient. Planner promotion requires learner outcomes.

Compare policies on:

- successful independent retrieval;
- delayed retention;
- transfer;
- time-to-criterion;
- unnecessary repetition;
- abandonment/friction;
- feedback/retry efficiency.

Prefer randomized or otherwise credible causal comparisons when choosing between mature planner policies.

## Memory scheduler

FSRS or any alternative scheduler is judged on retention/time tradeoffs for Nếp's item/task types. Do not assume parameters learned on flashcards are optimal for communicative skills.

## Feedback and pedagogy

A feedback policy is evaluated for:

- correctness;
- learner understanding;
- immediate successful retry;
- delayed non-repetition of the error;
- transfer;
- overload/abandonment.

The engine defaults to bounded high-impact feedback rather than exhaustive correction.

## Local LLM / generative model

Each LLM role receives a separate benchmark. Never have a single "LLM quality" score.

Possible roles:

- structured semantic evaluation;
- pragmatic/discourse analysis;
- error explanation candidate;
- distractor/task generation candidate;
- writing feedback candidate;
- paraphrase/mediation candidate.

Evaluate schema validity, factual/linguistic correctness, false correction rate, consistency, adversarial robustness and latency. Model output remains an observation or draft until its role's promotion gate passes.

## Production-authority rule

A subsystem may affect durable mastery only when:

1. the exact construct and allowed claim are defined;
2. held-out human-grounded validation exists;
3. confidence is calibrated sufficiently for the decision;
4. support/modality/context boundaries are enforced;
5. failure returns unknown/no-evidence rather than fabricated certainty;
6. the learner has a retry/appeal path appropriate to the task;
7. privacy and licensing are production-safe;
8. monitoring can detect drift after model/data changes.

Changing a model, checkpoint, threshold, prompt, feature extractor or major preprocessing path creates a new evaluation fingerprint and may require recalibration.