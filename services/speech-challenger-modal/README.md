# Nếp Speech Challenger Runtime on Modal (Baseline V1)

This service provides a model-neutral core contract with a Modal-specific execution adapter for speech challengers. It hosts the initial OpenPronounce baseline to produce shadow-only acoustic diagnostics without persisting raw audio or exposing 0–100 scores to learners.

## Architectural Invariant

```text
audio/input -> model adapter -> typed diagnostic observation -> benchmark record
```

**Never**:
```text
model score -> learner mastery
```

- **Pluggable Architecture**: Core domain contracts interact only with the abstract `SpeechChallengerProvider`. New models (GOPT, WavLM, fine-tuned CTC) implement this interface without modifying Nếp Core.
- **Strict Privacy**: Discards raw transcriptions, expected/transcribed phone vectors, and raw 0–100 scores. Only bounded acoustic diagnostic observations cross the provider boundary.
- **Run Provenance**: Every run tags results with runtime/package configuration identity and an exact hash of the mounted challenger code. Exact checkpoint bytes remain explicitly unresolved until the upstream cache layout is enumerated and hashed.
- **Ephemeral Audio**: Audio files are written to temporary storage, processed in memory, and unlinked immediately in `finally` blocks.

---

## Prerequisites & Environment Setup

### 1. Install Dependencies
Using `uv` (recommended) or pip:
```bash
# Using uv (fast, isolated)
uv pip install -r services/speech-challenger-modal/requirements.txt
```

### 2. Configure Modal Credentials
Modal credentials are required for cloud execution. Set them using either the CLI or environment variables:

**Option A — Via CLI**:
```bash
modal token set --token-id <YOUR_MODAL_TOKEN_ID> --token-secret <YOUR_MODAL_TOKEN_SECRET>
```

**Option B — Via Environment Variables**:
```bash
export MODAL_TOKEN_ID="ak-..."
export MODAL_TOKEN_SECRET="as-..."
```

There is intentionally no public HTTP endpoint in this slice. Invocation uses the authenticated Modal class API only.

---

## Execution & Deployment Commands

### Run Local Unit Tests
```bash
uv run --with numpy python -m unittest services/speech-challenger-modal/test_challenger_contract.py
```

### Run Cloud Smoke Test via Modal CLI
Runs a self-contained runtime smoke with non-speech synthetic audio. Completion proves execution plumbing, not pronunciation correctness:
```bash
uvx modal run services/speech-challenger-modal/app.py
```

Or test with custom text:
```bash
uvx modal run services/speech-challenger-modal/app.py --target "pronunciation"
```

### Deploy to Modal Cloud
```bash
uvx modal deploy services/speech-challenger-modal/app.py
```

---

## Cost & Resource Profile

- **Hardware Tier**: 2.0 vCPU, 4096 MB RAM (CPU tier).
  - OpenPronounce runs Wav2Vec2 + Piper TTS in CPU RAM (~1.8 GB footprint).
  - GPU (T4/A10G) is unnecessary for baseline benchmark trials, cutting operational cost by >80%.
- **Measured hardening smoke latency (2026-09-04)**:
  - first, non-speech case: 4.811 seconds;
  - second, synthetic-speech case: 2.459 seconds.
  These are end-to-end observations from one tiny runtime-smoke run, not stable cold/warm SLOs or throughput estimates.
  - `scaledown_window=60`: Container shuts down after 60 seconds of inactivity to eliminate idle costs.
- **Storage Volume**:
  - Persistent volume `nep-speech-models` caches Hugging Face checkpoints and Piper voice models (~1.2 GB) so models are not re-downloaded across warm instances.
- **Cost policy**: CPU only, scale to zero, and inspect Modal's actual usage report before extrapolating cost. This repository makes no per-10,000-run or free-credit claim from the single smoke run.

## Fixture classes and reproducibility limits

- `non_speech_synthetic`: a deterministic 440 Hz tone for transport/model-loading checks only.
- `synthetic_speech`: eSpeak NG 1.51-generated speech, labeled synthetic and never treated as Vietnamese-learner evidence.
- Recreate the committed speech fixture with `espeak-ng -v en-us -s 140 -w benchmarks/fixtures/synthetic_speech_think.wav think`; verify SHA-256 `b0bf3fc3e177c60810ee7800b450be984751aa954f9e911715bc565cdb896089` with eSpeak NG `1.51+dfsg-12build1`.
- The dataset manifest includes SHA-256 for the exact audio bytes of every case.
- Dependency ranges plus resolved runtime versions provide run provenance, not a guaranteed rebuild. The OpenPronounce package/config identity is hashed; exact Wav2Vec2/Piper checkpoint-byte identity is currently unresolved.
