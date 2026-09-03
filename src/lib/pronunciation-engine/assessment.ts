import type { ProsodySummary } from "./prosody";
import type { SignalQualityEvidence } from "./signal";
import type {
  PronunciationDecision,
  UncalibratedSegmentalEvidence,
} from "./types";

export type PronunciationUncertaintyReason =
  | "signal_quality"
  | "sensor_probabilities_unavailable"
  | "weak_sensor_margin";

export type UnvalidatedPronunciationAssessment = {
  calibration: "unvalidated";
  decision: Extract<PronunciationDecision, "evidence" | "abstain">;
  signalQuality: SignalQualityEvidence;
  segmental: UncalibratedSegmentalEvidence;
  prosody: ProsodySummary | null;
  uncertainty: {
    reasons: PronunciationUncertaintyReason[];
    meanPosteriorMargin: number | null;
  };
  /**
   * Numeric learner-facing scores stay null until a human-rated calibration
   * protocol validates each aspect independently.
   */
  scores: {
    pronunciation: null;
    completeness: null;
    stress: null;
    fluency: null;
    prosody: null;
    total: null;
  };
};

export type UnvalidatedAssessmentOptions = {
  /**
   * Optional research threshold. Leave null until a sensor has calibrated
   * probabilities and a validation split establishes a useful operating point.
   */
  minPosteriorMargin?: number | null;
};

/**
 * Composes independent evidence streams without pretending they are already a
 * calibrated pronunciation score. Signal-quality failure forces abstention;
 * model uncertainty is exposed explicitly and can also trigger abstention when
 * a validated margin threshold is supplied by an experiment.
 */
export function composeUnvalidatedPronunciationAssessment(
  input: {
    signalQuality: SignalQualityEvidence;
    segmental: UncalibratedSegmentalEvidence;
    prosody?: ProsodySummary | null;
  },
  options: UnvalidatedAssessmentOptions = {},
): UnvalidatedPronunciationAssessment {
  const reasons: PronunciationUncertaintyReason[] = [];

  if (input.signalQuality.recommendAbstain) reasons.push("signal_quality");

  if (input.segmental.meanPosteriorMargin === null) {
    reasons.push("sensor_probabilities_unavailable");
  }

  const minPosteriorMargin = options.minPosteriorMargin ?? null;
  if (
    minPosteriorMargin !== null &&
    input.segmental.meanPosteriorMargin !== null &&
    input.segmental.meanPosteriorMargin < minPosteriorMargin
  ) {
    reasons.push("weak_sensor_margin");
  }

  const shouldAbstain =
    input.signalQuality.recommendAbstain ||
    reasons.includes("weak_sensor_margin");

  return {
    calibration: "unvalidated",
    decision: shouldAbstain ? "abstain" : "evidence",
    signalQuality: input.signalQuality,
    segmental: input.segmental,
    prosody: input.prosody ?? null,
    uncertainty: {
      reasons,
      meanPosteriorMargin: input.segmental.meanPosteriorMargin,
    },
    scores: {
      pronunciation: null,
      completeness: null,
      stress: null,
      fluency: null,
      prosody: null,
      total: null,
    },
  };
}
