# AtoEnglish product truth

**Status:** canonical product decision source  
**Updated:** 2026-08-02  
**Architecture direction:** `docs/product/YOUTUBE_TO_CURRICULUM.md`  
**Session continuity:** `PROJECT_MEMORY.md`

## What AtoEnglish is now

AtoEnglish is a Vietnamese-first learning system that turns legally usable natural conversations from YouTube and other authentic-media sources into a structured path from near-zero English to stable practical communication.

YouTube is raw language material, not the curriculum.

AtoEnglish must select short authentic communication clips, analyze their language and social function, place them in a prerequisite graph, provide level-appropriate support, and convert comprehension into retrieval and real communication output.

The product is not:

- a collection of unrelated video quizzes;
- an annotated video viewer;
- a synthetic-dialogue library;
- an open-ended chatbot;
- a grammar list ordered independently of communication needs.

## Product advantage

The defensible value is:

> Take the right short piece of real communication, place it at the right point in a learner's journey, and turn it into a capability the learner can reuse outside that clip.

```text
authentic input
+ structured progression
+ active recall
+ repeated exposure across speakers
+ real communication output
= practical language acquisition
```

## Target learner

The initial learner is:

- a Vietnamese adult beginner or false beginner;
- able to recognize some English but unable to retrieve it reliably;
- overwhelmed by unstructured natural media;
- better served by Vietnamese guidance, controlled progression, and repeated exposure;
- willing to practice in short sessions;
- seeking practical everyday or workplace communication rather than exam certification.

## Learner destination

The initial long-range destination is practical high-A2 to B1 communication, not a claim of fluency.

The learner should progressively become able to:

1. recognize common communication functions across different speakers;
2. respond without translating every sentence internally;
3. maintain an ordinary conversation for several minutes;
4. ask follow-up questions;
5. describe experiences, routines, problems, and plans;
6. give simple reasons and opinions;
7. repair misunderstandings and request clarification;
8. understand varied speakers at moderately natural speed;
9. reuse learned language in unseen situations.

## Unit of curriculum

The smallest curriculum unit is a **Communication Clip**, normally 3–60 seconds long. A full video or podcast episode is only a source container.

A clip may support different lessons at A0, A1, A2, and B1. Each treatment teaches only the language and capability appropriate to that learner state.

Curriculum ordering is based on communicative prerequisites:

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

Vocabulary, grammar, pronunciation, reductions, and discourse features support these capabilities; they do not define the roadmap by themselves.

## Learning contract

Every complete clip treatment has three layers.

### 1. Comprehension

The learner understands what real speakers are doing through gist, key evidence, bounded replay, and synchronized transcript support.

### 2. Acquisition

The learner begins to own selected chunks, collocations, patterns, and speech features through active recall, imitation where useful, contextual replay, and later spaced retrieval.

### 3. Transfer

The learner uses the capability beyond the source clip through personal substitution, parallel questions, changed situations, connected turns, and unseen-speaker tests.

Without transfer, completion is not evidence of learning.

## Learning core

The product direction contains four connected systems:

1. **Source Engine** — records approved source metadata, permission, attribution, transcript provenance, speakers, and timestamps.
2. **Language Intelligence Engine** — proposes levels, communication functions, chunks, structures, speech features, social context, prerequisites, and learning value.
3. **Curriculum Graph** — orders capabilities, chooses what comes next, schedules varied exposure, and defines advancement evidence.
4. **Lesson Runtime** — delivers bounded playback, transcript evidence, comprehension, recall, shadowing, response tasks, FSRS, and transfer tests.

AI may assist analysis and drafting but must not publish curriculum autonomously.

## First validation slice

The next product slice is a seven-day A0 mini-curriculum:

- 20–30 reviewed communication clips;
- multiple videos, speakers, and contexts;
- five capabilities:
  1. greet someone;
  2. say one's name;
  3. ask another person's name;
  4. say where one is from;
  5. ask someone to repeat;
- each capability appears in 3–5 clips from different speakers or contexts;
- support fades across the sequence;
- final evidence includes recognition in an unseen clip and personal transfer.

This pilot validates curriculum coherence, not catalog size.

## Source and rights boundary

A public YouTube URL does not automatically grant permission to copy transcripts, translate content, create derivative lessons, or sell access.

A learner-facing clip requires documented permission or a compatible license, or public-domain status. Every published clip must preserve:

- source URL and exact timestamps;
- creator or publisher attribution;
- license or permission evidence;
- transcript provenance;
- human review of transcript, speaker boundaries, names, translation, and learning activities.

Embedding and media access must comply with the source platform's terms and technical constraints.

## Evidence hierarchy

Decisions distinguish:

1. **Repository evidence:** code, data, tests, routes, and current behavior.
2. **Source evidence:** permission, provenance, transcript accuracy, and timestamp accuracy.
3. **Usability evidence:** learners can reach and complete the intended flow.
4. **Learning evidence:** delayed retrieval, unseen-speaker recognition, and transfer improve.
5. **Market evidence:** target learners pay, complete, renew, or refer others.

Passing CI proves repository consistency, not curriculum validity or learning effectiveness.

## Existing foundation

The repository already contains useful capabilities:

- Next.js and responsive lesson surfaces;
- authentication, progress, RLS, and pilot analytics;
- FSRS and review flows;
- speaking tasks, feedback, retry, and checkpoint infrastructure;
- a large legacy synthetic curriculum;
- Vitest, content checks, builds, and Playwright coverage;
- PR #46's authentic-media technical proof;
- PR #45's diagnosis, fading support, repair, and cold-transfer experiment.

These are reusable parts, not the product roadmap by themselves.

## Superseded direction

The focused 28-day workplace-speaking journey is no longer the canonical curriculum roadmap after the owner's 2026-08-02 decision.

Its useful task definitions, speaking evidence, feedback, retry, assessment, and pilot operations may be reused. Future curriculum selection and ordering must follow authentic-input communication capabilities and prerequisites.

Do not silently revert to the old roadmap because existing code or documents still mention 28 days.

## Product decision rule

When choosing work, prefer the smallest change that improves one of these:

- source legality and provenance;
- clip analysis quality;
- prerequisite and curriculum coherence;
- comprehension-to-acquisition progression;
- delayed retrieval;
- exposure across speakers and contexts;
- transfer to unseen communication;
- trustworthy learner evidence.

Do not optimize for video count, feature count, quiz count, or autonomous generation.