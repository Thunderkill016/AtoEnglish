# Feature Specification: Reality Benchmark Harness V1

**Feature Branch**: `gemini/core-reality-benchmark-v1`  
**Created**: 2026-09-05  
**Status**: Draft  
**Input**: Issue #141 and Owner Directive on `CORE-REALITY-001`.

---

## User Scenarios & Testing

### User Story 1 - Reproduce Official Benchmark Baseline (Priority: P1)

A core researcher or auditor can run the benchmark harness against the frozen Duolingo SLAM 2018 dataset and reproduce the official logistic regression baseline (B1) across all three language tracks targeting historical published point values from Settles et al. (2018) under the Nếp reproduction policy ($\pm 0.005$ AUC in a deterministic environment).

**Independent Test**: Running the benchmark on `dev` split with baseline B1 matches published Duolingo point targets (`es_en` $\approx 0.774$, `en_es` $\approx 0.746$, `fr_en` $\approx 0.771$) within the $\pm 0.005$ policy window.

**Acceptance Scenarios**:
1. **Given** the frozen SLAM dataset, **When** running Gate R0 evaluation for B1 on the `dev` split, **Then** the reproduced AUC is within $[0.769, 0.779]$ for English, $[0.741, 0.751]$ for Spanish, and $[0.766, 0.776]$ for French under the Nếp deterministic reproduction policy.
2. **Given** any discrepancy exceeding tolerance, **When** Gate R0 completes, **Then** the run fails closed with status `invalid-run` and halts further Nếp evaluation until baseline parity is restored.

---

### User Story 2 - Establish Transparent Simple History Baseline (Priority: P1)

A researcher can establish a transparent, leakage-free simple history baseline (B2) modeling user error rates, word error rates, and recency/lag time without Nếp state machinery.

**Independent Test**: B2 computes feature vectors strictly chronologically ($t' < t$) under split-aware masking and produces an interpretable benchmark score for subsequent ablation.

**Acceptance Scenarios**:
1. **Given** a learner's past exercise history, **When** computing B2 features for token at time $t$, **Then** only events occurring strictly before $t$ are considered.
2. **Given** sequential processing of the TEST split, **When** computing features, **Then** earlier TEST events ($t' < t_{\text{TEST}}$) update only label-free encounter counts and lag times, strictly masking ground truth labels.
3. **Given** identical input traces, **When** running B2, **Then** feature generation and model predictions replay byte-deterministically.

---

### User Story 3 - Isolate Nếp Representation Value via Symmetrical Ablation (Priority: P1)

A researcher can evaluate the incremental predictive value of Nếp learner-state features (`nep.learner-evidence-state.v1`) by projecting canonical state fields into the identical downstream estimator used in B2 (yielding Baseline B3), without smuggling unmerged external memory models.

**Independent Test**: B3 and B2 share identical estimators, hyperparameters, and feature budgets (except for canonical Nếp state features); the difference $\Delta \text{AUC} = \text{AUC}(B3) - \text{AUC}(B2)$ is calculated alongside two-sided $p$-values.

**Acceptance Scenarios**:
1. **Given** the B2 feature pipeline and estimator configuration, **When** executing B3, **Then** B3 ingests $[X_{B2} \,\|\, X_{\text{Nếp}}]$ into the same estimator without altering loss, regularization, or optimization settings.
2. **Given** the B3 feature pipeline, **When** projecting state, **Then** B3 projects strictly canonical fields from `nep.learner-evidence-state.v1` (state status, epistemic/aleatoric/conflict uncertainty categories, nullable provisional routing score, evidence counts, support/reveal counts, durable/reference counts, transfer success/failure counts, and observation timestamps). External models (FSRS, BKT) are excluded.
3. **Given** a positive uplift with $p < 0.05$, **When** Gate R2 completes, **Then** the run is marked `candidate-better` and preserves the state representation.
4. **Given** $\Delta \text{AUC} \le 0$ or $p \ge 0.05$, **When** Gate R2 completes, **Then** the run is marked `no-evidence-of-improvement` or `candidate-worse`, blocking premature promotion claims.

---

### User Story 4 - Audit pyBKT OSS Comparator Within Defensible Limits (Priority: P2)

A researcher can execute `CAHLR/pyBKT` as an external baseline (B4) on a defensible lemma-level or grammatical construct mapping, without distorting token-level sequence semantics.

**Independent Test**: pyBKT evaluates tokens mapped to verified skill categories; unmapped tokens output `not-applicable`.

**Acceptance Scenarios**:
1. **Given** SLAM tokens, **When** a token matches an audited lemma or syntactic skill, **Then** pyBKT predicts correct probability via standard forward stepping.
2. **Given** punctuation or unmapped tokens, **When** evaluated, **Then** pyBKT outputs `not-applicable` rather than fabricating arbitrary skill models.

---

### User Story 5 - Emit Cryptographic Manifests & Falsifiable Decision (Priority: P1)

A compliance or governance auditor can verify that every benchmark run produces an immutable, canonical RFC 8785 JSON manifest with a SHA-256 integrity fingerprint (content digest), recording exact dataset checksums, license breakdown, code commit SHA, hyperparameters, and per-track metrics.

**Independent Test**: Re-computing SHA-256 over canonicalized manifest JSON matches the embedded `manifestDigest`.

**Acceptance Scenarios**:
1. **Given** a completed benchmark run, **When** emitting results, **Then** an `ExperimentManifest` is saved to disk with `manifestDigest` and strict status classifications.
2. **Given** any mutation to manifest fields, **When** validated, **Then** the integrity digest verification fails closed.

---

## Requirements

### Functional Requirements

- **FR-001**: The harness MUST implement contract `nep.reality-benchmark.v1` (version 1).
- **FR-002**: The harness MUST support all three official SLAM 2018 language tracks: `es_en` (English), `en_es` (Spanish), and `fr_en` (French).
- **FR-003**: The harness MUST strictly enforce the frozen split hierarchy (`train`, `dev`, `test`). Hyperparameter selection and vocabulary indexing MUST occur exclusively on `train` and `dev`.
- **FR-004**: Feature extraction MUST be strictly causal / chronological ($t' < t$ or $k' < k$). In addition, the harness MUST enforce the TEST split label masking protocol: earlier TEST events ($t' < t_{\text{TEST}}$) MUST NOT update label-dependent history or state; only label-free encounter counts, lag times, and formats. B2 and B3 MUST receive the exact same mask. The harness MUST include an automated adversarial test proving label inversion of earlier TEST events produces zero feature delta for subsequent events.
- **FR-005**: Gate R0 MUST target historical published point values from Settles et al. (2018) for the official Duolingo baseline B1 on the `dev` split (`es_en` $\approx 0.774$, `en_es` $\approx 0.746$, `fr_en` $\approx 0.771$) within the Nếp deterministic reproduction policy ($\pm 0.005$ AUC) before Nếp evaluation is permitted.
- **FR-006**: Baseline B2 MUST implement simple, transparent learner history features (user historical error rate, token error rate, elapsed seconds since last seen, prompt format, response time) under the split-aware label masking policy.
- **FR-007**: Baseline B3 MUST evaluate Nếp learner-state features via symmetrical ablation: appending strictly canonical outputs from the merged #137 contract (`nep.learner-evidence-state.v1`)—state status, epistemic/aleatoric/conflict uncertainty categories, nullable provisional routing score, evidence counts, support/reveal counts, durable/reference counts, transfer success/failure counts, and observation timestamps—to the exact B2 feature vector under an identical downstream estimator. External memory models (FSRS, BKT) belong strictly to separate comparators.
- **FR-008**: Metric reporting MUST include ROC AUC (primary), F1 at threshold 0.5 (secondary), and binary cross-entropy log-loss (secondary), along with total token count and positive class prevalence.
- **FR-009**: Statistical significance for $\Delta \text{AUC} = \text{AUC}(B3) - \text{AUC}(B2)$ MUST be evaluated using DeLong's test or paired bootstrap with two-sided $p$-values and 95% confidence intervals.
- **FR-010**: Every execution run MUST emit an immutable JSON experiment manifest with a SHA-256 integrity fingerprint (unkeyed content digest) over its canonical RFC 8785 representation.
- **FR-011**: Dataset licensing terms MUST be strictly classified: Harvard Dataverse DOI `10.7910/DVN/8SWHNO` is CC BY-NC 4.0 (Non-Commercial research only); `codeLicense: "MIT"`, `datasetLicense: "CC-BY-NC-4.0"`, `commercialUseAllowed: false`, `redistributionAllowed: false`. Raw dataset archives MUST be quarantined in `.cache/benchmarks/slam-2018/` and terms verified at retrieval time; SLAM data and directly derived weights MUST NOT enter production runtimes.
- **FR-012**: Benchmark reports MUST explicitly disclaim human learning efficacy, Vietnamese learner validity, and mastery calibration.
