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

- `supported-only` — observed only while support was active;
- `observed` — one independent failure since the last repair;
- `recurring` — at least two independent failures since the last repair;
- `repaired` — a later independent successful response completed the same versioned action.

Supported failures are counted diagnostically but do not promote a pattern to `recurring`.

## Repair semantics

A later independent successful attempt on the same target + lesson version + action repairs all active error tags for that action.

After repair, the old recurrence is not permanent. A new independent failure becomes `observed` again, and only another independent failure promotes it back to `recurring`.

This prevents the learner model from becoming a permanent collection of past mistakes.

## Read boundary

`getNếpErrorMemory()` is authenticated and read-only. It reads the learner's own `learning_attempts` rows through existing RLS and projects only:

- target identity;
- correctness/support level;
- lesson/action/version identity;
- `errorSignals.observedResponse`;
- `errorSignals.errorTags`;
- timestamp.

It does not SELECT `response_text` or the full attempt `metadata` object.

## What V1 does not do

Error Memory V1 does not yet:

- change Session Planner scores;
- create a new database table;
- claim an error is a misconception;
- infer grammar or pronunciation problems;
- use LLM classification;
- use RL/bandits;
- persist a permanent learner label.

The snapshot is rebuilt deterministically from immutable attempts.

## Next boundary

A later planner integration can derive an explicit `errorRepairPressure` only from `recurring` entries. The planner should not receive pressure from `supported-only`, `observed`, `repaired`, or `no-response` events.

Before adding that term, tests should lock:

- one-off failures do not alter planning;
- two independent recurrent failures increase priority for the relevant repair opportunity;
- a successful independent repair removes that pressure;
- unrelated targets/actions are unaffected.
