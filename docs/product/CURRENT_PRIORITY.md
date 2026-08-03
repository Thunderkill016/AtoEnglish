# AtoEnglish Current Priority

**Updated:** 2026-08-03  
**Owner:** Thunderkill016  
**Method:** GitHub Spec Kit / Spec-Driven Development

## Confirmed Product Direction

AtoEnglish's core product remains:

```text
Dán link video YouTube
→ tạo bài học tiếng Anh cá nhân từ video đó
→ học, lưu và quay lại
```

The MVP must make this private URL-to-lesson workflow reliable and usable. It must
not replace it with a fixed reviewed catalog.

## Proposed Active Feature: 002 — YouTube-to-Private-Lesson MVP

```text
truthful landing
→ signup/login
→ URL-first dashboard
→ validate supported YouTube source
→ timed English transcript acquisition
→ bounded interaction selection
→ live Gemini structured generation
→ source-evidence validation
→ atomic owner-private ai_draft
→ first listen / support / retrieval / speech / transfer
→ bounded progress
→ private library and return
```

## Relationship to Spec 001

Spec 001 already produced the strongest reusable foundation:

- authentication before transcript/Gemini work;
- URL/source and transcript adapter contracts;
- bounded interaction selection;
- Gemini structured output;
- schema and source-evidence validation;
- stable failure codes;
- deterministic owner-private identity;
- atomic private persistence and RLS;
- provenance/warnings;
- persisted desktop/mobile private preview.

Its branch is diverged from main and cannot be merged wholesale. Spec 002 ports
only accepted files/contracts/tests onto a fresh branch from current main.

## Ordered Next Actions

1. Record explicit implementation authorization separately from the already
   confirmed product correction.
2. Freeze current main and create `integration/mvp-youtube-to-lesson`.
3. Build the file-level port manifest.
4. Align package/toolchain and Supabase types/project reference.
5. Make landing/auth/dashboard center on the YouTube URL form.
6. Finalize the private-production transcript adapter decision and supported-video
   failure behavior.
7. Verify live Gemini success/failure with a bounded secret.
8. Integrate atomic private generation, lesson runtime, progress, and private library.
9. Run hosted RLS, live provider, desktop/mobile Vercel preview, and runtime checks.
10. Obtain owner acceptance before any merge/deployment decision.

## Hard Release Blockers

- no accepted transcript adapter/private-production decision;
- missing live `GEMINI_API_KEY` verification;
- generation not cleanly integrated onto current main;
- unsupported-video failures not proven;
- atomic owner-private persistence/RLS not proven on final head;
- no complete desktop/mobile URL-to-lesson/return preview;
- owner acceptance missing.

## Explicit MVP Exclusions

- public/shared catalog as the primary product;
- automatic publication;
- full reviewer UI;
- bulk crawling/generation;
- support for every YouTube video;
- media downloading/re-hosting;
- broad curriculum, XP/streak/league, writing, grammar, business, broad speaking,
  notifications, payments, social, or native apps;
- pronunciation scoring or raw learner audio/transcript storage;
- wholesale merge of PR #54;
- autonomous merge/deployment.

## Decision Status

```text
Core product direction:    confirmed
Planning artifacts:        revised and converged
Implementation permission: not yet recorded
Implementation branch:     not created
Hosted migration:          not authorized
Vercel preview:            not authorized
Merge:                     not authorized
Production deployment:     not authorized
```