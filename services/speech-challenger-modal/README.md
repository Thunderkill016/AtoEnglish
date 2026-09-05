# Nếp Speech Challenger Runtime on Modal (Baseline V1)

This service provides a vendor-independent, reproducible execution environment on [Modal](https://modal.com/) for speech model challengers. It hosts the initial OpenPronounce baseline to produce acoustic diagnostic observations without persisting raw audio or exposing 0–100 scores to learners.

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
- **Deterministic Fingerprints**: Every run tags results with SHA-256 fingerprints of runtime environment and model checkpoints.
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

*(Optional) Configure Bearer token for HTTP web endpoint:*
```bash
export NEP_SPEECH_SERVICE_TOKEN="your-secure-service-token"
```

---

## Execution & Deployment Commands

### Run Local Unit Tests
```bash
uv run --with numpy python -m unittest services/speech-challenger-modal/test_challenger_contract.py
```

### Run Cloud Smoke Test via Modal CLI
Runs a self-contained smoke test with synthetic audio:
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
- **Cold-Start Latency**:
  - Cold start: ~15–25 seconds (container provision + cache hydration from persistent volume).
  - Warm execution: ~150–350 ms per short utterance.
  - `scaledown_window=60`: Container shuts down after 60 seconds of inactivity to eliminate idle costs.
- **Storage Volume**:
  - Persistent volume `nep-speech-models` caches Hugging Face checkpoints and Piper voice models (~1.2 GB) so models are not re-downloaded across warm instances.
- **Free Allowance Management**:
  - Modal provides $30/month in free compute credits.
  - CPU compute costs ~$0.000030/second.
  - 10,000 benchmark executions consume <$1.00, remaining entirely within the free allowance.
