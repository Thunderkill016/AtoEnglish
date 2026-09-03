import {
  validateCtcPosteriorMatrix,
  type CtcPosteriorMatrix,
} from "./ctc";

const NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;

export type CanonicalCtcForwardResult = {
  logLikelihood: number;
  extendedTarget: number[];
  minimumRequiredFrames: number;
};

function logProbability(probability: number) {
  return probability <= 0 ? NEGATIVE_INFINITY : Math.log(probability);
}

function logSumExp(values: readonly number[]) {
  let maximum = NEGATIVE_INFINITY;

  for (const value of values) {
    if (value > maximum) maximum = value;
  }

  if (maximum === NEGATIVE_INFINITY) {
    return NEGATIVE_INFINITY;
  }

  let sum = 0;

  for (const value of values) {
    if (value !== NEGATIVE_INFINITY) {
      sum += Math.exp(value - maximum);
    }
  }

  return maximum + Math.log(sum);
}

function buildExtendedTarget(
  targetTokenIds: readonly number[],
  blankTokenId: number,
) {
  const extended: number[] = [blankTokenId];

  for (const tokenId of targetTokenIds) {
    extended.push(tokenId);
    extended.push(blankTokenId);
  }

  return extended;
}

function minimumRequiredFrames(targetTokenIds: readonly number[]) {
  let frames = targetTokenIds.length;

  for (let index = 1; index < targetTokenIds.length; index += 1) {
    if (targetTokenIds[index] === targetTokenIds[index - 1]) {
      frames += 1;
    }
  }

  return frames;
}

function validateTarget(
  matrix: CtcPosteriorMatrix,
  targetTokenIds: readonly number[],
) {
  if (targetTokenIds.length === 0) {
    throw new Error("ctc_canonical_target_required");
  }

  for (const tokenId of targetTokenIds) {
    if (
      !Number.isInteger(tokenId) ||
      tokenId < 0 ||
      tokenId >= matrix.tokenLabels.length
    ) {
      throw new Error("ctc_canonical_token_out_of_range");
    }

    if (tokenId === matrix.blankTokenId) {
      throw new Error("ctc_canonical_target_cannot_contain_blank");
    }
  }

  const minimumFrames = minimumRequiredFrames(targetTokenIds);

  if (matrix.frames.length < minimumFrames) {
    throw new Error("ctc_canonical_target_requires_more_frames");
  }

  return minimumFrames;
}

/**
 * Computes log P(canonical target | acoustic frames) by summing every valid
 * CTC path instead of relying on the greedy top-1 path.
 *
 * This is research evidence only. It is not a pronunciation score.
 */
export function canonicalCtcLogLikelihood(
  matrix: CtcPosteriorMatrix,
  targetTokenIds: readonly number[],
): CanonicalCtcForwardResult {
  validateCtcPosteriorMatrix(matrix);

  const minimumFrames = validateTarget(matrix, targetTokenIds);
  const extendedTarget = buildExtendedTarget(
    targetTokenIds,
    matrix.blankTokenId,
  );

  const stateCount = extendedTarget.length;
  const firstFrame = matrix.frames[0];

  if (!firstFrame) {
    throw new Error("ctc_frames_required");
  }

  let previous = Array<number>(stateCount).fill(NEGATIVE_INFINITY);

  previous[0] = logProbability(firstFrame[matrix.blankTokenId] ?? 0);

  if (stateCount > 1) {
    const firstTargetToken = extendedTarget[1];

    if (firstTargetToken === undefined) {
      throw new Error("ctc_invalid_extended_target");
    }

    previous[1] = logProbability(firstFrame[firstTargetToken] ?? 0);
  }

  for (
    let frameIndex = 1;
    frameIndex < matrix.frames.length;
    frameIndex += 1
  ) {
    const frame = matrix.frames[frameIndex];

    if (!frame) {
      throw new Error("ctc_invalid_frame_state");
    }

    const current = Array<number>(stateCount).fill(NEGATIVE_INFINITY);

    for (let state = 0; state < stateCount; state += 1) {
      const tokenId = extendedTarget[state];

      if (tokenId === undefined) {
        throw new Error("ctc_invalid_extended_target");
      }

      const predecessors: number[] = [previous[state] ?? NEGATIVE_INFINITY];

      if (state > 0) {
        predecessors.push(previous[state - 1] ?? NEGATIVE_INFINITY);
      }

      if (
        state > 1 &&
        tokenId !== matrix.blankTokenId &&
        tokenId !== extendedTarget[state - 2]
      ) {
        predecessors.push(previous[state - 2] ?? NEGATIVE_INFINITY);
      }

      current[state] =
        logProbability(frame[tokenId] ?? 0) +
        logSumExp(predecessors);
    }

    previous = current;
  }

  const finalBlankState = stateCount - 1;
  const finalLabelState = stateCount - 2;

  const logLikelihood = logSumExp([
    previous[finalBlankState] ?? NEGATIVE_INFINITY,
    previous[finalLabelState] ?? NEGATIVE_INFINITY,
  ]);

  if (!Number.isFinite(logLikelihood)) {
    throw new Error("ctc_canonical_target_has_zero_probability_mass");
  }

  return {
    logLikelihood,
    extendedTarget,
    minimumRequiredFrames: minimumFrames,
  };
}
