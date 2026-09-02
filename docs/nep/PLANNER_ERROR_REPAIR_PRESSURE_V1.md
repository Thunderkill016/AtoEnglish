# Planner Error Repair Pressure V1

## Goal

Session Planner already ranks practice using skill gap, cold start, staleness, importance, transfer value and anti-repetition penalties. Error Memory V1 adds one new question:

> Has this learner repeatedly failed the exact versioned task demand that this candidate can exercise again?

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

A recurring Error Memory entry affects a candidate only when all of these match:

- `status === recurring`;
- target/capability id;
- lesson id;
- lesson version;
- action id.

`observed`, `supported-only` and `repaired` entries have zero ranking effect.

This same-action matching is intentionally narrow. V1 does not infer that an error observed in one action should automatically schedule a different repair action.

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

The default ranking term is:

```text
errorRepairPressure * 0.65
```

`0.65` is a product-policy heuristic for V1. It is not a calibrated learning probability, research-derived optimum, or efficacy claim. It should be tuned only after real learner data can show whether recurring-error opportunities are being over- or under-selected.

## Explainability

A selected opportunity may include a reason such as:

```text
recurring-error-repair:2
```

This means two recurring Error Memory entries matched the same candidate identity. The score pressure is still binary (`1`), not `2`.

The score breakdown exposes `errorRepairPressure` separately from skill gap and other terms.

## Read boundary

The authenticated Session Planner server action now rebuilds Error Memory from the same immutable attempts used by the Error Memory read model and passes the entries into `planSession()`.

The query remains data-minimized. It reads derived structured error metadata and does not select raw `response_text` or the full `metadata` object.

## Current limitation

V1 repairs the **same versioned action** where recurrence was observed. It does not yet have a semantic remediation map such as:

```text
transfer missing repair move -> schedule dedicated repair action
```

That mapping needs an explicit content/knowledge contract. Guessing it from group indexes inside the planner would couple the generic planner to one lesson's internal ordering.

A future V2 can introduce a declared `repairCandidateId` or semantic error target in the lesson compiler, then let Error Memory point to that stable remediation target.

## What V1 does not claim

Error repair pressure is not:

- a learner mastery probability;
- a diagnosis of a misconception;
- a grammar or pronunciation diagnosis;
- reinforcement learning;
- evidence that more repetition is always better.

It is an explainable ranking heuristic over already-valid practice opportunities.
