# Owner Decisions

## 2026-08-03 — Core MVP

Owner decision: AtoEnglish's core product remains:

```text
Paste a YouTube URL
→ generate a private personal English lesson
→ learn and save it
```

A fixed reviewed catalog does not replace this workflow.

Consequences:

- YouTube URL generation is the primary learner action.
- Generated lessons remain owner-private `ai_draft` records.
- Transcript evidence, validation, warnings, rate limits, RLS, and atomic persistence are mandatory.
- Unsupported videos fail honestly.
- Official YouTube playback is used; media is not downloaded or re-hosted.
- Human review is required only before later public sharing or catalog publication.
- Implementation starts from current `main` and selectively ports accepted Spec 001 work.

## 2026-08-03 — Implementation authorization

The owner explicitly instructed: `triển khai đi`.

Authorized:

- create and modify an implementation branch from current `main`;
- port, adapt, and test accepted repository code;
- run repository CI and read-only hosted verification.

Not authorized by this statement:

- wholesale merge of PR #54 or `agent/rebuild-learning-core`;
- merge to `main`;
- production deployment;
- destructive hosted database changes;
- exposing private drafts publicly.
