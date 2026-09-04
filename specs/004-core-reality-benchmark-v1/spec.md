# Feature Specification: Reality Benchmark Harness V1

**Feature Branch**: `gemini/core-reality-benchmark-v1`  
**Created**: 2026-09-05  
**Status**: Draft  
**Input**: Issue #141 and Owner Directives on `CORE-REALITY-001`.

---

## User Scenarios & Testing

### User Story 1 - Reproduce Official Benchmark Baseline (Priority: P1)

A core researcher or auditor can run the benchmark harness against the frozen Duolingo SLAM 2018 dataset and reproduce the official logistic regression baseline (B1) on the `dev` split across all three language tracks against the official competition Python starter code oracle within the Nếp deterministic reproduction policy ($\pm 0.005$ AUC).

**Independent Test**: Running the benchmark on the `dev` split with baseline B1 matches the official Python starter oracle metrics on `dev` against `dev.key` within the $\pm 0.005$ policy window. (Published Table 2 points: `es_en` $\approx 0.774$, `en_es` $\approx 0.746$, `fr_en` $\approx 0.771$ are on the TEST split and may be verified on TEST only after model/protocol freeze).

**Acceptance Scenarios**:
1. **Given** the frozen SLAM dataset, **When** running Gate R0 evaluation for B1 on the `dev` split, **Then** the reproduced AUC matches the official Python starter script oracle on `dev` within $\pm 0.005$ AUC under identical solver configurations.
2. **Given** any discrepancy exceeding tolerance, **When** Gate R0 completes, **Then** the run fails closed with status `invalid-run` and halts further Nếp evaluation until baseline parity is restored.
3. **Given** model freeze and post-selection evaluation on `test`, **When** evaluated against `test.key`, **Then** TEST metrics are reported in a distinct evaluation phase and compared against published Table 2 points.

---

### User Story 2 - Establish Transparent Simple History Baseline (Priority: P1)

A researcher can establish a transparent, leakage-free simple history baseline (B2) modeling user historical error rates, token error rates, and recency/lag time without Nếp state machinery.

**Independent Test**: B2 computes feature vectors strictly chronologically ($t' < t$) under split-aware masking and produces an interpretable benchmark score for subsequent ablation.

**Acceptance Scenarios**:
1. **Given** a learner's past exercise history, **When** computing B2 features for token at time $t$, **Then** only events occurring strictly before $t$ are considered.
2. **Given** sequential processing of the DEV or TEST split, **When** generating predictions, **Then** earlier evaluation split events update only label-free encounter counts and lag times, strictly masking ground truth labels. Gold `.key` labels are used solely for batch scoring after predictions are emitted.
3. **Given** identical input traces, **When** running B2, **Then** feature generation and model predictions replay byte-deterministically.

---

### User Story 3 - Isolate Nếp Representation Value via Symmetrical Ablation (Priority: P1)

A researcher can evaluate the incremental predictive value of Nếp learner-state features (`nep.learner-evidence-state.v1`) by projecting canonical state fields into the identical downstream estimator used in B2 (yielding Baseline B3), without smuggling unmerged external memory models.

**Independent Test**: B3 and B2 share identical estimators, hyperparameters, and feature budgets (except for canonical Nếp state features); the difference $\Delta \text{AUC} = \text{AUC}(B3) - \text{AUC}(B2)$ is calculated alongside paired cluster bootstrap by learner (2,000 resamples) and 95% confidence intervals.

**Acceptance Scenarios**:
1. **Given** the B2 feature pipeline and estimator configuration, **When** executing B3, **Then** B3 ingests $[X_{B2} \,\|\, X_{\text{Nếp}}]$ into the same estimator without altering loss, regularization, or optimization settings.
2. **Given** the B3 feature pipeline, **When** projecting state, **Then** B3 projects strictly canonical fields from `nep.learner-evidence-state.v1` (`status: ConstructEvidenceSufficiency`, `uncertainty: ConstructUncertaintyLevel`, nullable `provisionalRoutingScore`, and `statistics: ConstructSufficientStatistics`). Any derived features have an explicit `derivedFeatureId` (`nep.reality-derived-features.v1`), frozen formulas, and source fields. External models (FSRS, BKT) are excluded.
3. **Given** a positive uplift with 95% bootstrap confidence interval strictly above zero and per-track consistency, **When** Gate R2 completes, **Then** the run is marked `candidate-better` and preserves the state representation.
4. **Given** $\Delta \text{AUC} \le 0$ or confidence interval overlapping zero, **When** Gate R2 completes, **Then** the run is marked `no-evidence-of-improvement` or `candidate-worse`, blocking premature promotion claims.

---

### User Story 4 - Audit pyBKT OSS Comparator Within Defensible Limits (Priority: P2)

A researcher can execute `CAHLR/pyBKT` as an external baseline (B4) on a defensible lemma-level or grammatical construct mapping, without distorting token-level sequence semantics.

**Independent Test**: pyBKT evaluates tokens mapped to verified skill categories; unmapped tokens output `not-applicable`.

**Acceptance Scenarios**:
1. **Given** SLAM tokens, **When** a token matches an audited lemma or syntactic skill, **Then** pyBKT predicts correct probability via standard forward stepping.
2. **Given** punctuation or unmapped tokens, **When** evaluated, **Then** pyBKT outputs `not-applicable` rather than fabricating arbitrary skill models.

---

### User Story 5 - Emit Cryptographic Manifests & Falsifiable Decision (Priority: P1)

A compliance or governance auditor can verify that every benchmark run produces an immutable, canonical RFC 8785 JSON manifest with a SHA-256 integrity fingerprint (content digest), recording exact dataset checksums, license breakdown, code commit SHA, hyperparameters, per-track metrics, and paired cluster bootstrap statistics.

**Independent Test**: Re-computing SHA-256 over canonicalized RFC 8785 manifest JSON matches the embedded `manifestDigest`.

**Acceptance Scenarios**:
1. **Given** a completed benchmark run, **When** emitting results, **Then** an `ExperimentManifest` is saved to disk with `manifestDigest` and strict status classifications.
2. **Given** any mutation to manifest fields, **When** validated, **Then** the integrity digest verification fails closed.

---

## Requirements

### Functional Requirements

- **FR-001**: The harness MUST implement contract `nep.reality-benchmark.v1` (version 1).
- **FR-002**: The harness MUST support all three official SLAM 2018 language tracks with accurate primary-source metadata:
  * `en_es`: English learners who already speak Spanish (L1 Spanish, target English; 2,593 users; ~2.60M tokens).
  * `es_en`: Spanish learners who already speak English (L1 English, target Spanish; 2,643 users; ~2.62M tokens).
  * `fr_en`: French learners who already speak English (L1 English, target French; 1,213 users; ~1.97M tokens).
- **FR-003**: The harness MUST strictly enforce the frozen split hierarchy (`train`, `dev`, `test`). Hyperparameter selection and vocabulary indexing MUST occur exclusively on `train` and `dev`.
- **FR-004**: Feature extraction MUST be strictly causal / chronological ($t' < t$ or $k' < k$). In addition, the harness MUST enforce split-aware label availability:
  * While generating predictions on `dev` or `test`, earlier events in that split ($t' < t_{\text{eval}}$) MUST NOT update label-dependent history or state; only label-free encounter counts, lag times, and formats.
  * Gold `.key` labels MUST be used solely for offline scoring and threshold tuning after predictions are emitted.
  * Both B2 and B3 MUST receive the exact same mask.
  * The harness MUST include an automated adversarial test proving label inversion of earlier evaluation events produces zero feature delta for subsequent events.
  * If `dev` is subsequently folded into training data for final `test` evaluation, that MUST be recorded as a separate, distinct fit phase (`fitPhase: "train-plus-dev"`).
- **FR-005**: Gate R0 MUST target reproduction of the official competition Python starter code oracle baseline B1 on the `dev` split scored against `dev.key` within the Nếp deterministic reproduction policy ($\pm 0.005$ AUC) before Nếp evaluation is permitted. Published Table 2 points (Settles et al., 2018: English `0.774`, Spanish `0.746`, French `0.771`) are on the TEST split and may only be evaluated on `test` against `test.key` after model/protocol freeze.
- **FR-006**: Baseline B2 MUST implement simple, transparent learner history features (user historical error rate, token error rate, elapsed seconds since last seen, prompt format, response time) under the split-aware label masking policy. Missing or negative response times MUST be treated as missing/invalid (`null`).
- **FR-007**: Baseline B3 MUST evaluate Nếp learner-state features via symmetrical ablation: appending strictly canonical outputs from the merged #137 contract (`nep.learner-evidence-state.v1`)—`status: ConstructEvidenceSufficiency`, `uncertainty: ConstructUncertaintyLevel`, nullable `provisionalRoutingScore`, and `statistics: ConstructSufficientStatistics`—to the exact B2 feature vector under an identical downstream estimator. Any derived features (one-hot status indicators, ratios, elapsed horizons) MUST have an explicit `derivedFeatureId` (`nep.reality-derived-features.v1`), frozen formulas, and source fields. External memory models (FSRS, BKT) belong strictly to separate comparators.
- **FR-008**: Metric reporting MUST include ROC AUC (primary), F1 at threshold 0.5 (secondary), and binary cross-entropy log-loss (secondary), along with total token count and positive class prevalence.
- **FR-009**: Statistical significance for $\Delta \text{AUC} = \text{AUC}(B3) - \text{AUC}(B2)$ MUST use **paired cluster bootstrap by learner** (e.g. 2,000 resamples clustered by learner ID) as the primary uncertainty procedure, reporting effect size, 95% bootstrap confidence intervals, and per-track consistency. Token-level DeLong test is retained as a secondary diagnostic. Promotion decisions MUST NOT be based on $p < 0.05$ alone.
- **FR-010**: Every execution run MUST emit an immutable JSON experiment manifest with a SHA-256 integrity fingerprint (unkeyed content digest) over its canonical RFC 8785 representation.
- **FR-011**: Dataset licensing terms MUST be strictly classified: Harvard Dataverse DOI `10.7910/DVN/8SWHNO` is CC BY-NC 4.0 (Non-Commercial research only); `codeLicense: "MIT"`, `datasetLicense: "CC-BY-NC-4.0"`, `commercialUseAllowed: false`. `redistributionAllowed: false` is classified as **Nếp project quarantine policy** (not a statutory CC BY-NC 4.0 restriction). Raw dataset archives MUST be quarantined in `.cache/benchmarks/slam-2018/` and terms verified at retrieval time; repository-provided checksums (`upstreamChecksumType` and `upstreamChecksumValue`) must be stored separately from locally computed `localSha256Fingerprint`. SLAM data and directly derived weights MUST NOT enter production runtimes.
- **FR-012**: Benchmark reports MUST explicitly disclaim human learning efficacy, Vietnamese learner validity, and mastery calibration.
- **FR-013**: Pre-R2 Compatibility & Coverage Audit: A formal compatibility and coverage audit MUST be executed prior to Gate R2. Only track `en_es` (where learners acquire English) can map to AtoEnglish English ontology nodes; `es_en` and `fr_en` have no English ontology nodes and MUST remain strictly `unmapped / not-applicable`. Exercise formats and modalities map only where defensible; unavailable fields (`supportLevel`, `revealUsed`) must not be fabricated. If sufficient canonical evidence cannot be constructed without unfounded assumptions, the harness MUST report **B3 not-applicable on SLAM** and use SLAM only for B0/B1/B2 rather than distorting the learner-state contract.
- **FR-014**: Reuse-First Acceleration Architecture (#138): The harness MUST reuse the official Python starter scripts as reproduction oracle, pinned `scikit-learn` (v1.6.1) / `scipy` (v1.15.2) for estimator fitting and metric calculations, and pinned `CAHLR/pyBKT` (v1.4.3) for the optional comparator. Benchmark code resides in isolated workspace `benchmarks/reality-slam-v1/`, not in production `src/lib/`. Node/TypeScript code is restricted to thin parser/audit glue, feature extraction, manifest generation, and executing the `#137` state projection contract.
- **FR-015**: Scheduling Invariant (Issue #141 Reality-First Rule):
  * Convergence of this Spec Kit unblocks immediate implementation and execution of **B0/B1/B2 and benchmark infrastructure before PR #140 merges**.
  * **B3 remains strictly blocked on PR #140 reaching independent review PASS, merging into `frontier/nep-core-foundation-v1`, and rebasing onto the resulting frontier**.
