# Research: Reality Benchmark Harness V1

- **Contract Identifier**: `nep.reality-benchmark.v1`.
- **Governing Purpose**: Document empirical foundations, dataset provenance, official SLAM 2018 metrics, baseline tolerances, and methodological limits for evaluating `nep.learner-evidence-state.v1`.

---

## 1. Primary Sources & Citations

1. **Duolingo SLAM 2018 Shared Task**:
   - **Citation**: Settles, B., Brust, C., Gustafson, E., Hagiwara, M., & Madnani, N. (2018). *Second Language Acquisition Modeling*. In Proceedings of the Thirteenth Workshop on Innovative Use of NLP for Building Educational Applications (BEA13), pages 56–65, New Orleans, Louisiana. Association for Computational Linguistics.
   - **ACL Anthology**: [W18-0506](https://aclanthology.org/W18-0506/)
   - **DOI**: `10.18653/v1/W18-0506`
   - **Official Website & Starter Code**: `https://sharedtask.duolingo.com/2018.html`

2. **Dataset Accession & Harvard Dataverse Archive**:
   - **Repository**: Harvard Dataverse
   - **Persistent Identifier (DOI)**: [`doi:10.7910/DVN/8SWHNO`](https://doi.org/10.7910/DVN/8SWHNO)
   - **Dataset License**: **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.
   - **Terms & Quarantine Classification**:
     * `codeLicense`: `MIT` (Official starter code and evaluation scripts).
     * `datasetLicense`: `CC-BY-NC-4.0` (Harvard Dataverse release).
     * `commercialUseAllowed`: `false` (Non-commercial license requirement).
     * `redistributionAllowed`: `false` (**Nếp project quarantine policy**; CC BY-NC 4.0 allows non-commercial redistribution with attribution, but Nếp policy forbids repository check-in or redistribution of raw learner traces).
   - **Checksum & Provenance Discipline**:
     * Upstream checksums from repository metadata (`upstreamChecksumType` and `upstreamChecksumValue`) must be recorded separately from locally computed `localSha256Fingerprint`.
     * Raw dataset archives are quarantined in untracked local cache (`.cache/benchmarks/slam-2018/`) and never committed to Git.
     * The dataset and directly derived model artifacts are strictly research-only and MUST NOT enter production runtimes, live databases, or commercial feature services.

3. **Bayesian Knowledge Tracing (BKT)**:
   - **Citation**: Corbett, A. T., & Anderson, J. R. (1994). *Knowledge tracing: Modeling the acquisition of procedural knowledge*. User Modeling and User-Adapted Interaction, 4(4), 253–278.
   - **OSS Reference**: `CAHLR/pyBKT` (Bhatnagar et al., 2020), MIT License, pinned version `1.4.3`.

4. **Statistical Evaluation & Clustered Uncertainty**:
   - **Primary Longitudinal Procedure (Paired Cluster Bootstrap by Learner)**:
     * Davison, A. C., & Hinkley, D. V. (1997). *Bootstrap Methods and their Application*. Cambridge University Press.
     * Because multiple token responses are generated longitudinally by the same learner, observations within a learner are correlated. The primary statistical significance procedure is a **paired cluster bootstrap by learner** (e.g. 2,000 resamples clustered by learner ID) to estimate the empirical distribution and 95% confidence interval of $\Delta \text{AUC} = \text{AUC}(B3) - \text{AUC}(B2)$.
   - **Secondary Diagnostic (Token-Level DeLong Test)**:
     * DeLong, E. R., DeLong, D. M., & Clarke-Pearson, D. L. (1988). *Comparing the areas under two or more correlated receiver operating characteristic curves: a nonparametric approach*. Biometrics, 837–845. Token-level DeLong test is retained as a fast secondary diagnostic but does not replace cluster bootstrap.

---

## 2. Official SLAM 2018 Benchmark Metrics & Targets

### Official Published Results (Settles et al., 2018, Table 2)
The points published by Settles et al. (2018) in Table 2 are evaluated on the held-out blind **TEST** split across 15 competing systems and the official Duolingo baseline:

| System / Model | English (`es_en`) AUC | English F1 | Spanish (`en_es`) AUC | Spanish F1 | French (`fr_en`) AUC | French F1 | Avg Rank |
|---|---|---|---|---|---|---|---|
| **SanaLabs** (Osika et al.) | 0.861 | 0.561 | 0.838 | 0.530 | 0.857 | 0.573 | 1.0 |
| **singsound** (Xu et al.) | 0.861 | 0.559 | 0.835 | 0.524 | 0.854 | 0.569 | 1.7 |
| **NYU** (Rich et al.) | 0.859 | 0.468 | 0.835 | 0.420 | 0.854 | 0.493 | 2.3 |
| **TMU** (Kaneko et al.) | 0.848 | 0.476 | 0.824 | 0.439 | 0.839 | 0.502 | 4.3 |
| **Cambridge** (Yuan et al.) | 0.841 | 0.479 | 0.807 | 0.435 | 0.835 | 0.508 | 6.0 |
| **Official Logistic Baseline (`SLAM_baseline`)** | **0.774** | **0.190** | **0.746** | **0.175** | **0.771** | **0.281** | **14.7** |

### Gate R0: DEV Oracle Baseline Reproduction Target
- **Critical Methodological Separation**:
  * The published Table 2 numbers (`es_en`: $0.774$, `en_es`: $0.746$, `fr_en`: $0.771$) are on the **TEST** split.
  * Requiring the baseline to hit published TEST numbers on the `dev` split is invalid.
  * **Gate R0 Protocol**: The official competition Python starter code (`baseline.py` / `evaluation.py`) serves as the reproduction oracle. Gate R0 trains the official baseline on `train`, generates predictions on `dev`, scores against the official `dev.key` file, and records the actual empirical DEV oracle metrics.
  * Reproduction tolerance: The Nếp reproduction policy requires the reproduced baseline to match the official Python starter oracle on `dev` within $\pm 0.005$ AUC under identical feature extraction and solver configuration.
  * Verification on TEST points occurs strictly after model/protocol freeze in a dedicated post-selection evaluation phase using the post-workshop TEST key.

---

## 3. Dataset Characteristics & Information Budget Discipline

The SLAM dataset captures learner exercise traces over their first 30 days on Duolingo (Settles et al., 2018, Table 1):

```text
Track 1 (en_es): 2,593 learners | ~2.60M tokens | English learners who already speak Spanish (L1 Spanish, Target English)
Track 2 (es_en): 2,643 learners | ~2.62M tokens | Spanish learners who already speak English (L1 English, Target Spanish)
Track 3 (fr_en): 1,213 learners | ~1.97M tokens | French learners who already speak English (L1 English, Target French)
Total Tokens:    ~7.19M tokens
```

### Ontological Alignment Boundary for Nếp
- AtoEnglish's ontology is an **English** domain ontology.
- Therefore, **only `en_es` (where learners are acquiring English) can map to English ontology nodes**.
- The `es_en` (target: Spanish) and `fr_en` (target: French) tracks target non-English languages; they have no corresponding English ontology nodes and MUST remain strictly `unmapped / not-applicable` for Nếp construct projection.

### Raw Prompt Header Format
Each exercise prompt in the raw data files begins with a metadata line prefixed by `#` containing 7 key-value pairs:
```text
# user:u:bkmM countries:US,MX days:1 client:web session:lesson format:reverse_translate time:12
```
- `user`: Anonymized student identifier (e.g. `u:bkmM`).
- `countries`: Learner country code list (e.g. `US`, `MX`).
- `days`: Integer days since starting on Duolingo.
- `client`: Device platform (`web`, `ios`, `android`).
- `session`: Session context (`lesson`, `practice`, `test`).
- `format`: Exercise interaction mode (`reverse_translate`, `reverse_tap`, `listen`).
- `time`: Response duration in seconds. Note: `time` can be `null` or missing, and negative values are documented logging anomalies that must be treated as missing/invalid (`null`).
- *Note*: There is NO separate `session_id` header field in the primary source.

### Raw Token Lines & Split-Aware Label Availability
- In the `train` split, token lines contain 7 whitespace-separated fields:
  `tokenId token pos morphology depEdge depHead label`
- In raw `dev` and `test` evaluation input files, token lines contain 6 fields (**omitting `label`**). The ground-truth binary error labels are distributed in separate `.key` files (`dev.key`, `test.key`).
- **Single-Pass Prediction Without Online Labels**:
  * During sequential DEV evaluation, earlier DEV events ($t' < t_{\text{DEV}}$) update only label-free encounter counts, lag times, and formats. The `dev.key` is used exclusively for batch scoring after all DEV predictions are emitted.
  * For final TEST, labels remain fully masked during prediction.
  * If DEV is subsequently folded into training data for final TEST fitting, that must be modeled as a distinct, separate fit phase (`fitPhase: "train-plus-dev"`).

---

## 4. Methodological Grounding of B3 Feature Family

### Canonical Nếp State Contract Alignment
`nep.learner-evidence-state.v1` under Issue #137 produces an ontology-bound, uncertainty-aware evidence ledger:
- **Canonical Output Types** (from `src/lib/core/learner-state.ts`):
  * `status`: `ConstructEvidenceSufficiency` (`"unknown" | "insufficient-support" | "provisional-support" | "provisional-weakness" | "conflicted-support"`).
  * `uncertainty`: `ConstructUncertaintyLevel` (`"maximal" | "high" | "moderate" | "low"`).
  * `provisionalRoutingScore`: `number | null` (in $[0, 1]$ or `null` if evidence is insufficient).
  * `decisionScope`: `"routing-only"`.
  * `statistics`: `ConstructSufficientStatistics` (`totalEvents`, `positiveCount`, `negativeCount`, `conflictedCount`, `distinctContextCount`, `transfer`, `supportDistribution`, `revealUsedCount`, `durableEvidenceCount`, `referenceEvidenceCount`, `firstObservedAt`, `lastObservedAt`).
- **Derived Feature Hygiene**:
  * Any derived one-hot indicators, ratios, or lag features must be assigned a unique `derivedFeatureId` (e.g. `nep.reality-derived-features.v1`), with frozen formulas and explicit source fields. They must never be conflated with canonical state fields.
- **External Model Exclusion**:
  * FSRS parameters ($S$, $R$), IRT item difficulty ($\beta$), or BKT parameters are not part of `nep.learner-evidence-state.v1` and must not be smuggled into B3.

### Defensible SLAM → Nếp Evidence Mapping & Pre-R2 Compatibility Audit
Raw SLAM tokens are not `CoreEvidenceForRouting` records. Nếp requires:
- `targetId`: Must match an ontology node ID in `OntologyGraph`. (Only possible for English track `en_es`).
- `activity`: `CommunicationActivity` (must be a valid member of `COMMUNICATION_ACTIVITIES`).
- `responseModality`: `ResponseModality` (`"text" | "speech" | "choice" | "gesture" | "none"`).
- `role`: `CoreEvidenceRole` (`"direct-production" | "guided-practice" | "receptive-recognition" | ...`).
- `supportLevel`: Scaffolding support level (unavailable in SLAM; must not be fabricated).
- `revealUsed`: Hint/solution reveal (unavailable in SLAM; must not be fabricated).
- `transferDistance`: `"same-context" | "near-transfer" | "far-transfer"`.

**Pre-R2 Compatibility Audit Gate**:
A formal compatibility audit must be performed before executing Gate R2. If SLAM observables cannot be mapped to canonical Nếp evidence fields without unfounded assumptions, the harness MUST report **B3 not-applicable on SLAM** and use SLAM only for B0/B1/B2 rather than distorting the learner-state contract.

---

## 5. Reuse-First Acceleration Architecture (#138)

In accordance with Issue #138 and the repository reuse-first policy:
1. **No Greenfield Commodity Re-implementation**: Do not write custom TypeScript logistic regression solvers, ROC-AUC calculators, DeLong test implementations, or BKT solvers.
2. **Offline Benchmark Workspace**: The benchmark environment is located in `benchmarks/reality-slam-v1/`, completely isolated from production `src/lib/`.
3. **Pinned Standard Tooling**:
   - Official competition Python starter scripts as reproduction oracle.
   - Pinned Python virtual environment (`scikit-learn==1.6.1`, `scipy==1.15.2`) for estimator fitting and metric calculations.
   - Pinned `CAHLR/pyBKT==1.4.3` for optional BKT comparison where skill mappings are defensible.
   - A thin Node/TypeScript bridge is used solely to execute the canonical `nep.learner-evidence-state.v1` projection logic for B3.
