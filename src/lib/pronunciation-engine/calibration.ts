export type CalibrationSample = {
  raw: number;
  target: number;
  weight?: number;
};

export type IsotonicCalibrationBlock = {
  minRaw: number;
  maxRaw: number;
  calibrated: number;
  weight: number;
};

export type IsotonicCalibrationModel = {
  blocks: readonly IsotonicCalibrationBlock[];
};

type MutableBlock = {
  minRaw: number;
  maxRaw: number;
  weight: number;
  weightedTargetSum: number;
};

function blockMean(block: MutableBlock) {
  return block.weightedTargetSum / block.weight;
}

function assertFinite(value: number, name: string) {
  if (!Number.isFinite(value)) {
    throw new Error(`${name}_must_be_finite`);
  }
}

/**
 * Fits a monotonic non-decreasing calibrator with the pooled-adjacent-violators
 * algorithm (PAVA). This is deliberately dependency-free so research scores
 * can be calibrated to human ratings without assuming a linear relationship.
 */
export function fitIsotonicCalibration(
  samples: readonly CalibrationSample[],
): IsotonicCalibrationModel {
  if (samples.length === 0) {
    throw new Error("calibration_samples_required");
  }

  const sorted = samples
    .map((sample) => {
      assertFinite(sample.raw, "calibration_raw");
      assertFinite(sample.target, "calibration_target");

      const weight = sample.weight ?? 1;
      assertFinite(weight, "calibration_weight");
      if (weight <= 0) throw new Error("calibration_weight_must_be_positive");

      return { ...sample, weight };
    })
    .sort((left, right) => left.raw - right.raw);

  // Group identical x-values first. A mathematical function cannot map the
  // same raw value to multiple calibrated outputs.
  const grouped: MutableBlock[] = [];

  for (const sample of sorted) {
    const previous = grouped[grouped.length - 1];

    if (previous && previous.maxRaw === sample.raw) {
      previous.weight += sample.weight;
      previous.weightedTargetSum += sample.weight * sample.target;
      continue;
    }

    grouped.push({
      minRaw: sample.raw,
      maxRaw: sample.raw,
      weight: sample.weight,
      weightedTargetSum: sample.weight * sample.target,
    });
  }

  const blocks: MutableBlock[] = [];

  for (const next of grouped) {
    blocks.push({ ...next });

    while (blocks.length >= 2) {
      const right = blocks[blocks.length - 1];
      const left = blocks[blocks.length - 2];

      if (!left || !right || blockMean(left) <= blockMean(right)) break;

      blocks.splice(blocks.length - 2, 2, {
        minRaw: left.minRaw,
        maxRaw: right.maxRaw,
        weight: left.weight + right.weight,
        weightedTargetSum:
          left.weightedTargetSum + right.weightedTargetSum,
      });
    }
  }

  return {
    blocks: blocks.map((block) => ({
      minRaw: block.minRaw,
      maxRaw: block.maxRaw,
      calibrated: blockMean(block),
      weight: block.weight,
    })),
  };
}

export function applyIsotonicCalibration(
  model: IsotonicCalibrationModel,
  raw: number,
) {
  assertFinite(raw, "calibration_raw");

  const blocks = model.blocks;
  const first = blocks[0];
  const last = blocks[blocks.length - 1];

  if (!first || !last) throw new Error("invalid_isotonic_model");
  if (raw <= first.maxRaw) return first.calibrated;
  if (raw >= last.minRaw) return last.calibrated;

  for (let index = 1; index < blocks.length; index += 1) {
    const right = blocks[index];
    const left = blocks[index - 1];
    if (!left || !right) continue;

    if (raw >= right.minRaw && raw <= right.maxRaw) {
      return right.calibrated;
    }

    if (raw > left.maxRaw && raw < right.minRaw) {
      const span = right.minRaw - left.maxRaw;
      if (span <= 0) return right.calibrated;

      const fraction = (raw - left.maxRaw) / span;
      return (
        left.calibrated + fraction * (right.calibrated - left.calibrated)
      );
    }
  }

  return last.calibrated;
}

export type ConformalCalibration = {
  miscoverage: number;
  radius: number;
  calibrationSize: number;
};

/**
 * Split-conformal absolute-residual radius. Fit this only on a calibration
 * split whose speakers are disjoint from model training and final test.
 */
export function fitConformalAbsoluteResidual(
  predictions: readonly number[],
  targets: readonly number[],
  miscoverage = 0.1,
): ConformalCalibration {
  if (predictions.length === 0 || predictions.length !== targets.length) {
    throw new Error("conformal_pairs_required");
  }

  if (!Number.isFinite(miscoverage) || miscoverage <= 0 || miscoverage >= 1) {
    throw new Error("conformal_miscoverage_must_be_between_zero_and_one");
  }

  const residuals = predictions
    .map((prediction, index) => {
      const target = targets[index];
      if (target === undefined) throw new Error("conformal_pairs_required");
      assertFinite(prediction, "conformal_prediction");
      assertFinite(target, "conformal_target");
      return Math.abs(prediction - target);
    })
    .sort((left, right) => left - right);

  const finiteSampleRank = Math.ceil(
    (residuals.length + 1) * (1 - miscoverage),
  );
  const index = Math.min(residuals.length - 1, Math.max(0, finiteSampleRank - 1));
  const radius = residuals[index];

  if (radius === undefined) throw new Error("conformal_pairs_required");

  return {
    miscoverage,
    radius,
    calibrationSize: residuals.length,
  };
}

export function conformalInterval(
  prediction: number,
  calibration: ConformalCalibration,
  bounds?: { min?: number; max?: number },
) {
  assertFinite(prediction, "conformal_prediction");
  assertFinite(calibration.radius, "conformal_radius");

  const lower = prediction - calibration.radius;
  const upper = prediction + calibration.radius;

  return {
    lower:
      bounds?.min === undefined ? lower : Math.max(bounds.min, lower),
    upper:
      bounds?.max === undefined ? upper : Math.min(bounds.max, upper),
  };
}
