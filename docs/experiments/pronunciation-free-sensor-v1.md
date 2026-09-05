# Free pronunciation sensor V1 — bounded experiment

**Status:** owner-authorized technical experiment  
**Branch:** `frontier/pronunciation-free-sensor-v1`  
**Date:** 2026-09-03

## Why this exception exists

`docs/product/DO_NOT_BUILD.md` normally defers phoneme-level pronunciation scoring infrastructure. This experiment is intentionally narrower than a scoring system and exists because the current pronunciation-provider path hit a real blocker: the attempted hosted provider integration was not usable for the owner, while the owner requires a zero-API-cost path.

The repository rule allows a deferred item to be reconsidered when the blocker, evidence, smaller alternatives, reversible scope, acceptance criteria, and rollback are explicit. This document is that exception record.

## Problem

AtoEnglish needs evidence about whether a learner produced a target English phone, but a paid or account-dependent pronunciation API is not acceptable for the current experiment.

Browser speech recognition is insufficient for this question because word recognition confidence is not phoneme-level pronunciation evidence.

## Intended outcome

Prove or falsify one narrow technical hypothesis:

> A free, local browser phoneme recognizer can produce a useful candidate phone sequence for a short prompted word, starting with `think /θɪŋk/`, without uploading learner audio.

This experiment does **not** claim pronunciation accuracy, mastery, CEFR ability, or learning improvement.

## Current evidence

- The product requires bounded speaking output and concise feedback, but repository policy explicitly avoids premature proprietary speech infrastructure.
- The owner reports that the browser recording → 16 kHz audio path has already worked in the preceding local experiment.
- The hosted-provider route became a blocker, so a local-only sensor is the smallest free alternative worth testing.
- `onnx-community/wav2vec2-lv-60-espeak-cv-ft-ONNX` is an Apache-2.0 ONNX phoneme-recognition model intended for Transformers.js and 16 kHz audio. It is used here only as an unvalidated sensor.

## Allowed scope

- `src/features/pronunciation-free/**`
- `src/app/pronunciation-free-preview/**`
- `public/workers/pronunciation-phoneme-worker.mjs`
- the minimum CSP change in `next.config.mjs` needed for a pinned browser ML runtime and Hugging Face model downloads
- this experiment document

## Explicitly forbidden scope

- no lesson/curriculum changes
- no authentication changes
- no database, migration, RLS, analytics, XP, FSRS, or mastery changes
- no raw-audio upload or persistence
- no transcript persistence
- no learner-facing 0–100 pronunciation score
- no automatic pass/fail or learning-engine decision
- no model training or fine-tuning
- no paid API
- no new npm dependency in V1
- no merge or production deployment by an agent

## Implementation boundary

The experiment is local-first:

```text
microphone
→ MediaRecorder
→ browser decode/downmix/resample to mono Float32 16 kHz
→ dedicated Web Worker
→ pinned Transformers.js browser runtime
→ Wav2Vec2 phoneme recognizer
→ observed phone sequence
→ deterministic expected/observed alignment
→ candidate error evidence
```

The raw recording remains in the browser. The worker downloads model/runtime assets, but learner audio is not sent to AtoEnglish or to the model host.

## Acceptance criteria

1. `/pronunciation-free-preview` loads without requiring an API key or backend pronunciation service.
2. A learner can record one short prompted word and hear the local recording back.
3. Audio is converted to mono 16 kHz floating-point samples before inference.
4. Inference runs in a dedicated browser worker so model work does not intentionally run on the React main thread.
5. The first model load reports visible progress and later loads can use browser caching provided by the runtime.
6. The result exposes the raw observed phone sequence and a deterministic alignment against the canonical target IPA.
7. The UI labels all output as `unvalidated` candidate evidence and never converts edit distance into a pronunciation score.
8. No application request uploads the recording or derived transcript/evidence during the experiment.
9. The model path attempts WebGPU first and falls back to WASM when necessary.
10. The experiment can be removed by deleting this branch/files without a data migration or production-state rollback.

## Required technical checks

```bash
npx vitest run src/features/pronunciation-free/ipa.test.ts
npx tsc --noEmit
npm run lint
npm run build
```

Do not claim these checks passed unless they ran against the final branch state.

## Manual product/technical review

Test at least these prompted productions for `think`:

- normal attempt: `think`
- deliberate `/θ/ → /s/` attempt: approximately `sink`
- deliberate `/θ/ → /t/` attempt: approximately `tink`

Review questions:

- Does the observed sequence actually change in the expected direction?
- Does the sensor invent errors on a normal attempt?
- How long is the first model download and inference on a normal laptop and phone?
- Does WebGPU work, and does WASM fallback work when WebGPU is unavailable?
- Does the browser Network panel show model/runtime downloads but no audio upload?

If the sensor cannot reliably separate these gross contrasts, stop this path instead of building scoring, prosody, calibration, or learner feedback around it.

## Rollback

Delete `frontier/pronunciation-free-sensor-v1` or close its pull request. No database or production data rollback is required.
