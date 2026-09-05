# Specification: Nếp-native Evidence Pilot V1

**Issue**: #143 (`CORE-REALITY-002`)  
**Contract**: `nep.native-evidence-pilot.v1`  
**Base**: `frontier/nep-core-foundation-v1` @ `ef42f2cf96f9aa079505ad73c83c0555a470bfab`  
**Stage**: N1/N2 only — no human collection is authorized by this spec.

**Amendment status**: `CODEX-CORE-FRONTIER-001` comparative research proposal, based on PR #145
at `cfee784beb82937d4d73a154c1722d4ba58f425c`. Independent approval of this amended spec is
required before N2 implementation. The comparison matrix is in `research.md`; the proposed
predictor/split/metric freeze is in `contracts/native-pilot-contract.md`.

## Problem

The SLAM B3 compatibility gate can test strong longitudinal baselines but cannot construct canonical Nếp learner evidence without inventing ontology target, role/activity/modality, support/reveal, transfer-context, or validated provenance semantics. The next experiment therefore needs a tiny first-party trace whose task semantics are known before the learner responds.

This is an instrumentation/falsification pilot, not a new learner-model architecture and not a learning-efficacy study.

## Scientific question

Can the merged `nep.learner-evidence-state.v1` representation be emitted faithfully from prospectively specified tasks, and—only after a separately approved bounded human pilot—does adding its pre-attempt state representation provide useful next-attempt error signal beyond a strong simple causal history baseline under the same estimator?

## Frozen V1 scope

Use exactly one canonical ontology target:

`nep.en.v1.language-system.syntax-grammar`

Constrain content to one non-canonical pilot slice tag:

`pilot-slice:present-subject-verb-agreement`

The slice tag narrows stimulus content but **does not create a new ontology node or mastery claim**. The canonical target remains broad. If that granularity destroys useful signal, that is an accepted falsification outcome.

Task families:

1. `recognition-independent` — reading reception, choice response, `meaning-recognition`, support 0, reveal disabled, same context.
2. `recognition-supported` — reading reception, choice response, `meaning-recognition`, support level 1, reveal allowed; actual reveal use is recorded after the attempt.
3. `free-recall` — written production, text response, `free-recall`, support 0, reveal disabled, same context.
4. `delayed-free-recall` — same evidence semantics as free recall but scheduled after a host-supplied delay; the later outcome cannot contribute to its own pre-attempt features.
5. `near-transfer` — written production, text response, `near-transfer`, support 0, reveal disabled, `near-transfer` distance, intentionally changed context with a known prior baseline context.

No far-transfer, speech, audio, video, interaction, durable assessment, mastery, CEFR, or production analytics are in V1.

## Evidence boundary

Every attempt MUST originate from a versioned `CoreTaskSpec` and a matching `CoreObservation` / `CoreEvidenceCandidate`. Pilot evidence MUST be issued only through `validateReferenceCoreEvidence()` and must remain `authorityScope: "repository-reference"`.

The pilot MUST NOT:

- deserialize a detached envelope and treat it as trusted evidence;
- self-assert `authorityScope`;
- default unknown fields to 0/false;
- make an independent role (`free-recall`, `near-transfer`) supported or revealed;
- infer transfer from a new context after observing the outcome;
- certify durable/mastery authority.

## Prospective task semantics

Before any response is observed, each task instance must freeze:

- task ID/version and content fingerprint;
- canonical target ID;
- pilot content-slice tag;
- communication activity;
- response modality;
- allowed evidence role;
- support level and reveal policy;
- transfer distance;
- context ID/tags;
- scoring contract ID;
- source/provenance references.

Actual `revealUsed`, response latency, response content and outcome are attempt-time observations and cannot be used as current-attempt prediction features.

## Prediction protocol

Primary future label: next-attempt binary error (`1 = incorrect`, `0 = correct`) on independently scored target families:

- `free-recall`;
- `delayed-free-recall`;
- `near-transfer`.

Recognition families contribute causal history but are not primary prediction targets in V1. A prediction row is frozen immediately before the target attempt begins.

### B2-native — strong simple causal history baseline

Only information available before the target attempt:

- prior eligible attempt count;
- prior positive and negative counts;
- prior success rate, null when no labeled history exists;
- previous outcome with explicit missing state;
- seconds since previous attempt, null when none;
- prior support-level bucket counts;
- prior reveal-used count;
- prior distinct-context count;
- prior counts by the five pilot task families;
- current task family;
- current planned support level;
- current reveal-allowed flag;
- current transfer distance.

The comparative amendment strengthens this same budget with positive/negative counts by task
family, role and support bucket; transfer/same-context outcome counts; elapsed time since first
accepted evidence; and prospective context/form-group metadata. All lanes use the same accepted
TRAIN history. Rejected/unobserved attempts remain audit records rather than negative examples.

B2 deliberately receives obvious causal support/reveal/context history so B3 is not compared against a strawman that merely lacks information already known to the host.

### B3-native — same estimator + Nếp state features

Use the exact same rows, labels, split/cutoff policy and estimator as B2-native, adding only features derived from `projectLearnerState()` over **past accepted evidence**:

- construct status one-hot;
- uncertainty one-hot;
- `provisionalRoutingScore` plus missing indicator;
- total/positive/negative/conflicted event counts;
- distinct context count;
- per-role positive/negative counts for roles exercised by this pilot;
- support distribution counts;
- reveal-used count;
- same-context / near-transfer success and failure counts;
- seconds since first and last accepted evidence, derived against the explicit prediction timestamp.

Redundant B3 columns that are byte-identical to already-present B2 columns across the training split are removed before fitting and recorded in the manifest. Train-constant columns are removed identically from B2/B3 preprocessing.

For same-context outcome counts, use accepted-event outcomes: the projector's `sameContextCount`
alone has no success/failure split. Every added column must disclose whether it is a duplicate,
deterministic transform, or additional causal summary. B2-basis-native reconstructs the pinned
projector's count-derived status/uncertainty/routing transforms as an attribution control.
It has no evidence authority. If no additional features survive, report that explicitly.

No B3 feature may include the current attempt outcome, actual reveal use, current response latency, or any future event. The comparison of interest is B3-native vs B2-native, not `provisionalRoutingScore` vs labels.

## Estimator freeze gate

The comparison now proposes `nep.native-predictor.v1` in the existing contract: B0 prevalence,
strong causal B2, B2-basis attribution control, and same-estimator B3. L2 logistic settings,
preprocessing, label policy, metric definitions and decision rules are explicit. N2 must verify
and fingerprint that protocol **before any human N3 outcome exists**. Synthetic outcomes may
test numerical behavior but cannot select a scientifically superior learner model. BKT is a
conditional benchmark on a clearly reported recall subset; IRT/FSRS/neural KT are deferred.

### Evaluation questions and decisions

Primary: fixed-prefix future prediction within learners. Secondary: strict new-learner cold start
using whole-learner holdout and no held-out-label history. Keep the two estimands separate;
TEST-block labels remain blind until every prediction in that block is frozen. Availability
timestamps must prove prior knowledge, not merely a retrospectively earlier event timestamp.

Report learner-averaged log loss, Brier, AUC where defined, calibration diagnostics, coverage and
learner-clustered uncertainty under the contract. One-class subsets still have log loss/Brier.
Insufficient sample precision is `GATHER_MORE_EVIDENCE`; redundant/unhelpful predictor dimensions
can be `SIMPLIFY` without weakening evidence/authority safeguards. A native predictive win cannot
be inferred from a foreign benchmark, source popularity, or synthetic data.

## Synthetic N2 only

Synthetic actors may exercise:

- task validation;
- reference-evidence issuance;
- canonical ordering / append-only rejection;
- duplicate handling;
- unknown-vs-zero behavior;
- support/reveal accounting;
- delayed-attempt causal cutoffs;
- changed-context transfer gate;
- deletion/export plumbing;
- B2/B3 feature extraction and manifest generation;
- deterministic estimator plumbing after `nep.native-predictor.v1` is frozen.

Synthetic traces may prove plumbing correctness only. They MUST NOT produce a learner-model validity, predictive-quality, efficacy, retention, or transfer claim.

## Human-data gate

N3 is blocked until a separate review approves consent/privacy language and the owner explicitly authorizes collection. V1 human collection, if later approved, is adults-only and text/choice-only.

Before N3, the protocol must state:

- research purpose and consent version;
- pseudonymous participant ID generation independent of production accounts;
- no silent reuse of existing user analytics;
- raw text separated from derived learner-state events;
- deletion process;
- retention periods;
- access boundary;
- no minors;
- no speech/media.

## Decision outcomes

After N2: `plumbing-pass | redesign-instrumentation | stop`.

After a separately approved N4 analysis: `retain | simplify | redesign-measurement | gather-more-evidence`.

A negative/null result is valid. No outcome from this pilot alone promotes mastery, CEFR, learning efficacy, product readiness, or market quality.
