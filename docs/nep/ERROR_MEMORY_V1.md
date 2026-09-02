# Error Memory V1

## Goal

Structured Error Signals describe one attempt. Error Memory V1 decides when repeated observations are strong enough to call an error a **temporary recurring pattern**.

The key rule is conservative:

> One failed task is an observation, not a learner trait.

## Identity

An error memory is versioned by:

- target/capability;
- lesson id;
- lesson version;
- action id;
- actionable error tag.

This prevents an old content definition from silently contaminating a later lesson version with different target groups.

## Actionable tags

V1 aggregates only:

- `incorrect-choice`;
- `missing-target-group:<index>`.

It deliberately ignores:

- `no-response` — this may reflect microphone/STT/UI failure rather than learner knowledge;
- `partial-target-coverage` — this is a broad summary already represented by the specific missing-group tag.

## States

Each memory entry has one of four states:

- `supported-only` — the pattern has only been observed on assisted attempts;
- `observed` — one independent failure since the last repair;
- `recurring` — at least two independent failures since the last repair;
- `repaired` — a later independent successful response completed the same versioned action.

An attempt is assisted when either optional support was used or the answer had already been revealed. Assisted failures are counted diagnostically but do not promote a pattern to `recurring`.

This prevents retry-after-feedback from becoming fake independent evidence simply because the learner did not open the optional support control.

## Remediation hints

Each actionable error entry may carry zero or more `remediationCandidateIds`. These IDs are derived from the versioned Nếp content remediation map, not inferred by the generic learner model.

Examples:

```text
transfer + missing-target-group:0 -> ...:repair
transfer + missing-target-group:1 -> ...:produce
```

Historical rows without hints remain valid. Planner logic can use same-action fallback only when an entry has no explicit remediation candidate.

## Repair semantics

A later independent successful attempt on the same target + lesson version + action repairs all active error tags for that action.

After repair, the old recurrence is not permanent. A new independent failure becomes `observed` again, and only another independent failure promotes it back to `recurring`.

This prevents the learner model from becoming a permanent collection of past mistakes.

## Read boundary

`getNếpErrorMemory()` is authenticated and read-only. It reads the learner's own `learning_attempts` rows through existing RLS and projects only:

- target identity;
- correctness/support/reveal state;
- lesson/action/version identity;
- `errorSignals.observedResponse`;
- `errorSignals.errorTags`;
- `errorSignals.remediationHints`;
- timestamp.

It does not SELECT `response_text` or the full attempt `metadata` object.

## Planner integration

Session Planner receives Error Memory entries but only `recurring` entries create error-repair pressure.

`observed`, `supported-only`, `repaired`, and `no-response` observations have zero ranking effect. Explicit remediation hints can route that pressure to a different evidence-bearing action; hard gates remain authoritative.

## What V1 does not do

Error Memory V1 does not:

- create a new database table;
- claim an error is a misconception;
- infer grammar or pronunciation problems;
- use LLM classification;
- use RL/bandits;
- persist a permanent learner label.

The snapshot is rebuilt deterministically from immutable attempts.
