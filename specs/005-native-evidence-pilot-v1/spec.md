# Specification: Nếp-native Evidence Pilot V1

**Issue**: #143 (`CORE-REALITY-002`)  
**Contract**: `nep.native-evidence-pilot.v1`  
**Base**: `frontier/nep-core-foundation-v1` @ `ef42f2cf96f9aa079505ad73c83c0555a470bfab`  
**Stage**: N1/N2 only — no human collection is authorized by this spec.

## Problem

The SLAM B3 compatibility gate can test strong longitudinal baselines but cannot construct canonical Nếp learner evidence without inventing ontology target, role/activity/modality, support/reveal, transfer-context, or validated provenance semantics. The next experiment therefore needs a tiny first-party trace whose task semantics are known before the learner responds.

This is an instrumentation/falsification pilot, not a new learner-model architecture and not a learning-efficacy study.

## Scientific question

Can the merged `nep.learner-evidence-state.v1` representation be emitted faithfully from prospectively specified tasks, and—only after a separately approved bounded human pilot—does adding its pre-attempt state features provide useful next-attempt error signal beyond a strong simple causal history baseline under the same estimator?

## Frozen V1 scope

Use exactly one ontology target:

`nep.en.v1.language-system.syntax-grammar`

This node is intentionally broad. V1 tests evidence/state mechanics on a narrow task family; it does **not** claim fine-grained grammar mastery or CEFR coverage. If this granularity destroys useful signal, that is an accepted falsification outcome.

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

Primary future label: next-attempt binary error (`1 = incorrect`, `0 = correct`) on eligible independently scored attempts. A prediction is frozen immediately before the target attempt begins.

### B2-native — simple causal history baseline

Only information available before the target attempt:

- prior eligible attempt count;
- prior positive and negative counts;
- prior success rate, null when no labeled history exists;
- previous outcome with explicit missing state;
- seconds since previous attempt, null when none;
- current task family;
- current planned support level;
- current reveal-allowed flag;
- current transfer distance.

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

Train-constant columns are removed identically from B2/B3 preprocessing. No B3 feature may include the current attempt outcome, actual reveal use, current response latency, or any future event.

The comparison of interest is B3-native vs B2-native, not `provisionalRoutingScore` vs labels.

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
- B2/B3 feature extraction and manifest generation.

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
