# Requirements Checklist: Reality Benchmark Harness V1

- **Contract Identifier**: `nep.reality-benchmark.v1`.
- **Governing Purpose**: Reviewer-owned quality checklist for validating that implementation and results adhere to scientific, privacy, and constitutional requirements.

---

## 1. Methodological & Scientific Rigor

- [ ] **CH-001**: Strict chronological sequencing is enforced: no feature extraction inspects events at $t' \ge t$ or ground-truth labels at $t$.
- [ ] **CH-002**: Split-aware evaluation label masking is strictly enforced: while predicting on `dev` or `test`, earlier evaluation events ($t' < t_{\text{eval}}$) MUST NOT update label-dependent history or state; only label-free encounter counts, lag times, and formats. Both B2 and B3 receive the exact same mask. Gold `.key` labels are used solely for offline scoring.
- [ ] **CH-003**: Adversarial tests prove that label inversion of earlier evaluation split events produces zero feature delta for subsequent interactions.
- [ ] **CH-004**: Frozen split discipline is maintained: hyperparameter tuning and vocabulary building occur exclusively on `train` and `dev`; `test` split is evaluated strictly once.
- [ ] **CH-005**: Common predictor ablation (B3 vs B2) uses identical downstream estimator architectures, loss functions, regularization parameters, and random seeds.
- [ ] **CH-006**: Baseline B3 strictly evaluates canonical outputs from the merged #137 contract (`nep.learner-evidence-state.v1`): `status: ConstructEvidenceSufficiency`, `uncertainty: ConstructUncertaintyLevel`, nullable `provisionalRoutingScore`, and `statistics: ConstructSufficientStatistics`, with versioned derived numeric features (`nep.reality-derived-features.v1`). FSRS, BKT, or external memory decay parameters MUST NOT be invented or smuggled inside B3.
- [ ] **CH-007**: Gate R0 targets reproducing the official competition Python starter code oracle on the `dev` split against `dev.key` within the Nếp reproduction policy ($\pm 0.005$ AUC) before Nếp evaluation proceeds. Published Table 2 numbers (Settles et al., 2018: English `0.774`, Spanish `0.746`, French `0.771`) are on the TEST split and may only be evaluated on `test` after model/protocol freeze.
- [ ] **CH-008**: pyBKT baseline B4 is restricted to defensible lemma-level or grammatical construct mappings; unmapped tokens output `not-applicable` without semantic distortion.
- [ ] **CH-009**: Statistical significance for $\Delta \text{AUC} = \text{AUC}(B3) - \text{AUC}(B2)$ uses **paired cluster bootstrap by learner** (2,000 resamples) as the primary procedure, reporting effect size, 95% bootstrap confidence intervals, and per-track consistency. Token-level DeLong test is retained as a secondary diagnostic. Promotion decisions are not based on $p < 0.05$ alone.
- [ ] **CH-010**: Pre-R2 Compatibility & Coverage Audit is executed: only English track `en_es` maps to English ontology nodes; `es_en` and `fr_en` remain `unmapped / not-applicable`. Unavailable fields (`supportLevel`, `revealUsed`) are not fabricated. If sufficient canonical evidence cannot be constructed without assumptions, report **B3 not-applicable on SLAM** and use SLAM only for B0/B1/B2 rather than distorting the learner-state contract.

---

## 2. Epistemic & Constitutional Claim Boundaries

- [ ] **CH-011**: Benchmark results are explicitly disclaimed as proof of human learning efficacy, instructional effectiveness, or CEFR level advancement.
- [ ] **CH-012**: Benchmark reports explicitly note that Duolingo SLAM 2018 traces do not validate Vietnamese L1 phonological or syntactic interference patterns.
- [ ] **CH-013**: Benchmark observations and evidence remain strictly in Layer 0 / Layer 1 research space and do not grant `durable-assessment` authority or mutate live learner state.
- [ ] **CH-014**: If $\Delta \text{AUC} \le 0$ or the 95% bootstrap confidence interval overlaps zero, the outcome is classified as `no-evidence-of-improvement` or `candidate-worse`, and further learner-state complexity is frozen.

---

## 3. Data Governance, License Terms & Privacy Hygiene

- [ ] **CH-015**: Dataset licensing terms are strictly classified and verified: Harvard Dataverse DOI `10.7910/DVN/8SWHNO` is CC BY-NC 4.0 (Non-Commercial research only); `codeLicense: "MIT"`, `datasetLicense: "CC-BY-NC-4.0"`, `commercialUseAllowed: false`. `redistributionAllowed: false` is classified as **Nếp project quarantine policy** (not statutory CC BY-NC 4.0 restriction).
- [ ] **CH-016**: Raw dataset archives and derived models are quarantined in `.cache/benchmarks/slam-2018/` (strictly gitignored) and MUST NOT enter production databases or commercial runtimes.
- [ ] **CH-017**: Upstream repository checksums (`upstreamChecksumType` and `upstreamChecksumValue`) are stored separately from locally computed `localSha256Fingerprint`.
- [ ] **CH-018**: Anonymized user IDs from the benchmark dataset are never correlated with or imported into AtoEnglish production learner databases.
- [ ] **CH-019**: Every execution run emits an immutable, canonical RFC 8785 JSON manifest with an authentic SHA-256 integrity fingerprint (unkeyed content digest).

---

## 4. Code Quality & Verification Gates

- [ ] **CH-020**: Harness follows reuse-first acceleration policy (#138): uses official starter Python oracle, pinned `scikit-learn` (v1.6.1) / `scipy` (v1.15.2) / `pyBKT` (v1.4.3), located in isolated workspace `benchmarks/reality-slam-v1/`, not in production `src/lib/`.
- [ ] **CH-021**: Scheduling invariant (Issue #141 reality-first rule): B0/B1/B2 and benchmark infrastructure proceed immediately following Spec Kit convergence before PR #140 merges; Gate R2 (B3) strictly awaits PR #140 merge into frontier and rebase.
- [ ] **CH-022**: Streaming architecture keeps maximum resident memory (RSS) $\le 1.5\text{ GB}$ during full-track execution.
- [ ] **CH-023**: Full repository verification passes: `agent_verify.mjs` (14/14), `check:source-of-truth`, `tsc --noEmit`, `eslint`, full `npm test`, `test:content-standard`, and production `build`.
