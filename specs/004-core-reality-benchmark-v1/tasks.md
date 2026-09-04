# Tasks: Reality Benchmark Harness V1

## Phase A — Spec / provenance closure

- [x] T001 Define claim boundary and B0-B4 hierarchy.
- [x] T002 Correct canonical track/result mapping (`en_es` English 0.774; `es_en` Spanish 0.746; `fr_en` French 0.771).
- [x] T003 Correct raw grammar: B64-style user IDs, pipe countries, fractional days, nullable/negative time, 7-vs-6 token columns.
- [x] T004 Define split/fit-phase label availability so TRAIN history is preserved during blind DEV/TEST passes.
- [x] T005 Define Pre-R2 compatibility/coverage audit and B3 `not-applicable` outcome.
- [x] T006 Define eligible-track-only B3 statistics and forbid cross-language claims when only one target-language-compatible track exists.
- [x] T007 Separate dataset license, starter artifact license, upstream checksum, local SHA-256, and Nếp quarantine policy.
- [x] T008 Define Dataverse file-ID resolution + Guestbook fail-closed staging.
- [x] T009 Replace pseudo-JCS with RFC 8785 package contract; drop custom DeLong from V1.
- [x] T010 Define historical starter nondeterminism audit before any modern sklearn reproduction lane.
- [ ] T011 Independent exact-head review PASS for Spec #004.

## Phase B — B0/B1/B2 implementation (unblocked after T011)

- [ ] T020 Create isolated `benchmarks/reality-slam-v1/` workspace from the then-current frontier and record exact base SHA.
- [ ] T021 Add `.cache/benchmarks/` quarantine guard and automated tracked-file check.
- [ ] T022 Implement Dataverse metadata resolver/validator; do not bypass Guestbook requirements.
- [ ] T023 Stage/fingerprint official starter artifact after legitimate access acceptance; record source license as unverified unless artifact proves otherwise.
- [ ] T024 Implement R0 runner that records repeated unmodified oracle runs, runtime, metrics, and compatibility patches.
- [ ] T025 Implement source-faithful streaming parser + fixtures (`+`/`/` user, pipe countries, fractional days, null/negative time, TRAIN/DEV rows).
- [ ] T026 Implement B0 prevalence baseline.
- [ ] T027 Implement B1 modern reproduction lane only after R0 oracle freeze.
- [ ] T028 Implement B2 dual-history causal features preserving TRAIN labels while masking current evaluation labels.
- [ ] T029 Add adversarial leakage tests: label inversion, future-row mutation, TRAIN-history preservation.
- [ ] T030 Implement AUC/F1@0.5/log-loss with vetted packages and report counts/prevalence/coverage.
- [ ] T031 Implement RFC 8785 manifest + SHA-256 integrity verification.
- [ ] T032 Emit baseline card and exact-head verification evidence.

## Phase C — Pre-R2 audit / B3 (blocked on #140)

- [ ] T040 Wait for #140 independent PASS + merge into frontier.
- [ ] T041 Rebase benchmark branch to new exact frontier SHA and rerun all Phase B gates.
- [ ] T042 Bind B3 bridge to exact final #137 exports.
- [ ] T043 Execute per-track compatibility audit; `es_en`/`fr_en` are ontology-language-ineligible in V1.
- [ ] T044 Freeze `nep.reality-derived-features.v1` formulas before evaluation.
- [ ] T045 If mapping is defensible, run common-predictor B3-vs-B2 ablation; otherwise emit `b3-not-applicable-on-slam` and activate #143.
- [ ] T046 Run paired cluster bootstrap by learner on eligible mapped track(s), report effect size/CI/coverage/eligibleTrackCount.
- [ ] T047 Record `candidate-better | no-evidence-of-improvement | candidate-worse | not-applicable` without mastery/efficacy language.

## Phase D — Optional B4

- [ ] T050 Audit a defensible skill mapping for `pyBKT==1.4.3`.
- [ ] T051 Run B4 only if T050 passes; otherwise record `not-applicable`.

No task in this spec authorizes UI work, production DB writes, deployment, data redistribution, or product promotion.