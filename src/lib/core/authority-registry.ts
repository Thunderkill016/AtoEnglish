import type { CommunicationActivity, CoreSourceRef } from "./domain";
import {
  type CalibrationProfile,
  type CoreObservation,
  canAffectDurableAssessment,
} from "./observation";
import type { CoreTaskSpec } from "./task";

export const EVIDENCE_LAYERS = [
  "layer0-repository-reference",
  "layer1-benchmark-calibration",
  "layer2-human-adjudicated",
  "layer3-durable-learner-authority",
] as const;

export type EvidenceLayer = (typeof EVIDENCE_LAYERS)[number];

export type RegisteredBenchmarkArtifact = {
  benchmarkId: string;
  version: string;
  immutableFingerprint: string;
  evidenceLayer: "layer1-benchmark-calibration" | "layer2-human-adjudicated";
  sourceReferences: CoreSourceRef[];
  sampleSize: number;
  adjudicationProtocol?: string;
  createdAt: string;
};

export const AUTHORITY_GRANT_STATUSES = [
  "active",
  "revoked",
  "superseded",
  "expired",
] as const;

export type AuthorityGrantStatus = (typeof AUTHORITY_GRANT_STATUSES)[number];

export type EvaluatorBinding = {
  evaluatorId: string;
  evaluatorKind: "deterministic" | "model" | "human" | "hybrid";
  modelFingerprint: string;
  runtimeFingerprint?: string;
  configurationId?: string;
};

export type AuthorityScope = CalibrationProfile["scope"];

export type RegisteredAuthorityGrant = {
  grantId: string;
  grantVersion: string;
  status: AuthorityGrantStatus;
  benchmarkArtifact: RegisteredBenchmarkArtifact;
  evaluatorBinding: EvaluatorBinding;
  scope: AuthorityScope;
  decision: "assessment" | "mastery";
  authority: "assessment-candidate" | "mastery-candidate";
  validFrom: string;
  validUntil?: string;
  supersededByGrantId?: string;
  revokedAt?: string;
  revocationReason?: string;
  calibratedScoreMappingPolicyId?: string;
};

export const AUTHORITY_REJECTION_REASONS = [
  "grant-not-found",
  "grant-inactive-revoked",
  "grant-inactive-superseded",
  "grant-inactive-expired",
  "grant-not-yet-valid",
  "benchmark-not-found",
  "benchmark-fingerprint-mismatch",
  "evaluator-identity-mismatch",
  "evaluator-kind-mismatch",
  "model-fingerprint-mismatch",
  "runtime-fingerprint-mismatch",
  "activity-scope-mismatch",
  "construct-scope-mismatch",
  "population-scope-mismatch",
  "noise-class-unsupported",
  "snr-below-minimum",
  "device-class-unsupported",
  "prompt-context-unsupported",
  "decision-mismatch",
  "authority-mismatch",
  "observation-not-authoritative",
  "unvalidated-reference-cannot-claim-authority",
] as const;

export type AuthorityRejectionReason = (typeof AUTHORITY_REJECTION_REASONS)[number];

export type AuthorityResolutionRequest = {
  grantId: string;
  observation: CoreObservation;
  task: CoreTaskSpec;
  atTimestamp?: string;
};

const RESOLVED_BRAND = Symbol("nep.resolved-calibration-authority");

export type ResolvedCalibrationAuthority = {
  readonly [RESOLVED_BRAND]: true;
  readonly grantId: string;
  readonly grantVersion: string;
  readonly benchmarkId: string;
  readonly benchmarkFingerprint: string;
  readonly modelFingerprint: string;
  readonly authority: "assessment-candidate" | "mastery-candidate";
  readonly decision: "assessment" | "mastery";
  readonly scope: AuthorityScope;
  readonly resolvedAt: string;
  readonly calibratedScoreMappingPolicyId?: string;
};

export type AuthorityResolutionResult =
  | { ok: true; resolvedGrant: ResolvedCalibrationAuthority }
  | { ok: false; reasonCodes: AuthorityRejectionReason[] };

export function isResolvedCalibrationAuthority(
  value: unknown,
): value is ResolvedCalibrationAuthority {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string | symbol, unknown>;
  if (candidate[RESOLVED_BRAND] !== true) return false;

  return (
    typeof candidate.grantId === "string" &&
    candidate.grantId.length > 0 &&
    typeof candidate.grantVersion === "string" &&
    typeof candidate.benchmarkId === "string" &&
    candidate.benchmarkId.length > 0 &&
    typeof candidate.benchmarkFingerprint === "string" &&
    candidate.benchmarkFingerprint.length > 0 &&
    typeof candidate.modelFingerprint === "string" &&
    candidate.modelFingerprint.length > 0 &&
    (candidate.authority === "assessment-candidate" ||
      candidate.authority === "mastery-candidate") &&
    (candidate.decision === "assessment" || candidate.decision === "mastery") &&
    typeof candidate.scope === "object" &&
    candidate.scope !== null &&
    typeof candidate.resolvedAt === "string"
  );
}

export interface ProvenanceAuthorityRegistry {
  lookupGrant(grantId: string): RegisteredAuthorityGrant | undefined;
  lookupBenchmark(benchmarkId: string): RegisteredBenchmarkArtifact | undefined;
  listActiveGrantsForConstruct(construct: string): RegisteredAuthorityGrant[];
}

export function createProvenanceAuthorityRegistry(
  grants: readonly RegisteredAuthorityGrant[],
  benchmarks?: readonly RegisteredBenchmarkArtifact[],
): ProvenanceAuthorityRegistry {
  const grantMap = new Map<string, RegisteredAuthorityGrant>();
  const benchmarkMap = new Map<string, RegisteredBenchmarkArtifact>();

  if (benchmarks) {
    for (const b of benchmarks) {
      benchmarkMap.set(b.benchmarkId, b);
    }
  }

  for (const g of grants) {
    grantMap.set(g.grantId, g);
    if (!benchmarkMap.has(g.benchmarkArtifact.benchmarkId)) {
      benchmarkMap.set(g.benchmarkArtifact.benchmarkId, g.benchmarkArtifact);
    }
  }

  return {
    lookupGrant(grantId: string) {
      return grantMap.get(grantId);
    },
    lookupBenchmark(benchmarkId: string) {
      return benchmarkMap.get(benchmarkId);
    },
    listActiveGrantsForConstruct(construct: string) {
      return Array.from(grantMap.values()).filter(
        (g) => g.status === "active" && g.scope.construct === construct,
      );
    },
  };
}

/**
 * Pure, fail-closed resolver for durable calibration authority.
 *
 * Epistemic Invariants:
 * 1. No self-certification: Observations, evaluators, and candidates cannot mint authority.
 * 2. Immutable provenance binding: Benchmark fingerprint, model weights fingerprint,
 *    and runtime environment must match the registered grant exactly.
 * 3. Scope containment: Activity, construct, population tags, and physical audio constraints
 *    must fall entirely within the calibrated envelope.
 * 4. Lifecycle state: Revoked, superseded, or expired grants immediately fail closed.
 */
export function resolveCalibrationAuthority(
  request: AuthorityResolutionRequest,
  registry: ProvenanceAuthorityRegistry,
): AuthorityResolutionResult {
  const reasonCodes: AuthorityRejectionReason[] = [];
  const { grantId, observation, task } = request;

  const grant = registry.lookupGrant(grantId);
  if (!grant) {
    return { ok: false, reasonCodes: ["grant-not-found"] };
  }

  // 1. Reference separation
  if (
    observation.calibration.validationState === "unvalidated" ||
    observation.authority === "none"
  ) {
    reasonCodes.push("unvalidated-reference-cannot-claim-authority");
  }

  // 2. Lifecycle validation
  if (grant.status === "revoked") {
    reasonCodes.push("grant-inactive-revoked");
  } else if (grant.status === "superseded") {
    reasonCodes.push("grant-inactive-superseded");
  } else if (grant.status === "expired") {
    reasonCodes.push("grant-inactive-expired");
  }

  const effectiveTime = request.atTimestamp ?? observation.createdAt ?? new Date().toISOString();
  if (grant.validFrom && effectiveTime < grant.validFrom) {
    reasonCodes.push("grant-not-yet-valid");
  }
  if (grant.validUntil && effectiveTime > grant.validUntil) {
    reasonCodes.push("grant-inactive-expired");
  }

  // 3. Benchmark provenance verification
  const registeredBenchmark = registry.lookupBenchmark(grant.benchmarkArtifact.benchmarkId);
  if (!registeredBenchmark) {
    reasonCodes.push("benchmark-not-found");
  } else if (
    registeredBenchmark.benchmarkId !== observation.calibration.benchmarkId ||
    registeredBenchmark.immutableFingerprint !== grant.benchmarkArtifact.immutableFingerprint
  ) {
    reasonCodes.push("benchmark-fingerprint-mismatch");
  }

  // 4. Exact evaluator, model, and runtime fingerprint binding
  const { evaluatorBinding } = grant;
  if (observation.provenance.evaluator !== evaluatorBinding.evaluatorId) {
    reasonCodes.push("evaluator-identity-mismatch");
  }
  if (observation.provenance.evaluatorKind !== evaluatorBinding.evaluatorKind) {
    reasonCodes.push("evaluator-kind-mismatch");
  }
  if (observation.calibration.modelFingerprint !== evaluatorBinding.modelFingerprint) {
    reasonCodes.push("model-fingerprint-mismatch");
  }
  if (
    evaluatorBinding.runtimeFingerprint &&
    observation.provenance.artifact?.runtime !== evaluatorBinding.runtimeFingerprint &&
    observation.provenance.artifact?.sha256 !== evaluatorBinding.runtimeFingerprint
  ) {
    reasonCodes.push("runtime-fingerprint-mismatch");
  }

  // 5. Scoped authority matching
  const { scope } = grant;
  if (task.activity !== scope.activity || observation.activity !== scope.activity) {
    reasonCodes.push("activity-scope-mismatch");
  }
  if (observation.context.construct !== scope.construct) {
    reasonCodes.push("construct-scope-mismatch");
  }
  if (
    !scope.requiredPopulationTags.every((tag) =>
      observation.context.populationTags.includes(tag),
    )
  ) {
    reasonCodes.push("population-scope-mismatch");
  }

  if (scope.allowedNoiseClasses) {
    if (
      !observation.context.noiseClass ||
      !scope.allowedNoiseClasses.includes(observation.context.noiseClass)
    ) {
      reasonCodes.push("noise-class-unsupported");
    }
  }

  if (scope.minimumSnrDb !== undefined) {
    if (
      observation.context.snrDb === null ||
      observation.context.snrDb === undefined ||
      observation.context.snrDb < scope.minimumSnrDb
    ) {
      reasonCodes.push("snr-below-minimum");
    }
  }

  if (scope.allowedDeviceClasses) {
    if (
      !observation.context.deviceClass ||
      !scope.allowedDeviceClasses.includes(observation.context.deviceClass)
    ) {
      reasonCodes.push("device-class-unsupported");
    }
  }

  if (scope.allowedPromptContexts) {
    if (
      !observation.context.promptContext ||
      !scope.allowedPromptContexts.includes(observation.context.promptContext)
    ) {
      reasonCodes.push("prompt-context-unsupported");
    }
  }

  // 6. Decision & authority matching
  if (grant.decision !== observation.calibration.decision) {
    reasonCodes.push("decision-mismatch");
  }
  if (grant.authority !== observation.authority) {
    reasonCodes.push("authority-mismatch");
  }

  // 7. Authority gate
  if (!canAffectDurableAssessment(observation)) {
    reasonCodes.push("observation-not-authoritative");
  }

  if (reasonCodes.length > 0) {
    return { ok: false, reasonCodes };
  }

  const resolvedGrant: ResolvedCalibrationAuthority = {
    [RESOLVED_BRAND]: true,
    grantId: grant.grantId,
    grantVersion: grant.grantVersion,
    benchmarkId: grant.benchmarkArtifact.benchmarkId,
    benchmarkFingerprint: grant.benchmarkArtifact.immutableFingerprint,
    modelFingerprint: grant.evaluatorBinding.modelFingerprint,
    authority: grant.authority,
    decision: grant.decision,
    scope: grant.scope,
    resolvedAt: new Date().toISOString(),
    calibratedScoreMappingPolicyId: grant.calibratedScoreMappingPolicyId,
  };

  return { ok: true, resolvedGrant };
}
