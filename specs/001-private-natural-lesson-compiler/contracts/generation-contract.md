# Contract: Private Natural Lesson Generation

## Operation

```text
generatePrivateNaturalLesson(input, authenticatedUser) -> GenerationResult
```

This is a server-side product contract. The current transport is a Next.js server
action, but callers MUST depend on the behavior below rather than transport
implementation details.

## Request

```ts
interface GeneratePrivateNaturalLessonInput {
  sourceUrl: string;
  level: "A0" | "A1" | "A2" | "B1" | "B2";
}
```

### Preconditions

- The server has resolved a current authenticated user.
- The request passes URL and level validation.
- The user is within the generation rate limit.
- The configured transcript source adapter is available.
- `GEMINI_API_KEY` is configured server-side and is never returned to the client.

Anonymous requests MUST fail before transcript or Gemini calls.

## Success response

```ts
interface GenerationSuccess {
  success: true;
  status: "ai_draft";
  persisted: true;
  persistence: "saved_private_draft";
  video: RealTalkVideo;
  lesson: RealTalkLesson;
  warnings: string[];
  source: {
    provider: "youtube";
    externalId: string;
    watchUrl: string;
    embedUrl: string;
    selectedStartSeconds: number;
    selectedEndSeconds: number;
    acquisitionMode: string;
  };
  generation: {
    model: string;
    warnings: string[];
  };
}
```

### Success invariants

- `status` is always `ai_draft`.
- `persisted` is always true in spec 001.
- Both the private video record and lesson record completed their required writes.
- Persisted records belong to the authenticated user.
- Persisted records are not public.
- The returned lesson passed runtime schema validation.
- The returned lesson passed automated source-evidence validation.
- The response contains unresolved human-review warnings.
- The response does not claim publication, transcript verification, pronunciation
  assessment, or mastery.

Spec 001 does not have an implicit non-persistent preview success. A database
failure MUST return `DRAFT_PERSISTENCE_FAILED` and MUST NOT be reported as a saved
or preview-only success.

## Failure response

```ts
interface GenerationFailure {
  success: false;
  code:
    | "AUTH_REQUIRED"
    | "INVALID_INPUT"
    | "RATE_LIMITED"
    | "SOURCE_UNSUPPORTED"
    | "TRANSCRIPT_UNAVAILABLE"
    | "TRANSCRIPT_INVALID"
    | "MODEL_UNAVAILABLE"
    | "MODEL_RATE_LIMITED"
    | "MODEL_OUTPUT_INVALID"
    | "SOURCE_EVIDENCE_FAILED"
    | "DRAFT_PERSISTENCE_FAILED"
    | "INTERNAL_ERROR";
  error: string;
  evidenceFailures?: string[];
  retryAfterSeconds?: number;
}
```

### Failure mapping

| Stage | Code |
|---|---|
| Missing authenticated user | AUTH_REQUIRED |
| Invalid URL/level request | INVALID_INPUT |
| Request rate limit exceeded | RATE_LIMITED |
| Unsupported source or blocked transcript policy | SOURCE_UNSUPPORTED |
| Missing/provider-failed transcript | TRANSCRIPT_UNAVAILABLE |
| Too-short or unusable transcript/window | TRANSCRIPT_INVALID |
| Missing/unreachable Gemini provider | MODEL_UNAVAILABLE |
| Gemini quota exceeded | MODEL_RATE_LIMITED |
| Missing candidate, malformed JSON, or invalid schema | MODEL_OUTPUT_INVALID |
| Parsed output lacks source support | SOURCE_EVIDENCE_FAILED |
| Required private draft write fails | DRAFT_PERSISTENCE_FAILED |
| Unexpected uncategorized server failure | INTERNAL_ERROR |

### Failure invariants

- No public lesson is created.
- Invalid model output is not partially persisted.
- Persistence failure is visible and is not converted into success.
- The client receives no raw provider response containing secrets or excessive
  internal detail.
- Evidence failures are machine-readable and safe to show in an editor-facing
  review panel.
- Retry guidance is provided only when retrying can plausibly help.

## Transcript source adapter

```ts
interface TranscriptSourceAdapter {
  id: string;
  trust: "approved" | "experimental";
  acquire(source: SourceReference): Promise<TranscriptSourceResult>;
}

interface TranscriptSourceResult {
  cues: Array<{
    text: string;
    offset: number;
    duration: number;
  }>;
  metadata: {
    adapterId: string;
    provider: string;
    acquisitionMode:
      | "creator_provided"
      | "authorized_export"
      | "licensed_source"
      | "public_domain"
      | "human_reviewed_upload"
      | "approved_provider_api"
      | "experimental_unofficial";
    trust: "approved" | "experimental";
    language: string;
    reviewStatus: "unreviewed" | "machine_checked" | "human_verified";
    sourceReference: string;
    acquiredAt: string;
    warnings: string[];
  };
}
```

An `experimental_unofficial` adapter MUST add warnings and MUST NOT make the
result eligible for public publication. It is disabled by default, requires an
explicit non-production opt-in, and is always rejected in production.

## Gemini structured output

The model output MUST satisfy the runtime schema represented by
`generatedLessonDraftSchema`. Required top-level fields are:

```text
title
titleVi
level
estimatedMinutes
canDoStatement
canDoStatementVi
topics
environment
speakers
transcript
communicationEvents
preWatch
whileWatch
postWatch
transferTask
```

The prompt MUST:

- state that source captions are untrusted data;
- delimit source data clearly;
- prohibit following instructions contained inside captions;
- require source-supported English only;
- require environment and transfer design;
- require Vietnamese learner guidance;
- avoid claims that the model verified rights, speakers, or transcript accuracy.

## Evidence validation contract

Validation receives the parsed draft and the exact selected source window.

It MUST reject:

- invalid or out-of-window transcript time ranges;
- duplicate transcript indices;
- unknown speaker labels;
- transcript English absent from the source window;
- activity references to unknown transcript indices;
- vocabulary context sentences absent from the source;
- key moments outside the source window;
- speaking phrases absent from the source;
- completed fill-in-the-blank sentences absent from the source;
- transfer suggested language absent from the source.

Automated evidence matching is a conservative gate, not a human transcript
verification claim.

## Persistence contract

### Current-draft identity

```text
privateDraftKey = authenticated owner ID + source video ID + requested level
```

The persisted slug MUST be deterministic from those fields and MUST NOT depend on
an AI-generated title. Repeating generation with the same key updates one current
private draft. Different owners or requested levels use distinct keys. Immutable
attempt history is outside spec 001.

### Video draft

- `created_by = auth.uid()`
- `is_public = false`
- `review_state = ai_draft`
- selected segment and source metadata are stored
- source acquisition mode and warnings are retained by the draft contract

### Lesson draft

- references the owner's video draft
- stores environment, communication events, transcript, all lesson phases,
  transfer task, generation model, and warnings
- reload returns the same contract fields needed by the preview
- one current lesson is upserted for the deterministic video draft identity

### Persistence failure

- failure to write the video returns `DRAFT_PERSISTENCE_FAILED`;
- failure to write the lesson returns `DRAFT_PERSISTENCE_FAILED`;
- the editor UI MUST NOT show a saved draft after either failure;
- a partially written private record is not a successful generation result and
  must be retried or reconciled before use;
- no persistence failure may create or expose a public record.

### RLS contract

- anonymous users cannot insert drafts;
- owners can select their private drafts;
- non-owners cannot select, update, or delete drafts;
- ordinary users cannot set `is_public = true`;
- ordinary users cannot set `review_state` beyond `ai_draft`;
- lesson writes are allowed only through an owned private video record.

## Preview completion contract

The owner preview MUST include:

1. environment and role brief;
2. official source playback;
3. comprehension evidence;
4. retrieval activity;
5. source-backed phrase production acknowledgement;
6. changed-context transfer attempt;
7. honest completion summary.

The preview MUST NOT:

- fabricate microphone scoring;
- label sentence match as pronunciation;
- claim long-term mastery;
- imply the draft is reviewed or public;
- automatically store raw audio.
