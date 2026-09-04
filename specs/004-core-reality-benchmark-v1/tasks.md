# Tasks: Reality Benchmark Harness V1

**Input**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Status**: In Progress

---

## Phase 1: Setup & Spec Kit Formalization
- [x] T001: Initialize `specs/004-core-reality-benchmark-v1/` directory structure and create `spec.md`.
- [x] T002: Perform deep research on Duolingo SLAM 2018 dataset, terms, baseline metrics, and pyBKT in `research.md`.
- [x] T003: Formulate strongly typed data models in `data-model.md`.
- [x] T004: Establish immutable experiment contract in `contracts/benchmark-contract.md` and checklist in `checklists/requirements.md`.
- [x] T005: Formulate execution architecture in `plan.md` and `quickstart.md`.
- [x] T005a: Resolve Phase 1 review blockers from comment 5546135460 (CC BY-NC 4.0 license quarantine, canonical #137 B3 feature projection, TEST split label masking, published point values vs Nếp reproduction policy, and SHA-256 integrity fingerprint).

## Phase 2: Prerequisite Clearance on PR #140 (Constitutional Gate)
- [ ] T006: Address Review ID `5117203120` / directive `5117205515` (GEMINI-LEARNER-005) on PR #140 (`gemini/learner-evidence-state-v1`).
- [ ] T007: Obtain independent review PASS and merge PR #140 into `frontier/nep-core-foundation-v1`.
- [ ] T008: Fetch and lock the new exact frontier SHA as the base for `gemini/core-reality-benchmark-v1`.

## Phase 3: Core Harness Implementation
- [ ] T009: Implement streaming SLAM parser (`src/lib/reality-benchmark/slam-parser.ts`) with total error handling for CoNLL-U format.
- [ ] T010: Implement chronological state tracker (`src/lib/reality-benchmark/state-tracker.ts`) with strict causal time windowing ($t' < t$) and TEST split label masking.
- [ ] T011: Implement Baseline B1 starter feature pipeline (`src/lib/reality-benchmark/feature-extractors/b1-starter-features.ts`).
- [ ] T012: Implement Baseline B2 simple history feature pipeline (`src/lib/reality-benchmark/feature-extractors/b2-history-features.ts`).
- [ ] T013: Implement Baseline B3 Nếp learner-state feature pipeline (`src/lib/reality-benchmark/feature-extractors/b3-nep-features.ts`) strictly projecting canonical fields from merged #137 contract.
- [ ] T014: Implement Baseline B4 pyBKT comparator adapter (`src/lib/reality-benchmark/feature-extractors/b4-pybkt-features.ts`).
- [ ] T015: Implement estimator interface and L2 logistic regression estimator (`src/lib/reality-benchmark/estimators/logistic-estimator.ts`).
- [ ] T016: Implement metric evaluators for ROC AUC, DeLong significance test, and classification metrics (`src/lib/reality-benchmark/metrics/`).
- [ ] T017: Implement canonical RFC 8785 JSON manifest emitter and SHA-256 integrity fingerprint calculator (`src/lib/reality-benchmark/experiment-manifest.ts`).
- [ ] T018: Implement benchmark runner CLI coordinating Gates R0 through R4 (`src/lib/reality-benchmark/benchmark-runner.ts`).

## Phase 4: Verification & Stage Gate Execution
- [ ] T019: Implement unit, property, and adversarial leakage test suite (`src/lib/reality-benchmark/reality-benchmark.test.ts`) including adversarial TEST label masking verification.
- [ ] T020: Gate R0: Reproduce official Duolingo baseline B1 point targets (Settles et al., 2018: English `0.774`, Spanish `0.746`, French `0.771`) on `dev` split within Nếp reproduction policy ($\pm 0.005$ AUC).
- [ ] T021: Gate R1: Establish simple history baseline B2 benchmark score.
- [ ] T022: Gate R2: Execute Nếp state ablation B3 vs B2 and compute $\Delta \text{AUC}$ and DeLong $p$-value.
- [ ] T023: Gate R3: Evaluate pyBKT B4 where defensible.
- [ ] T024: Gate R4: Synthesize decision manifest (`reproduced`, `candidate-better`, etc.) and generate report card.

## Phase 5: Quality Gates & PR Handoff
- [ ] T025: Run full repository verification suite (`agent_verify.mjs`, `check:source-of-truth`, `tsc --noEmit`, `eslint`, full `npm test`, `npm run build`).
- [ ] T026: Commit, push to `gemini/core-reality-benchmark-v1`, verify GitHub Actions CI, and submit Draft PR handoff.
