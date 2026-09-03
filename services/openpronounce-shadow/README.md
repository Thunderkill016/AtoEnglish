# OpenPronounce Shadow Service

Private Python service for AtoEnglish pronunciation research.

This service deliberately runs outside the Next.js/Vercel runtime because OpenPronounce uses PyTorch plus two Wav2Vec2 checkpoints. It returns only the bounded provider payload required by AtoEnglish; raw transcription, raw phone traces and raw prosody curves are stripped before crossing the service boundary.

## Build

```bash
docker build -t atoenglish-openpronounce-shadow services/openpronounce-shadow
```

## Run

```bash
docker run --rm \
  -p 8000:8000 \
  -e OPENPRONOUNCE_SERVICE_TOKEN='replace-me' \
  -v openpronounce-models:/models/huggingface \
  atoenglish-openpronounce-shadow
```

The first real analysis may download large Hugging Face model weights. Mount `HF_HOME` on persistent storage so later requests do not redownload them.

Health check:

```bash
curl -H 'Authorization: Bearer replace-me' http://localhost:8000/health
```

Pronunciation request:

```bash
curl -X POST \
  -H 'Authorization: Bearer replace-me' \
  -F 'file=@recording.webm' \
  -F 'expected_text=think' \
  -F 'lang=en' \
  http://localhost:8000/pronunciation
```

## Runtime rules

- English only in V1.
- Maximum audio upload: 5 MiB.
- A shared bearer token is optional locally and strongly recommended on any networked deployment.
- Do not expose this service directly to browsers; browsers call AtoEnglish `/api/pronunciation/observe` instead.
- Keep `HF_HOME` persistent where possible.
- Do not enable raw request-body logging.
- This service is **not** a pronunciation mastery authority.

## Upstream

Pinned provider: `openpronounce==0.3.0` (MIT).

AtoEnglish must benchmark/calibrate this provider on Vietnamese English learners before promoting its observations into learner-facing pronunciation scoring or mastery state.
