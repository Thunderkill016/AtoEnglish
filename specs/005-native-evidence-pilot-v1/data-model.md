# Data Model: Nếp-native Evidence Pilot V1

## PilotTaskDefinition

```ts
type PilotTaskFamily =
  | "recognition-independent"
  | "recognition-supported"
  | "free-recall"
  | "delayed-free-recall"
  | "near-transfer";

type PilotTaskDefinition = {
  pilotContractId: "nep.native-evidence-pilot.v1";
  family: PilotTaskFamily;
  task: CoreTaskSpec;
  contentFingerprint: `sha256:${string}`;
  contextId: string;
  scoringContractId: "nep.native-pilot.binary-v1";
};

type FrozenPilotTaskDefinition = Readonly<PilotTaskDefinition> & {
  definitionFingerprint: `sha256:${string}`;
};
```

The task definition is frozen before response observation. `definitionFingerprint` is computed deterministically over the exact pilot family, every `CoreTaskSpec` field including `id` and `version`, `contentFingerprint`, `contextId`, and `scoringContractId`. `contentFingerprint` identifies prompt/stimulus content without putting participant data into task identity.

The pilot does not assume the merged core evidence object preserves this whole identity. `ReferenceCoreEvidence` carries `taskId` and context but not task version or content fingerprint, so the wrapper-level definition fingerprint and lineage record below are mandatory research-integrity bindings.

## Task matrix

| Family | Activity | Modality | Role | Support | Reveal | Transfer |
| --- | --- | --- | --- | ---: | --- | --- |
| recognition-independent | reading-reception | choice | meaning-recognition | 0 | disabled | same-context |
| recognition-supported | reading-reception | choice | meaning-recognition | 1 | allowed | same-context |
| free-recall | written-production | text | free-recall | 0 | disabled | same-context |
| delayed-free-recall | written-production | text | free-recall | 0 | disabled | same-context |
| near-transfer | written-production | text | near-transfer | 0 | disabled | near-transfer |

All target `nep.en.v1.language-system.syntax-grammar`.

## PilotAttemptInput

Prospectively known before attempt:

```ts
type PilotAttemptInput = {
  participantId: string; // pseudonymous research ID only
  taskId: string;
  taskVersion: number;
  contentFingerprint: `sha256:${string}`;
  definitionFingerprint: `sha256:${string}`;
  predictionTimestamp: string; // explicit ISO timestamp supplied by host
  contextId: string;
};
```

Before the attempt can be observed or issued as evidence, the wrapper must verify exact equality between `PilotAttemptInput` and its `FrozenPilotTaskDefinition` for task ID, task version, content fingerprint, definition fingerprint, and context ID. A mismatch is a fail-closed protocol error; the wrapper may not repair it from the observation or outcome.

No account ID, email, device advertising ID, or production analytics ID is part of the research trace.

## Attempt observation

Attempt-time fields:

- learner response (raw text or choice; raw text stored separately when human N3 is approved);
- response latency;
- actual reveal use;
- evaluator outcome;
- evaluator/model fingerprint;
- explicit event timestamp.

The observation remains `authority: "none"`, calibration `validationState: "unvalidated"`, decision `shadow`, benchmark ID null.

## Canonical evidence

The only learner-state input is `ReferenceCoreEvidence` returned by `validateReferenceCoreEvidence()`.

Required properties are inherited from the merged core contract: exact task/observation IDs, target, role, outcome, support/reveal, response modality, context, occurredAt, activity, transfer distance, context tags, model fingerprint, `authorityScope: "repository-reference"`, null benchmark and null grant ID.

Core validation remains authoritative for those canonical fields, but it is not sufficient to prove the wrapper-only task version/content/context plan. The wrapper binding above must pass before validation.

## PilotEvidenceLineage

A successful pilot evidence event has adjacent research-integrity metadata:

```ts
type PilotEvidenceLineage = {
  eventId: string;
  observationId: string;
  taskId: string;
  taskVersion: number;
  contentFingerprint: `sha256:${string}`;
  contextId: string;
  definitionFingerprint: `sha256:${string}`;
  evidenceDigest: `sha256:${string}`; // computeCanonicalEvidenceDigest(evidence)
};
```

`PilotEvidenceLineage` is created only after `validateReferenceCoreEvidence()` succeeds. `eventId` and `observationId` must equal the resulting evidence, and `evidenceDigest` must equal `computeCanonicalEvidenceDigest(evidence)`. Missing or mismatched lineage makes the event ineligible for pilot feature rows, manifests, and results.

The lineage record does **not** authenticate a detached evidence object and does not enter learner state. `projectLearnerState()` still receives only the in-process branded `ReferenceCoreEvidence`.

## PredictionFeatureRow

```ts
type PredictionFeatureRow = {
  participantId: string;
  targetEventId: string;
  predictionTimestamp: string;
  label: 0 | 1 | null; // null until post-attempt scoring
  b2: Record<string, number | string | null>;
  b3: Record<string, number | string | null>;
};
```

B2 and B3 are generated from the same causal cutoff. The label is attached only after prediction features are frozen. Feature generation must consume only evidence events whose pilot lineage binding has passed.

## Privacy-separated artifacts

Human N3, if separately approved, must separate:

1. identity/consent mapping — access-restricted, outside benchmark artifacts;
2. raw response store — pseudonymous, short retention;
3. canonical evidence ledger — pseudonymous derived events plus separate pilot lineage metadata;
4. feature/results store — no raw response text.

N2 uses synthetic IDs only and must not touch production DB or user accounts.
