# Contract: `nep.native-evidence-pilot.v1`

## Authority

This contract specifies N1 and conditional N2 synthetic plumbing. N2 starts only after independent
approval of amended Spec #005. It does not authorize human recruitment, production ingestion,
durable assessment, UI deployment, or data reuse.

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

### Proposed predictor freeze: `nep.native-predictor.v1`

Pending independent approval of amended Spec #005. This section specifies future N2 work; no
predictor, human collection or fit is implemented by this documentation change.

| Lane            | Frozen role                   | Inputs / estimator                                                                                                                            |
| --------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| B0-native       | Mandatory prevalence floor    | TRAIN primary-target errors; `(errors + 1)/(rows + 2)`, a declared Beta(1,1) smoothing prior, not evidence of unknown mastery                 |
| B2-native       | Mandatory strong history      | Fixed task metadata and causally permitted accepted-history features below; L2 logistic regression                                            |
| B2-basis-native | Mandatory attribution control | B2 plus the same status/uncertainty/routing transforms reconstructed directly from B2 counts, without calling the projector; same estimator   |
| B3-native       | Mandatory representation test | B2 plus the reviewed projector feature groups; same estimator                                                                                 |
| BKT-native      | Conditional benchmark-only    | Pooled classical BKT on independent same-context text recall and delayed recall; compare all mandatory lanes on that identical subset as well |

Primary contrast is B3 minus B2. B3 minus B2-basis diagnoses whether a gain is simply an explicit
basis expansion. An algebraic reconstruction is an analysis control only, never a parallel
learner model or evidence issuer. No fitted native model is selected by synthetic accuracy.

**Common estimator:** scikit-learn 1.6.1 `LogisticRegression(penalty="l2", C=1.0,
solver="lbfgs", fit_intercept=True, class_weight=None, max_iter=1000, tol=1e-8)` in the isolated
research environment. C=1 is a fixed regularization convention, not a claimed optimum; 1000
iterations and tolerance bound numerical convergence. Keep these settings equal in all logistic
lanes. Fit coefficients only on authorized TRAIN labels. N2 may correct numerical implementation
errors; changing statistical choices requires a reviewed manifest revision before N3.

No participant ID feature, learned participant/item embeddings, feature hashing, class balancing,
hyperparameter search or post-hoc calibration. Nonconvergence or one-class TRAIN reports
`not-estimable`, with B0 still reportable; never substitute a different successful estimator.

### Shared information budget and feature audit

B2 and B3 consume the same accepted TRAIN evidence and the same prospective current-task fields.
Record rejected, unobserved and unlabeled attempts in the audit ledger, not as negative examples.
Add to the existing B2 budget: positive/negative counts by pilot task family, role and support
bucket; near-transfer successes/failures; same-context successes/failures; elapsed seconds since
first accepted evidence; current planned context tag and stimulus-form group. All are host-known
or reconstructed from the same accepted records. Arbitrary free text/content hashes are lineage,
not model features. Role and modality remain separate metadata even when redundant in this slice.

Use `log1p` for counts and nonnegative elapsed seconds; observed success rates stay on [0,1].
Preserve every raw feature's availability mask. A known count of zero differs from an unobserved
value. Fit numeric means/scales on TRAIN only; missing numerics become zero in standardized model
space with an explicit missing indicator. This transport encoding never overwrites raw nulls.
Categorical vocabularies come from the prospective task matrix plus explicit unknown; no TEST
vocabulary discovery. Remove TRAIN-constant/exact-duplicate columns in stable name order with
B2 columns preferred. Persist the fitted transforms and retained-column manifest, reuse unchanged
on evaluation. No selection using labels, DEV or TEST features.

For each B3 column, record source field/function, earliest availability, algebraic dependency,
and one of `duplicate | deterministic-transform | additional-causal-summary`. In particular:

- totals, role/support/reveal/context counts and first/last times overlap the strengthened B2;
- `conflictedCount` is the smaller positive/negative count, not adjudicated contradiction;
- status/uncertainty/score derive from totals and outcome counts in the pinned projector;
- delayed/free recall share `free-recall` in the projector; B2 retains prospective task family;
- no calibrated probabilistic uncertainty, elapsed-time forgetting model or new sensor appears.

If B3 has no nonduplicate columns, emit `no-additional-features` and reuse B2 predictions. If
B2-basis and B3 design matrices match, report equivalence. A different feature encoding can improve
finite-sample prediction, but cannot be claimed to add information absent from the shared history.
One-at-a-time removal of status/uncertainty, routing, and role/support/context/recency groups is
diagnostic; freeze group definitions before labels, keep rows fixed, and never select the most
favorable ablation for the primary conclusion.

### Causal split and label policy

Freeze participant allocation and protocol block boundaries before N3, independently of outcomes.
The approved task schedule must define a TRAIN-prefix endpoint before delayed/transfer probes;
its exact event IDs and timestamps are recorded before labels arrive. A known transfer baseline
must be in that prefix. Counterbalance stimulus-form groups across families/blocks prospectively;
do not infer item difficulty from TEST outcomes.

1. **Primary: within-learner future block.** TRAIN uses prefix attempts; evaluate the fixed later
   independent-target block. For every row, both `occurredAt` and host `availableAt` of every
   contributing event must precede `predictionTimestamp`. Fit/preprocessing uses TRAIN only.
   TEST-block labels remain blind until _all_ its predictions are frozen and never update
   later feature rows. This estimates fixed-prefix future prediction, not an online adaptive policy.
2. **Secondary: new-learner cold start.** Leave one whole participant out; fit on other participants'
   TRAIN-prefix rows only, using the same global fit cutoff. The held-out participant contributes
   no fitting, preprocessing or label history. All that participant's prediction features start
   unknown; report the expected absence of personalized B3 signal. Never mix this estimate with
   the primary within-learner result. Personalization after a labeled warm-up needs a separate,
   explicitly labeled future protocol; it is not silently added here.

TRAIN feature rows also precede their own labels. Equal timestamps are excluded unless a frozen
host sequence proves strict prior availability; ordering by event ID alone is not causal proof.
No current outcome, actual reveal use, response latency, evaluator-after-response field, late-arriving
label, or DEV/TEST gold may enter features. Mutating future/current labels must leave features and
predictions byte-identical. Authorized TRAIN-prefix history replay is distinct from evaluation-gold
feedback. Missing outcomes remain unscored and reduce reported outcome coverage.

Both protocols have a common global `fitCutoff` before every evaluated prediction. Every pooled
TRAIN label must be available by that cutoff, and model/transform fitting must finish before
`predictionTimestamp`. No future prefix from another participant can train an earlier prediction.
Record `fitCompletedAt` explicitly; fail the row if timing cannot establish this order.

### Classical comparator gate

BKT uses the pyBKT source pinned in research.md; source pin alone is not an execution lock.
Before enabling it, N2 must record package/dependency hashes, a four-parameter model without
per-learner parameters, constraints `0 < p < 1` and `1-slip > guess`, deterministic initializations,
and explicit predict-before-update ordering. Recovery/initialization and degenerate/all-one-label
synthetic tests establish plumbing and numerical behavior only. Fit on the same TRAIN-prefix
independent recall subset; compare B0/B2/B2-basis/B3 on exactly its evaluation subset too.

Choice recognition and near-transfer are excluded from this comparator because a single shared
emission/transition model would assume equivalence the pilot has not established. Report this
reduced coverage. Boundary fits or materially initialization-sensitive predictions produce
`not-estimable`, not a new hyperparameter search or fabricated latent knowledge estimate. No
universal minimum cohort size is claimed. Full IRT, FSRS and neural KT remain outside N2.

Proposed numerical gate, fixed before native outcomes: no forgetting; initialize
`(prior, learn, slip, guess)` at `(0.2,0.1,0.1,0.2)`, `(0.5,0.05,0.2,0.2)` and
`(0.8,0.2,0.1,0.1)`. Bound each fit to 1000 EM iterations and require absolute TRAIN
log-likelihood change <= 1e-8 for convergence. Reject a parameter within 1e-6 of 0 or 1, or a
known-minus-unknown correctness gap <= 1e-6. Compare all converged fits' pre-update probabilities
on TRAIN-prefix rows only; maximum pairwise absolute difference > 0.01 is initialization-sensitive.
Require all three fits to pass; select the greatest TRAIN likelihood with initialization order
as tie-break. These are conservative engineering diagnostics, not universal identifiability
criteria. If the pinned API cannot enforce/report them, mark the comparator unavailable and
review a wrapper before enabling it; no silent replacement or TEST-based inclusion.

BKT receives less information than B2/B3: omitted recognition/instruction events cause no
transition in this opportunity-index comparator. Matched evaluation rows do not make it an
equal-information architecture ablation. Classical no-forgetting BKT is not a delay/retention
model, even when delayed recall is one of its prediction targets.

### Metrics, uncertainty and decision rule

Positive class is error (`1`). Primary is mean per-learner log loss (natural logarithm); secondary
is mean per-learner Brier loss. Also report attempt-weighted versions, AUC where both classes
exist, task-family/phase breakdowns and cold-start counts. AUC is null with an explicit reason
for one-class subsets; still calculate their log loss and Brier. Reject invalid probabilities;
only metric evaluation clips finite [0,1] probabilities to `[1e-15, 1-1e-15]` for finite log loss,
with clipping counts and epsilon recorded. Never alter stored predictions.

Report eligible opportunities, observed binary outcomes, emitted predictions, accepted/rejected
history, learners and attempts. Prediction coverage and outcome coverage use the full planned
eligible opportunity denominator; B3-usable-history coverage is separate. Do not drop unknown
learners to improve a metric. Non-estimable model lanes retain their coverage/failure record.

A learner with zero observed evaluable outcomes has undefined loss and stays in coverage counts.
The mean over learners with observed outcomes does not estimate accuracy on missing outcomes.
N3 sizing review must freeze minimum outcome/prediction coverage and maximum between-lane coverage
difference before collection; without those numeric gates, any predictive KEEP/SIMPLIFY decision
is disabled. Report attrition by family/phase rather than imputing missing outcomes.

Calibration is descriptive: mean predicted error vs observed error and five fixed equal-width
probability bins, with bin counts and empty bins explicit. Brier/log loss also reflect discrimination;
they are not isolated calibration proofs. No calibrated/mastery claim or tuned abstention threshold.
No conformal coverage claim is permitted from these clustered sequential attempts.

For paired B3-B2 losses, resample whole learners (all their ordered rows together), 2000 times,
seed 143, report percentile 95% intervals and learner count. This computational budget is not a
sample-size/power rule; use the same paired draws for all lanes. With fewer than two learners,
report descriptive differences only. Small-cluster intervals remain exploratory. A separate N3
sizing review must justify sufficient precision and recruitment for the fixed estimand; otherwise
N4 returns `GATHER_MORE_EVIDENCE`, even if a nominal interval looks favorable.

Proposed material gain margin: 0.01 nats in the equal-learner-weighted mean of within-learner
per-attempt losses, frozen as an engineering usefulness criterion, not a published efficacy
threshold. Apply these rules in order:

1. `REDESIGN` for semantic/lineage failures or uncontrolled form/difficulty confounding.
2. `SIMPLIFY` predictor columns proven exactly redundant, without a predictive claim.
3. `GATHER_MORE_EVIDENCE` if sizing or frozen matched-coverage gates are absent/unmet.
4. `KEEP` augmentation if the paired B3-minus-B2 primary log-loss interval upper bound < -0.01
   and paired Brier interval upper bound <= 0.
5. `SIMPLIFY` augmentation if the primary interval lower bound > -0.01 (material gain excluded).
6. Otherwise `GATHER_MORE_EVIDENCE`, including exact margin equality and a log-loss win with
   worsening/inconclusive Brier. Do not switch the primary metric after seeing this conflict.

Never remove authority, privacy or unknown-handling safeguards because they fail to improve AUC.

### Additional N2 acceptance cases and manifest

Synthetic tests must cover: algebraic reconstruction/duplicate pruning; role-specific history;
late-label availability; equal-time exclusion; pooled-fit availability; fit-transform leakage; learner split isolation;
one-class log loss/Brier with null AUC; one-class TRAIN non-estimability; paired-cluster draws;
missing vs observed zero; no-additional-feature equivalence; complete-case selection refusal;
and deletion invalidating all dependent feature/model/result artifacts before reproducible rerun.

The manifest binds source/data rights, code/dependency versions, estimator/settings, feature
derivations/groups/column pruning, TRAIN IDs and cutoff/availability policy, prediction IDs/hashes,
task/content versions, split membership, model/prediction artifact hashes, missingness/coverage,
metric/clip/bin/bootstrap settings, non-estimability reasons, and decision rule version.
Every N2 output states `synthetic-plumbing-only`; no synthetic metric is a model-ranking result.

## Human-data prohibition

N3 remains disabled until a separately reviewed privacy/consent protocol and explicit owner approval. Synthetic data may not be described as learner evidence.
