# Requirements Quality Checklist: Private Natural Lesson Compiler

**Purpose**: Validate that the feature requirements are complete, testable, consistent, and safe before convergence.

**Created**: 2026-08-02

## Product intent

- [x] The feature serves one bounded outcome: private evidence-bound lesson draft generation and preview.
- [x] The learner/editor value is stated without relying on implementation details.
- [x] The feature excludes publication, curriculum sequencing, rewards, payments, and deployment.
- [x] Natural communication environments are the primary product unit.
- [x] Grammar and vocabulary remain supporting infrastructure rather than the primary navigation model.

## User stories

- [x] User stories are prioritized.
- [x] Each user story has an independent test.
- [x] Acceptance scenarios use Given/When/Then form.
- [x] Anonymous, invalid-source, invalid-model, persistence, and privacy failures are covered.
- [x] Preview requires transfer rather than recognition-only completion.
- [x] Slug collision and repeated-generation behavior is fully specified for spec 001: one current draft per owner, source, and level.
- [ ] Draft retention and owner deletion behavior is fully specified.

## AI generation and evidence

- [x] AI output is explicitly a draft and not source truth.
- [x] Typed output validation is mandatory.
- [x] Source-evidence validation is mandatory.
- [x] Caption and oEmbed metadata are treated as untrusted prompt data.
- [x] Untrusted metadata/caption values are encoded as escaped JSON/JSONL inside one delimiter pair.
- [x] Instructions are repeated after the untrusted source boundary before output generation.
- [x] Unsupported English, timestamps, speakers, indices, activities, and references are rejected.
- [x] Human-review-only evidence is distinguished from automated evidence.
- [x] The actual generation model must be recorded.
- [x] Stable machine-readable failure codes are implemented across compiler, action, and editor UI.
- [ ] Stable failure codes have been executed and observed on the exact final head.
- [x] Persistence failure behavior is explicit and cannot be returned as saved or preview-only success.
- [x] A mocked orchestration test asserts persistence failure remains a failure result.
- [ ] Persistence failure behavior has been exercised with controlled database failures.

## Source and rights boundary

- [x] Official playback is required.
- [x] Media downloading and re-hosting are out of scope.
- [x] Transcript acquisition is represented as a replaceable adapter concern.
- [x] The current unofficial transcript adapter is explicitly identified as experimental.
- [x] The server action no longer imports the unofficial package directly.
- [x] The experimental adapter is disabled by default and requires explicit non-production opt-in.
- [x] Production rejects the experimental adapter even when the opt-in flag is present.
- [ ] At least one production-approved transcript acquisition mode is decided and implemented.
- [ ] Source rights and caption-use review criteria are verified with a real test source.

## Privacy, authentication, and database

- [x] Authentication must occur before external generation calls.
- [x] User identity is server-derived.
- [x] Generated drafts are private by default.
- [x] RLS ownership requirements are specified.
- [x] The migration explicitly enables RLS and replaces every previous policy with one canonical set.
- [x] Private video and lesson reads are limited to the owner while public rows remain readable.
- [x] Ordinary users cannot approve or publish drafts through insert or update policies.
- [x] Legacy user-created rows return to private `ai_draft` state and unverified review metadata is cleared.
- [x] Versioned migration requirements are specified.
- [x] Generated Supabase types must not be manually edited.
- [ ] Two-user and anonymous RLS behavior has been observed in a non-production database.
- [ ] Migration has been applied or dry-run in an authorized environment.
- [ ] Generated database types have been regenerated and reconciled.

## Learning design and claims

- [x] Environment, roles, goal, and communication events are required.
- [x] Comprehension, retrieval, production, and transfer are required.
- [x] Completion cannot be based on quiz recognition alone.
- [x] Preview speech behavior does not claim pronunciation assessment.
- [x] Completion does not claim mastery or delayed retention.
- [x] Human review of pragmatic meaning and pedagogy remains required.
- [ ] One real draft has passed manual lesson-coherence review.
- [ ] Desktop and mobile preview have been observed.

## Testability and measurable outcomes

- [x] Functional requirements are uniquely numbered.
- [x] Success criteria are measurable and technology-agnostic where appropriate.
- [x] Exact-head verification is required.
- [x] Mocked, integration, browser, provider, database, and manual evidence are distinguished.
- [x] Required tests are listed before convergence.
- [x] Transcript policy tests cover approved, default-blocked, non-production opt-in, production fail-closed, cue normalization, and direct-import bypass.
- [x] Result-code and deterministic draft-identity regression tests exist in `src/__tests__/real-talk-generation-result.test.ts`.
- [x] Authentication-ordering, happy-path, rate-limit, provider-failure propagation, evidence no-write, persistence-failure, prompt-injection no-write, and bounded-internal-error artifacts exist in `src/__tests__/real-talk-generation-action.test.ts`.
- [x] Invalid-schema, complete evidence-code matrix, duplicate-code, long-window, normalization, and escaped prompt-boundary artifacts exist in `src/__tests__/real-talk-generation-contract.test.ts`.
- [x] Controlled long-source and adversarial source fixtures exist under `src/__fixtures__/real-talk/`.
- [x] Migration contract coverage exists in `src/__tests__/real-talk-migration-contract.test.ts`.
- [x] Reload mapping coverage exists in `src/__tests__/real-talk-draft-mapping.test.ts`.
- [x] Two-owner plus anonymous RLS integration scaffolding exists in `src/__tests__/integration/real-talk-draft-rls.integration.test.ts`.
- [x] Real Talk domain/server/database contract suites are assigned to the Vitest Node project rather than jsdom.
- [x] Controlled preview fixture and component artifacts cover environment-first order, every-phrase acknowledgement, transfer response/confirmation gating, final-callback ordering, and unsupported-claim absence.
- [ ] Authentication ordering tests pass on the exact final head.
- [ ] Evidence, prompt-boundary, migration-contract, and mapping tests pass on the exact final head.
- [ ] Provider and persistence failure tests pass on the exact final head.
- [ ] RLS integration tests pass against an authorized migrated non-production project.
- [ ] Preview completion component tests pass on the exact final head.
- [ ] Live Gemini failure, success, and adversarial-source paths have been observed.
- [ ] Full repository lint, typecheck, tests, content standards, and build pass on the exact final head.

## Cross-artifact consistency

- [x] Constitution, roadmap, feature spec, plan, research, data model, contract, and tasks use the same feature boundary.
- [x] No planned publication behavior is hidden in spec 001.
- [x] Data entities map to requirements and tasks.
- [x] Open decisions are visible in research and tasks.
- [x] An initial formal cross-artifact analysis is recorded in `analysis.md`.
- [x] The cross-artifact analysis was rerun after transcript, failure/persistence, orchestration, evidence/prompt, database-boundary, and preview-test changes.
- [ ] Every functional requirement maps to at least one task and observed acceptance result.
- [ ] Every success criterion has a defined evidence source and final result.

## Review decision

- [ ] Requirements are ready for convergence.
- [x] Requirements are sufficient to continue bounded implementation and testing.
- [x] Production readiness is explicitly not claimed.
- [x] Merge and deployment remain owner decisions.

## Blocking items summary

The feature cannot converge while any of these remain unresolved:

1. at least one production-approved transcript acquisition mode or an explicit permanent non-production decision;
2. exact-head execution of compiler, evidence, prompt, action, migration, mapping, preview, provider, and persistence suites;
3. migration application, two-user RLS execution, repeated-generation, and partial-write verification;
4. desktop/mobile browser preview and human lesson review;
5. generated Supabase type reconciliation;
6. exact-head repository checks;
7. live Gemini and human source/lesson review;
8. draft retention/deletion decision;
9. final requirement-to-evidence mapping.
