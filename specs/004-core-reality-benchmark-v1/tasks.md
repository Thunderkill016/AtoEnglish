# Tasks: Reality Benchmark Harness V1

**Input**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Status**: In Progress

---

## Phase 1: Setup & Spec Kit Formalization
- [x] T001: Initialize `specs/004-core-reality-benchmark-v1/` directory structure and create `spec.md`.
- [x] T002: Perform deep research on Duolingo SLAM 2018 dataset, terms, baseline metrics, and pyBKT in `research.md`.
- [x] T003: Formulate strongly typed data models in `data-model.md`.
- [x] T004: Establish immutable experiment contract in `contracts/benchmark-contract.md` and checklist in `checklists/requirements.md`.
- [x] T005: Formulate execution architecture in `plan.md` and `quickstart.md`.
- [x] T005a: Resolve Phase 1 review blockers from Review ID `5118045240` (P1 canonical #137 types, P1 SLAM 7-field prompt header & split-aware token schema & track metadata, P1 DEV oracle vs TEST Table-2 points, P1 SLAM -> Nếp mapping & pre-R2 compatibility audit, P1 reuse-first tooling in `benchmarks/reality-slam-v1/`, P1 reality-first scheduling rule, P2 quarantine policy vs license fact, P2 upstream vs local checksums, P2 complete ExperimentManifest schema, P2 RFC 8785 JCS, P2 paired cluster bootstrap by learner).

---

## Phase 2: Immediate Baseline & Infrastructure Implementation (Unblocked by Issue #141)
*Note: Per Issue #141 reality-first revision, B0/B1/B2 and harness infrastructure proceed immediately following Spec Kit convergence before PR #140 merges.*
- [ ] T006: Initialize isolated offline workspace `benchmarks/reality-slam-v1/` with pinned Python environment (`scikit-learn==1.6.1`, `scipy==1.15.2`, `pyBKT==1.4.3`).
- [ ] T007: Implement dataset staging and checksum verification script (`stage_dataset.sh`) in quarantined `.cache/benchmarks/slam-2018/`.
- [ ] T008: Implement streaming SLAM parser (`src/slam_parser.py`) supporting 7-field prompt headers and split-aware token lines.
- [ ] T009: Implement leakage-safe chronological state tracker (`src/history_features.py`) with split-aware evaluation label masking.
- [ ] T010: Implement official Python starter reproduction harness (`scripts/run_gate_r0.py`) against `dev.key`.
- [ ] T011: Implement Simple History Baseline B2 pipeline (`scripts/run_gate_r1.py`).
- [ ] T012: Implement paired cluster bootstrap by learner and secondary DeLong diagnostic (`src/cluster_bootstrap.py`, `src/delong.py`).
- [ ] T013: Implement canonical RFC 8785 JSON manifest emitter (`src/manifest.py`) with SHA-256 integrity fingerprint.

---

## Phase 3: Baseline Verification & Stage Gate Execution (Gates R0 & R1)
- [ ] T014: Implement and run unit, property, and adversarial leakage test suite proving zero feature delta on label inversion.
- [ ] T015: Gate R0: Reproduce official Duolingo baseline on `dev` against Python starter oracle within $\pm 0.005$ AUC across tracks.
- [ ] T016: Gate R1: Establish simple history baseline B2 benchmark score across tracks.

---

## Phase 4: Prerequisite Clearance on PR #140 (Constitutional Gate for B3)
- [ ] T017: Await independent review PASS and merge of PR #140 (`gemini/learner-evidence-state-v1`) into `frontier/nep-core-foundation-v1`.
- [ ] T018: Rebase the reality benchmark branch onto the updated frontier containing canonical `src/lib/core/learner-state.ts`.

---

## Phase 5: Nếp Representation Ablation & Comparators (Gates R2, R3, R4)
- [ ] T019: Execute Pre-R2 Compatibility & Coverage Audit: verify that only English track `en_es` maps to English ontology nodes; verify unobserved fields (`supportLevel`, `revealUsed`) are not fabricated; if unmappable without assumptions, report B3 not-applicable on SLAM.
- [ ] T020: Implement thin Node/TS state projection bridge (`bridge/nep_state_exporter.ts`) executing canonical #137 contract.
- [ ] T021: Gate R2: Execute Nếp state ablation B3 vs B2, run paired cluster bootstrap by learner (2,000 resamples), compute 95% CI, and evaluate uplift.
- [ ] T022: Gate R3: Evaluate pyBKT B4 where defensible.
- [ ] T023: Gate R4: Synthesize decision manifest (`reproduced`, `candidate-better`, etc.) and generate Markdown report card.

---

## Phase 6: Quality Gates & PR Handoff
- [ ] T024: Run full repository verification suite (`agent_verify.mjs`, `check:source-of-truth`, `tsc --noEmit`, `eslint`, full `npm test`, `npm run build`).
- [ ] T025: Commit, push to `gemini/core-reality-benchmark-spec-v1`, verify GitHub Actions CI, and submit Draft PR handoff addressing Review ID `5118045240`.
