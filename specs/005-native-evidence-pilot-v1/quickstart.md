# Quickstart: Nếp-native Evidence Pilot V1

Current stage is documentation/N1. There is no human-data command.

## Review the frozen target and task matrix

```text
target: nep.en.v1.language-system.syntax-grammar
recognition-independent -> reading / choice / meaning-recognition / support 0 / same-context
recognition-supported   -> reading / choice / meaning-recognition / support 1 / same-context
free-recall             -> written / text / free-recall / support 0 / same-context
delayed-free-recall     -> written / text / free-recall / support 0 / same-context
near-transfer           -> written / text / near-transfer / support 0 / near-transfer
```

## N2 implementation rule

Synthetic harness code must call the real core task/evidence/learner-state modules. Do not construct an object that merely looks like `ReferenceCoreEvidence`.

Expected high-level sequence:

```text
CoreTaskSpec (prospective)
  -> synthetic CoreObservation + CoreEvidenceCandidate
  -> validateReferenceCoreEvidence()
  -> project/reduce learner state from past evidence
  -> freeze pre-attempt B2/B3 feature row
  -> synthetic outcome arrives
  -> emit next reference evidence
```

## Prohibited at this stage

- real participant IDs or responses;
- production DB writes;
- speech/media;
- durable authority;
- deployment/UI work;
- predictive-quality claims from synthetic traces.
