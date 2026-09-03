import type {
  PronunciationAlignmentResult,
  UncalibratedSegmentalEvidence,
} from "./types";

function clampUnit(value: number) {
  return Math.min(1, Math.max(0, value));
}

/**
 * Converts an alignment into research-only segmental evidence.
 *
 * These values are intentionally not learner-facing scores. They become usable
 * for feedback only after calibration against speaker-disjoint human ratings.
 */
export function deriveUncalibratedSegmentalEvidence(
  result: PronunciationAlignmentResult,
): UncalibratedSegmentalEvidence {
  let deletionCount = 0;
  let insertionCount = 0;
  let substitutionCount = 0;
  let expectedPhoneCount = 0;
  const posteriorMargins: number[] = [];

  for (const item of result.alignment) {
    if (item.expected !== null) expectedPhoneCount += 1;

    if (item.kind === "deletion") deletionCount += 1;
    if (item.kind === "insertion") insertionCount += 1;
    if (item.kind === "substitution") substitutionCount += 1;

    if (
      item.posteriorMargin !== null &&
      Number.isFinite(item.posteriorMargin)
    ) {
      posteriorMargins.push(clampUnit(item.posteriorMargin));
    }
  }

  const retainedCanonicalPhones = Math.max(
    0,
    expectedPhoneCount - deletionCount,
  );

  const meanPosteriorMargin =
    posteriorMargins.length === 0
      ? null
      : posteriorMargins.reduce((sum, value) => sum + value, 0) /
        posteriorMargins.length;

  return {
    calibration: "unvalidated",
    selectedPronunciationId: result.pronunciationId,
    rawAccuracySignal: clampUnit(1 - result.normalizedCost),
    rawCompletenessSignal:
      expectedPhoneCount === 0
        ? 0
        : clampUnit(retainedCanonicalPhones / expectedPhoneCount),
    meanPosteriorMargin,
    deletionCount,
    insertionCount,
    substitutionCount,
    alignment: result.alignment,
  };
}
