# Explicit Error Remediation V1

## Goal

Recurring Error Memory should not force the learner to repeat the exact task that exposed the error.

The content layer now declares a narrow remediation mapping:

```text
versioned source action + actionable error tag -> evidence-bearing planner candidate
```

The generic Session Planner does not interpret `missing-target-group:0` or `:1`. Those indexes are private to the lesson/evaluator contract.

## First-meeting mappings

For `LESSON-CAP002-FIRST-MEETING-V1`:

- comprehension `incorrect-choice` -> `comprehend`;
- retrieval missing group 0 -> `retrieve`;
- production missing group 0 -> `retrieve`;
- repair missing group 0 -> `repair`;
- transfer missing group 0 -> `repair`;
- transfer missing group 1 -> `produce`.

The important cross-action cases are:

```text
transfer missing repair move -> dedicated repair practice
transfer missing self-introduction -> dedicated production practice
```

These are V1 product-policy decisions, not research claims that one remediation sequence is universally optimal.

## Persistence boundary

The deterministic evaluator still emits narrow target-coverage error tags. The Nếp adapter adds derived `remediationHints` under `errorSignals`:

```ts
{
  errorTag: "missing-target-group:0",
  candidateId: "LESSON-CAP002-FIRST-MEETING-V1:repair"
}
```

No learner transcript or typed response is included in a remediation hint.

## Error Memory

Error Memory carries remediation candidate IDs per actionable error tag. It still requires repeated independent failures before a pattern becomes `recurring`.

Attempts are assisted when either:

- `support_level > 0`; or
- `reveal_used === true`.

Assisted failures are diagnostic only and cannot create recurrence. This matters for Nếp retry: retry occurs after answer-bearing feedback, so it is stored with `revealUsed=true` even when the learner did not open the optional Vietnamese support.

## Planner behavior

For a recurring Error Memory entry:

1. if explicit remediation candidate IDs exist, only those candidates receive recurring-error pressure;
2. the original source action does **not** also receive same-action pressure;
3. older history without remediation hints keeps the previous same-action fallback for backward compatibility;
4. pressure remains binary and cannot bypass planner hard gates.

This lets remediation cross capability boundaries inside a lesson. For example, a transfer error on `CAP-002` can pressure the dedicated repair action targeting embedded capability `CAP-003`.

## Static QA

The remediation map validates that:

- the source action exists in the declared lesson version;
- the target action exists;
- the target action is evidence-bearing and therefore present in the planner catalog;
- a `missing-target-group:N` rule references a group that actually exists on the source action.

Attempt-only retry cannot be a remediation target.

## Non-goals

V1 does not:

- infer remediation with an LLM;
- diagnose grammar or pronunciation;
- call one error a misconception;
- let error count grow planner pressure without bound;
- bypass prerequisite/transfer/retention gates;
- claim the remediation map is optimal.

The next useful validation is empirical: measure whether mapped remediation reduces recurrence on later independent attempts and transfer tasks.
