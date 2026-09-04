# MODAL-SPEECH-001: Speech Challenger Runtime & Benchmark Harness (V1)

## 1. Executive Summary & Epistemic Boundary

This subsystem introduces a reproducible, vendor-neutral execution lane on [Modal](https://modal.com/) for speech intelligence challengers in the Nếp English Intelligence Engine. It boots the self-hosted **OpenPronounce v0.3.0** baseline (from PR #105) purely as an initial execution baseline to evaluate acoustic phoneme diagnosis without granting it any authority over learner mastery.

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
- **Full Reproducibility**: Results record deterministic SHA-256 fingerprints of runtime environment, model weights, and benchmark datasets.

---

## 2. Review Questions & Architectural Answers

### 1. Can the same benchmark contract run a second model without changing core semantics?
**Yes.**
The contract is defined by `SpeechChallengerProvider(ABC)` in [`services/speech-challenger-modal/challenger_contract.py`](file:///home/thunder/Code/AtoEnglish/services/speech-challenger-modal/challenger_contract.py). A second challenger (e.g. `MockChallengerProvider`, GOPT, or WavLM) implements:
- `name`
- `version`
- `get_model_fingerprint()`
- `get_runtime_fingerprint()`
- `analyze(audio_bytes, target_text, content_type)`

Both the benchmark runner [`scripts/run-speech-benchmark.py`](file:///home/thunder/Code/AtoEnglish/scripts/run-speech-benchmark.py) and Nếp TypeScript bridge [`src/lib/core/speech-challenger-contract.ts`](file:///home/thunder/Code/AtoEnglish/src/lib/core/speech-challenger-contract.ts) interact exclusively with this abstract contract. Nếp Core types (`CoreObservation`, `AcousticDiagnosticPayload`) contain zero vendor or Modal identifiers.

### 2. Does any raw provider/model score leak across the core observation boundary?
**No.**
Sanitization is enforced at two distinct boundaries:
1. **Python Layer** (`sanitize_openpronounce_raw` in `challenger_contract.py`): Explicitly discards upstream `score`, `candidate_score`, `transcribe`, `expected_vector`, `transcribed_vector`, `feedback` prose, and raw GOP vectors. Only bounded acoustic distance, PER, WER, word errors, and prosody summaries are forwarded.
2. **TypeScript Core Layer** (`validateChallengerDiagnosticIntegrity` in `speech-challenger-contract.ts`): Rejects any payload containing `score`, `candidate_score`, `transcribe`, or raw vector fields.

### 3. Are model/runtime/data fingerprints sufficient to reproduce a run?
**Yes.**
Each benchmark run records:
- `model_fingerprint`: Artifact ID, version string, configuration ID, and SHA-256 over checkpoint weights.
- `runtime_fingerprint`: Execution runtime, Python version, hardware tier, and SHA-256 over platform and pinned dependency versions.
- `dataset_fingerprint`: SHA-256 over the benchmark test suite cases.

### 4. Is audio ephemeral and are transcripts absent from persisted artifacts/logs?
**Yes.**
- Audio files are stored strictly in temporary files and unlinked immediately in `finally` blocks during `OpenPronounceBaselineProvider.analyze()` and `app.py`.
- Benchmark records written to `benchmarks/runs/` contain only target text, case ID, fingerprints, latency, and bounded diagnostic metrics. Raw learner audio and raw ASR transcripts are never persisted.

### 5. Does failure remain `unknown/unavailable` rather than becoming zero skill?
**Yes.**
When an error occurs (such as invalid audio or timeout), the system returns `success: false` with `error_code: "..."` and `acoustic_distance: null`, `phoneme_error_rate: null`. It never infers a 0 score or negative skill mastery. Furthermore, `authority: "none"` guarantees that no challenger observation can alter learner state.

### 6. What exact evidence is still missing before this model could become hint-only or assessment-candidate under PR #128 promotion gates?
Per [`docs/core/BENCHMARK_PROMOTION_CONTRACT_V1.md`](file:///home/thunder/Code/AtoEnglish/docs/core/BENCHMARK_PROMOTION_CONTRACT_V1.md) and [`src/lib/core/experiments.ts`](file:///home/thunder/Code/AtoEnglish/src/lib/core/experiments.ts) (`passesPronunciationPromotionGate`):
1. **Gold Benchmark Evaluation**: A frozen dataset of $N \ge 100$ Vietnamese-English learner utterances with dual human phonetician annotations.
2. **Precision Gate**: Phoneme error detection precision $\ge 0.90$ with 95% Wilson score confidence interval lower bound $\ge 0.85$.
3. **Recall Gate**: Recall $\ge 0.60$.
4. **Acoustic Robustness**: Validated calibration profiles across clean, office, and mobile acoustic noise environments.
Currently, OpenPronounce v0.3.0 remains in `validationState: "shadow"` with zero gold evidence.

---

## 3. Modal Architecture & Cost Profile

- **Compute Tier**: 2.0 vCPU, 4096 MB RAM.
  - OpenPronounce runs on CPU; GPU is unnecessary for baseline trials and saves >80% compute cost.
- **Cold Start**:
  - Cold start provision + persistent volume mount: ~15–25s.
  - Warm inference: ~150–350ms.
  - Idle scale-down: `scaledown_window=60` ensures containers terminate after 60s idle.
- **Persistent Volume**: `modal.Volume.from_name("nep-speech-models")` caches Hugging Face checkpoints and Piper voice models (~1.2 GB).
- **Free Allowance**: Modal provides $30/month in compute credits. CPU costs ~$0.000030/second. Thousands of benchmark cases consume <$1.00.

---

## 4. Empirical Cloud Smoke Status

- **Environment State**: Modal token credentials verified and active under workspace `thunderkill016`.
- **Live Deployment**: [`nep-speech-challenger` deployed on Modal](https://modal.com/apps/thunderkill016/main/deployed/nep-speech-challenger).
- **Web Endpoint**: `https://thunderkill016--nep-speech-challenger-analyze-endpoint.modal.run`
- **Cloud Run Evidence**:
  - Direct smoke run: [`ap-OHc4TQaBnuJ0YCpshy4TSd`](https://modal.com/apps/thunderkill016/main/ap-OHc4TQaBnuJ0YCpshy4TSd) (PASS, target: `think`).
  - Full cloud benchmark trial: `scripts/run-speech-benchmark.py --mode=modal` (PASS, 3/3 cases, 100% success rate, artifact saved to `benchmarks/runs/speech-benchmark-modal-cloud.json`).
  - Measured cold start latency: 68.3s (initial container provision + volume mount + checkpoint load).
  - Measured warm inference latency: 3.08s.
- **Fingerprint Verification**:
  - `model_fingerprint`: `dac15fd3e35db6c115277eeb5ce43a17dec9db39774f9323b313d4b917aead5f`
  - `runtime_fingerprint`: `62635dd44191e158a62a02a078fe6bf7700b0e637820e2cf7b419044abbca2ad`
- **Epistemic Invariant Confirmed**:
  - Zero raw transcriptions, zero raw audio, and zero 0–100 scores persisted.
  - Model diagnostic output remains strictly in `validationState: "shadow"` with `authority: "none"`.

