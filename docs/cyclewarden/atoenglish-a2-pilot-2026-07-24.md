# CycleWarden A2 pilot — AtoEnglish

**Date:** 2026-07-24  
**Cycle ID:** `atoenglish:20260724-a2-pilot`  
**Objective:** Identify the highest-value bounded repository experiment for the 28-day work-speaking product.  
**Autonomy:** A2 — repository research and decision only  
**Risk:** R1 — documentation and curriculum planning only  
**Resulting stage:** `planned`

## Execution note

This is a connector-backed dry run of the current CycleWarden A2 decision process against the private AtoEnglish repository. It does **not** claim that the local CycleWarden CLI executed checks because the CLI currently requires a local checkout. No product code, production data, secrets, deployment, or database state was modified.

This cycle intentionally excludes interviews, workflow observation, surveys, and other direct user-research work. The decision is constrained to repository evidence.

## Decision question

Which bounded repository change should AtoEnglish complete next before another lesson implementation is allowed?

## Repository evidence inspected

- `README.md`: current stack, 50 registered lesson units, lesson surfaces, known `UnitTemplate` debt, cleanup policy, and verification commands.
- `package.json`: deterministic scripts for TypeScript, lint, Vitest, content standards, Playwright, production build, audit, inventory, and lesson smoke checks.
- `CONTENT_STYLE.md`: one shared lesson blueprint, block order, speaking/output requirements, and curriculum quality gates.
- `src/lib/data/units/unitA01.ts`: current first lesson content, estimated time, learning outcomes, dialogues, repair language, fluency drill, and speaking prompts.
- Product roadmap issue #20: one 28-day work-speaking outcome, explicit constraints, ordered queue, and prohibited premature expansion.
- Merged PRs #21, #22, #23, #28, and #30: login metadata, pilot promise, speaking assessment, analytics recovery, and database security.
- Closed PR #31: a narrow Unit A0-1 implementation was rejected in favor of broader curriculum reasoning.
- Current `main` observed at commit `bebef60bb8fcbaa6b9297a566e29036d2dbd4c05`.

## Evidence-backed claims

1. **The engineering foundation is already sufficient for bounded curriculum work.** The repository exposes a production application, authentication, progress, assessment, analytics, database migrations, unit tests, content gates, Playwright, and production builds.
2. **The product outcome is explicit.** After 28 days, the learner should introduce their name, role, company, and one responsibility; answer five predictable work questions; and independently request repetition or slower speech.
3. **The current Unit A0-1 does not fully implement that outcome.** Its outcomes and final speaking prompt cover name, spelling, origin, and “say that again”, but not role, company, responsibility, five follow-up questions, or “Could you speak more slowly?”.
4. **The current Unit A0-1 is structurally too large for the public promise.** It declares an estimated 40 minutes while the pilot promise is 10–15 minutes per day.
5. **Existing content checks validate shape more strongly than journey coherence.** They can require fields, counts, order, job scenarios, and quiz structure without proving that 28 consecutive days build toward one final speaking performance.
6. **Editing Unit A0-1 immediately would repeat the failure mode of PR #31.** A lesson patch without a durable journey contract risks optimizing one file while leaving the 28-day sequence undefined.
7. **A complete A0–B2 rebuild is not a bounded experiment.** The selected action must define the pilot journey without reopening all 50 units or rewriting `UnitTemplate`.
8. **Autonomous code execution remains outside this cycle.** CycleWarden is being used at A2 for research, decision, constraints, and handoff rather than unattended product modification.

## Opportunity portfolio

### 1. Run a fresh full technical baseline

**Candidate:** execute TypeScript, lint, tests, content standards, build, and production smoke checks.  
**Value:** confirms current `main` remains healthy.  
**Limitation:** it does not resolve what the 28-day curriculum should contain.

### 2. Patch Unit A0-1 directly

**Candidate:** shorten the lesson and add role, company, responsibility, follow-up questions, and slower-speech repair language.  
**Value:** moves the first lesson closer to the target outcome.  
**Limitation:** without a journey contract, the patch cannot determine what belongs on day 1 versus later days and may create another oversized lesson.

### 3. Define the 28-day speaking-journey contract and first-week acceptance matrix — **selected**

**Candidate:** create one repository-owned contract that maps each day to a measurable can-do outcome, required spoken output, prompt-reduction level, review dependency, and completion evidence.  
**Value:** converts the roadmap into an implementation boundary that future lesson PRs can be checked against.  
**Limitation:** the contract is a repository decision artifact, not proof of learning effectiveness.

## Decision

Select **Opportunity 3: define the 28-day speaking-journey contract and first-week acceptance matrix**.

The immediate blocker is not missing UI or infrastructure. It is the absence of a durable mapping between the final speaking assessment and the daily lesson sequence. The next implementation should not start until the repository can answer:

- what the learner must say on each day;
- which chunks are introduced, retrieved, and reused;
- where prompts are reduced;
- when the five predictable questions appear;
- when repair phrases are required without prompting;
- what belongs in Unit A0-1 and what must be deferred;
- which checks demonstrate that the implementation matches the journey.

Do **not** expand to a complete A0–B2 rebuild, add an AI tutor, create a mobile application, build custom payments, add broader gamification, or rewrite `UnitTemplate` during this experiment.

## Smallest reversible experiment

### Hypothesis

A repository-owned 28-day journey contract will expose scope errors before code changes and allow Unit A0-1 and the first-week sequence to be implemented as small, testable lessons rather than one 40-minute content bundle.

### Method

1. Translate the final assessment functions from issue #20 and PR #23 into daily can-do outcomes.
2. Allocate the required language across four weeks, with each day constrained to a 10–15 minute learning promise.
3. Define explicit progression from model → supported rehearsal → reduced prompts → novel speaking task.
4. Define first-week acceptance criteria for name, spelling, role, company, responsibility, five questions, and repair language.
5. Mark which current Unit A0-1 material should remain, move to later days, or be removed from the first lesson.
6. Preserve the existing lesson blueprint and content-standard gates rather than inventing a second content schema.
7. Produce one later implementation handoff limited to Unit A0-1 and the minimum first-week data files needed by the contract.

### Success criteria

- All 28 days have one measurable spoken can-do outcome.
- Every day identifies the learner's required spoken output, not only vocabulary or grammar coverage.
- Each day fits the 10–15 minute promise by scope rather than by changing the displayed estimate alone.
- The five predictable questions and all three repair phrases have an explicit introduction, retrieval, and independent-use point.
- Day 1 no longer attempts to carry the whole first-week outcome.
- The baseline and final assessment functions are traceable to the daily sequence.
- The implementation handoff touches no unrelated architecture, database, authentication, analytics, XP, FSRS, or gamification code.

### Guardrails

- No interviews or user observation are required by this cycle.
- No claims that repository planning proves learner improvement or market demand.
- No secrets, production writes, deployment, or database migration.
- No complete A0–B2 reconstruction.
- No major `UnitTemplate` refactor.
- No automated merge or autonomous product-code execution.
- Preserve the existing blueprint order and content-standard checks.

### Rollback

Delete or revise the planning documents. No product rollback is required because the experiment changes no runtime behavior.

## Execution handoff

**Allowed scope**

- `docs/curriculum/28-day-speaking-journey-contract.md`
- `docs/cyclewarden/**`
- a later focused PR for `src/lib/data/units/unitA01.ts`
- only the smallest additional first-week unit data required by the approved contract
- targeted tests or content-standard assertions that enforce the approved journey

**Forbidden scope**

- secrets and production credentials
- authentication, database, RLS, analytics infrastructure, payments, XP, leagues, streaks, or FSRS
- automatic merge or deploy
- complete A0–B2 reconstruction
- AI tutor, mobile app, custom payment system, or new gamification breadth
- major `UnitTemplate` or lesson-action refactor without a contract-level blocker

**Verification plan for the later code change**

- `npm run test:content-standard`
- `bash scripts/audit-lesson-content.sh`
- targeted Unit A0-1 tests
- `npx tsc --noEmit`
- `npm run lint`
- `npm run test`
- `npm run build`
- relevant lesson production smoke checks

## CycleWarden verdict

CycleWarden is useful here as a **scope and sequencing gate**. The repository-only cycle rejects both extremes: immediately patching one large lesson without a journey model and reopening the complete A0–B2 curriculum. It selects a bounded contract that can govern the next code PR.

The main CycleWarden dogfood gap remains unchanged: a first-class remote/private-repository adapter or installed local runner is still needed to execute the native `inspect → assess → research-repository` path rather than reconstructing repository evidence through GitHub.