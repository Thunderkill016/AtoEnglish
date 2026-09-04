# Implementation Plan: Reality Benchmark Harness V1

- **Contract Identifier**: `nep.reality-benchmark.v1`.
- **Governing Purpose**: Define reuse-first harness architecture, isolated offline workspace, streaming parser pipeline, split-aware label masking, canonical #137 bridge, paired cluster bootstrap, and stage gate workflows.

---

## 1. System Architecture & Component Flow

```text
[ Harvard Dataverse (.cache/benchmarks/slam-2018/) ]
                      │
                      ▼
        [ Streaming SLAM Parser (Python) ]
  (7-field prompt headers + split-aware token lines)
                      │
                      ▼
       [ Chronological State Tracker (Python) ]
  (Strict causal history t' < t + split label masking)
                      │
         ┌────────────┼────────────┐
         ▼            ▼            ▼
   [ B1 Extractor ] [ B2 Extractor ] [ B3 Extractor ]
   (Duolingo Feat) (Simple History)  (B2 + Nếp Bridge)
         │            │            │
         │            │            ▼
         │            │     [ Node/TS Bridge ]
         │            │  (src/lib/core/learner-state.ts)
         │            │            │
         └────────────┼────────────┘
                      ▼
     [ Reused Estimator (scikit-learn 1.6.1) ]
       (L2-regularized Logistic Regression)
                      │
                      ▼
   [ Clustered Significance Engine (scipy 1.15.2) ]
 (Paired cluster bootstrap by learner + secondary DeLong)
                      │
                      ▼
     [ Immutable Experiment Manifest (RFC 8785) ]
         (SHA-256 integrity fingerprint)
```

---

## 2. Isolated Workspace Inventory (Reuse-First Architecture)

In accordance with Issue #138 and repository guidelines, benchmark dependencies and research machinery do NOT enter production `src/lib/`. All harness components reside in an isolated offline benchmark workspace:

```text
benchmarks/reality-slam-v1/
├── README.md                    # Benchmark execution guide and provenance record
├── requirements.txt             # Pinned: scikit-learn==1.6.1, scipy==1.15.2, pyBKT==1.4.3
├── pyproject.toml               # Python project configuration
├── oracle/
│   ├── duolingo_baseline.py     # Official competition Python starter code reproduction oracle
│   └── evaluate.py              # Official SLAM 2018 evaluation script
├── scripts/
│   ├── stage_dataset.sh         # Dataset retrieval and checksum verification in .cache/benchmarks/slam-2018/
│   ├── run_gate_r0.py           # Gate R0: DEV oracle baseline reproduction against dev.key
│   ├── run_gate_r1.py           # Gate R1: Simple history baseline B2
│   ├── run_gate_r2.py           # Gate R2: Nếp representation ablation B3 vs B2
│   ├── run_gate_r3.py           # Gate R3: pyBKT comparator B4
│   └── run_gate_r4.py           # Gate R4: Decision synthesis and manifest emission
├── src/
│   ├── slam_parser.py           # Streaming parser for 7-field prompt header and split-aware token lines
│   ├── history_features.py      # Leakage-safe chronological history feature extraction with split masking
│   ├── compatibility_audit.py   # Pre-R2 compatibility & coverage audit for ontology mapping
│   ├── cluster_bootstrap.py     # Paired cluster bootstrap by learner (2,000 resamples)
│   ├── delong.py                # Token-level DeLong test (secondary diagnostic)
│   └── manifest.py              # Canonical RFC 8785 JSON manifest emitter with SHA-256 fingerprint
└── bridge/
    └── nep_state_exporter.ts    # Thin Node/TS script executing canonical #137 state projection for B3
```

---

## 3. High-Performance Streaming, Memory Bounds & Split Masking

The Duolingo SLAM 2018 corpus comprises ~7.2 million tokens across 3 language tracks:
- **Streaming Pipeline**: The parser reads prompt headers and token lines in chunks, maintaining compact hash maps for user history. Maximum resident memory (RSS) MUST remain $\le 1.5\text{ GB}$ during full-track execution.
- **Header Parsing Fidelity**: Parses the 7 key-value pairs (`user`, `countries`, `days`, `client`, `session`, `format`, `time`). Null response times and negative response times (known logging errors) are treated as missing (`null`).
- **Split-Aware Evaluation Masking**:
  * During sequential processing of `dev` or `test` evaluation splits, earlier evaluation split events ($t' < t_{\text{eval}}$) update ONLY label-free encounter counts, lag times, and formats.
  * Gold error labels from `.key` files are withheld until all predictions are emitted, preventing online label feedback.
  * An automated adversarial test validates that inverting earlier evaluation split labels causes zero feature delta for subsequent events.

---

## 4. Stage Gate Execution Workflow

### Gate R0 — Official Baseline Reproduction
1. Stage datasets from Harvard Dataverse into `.cache/benchmarks/slam-2018/` and verify checksums against Dataverse metadata.
2. Train the official Duolingo baseline on `train` split and generate predictions on `dev` split.
3. Score against `dev.key` using the official evaluation script oracle.
4. Assert that the reproduced baseline on `dev` matches the official Python starter oracle within the Nếp deterministic reproduction policy ($\pm 0.005$ AUC) for all 3 tracks. If failed, HALT.
5. (Verification against published Table 2 TEST points: English `0.774`, Spanish `0.746`, French `0.771` occurs in a distinct post-freeze evaluation phase on `test` against `test.key`).

### Gate R1 — Transparent Simple History Baseline
1. Extract B2 features (user error rate so far, token error rate so far, elapsed seconds since last encounter, prompt format, response time) under split-aware label masking.
2. Train B2 on `train` split and evaluate on `dev` split.
3. Record B2 benchmark score as the common predictor ablation reference.

### Gate R2 — Pre-R2 Audit & Nếp State Representation Ablation
1. **Pre-R2 Compatibility & Coverage Audit**:
   - Audit ontology mapping: only English track `en_es` can map to AtoEnglish English ontology nodes. Tracks `es_en` and `fr_en` remain `unmapped / not-applicable`.
   - Audit field availability: verify that unobserved SLAM fields (`supportLevel`, `revealUsed`) are not fabricated.
   - If sufficient canonical evidence cannot be constructed without unfounded assumptions, report **B3 not-applicable on SLAM** and use SLAM only for B0/B1/B2 rather than distorting the learner-state contract.
2. **Feature Projection & Estimator Fitting**:
   - For mapped events, execute thin Node/TS bridge to run canonical `src/lib/core/learner-state.ts` state projection (`nep.learner-evidence-state.v1`).
   - Project canonical state fields and versioned derived numerical features (`nep.reality-derived-features.v1`).
   - Form feature vector $[\mathbf{x}_{B2} \,\|\, \mathbf{x}_{\text{Nếp}}]$ and train B3 under the exact same estimator and hyperparameters as B2.
3. **Statistical Significance Testing**:
   - Perform paired cluster bootstrap by learner (2,000 resamples) to compute the distribution and 95% confidence interval of $\Delta \text{AUC} = \text{AUC}(B3) - \text{AUC}(B2)$.
   - Compute token-level DeLong test as a secondary diagnostic.

### Gate R3 — pyBKT Comparator Evaluation
1. Audit skill mappings for lexical lemmas and grammatical constructs.
2. Run `CAHLR/pyBKT` forward step where mapped; output `not-applicable` for unmapped tokens.
3. Record B4 results alongside B2 and B3.

### Gate R4 — Decision Synthesis
- If $\Delta \text{AUC} > 0$ with 95% bootstrap confidence interval strictly above zero and per-track consistency: mark `candidate-better` and recommend retaining Nếp state features.
- If $\Delta \text{AUC} \le 0$ or confidence interval overlaps zero: mark `no-evidence-of-improvement` or `candidate-worse` and freeze learner-state expansion.
- Emit finalized `ExperimentManifest` with SHA-256 integrity fingerprint (content digest) and human-readable Markdown report.

---

## 5. Scheduling & Dependency Protocol (Issue #141 Reality-First Rule)

- **Independent Parallel Work**:
  * Following Spec Kit #004 approval, implementation of **B0, B1, B2, dataset staging, parser, and benchmark infrastructure in `benchmarks/reality-slam-v1/` begins immediately on a dedicated benchmark branch from the current frontier before PR #140 merges**.
  * Baselines B0/B1/B2 must not import or assume unfinished learner-state semantics.
- **B3 Dependency Gate**:
  * **Gate R2 (Baseline B3) remains strictly blocked until PR #140 achieves independent review PASS, merges into `frontier/nep-core-foundation-v1`, and the benchmark branch is rebased onto the resulting frontier**.
  * B3 must execute strictly against the final merged `src/lib/core/learner-state.ts` contract.
