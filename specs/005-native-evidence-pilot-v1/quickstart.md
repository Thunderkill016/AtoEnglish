# Quickstart: Nếp-native Evidence Pilot V1

Current stage is documentation/N1. There is no human-data command.

## Review comparative amendment

Read `research.md` for candidate decisions and source/license pins, then the predictor section
of `contracts/native-pilot-contract.md` for exact baseline/split/metric settings. Confirm the
B2-basis control distinguishes count re-encoding from additional information. N010/N015 in
`tasks.md` remain pending; this amendment is not an N2 execution handoff.

Review 5120933538 remains CHANGES REQUIRED pending fresh independent exact-head review.
Check both attribution contrasts in the decision table, supported pyBKT multi-fit plus diagnostic
parity requirements, and N044's utility justification/descriptive-only lock. The old 0.01-nat
threshold cannot authorize KEEP/SIMPLIFY. No N2 or N3 command is authorized by this correction.

Documentation checks (no native benchmark is implemented yet):

```bash
SPECIFY_FEATURE_DIRECTORY=specs/005-native-evidence-pilot-v1 python3 .specify/scripts/python/check_prerequisites.py --json --require-spec --require-tasks --include-tasks
npm run check:source-of-truth
git diff --check
```

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
  -> load only authorized past TRAIN-prefix evidence available before the cutoff
  -> project/reduce past learner state
  -> freeze B0/B2/B2-basis/B3 predictions for the blind target block
  -> synthetic outcome arrives and is scored after predictions are sealed
  -> validateReferenceCoreEvidence() for later audit/replay, outside this blind block
```

## Prohibited at this stage

- real participant IDs or responses;
- production DB writes;
- speech/media;
- durable authority;
- deployment/UI work;
- predictive-quality claims from synthetic traces.
