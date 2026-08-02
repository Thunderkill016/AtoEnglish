# Quickstart: Verify the Private Natural Lesson Compiler

This guide describes the evidence required before spec 001 can converge. It does
not authorize production deployment or hosted database changes.

## 1. Read the governing artifacts

```text
.specify/memory/constitution.md
specs/000-atoenglish-rebuild-roadmap/spec.md
specs/000-atoenglish-rebuild-roadmap/roadmap.md
specs/001-private-natural-lesson-compiler/spec.md
specs/001-private-natural-lesson-compiler/plan.md
specs/001-private-natural-lesson-compiler/tasks.md
```

## 2. Prepare local environment

Required local secrets belong in `.env.local` and MUST NOT be committed.

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
GEMINI_API_KEY
```

The current unofficial YouTube transcript adapter is experimental. It is disabled
by default and can be enabled only for an explicit development or test run:

```text
REAL_TALK_ALLOW_EXPERIMENTAL_TRANSCRIPTS=true
```

The flag is ignored in production. Production always rejects the experimental
adapter and requires an approved transcript source. Enabling the flag does not
approve caption accuracy, rights, reliability, or publication suitability.

Use a non-production Supabase project and a quota-bounded Gemini key for live
verification.

## 3. Install and run repository checks

```bash
npm install
npm run lint
npx tsc --noEmit
npm run test
npm run test:content-standard
npm run build
```

Record the exact commit SHA and command output. A check run on an earlier commit
does not satisfy the final-head gate.

## 4. Run targeted compiler tests

```bash
npx vitest run src/__tests__/real-talk-generation-contract.test.ts
npx vitest run src/__tests__/real-talk-transcript-source-policy.test.ts
npx vitest run src/__tests__/real-talk-generation-result.test.ts
```

Required fixture coverage:

- valid environment-first draft;
- invalid Zod structure;
- invented transcript segment;
- invented speaking phrase;
- invented fill answer;
- out-of-window timestamp;
- unknown segment reference;
- dense interaction-window selection;
- prompt-injection-like caption text treated as data;
- experimental transcript blocked by default;
- experimental transcript allowed only by explicit non-production opt-in;
- experimental transcript blocked in production even when the flag is set;
- server action cannot import the unofficial transcript package directly;
- documented generation failure-code set remains stable;
- evidence failures are deduplicated and retry guidance is normalized;
- private draft identity is deterministic for the same owner, video, and level;
- different owners or levels receive different draft identities.

The presence of these test files is not a passing result. Record their output on
the exact final commit.

## 5. Verify authentication, failures, and quota ordering

Using instrumented or mocked transcript/model/repository adapters:

1. call generation while signed out;
2. confirm `AUTH_REQUIRED` behavior;
3. confirm transcript and Gemini adapters were not called;
4. submit invalid input and confirm `INVALID_INPUT`;
5. exceed the request limit and confirm `RATE_LIMITED` plus bounded retry guidance;
6. simulate transcript unavailable/invalid cases and confirm the documented codes;
7. simulate Gemini 429, unavailable, missing candidate, malformed JSON, and invalid schema;
8. simulate source-evidence failure and confirm no repository write occurs;
9. simulate video and lesson persistence failures and confirm
   `DRAFT_PERSISTENCE_FAILED`;
10. confirm the UI does not render a saved lesson after any failure.

No raw provider response or secret-bearing detail should reach the client.

## 6. Verify database migration in a non-production project

Do not apply the migration to hosted production from an agent session.

Apply or dry-run:

```text
supabase/migrations/20260802190000_real_talk_private_draft_gate.sql
```

Then regenerate types:

```bash
npm run db:types
```

Confirm generated types replace the temporary app-level extension cleanly before
removing that extension.

## 7. Verify RLS, identity, and repeated generation

Create `ownerA` and `ownerB` in the non-production project.

Required checks:

- anonymous insert is denied;
- ownerA can insert a private `ai_draft`;
- ownerA can reload the video and lesson draft;
- ownerB cannot select ownerA's private draft;
- ownerB cannot update or delete ownerA's draft;
- ownerA cannot set `is_public = true`;
- ownerA cannot set `review_state = approved`;
- lesson writes fail when the referenced video is not owned;
- public catalog query excludes all private drafts;
- generating the same YouTube source twice for ownerA at A1 updates one current
  draft rather than creating a title-dependent duplicate;
- generating the same source at B1 creates a distinct level draft;
- generating the same source for ownerB creates a distinct owner draft;
- a lesson-write failure is returned as failure even if a private video row was
  already written;
- partial private rows never become public and are reconciled by retry or manual
  cleanup during this verification phase.

## 8. Run live Gemini verification

Use a controlled, non-sensitive source and a transcript mode approved for the test
environment. When the experimental adapter is used, verify that the explicit
non-production flag is present and record that the result is not production
approval.

Verify:

- a valid response is parsed without manual JSON repair;
- the actual successful model identifier is stored;
- invalid model output is rejected before persistence;
- a 429 response returns `MODEL_RATE_LIMITED` and bounded retry guidance;
- a provider failure returns `MODEL_UNAVAILABLE` without creating a successful
  draft response;
- source-evidence failure returns `SOURCE_EVIDENCE_FAILED` with safe evidence
  codes;
- source captions cannot override generation instructions.

Do not treat this step as transcript, rights, or pedagogy approval.

## 9. Run browser preview

Test desktop and mobile widths.

Expected flow:

```text
authenticated editor
→ submit source
→ see generation progress
→ receive AI draft warning
→ see environment, roles, and goal
→ preview official playback
→ complete comprehension and retrieval
→ speak source-backed phrases
→ make a changed-context response
→ see immediate-practice summary, not mastery
```

Failure flow expectations:

```text
failed required stage
→ show stable machine-readable code
→ show safe Vietnamese message
→ show retry guidance only when applicable
→ do not show saved-draft card or lesson preview
```

Confirm reload preserves environment, events, transfer task, model, and warnings.

## 10. Manual review questions

- Is the selected source interaction natural rather than staged instruction?
- Are captions accurate enough to support the lesson?
- Are speakers and turn boundaries correct?
- Are translations and pragmatic explanations faithful?
- Does the environment describe what is actually happening?
- Are communication events observed rather than invented?
- Can the transfer task be completed with source-supported language?
- Is the source context safe and suitable for the target learner?
- Are source rights and caption use acceptable for the intended test?

## 11. Convergence rule

Spec 001 remains **not converged** while any required task, command, RLS check,
live provider test, browser test, migration verification, or human review item is
unchecked.

Do not merge or deploy from this guide. The owner makes those decisions after
reviewing the exact final state.
