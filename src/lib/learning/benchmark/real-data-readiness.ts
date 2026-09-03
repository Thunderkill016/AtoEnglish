import {
  buildEvaluationExamples,
  runLearnerModelBenchmark,
  type BenchmarkEvidenceRecord,
} from "./learner-model-benchmark";

export type LearnerModelRealDataReadinessStatus =
  | "no-evidence"
  | "insufficient-learners"
  | "no-target-outcomes"
  | "insufficient-held-out-outcomes"
  | "held-out-label-collapse"
  | "ready-for-held-out-benchmark";

export type LearnerModelRealDataReadiness = {
  status: LearnerModelRealDataReadinessStatus;
  reason: string;
  evidenceEventCount: number;
  learnerCount: number;
  targetOutcomeCount: number;
  trainOutcomeCount: number;
  testOutcomeCount: number;
  testPositiveCount: number;
  testNegativeCount: number;
};

const MIN_HELD_OUT_OUTCOMES = 20;

export function assessLearnerModelRealDataReadiness(
  records: BenchmarkEvidenceRecord[],
  options: { testFraction?: number } = {},
): LearnerModelRealDataReadiness {
  const evidenceEventCount = records.length;
  const learnerCount = new Set(records.map((record) => record.learnerKey)).size;
  const targetOutcomeCount = buildEvaluationExamples(records).length;

  if (evidenceEventCount === 0) {
    return {
      status: "no-evidence",
      reason: "No canonical learning evidence is available for a real-data benchmark.",
      evidenceEventCount,
      learnerCount,
      targetOutcomeCount,
      trainOutcomeCount: 0,
      testOutcomeCount: 0,
      testPositiveCount: 0,
      testNegativeCount: 0,
    };
  }

  if (learnerCount < 2) {
    return {
      status: "insufficient-learners",
      reason: "Learner-level holdout requires evidence from at least two distinct learners.",
      evidenceEventCount,
      learnerCount,
      targetOutcomeCount,
      trainOutcomeCount: 0,
      testOutcomeCount: 0,
      testPositiveCount: 0,
      testNegativeCount: 0,
    };
  }

  if (targetOutcomeCount === 0) {
    return {
      status: "no-target-outcomes",
      reason: "No independent changed-context transfer or delayed retention outcomes are available.",
      evidenceEventCount,
      learnerCount,
      targetOutcomeCount,
      trainOutcomeCount: 0,
      testOutcomeCount: 0,
      testPositiveCount: 0,
      testNegativeCount: 0,
    };
  }

  const report = runLearnerModelBenchmark(
    {
      datasetId: "real-data-readiness-preflight",
      synthetic: false,
      records,
    },
    options,
  );
  const baselineMetrics = report.models.find((model) => model.modelId === "ema-history-v1")?.metrics ?? null;
  const testPositiveCount = baselineMetrics?.positives ?? 0;
  const testNegativeCount = baselineMetrics?.negatives ?? 0;

  if (report.testOutcomeCount < MIN_HELD_OUT_OUTCOMES) {
    return {
      status: "insufficient-held-out-outcomes",
      reason: `The deterministic held-out split has ${report.testOutcomeCount} target outcomes; at least ${MIN_HELD_OUT_OUTCOMES} are required by the benchmark adoption gate.`,
      evidenceEventCount,
      learnerCount,
      targetOutcomeCount,
      trainOutcomeCount: report.trainOutcomeCount,
      testOutcomeCount: report.testOutcomeCount,
      testPositiveCount,
      testNegativeCount,
    };
  }

  if (testPositiveCount === 0 || testNegativeCount === 0) {
    return {
      status: "held-out-label-collapse",
      reason: "The held-out target outcomes contain only one label, so predictive discrimination cannot be evaluated.",
      evidenceEventCount,
      learnerCount,
      targetOutcomeCount,
      trainOutcomeCount: report.trainOutcomeCount,
      testOutcomeCount: report.testOutcomeCount,
      testPositiveCount,
      testNegativeCount,
    };
  }

  return {
    status: "ready-for-held-out-benchmark",
    reason: "The real dataset clears the structural preflight for the existing learner-model benchmark. Candidate models still need to beat the held-out EMA baseline and then pass separate shadow validation.",
    evidenceEventCount,
    learnerCount,
    targetOutcomeCount,
    trainOutcomeCount: report.trainOutcomeCount,
    testOutcomeCount: report.testOutcomeCount,
    testPositiveCount,
    testNegativeCount,
  };
}
