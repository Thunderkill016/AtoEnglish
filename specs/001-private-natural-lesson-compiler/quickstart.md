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
- prompt-injection-like caption text treated as data.

## 5. Verify authentication and quota ordering

Using an instrumented or mocked transcript/model adapter:

1. call generation while signed out;
2. confirm `AUTH_REQUIRED` behavior;
3. confirm transcript and Gemini adapters were not called;
4. sign in and repeat with valid input;
5. confirm rate limiting is applied to the authenticated request path.

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

## 7. Verify RLS with two users

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
- public catalog query excludes all private drafts.

## 8. Run live Gemini verification

Use a controlled, non-sensitive source and a transcript mode approved for the test
environment.

Verify:

- a valid response is parsed without manual JSON repair;
- the actual successful model identifier is stored;
- invalid model output is rejected before persistence;
- a 429 response provides bounded retry guidance;
- a provider failure does not create a public or partial draft;
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
