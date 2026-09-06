# AtoEnglish Project Reset Audit — 2026-09-06

**Status:** audit record / evidence summary  
**Canonical current state:** `docs/project/PROJECT_STATE.md`  
**Reset issue:** #151

## Executive finding

AtoEnglish is not blocked by one missing feature. It accumulated **multiple incompatible development directions and multiple sources of authority at the same time**.

The central failure mode is work-selection drift:

1. the repository had a usable AtoEnglish web product and a narrow pilot hypothesis;
2. later work pivoted into a broad Nếp/Core research program;
3. the research program generated ontology, provenance, learner-state, benchmark, speech, predictor and synthetic-evidence subprograms;
4. each subprogram created further prerequisite work and review gates;
5. production learner data remained effectively empty for the learner-model questions being optimized;
6. old product docs, root agent docs, GitHub issues, Draft PRs and experiment branches all remained visible as if they were current.

The result was a repository that could pass increasingly sophisticated technical checks while becoming harder to answer a basic question: **what is AtoEnglish currently building and why?**

## Audited surfaces

This reset inspected:

- GitHub `main`, branches, recent commits, open issues and Draft PRs;
- root agent planning/autopilot documents;
- product/curriculum source-of-truth documents;
- Unit A0-1 and landing-product promise;
- learner-state/benchmark/native-evidence work;
- pronunciation/OpenPronounce branches and deployment evidence;
- GitHub Verify workflow and branch protection state;
- read-only Supabase production migration, privilege, RPC and aggregate row-count state;
- read-only Vercel project/deployment state;
- the supplied `Báo cáo hạ tầng OpenPronounce.txt` artifact.

## 1. Product identity and source-of-truth drift

### Historical narrow product direction

The July product documents defined a Vietnamese-first 28-day work-speaking pilot and explicitly warned that the infrastructure was already sufficient to test a learner outcome. They also deferred broad AI, pronunciation-engine and architecture work.

That direction was a **product hypothesis**, not validated truth, but it had an important discipline: obtain usability, learning and market evidence before adding breadth.

### Pivot that created the dead end

Issue #109 (2026-09-04) changed the priority to a broad **Nếp English Intelligence Engine** before further product/UI work.

That decision spawned or activated work across:

- full English ontology;
- evidence and learner-state contracts;
- provenance/authority registry;
- OSS adoption matrix;
- public-corpus benchmark harness;
- native learner-evidence pilot;
- predictor/BKT comparison;
- synthetic N2 plumbing;
- utility-margin analysis;
- sample-size/allocation analysis;
- transfer/delayed-recall frontier research;
- speech and text engine tracks.

These tasks were internally disciplined, but collectively they changed AtoEnglish from a product project into an open-ended research infrastructure program.

### Reset decision

Nếp is now classified as **historical/R&D**. Its work may be reused, but it no longer defines AtoEnglish identity or roadmap.

## 2. GitHub work-state fragmentation

The repository accumulated many simultaneous open Draft PR families, including:

- Gold Day 1 / bounded speaking-session experiments;
- YouTube-to-Curriculum / private lesson generation;
- Real Talk / authentic-media directions;
- adaptive Nếp capability/runtime/planner work;
- Realtime tutor/provider-control work;
- learner-model benchmark/readiness work;
- OpenPronounce/pronunciation-engine work;
- Nếp Core/ontology/provenance/benchmark/native-evidence work.

This made `open` cease to mean `active`.

Reset policy:

- preserve branches and commit history;
- close superseded Draft PRs instead of leaving them as competing queues;
- retain concrete production/security/data-integrity fixes separately;
- maintain an archive index for high-value reusable work.

## 3. Production data reality versus learner-model complexity

Read-only Supabase production audit on 2026-09-06 returned:

| Table | Rows |
|---|---:|
| `learning_attempts` | 0 |
| `learning_evidence_events` | 0 |
| `learner_skill_states` | 0 |
| `card_review_logs` | 0 |
| `pilot_events` | 44 |

This independently reconfirms the earlier PR #101 `no-evidence` snapshot.

Consequences:

- production does not currently contain enough canonical learner evidence to validate the advanced learner-model work;
- synthetic fixtures can test plumbing, determinism, leakage and contracts, but cannot prove learner-model usefulness;
- additional predictive/utility/sample-size machinery should not be an active AtoEnglish critical path merely because its research dependencies exist.

## 4. Repository / Supabase production divergence

Production Supabase migration head observed during the audit includes:

- `20260902130000_learning_core_foundation`;
- `20260902133000_record_learning_attempt`;
- `20260902133500_learning_evidence_constraints`;
- `20260902134000_privacy_safe_oral_observation`.

Repository `main` additionally contains:

- `20260903090000_learner_evidence_coverage`.

Production currently does **not** expose `get_learner_evidence_coverage(text[])`.

Production privilege audit confirms:

- RLS enabled on `learning_attempts`, `learning_evidence_events`, `learner_skill_states`;
- authenticated SELECT enabled;
- authenticated direct INSERT/UPDATE/DELETE disabled;
- `record_learning_attempt(...)` exists and authenticated has EXECUTE.

Current `main` still directly inserts the legacy `learning_attempts` shape from `recordLearningAttempts()`.

Therefore PR #87 is not ordinary stale R&D. It addresses a concrete compatibility boundary and must remain open until independently reviewed/reverified. Release consistency is tracked in #152.

## 5. GitHub / Vercel production divergence

Audited GitHub `main`:

`b6db4731471f5e454b1c732cac595fd538f89c1a`

Latest observed Vercel deployment with `target: production`:

- deployment: `dpl_4ub3vtTKZFP2EjT9nhYbnmX1q3Pa`;
- Git commit: `1e462367d365d03e01d2b211da2499ac612a57ff`;
- branch: `main`;
- state: READY.

Many newer deployments exist, but the audited recent ones are preview deployments (`target: null`) from experimental branches.

Therefore `atoenglish.vercel.app` must not be assumed to represent current GitHub `main`. No production deploy occurs during this reset.

## 6. Branch-protection and CI governance

`.github/workflows/verify.yml` currently verifies pull requests to `main` and pushes to `main` with:

- lint;
- TypeScript;
- unit tests;
- content-standard tests;
- fresh Supabase migrations;
- database lint;
- pgTAP/RLS tests.

However GitHub reports `main` itself is not protected and has no required status-check enforcement at branch-protection level.

This reset records the risk but does not pretend to fix it: the current connector does not expose a branch-protection write action.

## 7. Agent/autopilot state

Positive finding: autonomy is already kill-switched.

- `.agent-autopilot-disabled` exists;
- `AGENT_AUTOPILOT.md` says daemon/orchestrator and automatic backlog refill must not be restored without reviewed owner approval.

Negative finding: `AGENT_ROADMAP.md` still contains a large historical automatic task pool and text describing automatic backlog refill. Even though the kill switch prevents execution, leaving that file as an apparent roadmap is dangerous for future agents.

Reset action: convert stale plan/backlog/roadmap/report files into thin reset-aware stubs. Git history preserves their previous contents.

## 8. Product-promise / lesson mismatch

The landing currently advertises a 28-day, 10–15 minute/day speaking journey.

`unitA01.ts` still declares `estimatedTime: 40` and includes a large alphabet/vocabulary/grammar/dialogue/listening/pronunciation/fluency/quiz/review payload.

The historical 28-day curriculum contract itself already identifies this mismatch and proposes a bounded Day 1 alternative.

This is evidence of product incoherence, but the reset does **not** automatically reinstate the 28-day pilot or rewrite A0-1. The mismatch is preserved as an input to the next product-direction decision.

## 9. OpenPronounce / pronunciation work

The GitHub pronunciation family contains useful R&D:

- shadow acoustic service boundaries;
- browser-local phoneme sensor experiments;
- CTC posterior/lattice research;
- Modal runtime smoke and security/provenance hardening.

The strongest available evidence still explicitly separates runtime execution from learner-quality evidence. For example, the hardened Modal smoke completed inference but reported zero quality-evaluated learner cases.

The supplied `Báo cáo hạ tầng OpenPronounce.txt` does **not** contain an infrastructure benchmark or learner-quality result. It is a 17-line historical note about a Gemini/Antigravity “max-capability” agent protocol and PR #132 instructions. It is therefore classified as process/history evidence, not OpenPronounce production evidence.

Reset classification: pronunciation/OpenPronounce = **reusable R&D archive**, not current learner-facing authority.

## 10. What is retained instead of deleted

The reset intentionally preserves useful ideas and implementation evidence, including:

- bounded speaking-session/Gold Day 1 experiments;
- authentic-media and Real Talk research;
- adaptive planner/error-memory concepts;
- Realtime provider-control/security patterns;
- learner-state unknown-vs-zero fixes already merged to `main`;
- privacy-safe canonical attempt/evidence schema work already applied to Supabase;
- pronunciation/CTC/runtime research;
- ontology/provenance/evidence-lineage/benchmark methodology as optional R&D reference;
- exact-head CI/review discipline where it protects real risk.

Preservation does not make these the next roadmap.

## 11. Cleanup principle

Do not perform a destructive “clean slate” rewrite.

Use:

- one rescue branch;
- documentation/source-of-truth changes only during reset;
- GitHub metadata closure for superseded work;
- Git history/branches as the archive;
- separate P0 issues for real production consistency defects;
- no production writes/deploys;
- no automatic merge.

## 12. State after this audit

The project should be interpreted as:

```text
AtoEnglish current main + verified production facts
        |
        +-- #151 project reset (active)
        +-- #152 release consistency (active P0)
        +-- PR #87 compatibility candidate (active P0 review)
        |
        +-- historical/reusable product experiments
        +-- historical/reusable Nếp/Core R&D
        +-- historical/reusable pronunciation R&D
```

The next product direction is intentionally **undecided** until cleanup is finished.
