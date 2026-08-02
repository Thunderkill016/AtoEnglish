# AtoEnglish do-not-build list

**Updated:** 2026-08-02  
**Applies during:** the bounded seven-day A0 curriculum compiler pilot

This document prevents technically attractive work from displacing the canonical YouTube-to-Curriculum direction.

Items below are not necessarily bad ideas. They are deferred because they do not provide the shortest safe path to proving that authentic clips can form one coherent learning progression.

## Source and ingestion breadth

Do not build yet:

- unrestricted paste-any-YouTube ingestion;
- unauthorized caption or transcript scraping;
- automatic downloading or republishing of media without documented rights;
- a public catalog sourced from unreviewed URLs;
- autonomous source approval;
- support for every video platform;
- a large-scale crawler, indexing service, or media lake;
- arbitrary creator monetization or licensing infrastructure.

The first corpus must be manually or semi-manually selected, rights-checked, timestamped, and human-reviewed.

## Curriculum breadth

Do not build yet:

- the complete A0–B1 curriculum;
- hundreds or thousands of clips before the seven-day graph is validated;
- unrelated standalone Real Talk lessons;
- a curriculum organized by video order or grammar chapter;
- broad travel, interview, workplace, and social tracks at the same time;
- a visual curriculum CMS before the authoring contract is stable;
- a native mobile application;
- social feeds, clubs, multiplayer learning, or creator communities.

Build only the five-capability A0 progression with 20–30 reviewed clips.

## AI and language intelligence

Do not build yet:

- autonomous AI curriculum generation or publication;
- AI decisions that bypass source, transcript, translation, or pedagogical review;
- an unrestricted chatbot detached from the current clip and capability;
- proprietary speech recognition;
- phoneme-level pronunciation scoring infrastructure;
- accent imitation or native-likeness scoring;
- opaque automatic CEFR certification;
- storing raw learner audio, transcripts, names, employers, or personal free text in analytics.

AI may draft segmentation, metadata, prerequisites, translations, activities, and review suggestions. A human remains responsible for publication and source accuracy.

## Architecture and infrastructure

Do not build yet:

- microservices for Source Engine, Language Intelligence, Curriculum Graph, or Lesson Runtime;
- a second database or event platform;
- infrastructure for hypothetical corpus scale;
- a generic workflow engine;
- broad `UnitTemplate` or application rewrites unrelated to the pilot;
- generalized abstractions without two real clip or lesson treatments;
- broad dependency upgrades mixed with curriculum work;
- automated merge or production promotion by an agent;
- a new design system unrelated to learner blockers.

Keep the modular monolith. Represent the four learning-core responsibilities as bounded modules first.

## Product systems outside the pilot

Do not build yet:

- more leagues, badges, achievements, streak mechanics, or XP breadth;
- payment infrastructure redesign;
- complex subscriptions or entitlement systems;
- social or community systems;
- broad onboarding redesign;
- unrelated authentication changes;
- analytics beyond the minimum required for comprehension, retrieval, transfer, completion, and source/runtime failures.

## Premature proof

Do not treat these as primary evidence of product value:

- number of imported videos;
- number of generated lessons;
- total clips in the database;
- page views;
- XP earned;
- streak length;
- quiz accuracy without transfer;
- repository test count;
- CI or build success;
- positive reactions to video novelty;
- successful playback of one source.

The important evidence is:

- source and transcript integrity;
- coherent prerequisite progression;
- comprehension across speakers;
- delayed retrieval;
- unseen-clip recognition;
- changed-situation communication transfer;
- learner completion without facilitator language help;
- support cost, payment, renewal, and referral later.

## Scope mixing

Do not combine the first curriculum compiler slice with unrelated changes to:

- authentication or account architecture;
- broad database or RLS redesign;
- XP, stars, streaks, leagues, or achievements;
- payment;
- deployment automation;
- broad observability or analytics infrastructure;
- unrelated legacy lessons;
- proprietary speech systems.

Source contracts, clip metadata, curriculum graph, and lesson runtime may interact in one bounded vertical slice only when their coupling is required and explicitly documented.

## Existing experiment boundaries

- PR #46 is a technical proof for one authentic clip. Do not merge or polish it as the standalone product endpoint.
- PR #45 contains potentially reusable diagnosis, fading-support, repair, and cold-transfer mechanisms. Do not adopt it as a separate product direction.
- Merged Gold Day 1 contains reusable speaking, feedback, retry, and pilot patterns. Do not preserve its synthetic source model merely because it is already on `main`.

## Exception rule

A deferred item may be reconsidered only when all of the following are documented:

1. the exact current AtoEnglish blocker;
2. evidence that the blocker occurred in the real corpus, learner flow, or development process;
3. why a manual or existing simpler solution is insufficient;
4. the smallest reversible implementation;
5. acceptance criteria and rollback plan;
6. systems explicitly left out of scope;
7. source-rights, privacy, and human-review implications.

Security, privacy, rights, or data-integrity defects may interrupt the normal queue, but still require bounded scope and verification.

## Default response to new ideas

Ask:

> Does this help the reviewed A0 clip corpus become a coherent path from authentic comprehension to delayed retrieval and unseen communication transfer?

When the answer is not supported by current evidence, record the idea and continue the active curriculum compiler pilot.