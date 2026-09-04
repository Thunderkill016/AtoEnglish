# Data Model: Core Learner Model V1

**Feature**: [spec.md](./spec.md) | **Date**: 2026-09-04 | **Status**: Draft

---

## 1. Core Data Entities

### 1.1 Canonical Construct Key (`LearnerConstructKey`)
Binds learner state strictly to executable ontology nodes:
```typescript
export type LearnerConstructKey = {
  readonly ontologyNodeId: string;
  readonly contractVersion: 1;
};
```
* **Grammar**: `ontologyNodeId` must strictly match `ONTOLOGY_NODE_ID_PATTERN`:
  `^nep\.en\.v1\.(language-system|communication-activity)\.[a-z0-9]+(?:-[a-z0-9]+)*$`
* **Invariant**: Must resolve to a valid node in the provided `OntologyGraph`.

---

### 1.2 Accepted Evidence Record (`AcceptedEvidenceRecord`)
The immutable unit of certified learner evidence:
```typescript
export type AcceptedEvidenceRecord = {
  readonly eventId: string;
  readonly targetId: string;
  readonly taskId: string;
  readonly observationId: string;
  readonly role: CoreEvidenceRole;
  readonly activity: CommunicationActivity;
  readonly responseModality: ResponseModality;
  readonly transferDistance: "same-context" | "near-transfer" | "far-transfer";
  readonly contextId: string | null;
  readonly contextTags: readonly string[];
  readonly supportLevel: number;
  readonly revealUsed: boolean;
  readonly outcome: EvidenceOutcome;
  readonly occurredAt: string; // Valid ISO 8601
  readonly authorityScope: "durable-assessment" | "repository-reference";
  readonly grantId: string | null;
  readonly provenance: {
    readonly observationId: string;
    readonly taskId: string;
    readonly calibrationBenchmarkId: string | null;
    readonly modelFingerprint: string;
  };
};
```

---

### 1.3 Construct Sufficient Statistics (`ConstructSufficientStatistics`)
Deterministic aggregation of evidence across roles, modalities, activities, contexts, scaffolding, and authority:
```typescript
export type SupportDistribution = {
  readonly level0: number;
  readonly level1: number;
  readonly level2Plus: number;
};

export type ConstructSufficientStatistics = {
  readonly totalEvents: number;
  readonly positiveCount: number;
  readonly negativeCount: number;
  readonly conflictedCount: number;
  readonly distinctContextCount: number;
  readonly contextIds: readonly string[];
  readonly byRole: Readonly<Record<CoreEvidenceRole, { readonly positive: number; readonly negative: number }>>;
  readonly byActivity: Readonly<Record<CommunicationActivity, { readonly positive: number; readonly negative: number }>>;
  readonly byModality: Readonly<Record<ResponseModality, { readonly positive: number; readonly negative: number }>>;
  readonly transfer: {
    readonly sameContextCount: number;
    readonly nearTransferCount: number;
    readonly nearTransferFailedCount: number;
    readonly farTransferCount: number;
    readonly farTransferFailedCount: number;
  };
  readonly supportDistribution: Readonly<SupportDistribution>;
  readonly revealUsedCount: number;
  readonly durableEvidenceCount: number;
  readonly referenceEvidenceCount: number;
  readonly firstObservedAt: string | null;
  readonly lastObservedAt: string | null;
};
```

---

### 1.4 Construct Projection (`ConstructProjection`)
The read snapshot for an individual construct:
```typescript
export type ConstructEvidenceSufficiency =
  | "unknown"
  | "insufficient-support"
  | "provisional-support"
  | "provisional-weakness"
  | "conflicted-support";

export type ConstructUncertaintyLevel = "maximal" | "high" | "moderate" | "low";

export type ConstructProjection = {
  readonly constructKey: LearnerConstructKey;
  readonly status: ConstructEvidenceSufficiency;
  readonly provisionalRoutingScore: number | null;
  readonly uncertainty: ConstructUncertaintyLevel;
  readonly decisionScope: "routing-only";
  readonly statistics: ConstructSufficientStatistics;
};
```

---

### 1.5 Accepted & Rejected Event Audits (`AcceptedEventAudit`, `RejectedEvidenceAudit`)

```typescript
export type LearnerStateProblemCode =
  | "invalid-event-id"
  | "duplicate-event-id"
  | "unknown-ontology-node"
  | "incompatible-activity"
  | "incompatible-evidence-role"
  | "incompatible-modality"
  | "invalid-timestamp"
  | "invalid-transfer-distance"
  | "unvalidated-evidence-rejected"
  | "forbidden-authority-field"
  | "invalid-outcome";

export type AcceptedEventAudit = {
  readonly eventId: string;
  readonly targetId: string;
  readonly taskId: string;
  readonly observationId: string;
  readonly occurredAt: string;
  readonly role: CoreEvidenceRole;
  readonly activity: CommunicationActivity;
  readonly responseModality: ResponseModality;
  readonly transferDistance: TransferDistance;
  readonly contextId: string | null;
  readonly contextTags: readonly string[];
  readonly authorityScope: "durable-assessment" | "repository-reference";
  readonly outcome: EvidenceOutcome;
  readonly outcomeSuccess: boolean;
  readonly supportLevel: number;
  readonly revealUsed: boolean;
  readonly modelFingerprint: string;
  readonly calibrationBenchmarkId: string | null;
  readonly grantId: string | null;
};

export type RejectedEvidenceAudit = {
  readonly eventId: string;
  readonly code: LearnerStateProblemCode;
  readonly message: string;
  readonly targetId?: string;
};
```

---

### 1.6 Overall Learner State Projection (`LearnerStateProjection`)
The aggregate projection of all active construct states preserving full accepted event lineage:
```typescript
export type LearnerStateProjection = {
  readonly contractId: "nep.learner-evidence-state.v1";
  readonly contractVersion: 1;
  readonly constructs: Readonly<Record<string, ConstructProjection>>;
  readonly totalEventsProcessed: number;
  readonly acceptedEvents: readonly AcceptedEventAudit[];
  readonly rejectedEvents: readonly RejectedEvidenceAudit[];
};
```

---

### 1.7 Detached Evidence Transport Envelope (`CoreEvidenceEnvelope`)
Detached serialized transport envelope secured by canonical SHA-256 integrity fingerprint:
```typescript
export type CoreEvidencePayload = {
  readonly eventId: string;
  readonly taskId: string;
  readonly targetId: string;
  readonly role: CoreEvidenceRole;
  readonly observationId: string;
  readonly activity: CommunicationActivity;
  readonly responseModality: ResponseModality;
  readonly transferDistance: TransferDistance;
  readonly contextTags: readonly string[];
  readonly outcome: EvidenceOutcome;
  readonly attempt: {
    readonly supportLevel: number;
    readonly revealUsed: boolean;
    readonly responseLatencyMs: number | null;
    readonly responseModality: ResponseModality;
    readonly contextId: string | null;
  };
  readonly occurredAt: string;
  readonly authorityScope: "durable-assessment" | "repository-reference";
  readonly calibrationBenchmarkId: string | null;
  readonly modelFingerprint: string;
  readonly grantId: string | null;
};

export type CoreEvidenceEnvelope = {
  readonly contractId: "nep.core-evidence-envelope.v1";
  readonly evidence: CoreEvidencePayload;
  readonly digest: string;
  readonly authorityScope: "durable-assessment" | "repository-reference";
  readonly sealedAt: string; // Explicit ISO 8601, zero ambient time
};
```
* **Transport-Only Invariant**: Envelopes and parsed payloads are strictly unbranded transport artifacts. They CANNOT enter learner state directly without in-process authentication (`validateReferenceCoreEvidence` or `certifyCoreEvidence`). Direct envelope passing fails closed with `unvalidated-evidence-rejected`.

---

## 2. Invariants and State Transitions

1. **Unknown State**:
   - Condition: `totalEvents === 0`.
   - Projection: `status: "unknown"`, `provisionalRoutingScore: null`, `uncertainty: "maximal"`.
2. **Insufficient Support**:
   - Condition: `totalEvents > 0 && totalEvents < 2`.
   - Projection: `status: "insufficient-support"`, `provisionalRoutingScore: null`, `uncertainty: "high"`.
3. **Provisional Support**:
   - Condition: `positiveCount >= 2 && negativeCount === 0`.
   - Projection: `status: "provisional-support"`, `provisionalRoutingScore: positiveCount / totalEvents`, `uncertainty: "moderate"` (or `"low"` if $N \ge 5$).
4. **Provisional Weakness**:
   - Condition: `negativeCount >= 2 && positiveCount === 0`.
   - Projection: `status: "provisional-weakness"`, `provisionalRoutingScore: 0`, `uncertainty: "moderate"` (or `"low"` if $N \ge 5$).
5. **Conflicted Support**:
   - Condition: `positiveCount >= 1 && negativeCount >= 1 && (positiveCount + negativeCount >= 2)`.
   - Projection: `status: "conflicted-support"`, `provisionalRoutingScore: null` (Score suppressed to prevent false neutral average), `uncertainty: "high"`.
