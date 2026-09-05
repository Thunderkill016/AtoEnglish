export type BinaryLabel = 0 | 1;

export type ConfusionMatrix = {
  truePositive: number;
  trueNegative: number;
  falsePositive: number;
  falseNegative: number;
};

export type BinaryClassificationMetrics = ConfusionMatrix & {
  precision: number | null;
  recall: number | null;
  specificity: number | null;
  f1: number | null;
  matthewsCorrelationCoefficient: number | null;
  /**
   * MDD convention used here: an actually mispronounced phone is accepted as
   * correct. Equivalent to the false-negative rate when positive=mispronounced.
   */
  falseAcceptanceRate: number | null;
  /**
   * MDD convention used here: an actually correct phone is rejected as a
   * mispronunciation. Equivalent to the false-positive rate.
   */
  falseRejectionRate: number | null;
};

function assertPairedLength(left: readonly unknown[], right: readonly unknown[]) {
  if (left.length === 0 || left.length !== right.length) {
    throw new Error("paired_metric_values_required");
  }
}

function assertFiniteValues(values: readonly number[]) {
  if (values.some((value) => !Number.isFinite(value))) {
    throw new Error("metric_values_must_be_finite");
  }
}

function safeDivide(numerator: number, denominator: number) {
  return denominator === 0 ? null : numerator / denominator;
}

export function meanAbsoluteError(
  predictions: readonly number[],
  targets: readonly number[],
) {
  assertPairedLength(predictions, targets);
  assertFiniteValues(predictions);
  assertFiniteValues(targets);

  return (
    predictions.reduce(
      (sum, prediction, index) =>
        sum + Math.abs(prediction - (targets[index] as number)),
      0,
    ) / predictions.length
  );
}

export function rootMeanSquaredError(
  predictions: readonly number[],
  targets: readonly number[],
) {
  assertPairedLength(predictions, targets);
  assertFiniteValues(predictions);
  assertFiniteValues(targets);

  const mse =
    predictions.reduce((sum, prediction, index) => {
      const difference = prediction - (targets[index] as number);
      return sum + difference * difference;
    }, 0) / predictions.length;

  return Math.sqrt(mse);
}

export function pearsonCorrelation(
  left: readonly number[],
  right: readonly number[],
): number | null {
  assertPairedLength(left, right);
  assertFiniteValues(left);
  assertFiniteValues(right);

  const leftMean = left.reduce((sum, value) => sum + value, 0) / left.length;
  const rightMean = right.reduce((sum, value) => sum + value, 0) / right.length;

  let covariance = 0;
  let leftVariance = 0;
  let rightVariance = 0;

  for (let index = 0; index < left.length; index += 1) {
    const leftDelta = (left[index] as number) - leftMean;
    const rightDelta = (right[index] as number) - rightMean;
    covariance += leftDelta * rightDelta;
    leftVariance += leftDelta * leftDelta;
    rightVariance += rightDelta * rightDelta;
  }

  const denominator = Math.sqrt(leftVariance * rightVariance);
  return denominator === 0 ? null : covariance / denominator;
}

function averageRanks(values: readonly number[]) {
  const indexed = values
    .map((value, index) => ({ value, index }))
    .sort((left, right) => left.value - right.value);
  const ranks = Array<number>(values.length).fill(0);

  let cursor = 0;
  while (cursor < indexed.length) {
    let end = cursor + 1;
    while (
      end < indexed.length &&
      indexed[end]?.value === indexed[cursor]?.value
    ) {
      end += 1;
    }

    // Ranks are 1-based; tied values receive the mean rank.
    const averageRank = ((cursor + 1) + end) / 2;

    for (let index = cursor; index < end; index += 1) {
      const originalIndex = indexed[index]?.index;
      if (originalIndex !== undefined) ranks[originalIndex] = averageRank;
    }

    cursor = end;
  }

  return ranks;
}

export function spearmanCorrelation(
  left: readonly number[],
  right: readonly number[],
) {
  assertPairedLength(left, right);
  assertFiniteValues(left);
  assertFiniteValues(right);
  return pearsonCorrelation(averageRanks(left), averageRanks(right));
}

export function confusionMatrix(
  predictions: readonly BinaryLabel[],
  targets: readonly BinaryLabel[],
): ConfusionMatrix {
  assertPairedLength(predictions, targets);

  let truePositive = 0;
  let trueNegative = 0;
  let falsePositive = 0;
  let falseNegative = 0;

  for (let index = 0; index < predictions.length; index += 1) {
    const prediction = predictions[index];
    const target = targets[index];

    if (prediction === 1 && target === 1) truePositive += 1;
    else if (prediction === 0 && target === 0) trueNegative += 1;
    else if (prediction === 1 && target === 0) falsePositive += 1;
    else falseNegative += 1;
  }

  return { truePositive, trueNegative, falsePositive, falseNegative };
}

export function binaryClassificationMetrics(
  predictions: readonly BinaryLabel[],
  targets: readonly BinaryLabel[],
): BinaryClassificationMetrics {
  const matrix = confusionMatrix(predictions, targets);
  const { truePositive, trueNegative, falsePositive, falseNegative } = matrix;

  const precision = safeDivide(truePositive, truePositive + falsePositive);
  const recall = safeDivide(truePositive, truePositive + falseNegative);
  const specificity = safeDivide(trueNegative, trueNegative + falsePositive);
  const f1 =
    precision === null || recall === null || precision + recall === 0
      ? null
      : (2 * precision * recall) / (precision + recall);

  const mccDenominator = Math.sqrt(
    (truePositive + falsePositive) *
      (truePositive + falseNegative) *
      (trueNegative + falsePositive) *
      (trueNegative + falseNegative),
  );

  return {
    ...matrix,
    precision,
    recall,
    specificity,
    f1,
    matthewsCorrelationCoefficient:
      mccDenominator === 0
        ? null
        : (truePositive * trueNegative - falsePositive * falseNegative) /
          mccDenominator,
    falseAcceptanceRate: safeDivide(
      falseNegative,
      truePositive + falseNegative,
    ),
    falseRejectionRate: safeDivide(
      falsePositive,
      trueNegative + falsePositive,
    ),
  };
}

export function thresholdProbabilities(
  probabilities: readonly number[],
  threshold: number,
): BinaryLabel[] {
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
    throw new Error("classification_threshold_must_be_between_zero_and_one");
  }

  assertFiniteValues(probabilities);

  return probabilities.map((probability) => {
    if (probability < 0 || probability > 1) {
      throw new Error("probability_must_be_between_zero_and_one");
    }
    return probability >= threshold ? 1 : 0;
  });
}

export function brierScore(
  probabilities: readonly number[],
  targets: readonly BinaryLabel[],
) {
  assertPairedLength(probabilities, targets);
  assertFiniteValues(probabilities);

  return (
    probabilities.reduce((sum, probability, index) => {
      if (probability < 0 || probability > 1) {
        throw new Error("probability_must_be_between_zero_and_one");
      }
      const difference = probability - (targets[index] as BinaryLabel);
      return sum + difference * difference;
    }, 0) / probabilities.length
  );
}

export function expectedCalibrationError(
  probabilities: readonly number[],
  targets: readonly BinaryLabel[],
  binCount = 10,
) {
  assertPairedLength(probabilities, targets);
  assertFiniteValues(probabilities);

  if (!Number.isInteger(binCount) || binCount < 2 || binCount > 100) {
    throw new Error("calibration_bin_count_out_of_range");
  }

  const bins = Array.from({ length: binCount }, () => ({
    count: 0,
    confidenceSum: 0,
    targetSum: 0,
  }));

  for (let index = 0; index < probabilities.length; index += 1) {
    const probability = probabilities[index] as number;
    const target = targets[index] as BinaryLabel;

    if (probability < 0 || probability > 1) {
      throw new Error("probability_must_be_between_zero_and_one");
    }

    const binIndex = Math.min(binCount - 1, Math.floor(probability * binCount));
    const bin = bins[binIndex];
    if (!bin) continue;

    bin.count += 1;
    bin.confidenceSum += probability;
    bin.targetSum += target;
  }

  return bins.reduce((ece, bin) => {
    if (bin.count === 0) return ece;
    const meanConfidence = bin.confidenceSum / bin.count;
    const empiricalFrequency = bin.targetSum / bin.count;
    return (
      ece +
      (bin.count / probabilities.length) *
        Math.abs(meanConfidence - empiricalFrequency)
    );
  }, 0);
}

/**
 * Tie-aware ROC AUC using average ranks. Positive labels mean mispronounced.
 */
export function rocAuc(
  probabilities: readonly number[],
  targets: readonly BinaryLabel[],
): number | null {
  assertPairedLength(probabilities, targets);
  assertFiniteValues(probabilities);

  for (const probability of probabilities) {
    if (probability < 0 || probability > 1) {
      throw new Error("probability_must_be_between_zero_and_one");
    }
  }

  const positiveCount = targets.filter((target) => target === 1).length;
  const negativeCount = targets.length - positiveCount;
  if (positiveCount === 0 || negativeCount === 0) return null;

  const ranks = averageRanks(probabilities);
  const positiveRankSum = targets.reduce<number>(
    (sum, target, index) => sum + (target === 1 ? (ranks[index] as number) : 0),
    0,
  );

  const mannWhitneyU =
    positiveRankSum - (positiveCount * (positiveCount + 1)) / 2;

  return mannWhitneyU / (positiveCount * negativeCount);
}
