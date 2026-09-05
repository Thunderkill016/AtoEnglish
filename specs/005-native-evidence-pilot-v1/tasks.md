# Tasks: Nếp-native Evidence Pilot V1

## N1 — spec / instrumentation contract

- [x] N001 Record #141 B3 compatibility disposition and activation of #143.
- [x] N002 Freeze V1 to one ontology target: `nep.en.v1.language-system.syntax-grammar` plus non-canonical content tag `pilot-slice:present-subject-verb-agreement`.
- [x] N003 Define five prospective task families and exact role/activity/modality/support/transfer semantics.
- [x] N004 Freeze reference-only evidence authority boundary.
- [x] N005 Freeze strong B2-native pre-attempt feature budget including simple causal support/reveal/context history.
- [x] N006 Freeze B3-native learner-state augmentation budget and duplicate-column handling.
- [x] N007 Define delayed-retrieval and changed-context causal rules; primary prediction targets are free-recall/delayed-free-recall/near-transfer.
- [x] N008 Draft privacy/consent/retention requirements; human collection remains disabled.
- [x] N009 Require `nep.native-predictor.v1` estimator/hyperparameter freeze during N2 before any human N3 outcomes.
- [x] N009A Explicitly compensate for fields not preserved by `ReferenceCoreEvidence`: freeze a canonical deterministic pilot task-definition fingerprint and require fail-closed task ID/version/content fingerprint/context binding plus adjacent `PilotEvidenceLineage`.
- [ ] N010 Independent review PASS for Spec #005 exact head. Draft N2 work started before this temporal gate completed remains provisional and must be revalidated against the reviewed exact head; the review is not backdated.

## N2 — synthetic plumbing only

- [ ] N020 Create `benchmarks/native-evidence-v1/` from reviewed Spec #005.
- [ ] N021 Implement immutable versioned task definitions using existing `CoreTaskSpec`, plus canonical deterministic `FrozenPilotTaskDefinition.definitionFingerprint`; prove object insertion order does not alter it and every frozen semantic/array-order mutation does.
- [ ] N022 Before `validateReferenceCoreEvidence()`, fail closed unless attempt task ID/version/content fingerprint/context ID/definition fingerprint exactly match the frozen definition; after successful issuance persist matching `PilotEvidenceLineage` with canonical evidence digest.
- [ ] N023 Add cold-start, support/reveal, free-recall, delayed-recall, valid/invalid transfer scenarios.
- [ ] N024 Add duplicate and out-of-order reducer adversarial scenarios.
- [ ] N025 Add detached/cloned evidence rejection plus task-version, content-fingerprint, definition-fingerprint, and context-substitution adversarial scenarios.
- [ ] N026 Implement strong B2/B3 pre-attempt feature extraction with explicit prediction timestamp and no future/current label feedback; events with missing/mismatched pilot lineage are ineligible.
- [ ] N027 Freeze `nep.native-predictor.v1` using synthetic stability checks only; same estimator/preprocessing for B2/B3.
- [ ] N028 Implement synthetic participant export/delete and prove participant-scoped raw/derived/lineage artifacts are removed.
- [ ] N029 Reuse benchmark manifest/integrity conventions; bind task-definition and evidence-lineage fingerprints and clearly mark every artifact `synthetic-plumbing-only`.
- [ ] N030 Exact-head Verify + focused native harness CI green.
- [ ] N031 Opposite-agent independent review PASS of N2 implementation against the reviewed Spec #005 exact head.

## N3 — human pilot

- [ ] N040 BLOCKED: separately review final consent/privacy/deletion/retention protocol.
- [ ] N041 BLOCKED: explicit owner approval to collect adult human pilot data.
- [ ] N042 Only after N040/N041: execute bounded pilot.

## N4 — future reality decision

- [ ] N050 Freeze final split/cutoff protocol before examining held-out outcomes; predictor is already frozen before N3.
- [ ] N051 Compare same-estimator B3-native vs B2-native with learner-clustered uncertainty where sample supports it.
- [ ] N052 Report retain/simplify/redesign/gather-more-evidence; no mastery/CEFR/efficacy promotion.
