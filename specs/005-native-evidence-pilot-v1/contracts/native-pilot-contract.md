# Contract: `nep.native-evidence-pilot.v1`

## Authority

This contract authorizes N1 specification and N2 synthetic plumbing only. It does not authorize human recruitment, production ingestion, durable assessment, UI deployment, or data reuse.

## Ontology target

Exactly one V1 target is permitted: `nep.en.v1.language-system.syntax-grammar`.

## Evidence issuance

- Every task is a valid `CoreTaskSpec` frozen before the response.
- Every pilot update enters learner state only as in-process `ReferenceCoreEvidence` issued by `validateReferenceCoreEvidence()`.
- `authorityScope` is always `repository-reference` in V1.
- Detached transport artifacts never acquire trust by parsing or hashing.

## Independent evidence

`free-recall` and `near-transfer` tasks require support level 0 and no reveal use. If the learner receives support/reveal, the event cannot retain an independent evidence role.

## Transfer

Near-transfer is prospective: task family, transfer distance, changed context and prior baseline context are defined independently of the target outcome. A first-event transfer or unchanged-context transfer is rejected and remains visible in audit output.

## Time

No ambient clock. Prediction and evidence timestamps are explicit host inputs. The delayed retrieval outcome cannot enter its own feature vector.

## Model comparison

B2-native and B3-native use identical evaluation rows, labels, causal cutoffs, preprocessing and estimator. B3 only adds frozen learner-state-derived features from past accepted evidence. An uncalibrated routing score is never treated as a standalone probability.

## Human-data prohibition

N3 remains disabled until a separately reviewed privacy/consent protocol and explicit owner approval. Synthetic data may not be described as learner evidence.
