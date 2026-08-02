# AtoEnglish Real Talk boundaries

**Updated:** 2026-08-02

These boundaries keep the Real Talk release useful and technically honest.

## Do not claim

- transcript similarity is pronunciation accuracy;
- a browser STT result diagnoses phonemes, stress, fluency, or prosody;
- one lesson completion proves a CEFR level or conversational fluency;
- AI-generated lesson content is publishable without schema checks and human review.

## Do not store by default

- raw microphone recordings;
- full learner speech transcripts;
- names, employers, or free learner text in analytics;
- YouTube audio or video files.

## Do not expand in this release

- an unrestricted AI conversation tutor;
- a new speech model or self-hosted audio pipeline;
- a full curriculum rewrite;
- subscriptions, league systems, social features, or native apps;
- general-purpose content authoring tools.

## Required implementation discipline

- Use an official YouTube embed or direct watch link; never download media.
- Validate all server-action input with Zod and derive the user from Supabase Auth.
- Keep RLS enabled and migrate schema changes through versioned SQL migrations.
- Make progress and XP writes idempotent.
- Keep fallback speech practice usable when browser recognition is unavailable.
- Test an activity's real learner behavior, not only the route rendering.
