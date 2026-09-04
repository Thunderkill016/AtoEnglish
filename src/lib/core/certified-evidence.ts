import crypto from "node:crypto";
import { CORE_EVIDENCE_ROLES, type CoreEvidenceRole } from "./evidence-role";
import type { ResponseModality } from "@/lib/learning/evidence";
import {
  type ResolvedDurableCalibrationAuthority,
  isResolvedDurableCalibrationAuthority,
  isResolvedContractAuthority,
} from "./authority-registry";
import {
  COMMUNICATION_ACTIVITIES,
  type CommunicationActivity,
} from "./domain";
import {
  canAffectDurableAssessment,
  type CalibrationProfile,
  type CoreObservation,
} from "./observation";
import {
  TRANSFER_DISTANCES,
  type TransferDistance,
  validateCoreTask,
  type CoreTaskSpec,
} from "./task";

export type EvidenceOutcome =
  | { kind: "binary"; success: boolean }
  | { kind: "bounded-score"; value: number; min: number; max: number };

export type CoreEvidenceCandidate = {
  eventId: string;
  taskId: string;
  targetId: string;
  role: CoreEvidenceRole;
  observationId: string;
  outcome: EvidenceOutcome;
  evaluatorConfidence: number | null;
  attempt: {
    supportLevel: number;
    revealUsed: boolean;
    responseLatencyMs: number | null;
    responseModality: ResponseModality;
    contextId: string | null;
  };
  occurredAt: string;
};

export type CertifiedCoreEvidence = CoreEvidenceCandidate & {
  activity: CoreTaskSpec["activity"];
  responseModality: CoreTaskSpec["responseModality"];
  transferDistance: CoreTaskSpec["transferDistance"];
  contextTags: string[];
  calibrationBenchmarkId: string;
  modelFingerprint: string;
  authorityScope: "durable-assessment";
  grantId: string;
};

export type ReferenceCoreEvidence = CoreEvidenceCandidate & {
  activity: CoreTaskSpec["activity"];
  responseModality: CoreTaskSpec["responseModality"];
  transferDistance: CoreTaskSpec["transferDistance"];
  contextTags: string[];
  calibrationBenchmarkId: null;
  modelFingerprint: string;
  authorityScope: "repository-reference";
  grantId: null;
};

export type CoreEvidenceForRouting = CertifiedCoreEvidence | ReferenceCoreEvidence;

/** Must be resolved independently from the evaluator observation being certified as durable authority. */
export type CalibrationAuthorityGrant = ResolvedDurableCalibrationAuthority;

export type EvidenceCertificationProblem =
  | { type: "invalid-task" }
  | { type: "task-mismatch" }
  | { type: "observation-id-mismatch" }
  | { type: "target-mismatch" }
  | { type: "activity-mismatch" }
  | { type: "response-modality-mismatch" }
  | { type: "context-mismatch" }
  | { type: "support-level-mismatch" }
  | { type: "reveal-not-allowed" }
  | { type: "role-not-allowed"; role: CoreEvidenceRole }
  | { type: "observation-not-authoritative" }
  | { type: "support-invalidates-strong-evidence"; role: CoreEvidenceRole }
  | { type: "invalid-score-range" }
  | { type: "missing-calibration-benchmark" }
  | { type: "independent-authority-missing" }
  | { type: "independent-authority-not-resolved" }
  | { type: "independent-authority-not-durable" }
  | { type: "independent-authority-mismatch" }
  | { type: "reference-observation-claims-authority" }
  | { type: "invalid-envelope" };

export type EvidenceCertificationResult =
  | { ok: true; evidence: CertifiedCoreEvidence }
  | { ok: false; problems: EvidenceCertificationProblem[] };

export type ReferenceEvidenceValidationResult =
  | { ok: true; evidence: ReferenceCoreEvidence }
  | { ok: false; problems: EvidenceCertificationProblem[] };

const CERTIFIED_CORE_EVIDENCE_BRAND = Symbol("nep.certified-core-evidence");
const REFERENCE_CORE_EVIDENCE_BRAND = Symbol("nep.reference-core-evidence");

const CERTIFIED_CORE_EVIDENCE_SET = new WeakSet<object>();
const REFERENCE_CORE_EVIDENCE_SET = new WeakSet<object>();

/** Recursively freezes an object and its nested properties. */
function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.freeze(obj);
  for (const key of Object.getOwnPropertyNames(obj)) {
    const val = (obj as Record<string, unknown>)[key];
    if (val && typeof val === "object" && !Object.isFrozen(val)) {
      deepFreeze(val);
    }
  }
  return obj;
}

/**
 * Module-private trust marker. Never exported.
 * Deeply freezes evidence and marks it in the module-private WeakSet and symbol brand.
 */
function markCertifiedCoreEvidence<T extends CertifiedCoreEvidence>(evidence: T): Readonly<T> {
  Object.defineProperty(evidence, CERTIFIED_CORE_EVIDENCE_BRAND, {
    value: true,
    enumerable: false,
    configurable: false,
    writable: false,
  });
  const frozen = deepFreeze(evidence);
  CERTIFIED_CORE_EVIDENCE_SET.add(frozen);
  return frozen;
}

/**
 * Module-private trust marker. Never exported.
 * Deeply freezes evidence and marks it in the module-private WeakSet and symbol brand.
 */
function markReferenceCoreEvidence<T extends ReferenceCoreEvidence>(evidence: T): Readonly<T> {
  Object.defineProperty(evidence, REFERENCE_CORE_EVIDENCE_BRAND, {
    value: true,
    enumerable: false,
    configurable: false,
    writable: false,
  });
  const frozen = deepFreeze(evidence);
  REFERENCE_CORE_EVIDENCE_SET.add(frozen);
  return frozen;
}

export function isCertifiedCoreEvidence(val: unknown): val is CertifiedCoreEvidence {
  if (!val || typeof val !== "object" || !Object.isFrozen(val)) return false;
  return (
    CERTIFIED_CORE_EVIDENCE_SET.has(val) &&
    (val as Record<string, unknown>)[CERTIFIED_CORE_EVIDENCE_BRAND as unknown as string] === true
  );
}

export function isReferenceCoreEvidence(val: unknown): val is ReferenceCoreEvidence {
  if (!val || typeof val !== "object" || !Object.isFrozen(val)) return false;
  return (
    REFERENCE_CORE_EVIDENCE_SET.has(val) &&
    (val as Record<string, unknown>)[REFERENCE_CORE_EVIDENCE_BRAND as unknown as string] === true
  );
}

export function isCoreEvidenceForRouting(val: unknown): val is CoreEvidenceForRouting {
  return isCertifiedCoreEvidence(val) || isReferenceCoreEvidence(val);
}

const INDEPENDENT_EVIDENCE_ROLES: readonly CoreEvidenceRole[] = [
  "free-recall",
  "free-production",
  "near-transfer",
  "far-transfer",
];

/**
 * Converts a typed observation into durable evidence only when task semantics, support state and
 * the scoped calibration envelope all agree. Failure is explicit and produces no evidence.
 */
export function certifyCoreEvidence(
  task: CoreTaskSpec,
  observation: CoreObservation,
  candidate: CoreEvidenceCandidate,
  authorityGrant: ResolvedDurableCalibrationAuthority | CalibrationAuthorityGrant,
): EvidenceCertificationResult {
  const problems = validateEvidenceSemantics(task, observation, candidate);

  if (!authorityGrant) {
    problems.push({ type: "independent-authority-missing" });
  } else if (isResolvedContractAuthority(authorityGrant)) {
    problems.push({ type: "independent-authority-not-durable" });
  } else if (!isResolvedDurableCalibrationAuthority(authorityGrant)) {
    problems.push({ type: "independent-authority-not-resolved" });
  } else if (
    authorityGrant.benchmarkId !== observation.calibration.benchmarkId ||
    authorityGrant.modelFingerprint !== observation.calibration.modelFingerprint ||
    authorityGrant.authority !== observation.authority ||
    authorityGrant.decision !== observation.calibration.decision ||
    !calibrationScopesEqual(authorityGrant.scope, observation.calibration.scope)
  ) {
    problems.push({ type: "independent-authority-mismatch" });
  }
  if (!canAffectDurableAssessment(observation)) {
    problems.push({ type: "observation-not-authoritative" });
  }
  if (!observation.calibration.benchmarkId) {
    problems.push({ type: "missing-calibration-benchmark" });
  }

  if (problems.length > 0) return { ok: false, problems };

  return {
    ok: true,
    evidence: markCertifiedCoreEvidence({
      ...candidate,
      activity: task.activity,
      responseModality: task.responseModality,
      transferDistance: task.transferDistance,
      contextTags: [...task.contextTags],
      calibrationBenchmarkId: observation.calibration.benchmarkId as string,
      modelFingerprint: observation.calibration.modelFingerprint,
      authorityScope: "durable-assessment",
      grantId: authorityGrant.grantId,
    }),
  };
}

/** Validates a deterministic repository fixture without granting durable learner authority. */
export function validateReferenceCoreEvidence(
  task: CoreTaskSpec,
  observation: CoreObservation,
  candidate: CoreEvidenceCandidate,
): ReferenceEvidenceValidationResult {
  const problems = validateEvidenceSemantics(task, observation, candidate);
  if (
    observation.calibration.validationState !== "unvalidated" ||
    observation.calibration.decision !== "shadow" ||
    observation.calibration.benchmarkId !== null ||
    observation.authority !== "none"
  ) {
    problems.push({ type: "reference-observation-claims-authority" });
  }
  if (problems.length > 0) return { ok: false, problems };

  return {
    ok: true,
    evidence: markReferenceCoreEvidence({
      ...candidate,
      activity: task.activity,
      responseModality: task.responseModality,
      transferDistance: task.transferDistance,
      contextTags: [...task.contextTags],
      calibrationBenchmarkId: null,
      modelFingerprint: observation.calibration.modelFingerprint,
      authorityScope: "repository-reference",
      grantId: null,
    }),
  };
}

function validateEvidenceSemantics(
  task: CoreTaskSpec,
  observation: CoreObservation,
  candidate: CoreEvidenceCandidate,
): EvidenceCertificationProblem[] {
  const problems: EvidenceCertificationProblem[] = [];
  if (validateCoreTask(task).length > 0) problems.push({ type: "invalid-task" });
  if (candidate.taskId !== task.id) problems.push({ type: "task-mismatch" });
  if (candidate.observationId !== observation.observationId) {
    problems.push({ type: "observation-id-mismatch" });
  }
  if (!task.targetIds.includes(candidate.targetId) || observation.targetId !== candidate.targetId) {
    problems.push({ type: "target-mismatch" });
  }
  if (observation.activity !== task.activity) problems.push({ type: "activity-mismatch" });
  if (candidate.attempt.responseModality !== task.responseModality) {
    problems.push({ type: "response-modality-mismatch" });
  }
  if (candidate.attempt.contextId !== observation.contextId) {
    problems.push({ type: "context-mismatch" });
  }
  if (candidate.attempt.supportLevel !== task.support.level) {
    problems.push({ type: "support-level-mismatch" });
  }
  if (candidate.attempt.revealUsed && !task.support.revealAllowed) {
    problems.push({ type: "reveal-not-allowed" });
  }
  if (!task.allowedEvidenceRoles.includes(candidate.role)) {
    problems.push({ type: "role-not-allowed", role: candidate.role });
  }
  if (
    INDEPENDENT_EVIDENCE_ROLES.includes(candidate.role) &&
    (candidate.attempt.revealUsed || candidate.attempt.supportLevel > 0)
  ) {
    problems.push({ type: "support-invalidates-strong-evidence", role: candidate.role });
  }
  if (candidate.outcome.kind === "bounded-score") {
    const { value, min, max } = candidate.outcome;
    if (
      !Number.isFinite(value) ||
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      min >= max ||
      value < min ||
      value > max
    ) {
      problems.push({ type: "invalid-score-range" });
    }
  }
  return problems;
}

function calibrationScopesEqual(
  left: CalibrationProfile["scope"],
  right: CalibrationProfile["scope"],
): boolean {
  return (
    left.activity === right.activity &&
    left.construct === right.construct &&
    arraysEqual(left.requiredPopulationTags, right.requiredPopulationTags) &&
    arraysEqual(left.allowedNoiseClasses, right.allowedNoiseClasses) &&
    left.minimumSnrDb === right.minimumSnrDb &&
    arraysEqual(left.allowedDeviceClasses, right.allowedDeviceClasses) &&
    arraysEqual(left.allowedPromptContexts, right.allowedPromptContexts)
  );
}

function arraysEqual<T>(left: readonly T[] | undefined, right: readonly T[] | undefined): boolean {
  if (left === undefined || right === undefined) return left === right;
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

const VALID_RESPONSE_MODALITIES: ReadonlySet<string> = new Set([
  "choice",
  "text",
  "speech",
  "gesture",
  "none",
]);

export const CORE_EVIDENCE_ENVELOPE_CONTRACT = "nep.core-evidence-envelope.v1" as const;

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
  readonly contractId: typeof CORE_EVIDENCE_ENVELOPE_CONTRACT;
  readonly evidence: CoreEvidencePayload;
  readonly digest: string;
  readonly authorityScope: "durable-assessment" | "repository-reference";
  readonly sealedAt: string;
};

export function computeCanonicalEvidenceDigest(
  evidence: CoreEvidenceForRouting | CoreEvidencePayload,
): string {
  const contextTags = Array.isArray(evidence.contextTags)
    ? [...evidence.contextTags].sort()
    : [];
  const canonicalPayload = {
    eventId: evidence.eventId,
    taskId: evidence.taskId,
    targetId: evidence.targetId,
    role: evidence.role,
    observationId: evidence.observationId,
    activity: evidence.activity,
    responseModality: evidence.responseModality,
    transferDistance: evidence.transferDistance,
    contextTags,
    outcome: evidence.outcome,
    attempt: {
      supportLevel: evidence.attempt?.supportLevel ?? 0,
      revealUsed: evidence.attempt?.revealUsed ?? false,
      responseLatencyMs: evidence.attempt?.responseLatencyMs ?? null,
      responseModality: evidence.attempt?.responseModality,
      contextId: evidence.attempt?.contextId ?? null,
    },
    occurredAt: evidence.occurredAt,
    authorityScope: evidence.authorityScope,
    calibrationBenchmarkId: evidence.calibrationBenchmarkId,
    modelFingerprint: evidence.modelFingerprint,
    grantId: evidence.grantId,
  };
  return "sha256:" + crypto.createHash("sha256").update(JSON.stringify(canonicalPayload), "utf8").digest("hex");
}

export function sealCoreEvidence(
  evidence: CoreEvidenceForRouting,
  sealedAt: string,
): CoreEvidenceEnvelope {
  if (!isCoreEvidenceForRouting(evidence)) {
    throw new Error("Cannot seal evidence that is not authenticated by certified-evidence module");
  }
  if (
    typeof sealedAt !== "string" ||
    !sealedAt.trim() ||
    !Number.isFinite(Date.parse(sealedAt))
  ) {
    throw new Error("sealCoreEvidence requires an explicit valid ISO 8601 sealedAt timestamp");
  }
  const digest = computeCanonicalEvidenceDigest(evidence);
  return deepFreeze({
    contractId: CORE_EVIDENCE_ENVELOPE_CONTRACT,
    evidence,
    digest,
    authorityScope: evidence.authorityScope,
    sealedAt,
  });
}

export type ParsedCoreEvidenceEnvelopeResult =
  | {
      readonly ok: true;
      readonly envelope: Readonly<CoreEvidenceEnvelope>;
      readonly evidence: Readonly<CoreEvidencePayload>;
    }
  | {
      readonly ok: false;
      readonly error: string;
    };

export function parseCoreEvidenceEnvelope(
  raw: unknown,
): ParsedCoreEvidenceEnvelopeResult {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "Envelope must be a non-null object" };
  }
  const env = raw as Record<string, unknown>;
  if (env.contractId !== CORE_EVIDENCE_ENVELOPE_CONTRACT) {
    return { ok: false, error: `Invalid envelope contractId: ${String(env.contractId)}` };
  }
  if (
    typeof env.sealedAt !== "string" ||
    !env.sealedAt.trim() ||
    !Number.isFinite(Date.parse(env.sealedAt))
  ) {
    return { ok: false, error: "Envelope requires a valid ISO 8601 sealedAt timestamp" };
  }
  if (
    env.authorityScope !== "durable-assessment" &&
    env.authorityScope !== "repository-reference"
  ) {
    return {
      ok: false,
      error: "Envelope authorityScope must be 'durable-assessment' or 'repository-reference'",
    };
  }
  if (
    typeof env.digest !== "string" ||
    !env.digest.startsWith("sha256:") ||
    env.digest.length !== 71
  ) {
    return { ok: false, error: "Envelope requires a valid sha256: digest string" };
  }

  const ev = env.evidence as Record<string, unknown> | undefined;
  if (!ev || typeof ev !== "object" || Array.isArray(ev)) {
    return { ok: false, error: "Envelope must contain an evidence object" };
  }

  // Validate structural evidence properties
  if (typeof ev.eventId !== "string" || !ev.eventId.trim()) {
    return { ok: false, error: "Invalid eventId" };
  }
  if (typeof ev.taskId !== "string" || !ev.taskId.trim()) {
    return { ok: false, error: "Invalid taskId" };
  }
  if (typeof ev.targetId !== "string" || !ev.targetId.trim()) {
    return { ok: false, error: "Invalid targetId" };
  }
  if (typeof ev.observationId !== "string" || !ev.observationId.trim()) {
    return { ok: false, error: "Invalid observationId" };
  }
  if (
    typeof ev.occurredAt !== "string" ||
    !ev.occurredAt.trim() ||
    !Number.isFinite(Date.parse(ev.occurredAt))
  ) {
    return { ok: false, error: "Invalid occurredAt" };
  }
  if (
    typeof ev.modelFingerprint !== "string" ||
    !ev.modelFingerprint.trim() ||
    ev.modelFingerprint.trim().toLowerCase() === "unknown"
  ) {
    return { ok: false, error: "Invalid modelFingerprint" };
  }

  if (
    typeof ev.role !== "string" ||
    !CORE_EVIDENCE_ROLES.includes(ev.role as CoreEvidenceRole)
  ) {
    return { ok: false, error: `Invalid role: ${String(ev.role)}` };
  }
  if (
    typeof ev.activity !== "string" ||
    !COMMUNICATION_ACTIVITIES.includes(ev.activity as CommunicationActivity)
  ) {
    return { ok: false, error: `Invalid activity: ${String(ev.activity)}` };
  }
  if (
    typeof ev.responseModality !== "string" ||
    !VALID_RESPONSE_MODALITIES.has(ev.responseModality)
  ) {
    return { ok: false, error: `Invalid responseModality: ${String(ev.responseModality)}` };
  }
  if (
    typeof ev.transferDistance !== "string" ||
    !TRANSFER_DISTANCES.includes(ev.transferDistance as TransferDistance)
  ) {
    return { ok: false, error: `Invalid transferDistance: ${String(ev.transferDistance)}` };
  }
  if (
    !Array.isArray(ev.contextTags) ||
    !ev.contextTags.every((t) => typeof t === "string")
  ) {
    return { ok: false, error: "Invalid contextTags: must be an array of strings" };
  }

  // Check authorityScope coherence
  if (ev.authorityScope !== env.authorityScope) {
    return { ok: false, error: "Evidence authorityScope does not match envelope authorityScope" };
  }
  if (ev.authorityScope === "durable-assessment") {
    if (typeof ev.calibrationBenchmarkId !== "string" || !ev.calibrationBenchmarkId.trim()) {
      return { ok: false, error: "Durable evidence requires non-empty calibrationBenchmarkId" };
    }
    if (typeof ev.grantId !== "string" || !ev.grantId.trim()) {
      return { ok: false, error: "Durable evidence requires non-empty grantId" };
    }
  } else if (ev.authorityScope === "repository-reference") {
    if (ev.calibrationBenchmarkId !== null) {
      return { ok: false, error: "Reference evidence must have null calibrationBenchmarkId" };
    }
    if (ev.grantId !== null && ev.grantId !== undefined) {
      return { ok: false, error: "Reference evidence must have null grantId" };
    }
  }

  // Check attempt
  const attempt = ev.attempt as Record<string, unknown> | undefined;
  if (!attempt || typeof attempt !== "object" || Array.isArray(attempt)) {
    return { ok: false, error: "Invalid attempt object" };
  }
  if (
    typeof attempt.supportLevel !== "number" ||
    !Number.isInteger(attempt.supportLevel) ||
    attempt.supportLevel < 0
  ) {
    return { ok: false, error: "Invalid attempt.supportLevel" };
  }
  if (typeof attempt.revealUsed !== "boolean") {
    return { ok: false, error: "Invalid attempt.revealUsed" };
  }
  if (
    attempt.responseLatencyMs !== null &&
    (typeof attempt.responseLatencyMs !== "number" ||
      !Number.isFinite(attempt.responseLatencyMs) ||
      attempt.responseLatencyMs < 0)
  ) {
    return { ok: false, error: "Invalid attempt.responseLatencyMs" };
  }
  if (
    typeof attempt.responseModality !== "string" ||
    !VALID_RESPONSE_MODALITIES.has(attempt.responseModality)
  ) {
    return { ok: false, error: "Invalid attempt.responseModality" };
  }
  if (attempt.contextId !== null && typeof attempt.contextId !== "string") {
    return { ok: false, error: "Invalid attempt.contextId" };
  }

  // Check outcome
  const outcome = ev.outcome as Record<string, unknown> | undefined;
  if (!outcome || typeof outcome !== "object" || Array.isArray(outcome)) {
    return { ok: false, error: "Invalid outcome object" };
  }
  if (outcome.kind === "bounded-score") {
    const { value, min, max } = outcome;
    if (
      typeof value !== "number" ||
      typeof min !== "number" ||
      typeof max !== "number" ||
      !Number.isFinite(value) ||
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      min >= max ||
      value < min ||
      value > max
    ) {
      return { ok: false, error: "Invalid score range in outcome" };
    }
  } else if (outcome.kind === "binary") {
    if (typeof outcome.success !== "boolean") {
      return { ok: false, error: "Invalid binary outcome: success must be boolean" };
    }
  } else {
    return { ok: false, error: "Invalid outcome kind: must be 'binary' or 'bounded-score'" };
  }

  // Check independent roles cannot have supportLevel > 0 or revealUsed === true
  if (
    INDEPENDENT_EVIDENCE_ROLES.includes(ev.role as CoreEvidenceRole) &&
    (attempt.revealUsed === true || (attempt.supportLevel as number) > 0)
  ) {
    return { ok: false, error: "Support invalidates independent evidence role" };
  }

  // Reconstruct typed payload and verify digest
  const validatedPayload: CoreEvidencePayload = {
    eventId: ev.eventId as string,
    taskId: ev.taskId as string,
    targetId: ev.targetId as string,
    role: ev.role as CoreEvidenceRole,
    observationId: ev.observationId as string,
    activity: ev.activity as CommunicationActivity,
    responseModality: ev.responseModality as ResponseModality,
    transferDistance: ev.transferDistance as TransferDistance,
    contextTags: [...(ev.contextTags as string[])],
    outcome: outcome.kind === "binary"
      ? { kind: "binary", success: outcome.success as boolean }
      : {
          kind: "bounded-score",
          value: outcome.value as number,
          min: outcome.min as number,
          max: outcome.max as number,
        },
    attempt: {
      supportLevel: attempt.supportLevel as number,
      revealUsed: attempt.revealUsed as boolean,
      responseLatencyMs: attempt.responseLatencyMs as number | null,
      responseModality: attempt.responseModality as ResponseModality,
      contextId: (attempt.contextId as string | null) ?? null,
    },
    occurredAt: ev.occurredAt as string,
    authorityScope: ev.authorityScope as "durable-assessment" | "repository-reference",
    calibrationBenchmarkId: (ev.calibrationBenchmarkId as string | null) ?? null,
    modelFingerprint: ev.modelFingerprint as string,
    grantId: (ev.grantId as string | null) ?? null,
  };

  const expectedDigest = computeCanonicalEvidenceDigest(validatedPayload);
  if (env.digest !== expectedDigest) {
    return {
      ok: false,
      error: `Digest mismatch: expected ${expectedDigest}, got ${String(env.digest)}`,
    };
  }

  const parsedEnvelope: CoreEvidenceEnvelope = {
    contractId: CORE_EVIDENCE_ENVELOPE_CONTRACT,
    evidence: validatedPayload,
    digest: env.digest as string,
    authorityScope: env.authorityScope as "durable-assessment" | "repository-reference",
    sealedAt: env.sealedAt as string,
  };

  // Explicitly deeply freeze the unbranded envelope and unbranded payload
  deepFreeze(parsedEnvelope);

  // NOTE: Neither parsedEnvelope nor validatedPayload is marked in CERTIFIED_CORE_EVIDENCE_SET
  // or REFERENCE_CORE_EVIDENCE_SET. Detached envelopes remain unbranded transport artifacts.
  return {
    ok: true,
    envelope: parsedEnvelope,
    evidence: validatedPayload,
  };
}

/**
 * Hydrates and validates a detached repository-reference evidence envelope against authoritative task and observation specifications.
 * This performs the required in-process authentication and semantic validation step before the evidence can enter learner state.
 */
export function hydrateReferenceCoreEvidenceFromEnvelope(
  rawEnvelope: unknown,
  task: CoreTaskSpec,
  observation: CoreObservation,
): ReferenceEvidenceValidationResult {
  const parseRes = parseCoreEvidenceEnvelope(rawEnvelope);
  if (!parseRes.ok) {
    return {
      ok: false,
      problems: [{ type: "invalid-envelope" }],
    };
  }
  if (parseRes.envelope.authorityScope !== "repository-reference") {
    return {
      ok: false,
      problems: [{ type: "reference-observation-claims-authority" }],
    };
  }
  return validateReferenceCoreEvidence(task, observation, {
    eventId: parseRes.evidence.eventId,
    taskId: parseRes.evidence.taskId,
    targetId: parseRes.evidence.targetId,
    role: parseRes.evidence.role,
    observationId: parseRes.evidence.observationId,
    attempt: parseRes.evidence.attempt,
    outcome: parseRes.evidence.outcome,
    evaluatorConfidence: null,
    occurredAt: parseRes.evidence.occurredAt,
  });
}
