# Research: Reality Benchmark Harness V1

- **Contract Identifier**: `nep.reality-benchmark.v1`.
- **Governing Purpose**: Document empirical foundations, dataset provenance, official SLAM 2018 metrics, baseline tolerances, and methodological limits for evaluating `nep.learner-evidence-state.v1`.

---

## 1. Primary Sources & Citations

1. **Duolingo SLAM 2018 Shared Task**:
   - **Citation**: Settles, B., Brust, C., Gustafson, E., Hagiwara, M., & Madnani, N. (2018). *Second Language Acquisition Modeling*. In Proceedings of the Thirteenth Workshop on Innovative Use of NLP for Building Educational Applications (BEA13), pages 56–65, New Orleans, Louisiana. Association for Computational Linguistics.
   - **ACL Anthology**: [W18-0506](https://aclanthology.org/W18-0506/)
   - **DOI**: `10.18653/v1/W18-0506`
   - **Official Website**: `https://sharedtask.duolingo.com/2018.html`

2. **Dataset Accession & Harvard Dataverse Archive**:
   - **Repository**: Harvard Dataverse
   - **Persistent Identifier (DOI)**: [`doi:10.7910/DVN/8SWHNO`](https://doi.org/10.7910/DVN/8SWHNO)
   - **Dataset License**: **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.
   - **Provenance & Terms Separation**:
     * `codeLicense`: `MIT` (Starter code / benchmark scripts).
     * `datasetLicense`: `CC-BY-NC-4.0` (Harvard Dataverse release).
     * `commercialUseAllowed`: `false`.
     * `redistributionAllowed`: `false`.
   - **Storage & Quarantine Policy**:
     * Raw dataset archives are quarantined in untracked local cache (`.cache/benchmarks/slam-2018/`) and are never committed to Git.
     * The dataset and any artifacts directly derived from it are strictly research-only and MUST NOT be used in production runtime systems, live databases, or commercial feature services.
     * Staged files must match authoritative Harvard Dataverse SHA-256 checksums before execution; terms must be verified and recorded at retrieval time.

3. **Bayesian Knowledge Tracing (BKT)**:
   - **Citation**: Corbett, A. T., & Anderson, J. R. (1994). *Knowledge tracing: Modeling the acquisition of procedural knowledge*. User Modeling and User-Adapted Interaction, 4(4), 253–278.
   - **OSS Reference**: `CAHLR/pyBKT` (Bhatnagar et al., 2020), MIT License.

4. **Statistical AUC Comparison**:
   - **Citation**: DeLong, E. R., DeLong, D. M., & Clarke-Pearson, D. L. (1988). *Comparing the areas under two or more correlated receiver operating characteristic curves: a nonparametric approach*. Biometrics, 837–845.

---

## 2. Official SLAM 2018 Benchmark Metrics & Targets

The official competition benchmark reported on the held-out blind TEST split across 15 competing systems and the official Duolingo baseline:

### Official Results Summary (Settles et al., 2018, Table 2)

| System / Model | English (`es_en`) AUC | English F1 | Spanish (`en_es`) AUC | Spanish F1 | French (`fr_en`) AUC | French F1 | Avg Rank |
|---|---|---|---|---|---|---|---|
| **SanaLabs** (Osika et al.) | 0.861 | 0.561 | 0.838 | 0.530 | 0.857 | 0.573 | 1.0 |
| **singsound** (Xu et al.) | 0.861 | 0.559 | 0.835 | 0.524 | 0.854 | 0.569 | 1.7 |
| **NYU** (Rich et al.) | 0.859 | 0.468 | 0.835 | 0.420 | 0.854 | 0.493 | 2.3 |
| **TMU** (Kaneko et al.) | 0.848 | 0.476 | 0.824 | 0.439 | 0.839 | 0.502 | 4.3 |
| **Cambridge** (Yuan et al.) | 0.841 | 0.479 | 0.807 | 0.435 | 0.835 | 0.508 | 6.0 |
| **Official Logistic Baseline (`SLAM_baseline`)** | **0.774** | **0.190** | **0.746** | **0.175** | **0.771** | **0.281** | **14.7** |

### Reproduction Policy & Tolerance Definition
- The point values published by Settles et al. (2018) are point estimates on the test set:
  - `es_en`: $0.774$
  - `en_es`: $0.746$
  - `fr_en`: $0.771$
- The competition materials did **not** define an official tolerance. Any reproduction tolerance is an explicit **Nếp experiment-policy choice**.
- **Nếp Policy Target**:
  - Exact reproduction target: within $\pm 0.005$ AUC on deterministic runs under pinned scikit-learn / solver configurations.
  - If reproduction variance exceeds $\pm 0.005$, the discrepancy must be traced to exact solver convergence, L2 penalty weight, or feature discretization differences rather than excused by a broad narrative window.

---

## 3. Dataset Characteristics & Information Budget Discipline

The SLAM dataset captures learner exercise traces over their first 30 days on Duolingo:

```text
Track 1 (es_en): 2,593 learners | ~2.62M tokens | Native Spanish studying English
Track 2 (en_es): 2,593 learners | ~2.60M tokens | Native English studying Spanish
Track 3 (fr_en): 1,213 learners | ~1.97M tokens | Native French studying English
Total Tokens:    ~7.19M tokens
```

### Prompt Header Format
Each exercise prompt starts with `#` and provides 6 key-value pairs:
```text
# user:u:bkmM format:reverse_translate session:lesson time:12 client:web session_id:gXhJ
```
- `user`: Anonymized student identifier (tracks individual longitudinal learning).
- `format`: Exercise interaction mode (`reverse_translate`, `reverse_tap`, `listen`).
- `session`: Session context (`lesson`, `practice`, `test`).
- `time`: Response submission duration in seconds.
- `client`: Device platform (`web`, `ios`, `android`).
- `session_id`: Unique exercise instance identifier.

### TEST Split Information Budget Reconstruction
- In the original competition, participants received the TEST set **blind with zero labels**.
- Therefore, in sequential evaluation across the TEST split:
  1. True error labels for events in TEST are strictly withheld from state and history trackers.
  2. For a TEST event at index $k$, prior events in TEST ($k' < k$) can only increment **label-free encounter counters** and update **elapsed time** $\Delta t$.
  3. Preceding TEST events CANNOT update historical error counts, error rates, or state outcome tallies.
  4. Both B2 and B3 receive the exact same masked information budget.

---

## 4. Methodological Grounding of B3 Feature Family

### Canonical Nếp State Contract Alignment
`nep.learner-evidence-state.v1` under Issue #137 produces an ontology-bound, uncertainty-aware evidence ledger:
- It tracks: `stateStatus`, `uncertainty` (`epistemic`, `aleatoric`, `conflict`), `provisionalRoutingScore`, `totalAcceptedEvents`, `supportCount`, `revealCount`, `supportRatio`, `durableCount`, `referenceCount`, `transferSuccessCount`, `transferFailureCount`, `transferSuccessRatio`, and observation time horizons.
- It does **not** include FSRS parameters (stability $S$, retrievability $R$), IRT item difficulty ($\beta$), or BKT latent parameters.
- **Ablation Hygiene**: B3 must project strictly the fields present in the merged #137 contract. Smuggling external memory models into B3 would confound the experiment and invalidate the scientific question of whether the Nếp evidence-state representation itself adds value.

---

## 5. pyBKT Applicability & Semantic Mapping Limits

### The Fundamental Mismatch
Bayesian Knowledge Tracing (`Corbett & Anderson 1994`) models procedural skill mastery over an ordered sequence of discrete opportunities on a **single, specific skill**:
$$P(L_t) = P(L_{t-1} \mid \text{obs}_{t-1}) + (1 - P(L_{t-1} \mid \text{obs}_{t-1})) \cdot P(T)$$
$$P(\text{Correct}_t) = P(L_t)(1 - P(S)) + (1 - P(L_t))P(G)$$

In contrast, SLAM evaluates continuous natural language generation across heterogeneous syntactic contexts where tokens are observed simultaneously in a sentence.

### Defensible pyBKT Baseline Policy
1. **Lemma-Level Mapping**: pyBKT can only be evaluated where an explicit lexical construct mapping exists (e.g. tracking mastery of the top 500 high-frequency content lemmas).
2. **Grammatical Construct Mapping**: Alternatively, tracking specific Universal Dependencies morphosyntactic categories (e.g. `Number=Plur`, `Tense=Past`).
3. **No Semantic Forcing**: For tokens outside the defensible skill inventory (e.g. punctuation, rare tokens, unmapped tokens), the B4 baseline MUST output `not-applicable` rather than fabricating arbitrary skill parameters.
