import type { EvidenceType, LearnerSkillState } from "./evidence";

export const LEARNER_STATE_MODEL_VERSION = "ema-routing-v1" as const;

export type LearnerDimensionRead = {
  estimate: number | null;
  evidenceCount: number;
  status: "unknown" | "observed";
  /** Not calibrated yet. Keep null rather than inventing probability-like certainty. */
  confidence: null;
  modelVersion: typeof LEARNER_STATE_MODEL_VERSION;
  decisionScope: "routing";
};

/**
 * Read one learner dimension without confusing an unobserved default zero with observed weakness.
 *
 * New planner reads attach per-type evidence coverage from append-only evidence history. The
 * fallback preserves compatibility for older in-memory callers that only know total evidence.
 */
export function readLearnerDimension(
  state: LearnerSkillState,
  evidenceType: EvidenceType,
): LearnerDimensionRead {
  const typedCoverage = state.evidenceByType;
  const rawValue = clamp01(state[evidenceType]);

  let evidenceCount = 0;
  if (typedCoverage) {
    evidenceCount = normalizeCount(typedCoverage[evidenceType]);
  } else if (rawValue > 0) {
    // When typed coverage is absent, only an explicit positive score proves prior observation.
    // A default zero must fail closed to unknown, not borrow total evidence from other dimensions.
    evidenceCount = Math.max(1, state.evidenceCount);
  }

  if (evidenceCount === 0) {
    return {
      estimate: null,
      evidenceCount: 0,
      status: "unknown",
      confidence: null,
      modelVersion: LEARNER_STATE_MODEL_VERSION,
      decisionScope: "routing",
    };
  }

  return {
    estimate: clamp01(state[evidenceType]),
    evidenceCount,
    status: "observed",
    confidence: null,
    modelVersion: LEARNER_STATE_MODEL_VERSION,
    decisionScope: "routing",
  };
}

export function hasObservedLearnerDimension(
  state: LearnerSkillState,
  evidenceType: EvidenceType,
) {
  return readLearnerDimension(state, evidenceType).status === "observed";
}

function normalizeCount(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}
