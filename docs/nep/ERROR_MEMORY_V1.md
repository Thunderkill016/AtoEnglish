# Error Memory V1

> **Document status:** reference
> **Governing authority:** [constitution](../../.specify/memory/constitution.md); it wins on conflict

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

## Independent vs diagnostic attempts

An observation only counts as an independent Error Memory event when it is unassisted **and** the response modality can support that action.

Assistance includes:

- optional support (`support_level > 0`);
- answer already revealed (`reveal_used = true`).

For Nếp speaking actions (`retrieve`, `produce`, `repair`, `transfer`, `retry`), independent Error Memory evidence requires `response_modality = speech`. Typed fallback is diagnostic only: it can receive target-language feedback but cannot create, satisfy, or repair a recurring speaking pattern.

For Nếp comprehension, the independent modality is `choice`. Historical rows without `actionKind` keep legacy behavior for compatibility.

## States

Each memory entry has one of four primary states:

- `supported-only` — only diagnostic/assisted observations exist;
- `observed` — one independent failure since the last repair;
- `recurring` — at least two independent failures since the last repair;
- `repaired` — a later independent source success completed the same versioned action.

## Remediation hints

Each actionable error entry may carry zero or more `remediationCandidateIds`. These IDs come from the versioned Nếp content remediation map, not from planner inference.

Examples:

```text
transfer + missing-target-group:0 -> ...:repair
transfer + missing-target-group:1 -> ...:produce
```

Historical rows without hints remain valid. Planner logic can use same-action fallback only when an entry has no explicit remediation candidate.

## Remediation satisfaction and re-probe

A recurring entry also carries:

```ts
remediationSatisfiedAt: string | null
```

An independent success on one of the declared remediation candidates sets this timestamp, but **does not** mark the source error repaired. It only means the narrower remediation task has been completed and the original task should be re-probed.

If the source re-probe succeeds independently, the source entry becomes `repaired`. If the source re-probe fails independently, `remediationSatisfiedAt` is cleared and remediation pressure reopens.

An assisted remediation/source attempt cannot satisfy or repair this cycle.

## Direct repair semantics

A later independent successful attempt on the same target + lesson version + action repairs all active error tags for that action:

```text
status = repaired
independentFailuresSinceRepair = 0
repairedAt = success time
remediationSatisfiedAt = null
```

After repair, a new independent failure becomes `observed` again, and only another independent failure promotes it back to `recurring`.

## Read boundary

`getNếpErrorMemory()` is authenticated and read-only. It reads the learner's own `learning_attempts` rows through existing RLS and projects only:

- target identity;
- correctness;
- response modality;
- support/reveal state;
- lesson/action/version identity;
- `actionKind`;
- `errorSignals.observedResponse`;
- `errorSignals.errorTags`;
- `errorSignals.remediationHints`;
- timestamp.

It does not SELECT `response_text` or the full attempt `metadata` object.

## Planner integration

Only `recurring` entries influence adaptive ranking:

- unresolved recurring error -> remediation pressure;
- recurring error with `remediationSatisfiedAt` -> source re-probe pressure;
- `observed`, `supported-only`, `repaired`, and `no-response` -> zero error pressure.

All pressure terms remain below normal planner eligibility gates.

## What V1 does not do

Error Memory V1 does not:

- create a new database table;
- claim an error is a misconception;
- infer grammar or pronunciation problems;
- use LLM classification;
- use RL/bandits;
- persist a permanent learner label;
- treat typed fallback as speaking evidence.

The snapshot is rebuilt deterministically from immutable attempts.

See `REMEDIATION_REPROBE_V1.md` for the repair → re-probe state machine.
