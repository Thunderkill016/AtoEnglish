# Learner Model Real-Data Readiness V1

## Purpose

This boundary answers one question before any learner model can be compared on real AtoEnglish data:

> Do we have enough privacy-safe, independent transfer / delayed-retention outcomes to run a trustworthy learner-level held-out benchmark?

It does **not** change production learner state, mastery, routing, or evidence generation.

## Operator flow

1. Run `scripts/learner-model-readiness.sql` as a read-only aggregate audit.
2. Stop unless the result is `exportable-needs-held-out-check`.
3. Run `scripts/export-learner-model-evidence.sql`.
4. Save only the returned `benchmark_dataset` JSON. Do not export the underlying tables directly.
5. Run the existing learner-model benchmark CLI on that JSON.
6. The TypeScript preflight reuses the benchmark's deterministic learner-level split and requires at least 20 held-out target outcomes with both positive and negative labels.
7. A candidate that clears the held-out benchmark is only **eligible for shadow validation**. It is not automatically allowed to replace the production learner-state model.

## Privacy boundary

The export intentionally emits only:

- within-export pseudonymous `learnerKey`
- canonical `targetId`
- evidence type
- success
- confidence
- support level
- derived `independent`
- derived `changedContext`
- derived retention delay in days
- evidence timestamp

It never emits:

- raw `user_id`
- `response_text`
- transcript or audio
- prompt text / partner cue
- raw `context_id`
- metadata JSON
- name, email, employer, or other free text

`learnerKey` is a dense within-export pseudonym (`learner-000001`, ...). It is sufficient for learner-level holdout but is not a durable cross-export identity.

## Evidence semantics

### Independent

An event is considered independent only when all of these are true:

- evidence `support_level = 0`
- attempt `support_level = 0`
- `hint_count = 0`
- `reveal_used = false`

### Changed-context transfer

The export compares the transfer event's internal context with the most recent prior successful production / repair / transfer context for the same learner and target. Only the derived boolean is exported. Raw contexts stay inside the database query.

### Delayed retention

For retention evidence, `delayDays` is measured from the most recent prior **successful independent** retrieval / listening / production / repair / transfer / retention evidence for the same learner and target.

A retention outcome enters the benchmark only when `delayDays >= 1`.

## Production audit snapshot — 2026-09-03

Read-only aggregate inspection of project `zpiwddskhduuykpxltun` found:

- canonical `learning_attempts`: 0 rows
- canonical `learning_evidence_events`: 0 rows
- `card_review_logs`: 0 rows
- `pilot_events`: 44 rows from 1 learner

The pilot events are limited to return / landing / start telemetry and contain no scored transfer or delayed-retention outcomes. They must **not** be backfilled or re-labeled as canonical learning evidence.

Therefore the current real-data learner-model benchmark is correctly blocked at:

`no-evidence`

This is a data-collection limitation, not evidence that any candidate learner model is better or worse.

## Exit condition

This boundary becomes actionable when canonical evidence has enough real learner-level target outcomes for the deterministic held-out split to contain:

- at least 20 target outcomes,
- at least one success,
- at least one failure.

Only then should the model-comparison report be used to decide whether a candidate is eligible for shadow validation.
