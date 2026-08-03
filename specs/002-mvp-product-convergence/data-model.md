# Data Model: YouTube-to-Private-Lesson MVP

## Design Rules

- Hosted Supabase project `zpiwddskhduuykpxltun` remains the source of truth.
- Authentication and ownership are derived server-side.
- Every generated lesson is private by default and cannot be self-approved or
  automatically published.
- Source-dependent content remains traceable to a selected timed transcript window.
- Generation and progress writes are idempotent.
- RLS remains enabled.
- Raw audio, unrestricted learner speech/transfer text, names, employers, and
  arbitrary analytics JSON are not stored.
- Existing hosted private-draft schema is reused where its exact contract matches.

## Existing Entities Reused

### `auth.users`

Supabase Auth identity. All generation and private read/write operations derive the
current user from the authenticated session.

### Minimal account/profile state

Reuse `public.user_progress` or an equivalent minimal bootstrap row only if needed
by the shell. XP, streak, CEFR, league, and daily-goal fields are not required by
the MVP UI.

Bootstrap must be server-owned, transactional/idempotent, and shared by email and
OAuth.

### `public.real_talk_videos`

For the private-generation MVP this table is the source/video container and draft
owner boundary.

Required semantics:

- `id`: generated UUID
- `created_by`: authenticated owner
- `slug`: deterministic owner-safe lesson route identity
- `youtube_id`: normalized YouTube video ID
- canonical source URL and metadata
- official thumbnail/channel/title where available
- selected `segment_start` / `segment_end`
- target level
- transcript acquisition mode and review/status metadata
- transcript cue digest and source metadata
- `is_public = false`
- creation timestamp

The existing atomic RPC and constraints must be verified against these semantics.

### `public.real_talk_lessons`

Stores the structured private lesson generated from the selected source window.

Required semantics:

- `video_id`
- generated titles and level
- environment and roles
- communication events with transcript references
- transcript cues/segments required by runtime
- pre/while/post or equivalent activity structures
- transfer task
- generation model
- generation warnings
- generation status / review state equal to private `ai_draft`
- `reviewed_by` / `reviewed_at` null for ordinary generated drafts
- creation timestamp

A private draft may be used by its owner with warnings. It is not eligible for
public catalog queries without a later human-review/publication flow.

### `public.real_talk_transcript_sources`

This reviewed-source registry remains useful for controlled tests, approved source
re-use, and future public publication. It is not required to turn every user's
private YouTube URL into a draft if equivalent provenance fields and cue evidence
are stored with the private draft.

The implementation must choose one explicit provenance path rather than silently
mixing reviewed and experimental states.

### `public.pilot_events`

May store a small allow-listed generation/lesson funnel. Payloads remain bounded
and privacy-safe.

## Generation Request Domain Model

The client sends no user ID.

```ts
interface GeneratePrivateLessonInput {
  youtubeUrl: string;
  level: "A0" | "A1" | "A2" | "B1" | "B2";
}
```

Server-derived context:

```ts
interface GenerationContext {
  userId: string;
  normalizedYoutubeId: string;
  requestIpBucket: string;
  requestedAt: string;
}
```

Validated request identity:

```text
owner user ID
+ normalized YouTube video ID
+ selected level
+ compiler contract version
```

This identity supports retry-safe deterministic persistence. Exact slug/unique-key
behavior must match the hosted atomic RPC.

## Transcript Source Record

The compiler receives an explicit transcript result:

```ts
interface TranscriptSourceResult {
  adapterId: string;
  acquisitionMode: string;
  reviewStatus: "unreviewed" | "machine_checked" | "human_verified";
  language: "en";
  videoId: string;
  canonicalUrl: string;
  cues: Array<{
    index: number;
    startSeconds: number;
    durationSeconds: number;
    text: string;
  }>;
  cueDigest: string;
  warnings: string[];
}
```

Rules:

- timed English cues are required;
- cue count/duration is bounded;
- HTML/caption artifacts are normalized deterministically;
- transcript text is treated as untrusted data in prompts;
- adapter/mode/status/warnings survive persistence;
- unsupported source conditions return machine-readable errors, not an empty
  transcript disguised as success.

## Selected Source Window

```ts
interface InteractionWindow {
  startSeconds: number;
  endSeconds: number;
  cueIndices: number[];
  interactionScore: number;
  selectionVersion: string;
}
```

Constraints:

- duration <= 180 seconds;
- cue count <= configured maximum;
- start/end align to selected cues;
- deterministic for the same normalized transcript and selection version;
- interaction-rich selection is preferred over a fixed opening slice.

## Generation Result

Use an explicit discriminated union with stable codes:

```ts
type GenerateLessonResult =
  | { ok: true; lessonSlug: string; videoId: string; lessonId: string; warnings: string[] }
  | { ok: false; code: GenerateLessonFailureCode; message: string; retryable: boolean; retryAfterSeconds?: number };
```

Required failure families:

- unauthenticated
- invalid URL / unsupported host
- source unavailable/private/age-restricted/embed-disabled
- transcript unavailable/empty/non-English/invalid timing
- transcript adapter failure
- rate limited
- Gemini unavailable/rate limited/invalid structured output
- evidence validation failure
- persistence failure
- unknown safe failure

Failure results must not leak secrets, provider payloads, or internal stack traces.

## Private Draft Invariants

After successful persistence:

```text
video.created_by = auth.uid()
video.is_public = false
lesson state = ai_draft
lesson reviewed_by/reviewed_at = null
source identity and selected window are persisted
adapter/mode/cue digest are persisted
actual Gemini model and warnings are persisted
video + lesson are written atomically
```

Ordinary users cannot:

- set `is_public = true`;
- mark a lesson reviewed/approved;
- access another owner's draft;
- substitute another user ID;
- change immutable source identity after persistence.

## Account Bootstrap Contract

One server operation derives the current Auth user and ensures only the minimum
application records exist.

It must not silently store unasked goal/time/obstacle defaults or grant content
review/publication permissions.

## Private Library Read Model

```ts
interface PrivateLessonLibraryState {
  primaryAction: { kind: "generate" };
  recentLessons: Array<{
    slug: string;
    youtubeId: string;
    sourceTitle: string;
    lessonTitleVi: string;
    level: string;
    generationState: "ready" | "failed";
    learningState: "not_started" | "in_progress" | "completed";
    warningCount: number;
    createdAt: string;
    updatedAt: string;
  }>;
  continueLesson?: {
    slug: string;
    checkpoint: string;
  };
}
```

No public/shared catalog is required.

## Bounded Learner Attempt

First evaluate strict reuse of existing evidence storage. If insufficient, add
`public.real_talk_attempts`.

| Column | Type | Rule |
| --- | --- | --- |
| `id` | uuid | generated primary key |
| `user_id` | uuid | owner, derived from Auth |
| `lesson_id` | uuid | FK private lesson |
| `status` | text | `started`, `in_progress`, `completed` |
| `checkpoint` | text | bounded enum |
| `first_listen_completed` | boolean | default false |
| `comprehension_correct` | integer | bounded >= 0 |
| `comprehension_total` | integer | bounded >= correct |
| `max_support_level` | integer | bounded support scale |
| `retrieval_attempted` | boolean | default false |
| `speak_confirmed` | boolean | self-confirm only |
| `transfer_attempted` | boolean | default false |
| `started_at` | timestamptz | required |
| `updated_at` | timestamptz | required |
| `completed_at` | timestamptz | nullable; gated |

Unique key:

```text
unique (user_id, lesson_id)
```

Completion requires first listen, retrieval, speak confirmation, transfer, and
`completed_at`.

RLS restricts every read/write to `user_id = auth.uid()` and ensures the referenced
lesson belongs to the same owner.

## Pilot Event Allow-List

```text
mvp_landing_viewed
mvp_auth_completed
mvp_generation_submitted
mvp_source_validated
mvp_transcript_acquired
mvp_generation_succeeded
mvp_generation_failed
mvp_private_lesson_opened
mvp_first_listen_completed
mvp_support_revealed
mvp_retrieval_attempted
mvp_speak_confirmed
mvp_transfer_attempted
mvp_lesson_completed
mvp_returned
```

Allowed payloads are bounded IDs, enum codes, booleans, counts, durations, support
levels, and timestamps. No URL query data, transcript text, learner response text,
audio, email, name, or provider secret is allowed.

## Migration and Hosted Verification

Before applying any new DDL:

1. compare repo migrations/types to hosted schema;
2. verify existing atomic draft RPC and RLS with two users;
3. decide whether a new attempt table is necessary;
4. use versioned migrations only;
5. obtain explicit owner authorization;
6. regenerate types from `zpiwddskhduuykpxltun`;
7. run security/performance advisors;
8. record rollback and cleanup;
9. confirm Vercel preview uses the same project.

The old unapplied `20260731162613_learning_attempts.sql` is not adopted by default.