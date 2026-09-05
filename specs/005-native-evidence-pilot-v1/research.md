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

Do not copy #141 hyperparameters merely because code already exists. The comparison below proposes
the estimator and settings in the existing contract. Reuse vetted libraries, manifest conventions
and causal evaluation patterns; N2 verifies/fingerprints numerical behavior and does not select a
learner-model winner from synthetic accuracy. Statistical choices are locked before N3 labels.

## Comparative frontier review — proposed amendment, 2026-09-05

Task: [CODEX-CORE-FRONTIER-001](https://github.com/Thunderkill016/AtoEnglish/issues/143#issuecomment-5549802534).
Reviewed Spec #005 at `cfee784beb82937d4d73a154c1722d4ba58f425c`, based on frontier
`ef42f2cf96f9aa079505ad73c83c0555a470bfab`. PR #145 has no independent approval at
this review snapshot. These amendments propose an experiment; they do not activate N2 or N3.

### Repository reconciliation

- [PR #128](https://github.com/Thunderkill016/AtoEnglish/pull/128): preserve the constitution's
  observation/evidence/state/authority distinctions; the benchmark promotion and source registry
  references supply scoped measurement and separate code/data rights requirements.
- [PR #144](https://github.com/Thunderkill016/AtoEnglish/pull/144), inspected at
  `490fbcd0fcfbf161a475a17463445410ef67e99e`: B3 is `b3-not-applicable-on-slam`, zero eligible
  tracks, no B3 scoring. B0/B1/B2 have not run on legitimately staged real corpus bytes either.
  Native activation is a semantic coverage decision, not evidence that a native model wins.
- Its `requirements.lock` pins numpy 2.2.3, scipy 1.15.2, scikit-learn 1.6.1 and rfc8785 0.1.4.
  Reuse their isolated research environment and manifest patterns after dependency integration
  is approved. The branch is not a merged dependency here. Its million-column hashed SGD setup
  is inappropriate for this tiny explicit feature table. Its metric wrapper rejects single-class
  rows before calculating log loss and lacks Brier; adapt that boundary rather than copy it.
- [PR #139](https://github.com/Thunderkill016/AtoEnglish/pull/139) at
  `18606b1111dc92dabd0b729ced89ed377d83f960` remains held reference work. No generic adapter
  dependency or production approval is inferred. PR #107 is outside this text/choice decision.
- `src/lib/core/learner-state.ts` owns the actual projection. `conflictedCount = min(positive,
negative)` when both exist. Status, uncertainty and provisional score are deterministic
  functions of aggregate counts. They are neither calibrated probabilities nor new observations.
  The first/last timestamps are accepted-evidence times. `sameContextCount` is a total, not a
  success count; derive same-context outcome splits from accepted records when needed.

No governing conflict was found. The changes below intentionally refine the existing feature
budget and freeze gate for independent review. They do not reinterpret a stable core contract.

### Frontier comparison matrix

Roles describe the bounded decision, not permission to ship. Evidence strength concerns methods
on their stated populations; **no candidate has demonstrated predictive value on this pilot**.

| Candidate / sources                        | Role                     | Comparable assumptions and evidence                                                                                                    | Expected advantage / cost                                                                       | Selection decision                                                                                                |
| ------------------------------------------ | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Regularized logistic history / PFA [S1–S2] | adapter candidate        | Prospective binary outcomes with prior success/failure counts; established performance-model formulation                               | Explicit low-dimensional features; CPU, no latent learner/item embeddings                       | Select the common estimator with role-aware counts and elapsed time; freeze before N3                             |
| Classical BKT / pyBKT [S3]                 | benchmark-only           | Repeated binary opportunities for a stable skill; published tutor-data and synthetic recovery evidence, not native English calibration | Four pooled parameters, inspectable update; CPU; estimation needs varied longitudinal responses | Conditional comparator on independent text recall only; never fabricate a choice-to-recall skill mapping          |
| DAS3H [S4]                                 | benchmark-only           | Timed multi-skill opportunities; student-held-out math evaluations using AUC/NLL                                                       | Tests history recency/window representation; more parameters and delay variation required       | Use as temporal-design reference; defer full multi-window fitting, no original-source copying                     |
| Rasch/IRT via mirt [S5]                    | benchmark-only           | Shared items, connected learner-item design, local independence and estimable difficulty                                               | Separates item difficulty from learner variation; R/estimation overhead                         | Defer latent ability/2PL/MIRT; first balance stimulus forms and expose fixed task-family context to every model   |
| FSRS / SRS benchmark [S6]                  | reject for this slice    | Repeated identifiable memory items, review grades and intervals; flashcard population                                                  | Useful declarative retention prediction; item identity/rating mapping absent here               | Preserve existing scheduler. Do not turn changing grammar tasks or binary correctness into fabricated FSRS grades |
| AKT / pyKT [S7]                            | reject for initial pilot | Large sequential educational benchmarks, skill/item vocabularies; strong evaluation reference                                          | Flexible interactions, larger fitting/tuning and runtime budget                                 | Defer neural challengers until sufficient native TRAIN data and separate freeze; no pretrained transfer assumed   |
| Sigmoid/isotonic calibration [S8]          | benchmark-only           | Independent calibration data from the deployment population                                                                            | Calibration may improve probabilities but consumes scarce labels; isotonic can overfit          | No calibration fit in initial ladder; report calibration diagnostics first                                        |
| Split conformal [S9]                       | benchmark-only           | Exchangeable calibration/test units for the usual marginal guarantee                                                                   | Explicit set coverage, but extra held-out data and dependence analysis                          | No conformal guarantee on correlated attempts; no conversion of routing uncertainty into calibrated coverage      |

### Source / provenance ledger

All links were inspected on 2026-09-05. Pins identify reviewed source, not installed components.
No code, checkpoints, learner corpora or paper text are copied. Dataset access is separately
gated; no public data is ingested for this amendment.

- **S1 — predictor and metrics.** [scikit-learn 1.6.1 logistic API](https://scikit-learn.org/1.6/modules/generated/sklearn.linear_model.LogisticRegression.html),
  [metric definitions](https://scikit-learn.org/1.6/modules/model_evaluation.html),
  [group/temporal split documentation](https://scikit-learn.org/1.6/modules/cross_validation.html).
  [Source pin](https://github.com/scikit-learn/scikit-learn/tree/f159b78dc59f250cdde8fe391a21f0bc871960ad),
  [BSD-3-Clause](https://github.com/scikit-learn/scikit-learn/blob/f159b78dc59f250cdde8fe391a21f0bc871960ad/COPYING).
  No weights/data selected. These are implementation/method references, not a learner benchmark.
- **S2 — PFA.** [Pavlik, Cen and Koedinger, 2009](https://digitalcommons.memphis.edu/facpubs/8350/);
  [KTM implementation](https://github.com/jilljenn/ktm/tree/12084d691173147477fb9d373801a67efe55eb4b),
  [MIT](https://github.com/jilljenn/ktm/blob/12084d691173147477fb9d373801a67efe55eb4b/LICENSE).
  Prior skill-specific successes/failures predict correctness; original tutoring results and
  KTM datasets are not a native English split. No external coefficient, dataset or exact score
  is imported. Our regularized temporal/role controls are an explicitly named adaptation, not
  a claimed reproduction of original PFA.
- **S3 — BKT.** [pyBKT EDM 2021 paper](https://educationaldatamining.org/EDM2021/virtual/static/pdf/EDM21_paper_237.pdf),
  [official implementation](https://github.com/CAHLR/pyBKT/tree/06fc180ae72c117458acc527f8ec90cc8e0581c1),
  [MIT](https://github.com/CAHLR/pyBKT/blob/06fc180ae72c117458acc527f8ec90cc8e0581c1/LICENSE).
  Evidence includes ASSISTments/Cognitive Tutor and simulated parameter recovery. Their sequence
  or cohort sizes are not universal thresholds. [Identifiability analysis](https://eric.ed.gov/?id=ED596611)
  and [constraints study](https://educationaldatamining.org/edm2024/proceedings/2024.EDM-long-papers.2/index.html)
  distinguish theoretical identifiability from finite-sample/semantic degeneracy. Example data
  rights remain unreviewed; no pretrained parameters selected.
- **S4 — temporal history.** [DAS3H paper, 2019](https://arxiv.org/abs/1905.06873),
  [original code pin](https://github.com/BenoitChoffin/das3h/tree/e77770af5e18ba0b9841840be67cfa9b5a91e449).
  Five-fold student-level math evaluation, AUC and negative log-likelihood; multi-skill temporal
  windows need varied delays. Original code license unresolved (license endpoint absent); no
  copying. MIT KTM is a separate implementation reference, not retroactive licensing of DAS3H.
  Dataset terms/weights remain unapproved.
- **S5 — psychometrics.** [Chalmers 2012, mirt](https://www.jstatsoft.org/article/view/v048i06),
  [mirt 1.47.1 source](https://github.com/philchalmers/mirt/tree/04f801fbfea1b8b07828722977ca8b584f2552e0),
  [GPL >=3 declaration](https://github.com/philchalmers/mirt/blob/04f801fbfea1b8b07828722977ca8b584f2552e0/DESCRIPTION).
  Estimation/method reference, not a native predictive benchmark. No parameters, bundled data
  or production dependency adopted. Sparse unique forms do not establish a calibrated item bank.
- **S6 — retention.** [FSRS algorithm](https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm/e6ded59fa6d1d6bb2950a759d53b14575e9e586c),
  [ts-fsrs v5.4.1](https://github.com/open-spaced-repetition/ts-fsrs/tree/bfc0a1960dfde4b4627ae4f4c8757b9211314963),
  [MIT code](https://github.com/open-spaced-repetition/ts-fsrs/blob/bfc0a1960dfde4b4627ae4f4c8757b9211314963/LICENSE),
  [SRS benchmark snapshot](https://github.com/open-spaced-repetition/srs-benchmark/tree/b4b02549fdf21afcbeb5f4098f6c3623c46ca5d2).
  Anki review histories, chronological splitting, log loss/AUC/binned error inform methodology.
  Benchmark code license and review-data permissions were not established here; reference only.
  Default parameters are not a calibrated Vietnamese syntax model.
- **S7 — neural KT.** [AKT paper](https://arxiv.org/abs/2007.12324),
  [AKT source/MIT](https://github.com/arghosh/AKT/tree/01b7e8d7d7c862cabc9467108e3e7f2555653a88);
  [pyKT paper](https://arxiv.org/abs/2206.11460),
  [pyKT source/MIT](https://github.com/pykt-team/pykt-toolkit/tree/2fc4d64880956f21155a238d0b0302ac42cb5196).
  Educational math/statics/programming datasets and learner-split response AUC support comparison
  methodology, not tiny-pilot or knowledge-state validity. Data/checkpoint permissions are
  separately unresolved; none adopted. Keep leakage-safe question/skill expansion as a reference.
- **S8 — calibration.** [scikit-learn 1.6.1 calibration API](https://scikit-learn.org/1.6/modules/generated/sklearn.calibration.CalibratedClassifierCV.html),
  same BSD-3-Clause pin as S1. The docs warn about isotonic overfitting with small calibration
  samples. That warning is not a universal native sample-size rule. Neither method creates
  independent calibration data or guarantees scoped validity.
- **S9 — uncertainty.** [Angelopoulos and Bates, arXiv:2107.07511v6](https://arxiv.org/html/2107.07511v6).
  Primary tutorial on marginal coverage and distribution/dependence limitations; no native
  population benchmark. Paper is reference-only under its arXiv distribution terms. No code,
  model or dataset artifact adopted; a code license is not inferred from visible notebook snippets.

### Decision and falsification rationale

Select a regularized PFA-inspired causal-history baseline as the practical first comparator.
Aggregate-only history is insufficient: role-specific outcomes, support and delay should be
available to it too. BKT is a useful conditional external comparator, not an obligatory source
of four supposedly calibrated parameters from a tiny pilot. IRT needs shared item information;
FSRS needs a defensible memory-item/rating mapping; neural KT needs a much richer training regime.
These are applicability judgments, not observed native rankings.

The Nếp-specific gap is the prospective semantic and authority ledger plus reproducible projection,
not a missing generic estimator. Add no new latent-state equation here. Test representation value
with the same estimator, accepted-history inputs and rows. The prediction contract below freezes
an algebraic-reconstruction control so re-encoding counts cannot be marketed as new information.

| Mechanism                                                  | Current decision (no human test yet) | Falsification / removal path                                                                                                      |
| ---------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Prospective task/evidence lineage and explicit missingness | KEEP as a contract requirement       | N2 must reject unsupported role/transfer or invented known values; redesign instrumentation on failure                            |
| Duplicate B3 counts                                        | SIMPLIFY the predictor input         | Remove exact or algebraically identical columns, retain canonical ledger fields for audit                                         |
| Status/uncertainty/routing representation                  | GATHER_MORE_EVIDENCE                 | Compare B3 and reconstructed-count control; simplify predictor features when material gain is excluded                            |
| Role/support/context/recency structure                     | GATHER_MORE_EVIDENCE                 | Give causal forms to B2; ablate groups without changing rows or labels; do not remove safety metadata on a null predictive result |
| Coarse syntax target                                       | GATHER_MORE_EVIDENCE                 | If controlled task forms remain heterogeneous, REDESIGN measurement in a separately scoped task; no automatic ontology expansion  |
| BKT/IRT/neural or retention extension                      | GATHER_MORE_EVIDENCE                 | Require semantic applicability and training/recovery gates first; exclude unstable/inapplicable comparators with reasons          |

No Nếp-specific predictive mechanism has been empirically tested by this research amendment.

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
