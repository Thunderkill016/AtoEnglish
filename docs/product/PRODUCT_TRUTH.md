# AtoEnglish product truth

**Status:** canonical product decision source  
**Updated:** 2026-08-02  
**Architecture:** `docs/product/NATURAL_COMMUNICATION_LEARNING_SYSTEM.md`  
**Previous architecture record:** `docs/product/YOUTUBE_TO_CURRICULUM.md`

## What AtoEnglish is

AtoEnglish is a Vietnamese-first English-learning environment built around naturally occurring communication.

The learner enters recognisable situations, understands what people are doing, responds, repairs misunderstandings, continues conversations, and later succeeds with different speakers and contexts.

The product has a curriculum, but the curriculum is not the learner-facing experience.

> Natural communication on the surface; an invisible structured curriculum underneath.

## Product model

```text
natural interaction corpus
→ communication events
→ capability mapping
→ invisible prerequisite graph
→ environment-based session
→ comprehension
→ retrieval and response
→ changed-context interaction
→ delayed and varied re-exposure
```

AtoEnglish does not begin with an academic lesson title and then hunt for a video containing the desired sentence. It begins with complete natural interaction sources, identifies what actually happens, and builds progression from reusable communication events.

## Learner-facing experience

The learner should see practical environments and goals:

- meet someone new;
- order or buy something;
- find a place;
- recover when they do not understand;
- talk briefly about themselves;
- keep a conversation going.

The learner should not be required to navigate grammar chapters, isolated phrase lists, or CEFR descriptors.

Grammar, vocabulary, pronunciation, and discourse knowledge are still taught when they solve a real communication problem. They remain visible as help, not as the organising identity of the product.

## Source truth

A source recording is raw communication evidence, not a ready-made lesson.

Preferred sources capture real goals and real turn-taking:

- unscripted creator conversations;
- vlogs containing genuine interactions;
- podcasts and interviews with responsive dialogue;
- livestreams;
- naturally occurring workplace or service encounters;
- public events and street interactions;
- AtoEnglish-owned unscripted recordings;
- licensed or public-domain natural media.

A polished recording can still be natural. A public recording can still be staged. Naturalness must be reviewed from context and interaction evidence rather than inferred from platform, popularity, production quality, or the presence of a target phrase.

## Unit hierarchy

1. **Source recording** — a complete video, audio recording, livestream, interview, or conversation.
2. **Communication event** — a bounded real action such as opening, asking, acknowledging, confirming, repairing, following up, or closing.
3. **Communication clip** — a playable excerpt containing one or more events.
4. **Communicative capability** — a reusable practical ability.
5. **Environment experience** — the learner-facing session that turns source evidence into comprehension, retrieval, response, interaction, and transfer.

## Learning contract

Every complete environment experience must include:

### First encounter

The learner sees or hears the situation before the transcript or answer is revealed and identifies purpose, relationship, intention, or outcome.

### Progressive support

Help appears only as needed:

```text
replay
→ context hint
→ keyword
→ English caption
→ chunking
→ Vietnamese meaning
→ slower playback when available
```

### Acquisition

The learner retrieves useful chunks, patterns, speech features, and interactional behaviour from memory rather than only recognising them.

### Interaction

The learner produces the next plausible turn and reacts to a follow-up, confirmation, misunderstanding, or conversational change.

### Transfer

The system changes the speaker, wording, setting, relationship, information, speed, or conversational problem. Success on the original clip alone is not mastery.

### Delayed evidence

The learner must later recognise or use the capability again with reduced support.

## Invisible curriculum

The internal graph tracks:

- capability prerequisites;
- vocabulary, chunks, and grammar required for a practical goal;
- connected-speech and listening features;
- relationships, settings, and formality;
- speaker and accent diversity;
- support used;
- productive retrieval;
- interactional use;
- delayed transfer;
- unseen-speaker and changed-context evidence.

The graph determines what experience appears next. It must not force natural source material into a misleading textbook sequence.

## Initial learner

The first learner is a Vietnamese adult beginner or false beginner who:

- recognises some English but cannot retrieve it reliably;
- finds natural media overwhelming;
- needs Vietnamese guidance and controlled support;
- wants everyday and workplace communication rather than exam certification;
- can practise in short sessions;
- needs repeated exposure across speakers and situations.

## Initial destination

The long-range target is stable practical high-A2 to B1 communication, not a claim of fluency.

The learner should progressively become able to:

- understand common functions across speakers;
- respond without translating every sentence internally;
- ask follow-up questions;
- maintain ordinary conversations for several minutes;
- describe routines, experiences, problems, and plans;
- give simple reasons and opinions;
- confirm information and repair misunderstandings;
- cope with moderately natural speed and varied speakers;
- reuse learned behaviour in unseen situations.

## First validation slice

Build five environment experiences:

1. **Meet someone new** — open, exchange names, acknowledge, and ask one follow-up.
2. **Buy or order something** — get attention, request, confirm, and close.
3. **Find a place** — ask, identify key location information, and confirm.
4. **Recover from a listening failure** — signal difficulty, request repetition or clarification, and continue.
5. **Talk briefly about oneself** — answer, add one detail, and return a question.

Each environment requires:

- an accessible anchor interaction;
- naturally occurring variations;
- multiple speakers or contexts;
- at least one unexpected or repair turn;
- guided learner response;
- changed-context transfer;
- delayed re-exposure.

Corpus size follows coverage quality. Do not force a fixed clip quota with unrepresentative or unsuitable sources.

## Product advantage

The defensible value is not the number of videos, transcripts, generated lessons, or AI features.

It is the ability to:

> turn messy real communication into a coherent learner journey without making the experience feel like an academic syllabus.

## Source and rights boundary

Naturalness and usage rights are separate gates.

A source may be natural but unavailable for transcript storage, translation, clip extraction, self-hosting, or derivative lesson creation. Full curriculum use requires ownership, documented permission, public-domain status, or a compatible licence.

Embed-only or companion sources must not silently become stored transcript curriculum.

Every learner-facing source must preserve applicable provenance, attribution, review, and takedown state.

## Evidence hierarchy

1. **Repository evidence** — code, data, tests, routes, and current behaviour.
2. **Source evidence** — rights, provenance, naturalness, transcript, speakers, and timestamps.
3. **Usability evidence** — learners can enter and complete the environment.
4. **Learning evidence** — reduced support, retrieval, interaction, delayed use, and transfer improve.
5. **Market evidence** — learners pay, complete, renew, or refer.

Passing CI proves repository consistency, not source suitability or learning effectiveness.

## Product non-goals

AtoEnglish is not:

- an academic grammar course with videos attached;
- a feed of random English clips;
- a phrase-search engine;
- a library of scripted teaching dialogues presented as authentic;
- an annotated video viewer;
- an unrestricted chatbot;
- an autonomous lesson-publication system.

## Work-selection rule

Prefer the smallest change that improves one of these:

- natural corpus quality and representativeness;
- source rights and provenance;
- communication-event analysis;
- environment-session coherence;
- invisible prerequisite selection;
- comprehension-to-retrieval progression;
- multi-turn interaction;
- varied and delayed transfer;
- trustworthy learner evidence.

Do not optimise for video count, quiz count, grammar coverage charts, generated lesson count, or novelty alone.