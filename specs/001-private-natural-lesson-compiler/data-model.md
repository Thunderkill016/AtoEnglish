# Data Model: Private Natural Lesson Compiler

## State model

```text
request_received
→ source_resolved
→ transcript_window_selected
→ model_generated
→ schema_validated
→ evidence_validated
→ ai_draft_persisted
→ owner_previewed

Any failure before ai_draft_persisted
→ generation_failed
→ no public record
```

Publication states are intentionally incomplete in this feature:

```text
ai_draft
→ future human review in spec 002
```

An ordinary authenticated user cannot move a record beyond `ai_draft`.

## Entities

### GenerationRequest

Represents one authenticated request to compile a draft.

| Field | Type | Rules |
|---|---|---|
| ownerId | UUID | Derived from Supabase Auth; never client supplied |
| sourceUrl | string | Validated supported URL, bounded length |
| requestedLevel | enum | A0, A1, A2, B1, or B2 |
| requestedAt | timestamp | Server generated |
| requestKey | string | Rate-limit identity; must not expose secrets |
| status | enum | received, rejected, generated, persisted, failed |
| failureCode | string? | Machine-readable external or validation failure |

### TranscriptSource

Describes how timed text was obtained. It is evidence metadata, not proof of
correctness or rights.

| Field | Type | Rules |
|---|---|---|
| adapter | string | Concrete provider/adapter identifier |
| acquisitionMode | enum | creator_provided, authorized_export, licensed_source, public_domain, human_reviewed_upload, experimental_unofficial |
| language | string | Expected English for this feature |
| reviewStatus | enum | unreviewed, machine_checked, human_verified |
| sourceReference | string | Stable source reference without secret tokens |
| cues | TranscriptCue[] | Bounded timed cues |
| warnings | string[] | Must include experimental/reliability warnings when applicable |

### TranscriptCue

| Field | Type | Rules |
|---|---|---|
| text | string | Normalized and bounded |
| offset | number | Seconds, finite, non-negative |
| duration | number | Seconds, finite, positive |
| end | derived | offset + duration |

### SourceWindow

| Field | Type | Rules |
|---|---|---|
| startSeconds | number | First selected cue offset |
| endSeconds | number | Maximum selected cue end |
| cueCount | integer | At least 2, within configured maximum |
| interactionScore | number | Deterministic diagnostic only |
| cues | TranscriptCue[] | Contiguous source subset |
| sourceText | string | Normalized evidence corpus for automated checks |

### SourceMetadata

| Field | Type | Rules |
|---|---|---|
| provider | enum | youtube for current implementation |
| externalId | string | 11-character video ID for YouTube |
| title | string | oEmbed value or honest fallback |
| channelName | string? | oEmbed value |
| channelUrl | string? | oEmbed author URL; never fabricated from video ID |
| thumbnailUrl | string? | Provider thumbnail URL |
| watchUrl | string | Official source URL |
| embedUrl | string | Official embed URL |
| availabilityStatus | enum | unchecked, available, unavailable |

### GeneratedLessonDraft

Model output before source-evidence validation.

| Field group | Required content |
|---|---|
| identity | title, Vietnamese title, target level, estimated minutes |
| capability | can-do statement in English and Vietnamese |
| environment | title, situation, learner role, partner role, real-world goal |
| speakers | labels and display colors |
| transcript | indexed, timed, translated segments |
| communicationEvents | type, Vietnamese description, transcript references |
| preWatch | context, bounded useful vocabulary, prediction, optional sound alerts |
| whileWatch | gist, source focus points, key moments |
| postWatch | comprehension, retrieval, source-backed speaking drills, notes |
| transferTask | changed situation, goal, prompt, criteria, supported language |

### EvidenceValidationResult

| Field | Type | Rules |
|---|---|---|
| valid | boolean | True only when failureCodes is empty |
| failureCodes | string[] | Deduplicated machine-readable failures |
| warnings | string[] | Human-review requirements and non-blocking uncertainty |
| selectedWindow | SourceWindow | Exact evidence used |

Expected failure codes include:

- invalid_transcript_time_range
- transcript_outside_source_window
- transcript_missing_source_evidence
- duplicate_transcript_index
- unknown_speaker_label
- activity_references_unknown_segment
- vocabulary_missing_source_evidence
- key_moment_outside_source_window
- speaking_drill_missing_source_evidence
- fill_blank_missing_source_evidence
- transfer_language_missing_source_evidence

### RealTalkVideoDraftRecord

Maps to `real_talk_videos` for this feature.

| Field | Type | Rules |
|---|---|---|
| id | UUID | Database generated |
| slug | string | Unique; collision behavior remains open decision |
| youtubeId | string | Source external ID |
| title/titleVi | string | Source and draft display titles |
| channel fields | string? | From oEmbed, never fabricated |
| durationSeconds | integer | Derived from transcript evidence, not guaranteed media duration |
| segmentStart/End | decimal | Selected source window |
| level | enum/string | Requested and validated level |
| topics | string[] | Bounded draft topics |
| speakers | JSON | Draft labels; human review required |
| createdBy | UUID | Authenticated owner |
| isPublic | boolean | MUST be false |
| reviewState | enum | MUST be ai_draft in this feature |
| sourceMode | string | Transcript acquisition mode |
| sourceWarnings | string[] | Experimental and review warnings |
| generationModel | string | Actual successful model |

### RealTalkLessonDraftRecord

Maps to `real_talk_lessons`.

| Field | Type | Rules |
|---|---|---|
| videoId | UUID | References owner-private video draft |
| title/titleVi | string | Draft lesson identity |
| level | string | Validated level |
| estimatedMinutes | integer | Bounded 8–25 |
| canDo fields | string | Observable communication outcome |
| environment | JSON | Persisted and reloadable |
| communicationEvents | JSON[] | Persisted and reloadable |
| transcript | JSON[] | Validated draft transcript |
| preWatch/whileWatch/postWatch | JSON | Activity structures |
| transferTask | JSON | Required changed-context task |
| generationWarnings | JSON/string[] | Human-review blockers |
| generationModel | string | Actual successful model |
| createdAt/updatedAt | timestamp | Server/database managed |

## Relationships

```text
auth.users 1 ── * real_talk_videos (created_by)
real_talk_videos 1 ── 1 real_talk_lessons (video_id)
TranscriptSource 1 ── 1 SourceWindow
SourceWindow 1 ── 1 GeneratedLessonDraft
GeneratedLessonDraft 1 ── 1 EvidenceValidationResult
```

Private ownership is inherited from the video record. Lesson RLS MUST verify the
owner through the referenced video record.

## Invariants

1. `created_by = auth.uid()` for user-created drafts.
2. `is_public = false` for all records created in this feature.
3. `review_state = ai_draft` for ordinary user inserts and updates.
4. Lesson insert/update requires ownership of the referenced private video.
5. Public catalog reads include only explicitly public records.
6. Every transcript activity reference points to a known transcript index.
7. Every draft timestamp falls inside the selected source window.
8. Every quoted learner-facing English item has source-text evidence.
9. Environment, events, transfer, warnings, and model survive persistence and reload.
10. Generation failure does not leave a public or ownerless record.

## Retention and deletion

Draft retention is unresolved. Until a later decision:

- no automated expiry is specified;
- owners may delete their own private drafts when an owner UI exists;
- deleting a video draft cascades to its lesson draft;
- published/historical retention belongs to spec 002 and later learner evidence specs.
