# Selective Port Manifest

**Source branch:** `agent/rebuild-learning-core`
**Source SHA:** `e1642db1540046271f520f72f1b20a04e5d84f09`
**Destination:** `integration/mvp-youtube-to-lesson`

## Port unchanged

| Source path | Destination | Reason |
| --- | --- | --- |
| `src/features/real-talk/domain/draft-identity.ts` | same | Server-derived private draft identity contract. |
| `src/features/real-talk/domain/generation-result.ts` | same | Typed user-visible generation outcomes. |
| `src/features/real-talk/domain/lesson-prompt.ts` | same | Evidence-bound prompt contract. |
| `src/features/real-talk/domain/transcript-source.ts` | same | Timed transcript source contract. |
| `src/features/real-talk/domain/youtube-source.ts` | same | Strict YouTube URL/video ID validation. |
| `src/features/real-talk/application/generate-private-lesson.ts` | same | Auth → rate limit → compile → persist ordering. |
| `src/features/real-talk/server/transcript-provenance.ts` | same | Provenance and cue digest helpers. |
| `src/features/real-talk/server/transcript-source-policy.ts` | same | Transcript trust/private-production policy. |
| `src/lib/real-talk/generation-contract.ts` | same | Zod lesson output schema. |

## Port with adaptation

| Source path | Destination | Adaptation |
| --- | --- | --- |
| `src/features/real-talk/server/gemini-lesson-provider.ts` | same | Keep native `fetch`; align environment and error taxonomy with main. |
| `src/features/real-talk/server/private-lesson-compiler.ts` | same | Make private YouTube generation the product path; retain evidence validation. |
| `src/features/real-talk/server/transcript-sources/youtube-experimental.ts` | same | Keep explicit private/experimental trust mode and fail honestly in production until policy gate passes. |
| `src/features/real-talk/server/draft-repository.ts` | same | Align with hosted types and existing Supabase client. |
| `src/features/real-talk/server/draft-mapping.ts` | same | Align imports and private-library loader. |
| `src/app/actions/real-talk.ts` | same | Remove static/public catalog as primary path; expose private generation/library actions. |
| `src/app/(main)/real-talk/create/page.tsx` | same | Make learner-facing, URL-first, private-draft UI. |
| `src/types/real-talk.ts` | same | Port required lesson/runtime types without restoring stale package state. |
| Real Talk migrations from PR #54 | `supabase/migrations/` | Preserve repository history; do not re-apply already hosted migrations automatically. |

## Reference only

- Spec 001 hosted verification documents.
- T074 persisted desktop/mobile preview.
- T075 human-review packet (publication only, not private MVP gate).
- Hosted reviewer Edge Functions used for reviewed/public sources.

## Reject

- Whole-branch merge of `agent/rebuild-learning-core`.
- Source branch `package.json` / lockfile and `gtts` dependency chain.
- Static sample lessons as production fallback.
- Public catalog replacing URL generation.
- Automatic publication of generated drafts.
- Unapplied `20260731162613_learning_attempts.sql` without a new schema decision.

## Required verification

- focused unit/contract tests for every ported domain and server module;
- exact-head lint, TypeScript, unit, content-standard, and production build;
- live transcript-provider and live Gemini gates before product acceptance;
- hosted owner/cross-user RLS verification;
- desktop/mobile production-build browser journey.
