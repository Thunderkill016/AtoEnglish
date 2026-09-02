# Remediation Re-probe V1

## Goal

Explicit remediation routing fixes one problem: a recurring error can be sent to a narrower practice action instead of repeating the whole source task.

It creates another risk if the learner succeeds at that narrower practice:

```text
source recurring error -> remediation -> remediation success -> remediation again -> remediation again ...
```

Remediation Re-probe V1 closes that loop.

The policy is:

```text
recurring source error
  -> remediation pressure
  -> independent remediation success
  -> source re-probe pressure
  -> source success: repaired
  -> source failure: remediation reopens
```

## Remediation success is not source repair

A successful remediation candidate only proves that the learner completed the narrower remediation task independently.

It does **not** prove that the original source task is repaired.

Error Memory therefore keeps the source entry as `recurring` and records:

```ts
remediationSatisfiedAt: string | null
```

When `remediationSatisfiedAt` is present:

- remediation candidate pressure turns off;
- the exact source action receives binary `errorReprobePressure`;
- the source still must pass normal planner eligibility gates.

## Source re-probe outcomes

### Independent source success

A later independent success on the original target + lesson version + action uses the existing direct repair rule:

```text
status = repaired
independentFailuresSinceRepair = 0
repairedAt = source success time
remediationSatisfiedAt = null
```

### Independent source failure

A failed source re-probe means the narrower remediation was not sufficient to eliminate the source error.

The entry remains recurring and clears:

```text
remediationSatisfiedAt = null
```

That reopens explicit remediation pressure.

### Assisted source attempt

Support/reveal-assisted source attempts do not close or reopen the cycle. They remain diagnostic only.

## Modality-safe Error Memory

Error Memory now distinguishes task feedback from independent evidence of a recurring learner pattern.

For Nếp speaking actions (`retrieve`, `produce`, `repair`, `transfer`, `retry`), an independent Error Memory observation requires:

```text
response_modality = speech
```

A typed fallback may still receive deterministic target-language feedback, but it cannot:

- create a recurring speaking error;
- satisfy a speaking remediation;
- repair a recurring speaking error.

For Nếp comprehension, the independent modality is `choice`.

Legacy attempts with no `actionKind` keep the previous behavior so historical rows are not silently discarded.

## Planner terms

Session Planner keeps the existing binary repair term:

```text
errorRepairPressure * 0.65
```

and adds a separate binary re-probe term:

```text
errorReprobePressure * 0.60
```

Both weights are V1 product-policy heuristics. They are not calibrated probabilities, research optima, or efficacy claims.

Multiple matching errors may be included in explainability reasons, but each pressure stays bounded at `1`.

## Hard gates remain authoritative

Neither remediation nor re-probe pressure can bypass:

- prerequisite readiness;
- transfer needing prior production;
- retention needing prior evidence;
- per-target session cap.

Eligibility is checked before scoring.

## Read boundary

Error Memory's data-minimized projection now needs these additional non-content fields:

- `response_modality`;
- `actionKind` derived from metadata;
- `reveal_used`.

It still reads only derived `errorSignals.errorTags` and `errorSignals.remediationHints`, and never selects raw `response_text` or the full metadata object.

## V1 state machine

```text
ONE INDEPENDENT FAILURE
  observed

SECOND INDEPENDENT FAILURE
  recurring + remediationSatisfiedAt=null
        |
        v
REMEDIATION SUCCESS
  recurring + remediationSatisfiedAt=<time>
        |
        v
SOURCE RE-PROBE
   | success                  | failure
   v                          v
 repaired          recurring + remediationSatisfiedAt=null
```

## Non-goals

V1 does not claim:

- that one remediation success guarantees transfer;
- that the remediation mapping is optimal;
- that a recurring target-coverage error is a psychological misconception;
- that typed fallback measures speaking ability;
- that the current ranking weights are calibrated.

A future efficacy loop should measure whether remediation followed by independent source re-probe reduces recurrence and improves delayed transfer/retention.
