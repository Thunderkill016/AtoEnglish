import crypto from "node:crypto";

import type { FrozenNativeSplitProtocol } from "./protocol";
import type {
  PilotTaskDefinition,
  PredictionFeatureRow,
  SyntheticArtifactRecord,
} from "./types";
import {
  NATIVE_PILOT_CONTRACT_ID,
  NATIVE_PREDICTOR_CONTRACT_ID,
  SYNTHETIC_ONLY_STATUS,
} from "./types";

export const NATIVE_DECISION_RULE_ID = "nep.native-decision.v1" as const;

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

export const NATIVE_FEATURE_POLICY = Object.freeze({
  sharedHistorySource: "accepted-reference-evidence-only",
  b2: Object.freeze({
    role: "strong-causal-history",
    currentOutcomeForbidden: true,
    currentRevealUseForbidden: true,
    currentLatencyForbidden: true,
  }),
  b2Basis: Object.freeze({
    role: "deterministic-projector-basis-control",
    source: "b2-counts-only",
  }),
  b3: Object.freeze({
    role: "learner-state-representation-test",
    source: "projectLearnerState-over-same-accepted-history",
  }),
  pruning: Object.freeze({
    trainConstantColumns: "drop",
    exactDuplicateColumns: "drop-stable-name-order-b2-preferred",
    fitScope: "TRAIN-only",
  }),
});

export const NATIVE_SOURCE_BINDINGS = Object.freeze([
  Object.freeze({
    id: "core-frontier",
    revision: "ef42f2cf96f9aa079505ad73c83c0555a470bfab",
    role: "canonical-core-contract-donor",
    rights: "repository-owned",
  }),
  Object.freeze({
    id: "native-spec-amendment",
    revision: "34013121cb9ab6850d15fa09a06ed3a46da44486",
    role: "reviewed-experiment-contract",
    rights: "repository-owned",
  }),
  Object.freeze({
    id: "slam-benchmark-donor",
    revision: "490fbcd0fcfbf161a475a17463445410ef67e99e",
    role: "manifest-statistics-pattern-donor-only",
    rights: "repository-owned-derived-code",
  }),
  Object.freeze({
    id: "scikit-learn",
    revision: "f159b78dc59f250cdde8fe391a21f0bc871960ad",
    role: "common-logistic-estimator",
    rights: "BSD-3-Clause",
  }),
  Object.freeze({
    id: "pyBKT",
    revision: "06fc180ae72c117458acc527f8ec90cc8e0581c1",
    role: "conditional-classical-comparator",
    rights: "MIT",
  }),
] as const);

export type SyntheticPredictorLane =
  | "b0-native"
  | "b2-native"
  | "b2-basis-native"
  | "b3-native"
  | "bkt-native";

export type SyntheticPredictorArtifactBinding = {
  readonly lane: SyntheticPredictorLane;
  readonly availability: "available" | "not-estimable" | "not-run";
  readonly specFingerprint: `sha256:${string}` | null;
  readonly transformFingerprint: `sha256:${string}` | null;
  readonly fittedModelFingerprint: `sha256:${string}` | null;
  readonly predictionFingerprint: `sha256:${string}` | null;
  readonly nonEstimabilityReason: string | null;
};

export type SyntheticCoverageSummary = {
  readonly eligibleOpportunityCount: number;
  readonly observedOutcomeCount: number;
  readonly emittedPredictionCount: number;
  readonly acceptedHistoryEventCount: number;
  readonly rejectedHistoryEventCount: number;
  readonly learnerCount: number;
  readonly attemptCount: number;
};

export type SyntheticBktManifestBinding = {
  readonly diagnosticsArtifactDigest: `sha256:${string}` | null;
  readonly diagnosticsUnavailableReason: string | null;
  readonly convergenceAssurance: "convergence-observed" | "convergence-unverified" | "not-run";
  readonly stabilityAssurance:
    | "unresolved-pending-reviewed-train-only-tolerances"
    | "reviewed"
    | "not-run";
};

export type BuildSyntheticNativePilotManifestInput = {
  readonly tasks: readonly PilotTaskDefinition[];
  readonly rows: readonly PredictionFeatureRow[];
  readonly protocol: FrozenNativeSplitProtocol;
  readonly artifacts: readonly SyntheticArtifactRecord[];
  readonly predictorArtifacts: readonly SyntheticPredictorArtifactBinding[];
  readonly coverage: SyntheticCoverageSummary;
  readonly bkt: SyntheticBktManifestBinding;
};

function digestJson(value: unknown): `sha256:${string}` {
  return `sha256:${crypto.createHash("sha256").update(JSON.stringify(value), "utf8").digest("hex")}`;
}

function assertNonnegativeInteger(value: number, field: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${field} must be a nonnegative integer`);
  }
}

function validateCoverage(coverage: SyntheticCoverageSummary): void {
  for (const [field, value] of Object.entries(coverage)) {
    assertNonnegativeInteger(value, `coverage.${field}`);
  }
  if (coverage.observedOutcomeCount > coverage.eligibleOpportunityCount) {
    throw new Error("coverage.observedOutcomeCount cannot exceed eligibleOpportunityCount");
  }
  if (coverage.emittedPredictionCount > coverage.eligibleOpportunityCount) {
    throw new Error("coverage.emittedPredictionCount cannot exceed eligibleOpportunityCount");
  }
}

function validatePredictorArtifacts(
  artifacts: readonly SyntheticPredictorArtifactBinding[],
): readonly SyntheticPredictorArtifactBinding[] {
  const expected: readonly SyntheticPredictorLane[] = [
    "b0-native",
    "b2-native",
    "b2-basis-native",
    "b3-native",
    "bkt-native",
  ];
  const byLane = new Map(artifacts.map((artifact) => [artifact.lane, artifact]));
  if (byLane.size !== artifacts.length) {
    throw new Error("predictorArtifacts must contain unique lanes");
  }
  for (const lane of expected) {
    if (!byLane.has(lane)) throw new Error(`predictorArtifacts missing lane: ${lane}`);
  }
  for (const artifact of artifacts) {
    if (artifact.availability === "not-estimable" && !artifact.nonEstimabilityReason) {
      throw new Error(`not-estimable lane must record a reason: ${artifact.lane}`);
    }
    if (artifact.availability !== "not-estimable" && artifact.nonEstimabilityReason) {
      throw new Error(`only not-estimable lanes may record nonEstimabilityReason: ${artifact.lane}`);
    }
  }
  return Object.freeze(
    [...artifacts].sort((left, right) => left.lane.localeCompare(right.lane)),
  );
}

function validateBktBinding(binding: SyntheticBktManifestBinding): void {
  if (binding.diagnosticsArtifactDigest === null && !binding.diagnosticsUnavailableReason) {
    throw new Error("missing BKT diagnostics digest requires diagnosticsUnavailableReason");
  }
  if (binding.diagnosticsArtifactDigest !== null && binding.diagnosticsUnavailableReason !== null) {
    throw new Error("BKT diagnostics reason must be null when a digest is present");
  }
}

export type SyntheticNativePilotManifest = {
  readonly status: typeof SYNTHETIC_ONLY_STATUS;
  readonly manifestDigest: `sha256:${string}`;
  readonly pilotContractId: typeof NATIVE_PILOT_CONTRACT_ID;
  readonly predictorContractId: typeof NATIVE_PREDICTOR_CONTRACT_ID;
  readonly decisionRuleId: typeof NATIVE_DECISION_RULE_ID;
  readonly dataPolicy: {
    readonly source: "synthetic-only";
    readonly humanDataIncluded: false;
    readonly externalCorpusRowsIncluded: false;
    readonly redistributionDecision: "not-applicable";
  };
  readonly sourceBindings: typeof NATIVE_SOURCE_BINDINGS;
  readonly predictor: typeof NATIVE_PREDICTOR_SETTINGS;
  readonly metrics: typeof NATIVE_METRIC_SETTINGS;
  readonly featurePolicy: typeof NATIVE_FEATURE_POLICY;
  readonly causalPolicy: {
    readonly currentOutcomeForbidden: true;
    readonly futureOutcomeForbidden: true;
    readonly strictOccurredBeforePrediction: true;
    readonly strictAvailableBeforePrediction: true;
    readonly equalTimestampExcluded: true;
    readonly trainOnlyTransforms: true;
    readonly blindBlockFeedbackForbidden: true;
  };
  readonly utilityGate: {
    readonly status: "unresolved";
    readonly deltaHistory: null;
    readonly deltaBasis: null;
    readonly predictiveKeepSimplifyEnabled: false;
  };
  readonly split: {
    readonly protocolId: string;
    readonly frozenAt: string;
    readonly fitCutoff: string;
    readonly fitCompletedAt: string;
    readonly trainingParticipantIds: readonly string[];
    readonly heldOutParticipantIds: readonly string[];
    readonly trainPrefixEventIdsByParticipant: Readonly<Record<string, readonly string[]>>;
    readonly blindTargetEventIds: readonly string[];
    readonly digest: `sha256:${string}`;
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
    readonly featureDigest: `sha256:${string}`;
    readonly predictionBindingDigest: `sha256:${string}`;
  }[];
  readonly predictorArtifacts: readonly SyntheticPredictorArtifactBinding[];
  readonly artifacts: readonly SyntheticArtifactRecord[];
  readonly coverage: SyntheticCoverageSummary;
  readonly contrasts: {
    readonly b3MinusB2: null;
    readonly b3MinusB2Basis: null;
    readonly reason: "synthetic-data-cannot-rank-models";
  };
  readonly attribution: "unresolved-synthetic-only";
  readonly bkt: SyntheticBktManifestBinding;
  readonly decision: {
    readonly status: "disabled-synthetic-only";
    readonly reason: "no-human-outcomes-and-utility-margins-unresolved";
  };
  readonly forbiddenClaims: readonly string[];
};

export function buildSyntheticNativePilotManifest(
  input: BuildSyntheticNativePilotManifestInput,
): SyntheticNativePilotManifest {
  validateCoverage(input.coverage);
  validateBktBinding(input.bkt);
  const predictorArtifacts = validatePredictorArtifacts(input.predictorArtifacts);

  const taskDefinitions = input.tasks
    .map((definition) => ({
      family: definition.family,
      taskId: definition.task.id,
      taskVersion: definition.task.version,
      contentFingerprint: definition.contentFingerprint,
      contextId: definition.contextId,
      stimulusFormGroup: definition.stimulusFormGroup,
    }))
    .sort((left, right) => left.taskId.localeCompare(right.taskId));

  const featureRows = input.rows
    .map((row) => {
      const featureDigest = digestJson({ b2: row.b2, b2Basis: row.b2Basis, b3: row.b3 });
      return {
        participantId: row.participantId,
        targetEventId: row.targetEventId,
        predictionTimestamp: row.predictionTimestamp,
        acceptedHistoryEventIds: Object.freeze([...row.acceptedHistoryEventIds]),
        featureDigest,
        predictionBindingDigest: digestJson({
          participantId: row.participantId,
          targetEventId: row.targetEventId,
          predictionTimestamp: row.predictionTimestamp,
          acceptedHistoryEventIds: row.acceptedHistoryEventIds,
          featureDigest,
        }),
      };
    })
    .sort((left, right) => left.targetEventId.localeCompare(right.targetEventId));

  const trainPrefixEventIdsByParticipant = Object.fromEntries(
    Object.entries(input.protocol.trainPrefixEventIdsByParticipant)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([participantId, eventIds]) => [participantId, Object.freeze([...eventIds].sort())]),
  );
  const splitWithoutDigest = {
    protocolId: input.protocol.protocolId,
    frozenAt: input.protocol.frozenAt,
    fitCutoff: input.protocol.fitCutoff,
    fitCompletedAt: input.protocol.fitCompletedAt,
    trainingParticipantIds: Object.freeze([...input.protocol.trainingParticipantIds].sort()),
    heldOutParticipantIds: Object.freeze([...input.protocol.heldOutParticipantIds].sort()),
    trainPrefixEventIdsByParticipant: Object.freeze(trainPrefixEventIdsByParticipant),
    blindTargetEventIds: Object.freeze([...input.protocol.blindTargetEventIds].sort()),
  };
  const split = Object.freeze({
    ...splitWithoutDigest,
    digest: digestJson(splitWithoutDigest),
  });

  const artifacts = Object.freeze(
    [...input.artifacts]
      .map((artifact) =>
        Object.freeze({
          ...artifact,
          participantIds: Object.freeze([...artifact.participantIds].sort()),
          dependsOnArtifactIds: Object.freeze([...artifact.dependsOnArtifactIds].sort()),
        }),
      )
      .sort((left, right) => left.artifactId.localeCompare(right.artifactId)),
  );

  const manifestWithoutDigest = Object.freeze({
    status: SYNTHETIC_ONLY_STATUS,
    pilotContractId: NATIVE_PILOT_CONTRACT_ID,
    predictorContractId: NATIVE_PREDICTOR_CONTRACT_ID,
    decisionRuleId: NATIVE_DECISION_RULE_ID,
    dataPolicy: Object.freeze({
      source: "synthetic-only" as const,
      humanDataIncluded: false as const,
      externalCorpusRowsIncluded: false as const,
      redistributionDecision: "not-applicable" as const,
    }),
    sourceBindings: NATIVE_SOURCE_BINDINGS,
    predictor: NATIVE_PREDICTOR_SETTINGS,
    metrics: NATIVE_METRIC_SETTINGS,
    featurePolicy: NATIVE_FEATURE_POLICY,
    causalPolicy: Object.freeze({
      currentOutcomeForbidden: true as const,
      futureOutcomeForbidden: true as const,
      strictOccurredBeforePrediction: true as const,
      strictAvailableBeforePrediction: true as const,
      equalTimestampExcluded: true as const,
      trainOnlyTransforms: true as const,
      blindBlockFeedbackForbidden: true as const,
    }),
    utilityGate: Object.freeze({
      status: "unresolved" as const,
      deltaHistory: null,
      deltaBasis: null,
      predictiveKeepSimplifyEnabled: false as const,
    }),
    split,
    taskDefinitions: Object.freeze(taskDefinitions),
    featureRows: Object.freeze(featureRows),
    predictorArtifacts,
    artifacts,
    coverage: Object.freeze({ ...input.coverage }),
    contrasts: Object.freeze({
      b3MinusB2: null,
      b3MinusB2Basis: null,
      reason: "synthetic-data-cannot-rank-models" as const,
    }),
    attribution: "unresolved-synthetic-only" as const,
    bkt: Object.freeze({ ...input.bkt }),
    decision: Object.freeze({
      status: "disabled-synthetic-only" as const,
      reason: "no-human-outcomes-and-utility-margins-unresolved" as const,
    }),
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

  return Object.freeze({
    ...manifestWithoutDigest,
    manifestDigest: digestJson(manifestWithoutDigest),
  });
}
