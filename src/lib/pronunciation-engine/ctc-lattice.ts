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

export type CanonicalCtcPhoneOccupancy = {
  /** Zero-based position in the canonical target, including repeated tokens. */
  canonicalPhonePosition: number;
  tokenId: number;
  stateIndex: number;
  expectedOccupiedFrames: number;
  expectedDurationMs: number;
  /** Earliest frame wins when posterior support is tied. */
  peakSupportFrame: number;
  peakPosterior: number;
};

export type CanonicalCtcForwardBackwardResult = CanonicalCtcForwardResult & {
  /** gamma[frame][extended-state], conditional on the complete target. */
  statePosteriors: number[][];
  /** Indexed by extended state; null denotes a blank state. */
  canonicalPhonePositionByState: (number | null)[];
  phones: CanonicalCtcPhoneOccupancy[];
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
  return forwardLattice(matrix, targetTokenIds);
}

function forwardLattice(
  matrix: CtcPosteriorMatrix,
  targetTokenIds: readonly number[],
  retainRow?: (row: number[]) => void,
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
  retainRow?.(previous);

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
    retainRow?.(current);
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

/**
 * Research-only state occupancy conditional on the supplied canonical target.
 * Alpha includes the current emission; beta excludes it. Neither gamma nor the
 * input emissions are post-hoc normalized. Occupancy is not correctness evidence:
 * even an acoustically unlikely target is conditioned to have been uttered here.
 * Timing assumes uniformly spaced frames, as in the existing CTC matrix contract.
 */
export function canonicalCtcForwardBackward(
  matrix: CtcPosteriorMatrix,
  targetTokenIds: readonly number[],
): CanonicalCtcForwardBackwardResult {
  const alpha: number[][] = [];
  const forward = forwardLattice(matrix, targetTokenIds, (row) => alpha.push(row));
  const { extendedTarget, logLikelihood } = forward;
  const stateCount = extendedTarget.length;
  const frameCount = matrix.frames.length;
  const statePosteriors: number[][] = Array(frameCount);

  let beta = Array<number>(stateCount).fill(NEGATIVE_INFINITY);
  beta[stateCount - 1] = 0;
  beta[stateCount - 2] = 0;

  for (let frameIndex = frameCount - 1; frameIndex >= 0; frameIndex -= 1) {
    statePosteriors[frameIndex] = alpha[frameIndex].map((value, state) =>
      Math.exp(value + beta[state] - logLikelihood),
    );
    if (frameIndex === 0) break;

    // Moving beta back one frame consumes this frame's destination emission.
    const frame = matrix.frames[frameIndex];
    const previousBeta = Array<number>(stateCount).fill(NEGATIVE_INFINITY);
    for (let state = 0; state < stateCount; state += 1) {
      const suffixes = [logProbability(frame[extendedTarget[state]]) + beta[state]];
      if (state + 1 < stateCount) {
        suffixes.push(logProbability(frame[extendedTarget[state + 1]]) + beta[state + 1]);
      }
      if (
        state + 2 < stateCount &&
        extendedTarget[state + 2] !== matrix.blankTokenId &&
        extendedTarget[state + 2] !== extendedTarget[state]
      ) {
        suffixes.push(logProbability(frame[extendedTarget[state + 2]]) + beta[state + 2]);
      }
      previousBeta[state] = logSumExp(suffixes);
    }
    beta = previousBeta;
  }

  const canonicalPhonePositionByState = extendedTarget.map((tokenId, state) =>
    tokenId === matrix.blankTokenId ? null : (state - 1) / 2,
  );
  const frameDurationMs = matrix.audioDurationMs / frameCount;
  const phones = targetTokenIds.map((tokenId, canonicalPhonePosition) => {
    const stateIndex = canonicalPhonePosition * 2 + 1;
    let expectedOccupiedFrames = 0;
    let peakSupportFrame = 0;
    let peakPosterior = 0;
    for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
      const posterior = statePosteriors[frameIndex][stateIndex];
      expectedOccupiedFrames += posterior;
      if (posterior > peakPosterior) {
        peakPosterior = posterior;
        peakSupportFrame = frameIndex;
      }
    }
    return {
      canonicalPhonePosition,
      tokenId,
      stateIndex,
      expectedOccupiedFrames,
      expectedDurationMs: expectedOccupiedFrames * frameDurationMs,
      peakSupportFrame,
      peakPosterior,
    };
  });

  return { ...forward, statePosteriors, canonicalPhonePositionByState, phones };
}
