# Authentic Clip Learning Contract

**Status:** canonical curriculum and lesson contract  
**Owner decision:** 2026-08-02  
**Applies to:** source curation, Communication Clips, curriculum graph, lesson runtime, review, assessment, and learner choice

## Purpose

AtoEnglish uses legally usable natural English conversations as input, but authentic media alone does not produce learning.

The product must transform selected moments from real conversations into a structured path where a Vietnamese learner can:

1. understand what a real speaker means;
2. recognize useful language in natural speech;
3. retrieve that language without reading a complete answer;
4. use it with personal information;
5. maintain an interaction when the situation changes;
6. recognize the same communicative function from another speaker;
7. use it again after a delay.

The canonical learning loop is:

```text
authentic input
→ comprehension
→ acquisition through retrieval
→ supported production
→ changed-context interaction
→ unseen-speaker transfer
→ delayed retrieval
```

A video view, subtitle read, quiz score, shadowing streak, or completed screen is not sufficient evidence of acquisition.

## Curriculum unit

The curriculum is organized around a `CommunicativeCapability`, not a full video, grammar chapter, or isolated vocabulary list.

Examples:

- recognize and answer a greeting;
- say one's name;
- ask another person's name;
- say where one is from;
- request repetition;
- answer and ask a follow-up question;
- confirm information;
- give a short reason;
- describe a problem;
- tell a short experience.

Each capability must define:

- a learner-facing can-do statement;
- its true hard prerequisites;
- editorial sequence separately from prerequisites;
- communicative functions;
- a minimum number of distinct clips;
- a minimum number of distinct speakers;
- the evidence required for advancement.

Do not turn editorial order into false hard dependencies. For example, requesting repetition is a survival strategy that may be scheduled later in the week without requiring every previous introduction capability.

## Communication Clip

A `CommunicationClip` is usually 3–60 seconds and contains one bounded conversational moment.

Every clip preserves:

- source asset and source URL;
- exact start and end timestamps;
- transcript segments in timestamp order;
- speaker identity or stable anonymous speaker label;
- verbatim source text;
- learner-facing normalization stored separately;
- Vietnamese translation;
- social relationship, setting, formality, and channel;
- lexical items, patterns, and natural-speech features;
- human review and publication state;
- declared candidate capabilities.

One clip may support different capabilities or levels, but each `ClipTreatment` has one target capability.

## Clip-set roles

A capability is not taught from one clip. Its learning set must include different treatment roles.

### Anchor

The clearest first example of the communicative function.

- short;
- context is obvious;
- audio is clean;
- one main target;
- substantial support may be available.

### Variation

The same communicative purpose with a different wording, speaker, relationship, or setting.

Variation prevents the learner from memorizing only one surface sentence.

### Natural speech

A clip that exposes controlled real-world features such as:

- linking;
- weak forms;
- reduction;
- hesitation;
- stress and intonation;
- moderate speed.

The learner first understands the stable form, then connects it to the natural acoustic form.

### Interaction

A multi-turn exchange where the learner must respond and continue the conversation.

A learner cannot demonstrate interactional competence through a single isolated sentence.

### Cold transfer

A new speaker, clip, wording, or situation not used during instruction.

The answer is not shown. This role tests whether the learner controls the communicative function rather than the memorized source.

For the first A0 mini-curriculum, every capability requires at least:

- three distinct clips;
- three distinct speakers;
- one anchor treatment;
- one interaction treatment;
- one cold-transfer treatment.

The preferred editorial target is three to five clips per capability.

## Treatment, not raw difficulty

A natural conversation does not need to be easy before AtoEnglish can use it. Difficulty is controlled through treatment design.

Example source line:

```text
I was gonna head out, but then she called me back.
```

A beginner treatment may build toward it through:

```text
head out
→ I'm going to head out
→ I was going to head out
→ I was gonna head out
→ hear the authentic line again
```

Do not teach every feature inside a rich clip at once. A treatment selects only the language needed for its target capability and level.

## Required lesson layers

Every learner-facing treatment must contain all three layers.

### 1. Comprehension

The learner understands the speaker's meaning or communicative intention.

Suitable tasks include:

- cold first listen;
- gist choice;
- identify who, where, when, or why;
- keyword detection;
- distinguish a greeting from a request or refusal;
- replay a difficult segment.

The first listen should normally avoid full bilingual subtitles. The goal is to observe current understanding, not to punish the learner for missing every word.

### 2. Acquisition

The learner turns source language into retrievable language.

Suitable tasks include:

- transcript decoding;
- chunking;
- listen and reconstruct;
- active recall;
- Vietnamese cue to English response;
- controlled variation;
- selective shadowing;
- natural-speech discrimination.

Acquisition must include productive retrieval. Recognition and repetition alone do not satisfy this layer.

### 3. Transfer

The learner uses the capability beyond the original clip.

Suitable tasks include:

- answer with personal information;
- change one variable in the response;
- use the function in a different relationship or setting;
- react to an unpredictable turn;
- complete a multi-turn interaction;
- respond to an unseen speaker;
- perform the task again after a delay.

A transfer activity must:

- require learner production;
- hide the complete answer;
- change the context or present unseen input;
- preserve the same communicative goal.

Without valid transfer, the lesson is an annotated-video exercise rather than language acquisition.

## Lesson runtime contract

A normal lesson should take approximately 10–15 minutes and follow this progression.

### Step 1 — Cold listen

Play the clip once with minimal support.

Ask one simple meaning or intention question. Do not require word-for-word transcription from an A0 learner.

### Step 2 — Establish the situation

Give concise Vietnamese context:

- who is speaking;
- their relationship;
- where the exchange happens;
- what the speaker is trying to achieve.

Context must clarify meaning without revealing the complete target response.

### Step 3 — Open support progressively

Use this scaffold ladder where appropriate:

```text
replay
→ context hint
→ keyword hint
→ English caption
→ chunking
→ Vietnamese meaning
→ slow playback
```

Do not reveal every support layer at the start. Track which support the learner needed.

### Step 4 — Notice useful language

Extract a small number of reusable chunks.

For example:

```text
Sorry,
I didn't catch that.
Could you say that again?
```

Explain what each chunk does in the conversation rather than teaching a long grammar lecture.

### Step 5 — Decode natural speech

Connect the stable written form to what the learner actually hears.

Focus only on high-value features such as:

- `could you` linking;
- weak vowels;
- contraction;
- phrase stress;
- rising or falling intonation;
- hesitation that changes turn timing.

The target is intelligibility and listening recognition, not imitation of a native accent.

### Step 6 — Retrieve without the model

Fade the answer:

```text
Could you ___ that again?
Could you say ___ again?
________________________?
```

The learner must retrieve, not copy.

### Step 7 — Vary the response

Change one part while keeping the communicative function:

```text
Could you repeat the address?
Sorry, what was the name?
Could you say the time again?
```

### Step 8 — Personal or meaningful production

Use the learner's own name, origin, role, preference, or situation where safe and appropriate.

Do not store raw learner audio or unrestricted personal free text in analytics.

### Step 9 — Changed-context interaction

Move the same capability to a new setting, relationship, or channel.

Examples:

- coworker to receptionist;
- in-person to phone;
- shop to hotel;
- familiar wording to a shorter natural variant.

### Step 10 — Immediate retry

Give no more than one or two high-impact corrections, then require another attempt.

A correction without a retry is incomplete feedback.

## Natural speaking means interactional control

Natural communication is not defined by slang or accent imitation.

The curriculum must progressively teach the learner to:

- recognize a turn and respond on time;
- use short acknowledgements;
- ask a follow-up question;
- confirm information;
- request repetition or slower speech;
- clarify a number, name, time, or place;
- buy thinking time;
- self-correct;
- paraphrase when a word is missing;
- keep a topic for several turns;
- close a conversation appropriately.

A short imperfect repair such as `Sorry, again please?` may demonstrate more practical competence than silent recall of a complex grammar rule.

## Progression from imitation to independent speech

Each target moves through five control levels.

### Level 1 — Recognition

The learner identifies meaning or function when hearing it.

### Level 2 — Reconstruction

The learner completes or rebuilds a recently studied chunk.

### Level 3 — Controlled variation

The learner changes information while preserving the pattern and function.

### Level 4 — Personal and multi-turn use

The learner responds with relevant information and continues the exchange.

### Level 5 — Cold transfer

The learner responds to a new speaker, wording, or context without seeing the complete answer.

Do not label a capability mastered at Level 1 or Level 2.

## Spaced and varied review

Review is scheduled by capability evidence and target language, not only by lesson completion.

A sample review sequence:

```text
Day 1: respond to a studied clip
Day 2: Vietnamese situation → English response
Day 3: recognize the function from another speaker
Day 5: use it inside a multi-turn exchange
Day 7: cold transfer with a new clip and changed situation
```

FSRS may schedule individual chunks, listening forms, or prompts. FSRS does not decide whether transfer occurred; evidence rules do.

Avoid ten identical repetitions in one session. Combine same-task repetition with changed-task transfer.

## Capability evidence

A learner advances only when the system has evidence for all four dimensions:

```text
comprehension
productive recall
interactional use
delayed transfer
```

### Comprehension

The learner understands the communicative intention across more than one clip.

### Productive recall

The learner produces a suitable expression without reading the full answer.

### Interactional use

The learner uses it at the correct moment in a multi-turn exchange.

### Delayed transfer

After a delay, the learner handles a new speaker, wording, or context.

A multiple-choice average cannot compensate for missing transfer.

## Level progression

Difficulty does not rise only through harder vocabulary.

It rises across:

- clip duration;
- number of turns;
- speech rate;
- acoustic reduction;
- number of speakers;
- contextual ambiguity;
- language variability;
- response length;
- unpredictability;
- amount of support;
- delay before retrieval;
- need to maintain meaning across turns.

### A0

- clips commonly 3–10 seconds;
- one main communicative function;
- one or two turns;
- bilingual support available after initial attempt;
- short controlled output;
- explicit repair strategies.

### A1

- clips commonly 10–25 seconds;
- two to four turns;
- less translation;
- personal substitution;
- linked capabilities;
- first follow-up questions.

### A2

- clips commonly 20–60 seconds;
- reasons, short experiences, problems, and suggestions;
- dictation and paraphrase;
- multiple natural variants;
- less predictable turns.

### Practical B1

- longer connected interactions;
- discussion and explanation;
- topic maintenance;
- clarification and reformulation;
- natural moderate-speed speech from varied speakers;
- support appears only when requested.

The initial product destination is practical high-A2/B1 communication, not a fluency or certification claim.

## Learner choice

AtoEnglish curates the available clips. The learner does not search raw YouTube as the main learning workflow.

The default mode chooses the best next capability and offers two to four reviewed treatments that fit:

- prerequisites;
- due review;
- target difficulty;
- previously encountered speakers;
- desired topic or setting;
- accent exposure;
- novelty budget.

Each option must show concise metadata such as:

- learning situation;
- clip duration;
- core or stretch difficulty;
- accent or speaker tag;
- topic;
- estimated lesson time.

Learner choice must not bypass hard prerequisites or publication gates.

## First seven-day A0 slice

The first validation curriculum contains:

1. greet someone;
2. say one's name;
3. ask another person's name;
4. say where one is from;
5. request repetition.

Suggested sequence:

```text
Day 1: greeting
Day 2: greeting review + say name
Day 3: ask name + short two-turn exchange
Day 4: say origin + mixed review
Day 5: request repetition in a controlled breakdown
Day 6: mixed multi-turn interaction
Day 7: unseen speakers + cold transfer
```

The corpus target is 20–30 reviewed clips from multiple speakers and contexts.

## Source and publication gates

A public YouTube URL does not grant transcript, derivative, commercial, or self-hosting rights.

A learner-facing source must declare allowed uses individually:

- embed;
- transcript storage;
- ASR;
- derived lessons;
- self-hosting;
- commercial use.

Pilot or approved content requires:

- human-reviewed rights evidence;
- permitted playback method;
- transcript-storage and derivative-use permission;
- exact source and timestamps;
- verified transcript;
- verified Vietnamese translation;
- verified speaker labels;
- pedagogical review;
- comprehension, acquisition, and valid transfer;
- adequate clip and speaker coverage.

Approved catalog content must also permit commercial use.

## AI and human responsibility

AI may create drafts for:

- source discovery;
- transcript and alignment;
- diarization;
- clip boundaries;
- level estimates;
- communicative functions;
- chunks and speech features;
- translation;
- activities;
- prerequisite suggestions.

AI cannot approve:

- legal rights;
- final transcript;
- speaker identity;
- proper nouns;
- final translation;
- curriculum position;
- transfer validity;
- learner-facing publication.

Store model, model version, prompt version, generation time, reviewer, and review outcome for future automated authoring work.

## Measurement

Primary learner measures:

- first-listen gist;
- support opened;
- immediate productive recall;
- successful interactional use;
- delayed recall;
- unseen-speaker recognition;
- changed-context transfer;
- hints required;
- lesson time;
- return on later review days.

Primary curriculum measures:

- clips causing overload;
- missing prerequisites;
- variants introduced too early;
- capabilities that fail transfer;
- abnormal difficulty by speaker or context;
- content defects found by learners.

Primary operations measures:

- time from source discovery to approved clip;
- rights rejection rate;
- transcript correction time;
- AI metadata correction rate;
- defects per clip;
- source retirement rate.

## Prohibited shortcuts

Do not:

- create one isolated quiz per video;
- let learners browse arbitrary raw videos as the core path;
- publish scraped or unauthorized transcripts;
- treat subtitles as permanent support;
- call repetition acquisition without retrieval;
- call controlled recall transfer;
- score mastery from screen completion;
- let AI publish without human review;
- build a massive ingest system before the first curated corpus works;
- claim natural speaking from pronunciation imitation alone;
- claim progress without delayed and unseen evidence.

## Acceptance rule

A learner-facing treatment is valid only when:

```text
source integrity
+ human-reviewed transcript
+ one clear capability
+ comprehension
+ productive retrieval
+ changed or unseen transfer
+ varied speaker exposure
+ delayed evidence
```

The product succeeds when a beginner can use the capability with a person or clip they have not memorized, not when they finish the source video.
