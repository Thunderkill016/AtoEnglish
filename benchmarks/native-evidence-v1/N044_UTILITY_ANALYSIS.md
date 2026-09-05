# N044 — pre-N3 utility / sensitivity analysis

Status: **proposal for independent review**. This document does not approve a utility margin, authorize human collection, or create learner-facing intervention policy.

## Question

Spec #005 withdrew the former `0.01` nat material-gain threshold because predictive log-loss improvement has no universal mapping to learner benefit. N044 asks whether a positive `delta_history` and `delta_basis` can be justified before N3 from an explicit downstream decision model without using human pilot outcomes.

## Bounded downstream decision model

The only modeled decision is binary: `intervene` or `no-intervention` on a future error opportunity. For a true error probability `q`, the synthetic analysis uses:

- no-intervention cost: `q * missed_error_cost`;
- intervention cost: `intervention_burden + (1-q) * false_intervention_cost + q * (1-effectiveness) * missed_error_cost`.

A prediction selects `intervene` only when its modeled intervention cost is strictly lower. Exact ties select no intervention. When the denominator is positive, the implied probability boundary is:

`(intervention_burden + false_intervention_cost) / (effectiveness * missed_error_cost + false_intervention_cost)`.

This is a decision-theoretic stress model only. The repository has no empirical estimate of these costs or of intervention effectiveness for this pilot.

## Frozen synthetic assumptions

Three normalized profiles are exercised so the result is not tied to one arbitrary cost ratio:

1. `balanced-normalized`: false cost `1`, missed cost `1`, burden `0`, effectiveness `1`;
2. `intervention-costly`: false cost `1`, missed cost `2`, burden `0.25`, effectiveness `0.5`;
3. `missed-error-costly`: false cost `0.5`, missed cost `3`, burden `0.1`, effectiveness `0.75`.

These numbers are not learner-value estimates. They exist only to expose sensitivity to plausible changes in the decision assumptions.

## Frozen log-loss sensitivity grid

`0`, `0.0025`, `0.005`, `0.01`, `0.02`, `0.05`, `0.1` nat.

Zero and the former `0.01` value are sensitivity points only. Spec #005 requires any approved primary margin to be positive and independently justified; zero cannot silently enable KEEP/SIMPLIFY.

## Synthetic counterexamples

Under the balanced normalized profile, the frozen cases deliberately separate probability quality from thresholded action utility:

| Scenario | Expected log-loss difference, candidate - control | Action change | Policy-cost difference, candidate - control |
| --- | ---: | --- | ---: |
| large log-loss gain, no action change | about `-0.0845` | none | `0` |
| small log-loss gain, beneficial crossing | about `-0.0040` | no-intervention -> intervene | about `-0.10` |
| large log-loss gain, harmful crossing | about `-0.4883` | no-intervention -> intervene | about `+0.02` |
| large log-loss gain, low-risk no action | about `-0.0845` | none | `0` |

Negative differences are better for both losses. The point is not that any one case is realistic. The point is that even under a single explicit cost profile, larger expected log-loss improvement is not monotone in thresholded intervention utility: a small gain can matter, a much larger gain can do nothing, and an even larger gain can move the action in the costly direction when the predicted probability remains imperfect.

The machine-readable report recomputes every case under all three assumption profiles and records which values in the frozen sensitivity grid each synthetic log-loss difference clears.

## N044 disposition proposed by this branch

**Do not freeze numeric materiality margins from this analysis.** Proposed status:

- `delta_history = null`;
- `delta_basis = null`;
- margin status `unjustified`;
- predictive KEEP/SIMPLIFY remains disabled;
- if the later privacy/sizing gates are separately approved, N3 may at most be approved as descriptive-only unless an independent reviewer supplies a defensible pre-N3 utility mapping.

Rationale: the experiment currently lacks independently grounded false-intervention cost, missed-intervention cost, intervention burden, and intervention-effectiveness estimates. Choosing a positive log-loss cutoff from the synthetic grid would only convert arbitrary normalized assumptions into decision authority. The old `0.01` nat value is therefore not revived.

## Reproducibility and claim boundary

`benchmarks/native-evidence-v1/scripts/utility.py` owns the pure analysis. `emit_utility_analysis.py` emits a deterministic JSON report with its own SHA-256 payload digest. CI uploads that report as a synthetic artifact for independent review.

No human outcomes, intervention experiment, production data, calibration evidence, mastery evidence, learning-efficacy evidence, or production authority are used or produced here. Independent review must either justify and freeze positive margins with assumptions and artifact hash, or explicitly accept the descriptive-only lock. Until then N044 remains unresolved.
