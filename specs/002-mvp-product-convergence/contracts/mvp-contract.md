# Contract: AtoEnglish YouTube-to-Private-Lesson MVP

## Learner Promise

AtoEnglish lets a Vietnamese learner paste a supported YouTube video and receive a
private AI-generated English lesson built from one useful interaction in that
video.

The product does not promise that every YouTube video is supported, that captions
are perfect, that AI output is human-reviewed, or that one lesson proves fluency,
pronunciation, CEFR level, mastery, or long-term retention.

## Critical Journey

```text
landing
→ authentication
→ paste supported YouTube URL
→ source/transcript validation
→ bounded interaction selection
→ Gemini structured generation
→ source-evidence validation
→ atomic owner-private ai_draft persistence
→ private lesson runtime
→ retrieval + speak-and-confirm + transfer
→ bounded progress
→ private library / return
```

## Route Contract

Public:

- `/`
- `/login`
- `/auth/callback`
- `/privacy`
- `/terms`
- `/api/health`

Authenticated MVP:

- `/dashboard`
- `/real-talk/create` or the equivalent dashboard generation form
- `/real-talk/[lessonSlug]` for owner-private lessons
- `/real-talk` if used as the owner's private library
- `/me`

No public catalog is required. Another user's private slug must resolve as denied
or not found without confirming existence.

## URL Submission Contract

Input:

```text
youtubeUrl
approved target level
```

The server must:

1. authenticate before external/provider work;
2. validate and normalize a supported YouTube URL;
3. derive video identity server-side;
4. rate-limit by authenticated user and safe request bucket;
5. return stable actionable failure codes;
6. never trust a client user ID, owner ID, review state, or publication state.

## Supported Source Contract

MVP supports only public YouTube videos that satisfy the selected adapter policy:

- canonical YouTube identity can be resolved;
- official embed/watch playback is permitted/available;
- usable timed English transcript evidence is obtainable;
- transcript is non-empty and within configured safety/size limits;
- source is not private, age-restricted, or otherwise unsupported by policy.

Unsupported videos fail honestly. The system must not fabricate a transcript,
convert the whole video blindly, download media, or re-host video/audio.

## Transcript Contract

Every transcript result exposes:

- adapter ID;
- acquisition mode;
- language;
- review status;
- normalized timed cues;
- cue digest;
- warnings;
- source identity.

Caption text is untrusted prompt data. It is normalized, bounded, delimited, and
must not override generation rules.

The exact production/private adapter decision is a release gate. Passing unit
tests does not automatically approve an experimental acquisition mechanism.

## Compiler Contract

The compiler:

- selects a deterministic interaction-rich window no longer than 180 seconds;
- sends only bounded transcript/source context to Gemini;
- requests structured output through the typed generation schema;
- validates structure with Zod;
- validates every source-dependent phrase, transcript reference, timestamp,
  answer, and transfer target against selected cues;
- rejects unsupported output before persistence;
- records the actual model and warnings.

## Private Draft Contract

Every successful generation is:

```text
owner = authenticated user
is_public = false
state = ai_draft
reviewed_by = null
reviewed_at = null
```

It persists atomically:

- source/video identity and URL;
- official playback identity;
- selected window;
- transcript adapter/mode/status/digest;
- structured lesson;
- model;
- warnings;
- deterministic owner-private identity.

Ordinary users cannot approve, publish, or access another user's draft.

## Learner UI Contract

The private lesson always shows:

- source identity and official playback;
- `AI draft` label;
- transcript/acquisition warning when not human-verified;
- environment, roles, and practical goal;
- honest failure/retry behavior.

The UI must not imply that the lesson was human-reviewed or guaranteed correct.

## Runtime Contract

Completion requires:

```text
first encounter completed
AND productive retrieval attempted
AND speaking self-confirmed
AND changed-context transfer attempted
```

Watching, multiple choice, cloze, or repetition alone is insufficient.

Support must reveal progressively. The first encounter does not expose transcript
or answers by default.

## Speech Contract

MVP speech is `speak_and_confirm`.

- Microphone/browser STT is optional.
- No pronunciation score is required or claimed.
- Optional transcript matching, if retained, must be labelled sentence match and
  cannot block the fallback.
- Raw audio and unrestricted speech transcript are not stored.

## Progress Contract

Stored learner evidence is bounded:

- lesson ID;
- checkpoint/status;
- first-listen boolean;
- comprehension counts;
- maximum support level;
- retrieval-attempt boolean;
- speak-confirmed boolean;
- transfer-attempt boolean;
- timestamps.

No learner free-text transfer response is stored by default. Writes derive the
user server-side, enforce RLS, validate lesson ownership, and remain idempotent.

## Dashboard and Library Contract

The dashboard has one primary action: paste a YouTube URL.

It also shows the owner's recent private lessons with states:

- ready to start;
- continue;
- completed/review;
- failed generation with safe retry guidance.

It does not require a public catalog, XP, streak, league, flashcards, writing,
challenge, or fifty-unit progression.

## Static Fixture Contract

Static sample lessons may be used only for tests, controlled demos, or development
fixtures with explicit labeling. They must not:

- appear as if generated from the user's URL;
- be merged into the owner's private library;
- satisfy hosted/live generation acceptance;
- replace live Gemini or transcript verification.

## Analytics Contract

Allowed events answer whether users authenticate, submit a URL, reach transcript,
generate successfully/fail by bounded code, open a lesson, attempt required
learning steps, complete, and return.

Payloads may contain bounded IDs, enum codes, counts, booleans, durations, and
timestamps. They may not contain source transcript text, learner answers, audio,
email/name/employer, full URLs with sensitive query data, or provider secrets.

## Integration Contract

Implementation starts from current `main`. For every Real Talk path from open
branches, a manifest records source SHA, classification (`port`, `adapt`,
`reference`, `reject`), reason, destination, and required evidence.

A branch-level merge of `agent/rebuild-learning-core` is forbidden.

## Release Contract

A release candidate requires:

- accepted product scope;
- documented transcript adapter/private-production decision;
- live bounded Gemini success and failure evidence;
- exact-head lint, TypeScript, tests, content checks, and build;
- hosted atomic private persistence and two-user RLS evidence;
- supported and unsupported YouTube browser paths;
- desktop/mobile URL-to-lesson/return journey on Vercel preview;
- no critical runtime errors;
- owner acceptance.

Merge and production deployment remain separate explicit owner decisions.