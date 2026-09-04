# Structured Error Signals V1

> **Document status:** reference
> **Governing authority:** [constitution](../../.specify/memory/constitution.md); it wins on conflict

## Purpose

AtoEnglish needs to know more than whether one task passed or failed. Session planning and later error repair need a compact, privacy-safe description of **which declared task demand was missing**.

Structured Error Signals V1 upgrades the Nếp deterministic evaluator from a boolean-only surface to a result that contains:

- `success`;
- whether any response was observed;
- matched target-group indexes;
- missing target-group indexes;
- stable error tags.

The original learner transcript is not part of this signal object and is not persisted by the Nếp adapter.

## Contract

```ts
NếpEvaluationResult {
  success
  evaluator: "nep-evaluator-v2"
  observedResponse
  matchedTargetGroupIndexes
  missingTargetGroupIndexes
  errorTags
}
```

Current error tags are deliberately narrow:

- `no-response`
- `incorrect-choice`
- `partial-target-coverage`
- `missing-target-group:<index>`

The group index refers to the action's existing `requiredSignalGroups`. V1 does not change the lesson schema just to add labels.

## Single source of truth

The same `NếpEvaluationResult` drives:

1. learner-facing feedback;
2. `attempt.correct`;
3. evidence success/failure;
4. persisted derived error metadata.

The adapter does not accept a separate `correct` boolean. This prevents a caller from accidentally persisting `success=true` alongside error signals that describe a failed evaluation.

## Persistence shape

Attempt/evidence metadata contains a derived `errorSignals` object:

```ts
{
  version: 1,
  evaluator: "nep-evaluator-v2",
  observedResponse: true,
  matchedTargetGroupIndexes: [0],
  missingTargetGroupIndexes: [1],
  errorTags: ["partial-target-coverage", "missing-target-group:1"]
}
```

Task identity (`lessonId`, `lessonVersion`, `actionId`) is stored beside it. That is enough to resolve what group index `1` meant for the exact lesson version without duplicating target language into learner-history rows.

## Privacy boundary

Nếp continues to persist:

- response source/modality;
- response length;
- derived target-coverage signals;
- support usage;
- task identity.

It does **not** persist the raw learner transcript through this adapter.

For oral evidence, `responseSource = speech` plus a positive `responseLength` remains the privacy-safe observation used by the learning-core invariant. An unobserved response cannot become either positive or negative oral mastery evidence.

## Feedback behavior

V1 can distinguish failures such as:

- transfer response has the repair move but is missing self-introduction;
- transfer response has self-introduction but is missing the repair move;
- both target groups are missing;
- no response was observed;
- comprehension choice was incorrect.

This lets feedback tell the learner what to repair instead of returning a generic failure message.

## What V1 does not claim

A Structured Error Signal is **not** automatically:

- a grammar-error diagnosis;
- a pronunciation score;
- a fluency score;
- an acoustic-quality judgment;
- a persistent misconception;
- a calibrated learner probability;
- proof that the microphone was genuinely used.

It means only that the deterministic evaluator did or did not find one of the lesson's declared target-language groups in the observed response representation.

## Next boundary: Error Memory

A later read model may aggregate repeated error tags across attempts, but it should require recurrence before treating a signal as an error pattern. One failed task is an observation, not a learner trait.

A safe first aggregation policy should consider:

- target/capability;
- lesson/action version;
- error tag;
- independent vs supported attempt;
- recency;
- recurrence count;
- whether later independent attempts repaired the same demand.

Only after that aggregation exists should Session Planner receive an explicit `errorRepairPressure` term. V1 does not change planner weights yet.
