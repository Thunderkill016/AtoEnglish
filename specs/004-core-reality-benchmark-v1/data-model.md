# Data Model: Reality Benchmark Harness V1

- **Contract Identifier**: `nep.reality-benchmark.v1`.
- **Governing Purpose**: Define strongly-typed schemas for benchmark ingestion, primary-source prompt metadata, split-aware token representations, canonical and derived Nếp state feature encodings, experiment manifests, and statistical evaluation results.

---

## 1. Raw SLAM Ingestion Entities

### 1.1 `SlamRawPromptHeader`
Metadata line beginning with `#` preceding exercise tokens in the primary source (`Settles et al., 2018`):
`# user:USER countries:COUNTRIES days:DAYS client:CLIENT session:SESSION format:FORMAT time:TIME`

```typescript
export interface SlamRawPromptHeader {
  /** Anonymized user identifier prefixed with 'u:' (e.g. 'u:bkmM') */
  readonly userId: string;
  /** Learner country codes (e.g. ['US', 'MX']) */
  readonly countries: readonly string[];
  /** Integer days since learner started on Duolingo (e.g. 0, 1, 15) */
  readonly days: number;
  /** Client platform: 'web' | 'ios' | 'android' */
  readonly client: "web" | "ios" | "android";
  /** Session type: 'lesson' | 'practice' | 'test' */
  readonly session: "lesson" | "practice" | "test";
  /** Exercise format: 'reverse_translate' | 'reverse_tap' | 'listen' */
  readonly format: "reverse_translate" | "reverse_tap" | "listen";
  /**
   * Exercise response duration in seconds.
   * Null if missing/unlogged in raw trace.
   * Negative values are documented client logging errors in SLAM 2018 and MUST be treated as null (invalid/missing).
   */
  readonly timeSeconds: number | null;
  /** 1-based line index in source dataset file for provenance auditing */
  readonly sourceLineNumber: number;
}
```

### 1.2 `SlamRawTokenLine`
Token-level observation line within an exercise prompt:
- In `train`, token lines contain 7 whitespace-delimited columns.
- In raw `dev` and `test` evaluation input files, token lines contain 6 columns (omitting `label`).

```typescript
export interface SlamRawTokenLine {
  /** Unique token row identifier within the track (e.g. 'Pq4N') */
  readonly tokenId: string;
  /** Surface word or punctuation string (e.g. 'apple', '.') */
  readonly token: string;
  /** Universal Dependencies Part-of-Speech tag (e.g. 'NOUN', 'VERB', 'ADJ') */
  readonly pos: string;
  /** Universal Dependencies morphological features separated by '|' (e.g. ['Number=Sing', 'Person=3']) */
  readonly morphology: readonly string[];
  /** Syntactic dependency edge label (e.g. 'nsubj', 'obj', 'root') */
  readonly depEdge: string;
  /** 1-based index of head token or 0 for root */
  readonly depHead: number;
  /**
   * Ground truth error label: 0 for correct response, 1 for error.
   * In raw dev/test evaluation input files, this is null/omitted.
   */
  readonly label: 0 | 1 | null;
}

export interface SlamGoldKeyLine {
  /** Token identifier matching SlamRawTokenLine.tokenId */
  readonly tokenId: string;
  /** Ground truth error label: 0 for correct response, 1 for error */
  readonly label: 0 | 1;
}
```

---

## 2. Leakage-Free Feature Entities

### 2.1 `LearnerHistoryFeatures` (Baseline B2 Feature Vector)
Features derived strictly from events occurring prior to evaluation timestamp $t$ under split-aware label masking:

```typescript
export interface LearnerHistoryFeatures {
  /** Cumulative tokens attempted by learner prior to t */
  readonly userHistoricalTokenCount: number;
  /** Cumulative errors committed by learner prior to t (masked to 0 on dev/test evaluation passes) */
  readonly userHistoricalErrorCount: number;
  /** Cumulative learner error rate: errorCount / tokenCount (0 if tokenCount == 0, masked on dev/test) */
  readonly userHistoricalErrorRate: number;
  /** Occurrences of this specific surface token for this learner prior to t */
  readonly tokenHistoricalSeenCount: number;
  /** Errors committed on this specific token for this learner prior to t (masked on dev/test) */
  readonly tokenHistoricalErrorCount: number;
  /** Token-specific historical error rate (masked on dev/test) */
  readonly tokenHistoricalErrorRate: number;
  /** Elapsed seconds since learner last encountered this token (null if first encounter) */
  readonly secondsSinceLastSeen: number | null;
  /** Exercise interaction format */
  readonly exerciseFormat: "reverse_translate" | "reverse_tap" | "listen";
  /** Exercise response time in seconds (null if missing or negative in raw header) */
  readonly promptResponseTimeSeconds: number | null;
}
```

### 2.2 Canonical Nếp State Projection (Baseline B3 Ingestion)
Strictly bound to exported canonical types from `src/lib/core/learner-state.ts` (`nep.learner-evidence-state.v1`):

```typescript
export type ConstructEvidenceSufficiency =
  | "unknown"
  | "insufficient-support"
  | "provisional-support"
  | "provisional-weakness"
  | "conflicted-support";

export type ConstructUncertaintyLevel = "maximal" | "high" | "moderate" | "low";

export interface ConstructSufficientStatistics {
  readonly totalEvents: number;
  readonly positiveCount: number;
  readonly negativeCount: number;
  readonly conflictedCount: number;
  readonly distinctContextCount: number;
  readonly contextIds: readonly string[];
  readonly transfer: {
    readonly sameContextCount: number;
    readonly nearTransferCount: number;
    readonly nearTransferFailedCount: number;
    readonly farTransferCount: number;
    readonly farTransferFailedCount: number;
  };
  readonly supportDistribution: {
    readonly level0: number;
    readonly level1: number;
    readonly level2Plus: number;
  };
  readonly revealUsedCount: number;
  readonly durableEvidenceCount: number;
  readonly referenceEvidenceCount: number;
  readonly firstObservedAt: string | null;
  readonly lastObservedAt: string | null;
}

export interface NepCanonicalStateProjection {
  readonly ontologyNodeId: string;
  readonly status: ConstructEvidenceSufficiency;
  readonly uncertainty: ConstructUncertaintyLevel;
  readonly provisionalRoutingScore: number | null;
  readonly decisionScope: "routing-only";
  readonly statistics: ConstructSufficientStatistics;
}
```

### 2.3 `NepDerivedStateFeatures` (Baseline B3 Derived Numerical Vector)
Derived numeric feature vector constructed from `NepCanonicalStateProjection` with explicit frozen formulas, source fields, and versioned contract ID:

```typescript
export const NEP_REALITY_DERIVED_FEATURE_SET_ID = "nep.reality-derived-features.v1" as const;

export interface NepDerivedStateFeatures {
  readonly derivedFeatureId: typeof NEP_REALITY_DERIVED_FEATURE_SET_ID;

  // --- One-Hot Status Indicators (Source: status) ---
  /** Formula: status === "unknown" ? 1 : 0 */
  readonly status_is_unknown: number;
  /** Formula: status === "insufficient-support" ? 1 : 0 */
  readonly status_is_insufficient_support: number;
  /** Formula: status === "provisional-support" ? 1 : 0 */
  readonly status_is_provisional_support: number;
  /** Formula: status === "provisional-weakness" ? 1 : 0 */
  readonly status_is_provisional_weakness: number;
  /** Formula: status === "conflicted-support" ? 1 : 0 */
  readonly status_is_conflicted_support: number;

  // --- Uncertainty Ordinal (Source: uncertainty) ---
  /** Formula: { maximal: 0, high: 1, moderate: 2, low: 3 }[uncertainty] */
  readonly uncertainty_ordinal: number;

  // --- Provisional Routing Score (Source: provisionalRoutingScore) ---
  /** Formula: provisionalRoutingScore ?? 0.5 (neutral imputation) */
  readonly provisional_routing_score_imputed: number;
  /** Formula: provisionalRoutingScore !== null ? 1 : 0 */
  readonly provisional_routing_score_present: number;

  // --- Sufficient Statistics (Source: statistics) ---
  /** Source: statistics.totalEvents */
  readonly total_events: number;
  /** Formula: total_events > 0 ? statistics.positiveCount / total_events : 0 */
  readonly positive_ratio: number;
  /** Source: statistics.revealUsedCount */
  readonly reveal_used_count: number;
  /** Formula: total_events > 0 ? statistics.revealUsedCount / total_events : 0 */
  readonly derived_reveal_reliance_ratio: number;
  /** Source: statistics.supportDistribution.level0 */
  readonly support_level0_count: number;
  /** Source: statistics.supportDistribution.level1 */
  readonly support_level1_count: number;
  /** Source: statistics.supportDistribution.level2Plus */
  readonly support_level2plus_count: number;
  /** Formula: total_events > 0 ? (level1 + level2Plus) / total_events : 0 */
  readonly derived_support_reliance_ratio: number;
  /** Source: statistics.durableEvidenceCount */
  readonly durable_evidence_count: number;
  /** Source: statistics.referenceEvidenceCount */
  readonly reference_evidence_count: number;

  // --- Transfer Evidence Statistics (Source: statistics.transfer) ---
  /** Source: statistics.transfer.sameContextCount */
  readonly transfer_same_context_count: number;
  /** Source: statistics.transfer.nearTransferCount */
  readonly transfer_near_count: number;
  /** Source: statistics.transfer.nearTransferFailedCount */
  readonly transfer_near_failed_count: number;
  /** Source: statistics.transfer.farTransferCount */
  readonly transfer_far_count: number;
  /** Source: statistics.transfer.farTransferFailedCount */
  readonly transfer_far_failed_count: number;
  /**
   * Formula: (near_count + far_count) > 0
   *   ? (near_count + far_count) / (near_count + far_count + near_failed + far_failed)
   *   : 0
   */
  readonly derived_transfer_success_ratio: number;

  // --- Temporal Observation Horizons (Source: statistics.firstObservedAt, lastObservedAt) ---
  /** Elapsed seconds from firstObservedAt to prompt timestamp (null if no prior events) */
  readonly seconds_since_first_observed: number | null;
  /** Elapsed seconds from lastObservedAt to prompt timestamp (null if no prior events) */
  readonly seconds_since_last_observed: number | null;
}
```

---

## 3. Experiment Manifest & Reporting Schemas

### 3.1 `ExperimentManifest`
Complete record emitted for every benchmark execution run, indexed by a deterministic SHA-256 integrity fingerprint:

```typescript
export type BaselineIdentifier = "B0" | "B1" | "B2" | "B3" | "B4";
export type LanguageTrack = "es_en" | "en_es" | "fr_en";
export type SplitIdentifier = "train" | "dev" | "test";
export type SplitLabelAvailability =
  | "train-unmasked"
  | "dev-single-pass-masked-scoring-only"
  | "test-fully-masked";
export type FitPhase = "train-only" | "train-plus-dev";

export type ExperimentStatus =
  | "reproduced"
  | "candidate-better"
  | "no-evidence-of-improvement"
  | "candidate-worse"
  | "invalid-run";

export interface RetrievalArtifactManifest {
  readonly filename: string;
  readonly upstreamChecksumType?: "md5" | "sha1" | "sha256";
  readonly upstreamChecksumValue?: string;
  readonly localSha256Fingerprint: string;
  readonly byteSize: number;
}

export interface MetricEvaluationResult {
  /** Area Under ROC Curve */
  readonly rocauc: number;
  /** F1 score computed at default probability threshold 0.5 */
  readonly f1AtThreshold05: number;
  /** Binary cross-entropy log-loss */
  readonly logLoss: number;
  /** Total evaluation token count */
  readonly totalTokenCount: number;
  /** Positive label count (mistakes committed) */
  readonly positiveErrorCount: number;
  /** Empirical error prevalence: positiveErrorCount / totalTokenCount */
  readonly errorPrevalence: number;
}

export interface StatisticalComparisonResult {
  /** Baseline ID compared against (typically 'B2' for ablation) */
  readonly comparatorBaselineId: BaselineIdentifier;
  /** Metric delta: candidate - comparator */
  readonly deltaRocAuc: number;
  readonly deltaLogLoss: number;

  /** Primary Procedure: Paired Cluster Bootstrap by Learner (2,000 resamples) */
  readonly clusterBootstrap: {
    readonly resampleCount: number;
    readonly learnerClusterCount: number;
    readonly deltaRocAucMean: number;
    readonly deltaRocAucConfidenceInterval95: readonly [number, number];
    readonly pValueTwoSided: number;
    readonly isStatisticallySignificant: boolean;
  };

  /** Secondary Diagnostic: Token-level DeLong test */
  readonly tokenLevelDeLongDiagnostic: {
    readonly zScore: number;
    readonly pValue: number;
  };

  /** Per-track consistency across tracks */
  readonly perTrackConsistency: boolean;
}

export interface PreR2CompatibilityAuditResult {
  readonly track: LanguageTrack;
  readonly trackMappedToOntology: boolean;
  readonly totalTokensAudited: number;
  readonly mappedTokenCount: number;
  readonly unmappedTokenCount: number;
  readonly mappingCoverageRatio: number;
  readonly unavailableObservables: readonly string[];
  readonly decision: "proceed" | "b3-not-applicable-on-slam";
  readonly rationale: string;
}

export interface ExperimentManifest {
  /** Benchmark contract identifier: 'nep.reality-benchmark.v1' */
  readonly contractId: "nep.reality-benchmark.v1";
  readonly contractVersion: 1;

  /** Dataset provenance */
  readonly dataset: {
    readonly datasetId: "duolingo-slam-2018-doi:10.7910/DVN/8SWHNO";
    readonly datasetVersion: string;
    readonly retrievalArtifacts: readonly RetrievalArtifactManifest[];
    readonly terms: {
      readonly codeLicense: "MIT";
      readonly datasetLicense: "CC-BY-NC-4.0";
      readonly commercialUseAllowed: false;
      /** Nếp project quarantine policy: raw learner traces must never be redistributed */
      readonly redistributionAllowed: false;
      readonly redistributionRestrictionReason: "nep-project-quarantine-policy";
      readonly quarantinePath: ".cache/benchmarks/slam-2018/";
      readonly termsVerifiedAt: string;
    };
  };

  /** Evaluation track & split configuration */
  readonly track: LanguageTrack;
  readonly split: SplitIdentifier;
  readonly splitCutoff: {
    readonly leakagePolicyId: "strict-causal-label-masked-t-minus-1";
    readonly splitLabelAvailability: SplitLabelAvailability;
    readonly fitPhase: FitPhase;
    readonly maxEventTimestampIso: string | null;
  };

  /** Baseline and feature set identifiers */
  readonly baselineId: BaselineIdentifier;
  readonly featureSetId: string;

  /** Model & estimator specification */
  readonly model: {
    readonly modelId: string;
    readonly estimatorName: string;
    readonly hyperparameters: Readonly<Record<string, unknown>>;
    readonly randomSeed: number;
  };

  /** Execution runtime environment */
  readonly executionEnvironment: {
    readonly codeCommitSha: string;
    readonly baselineSourceCommit: string;
    readonly nodeVersion: string;
    readonly pythonVersion?: string;
    readonly osPlatform: string;
    readonly dependencies: Readonly<Record<string, string>>;
  };

  /** Resource measurements */
  readonly resources: {
    readonly durationMs: number;
    readonly peakRssMb: number;
    readonly cpuUserMs?: number;
    readonly cpuSystemMs?: number;
  };

  /** Evaluation metrics */
  readonly metrics: MetricEvaluationResult;

  /** Statistical significance comparison (e.g. B3 vs B2) */
  readonly comparison?: StatisticalComparisonResult;

  /** Pre-R2 compatibility audit result */
  readonly compatibilityAudit?: PreR2CompatibilityAuditResult;

  /** Benchmark outcome status */
  readonly status: ExperimentStatus;
  /** Human-readable justification */
  readonly justification: string;
  /** ISO 8601 execution timestamp */
  readonly executedAt: string;
  /** SHA-256 integrity fingerprint calculated over canonical RFC 8785 JSON (without manifestDigest) */
  readonly manifestDigest: string;
}
```
