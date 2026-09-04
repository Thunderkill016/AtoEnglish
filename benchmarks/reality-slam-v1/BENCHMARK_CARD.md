# Reality Benchmark Card — SLAM V1

Status: **harness implementation only; no corpus run has been claimed**.

## Claim under test

Does a Nếp learner-state representation add held-out predictive/routing signal beyond simpler causal learner-history baselines on real longitudinal L2 traces?

## Current stage

- Spec #004: independently accepted for B0/B1/B2 implementation.
- B0: implemented, awaiting legitimate staged corpus access and execution.
- B1: exact-upstream oracle runner implemented, awaiting legitimate staged starter artifact and audited execution.
- B2: causal history + fixed sklearn SGD-logistic baseline implemented, awaiting staged corpus execution.
- B3: **not executed**. The compatibility audit currently fails closed because original SLAM rows do not expose enough canonical Nếp task/evidence semantics to construct `CoreEvidenceForRouting` without guessing.
- B4: not started.

## Dataset/provenance boundary

Candidate corpus: Duolingo SLAM 2018, Harvard Dataverse DOI `10.7910/DVN/8SWHNO`, project-classified CC BY-NC 4.0. Raw bytes remain outside Git and production stores. Dataverse Guestbook/access requirements must be legitimately satisfied before download. `starter_code.tar.gz` has separate repository-redistribution licensing classified as unverified until the staged artifact proves otherwise.

## Metrics

Primary: ROC AUC. Secondary: F1@0.5 and log-loss. No scores are recorded here until the exact staged artifacts are validated and the corresponding run manifest is emitted.

## Non-claims

This benchmark does not establish learning efficacy, retention, transfer, Vietnamese-learner validity, mastery calibration, CEFR certification, or product quality.