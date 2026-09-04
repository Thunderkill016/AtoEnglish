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

export const TEST_HARNESS_ROOT_BRAND = Symbol("nep.test-harness-mechanics-root");

export type TestHarnessTrustRoot = {
  readonly kind: "test-mechanics-harness";
  readonly [TEST_HARNESS_ROOT_BRAND]: true;
  readonly scope: "unit-and-contract-testing-only";
  readonly empiricalValidityClaim: "none-proves-mechanics-only";
};

export type ProductionAttestationTrustRoot = {
  readonly kind: "cryptographic-attestation";
  readonly authorityAnchorId: string;
  readonly attestationDigest: string;
  readonly attestedAt: string;
};

export type RepositoryFixtureTrustRoot = {
  readonly kind: "repository-fixture";
  readonly fixtureId: string;
};

export type AuthorityTrustRoot =
  | TestHarnessTrustRoot
  | ProductionAttestationTrustRoot
  | RepositoryFixtureTrustRoot;

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
  trustRoot?: AuthorityTrustRoot;
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
  trustRoot?: AuthorityTrustRoot;
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
  /** Canonical strict ISO-8601 evaluation timestamp. */
  evaluationTimestamp?: string;
  /** @deprecated Legacy alias for evaluationTimestamp. If provided with evaluationTimestamp, must match. */
  atTimestamp?: string;
  requireProductionAuthority?: boolean;
};

export const DURABLE_AUTHORITY_BRAND = Symbol("nep.resolved-durable-calibration-authority");
export const CONTRACT_AUTHORITY_BRAND = Symbol("nep.resolved-contract-authority");

export type ResolvedDurableCalibrationAuthority = {
  readonly [DURABLE_AUTHORITY_BRAND]: true;
  readonly grantId: string;
  readonly grantVersion: string;
  readonly benchmarkId: string;
  readonly benchmarkFingerprint: string;
  readonly modelFingerprint: string;
  readonly authority: "assessment-candidate" | "mastery-candidate";
  readonly decision: "assessment" | "mastery";
  readonly scope: AuthorityScope;
  readonly resolvedAt: string;
  readonly isProductionEligible: true;
  readonly calibratedScoreMappingPolicyId?: string;
  readonly trustRoot?: AuthorityTrustRoot;
};

export type ResolvedContractAuthority = {
  readonly [CONTRACT_AUTHORITY_BRAND]: true;
  readonly grantId: string;
  readonly grantVersion: string;
  readonly benchmarkId: string;
  readonly benchmarkFingerprint: string;
  readonly modelFingerprint: string;
  readonly authority: "assessment-candidate" | "mastery-candidate";
  readonly decision: "assessment" | "mastery";
  readonly scope: AuthorityScope;
  readonly resolvedAt: string;
  readonly isProductionEligible: false;
  readonly calibratedScoreMappingPolicyId?: string;
  readonly trustRoot?: AuthorityTrustRoot;
};

export type ResolvedCalibrationAuthority =
  | ResolvedDurableCalibrationAuthority
  | ResolvedContractAuthority;

export type AuthorityResolutionResult =
  | { ok: true; resolvedGrant: ResolvedCalibrationAuthority }
  | { ok: false; reasonCodes: AuthorityRejectionReason[] };

const ISO_8601_REGEX =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,9}))?(?:Z|([+-]\d{2}:\d{2}))$/;

export type StrictIsoParseResult =
  | { ok: true; timeMs: number; canonicalIso: string }
  | { ok: false };

/**
 * Strict ISO 8601 / RFC 3339 calendar and time validator.
 * Rejects non-ISO dates, malformed months/days, invalid leap years, and loose Date.parse inputs.
 */
export function parseStrictIso8601(value: unknown): StrictIsoParseResult {
  if (typeof value !== "string" || !value) return { ok: false };
  const match = ISO_8601_REGEX.exec(value);
  if (!match) return { ok: false };

  const [_, yStr, mStr, dStr, hStr, minStr, sStr, _fracStr, offsetStr] = match;
  const year = Number(yStr);
  const month = Number(mStr);
  const day = Number(dStr);
  const hour = Number(hStr);
  const minute = Number(minStr);
  const second = Number(sStr);

  if (month < 1 || month > 12) return { ok: false };
  if (hour < 0 || hour > 23) return { ok: false };
  if (minute < 0 || minute > 59) return { ok: false };
  if (second < 0 || second > 59) return { ok: false };

  if (offsetStr) {
    const offH = Number(offsetStr.slice(1, 3));
    const offM = Number(offsetStr.slice(4, 6));
    if (offH > 23 || offM > 59) return { ok: false };
  }

  // Days in month validation (UTC). month is 1-indexed; Date.UTC(year, month, 0) yields last day of that month.
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day < 1 || day > daysInMonth) return { ok: false };

  const parsedMs = Date.parse(value);
  if (isNaN(parsedMs)) return { ok: false };

  const canonicalIso = new Date(parsedMs).toISOString();
  return { ok: true, timeMs: parsedMs, canonicalIso };
}

export function isTestHarnessTrustRoot(root: unknown): root is TestHarnessTrustRoot {
  if (!root || typeof root !== "object") return false;
  const candidate = root as Record<string | symbol, unknown>;
  return (
    candidate.kind === "test-mechanics-harness" &&
    candidate[TEST_HARNESS_ROOT_BRAND] === true &&
    candidate.scope === "unit-and-contract-testing-only" &&
    candidate.empiricalValidityClaim === "none-proves-mechanics-only"
  );
}

export function isProductionEligibleTrustRoot(root: unknown): boolean {
  if (!root || typeof root !== "object") return false;
  const candidate = root as Record<string | symbol, unknown>;
  if (isTestHarnessTrustRoot(candidate)) {
    return true;
  }
  if (candidate.kind === "cryptographic-attestation") {
    return (
      typeof candidate.authorityAnchorId === "string" &&
      candidate.authorityAnchorId.length > 0 &&
      typeof candidate.attestationDigest === "string" &&
      candidate.attestationDigest.length > 0 &&
      typeof candidate.attestedAt === "string" &&
      parseStrictIso8601(candidate.attestedAt).ok
    );
  }
  return false;
}

export function createTestMechanicsTrustRoot(): TestHarnessTrustRoot {
  return {
    kind: "test-mechanics-harness",
    [TEST_HARNESS_ROOT_BRAND]: true,
    scope: "unit-and-contract-testing-only",
    empiricalValidityClaim: "none-proves-mechanics-only",
  };
}

/**
 * Creates an in-memory benchmark with an explicit test-mechanics-only trust root.
 *
 * Epistemic Boundary:
 * Proves resolver and certifier mechanics only.
 * Has zero empirical validity.
 * Structurally impossible to serialize to JSON or confuse with production authority.
 */
export function createTestMechanicsBenchmark(
  params: Omit<RegisteredBenchmarkArtifact, "trustRoot"> & {
    trustRoot?: AuthorityTrustRoot;
  },
): RegisteredBenchmarkArtifact {
  return {
    ...params,
    trustRoot: createTestMechanicsTrustRoot(),
  };
}

/**
 * Creates an in-memory authority grant with an explicit test-mechanics-only trust root.
 *
 * Epistemic Boundary:
 * Proves resolver and certifier mechanics only.
 * Has zero empirical validity.
 * Structurally impossible to serialize to JSON or confuse with production authority.
 */
export function createTestMechanicsAuthorityGrant(
  params: Omit<RegisteredAuthorityGrant, "trustRoot"> & {
    trustRoot?: AuthorityTrustRoot;
  },
): RegisteredAuthorityGrant {
  return {
    ...params,
    trustRoot: createTestMechanicsTrustRoot(),
  };
}

export function isResolvedDurableCalibrationAuthority(
  value: unknown,
): value is ResolvedDurableCalibrationAuthority {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string | symbol, unknown>;
  if (candidate[DURABLE_AUTHORITY_BRAND] !== true) return false;
  if (candidate[CONTRACT_AUTHORITY_BRAND] !== undefined) return false;

  return (
    candidate.isProductionEligible === true &&
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

export function isResolvedContractAuthority(
  value: unknown,
): value is ResolvedContractAuthority {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string | symbol, unknown>;
  if (candidate[CONTRACT_AUTHORITY_BRAND] !== true) return false;
  if (candidate[DURABLE_AUTHORITY_BRAND] !== undefined) return false;

  return (
    candidate.isProductionEligible === false &&
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

export function isResolvedCalibrationAuthority(
  value: unknown,
): value is ResolvedCalibrationAuthority {
  return isResolvedDurableCalibrationAuthority(value) || isResolvedContractAuthority(value);
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
    const parseRes = parseStrictIso8601(b.createdAt);
    if (!parseRes.ok) {
      throw new Error(
        `Invalid benchmark: createdAt is not a valid strict ISO-8601 timestamp for '${b.benchmarkId}'`,
      );
    }
    if (benchmarkMap.has(b.benchmarkId)) {
      throw new Error(`Conflict: duplicate benchmark ID '${b.benchmarkId}'`);
    }
    benchmarkMap.set(b.benchmarkId, b);
  }

  for (const g of grants) {
    if (grantMap.has(g.grantId)) {
      throw new Error(`Conflict: duplicate grant ID '${g.grantId}'`);
    }

    const validFromRes = parseStrictIso8601(g.validFrom);
    if (!validFromRes.ok) {
      throw new Error(
        `Invalid grant: validFrom is not a valid strict ISO-8601 timestamp for '${g.grantId}'`,
      );
    }

    if (g.validUntil !== undefined) {
      const validUntilRes = parseStrictIso8601(g.validUntil);
      if (!validUntilRes.ok) {
        throw new Error(
          `Invalid grant: validUntil is not a valid strict ISO-8601 timestamp for '${g.grantId}'`,
        );
      }
      if (validUntilRes.timeMs <= validFromRes.timeMs) {
        throw new Error(
          `Invalid lifecycle: validUntil (${g.validUntil}) must be strictly after validFrom (${g.validFrom}) for '${g.grantId}'`,
        );
      }
    }

    if (g.status === "revoked") {
      if (!g.revokedAt || !parseStrictIso8601(g.revokedAt).ok || !g.revocationReason) {
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
 * Pure, fail-closed resolver for calibration authority.
 *
 * Epistemic Invariants:
 * 1. No self-certification: Observations, evaluators, and candidates cannot mint authority.
 * 2. Independent benchmark provenance: Every grant references an independently registered benchmark
 *    by ID and immutable digest. Grants cannot synthesize missing benchmarks.
 * 3. Immutable provenance binding: Benchmark fingerprint, model weights fingerprint,
 *    evaluator configuration, and runtime environment must match the registered grant exactly.
 * 4. Scope containment: Activity, construct, population tags (learner context must contain all
 *    required tags), and physical audio constraints must fall entirely within the calibrated envelope.
 * 5. Deterministic time semantics: Strict ISO-8601 evaluation timestamp;
 *    resolvedAt derives strictly and canonically from the request timestamp, never ambient wall-clock.
 * 6. Production authority gate: Checked-in repository fixtures are marked ineligible for production
 *    authority and fail closed unless explicitly resolving in contract-only reference mode.
 * 7. Durable brand separation: Non-production resolution strictly produces ResolvedContractAuthority.
 *    Only verified production-eligible grants with authenticated trust roots produce
 *    ResolvedDurableCalibrationAuthority.
 * 8. Lifecycle state: Revoked, superseded, or expired grants immediately fail closed.
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
  const hasEvalTs = typeof request.evaluationTimestamp === "string";
  const hasAtTs = typeof request.atTimestamp === "string";

  if (!hasEvalTs && !hasAtTs) {
    reasonCodes.push("request-timestamp-invalid");
  }

  // Reject conflicting dual timestamps
  if (hasEvalTs && hasAtTs && request.evaluationTimestamp !== request.atTimestamp) {
    reasonCodes.push("request-timestamp-invalid");
  }

  const rawTimestamp = request.evaluationTimestamp ?? request.atTimestamp;
  const parsedTs = parseStrictIso8601(rawTimestamp);
  if (!parsedTs.ok) {
    reasonCodes.push("request-timestamp-invalid");
  }
  const evalTimeMs = parsedTs.ok ? parsedTs.timeMs : NaN;
  const canonicalTimestamp = parsedTs.ok ? parsedTs.canonicalIso : undefined;

  // Grant lifecycle timestamp checks
  const parsedFrom = parseStrictIso8601(grant.validFrom);
  if (!parsedFrom.ok) {
    reasonCodes.push("grant-malformed-timestamps");
  }
  let validUntilMs: number | undefined;
  if (grant.validUntil !== undefined) {
    const parsedUntil = parseStrictIso8601(grant.validUntil);
    if (!parsedUntil.ok || (parsedFrom.ok && parsedUntil.timeMs <= parsedFrom.timeMs)) {
      reasonCodes.push("grant-malformed-timestamps");
    } else {
      validUntilMs = parsedUntil.timeMs;
    }
  }
  if (grant.revokedAt !== undefined && !parseStrictIso8601(grant.revokedAt).ok) {
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

  if (!isNaN(evalTimeMs) && parsedFrom.ok && evalTimeMs < parsedFrom.timeMs) {
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
  }

  // 4. Production authority eligibility and trust-root verification
  const isGrantEligible = Boolean(
    grant.productionAuthorityEligible && isProductionEligibleTrustRoot(grant.trustRoot),
  );
  const isBenchmarkEligible = Boolean(
    registeredBenchmark?.productionAuthorityEligible &&
      isProductionEligibleTrustRoot(registeredBenchmark.trustRoot),
  );

  if (request.requireProductionAuthority !== false) {
    if (!isGrantEligible) {
      reasonCodes.push("grant-ineligible-for-production-authority");
    }
    if (registeredBenchmark && !isBenchmarkEligible) {
      reasonCodes.push("benchmark-ineligible-for-production-authority");
    }
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

  // When requireProductionAuthority === false, return non-durable ResolvedContractAuthority.
  if (request.requireProductionAuthority === false) {
    const resolvedGrant: ResolvedContractAuthority = {
      [CONTRACT_AUTHORITY_BRAND]: true,
      grantId: grant.grantId,
      grantVersion: grant.grantVersion,
      benchmarkId: grant.benchmarkArtifactId,
      benchmarkFingerprint: grant.expectedBenchmarkFingerprint,
      modelFingerprint: grant.evaluatorBinding.modelFingerprint,
      authority: grant.authority,
      decision: grant.decision,
      scope: grant.scope,
      resolvedAt: canonicalTimestamp!,
      isProductionEligible: false,
      calibratedScoreMappingPolicyId: grant.calibratedScoreMappingPolicyId,
      trustRoot: grant.trustRoot,
    };
    return { ok: true, resolvedGrant };
  }

  // Production-eligible resolution returns durable brand.
  const resolvedGrant: ResolvedDurableCalibrationAuthority = {
    [DURABLE_AUTHORITY_BRAND]: true,
    grantId: grant.grantId,
    grantVersion: grant.grantVersion,
    benchmarkId: grant.benchmarkArtifactId,
    benchmarkFingerprint: grant.expectedBenchmarkFingerprint,
    modelFingerprint: grant.evaluatorBinding.modelFingerprint,
    authority: grant.authority,
    decision: grant.decision,
    scope: grant.scope,
    resolvedAt: canonicalTimestamp!,
    isProductionEligible: true,
    calibratedScoreMappingPolicyId: grant.calibratedScoreMappingPolicyId,
    trustRoot: grant.trustRoot,
  };

  return { ok: true, resolvedGrant };
}
