# Implementation Plan: Reality Benchmark Harness V1

- **Contract Identifier**: `nep.reality-benchmark.v1`.
- **Governing Purpose**: Define harness architecture, streaming data flow, estimator interfaces, metric calculation routines, and stage gate execution.

---

## 1. System Architecture & Component Flow

```text
[ Harvard Dataverse (.cache/benchmarks/slam-2018/) ]
                      │
                      ▼
            [ Streaming SLAM Parser ]
            (CoNLL-U lines + prompt metadata)
                      │
                      ▼
         [ Chronological State Tracker ]
      (Events at t' < t update past history)
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   [ B1 Extractor ] [ B2 Extractor ] [ B3 Extractor ]
   (Duolingo Feat) (Simple History)  (B2 + Nếp State)
        │             │             │
        └─────────────┼─────────────┘
                      ▼
         [ Symmetrical Estimator Adapter ]
     (Logistic Regression / Gradient Boosting)
                      │
                      ▼
     [ Evaluator & Significance Engine ]
     (ROC AUC, F1@0.5, Log-Loss, DeLong Test)
                      │
                      ▼
       [ Immutable Experiment Manifest ]
            (RFC 8785 JSON + SHA-256)
```

---

## 2. Source File Inventory & Boundaries

All benchmark harness components reside under an isolated subsystem to prevent benchmark dependencies from entering the core production runtime:

```text
src/lib/reality-benchmark/
├── types.ts                    # Strongly-typed schemas from data-model.md
├── slam-parser.ts              # Total streaming parser for prompt headers and token lines
├── state-tracker.ts            # Chronological sliding window and historical count tracker with TEST label masking
├── feature-extractors/
│   ├── b1-starter-features.ts  # Duolingo starter one-hot feature pipeline
│   ├── b2-history-features.ts  # Transparent recency & repetition feature pipeline
│   ├── b3-nep-features.ts      # B2 + canonical Nếp learner-state feature pipeline (Issue #137)
│   └── b4-pybkt-features.ts    # pyBKT comparator adapter
├── estimators/
│   ├── estimator-contract.ts   # Interface for training and predicting probability scores
│   └── logistic-estimator.ts   # L2-regularized logistic regression estimator
├── metrics/
│   ├── roc-auc.ts              # Exact non-parametric ROC AUC calculator
│   ├── delong-test.ts          # DeLong statistical test for comparing correlated ROC curves
│   └── classification.ts       # F1@0.5, cross-entropy log-loss, prevalence
├── experiment-manifest.ts      # Canonical RFC 8785 serialization and SHA-256 integrity fingerprint
├── benchmark-runner.ts         # Stage gate coordinator executing Gates R0 through R4
└── reality-benchmark.test.ts   # Unit, property, and adversarial leakage test suite
```

---

## 3. High-Performance Streaming, Memory Bounds & TEST Split Masking

The Duolingo SLAM 2018 corpus comprises ~7.2 million tokens across 3 language tracks:
- Loading the full dataset as in-memory JavaScript object graphs would consume 6–8 GB of RAM and trigger V8 heap exhaustion (`FATAL ERROR: Ineffective mark-compacts near heap limit`).
- **Design Invariant**: The harness MUST use Node.js streaming `readline` / transform pipelines:
  1. Stream exercise prompts chunk by chunk.
  2. Maintain a compact `Map<string, CompactUserHistory>` tracking user interaction counts and last timestamp.
  3. Extract features into typed numeric arrays (`Float32Array` or sparse CSR row buffers).
  4. Memory footprint MUST remain under 1.5 GB during full-track execution.
- **TEST Split Masking Invariant**: During TEST split evaluation, the chronological state tracker strictly masks all ground-truth error labels for preceding TEST events ($t' < t_{\text{TEST}}$). Prior TEST interactions update only label-free encounter counts, lag times, and prompt formats. Both B2 and B3 extractors receive the exact same masked information budget.

---

## 4. Stage Gate Execution Workflow

### Gate R0 — Official Baseline Reproduction
1. Verify terms and download `data_es_en.tar.gz`, `data_en_es.tar.gz`, and `data_fr_en.tar.gz` from Harvard Dataverse under CC BY-NC 4.0 into quarantined cache (`.cache/benchmarks/slam-2018/`). Verify archive SHA-256 checksums.
2. Train baseline B1 on `train` split and evaluate on `dev` split.
3. Compare against published point targets from Settles et al. (2018): English `0.774`, Spanish `0.746`, French `0.771`.
4. Assert that reproduced AUC falls within the Nếp reproduction policy ($\pm 0.005$ AUC on deterministic environment) for all 3 tracks. If failed, HALT.

### Gate R1 — Transparent Simple History Baseline
1. Extract B2 features (user error rate so far, token error rate so far, elapsed seconds since last encounter, prompt format, response time) under split-aware label masking.
2. Train B2 on `train` split and evaluate on `dev` split.
3. Record B2 benchmark score as the ablation reference.

### Gate R2 — Nếp State Representation Ablation
1. Feed past token evidence into `nep.learner-evidence-state.v1` canonical state projection logic.
2. Extract canonical Nếp state features: `stateStatus`, uncertainty categories (`epistemic`, `aleatoric`, `conflict`), nullable `provisionalRoutingScore`, `totalAcceptedEvents`, `supportCount`, `revealCount`, `supportRatio`, `durableEvidenceCount`, `referenceEvidenceCount`, `transferSuccessCount`, `transferFailureCount`, `transferSuccessRatio`, `secondsSinceFirstObserved`, `secondsSinceLastObserved`.
   - *Epistemic Invariant*: FSRS, BKT, or external memory decay parameters MUST NOT be invented or smuggled into B3; any such models belong strictly to separate comparators.
3. Form feature vector $[\mathbf{x}_{B2} \,\|\, \mathbf{x}_{\text{Nếp}}]$ and train B3 under the exact same estimator as B2.
4. Calculate $\Delta \text{AUC} = \text{AUC}(B3) - \text{AUC}(B2)$ and DeLong two-sided $p$-value.

### Gate R3 — pyBKT Comparator Evaluation
1. Audit skill mappings for lexical lemmas and grammatical constructs.
2. Run `CAHLR/pyBKT` forward step where mapped; output `not-applicable` for unmapped tokens.
3. Record B4 results alongside B2 and B3.

### Gate R4 — Decision Synthesis
- If $\Delta \text{AUC} > 0$ and $p < 0.05$ across tracks: mark `candidate-better` and recommend retaining Nếp state features.
- If $\Delta \text{AUC} \le 0$ or $p \ge 0.05$: mark `no-evidence-of-improvement` or `candidate-worse` and freeze learner-state expansion.
- Emit finalized `ExperimentManifest` with SHA-256 integrity fingerprint (content digest) and human-readable Markdown report.
