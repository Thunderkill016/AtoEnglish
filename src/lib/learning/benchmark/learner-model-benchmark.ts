export const BENCHMARK_EVIDENCE_TYPES = [
  "recognition",
  "retrieval",
  "listening",
  "production",
  "repair",
  "transfer",
  "retention",
] as const;

export type BenchmarkEvidenceType = (typeof BENCHMARK_EVIDENCE_TYPES)[number];

export type BenchmarkEvidenceRecord = {
  learnerKey: string;
  targetId: string;
  evidenceType: BenchmarkEvidenceType;
  success: boolean;
  confidence: number;
  supportLevel: number;
  independent: boolean;
  changedContext: boolean;
  delayDays: number | null;
  occurredAt: string;
};

export type LearnerModelBenchmarkDataset = {
  datasetId: string;
  synthetic: boolean;
  records: BenchmarkEvidenceRecord[];
};

export type BenchmarkPrediction = {
  learnerKey: string;
  targetId: string;
  evidenceType: "transfer" | "retention";
  occurredAt: string;
  actual: 0 | 1;
  probability: number;
};

export type BenchmarkMetrics = {
  count: number;
  positives: number;
  negatives: number;
  logLoss: number;
  brierScore: number;
  expectedCalibrationError: number;
  auroc: number | null;
};

export type LearnerSplit = {
  trainLearners: string[];
  testLearners: string[];
};

export type BenchmarkModelResult = {
  modelId: "ema-history-v1" | "bkt-grid-v1" | "lkt-logistic-v1" | "lkt-logistic-aoa-v1";
  metrics: BenchmarkMetrics | null;
  gate: {
    status:
      | "baseline"
      | "synthetic-only"
      | "insufficient-data"
      | "eligible-for-shadow-validation"
      | "does-not-beat-baseline";
    reason: string;
  };
};

export type LearnerModelBenchmarkReport = {
  benchmarkVersion: "learner-model-benchmark-v1";
  datasetId: string;
  synthetic: boolean;
  targetOutcome: "independent-changed-context-transfer-or-delayed-retention";
  split: LearnerSplit;
  trainOutcomeCount: number;
  testOutcomeCount: number;
  models: BenchmarkModelResult[];
  notes: string[];
};

type HistoryState = {
  total: number;
  successes: number;
  independentTotal: number;
  independentSuccesses: number;
  transferTotal: number;
  transferSuccesses: number;
  supportFreeTotal: number;
  lastSuccess: 0 | 1 | null;
  lastOccurredAt: string | null;
  emaByEvidenceType: Partial<Record<BenchmarkEvidenceType, number>>;
  trajectoryFeatures: number[][];
};

type EvaluationExample = {
  record: BenchmarkEvidenceRecord;
  actual: 0 | 1;
  features: number[];
  trajectoryFeatures: number[][];
};

type BktParameters = {
  initialKnown: number;
  learn: number;
  guess: number;
  slip: number;
};

const ALLOWED_DATASET_KEYS = new Set(["datasetId", "synthetic", "records"]);
const ALLOWED_RECORD_KEYS = new Set([
  "learnerKey",
  "targetId",
  "evidenceType",
  "success",
  "confidence",
  "supportLevel",
  "independent",
  "changedContext",
  "delayDays",
  "occurredAt",
]);
const FORBIDDEN_PAYLOAD_KEYS = new Set([
  "responseText",
  "response_text",
  "transcript",
  "audio",
  "audioUrl",
  "prompt",
  "promptText",
  "metadata",
  "email",
  "name",
]);
const MIN_REAL_TEST_OUTCOMES = 20;
const MIN_LOG_LOSS_IMPROVEMENT = 0.002;
const MAX_ECE_REGRESSION = 0.01;
const FEATURE_COUNT = 8;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertExactKeys(value: Record<string, unknown>, allowed: Set<string>, label: string) {
  for (const key of Object.keys(value)) {
    if (FORBIDDEN_PAYLOAD_KEYS.has(key)) {
      throw new Error(`${label} contains forbidden privacy-sensitive field: ${key}`);
    }
    if (!allowed.has(key)) {
      throw new Error(`${label} contains unsupported field: ${key}`);
    }
  }
}

function assertBoundedIdentifier(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.length < 1 || value.length > 160) {
    throw new Error(`${label} must be a non-empty string of at most 160 characters`);
  }
}

function isBenchmarkEvidenceType(value: unknown): value is BenchmarkEvidenceType {
  return typeof value === "string" && (BENCHMARK_EVIDENCE_TYPES as readonly string[]).includes(value);
}

function assertFiniteUnitInterval(value: unknown, label: string): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${label} must be a finite number between 0 and 1`);
  }
}

function parseRecord(value: unknown, index: number): BenchmarkEvidenceRecord {
  if (!isPlainObject(value)) {
    throw new Error(`records[${index}] must be an object`);
  }
  assertExactKeys(value, ALLOWED_RECORD_KEYS, `records[${index}]`);
  assertBoundedIdentifier(value.learnerKey, `records[${index}].learnerKey`);
  assertBoundedIdentifier(value.targetId, `records[${index}].targetId`);
  if (!isBenchmarkEvidenceType(value.evidenceType)) {
    throw new Error(`records[${index}].evidenceType is unsupported`);
  }
  if (typeof value.success !== "boolean") {
    throw new Error(`records[${index}].success must be boolean`);
  }
  assertFiniteUnitInterval(value.confidence, `records[${index}].confidence`);
  if (!Number.isInteger(value.supportLevel) || (value.supportLevel as number) < 0 || (value.supportLevel as number) > 20) {
    throw new Error(`records[${index}].supportLevel must be an integer between 0 and 20`);
  }
  if (typeof value.independent !== "boolean" || typeof value.changedContext !== "boolean") {
    throw new Error(`records[${index}] must declare independent and changedContext booleans`);
  }
  if (value.delayDays !== null && (typeof value.delayDays !== "number" || !Number.isFinite(value.delayDays) || value.delayDays < 0)) {
    throw new Error(`records[${index}].delayDays must be null or a non-negative number`);
  }
  if (typeof value.occurredAt !== "string" || !Number.isFinite(Date.parse(value.occurredAt))) {
    throw new Error(`records[${index}].occurredAt must be a valid timestamp`);
  }

  return {
    learnerKey: value.learnerKey,
    targetId: value.targetId,
    evidenceType: value.evidenceType,
    success: value.success,
    confidence: value.confidence,
    supportLevel: value.supportLevel as number,
    independent: value.independent,
    changedContext: value.changedContext,
    delayDays: value.delayDays as number | null,
    occurredAt: new Date(value.occurredAt).toISOString(),
  };
}

export function parseLearnerModelBenchmarkDataset(value: unknown): LearnerModelBenchmarkDataset {
  if (!isPlainObject(value)) {
    throw new Error("Benchmark dataset must be an object");
  }
  assertExactKeys(value, ALLOWED_DATASET_KEYS, "dataset");
  assertBoundedIdentifier(value.datasetId, "dataset.datasetId");
  if (typeof value.synthetic !== "boolean") {
    throw new Error("dataset.synthetic must be boolean");
  }
  if (!Array.isArray(value.records) || value.records.length === 0) {
    throw new Error("dataset.records must contain at least one record");
  }

  const records = value.records.map(parseRecord);
  const learnerCount = new Set(records.map((record) => record.learnerKey)).size;
  if (learnerCount < 2) {
    throw new Error("Benchmark requires at least two learners for learner-level holdout");
  }

  return { datasetId: value.datasetId, synthetic: value.synthetic, records };
}

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function splitBenchmarkLearners(records: BenchmarkEvidenceRecord[], testFraction = 0.2): LearnerSplit {
  if (!(testFraction > 0 && testFraction < 1)) {
    throw new Error("testFraction must be between 0 and 1");
  }
  const learners = [...new Set(records.map((record) => record.learnerKey))].sort((left, right) => {
    const hashDelta = stableHash(left) - stableHash(right);
    return hashDelta !== 0 ? hashDelta : left.localeCompare(right);
  });
  if (learners.length < 2) {
    throw new Error("Learner-level holdout requires at least two learners");
  }
  const testCount = Math.min(learners.length - 1, Math.max(1, Math.round(learners.length * testFraction)));
  return {
    testLearners: learners.slice(0, testCount),
    trainLearners: learners.slice(testCount),
  };
}

function emptyHistory(): HistoryState {
  return {
    total: 0,
    successes: 0,
    independentTotal: 0,
    independentSuccesses: 0,
    transferTotal: 0,
    transferSuccesses: 0,
    supportFreeTotal: 0,
    lastSuccess: null,
    lastOccurredAt: null,
    emaByEvidenceType: {},
    trajectoryFeatures: [],
  };
}

function betaMean(successes: number, total: number) {
  return (successes + 1) / (total + 2);
}

function featureVector(history: HistoryState, at: string) {
  const daysSinceLast = history.lastOccurredAt
    ? Math.max(0, (Date.parse(at) - Date.parse(history.lastOccurredAt)) / 86_400_000)
    : Number.POSITIVE_INFINITY;
  const recency = Number.isFinite(daysSinceLast) ? Math.exp(-daysSinceLast / 14) : 0;
  const opportunityScale = Math.min(Math.log1p(history.total) / Math.log(21), 1);
  return [
    1,
    betaMean(history.successes, history.total),
    opportunityScale,
    recency,
    betaMean(history.independentSuccesses, history.independentTotal),
    betaMean(history.transferSuccesses, history.transferTotal),
    history.lastSuccess ?? 0.5,
    history.total === 0 ? 0.5 : history.supportFreeTotal / history.total,
  ];
}

function updateEma(history: HistoryState, record: BenchmarkEvidenceRecord) {
  const supportPenalty = Math.min(Math.max(record.supportLevel * 0.1, 0), 0.5);
  const observation = record.success ? record.confidence * (1 - supportPenalty) : 0;
  const alpha = record.success ? 0.35 : 0.5;
  const previous = history.emaByEvidenceType[record.evidenceType];
  history.emaByEvidenceType[record.evidenceType] = previous === undefined
    ? observation * alpha
    : clampProbability(previous * (1 - alpha) + observation * alpha);
}

function updateHistory(history: HistoryState, record: BenchmarkEvidenceRecord) {
  history.total += 1;
  history.successes += record.success ? 1 : 0;
  if (record.independent) {
    history.independentTotal += 1;
    history.independentSuccesses += record.success ? 1 : 0;
  }
  if (record.evidenceType === "transfer") {
    history.transferTotal += 1;
    history.transferSuccesses += record.success ? 1 : 0;
  }
  if (record.supportLevel === 0) {
    history.supportFreeTotal += 1;
  }
  history.lastSuccess = record.success ? 1 : 0;
  history.lastOccurredAt = record.occurredAt;
  updateEma(history, record);
  history.trajectoryFeatures.push(featureVector(history, record.occurredAt));
}

function isTargetOutcome(record: BenchmarkEvidenceRecord): record is BenchmarkEvidenceRecord & { evidenceType: "transfer" | "retention" } {
  if (!record.independent || record.supportLevel !== 0) {
    return false;
  }
  if (record.evidenceType === "transfer") {
    return record.changedContext;
  }
  if (record.evidenceType === "retention") {
    return record.delayDays !== null && record.delayDays >= 1;
  }
  return false;
}

function chronologicalRecords(records: BenchmarkEvidenceRecord[], learnerSet?: Set<string>) {
  return records
    .map((record, index) => ({ record, index }))
    .filter(({ record }) => !learnerSet || learnerSet.has(record.learnerKey))
    .sort((left, right) => {
      const learnerDelta = left.record.learnerKey.localeCompare(right.record.learnerKey);
      if (learnerDelta !== 0) return learnerDelta;
      const timeDelta = Date.parse(left.record.occurredAt) - Date.parse(right.record.occurredAt);
      if (timeDelta !== 0) return timeDelta;
      return left.index - right.index;
    })
    .map(({ record }) => record);
}

function historyKey(record: BenchmarkEvidenceRecord) {
  return `${record.learnerKey}\u0000${record.targetId}`;
}

export function buildEvaluationExamples(records: BenchmarkEvidenceRecord[], learnerSet?: Set<string>): EvaluationExample[] {
  const histories = new Map<string, HistoryState>();
  const examples: EvaluationExample[] = [];

  for (const record of chronologicalRecords(records, learnerSet)) {
    const key = historyKey(record);
    const history = histories.get(key) ?? emptyHistory();
    if (isTargetOutcome(record)) {
      examples.push({
        record,
        actual: record.success ? 1 : 0,
        features: featureVector(history, record.occurredAt),
        trajectoryFeatures: history.trajectoryFeatures.map((features) => [...features]),
      });
    }
    updateHistory(history, record);
    histories.set(key, history);
  }
  return examples;
}

function clampProbability(value: number) {
  return Math.min(1 - 1e-6, Math.max(1e-6, value));
}

function predictionFromExample(example: EvaluationExample, probability: number): BenchmarkPrediction {
  return {
    learnerKey: example.record.learnerKey,
    targetId: example.record.targetId,
    evidenceType: example.record.evidenceType as "transfer" | "retention",
    occurredAt: example.record.occurredAt,
    actual: example.actual,
    probability: clampProbability(probability),
  };
}

export function predictEmaHistory(records: BenchmarkEvidenceRecord[], learnerSet: Set<string>): BenchmarkPrediction[] {
  const histories = new Map<string, HistoryState>();
  const predictions: BenchmarkPrediction[] = [];

  for (const record of chronologicalRecords(records, learnerSet)) {
    const key = historyKey(record);
    const history = histories.get(key) ?? emptyHistory();
    if (isTargetOutcome(record)) {
      const probability = history.emaByEvidenceType[record.evidenceType] ?? 0.5;
      predictions.push({
        learnerKey: record.learnerKey,
        targetId: record.targetId,
        evidenceType: record.evidenceType,
        occurredAt: record.occurredAt,
        actual: record.success ? 1 : 0,
        probability: clampProbability(probability),
      });
    }
    updateHistory(history, record);
    histories.set(key, history);
  }
  return predictions;
}

function bktObservationProbability(known: number, parameters: BktParameters) {
  return known * (1 - parameters.slip) + (1 - known) * parameters.guess;
}

function updateBktKnown(known: number, success: boolean, parameters: BktParameters) {
  const pCorrect = bktObservationProbability(known, parameters);
  const posterior = success
    ? (known * (1 - parameters.slip)) / Math.max(pCorrect, 1e-9)
    : (known * parameters.slip) / Math.max(1 - pCorrect, 1e-9);
  return clampProbability(posterior + (1 - posterior) * parameters.learn);
}

function predictBkt(
  records: BenchmarkEvidenceRecord[],
  learnerSet: Set<string>,
  parameters: BktParameters,
): BenchmarkPrediction[] {
  const knownByTarget = new Map<string, number>();
  const predictions: BenchmarkPrediction[] = [];

  for (const record of chronologicalRecords(records, learnerSet)) {
    const key = historyKey(record);
    const known = knownByTarget.get(key) ?? parameters.initialKnown;
    if (isTargetOutcome(record)) {
      predictions.push({
        learnerKey: record.learnerKey,
        targetId: record.targetId,
        evidenceType: record.evidenceType,
        occurredAt: record.occurredAt,
        actual: record.success ? 1 : 0,
        probability: clampProbability(bktObservationProbability(known, parameters)),
      });
    }
    knownByTarget.set(key, updateBktKnown(known, record.success, parameters));
  }
  return predictions;
}

function fitBktParameters(records: BenchmarkEvidenceRecord[], trainLearners: Set<string>): BktParameters {
  const initialGrid = [0.1, 0.25, 0.5, 0.75];
  const learnGrid = [0.05, 0.15, 0.3];
  const guessGrid = [0.1, 0.2, 0.3];
  const slipGrid = [0.05, 0.1, 0.2];
  let best: BktParameters = { initialKnown: 0.25, learn: 0.15, guess: 0.2, slip: 0.1 };
  let bestLoss = Number.POSITIVE_INFINITY;

  for (const initialKnown of initialGrid) {
    for (const learn of learnGrid) {
      for (const guess of guessGrid) {
        for (const slip of slipGrid) {
          const candidate = { initialKnown, learn, guess, slip };
          const predictions = predictBkt(records, trainLearners, candidate);
          if (predictions.length === 0) continue;
          const loss = calculateMetrics(predictions).logLoss;
          if (loss < bestLoss - 1e-12) {
            bestLoss = loss;
            best = candidate;
          }
        }
      }
    }
  }
  return best;
}

function sigmoid(value: number) {
  const bounded = Math.max(-30, Math.min(30, value));
  return 1 / (1 + Math.exp(-bounded));
}

function dot(weights: number[], features: number[]) {
  let sum = 0;
  for (let index = 0; index < weights.length; index += 1) {
    sum += weights[index] * features[index];
  }
  return sum;
}

function fitLogisticRegression(examples: EvaluationExample[]) {
  const weights = Array.from({ length: FEATURE_COUNT }, () => 0);
  if (examples.length === 0) return weights;
  const learningRate = 0.2;
  const ridge = 0.01;

  for (let step = 0; step < 1200; step += 1) {
    const gradient = Array.from({ length: FEATURE_COUNT }, () => 0);
    for (const example of examples) {
      const error = sigmoid(dot(weights, example.features)) - example.actual;
      for (let index = 0; index < FEATURE_COUNT; index += 1) {
        gradient[index] += error * example.features[index];
      }
    }
    for (let index = 0; index < FEATURE_COUNT; index += 1) {
      const penalty = index === 0 ? 0 : ridge * weights[index];
      weights[index] -= learningRate * (gradient[index] / examples.length + penalty);
    }
  }
  return weights;
}

function predictLogistic(examples: EvaluationExample[], weights: number[]) {
  return examples.map((example) => predictionFromExample(example, sigmoid(dot(weights, example.features))));
}

function predictLogisticAoa(examples: EvaluationExample[], weights: number[]) {
  return examples.map((example) => {
    const trajectory = example.trajectoryFeatures;
    if (trajectory.length === 0) {
      return predictionFromExample(example, sigmoid(dot(weights, example.features)));
    }
    const average = trajectory.reduce((sum, features) => sum + sigmoid(dot(weights, features)), 0) / trajectory.length;
    return predictionFromExample(example, average);
  });
}

function calculateAuroc(predictions: BenchmarkPrediction[]) {
  const positives = predictions.filter((prediction) => prediction.actual === 1).length;
  const negatives = predictions.length - positives;
  if (positives === 0 || negatives === 0) return null;

  const sorted = [...predictions].sort((left, right) => left.probability - right.probability);
  let positiveRankSum = 0;
  let index = 0;
  while (index < sorted.length) {
    let end = index + 1;
    while (end < sorted.length && sorted[end].probability === sorted[index].probability) end += 1;
    const averageRank = (index + 1 + end) / 2;
    for (let cursor = index; cursor < end; cursor += 1) {
      if (sorted[cursor].actual === 1) positiveRankSum += averageRank;
    }
    index = end;
  }
  return (positiveRankSum - (positives * (positives + 1)) / 2) / (positives * negatives);
}

export function calculateMetrics(predictions: BenchmarkPrediction[]): BenchmarkMetrics {
  if (predictions.length === 0) {
    throw new Error("Cannot calculate metrics without predictions");
  }
  let logLoss = 0;
  let brier = 0;
  const bins = Array.from({ length: 10 }, () => ({ count: 0, probability: 0, actual: 0 }));

  for (const prediction of predictions) {
    const probability = clampProbability(prediction.probability);
    logLoss += -(prediction.actual * Math.log(probability) + (1 - prediction.actual) * Math.log(1 - probability));
    brier += (probability - prediction.actual) ** 2;
    const binIndex = Math.min(9, Math.floor(probability * 10));
    bins[binIndex].count += 1;
    bins[binIndex].probability += probability;
    bins[binIndex].actual += prediction.actual;
  }

  let expectedCalibrationError = 0;
  for (const bin of bins) {
    if (bin.count === 0) continue;
    const meanProbability = bin.probability / bin.count;
    const meanActual = bin.actual / bin.count;
    expectedCalibrationError += (bin.count / predictions.length) * Math.abs(meanProbability - meanActual);
  }

  const positives = predictions.filter((prediction) => prediction.actual === 1).length;
  return {
    count: predictions.length,
    positives,
    negatives: predictions.length - positives,
    logLoss: logLoss / predictions.length,
    brierScore: brier / predictions.length,
    expectedCalibrationError,
    auroc: calculateAuroc(predictions),
  };
}

function candidateGate(
  dataset: LearnerModelBenchmarkDataset,
  baseline: BenchmarkMetrics | null,
  candidate: BenchmarkMetrics | null,
) : BenchmarkModelResult["gate"] {
  if (dataset.synthetic) {
    return { status: "synthetic-only", reason: "Synthetic data validates benchmark plumbing only and cannot justify model adoption." };
  }
  if (!baseline || !candidate) {
    return { status: "insufficient-data", reason: "Held-out evaluation outcomes are unavailable for a trustworthy comparison." };
  }
  if (candidate.count < MIN_REAL_TEST_OUTCOMES || candidate.positives === 0 || candidate.negatives === 0) {
    return {
      status: "insufficient-data",
      reason: `Need at least ${MIN_REAL_TEST_OUTCOMES} held-out outcomes with both success and failure labels.`,
    };
  }
  const improvesLoss = candidate.logLoss <= baseline.logLoss - MIN_LOG_LOSS_IMPROVEMENT;
  const preservesBrier = candidate.brierScore <= baseline.brierScore;
  const preservesCalibration = candidate.expectedCalibrationError <= baseline.expectedCalibrationError + MAX_ECE_REGRESSION;
  if (improvesLoss && preservesBrier && preservesCalibration) {
    return {
      status: "eligible-for-shadow-validation",
      reason: "Candidate beats the held-out EMA baseline without worsening Brier score or materially degrading calibration; this is not a production-adoption decision.",
    };
  }
  return {
    status: "does-not-beat-baseline",
    reason: "Candidate did not clear the held-out predictive and calibration gate against EMA history baseline.",
  };
}

function metricsOrNull(predictions: BenchmarkPrediction[]) {
  return predictions.length > 0 ? calculateMetrics(predictions) : null;
}

export function runLearnerModelBenchmark(
  input: LearnerModelBenchmarkDataset | unknown,
  options: { testFraction?: number } = {},
): LearnerModelBenchmarkReport {
  const dataset = parseLearnerModelBenchmarkDataset(input);
  const split = splitBenchmarkLearners(dataset.records, options.testFraction ?? 0.2);
  const trainSet = new Set(split.trainLearners);
  const testSet = new Set(split.testLearners);
  const trainExamples = buildEvaluationExamples(dataset.records, trainSet);
  const testExamples = buildEvaluationExamples(dataset.records, testSet);

  const emaMetrics = metricsOrNull(predictEmaHistory(dataset.records, testSet));
  const bktParameters = fitBktParameters(dataset.records, trainSet);
  const bktMetrics = metricsOrNull(predictBkt(dataset.records, testSet, bktParameters));
  const logisticWeights = fitLogisticRegression(trainExamples);
  const lktMetrics = metricsOrNull(predictLogistic(testExamples, logisticWeights));
  const aoaMetrics = metricsOrNull(predictLogisticAoa(testExamples, logisticWeights));

  return {
    benchmarkVersion: "learner-model-benchmark-v1",
    datasetId: dataset.datasetId,
    synthetic: dataset.synthetic,
    targetOutcome: "independent-changed-context-transfer-or-delayed-retention",
    split,
    trainOutcomeCount: trainExamples.length,
    testOutcomeCount: testExamples.length,
    models: [
      {
        modelId: "ema-history-v1",
        metrics: emaMetrics,
        gate: { status: "baseline", reason: "Reference predictor derived from AtoEnglish's current asymmetric EMA update policy." },
      },
      { modelId: "bkt-grid-v1", metrics: bktMetrics, gate: candidateGate(dataset, emaMetrics, bktMetrics) },
      { modelId: "lkt-logistic-v1", metrics: lktMetrics, gate: candidateGate(dataset, emaMetrics, lktMetrics) },
      { modelId: "lkt-logistic-aoa-v1", metrics: aoaMetrics, gate: candidateGate(dataset, emaMetrics, aoaMetrics) },
    ],
    notes: [
      "All predictions are generated before the labeled transfer/retention event is applied to learner history.",
      "Learners are held out as complete identities; train and test learner sets never overlap.",
      "AOA is an aggregation strategy over LKT-style prediction trajectories, not a standalone learner model.",
      "Benchmark scores are prediction evidence only; they must not mutate learner proficiency or mastery state.",
      "Real-data promotion requires a privacy-safe export and a separate shadow-validation decision.",
    ],
  };
}

export function createSyntheticLearnerModelBenchmarkDataset(): LearnerModelBenchmarkDataset {
  const records: BenchmarkEvidenceRecord[] = [];
  const base = Date.parse("2026-01-01T00:00:00.000Z");
  const historyTypes: BenchmarkEvidenceType[] = ["recognition", "retrieval", "production", "retrieval", "production", "repair"];

  for (let learner = 0; learner < 30; learner += 1) {
    const learnerKey = `synthetic-learner-${String(learner + 1).padStart(2, "0")}`;
    const abilityBand = learner % 5;
    for (let target = 0; target < 2; target += 1) {
      const targetId = `CAP-SYN-${target + 1}`;
      for (let opportunity = 0; opportunity < historyTypes.length; opportunity += 1) {
        const threshold = Math.min(4, abilityBand + Math.floor(opportunity / 2));
        const success = (learner + target + opportunity) % 5 <= threshold;
        const supportLevel = opportunity < 2 && abilityBand < 2 ? 1 : 0;
        records.push({
          learnerKey,
          targetId,
          evidenceType: historyTypes[opportunity],
          success,
          confidence: 1,
          supportLevel,
          independent: supportLevel === 0,
          changedContext: false,
          delayDays: null,
          occurredAt: new Date(base + (learner * 20 + target * 8 + opportunity) * 86_400_000).toISOString(),
        });
      }
      const transferSuccess = abilityBand >= 2 || (learner + target) % 4 === 0;
      records.push({
        learnerKey,
        targetId,
        evidenceType: "transfer",
        success: transferSuccess,
        confidence: 1,
        supportLevel: 0,
        independent: true,
        changedContext: true,
        delayDays: null,
        occurredAt: new Date(base + (learner * 20 + target * 8 + 6) * 86_400_000).toISOString(),
      });
      records.push({
        learnerKey,
        targetId,
        evidenceType: "retention",
        success: transferSuccess && (abilityBand >= 3 || learner % 3 !== 0),
        confidence: 1,
        supportLevel: 0,
        independent: true,
        changedContext: true,
        delayDays: 7,
        occurredAt: new Date(base + (learner * 20 + target * 8 + 13) * 86_400_000).toISOString(),
      });
    }
  }

  return {
    datasetId: "synthetic-pipeline-fixture-v1",
    synthetic: true,
    records,
  };
}
