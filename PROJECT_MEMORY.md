# AtoEnglish project memory

**Status:** mandatory session-continuity source  
**Updated:** 2026-08-02  
**Repository:** `Thunderkill016/AtoEnglish`  
**Default branch:** `main`

This file exists because chat memory is not a reliable project record. A new AI session must reconstruct AtoEnglish from GitHub without access to an earlier conversation or shared-chat link.

Do not turn this file into a transcript archive. Keep only current operating state, durable owner decisions, unresolved blockers, and the exact handoff needed to continue safely. Git history, issues, pull requests, checks, and task handoffs remain the detailed historical record.

## Authority order

Use this order:

1. the owner's explicit current instruction;
2. `docs/product/PRODUCT_TRUTH.md`;
3. `docs/product/YOUTUBE_TO_CURRICULUM.md`;
4. `docs/product/CURRENT_PRIORITY.md`;
5. `docs/product/DO_NOT_BUILD.md`;
6. this project-memory snapshot;
7. live `main`, pull requests, issues, checks, deployments, and source evidence;
8. `AGENT_PLAN.md`, `AGENT_BACKLOG.md`, and task-specific handoffs.

When sources conflict, report the conflict. Do not silently follow an older document, a newer branch, or a technically attractive experiment.

## Session-start protocol

Before non-trivial work:

1. Confirm the repository is **AtoEnglish**, not another project.
2. Read `AGENTS.md`, this file, and the mandatory product documents.
3. Fetch the live `main` head.
4. Inspect active and recently merged pull requests touching the requested area.
5. State the task, branch, PR, exact head, merge state, deployment state, verified checks, unverified checks, and next safe action.
6. For multi-step work, show a short plan before execution.
7. Continue from repository evidence, not remembered chat claims.

## Session-end protocol

Before stopping:

1. Update the PR body or task handoff with the exact final head.
2. Record checks that actually ran against that head.
3. Separate technical, source-rights, transcript, browser, learner, and production verification.
4. Record unresolved blockers and one next safe action.
5. Update this file when product direction, active work, or cross-session blockers change.
6. Do not store secrets, cookies, learner data, raw chats, or temporary preview-share tokens.
7. Never merge or promote production without explicit owner authorization.

Use `docs/handoffs/README.md` for handoff fields.

## Owner collaboration preferences

- Communicate plans and status in Vietnamese.
- Show a plan before complex or multi-step work.
- Do not silently switch repository, branch, or product direction.
- Use exact evidence: repo, branch, PR, SHA, workflow, deployment, source, and blocker.
- Mark uncertainty and stale evidence clearly.
- Treat research as cumulative: add new evidence to existing evidence, compare conflicts, and record the final decision and reason.

## Durable owner decision — canonical product direction

**Recorded:** 2026-08-02.

AtoEnglish is now a **YouTube-to-Curriculum Engine**:

> Use legally usable natural conversations from YouTube and other authentic-media sources as language input, then organize short clips into a systematic path from near-zero English to stable practical communication.

This is not a module, a catalog of unrelated Real Talk lessons, or a video-to-quiz product.

### Core product model

```text
authentic conversation sources
→ bounded Communication Clips
→ language, speech, context, and prerequisite analysis
→ communicative capability graph
→ level-specific support
→ comprehension
→ acquisition and active recall
→ transfer to changed situations
→ delayed and varied re-exposure
→ practical communication ability
```

### Curriculum unit

The smallest unit is a **Communication Clip**, usually 3–60 seconds. A full video or podcast is a source container.

One clip may support different treatments at A0, A1, A2, and B1. The system teaches only what is appropriate at that learner state.

### Curriculum organization

Order clips by communicative capability and prerequisites, not video order or a grammar checklist.

Simplified graph:

```text
recognize greetings
→ introduce oneself
→ ask about another person
→ answer and ask a follow-up
→ sustain several turns
→ repair misunderstanding
→ describe and explain
→ narrate and discuss
```

### Complete learning contract

Every full treatment requires:

1. **Comprehension** — understand what real speakers mean and do.
2. **Acquisition** — retrieve selected chunks, patterns, and speech features.
3. **Transfer** — use the capability with personal information, changed situations, and unseen speakers.

Without transfer, AtoEnglish is only an annotated video viewer.

### Long-range destination

The initial destination is practical high-A2 to B1 communication, not a claim of fluency.

### First validation slice

Build a seven-day A0 mini-curriculum:

- 20–30 reviewed clips;
- multiple videos, speakers, and contexts;
- five capabilities:
  1. greet someone;
  2. say one's name;
  3. ask another person's name;
  4. say where one is from;
  5. ask someone to repeat;
- each capability appears in 3–5 clips from different speakers or contexts;
- final evidence includes delayed recall, unseen-speaker recognition, and changed-situation transfer.

### Four learning-core responsibilities

1. **Source Engine** — source, timestamps, speakers, permission, attribution, and transcript provenance.
2. **Language Intelligence Engine** — level treatments, functions, chunks, patterns, speech features, context, prerequisites, and learning value.
3. **Curriculum Graph** — ordering, next capability, repeated exposure, review, and advancement evidence.
4. **Lesson Runtime** — playback, transcript evidence, comprehension, recall, imitation, response, FSRS, and transfer.

Keep these as bounded modular-monolith responsibilities first. Do not prematurely split them into services.

### Rights and review boundary

A public YouTube URL does not automatically grant rights to copy transcripts, translate content, create derivative lessons, or sell access.

A learner-facing clip requires documented permission, a compatible license, or public-domain status, plus source URL, timestamps, attribution, transcript provenance, and human review.

AI may draft analysis and activities but cannot publish autonomously.

## Superseded product direction

The earlier fixed 28-day workplace-speaking journey is no longer the canonical curriculum roadmap after the owner's 2026-08-02 decision.

Reusable parts remain valuable:

- speaking-task definitions;
- feedback and retry;
- checkpoint and assessment patterns;
- FSRS and progress infrastructure;
- pilot evidence and privacy boundaries.

Do not revert to the old roadmap because existing runtime copy or older documents still mention 28 days.

## Current repository snapshot

Snapshot time: **2026-08-02**. Verify live state before relying on it.

### Canonical main

- `main` snapshot head: `961e779886ff95b1b5f67d5e6997520d1facdb1a`.
- PR #43 merged the focused Gold Day 1 journey.
- `main` does not yet implement the YouTube-to-Curriculum architecture.
- No draft experiment below has been merged or promoted to production.

### PR #46 — authentic-media technical proof

- Branch: `agent/real-talk-public-domain-pilot`.
- Snapshot head: `bbffa43f9d24a79b2f8763229d64cd7ee56ee2a2`.
- State: open, draft, mergeable, not merged, not production.
- It proves one public-domain clip can support provenance, bounded playback, timestamped transcript, retrieval, and optional FSRS.
- It is **not** the final product shape and should not be polished as an isolated destination.
- Reusable code may later serve the seven-day mini-curriculum.
- Known blockers:
  - `p.m.` is moved across timestamp evidence in learner-facing text;
  - approval validation needs catalog permission and human-verified segments;
  - all FSRS save failures are displayed as guest state;
  - browser playback, timestamp stopping, mobile layout, and authenticated save remain unverified;
  - transcript, speakers, names, and translation require human listening review.

### PR #45 — mastery-mechanism experiment

- Branch: `agent/autonomous-mastery-tutor`.
- Snapshot head: `2970d4073ae89ec2aecf6a4d2ace1ead6ae8222b`.
- State: open, draft, mergeable, not merged, not production.
- Diagnosis, teaching only gaps, fading support, repair, cold transfer, and checkpoint gating may be reused inside the new learning core.
- It is not a separate canonical product direction after the owner decision.
- Do not merge the entire experiment solely because Verify passed.

### Merged PR #43 — Gold Day 1

- Supplies useful speaking-task, feedback, retry, checkpoint, and pilot patterns.
- Its synthetic source and fixed 28-day placement are not the long-term curriculum model.

### PR #35

- Older, unmergeable Gold Day 1 branch.
- Treat as stale unless explicitly revived.

### PR #47 — project memory and product-direction reset

- Branch: `docs/persist-project-memory`.
- State: open draft, not merged, not deployed.
- Scope now includes session continuity and alignment of high-authority product documents with YouTube-to-Curriculum.
- Adds `docs/product/YOUTUBE_TO_CURRICULUM.md`.
- Does not change runtime, database, dependencies, or production.
- Next safe action: finish document alignment, collapse to one clean commit, run Verify on the exact head, and leave merge authorization to the owner.

## Current next product action

After PR #47 is accepted, create a separate bounded task to define the Communication Clip, source-review, level-treatment, prerequisite, three-layer lesson, and advancement contracts for the seven-day A0 pilot.

Then build the reviewed 20–30 clip corpus before broad runtime or ingestion automation.

## Durable boundaries

- Work on a dedicated branch and reviewed PR.
- Never automatically merge or deploy.
- Never expose secrets or learner-sensitive data.
- Preserve source rights, attribution, timestamps, transcript provenance, and human review.
- Do not build unrestricted ingestion or autonomous publication.
- Do not build the full A0–B1 graph before the seven-day pilot.
- Passing CI proves repository consistency, not source integrity, curriculum coherence, or learning effectiveness.
- No new standalone lesson engine may replace the canonical direction without owner instruction.