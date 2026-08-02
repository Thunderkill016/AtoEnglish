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
- [ ] Slug collision and repeated-generation behavior is fully specified.
- [ ] Draft retention and owner deletion behavior is fully specified.

## AI generation and evidence

- [x] AI output is explicitly a draft and not source truth.
- [x] Typed output validation is mandatory.
- [x] Source-evidence validation is mandatory.
- [x] Caption content is treated as untrusted prompt data.
- [x] Unsupported English, timestamps, and references are rejected.
- [x] Human-review-only evidence is distinguished from automated evidence.
- [x] The actual generation model must be recorded.
- [ ] Stable machine-readable failure codes are implemented and verified.
- [ ] Persistence failure behavior is explicit and verified.

## Source and rights boundary

- [x] Official playback is required.
- [x] Media downloading and re-hosting are out of scope.
- [x] Transcript acquisition is represented as a replaceable concern.
- [x] The current unofficial transcript adapter is identified as experimental.
- [ ] Production-approved transcript acquisition modes are decided.
- [ ] The experimental adapter is isolated behind a configuration/policy gate.
- [ ] Source rights and caption-use review criteria are verified with a real test source.

## Privacy, authentication, and database

- [x] Authentication must occur before external generation calls.
- [x] User identity is server-derived.
- [x] Generated drafts are private by default.
- [x] RLS ownership requirements are specified.
- [x] Ordinary users cannot approve or publish drafts.
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
- [ ] All specified unit and contract fixtures exist.
- [ ] Authentication ordering tests exist and pass.
- [ ] RLS integration tests exist and pass.
- [ ] Preview completion component tests exist and pass.
- [ ] Live Gemini failure and success paths have been observed.
- [ ] Full repository lint, typecheck, tests, content standards, and build pass on the exact final head.

## Cross-artifact consistency

- [x] Constitution, roadmap, feature spec, plan, research, data model, contract, and tasks use the same feature boundary.
- [x] No planned publication behavior is hidden in spec 001.
- [x] Data entities map to requirements and tasks.
- [x] Open decisions are visible in research and tasks.
- [ ] A formal cross-artifact analysis has been run after the latest changes.
- [ ] Every functional requirement maps to at least one task and observed acceptance result.
- [ ] Every success criterion has a defined evidence source and final result.

## Review decision

- [ ] Requirements are ready for convergence.
- [x] Requirements are sufficient to continue bounded implementation and testing.
- [x] Production readiness is explicitly not claimed.
- [x] Merge and deployment remain owner decisions.

## Blocking items summary

The feature cannot converge while any of these remain unresolved:

1. transcript acquisition policy and experimental adapter isolation;
2. stable failure and persistence behavior;
3. complete automated fixture coverage;
4. non-production RLS and migration verification;
5. exact-head repository checks;
6. live Gemini and browser verification;
7. human source and lesson review;
8. final cross-artifact analysis and requirement-to-evidence mapping.
