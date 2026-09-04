# Contract: Reality Benchmark Harness V1

- **Contract Identifier**: `nep.reality-benchmark.v1`.
- **Contract Version**: `1`.
- **Governing Purpose**:
  - Establish an immutable, reproducible reality benchmarking standard for evaluating Nếp cognitive and learner-state representations against simpler baselines on longitudinal second-language acquisition traces.
  - Move empirical benchmarking from a late roadmap phase into an inner gate between core foundation stages.

---

## 1. Core Invariants

### 1.1 Strict Chronological Sequencing & Split-Aware Label Masking
- **Causal History**: For every learner interaction token event at chronological timestamp $t$ (or sequence index $k$), feature extraction $\Phi(u, k, t)$ MUST inspect strictly information generated prior to $t$ ($t' < t$ or $k' < k$). The ground-truth label $y_k \in \{0, 1\}$ at index $k$ and any event occurring at $t' \ge t$ MUST NOT be inspected, transformed, aggregated, or referenced in feature calculation.
- **Split-Aware Evaluation Label Masking**:
  - In the original SLAM 2018 shared task, evaluation splits were distributed without labels; true labels were provided in separate `.key` files for scoring.
  - While post-workshop evaluation archives may include gold labels, the harness MUST strictly enforce single-pass prediction without online label feedback during `dev` and `test` evaluation passes.
  - For any evaluation split event at timestamp $t$, **earlier evaluation split events ($t' < t$) MUST NOT update label-dependent history or state**; they may update ONLY label-free encounter counts, lag times, and format features.
  - Both Baseline B2 and Baseline B3 MUST receive the exact same label-availability mask.
  - Automated adversarial tests MUST prove that modifying or inverting earlier evaluation split labels produces zero change in feature vectors for subsequent evaluation events.
  - Gold `.key` labels MUST be used solely for offline metric calculation and threshold tuning after predictions are emitted.
  - If `dev` is subsequently folded into training data for final `test` evaluation, that MUST be recorded as a separate, distinct fit phase (`fitPhase: "train-plus-dev"`).

### 1.2 Frozen Split Discipline
- Benchmark evaluation MUST adhere strictly to the official frozen splits established by Settles et al. (2018) for Duolingo SLAM:
  - `train`: Model fitting and representation state projection.
  - `dev`: Feature selection, hyperparameter tuning, and threshold selection.
  - `test`: Blind, final evaluation only.
- Model hyperparameters, vocabularies, or state scalers MUST NOT be tuned on `test`. Evaluating multiple model variations on `test` to select the highest metric is strictly prohibited.

### 1.3 Symmetrical Estimator Protocol (Common Predictor Ablation)
- To isolate whether the Nếp learner-state representation (`nep.learner-evidence-state.v1`) adds predictive/routing value rather than merely benefiting from a more complex model:
  - Baseline B2 (Simple History) and Baseline B3 (Nếp State) MUST use identical downstream estimators (same algorithm family, same loss function, same regularization parameters, same numerical optimization settings, same random seeds).
  - Feature budget for B3 MUST be the exact feature vector of B2 augmented by canonical Nếp state features and versioned derived features (`nep.reality-derived-features.v1`):
    $$\mathbf{x}_{B3} = [\mathbf{x}_{B2} \,\|\, \mathbf{x}_{\text{Nếp}}]$$
  - The scientific metric of interest is the incremental uplift:
    $$\Delta \text{AUC} = \text{AUC}(B3) - \text{AUC}(B2)$$

### 1.4 Baseline Hierarchy & Official Targets
All benchmark tracks MUST report against the full baseline hierarchy:
1. **B0 (Prevalence / Majority Class)**: Constant prediction based on training split prior $\hat{p} = \frac{1}{N} \sum y_i$.
2. **B1 (Official Duolingo Baseline)**:
   - Gate R0 targets reproducing the official competition Python starter code oracle baseline on the `dev` split against `dev.key`.
   - The Nếp deterministic reproduction policy requires matching the official Python starter oracle on `dev` within $\pm 0.005$ AUC.
   - Published Table 2 point estimates (Settles et al., 2018: English `es_en` $\approx 0.774$, Spanish `en_es` $\approx 0.746$, French `fr_en` $\approx 0.771$) are on the **TEST** split and may only be evaluated on `test` after model/protocol freeze.
   - Accurate language track metadata:
     * `en_es`: English learners who already speak Spanish (L1 Spanish, target English; 2,593 users).
     * `es_en`: Spanish learners who already speak English (L1 English, target Spanish; 2,643 users).
     * `fr_en`: French learners who already speak English (L1 English, target French; 1,213 users).
3. **B2 (Simple Learner History)**: Transparent, leakage-free recency and repetition baseline (word error rate so far, lag time since last seen, total practice count) under split-aware label masking.
4. **B3 (Nếp State Ablation)**: B2 augmented strictly with canonical outputs from the merged #137 contract (`nep.learner-evidence-state.v1`): `status: ConstructEvidenceSufficiency`, `uncertainty: ConstructUncertaintyLevel`, nullable `provisionalRoutingScore`, and `statistics: ConstructSufficientStatistics`, with versioned derived numeric features (`nep.reality-derived-features.v1`).
   - *Epistemic Invariant*: FSRS, BKT, or external memory decay parameters MUST NOT be invented inside B3; any such models belong strictly to separate comparators.
5. **B4 (pyBKT Comparator)**: Forward step Bayesian Knowledge Tracing evaluated only where defensible construct mappings exist; reported as `not-applicable` if token events cannot be mapped without semantic distortion.

### 1.5 Pre-R2 Compatibility & Coverage Audit Gate
- Before executing Gate R2, a formal compatibility and coverage audit MUST be performed:
  - **Ontology Alignment Boundary**: AtoEnglish maintains an English ontology. Therefore, **only track `en_es` (where learners acquire English) can map to English ontology nodes**. The `es_en` and `fr_en` tracks target Spanish and French, respectively; they have no corresponding English ontology nodes and MUST remain strictly `unmapped / not-applicable`.
  - **Evidence Field Availability**: SLAM traces do not record scaffolding support levels or hint reveals (`supportLevel`, `revealUsed` are unobserved). These fields MUST NOT be fabricated or assumed.
  - **Fail-Closed Reporting**: If sufficient canonical evidence cannot be constructed without unfounded assumptions, the harness MUST report **B3 not-applicable on SLAM** and use SLAM only for B0/B1/B2 rather than distorting the learner-state contract.

### 1.6 Clustered Uncertainty & Statistical Significance Discipline
- Observations in longitudinal language learning traces are clustered within learners.
- **Primary Significance Procedure**: The harness MUST perform a **paired cluster bootstrap by learner** (e.g. 2,000 resamples clustered by learner ID) to evaluate $\Delta \text{AUC} = \text{AUC}(B3) - \text{AUC}(B2)$, reporting effect size, 95% bootstrap confidence intervals, and two-sided bootstrap $p$-values.
- **Secondary Diagnostic**: Token-level DeLong test is retained as a secondary diagnostic.
- **Decision Rule**: Promotion decisions MUST NOT be based on $p < 0.05$ alone; they require positive effect size, confidence interval excluding zero, and per-track consistency.

### 1.7 Immutable Experiment Manifests (Integrity Fingerprint)
- Every execution run MUST emit an immutable, canonical JSON experiment manifest.
- The manifest MUST include an unkeyed cryptographic content digest calculated via SHA-256 over its canonical RFC 8785 JSON representation (excluding the `manifestDigest` field):
  $$\text{manifestDigest} = \text{SHA-256}(\text{canonicalizeJson}(\text{manifest}))$$
- This digest provides tamper-evident, content-addressed data integrity; it does NOT constitute cryptographic origin authentication.
- Manifests MUST record all fields specified in `specs/004-core-reality-benchmark-v1/data-model.md`.

---

## 2. Epistemic & Constitutional Claim Boundaries

1. **No Learning Efficacy Claims**:
   - High predictive accuracy on historical token traces does NOT imply that AtoEnglish improves human learning speed, retention, or mastery.
   - Offline benchmark results MUST NOT be marketed or cited as instructional efficacy evidence.
2. **No Population Equivalence Claims**:
   - Duolingo SLAM 2018 represents Spanish, English, and French native speakers. It does NOT validate L1 Vietnamese phonological or syntactic interference patterns.
3. **No Authority Upgrades**:
   - Benchmark evaluations operate strictly in Layer 0 / Layer 1 research space and MUST NOT mint `durable-assessment` authority or mutate live learner profiles.
4. **No Premature Promotion**:
   - If $\Delta \text{AUC} \le 0$ or if the 95% bootstrap confidence interval includes zero, the Nếp state representation MUST NOT be promoted as superior to simple history counts; additional state complexity MUST be frozen.

---

## 3. Storage, Provenance & Quarantine Hygiene

- **License Classification (CC BY-NC 4.0)**:
  - The Duolingo SLAM 2018 dataset on Harvard Dataverse (`10.7910/DVN/8SWHNO`) is distributed under **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.
  - The dataset and any weights or models derived directly from it are strictly research-only assets and MUST NOT enter the production application, live database, or commercial API runtimes.
- **Raw Data Quarantine**:
  - Raw SLAM datasets MUST reside strictly in `.cache/benchmarks/slam-2018/` (gitignored).
  - `redistributionAllowed: false` is classified as **Nếp project quarantine policy** (not a statutory CC BY-NC 4.0 restriction). Raw learner trace data MUST NEVER be committed to the repository or redistributed.
- **Provenance Integrity**:
  - Upstream checksums (`upstreamChecksumType` and `upstreamChecksumValue`) must be stored separately from locally computed `localSha256Fingerprint`.
  - Terms MUST be independently verified at retrieval time.
- **Privacy Minimization**: Anonymized user identifiers (`user_id`) from the benchmark MUST NOT be cross-referenced with AtoEnglish production learner records.

---

## 4. Scheduling & Dependency Invariants (Issue #141 Reality-First Rule)

1. **Spec Kit Formalization**: Spec Kit #004 MUST achieve independent review PASS before implementation begins.
2. **Immediate Unblocking of Baselines**: Once Spec Kit #004 converges, **B0/B1/B2 and benchmark infrastructure MAY proceed immediately before PR #140 merges**. They must not import, emulate, or assume unfinished learner-state semantics.
3. **B3 Blocking Gate**: **Baseline B3 remains strictly blocked on PR #140 reaching independent review PASS, merging into `frontier/nep-core-foundation-v1`, and rebasing the benchmark branch onto the resulting frontier**.
4. **No Pre-Merge B3 Claims**: No result produced before the post-#140 rebase may be described as evaluating the canonical Nếp learner-state representation.
