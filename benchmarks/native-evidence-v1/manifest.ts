import crypto from "node:crypto";

import type { PilotTaskDefinition, PredictionFeatureRow } from "./types";
import {
  NATIVE_PILOT_CONTRACT_ID,
  NATIVE_PREDICTOR_CONTRACT_ID,
  SYNTHETIC_ONLY_STATUS,
} from "./types";

export const NATIVE_PREDICTOR_SETTINGS = Object.freeze({
  implementation: "scikit-learn",
  version: "1.6.1",
  estimator: "LogisticRegression",
  parameters: Object.freeze({
    penalty: "l2",
    C: 1,
    solver: "lbfgs",
    fit_intercept: true,
    class_weight: null,
    max_iter: 1000,
    tol: 1e-8,
  }),
});

export const NATIVE_METRIC_SETTINGS = Object.freeze({
  positiveClass: "error=1",
  primary: "mean-per-learner-natural-log-loss",
  secondary: "mean-per-learner-brier-loss",
  logLossClipEpsilon: 1e-15,
  calibrationBins: 5,
  bootstrap: Object.freeze({ unit: "learner", draws: 2000, seed: 143 }),
  aucOneClassPolicy: "null-with-reason",
});

function digestJson(value: unknown): `sha256:${string}` {
  return `sha256:${crypto.createHash("sha256").update(JSON.stringify(value), "utf8").digest("hex")}`;
}

export type SyntheticNativePilotManifest = {
  readonly status: typeof SYNTHETIC_ONLY_STATUS;
  readonly purpose: "fixture-feature-summary";
  readonly pilotContractId: typeof NATIVE_PILOT_CONTRACT_ID;
  readonly predictorContractId: typeof NATIVE_PREDICTOR_CONTRACT_ID;
  readonly sourcePins: Readonly<Record<string, string>>;
  readonly predictor: typeof NATIVE_PREDICTOR_SETTINGS;
  readonly metrics: typeof NATIVE_METRIC_SETTINGS;
  readonly causalPolicy: {
    readonly currentOutcomeForbidden: true;
    readonly futureOutcomeForbidden: true;
    readonly strictOccurredBeforePrediction: true;
    readonly strictAvailableBeforePrediction: true;
    readonly equalTimestampExcluded: true;
    readonly trainOnlyTransforms: true;
  };
  readonly utilityGate: {
    readonly status: "unresolved";
    readonly deltaHistory: null;
    readonly deltaBasis: null;
    readonly predictiveKeepSimplifyEnabled: false;
  };
  readonly taskDefinitions: readonly {
    readonly family: string;
    readonly taskId: string;
    readonly taskVersion: number;
    readonly contentFingerprint: string;
    readonly contextId: string;
    readonly stimulusFormGroup: string;
  }[];
  readonly featureRows: readonly {
    readonly participantId: string;
    readonly targetEventId: string;
    readonly predictionTimestamp: string;
    readonly acceptedHistoryEventIds: readonly string[];
    readonly featureDigest: string;
  }[];
  readonly forbiddenClaims: readonly string[];
};

export function buildSyntheticNativePilotManifest(
  tasks: readonly PilotTaskDefinition[],
  rows: readonly PredictionFeatureRow[],
): SyntheticNativePilotManifest {
  const taskDefinitions = tasks
    .map((definition) => ({
      family: definition.family,
      taskId: definition.task.id,
      taskVersion: definition.task.version,
      contentFingerprint: definition.contentFingerprint,
      contextId: definition.contextId,
      stimulusFormGroup: definition.stimulusFormGroup,
    }))
    .sort((left, right) => left.taskId.localeCompare(right.taskId));

  const featureRows = rows
    .map((row) => ({
      participantId: row.participantId,
      targetEventId: row.targetEventId,
      predictionTimestamp: row.predictionTimestamp,
      acceptedHistoryEventIds: Object.freeze([...row.acceptedHistoryEventIds]),
      featureDigest: digestJson({ b2: row.b2, b2Basis: row.b2Basis, b3: row.b3 }),
    }))
    .sort((left, right) => left.targetEventId.localeCompare(right.targetEventId));

  return Object.freeze({
    status: SYNTHETIC_ONLY_STATUS,
    purpose: "fixture-feature-summary",
    pilotContractId: NATIVE_PILOT_CONTRACT_ID,
    predictorContractId: NATIVE_PREDICTOR_CONTRACT_ID,
    sourcePins: Object.freeze({
      coreFrontier: "ef42f2cf96f9aa079505ad73c83c0555a470bfab",
      nativeSpecAmendment: "34013121cb9ab6850d15fa09a06ed3a46da44486",
      slamDonor: "490fbcd0fcfbf161a475a17463445410ef67e99e",
      scikitLearn: "f159b78dc59f250cdde8fe391a21f0bc871960ad",
      pyBKT: "06fc180ae72c117458acc527f8ec90cc8e0581c1",
    }),
    predictor: NATIVE_PREDICTOR_SETTINGS,
    metrics: NATIVE_METRIC_SETTINGS,
    causalPolicy: Object.freeze({
      currentOutcomeForbidden: true,
      futureOutcomeForbidden: true,
      strictOccurredBeforePrediction: true,
      strictAvailableBeforePrediction: true,
      equalTimestampExcluded: true,
      trainOnlyTransforms: true,
    }),
    utilityGate: Object.freeze({
      status: "unresolved",
      deltaHistory: null,
      deltaBasis: null,
      predictiveKeepSimplifyEnabled: false,
    }),
    taskDefinitions: Object.freeze(taskDefinitions),
    featureRows: Object.freeze(featureRows),
    forbiddenClaims: Object.freeze([
      "learner-model-validity",
      "predictive-superiority",
      "learning-efficacy",
      "retention-validity",
      "transfer-validity",
      "mastery",
      "CEFR",
      "calibrated",
      "production-authority",
    ]),
  });
}
