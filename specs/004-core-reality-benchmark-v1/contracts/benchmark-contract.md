# Contract: Reality Benchmark Harness V1

- **Contract Identifier**: `nep.reality-benchmark.v1`.
- **Contract Version**: `1`.
- **Governing Purpose**:
  - Establish an immutable, reproducible reality benchmarking standard for evaluating Nếp cognitive and learner-state representations against simpler baselines on longitudinal second-language acquisition traces.
  - Move empirical benchmarking from a late roadmap phase into an inner gate between core foundation stages.

---

## 1. Core Invariants

### 1.1 Strict Chronological Sequencing & TEST Label Masking
- **Causal History**: For every learner interaction token event at chronological timestamp $t$ (or sequence index $k$), feature extraction $\Phi(u, k, t)$ MUST inspect strictly information generated prior to $t$ ($t' < t$ or $k' < k$). The ground-truth label $y_k \in \{0, 1\}$ at index $k$ and any event occurring at $t' \ge t$ MUST NOT be inspected, transformed, aggregated, or referenced in feature calculation.
- **TEST Split Label Masking**:
  - In the original SLAM 2018 shared task, TEST data was released strictly blind without labels.
  - While post-workshop evaluation archives may include TEST labels, the harness MUST strictly mask all TEST labels during sequential feature generation.
  - For any TEST event at timestamp $t$, **earlier TEST events ($t' < t$) MUST NOT update label-dependent history or state**; they may update ONLY label-free encounter counts, lag times, and format features.
  - Both Baseline B2 and Baseline B3 MUST receive the exact same label-availability mask.
  - Automated adversarial tests MUST prove that modifying or inverting earlier TEST labels produces zero change in feature vectors for subsequent TEST events.

### 1.2 Frozen Split Discipline
- Benchmark evaluation MUST adhere strictly to the official frozen splits established by Settles et al. (2018) for Duolingo SLAM:
  - `train`: Model fitting and representation state projection.
  - `dev`: Feature selection, hyperparameter tuning, and threshold selection.
  - `test`: Blind, final evaluation only.
- Model hyperparameters, vocabularies, or state scalers MUST NOT be tuned on `test`. Evaluating multiple model variations on `test` to select the highest metric is strictly prohibited.

### 1.3 Symmetrical Estimator Protocol (Common Predictor Ablation)
- To isolate whether the Nếp learner-state representation (`nep.learner-evidence-state.v1`) adds predictive/routing value rather than merely benefiting from a more complex model:
  - Baseline B2 (Simple History) and Baseline B3 (Nếp State) MUST use identical downstream estimators (same algorithm family, same loss function, same regularization parameters, same numerical optimization settings, same random seeds).
  - Feature budget for B3 MUST be the exact feature vector of B2 augmented by the canonical Nếp state features:
    $$\mathbf{x}_{B3} = [\mathbf{x}_{B2} \,\|\, \mathbf{x}_{\text{Nếp}}]$$
  - The scientific metric of interest is the incremental uplift:
    $$\Delta \text{AUC} = \text{AUC}(B3) - \text{AUC}(B2)$$

### 1.4 Baseline Hierarchy & Official Targets
All benchmark tracks MUST report against the full baseline hierarchy:
1. **B0 (Prevalence / Majority Class)**: Constant prediction based on training split prior $\hat{p} = \frac{1}{N} \sum y_i$.
2. **B1 (Duolingo Starter Baseline)**:
   - Historical published point values (Settles et al., 2018): English `es_en` $\approx 0.774$, Spanish `en_es` $\approx 0.746$, French `fr_en` $\approx 0.771$.
   - Any reproduction tolerance is an explicit Nếp experiment-policy choice ($\pm 0.005$ AUC on deterministic environment); it is not an official challenge tolerance.
3. **B2 (Simple Learner History)**: Transparent, leakage-free recency and repetition baseline (word error rate so far, lag time since last seen, total practice count).
4. **B3 (Nếp State Ablation)**: B2 augmented strictly with canonical outputs from the merged #137 contract (`nep.learner-evidence-state.v1`): state status, epistemic/aleatoric/conflict uncertainty categories, nullable provisional routing score, evidence counts, support/reveal counts, durable/reference counts, transfer success/failure counts, and observation timestamps.
   - *Invariant*: FSRS, BKT, or external memory decay parameters MUST NOT be invented inside B3; any such models belong strictly to separate comparators.
5. **B4 (pyBKT Comparator)**: Forward step Bayesian Knowledge Tracing evaluated only where defensible construct mappings exist; reported as `not-applicable` if token events cannot be mapped without semantic distortion.

### 1.5 Immutable Experiment Manifests (Integrity Fingerprint)
- Every execution run MUST emit an immutable, canonical JSON experiment manifest.
- The manifest MUST include an unkeyed cryptographic content digest calculated via SHA-256 over its canonical RFC 8785 JSON representation:
  $$\text{manifestDigest} = \text{SHA-256}(\text{canonicalizeJson}(\text{manifest}))$$
- This digest guarantees deterministic data integrity against accidental mutation or drift; it does NOT constitute cryptographic origin authentication.
- Manifests MUST record:
  - `contractVersion`: `"nep.reality-benchmark.v1"`.
  - `datasetId`: `"duolingo-slam-2018-doi:10.7910/DVN/8SWHNO"`.
  - `datasetArchiveSha256`: Checksum of source archive.
  - `codeLicense`: `"MIT"`.
  - `datasetLicense`: `"CC-BY-NC-4.0"`.
  - `commercialUseAllowed`: `false`.
  - `redistributionAllowed`: `false`.
  - `track`: `"es_en"`, `"en_es"`, or `"fr_en"`.
  - `split`: `"train"`, `"dev"`, or `"test"`.
  - `baselineId`: `"B0"`, `"B1"`, `"B2"`, `"B3"`, or `"B4"`.
  - `estimator`: Algorithm name, version, and hyperparameters.
  - `metrics`: ROC AUC, F1 at threshold 0.5, log-loss, sample counts, and positive label prevalence.
  - `significance`: Confidence intervals and paired comparison $p$-values.
  - `verdict`: `"reproduced"`, `"candidate-better"`, `"no-evidence-of-improvement"`, `"candidate-worse"`, or `"invalid-run"`.

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
   - If $\Delta \text{AUC} \le 0$ or if the uplift is statistically indistinguishable from zero ($p > 0.05$), the Nếp state representation MUST NOT be promoted as superior to simple history counts; additional state complexity MUST be frozen.

---

## 3. Storage, Provenance & License Hygiene

- **License Classification (CC BY-NC 4.0)**:
  - The Duolingo SLAM 2018 dataset on Harvard Dataverse (`10.7910/DVN/8SWHNO`) is distributed under **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.
  - The dataset and any weights or models derived directly from it are strictly research-only assets and MUST NOT enter the production application, live database, or commercial API runtimes.
- **Raw Data Quarantine**: Raw SLAM datasets MUST reside strictly in `.cache/benchmarks/slam-2018/` (gitignored). Raw learner trace data MUST NEVER be committed to the repository or redistributed.
- **Provenance Integrity**: Every staged dataset file MUST match authoritative Harvard Dataverse SHA-256 checksums before harness execution, and terms MUST be independently verified at retrieval time.
- **Privacy Minimization**: Anonymized user identifiers (`user_id`) from the benchmark MUST NOT be cross-referenced with AtoEnglish production learner records.
