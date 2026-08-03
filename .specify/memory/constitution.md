# AtoEnglish Constitution

## Core Principles

### I. Natural Communication First

AtoEnglish MUST begin from a real communication environment, the people involved,
their practical goal, and the communication events that actually occur. Product
surfaces MUST NOT begin from a grammar syllabus, a vocabulary list, or a search
for clips containing a preselected teaching phrase.

The learner-facing experience presents situations such as meeting someone,
ordering, asking for help, handling misunderstanding, or continuing a
conversation. Grammar, vocabulary, pronunciation support, sequencing, and review
remain invisible infrastructure that helps the learner act in those situations.

A source may be natural while the curriculum remains intentionally ordered. The
system MUST annotate what happened in the source before mapping it to a capability.
It MUST NOT alter, manufacture, or overinterpret the source to fill a curriculum
gap.

### II. Evidence-Bound Generation

AI output is a draft, never source truth. Every quoted phrase, transcript segment,
timestamp, speaker claim, activity answer, vocabulary example, and cultural claim
shown to a learner MUST be traceable to reviewed evidence.

Generated content MUST pass a typed schema and source-evidence validation before
it can be stored. Publication additionally requires explicit human review of
source suitability, transcript accuracy, speaker attribution, timestamps,
rights/provenance, age appropriateness, and pedagogical coherence.

The system MUST preserve uncertainty. Missing evidence creates a review block or
coverage gap; it MUST NOT be replaced by confident fabrication.

### III. Transfer Before Completion

Recognition, watching, repetition, quiz accuracy, and immediate transcript match
are not sufficient evidence that a learner can communicate.

Every core lesson MUST culminate in a learner production attempt that pursues the
same communicative goal with changed data, a changed partner, or a changed
context. Support MUST decrease before the final attempt. Completion records MUST
distinguish immediate practice from delayed retention and transfer.

The product MUST use honest labels. Browser speech-to-text similarity is sentence
match, not pronunciation assessment. A single lesson does not prove CEFR level,
fluency, mastery, or long-term retention.

### IV. Rights, Privacy, and Safety by Default

AtoEnglish MUST use lawful source access and official playback mechanisms. It MUST
NOT download or re-host YouTube audio/video, bypass access controls, or treat a
public URL as permission to store media, captions, or derivatives.

AI-generated lessons are owner-private drafts by default. Public publication
requires a separate approval path. Raw learner recordings, unrestricted learner
transcripts, names, employers, and free text MUST NOT be stored by default.
Authentication is derived server-side, external input is validated, Row Level
Security remains enabled, and all schema changes use versioned migrations.

Sensitive, dangerous, humiliating, deceptive, or age-inappropriate source
contexts are rejected unless a separately approved product requirement and safety
review justify them.

### V. Small, Independently Testable Delivery

Work MUST be decomposed into prioritized user stories that can be implemented,
tested, demonstrated, and stopped independently. A feature is not allowed to
become a broad rewrite simply because adjacent code is inconvenient.

Tests and acceptance scenarios are specified before implementation for product,
security, data, and learning-critical behavior. Implementation proceeds in the
smallest coherent vertical slice. Existing behavior outside the active spec is
preserved unless the spec explicitly changes it.

AtoEnglish remains a modular monolith. New abstraction, infrastructure,
dependency, service, or generalized framework requires a measured blocker and a
simpler alternative analysis.

### VI. Measurable Learner and Product Evidence

Technical correctness is necessary but not sufficient. Each feature MUST define
technology-agnostic success criteria tied to a learner action or an operational
outcome.

Evidence is evaluated in this order:

1. technical evidence: schema, security, tests, and runtime behavior;
2. lesson evidence: source, tasks, feedback, and outcome alignment;
3. learner evidence: completion, retry, delayed recall, and changed-context use;
4. product evidence: return, willingness to pay, renewal, and referral.

Repository checks MUST never be presented as proof of learning effectiveness or
market demand.

## Product and Technical Constraints

- Primary learner: Vietnamese adults who recognize some English but struggle to
  follow and use it in natural daily or workplace interactions.
- Primary product surface: Real Talk natural communication environments.
- Current stack: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Supabase,
  Vitest, Playwright, and Vercel.
- Source playback uses an official embed or direct source link.
- AI content generation requires authenticated use, rate limits, typed output,
  evidence checks, private-draft persistence, and a human publication gate.
- Database writes derive the user from Supabase Auth and remain protected by RLS.
- Generated Supabase types are never edited manually.
- Raw audio storage, phoneme-level claims, autonomous publication, unrestricted
  chat tutors, broad curriculum rewrites, payments, social systems, and native
  apps are outside the current rebuild unless a later approved spec changes this.

## Spec-Driven Development Workflow

Every non-trivial product change MUST have an active directory under `specs/`.
The required sequence is:

```text
constitution
→ specification
→ clarification when needed
→ implementation plan
→ research and design artifacts
→ dependency-ordered tasks
→ cross-artifact analysis
→ implementation by user story
→ convergence and review
```

Each feature directory MUST contain:

- `spec.md` with prioritized, independently testable user stories;
- `plan.md` with technical context and a constitution check;
- `tasks.md` with exact file paths and dependency order;
- `research.md`, `data-model.md`, `quickstart.md`, and `contracts/` when relevant;
- `checklists/requirements.md` for requirement-quality review.

No implementation task may be marked complete merely because code exists. The
specified acceptance evidence must have been observed. Unrun lint, type checks,
tests, migrations, browser flows, external API calls, and human reviews remain
unchecked.

Pull requests MUST reference the active spec and list completed and incomplete
tasks. Agents MUST NOT merge or deploy automatically.

## Governance

This constitution is the highest-level development authority for AtoEnglish.
When older product documents, plans, comments, or code imply a conflicting
direction, the conflict MUST be resolved in the constitution or active spec
before implementation continues.

Amendments require:

1. a documented reason and affected specs;
2. owner approval;
3. a migration or remediation note for conflicting work;
4. semantic versioning of this constitution.

Version rules:

- MAJOR: removes or redefines a governing principle;
- MINOR: adds a principle or materially expands mandatory governance;
- PATCH: clarification without changing required behavior.

Every plan MUST include a constitution check before research and after design.
Every review MUST verify that implementation and evidence remain compliant.

**Version**: 1.0.0 | **Ratified**: 2026-08-02 | **Last Amended**: 2026-08-02
