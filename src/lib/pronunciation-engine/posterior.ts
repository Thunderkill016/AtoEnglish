export type PhonePosteriorSequence = {
  phones: readonly string[];
  frames: readonly (readonly number[])[];
  frameDurationMs?: number | null;
};

export type PosteriorSequenceStatistics = {
  frameCount: number;
  vocabularySize: number;
  meanEntropy: number;
  normalizedMeanEntropy: number;
  meanPeakPosterior: number;
  p10PeakPosterior: number;
  meanTop2Margin: number;
  p10Top2Margin: number;
  meanTemporalVariation: number;
  maxTemporalVariation: number;
  expected: {
    phone: string;
    meanPosterior: number;
    p10Posterior: number;
    medianPosterior: number;
    p90Posterior: number;
    top1Occupancy: number;
    meanMarginToBestCompetitor: number;
  } | null;
};

const POSTERIOR_SUM_TOLERANCE = 1e-3;

function percentile(values: readonly number[], probability: number) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const bounded = Math.min(1, Math.max(0, probability));
  const position = bounded * (sorted.length - 1);
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  const lower = sorted[lowerIndex] ?? 0;
  const upper = sorted[upperIndex] ?? lower;
  return lower + (position - lowerIndex) * (upper - lower);
}

function validateVocabulary(phones: readonly string[]) {
  if (phones.length < 2) throw new Error("posterior_vocabulary_too_small");

  const normalized = phones.map((phone) => phone.trim());
  if (normalized.some((phone) => !phone)) {
    throw new Error("posterior_phone_label_required");
  }
  if (new Set(normalized).size !== normalized.length) {
    throw new Error("posterior_phone_labels_must_be_unique");
  }
}

function validateFrame(frame: readonly number[], vocabularySize: number) {
  if (frame.length !== vocabularySize) {
    throw new Error("posterior_frame_vocabulary_mismatch");
  }

  let sum = 0;
  for (const probability of frame) {
    if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
      throw new Error("posterior_probability_out_of_range");
    }
    sum += probability;
  }

  if (Math.abs(sum - 1) > POSTERIOR_SUM_TOLERANCE) {
    throw new Error("posterior_frame_must_sum_to_one");
  }
}

function entropy(frame: readonly number[]) {
  let value = 0;
  for (const probability of frame) {
    if (probability > 0) value -= probability * Math.log(probability);
  }
  return value;
}

function topTwo(frame: readonly number[]) {
  let first = -Infinity;
  let second = -Infinity;
  let firstIndex = -1;

  for (let index = 0; index < frame.length; index += 1) {
    const value = frame[index] ?? 0;
    if (value > first) {
      second = first;
      first = value;
      firstIndex = index;
    } else if (value > second) {
      second = value;
    }
  }

  return {
    first,
    second: Number.isFinite(second) ? second : 0,
    firstIndex,
  };
}

function totalVariation(
  left: readonly number[],
  right: readonly number[],
) {
  let sum = 0;
  for (let index = 0; index < left.length; index += 1) {
    sum += Math.abs((left[index] ?? 0) - (right[index] ?? 0));
  }
  return sum / 2;
}

/**
 * Converts a dense frame x vocabulary logit matrix to complete posterior rows.
 * This is deliberately separate from CTC decoding: pronunciation evidence needs
 * the distribution that a greedy transcript would otherwise discard.
 */
export function softmaxLogitMatrix(
  logits: ArrayLike<number>,
  frameCount: number,
  vocabularySize: number,
) {
  if (
    !Number.isInteger(frameCount) ||
    !Number.isInteger(vocabularySize) ||
    frameCount <= 0 ||
    vocabularySize < 2 ||
    logits.length !== frameCount * vocabularySize
  ) {
    throw new Error("invalid_logit_matrix_shape");
  }

  const rows: number[][] = [];

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    const offset = frameIndex * vocabularySize;
    let maximum = -Infinity;

    for (let phoneIndex = 0; phoneIndex < vocabularySize; phoneIndex += 1) {
      const value = logits[offset + phoneIndex];
      if (value === undefined || !Number.isFinite(value)) {
        throw new Error("logits_must_be_finite");
      }
      maximum = Math.max(maximum, value);
    }

    const exponentials = Array<number>(vocabularySize);
    let denominator = 0;

    for (let phoneIndex = 0; phoneIndex < vocabularySize; phoneIndex += 1) {
      const value = logits[offset + phoneIndex] as number;
      const exponential = Math.exp(value - maximum);
      exponentials[phoneIndex] = exponential;
      denominator += exponential;
    }

    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Error("invalid_softmax_denominator");
    }

    rows.push(exponentials.map((value) => value / denominator));
  }

  return rows;
}

/**
 * Extracts distribution-shape and temporal-stability evidence from complete
 * phone posterior sequences. These are research features, not learner scores.
 * They are intended to preserve information highlighted by logit/GOP research
 * that is lost when a sensor returns only a top-1 phone string.
 */
export function summarizePhonePosteriorSequence(
  sequence: PhonePosteriorSequence,
  expectedPhone?: string | null,
): PosteriorSequenceStatistics {
  validateVocabulary(sequence.phones);
  if (sequence.frames.length === 0) {
    throw new Error("posterior_frames_required");
  }

  for (const frame of sequence.frames) {
    validateFrame(frame, sequence.phones.length);
  }

  const entropies: number[] = [];
  const peaks: number[] = [];
  const top2Margins: number[] = [];
  const top1Indices: number[] = [];
  const temporalVariations: number[] = [];

  for (let frameIndex = 0; frameIndex < sequence.frames.length; frameIndex += 1) {
    const frame = sequence.frames[frameIndex] as readonly number[];
    const { first, second, firstIndex } = topTwo(frame);
    entropies.push(entropy(frame));
    peaks.push(first);
    top2Margins.push(first - second);
    top1Indices.push(firstIndex);

    if (frameIndex > 0) {
      temporalVariations.push(
        totalVariation(
          sequence.frames[frameIndex - 1] as readonly number[],
          frame,
        ),
      );
    }
  }

  const expectedIndex = expectedPhone
    ? sequence.phones.indexOf(expectedPhone)
    : -1;

  let expected: PosteriorSequenceStatistics["expected"] = null;
  if (expectedPhone && expectedIndex >= 0) {
    const expectedPosteriors: number[] = [];
    const expectedMargins: number[] = [];
    let top1Count = 0;

    for (let frameIndex = 0; frameIndex < sequence.frames.length; frameIndex += 1) {
      const frame = sequence.frames[frameIndex] as readonly number[];
      const expectedPosterior = frame[expectedIndex] ?? 0;
      let bestCompetitor = 0;

      for (let phoneIndex = 0; phoneIndex < frame.length; phoneIndex += 1) {
        if (phoneIndex === expectedIndex) continue;
        bestCompetitor = Math.max(bestCompetitor, frame[phoneIndex] ?? 0);
      }

      expectedPosteriors.push(expectedPosterior);
      expectedMargins.push(expectedPosterior - bestCompetitor);
      if (top1Indices[frameIndex] === expectedIndex) top1Count += 1;
    }

    expected = {
      phone: expectedPhone,
      meanPosterior:
        expectedPosteriors.reduce((sum, value) => sum + value, 0) /
        expectedPosteriors.length,
      p10Posterior: percentile(expectedPosteriors, 0.1),
      medianPosterior: percentile(expectedPosteriors, 0.5),
      p90Posterior: percentile(expectedPosteriors, 0.9),
      top1Occupancy: top1Count / sequence.frames.length,
      meanMarginToBestCompetitor:
        expectedMargins.reduce((sum, value) => sum + value, 0) /
        expectedMargins.length,
    };
  }

  const meanEntropy =
    entropies.reduce((sum, value) => sum + value, 0) / entropies.length;
  const maxEntropy = Math.log(sequence.phones.length);

  return {
    frameCount: sequence.frames.length,
    vocabularySize: sequence.phones.length,
    meanEntropy,
    normalizedMeanEntropy: maxEntropy > 0 ? meanEntropy / maxEntropy : 0,
    meanPeakPosterior:
      peaks.reduce((sum, value) => sum + value, 0) / peaks.length,
    p10PeakPosterior: percentile(peaks, 0.1),
    meanTop2Margin:
      top2Margins.reduce((sum, value) => sum + value, 0) /
      top2Margins.length,
    p10Top2Margin: percentile(top2Margins, 0.1),
    meanTemporalVariation:
      temporalVariations.length === 0
        ? 0
        : temporalVariations.reduce((sum, value) => sum + value, 0) /
          temporalVariations.length,
    maxTemporalVariation:
      temporalVariations.length === 0 ? 0 : Math.max(...temporalVariations),
    expected,
  };
}
