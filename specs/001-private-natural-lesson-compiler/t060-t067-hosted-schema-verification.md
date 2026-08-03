# T060 and T067 Hosted Schema Verification

**Observed:** 2026-08-03  
**Supabase project:** `zpiwddskhduuykpxltun`  
**Owner authorization:** explicit in the active conversation  
**Application deployment:** none

## Applied hosted migrations

| Hosted version | Name |
| --- | --- |
| `20260803011348` | `real_talk_transcript_provenance` |
| `20260803011431` | `real_talk_atomic_private_draft` |
| `20260803011736` | `fix_real_talk_atomic_private_draft_conflict` |

Preflight observed zero rows in both Real Talk tables and confirmed that the
provenance columns and RPC were absent.

## Provenance verification — T060

The hosted schema now contains all four provenance columns, four constraints,
the write-gate trigger, and the transcript-mode index.

A bounded role/JWT transaction observed:

- service role inserted valid `creator_provided` / `human_verified` metadata;
- the authenticated owner could read the private row;
- the owner could not alter the approved digest or metadata;
- the stored digest and metadata remained unchanged;
- the fixture video and Auth user were deleted.

Result:

```text
trusted_write_persisted = true
owner_can_read= true
owner_tamper_rejected   = true
digest_unchanged        = true
cleanup_video = true
cleanup_auth_user       = true
```

## Atomic RPC verification — T067

The first authenticated hosted probe failed before any durable write with:

```text
column reference "video_id" is ambiguous
```

The conflict was between the function's `RETURNS TABLE(video_id, lesson_id)`
output variable and `ON CONFLICT (video_id)`. The surrounding transaction
rolled back. A follow-up migration replaced the target with the named unique
constraint `real_talk_lessons_video_id_key`.

The repeated probe then observed:

```text
same_video_id    = true
same_lesson_id   = true
one_current_video= true
updated_video_title        = true
updated_lesson_title       = true
failed_write_left_no_video = true
publication_rejected       = true
cleanup_auth_user= true
cleanup_videos   = true
cleanup_lessons  = true
```

This proves hosted RPC transaction and RLS behavior. It does not claim that
the Next.js server action itself was executed; T051 and T068 remain open for
that separate application-process evidence.

## Generated types and advisors

Supabase TypeScript generation after the migrations returned PostgREST `14.5`
types containing the four provenance fields and
`upsert_real_talk_private_draft`. The obsolete Real Talk type overlay was
removed; `AppDatabase` now overlays only the unapplied `learning_attempts`
migration.

Security Advisor reported no Real Talk finding. The remaining warning is the
project-level leaked-password-protection setting. Performance Advisor added
no actionable Real Talk defect; empty-schema indexes remain `unused_index`
INFO notices.

## Boundary

- T060: complete.
- T067: complete.
- T051/T068 real server-action execution: not yet observed.
- Production transcript adapter: not implemented.
- Application deployment: not performed.
- No fixture rows remain.
