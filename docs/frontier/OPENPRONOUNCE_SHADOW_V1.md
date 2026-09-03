# OpenPronounce Shadow V1

## Goal

Add real acoustic observations to AtoEnglish without claiming that an uncalibrated model is pronunciation truth.

OpenPronounce 0.3.0 is used as an external, self-hosted acoustic diagnostic provider. Its output is **shadow evidence only** until AtoEnglish validates it against blind human ratings from Vietnamese English learners.

## Trust boundary

```text
browser recording
  -> POST /api/pronunciation/observe
  -> server resolves canonical IPA sound by soundId
  -> private OpenPronounce service
  -> provider payload parser / sanitizer
  -> shadow acoustic observation
```

The browser does not author the expected word or IPA. It sends `soundId`; AtoEnglish resolves the canonical example word from `src/lib/data/ipa-sounds.ts` on the server.

## Explicit non-goals

V1 does **not**:

- write pronunciation mastery;
- update Nếp learner state;
- expose OpenPronounce's 0-100 score as a learner grade;
- call `heard IPA` ground truth;
- persist raw audio or provider transcripts;
- replace the existing `assessPronunciation()` calibration gate;
- treat one suspected phone substitution as a confirmed learner error.

## Observation contract

The AtoEnglish route returns only a bounded observation:

- canonical target word and IPA;
- provider/model version;
- suspected phone/word observations with confidence;
- aggregate acoustic/phone/word diagnostics;
- compact descriptive prosody summary when available;
- `calibration: "shadow-unvalidated"`.

The raw provider transcript, raw F0/energy curves, phoneme vectors, and raw score are discarded at the AtoEnglish boundary. The Python service also strips them before returning data to Next.js.

## Privacy and abuse controls

- authenticated users only;
- per-user rate limit;
- bounded multipart request size;
- allowlisted audio MIME types;
- provider URL and optional service token are server-only env vars;
- provider request timeout;
- no raw audio storage;
- no raw audio/transcript in logs;
- provider failures fail closed to `observation: null`.

## Why shadow first

OpenPronounce's own benchmark is useful at utterance level, but its word-level false-positive rate remains too high to treat a single flag as a confirmed learner mistake. The published benchmark population is Mandarin-speaking learners, not Vietnamese learners. AtoEnglish therefore needs a Vietnamese calibration set before promotion.

Promotion path:

```text
shadow observation
  -> Vietnamese learner recordings
  -> blind human ratings
  -> precision / recall / calibration by phone and context
  -> threshold policy
  -> learner-facing minimal feedback
  -> only then consider pronunciation learner state
```

## Runtime configuration

AtoEnglish Next.js:

- `OPENPRONOUNCE_URL` — private base URL of the Python service.
- `OPENPRONOUNCE_SERVICE_TOKEN` — optional shared bearer token for the private service.

The Python service lives under `services/openpronounce-shadow/` and is deliberately isolated from the Vercel runtime so PyTorch/model weights never become Next.js dependencies.
