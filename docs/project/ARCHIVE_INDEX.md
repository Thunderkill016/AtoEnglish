# AtoEnglish Historical / R&D Archive Index

**Status:** non-authoritative index  
**Canonical current state:** `docs/project/PROJECT_STATE.md`

This index exists so cleanup can remove stale work from the active queue **without throwing useful work away**.

A listed item is not approved for reuse automatically. Reuse requires a new bounded AtoEnglish task that names the artifact, explains why it is needed, and verifies it against current `main` and current product evidence.

## A. 28-day speaking / Gold Day 1 family

**Classification:** historical product hypothesis + reusable lesson experiments.

Key sources:

- Issue #20 — 28-day work-speaking pilot roadmap.
- PR #35 — Gold Day 1 lesson experiment.
- PR #45 — autonomous mastery-tutor / bounded retry-transfer experiment.
- `docs/curriculum/28-day-speaking-journey-contract.md`.
- `docs/product/PRODUCT_TRUTH.md`, `CURRENT_PRIORITY.md`, `DO_NOT_BUILD.md`.

Potential reusable value:

- bounded 10–15 minute session design;
- explicit can-do outcome;
- prompt-support fading;
- required spoken output;
- feedback + retry + changed-context performance;
- separation of technical, learner and market evidence.

Not current authority:

- “28 days” itself;
- workplace-speaking segment;
- exact five-question scope;
- pilot metrics/targets.

## B. Authentic media / YouTube-to-Curriculum / Real Talk family

**Classification:** historical product exploration + reusable content-ingestion research.

Key PR family:

- #46 — authentic licensed video vertical slice;
- #47–#57 — YouTube-to-Curriculum, source candidates, private lessons, natural communication environments, Real Talk and related compiler plans.

Potential reusable value:

- source-rights/licensing discipline;
- authentic communication material selection;
- private-use lesson compilation concepts;
- provenance-aware media workflows.

Not current authority:

- YouTube as the primary product;
- Real Talk as the primary product;
- autonomous curriculum publication.

## C. Adaptive runtime / planner / Error Memory family

**Classification:** historical/reusable runtime R&D; some parts already reached `main` and must be evaluated as existing code rather than blindly removed.

Key PR family:

- #58, #61, #63, #65, #67, #69, #71, #73, #75, #77, #79, #81;
- #83 production learning-core database integration;
- #87 legacy-attempt compatibility candidate;
- #98 unknown-vs-observed-zero fix already merged to `main`.

Potential reusable value:

- unknown != observed zero;
- attempt/evidence/state separation;
- Error Memory and repair/re-probe concepts;
- bounded adaptive candidate selection;
- canonical attempt/evidence RPC boundary.

Current exception:

- **PR #87 remains active** because production privileges make its compatibility problem concrete.

## D. Realtime tutor/provider-control family

**Classification:** historical/reusable provider-integration R&D.

Key PR family:

- #89, #91, #93, #96, #97, #103, #104.

Potential reusable value:

- bounded provider sessions;
- server-side sideband/control patterns;
- explicit fallback modes;
- separation of provider conversation from canonical learning evaluation.

Not current authority:

- Realtime tutor as product direction;
- paid provider dependency as required architecture.

## E. Learner-model benchmark family

**Classification:** historical/reusable measurement R&D.

Key PR family:

- #99 — offline learner-model benchmark;
- #101 — real-data readiness boundary;
- #102 — CI verification stack.

Potential reusable value:

- learner-level splits;
- privacy-safe benchmark export concepts;
- BKT/LKT-style baseline comparison;
- explicit `no-evidence` gate.

Critical retained finding:

PR #101's production `no-evidence` result was reconfirmed during the 2026-09-06 reset: canonical learner data remains effectively empty.

## F. Pronunciation / OpenPronounce family

**Classification:** reusable R&D archive; no learner-facing authority.

Key PR family:

- #105 — OpenPronounce acoustic shadow;
- #106 — free browser-local pronunciation sensor;
- #107 — pronunciation evidence-engine R&D;
- #129 — Modal speech challenger;
- #130 — hardened Modal shadow benchmark.

Potential reusable value:

- privacy-aware audio boundaries;
- service authentication/fail-closed patterns;
- posterior-aware phoneme/CTC research;
- explicit calibration boundary;
- runtime provenance and benchmark hygiene.

Evidence limit:

runtime smoke != pronunciation quality. No current artifact establishes validated Vietnamese-learner scoring authority.

The supplied `Báo cáo hạ tầng OpenPronounce.txt` is classified as historical process notes about Gemini agent capability usage, not infrastructure/quality evidence.

## G. Nếp Core / ontology / provenance / benchmark family

**Classification:** historical R&D program; not current AtoEnglish identity or roadmap.

Key issues:

- #109–#127 core-first umbrella/subtracks;
- #133, #135, #137, #138, #141, #143.

Key PR family:

- #128 — Nếp English Intelligence Engine foundation;
- #131 — core gold slice;
- #132 — provenance authority registry;
- #134 — Spec Kit governance;
- #136 — English ontology;
- #139 — vetted OSS adoption;
- #140 — learner evidence/state projection;
- #142/#144 — SLAM/reality benchmark;
- #145/#146 — native evidence pilot specification/predictor freeze;
- #147 — synthetic N2 evidence plumbing;
- #148 — utility sensitivity;
- #149 — sizing/allocation;
- #150 — transfer/delayed-recall frontier audit.

Potential reusable value:

- observation != evidence != state != mastery;
- typed evidence boundaries;
- unknown != zero;
- provenance/license discipline;
- deterministic/replay-safe contracts;
- causal leakage controls;
- exact-head verification and adversarial review discipline;
- benchmark claims separated from learner efficacy claims.

Not current authority:

- `nep.*` namespace as AtoEnglish product identity;
- full-English ontology as required critical path;
- provenance/authority infrastructure as prerequisite to product work;
- N2/N3 native evidence program as automatic next work;
- synthetic benchmark success as learner evidence.

## H. Old agent/autopilot planning family

**Classification:** historical process state; execution disabled.

Key sources:

- `AGENT_ROADMAP.md` old auto-refill task pool;
- old `AGENT_PLAN.md`, `AGENT_BACKLOG.md`, `AGENT_REPORT.md` states;
- `AGENT_AUTOPILOT.md` and `.agent-autopilot-disabled`.

Retention rule:

- keep the kill switch;
- replace stale task-pool/plan/report content with thin reset-aware stubs;
- rely on Git history for old task details rather than keeping them active in root Markdown.

## Reuse procedure

To reactivate anything from this archive:

1. start from current AtoEnglish `main`, not the archived branch by default;
2. state the current product/user blocker;
3. name the exact archived artifact being reused;
4. explain what evidence still applies and what is stale;
5. port the smallest necessary part;
6. rerun current tests/CI and product checks;
7. do not restore the old roadmap wholesale.
