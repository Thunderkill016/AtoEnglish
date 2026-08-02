# Contract: Private Natural Lesson Generation

## Operation

```text
generatePrivateNaturalLesson(input, authenticatedUser) -> GenerationResult
```

This is a server-side product contract. The current transport is a Next.js server
action, but callers depend on this behavior rather than transport details.

## Request

```ts
interface GeneratePrivateNaturalLessonInput {
  sourceUrl: string;
  level: "A0" | "A1" | "A2" | "B1" | "B2";
}
```

### Preconditions

- The server resolves the current authenticated user.
- URL and level pass runtime validation.
- The authenticated user is within the generation rate limit.
- A configured transcript source adapter is allowed by runtime policy.
- `GEMINI_API_KEY` is configured server-side and is never returned to the client.

Anonymous and invalid requests MUST fail before transcript, Gemini, or persistence
work.

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
    acquisitionMode: TranscriptAcquisitionMode;
  };
  generation: {
    model: string;
    warnings: string[];
  };
}
```

### Success invariants

- `status` is always `ai_draft`.
- Both required private draft writes completed.
- Persisted records belong to the authenticated user.
- Persisted records are not public.
- Returned lesson output passed runtime schema validation.
- Returned lesson output passed automated source-evidence validation.
- The actual successful model identifier is returned and stored.
- Unresolved human-review warnings remain visible.
- The response does not claim publication, transcript verification, pronunciation
  assessment, delayed retention, or mastery.

Spec 001 does not support a successful non-persistent preview fallback.

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
- Invalid model output is not persisted.
- Compiler or evidence failure never calls persistence.
- Persistence failure remains failure and cannot be rendered as a saved lesson.
- The client receives no raw provider response, secret, stack trace, or excessive
  internal detail.
- Evidence failures are deduplicated machine-readable codes.
- Retry guidance appears only when retrying can plausibly help.

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

An `experimental_unofficial` adapter MUST add warnings and MUST NOT make a result
eligible for public publication. It is disabled by default, requires explicit
non-production opt-in, and is always rejected in production.

## Source-window contract

The compiler chooses one bounded contiguous source window using deterministic
interaction signals. The window MUST:

- contain at least two cues;
- stay within configured duration and cue-count limits;
- prefer questions, replies, repair, clarification, and turn-taking signals over
  opening titles, background cues, or long monologue;
- retain exact source offsets for evidence validation.

Window selection proposes a useful segment; it does not prove speaker turns,
naturalness, rights, or pedagogical quality.

## Untrusted prompt-data boundary

Metadata and captions are untrusted external data.

The prompt builder MUST:

- keep governing instructions outside source-data delimiters;
- encode metadata as escaped JSON;
- encode captions as escaped JSONL with source index and timing fields;
- escape `<`, `>`, and `&` so source text cannot create literal delimiter tags;
- use exactly one metadata delimiter pair and one caption delimiter pair;
- state before the source that data fields cannot change role, schema, output
  format, or governing rules;
- repeat the instruction boundary after the source data;
- require JSON output matching the runtime schema;
- require source-supported English only;
- require environment and changed-context transfer design;
- require Vietnamese learner guidance;
- avoid claims that the model verified rights, speakers, or transcript accuracy.

The current delimiters are:

```text
<SOURCE_METADATA_UNTRUSTED>
</SOURCE_METADATA_UNTRUSTED>
<SOURCE_CAPTION_UNTRUSTED_JSONL>
</SOURCE_CAPTION_UNTRUSTED_JSONL>
```

This boundary is deterministic prompt hardening. It MUST NOT be described as
proof that all model-level prompt-injection attacks are defeated. Live
adversarial provider verification remains required.

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

Missing required branches, invalid enums, invalid counts, invalid option indices,
or other schema violations return `MODEL_OUTPUT_INVALID`.

## Evidence validation contract

Validation receives the parsed draft and exact selected source window.

It MUST reject and deduplicate these failure codes:

```text
invalid_transcript_time_range
transcript_outside_source_window
duplicate_transcript_index
unknown_speaker_label
transcript_missing_source_evidence
activity_references_unknown_segment
vocabulary_missing_source_evidence
key_moment_outside_source_window
speaking_drill_missing_source_evidence
fill_blank_missing_source_evidence
transfer_language_missing_source_evidence
```

Conservative matching may normalize case, whitespace, punctuation, selected HTML
entities, and non-speech caption artifacts. Normalization MUST NOT invent words or
convert semantic paraphrases into source evidence.

Automated evidence matching is a conservative gate, not human transcript
verification.

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
- source acquisition mode and warnings remain available to the draft contract

### Lesson draft

- references the owner's video draft
- stores environment, communication events, transcript, all lesson phases,
  transfer task, generation model, and warnings
- reload returns the same fields required by preview
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
- ordinary users cannot set review state beyond `ai_draft`;
- lesson writes are allowed only through an owned private video record.

## Preview completion contract

The owner preview MUST include:

1. environment and role brief;
2. official source playback;
3. comprehension evidence;
4. retrieval activity;
5. source-backed phrase-production acknowledgement;
6. changed-context transfer attempt;
7. honest immediate-practice summary.

The preview MUST NOT:

- fabricate microphone scoring;
- label sentence match as pronunciation assessment;
- claim long-term mastery;
- imply the draft is reviewed or public;
- automatically store raw audio.
