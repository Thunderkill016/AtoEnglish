# Provenance Authority Registry V1

## 1. Executive Summary & Problem Addressed

In Nếp English Intelligence Engine, durable learner assessment cannot be minted by an evaluator, task context, or observation. PR #131 established the first executable capability slice and introduced `CalibrationAuthorityGrant` as a typed boundary. However, it intentionally left one residual: `CalibrationAuthorityGrant` was only a typed shape, allowing ad-hoc object literals to be passed without verifying independent provenance.

**GEMINI-PROVENANCE-001** closes this residual by introducing **Provenance Authority Registry V1**:
- An independent, persistence-neutral registry of evaluation artifacts and authority grants.
- A pure, deterministic, fail-closed resolver:
  ```text
  observation/evidence request -> authority grant lookup -> provenance validation -> exact scope/fingerprint match -> resolved grant OR explicit rejection
  ```
- Runtime-enforced branded calibration authority (`ResolvedCalibrationAuthority`), making it impossible for unverified grant shapes or self-declared observations to reach `certifyCoreEvidence()`.
- Strict separation between repository-reference evidence (`authorityScope: "repository-reference"`) and durable assessment (`authorityScope: "durable-assessment"`).

---

## 2. Literature & Primary-Source Standards Review

To design the provenance registry on sound foundations, we reviewed core provenance, measurement, and AI governance frameworks.

### 2.1 W3C PROV-DM & PROV-O (Recommendation 2013)
- **Citation**: World Wide Web Consortium (W3C), *PROV-DM: The PROV Data Model*, W3C Recommendation 30 April 2013. [https://www.w3.org/TR/prov-dm/](https://www.w3.org/TR/prov-dm/)
- **Concepts Applied**:
  - `Entity`: Immutable benchmark datasets and model weight checkpoints.
  - `Activity`: Calibration trials and empirical evaluations.
  - `Agent`: Independent human evaluators, raters, or algorithmic systems.
  - `wasDerivedFrom` / `used`: An authority grant is derived from an evaluation activity that used a specific, immutable benchmark dataset and evaluated a specific model artifact.
- **Nếp Design Decision**: In Nếp, changing any evaluated artifact (model weights, preprocessing pipeline, runtime container) or the underlying benchmark dataset creates a distinct entity and invalidates the provenance link unless explicitly re-evaluated and registered.

### 2.2 NIST AI Risk Management Framework 1.0 (NIST AI 100-1)
- **Citation**: National Institute of Standards and Technology (NIST), *Artificial Intelligence Risk Management Framework (AI RMF 1.0)*, NIST AI 100-1, January 2023. [https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf](https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf)
- **Concepts Applied**:
  - Section 1.2 & MEASURE Function: AI measurement validity and reliability are context-bounded. Metrics measured under clean acoustic conditions or specific adult L1 populations do not generalize to noisy mobile environments or other populations.
- **Nếp Design Decision**: Scoped authority matching enforces that `requiredPopulationTags`, `allowedNoiseClasses`, `minimumSnrDb`, and `allowedPromptContexts` must encompass the observation context before authority can resolve.

### 2.3 Standards for Educational and Psychological Testing
- **Citation**: American Educational Research Association (AERA), American Psychological Association (APA), National Council on Measurement in Education (NCME), *Standards for Educational and Psychological Testing*, 2014.
- **Concepts Applied**:
  - Validity is not a global property of an instrument, but of the specific interpretations and decisions for specified uses (Standard 1.1).
  - Formative diagnostic feedback ("hint-only" / formative "assessment") requires different evidentiary thresholds than summative certification ("mastery").
- **Nếp Design Decision**: Grants explicitly distinguish `decision: "assessment"` vs `decision: "mastery"` and `authority: "assessment-candidate"` vs `authority: "mastery-candidate"`.

### 2.4 SLSA Provenance Specification (v1.0)
- **Citation**: Supply-chain Levels for Software Artifacts (SLSA), *SLSA Provenance v1.0*, 2023. [https://slsa.dev/spec/v1.0/provenance](https://slsa.dev/spec/v1.0/provenance)
- **Concepts Applied**: Cryptographic digest binding over inputs, recipes, and artifacts.
- **Nếp Design Decision**: Evaluator bindings require immutable SHA-256 digests of model weights and runtime environments.

> [!IMPORTANT]
> **Distinction Between Standards and Domain Reality**:
> Citing W3C PROV, NIST AI RMF, or AERA/APA/NCME standards establishes the provenance and governance pattern, but does **not** prove the psychometric or pedagogical validity of Nếp's English learner measurement. Validity is achieved solely through frozen empirical evaluations on real learner data.

---

## 3. Core Epistemic Invariants

1. **No Self-Certification**:
   Evaluator output, task context, or observation metadata cannot create or assert a durable authority grant.
2. **Independent Provenance**:
   Every durable grant references an independently registered benchmark artifact (`RegisteredBenchmarkArtifact`) with an immutable SHA-256 fingerprint.
3. **Exact Evaluator Binding**:
   A grant binds to `evaluatorId`, `evaluatorKind`, `modelFingerprint`, and optional `runtimeFingerprint`. Any drift invalidates the grant fail-closed.
4. **Scoped Authority**:
   Construct, activity, population, prompt context, device, and noise constraints must match fail-closed.
5. **Lifecycle-Aware**:
   Grants in status `revoked`, `superseded`, or `expired` immediately resolve to `{ ok: false }`.
6. **Reference Separation**:
   `validateReferenceCoreEvidence()` remains strictly non-authoritative (`authorityScope: "repository-reference"`). Even if a reference observation matches a grant, it cannot gain durable authority.
7. **No Lower Layer Substitution**:
   Repository unit tests or synthetic fixtures (Layer 0) cannot substitute for empirical benchmark calibration (Layer 1) or human adjudication (Layer 2).
8. **No Implicit Score Thresholding**:
   Registry authority does not define bounded-score -> boolean mappings unless an explicit calibrated mapping policy (`calibratedScoreMappingPolicyId`) is registered.

---

## 4. Contract Architecture

### 4.1 Data Models (`src/lib/core/authority-registry.ts`)

```typescript
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

export type EvaluatorBinding = {
  evaluatorId: string;
  evaluatorKind: "deterministic" | "model" | "human" | "hybrid";
  modelFingerprint: string;
  runtimeFingerprint?: string;
  configurationId?: string;
};

export type RegisteredAuthorityGrant = {
  grantId: string;
  grantVersion: string;
  status: "active" | "revoked" | "superseded" | "expired";
  benchmarkArtifact: RegisteredBenchmarkArtifact;
  evaluatorBinding: EvaluatorBinding;
  scope: CalibrationProfile["scope"];
  decision: "assessment" | "mastery";
  authority: "assessment-candidate" | "mastery-candidate";
  validFrom: string;
  validUntil?: string;
  supersededByGrantId?: string;
  revokedAt?: string;
  revocationReason?: string;
  calibratedScoreMappingPolicyId?: string;
};
```

### 4.2 Resolver & Runtime Brand

```typescript
export function resolveCalibrationAuthority(
  request: AuthorityResolutionRequest,
  registry: ProvenanceAuthorityRegistry,
): AuthorityResolutionResult;

export function isResolvedCalibrationAuthority(
  value: unknown,
): value is ResolvedCalibrationAuthority;
```

`ResolvedCalibrationAuthority` carries a runtime symbol brand (`[RESOLVED_BRAND]: true`) and validated properties. `certifyCoreEvidence()` asserts `isResolvedCalibrationAuthority(authorityGrant)` and fails closed with `{ type: "independent-authority-not-resolved" }` if an arbitrary unbranded object is supplied.

---

## 5. Reason Codes Dictionary

| Reason Code | Trigger Condition |
|---|---|
| `grant-not-found` | The requested `grantId` is absent from the registry. |
| `grant-inactive-revoked` | The grant has been explicitly revoked (e.g., due to data contamination). |
| `grant-inactive-superseded` | The grant has been replaced by a newer grant version. |
| `grant-inactive-expired` | The current timestamp is past `validUntil` or status is `expired`. |
| `grant-not-yet-valid` | The current timestamp precedes `validFrom`. |
| `benchmark-not-found` | The referenced benchmark artifact is missing from the registry. |
| `benchmark-fingerprint-mismatch` | The benchmark ID or immutable SHA-256 fingerprint differs from the grant. |
| `evaluator-identity-mismatch` | Observation `provenance.evaluator` does not match grant `evaluatorBinding.evaluatorId`. |
| `evaluator-kind-mismatch` | Observation `provenance.evaluatorKind` differs from grant binding. |
| `model-fingerprint-mismatch` | Observation model checkpoint SHA-256 differs from registered binding. |
| `runtime-fingerprint-mismatch` | Container or runtime environment SHA-256 differs from registered binding. |
| `activity-scope-mismatch` | Task or observation `activity` does not match grant scope. |
| `construct-scope-mismatch` | Observation construct does not match grant scope. |
| `population-scope-mismatch` | Required population tags in grant are missing from learner context. |
| `noise-class-unsupported` | Observation acoustic noise class is not in `allowedNoiseClasses`. |
| `snr-below-minimum` | Observation SNR (dB) is below the grant's calibrated `minimumSnrDb`. |
| `device-class-unsupported` | Learner device is outside the calibrated device envelope. |
| `prompt-context-unsupported` | Task prompt context is outside `allowedPromptContexts`. |
| `decision-mismatch` | Observation decision differs from grant `decision`. |
| `authority-mismatch` | Observation authority differs from grant `authority`. |
| `observation-not-authoritative` | `canAffectDurableAssessment(observation)` evaluates to `false`. |
| `unvalidated-reference-cannot-claim-authority` | Observation in `unvalidated` or `authority: "none"` attempts durable resolution. |

---

## 6. What Remains Unproven (Residual Risks)

1. **Storage Persistence**: Registry V1 is pure and persistence-neutral (in-memory interface). In a later milestone, grants will be backed by signed cryptographic authority manifests on disk/lakehouse.
2. **Dynamic Recalibration Trigger**: When an upstream model weights digest changes, the registry currently fails closed. An automated pipeline to trigger re-benchmarking against frozen gold sets is not yet implemented.
3. **Calibrated Score Mapping Policies**: Mapping continuous GOP/acoustic scores or edit distances to discrete CEFR/binary pass/fail remains an open research task requiring double-rater empirical calibration on Vietnamese-English learners.
