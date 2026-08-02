# Natural Communication Learning System

**Status:** canonical product architecture  
**Owner decision:** 2026-08-02  
**Supersedes:** treating YouTube-to-Curriculum as the learner-facing product identity

## Product thesis

AtoEnglish is a Vietnamese-first environment for learning English through naturally occurring communication.

The learner should feel that they are entering situations, understanding people, responding, repairing misunderstandings, and continuing conversations. They should not feel that they are progressing through an academic grammar syllabus.

The curriculum still exists, but it is infrastructure rather than the learner-facing interface.

> Natural communication on the surface; an evidence-based invisible curriculum underneath.

## Core distinction

Natural source material and structured progression solve different problems.

- Source material must preserve real communicative purpose, spontaneous language, real turn-taking, variation, hesitation, repair, and social context.
- The learning system must select, sequence, scaffold, revisit, and assess those interactions so the learner actually progresses.

AtoEnglish must not script source conversations to fit a predetermined lesson. It must also not present an unstructured feed of random videos.

```text
natural interaction corpus
→ communication events
→ capability mapping
→ invisible prerequisite graph
→ environment-based learner session
→ listening and response
→ changed-context interaction
→ delayed and varied re-exposure
```

## Learner-facing organization

Learners choose or receive environments and practical goals, not grammar chapters.

Initial environments:

1. meet a new person;
2. order or buy something;
3. ask for a place or directions;
4. recover when communication fails;
5. have a short conversation about oneself.

A learner-facing title should describe an experience:

- `Meet someone at an event`;
- `Order at a busy café`;
- `Find the correct platform`;
- `Ask someone to repeat`;
- `Keep the conversation going`.

Avoid learner-facing titles such as `Wh-questions`, `Present simple`, or `Unit 3: Greetings`.

## Source acquisition principle

The corpus is collected by environment and source quality, not by searching for one target phrase at a time.

Correct process:

```text
select natural communication environments
→ review complete source recordings
→ identify every useful communication event
→ annotate what actually happened
→ map events to capabilities
→ select a progression
```

Incorrect process:

```text
choose a sentence to teach
→ search for a video containing that sentence
→ treat the result as representative natural language
```

Phrase-targeted discovery may identify examples, but it must be labelled exploratory and must not define the corpus.

## Naturalness contract

A source is considered naturally occurring only when reviewers can support all relevant claims:

- participants have a real social or practical goal beyond demonstrating English;
- no language-learning script was supplied;
- responses depend on prior turns rather than a fixed dialogue;
- timing, hesitation, overlap, repair, or follow-up behaviour are consistent with real interaction;
- the recording context is understood;
- editing has not removed so much context that the interaction becomes misleading;
- the spoken audio is actually English when used for English listening;
- the context is appropriate for the target learner.

Natural does not automatically mean suitable. Crisis calls, coercive situations, highly sensitive encounters, or extremely specialised speech may be authentic but pedagogically inappropriate.

## Curriculum unit hierarchy

### 1. Source recording

A complete video, podcast, livestream, interview, service encounter, or owned recording. It is a source container, not a lesson.

### 2. Communication event

A bounded event in which speakers perform a real function, such as:

- opening an interaction;
- identifying someone;
- exchanging information;
- acknowledging an answer;
- asking a follow-up;
- confirming information;
- requesting clarification;
- correcting a misunderstanding;
- buying time;
- changing topic;
- closing the interaction.

### 3. Communication clip

A playable excerpt containing one or more communication events. A clip may support several levels and capabilities through different treatments.

### 4. Capability

A reusable learner ability, expressed as a practical `can do`, not a grammar label.

### 5. Environment experience

A learner-facing session that combines source interaction, comprehension, acquisition, response, and transfer inside a recognisable situation.

## Invisible curriculum

The internal curriculum tracks:

- capability prerequisites;
- vocabulary and chunks;
- grammar required for the current purpose;
- connected-speech features;
- social relationship and formality;
- speaker and accent diversity;
- support used by the learner;
- productive retrieval;
- interactional use;
- delayed transfer;
- unseen speaker and changed-context performance.

The learner does not need to navigate this graph directly. It decides what experience appears next and how much support is shown.

## Environment session contract

A complete session normally follows this sequence.

### 1. Enter the situation

Show the setting, participants, relationship, and practical goal without explaining the target grammar.

### 2. First encounter

Play the interaction with no transcript or answer exposure. Ask about purpose, relationship, outcome, or intention.

### 3. Evidence and support

Reveal help progressively:

```text
replay
→ context hint
→ keyword
→ English caption
→ chunk boundaries
→ Vietnamese meaning
→ slower playback when technically possible
```

### 4. Notice useful behaviour

Identify selected chunks, speech features, and interactional moves that help complete the goal.

### 5. Retrieve and reconstruct

Hide the answer and require the learner to recall or rebuild useful language.

### 6. Respond

The learner gives personal information or completes the next conversational turn.

### 7. Continue the interaction

The system or another learner produces a plausible next turn. The learner must acknowledge, answer, ask, clarify, or close.

### 8. Transfer

Change at least one meaningful dimension:

- speaker;
- wording;
- location;
- relationship;
- speed;
- information;
- conversational problem.

Success on the original clip alone is not mastery.

## Role of grammar and vocabulary

Grammar and vocabulary remain essential, but they are introduced as tools for a communicative goal.

For example, an environment may require:

- question forms to identify another person;
- present simple to describe routines;
- past forms to explain what happened;
- modal expressions to make a polite request.

The learner may receive a concise explanation when it removes a real blocker. The system must not reorganise the experience into a detached academic chapter.

## Initial product slice

Build five environment experiences rather than a seven-day sequence organised around isolated phrases:

1. **Meet someone new** — open, exchange names, acknowledge, and ask one follow-up.
2. **Buy or order something** — get attention, request, confirm, and close.
3. **Find a place** — ask, understand key location information, and confirm.
4. **Recover from a listening failure** — signal difficulty, request repetition or clarification, and continue.
5. **Talk briefly about oneself** — answer, add one detail, and return a question.

Each environment should contain:

- one accessible anchor interaction;
- several naturally occurring variations;
- multiple speakers and contexts;
- at least one interaction containing repair or an unexpected turn;
- one guided AI or human-response activity;
- one changed-context transfer task;
- delayed re-exposure after the initial session.

The initial corpus size is determined by coverage quality, not a fixed quota. Missing natural evidence must remain an explicit coverage gap rather than being filled with a misleading source.

## Product evidence

A successful session is not defined by video completion or multiple-choice accuracy.

Track:

- first-encounter comprehension;
- support required;
- ability to retrieve useful language without answer exposure;
- ability to produce the next conversational turn;
- ability to recover from misunderstanding;
- performance with a different speaker;
- performance in a changed situation;
- delayed retrieval and transfer;
- abandonment and technical blockers.

## Product boundaries

AtoEnglish is not:

- a grammar course with videos attached;
- a feed of entertaining English clips;
- a phrase-search engine;
- an academic CEFR textbook rendered as a website;
- a collection of scripted teaching dialogues presented as authentic;
- an unrestricted chatbot;
- an autonomous lesson-generation pipeline.

## Source and rights boundary

The naturalness decision and the rights decision are separate gates.

A source may be natural but unavailable for derivative lesson creation. In that case it may only be used through a compliant companion experience when platform and rights conditions permit.

Full transcript storage, translation, clip extraction, self-hosting, or derivative lesson creation requires a documented compatible licence, public-domain basis, ownership, or permission.

## Implementation direction

Keep the current modular monolith and separate responsibilities:

1. **Natural Corpus** — source, rights, context, naturalness evidence, and recording review.
2. **Communication Intelligence** — event segmentation, function, speech, social context, and capability mapping.
3. **Invisible Curriculum** — prerequisites, exposure diversity, support fading, evidence, and next-experience selection.
4. **Environment Runtime** — situation entry, playback, support, retrieval, multi-turn response, transfer, and review.

AI may draft annotations and activities. Humans remain responsible for source rights, transcript accuracy, naturalness, suitability, and publication.