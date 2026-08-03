# Private Draft Retention, Deletion, and History Decision

**Decision date:** 2026-08-03  
**Scope:** Spec 001 private `ai_draft` records only  
**Application deployment:** none  
**Schema migration:** none

## Decision

### 1. Retention

A private draft has no automatic expiry in Spec 001. The current draft remains
stored until its owner explicitly deletes it or a later approved policy changes
the retention rule.

This is not a claim that indefinite retention is the permanent product policy. It
is the smallest honest rule while AtoEnglish has:

- no approved background expiry job;
- no draft-management inbox with expiry warnings;
- no evidence that editors expect work to disappear automatically;
- one current draft per owner, source, and level rather than unbounded versions.

A later retention change must include advance user-visible notice, a migration
plan, and owner-approved product requirements. Silent expiry is not allowed.

### 2. Owner deletion UX

The future private-draft management surface must expose an owner-only destructive
action labelled plainly as **Delete private draft**.

The interaction contract is:

1. show the source title, requested level, and private status;
2. state that the lesson draft will also be deleted;
3. require a deliberate confirmation action distinct from ordinary navigation;
4. execute deletion under the authenticated owner session and existing RLS;
5. delete the `real_talk_videos` row and rely on the verified foreign-key cascade
   to remove its one lesson row;
6. return a success result only after the database confirms deletion;
7. show a safe error without claiming deletion when the write fails.

There is no ordinary-user delete-by-ID service-role bypass. Another user and an
anonymous visitor must remain unable to see or delete the draft.

Spec 001 records this UX contract but does not add a broad draft-library screen.
The deletion control belongs with the first approved owner draft-management
surface. Until that surface exists, deletion remains a known operational gap and
must not be represented as user-accessible.

### 3. Generation-attempt history

Spec 001 does not preserve immutable full generation-attempt history.

Repeated generation for the same authenticated owner, source, and level updates
the same current private video/lesson pair through the atomic persistence path.
The system must not create a new draft row merely because the AI title or lesson
content changed.

Failed or superseded attempts must not be stored as full transcripts, model
outputs, prompts, or lesson payloads. Bounded operational telemetry may record a
safe failure code, model identifier, timing, and request outcome only when it
contains no secret, source transcript, generated lesson body, personal name,
employer, or unrestricted free text.

A future immutable history feature requires a separate approved spec defining:

- its concrete reviewer or audit use case;
- data minimization and retention period;
- owner visibility and deletion behavior;
- provenance and model-version semantics;
- storage growth and cost limits;
- migration, RLS, and tamper-evidence tests.

## Rationale

This decision preserves the Spec 001 vertical slice:

```text
one owner + one source + one level
→ one current private draft
→ atomic replacement on regeneration
→ explicit owner deletion in a future management surface
```

It avoids three unsupported expansions:

- a scheduler solely to expire drafts;
- a draft-library redesign inside the compiler PR;
- an append-only archive of sensitive source and AI payloads without a proven
  reviewer need.

The decision follows the constitution's privacy-by-default, honest-claims, and
small independently testable delivery principles.

## Alternatives rejected

### Automatic 30-, 60-, or 90-day expiry

Rejected for Spec 001 because no warning, recovery, management UI, or scheduler is
approved. Automatic deletion would create surprising data loss without learner or
editor evidence.

### Retain every generation forever

Rejected because it creates unbounded sensitive derivative storage, additional
RLS and deletion obligations, and no demonstrated product value.

### Soft-delete current drafts

Rejected for the current private-only state because it retains data after the
owner believes it was deleted and requires recovery/admin semantics not defined by
this spec. A later reviewed/public state may need different rules.

### Immediate delete UI inside the generation form

Deferred. Deletion must live in a surface where the owner can identify the exact
persisted draft and understand the consequence, rather than as an easy-to-trigger
control beside generation.

## Consequences

- No retention scheduler or new table is introduced.
- The atomic upsert remains one-current-draft persistence, not version history.
- Owner deletion is a required contract for the first draft-management surface,
  but is not falsely claimed available now.
- Publication, reviewed history, and public-record retention remain outside Spec
  001.
- T051/T067 hosted atomic verification remains separate and still requires explicit
  migration authorization.
