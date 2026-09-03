import { describe, expect, it } from "vitest";

import {
  createSyntheticLearnerModelBenchmarkDataset,
  type BenchmarkEvidenceRecord,
} from "./learner-model-benchmark";
import { assessLearnerModelRealDataReadiness } from "./real-data-readiness";

function singleLearnerRecords(): BenchmarkEvidenceRecord[] {
  return [
    {
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
    },
    {
      learnerKey: "learner-a",
      targetId: "CAP-001",
      evidenceType: "transfer",
      success: true,
      confidence: 1,
      supportLevel: 0,
      independent: true,
      changedContext: true,
      delayDays: null,
      occurredAt: "2026-01-02T00:00:00.000Z",
    },
  ];
}

describe("learner-model real-data readiness", () => {
  it("fails closed when canonical evidence is empty", () => {
    const readiness = assessLearnerModelRealDataReadiness([]);

    expect(readiness.status).toBe("no-evidence");
    expect(readiness.evidenceEventCount).toBe(0);
  });

  it("requires learner-level holdout rather than treating one learner as a benchmark", () => {
    const readiness = assessLearnerModelRealDataReadiness(singleLearnerRecords());

    expect(readiness.status).toBe("insufficient-learners");
    expect(readiness.learnerCount).toBe(1);
    expect(readiness.targetOutcomeCount).toBe(1);
  });

  it("uses the benchmark's deterministic split and clears preflight on a structurally sufficient dataset", () => {
    const dataset = createSyntheticLearnerModelBenchmarkDataset();
    const readiness = assessLearnerModelRealDataReadiness(dataset.records);

    expect(readiness.status).toBe("ready-for-held-out-benchmark");
    expect(readiness.testOutcomeCount).toBeGreaterThanOrEqual(20);
    expect(readiness.testPositiveCount).toBeGreaterThan(0);
    expect(readiness.testNegativeCount).toBeGreaterThan(0);
  });

  it("does not call a tiny two-learner dataset benchmark-ready", () => {
    const first = singleLearnerRecords();
    const second = first.map((record) => ({
      ...record,
      learnerKey: "learner-b",
      success: !record.success,
    }));
    const readiness = assessLearnerModelRealDataReadiness([...first, ...second]);

    expect(readiness.status).toBe("insufficient-held-out-outcomes");
    expect(readiness.testOutcomeCount).toBeLessThan(20);
  });
});
