# Implementation Plan: Private Natural Lesson Compiler

**Branch**: `agent/rebuild-learning-core` | **Date**: 2026-08-02 | **Spec**: `specs/001-private-natural-lesson-compiler/spec.md`

**Input**: Feature specification from `/specs/001-private-natural-lesson-compiler/spec.md`

## Summary

Harden the existing YouTube-to-Gemini Real Talk generator into an authenticated,
owner-private, evidence-bound draft compiler. Keep source playback official,
separate experimental transcript acquisition from product approval, validate AI
output with Zod and source evidence, persist the full draft under RLS, and require
a changed-context production attempt in preview.

This plan evolves the current modular monolith. It does not build publication,
curriculum sequencing, learner rewards, or production deployment.

## Technical Context

**Language/Version**: TypeScript 6, Node.js 24, React 19, Next.js 16 App Router

**Primary Dependencies**: Next.js server actions, Zod 4, Supabase SSR/PostgREST, Gemini Generative Language API, official YouTube iframe/oEmbed, current experimental `youtube-transcript` adapter

**Storage**: Supabase PostgreSQL with RLS and versioned SQL migrations

**Testing**: Vitest unit/contract tests, TypeScript `tsc --noEmit`, ESLint, content-standard tests, Supabase/RLS integration verification, Playwright browser flow where environment permits

**Target Platform**: Modern desktop and mobile browsers supported by the repository browserslist; Vercel server runtime

**Project Type**: Modular-monolith web application with server actions and client lesson runtime

**Performance Goals**:

- reject anonymous generation before external API calls;
- return deterministic validation failures without retry loops;
- keep selected source input at or below 180 seconds and configured cue limit;
- avoid duplicate Gemini requests caused by UI state changes;
- keep public catalog reads independent of private draft volume.

**Constraints**:

- no source media download or re-hosting;
- no autonomous publication;
- no raw learner audio persistence;
- no manual edits to generated Supabase types;
- no unbounded transcript or model output;
- no claim of pronunciation assessment or mastery;
- migration may not be applied automatically from this branch.

**Scale/Scope**: One authenticated editor flow, one draft per generation attempt, small pilot catalog, and controlled external API quota. Broad multi-tenant authoring is outside scope.

## Constitution Check

### Pre-research gate

- **Natural Communication First — PASS**: Output begins with environment, roles, goal, observed events, and transfer rather than grammar units.
- **Evidence-Bound Generation — PASS WITH OPEN RISK**: Typed and source-evidence gates are planned. Transcript acquisition rights/reliability remain experimental and block production approval.
- **Transfer Before Completion — PASS**: Preview requires a changed-context production attempt.
- **Rights, Privacy, and Safety — PASS WITH OPEN RISK**: Official playback, authenticated private drafts, and RLS are required. Source transcript adapter needs a later production decision.
- **Small, Independently Testable Delivery — PASS**: Publication, curriculum graph, delayed review, analytics, and rewards are excluded.
- **Measurable Evidence — PASS**: Success criteria distinguish technical verification and manual source review.

No constitution violation is accepted. Open risks are explicit blockers, not justified exceptions.

### Post-design gate

- Domain contracts remain separate from Next.js transport and UI.
- Database ownership and publication invariants are expressed in RLS and migrations.
- AI draft and reviewed lesson remain distinct states.
- External source and model calls are bounded and failure-safe.
- Preview uses draft data without converting it into learner mastery evidence.

**Result**: Design may proceed. Convergence remains blocked until all unchecked tasks and manual evidence are completed.

## Architecture and Data Flow

```text
authenticated editor
→ validated generation request
→ transcript source adapter
→ normalized bounded transcript cues
→ deterministic interaction-window selection
→ oEmbed source metadata
→ Gemini structured generation
→ Zod schema validation
→ source-evidence validation
→ private draft persistence under RLS
→ owner-only preview
→ environment + comprehension + retrieval + spoken attempt + transfer
```

### Boundary decisions

1. `src/app/actions/real-talk.ts` remains a transport/orchestration adapter, not the permanent home for all domain logic.
2. Generation schemas, evidence checks, and deterministic segment selection live in feature-owned domain modules.
3. Supabase access uses typed app-level table extensions until hosted schema types are regenerated after migration.
4. Transcript acquisition is represented behind a source adapter contract. The current library remains experimental and cannot establish rights or transcript correctness.
5. Publication is impossible in this feature by type, database default, and RLS policy.

## Project Structure

### Documentation

```text
specs/001-private-natural-lesson-compiler/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── generation-contract.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code

```text
src/
├── app/
│   ├── (main)/real-talk/create/page.tsx       # editor request and draft preview
│   └── actions/real-talk.ts                    # authenticated orchestration
├── components/real-talk/
│   ├── RealTalkLesson.tsx                      # environment-first preview
│   └── PostWatchPhase.tsx                      # retrieval, speaking, transfer
├── lib/
│   ├── real-talk/generation-contract.ts        # schema, evidence, selection
│   └── supabase/server.ts                      # typed server client
├── types/
│   ├── app-database.ts                         # temporary app-level table types
│   └── real-talk.ts                            # lesson/draft contracts
└── __tests__/
    └── real-talk-generation-contract.test.ts

supabase/migrations/
└── 20260802190000_real_talk_private_draft_gate.sql
```

**Structure Decision**: Preserve the modular monolith. During this feature, domain logic may remain under `src/lib/real-talk/` to minimize unrelated movement. A later bounded refactor may move it to `src/features/real-talk/domain/` after behavior and tests converge.

## Implementation Phases

### Phase 0 — Research and decision capture

- Define what is product-approved versus experimental for transcript acquisition.
- Define evidence that can be automated and evidence requiring human review.
- Define draft, review, publication, and retirement states.
- Confirm Zod 4 structured output and JSON schema behavior.
- Confirm Supabase RLS ownership and upsert behavior.

### Phase 1 — Contracts and persistence design

- Finalize generation request and draft schema.
- Finalize source-evidence failure codes.
- Finalize database fields for environment, events, transfer, warnings, model, and review state.
- Finalize owner-only RLS and public catalog exclusion.
- Define preview completion evidence without audio scoring.

### Phase 2 — User story implementation

- US1: authenticated generation and private persistence.
- US2: model/schema/source evidence rejection.
- US3: owner-only reloadable draft and visible warnings.
- US4: environment-first preview and transfer attempt.

### Phase 3 — Verification and convergence

- Run exact-head lint, typecheck, unit tests, content standards, and build.
- Run RLS integration checks with two users and anonymous access.
- Run live Gemini happy path, invalid output, 429, and failure path with a non-production test key.
- Run browser preview on mobile and desktop.
- Manually inspect source timing, speaker uncertainty, and learner-facing claims.
- Apply or dry-run migration only with explicit owner authorization.

## Complexity Tracking

No constitution violation is approved.

| Risk | Required Handling | Simpler Alternative Rejected Because |
|---|---|---|
| External Gemini generation | Typed response, quota gate, model tracking, deterministic validation | Hand-authoring every draft would not test the intended compiler capability |
| Supabase app-level table extension | Temporary typed extension until migration is applied and generated types can be regenerated | `any` would hide schema defects; hand-editing generated types violates repository rules |
| Experimental transcript adapter | Explicit adapter boundary, warning, and publication block | Treating scraped captions as approved evidence would misrepresent rights and reliability |
