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
```

The task object is fixed before response observation. `contentFingerprint` identifies prompt/stimulus content without putting participant data into task identity.

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
  contentFingerprint: string;
  predictionTimestamp: string; // explicit ISO timestamp supplied by host
  contextId: string;
};
```

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

B2 and B3 are generated from the same causal cutoff. The label is attached only after prediction features are frozen.

## Privacy-separated artifacts

Human N3, if separately approved, must separate:

1. identity/consent mapping — access-restricted, outside benchmark artifacts;
2. raw response store — pseudonymous, short retention;
3. canonical evidence ledger — pseudonymous derived events;
4. feature/results store — no raw response text.

N2 uses synthetic IDs only and must not touch production DB or user accounts.
