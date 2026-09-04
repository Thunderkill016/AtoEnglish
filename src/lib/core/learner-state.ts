import type { CommunicationActivity } from "./domain";
import { COMMUNICATION_ACTIVITIES } from "./domain";
import type { CoreEvidenceRole } from "./evidence-role";
import { CORE_EVIDENCE_ROLES } from "./evidence-role";
import type { ResponseModality } from "@/lib/learning/evidence";
import type {
  CertifiedCoreEvidence,
  ReferenceCoreEvidence,
  CoreEvidenceForRouting,
  EvidenceOutcome,
} from "./certified-evidence";
import type { OntologyGraph, OntologyNode } from "./ontology";
import { ONTOLOGY_NODE_ID_PATTERN } from "./ontology";
import type { LearnerDimensionRead } from "@/lib/learning/learner-state-read";
import { LEARNER_STATE_MODEL_VERSION } from "@/lib/learning/learner-state-read";

export const LEARNER_STATE_CONTRACT_ID = "nep.learner-evidence-state.v1" as const;
export const LEARNER_STATE_CONTRACT_VERSION = 1 as const;

export const MIN_INDEPENDENT_EVENTS_FOR_SUPPORT = 2 as const;
export const LOW_UNCERTAINTY_MIN_EVENTS = 5 as const;

export const RESPONSE_MODALITIES = [
  "choice",
  "text",
  "speech",
  "gesture",
  "none",
] as const;

export const TRANSFER_DISTANCES = [
  "same-context",
  "near-transfer",
  "far-transfer",
] as const;

export type TransferDistance = (typeof TRANSFER_DISTANCES)[number];

export type LearnerConstructKey = {
  readonly ontologyNodeId: string;
  readonly contractVersion: 1;
};

export type AcceptedEvidenceRecord = {
  readonly eventId: string;
  readonly targetId: string;
  readonly role: CoreEvidenceRole;
  readonly activity: CommunicationActivity;
  readonly responseModality: ResponseModality;
  readonly transferDistance: TransferDistance;
  readonly contextId: string | null;
  readonly contextTags?: readonly string[];
  readonly supportLevel: number;
  readonly revealUsed: boolean;
  readonly outcome: EvidenceOutcome;
  readonly occurredAt: string;
  readonly authorityScope: "durable-assessment" | "repository-reference";
  readonly provenance: {
    readonly observationId: string;
    readonly taskId: string;
    readonly calibrationBenchmarkId: string | null;
    readonly modelFingerprint: string;
  };
};

export type ConstructEvidenceSufficiency =
  | "unknown"
  | "insufficient-support"
  | "provisional-support"
  | "provisional-weakness"
  | "conflicted-support";

export type ConstructUncertaintyLevel = "maximal" | "high" | "moderate" | "low";

export type RoleEvidenceCounts = {
  readonly positive: number;
  readonly negative: number;
};

export type ActivityEvidenceCounts = {
  readonly positive: number;
  readonly negative: number;
};

export type ModalityEvidenceCounts = {
  readonly positive: number;
  readonly negative: number;
};

export type TransferEvidenceCounts = {
  readonly sameContextCount: number;
  readonly nearTransferCount: number;
  readonly nearTransferFailedCount: number;
  readonly farTransferCount: number;
  readonly farTransferFailedCount: number;
};

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
  readonly byRole: Readonly<Record<CoreEvidenceRole, RoleEvidenceCounts>>;
  readonly byActivity: Readonly<Record<CommunicationActivity, ActivityEvidenceCounts>>;
  readonly byModality: Readonly<Record<ResponseModality, ModalityEvidenceCounts>>;
  readonly transfer: TransferEvidenceCounts;
  readonly supportDistribution: Readonly<SupportDistribution>;
  readonly revealUsedCount: number;
  readonly durableEvidenceCount: number;
  readonly referenceEvidenceCount: number;
  readonly firstObservedAt: string | null;
  readonly lastObservedAt: string | null;
};

export type ConstructProjection = {
  readonly constructKey: LearnerConstructKey;
  readonly status: ConstructEvidenceSufficiency;
  readonly provisionalRoutingScore: number | null;
  readonly uncertainty: ConstructUncertaintyLevel;
  readonly decisionScope: "routing-only";
  readonly statistics: ConstructSufficientStatistics;
};

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

export type RejectedEvidenceAudit = {
  readonly eventId: string;
  readonly code: LearnerStateProblemCode;
  readonly message: string;
  readonly targetId?: string;
};

export type AcceptedEventAudit = {
  readonly eventId: string;
  readonly targetId: string;
  readonly occurredAt: string;
  readonly role: CoreEvidenceRole;
  readonly activity: CommunicationActivity;
  readonly responseModality: ResponseModality;
  readonly transferDistance: TransferDistance;
  readonly contextId: string | null;
  readonly authorityScope: "durable-assessment" | "repository-reference";
  readonly outcomeSuccess: boolean;
  readonly supportLevel: number;
  readonly revealUsed: boolean;
  readonly modelFingerprint: string;
  readonly calibrationBenchmarkId: string | null;
};

export type LearnerStateProjection = {
  readonly contractId: typeof LEARNER_STATE_CONTRACT_ID;
  readonly contractVersion: typeof LEARNER_STATE_CONTRACT_VERSION;
  readonly constructs: Readonly<Record<string, ConstructProjection>>;
  readonly totalEventsProcessed: number;
  readonly acceptedEvents: readonly AcceptedEventAudit[];
  readonly rejectedEvents: readonly RejectedEvidenceAudit[];
};

export type LearnerStateOptions = {
  readonly evaluationTimestamp?: string;
  readonly populateAllOntologyNodes?: boolean;
};

const ISO_DATE_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

const FORBIDDEN_EVIDENCE_PROPERTIES = new Set([
  "mastery",
  "mastered",
  "theta",
  "cefrLevel",
  "calibrationGrant",
  "authority",
  "promotion",
  "certified",
  "validationState",
  "durableAuthority",
  "canAffectDurableAssessment",
  "canBecomeMasteryCandidate",
]);

function createInitialRoleCounts(): Record<CoreEvidenceRole, RoleEvidenceCounts> {
  const result = {} as Record<CoreEvidenceRole, RoleEvidenceCounts>;
  for (const role of CORE_EVIDENCE_ROLES) {
    result[role] = Object.freeze({ positive: 0, negative: 0 });
  }
  return result;
}

function createInitialActivityCounts(): Record<CommunicationActivity, ActivityEvidenceCounts> {
  const result = {} as Record<CommunicationActivity, ActivityEvidenceCounts>;
  for (const activity of COMMUNICATION_ACTIVITIES) {
    result[activity] = Object.freeze({ positive: 0, negative: 0 });
  }
  return result;
}

function createInitialModalityCounts(): Record<ResponseModality, ModalityEvidenceCounts> {
  const result = {} as Record<ResponseModality, ModalityEvidenceCounts>;
  for (const mod of RESPONSE_MODALITIES) {
    result[mod] = Object.freeze({ positive: 0, negative: 0 });
  }
  return result;
}

export function createEmptyConstructStatistics(): ConstructSufficientStatistics {
  return Object.freeze({
    totalEvents: 0,
    positiveCount: 0,
    negativeCount: 0,
    conflictedCount: 0,
    distinctContextCount: 0,
    contextIds: Object.freeze([]),
    byRole: Object.freeze(createInitialRoleCounts()),
    byActivity: Object.freeze(createInitialActivityCounts()),
    byModality: Object.freeze(createInitialModalityCounts()),
    transfer: Object.freeze({
      sameContextCount: 0,
      nearTransferCount: 0,
      nearTransferFailedCount: 0,
      farTransferCount: 0,
      farTransferFailedCount: 0,
    }),
    supportDistribution: Object.freeze({
      level0: 0,
      level1: 0,
      level2Plus: 0,
    }),
    revealUsedCount: 0,
    durableEvidenceCount: 0,
    referenceEvidenceCount: 0,
    firstObservedAt: null,
    lastObservedAt: null,
  });
}

export function createEmptyConstructProjection(ontologyNodeId: string): ConstructProjection {
  return Object.freeze({
    constructKey: Object.freeze({
      ontologyNodeId,
      contractVersion: LEARNER_STATE_CONTRACT_VERSION,
    }),
    status: "unknown",
    provisionalRoutingScore: null,
    uncertainty: "maximal",
    decisionScope: "routing-only",
    statistics: createEmptyConstructStatistics(),
  });
}

export function createEmptyLearnerStateProjection(
  ontology?: OntologyGraph,
  options?: { populateAllOntologyNodes?: boolean }
): LearnerStateProjection {
  const constructs: Record<string, ConstructProjection> = {};
  if (ontology && options?.populateAllOntologyNodes) {
    for (const node of ontology.nodes) {
      constructs[node.id] = createEmptyConstructProjection(node.id);
    }
  }
  return Object.freeze({
    contractId: LEARNER_STATE_CONTRACT_ID,
    contractVersion: LEARNER_STATE_CONTRACT_VERSION,
    constructs: Object.freeze(constructs),
    totalEventsProcessed: 0,
    acceptedEvents: Object.freeze([]),
    rejectedEvents: Object.freeze([]),
  });
}

/**
 * Validates that an evidence record conforms strictly to the certified or reference evidence contract.
 * Rejects raw observations, forged authority assertions, missing model fingerprints,
 * uncalibrated durable claims, or incompatible ontology roles/activities.
 */
export function validateAcceptedEvidenceRecord(
  raw: unknown,
  ontology: OntologyGraph,
  evaluationTimestamp?: string
): { ok: true; record: AcceptedEvidenceRecord } | { ok: false; audit: RejectedEvidenceAudit } {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {
      ok: false,
      audit: Object.freeze({
        eventId: "unknown",
        code: "unvalidated-evidence-rejected",
        message: "Evidence record must be a non-null object",
      }),
    };
  }

  const record = raw as Record<string, unknown>;

  // Check raw observation shape - raw observations have channel/calibration but lack role/outcome
  if (
    "calibration" in record &&
    !("role" in record) &&
    !("outcome" in record)
  ) {
    return {
      ok: false,
      audit: Object.freeze({
        eventId: String(record.observationId ?? "unknown"),
        code: "unvalidated-evidence-rejected",
        message: "Raw observation cannot update learner state directly without certification/reference validation",
      }),
    };
  }

  const rawEventId = record.eventId;
  const eventId = typeof rawEventId === "string" && rawEventId.trim().length > 0 ? rawEventId.trim() : "invalid";

  if (eventId === "invalid") {
    return {
      ok: false,
      audit: Object.freeze({
        eventId: "invalid",
        code: "invalid-event-id",
        message: "Evidence record must have a non-empty string 'eventId'",
      }),
    };
  }

  // Check top-level forbidden properties
  for (const forbidden of FORBIDDEN_EVIDENCE_PROPERTIES) {
    if (Object.hasOwn(record, forbidden)) {
      return {
        ok: false,
        audit: Object.freeze({
          eventId,
          code: "forbidden-authority-field",
          message: `Evidence record contains forbidden authority property: ${forbidden}`,
        }),
      };
    }
  }

  // Check attempt nested object for forbidden properties
  if (record.attempt && typeof record.attempt === "object") {
    const attemptObj = record.attempt as Record<string, unknown>;
    for (const forbidden of FORBIDDEN_EVIDENCE_PROPERTIES) {
      if (Object.hasOwn(attemptObj, forbidden)) {
        return {
          ok: false,
          audit: Object.freeze({
            eventId,
            code: "forbidden-authority-field",
            message: `Evidence record attempt contains forbidden authority property: ${forbidden}`,
          }),
        };
      }
    }
  }

  // 1. Validate authorityScope and provenance integrity
  const authorityScope = record.authorityScope;
  if (authorityScope !== "durable-assessment" && authorityScope !== "repository-reference") {
    return {
      ok: false,
      audit: Object.freeze({
        eventId,
        code: "unvalidated-evidence-rejected",
        message: `authorityScope must be 'durable-assessment' or 'repository-reference': ${String(authorityScope)}`,
      }),
    };
  }

  // Extract modelFingerprint and calibrationBenchmarkId from flat or nested provenance
  const prov = record.provenance as Record<string, unknown> | undefined;
  const rawFingerprint = prov?.modelFingerprint ?? record.modelFingerprint;
  if (
    typeof rawFingerprint !== "string" ||
    rawFingerprint.trim().length === 0 ||
    rawFingerprint.trim().toLowerCase() === "unknown"
  ) {
    return {
      ok: false,
      audit: Object.freeze({
        eventId,
        code: "unvalidated-evidence-rejected",
        message: "Evidence record requires an authentic, non-empty modelFingerprint (cannot be 'unknown')",
      }),
    };
  }
  const modelFingerprint = rawFingerprint.trim();

  const rawBenchmarkId =
    prov?.calibrationBenchmarkId !== undefined
      ? prov.calibrationBenchmarkId
      : record.calibrationBenchmarkId !== undefined
      ? record.calibrationBenchmarkId
      : undefined;

  if (authorityScope === "durable-assessment") {
    // Durable assessment strictly requires an authentic non-empty calibration benchmark ID
    if (typeof rawBenchmarkId !== "string" || rawBenchmarkId.trim().length === 0) {
      return {
        ok: false,
        audit: Object.freeze({
          eventId,
          code: "unvalidated-evidence-rejected",
          message: "Durable assessment evidence strictly requires a non-empty calibrationBenchmarkId",
        }),
      };
    }
  } else {
    // Repository-reference evidence must NOT claim a calibration benchmark ID
    if (rawBenchmarkId !== null && rawBenchmarkId !== undefined) {
      return {
        ok: false,
        audit: Object.freeze({
          eventId,
          code: "unvalidated-evidence-rejected",
          message: "Repository reference evidence cannot declare a calibrationBenchmarkId (must be null)",
        }),
      };
    }
  }

  const calibrationBenchmarkId = typeof rawBenchmarkId === "string" ? rawBenchmarkId.trim() : null;

  // Extract observationId and taskId
  const observationId = String(prov?.observationId ?? record.observationId ?? "");
  const taskId = String(prov?.taskId ?? record.taskId ?? "");
  if (!observationId || !taskId) {
    return {
      ok: false,
      audit: Object.freeze({
        eventId,
        code: "unvalidated-evidence-rejected",
        message: "provenance must contain observationId and taskId",
      }),
    };
  }

  // 2. Validate targetId and ontology existence
  const targetId = record.targetId;
  if (typeof targetId !== "string" || !ONTOLOGY_NODE_ID_PATTERN.test(targetId)) {
    return {
      ok: false,
      audit: Object.freeze({
        eventId,
        code: "unknown-ontology-node",
        message: `targetId must match canonical ontology node pattern: ${String(targetId)}`,
        targetId: String(targetId),
      }),
    };
  }

  const targetNode = ontology.nodes.find((n) => n.id === targetId);
  if (!targetNode) {
    return {
      ok: false,
      audit: Object.freeze({
        eventId,
        code: "unknown-ontology-node",
        message: `targetId does not exist in the provided ontology graph: ${targetId}`,
        targetId,
      }),
    };
  }

  // 3. Activity Validation & Target Binding
  const activity = record.activity as CommunicationActivity;
  if (
    typeof activity !== "string" ||
    !(COMMUNICATION_ACTIVITIES as readonly string[]).includes(activity)
  ) {
    return {
      ok: false,
      audit: Object.freeze({
        eventId,
        code: "unvalidated-evidence-rejected",
        message: `Invalid activity: ${String(activity)}`,
        targetId,
      }),
    };
  }

  // If target node is a communication-activity, event activity MUST match the target node's canonical activity
  if (targetNode.domain === "communication-activity") {
    if (activity !== targetNode.activity) {
      return {
        ok: false,
        audit: Object.freeze({
          eventId,
          code: "incompatible-activity",
          message: `Event activity '${activity}' does not match target node communication activity '${targetNode.activity}'`,
          targetId,
        }),
      };
    }
  }

  // 4. Role Validation & Node Compatibility
  const role = record.role as CoreEvidenceRole;
  if (
    typeof role !== "string" ||
    !(CORE_EVIDENCE_ROLES as readonly string[]).includes(role) ||
    !targetNode.allowedEvidenceRoles.includes(role)
  ) {
    return {
      ok: false,
      audit: Object.freeze({
        eventId,
        code: "incompatible-evidence-role",
        message: `Role '${String(role)}' is not in node's allowedEvidenceRoles`,
        targetId,
      }),
    };
  }

  // 5. Modality Validation & Compatibility
  const attempt = record.attempt && typeof record.attempt === "object" ? (record.attempt as Record<string, unknown>) : null;
  const rawModality = record.responseModality ?? attempt?.responseModality;
  const responseModality = rawModality as ResponseModality;
  if (
    typeof responseModality !== "string" ||
    !(RESPONSE_MODALITIES as readonly string[]).includes(responseModality)
  ) {
    return {
      ok: false,
      audit: Object.freeze({
        eventId,
        code: "incompatible-modality",
        message: `Invalid responseModality: ${String(responseModality)}`,
        targetId,
      }),
    };
  }

  if (!isModalityCompatibleWithNode(responseModality, targetNode)) {
    return {
      ok: false,
      audit: Object.freeze({
        eventId,
        code: "incompatible-modality",
        message: `ResponseModality '${responseModality}' is not compatible with node modalities`,
        targetId,
      }),
    };
  }

  // 6. Timestamp Validation
  const occurredAt = record.occurredAt;
  if (typeof occurredAt !== "string" || !ISO_DATE_PATTERN.test(occurredAt)) {
    return {
      ok: false,
      audit: Object.freeze({
        eventId,
        code: "invalid-timestamp",
        message: `occurredAt must be a valid ISO 8601 string: ${String(occurredAt)}`,
        targetId,
      }),
    };
  }

  const eventTimeMs = Date.parse(occurredAt);
  if (Number.isNaN(eventTimeMs)) {
    return {
      ok: false,
      audit: Object.freeze({
        eventId,
        code: "invalid-timestamp",
        message: `occurredAt parsed to NaN: ${occurredAt}`,
        targetId,
      }),
    };
  }

  if (evaluationTimestamp) {
    const evalTimeMs = Date.parse(evaluationTimestamp);
    if (!Number.isNaN(evalTimeMs) && eventTimeMs > evalTimeMs) {
      return {
        ok: false,
        audit: Object.freeze({
          eventId,
          code: "invalid-timestamp",
          message: `occurredAt is from the future relative to evaluationTimestamp: ${occurredAt} > ${evaluationTimestamp}`,
          targetId,
        }),
      };
    }
  }

  // 7. Transfer Distance & Semantic Role Gating
  const transferDistance = record.transferDistance as TransferDistance;
  if (
    typeof transferDistance !== "string" ||
    !(TRANSFER_DISTANCES as readonly string[]).includes(transferDistance)
  ) {
    return {
      ok: false,
      audit: Object.freeze({
        eventId,
        code: "invalid-transfer-distance",
        message: `Invalid transferDistance: ${String(transferDistance)}`,
        targetId,
      }),
    };
  }

  const rawContextId = record.contextId !== undefined ? record.contextId : attempt?.contextId;
  const contextId = rawContextId === null || typeof rawContextId === "string" ? rawContextId : undefined;
  if (contextId === undefined) {
    return {
      ok: false,
      audit: Object.freeze({
        eventId,
        code: "unvalidated-evidence-rejected",
        message: "contextId must be a string or null",
        targetId,
      }),
    };
  }

  if (transferDistance === "near-transfer" || transferDistance === "far-transfer") {
    if (!contextId || contextId.trim().length === 0) {
      return {
        ok: false,
        audit: Object.freeze({
          eventId,
          code: "invalid-transfer-distance",
          message: `Transfer distance '${transferDistance}' requires a non-empty contextId`,
          targetId,
        }),
      };
    }

    // Role must be a transfer role if transferDistance is near/far-transfer
    if (role !== "near-transfer" && role !== "far-transfer") {
      return {
        ok: false,
        audit: Object.freeze({
          eventId,
          code: "incompatible-evidence-role",
          message: `Evidence role '${role}' cannot claim transfer distance '${transferDistance}' (transfer requires near-transfer or far-transfer role)`,
          targetId,
        }),
      };
    }
  }

  // 8. Outcome Validation
  const outcome = record.outcome as EvidenceOutcome;
  if (!isValidEvidenceOutcome(outcome)) {
    return {
      ok: false,
      audit: Object.freeze({
        eventId,
        code: "invalid-outcome",
        message: "outcome must be valid binary or bounded-score outcome",
        targetId,
      }),
    };
  }

  let contextTags: readonly string[] = Object.freeze([]);
  if (record.contextTags !== undefined) {
    if (!Array.isArray(record.contextTags)) {
      return {
        ok: false,
        audit: Object.freeze({
          eventId,
          code: "unvalidated-evidence-rejected",
          message: "contextTags must be an array of strings",
          targetId,
        }),
      };
    }
    const cleanTags: string[] = [];
    for (const tag of record.contextTags) {
      if (typeof tag !== "string" || !tag.trim()) {
        return {
          ok: false,
          audit: Object.freeze({
            eventId,
            code: "unvalidated-evidence-rejected",
            message: "contextTags elements must be non-empty strings",
            targetId,
          }),
        };
      }
      cleanTags.push(tag.trim());
    }
    contextTags = Object.freeze([...cleanTags].sort());
  }

  const supportLevel =
    typeof record.supportLevel === "number"
      ? record.supportLevel
      : typeof attempt?.supportLevel === "number"
      ? attempt.supportLevel
      : 0;

  const revealUsed = Boolean(record.revealUsed ?? attempt?.revealUsed);

  const validRecord: AcceptedEvidenceRecord = Object.freeze({
    eventId,
    targetId,
    role,
    activity,
    responseModality,
    transferDistance,
    contextId: contextId ? contextId.trim() : null,
    ...(contextTags.length > 0 ? { contextTags } : {}),
    supportLevel: Math.max(0, supportLevel),
    revealUsed,
    outcome: Object.freeze(outcome),
    occurredAt,
    authorityScope,
    provenance: Object.freeze({
      observationId,
      taskId,
      calibrationBenchmarkId,
      modelFingerprint,
    }),
  });

  return { ok: true, record: validRecord };
}

function isValidEvidenceOutcome(outcome: unknown): outcome is EvidenceOutcome {
  if (!outcome || typeof outcome !== "object") return false;
  const o = outcome as Record<string, unknown>;
  if (o.kind === "binary") {
    return typeof o.success === "boolean";
  }
  if (o.kind === "bounded-score") {
    return (
      typeof o.value === "number" &&
      typeof o.min === "number" &&
      typeof o.max === "number" &&
      Number.isFinite(o.value) &&
      Number.isFinite(o.min) &&
      Number.isFinite(o.max) &&
      o.min <= o.value &&
      o.value <= o.max
    );
  }
  return false;
}

function isModalityCompatibleWithNode(
  responseModality: ResponseModality,
  node: OntologyNode
): boolean {
  if (responseModality === "none") return true;

  const nodeModalities = node.modalities;
  if (nodeModalities.includes("multimodal")) return true;

  if (responseModality === "speech") {
    return (
      nodeModalities.includes("speech-output") ||
      nodeModalities.includes("audio-input") ||
      nodeModalities.includes("live-interaction")
    );
  }
  if (responseModality === "text") {
    return (
      nodeModalities.includes("text-input") ||
      nodeModalities.includes("text-output") ||
      nodeModalities.includes("live-interaction")
    );
  }
  if (responseModality === "choice") {
    return (
      nodeModalities.includes("text-input") ||
      nodeModalities.includes("text-output") ||
      nodeModalities.includes("audio-input")
    );
  }
  if (responseModality === "gesture") {
    return nodeModalities.includes("live-interaction");
  }
  return false;
}

export function evaluateOutcomeSuccess(outcome: EvidenceOutcome): boolean {
  if (outcome.kind === "binary") {
    return outcome.success;
  }
  const mid = (outcome.min + outcome.max) / 2;
  return outcome.value >= mid;
}

function updateConstructStatistics(
  prev: ConstructSufficientStatistics,
  event: AcceptedEvidenceRecord
): ConstructSufficientStatistics {
  const isPositive = evaluateOutcomeSuccess(event.outcome);
  const nextPositive = prev.positiveCount + (isPositive ? 1 : 0);
  const nextNegative = prev.negativeCount + (isPositive ? 0 : 1);
  const nextTotal = prev.totalEvents + 1;

  const byRole = { ...prev.byRole };
  const prevRole = prev.byRole[event.role] ?? { positive: 0, negative: 0 };
  byRole[event.role] = Object.freeze({
    positive: prevRole.positive + (isPositive ? 1 : 0),
    negative: prevRole.negative + (isPositive ? 0 : 1),
  });

  const byActivity = { ...prev.byActivity };
  const prevActivity = prev.byActivity[event.activity] ?? { positive: 0, negative: 0 };
  byActivity[event.activity] = Object.freeze({
    positive: prevActivity.positive + (isPositive ? 1 : 0),
    negative: prevActivity.negative + (isPositive ? 0 : 1),
  });

  const byModality = { ...prev.byModality };
  const prevModality = prev.byModality[event.responseModality] ?? { positive: 0, negative: 0 };
  byModality[event.responseModality] = Object.freeze({
    positive: prevModality.positive + (isPositive ? 1 : 0),
    negative: prevModality.negative + (isPositive ? 0 : 1),
  });

  // Transfer semantics:
  // Transfer support requires:
  // 1. Transfer evidence role ('near-transfer' or 'far-transfer')
  // 2. Demonstrable prior context (prev.contextIds.length >= 1)
  // 3. Changed distinct context (!prev.contextIds.includes(event.contextId))
  // Failed near/far-transfer attempts remain failed transfer evidence, NEVER relabeled as same-context!
  const transfer = { ...prev.transfer };
  const hasPriorContext = prev.contextIds.length >= 1;
  const isChangedContext = event.contextId !== null && !prev.contextIds.includes(event.contextId);

  if (event.transferDistance === "same-context") {
    transfer.sameContextCount += 1;
  } else if (event.transferDistance === "near-transfer") {
    const isTransferRole = event.role === "near-transfer";
    if (isPositive && isTransferRole && hasPriorContext && isChangedContext) {
      transfer.nearTransferCount += 1;
    } else if (!isPositive && isTransferRole) {
      transfer.nearTransferFailedCount += 1;
    } else {
      transfer.sameContextCount += 1;
    }
  } else if (event.transferDistance === "far-transfer") {
    const isTransferRole = event.role === "far-transfer";
    if (isPositive && isTransferRole && hasPriorContext && isChangedContext) {
      transfer.farTransferCount += 1;
    } else if (!isPositive && isTransferRole) {
      transfer.farTransferFailedCount += 1;
    } else {
      transfer.sameContextCount += 1;
    }
  }

  const contextIdsSet = new Set(prev.contextIds);
  if (event.contextId) {
    contextIdsSet.add(event.contextId);
  }
  const nextContextIds = Object.freeze([...contextIdsSet].sort());

  const firstObservedAt =
    prev.firstObservedAt === null || event.occurredAt < prev.firstObservedAt
      ? event.occurredAt
      : prev.firstObservedAt;
  const lastObservedAt =
    prev.lastObservedAt === null || event.occurredAt > prev.lastObservedAt
      ? event.occurredAt
      : prev.lastObservedAt;

  const conflictedCount = nextPositive > 0 && nextNegative > 0 ? Math.min(nextPositive, nextNegative) : 0;

  // Support distribution & reveal tracking
  const supportDist = { ...prev.supportDistribution };
  if (event.supportLevel === 0) {
    supportDist.level0 += 1;
  } else if (event.supportLevel === 1) {
    supportDist.level1 += 1;
  } else {
    supportDist.level2Plus += 1;
  }

  const revealUsedCount = prev.revealUsedCount + (event.revealUsed ? 1 : 0);
  const durableEvidenceCount = prev.durableEvidenceCount + (event.authorityScope === "durable-assessment" ? 1 : 0);
  const referenceEvidenceCount = prev.referenceEvidenceCount + (event.authorityScope === "repository-reference" ? 1 : 0);

  return Object.freeze({
    totalEvents: nextTotal,
    positiveCount: nextPositive,
    negativeCount: nextNegative,
    conflictedCount,
    distinctContextCount: nextContextIds.length,
    contextIds: nextContextIds,
    byRole: Object.freeze(byRole),
    byActivity: Object.freeze(byActivity),
    byModality: Object.freeze(byModality),
    transfer: Object.freeze(transfer),
    supportDistribution: Object.freeze(supportDist),
    revealUsedCount,
    durableEvidenceCount,
    referenceEvidenceCount,
    firstObservedAt,
    lastObservedAt,
  });
}

function deriveSufficiencyAndUncertainty(stats: ConstructSufficientStatistics): {
  status: ConstructEvidenceSufficiency;
  provisionalRoutingScore: number | null;
  uncertainty: ConstructUncertaintyLevel;
} {
  if (stats.totalEvents === 0) {
    return {
      status: "unknown",
      provisionalRoutingScore: null,
      uncertainty: "maximal",
    };
  }

  if (stats.totalEvents < MIN_INDEPENDENT_EVENTS_FOR_SUPPORT) {
    return {
      status: "insufficient-support",
      provisionalRoutingScore: null,
      uncertainty: "high",
    };
  }

  const positive = stats.positiveCount;
  const negative = stats.negativeCount;

  if (positive >= MIN_INDEPENDENT_EVENTS_FOR_SUPPORT && negative === 0) {
    return {
      status: "provisional-support",
      provisionalRoutingScore: clamp01(positive / stats.totalEvents),
      uncertainty: stats.totalEvents >= LOW_UNCERTAINTY_MIN_EVENTS ? "low" : "moderate",
    };
  }

  if (negative >= MIN_INDEPENDENT_EVENTS_FOR_SUPPORT && positive === 0) {
    return {
      status: "provisional-weakness",
      provisionalRoutingScore: 0,
      uncertainty: stats.totalEvents >= LOW_UNCERTAINTY_MIN_EVENTS ? "low" : "moderate",
    };
  }

  if (positive >= 1 && negative >= 1 && stats.totalEvents >= MIN_INDEPENDENT_EVENTS_FOR_SUPPORT) {
    return {
      status: "conflicted-support",
      provisionalRoutingScore: null,
      uncertainty: "high",
    };
  }

  return {
    status: "insufficient-support",
    provisionalRoutingScore: null,
    uncertainty: "high",
  };
}

export function projectConstruct(
  ontologyNodeId: string,
  stats: ConstructSufficientStatistics
): ConstructProjection {
  const { status, provisionalRoutingScore, uncertainty } = deriveSufficiencyAndUncertainty(stats);
  return Object.freeze({
    constructKey: Object.freeze({
      ontologyNodeId,
      contractVersion: LEARNER_STATE_CONTRACT_VERSION,
    }),
    status,
    provisionalRoutingScore,
    uncertainty,
    decisionScope: "routing-only",
    statistics: stats,
  });
}

export function projectLearnerState(
  ontology: OntologyGraph,
  evidenceEvents: readonly unknown[],
  options?: LearnerStateOptions
): LearnerStateProjection {
  const sortedEvents = [...evidenceEvents].sort(compareRawEvidence);
  const seenEventIds = new Set<string>();
  const acceptedEventsAudit: AcceptedEventAudit[] = [];
  const rejectedEvents: RejectedEvidenceAudit[] = [];
  const validEventsByTarget: Record<string, AcceptedEvidenceRecord[]> = {};

  for (const raw of sortedEvents) {
    const validation = validateAcceptedEvidenceRecord(raw, ontology, options?.evaluationTimestamp);
    if (!validation.ok) {
      rejectedEvents.push(validation.audit);
      continue;
    }
    const event = validation.record;
    if (seenEventIds.has(event.eventId)) {
      rejectedEvents.push(
        Object.freeze({
          eventId: event.eventId,
          code: "duplicate-event-id",
          message: `Duplicate eventId detected: ${event.eventId}`,
          targetId: event.targetId,
        })
      );
      continue;
    }
    seenEventIds.add(event.eventId);

    const isPositive = evaluateOutcomeSuccess(event.outcome);
    acceptedEventsAudit.push(
      Object.freeze({
        eventId: event.eventId,
        targetId: event.targetId,
        occurredAt: event.occurredAt,
        role: event.role,
        activity: event.activity,
        responseModality: event.responseModality,
        transferDistance: event.transferDistance,
        contextId: event.contextId,
        authorityScope: event.authorityScope,
        outcomeSuccess: isPositive,
        supportLevel: event.supportLevel,
        revealUsed: event.revealUsed,
        modelFingerprint: event.provenance.modelFingerprint,
        calibrationBenchmarkId: event.provenance.calibrationBenchmarkId,
      })
    );

    if (!validEventsByTarget[event.targetId]) {
      validEventsByTarget[event.targetId] = [];
    }
    validEventsByTarget[event.targetId].push(event);
  }

  const constructs: Record<string, ConstructProjection> = {};

  if (options?.populateAllOntologyNodes) {
    for (const node of ontology.nodes) {
      constructs[node.id] = createEmptyConstructProjection(node.id);
    }
  }

  const targetIds = Object.keys(validEventsByTarget).sort();
  for (const targetId of targetIds) {
    let stats = createEmptyConstructStatistics();
    for (const event of validEventsByTarget[targetId]) {
      stats = updateConstructStatistics(stats, event);
    }
    constructs[targetId] = projectConstruct(targetId, stats);
  }

  return Object.freeze({
    contractId: LEARNER_STATE_CONTRACT_ID,
    contractVersion: LEARNER_STATE_CONTRACT_VERSION,
    constructs: Object.freeze(constructs),
    totalEventsProcessed: sortedEvents.length,
    acceptedEvents: Object.freeze(acceptedEventsAudit),
    rejectedEvents: Object.freeze(rejectedEvents),
  });
}

/**
 * Incremental step reducer for streaming learner evidence.
 * Retains accepted event metadata to guarantee full idempotency, duplicate detection
 * across both accepted and rejected events, and byte-equivalence with batch projection.
 */
export function reduceLearnerState(
  currentState: LearnerStateProjection,
  newEvent: unknown,
  ontology: OntologyGraph,
  options?: LearnerStateOptions
): LearnerStateProjection {
  const validation = validateAcceptedEvidenceRecord(newEvent, ontology, options?.evaluationTimestamp);
  if (!validation.ok) {
    return Object.freeze({
      ...currentState,
      totalEventsProcessed: currentState.totalEventsProcessed + 1,
      rejectedEvents: Object.freeze([...currentState.rejectedEvents, validation.audit]),
    });
  }

  const event = validation.record;

  // Check duplicate eventId against previously accepted events
  if (currentState.acceptedEvents.some((e) => e.eventId === event.eventId)) {
    return Object.freeze({
      ...currentState,
      totalEventsProcessed: currentState.totalEventsProcessed + 1,
      rejectedEvents: Object.freeze([
        ...currentState.rejectedEvents,
        Object.freeze({
          eventId: event.eventId,
          code: "duplicate-event-id" as const,
          message: `Duplicate eventId detected in accepted ledger: ${event.eventId}`,
          targetId: event.targetId,
        }),
      ]),
    });
  }

  // Check duplicate eventId against previously rejected events
  if (currentState.rejectedEvents.some((e) => e.eventId === event.eventId)) {
    return Object.freeze({
      ...currentState,
      totalEventsProcessed: currentState.totalEventsProcessed + 1,
      rejectedEvents: Object.freeze([
        ...currentState.rejectedEvents,
        Object.freeze({
          eventId: event.eventId,
          code: "duplicate-event-id" as const,
          message: `Duplicate eventId detected in rejected audits: ${event.eventId}`,
          targetId: event.targetId,
        }),
      ]),
    });
  }

  // To guarantee general replay equivalence across arbitrary arrival order,
  // we rebuild construct projections canonically from all accepted records.
  const isPositive = evaluateOutcomeSuccess(event.outcome);
  const newAcceptedAudit: AcceptedEventAudit = Object.freeze({
    eventId: event.eventId,
    targetId: event.targetId,
    occurredAt: event.occurredAt,
    role: event.role,
    activity: event.activity,
    responseModality: event.responseModality,
    transferDistance: event.transferDistance,
    contextId: event.contextId,
    authorityScope: event.authorityScope,
    outcomeSuccess: isPositive,
    supportLevel: event.supportLevel,
    revealUsed: event.revealUsed,
    modelFingerprint: event.provenance.modelFingerprint,
    calibrationBenchmarkId: event.provenance.calibrationBenchmarkId,
  });

  const allAccepted = [...currentState.acceptedEvents, newAcceptedAudit].sort(compareAcceptedAudits);

  // Group by targetId and compute sufficient statistics
  const targetEvents: Record<string, AcceptedEvidenceRecord[]> = {};
  for (const accepted of allAccepted) {
    if (!targetEvents[accepted.targetId]) {
      targetEvents[accepted.targetId] = [];
    }
    targetEvents[accepted.targetId].push(reconstructAcceptedRecord(accepted));
  }

  const constructs: Record<string, ConstructProjection> = { ...currentState.constructs };
  for (const targetId of Object.keys(targetEvents)) {
    let stats = createEmptyConstructStatistics();
    for (const ev of targetEvents[targetId]) {
      stats = updateConstructStatistics(stats, ev);
    }
    constructs[targetId] = projectConstruct(targetId, stats);
  }

  return Object.freeze({
    contractId: LEARNER_STATE_CONTRACT_ID,
    contractVersion: LEARNER_STATE_CONTRACT_VERSION,
    constructs: Object.freeze(constructs),
    totalEventsProcessed: currentState.totalEventsProcessed + 1,
    acceptedEvents: Object.freeze(allAccepted),
    rejectedEvents: currentState.rejectedEvents,
  });
}

function reconstructAcceptedRecord(audit: AcceptedEventAudit): AcceptedEvidenceRecord {
  return Object.freeze({
    eventId: audit.eventId,
    targetId: audit.targetId,
    role: audit.role,
    activity: audit.activity,
    responseModality: audit.responseModality,
    transferDistance: audit.transferDistance,
    contextId: audit.contextId,
    supportLevel: audit.supportLevel,
    revealUsed: audit.revealUsed,
    outcome: Object.freeze({ kind: "binary", success: audit.outcomeSuccess }),
    occurredAt: audit.occurredAt,
    authorityScope: audit.authorityScope,
    provenance: Object.freeze({
      observationId: `obs-${audit.eventId}`,
      taskId: `task-${audit.eventId}`,
      calibrationBenchmarkId: audit.calibrationBenchmarkId,
      modelFingerprint: audit.modelFingerprint,
    }),
  });
}

function compareAcceptedAudits(a: AcceptedEventAudit, b: AcceptedEventAudit): number {
  const timeCmp = a.occurredAt.localeCompare(b.occurredAt);
  if (timeCmp !== 0) return timeCmp;
  return a.eventId.localeCompare(b.eventId);
}

/**
 * Bounded compatibility adapter mapping a V1 ConstructProjection into legacy LearnerDimensionRead.
 * Invariants:
 * 1. Unknown state (totalEvents === 0 or score === null) NEVER becomes numeric zero.
 * 2. Decision scope is strictly 'routing' and NEVER claims mastery or certification.
 */
export function adaptLearnerStateToLegacyRead(
  construct?: ConstructProjection
): LearnerDimensionRead {
  if (!construct || construct.status === "unknown" || construct.provisionalRoutingScore === null) {
    return {
      estimate: null,
      evidenceCount: construct?.statistics.totalEvents ?? 0,
      status: "unknown",
      confidence: null,
      modelVersion: LEARNER_STATE_MODEL_VERSION,
      decisionScope: "routing",
    };
  }

  return {
    estimate: construct.provisionalRoutingScore,
    evidenceCount: construct.statistics.totalEvents,
    status: "observed",
    confidence: null,
    modelVersion: LEARNER_STATE_MODEL_VERSION,
    decisionScope: "routing",
  };
}

/**
 * Comparative reference implementation of Bayesian Knowledge Tracing (BKT)
 * based on CAHLR/pyBKT (MIT License, Tag 1.4.3, Commit 06fc180ae72c117458acc527f8ec90cc8e0581c1).
 */
export type BktParameters = {
  readonly pL0: number;
  readonly pT: number;
  readonly pS: number;
  readonly pG: number;
};

export const DEFAULT_BKT_PARAMETERS: BktParameters = Object.freeze({
  pL0: 0.1,
  pT: 0.1,
  pS: 0.1,
  pG: 0.2,
});

export type ReferenceBktProjection = {
  readonly modelDonor: "CAHLR/pyBKT";
  readonly donorVersion: "1.4.3";
  readonly donorCommit: "06fc180ae72c117458acc527f8ec90cc8e0581c1";
  readonly license: "MIT";
  readonly role: "reference-baseline-donor";
  readonly finalPKnown: number;
  readonly historySteps: readonly number[];
  readonly limitations: readonly string[];
};

export function computeReferenceBktBaseline(
  history: readonly boolean[],
  params: BktParameters = DEFAULT_BKT_PARAMETERS
): ReferenceBktProjection {
  let pL = clamp01(params.pL0);
  const steps: number[] = [pL];

  for (const correct of history) {
    let pObsKnown: number;
    if (correct) {
      const pObsGivenKnown = 1 - params.pS;
      const pObsGivenUnknown = params.pG;
      const denom = pL * pObsGivenKnown + (1 - pL) * pObsGivenUnknown;
      pObsKnown = denom > 0 ? (pL * pObsGivenKnown) / denom : pL;
    } else {
      const pObsGivenKnown = params.pS;
      const pObsGivenUnknown = 1 - params.pG;
      const denom = pL * pObsGivenKnown + (1 - pL) * pObsGivenUnknown;
      pObsKnown = denom > 0 ? (pL * pObsGivenKnown) / denom : pL;
    }

    pL = pObsKnown + (1 - pObsKnown) * params.pT;
    pL = clamp01(pL);
    steps.push(pL);
  }

  return Object.freeze({
    modelDonor: "CAHLR/pyBKT",
    donorVersion: "1.4.3",
    donorCommit: "06fc180ae72c117458acc527f8ec90cc8e0581c1",
    license: "MIT",
    role: "reference-baseline-donor",
    finalPKnown: pL,
    historySteps: Object.freeze(steps),
    limitations: Object.freeze([
      "BKT assumes binary step-function mastery without automaticity or partial fluency",
      "BKT has absorbing state (no forgetting, P(F) = 0)",
      "BKT does not differentiate receptive vs productive modalities",
      "BKT does not enforce changed-context transfer boundaries",
      "BKT assigns non-zero probability P(L_0) to unknown state (N=0), violating epistemic uncertainty",
    ]),
  });
}

function compareRawEvidence(a: unknown, b: unknown): number {
  const ra = a as Record<string, unknown> | null;
  const rb = b as Record<string, unknown> | null;
  const ta = typeof ra?.occurredAt === "string" ? ra.occurredAt : "";
  const tb = typeof rb?.occurredAt === "string" ? rb.occurredAt : "";
  const timeCmp = ta.localeCompare(tb);
  if (timeCmp !== 0) return timeCmp;

  const ida = typeof ra?.eventId === "string" ? ra.eventId : "";
  const idb = typeof rb?.eventId === "string" ? rb.eventId : "";
  const idCmp = ida.localeCompare(idb);
  if (idCmp !== 0) return idCmp;

  // Deterministic tie-breaker for identical (occurredAt, eventId)
  const sa = JSON.stringify(a);
  const sb = JSON.stringify(b);
  return sa.localeCompare(sb);
}

function clamp01(val: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(val) ? val : 0));
}
