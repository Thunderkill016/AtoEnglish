import crypto from "node:crypto";
import type { CoreEvidenceRole } from "./evidence-role";
import type { ResponseModality } from "@/lib/learning/evidence";
import {
  type ResolvedDurableCalibrationAuthority,
  isResolvedDurableCalibrationAuthority,
  isResolvedContractAuthority,
} from "./authority-registry";
import {
  canAffectDurableAssessment,
  type CalibrationProfile,
  type CoreObservation,
} from "./observation";
import { validateCoreTask, type CoreTaskSpec } from "./task";

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
  | { type: "reference-observation-claims-authority" };

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

export function markCertifiedCoreEvidence<T extends CertifiedCoreEvidence>(evidence: T): T {
  CERTIFIED_CORE_EVIDENCE_SET.add(evidence);
  Object.defineProperty(evidence, CERTIFIED_CORE_EVIDENCE_BRAND, {
    value: true,
    enumerable: false,
    configurable: false,
    writable: false,
  });
  return evidence;
}

export function markReferenceCoreEvidence<T extends ReferenceCoreEvidence>(evidence: T): T {
  REFERENCE_CORE_EVIDENCE_SET.add(evidence);
  Object.defineProperty(evidence, REFERENCE_CORE_EVIDENCE_BRAND, {
    value: true,
    enumerable: false,
    configurable: false,
    writable: false,
  });
  return evidence;
}

export function isCertifiedCoreEvidence(val: unknown): val is CertifiedCoreEvidence {
  if (!val || typeof val !== "object") return false;
  return (
    CERTIFIED_CORE_EVIDENCE_SET.has(val) ||
    (val as Record<string, unknown>)[CERTIFIED_CORE_EVIDENCE_BRAND as unknown as string] === true
  );
}

export function isReferenceCoreEvidence(val: unknown): val is ReferenceCoreEvidence {
  if (!val || typeof val !== "object") return false;
  return (
    REFERENCE_CORE_EVIDENCE_SET.has(val) ||
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

export const CORE_EVIDENCE_ENVELOPE_CONTRACT = "nep.core-evidence-envelope.v1" as const;

export type CoreEvidenceEnvelope = {
  readonly contractId: typeof CORE_EVIDENCE_ENVELOPE_CONTRACT;
  readonly evidence: CoreEvidenceForRouting;
  readonly digest: string;
  readonly authorityScope: "durable-assessment" | "repository-reference";
  readonly sealedAt: string;
};

export function computeCanonicalEvidenceDigest(evidence: CoreEvidenceForRouting): string {
  const canonicalPayload = {
    eventId: evidence.eventId,
    taskId: evidence.taskId,
    targetId: evidence.targetId,
    role: evidence.role,
    observationId: evidence.observationId,
    activity: evidence.activity,
    responseModality: evidence.responseModality,
    transferDistance: evidence.transferDistance,
    contextTags: [...evidence.contextTags].sort(),
    outcome: evidence.outcome,
    attempt: {
      supportLevel: evidence.attempt.supportLevel,
      revealUsed: evidence.attempt.revealUsed,
      responseLatencyMs: evidence.attempt.responseLatencyMs,
      responseModality: evidence.attempt.responseModality,
      contextId: evidence.attempt.contextId,
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
  sealedAt = new Date().toISOString()
): CoreEvidenceEnvelope {
  if (!isCoreEvidenceForRouting(evidence)) {
    throw new Error("Cannot seal evidence that is not authenticated by certified-evidence module");
  }
  const digest = computeCanonicalEvidenceDigest(evidence);
  return Object.freeze({
    contractId: CORE_EVIDENCE_ENVELOPE_CONTRACT,
    evidence,
    digest,
    authorityScope: evidence.authorityScope,
    sealedAt,
  });
}

export function parseCoreEvidenceEnvelope(
  raw: unknown
): { ok: true; evidence: CoreEvidenceForRouting } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "Envelope must be a non-null object" };
  }
  const env = raw as Record<string, unknown>;
  if (env.contractId !== CORE_EVIDENCE_ENVELOPE_CONTRACT) {
    return { ok: false, error: `Invalid envelope contractId: ${String(env.contractId)}` };
  }
  const ev = env.evidence as CoreEvidenceForRouting | undefined;
  if (!ev || typeof ev !== "object" || Array.isArray(ev)) {
    return { ok: false, error: "Envelope must contain evidence object" };
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
  if (typeof ev.occurredAt !== "string" || !ev.occurredAt.trim()) {
    return { ok: false, error: "Invalid occurredAt" };
  }
  if (
    typeof ev.modelFingerprint !== "string" ||
    !ev.modelFingerprint.trim() ||
    ev.modelFingerprint.trim().toLowerCase() === "unknown"
  ) {
    return { ok: false, error: "Invalid modelFingerprint" };
  }

  // Check outcome
  if (!ev.outcome || typeof ev.outcome !== "object") {
    return { ok: false, error: "Invalid outcome" };
  }
  if (ev.outcome.kind === "bounded-score") {
    const { value, min, max } = ev.outcome;
    if (
      !Number.isFinite(value) ||
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      min >= max ||
      value < min ||
      value > max
    ) {
      return { ok: false, error: "Invalid score range" };
    }
  } else if (ev.outcome.kind !== "binary" || typeof ev.outcome.success !== "boolean") {
    return { ok: false, error: "Invalid binary outcome" };
  }

  // Check attempt
  if (!ev.attempt || typeof ev.attempt !== "object") {
    return { ok: false, error: "Invalid attempt" };
  }

  // Check independent roles cannot have supportLevel > 0 or revealUsed === true
  if (
    INDEPENDENT_EVIDENCE_ROLES.includes(ev.role) &&
    (ev.attempt.revealUsed || ev.attempt.supportLevel > 0)
  ) {
    return { ok: false, error: "Support invalidates independent evidence role" };
  }

  // Check authorityScope
  if (ev.authorityScope === "durable-assessment") {
    if (typeof ev.calibrationBenchmarkId !== "string" || !ev.calibrationBenchmarkId.trim()) {
      return { ok: false, error: "Durable evidence requires calibrationBenchmarkId" };
    }
    if (typeof ev.grantId !== "string" || !ev.grantId.trim()) {
      return { ok: false, error: "Durable evidence requires grantId" };
    }
  } else if (ev.authorityScope === "repository-reference") {
    if (ev.calibrationBenchmarkId !== null) {
      return { ok: false, error: "Reference evidence must have null calibrationBenchmarkId" };
    }
    if ((ev as { grantId?: unknown }).grantId !== null && (ev as { grantId?: unknown }).grantId !== undefined) {
      return { ok: false, error: "Reference evidence must have null grantId" };
    }
  } else {
    return { ok: false, error: "Invalid authorityScope" };
  }

  // Verify digest
  const expectedDigest = computeCanonicalEvidenceDigest(ev);
  if (env.digest !== expectedDigest) {
    return { ok: false, error: `Digest mismatch: expected ${expectedDigest}, got ${String(env.digest)}` };
  }

  // Mark in appropriate WeakSet
  if (ev.authorityScope === "durable-assessment") {
    markCertifiedCoreEvidence(ev as CertifiedCoreEvidence);
  } else {
    markReferenceCoreEvidence(ev as ReferenceCoreEvidence);
  }

  return { ok: true, evidence: ev };
}
