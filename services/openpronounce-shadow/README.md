# OpenPronounce Shadow Service

Private Python service for AtoEnglish pronunciation research.

This service deliberately runs outside the Next.js/Vercel runtime because OpenPronounce uses PyTorch plus two Wav2Vec2 checkpoints. It returns only the bounded provider payload required by AtoEnglish; raw transcription, raw phone traces, aligned vectors and raw prosody curves are stripped before crossing the service boundary.

## Runtime design

OpenPronounce 0.3.0 defaults to network-backed gTTS for its reference voice. AtoEnglish overrides that default with **Piper** so inference does not depend on Google TTS after the initial model/voice download.

The container defaults are:

- `HF_HOME=/models/huggingface`
- `OPENPRONOUNCE_CACHE_DIR=/models/huggingface/openpronounce-cache`
- `OPENPRONOUNCE_TTS=piper`
- `OPENPRONOUNCE_TTS_VOICE=en_US-lessac-medium`

Mount `/models/huggingface` on persistent storage. That single volume then keeps the two Wav2Vec2 checkpoints, the Piper voice and synthesized reference cache across restarts.

Only one Uvicorn worker is used deliberately. Multiple workers would load separate copies of the multi-GB model set into memory.

## Build

```bash
docker build -t atoenglish-openpronounce-shadow services/openpronounce-shadow
```

## Run

```bash
docker run --rm \
  -p 8000:8000 \
  -e OPENPRONOUNCE_SERVICE_TOKEN='replace-me' \
  -e OPENPRONOUNCE_WARMUP=1 \
  -v openpronounce-models:/models/huggingface \
  atoenglish-openpronounce-shadow
```

With warm-up enabled, startup preloads:

1. the English word-ASR Wav2Vec2 checkpoint;
2. the phone-recognition Wav2Vec2 checkpoint;
3. the Piper reference voice.

The first start still needs network access to fetch those assets. After they are present on the mounted volume, ordinary inference no longer requires Google TTS.

Health check is intentionally unauthenticated:

```bash
curl http://localhost:8000/health
```

Pronunciation request:

```bash
curl -X POST \
  -H 'Authorization: Bearer replace-me' \
  -F 'file=@recording.webm;type=audio/webm' \
  -F 'expected_text=think' \
  -F 'lang=en' \
  http://localhost:8000/pronunciation
```

## Runtime rules

- English only in V1.
- Maximum upload: 5 MiB.
- Decoded audio duration: 0.15–12 seconds.
- Provider-side MIME allowlist mirrors the AtoEnglish API boundary.
- A shared bearer token is optional locally and strongly recommended on any networked deployment.
- Do not expose this service directly to browsers; browsers call AtoEnglish `/api/pronunciation/observe` instead.
- Inference is serialized inside one process so concurrent requests do not multiply CPU/RAM pressure; requests waiting too long fail with `503 provider_busy`.
- Heavy decoding/inference runs off the FastAPI event loop so `/health` can remain responsive during analysis.
- Do not enable raw request-body logging.
- Logs contain only coarse lifecycle/result type and timing, never audio, expected text, transcript or provider payload.
- This service is **not** a pronunciation mastery authority.

## Railway pilot

Recommended service settings:

```text
Root directory: services/openpronounce-shadow
Volume mount:   /models/huggingface
Health path:    /health
Serverless:     enabled
OPENPRONOUNCE_WARMUP=1
OPENPRONOUNCE_SERVICE_TOKEN=<random private token>
```

Use Railway's HTTPS public service URL for Vercel and protect `/pronunciation` with the shared bearer token. Vercel cannot reach Railway's private service network directly.

Then set on the AtoEnglish Preview deployment:

```text
OPENPRONOUNCE_URL=https://<railway-service>
OPENPRONOUNCE_SERVICE_TOKEN=<same token>
```

## Contract verification

`provider_contract.py` is dependency-light on purpose. CI runs a frozen OpenPronounce 0.3.0-shaped fixture through it without installing PyTorch/OpenPronounce. This catches accidental leakage of transcripts, vectors, raw phone traces or malformed score/confidence values at the service boundary.

The exact upstream runtime still must be smoke-tested after deployment; the fixture verifies the contract, not the ML runtime.

## Upstream

Pinned provider: `openpronounce==0.3.0` (MIT).

AtoEnglish must benchmark/calibrate this provider on Vietnamese English learners before promoting its observations into learner-facing pronunciation scoring or mastery state.
