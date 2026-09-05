import {
  binaryClassificationMetrics,
  brierScore,
  expectedCalibrationError,
  rocAuc,
  thresholdProbabilities,
  type BinaryClassificationMetrics,
  type BinaryLabel,
} from "./metrics";
import {
  selectOperatingThreshold,
  type OperatingPoint,
  type OperatingPointOptions,
} from "./operating-point";

export type PronunciationBenchmarkSplit = "train" | "validation" | "test";

export type PronunciationSensorBenchmarkExample = {
  id: string;
  speakerId: string;
  split: PronunciationBenchmarkSplit;
  expectedPhone: string;
  /** Positive means the human reference labels this phone as mispronounced. */
  target: BinaryLabel;
  /** Null means the sensor abstained or did not expose calibrated probability. */
  mispronunciationProbability: number | null;
  /** Human-perceived realized phone when diagnosis labels are available. */
  referenceObservedPhone?: string | null;
  /** Sensor diagnosis; null means no diagnosis was emitted. */
  predictedObservedPhone?: string | null;
  /** Optional L1 label for subgroup auditing, e.g. "vi". */
  l1?: string | null;
};

export type PronunciationSensorBenchmarkSummary = {
  split: PronunciationBenchmarkSplit;
  threshold: number;
  total: number;
  scored: number;
  abstained: number;
  coverage: number;
  abstentionRateCorrect: number | null;
  abstentionRateMispronounced: number | null;
  classification: BinaryClassificationMetrics | null;
  probabilityQuality: {
    brier: number | null;
    expectedCalibrationError: number | null;
    rocAuc: number | null;
  };
  diagnosis: {
    eligible: number;
    emitted: number;
    correct: number;
    coverage: number | null;
    accuracyWhenEmitted: number | null;
    endToEndAccuracy: number | null;
  };
  byExpectedPhone: Record<
    string,
    {
      total: number;
      scored: number;
      coverage: number;
      classification: BinaryClassificationMetrics | null;
    }
  >;
  byL1: Record<
    string,
    {
      total: number;
      scored: number;
      coverage: number;
      classification: BinaryClassificationMetrics | null;
    }
  >;
};

function safeDivide(numerator: number, denominator: number) {
  return denominator === 0 ? null : numerator / denominator;
}

function validateProbability(probability: number | null) {
  if (
    probability !== null &&
    (!Number.isFinite(probability) || probability < 0 || probability > 1)
  ) {
    throw new Error("benchmark_probability_out_of_range");
  }
}

function normalizeLabel(value: string | null | undefined) {
  const normalized = value?.normalize("NFC").trim();
  return normalized ? normalized : null;
}

/**
 * Prevents speaker leakage, a common source of inflated speech-model results.
 * One speaker may contribute many utterances, but only to exactly one split.
 */
export function assertSpeakerDisjointBenchmark(
  examples: readonly PronunciationSensorBenchmarkExample[],
) {
  if (examples.length === 0) throw new Error("benchmark_examples_required");

  const ids = new Set<string>();
  const speakerSplit = new Map<string, PronunciationBenchmarkSplit>();

  for (const example of examples) {
    const id = example.id.trim();
    const speakerId = example.speakerId.trim();
    const expectedPhone = example.expectedPhone.trim();

    if (!id || !speakerId || !expectedPhone) {
      throw new Error("benchmark_identity_fields_required");
    }
    if (ids.has(id)) throw new Error("benchmark_example_ids_must_be_unique");
    ids.add(id);

    validateProbability(example.mispronunciationProbability);

    const previousSplit = speakerSplit.get(speakerId);
    if (previousSplit && previousSplit !== example.split) {
      throw new Error("benchmark_speaker_split_leakage");
    }
    speakerSplit.set(speakerId, example.split);
  }
}

function scoredExamples(
  examples: readonly PronunciationSensorBenchmarkExample[],
) {
  return examples.filter(
    (example): example is PronunciationSensorBenchmarkExample & {
      mispronunciationProbability: number;
    } => example.mispronunciationProbability !== null,
  );
}

/**
 * Tunes an operating point only on the validation split. The resulting
 * threshold must be frozen before held-out test evaluation.
 */
export function fitValidationOperatingPoint(
  examples: readonly PronunciationSensorBenchmarkExample[],
  options: OperatingPointOptions = {},
): OperatingPoint {
  assertSpeakerDisjointBenchmark(examples);
  const validation = scoredExamples(
    examples.filter((example) => example.split === "validation"),
  );

  if (validation.length === 0) {
    throw new Error("benchmark_validation_probabilities_required");
  }

  return selectOperatingThreshold(
    validation.map((example) => example.mispronunciationProbability),
    validation.map((example) => example.target),
    options,
  );
}

function classificationForGroup(
  examples: readonly PronunciationSensorBenchmarkExample[],
  threshold: number,
) {
  const scored = scoredExamples(examples);
  if (scored.length === 0) return null;

  const probabilities = scored.map(
    (example) => example.mispronunciationProbability,
  );
  const targets = scored.map((example) => example.target);
  const predictions = thresholdProbabilities(probabilities, threshold);
  return binaryClassificationMetrics(predictions, targets);
}

function subgroupSummary(
  examples: readonly PronunciationSensorBenchmarkExample[],
  threshold: number,
  key: (example: PronunciationSensorBenchmarkExample) => string | null,
) {
  const groups = new Map<string, PronunciationSensorBenchmarkExample[]>();

  for (const example of examples) {
    const groupKey = key(example);
    if (!groupKey) continue;
    const group = groups.get(groupKey) ?? [];
    group.push(example);
    groups.set(groupKey, group);
  }

  return Object.fromEntries(
    [...groups.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([groupKey, group]) => {
        const scored = scoredExamples(group);
        return [
          groupKey,
          {
            total: group.length,
            scored: scored.length,
            coverage: group.length === 0 ? 0 : scored.length / group.length,
            classification: classificationForGroup(group, threshold),
          },
        ];
      }),
  );
}

/**
 * Evaluates one frozen operating point on a named split. This function never
 * searches thresholds, protecting the held-out test set from silent tuning.
 */
export function evaluatePronunciationSensorBenchmark(
  examples: readonly PronunciationSensorBenchmarkExample[],
  threshold: number,
  split: PronunciationBenchmarkSplit = "test",
): PronunciationSensorBenchmarkSummary {
  assertSpeakerDisjointBenchmark(examples);
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
    throw new Error("benchmark_threshold_out_of_range");
  }

  const selected = examples.filter((example) => example.split === split);
  if (selected.length === 0) throw new Error("benchmark_split_examples_required");

  const scored = scoredExamples(selected);
  const abstained = selected.length - scored.length;
  const correct = selected.filter((example) => example.target === 0);
  const mispronounced = selected.filter((example) => example.target === 1);
  const correctAbstained = correct.filter(
    (example) => example.mispronunciationProbability === null,
  ).length;
  const mispronouncedAbstained = mispronounced.filter(
    (example) => example.mispronunciationProbability === null,
  ).length;

  const probabilities = scored.map(
    (example) => example.mispronunciationProbability,
  );
  const targets = scored.map((example) => example.target);

  const diagnosisEligible = selected.filter(
    (example) =>
      example.target === 1 && normalizeLabel(example.referenceObservedPhone),
  );
  let diagnosisEmitted = 0;
  let diagnosisCorrect = 0;

  for (const example of diagnosisEligible) {
    const reference = normalizeLabel(example.referenceObservedPhone);
    const predicted = normalizeLabel(example.predictedObservedPhone);
    if (!predicted) continue;
    diagnosisEmitted += 1;
    if (predicted === reference) diagnosisCorrect += 1;
  }

  return {
    split,
    threshold,
    total: selected.length,
    scored: scored.length,
    abstained,
    coverage: scored.length / selected.length,
    abstentionRateCorrect: safeDivide(correctAbstained, correct.length),
    abstentionRateMispronounced: safeDivide(
      mispronouncedAbstained,
      mispronounced.length,
    ),
    classification: classificationForGroup(selected, threshold),
    probabilityQuality: {
      brier:
        probabilities.length === 0 ? null : brierScore(probabilities, targets),
      expectedCalibrationError:
        probabilities.length === 0
          ? null
          : expectedCalibrationError(probabilities, targets),
      rocAuc: probabilities.length === 0 ? null : rocAuc(probabilities, targets),
    },
    diagnosis: {
      eligible: diagnosisEligible.length,
      emitted: diagnosisEmitted,
      correct: diagnosisCorrect,
      coverage: safeDivide(diagnosisEmitted, diagnosisEligible.length),
      accuracyWhenEmitted: safeDivide(diagnosisCorrect, diagnosisEmitted),
      endToEndAccuracy: safeDivide(diagnosisCorrect, diagnosisEligible.length),
    },
    byExpectedPhone: subgroupSummary(
      selected,
      threshold,
      (example) => example.expectedPhone.trim(),
    ),
    byL1: subgroupSummary(selected, threshold, (example) => {
      const l1 = example.l1?.trim().toLowerCase();
      return l1 || null;
    }),
  };
}
