# Plan: Nếp-native Evidence Pilot V1

## Principle

Use existing merged contracts as the experiment substrate. Do not build a parallel learner model, analytics stack, UI, persistence system, or evaluator.

## Stage N1 — contract and task matrix

1. Freeze `nep.native-evidence-pilot.v1` and one ontology target: `nep.en.v1.language-system.syntax-grammar`.
2. Implement five prospective task-family definitions from `CoreTaskSpec`.
3. Define deterministic task/content fingerprints and context IDs before outcomes.
4. Define reference-only evidence issuance through `validateReferenceCoreEvidence()`.
5. Freeze B2-native and B3-native feature budgets before human outcomes exist.
6. Freeze the prediction cutoff and leakage rules.
7. Write draft privacy/consent/retention protocol but leave human collection disabled.

## Stage N2 — synthetic plumbing

Create a local/offline synthetic harness under `benchmarks/native-evidence-v1/` that reuses core TypeScript contracts directly. Synthetic scenarios must include:

- cold-start unknown state;
- supported recognition with reveal unused and reveal used;
- independent free recall;
- delayed free recall at an explicit later host timestamp;
- valid near-transfer after a prior distinct baseline context;
- invalid first-event transfer;
- duplicate event ID;
- late out-of-order event for append-only reducer;
- detached/cloned evidence rejection;
- deletion/export of one pseudonymous synthetic participant;
- pre-attempt B2/B3 feature extraction proving no current/future label leakage.

N2 outputs only contract-test artifacts and machine-readable synthetic manifests. Do not report predictive metrics as empirical learner evidence.

## Stage N3 — bounded human pilot (NOT AUTHORIZED HERE)

Only after separate owner approval of the privacy/consent protocol. No code path should silently transition from N2 synthetic actors to real participants.

## Stage N4 — reality decision (future)

Use a common estimator for B2-native and B3-native. Freeze learner/temporal split policy before outcomes are inspected. Report sample size, learner count, coverage, effect size and uncertainty. If the pilot is too small for a defensible predictive comparison, report `insufficient-evidence` rather than optimizing on the pilot.

## Reuse map

- ontology: `src/lib/core/ontology*`, `ontology-seed.ts`;
- task semantics: `src/lib/core/task.ts`;
- evidence roles: `src/lib/core/evidence-role.ts`;
- reference validation: `src/lib/core/certified-evidence.ts`;
- learner projection: `src/lib/core/learner-state.ts`;
- research manifests/statistical conventions: reuse patterns from `benchmarks/reality-slam-v1/` where compatible.

## Stop conditions

Stop/redesign before human collection if any of these fail in N2:

- task semantics cannot be validated prospectively;
- reference evidence requires guessed fields;
- unknown collapses to zero;
- current/future outcomes enter pre-attempt features;
- changed-context transfer can be manufactured without prior baseline context;
- deletion cannot remove a participant's synthetic raw/derived artifacts deterministically.
