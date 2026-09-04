# Requirements Checklist: Reality Benchmark Harness V1

- **Contract Identifier**: `nep.reality-benchmark.v1`.
- **Governing Purpose**: Reviewer-owned quality checklist for validating that implementation and results adhere to scientific, privacy, and constitutional requirements.

---

## 1. Methodological & Scientific Rigor

- [ ] **CH-001**: Strict chronological sequencing is enforced: no feature extraction inspects events at $t' \ge t$ or ground-truth labels at $t$.
- [ ] **CH-002**: TEST split label masking is strictly enforced: earlier TEST encounters ($t' < t_{\text{TEST}}$) MUST NOT update label-dependent history or state; only label-free encounter counts, lag times, and formats. Both B2 and B3 receive the exact same mask.
- [ ] **CH-003**: Adversarial tests prove that label inversion of earlier TEST events produces zero feature delta for subsequent TEST interactions.
- [ ] **CH-004**: Frozen split discipline is maintained: hyperparameter tuning and vocabulary building occur exclusively on `train` and `dev`; `test` split is evaluated strictly once.
- [ ] **CH-005**: Common predictor ablation (B3 vs B2) uses identical downstream estimator architectures, loss functions, regularization parameters, and random seeds.
- [ ] **CH-006**: Baseline B3 strictly evaluates canonical outputs from the merged #137 contract (`nep.learner-evidence-state.v1`): state status, epistemic/aleatoric/conflict uncertainty categories, nullable provisional routing score, evidence counts, support/reveal counts, durable/reference counts, transfer success/failure counts, and observation timestamps. FSRS, BKT, or external memory decay parameters MUST NOT be invented or smuggled inside B3.
- [ ] **CH-007**: Gate R0 targets historical published point values from Settles et al. (2018) for the official Duolingo baseline B1 on the `dev` split (`es_en` $\approx 0.774$, `en_es` $\approx 0.746$, `fr_en` $\approx 0.771$) within the Nếp reproduction policy ($\pm 0.005$ AUC on deterministic environment) before Nếp evaluation proceeds.
- [ ] **CH-008**: pyBKT baseline B4 is restricted to defensible lemma-level or grammatical construct mappings; unmapped tokens output `not-applicable` without semantic distortion.
- [ ] **CH-009**: Statistical significance for $\Delta \text{AUC} = \text{AUC}(B3) - \text{AUC}(B2)$ is calculated via DeLong test or paired bootstrap with two-sided $p$-values and 95% confidence intervals.

---

## 2. Epistemic & Constitutional Claim Boundaries

- [ ] **CH-010**: Benchmark results are explicitly disclaimed as proof of human learning efficacy, instructional effectiveness, or CEFR level advancement.
- [ ] **CH-011**: Benchmark reports explicitly note that Duolingo SLAM 2018 traces do not validate Vietnamese L1 phonological or syntactic interference patterns.
- [ ] **CH-012**: Benchmark observations and evidence remain strictly in Layer 0 / Layer 1 research space and do not grant `durable-assessment` authority or mutate live learner state.
- [ ] **CH-013**: If $\Delta \text{AUC} \le 0$ or $p \ge 0.05$, the outcome is classified as `no-evidence-of-improvement` or `candidate-worse`, and further learner-state complexity is frozen.

---

## 3. Data Governance, License Terms & Privacy Hygiene

- [ ] **CH-014**: Dataset licensing terms are strictly classified and verified: Harvard Dataverse DOI `10.7910/DVN/8SWHNO` is CC BY-NC 4.0 (Non-Commercial research only); `codeLicense: "MIT"`, `datasetLicense: "CC-BY-NC-4.0"`, `commercialUseAllowed: false`, `redistributionAllowed: false`.
- [ ] **CH-015**: Raw dataset archives and derived models are quarantined in `.cache/benchmarks/slam-2018/` (strictly gitignored) and MUST NOT enter production databases or commercial runtimes.
- [ ] **CH-016**: Staged dataset files match authoritative Harvard Dataverse SHA-256 checksums (`doi:10.7910/DVN/8SWHNO`).
- [ ] **CH-017**: Anonymized user IDs from the benchmark dataset are never correlated with or imported into AtoEnglish production learner databases.
- [ ] **CH-018**: Every execution run emits an immutable, canonical RFC 8785 JSON manifest with an authentic SHA-256 integrity fingerprint (unkeyed content digest).

---

## 4. Code Quality & Verification Gates

- [ ] **CH-019**: Parser, state tracker, feature extractors, metrics, and manifest generators are covered by focused unit and property tests.
- [ ] **CH-020**: Adversarial property tests prove fail-closed rejection of future event inspection and label leakage.
- [ ] **CH-021**: Streaming architecture keeps maximum heap memory usage $\le 1.5\text{ GB}$ during full-track execution.
- [ ] **CH-022**: Full repository verification passes: `agent_verify.mjs` (14/14), `check:source-of-truth`, `tsc --noEmit`, `eslint`, full `npm test`, `test:content-standard`, and production `build`.
