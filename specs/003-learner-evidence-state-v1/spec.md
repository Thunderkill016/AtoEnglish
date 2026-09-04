# Feature Specification: Core Learner Model V1 (Ontology-Bound Evidence Ledger & Uncertainty-Aware State Projection)

**Feature Branch**: `gemini/learner-evidence-state-v1`  
**Created**: 2026-09-04  
**Status**: Draft  
**Input**: Issue #137 (*Core learner model V1: ontology-bound evidence ledger and uncertainty-aware state projection*)

---

## User Scenarios & Testing

### User Story 1 - Depend on Ontology-Bound Construct Evidence (Priority: P1)

A core curriculum planner or adaptive diagnostic consumer can query learner state projections where every construct key is strictly bound to canonical executable ontology node IDs (`nep.en.v1.<domain>.<slug>`), rejecting arbitrary unvalidated string targets.

**Independent Test**: The projection accepts only certified evidence matching canonical node IDs in the executable ontology graph (`nep.english-ontology.v1`). Non-canonical or fabricated node IDs are rejected fail-closed with problem code `unknown-ontology-node`.

**Acceptance Scenarios**:
1. **Given** an evidence record targeting `nep.en.v1.language-system.phoneme-ae`, **When** projected against an ontology containing that node, **Then** the construct projection is created and indexed under the canonical key.
2. **Given** an evidence record targeting an arbitrary string `random-vocab-123`, **When** projected, **Then** the event is rejected fail-closed with `unknown-ontology-node`, and no synthetic construct state is generated.

---

### User Story 2 - Represent Uncertainty and Distinguish Unknown from Failure (Priority: P1)

An adaptive routing system can inspect construct evidence sufficiency without confusing absence of evidence (`unknown`) with observed weakness, and without collapsing conflicting positive/negative evidence into a false neutral scalar.

**Independent Test**: Zero evidence produces `status: "unknown"` with `provisionalRoutingScore: null` and `uncertainty: "maximal"`. Consistent positive trials produce `provisional-support`. Contradictory evidence produces `status: "conflicted-support"` rather than last-write-wins oscillation.

**Acceptance Scenarios**:
1. **Given** a construct with zero recorded evidence, **When** state is projected, **Then** `status` is `"unknown"`, `provisionalRoutingScore` is `null`, and `evidenceCount` is `0`. It is never defaulted to numeric `0.0`.
2. **Given** 3 successful independent production events, **When** state is projected, **Then** `status` is `"provisional-support"`.
3. **Given** 2 successful and 2 failed independent production events, **When** state is projected, **Then** `status` is `"conflicted-support"`, preserving explicit evidence conflict.

---

### User Story 3 - Enforce Role, Modality, and Context-Transfer Boundaries (Priority: P1)

A measurement auditor can verify that recognition evidence never masquerades as production ability, single-context production never masquerades as transfer evidence, and same-context repetition never manufactures transfer claims.

**Independent Test**: Evidence items targeting receptive discrimination cannot increment productive support. Multiple successful attempts under `contextId: "ctx-1"` increment single-context support but strictly yield `transferCount: 0`.

**Acceptance Scenarios**:
1. **Given** 5 successful recognition events, **When** state is projected, **Then** `byRole["receptive-discrimination"]` has 5 positive counts, while `byRole["free-production"]` remains 0.
2. **Given** 3 production successes with identical `contextId: "ctx-1"` and `transferDistance: "same-context"`, **When** state is projected, **Then** transfer evidence remains 0.
3. **Given** a production success with `contextId: "ctx-2"` and `transferDistance: "near-transfer"`, **When** state is projected, **Then** near-transfer count is incremented with distinct context tracking.

---

### User Story 4 - Deterministic Replay and Incremental Reducer Equivalence (Priority: P2)

A storage system or distributed node can rebuild the complete learner state projection from an append-only ledger of immutable events, with mathematical guarantee that full batch projection and incremental step-by-step reduction yield byte-identical results.

**Independent Test**: Shuffling input event order (with identical event timestamps/IDs) produces byte-identical projections. Projecting `events[0..N]` in one batch produces byte-identical JSON to reducing `events[0..N]` sequentially from an empty state.

**Acceptance Scenarios**:
1. **Given** an array of $N$ valid events in arbitrary insertion order, **When** `projectLearnerState` runs, **Then** events are canonicalized by `occurredAt` + `eventId` and yield identical outputs.
2. **Given** $N$ events, **When** reduced iteratively via `reduceLearnerState`, **Then** the final state matches `projectLearnerState(ontology, events)` byte-for-byte.

---

### User Story 5 - Enforce Scoped Authority and Prevent Premature Mastery (Priority: P2)

Downstream consumers are protected against premature mastery claims: the state projection explicitly marks `decisionScope: "routing-only"` and forbids converting uncalibrated heuristics or repository-reference fixtures into durable assessment authority or boolean mastery flags.

**Independent Test**: Projections contain no boolean `mastered` field. Projections based on repository-reference evidence maintain `authorityScope: "routing-only"` and reject attempts to claim certification or durable assessment authority.

---

## Requirements

### Functional Requirements

- **FR-001**: Construct keys MUST be strictly bound to canonical executable ontology node IDs conforming to `nep.en.v1.<domain>.<slug>` from contract `nep.english-ontology.v1`.
- **FR-002**: Target nodes MUST exist in the provided `OntologyGraph`. Non-existent targets MUST fail closed with `unknown-ontology-node`.
- **FR-003**: Raw uncertified observations, evaluator scores, UI clicks, unvalidated attempts, or detached transport envelopes MUST NOT enter learner state directly. In Core V1, learner state strictly consumes in-process branded evidence records (`isCoreEvidenceForRouting`) produced by `certifyCoreEvidence()` or `validateReferenceCoreEvidence()`. Detached envelopes and raw objects fail closed with `unvalidated-evidence-rejected`.
- **FR-004**: Constructs with zero evidence MUST evaluate to `status: "unknown"`, `provisionalRoutingScore: null`, `evidenceCount: 0`, and `uncertainty: "maximal"`.
- **FR-005**: Evidence roles MUST NOT cross boundaries: recognition events cannot increment retrieval, production, or transfer statistics.
- **FR-006**: Transfer evidence MUST enforce strict 1:1 pairing between transfer distance and role (`near-transfer` distance <-> `near-transfer` role, `far-transfer` distance <-> `far-transfer` role; non-transfer roles require `same-context`), non-empty `contextId`, and demonstrable prior baseline context (`contextIds.length >= 1`). First-ever events or duplicate contexts fail closed with `invalid-transfer-distance`, and failed attempts increment `nearTransferFailedCount` or `farTransferFailedCount` rather than falling back to `sameContextCount`.
- **FR-007**: Duplicate event IDs MUST fail closed or be idempotently rejected with problem code `duplicate-event-id`.
- **FR-008**: Full batch ledger projection MUST be byte-equivalent to incremental sequential reduction.
- **FR-009**: Output ordering and problem reporting MUST be deterministic and independent of input array order.
- **FR-010**: All timestamps MUST be explicit ISO 8601 strings passed by the caller; ambient `Date.now()` or clock reads are strictly forbidden.
- **FR-011**: Conflicting positive and negative evidence MUST be explicitly surfaced as `status: "conflicted-support"` with conflict statistics.
- **FR-012**: The state projection MUST declare `decisionScope: "routing-only"` and MUST NOT output a boolean `mastered: true/false` flag.
- **FR-013**: Repository-reference evidence MUST NOT create durable assessment authority or claim psychometric calibration.
- **FR-014**: Event evidence role MUST be compatible with the target node's `allowedEvidenceRoles`. Incompatible roles MUST fail closed with `incompatible-evidence-role`.
- **FR-015**: Event response modality MUST be compatible with the target node's declared `modalities`. Incompatible modalities MUST fail closed with `incompatible-modality`.
- **FR-016**: Bounded legacy adapters MUST preserve existing `readLearnerDimension` behavior without converting unknown states into observed zero, preserving model version `nep.learner-evidence-state.v1`.
- **FR-017**: The core module MUST be pure and deterministic with zero DB, network, browser, or provider dependencies.
- **FR-018**: This feature MUST NOT modify database schemas, UI components, authentication, or live provider integrations.
- **FR-019**: State projections MUST preserve complete accepted event lineage in `acceptedEvents` (`observationId`, `taskId`, `occurredAt`, `contextTags`, `outcome: EvidenceOutcome`, `grantId`, `modelFingerprint`, `calibrationBenchmarkId`).
- **FR-020**: Detached evidence envelopes (`CoreEvidenceEnvelope`) are transport-only artifacts; parsing validates structure and SHA-256 digest without granting in-process branding. Direct envelope passing into learner state fails closed.

---

## Key Entities

- **LearnerConstructKey**: Strongly-typed pair of canonical `ontologyNodeId` and `contractVersion: 1`.
- **AcceptedEvidenceRecord**: Immutable certified evidence event accepted into the ledger.
- **ConstructSufficientStatistics**: Deterministic counts of positive, negative, and conflicted events partitioned by role, activity, modality, context, scaffolding distribution, and authority scope.
- **ConstructProjection**: Read snapshot for a single construct exposing sufficiency status, provisional score, uncertainty, and statistics.
- **AcceptedEventAudit**: Complete lineage record for an accepted event retained in the state projection.
- **LearnerStateProjection**: Aggregate projection across all active constructs with metadata, processed counts, accepted event lineage, and rejected event audit logs.
- **CoreEvidenceEnvelope**: Detached transport container pairing evidence payload with a SHA-256 integrity digest and explicit ISO `sealedAt`.

---

## Success Criteria

- **SC-001**: 100% of tested valid evidence events correctly update construct sufficient statistics and state projections.
- **SC-002**: 100% of adversarial failure classes (unknown node, duplicate ID, incompatible role, incompatible modality, fake transfer, raw observation) fail closed with typed problem codes.
- **SC-003**: Shuffled event arrays produce byte-identical JSON projection results.
- **SC-004**: Incremental reduction matches batch projection byte-for-byte.
- **SC-005**: All existing repository tests (569 tests across 58 test files) and content standards (50 tests) pass without regression.
- **SC-006**: Source-of-truth governance, typecheck (`tsc --noEmit`), linter, and NEP automated health gate (14/14) pass cleanly.
