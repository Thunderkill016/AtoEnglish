import type { CoreEvidenceRole } from "./evidence-role";
import type { ResponseModality } from "@/lib/learning/evidence";
import {
  canAffectDurableAssessment,
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
};

export type EvidenceCertificationProblem =
  | { type: "invalid-task" }
  | { type: "task-mismatch" }
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
  | { type: "missing-calibration-benchmark" };

export type EvidenceCertificationResult =
  | { ok: true; evidence: CertifiedCoreEvidence }
  | { ok: false; problems: EvidenceCertificationProblem[] };

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
): EvidenceCertificationResult {
  const problems: EvidenceCertificationProblem[] = [];

  if (validateCoreTask(task).length > 0) problems.push({ type: "invalid-task" });
  if (candidate.taskId !== task.id) problems.push({ type: "task-mismatch" });
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
  if (!canAffectDurableAssessment(observation)) {
    problems.push({ type: "observation-not-authoritative" });
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
  if (!observation.calibration.benchmarkId) {
    problems.push({ type: "missing-calibration-benchmark" });
  }

  if (problems.length > 0) return { ok: false, problems };

  return {
    ok: true,
    evidence: {
      ...candidate,
      activity: task.activity,
      responseModality: task.responseModality,
      transferDistance: task.transferDistance,
      contextTags: [...task.contextTags],
      calibrationBenchmarkId: observation.calibration.benchmarkId as string,
      modelFingerprint: observation.calibration.modelFingerprint,
    },
  };
}
