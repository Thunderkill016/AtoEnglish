# Feature Specification: AtoEnglish Spec-Driven Rebuild Roadmap

**Feature Branch**: `agent/rebuild-learning-core`

**Created**: 2026-08-02

**Status**: Active roadmap

**Input**: Rebuild AtoEnglish as a Vietnamese-first natural communication product, using GitHub Spec Kit to govern product direction and incremental delivery.

## User Scenarios & Testing

### User Story 1 - Learn inside a natural communication environment (Priority: P1)

A Vietnamese learner chooses a practical environment, watches a short real
interaction, understands what the people are trying to do, retrieves useful
language, and makes a response in a changed situation.

**Why this priority**: This is the core learner value. Without it, AtoEnglish is
only a video catalog, quiz site, or academic course.

**Independent Test**: A learner can complete one environment from source playback
through a transfer attempt without opening a grammar unit or receiving a false
mastery claim.

**Acceptance Scenarios**:

1. **Given** a reviewed lesson, **When** the learner starts it, **Then** the learner sees the situation, their role, the partner role, and the real-world goal before instruction.
2. **Given** the learner has watched and practiced, **When** they reach the final task, **Then** they must produce a response with changed data or context before completion.
3. **Given** browser speech assessment is unavailable, **When** the learner practices, **Then** the product offers an honest fallback without fabricating a pronunciation score.

---

### User Story 2 - Compile a real source into a private evidence-bound draft (Priority: P1)

An authenticated editor supplies an approved source reference and transcript
evidence. The system uses AI to propose an environment lesson, validates it, and
stores it as an owner-private draft.

**Why this priority**: The product cannot scale natural content safely if AI output
is trusted or published automatically.

**Independent Test**: A supported source can produce a private draft, while
unsupported phrases, timestamps, transcript segments, and anonymous requests are
rejected.

**Acceptance Scenarios**:

1. **Given** an authenticated editor and valid source evidence, **When** generation succeeds, **Then** the result is schema-valid, evidence-checked, private, and marked as AI draft.
2. **Given** generated language absent from the source, **When** validation runs, **Then** the draft is rejected with explicit evidence failures.
3. **Given** an anonymous user, **When** they request generation, **Then** no Gemini quota is consumed and no draft is written.

---

### User Story 3 - Review and publish only trustworthy lessons (Priority: P1)

A human reviewer inspects source suitability, transcript accuracy, timestamps,
speakers, rights, safety, and learning design before a lesson becomes visible in
the public catalog.

**Why this priority**: Private AI drafts are not a product catalog. Publication
quality is a separate capability and risk boundary.

**Independent Test**: A reviewer can approve or reject a draft using a complete
checklist, and no unapproved draft appears publicly.

**Acceptance Scenarios**:

1. **Given** an AI draft, **When** any required review item is unresolved, **Then** publication remains blocked.
2. **Given** all required review items are approved by an authorized reviewer, **When** publication is confirmed, **Then** the lesson becomes public with source attribution and review history.
3. **Given** a published lesson is later revoked or broken, **When** it is retired, **Then** it disappears from new learning sessions without deleting historical learner evidence.

---

### User Story 4 - Follow an invisible capability progression (Priority: P2)

The learner is recommended the next environment based on communication
capabilities, prior evidence, and difficulty, without being forced through a
visible grammar syllabus.

**Why this priority**: Natural content without sequencing becomes random content
consumption rather than learning progression.

**Independent Test**: After one lesson, the learner receives a next lesson that
retrieves an existing capability and adds one bounded challenge.

**Acceptance Scenarios**:

1. **Given** completed learner evidence, **When** the next lesson is selected, **Then** the system uses capability prerequisites and not only topic or CEFR labels.
2. **Given** a capability lacks suitable natural sources, **When** coverage is evaluated, **Then** the system records a coverage gap rather than forcing an unsuitable clip.

---

### User Story 5 - Return for delayed transfer and review (Priority: P2)

The learner returns after a delay and must understand a new speaker or respond in
a related but changed interaction.

**Why this priority**: Immediate completion does not demonstrate retention or
transfer.

**Independent Test**: A learner receives a delayed task with less support and the
result is recorded separately from the original lesson score.

**Acceptance Scenarios**:

1. **Given** a completed lesson, **When** its review becomes due, **Then** the learner receives a new-speaker or changed-context task.
2. **Given** a delayed attempt, **When** it is recorded, **Then** immediate comprehension, productive recall, interactional use, and delayed transfer remain distinct evidence fields.

---

### User Story 6 - Make product decisions from evidence (Priority: P3)

The owner can see whether target learners start, complete, retry, return, transfer,
and choose continued practice without collecting unnecessary personal data.

**Why this priority**: Feature count, XP, and test count do not prove that the
product helps learners or deserves continued investment.

**Independent Test**: A pilot report can be produced from privacy-bounded events
without raw recordings, unrestricted transcripts, names, or employers.

**Acceptance Scenarios**:

1. **Given** pilot activity, **When** evidence is summarized, **Then** technical, lesson, learner, and product evidence are reported separately.
2. **Given** no improvement or return evidence, **When** roadmap decisions are made, **Then** broader expansion is paused rather than justified by engagement vanity metrics.

### Edge Cases

- A source has captions but they are inaccurate, incomplete, auto-translated, or
  misaligned.
- A source is conversational but too advanced, sensitive, unsafe, or contextually
  inappropriate for the target learner.
- A source is natural but provides no useful transfer opportunity.
- Gemini returns valid JSON containing unsupported claims.
- The source later becomes unavailable, private, blocked, or rights-revoked.
- Browser speech recognition is unsupported or produces unstable transcripts.
- A learner completes recognition tasks but cannot produce a changed-context response.
- A communication capability is important but natural-source coverage is missing.

## Requirements

### Functional Requirements

- **FR-001**: The product MUST organize learner experiences around natural communication environments and observable real-world goals.
- **FR-002**: The system MUST represent communication events separately from grammar, vocabulary, and source metadata.
- **FR-003**: AI generation MUST produce private drafts only and MUST NOT publish autonomously.
- **FR-004**: Generated lesson content MUST pass typed schema validation and source-evidence validation before persistence.
- **FR-005**: Public lessons MUST pass explicit human review for source, transcript, timing, speakers, rights, safety, and pedagogy.
- **FR-006**: Every core lesson MUST contain comprehension, retrieval, production, changed-context transfer, and an immediate retry path.
- **FR-007**: The system MUST distinguish sentence transcript match from acoustic pronunciation assessment.
- **FR-008**: The system MUST preserve official source playback and MUST NOT download or re-host YouTube audio/video.
- **FR-009**: Generated drafts MUST be private to their owner and protected by server-derived authentication and RLS.
- **FR-010**: The curriculum MUST sequence capabilities invisibly while preserving source authenticity.
- **FR-011**: Missing natural coverage MUST be represented as a coverage gap, not filled with an unsuitable or fabricated source.
- **FR-012**: Immediate lesson evidence and delayed transfer evidence MUST be stored separately.
- **FR-013**: Product analytics MUST exclude raw recordings, unrestricted learner transcripts, names, employers, and free text by default.
- **FR-014**: Each roadmap capability MUST be delivered through an independently specified, testable, and reviewable feature slice.
- **FR-015**: No implementation may be declared complete until its specified technical and manual evidence has actually been observed.

### Key Entities

- **Source Asset**: Reference to lawful media playback, source provenance, availability, transcript evidence, and review state.
- **Communication Environment**: Situation, learner role, partner role, and real-world goal.
- **Communication Event**: An observed interactional behavior linked to source evidence.
- **Lesson Draft**: Private AI-assisted proposal containing environment, transcript, activities, evidence links, warnings, and review state.
- **Reviewed Lesson**: Approved public lesson derived from a draft and immutable review evidence.
- **Capability**: Observable communicative ability with prerequisites and coverage requirements.
- **Capability Evidence**: Comprehension, productive recall, interactional use, and delayed transfer observations.
- **Coverage Gap**: Required capability/context combination for which no acceptable source currently exists.
- **Learner Attempt**: Privacy-bounded record of task outcome, support level, retry, and timing.

## Success Criteria

### Measurable Outcomes

- **SC-001**: A target learner can complete one reviewed environment lesson and make a changed-context response in 10–15 minutes.
- **SC-002**: 100% of public lessons have complete source, transcript, timestamp, rights, safety, and pedagogy review records.
- **SC-003**: 0 AI-generated drafts become public without an explicit authorized publication action.
- **SC-004**: 100% of learner-facing quoted English and answer keys in generated drafts are traceable to reviewed source evidence.
- **SC-005**: At least 70% of pilot learners who complete a lesson can complete a related delayed transfer task with reduced support within seven days.
- **SC-006**: At least 60% of activated pilot learners return for a second environment within seven days.
- **SC-007**: Product decisions can be made from privacy-bounded evidence without storing raw learner audio or unrestricted free text.
- **SC-008**: Each roadmap phase can be stopped, reviewed, or rejected without requiring completion of later phases.

## Assumptions

- Existing Next.js, Supabase, authentication, and Real Talk code will be evolved rather than replaced wholesale.
- Official source playback remains online and available to the learner.
- Caption acquisition and derivative-use rights require an explicit production decision; current unreviewed transcript adapters remain experimental until approved.
- The initial pilot focuses on Vietnamese adults around A1–B1 and a small set of practical environments.
- Human review capacity is intentionally limited; catalog growth follows review throughput rather than generation throughput.
- No automatic merge or production deployment is part of this roadmap.
