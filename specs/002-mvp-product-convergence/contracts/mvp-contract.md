# Contract: AtoEnglish MVP Product Boundary

## Purpose

This contract defines what may be called the AtoEnglish MVP and prevents a green
build, a large feature list, or an experimental content tool from being mistaken
for a usable product.

## Learner Promise

AtoEnglish helps a Vietnamese beginner understand one short reviewed English
interaction and attempt the same practical communication goal in a changed
situation.

The MVP does not promise:

- fluency;
- CEFR certification;
- native pronunciation;
- pronunciation scoring;
- mastery or long-term retention from one lesson;
- automatic personalization;
- a complete A0–B2 curriculum;
- correctness of AI-generated or unreviewed transcripts.

## Critical User Journey

```text
GET /
→ primary CTA
→ /login
→ authenticated bootstrap
→ /dashboard
→ reviewed lesson catalog/action
→ /real-talk/[lessonSlug]
→ first encounter
→ progressive support
→ retrieval
→ speak-and-confirm
→ changed-context transfer
→ bounded completion persistence
→ dashboard continue/review state
→ logout and later return
```

Every production release candidate must demonstrate this journey on desktop and
mobile against hosted Supabase.

## Public Route Contract

Public without authentication:

- `/`
- `/login`
- `/auth/callback`
- `/privacy`
- `/terms`
- `/api/health`

Authenticated MVP routes:

- `/dashboard`
- `/real-talk`
- `/real-talk/[lessonSlug]`
- `/me`
- the chosen review/continue route if separate

Editor-only or disabled in learner production:

- `/real-talk/create`
- source submission/review operations
- private draft preview routes not owned by the user

Deferred routes are not part of the product contract even if they remain deployed.
They must not appear in primary learner navigation or landing promises.

## Catalog Contract

The catalog response contains only reviewed public lessons.

Pseudo-query contract:

```text
select reviewed lesson + source
where video.is_public = true
  and lesson reviewed/approved
  and transcript human_verified
  and reviewed_by/reviewed_at present
  and provenance/playback pass policy
```

Forbidden behavior:

- static fallback lessons;
- merging fixture lessons into production output;
- displaying private drafts;
- displaying unreviewed transcripts;
- displaying a lesson because a model response passed schema validation only;
- exposing arbitrary generation as a learner CTA.

If no lesson qualifies, return an honest empty state.

## Reviewed Lesson Contract

A learner-visible lesson package must include:

- reviewed source identity and lawful playback boundary;
- environment/setting;
- learner role and partner role;
- practical goal;
- bounded source segment;
- reviewed transcript and speaker/timing state;
- source-backed communication events;
- first-listen task without answer exposure;
- progressive support;
- two to five useful source-backed chunks;
- productive retrieval;
- speak-and-confirm fallback;
- changed-context transfer task;
- concise reviewed Vietnamese guidance;
- honest completion copy.

Human review must explicitly cover:

- source availability and context;
- rights/provenance;
- audio language;
- exact words;
- timestamps;
- speaker uncertainty;
- translation/guidance;
- answer evidence;
- safety and age suitability;
- level and task coherence;
- transfer coherence.

## Runtime Completion Contract

The runtime may record `completed` only when:

```text
first listen completed
AND retrieval attempted
AND speaking self-confirmed
AND changed-context transfer attempted
```

Comprehension score alone is insufficient.
Watching alone is insufficient.
Repetition alone is insufficient.

Completion copy must use language such as:

- “Bạn đã hoàn thành lượt luyện tập này.”
- “Đây là bằng chứng luyện tập ngay lúc này, chưa chứng minh ghi nhớ lâu dài.”

It must not use:

- mastered;
- fluent;
- pronunciation score;
- CEFR passed;
- permanently learned.

## Speech Contract

MVP speech mode is `speak_and_confirm`.

The learner:

1. sees or recalls the target prompt according to the current support level;
2. says the response aloud;
3. confirms that an attempt occurred.

No score is produced. Browser speech recognition may be used only as an optional
sentence-match aid under a separate explicit label. It is not required for MVP
completion and is not pronunciation assessment.

## Persistence Contract

Stored evidence is bounded:

- lesson ID;
- current checkpoint/status;
- first-listen boolean;
- comprehension counts;
- maximum support level;
- retrieval-attempt boolean;
- speak-confirmed boolean;
- transfer-attempt boolean;
- timestamps.

Never store by default:

- raw microphone recording;
- full speech transcript;
- learner free-text transfer response;
- name/employer in attempt data;
- arbitrary analytics JSON.

Writes derive the user server-side, enforce RLS, and are idempotent.

## Account Bootstrap Contract

Email and OAuth use the same server-owned bootstrap.

The operation must:

- authenticate first;
- derive user ID from Supabase Auth;
- create missing minimum records transactionally/idempotently;
- return a safe route;
- tolerate retry;
- expose an actionable failure.

It must not:

- trust a client user ID;
- silently claim personalization from defaulted answers;
- directly grant reviewer/publication permissions;
- leave partial rows after failure.

## Dashboard Contract

The dashboard answers one question:

> What should I do next?

It must render exactly one primary state:

- start the first reviewed lesson;
- continue an in-progress lesson;
- review/retry a completed lesson;
- honest no-content state.

Secondary content is limited to the small reviewed corpus and account access.
XP, streak, league, word-of-day, writing, challenge, and notification status are
not required.

## Navigation Contract

Primary learner navigation:

- Học
- Ôn lại / Tiếp tục
- Tôi

Do not include editor generation or deferred product modules.

## Pilot Analytics Contract

The analytics layer may answer:

- did the learner understand the promise and start auth?;
- did auth complete?;
- did they start a lesson?;
- where did they abandon?;
- how much support was used?;
- did they attempt retrieval, speech, and transfer?;
- did they complete?;
- did they return?;

It may not collect learner answer text, speech transcript, audio, names, employers,
or unrestricted metadata.

## Integration Contract

Implementation begins from current `main`.

For each candidate file or migration from open branches, the port manifest records:

```text
source branch and SHA
path
classification: port / adapt / reference / reject
reason
required tests
destination path
```

A branch-level merge of `agent/rebuild-learning-core` is forbidden by this
contract because it is diverged and carries stale/conflicting toolchain and product
surface state.

## Release Contract

A merge candidate requires:

- approved requirements checklist;
- all required task evidence;
- exact-head lint, TypeScript, unit, content, and build gates;
- hosted database/type equivalence;
- hosted RLS two-user verification;
- three human-reviewed lessons;
- desktop/mobile full journey;
- Vercel preview and runtime-error inspection;
- owner acceptance.

Merge to `main` and production deployment are separate explicit owner decisions.
A successful preview does not authorize either action.