# Data Model: Core Learner Model V1

## Canonical learner projection

```ts
export type LearnerConstructKey = {
  readonly ontologyNodeId: string;
  readonly contractVersion: 1;
};

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

There is no projection-level `authorityScope` and no boolean mastery field.

## Accepted evidence / lineage

Accepted learner-state records preserve the actual `eventId`, `targetId`, `taskId`, `observationId`, role, activity, response modality, transfer distance, context ID/tags, support level, reveal use, outcome, occurredAt, authority scope, grant ID, calibration benchmark ID, and model fingerprint. Replay never fabricates task/observation IDs.

`AcceptedEventAudit` retains those lineage fields in `LearnerStateProjection.acceptedEvents` so duplicates and canonical replay remain auditable.

## Sufficient statistics

`ConstructSufficientStatistics` includes total/positive/negative/conflicted counts; counts by role/activity/modality; distinct context IDs; `sameContextCount`, `nearTransferCount`, `nearTransferFailedCount`, `farTransferCount`, `farTransferFailedCount`; support distribution; reveal-use count; durable/reference counts; and first/last observed timestamps.

Unknown is represented by zero events plus `status: "unknown"` and a null score, not by an invented zero ability.

## Detached evidence transport

```ts
export type CoreEvidenceEnvelope = {
  readonly contractId: "nep.core-evidence-envelope.v1";
  readonly evidence: CoreEvidencePayload;
  readonly digest: string;
  readonly authorityScope: "durable-assessment" | "repository-reference";
  readonly sealedAt: string;
};
```

Envelope/payload objects returned by `parseCoreEvidenceEnvelope()` are **unbranded transport data**. Parsing and a matching SHA-256 digest do not produce `CoreEvidenceForRouting`.

V1 has no detached-JSON -> branded-evidence hydration path. `hydrateReferenceCoreEvidenceFromEnvelope()` is retained only as an in-process compatibility helper: it requires that `rawEnvelope.evidence` is already the original private-branded `ReferenceCoreEvidence`. JSON serialization, cloning, or reconstruction removes that identity and must return `invalid-envelope`, even if the public digest is recomputed.

## State transitions

- zero events -> `unknown`, null score, maximal uncertainty;
- one accepted event -> `insufficient-support`;
- consistent positive evidence -> provisional support;
- consistent negative evidence -> provisional weakness;
- mixed positive/negative evidence -> conflicted support with scalar score suppressed.

All timestamps and ordering inputs are explicit; no ambient time exists in the core.