import { describe, expect, it } from "vitest";

import { selectOperatingThreshold } from "./operating-point";

describe("pronunciation-engine operating point", () => {
  it("finds a perfect separating validation threshold when one exists", () => {
    const result = selectOperatingThreshold(
      [0.1, 0.2, 0.8, 0.9],
      [0, 0, 1, 1],
      { objective: "mcc" },
    );

    expect(result.threshold).toBe(0.5);
    expect(result.objectiveValue).toBe(1);
    expect(result.metrics.matthewsCorrelationCoefficient).toBe(1);
    expect(result.metrics.falseAcceptanceRate).toBe(0);
    expect(result.metrics.falseRejectionRate).toBe(0);
  });

  it("moves the operating point according to asymmetric MDD error costs", () => {
    const probabilities = [0.2, 0.4, 0.6, 0.8];
    const targets = [0, 1, 0, 1] as const;

    const protectAgainstFalseAcceptance = selectOperatingThreshold(
      probabilities,
      targets,
      {
        objective: "cost",
        falseAcceptanceCost: 10,
        falseRejectionCost: 1,
      },
    );

    const protectAgainstFalseRejection = selectOperatingThreshold(
      probabilities,
      targets,
      {
        objective: "cost",
        falseAcceptanceCost: 1,
        falseRejectionCost: 10,
      },
    );

    expect(protectAgainstFalseAcceptance.threshold).toBeLessThan(
      protectAgainstFalseRejection.threshold,
    );
    expect(protectAgainstFalseAcceptance.metrics.falseAcceptanceRate).toBe(0);
    expect(protectAgainstFalseRejection.metrics.falseRejectionRate).toBe(0);
  });

  it("rejects invalid validation pairs and costs", () => {
    expect(() => selectOperatingThreshold([], [])).toThrow(
      "operating_point_pairs_required",
    );
    expect(() =>
      selectOperatingThreshold([0.5], [1], { falseAcceptanceCost: -1 }),
    ).toThrow("operating_point_costs_must_be_non_negative");
  });
});
