# AtoEnglish product truth

**Status:** current product decision source  
**Updated:** 2026-09-03  
**Frontier rule:** use the best currently available learning science, language-learning research, product design, AI, speech, adaptive-learning and assessment technology when it can improve learner outcomes.

## What AtoEnglish is now

AtoEnglish is a Vietnamese-first adaptive English-learning system whose job is to make a learner measurably better at understanding and using English in the real world.

AtoEnglish is not defined by a 50-unit catalog, a named teaching method, a chatbot, FSRS, gamification, a CEFR label, or a fixed 28-day course. Those may be useful subsystems or bounded experiments. The product is the closed learning loop that continuously observes learner evidence, chooses the next useful learning action, helps the learner perform it, and verifies whether the ability survives reduced support, changed context and delay.

The long-term product goal is deliberately ambitious:

> Push AtoEnglish to the practical frontier of what current science and technology can do for English learning, then let learner outcomes determine whether it deserves to be considered the best English-learning product.

This is an engineering and research direction, not a marketing claim.

## Initial learner and proving ground

The first proving ground remains narrow enough to measure well:

- Vietnamese adults who know some English but freeze when they need to speak;
- beginner or false-beginner learners who recognize more language than they can retrieve;
- learners who benefit from Vietnamese guidance, controlled difficulty and repeated real-use practice;
- an initial emphasis on practical spoken interaction because speaking exposes retrieval, listening, repair and transfer failures clearly.

A narrow proving ground is a validation strategy, not the permanent boundary of AtoEnglish. The system may expand to broader levels, skills and goals only when the underlying learning engine can support them without weakening measurement quality.

## North-star outcome

The primary optimization target is:

> **Durable Transferable Learning Gain per Minute**

Meaning:

- **learning gain:** the learner can do more than before;
- **durable:** the gain survives meaningful delay;
- **transferable:** the learner succeeds in changed or unseen conditions;
- **per minute:** learner time is treated as a scarce resource.

Engagement, streaks, XP, lesson completion, session length and retention are secondary unless they help produce durable transferable learning.

## Definition of learned

A correct answer is not automatically evidence that something was learned.

A stronger claim requires progressively stronger evidence:

```text
recognition
→ retrieval without reveal
→ production
→ self-repair after useful feedback
→ success with less support
→ changed-context transfer
→ delayed retention
→ real-world task success where practical
```

The product must preserve uncertainty when evidence is missing. Unknown is preferable to a fabricated mastery or pronunciation score.

## Core learning loop

Every learner-facing system should ultimately serve this loop:

```text
observe
→ infer learner state
→ select next learning action
→ create a meaningful task
→ learner attempts before answer-bearing help
→ evaluate available evidence
→ give the smallest useful feedback
→ learner self-repairs and retries
→ vary context for transfer
→ schedule delayed retrieval
→ update learner state
→ repeat
```

This loop may use deterministic rules, statistical models, AI reasoning, speech models, retrieval scheduling and human calibration. No component is allowed to override evidence integrity merely because it is more sophisticated.

## Capability-first curriculum

The curriculum is a graph of useful capabilities and supporting language resources, not one compulsory list of lessons.

Examples of capabilities include:

- greet and close an interaction;
- introduce yourself;
- ask for repetition or clarification;
- confirm understanding;
- ask and answer practical information;
- express a need or problem;
- sustain and repair an interaction.

Vocabulary, chunks, grammar, pronunciation and listening representations support capabilities. They are not the sole course spine.

A fixed journey may still be used when it is the best cold-start path or an experiment needs a controlled sequence. Once learner evidence exists, the planner may choose different practice for different learners.

## Learner model

AtoEnglish should maintain a rebuildable, evidence-backed learner model rather than a single level or completion percentage.

At minimum it should distinguish independent evidence channels such as:

- recognition/comprehension;
- retrieval;
- listening;
- production;
- repair;
- transfer;
- retention.

As validated measurement becomes available, the learner model may add speech/intelligibility, fluency, latency, error patterns, condition-specific performance and uncertainty. New dimensions must have an observable evidence path.

The immutable attempt/evidence history is more authoritative than a mutable learner-state snapshot.

## AI role

AI is a controlled learning component, not the product authority.

AI may be used to:

- converse naturally with low latency;
- generate or vary scenarios under constraints;
- diagnose likely learner problems;
- select or propose remediation;
- produce concise feedback;
- create changed-context transfer tasks;
- adapt language, speaker behavior and difficulty;
- assist content QA and research synthesis.

AI must not be allowed to:

- invent mastery without evidence;
- treat a typed fallback as speaking evidence;
- treat ASR transcript matching as pronunciation assessment;
- expose hidden answer/evaluator targets to the learner surface;
- publish unconstrained generated curriculum without validation;
- silently change the learning policy in production.

## Speech and pronunciation

AtoEnglish should use the strongest practical speech technology available when it improves learning, but claims must match evidence.

The target is intelligible, comprehensible English for real communication, not forced imitation of a native accent.

Speech capabilities may include realtime conversation, turn detection, acoustic analysis, phoneme/stress/prosody feedback and intelligibility estimation. Pronunciation scoring remains gated until the chosen system is calibrated well enough for the intended Vietnamese learner population and task.

Raw audio/transcript persistence is not the default. Prefer transient processing and derived, privacy-safe evidence unless a separately approved research protocol requires richer data.

## Retrieval and memory

FSRS remains useful for item/chunk review timing. It is a subsystem, not the complete learning model.

The system separately decides:

- what capability or resource is weak;
- what kind of evidence is missing;
- how the learner should practice it;
- which context should change;
- when delayed retrieval should occur.

## Planner evolution

Planner sophistication must follow evidence availability.

Preferred progression:

1. explainable evidence-backed rules;
2. calibrated heuristics from real learner data;
3. probabilistic/knowledge-tracing models where they outperform simpler baselines;
4. learning-gain prediction;
5. contextual-bandit or other adaptive policy only when enough trustworthy data exists and offline/online evaluation supports it.

Do not adopt a complex model merely because it is newer.

## Product experience

The learner should not need to manage the learning algorithm.

The ideal surface increasingly answers one question:

> What is the most useful thing for me to do next?

The UI may be simple even when the engine is sophisticated. Browsing course catalogs, collecting points and configuring AI behavior must not displace the next useful learning action.

## Evidence hierarchy

Decisions must distinguish:

1. **research evidence:** what current learning/language science suggests;
2. **repository evidence:** what the implementation actually does;
3. **usability evidence:** learners can reach and complete the flow;
4. **learning evidence:** baseline-to-later ability improves under valid measurement;
5. **transfer/retention evidence:** gains survive changed conditions and delay;
6. **market evidence:** learners pay, return, renew or refer without masking weak learning outcomes.

Passing tests proves software consistency, not learner improvement.

## Frontier development rule

AtoEnglish follows a reuse-first frontier strategy:

1. use existing AtoEnglish code when it already satisfies the requirement;
2. adopt or adapt maintained external libraries/open-source implementations when they are safer or faster than rebuilding;
3. use current commercial/model APIs where they provide capabilities that cannot be reproduced economically;
4. custom-build the parts that create AtoEnglish-specific learning advantage or evidence integrity;
5. verify licenses, security, privacy, maintenance, compatibility, cost and learner value before adoption.

The goal is not architectural novelty. The goal is to shorten the distance to the best achievable learner outcome.

## Frontier Ledger

Every material frontier capability should be tracked in one of these states:

- **KNOWN_NOT_IMPLEMENTED** — supported by useful evidence/technology but absent;
- **AVAILABLE_NOT_INTEGRATED** — implementation exists externally but is not yet safely integrated;
- **IMPLEMENTED_NOT_VALIDATED** — product capability exists but learner benefit is not yet demonstrated;
- **VALIDATED** — implementation has sufficient technical and learner evidence for its claim;
- **CURRENTLY_UNSOLVED** — blocked by current science, measurement, data or practical technology.

AtoEnglish may be considered **current-frontier complete** only when no material item remains in the first three states without an explicit decision and the remaining open problems are genuinely CURRENTLY_UNSOLVED or not worth their learner-time/cost tradeoff.

## How “best” is proved

AtoEnglish must not declare itself the best because it has more features, newer models or stronger internal architecture.

The claim can only emerge from repeated learner evidence such as:

- unseen-task success;
- independent production;
- listening comprehension;
- response latency;
- successful communication repair;
- comprehensibility/intelligibility;
- transfer to new situations;
- 1/7/30-day retention where appropriate;
- improvement per minute of practice;
- eventually external or blinded human evaluation for high-value speaking claims.

Competitor benchmarking is useful as a technology/product reference, not the product objective.

## Current foundation

The repository already contains substantial reusable infrastructure, including:

- Next.js/React/TypeScript application surfaces;
- Supabase authentication, RLS and migrations;
- canonical Attempt → Evidence → LearnerSkillState storage;
- privacy-safe oral-observation rules;
- Nếp capability contracts and trusted server-side evaluation;
- Error Memory V1;
- deterministic Session Planner V1 and adaptive practice preview;
- mission engine, retry and transfer structures;
- FSRS card scheduling;
- existing curriculum/content assets;
- testing, CI and production observability foundations.

This code should be reused rather than replaced unless measured limitations justify replacement.

## Immediate product direction

The next work is not broad content expansion. It is closing the shortest gaps between the existing adaptive core and a high-quality learner loop:

1. make repository product guidance match this frontier objective;
2. verify and use the canonical adaptive/evidence runtime rather than legacy parallel paths;
3. turn the adaptive preview into the primary proving surface for a small capability slice;
4. benchmark and integrate realtime voice/turn-taking without surrendering server-authoritative learning evidence;
5. establish a calibrated speech-diagnostics path before exposing pronunciation scores;
6. collect real attempts and learner outcomes;
7. improve planner/model policy only as data can justify it;
8. maintain the Frontier Ledger so new work is selected by learner value rather than novelty.

## Product decision rule

For every proposed change ask:

> Does this use current evidence or technology to create a plausible, measurable improvement in durable transferable English ability per learner minute, and can we validate that improvement without corrupting learner evidence?

If yes, make the smallest reversible implementation and test it. If no, do not build it merely because it is technically impressive.
