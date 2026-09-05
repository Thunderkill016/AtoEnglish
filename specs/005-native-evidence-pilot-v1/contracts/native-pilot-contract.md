# Contract: `nep.native-evidence-pilot.v1`

## Authority

This contract authorizes N1 specification and N2 synthetic plumbing only. It does not authorize human recruitment, production ingestion, durable assessment, UI deployment, or data reuse.

## Ontology target

Exactly one V1 target is permitted: `nep.en.v1.language-system.syntax-grammar`.

## Evidence issuance

- Every task is a valid `CoreTaskSpec` frozen before the response.
- The pilot wrapper MUST freeze a `FrozenPilotTaskDefinition` before the response and compute a deterministic definition fingerprint over the exact pilot family, all `CoreTaskSpec` fields including `id` and `version`, content fingerprint, context ID, and scoring contract ID.
- The definition fingerprint encoding is fixed: construct the `PilotTaskDefinition` payload without `definitionFingerprint`; recursively order object keys lexicographically; preserve array order exactly as frozen; reject `undefined`, non-finite numbers, functions, symbols, and non-JSON values; encode the resulting canonical JSON as UTF-8 with no insignificant whitespace; hash those bytes with SHA-256; serialize as lowercase `sha256:<64-hex>`. Object insertion order must not affect the fingerprint, while any frozen semantic field or array-order change must.
- `CoreTaskSpec` / `ReferenceCoreEvidence` do not by themselves preserve every pilot identity field: `ReferenceCoreEvidence` does not carry task version or content fingerprint, and core validation does not compare the pilot wrapper's planned context ID. Therefore the pilot MUST NOT treat `validateReferenceCoreEvidence()` alone as proof of prospective task identity.
- Before calling `validateReferenceCoreEvidence()`, the pilot wrapper MUST fail closed unless the attempt's task ID, task version, content fingerprint, context ID, and definition fingerprint exactly match the frozen definition. No post-response substitution or repair is permitted.
- Every pilot update enters learner state only as in-process `ReferenceCoreEvidence` issued by `validateReferenceCoreEvidence()`.
- After successful validation, the research trace MUST persist a `PilotEvidenceLineage` binding the evidence `eventId` and `observationId` to the frozen definition fingerprint, task ID/version, content fingerprint, context ID, and `computeCanonicalEvidenceDigest(evidence)`. Missing or mismatched lineage makes the event ineligible for pilot feature rows/results.
- `PilotEvidenceLineage` is research-integrity metadata only. It never becomes learner-state authority and cannot make detached evidence trusted; only the in-process branded `ReferenceCoreEvidence` enters `projectLearnerState()`.
- `authorityScope` is always `repository-reference` in V1.
- Detached transport artifacts never acquire trust by parsing or hashing.

## Independent evidence

`free-recall` and `near-transfer` tasks require support level 0 and no reveal use. If the learner receives support/reveal, the event cannot retain an independent evidence role.

## Transfer

Near-transfer is prospective: task family, transfer distance, changed context and prior baseline context are defined independently of the target outcome. The target attempt's context ID MUST equal the frozen pilot task definition's context ID before evidence validation. A first-event transfer, unchanged-context transfer, or post-response context substitution is rejected and remains visible in audit output.

## Time

No ambient clock. Prediction and evidence timestamps are explicit host inputs. The delayed retrieval outcome cannot enter its own feature vector.

## Model comparison

B2-native and B3-native use identical evaluation rows, labels, causal cutoffs, preprocessing and estimator. B3 only adds frozen learner-state-derived features from past accepted evidence. An uncalibrated routing score is never treated as a standalone probability.

## Human-data prohibition

N3 remains disabled until a separately reviewed privacy/consent protocol and explicit owner approval. Synthetic data may not be described as learner evidence.
