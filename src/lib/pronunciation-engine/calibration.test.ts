import { describe, expect, it } from "vitest";

import {
  applyIsotonicCalibration,
  conformalInterval,
  fitConformalAbsoluteResidual,
  fitIsotonicCalibration,
} from "./calibration";

describe("pronunciation-engine calibration", () => {
  it("pools adjacent monotonicity violations with PAVA", () => {
    const model = fitIsotonicCalibration([
      { raw: 0, target: 0 },
      { raw: 1, target: 1 },
      { raw: 2, target: 0 },
    ]);

    expect(model.blocks).toEqual([
      { minRaw: 0, maxRaw: 0, calibrated: 0, weight: 1 },
      { minRaw: 1, maxRaw: 2, calibrated: 0.5, weight: 2 },
    ]);
  });

  it("groups identical raw values before fitting", () => {
    const model = fitIsotonicCalibration([
      { raw: 0.5, target: 0.2 },
      { raw: 0.5, target: 0.6 },
      { raw: 0.9, target: 0.8 },
    ]);

    expect(model.blocks[0]).toMatchObject({
      minRaw: 0.5,
      maxRaw: 0.5,
      calibrated: 0.4,
      weight: 2,
    });
  });

  it("interpolates between monotonic calibration blocks", () => {
    const model = fitIsotonicCalibration([
      { raw: 0, target: 0.1 },
      { raw: 1, target: 0.9 },
    ]);

    expect(applyIsotonicCalibration(model, -1)).toBeCloseTo(0.1);
    expect(applyIsotonicCalibration(model, 0.5)).toBeCloseTo(0.5);
    expect(applyIsotonicCalibration(model, 2)).toBeCloseTo(0.9);
  });

  it("uses the finite-sample conformal quantile", () => {
    const calibration = fitConformalAbsoluteResidual(
      [0, 0, 0, 0],
      [0, 1, 2, 3],
      0.25,
    );

    expect(calibration).toEqual({
      miscoverage: 0.25,
      radius: 3,
      calibrationSize: 4,
    });

    expect(conformalInterval(5, calibration)).toEqual({ lower: 2, upper: 8 });
    expect(
      conformalInterval(5, calibration, { min: 0, max: 6 }),
    ).toEqual({ lower: 2, upper: 6 });
  });

  it("rejects invalid calibration inputs instead of fabricating output", () => {
    expect(() => fitIsotonicCalibration([])).toThrow(
      "calibration_samples_required",
    );
    expect(() =>
      fitConformalAbsoluteResidual([0.1], [0.2], 0),
    ).toThrow("conformal_miscoverage_must_be_between_zero_and_one");
  });
});
