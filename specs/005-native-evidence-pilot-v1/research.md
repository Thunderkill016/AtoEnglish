# Research Notes: Nếp-native Evidence Pilot V1

## Why a native pilot is warranted

The public SLAM lane remains valuable for B0/B1/B2 future-error baselines, but its released schema cannot establish the task/evidence semantics required by the merged learner-state contract without retrospective guesses. The scientifically correct B3 outcome on SLAM is therefore `not-applicable`, not a fabricated mapping.

A native trace changes only one thing: the experiment owns the task definition before the response, so role, activity, modality, support/reveal policy, context and transfer intent are known rather than reverse-engineered.

## Why syntax/grammar is the single V1 target

The executable ontology currently exposes broad top-level language-system nodes. `syntax-grammar` permits `meaning-recognition`, `free-recall`, `near-transfer` and `far-transfer`, which is enough to exercise supported exposure, independent retrieval and changed-context evidence without speech/media.

The node is coarse. To reduce content heterogeneity without inventing ontology authority, V1 uses the non-canonical context/content tag `pilot-slice:present-subject-verb-agreement`. This tag is experimental metadata only. A result showing that the canonical node remains too coarse is useful evidence to refine ontology granularity later.

## Why text/choice only

Text/choice minimizes privacy burden and avoids coupling the learner-state experiment to unfinished speech scoring. It also keeps evaluator semantics deterministic enough for N2 synthetic plumbing.

## Why delayed free recall instead of a `retention-probe` role

The selected ontology target does not currently advertise `retention-probe` as an allowed evidence role. V1 therefore uses a later `free-recall` opportunity with an explicit causal cutoff. The delay is part of experiment timing, not a claim of certified retention.

## Why recognition is history, not the primary label

The main target is future independent performance. Recognition tasks are useful because they create controlled supported/unsupported history and reveal-use variation. Primary prediction rows are therefore free-recall, delayed-free-recall and near-transfer attempts; recognition outcomes remain lawful past evidence but are not used to inflate the number of primary evaluation targets.

## Strong-baseline principle

B2-native receives obvious causal support/reveal/context aggregates in addition to generic success/recency history. Otherwise any B3 improvement could simply mean that B3 had access to known host information deliberately withheld from B2. B3 must earn improvement from the semantic/state representation on top of a competent simple history baseline.

Because several B3 sufficient statistics may duplicate B2 aggregates, exact duplicate/train-constant columns are removed and reported. A null B3 gain is an acceptable signal to simplify the representation.

## Falsification targets

N2 should try to break these assumptions:

1. prospectively known task fields are sufficient to issue canonical reference evidence;
2. supported recognition cannot silently become independent retrieval evidence;
3. unknown remains unknown before first evidence;
4. learner state can preserve conflict/support/reveal/context history without ambient time;
5. transfer requires an intentional prior context and changed-context task;
6. B3 feature extraction can be frozen before the target outcome and remain leakage-free;
7. participant deletion can deterministically remove all participant-scoped synthetic artifacts;
8. B2 and B3 can share one frozen predictor without label-budget or preprocessing asymmetry.

## Estimator selection

Do not copy #141 hyperparameters merely because code already exists. Reuse its vetted libraries, manifest conventions and causal evaluation patterns, but select/freeze `nep.native-predictor.v1` during N2 using synthetic numerical/stability checks only. The choice and hyperparameters are locked before any human N3 labels exist.

## Human pilot sizing

No round-number sample size is frozen in N1. Before N3, a sizing note must connect participant/attempt count to a specific falsification or estimation target and state what result will be reported when precision is inadequate. A small pilot must not be stretched into an efficacy claim.

## Proposed privacy policy for later review

Draft only; not authorization to collect:

- adults 18+ only;
- explicit research consent version recorded separately from response data;
- pseudonymous random research participant IDs, no production account identifier in analysis files;
- raw text responses separated from derived evidence/features;
- no speech/audio/video;
- deletion request removes identity mapping, raw responses and participant-scoped derived artifacts where still identifiable;
- proposed raw-response retention: 30 days after pilot data lock;
- proposed pseudonymous derived-event retention: 180 days after pilot data lock, then delete or irreversibly aggregate;
- access limited to the research/engineering owner path used for the pilot;
- no silent secondary use.

Retention values remain a proposal until N3 privacy review.
