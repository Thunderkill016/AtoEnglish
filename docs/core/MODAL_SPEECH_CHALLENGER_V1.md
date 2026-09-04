# MODAL-SPEECH-001: Speech Challenger Runtime & Benchmark Harness (V1)

## 1. Executive Summary & Epistemic Boundary

This subsystem introduces a model-neutral core contract with a Modal-specific execution adapter for speech intelligence challengers. It boots the self-hosted **OpenPronounce v0.3.0** baseline (from PR #105) purely as an execution baseline without granting it any authority over learner mastery.

### Core Invariant
```text
audio/input -> model adapter -> typed diagnostic observation -> benchmark record
```
**NEVER**:
```text
model score -> learner mastery
```

- **Pluggable Challenger Provider**: All model interactions are mediated by the abstract `SpeechChallengerProvider`. New challengers (GOPT, WavLM, fine-tuned CTC) plug in directly without touching Nếp Core contracts.
- **Strict Epistemic Isolation**: Observations enter Nếp with `authority: "none"` and `validationState: "shadow"`. They cannot affect durable assessments (`canAffectDurableAssessment -> false`) or mastery progression (`canBecomeMasteryCandidate -> false`).
- **Privacy & Ephemerality**: Raw audio is deleted immediately in `finally` blocks; raw ASR transcriptions and 0–100 scores are stripped before reaching observation boundaries or benchmark records.
- **Bounded Run Provenance**: Results record runtime/package configuration identity and a dataset manifest containing exact audio hashes. Exact checkpoint-byte identity remains unresolved and is never represented as a weights hash.

---

## 2. Review Questions & Architectural Answers

### 1. Can the same benchmark contract run a second model without changing core semantics?
**Yes.**
The contract is defined by `SpeechChallengerProvider(ABC)` in [`services/speech-challenger-modal/challenger_contract.py`](../../services/speech-challenger-modal/challenger_contract.py). A second challenger (e.g. `MockChallengerProvider`, GOPT, or WavLM) implements:
- `name`
- `version`
- `get_model_fingerprint()`
- `get_runtime_fingerprint()`
- `analyze(audio_bytes, target_text, content_type)`

Both the benchmark runner [`scripts/run-speech-benchmark.py`](../../scripts/run-speech-benchmark.py) and Nếp TypeScript bridge [`src/lib/core/speech-challenger-contract.ts`](../../src/lib/core/speech-challenger-contract.ts) interact exclusively with this abstract contract. Nếp Core types (`CoreObservation`, `AcousticDiagnosticPayload`) contain zero vendor or Modal identifiers.

### 2. Does any raw provider/model score leak across the core observation boundary?
**No.**
Sanitization is enforced at two distinct boundaries:
1. **Python Layer** (`sanitize_openpronounce_raw` in `challenger_contract.py`): Explicitly discards upstream `score`, `candidate_score`, `transcribe`, `expected_vector`, `transcribed_vector`, `feedback` prose, and raw GOP vectors. Only bounded acoustic distance, PER, WER, word errors, and prosody summaries are forwarded.
2. **TypeScript Core Layer** (`validateChallengerDiagnosticIntegrity` in `speech-challenger-contract.ts`): Rejects any payload containing `score`, `candidate_score`, `transcribe`, or raw vector fields.

### 3. Are model/runtime/data fingerprints sufficient to reproduce a run?
**Partially.**
Each benchmark run records:
- `model_fingerprint`: package/version/configuration identity, with `fingerprint_scope=package-configuration-only` and `checkpoint_sha256=null` until exact resolved checkpoint bytes are hashed;
- `runtime_fingerprint`: execution runtime, Python version, hardware tier, platform, resolved key dependency versions and the exact mounted challenger-code hash;
- `dataset_fingerprint`: SHA-256 over a canonical manifest that includes each case and the SHA-256 of its exact audio bytes.

This is sufficient to identify the observed run inputs at the current boundary, but dependency ranges and unresolved upstream checkpoint cache identity prevent a bit-for-bit reproducibility claim.

### 4. Is audio ephemeral and are transcripts absent from persisted artifacts/logs?
**Yes.**
- Audio files are stored strictly in temporary files and unlinked immediately in `finally` blocks during `OpenPronounceBaselineProvider.analyze()` and `app.py`.
- Benchmark records written to `benchmarks/runs/` contain only target text, case ID, fingerprints, latency, and bounded diagnostic metrics. Raw learner audio and raw ASR transcripts are never persisted.

### 5. Does failure remain `unknown/unavailable` rather than becoming zero skill?
**Yes.**
When an error occurs (such as invalid audio or timeout), the system returns `execution_status: "unavailable"` with `error_code: "..."` and null diagnostic metrics. An unavailable inference is rejected at the observation boundary. `evaluation_status` is separate and the runtime smoke always remains unevaluated for pronunciation quality.

### 6. What exact evidence is still missing before this model could become hint-only or assessment-candidate under PR #128 promotion gates?
Per [`docs/core/BENCHMARK_PROMOTION_CONTRACT_V1.md`](./BENCHMARK_PROMOTION_CONTRACT_V1.md) and [`src/lib/core/experiments.ts`](../../src/lib/core/experiments.ts) (`passesPronunciationPromotionGate`):
1. **Gold Benchmark Evaluation**: A frozen dataset of $N \ge 100$ Vietnamese-English learner utterances with dual human phonetician annotations.
2. **Precision Gate**: Phoneme error detection precision $\ge 0.90$ with 95% Wilson score confidence interval lower bound $\ge 0.85$.
3. **Recall Gate**: Recall $\ge 0.60$.
4. **Acoustic Robustness**: Validated calibration profiles across clean, office, and mobile acoustic noise environments.
Currently, OpenPronounce v0.3.0 remains in `validationState: "shadow"` with zero gold evidence.

---

## 3. Modal Architecture & Cost Profile

- **Compute Tier**: 2.0 vCPU, 4096 MB RAM.
  - OpenPronounce runs on CPU; GPU is unnecessary for baseline trials and saves >80% compute cost.
- **Measured hardening smoke run (2026-09-04)**:
  - first, non-speech case: 4.811s;
  - second, synthetic-speech case: 2.459s.
  These values are observations, not stable cold/warm SLOs or throughput estimates.
  - Idle scale-down: `scaledown_window=60` ensures containers terminate after 60s idle.
- **Persistent Volume**: `modal.Volume.from_name("nep-speech-models")` caches Hugging Face checkpoints and Piper voice models (~1.2 GB).
- **Cost**: no cost extrapolation is made from one tiny run. The lane uses CPU and scales to zero; usage must be checked in Modal before larger experiments.

---

## 4. Empirical Cloud Smoke Status

- **Environment State**: Modal token credentials verified and active under workspace `thunderkill016`.
- **Live Deployment**: [`nep-speech-challenger` deployed on Modal](https://modal.com/apps/thunderkill016/main/deployed/nep-speech-challenger).
- **Invocation boundary**: authenticated Modal class invocation only; the public HTTP endpoint was removed because its absent-token behavior was fail-open.
- **Cloud Run Evidence**:
  - Direct smoke run: [`ap-OHc4TQaBnuJ0YCpshy4TSd`](https://modal.com/apps/thunderkill016/main/ap-OHc4TQaBnuJ0YCpshy4TSd) completed the pre-hardening runtime path for target `think`; it did not evaluate pronunciation correctness.
  - The current cloud artifact completed inference for 2/2 runtime-smoke cases: one deterministic tone and one eSpeak synthetic utterance. `quality_evaluated_cases` is zero, so this is not model accuracy evidence.
  - Measured first-case end-to-end latency: 4.811s.
  - Measured second-case end-to-end latency: 2.459s.
- **Fingerprint Verification**:
  - `model_fingerprint`: `dac15fd3e35db6c115277eeb5ce43a17dec9db39774f9323b313d4b917aead5f`
  - `runtime_fingerprint`: `62635dd44191e158a62a02a078fe6bf7700b0e637820e2cf7b419044abbca2ad`
- **Epistemic Invariant Confirmed**:
  - Zero raw transcriptions, zero raw audio, and zero 0–100 scores persisted.
  - Model diagnostic output remains strictly in `validationState: "shadow"` with `authority: "none"`.

## 5. Runtime smoke versus quality benchmark

Artifacts declare `artifact_class: "runtime_smoke"`. Their summary reports `inference_completion_rate` and `quality_evaluated_cases: 0`; it never reports a generic success or accuracy rate. Fixtures are explicitly classified as `non_speech_synthetic` or `synthetic_speech`, with generator metadata and exact audio hashes. Neither class is Vietnamese-learner evidence. Pronunciation-quality promotion remains blocked on speaker-disjoint, human-annotated learner data and the promotion gates above.
