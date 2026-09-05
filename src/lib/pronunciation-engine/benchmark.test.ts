import { describe, expect, it } from "vitest";

import {
  assertSpeakerDisjointBenchmark,
  evaluatePronunciationSensorBenchmark,
  fitValidationOperatingPoint,
  type PronunciationSensorBenchmarkExample,
} from "./benchmark";

const examples: PronunciationSensorBenchmarkExample[] = [
  {
    id: "v1",
    speakerId: "speaker-validation-a",
    split: "validation",
    expectedPhone: "θ",
    target: 0,
    mispronunciationProbability: 0.1,
    l1: "vi",
  },
  {
    id: "v2",
    speakerId: "speaker-validation-a",
    split: "validation",
    expectedPhone: "θ",
    target: 1,
    mispronunciationProbability: 0.9,
    referenceObservedPhone: "s",
    predictedObservedPhone: "s",
    l1: "vi",
  },
  {
    id: "t1",
    speakerId: "speaker-test-a",
    split: "test",
    expectedPhone: "θ",
    target: 0,
    mispronunciationProbability: 0.2,
    l1: "vi",
  },
  {
    id: "t2",
    speakerId: "speaker-test-a",
    split: "test",
    expectedPhone: "θ",
    target: 1,
    mispronunciationProbability: 0.8,
    referenceObservedPhone: "s",
    predictedObservedPhone: "s",
    l1: "vi",
  },
  {
    id: "t3",
    speakerId: "speaker-test-b",
    split: "test",
    expectedPhone: "ð",
    target: 1,
    mispronunciationProbability: null,
    referenceObservedPhone: "d",
    predictedObservedPhone: null,
    l1: "vi",
  },
];

describe("pronunciation-engine sensor benchmark", () => {
  it("fits a threshold on validation only and evaluates the frozen test split", () => {
    const operatingPoint = fitValidationOperatingPoint(examples, {
      objective: "mcc",
    });
    const summary = evaluatePronunciationSensorBenchmark(
      examples,
      operatingPoint.threshold,
      "test",
    );

    expect(operatingPoint.threshold).toBe(0.5);
    expect(summary.total).toBe(3);
    expect(summary.scored).toBe(2);
    expect(summary.coverage).toBeCloseTo(2 / 3, 8);
    expect(summary.classification?.matthewsCorrelationCoefficient).toBe(1);
    expect(summary.diagnosis.eligible).toBe(2);
    expect(summary.diagnosis.emitted).toBe(1);
    expect(summary.diagnosis.accuracyWhenEmitted).toBe(1);
    expect(summary.diagnosis.endToEndAccuracy).toBe(0.5);
    expect(summary.byExpectedPhone["θ"]?.coverage).toBe(1);
    expect(summary.byExpectedPhone["ð"]?.coverage).toBe(0);
    expect(summary.byL1.vi?.total).toBe(3);
  });

  it("exposes abstention asymmetry instead of hiding it in aggregate accuracy", () => {
    const summary = evaluatePronunciationSensorBenchmark(examples, 0.5);

    expect(summary.abstentionRateCorrect).toBe(0);
    expect(summary.abstentionRateMispronounced).toBe(0.5);
  });

  it("rejects speaker leakage across validation and test", () => {
    const leaked: PronunciationSensorBenchmarkExample[] = [
      ...examples,
      {
        id: "leak",
        speakerId: "speaker-validation-a",
        split: "test",
        expectedPhone: "s",
        target: 0,
        mispronunciationProbability: 0.1,
      },
    ];

    expect(() => assertSpeakerDisjointBenchmark(leaked)).toThrow(
      "benchmark_speaker_split_leakage",
    );
  });

  it("rejects duplicate examples and invalid probabilities", () => {
    expect(() =>
      assertSpeakerDisjointBenchmark([examples[0]!, examples[0]!]),
    ).toThrow("benchmark_example_ids_must_be_unique");

    expect(() =>
      assertSpeakerDisjointBenchmark([
        {
          ...examples[0]!,
          id: "bad-probability",
          mispronunciationProbability: 1.2,
        },
      ]),
    ).toThrow("benchmark_probability_out_of_range");
  });
});
