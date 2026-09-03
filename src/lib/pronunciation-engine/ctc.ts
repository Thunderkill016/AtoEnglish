import type { ObservedPhone, PhoneCandidate } from "./types";

export type CtcPosteriorMatrix = {
  tokenLabels: readonly string[];
  blankTokenId: number;
  frames: readonly (readonly number[])[];
  audioDurationMs: number;
  source?: string | null;
};

export type CtcPosteriorSegment = ObservedPhone & {
  tokenId: number;
  startFrame: number;
  endFrameExclusive: number;
  capturedProbabilityMass: number;
};

export type CtcCollapseOptions = {
  topK?: number;
  /** Additional token IDs to suppress from phone candidates. */
  ignoredTokenIds?: readonly number[];
};

const ROW_SUM_TOLERANCE = 1e-3;

function normalizeTokenLabel(value: string) {
  return value.normalize("NFC").trim();
}

function validateMatrix(matrix: CtcPosteriorMatrix) {
  if (matrix.tokenLabels.length < 2) {
    throw new Error("ctc_vocabulary_too_small");
  }
  if (
    !Number.isInteger(matrix.blankTokenId) ||
    matrix.blankTokenId < 0 ||
    matrix.blankTokenId >= matrix.tokenLabels.length
  ) {
    throw new Error("ctc_blank_token_out_of_range");
  }
  if (
    !Number.isFinite(matrix.audioDurationMs) ||
    matrix.audioDurationMs <= 0
  ) {
    throw new Error("ctc_audio_duration_required");
  }
  if (matrix.frames.length === 0) throw new Error("ctc_frames_required");

  for (const frame of matrix.frames) {
    if (frame.length !== matrix.tokenLabels.length) {
      throw new Error("ctc_frame_vocabulary_mismatch");
    }

    let sum = 0;
    for (const probability of frame) {
      if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
        throw new Error("ctc_probability_out_of_range");
      }
      sum += probability;
    }

    if (Math.abs(sum - 1) > ROW_SUM_TOLERANCE) {
      throw new Error("ctc_frame_must_sum_to_one");
    }
  }
}

function argmax(values: readonly number[]) {
  let bestIndex = 0;
  let bestValue = values[0] ?? -Infinity;

  for (let index = 1; index < values.length; index += 1) {
    const value = values[index] ?? -Infinity;
    if (value > bestValue) {
      bestValue = value;
      bestIndex = index;
    }
  }

  return bestIndex;
}

function isCandidateLabel(label: string) {
  return label.length > 0 && !(label.startsWith("<") && label.endsWith(">"));
}

function segmentCandidates(
  matrix: CtcPosteriorMatrix,
  startFrame: number,
  endFrameExclusive: number,
  ignoredTokenIds: ReadonlySet<number>,
  topK: number,
) {
  const frameCount = endFrameExclusive - startFrame;
  const averages = Array<number>(matrix.tokenLabels.length).fill(0);

  for (let frameIndex = startFrame; frameIndex < endFrameExclusive; frameIndex += 1) {
    const frame = matrix.frames[frameIndex] as readonly number[];
    for (let tokenId = 0; tokenId < frame.length; tokenId += 1) {
      averages[tokenId] += (frame[tokenId] ?? 0) / frameCount;
    }
  }

  const candidates: PhoneCandidate[] = averages
    .map((probability, tokenId) => ({
      tokenId,
      probability,
      phone: normalizeTokenLabel(matrix.tokenLabels[tokenId] ?? ""),
    }))
    .filter(
      (candidate) =>
        !ignoredTokenIds.has(candidate.tokenId) &&
        isCandidateLabel(candidate.phone) &&
        candidate.probability > 0,
    )
    .sort((left, right) => right.probability - left.probability)
    .slice(0, topK)
    .map(({ phone, probability }) => ({ phone, probability }));

  const capturedProbabilityMass = candidates.reduce(
    (sum, candidate) => sum + (candidate.probability ?? 0),
    0,
  );

  return { candidates, capturedProbabilityMass };
}

/**
 * Greedy CTC collapse that keeps real posterior mass for each emitted run.
 * Repeated top-1 IDs are merged until a blank/other token breaks the run. The
 * returned top-k probabilities are averages from the original softmax rows and
 * are deliberately NOT renormalized after truncation.
 *
 * This is a diagnostic bridge from a browser CTC model to the pronunciation
 * evidence engine. It is not a replacement for future canonical CTC lattice
 * alignment, which can recover evidence hidden under blank-heavy greedy paths.
 */
export function collapseCtcPosteriorSegments(
  matrix: CtcPosteriorMatrix,
  options: CtcCollapseOptions = {},
): CtcPosteriorSegment[] {
  validateMatrix(matrix);

  const topK = options.topK ?? 5;
  if (!Number.isInteger(topK) || topK < 1 || topK > 32) {
    throw new Error("ctc_top_k_out_of_range");
  }

  const ignoredTokenIds = new Set<number>([
    matrix.blankTokenId,
    ...(options.ignoredTokenIds ?? []),
  ]);
  const frameDurationMs = matrix.audioDurationMs / matrix.frames.length;
  const topIds = matrix.frames.map(argmax);
  const segments: CtcPosteriorSegment[] = [];

  let cursor = 0;
  while (cursor < topIds.length) {
    const tokenId = topIds[cursor] as number;
    let end = cursor + 1;

    while (end < topIds.length && topIds[end] === tokenId) end += 1;

    if (!ignoredTokenIds.has(tokenId)) {
      const topLabel = normalizeTokenLabel(matrix.tokenLabels[tokenId] ?? "");
      if (isCandidateLabel(topLabel)) {
        const { candidates, capturedProbabilityMass } = segmentCandidates(
          matrix,
          cursor,
          end,
          ignoredTokenIds,
          topK,
        );

        if (candidates.length > 0) {
          segments.push({
            tokenId,
            startFrame: cursor,
            endFrameExclusive: end,
            startMs: cursor * frameDurationMs,
            endMs: end * frameDurationMs,
            source: matrix.source ?? null,
            candidates,
            capturedProbabilityMass,
          });
        }
      }
    }

    cursor = end;
  }

  return segments;
}
