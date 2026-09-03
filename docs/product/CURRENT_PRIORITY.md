# AtoEnglish current priority

**Updated:** 2026-09-03  
**Owner:** Thunderkill016

## North star

Maximize **Durable Transferable Learning Gain per Minute** for the target learner, using the best currently practical science and technology while preserving trustworthy learner evidence.

The immediate proving ground remains Vietnamese beginner/false-beginner spoken English because it gives AtoEnglish a narrow, measurable environment in which to validate the learning engine. It is not the permanent product ceiling.

## Current phase

**Phase: close the gap between the already-integrated Nếp adaptive core and a frontier-quality learner loop.**

Main already contains the Nếp adaptive-learning foundation: canonical Attempt → Evidence → LearnerSkillState persistence, privacy-safe oral observations, Error Memory V1, deterministic Session Planner V1, trusted practice execution and an authenticated adaptive preview.

The immediate risk is now fragmentation: legacy mission/unit paths still coexist with the canonical adaptive path, browser SpeechRecognition remains the main speech transport, pronunciation assessment is intentionally unavailable, and real learner evidence is still sparse.

## Ordered queue

### 1. Frontier product truth and ledger — now

Align repository-owned guidance with the owner’s current objective:

- outcome-first rather than competitor-first;
- reuse existing AtoEnglish code aggressively;
- adopt maintained external/open-source code where appropriate;
- allow realtime voice, speech diagnostics and adaptive technology when bounded by evidence/privacy;
- keep claims proportional to validated learner evidence;
- maintain a Frontier Ledger of known gaps and current scientific/technical limits.

**Done when:** repository guidance no longer forbids work that the current frontier objective explicitly requires, while still preventing novelty-driven scope expansion.

### 2. Canonical learning runtime convergence — next

Remove or bypass parallel learning truth paths in the proving surface.

Initial goals:

- the learner-facing adaptive path uses `recordNếpPracticeAttempt()` and the canonical `record_learning_attempt` RPC;
- no new mastery evidence is written through legacy score-only attempt schemas;
- learner state, Error Memory and Session Planner consume the same canonical evidence history;
- reveal/support/modality/transfer invariants remain server/database authoritative;
- raw transcripts are not persisted by default.

This is primarily integration/convergence, not a new learning algorithm.

### 3. Frontier voice transport V1

Benchmark and integrate the best practical realtime voice path for the current Next.js application.

Preferred first benchmark:

- official OpenAI Realtime/Agents SDK patterns because a maintained Next.js TypeScript reference implementation exists and integration distance is small;
- LiveKit AgentsJS as the portability/production-infrastructure comparison when multi-provider routing or advanced realtime infrastructure justifies it;
- local/browser VAD only when it improves turn handling beyond provider-native capabilities and browser support is acceptable.

Required boundaries:

- realtime model owns conversation latency and turn-taking, not mastery truth;
- canonical server evaluation/evidence remains authoritative;
- voice can be interrupted naturally;
- typed fallback remains non-speaking evidence;
- no raw audio/transcript analytics persistence by default;
- cost/latency/reliability are measured.

### 4. Speech diagnostics and Vietnamese calibration

Current `assessPronunciation()` correctly returns unavailable rather than fabricating a phoneme score. Replace that gate only after a real acoustic assessment path is benchmarked.

Evaluate available systems for:

- phoneme/word accuracy;
- stress, rhythm, fluency and prosody where reliable;
- intelligibility/comprehensibility relevance;
- Vietnamese learner performance;
- API latency/cost/privacy;
- calibration against human raters on a bounded sample.

Do not optimize for native-accent imitation.

### 5. Adaptive proving surface

Turn `/adaptive-preview` from an engineering preview into a small learner-ready vertical slice driven by learner state.

The first slice should exercise:

```text
recognition/comprehension
→ retrieval
→ speech production
→ concise feedback
→ self-repair/retry
→ changed-context transfer
→ delayed retrieval
```

The UI should emphasize the next useful action, not internal planner diagnostics.

### 6. Real learner evidence

Recruit and observe real target learners as soon as the bounded vertical slice is usable.

Measure at minimum:

- start and first independent attempt;
- completion;
- feedback → repair;
- retry improvement;
- changed-context transfer;
- delayed retention;
- learner time;
- failure/drop-off reason.

Use blinded or human-calibrated evaluation for claims that automated evidence cannot support yet.

### 7. Planner/model evolution

Do not jump directly to neural knowledge tracing or reinforcement learning.

Progress only when data supports it:

```text
current deterministic planner
→ calibrated rules
→ probabilistic learner model/KT benchmark
→ learning-gain prediction
→ contextual adaptive policy if demonstrably better
```

A more complex model must beat the simpler baseline on learner-relevant evaluation.

### 8. Frontier expansion

After the core loop is validated, systematically close remaining Frontier Ledger items across:

- listening decoding;
- speech/pronunciation;
- vocabulary/chunk memory;
- grammar-in-use;
- writing/reading where appropriate;
- broader capability graph and levels;
- self-regulation and transition to real-world use;
- human/peer transfer;
- assessment quality;
- experimentation and causal measurement.

Expansion is driven by the same north-star metric, not feature count.

## Reuse-first rule

Before custom implementation:

1. inspect current AtoEnglish code;
2. inspect maintained libraries/public implementations;
3. verify license, maintenance, security, privacy, compatibility and cost;
4. prefer adaptation when it shortens time to valid learner evidence;
5. custom-build only where AtoEnglish needs a distinct learning/evidence mechanism or external solutions fail the requirement.

## Work selection rule

A proposed task enters the active queue when it does at least one of the following:

1. closes a material Frontier Ledger gap;
2. connects already-built learning infrastructure that is currently fragmented;
3. fixes a learner, evidence-integrity, privacy, security or production blocker;
4. produces trustworthy learner evidence needed to choose between competing approaches;
5. removes a repeated development blocker that materially slows the frontier program.

Technical novelty alone is not sufficient.

## Exit criteria for the current phase

The current phase is complete when a real learner can enter one bounded adaptive speaking slice and the system can reliably execute:

```text
learner state
→ next-task selection
→ natural voice interaction
→ trusted attempt/evidence
→ concise feedback
→ repair/retry
→ changed-context transfer
→ delayed retrieval
→ updated learner state
```

with privacy boundaries intact and without relying on fabricated pronunciation/mastery claims.
