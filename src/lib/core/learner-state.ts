import type { CommunicationActivity } from "./domain";
import { COMMUNICATION_ACTIVITIES } from "./domain";
import type { CoreEvidenceRole } from "./evidence-role";
import { CORE_EVIDENCE_ROLES } from "./evidence-role";
import type { ResponseModality } from "@/lib/learning/evidence";
import type { EvidenceOutcome } from "./certified-evidence";
import type { OntologyGraph, OntologyNode } from "./ontology";
import { ONTOLOGY_NODE_ID_PATTERN } from "./ontology";

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
  readonly farTransferCount: number;
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

export type LearnerStateProjection = {
  readonly contractId: typeof LEARNER_STATE_CONTRACT_ID;
  readonly contractVersion: typeof LEARNER_STATE_CONTRACT_VERSION;
  readonly constructs: Readonly<Record<string, ConstructProjection>>;
  readonly totalEventsProcessed: number;
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
      farTransferCount: 0,
    }),
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
    rejectedEvents: Object.freeze([]),
  });
}

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

  // Check attempt nested property for forbidden properties if present
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

  // Support responseModality either at root or inside attempt
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

  if (
    (transferDistance === "near-transfer" || transferDistance === "far-transfer") &&
    (!contextId || contextId.trim().length === 0)
  ) {
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

  const authorityScope = record.authorityScope;
  if (authorityScope !== "durable-assessment" && authorityScope !== "repository-reference") {
    return {
      ok: false,
      audit: Object.freeze({
        eventId,
        code: "unvalidated-evidence-rejected",
        message: `authorityScope must be 'durable-assessment' or 'repository-reference': ${String(authorityScope)}`,
        targetId,
      }),
    };
  }

  // Provenance can be flat or structured
  const prov = record.provenance as Record<string, unknown> | undefined;
  const observationId = prov?.observationId ?? record.observationId;
  const taskId = prov?.taskId ?? record.taskId;
  if (typeof observationId !== "string" || typeof taskId !== "string") {
    return {
      ok: false,
      audit: Object.freeze({
        eventId,
        code: "unvalidated-evidence-rejected",
        message: "provenance must contain observationId and taskId",
        targetId,
      }),
    };
  }

  const calibrationBenchmarkId =
    prov?.calibrationBenchmarkId !== undefined
      ? (prov.calibrationBenchmarkId as string | null)
      : record.calibrationBenchmarkId !== undefined
      ? (record.calibrationBenchmarkId as string | null)
      : null;

  const modelFingerprint = String(prov?.modelFingerprint ?? record.modelFingerprint ?? "unknown");

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

  const supportLevel = typeof record.supportLevel === "number" ? record.supportLevel : typeof attempt?.supportLevel === "number" ? attempt.supportLevel : 0;
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
      observationId: String(observationId),
      taskId: String(taskId),
      calibrationBenchmarkId:
        calibrationBenchmarkId === null || typeof calibrationBenchmarkId === "string"
          ? calibrationBenchmarkId
          : null,
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

function evaluateOutcomeSuccess(outcome: EvidenceOutcome): boolean {
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

  const transfer = { ...prev.transfer };
  if (event.transferDistance === "same-context") {
    transfer.sameContextCount += 1;
  } else if (event.transferDistance === "near-transfer") {
    if (isPositive && event.contextId && !prev.contextIds.includes(event.contextId)) {
      transfer.nearTransferCount += 1;
    } else {
      transfer.sameContextCount += 1;
    }
  } else if (event.transferDistance === "far-transfer") {
    if (isPositive && event.contextId && !prev.contextIds.includes(event.contextId)) {
      transfer.farTransferCount += 1;
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
    rejectedEvents: Object.freeze(rejectedEvents),
  });
}

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

  for (const rejected of currentState.rejectedEvents) {
    if (rejected.eventId === event.eventId) {
      return Object.freeze({
        ...currentState,
        totalEventsProcessed: currentState.totalEventsProcessed + 1,
        rejectedEvents: Object.freeze([
          ...currentState.rejectedEvents,
          Object.freeze({
            eventId: event.eventId,
            code: "duplicate-event-id" as const,
            message: `Duplicate eventId detected: ${event.eventId}`,
            targetId: event.targetId,
          }),
        ]),
      });
    }
  }

  const prevConstruct = currentState.constructs[event.targetId];
  const existingStats = prevConstruct?.statistics ?? createEmptyConstructStatistics();

  const updatedStats = updateConstructStatistics(existingStats, event);
  const updatedConstruct = projectConstruct(event.targetId, updatedStats);

  const constructs = {
    ...currentState.constructs,
    [event.targetId]: updatedConstruct,
  };

  return Object.freeze({
    contractId: LEARNER_STATE_CONTRACT_ID,
    contractVersion: LEARNER_STATE_CONTRACT_VERSION,
    constructs: Object.freeze(constructs),
    totalEventsProcessed: currentState.totalEventsProcessed + 1,
    rejectedEvents: currentState.rejectedEvents,
  });
}

/**
 * Comparative reference implementation of Bayesian Knowledge Tracing (BKT)
 * based on CAHLR/pyBKT (MIT License, Tag 1.4.3, Commit 06fc180ae72c117458acc527f8ec90cc8e0581c1).
 *
 * NOTE: BKT represents single-skill mastery as a scalar probability. In Nếp Core V1,
 * this is strictly an offline evaluation and comparative baseline donor.
 * It is subordinate to Nếp's multi-dimensional sufficiency and epistemic uncertainty state.
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
  return ida.localeCompare(idb);
}

function clamp01(val: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(val) ? val : 0));
}
