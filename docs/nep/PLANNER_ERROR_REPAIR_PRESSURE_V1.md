# Planner Error Repair Pressure V1

## Goal

Session Planner already ranks practice using skill gap, cold start, staleness, importance, transfer value and anti-repetition penalties. Error Memory adds one new question:

> Does this learner have a recurring task-coverage error that this candidate is explicitly meant to repair?

V1 answers that conservatively with a fixed **binary repair pressure**.

## Eligibility first, ranking second

Error repair pressure is only a score term. It cannot bypass planner hard gates.

A recurring error does not unlock:

- an unmet prerequisite;
- transfer before prior production;
- retention before prior evidence;
- the per-target session cap.

The planner checks eligibility first and scores only eligible opportunities.

## Matching contract

`observed`, `supported-only` and `repaired` Error Memory entries always have zero ranking effect.

For a `recurring` entry:

1. if the entry has explicit `remediationCandidateIds`, a candidate matches only when its stable candidate ID is present in that list;
2. when explicit remediation exists, the original source action does not also receive same-action pressure;
3. historical entries with no remediation hint use the older same-action match of target + lesson + version + action for backward compatibility.

The generic planner never interprets `missing-target-group:0` or other lesson-specific group indexes.

## Cross-action remediation

The first Nếp lesson can now route recurring errors across actions and even embedded capability targets. For example:

```text
transfer missing repair move -> dedicated repair candidate
transfer missing introduction -> dedicated production candidate
```

This avoids forcing the learner to repeat an entire transfer task when a narrower prerequisite behavior is the thing that needs repair.

## Binary pressure

If at least one recurring entry matches, then:

```text
errorRepairPressure = 1
```

Otherwise:

```text
errorRepairPressure = 0
```

Multiple matching error tags are reported in the planner reason string for explainability, but they do not multiply the score bonus. This avoids an unbounded feedback loop where a long history of failures dominates every future session.

## V1 weight

The default ranking term remains:

```text
errorRepairPressure * 0.65
```

`0.65` is a product-policy heuristic for V1. It is not a calibrated learning probability, research-derived optimum, or efficacy claim. It should be tuned only after real learner data can show whether recurring-error opportunities are being over- or under-selected.

## Explainability

A selected opportunity may include a reason such as:

```text
recurring-error-repair:2
```

This means two recurring Error Memory entries route to that candidate. The score pressure is still binary (`1`), not `2`.

The score breakdown exposes `errorRepairPressure` separately from skill gap and other terms.

## Read boundary

The authenticated Session Planner server action rebuilds Error Memory from immutable attempts and passes the entries into `planSession()`.

The query remains data-minimized. It reads correctness/support/reveal state plus derived structured error/remediation metadata and does not select raw `response_text` or the full `metadata` object.

## Content ownership

Remediation semantics live in the versioned Nếp remediation map, not in Session Planner. Static QA verifies that a remediation target exists and is evidence-bearing/plannable.

See `EXPLICIT_ERROR_REMEDIATION_V1.md` for the content contract.

## What V1 does not claim

Error repair pressure is not:

- a learner mastery probability;
- a diagnosis of a misconception;
- a grammar or pronunciation diagnosis;
- reinforcement learning;
- evidence that more repetition is always better;
- evidence that the current remediation map is optimal.

It is an explainable ranking heuristic over already-valid practice opportunities.
