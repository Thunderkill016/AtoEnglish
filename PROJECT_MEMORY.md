# AtoEnglish project memory

**Status:** mandatory cross-session source  
**Updated:** 2026-08-02  
**Repository:** `Thunderkill016/AtoEnglish`  
**Default branch:** `main`

This file stores only durable product decisions, live repository structure, unresolved blockers, and the next safe action. It is not a chat transcript.

## Authority order

1. Owner's latest explicit instruction.
2. `docs/product/PRODUCT_TRUTH.md`.
3. `docs/product/NATURAL_COMMUNICATION_LEARNING_SYSTEM.md`.
4. `docs/product/CURRENT_PRIORITY.md`.
5. `docs/product/DO_NOT_BUILD.md`.
6. Live repository, pull requests, checks, source evidence, and this snapshot.
7. `AGENT_PLAN.md`, `AGENT_BACKLOG.md`, and task handoffs.

`docs/product/YOUTUBE_TO_CURRICULUM.md` is retained as the previous architecture record. Its useful source, clip, prerequisite, and transfer ideas remain valid, but it is no longer the learner-facing product identity.

## Canonical product decision

AtoEnglish is a Vietnamese-first system for learning English inside naturally occurring communication environments.

> Natural communication on the surface; an invisible structured curriculum underneath.

The learner enters recognisable situations, understands people, responds, repairs misunderstandings, continues the interaction, and later succeeds with changed speakers and contexts.

The system must not present an academic grammar syllabus with videos attached. It must also not become a random feed of English clips.

```text
natural interaction corpus
→ communication events
→ capability mapping
→ invisible prerequisite graph
→ environment experience
→ first encounter and progressive support
→ retrieval and multi-turn response
→ changed-context transfer
→ delayed and varied re-exposure
```

## Source and curriculum separation

Natural source collection and curriculum ordering are separate responsibilities.

Correct source process:

```text
select a real communication environment
→ review complete recordings
→ identify all useful communication events
→ annotate what actually happened
→ map events to reusable capabilities
→ build progression
```

Incorrect process:

```text
choose a sentence or lesson first
→ search for a video containing it
→ call the result representative natural language
```

Phrase-targeted discoveries from earlier batches are exploratory evidence only. They do not define the canonical corpus.

## Initial product slice

Build five learner-facing environments:

1. meet someone new;
2. buy or order something;
3. find a place;
4. recover from a listening failure;
5. talk briefly about oneself.

Each environment should contain an accessible anchor, naturally occurring variations, multiple speakers or contexts, an unexpected or repair turn, guided response, changed-context transfer, and delayed re-exposure.

Corpus size follows coverage quality. Do not fill quotas with unnatural, misleading, overly difficult, or unsuitable sources. Missing evidence remains an explicit coverage gap.

## Current repository snapshot

Snapshot time: **2026-08-02 18:11 +07:00**. Verify live state before relying on it.

### `main`

- Head: `961e779886ff95b1b5f67d5e6997520d1facdb1a`.
- Latest merged product PR: #43, focused Gold Day 1.
- Main does not yet contain the natural-communication architecture or compiler contracts below.
- No branch in the current stack has been merged or deployed to production.

### Current stacked product work

| PR | Branch | Base | Head | State | Role |
|---|---|---|---|---|---|
| #47 | `docs/persist-project-memory` | `main` | `213e217a5f0e57b4f2aa0879716755b14381eaab` | open draft | Previous YouTube-to-Curriculum documentation reset |
| #48 | `feature/curriculum-compiler-contracts` | PR #47 | `d1e8038584ea7963d3ab5a6ab6ae9ab4cf103d6a` | open draft | Source, clip, capability, treatment, evidence, validation contracts |
| #49 | `content/a0-source-curation-batch-1` | PR #48 | `0e96ba88400761e24953c6d2fd89b3e27210e033` | open draft | Phrase/capability-targeted discovery batch; exploratory only |
| #50 | `feature/two-lane-content-model` | PR #48 | `4f94223bec700ca89afc42b47a01b84404585c5f` | open draft | Licensed core, companion lane, source-library fallback |
| #51 | `content/natural-a0-candidates-batch-2` | PR #50 | `b0a009989385ba51663136b1efbcd2831a926562` | open draft | Natural-interaction shortlist; still phrase-targeted and unverified |
| #52 | `experiment/authorized-natural-media-ingestion` | PR #50 | `a874120a389c451cc39ac7a4cbd1fb4692f0fcce` | open draft | TypeScript demo: Data API/oEmbed metadata + authorized local captions |
| #53 | `product/natural-communication-environments` | PR #50 | see live PR head | open draft | Current canonical product-surface reset and repository synchronization |

### Verification evidence

- PR #47 Verify #69 passed on `213e217...`.
- PR #48 Verify #72 passed on `d1e803...`.
- PR #49 Verify #73 passed on `0e96ba...`.
- PR #50 Verify #75 passed on `4f9422...`.
- PR #51 Verify #76 passed on `b0a009...`.
- PR #52 Verify #78 passed on `a87412...` after adding no-key oEmbed fallback.
- PR #53 requires a new exact-head Verify run after document alignment is complete.

CI proves repository consistency only. It does not prove source rights, naturalness, transcript accuracy, pedagogical suitability, browser playback, or learner outcomes.

## Correct interpretation of existing branches

- PR #47 records the previous product name. PR #53 supersedes that learner-facing identity without discarding the useful authentic-input architecture.
- PR #48 remains reusable domain infrastructure, but future extensions should add environment and communication-event concepts rather than treating clips as standalone lessons.
- PR #49 and PR #51 exposed a discovery bias: starting from target phrases or predetermined capabilities can make a corpus look natural while still being curriculum-shaped. Preserve them as research evidence, not the canonical corpus.
- PR #50 remains the current stack base because its rights-safe licensed-core and companion boundaries are still required.
- PR #52 is an authoring/ingestion experiment for authorized captions, not the product roadmap.
- PR #45 and PR #46 remain older unmerged mechanism/technical proofs. Reuse only what serves environment sessions.

## Durable product boundaries

- Do not scrape or download unauthorized YouTube media or captions.
- Do not represent scripted teaching dialogues as natural interaction.
- Do not build the corpus by hunting isolated target phrases.
- Do not organize learner navigation around grammar chapters.
- Do not let a companion-only source become a full curriculum source.
- Do not publish AI-generated source analysis without human rights, transcript, naturalness, suitability, and pedagogical review.
- Do not merge, deploy, or promote production without explicit owner authorization.
- Do not store secrets, cookies, raw chats, preview tokens, or learner-sensitive data in project memory.

## Current next action

Finish PR #53 alignment across all high-authority documents, record the final exact head in the PR body, run GitHub Verify, and keep the PR draft.

After the owner accepts the direction, define the smallest environment and communication-event contracts, then collect a small environment-first corpus by reviewing complete natural recordings rather than phrase search results.