# Tasks: Core Learner Model V1

**Input**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Status**: In Progress

---

## Phase 1: Setup & Spec Kit Initialization
- [x] T001: Initialize `specs/003-learner-evidence-state-v1/` directory structure and create `spec.md`.
- [x] T002: Perform bounded psychometric & educational measurement research and create `research.md`.
- [x] T003: Define core entities and state transitions in `data-model.md`.
- [x] T004: Establish formal contracts, invariants, and checklist in `contracts/learner-state-contract.md` and `checklists/requirements.md`.

## Phase 2: Core Data Contracts & Type Declarations
- [x] T005: Create `src/lib/core/learner-state.ts` with contract constants (`LEARNER_STATE_CONTRACT_ID`, `LEARNER_STATE_CONTRACT_VERSION`).
- [x] T006: Define typed interfaces: `LearnerConstructKey`, `AcceptedEvidenceRecord`, `ConstructSufficientStatistics`, `ConstructProjection`, and `LearnerStateProjection`.
- [x] T007: Define strongly-typed problem codes for validation failures.

## Phase 3: Evidence Validation & Boundary Enforcement
- [x] T008: Implement fail-closed runtime validator for `AcceptedEvidenceRecord` ensuring:
  - Canonical `ontologyNodeId` format and existence in provided `OntologyGraph`.
  - Compatibility between evidence `role` and node's `allowedEvidenceRoles`.
  - Compatibility between `responseModality` and node's `modalities`.
  - Strict ISO 8601 timestamp validation (no future dates, zero ambient `Date.now()`).
  - Validation of transfer distance vs changed `contextId`.
- [x] T009: Implement duplicate event ID detection and rejection.

## Phase 4: Construct Statistics & Uncertainty Projection
- [x] T010: Implement deterministic sufficient statistics aggregation (counts by role, activity, modality, context, transfer).
- [x] T011: Implement sufficiency and uncertainty classifier:
  - `totalEvents === 0` -> `"unknown"`, `provisionalRoutingScore: null`, `"maximal"` uncertainty.
  - `totalEvents < 2` -> `"insufficient-support"`, `score: null`, `"high"` uncertainty.
  - Consistent positive -> `"provisional-support"`.
  - Consistent negative -> `"provisional-weakness"`.
  - Mixed positive & negative -> `"conflicted-support"`, `score: null`.
- [x] T012: Enforce `decisionScope: "routing-only"` and ensure NO boolean `mastered` flag is produced.

## Phase 5: Deterministic Ledger Projection & Reducer Equivalence
- [x] T013: Implement canonical sorting of events by `(occurredAt, eventId)` before processing.
- [x] T014: Implement batch projection function `projectLearnerState`.
- [x] T015: Implement incremental reducer function `reduceLearnerState`.
- [x] T016: Formally prove and test that incremental reduction equals batch projection byte-for-byte.

## Phase 6: Comprehensive Adversarial & Property Tests
- [x] T017: Create `src/lib/core/learner-state.test.ts`.
- [x] T018: Test: No evidence evaluates to explicit unknown, never numeric zero.
- [x] T019: Test: Recognition evidence cannot increment production/transfer/retention support.
- [x] T020: Test: Production evidence cannot increment transfer support without changed context.
- [x] T021: Test: Same-context repetition is rejected from transfer support.
- [x] T022: Test: Raw observations and unvalidated attempts fail closed.
- [x] T023: Test: Target targeting non-canonical or non-existent ontology node fails closed.
- [x] T024: Test: Duplicate event ID fails closed.
- [x] T025: Test: Conflicting evidence is preserved as `conflicted-support`.
- [x] T026: Test: Deterministic replay under arbitrary shuffled input event order.
- [x] T027: Test: Reducer equivalence test (`projectLearnerState === reduceLearnerState`).
- [x] T028: Test: Legacy compatibility verification.

## Phase 7: Verification & Quality Gates
- [x] T029: Run focused learner state tests (`npx vitest run src/lib/core/learner-state.test.ts`).
- [x] T030: Run governance check (`npm run check:source-of-truth`).
- [x] T031: Run typecheck (`npx tsc --noEmit`) and lint (`npm run lint`).
- [x] T032: Run full repository tests (`npm test`) and content standards (`npm run test:content-standard`).
- [x] T033: Run Next.js build (`npm run build -- --webpack`) and NEP gate (`agent_verify.mjs`).
- [x] T034: Commit, push, trigger GitHub Actions CI, and verify 100% green.

## Phase 8: Resolution of Independent Review Blockers (GEMINI-LEARNER-002)
- [x] T035: Enforce real certified/reference evidence acceptance boundary (validate calibrationBenchmarkId and non-unknown modelFingerprint; reject forged self-asserted authority and raw observations).
- [x] T036: Enforce communication-activity target compatibility (`event.activity === targetNode.activity`).
- [x] T037: Enforce rigorous transfer semantics (transfer evidence role required, demonstrable prior distinct context required, failed transfer tracked as `nearTransferFailedCount` rather than same-context).
- [x] T038: Persist accepted event lineage audits (`acceptedEvents`), support distributions, and reveal counts in `ConstructSufficientStatistics` and `LearnerStateProjection`.
- [x] T039: Implement replay-safe, idempotent incremental reducer (`reduceLearnerState`) checking duplicates against accepted events and achieving byte-equivalence under reverse/arbitrary arrival order.
- [x] T040: Add bounded compatibility reader `readConstructFromLearnerState` in `src/lib/learning/learner-state-read.ts` and `adaptLearnerStateToLegacyRead`.
- [x] T041: Expand test suite to 40 tests in `src/lib/core/learner-state.test.ts` covering all P1 adversarial conditions.
- [x] T042: Run complete local verification gates, commit, push, trigger CI, and hand off for re-review.

## Phase 9: Resolution of Review ID 5116587399 Blockers (GEMINI-LEARNER-003)
- [x] T043: Learner-State Ingress Evidence Verification: eliminate caller self-asserted `authorityScope`, `calibrationBenchmarkId`, and `modelFingerprint`. Authenticate via `isCoreEvidenceForRouting` (module-private WeakSet and brand symbols) or sealed canonical `CoreEvidenceEnvelope` (`nep.core-evidence-envelope.v1`). Reject fabricated/ad-hoc objects with `unvalidated-evidence-rejected`.
- [x] T044: Lineage Preservation & Replay Provenance Fidelity: retain full evidence lineage in `AcceptedEventAudit` (`observationId`, `taskId`, `contextTags`, `outcome: EvidenceOutcome`, `grantId`). In `reconstructAcceptedRecord()`, use actual lineage fields rather than synthetic ID placeholders.
- [x] T045: Strict 1:1 Transfer Semantics Gating & Anti-Fallback: enforce 1:1 pairing (`near-transfer` role <-> `near-transfer` distance, `far-transfer` role <-> `far-transfer` distance, non-transfer roles <-> `same-context` distance). Fail closed on transfer attempts without prior comparison baseline context or with duplicate context with `invalid-transfer-distance`, and NEVER convert attempted transfer into `sameContextCount`.
- [x] T046: Legacy Compatibility Adapter Provenance & State Distinction: in `learner-state-read.ts` and `learner-state.ts`, preserve `modelVersion: "nep.learner-evidence-state.v1"` across all states (never `"ema-routing-v1"`), and distinguish `insufficient-support` and `conflicted-support` without collapsing them into `status: "unknown"`.
- [x] T047: Expand test suite in `src/lib/core/learner-state.test.ts` to 47 tests covering all 4 P1 resolution vectors.
- [x] T048: Execute full verification gates (`npm run check:source-of-truth`, `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run test:content-standard`, `node /home/thunder/Code/NEP/agent_verify.mjs`, `npm run build -- --webpack`), commit, push, trigger CI, and update PR #140.

## Phase 10: Resolution of Review ID PRR_kwDOS-Q4M88AAAABMP5LaA / 5116939112 Blockers (GEMINI-LEARNER-004)
- [x] T049: Enforce Module-Private Trust Markers & Deep Immutability: un-export `markCertifiedCoreEvidence` and `markReferenceCoreEvidence` in `src/lib/core/certified-evidence.ts`. Implement recursive `deepFreeze` on certified/reference evidence. Require `Object.isFrozen`, module-private WeakSet membership, and Symbol branding in `isCertifiedCoreEvidence`, `isReferenceCoreEvidence`, and `isCoreEvidenceForRouting`.
- [x] T050: Detached Evidence Envelope Hardening & Zero-Ambient Deterministic Sealing: in `sealCoreEvidence`, make `sealedAt: string` an explicit mandatory parameter (zero ambient clock reads via `new Date()`) and strictly validate ISO 8601 formatting. In `parseCoreEvidenceEnvelope`, reject any envelope claiming `authorityScope: "durable-assessment"` fail-closed with `"Detached evidence envelopes cannot assert durable-assessment authority without cryptographic host attestation"`, enforce `sealedAt` validation, and restrict envelopes to verified `repository-reference` authority.
- [x] T051: Authentic Test Helpers & Adversarial Attack Suites: refactor `makeValidReferenceRecord` in `src/lib/core/learner-state.test.ts` to call genuine `validateReferenceCoreEvidence(task, observation, candidate)`. Delete `makeValidDurableRecord`. Add mandatory adversarial tests: (a) cannot mark arbitrary records or bypass unexported markers, (b) cannot mutate legitimately certified records (immutable freeze throw and rejection of tampered clones), and (c) fabricated envelopes with recomputed SHA-256 digests fail closed.
- [x] T052: Update contracts and tasks in `specs/003-learner-evidence-state-v1/contracts/learner-state-contract.md` and `specs/003-learner-evidence-state-v1/tasks.md`.
- [x] T053: Run complete verification gates (`npm run check:source-of-truth`, `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run test:content-standard`, `node /home/thunder/Code/NEP/agent_verify.mjs`, `npm run build -- --webpack`), commit, push, trigger CI, and hand off for review.

## Phase 11: Resolution of Review ID 5117203120 / 5117205515 Blockers (GEMINI-LEARNER-005)
- [x] T054: Total Non-Throwing Detached Envelope Parser & Canonicalizer: rewrite `parseCoreEvidenceEnvelope` and `computeCanonicalEvidenceDigest` to never throw on malformed raw inputs (safe null/type guarding of primitive, nested, attempt, outcome, contextTags, and authority metadata).
- [x] T055: Fail-Closed Learner State Ingress & In-Process Branding Only: restrict learner state ingress strictly to in-process branded evidence created by `certifyCoreEvidence` or `validateReferenceCoreEvidence`. Direct submission of detached envelopes or raw records fails closed with `unvalidated-evidence-rejected`.
- [x] T056: Explicit Hydration Step for Transport Envelopes: introduce `hydrateReferenceCoreEvidenceFromEnvelope(rawEnvelope, task, observation)` performing structural validation, digest integrity check, and in-process reference validation.
- [x] T057: Symmetrical Sealing and Parsing: ensure `sealCoreEvidence` and `parseCoreEvidenceEnvelope` handle both durable and reference evidence envelopes symmetrically without throwing.
- [x] T058: Adversarial Test Suite for Detached Envelopes: add tests in `src/lib/core/learner-state.test.ts` verifying malformed nested payloads never throw, forged SHA-256 reference envelopes cannot enter learner state without hydration, and symmetrical durable/reference round-trips.
- [x] T059: Re-converge Spec Kit #003: update `spec.md`, `data-model.md`, `contracts/learner-state-contract.md`, `plan.md`, `checklists/requirements.md`, and `tasks.md` to reflect the current unified contracts.
- [x] T060: Run full verification gates (`npm run check:source-of-truth`, `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run test:content-standard`, `npm run build -- --webpack`, `agent_verify.mjs`), commit, push, trigger CI, and hand off.

