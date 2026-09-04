import type { CommunicationActivity, CoreSourceRef } from "./domain";

export const CALIBRATION_STATES = [
  "unvalidated",
  "shadow",
  "calibrated",
  "human-validated",
] as const;

export type CalibrationState = (typeof CALIBRATION_STATES)[number];

export const OBSERVATION_AUTHORITIES = [
  "none",
  "hint-only",
  "assessment-candidate",
  "mastery-candidate",
] as const;

export type ObservationAuthority = (typeof OBSERVATION_AUTHORITIES)[number];

export type ArtifactFingerprint = {
  artifactId: string;
  version: string;
  sha256?: string;
  runtime?: string;
  configurationId?: string;
};

export type ObservationProvenance = {
  evaluator: string;
  evaluatorKind: "deterministic" | "model" | "human" | "hybrid";
  artifact?: ArtifactFingerprint;
  sources?: CoreSourceRef[];
};

/**
 * All NLP/speech/LLM outputs enter Nếp as observations first. Authority is deliberately explicit;
 * a model response cannot become mastery merely because it contains a score or high confidence.
 */
export type CoreObservation<TPayload = Record<string, unknown>> = {
  observationId: string;
  targetId: string;
  activity: CommunicationActivity;
  payload: TPayload;
  confidence: number | null;
  calibration: CalibrationState;
  authority: ObservationAuthority;
  provenance: ObservationProvenance;
  contextId: string | null;
  createdAt: string;
};

export function normalizeObservationConfidence(value: number | null | undefined): number | null {
  if (value === null || value === undefined || !Number.isFinite(value)) return null;
  return Math.min(1, Math.max(0, value));
}

export function canAffectDurableAssessment(observation: CoreObservation): boolean {
  if (observation.calibration !== "calibrated" && observation.calibration !== "human-validated") {
    return false;
  }

  return (
    observation.authority === "assessment-candidate" ||
    observation.authority === "mastery-candidate"
  );
}

export function canBecomeMasteryCandidate(observation: CoreObservation): boolean {
  return (
    observation.authority === "mastery-candidate" &&
    (observation.calibration === "calibrated" || observation.calibration === "human-validated")
  );
}
