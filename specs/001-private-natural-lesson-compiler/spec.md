# Feature Specification: Private Natural Lesson Compiler

**Feature Branch**: `agent/rebuild-learning-core`

**Created**: 2026-08-02

**Status**: In implementation; not converged

**Input**: Allow an authenticated AtoEnglish editor to turn approved natural-conversation source evidence into an owner-private, evidence-bound AI lesson draft for preview and review.

## User Scenarios & Testing

### User Story 1 - Generate a private lesson draft (Priority: P1)

An authenticated editor supplies a supported source URL, target level, and
approved transcript evidence. The system selects a bounded interaction segment,
asks Gemini to propose a lesson, validates the response, and returns a private
draft preview.

**Why this priority**: It creates the smallest end-to-end content compiler without
exposing unreviewed AI content to learners.

**Independent Test**: Using a controlled transcript fixture and mocked Gemini
response, an authenticated editor receives a complete `ai_draft` containing an
environment, communication events, transcript, activities, transfer task,
review warnings, source metadata, and no public publication.

**Acceptance Scenarios**:

1. **Given** an authenticated editor and valid source evidence, **When** generation succeeds, **Then** a typed private draft is returned and stored for that editor only.
2. **Given** a valid long transcript, **When** the compiler selects a segment, **Then** it chooses a bounded interaction-rich window rather than always taking the opening.
3. **Given** Gemini is unavailable or rate-limited, **When** generation fails, **Then** no partial public lesson is created and the editor receives an actionable error.
4. **Given** an anonymous visitor, **When** they request generation, **Then** the system rejects the request before consuming Gemini quota.

---

### User Story 2 - Reject unsupported AI content (Priority: P1)

The compiler treats captions and model output as untrusted. It accepts only
schema-valid content whose quoted English, timestamps, transcript segments, and
answer material can be traced to the selected source window.

**Why this priority**: A fluent hallucination is more dangerous than a visible
failure because it can become a misleading learning artifact.

**Independent Test**: Controlled invalid model outputs are rejected for invented
transcript text, phrases, timestamps, segment references, fill answers, or
transfer language.

**Acceptance Scenarios**:

1. **Given** model output with invalid structure, **When** validation runs, **Then** the request fails without persistence.
2. **Given** model output containing English absent from the source, **When** evidence validation runs, **Then** it returns explicit evidence failure codes.
3. **Given** caption text containing instructions to the model, **When** the prompt is constructed, **Then** caption text remains delimited as data and cannot override system generation rules.
4. **Given** speaker attribution that cannot be proven automatically, **When** the draft is returned, **Then** it carries a human-review warning and cannot be considered approved.

---

### User Story 3 - Keep drafts private and reviewable (Priority: P1)

The editor can preview the generated environment lesson and understand why it is
not yet a public lesson. The draft persists its source, environment, events,
transfer task, model, warnings, owner, and review state.

**Why this priority**: Private persistence and visible uncertainty form the
boundary between assisted authoring and autonomous publication.

**Independent Test**: Two authenticated users cannot read or mutate one another's
drafts, and the public catalog query excludes all `ai_draft` records.

**Acceptance Scenarios**:

1. **Given** a generated draft, **When** it is saved, **Then** `is_public` is false and `review_state` is `ai_draft`.
2. **Given** another authenticated user, **When** they query or update the draft, **Then** RLS denies access.
3. **Given** an owner viewing the draft, **When** the preview loads after a reload, **Then** environment, communication events, transfer task, and warnings remain present.
4. **Given** any ordinary authenticated user, **When** they attempt to set the draft public or approved, **Then** RLS blocks the change.

---

### User Story 4 - Preview a natural lesson loop (Priority: P2)

The editor can run the private draft through a learner-like preview: see the
communication environment, watch through official playback, retrieve source
language, say it aloud, and attempt a changed-context response.

**Why this priority**: A structurally valid draft may still be pedagogically
incoherent. Preview exposes that before review and publication.

**Independent Test**: The preview cannot reach completion through quiz answers
alone; it requires phrase production acknowledgement and a transfer attempt.

**Acceptance Scenarios**:

1. **Given** a draft with environment data, **When** preview starts, **Then** the situation, learner role, partner role, and practical goal appear before activities.
2. **Given** the learner-like preview reaches speaking, **When** audio assessment is unavailable, **Then** the UI asks the user to speak and self-confirm without claiming a score.
3. **Given** the preview reaches transfer, **When** no response attempt is made, **Then** completion remains blocked.
4. **Given** the preview completes, **Then** the result is labelled immediate practice evidence, not mastery or delayed transfer.

### Edge Cases

- Source URL is malformed, unsupported, private, age-restricted, unavailable, or
  cannot be embedded.
- Transcript evidence is missing, empty, non-English, auto-translated, heavily
  misaligned, or contains HTML entities and caption artifacts.
- The transcript is longer than the model context budget or contains no clear
  interaction.
- Gemini returns no candidate, invalid JSON, truncated JSON, unsupported level,
  invalid color, duplicate transcript indices, or excessive activity counts.
- Gemini returns valid source phrases but assigns them to the wrong speaker.
- oEmbed returns no channel URL or incomplete metadata.
- Database persistence fails after generation succeeds.
- Migration is not applied to hosted Supabase while code expects new columns.
- Existing rows were automatically public under the previous schema.
- Two generation requests for the same source create slug or ownership conflicts.
- The current transcript adapter relies on unapproved scraping behavior.

## Requirements

### Functional Requirements

- **FR-001**: Generation MUST require an authenticated user before transcript or Gemini work begins.
- **FR-002**: Input URL and target level MUST be validated by a typed schema.
- **FR-003**: Transcript acquisition MUST use a replaceable adapter with an explicit acquisition mode and review status.
- **FR-004**: Any adapter not approved for production rights and reliability MUST be labelled experimental and disabled from public publication flows.
- **FR-005**: Caption text MUST be normalized, bounded, and delimited as untrusted data in the model prompt.
- **FR-006**: The compiler MUST select a segment no longer than 180 seconds and no more than the configured item limit.
- **FR-007**: Segment selection MUST favor interaction signals while remaining deterministic and testable.
- **FR-008**: Gemini output MUST use a structured response schema and MUST pass runtime schema validation.
- **FR-009**: The lesson draft MUST contain an environment, learner role, partner role, real-world goal, communication events, transcript, activities, transfer task, and review warnings.
- **FR-010**: Every learner-facing English quote, answer key, transcript segment, and timestamp MUST pass source-evidence validation.
- **FR-011**: Unsupported content MUST reject the draft before database persistence.
- **FR-012**: Speaker attribution, transcript accuracy, rights, source suitability, and pedagogy MUST remain human-review requirements.
- **FR-013**: Successful drafts MUST be owner-private, `is_public = false`, and `review_state = ai_draft`.
- **FR-014**: RLS MUST prevent one user from reading, updating, or deleting another user's draft.
- **FR-015**: Ordinary authenticated users MUST NOT be able to mark a draft approved or public.
- **FR-016**: Public catalog queries MUST exclude private drafts.
- **FR-017**: The compiler MUST store the actual model identifier used and generation warnings.
- **FR-018**: Database changes MUST use a versioned migration and app types MUST cover Real Talk tables without manually editing generated Supabase types.
- **FR-019**: Generation failures MUST not create partial public records.
- **FR-020**: The preview MUST use official source playback and MUST NOT download or re-host source media.
- **FR-021**: Preview completion MUST require a changed-context production attempt.
- **FR-022**: Preview feedback MUST NOT call self-confirmed speech a pronunciation score or mastery evidence.
- **FR-023**: The system MUST expose explicit unresolved warnings when live source, transcript, speaker, rights, or pedagogical review has not occurred.
- **FR-024**: The implementation MUST include unit or contract tests for schema validation, evidence validation, segment selection, authentication gate, persistence privacy, and preview completion.

### Key Entities

- **Generation Request**: Authenticated owner, source URL, target level, request time, and rate-limit state.
- **Transcript Source**: Adapter, acquisition mode, language, reviewed status, raw cues, and source window.
- **Source Window**: Selected start/end, cues, interaction score, and source identity.
- **Generated Lesson Draft**: Structured AI output before evidence validation.
- **Lesson Draft Record**: Persisted owner-private draft with review state and warnings.
- **Environment**: Situation, roles, and practical goal.
- **Communication Event**: Type, description, and referenced transcript segments.
- **Transfer Task**: Changed situation, learner goal, prompt, criteria, and source-supported language.
- **Review Warning**: Machine-readable unresolved risk that blocks approval.

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of generation requests that reach Gemini belong to an authenticated user.
- **SC-002**: 100% of persisted generated lessons are private `ai_draft` records.
- **SC-003**: 0 generated drafts appear in the public catalog before a future authorized publication feature.
- **SC-004**: The compiler rejects all test fixtures containing unsupported transcript text, quoted phrases, timestamps, answer keys, or transfer language.
- **SC-005**: A controlled valid source fixture produces a complete draft preview in one request without manual JSON repair.
- **SC-006**: A second user cannot select, update, approve, publish, or delete the first user's draft in RLS verification.
- **SC-007**: A persisted draft reloads without losing environment, communication events, transfer task, generation model, or warnings.
- **SC-008**: Preview completion cannot occur without a changed-context production attempt.
- **SC-009**: All repository lint, type, unit, content-standard, and relevant integration checks pass on the exact final commit before convergence is declared.
- **SC-010**: A manual review can identify the source, selected window, model, evidence warnings, and unresolved human checks without reading server logs.

## Assumptions

- Existing authentication, Supabase, rate-limit, Real Talk UI, and official YouTube player are reused.
- Gemini remains the initial generation provider but is accessed behind a bounded service contract.
- The current `youtube-transcript` adapter is experimental; production approval of caption acquisition is outside this feature and remains a required decision.
- This feature does not publish lessons, sequence curriculum, award XP, schedule FSRS, or store learner audio.
- A best-effort preview is useful even before a full reviewer interface exists, provided it remains private and visibly unapproved.
