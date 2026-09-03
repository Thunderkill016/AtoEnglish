import { describe, expect, it } from "vitest";

import {
  buildEvaluationExamples,
  calculateMetrics,
  createSyntheticLearnerModelBenchmarkDataset,
  parseLearnerModelBenchmarkDataset,
  predictEmaHistory,
  runLearnerModelBenchmark,
  splitBenchmarkLearners,
  type BenchmarkEvidenceRecord,
} from "./learner-model-benchmark";

function baseRecord(overrides: Partial<BenchmarkEvidenceRecord> = {}): BenchmarkEvidenceRecord {
  return {
    learnerKey: "learner-a",
    targetId: "CAP-001",
    evidenceType: "production",
    success: true,
    confidence: 1,
    supportLevel: 0,
    independent: true,
    changedContext: false,
    delayDays: null,
    occurredAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("learner model benchmark v1", () => {
  it("rejects raw response or transcript-shaped fields at the dataset boundary", () => {
    const unsafe = {
      datasetId: "unsafe",
      synthetic: false,
      records: [
        {
          ...baseRecord(),
          responseText: "My name is...",
        },
        baseRecord({ learnerKey: "learner-b" }),
      ],
    };

    expect(() => parseLearnerModelBenchmarkDataset(unsafe)).toThrow(/forbidden privacy-sensitive field: responseText/);
  });

  it("creates deterministic learner-level holdout with no identity overlap", () => {
    const dataset = createSyntheticLearnerModelBenchmarkDataset();
    const first = splitBenchmarkLearners(dataset.records, 0.2);
    const second = splitBenchmarkLearners(dataset.records, 0.2);

    expect(first).toEqual(second);
    expect(first.trainLearners.length).toBeGreaterThan(0);
    expect(first.testLearners.length).toBeGreaterThan(0);
    expect(first.trainLearners.some((learner) => first.testLearners.includes(learner))).toBe(false);
  });

  it("does not let a future outcome alter features for an earlier evaluation", () => {
    const records: BenchmarkEvidenceRecord[] = [
      baseRecord(),
      baseRecord({
        evidenceType: "transfer",
        changedContext: true,
        occurredAt: "2026-01-02T00:00:00.000Z",
      }),
      baseRecord({
        evidenceType: "retention",
        delayDays: 7,
        occurredAt: "2026-01-09T00:00:00.000Z",
      }),
    ];
    const mutatedFuture = records.map((record, index) => index === 2 ? { ...record, success: false } : record);

    const originalFirst = buildEvaluationExamples(records)[0];
    const mutatedFirst = buildEvaluationExamples(mutatedFuture)[0];

    expect(originalFirst?.features).toEqual(mutatedFirst?.features);
    expect(originalFirst?.trajectoryFeatures).toEqual(mutatedFirst?.trajectoryFeatures);
  });

  it("mirrors the current asymmetric EMA update for observed dimensions", () => {
    const records: BenchmarkEvidenceRecord[] = [
      baseRecord(),
      baseRecord({
        evidenceType: "transfer",
        success: true,
        changedContext: true,
        occurredAt: "2026-01-02T00:00:00.000Z",
      }),
      baseRecord({
        evidenceType: "transfer",
        success: false,
        changedContext: true,
        occurredAt: "2026-01-03T00:00:00.000Z",
      }),
      baseRecord({ learnerKey: "learner-b", occurredAt: "2026-01-01T00:00:00.000Z" }),
    ];

    const predictions = predictEmaHistory(records, new Set(["learner-a"]));
    expect(predictions).toHaveLength(2);
    expect(predictions[0]?.probability).toBeCloseTo(0.5, 8);
    expect(predictions[1]?.probability).toBeCloseTo(0.35, 8);
  });

  it("computes calibrated prediction metrics with AUROC when both classes exist", () => {
    const metrics = calculateMetrics([
      {
        learnerKey: "a",
        targetId: "CAP-1",
        evidenceType: "transfer",
        occurredAt: "2026-01-01T00:00:00.000Z",
        actual: 1,
        probability: 0.9,
      },
      {
        learnerKey: "b",
        targetId: "CAP-1",
        evidenceType: "transfer",
        occurredAt: "2026-01-01T00:00:00.000Z",
        actual: 0,
        probability: 0.1,
      },
    ]);

    expect(metrics.count).toBe(2);
    expect(metrics.auroc).toBe(1);
    expect(metrics.brierScore).toBeCloseTo(0.01, 8);
    expect(metrics.logLoss).toBeGreaterThan(0);
  });

  it("runs all comparators deterministically but never promotes a synthetic fixture", () => {
    const dataset = createSyntheticLearnerModelBenchmarkDataset();
    const first = runLearnerModelBenchmark(dataset);
    const second = runLearnerModelBenchmark(dataset);

    expect(first).toEqual(second);
    expect(first.trainOutcomeCount).toBeGreaterThan(0);
    expect(first.testOutcomeCount).toBeGreaterThan(0);
    expect(first.models.map((model) => model.modelId)).toEqual([
      "ema-history-v1",
      "bkt-grid-v1",
      "lkt-logistic-v1",
      "lkt-logistic-aoa-v1",
    ]);
    expect(first.models[0]?.gate.status).toBe("baseline");
    for (const model of first.models.slice(1)) {
      expect(model.metrics?.count).toBe(first.testOutcomeCount);
      expect(model.gate.status).toBe("synthetic-only");
    }
  });
});
