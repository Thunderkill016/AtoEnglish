# Nếp Product Contract V1

Status: preview contract. Evidence-backed constraints, not an efficacy claim.

## Product job

Nếp helps a Vietnamese false beginner build **usable communicative capability** through short guided missions. The learner-facing unit is a real communicative job, not a grammar chapter or vocabulary list.

## Primary loop

`context → comprehend → notice → attempt-before-reveal → produce → feedback → self-repair → retry → changed-context transfer → delayed review`

## Progress model

Progress is evidence collected across separate channels:

- comprehension
- retrieval
- production
- repair
- transfer
- retention

Finishing a screen or unit is not mastery. Immediate supported success is not delayed retention.

## V1 capability graph

1. Greet and end a short interaction.
2. Introduce yourself.
3. Ask for repetition or clarification.
4. Confirm what you understood.
5. Ask for simple personal/context information.
6. Answer simple personal/context information.
7. Express a simple need or problem.
8. Sustain and repair a short real interaction.

The graph is compiled into product artifacts. Grammar, vocabulary and pronunciation sit beneath capabilities as constraints/resources; they are not the learner-facing course spine.

## Non-goals

Nếp V1 is not:

- a grammar catalog;
- an Oxford-wordlist browser;
- a generic AI chatbot;
- a lesson-completion game;
- an acoustic pronunciation scorer unless the app actually analyses audio with a validated method;
- a CEFR certification system;
- proof that the integrated Nếp Method is effective.

## Evidence governance

Every buildable lesson declares:

- capability ID and prerequisites;
- evidence principle IDs and claim IDs;
- whether a rule is `source_derived` or `product_inference`;
- the response modality required by the capability;
- review targets and evidence channels produced;
- the exact capability target, persisted evidence type, evaluator and context for every evaluated action.

Generated lesson content is product content, not research evidence.

For this preview the key source-derived constraints are:

- PRN-003 — attempt before reveal for retrieval;
- PRN-050, PRN-054, PRN-058 — bounded speaking, response demand matched to the claim, then self-repair;
- PRN-040, PRN-045, PRN-056 — changed-context production is required before calling evidence transfer;
- PRN-016, PRN-018 — Vietnamese support is strategic and its use must remain distinguishable from independent English performance;
- PRN-001, PRN-002 — capability evidence is separated from completion.

## Product-inference constraints for V1

These are engineering/content rules to test, not research conclusions:

- a preview lesson may introduce at most 6 new chunks/items;
- hard QA rejects a speaking lesson with no observable speech path;
- text input may be offered as an accessibility/debug fallback, but cannot produce `production` or `transfer` speaking evidence;
- deterministic transcript feedback may check target language coverage, but must never be labelled pronunciation scoring;
- retry after an answer-bearing reveal is stored as an attempt but is not promoted to independent mastery evidence;
- raw learner speech transcripts are not persisted by the Nếp adapter; only derived evaluation metadata is stored;
- lesson content that looks textbook-like is a warning for editorial review, not an automatic evidence failure.

## First vertical slice

Capability: `CAP-002 Introduce yourself`, with `CAP-003 Ask for repetition` embedded as a repair move.

Mission: meet a new colleague, say your name, spell it when needed, ask for repetition when you miss a turn, then perform the same capability under a changed prompt/order.

The evaluated actions map explicitly to the learning core: comprehension choice → `recognition/CAP-002`; retrieval → `retrieval/CAP-002`; first independent response → `production/CAP-002`; repair move → `repair/CAP-003`; supported retry → attempt-only; changed situation → `transfer/CAP-002`.

Success is not “lesson complete”. The preview records whether the learner independently attempted retrieval, produced an oral response, repaired after feedback, and handled the changed situation. Anonymous preview use remains local-only; authenticated use can persist through the canonical `recordLearningAttempt` server boundary.
