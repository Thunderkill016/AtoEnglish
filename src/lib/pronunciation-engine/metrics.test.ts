import { describe, expect, it } from "vitest";

import {
  binaryClassificationMetrics,
  brierScore,
  expectedCalibrationError,
  meanAbsoluteError,
  pearsonCorrelation,
  rocAuc,
  rootMeanSquaredError,
  spearmanCorrelation,
  thresholdProbabilities,
} from "./metrics";

describe("pronunciation-engine research metrics", () => {
  it("computes regression errors and correlations", () => {
    expect(meanAbsoluteError([1, 2, 3], [1, 1, 5])).toBeCloseTo(1);
    expect(rootMeanSquaredError([1, 2, 3], [1, 1, 5])).toBeCloseTo(
      Math.sqrt(5 / 3),
    );
    expect(pearsonCorrelation([1, 2, 3], [2, 4, 6])).toBeCloseTo(1);
    expect(spearmanCorrelation([10, 20, 20, 40], [1, 2, 2, 4])).toBeCloseTo(1);
  });

  it("returns null correlation when variance is undefined", () => {
    expect(pearsonCorrelation([1, 1], [1, 2])).toBeNull();
  });

  it("reports MDD false acceptance and false rejection explicitly", () => {
    const metrics = binaryClassificationMetrics([1, 1, 0, 0], [1, 0, 1, 0]);

    expect(metrics).toMatchObject({
      truePositive: 1,
      trueNegative: 1,
      falsePositive: 1,
      falseNegative: 1,
      precision: 0.5,
      recall: 0.5,
      specificity: 0.5,
      f1: 0.5,
      matthewsCorrelationCoefficient: 0,
      falseAcceptanceRate: 0.5,
      falseRejectionRate: 0.5,
    });
  });

  it("thresholds calibrated mispronunciation probabilities", () => {
    expect(thresholdProbabilities([0.1, 0.49, 0.5, 0.9], 0.5)).toEqual([
      0, 0, 1, 1,
    ]);
  });

  it("computes probability calibration metrics", () => {
    expect(brierScore([0.1, 0.9], [0, 1])).toBeCloseTo(0.01);
    expect(expectedCalibrationError([0.1, 0.9], [0, 1], 2)).toBeCloseTo(
      0.1,
    );
  });

  it("computes tie-aware ROC AUC", () => {
    expect(rocAuc([0.1, 0.9], [0, 1])).toBe(1);
    expect(rocAuc([0.5, 0.5], [0, 1])).toBe(0.5);
    expect(rocAuc([0.1, 0.2], [0, 0])).toBeNull();
  });

  it("rejects invalid probabilities and thresholds", () => {
    expect(() => thresholdProbabilities([0.5], 1.1)).toThrow(
      "classification_threshold_must_be_between_zero_and_one",
    );
    expect(() => brierScore([1.2], [1])).toThrow(
      "probability_must_be_between_zero_and_one",
    );
  });
});
