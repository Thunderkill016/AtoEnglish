# YouTube-to-Curriculum Engine

**Status:** canonical product architecture direction  
**Owner decision recorded:** 2026-08-02  
**Applies to:** curriculum, source selection, lesson authoring, learner progression, and future product architecture

## Product thesis

AtoEnglish uses legally usable natural conversations from YouTube and other authentic-media sources as language input, then turns that input into a structured path from near-zero English to stable practical communication.

YouTube is raw material, not the curriculum.

AtoEnglish's product advantage is not embedding videos. It is the ability to:

1. select the right short piece of authentic communication;
2. identify what a learner must already know;
3. place the clip at the correct point in a progression;
4. provide level-appropriate support without removing authenticity;
5. convert comprehension into retrieval, production, and transfer;
6. revisit the same function across different speakers and contexts.

```text
authentic conversation sources
→ bounded communication clips
→ language and context analysis
→ prerequisite graph
→ level-specific lesson treatment
→ comprehension
→ acquisition
→ transfer
→ spaced and varied re-exposure
→ practical communication ability
```

The product must not become a collection of unrelated video quizzes.

## Learner destination

The initial long-range destination is practical high-A2 to B1 communication, not a claim of fluency or native-like performance.

A learner should progressively become able to:

- recognize common speech functions across different speakers;
- respond without translating every sentence internally;
- maintain ordinary conversations for several minutes;
- ask follow-up questions;
- describe experiences and problems;
- explain simple reasons and opinions;
- repair misunderstandings;
- cope with moderately natural speed and varied accents;
- reuse learned language in unseen situations.

The first validation slice is much smaller: a seven-day A0 mini-curriculum.

## Unit of curriculum: Communication Clip

The smallest curriculum unit is a `CommunicationClip`, normally 3–60 seconds long. A full video or podcast episode is only a source container.

A single clip may support different lessons at different levels. The system must not teach every feature in a clip at once.

Example:

```text
A: Hey, how's it going?
B: Pretty good. I've just been really busy with work.
A: Yeah? What have you been working on?
```

Possible treatments:

- A0: `How's it going?` / `Pretty good.`
- A1: `I've been busy with work.`
- A2: `What have you been working on?`
- B1: conversation maintenance, pragmatic response, and personal transfer.

Difficulty is controlled by lesson design and prerequisites, not by requiring creators to speak like a textbook.

## Curriculum organization

The curriculum is organized by communicative capability, not video order and not a grammar syllabus.

A simplified capability graph:

```text
recognize greetings
→ introduce oneself
→ ask about another person
→ answer and ask a follow-up
→ sustain three or four turns
→ repair misunderstanding
→ describe and explain
→ narrate and discuss
```

Grammar, vocabulary, pronunciation, reductions, and discourse features are attached to these capabilities as supporting knowledge.

## Progression bands

### Stage 0 — sound and basic recognition

Learner condition: near-zero or false beginner.

Capabilities:

- greetings;
- names, numbers, time, and place;
- very short questions;
- one- or two-chunk responses;
- requests for repetition.

Typical clip length: 3–10 seconds.

Support:

- bilingual transcript;
- chunking and slow replay;
- translation;
- controlled selection;
- recall of one short chunk.

### Stage 1 — survival communication

Capabilities:

- introduce oneself;
- exchange basic information;
- buy, order, ask directions, describe routines and preferences;
- confirm understanding.

Typical clip length: 10–25 seconds.

Learner work:

- first listen without transcript;
- cloze and Vietnamese-to-English retrieval;
- controlled substitution;
- personal answers.

### Stage 2 — conversation maintenance

Capabilities:

- ask follow-up questions;
- describe a short experience;
- give reasons;
- agree or disagree;
- describe problems and suggestions;
- repair listening failures.

Typical clip length: 20–60 seconds.

Learner work increasingly includes dictation, summarization, reformulation, open responses, and connected turns.

### Stage 3 — stable practical communication

Capabilities:

- participate in everyday conversations;
- maintain a conversation for several minutes;
- tell stories and explain viewpoints;
- handle unexpected turns;
- understand varied speakers at moderately natural speed;
- request clarification without abandoning the interaction.

Support appears on demand rather than by default.

## Required clip metadata

A clip must be traceable to its source and usable in a prerequisite graph.

```ts
interface CommunicationClip {
  id: string;
  sourceId: string;
  startSeconds: number;
  endSeconds: number;
  levelTreatments: Array<"A0" | "A1" | "A2" | "B1">;

  communicativeFunctions: string[];
  requiredVocabulary: string[];
  newVocabulary: string[];
  grammarPatterns: string[];
  speechFeatures: Array<
    "linking" | "reduction" | "hesitation" | "weak_forms" | string
  >;
  prerequisites: string[];
  transcriptSegmentIds: string[];

  context: {
    relationship: "strangers" | "friends" | "coworkers" | string;
    setting: string;
    formality: "casual" | "neutral" | "formal";
  };

  provenance: {
    sourceUrl: string;
    mediaUrl: string;
    transcriptSourceUrl?: string;
    licenseOrPermission: string;
    attribution: string;
    humanReviewed: boolean;
  };
}
```

The production schema may evolve, but it must preserve source evidence, timestamps, prerequisites, communicative functions, context, and review state.

## Three-layer lesson contract

Every complete lesson treatment must contain all three layers.

### 1. Comprehension

The learner understands what real speakers are doing:

- gist;
- key people, time, place, intention, or result;
- replay of difficult evidence;
- synchronized transcript when support is opened.

### 2. Acquisition

The learner begins to own selected language from the clip:

- chunks and collocations;
- useful patterns;
- pronunciation and connected-speech features;
- active recall;
- FSRS or later spaced retrieval;
- replay in the original context.

### 3. Transfer

The learner uses the capability beyond the source clip:

- substitutes personal information;
- answers a parallel question;
- combines previously learned chunks;
- responds to a changed situation;
- completes connected turns;
- succeeds on an unseen speaker or clip.

Without transfer, AtoEnglish is only an annotated video viewer.

## Learning-core systems

### 1. Source Engine

Responsibilities:

- accept an approved source URL;
- store source metadata, permission, and attribution;
- identify candidate communication segments;
- preserve speaker and timestamp boundaries;
- retain links to original media.

Initial implementation may be manual or semi-automated. It must not depend on unauthorized transcript copying or unrestricted scraping.

### 2. Language Intelligence Engine

Responsibilities:

- estimate level treatments;
- identify communicative functions;
- extract vocabulary, chunks, patterns, and speech features;
- describe social context;
- propose prerequisites and learning value;
- flag uncertain analysis for human review.

AI may propose analysis but cannot publish curriculum autonomously.

### 3. Curriculum Graph

Responsibilities:

- order capabilities and prerequisites;
- choose what the learner needs next;
- schedule varied examples across speakers and contexts;
- decide when to review and when to test transfer;
- prevent exposure that assumes missing prerequisites;
- determine evidence required to advance.

The graph is organized around communication capability, not a list of videos.

### 4. Lesson Runtime

Responsibilities:

- bounded media playback;
- synchronized transcript evidence;
- gist and detail comprehension;
- chunk acquisition and active recall;
- shadowing or imitation where useful;
- response and multi-turn tasks;
- FSRS integration;
- unseen transfer tests;
- level-appropriate support that fades.

Existing AtoEnglish runtime capabilities should be reused where they serve this contract.

## Source and rights policy

A public YouTube URL does not automatically grant rights to copy a transcript, translate content, create derivative lessons, or sell access to that lesson.

A source can enter a learner-facing catalog only when AtoEnglish has documented permission or a license compatible with the intended use, or when the source is public domain. Embedding may be used only within platform and rights constraints.

Every published clip requires:

- source URL and timestamps;
- creator or publisher attribution;
- license or permission evidence;
- transcript provenance;
- human review of transcript, speaker boundaries, names, translation, and activities.

## First implementation target: seven-day A0 mini-curriculum

Build one coherent progression, not another standalone video lesson.

Scope:

- duration: 7 days;
- corpus: 20–30 communication clips;
- multiple videos and speakers;
- 5 initial capabilities:
  1. greet someone;
  2. say one's name;
  3. ask another person's name;
  4. say where one is from;
  5. ask someone to repeat.

Each capability should appear in 3–5 clips from different speakers or contexts. Variants are introduced in a controlled order rather than all at once.

Example progression for greeting variants:

```text
How are you?
→ How're you doing?
→ How's it going?
→ You alright?
→ What's up?
```

The earliest lesson does not need to teach every variant productively. The progression decides which forms require recognition, recall, or production at each point.

## Pilot success criteria

After the mini-curriculum, a learner should be able to:

- understand the target functions across multiple speakers;
- respond using personal information;
- recognize target functions in an unseen clip;
- avoid dependence on one memorized video;
- retrieve selected language after several days;
- complete a changed communication task with reduced support.

Measure:

- first-listen comprehension;
- acquisition success before and after support;
- delayed retrieval;
- unseen-speaker recognition;
- transfer-task completion;
- abandonment and support requests;
- whether microphone or media failures block progress.

## Relationship to existing work

- PR #46 proves that one authentic clip can support timestamped interaction, provenance, retrieval, and optional FSRS. It is technical evidence, not the final product shape.
- PR #45 explores diagnosis, gap-focused teaching, fading support, repair, and cold transfer. Those mechanisms may be reused inside the new core, but PR #45 is not a separate canonical product direction.
- The merged Gold Day 1 work supplies useful speaking-task, feedback, retry, and pilot infrastructure. Its fixed synthetic lesson is not the long-term curriculum source model.
- The earlier 28-day workplace journey is superseded as the canonical roadmap. Useful capabilities and evidence contracts may be retained, but future curriculum ordering follows authentic-input communication capabilities.

## Explicit non-goals for the next slice

Do not yet build:

- unrestricted paste-any-YouTube ingestion;
- unauthorized caption scraping;
- autonomous AI publication;
- the full A0–B1 graph;
- a large public video catalog;
- microservices or a second database;
- proprietary speech recognition or pronunciation scoring;
- broad gamification or payment changes;
- production promotion before source, browser, learner, and rights checks.

The next task is a bounded curriculum compiler pilot with a small reviewed corpus.