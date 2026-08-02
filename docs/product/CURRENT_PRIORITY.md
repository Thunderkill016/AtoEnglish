# AtoEnglish current priority

**Updated:** 2026-08-02  
**Owner:** Thunderkill016  
**Product truth:** `docs/product/PRODUCT_TRUTH.md`  
**Architecture:** `docs/product/NATURAL_COMMUNICATION_LEARNING_SYSTEM.md`  
**Session continuity:** `PROJECT_MEMORY.md`

## North star

Build a Vietnamese-first English-learning system that feels like participation in natural communication while using an invisible curriculum to create reliable progress from near-zero English to practical high-A2/B1 communication.

The immediate goal is not a large catalog, a grammar syllabus, or a sophisticated scraper. It is to prove that one environment experience can transform natural interaction into comprehension, retrieval, multi-turn response, changed-context transfer, and delayed use.

## Current phase

**Phase: align the repository with environment-first learning, then define and validate the first environment experience.**

Owner decision recorded on 2026-08-02:

- the learner-facing product is a set of natural communication environments;
- the curriculum remains structured but operates invisibly underneath;
- source discovery begins from complete natural recordings and communication events;
- source conversations must not be selected or arranged only to match a predetermined phrase lesson;
- grammar, vocabulary, pronunciation, and discourse remain support for practical goals;
- transfer and delayed varied performance remain required evidence;
- naturalness and usage rights are separate gates.

## Ordered queue

### 1. Persist the environment-first product direction — current task

PR #53 must align:

- `PROJECT_MEMORY.md`;
- `AGENTS.md`;
- `AGENT_PLAN.md`;
- `AGENT_BACKLOG.md`;
- `docs/product/PRODUCT_TRUTH.md`;
- `docs/product/NATURAL_COMMUNICATION_LEARNING_SYSTEM.md`;
- this file;
- `docs/product/DO_NOT_BUILD.md`;
- previous architecture references where required.

It must also record live branch/PR/SHA state and restore any temporarily retargeted PR to the correct stack.

**Done when:** all high-authority documents agree, PR #52 is restored to base PR #50 and draft, PR #53 records exact final head, and GitHub Verify passes on that head.

### 2. Define communication-event contracts

Create the smallest stable model for:

- complete source recording;
- participants and relationship;
- setting, channel, and formality;
- naturalness evidence;
- communication-event boundaries;
- observed interactional function;
- transcript/source evidence;
- suitability and rejection state;
- rights and allowed uses;
- human review.

The contract must distinguish:

```text
what happened in the source
from
how AtoEnglish may teach from it
```

Do not implement a generalized ingestion platform or database migration unless the first environment cannot function without it.

### 3. Collect an environment-first corpus sample

Review complete recordings across five environments:

1. meet someone new;
2. buy or order something;
3. find a place;
4. recover from a listening failure;
5. talk briefly about oneself.

Do not begin by searching for target sentences. Review the recording first, then annotate all useful events that occur.

Per source/event record:

- source and context;
- naturalness evidence;
- rights status and allowed uses;
- transcript provenance;
- exact timestamps and speakers;
- observed functions;
- intelligibility and suitability;
- rejection reasons where applicable.

Corpus size follows useful coverage, not a fixed quota.

### 4. Define the environment experience and invisible curriculum

The first complete experience must include:

- situation entry;
- first encounter without transcript or answer exposure;
- progressive support;
- selected useful language and interactional behaviour;
- retrieval/reconstruction;
- learner response;
- plausible follow-up or repair;
- changed-context transfer;
- delayed and varied re-exposure.

The invisible graph must choose events and support based on prerequisites and evidence without exposing an academic roadmap to the learner.

### 5. Implement `Meet someone new`

Build one bounded vertical slice using the new contracts.

Required behaviour:

- natural anchor interaction;
- variations across speakers/contexts;
- acknowledgement and follow-up, not just name exchange;
- at least one misunderstanding or repair turn;
- typed path that does not require microphone;
- changed-context interaction;
- delayed re-exposure;
- source and activity evidence links.

Reuse existing mechanisms only where they directly serve this experience.

### 6. Run a small learner pilot

Measure:

- first-encounter comprehension;
- support required;
- retrieval without answer exposure;
- ability to produce the next turn;
- ability to continue after misunderstanding;
- performance with a different speaker;
- changed-context transfer;
- delayed retrieval/use;
- abandonment and technical blockers.

Video completion or multiple-choice accuracy alone is insufficient.

## Current branch stack

- `main`: `961e779886ff95b1b5f67d5e6997520d1facdb1a`.
- PR #47: previous documentation direction, head `213e217a...`.
- PR #48: compiler contracts, head `d1e80385...`.
- PR #49: first phrase-targeted source batch, head `0e96ba88...`.
- PR #50: licensed-core/companion/source fallback base, head `4f94223b...`.
- PR #51: natural candidate shortlist, head `b0a00998...`.
- PR #52: authorized media/caption demo, head `a874120a...`, base restored to PR #50, draft, Verify #78 passed.
- PR #53: current product reset, stacked on PR #50, draft.

## Decisions already completed

- Natural communication environments are the learner-facing product.
- Curriculum is invisible infrastructure, not the interface.
- Complete natural recordings precede communication-event annotation.
- Phrase-targeted source discovery is exploratory, not canonical corpus construction.
- Communication clips remain reusable source excerpts but are not automatically lessons.
- Learning evidence requires retrieval, interaction, transfer, and delayed varied use.
- Rights and naturalness require separate review.
- The long-range target remains practical high-A2/B1, not a fluency claim.

Do not reopen these decisions without new owner instruction or learner evidence.

## Work-selection rule

A task may enter the active queue only when it improves one of these:

1. natural corpus quality or representativeness;
2. source rights, provenance, transcript, or human-review integrity;
3. communication-event analysis;
4. environment-session coherence;
5. invisible prerequisite and next-experience selection;
6. retrieval, multi-turn response, transfer, or delayed evidence;
7. a production, security, privacy, or data-integrity defect;
8. a repeated development blocker observed in real work.

Do not start unrelated ingestion, catalog scale, full A0–B1 breadth, broad gamification, payment, architecture, or autonomous publication work.

## Exit criteria for this phase

This phase is complete when:

- repository truth and branch state reflect the environment-first direction;
- communication-event and environment-experience contracts exist;
- a small environment-first corpus sample has been reviewed from complete recordings;
- one `Meet someone new` experience runs end to end;
- learners demonstrate reduced-support comprehension, next-turn production, repair, changed-context transfer, and delayed use;
- the owner has evidence to continue, revise, or reject the approach.