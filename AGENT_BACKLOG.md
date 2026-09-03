# Agent Backlog — Active Tasks Only

> Use `docs/product/CURRENT_PRIORITY.md` for ordering, `docs/product/DO_NOT_BUILD.md` for guardrails and `docs/product/FRONTIER_LEDGER.md` for material frontier gaps.

## Rules

1. Use a dedicated branch and reviewed pull request.
2. Never merge or deploy automatically.
3. Keep one bounded outcome per pull request.
4. Every task must identify the learner/evidence/frontier gap it closes.
5. Reuse current AtoEnglish code before adding a parallel system.
6. Check maintained external implementations before custom-building commodity infrastructure.
7. External reuse requires license, security, privacy, maintenance, compatibility and cost review.
8. Passing technical checks is not learner validation.
9. Do not let model sophistication override evidence integrity.
10. Completed work belongs in Git history/pull requests, not this active backlog.

## Active queue

### FRONTIER-001 — Product truth and Frontier Ledger

- **Status:** `in_progress`
- **Outcome:** repository guidance reflects the 2026 frontier objective while preserving outcome-first evidence and privacy rules.
- **Scope:** documentation only.
- **Branch:** `frontier/product-truth-2026-09`.

### FRONTIER-002 — Canonical adaptive runtime convergence

- **Status:** `ready_after_frontier_001`
- **Outcome:** one authoritative learner-facing adaptive execution path built on the already-integrated Nếp practice compiler and `record_learning_attempt` RPC.
- **Initial audit:** identify remaining legacy score-only/direct-write paths such as the older mission runtime and prevent them from becoming the new proving surface.
- **Keep:** canonical Attempt → Evidence → LearnerSkillState, privacy-safe oral observation, Error Memory V1, Session Planner V1, adaptive practice queue.
- **Forbidden:** new database model, new mastery store, broad curriculum rewrite, pronunciation score.

### FRONTIER-003 — Realtime voice benchmark and transport V1

- **Status:** `blocked_by_frontier_002`
- **Outcome:** replace one-turn browser speech UX in the adaptive proving surface with a low-latency, interruptible realtime voice path while keeping server-authoritative learning evidence.
- **First external candidate:** official OpenAI Realtime/Agents SDK reference implementation for Next.js/TypeScript.
- **Comparison candidate:** LiveKit AgentsJS if provider portability/production voice infrastructure justifies additional complexity.
- **Measure:** end-of-turn latency, interruption/turn reliability, mobile/browser support, cost, failure rate, privacy boundary.
- **Forbidden:** realtime model writing mastery directly; raw-audio analytics persistence by default.

### FRONTIER-004 — Calibrated speech diagnostics V1

- **Status:** `blocked_by_frontier_003`
- **Outcome:** establish a real acoustic evidence path for high-value pronunciation/intelligibility feedback.
- **Current correct behavior:** pronunciation scoring remains unavailable rather than derived from transcript matching.
- **Work:** benchmark candidate providers/models, define Vietnamese-learner calibration sample and human rating protocol, then expose only claims supported by calibration.
- **Forbidden:** native-accent imitation objective, opaque fake score, transcript-only phoneme claims.

### FRONTIER-005 — Adaptive vertical-slice learner validation

- **Status:** `blocked_by_frontier_002/003`
- **Outcome:** real learner can complete a bounded loop:
  `recognition → retrieval → production → feedback → repair/retry → changed-context transfer → delayed retrieval`.
- **Measure:** activation, independent success, feedback→repair, retry improvement, transfer, delay/retention and learner minutes.

### FRONTIER-006 — Planner calibration

- **Status:** `blocked_by_real_data`
- **Outcome:** calibrate deterministic Session Planner weights/gates from longitudinal AtoEnglish evidence and compare against simpler baselines.
- **Do not start with:** neural KT, RL or bandits.

### FRONTIER-007 — Probabilistic learner-model benchmark

- **Status:** `blocked_by_real_data`
- **Outcome:** benchmark knowledge-tracing/probabilistic models offline only if the dataset is large and structured enough for meaningful validation.
- **External research candidate:** pyKT or equivalent benchmark toolkit.
- **Promotion rule:** complexity enters production only if it predicts/plans learner outcomes better than current explainable rules.

### FRONTIER-008 — Frontier expansion

- **Status:** `later`
- **Outcome:** systematically close remaining ledger items in listening decoding, vocabulary/chunk memory, grammar-in-use, broader skills, real-world transfer, self-regulation, assessment and experimentation.
- **Ordering:** expected learner value and measurement quality, not feature count.

## Current external-reuse shortlist

- `openai/openai-realtime-agents` / OpenAI Agents SDK Realtime patterns — best first fit for current Next.js/TypeScript stack.
- LiveKit AgentsJS — compare when multi-provider production voice infrastructure becomes necessary.
- browser/Silero VAD libraries — optional only if native/provider turn detection is insufficient and mobile compatibility is acceptable.
- pyKT — offline learner-model benchmark later, not a runtime dependency now.
- GrowthBook or equivalent — later, only when experimentation operations become a real bottleneck.

## Interrupt policy

These may interrupt the queue:

- security/privacy/data-integrity defect;
- production defect blocking the current proving surface;
- new research/technology that materially changes a frontier decision;
- repeated development blocker that materially slows frontier implementation.

An interrupt still requires bounded scope, acceptance criteria, verification and rollback.
