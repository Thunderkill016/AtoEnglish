# AtoEnglish Frontier Ledger

**Updated:** 2026-09-03  
**Purpose:** finite inventory of material gaps between the current repository and the best practical English-learning system AtoEnglish can build with current science and technology.

## Status definitions

- `KNOWN_NOT_IMPLEMENTED` — useful mechanism is known but missing.
- `AVAILABLE_NOT_INTEGRATED` — external technology/implementation exists but is not safely integrated.
- `IMPLEMENTED_NOT_VALIDATED` — implementation exists, learner benefit/measurement still insufficient.
- `VALIDATED` — claim has appropriate technical and learner evidence for its scope.
- `CURRENTLY_UNSOLVED` — blocked by present science, measurement, data or practical technology.

No internal implementation should be promoted to `VALIDATED` by repository tests alone.

## Current frontier inventory

| Area | Current repo state | Status | Next evidence/action |
|---|---|---|---|
| Canonical Attempt → Evidence → LearnerSkillState | Implemented with RPC-only writes, RLS and database tests | IMPLEMENTED_NOT_VALIDATED | Generate real learner history and verify state correlates with later task success |
| Evidence integrity: reveal/support/modality | Server/DB gates implemented | IMPLEMENTED_NOT_VALIDATED | Exercise through learner-facing adaptive flow and audit persisted rows |
| Privacy-safe oral observation | Derived speech observation can persist without raw transcript | IMPLEMENTED_NOT_VALIDATED | Validate end-to-end browser/server/DB boundary in real sessions |
| Capability graph | Nếp V1 capability graph exists | IMPLEMENTED_NOT_VALIDATED | Expand only after vertical-slice evidence; test graph usefulness for planning |
| Trusted Nếp practice execution | Server resolves canonical action/evaluator/evidence | IMPLEMENTED_NOT_VALIDATED | Make it the default proving runtime rather than a preview-only path |
| Session Planner V1 | Deterministic planner uses learner state, history and Error Memory | IMPLEMENTED_NOT_VALIDATED | Collect enough attempts to calibrate weights/gates against later success |
| Error Memory V1 | Structured recurring/remediated error logic exists | IMPLEMENTED_NOT_VALIDATED | Verify recurring errors predict useful remediation on real learners |
| Remediation/re-probe | Explicit bounded mappings and re-probe cycle exist | IMPLEMENTED_NOT_VALIDATED | Measure repair success and recurrence reduction |
| Changed-context transfer | Contract/DB invariants exist | IMPLEMENTED_NOT_VALIDATED | Create real unseen variants and measure transfer success |
| Delayed retention | FSRS + Nếp retention targets/transfer windows exist | IMPLEMENTED_NOT_VALIDATED | Run 1/7/30-day retrieval and compare against prior evidence |
| FSRS item scheduling | Durable ts-fsrs v5 state/history implemented | IMPLEMENTED_NOT_VALIDATED | Validate scheduling contribution to language retention; keep as subsystem |
| Realtime natural voice | Current learner surfaces rely mainly on browser SpeechRecognition / speechSynthesis | AVAILABLE_NOT_INTEGRATED | Benchmark OpenAI Realtime/Agents SDK first; compare LiveKit AgentsJS if portability warrants it |
| Turn detection/interruption | Browser single-turn recognition; realtime providers can do better | AVAILABLE_NOT_INTEGRATED | Measure latency, interruption handling, false turns and mobile reliability |
| Acoustic pronunciation diagnostics | `assessPronunciation()` intentionally unavailable | AVAILABLE_NOT_INTEGRATED | Benchmark acoustic providers/models and human calibration; do not expose score before gate passes |
| Vietnamese speech calibration | No trusted Vietnamese-learner calibration corpus/rater benchmark | KNOWN_NOT_IMPLEMENTED | Define bounded rater protocol + representative sample; compare provider outputs |
| Intelligibility/comprehensibility model | Not represented as validated learner dimension | KNOWN_NOT_IMPLEMENTED | Human-calibrate candidate automated signals before adding state dimension |
| Fluency/latency measurement | Attempt latency exists; richer spoken fluency not yet validated | KNOWN_NOT_IMPLEMENTED | Add privacy-safe timing/turn features and calibrate against task success/human ratings |
| Listening-decoding engine | Existing audio/content exists but no frontier adaptive decoding model demonstrated | KNOWN_NOT_IMPLEMENTED | Build bounded fast/connected-speech decoding slice and measure listening transfer |
| Dynamic context/task generation | Canonical tasks are mostly versioned/static | AVAILABLE_NOT_INTEGRATED | Add constrained generation behind task schema/QA, never direct model-authored mastery |
| AI pedagogical supervisor | No frontier realtime tutor supervisor integrated | AVAILABLE_NOT_INTEGRATED | Use stronger reasoning model for bounded diagnosis/feedback/task variation; keep evidence authority deterministic/server-side where possible |
| Learner-state uncertainty | V1 state channels are point values; uncertainty not a first-class calibrated model | KNOWN_NOT_IMPLEMENTED | Add only after enough repeated observations to estimate confidence usefully |
| Knowledge tracing/probabilistic learner model | Not needed with sparse data | AVAILABLE_NOT_INTEGRATED | Benchmark pyKT/probabilistic baselines offline only after sufficient longitudinal data |
| Learning-gain prediction | No trustworthy dataset yet | KNOWN_NOT_IMPLEMENTED | Define training/evaluation dataset after real longitudinal learner evidence exists |
| Contextual adaptive policy/bandit | No reliable reward dataset yet | AVAILABLE_NOT_INTEGRATED | Defer until offline policy evaluation and safe exploration are possible |
| Human-calibrated speaking assessment | Rubric exists, continuous calibration pipeline not established | KNOWN_NOT_IMPLEMENTED | Create blinded rater sample for automated-system calibration and outcome studies |
| Real-world/human transfer | Not integrated into main learning loop | KNOWN_NOT_IMPLEMENTED | Add bounded missions/peer or human evaluation only after AI vertical slice works |
| Experimentation/causal measurement | Analytics/CI foundations exist; learner volume insufficient | IMPLEMENTED_NOT_VALIDATED | Use simple randomized/controlled comparisons first; add platform only when operationally useful |
| Self-regulation/fading support | Nếp support/reveal controls exist, long-term independence not validated | KNOWN_NOT_IMPLEMENTED | Track support reduction and independent success across time |
| Broad reading/writing integration | Existing curriculum contains these skills but frontier adaptive integration is not established | KNOWN_NOT_IMPLEMENTED | Expand after spoken vertical loop demonstrates valid architecture |
| Frontier research monitoring | Ad hoc research performed | KNOWN_NOT_IMPLEMENTED | Maintain source/evidence updates when material new research/technology appears |

## External reuse candidates

### OpenAI Realtime / Agents SDK

- Official Next.js/TypeScript realtime-agents reference exists.
- Strong fit for the current stack and shortest route to WebRTC, low-latency voice, interruption and tool/agent patterns.
- Adoption rule: reuse transport/session/event patterns; do not let the realtime agent become mastery authority.

### LiveKit AgentsJS

- Candidate when provider portability, distributed realtime infrastructure, provider mixing or richer production voice operations become necessary.
- Benchmark against the simpler official OpenAI path before accepting extra infrastructure.

### Browser VAD / Silero-based libraries

- Candidate only if provider-native turn detection is insufficient for the measured learner experience.
- Must verify iOS/mobile/browser behavior before relying on it.

### Knowledge tracing toolkits such as pyKT

- Research/offline benchmark candidate, not an immediate runtime dependency.
- Requires enough longitudinal AtoEnglish evidence and a task definition where prediction quality maps to learner outcome.

### Experimentation platforms

- GrowthBook or equivalent may be useful once traffic/sample size makes controlled product experiments routine.
- Do not add an experimentation platform before simple assignment + outcome analysis becomes an actual operational bottleneck.

## Current critical path

```text
product truth aligned
→ canonical adaptive runtime becomes primary proving surface
→ realtime voice benchmark/integration
→ acoustic speech calibration path
→ real learner attempts
→ transfer + delayed retention measurement
→ planner calibration
→ more advanced learner modeling only when data supports it
→ systematically close remaining ledger items
```

## Frontier-complete condition

AtoEnglish is not `CURRENT FRONTIER COMPLETE` while a material item remains `KNOWN_NOT_IMPLEMENTED`, `AVAILABLE_NOT_INTEGRATED`, or `IMPLEMENTED_NOT_VALIDATED` without a documented decision that its expected learner value does not justify its cost/risk.

When the remaining material limitations are genuinely `CURRENTLY_UNSOLVED`, the core product should stop accumulating speculative complexity and switch to monitoring new research/technology while continuing outcome validation and maintenance.
