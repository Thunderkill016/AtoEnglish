# AtoEnglish current priority

**Updated:** 2026-08-02  
**Owner:** Thunderkill016  
**Primary product truth:** `docs/product/PRODUCT_TRUTH.md`  
**Architecture direction:** `docs/product/YOUTUBE_TO_CURRICULUM.md`  
**Session continuity:** `PROJECT_MEMORY.md`

## North star

Build a coherent path from near-zero English to practical high-A2/B1 communication by transforming authentic conversation clips into ordered comprehension, acquisition, and transfer experiences.

The immediate goal is not a large catalog. It is to prove that multiple authentic clips can form one small curriculum whose lessons depend on and reinforce one another.

## Current phase

**Phase: encode the new canonical direction, then design and validate one seven-day A0 mini-curriculum.**

Owner decision recorded on 2026-08-02:

- YouTube and other authentic-media sources are language input, not the curriculum;
- the curriculum unit is a short Communication Clip;
- clips are ordered by communicative capability and prerequisites;
- every full lesson treatment requires comprehension, acquisition, and transfer;
- the old fixed 28-day workplace journey is no longer the canonical roadmap;
- PR #46 is a technical proof of one authentic clip, not the final product shape;
- useful mechanisms from PR #45 and the merged Gold Day 1 may be reused inside the new core.

Do not create more standalone Real Talk lessons before the mini-curriculum and graph contracts exist.

## Ordered queue

### 1. Persist the product decision and session continuity — current task

Update repository-owned truth so a new AI session cannot mistakenly return to the old roadmap or treat PR #46 as the product endpoint.

Required documents:

- `PROJECT_MEMORY.md`;
- `AGENTS.md`;
- `docs/product/PRODUCT_TRUTH.md`;
- this file;
- `docs/product/DO_NOT_BUILD.md`;
- `docs/product/YOUTUBE_TO_CURRICULUM.md`;
- `AGENT_PLAN.md` and `AGENT_BACKLOG.md`.

**Done when:** all high-authority documents agree on YouTube-to-Curriculum as the canonical direction and GitHub Verify passes on the exact documentation head.

### 2. Define the bounded curriculum contracts

Before implementing the learner-facing corpus, define the smallest stable contracts for:

- source, permission, attribution, and transcript provenance;
- Communication Clip timestamps and speaker segments;
- communicative functions;
- prerequisite capabilities;
- level-specific treatments;
- comprehension, acquisition, and transfer activities;
- advancement and delayed-retrieval evidence;
- human review state.

Use a modular-monolith design. Do not build a generalized ingestion platform or database migration unless the pilot cannot function without it.

### 3. Build the reviewed A0 source corpus

Create a corpus of 20–30 short clips across multiple videos and speakers for five capabilities:

1. greet someone;
2. say one's name;
3. ask another person's name;
4. say where one is from;
5. ask someone to repeat.

Each capability must appear in 3–5 clips from different speakers or contexts.

Source requirements:

- documented permission, compatible license, or public-domain status;
- exact source URL and timestamps;
- transcript provenance;
- human verification of transcript, speaker, names, translation, and learning value.

Start manually or semi-manually. Automation is not the product proof.

### 4. Compile the seven-day learning graph

Order the corpus into a coherent progression:

- explicit prerequisite edges;
- recognition before productive use where appropriate;
- controlled introduction of variants;
- repeated exposure across speakers;
- fading support;
- delayed retrieval;
- unseen-speaker recognition;
- changed-situation transfer.

The graph must prevent a learner from receiving a clip treatment that assumes missing prerequisites.

### 5. Implement the smallest learner runtime slice

Reuse existing application capabilities where possible:

- bounded authentic-media playback;
- synchronized transcript evidence;
- gist and detail comprehension;
- chunk recall and contextual replay;
- shadowing or imitation when useful;
- personal response tasks;
- FSRS integration;
- unseen transfer tests;
- typed fallback when microphone capability fails.

Do not polish the existing radio lesson as a standalone destination. Refactor or reuse it only when that directly serves the seven-day sequence.

### 6. Run the learner pilot

Test whether learners can:

- understand the five target functions across speakers;
- answer with personal information;
- recognize the functions in unseen clips;
- retrieve selected chunks after several days;
- complete changed communication tasks with reduced support;
- progress without facilitator language help.

Technical success, video playback, or quiz completion alone is insufficient.

## Relationship to open pull requests

### PR #46 — authentic-media technical proof

- proves one licensed/public-domain clip can support timestamped playback, transcript evidence, active recall, and optional FSRS;
- remains draft, unmerged, and non-production;
- should not be completed as an isolated product;
- its source, provenance, playback, transcript, and retrieval code may be corrected and reused in a later mini-curriculum task;
- its known timestamp, approval-gate, save-state, browser, and human-review defects remain real.

### PR #45 — mastery-mechanism experiment

- diagnosis, gap-focused teaching, fading support, repair, cold transfer, and checkpoint gating may inform the new runtime;
- it is not a competing canonical product direction after the owner decision;
- keep, revise, extract, or close it based on what the mini-curriculum requires;
- do not merge the entire experiment merely because its technical checks passed.

### Merged PR #43 — Gold Day 1

- supplies useful speaking-task, feedback, retry, checkpoint, and pilot evidence patterns;
- its synthetic lesson source and fixed 28-day placement are not the future curriculum model.

### PR #35

- remains an older stale Gold Day 1 branch;
- do not use it as the implementation baseline.

## Decisions already completed

- AtoEnglish will use authentic natural conversations as the primary language source.
- The product is a YouTube-to-Curriculum Engine, not a video-to-quiz feature.
- Communication Clip is the smallest curriculum unit.
- Curriculum ordering follows communicative capability and prerequisites.
- Full learning requires comprehension, acquisition, and transfer.
- The initial destination is practical high-A2/B1, not a fluency claim.
- The next validation slice is seven days, 20–30 clips, and five A0 capabilities.
- The previous 28-day workplace journey is superseded as the canonical roadmap.

Do not reopen these decisions without new owner instruction or learner evidence.

## Work selection rule

A task may enter the active queue only when it advances one of these:

1. source rights, provenance, transcript, or human-review integrity;
2. Communication Clip and curriculum-graph contracts;
3. the reviewed five-capability A0 corpus;
4. the seven-day prerequisite progression;
5. comprehension, acquisition, retrieval, or transfer evidence;
6. a production defect, security defect, privacy defect, or data-integrity defect;
7. a repeated development blocker observed in real work.

Do not start:

- unrelated standalone video lessons;
- the full A0–B1 corpus;
- unrestricted YouTube ingestion;
- autonomous AI lesson publication;
- another learning engine;
- broad gamification, payment, or architecture work.

## Exit criteria for this phase

This phase is complete when:

- repository truth and memory reflect the new direction;
- one reviewed 20–30 clip corpus exists for the five A0 capabilities;
- clips have source, rights, transcript, metadata, and prerequisite evidence;
- one seven-day graph connects lessons and repeated exposure;
- learners complete comprehension, acquisition, delayed retrieval, unseen recognition, and transfer checks;
- the owner has evidence to continue, revise, or reject the curriculum compiler approach.