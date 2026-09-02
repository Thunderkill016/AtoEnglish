# Planner Error Repair Pressure V1

## Goal

Session Planner ranks practice using skill gap, cold start, staleness, importance, transfer value and anti-repetition penalties. Error Memory adds two bounded adaptive questions:

1. Does this learner have a recurring task-coverage error that this candidate is explicitly meant to remediate?
2. Has that remediation already succeeded independently, making the original source task ready for re-probe?

## Eligibility first, ranking second

Error repair and re-probe pressures are score terms only. They cannot bypass planner hard gates.

Neither pressure unlocks:

- an unmet prerequisite;
- transfer before prior production;
- retention before prior evidence;
- the per-target session cap.

The planner checks eligibility first and scores only eligible opportunities.

## Repair matching contract

`observed`, `supported-only` and `repaired` Error Memory entries always have zero error pressure.

For an unresolved `recurring` entry (`remediationSatisfiedAt === null`):

1. if explicit `remediationCandidateIds` exist, only those stable candidate IDs match;
2. when explicit remediation exists, the original source action does not also receive same-action repair pressure;
3. historical entries with no remediation hint use legacy same-action target + lesson + version + action matching.

The generic planner never interprets lesson-specific error-group indexes.

## Re-probe matching contract

When an independent remediation candidate succeeds, Error Memory keeps the source error `recurring` but sets `remediationSatisfiedAt`.

At that point:

- explicit remediation pressure turns off;
- the exact source candidate receives `errorReprobePressure`;
- a successful source re-probe repairs the source error;
- a failed independent source re-probe clears remediation satisfaction and reopens remediation pressure.

The source identity is still strict: target + lesson + version + action.

## Cross-action remediation

The first Nếp lesson can route recurring errors across actions and embedded capability targets. For example:

```text
transfer missing repair move -> dedicated repair candidate
transfer missing introduction -> dedicated production candidate
```

After the narrower remediation succeeds, the planner stops drilling that remediation and prioritizes a new independent attempt on the original transfer task.

## Binary pressures

Repair pressure is bounded:

```text
errorRepairPressure = 0 | 1
```

Re-probe pressure is independently bounded:

```text
errorReprobePressure = 0 | 1
```

Multiple matching error tags may appear in explainability reasons, but neither score term grows beyond `1`.

## V1 weights

Default ranking terms are:

```text
errorRepairPressure * 0.65
errorReprobePressure * 0.60
```

Both weights are V1 product-policy heuristics. They are not calibrated probabilities, research-derived optima, or efficacy claims.

## Explainability

A remediation opportunity may include:

```text
recurring-error-repair:2
```

A source task awaiting validation may include:

```text
recurring-error-reprobe:1
```

The score breakdown exposes `errorRepairPressure` and `errorReprobePressure` separately from skill gap and other terms.

## Read boundary

The authenticated Session Planner server action rebuilds Error Memory from immutable attempts and passes entries into `planSession()`.

The data-minimized Error Memory projection includes correctness, response modality, support/reveal state, action identity/kind, and derived error/remediation signals. It does not select raw `response_text` or the full metadata object.

## Content ownership

Remediation semantics live in the versioned Nếp remediation map, not Session Planner. Static QA verifies that remediation targets exist and are evidence-bearing/plannable.

See:

- `EXPLICIT_ERROR_REMEDIATION_V1.md` for content routing;
- `REMEDIATION_REPROBE_V1.md` for the repair → re-probe state machine.

## What V1 does not claim

These pressures are not:

- learner mastery probabilities;
- diagnoses of misconceptions;
- grammar or pronunciation diagnoses;
- reinforcement learning;
- evidence that more repetition is always better;
- evidence that the current remediation map or weights are optimal.

They are explainable ranking heuristics over already-valid practice opportunities.
