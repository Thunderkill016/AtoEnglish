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
  evidenceLayer: EvidenceLayer;
  sourceReferences: CoreSourceRef[];
  sampleSize: number;
  adjudicationProtocol?: string;
  createdAt: string;
  productionAuthorityEligible: boolean;
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
  benchmarkArtifactId: string;
  expectedBenchmarkFingerprint: string;
  expectedBenchmarkVersion: string;
  productionAuthorityEligible: boolean;
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
  "grant-ineligible-for-production-authority",
  "grant-malformed-timestamps",
  "grant-lifecycle-incoherent",
  "benchmark-not-found",
  "benchmark-fingerprint-mismatch",
  "benchmark-version-mismatch",
  "benchmark-ineligible-for-production-authority",
  "evaluator-identity-mismatch",
  "evaluator-kind-mismatch",
  "evaluator-configuration-mismatch",
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
  "request-timestamp-invalid",
] as const;

export type AuthorityRejectionReason = (typeof AUTHORITY_REJECTION_REASONS)[number];

export type AuthorityResolutionRequest = {
  grantId: string;
  observation: CoreObservation;
  task: CoreTaskSpec;
  evaluationTimestamp?: string;
  atTimestamp?: string;
  requireProductionAuthority?: boolean;
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
  readonly isProductionEligible: boolean;
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
    typeof candidate.resolvedAt === "string" &&
    typeof candidate.isProductionEligible === "boolean"
  );
}

export interface ProvenanceAuthorityRegistry {
  lookupGrant(grantId: string): RegisteredAuthorityGrant | undefined;
  lookupBenchmark(benchmarkId: string): RegisteredBenchmarkArtifact | undefined;
  listActiveGrantsForConstruct(construct: string): RegisteredAuthorityGrant[];
}

export type ProvenanceAuthorityRegistryInput = {
  benchmarks?: readonly RegisteredBenchmarkArtifact[];
  grants?: readonly RegisteredAuthorityGrant[];
};

export function createProvenanceAuthorityRegistry(
  input: ProvenanceAuthorityRegistryInput | readonly RegisteredAuthorityGrant[],
  legacyBenchmarks?: readonly RegisteredBenchmarkArtifact[],
): ProvenanceAuthorityRegistry {
  let grants: readonly RegisteredAuthorityGrant[];
  let benchmarks: readonly RegisteredBenchmarkArtifact[];

  if (Array.isArray(input)) {
    grants = input;
    benchmarks = legacyBenchmarks ?? [];
  } else {
    const inputObj = input as ProvenanceAuthorityRegistryInput;
    grants = inputObj.grants ?? [];
    benchmarks = inputObj.benchmarks ?? [];
  }

  const grantMap = new Map<string, RegisteredAuthorityGrant>();
  const benchmarkMap = new Map<string, RegisteredBenchmarkArtifact>();

  for (const b of benchmarks) {
    if (isNaN(Date.parse(b.createdAt))) {
      throw new Error(
        `Invalid benchmark: createdAt is not a valid timestamp for '${b.benchmarkId}'`,
      );
    }
    const existing = benchmarkMap.get(b.benchmarkId);
    if (existing) {
      if (
        existing.immutableFingerprint !== b.immutableFingerprint ||
        existing.version !== b.version
      ) {
        throw new Error(
          `Conflict: duplicate benchmark ID '${b.benchmarkId}' with conflicting fingerprint or version`,
        );
      }
    } else {
      benchmarkMap.set(b.benchmarkId, b);
    }
  }

  for (const g of grants) {
    if (grantMap.has(g.grantId)) {
      throw new Error(`Conflict: duplicate grant ID '${g.grantId}'`);
    }

    const validFromMs = Date.parse(g.validFrom);
    if (isNaN(validFromMs)) {
      throw new Error(
        `Invalid grant: validFrom is not a valid timestamp for '${g.grantId}'`,
      );
    }

    if (g.validUntil !== undefined) {
      const validUntilMs = Date.parse(g.validUntil);
      if (isNaN(validUntilMs)) {
        throw new Error(
          `Invalid grant: validUntil is not a valid timestamp for '${g.grantId}'`,
        );
      }
      if (validUntilMs <= validFromMs) {
        throw new Error(
          `Invalid lifecycle: validUntil (${g.validUntil}) must be strictly after validFrom (${g.validFrom}) for '${g.grantId}'`,
        );
      }
    }

    if (g.status === "revoked") {
      if (!g.revokedAt || isNaN(Date.parse(g.revokedAt)) || !g.revocationReason) {
        throw new Error(
          `Lifecycle incoherence: revoked grant '${g.grantId}' requires valid revokedAt and revocationReason`,
        );
      }
    } else if (g.status === "superseded") {
      if (!g.supersededByGrantId) {
        throw new Error(
          `Lifecycle incoherence: superseded grant '${g.grantId}' requires supersededByGrantId`,
        );
      }
    }

    // STRICT INVARIANT: NEVER auto-register missing benchmarks from grants!
    grantMap.set(g.grantId, g);
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
 * 2. Independent benchmark provenance: Every grant references an independently registered benchmark
 *    by ID and immutable digest. Grants cannot synthesize missing benchmarks.
 * 3. Immutable provenance binding: Benchmark fingerprint, model weights fingerprint,
 *    evaluator configuration, and runtime environment must match the registered grant exactly.
 * 4. Scope containment: Activity, construct, population tags (learner context must contain all
 *    required tags), and physical audio constraints must fall entirely within the calibrated envelope.
 * 5. Deterministic time semantics: Evaluation timestamp is explicit and parsed as a timestamp;
 *    resolvedAt derives strictly from the request timestamp, never ambient wall-clock.
 * 6. Production authority gate: Checked-in repository fixtures are marked ineligible for production
 *    authority and fail closed unless explicitly resolving in a test-only harness.
 * 7. Lifecycle state: Revoked, superseded, or expired grants immediately fail closed.
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

  // 2. Strict evaluation timestamp & deterministic time semantics
  const rawTimestamp = request.evaluationTimestamp ?? request.atTimestamp;
  if (!rawTimestamp || typeof rawTimestamp !== "string") {
    reasonCodes.push("request-timestamp-invalid");
  }
  const evalTimeMs = rawTimestamp ? Date.parse(rawTimestamp) : NaN;
  if (isNaN(evalTimeMs)) {
    reasonCodes.push("request-timestamp-invalid");
  }

  // Grant lifecycle timestamp checks
  const validFromMs = Date.parse(grant.validFrom);
  if (isNaN(validFromMs)) {
    reasonCodes.push("grant-malformed-timestamps");
  }
  let validUntilMs: number | undefined;
  if (grant.validUntil !== undefined) {
    validUntilMs = Date.parse(grant.validUntil);
    if (isNaN(validUntilMs) || (!isNaN(validFromMs) && validUntilMs <= validFromMs)) {
      reasonCodes.push("grant-malformed-timestamps");
    }
  }
  if (grant.revokedAt !== undefined && isNaN(Date.parse(grant.revokedAt))) {
    reasonCodes.push("grant-malformed-timestamps");
  }

  // Grant lifecycle status & coherence
  if (grant.status === "revoked") {
    if (!grant.revokedAt || !grant.revocationReason) {
      reasonCodes.push("grant-lifecycle-incoherent");
    }
    reasonCodes.push("grant-inactive-revoked");
  } else if (grant.status === "superseded") {
    if (!grant.supersededByGrantId) {
      reasonCodes.push("grant-lifecycle-incoherent");
    }
    reasonCodes.push("grant-inactive-superseded");
  } else if (grant.status === "expired") {
    reasonCodes.push("grant-inactive-expired");
  }

  if (!isNaN(evalTimeMs) && !isNaN(validFromMs) && evalTimeMs < validFromMs) {
    reasonCodes.push("grant-not-yet-valid");
  }
  if (
    !isNaN(evalTimeMs) &&
    validUntilMs !== undefined &&
    !isNaN(validUntilMs) &&
    evalTimeMs > validUntilMs
  ) {
    reasonCodes.push("grant-inactive-expired");
  }

  // 3. Benchmark provenance verification
  const registeredBenchmark = registry.lookupBenchmark(grant.benchmarkArtifactId);
  if (!registeredBenchmark) {
    reasonCodes.push("benchmark-not-found");
  } else {
    if (registeredBenchmark.immutableFingerprint !== grant.expectedBenchmarkFingerprint) {
      reasonCodes.push("benchmark-fingerprint-mismatch");
    }
    if (registeredBenchmark.version !== grant.expectedBenchmarkVersion) {
      reasonCodes.push("benchmark-version-mismatch");
    }
    if (registeredBenchmark.benchmarkId !== observation.calibration.benchmarkId) {
      reasonCodes.push("benchmark-fingerprint-mismatch");
    }
    if (
      request.requireProductionAuthority !== false &&
      !registeredBenchmark.productionAuthorityEligible
    ) {
      reasonCodes.push("benchmark-ineligible-for-production-authority");
    }
  }

  // 4. Production authority eligibility gate on grant
  if (request.requireProductionAuthority !== false && !grant.productionAuthorityEligible) {
    reasonCodes.push("grant-ineligible-for-production-authority");
  }

  // 5. Exact evaluator, configuration, model, and canonical runtime fingerprint binding
  const { evaluatorBinding } = grant;
  if (observation.provenance.evaluator !== evaluatorBinding.evaluatorId) {
    reasonCodes.push("evaluator-identity-mismatch");
  }
  if (observation.provenance.evaluatorKind !== evaluatorBinding.evaluatorKind) {
    reasonCodes.push("evaluator-kind-mismatch");
  }
  if (
    evaluatorBinding.configurationId !== undefined &&
    observation.provenance.artifact?.configurationId !== evaluatorBinding.configurationId
  ) {
    reasonCodes.push("evaluator-configuration-mismatch");
  }
  if (observation.calibration.modelFingerprint !== evaluatorBinding.modelFingerprint) {
    reasonCodes.push("model-fingerprint-mismatch");
  }
  if (
    evaluatorBinding.runtimeFingerprint !== undefined &&
    observation.provenance.artifact?.runtime !== evaluatorBinding.runtimeFingerprint
  ) {
    reasonCodes.push("runtime-fingerprint-mismatch");
  }

  // 6. Scoped authority matching (population containment: learner context must contain all required tags)
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

  // 7. Decision & authority matching
  if (grant.decision !== observation.calibration.decision) {
    reasonCodes.push("decision-mismatch");
  }
  if (grant.authority !== observation.authority) {
    reasonCodes.push("authority-mismatch");
  }

  // 8. Authority gate
  if (!canAffectDurableAssessment(observation)) {
    reasonCodes.push("observation-not-authoritative");
  }

  if (reasonCodes.length > 0) {
    return { ok: false, reasonCodes };
  }

  const isProductionEligible = Boolean(
    grant.productionAuthorityEligible && registeredBenchmark?.productionAuthorityEligible,
  );

  const resolvedGrant: ResolvedCalibrationAuthority = {
    [RESOLVED_BRAND]: true,
    grantId: grant.grantId,
    grantVersion: grant.grantVersion,
    benchmarkId: grant.benchmarkArtifactId,
    benchmarkFingerprint: grant.expectedBenchmarkFingerprint,
    modelFingerprint: grant.evaluatorBinding.modelFingerprint,
    authority: grant.authority,
    decision: grant.decision,
    scope: grant.scope,
    resolvedAt: rawTimestamp!,
    isProductionEligible,
    calibratedScoreMappingPolicyId: grant.calibratedScoreMappingPolicyId,
  };

  return { ok: true, resolvedGrant };
}
