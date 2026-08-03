# Quickstart: Verify the Private Natural Lesson Compiler

This guide defines the evidence required before spec 001 can converge. It does
not authorize production deployment, publication, or hosted production database
changes.

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

Required secrets belong in `.env.local` and MUST NOT be committed.

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
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

## 3. Run repository checks on the exact head

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

## 4. Run targeted Node contract suites

```bash
npx vitest run src/__tests__/real-talk-generation-contract.test.ts
npx vitest run src/__tests__/real-talk-transcript-source-policy.test.ts
npx vitest run src/__tests__/real-talk-generation-result.test.ts
npx vitest run src/__tests__/real-talk-generation-action.test.ts
npx vitest run src/__tests__/real-talk-migration-contract.test.ts
npx vitest run src/__tests__/real-talk-draft-mapping.test.ts
```

These suites are assigned to the Vitest Node project. Component `.tsx` suites
remain in jsdom. Required coverage includes:

- valid and invalid environment-first draft schemas;
- the complete source-evidence rejection matrix;
- long-source interaction-window selection;
- prompt-injection-like metadata and caption framing as escaped JSON/JSONL data;
- experimental transcript policy and production fail-closed behavior;
- stable generation result codes and deterministic draft identity;
- auth-before-provider ordering and no-write failure semantics;
- migration defaults, lifecycle constraints, policy reset, and owner-only rules;
- reload preservation of environment, communication events, transfer, warnings,
  model, status, and selected segment.

The presence of test files is not a passing result. Record the exact output.

## 5. Verify authentication and failure ordering

Using the mocked application dependencies:

1. submit invalid input and confirm `INVALID_INPUT` before auth;
2. call generation while signed out and confirm `AUTH_REQUIRED`;
3. confirm anonymous requests never call rate limit, transcript, Gemini, or the
   repository;
4. exceed the request limit and confirm `RATE_LIMITED` with bounded retry data;
5. simulate transcript unavailable or invalid cases;
6. simulate Gemini 429, unavailable, missing candidate, malformed JSON, and
   invalid schema;
7. simulate source-evidence failure and confirm no persistence call;
8. simulate persistence failure and confirm `DRAFT_PERSISTENCE_FAILED` rather
   than preview or saved success;
9. confirm unexpected dependency details are not exposed to the client.

Mocked propagation does not replace direct Gemini HTTP/JSON verification.

## 6. Apply or dry-run the migration in non-production

Do not apply this migration to hosted production from an agent session.

```text
supabase/migrations/20260802190000_real_talk_private_draft_gate.sql
```

The migration must be reviewed for these properties:

- `real_talk_videos.is_public` defaults to `false`;
- existing user-created rows return to private state;
- existing unverified lesson review metadata is cleared;
- RLS is explicitly enabled on both Real Talk tables;
- every previous policy is removed before the canonical policy set is created;
- public rows remain readable;
- private rows are readable only by their owner;
- ordinary users cannot publish a video draft;
- ordinary users cannot insert or update lessons beyond `ai_draft`;
- owner deletion is limited to private draft rows.

After the migration is applied, regenerate types:

```bash
npm run db:types
```

Only remove `src/types/app-database.ts` after generated types prove equivalent
coverage.

## 7. Run the two-user RLS integration scaffold

The following command requires the migrated non-production project and all three
Supabase environment variables:

```bash
npm run test:integration -- \
  src/__tests__/integration/real-talk-draft-rls.integration.test.ts
```

The scaffold creates temporary owner A and owner B accounts, then cleans them up.
It verifies:

- anonymous video-draft insertion is denied;
- owner A can create and reload a private video and lesson draft;
- owner B and anonymous users cannot select owner A's rows;
- owner B cannot update or delete owner A's video;
- owner A cannot set `is_public = true`;
- owner A cannot elevate a lesson to `approved`;
- a pre-reviewed or approved lesson cannot be inserted by an ordinary user;
- owner B cannot create a lesson through owner A's video;
- anonymous public-catalog queries exclude all private fixtures.

Do not mark T054 complete from the scaffold alone. Record the project, migration
state, exact head, command, output, and cleanup result.

## 8. Verify identity, repeat generation, and partial writes

After RLS passes, verify with controlled drafts:

- the same owner + YouTube source + level updates one current draft;
- changing level creates a distinct draft;
- changing owner creates a distinct draft;
- AI title changes do not change persistence identity;
- owner A can reload environment, events, transfer, warnings, and model;
- public catalog queries exclude private drafts;
- lesson-write failure remains a failed request even after a video upsert;
- partial private rows never become public and can be reconciled by retry or
  controlled cleanup.

## 9. Run live Gemini verification

Use a controlled, non-sensitive source and a transcript mode approved for the
test environment. When the experimental adapter is used, record that the result
is not production approval.

Verify:

- a valid response parses without manual JSON repair;
- the actual successful model identifier is stored;
- invalid model output is rejected before persistence;
- a 429 returns `MODEL_RATE_LIMITED` and bounded retry guidance;
- provider failure returns `MODEL_UNAVAILABLE`;
- source-evidence failure returns safe machine-readable evidence codes;
- adversarial caption text cannot change the requested output contract in the
  observed model run.

Prompt framing is hardening, not proof of universal prompt-injection immunity.

## 10. Run browser preview

Test desktop and mobile widths.

Expected flow:

```text
authenticated editor
→ submit source
→ see generation progress
→ receive private AI-draft warning
→ see environment, roles, and practical goal
→ preview official playback
→ complete comprehension and retrieval
→ acknowledge source-backed phrase production
→ make a changed-context response
→ see immediate-practice summary, not mastery
```

Failure flow:

```text
failed required stage
→ stable machine-readable code
→ safe Vietnamese message
→ retry guidance only when applicable
→ no saved-draft card or lesson preview
```

Confirm reload preserves the full private preview contract.

## 11. Human review

- Is the selected source interaction natural rather than staged instruction?
- Are captions accurate enough to support the lesson?
- Are speakers and turn boundaries correct?
- Are translations and pragmatic explanations faithful?
- Does the environment describe what actually occurs?
- Are communication events observed rather than invented?
- Can the transfer task be completed with source-supported language?
- Is the source context safe and suitable?
- Are source rights and caption use acceptable for this test?

## 12. Convergence rule

Spec 001 remains **not converged** while any required task, command, migration,
RLS run, provider test, browser test, or human review item is unchecked.

Do not merge or deploy from this guide. The owner makes those decisions after
reviewing the exact final state.
