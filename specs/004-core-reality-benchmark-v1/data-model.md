# Data Model: Reality Benchmark Harness V1

- **Contract Identifier**: `nep.reality-benchmark.v1`.
- **Governing Purpose**: Define strongly-typed schemas for benchmark ingestion, leakage-free feature representations, experiment manifests, and comparative metric reports.

---

## 1. Raw SLAM Ingestion Entities

### 1.1 `SlamRawPromptHeader`
Metadata line beginning with `#` preceding exercise tokens:

```typescript
export interface SlamRawPromptHeader {
  /** Anonymized user identifier prefixed with 'u:' (e.g. 'u:bkmM') */
  readonly userId: string;
  /** Exercise format (e.g. 'reverse_translate', 'reverse_tap', 'listen') */
  readonly format: "reverse_translate" | "reverse_tap" | "listen";
  /** Session type (e.g. 'lesson', 'practice', 'test') */
  readonly session: "lesson" | "practice" | "test";
  /** Exercise response duration in seconds */
  readonly timeSeconds: number;
  /** Client platform (e.g. 'web', 'ios', 'android') */
  readonly client: "web" | "ios" | "android";
  /** Unique session identifier */
  readonly sessionId: string;
  /** Line index in source dataset file for provenance auditing */
  readonly sourceLineNumber: number;
}
```

### 1.2 `SlamRawTokenLine`
Token-level observation line within an exercise prompt:

```typescript
export interface SlamRawTokenLine {
  /** Unique token row identifier within the track (e.g. 'Pq4N') */
  readonly tokenId: string;
  /** Surface word or punctuation string (e.g. 'apple', '.') */
  readonly token: string;
  /** Universal Dependencies Part-of-Speech tag (e.g. 'NOUN', 'VERB', 'ADJ') */
  readonly pos: string;
  /** Universal Dependencies morphological features separated by '|' (e.g. 'Number=Sing|Person=3') */
  readonly morphology: readonly string[];
  /** Syntactic dependency edge label (e.g. 'nsubj', 'obj', 'root') */
  readonly depEdge: string;
  /** 1-based index of head token or 0 for root */
  readonly depHead: number;
  /** Ground truth error label: 0 for correct response, 1 for error */
  readonly label: 0 | 1;
}
```

---

## 2. Leakage-Free Feature Entities

### 2.1 `LearnerHistoryFeatures` (Baseline B2 Feature Vector)
Features derived strictly from events occurring prior to evaluation timestamp $t$ under the declared split masking policy:

```typescript
export interface LearnerHistoryFeatures {
  /** Cumulative tokens attempted by learner prior to t */
  readonly userHistoricalTokenCount: number;
  /** Cumulative errors committed by learner prior to t (masked on TEST) */
  readonly userHistoricalErrorCount: number;
  /** Cumulative learner error rate: errorCount / tokenCount (0 if tokenCount == 0, masked on TEST) */
  readonly userHistoricalErrorRate: number;
  /** Occurrences of this specific surface token for this learner prior to t */
  readonly tokenHistoricalSeenCount: number;
  /** Errors committed on this specific token for this learner prior to t (masked on TEST) */
  readonly tokenHistoricalErrorCount: number;
  /** Token-specific historical error rate (masked on TEST) */
  readonly tokenHistoricalErrorRate: number;
  /** Elapsed seconds since learner last encountered this token (or null if first encounter) */
  readonly secondsSinceLastSeen: number | null;
  /** Exercise format one-hot indicator */
  readonly exerciseFormat: "reverse_translate" | "reverse_tap" | "listen";
  /** Exercise response time in seconds */
  readonly promptResponseTimeSeconds: number;
}
```

### 2.2 `NepStateFeatures` (Ablation B3 Feature Vector)
Strict, pure projection from the canonical `LearnerStateProjection` of `nep.learner-evidence-state.v1` (Issue #137) without inventing unmerged memory models:

```typescript
export interface NepStateFeatures {
  /** Canonical state status: 'insufficient-evidence' | 'provisional-signal' | 'actionable' | 'conflicted' */
  readonly stateStatus: "insufficient-evidence" | "provisional-signal" | "actionable" | "conflicted";
  /** Epistemic uncertainty category: 'high' | 'moderate' | 'low' */
  readonly epistemicUncertainty: "high" | "moderate" | "low";
  /** Aleatoric uncertainty category: 'high' | 'moderate' | 'low' */
  readonly aleatoricUncertainty: "high" | "moderate" | "low";
  /** Conflict uncertainty category: 'high' | 'moderate' | 'low' */
  readonly conflictCategory: "high" | "moderate" | "low";
  /** Nullable provisional routing score in [0, 1] (null if insufficient evidence) */
  readonly provisionalRoutingScore: number | null;
  /** Total accepted evidence events in the state ledger */
  readonly totalAcceptedEvents: number;
  /** Total scaffolding support interactions */
  readonly supportCount: number;
  /** Total hints or solution reveals used */
  readonly revealCount: number;
  /** Scaffolding reliance ratio in [0, 1] */
  readonly supportRatio: number;
  /** Certified durable assessment evidence records count */
  readonly durableEvidenceCount: number;
  /** Reference routing evidence records count */
  readonly referenceEvidenceCount: number;
  /** Successful cross-context transfer events count */
  readonly transferSuccessCount: number;
  /** Failed cross-context transfer events count */
  readonly transferFailureCount: number;
  /** Cross-context transfer success ratio in [0, 1] */
  readonly transferSuccessRatio: number;
  /** Elapsed seconds since the first recorded evidence event (null if none) */
  readonly secondsSinceFirstObserved: number | null;
  /** Elapsed seconds since the most recent evidence event (null if none) */
  readonly secondsSinceLastObserved: number | null;
}
```

---

## 3. Experiment Manifest & Reporting Schemas

### 3.1 `ExperimentManifest`
Immutable record emitted for every benchmark execution run, indexed by a deterministic SHA-256 integrity fingerprint:

```typescript
export type BaselineIdentifier = "B0" | "B1" | "B2" | "B3" | "B4";
export type LanguageTrack = "es_en" | "en_es" | "fr_en";
export type SplitIdentifier = "train" | "dev" | "test";
export type ExperimentStatus =
  | "reproduced"
  | "candidate-better"
  | "no-evidence-of-improvement"
  | "candidate-worse"
  | "invalid-run";

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
  /** Two-sided p-value via DeLong test or paired permutation */
  readonly pValue: number;
  /** 95% Bootstrap confidence interval for deltaRocAuc */
  readonly confidenceInterval95: readonly [number, number];
  /** Whether the candidate metric uplift is statistically significant at alpha = 0.05 */
  readonly isStatisticallySignificant: boolean;
}

export interface ExperimentManifest {
  /** Benchmark contract identifier: 'nep.reality-benchmark.v1' */
  readonly contractVersion: "nep.reality-benchmark.v1";
  /** Dataset identifier and Harvard Dataverse DOI */
  readonly datasetId: "duolingo-slam-2018-doi:10.7910/DVN/8SWHNO";
  /** Cryptographic SHA-256 checksum of the staged dataset archive */
  readonly datasetArchiveSha256: string;
  /** Code license */
  readonly codeLicense: "MIT";
  /** Dataset license: strictly non-commercial research */
  readonly datasetLicense: "CC-BY-NC-4.0";
  /** Commercial usage permission: strictly false */
  readonly commercialUseAllowed: false;
  /** Redistribution permission: strictly false */
  readonly redistributionAllowed: false;
  /** Terms verification status */
  readonly licenseVerificationStatus: "verified-non-commercial-research-only";
  /** ISO 8601 timestamp when dataset terms were verified at retrieval time */
  readonly termsVerifiedAt: string;
  /** Language track evaluated */
  readonly track: LanguageTrack;
  /** Dataset split */
  readonly split: SplitIdentifier;
  /** Baseline or candidate identifier */
  readonly baselineId: BaselineIdentifier;
  /** Git commit SHA of the execution codebase */
  readonly codeCommitSha: string;
  /** Estimator algorithm name and version (e.g. 'LogisticRegression_L2_sklearn_1.6.0') */
  readonly estimatorName: string;
  /** Serialized hyperparameter dictionary */
  readonly hyperparameters: Readonly<Record<string, unknown>>;
  /** Explicit random seed */
  readonly randomSeed: number;
  /** Metric results */
  readonly metrics: MetricEvaluationResult;
  /** Statistical comparison against baseline if applicable */
  readonly comparison?: StatisticalComparisonResult;
  /** Benchmark outcome status */
  readonly status: ExperimentStatus;
  /** Human-readable justification explaining the status decision */
  readonly justification: string;
  /** Explicit ISO 8601 execution timestamp */
  readonly executedAt: string;
  /** SHA-256 integrity fingerprint over canonical RFC 8785 JSON representation */
  readonly manifestDigest: string;
}
```
