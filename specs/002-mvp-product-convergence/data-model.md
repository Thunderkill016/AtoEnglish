# Data Model: AtoEnglish MVP Product Convergence

## Design Rules

- Hosted Supabase project `zpiwddskhduuykpxltun` remains the source of truth.
- RLS is enabled on every exposed table.
- Authenticated identity is derived server-side from `auth.uid()` / `getUser()`.
- Learner evidence is bounded and machine-readable; no raw audio, unrestricted
  transcript, name, employer, or free text is stored.
- Reviewed source evidence and learner attempts are separate domains.
- Publication and attempt writes are idempotent.
- Existing tables are reused only when their semantics match the MVP contract;
  legacy schema existence is not a reason to couple the MVP to XP/gamification.

## Existing Entities Reused

### `auth.users`

Supabase Auth identity. The application does not duplicate passwords or provider
credentials.

### `public.user_progress`

May remain the minimal account/profile bootstrap record if reduced to fields the
MVP actually needs. Existing XP, streak, and CEFR fields are tolerated but not
required by the MVP UI.

Required MVP use:

- `user_id`
- optional display/account state already present
- created/updated timestamps through existing schema

The bootstrap operation must be idempotent and must not require fake survey
answers.

### `public.real_talk_transcript_sources`

Trusted source registry already implemented by Spec 001.

Required publication inputs:

- provider and external source identity;
- canonical source URL;
- transcript/source reference;
- language;
- acquisition mode and rights basis/reference;
- bounded cues;
- cue digest;
- independent submitter/reviewer;
- `human_verified` review state;
- immutable reviewed evidence.

### `public.real_talk_videos`

Existing media/source container. It requires a provider-neutral migration for MVP.

Current useful fields:

- `id`, `slug`
- title/title_vi
- thumbnail and duration
- segment start/end
- level/topics
- speakers and speaker count
- owner and public state
- transcript provenance/review metadata
- created timestamp

### `public.real_talk_lessons`

Existing structured lesson package.

Useful fields:

- environment;
- communication events;
- transcript;
- pre/while/post phases;
- transfer task;
- generation model and warnings;
- review identity/time;
- generation/review status.

The MVP query must require final reviewed/public eligibility rather than treating
presence as publication.

### `public.pilot_events`

Existing privacy-safe event storage. Reuse only the event names and bounded scalar
payloads needed by the MVP funnel.

## Provider-Neutral Source Migration

The current video record requires `youtube_id`, but the safest reviewed sources may
come from Wikimedia, DVIDS, owned recordings, or other approved providers.

Add or reconcile these fields:

```text
source_provider       text not null
source_external_id    text not null
canonical_source_url  text not null
playback_kind         text not null
playback_url          text not null
embed_url             text null
```

Allowed `playback_kind` values:

- `youtube_embed`
- `direct_video`
- `external_link`

Rules:

- `youtube_embed` requires an official HTTPS YouTube embed URL;
- `direct_video` requires a reviewed HTTPS media URL permitted for playback;
- `external_link` requires an HTTPS source URL and displays an honest external
  playback boundary;
- at least one safe playable URL must exist;
- `youtube_id` becomes nullable or a derived compatibility field;
- source provider/external ID is unique within provider;
- media is not downloaded or copied by this migration.

## Publication Eligibility

A catalog lesson is eligible only when all conditions are true:

```text
video.is_public = true
lesson generation/review state = reviewed/approved
video transcript_review_status = human_verified
video provenance metadata references a reviewed source
lesson.reviewed_by is not null
lesson.reviewed_at is not null
source/playback references are safe
```

The exact status enum/string must be reconciled with existing constraints before
DDL. The public query fails closed when any value is missing or unknown.

## Proposed MVP Attempt Entity

First test whether a strict repository wrapper over existing evidence tables can
satisfy this contract. If it cannot, add `public.real_talk_attempts`.

### `real_talk_attempts`

| Column | Type | Rules |
| --- | --- | --- |
| `id` | uuid | primary key, generated server/database side |
| `user_id` | uuid | not null, FK auth.users, derived from auth |
| `lesson_id` | uuid | not null, FK real_talk_lessons |
| `status` | text | `started`, `in_progress`, `completed` |
| `checkpoint` | text | bounded runtime checkpoint enum |
| `first_listen_completed` | boolean | default false |
| `comprehension_correct` | integer | bounded >= 0 |
| `comprehension_total` | integer | bounded >= correct |
| `max_support_level` | integer | bounded support scale, no content payload |
| `retrieval_attempted` | boolean | default false |
| `speak_confirmed` | boolean | default false; self-confirm only |
| `transfer_attempted` | boolean | default false |
| `started_at` | timestamptz | not null |
| `updated_at` | timestamptz | not null |
| `completed_at` | timestamptz | nullable; requires completion gates |

Unique identity:

```text
unique (user_id, lesson_id)
```

This stores one current MVP attempt per learner and lesson. Immutable attempt
history and delayed-transfer history are deferred.

### Completion constraint

A completed record requires:

```text
first_listen_completed = true
retrieval_attempted = true
speak_confirmed = true
transfer_attempted = true
completed_at is not null
```

The write path must enforce this in both application validation and database
constraint/RPC logic.

### RLS

Authenticated learner:

- may select only rows where `user_id = auth.uid()`;
- may insert/update only their own attempt through a security-invoker or ordinary
  RLS-bound write path;
- cannot change `lesson_id` or `user_id` after creation;
- cannot write completion unless required evidence is present;
- cannot read another learner's attempts.

Service/reviewer roles do not need learner-attempt access for the MVP unless a
separate operational requirement is approved.

## Account Bootstrap Contract

Create one idempotent server operation, implemented as a transaction or
security-invoker RPC, that derives the current user and ensures the minimum
application records exist.

Input:

```text
none beyond authenticated session and optional validated onboarding choice
```

Output:

```text
user_id
created_or_existing
safe_next_route
```

It must not:

- accept a client-supplied user ID;
- silently default multiple unasked personalization fields;
- partially create one profile table and fail another without rollback;
- grant publication/reviewer roles.

## Dashboard Read Model

The MVP dashboard does not query every legacy subsystem. Create one server read
model:

```ts
interface MvpDashboardState {
  learner: {
    isAuthenticated: true;
    displayLabel: string;
  };
  primaryAction:
    | { kind: "start"; lessonSlug: string; title: string }
    | { kind: "continue"; lessonSlug: string; checkpoint: string; title: string }
    | { kind: "review"; lessonSlug: string; title: string }
    | { kind: "empty"; reason: "no_reviewed_lessons" };
  lessons: Array<{
    slug: string;
    titleVi: string;
    environmentTitle: string;
    durationMinutes: number;
    status: "not_started" | "in_progress" | "completed";
  }>;
}
```

No XP, streak, league, word-of-day, writing, or notification query is required.

## Pilot Event Contract

Allowed event names:

```text
mvp_landing_viewed
mvp_auth_started
mvp_auth_completed
mvp_dashboard_viewed
mvp_lesson_started
mvp_first_listen_completed
mvp_support_revealed
mvp_retrieval_attempted
mvp_speak_confirmed
mvp_transfer_attempted
mvp_lesson_completed
mvp_returned
```

Allowed payload fields are bounded identifiers and scalars only:

- anonymous/authenticated ID according to existing event policy;
- lesson ID or slug;
- support level;
- numeric correct/total;
- boolean outcome;
- source surface;
- timestamp.

Forbidden:

- learner answer text;
- speech transcript;
- audio URL/blob;
- name, email, employer;
- arbitrary JSON/free text.

## Data Migration and Rollback

Before applying any MVP migration:

1. generate a fresh hosted schema/type baseline;
2. review existing constraints and grants;
3. run Supabase security/performance advisors;
4. apply only versioned migrations authorized by the owner;
5. verify two-user and anonymous access;
6. seed only reviewed corpus records;
7. retain rollback SQL or a reversible data cleanup script;
8. confirm preview uses the same hosted project.

Because learner tables are nearly empty, destructive cleanup is not automatically
safe; migration history and security invariants must still be preserved.