import {
  binaryClassificationMetrics,
  thresholdProbabilities,
  type BinaryClassificationMetrics,
  type BinaryLabel,
} from "./metrics";

export type OperatingPointObjective =
  | "mcc"
  | "f1"
  | "balanced_error"
  | "cost";

export type OperatingPointOptions = {
  objective?: OperatingPointObjective;
  falseAcceptanceCost?: number;
  falseRejectionCost?: number;
};

export type OperatingPoint = {
  threshold: number;
  objective: OperatingPointObjective;
  objectiveValue: number;
  metrics: BinaryClassificationMetrics;
};

type OperatingPointCosts = {
  falseAcceptanceCost: number;
  falseRejectionCost: number;
};

function candidateThresholds(probabilities: readonly number[]) {
  const unique = [...new Set(probabilities)].sort((left, right) => left - right);
  const candidates = new Set<number>([0, 1]);

  for (const value of unique) {
    candidates.add(value);
  }

  for (let index = 1; index < unique.length; index += 1) {
    const left = unique[index - 1];
    const right = unique[index];
    if (left !== undefined && right !== undefined) {
      candidates.add((left + right) / 2);
    }
  }

  return [...candidates].sort((left, right) => left - right);
}

function finiteMetric(value: number | null, fallback: number) {
  return value === null || !Number.isFinite(value) ? fallback : value;
}

function objectiveValue(
  metrics: BinaryClassificationMetrics,
  objective: OperatingPointObjective,
  costs: OperatingPointCosts,
) {
  switch (objective) {
    case "mcc":
      return finiteMetric(metrics.matthewsCorrelationCoefficient, -1);
    case "f1":
      return finiteMetric(metrics.f1, 0);
    case "balanced_error": {
      const far = finiteMetric(metrics.falseAcceptanceRate, 1);
      const frr = finiteMetric(metrics.falseRejectionRate, 1);
      return -((far + frr) / 2);
    }
    case "cost": {
      const far = finiteMetric(metrics.falseAcceptanceRate, 1);
      const frr = finiteMetric(metrics.falseRejectionRate, 1);
      return -(
        costs.falseAcceptanceCost * far + costs.falseRejectionCost * frr
      );
    }
  }
}

function secondaryError(metrics: BinaryClassificationMetrics) {
  return (
    finiteMetric(metrics.falseAcceptanceRate, 1) +
    finiteMetric(metrics.falseRejectionRate, 1)
  );
}

/**
 * Selects an MDD operating point on validation/calibration data only.
 * Positive=mispronounced. The returned threshold must be frozen before final
 * test evaluation; this utility should never be run against the held-out test
 * split to improve reported metrics.
 */
export function selectOperatingThreshold(
  probabilities: readonly number[],
  targets: readonly BinaryLabel[],
  options: OperatingPointOptions = {},
): OperatingPoint {
  if (probabilities.length === 0 || probabilities.length !== targets.length) {
    throw new Error("operating_point_pairs_required");
  }

  const objective = options.objective ?? "mcc";
  const falseAcceptanceCost = options.falseAcceptanceCost ?? 1;
  const falseRejectionCost = options.falseRejectionCost ?? 1;

  if (
    !Number.isFinite(falseAcceptanceCost) ||
    !Number.isFinite(falseRejectionCost) ||
    falseAcceptanceCost < 0 ||
    falseRejectionCost < 0
  ) {
    throw new Error("operating_point_costs_must_be_non_negative");
  }

  let best: OperatingPoint | null = null;

  for (const threshold of candidateThresholds(probabilities)) {
    const predictions = thresholdProbabilities(probabilities, threshold);
    const metrics = binaryClassificationMetrics(predictions, targets);
    const value = objectiveValue(metrics, objective, {
      falseAcceptanceCost,
      falseRejectionCost,
    });
    const candidate: OperatingPoint = {
      threshold,
      objective,
      objectiveValue: value,
      metrics,
    };

    if (!best || candidate.objectiveValue > best.objectiveValue + 1e-12) {
      best = candidate;
      continue;
    }

    if (Math.abs(candidate.objectiveValue - best.objectiveValue) <= 1e-12) {
      const candidateError = secondaryError(candidate.metrics);
      const bestError = secondaryError(best.metrics);

      if (
        candidateError < bestError - 1e-12 ||
        (Math.abs(candidateError - bestError) <= 1e-12 &&
          Math.abs(candidate.threshold - 0.5) <
            Math.abs(best.threshold - 0.5))
      ) {
        best = candidate;
      }
    }
  }

  if (!best) throw new Error("operating_point_pairs_required");
  return best;
}
