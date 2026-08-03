# Transcript Provider Decision

**Decision date:** 2026-08-03

## Live evidence against unofficial caption extraction

GitHub Actions Verify #312 ran the private caption matrix against three public
YouTube videos. Quality/build passed, but live caption acquisition returned zero
supported videos.

Every candidate produced both failures:

```text
youtube-unofficial-fetch-v1:transcript_not_available
youtube-direct-timedtext-v1:transcript_not_available
```

The result was not a TypeScript, timeout, captcha, or XML-parser exception. Both
unofficial server-side paths completed without returning readable timed English
tracks. They are therefore retained only as diagnostic/reference code and are not
the MVP production dependency.

## Selected MVP provider path

Use Gemini Interactions with the public YouTube URL as direct video input.

Two-pass pipeline:

```text
public YouTube URL
→ Gemini video analysis (store=false)
→ bounded machine-extracted English cues with absolute timestamps
→ Zod timing/window validation
→ second Gemini request using cues as untrusted evidence
→ source-evidence validation
→ atomic owner-private ai_draft persistence
```

Why two passes:

- the first model output is explicitly a machine transcript package, not a
  human-verified transcript;
- the second lesson compiler cannot see arbitrary video instructions, only the
  bounded cue package;
- every lesson quote/activity must still map to returned cue text and indices;
- generation failure or evidence failure prevents persistence.

## Provider boundary

- public YouTube videos only;
- Gemini 3.x models for direct YouTube input;
- Interactions requests set `store=false`;
- capability remains experimental/private-only behind environment gates;
- model transcript status is `machine_checked`, never `human_verified`;
- no public sharing or catalog publication without later human review;
- no raw learner audio or free-text response is involved.

## Live verification status

The implementation and mocked payload/schema tests exist, but live Gemini
verification remains blocked until `GEMINI_API_KEY` is configured for the manual
workflow. No claim of live provider success is made yet.
