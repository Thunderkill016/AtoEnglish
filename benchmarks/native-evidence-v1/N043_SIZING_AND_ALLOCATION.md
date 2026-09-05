# N043 — pre-N3 sizing, coverage and allocation review candidate

Status: **proposal for independent review**. This document does not authorize human collection or claim that the pilot is powered for a predictive decision.

## Why this gate exists

Spec #005 requires the N3 design to freeze, before outcomes exist:

- recruitment / precision logic for the fixed estimands;
- minimum outcome and prediction coverage;
- maximum between-lane coverage difference;
- prospective stimulus-form allocation;
- TRAIN-prefix and blind TEST boundaries;
- whole-learner cold-start allocation.

The current repository has no human learner-level variance estimate for the paired log-loss contrasts. N044 also has no independently approved positive materiality margin. Therefore a single predictive participant count cannot be derived without inserting an arbitrary variance/effect target.

## Recruitment disposition

This branch deliberately returns:

`predictive-count-unjustified`

No predictive participant count is selected. Instead, the machine-readable report evaluates the planning approximation

`n = ceil((1.96 * learner_level_sd / target_half_width)^2)`

on the frozen learner-level log-loss SD grid `0.05, 0.10, 0.20, 0.40` nat and target 95% half-width grid `0.01, 0.02, 0.05, 0.10` nat.

Examples show why selecting a cell is consequential: assumed SD `0.10` with half-width `0.05` gives 16 complete learners, while SD `0.20` with half-width `0.02` gives 385. Neither SD nor target width is currently grounded for this population/decision. The approximation is sensitivity only, not a power theorem or bootstrap-coverage guarantee.

The only numeric recruitment constraint frozen here is structural: the **planned** cohort size must be a multiple of five so the prospective form allocation consists of complete counterbalance blocks. Independent review must either supply a defensible predictive count before N3 or keep predictive KEEP/SIMPLIFY disabled.

## Coverage decision gates

For any future predictive KEEP/SIMPLIFY decision this candidate uses deliberately fail-closed gates:

- row outcome coverage: `1.00` of the frozen planned TEST opportunities;
- learner outcome coverage: `1.00` of frozen learners;
- outcome coverage within each primary TEST family (`free-recall`, `delayed-free-recall`, `near-transfer`): `1.00`;
- prediction coverage for each mandatory paired lane (`B2`, `B2-basis`, `B3`): `1.00` of the full frozen planned denominator;
- maximum prediction-coverage difference between those lanes: `0.00`.

These are **decision gates**, not claims that missing outcomes below some other percentage would be missing at random. The reason for using complete coverage rather than inventing a 90%/80% cutoff is that the first native pilot has no attrition model capable of proving that the missing 10% or 20% is ignorable. If any planned outcome is absent, the data remain reportable with explicit attrition, but the bounded pilot cannot silently complete-case its way into predictive KEEP/SIMPLIFY.

Prediction coverage is even stricter operationally: the mandatory lanes share the same frozen rows and predictions are supposed to be created before labels. A lane-specific missing prediction therefore cannot be repaired by comparing only the surviving rows. Non-estimable lanes remain explicit failures, not absent data to intersect away.

## Prospective schedule

Each learner receives 11 planned opportunities. The cohort completes the whole TRAIN prefix before any blind TEST opportunity begins.

TRAIN prefix, 8 opportunities:

1. recognition-independent, baseline context;
2. recognition-supported, baseline context;
3. free-recall, baseline context;
4. near-transfer, changed context;
5. delayed-free-recall, baseline context on the next day;
6. recognition-independent, baseline context;
7. free-recall, baseline context;
8. near-transfer, changed context.

This yields five TRAIN primary-target rows per learner and ensures all three primary task families occur in TRAIN. A prospective baseline-context event precedes every transfer event.

Blind TEST, 3 opportunities:

9. free-recall;
10. delayed-free-recall on the next day;
11. near-transfer.

All three are primary prediction targets. No TEST outcome may update a later TEST feature row. A cohort-wide fit cutoff must occur after every TRAIN-prefix label is available, the fit must complete before the first TEST opportunity, and the generated schedule enforces more than a one-hour wall-clock gap between the final TRAIN opportunity and TEST anchor. The runtime must record the actual fit completion time; the gap is not permission to backdate a fit.

## Stimulus-form counterbalance

The form vocabulary remains `form-a` through `form-e`. Participant slots are assigned prospectively in complete five-person blocks. For each task-family occurrence, the form is chosen by a five-slot cyclic rotation over participant slot, family index and within-family occurrence index.

Consequences verified by tests:

- every opportunity ordinal uses every form exactly once across a complete five-slot block;
- repeated primary-family opportunities for one learner use distinct form groups;
- allocation is fixed before outcomes;
- dropout does not trigger post-outcome reassignment or replacement chosen to rebalance favorable results.

This prevents task family from being permanently confounded with one form group. Actual content and its fingerprint still must be frozen before a learner responds; this N043 artifact freezes the allocation rule, not unseen item text.

## Secondary whole-learner cold start

The secondary estimand uses deterministic leave-one-whole-participant-out folds. Each participant is held out exactly once; that participant contributes no own history to the cold-start prediction surface, while the other participants' frozen TRAIN-prefix rows form the fitting set for that fold. The fold allocation is participant-ID based and never outcome selected.

## Proposed N043 disposition

This branch asks the independent reviewer to choose one of two outcomes:

1. `PREDICTIVE_SIZING_FROZEN` — provide a defensible complete-learner count and precision rationale that does not use future N3 outcomes, while retaining or explicitly revising the numeric coverage/allocation gates; or
2. `PREDICTIVE_SIZING_UNJUSTIFIED` — keep the predictive participant count null and predictive KEEP/SIMPLIFY disabled. Any later human collection would need separate N040/N041/N044 approval and an explicitly bounded descriptive-only purpose.

No synthetic grid cell is promoted merely because it is affordable or produces a convenient cohort size.

## Claim boundary

This analysis uses no human outcomes. It does not establish power, learner-model validity, predictive superiority, calibration, learning efficacy, retention/transfer efficacy, mastery, CEFR, or production authority. It does not authorize N3 collection, Ready transition, merge, or deploy.
