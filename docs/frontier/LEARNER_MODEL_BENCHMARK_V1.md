# Learner Model Benchmark V1

## Purpose

This benchmark answers one narrow question before AtoEnglish changes learner-model routing:

> Does a candidate model predict future independent transfer or delayed retention better than the current EMA-style history baseline on held-out learners?

It is an **offline research harness**. It does not run in the learner-facing Next.js runtime, does not write Supabase state, and does not mutate mastery/proficiency.

## Target outcome

A row becomes an evaluation label only when it is one of:

- independent `transfer` evidence with `supportLevel = 0` and `changedContext = true`, or
- independent `retention` evidence with `supportLevel = 0` and `delayDays >= 1`.

The prediction is always computed before that outcome is applied to the learner's history.

## Learner-level holdout

Learner identities are deterministically partitioned into train and test sets. A learner can appear in exactly one partition. Candidate parameters are fit only from train learners and metrics are reported on test learners.

This V1 intentionally prioritizes a strict learner-level holdout over a random row split because row-level splitting would leak learner history across train/test.

## Models

### `ema-history-v1`

Reference baseline. It mirrors AtoEnglish's current asymmetric EMA observation update:

- success alpha: `0.35`
- failure alpha: `0.5`
- supported success receives the same `0.1 × supportLevel`, capped at `0.5`, observation penalty
- an unobserved outcome dimension predicts neutral `0.5`, not zero

This is a benchmark predictor, not a claim that the current EMA snapshot is a calibrated mastery probability.

### `bkt-grid-v1`

A small standard Bayesian Knowledge Tracing comparator. `initialKnown`, `learn`, `guess`, and `slip` are selected by deterministic grid search on training learners only. V1 uses one latent state per learner × target across evidence opportunities.

This is deliberately simple: BKT must earn complexity by predicting the held-out target outcome better than the baseline.

### `lkt-logistic-v1`

A lightweight LKT-style logistic comparator fitted only on train evaluation outcomes. Its features are derived exclusively from evidence available before the evaluation event:

- smoothed prior success rate
- bounded opportunity count
- recency
- independent success rate
- transfer success rate
- last observed success
- support-free opportunity rate

It is implemented in TypeScript to keep this research slice reproducible inside the existing repository toolchain. This does not claim feature parity with the R LKT package.

### `lkt-logistic-aoa-v1`

Uses the fitted LKT-style logistic model, then averages its prediction trajectory across prior learning opportunities.

**AOA is an aggregation strategy, not a standalone learner model.**

## Metrics

Each model reports:

- log loss — primary predictive metric
- Brier score
- expected calibration error (10 probability bins)
- AUROC when the held-out set has both outcome classes

A candidate can only become `eligible-for-shadow-validation` when real held-out data contains enough outcomes, log loss improves by at least `0.002`, Brier score does not regress, and calibration does not materially regress.

That status is **not** permission to replace the production learner model. It only justifies a separate shadow-validation step.

## Synthetic fixture rule

`--synthetic` exists only to test the benchmark plumbing. Synthetic results always receive `synthetic-only` and can never justify adoption regardless of their metrics.

## Privacy-safe input contract

The CLI accepts only this structured JSON shape:

```json
{
  "datasetId": "hashed-export-2026-09-03",
  "synthetic": false,
  "records": [
    {
      "learnerKey": "pseudonymous-key",
      "targetId": "CAP-002",
      "evidenceType": "production",
      "success": true,
      "confidence": 1,
      "supportLevel": 0,
      "independent": true,
      "changedContext": false,
      "delayDays": null,
      "occurredAt": "2026-09-01T10:00:00.000Z"
    }
  ]
}
```

The parser rejects unsupported fields and explicitly rejects privacy-sensitive payload-shaped fields including `responseText`, `response_text`, transcript, audio, prompt text, metadata, email, and name.

`learnerKey` must be a pseudonymous export key. Do not export raw email, name, transcript, audio, or free text into benchmark files.

V1 deliberately has **no Supabase query/export command**. A future real-data export must be a separately reviewed privacy boundary.

## Running

Synthetic pipeline smoke:

```bash
npx tsx scripts/run-learner-model-benchmark.ts --synthetic
```

Privacy-safe JSON dataset:

```bash
npx tsx scripts/run-learner-model-benchmark.ts /path/to/privacy-safe-benchmark.json
```

The command prints a JSON report to stdout and performs no database writes.

## Promotion boundary

No benchmark model may directly:

- set mastery/proficiency,
- write `learner_skill_states`,
- create learning evidence,
- change adaptive routing in production,
- infer pronunciation quality from transcript,
- promote itself because synthetic metrics look good.

The intended sequence is:

```text
benchmark harness
  -> privacy-safe historical export
  -> held-out comparison
  -> shadow validation
  -> controlled experiment
  -> routing change only if durable transfer/retention outcomes improve
```
