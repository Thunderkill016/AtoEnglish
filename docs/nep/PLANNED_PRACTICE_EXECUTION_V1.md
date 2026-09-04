# Planned Practice Execution V1

> **Document status:** reference
> **Governing authority:** [constitution](../../.specify/memory/constitution.md); it wins on conflict

## Problem

Session Planner can rank a canonical practice candidate, but ranking alone is not a trustworthy execution boundary.

Before this slice the preview did this in the browser:

```text
learner response
 -> client evaluator
 -> client builds correct/target/evidence/remediation metadata
 -> generic server write action
```

That made the client authoritative for fields that belong to the learning core. A modified client could submit a structurally valid learning event with caller-chosen correctness, evidence type, target, evaluator or derived error metadata.

## V1 trust boundary

The execution path is now:

```text
learner response + canonical lesson/action identity
 -> server resolves versioned canonical action
 -> server deterministic evaluator
 -> server canonical Attempt/Evidence adapter
 -> domain evidence policy
 -> database RPC
```

The browser can submit only observed interaction data:

- lesson id;
- lesson version;
- action id;
- response;
- response source (`speech` / `text` / null);
- support-used flag;
- response latency.

The submission schema strips unknown fields. Caller-supplied values such as `correct`, `capabilityId`, `evidenceType`, `evaluator` or remediation hints do not enter the canonical compiler.

## What the server recomputes

From the canonical lesson/action contract the server derives:

- deterministic success/failure;
- target capability;
- evidence type;
- evaluator identity;
- context id;
- retry/reveal semantics;
- structured error signals;
- explicit remediation hints;
- attempt/evidence metadata.

PostgreSQL remains authoritative for persisted-history invariants such as changed-context transfer.

## Public preview

Public preview still works without authentication.

The server evaluates the canonical task first. If there is no authenticated user it returns feedback with:

```text
persisted = false
persistence = local-only
```

No learning attempt/evidence is written.

For an authenticated learner, the same canonical compiled record goes through the database persistence path.

## Raw response boundary

The raw learner response is sent to the application server because server-side deterministic evaluation needs the response itself.

Application code does not place that raw response in the attempt record and does not pass it to the persistence RPC:

```text
attempt.responseText = null
rawResponsePersisted = false
```

This is a database/application persistence guarantee, not a claim about lower-level network or hosting infrastructure logs outside this application contract.

## Safe planned-practice envelope

`resolveNếpPlannedPractice(candidateId)` converts a planner candidate into a learner-facing DTO containing only presentation identity/content needed to perform the task:

- candidate id;
- lesson/action identity;
- action kind/modality;
- title/instruction;
- prompt;
- optional support text;
- changed-context flag.

It deliberately excludes:

- target signals;
- required target groups;
- target capability;
- evidence type;
- evaluator identity;
- remediation rules.

Attempt-only retry is not a planner candidate and cannot be resolved through this surface.

## Planner read boundary

Authenticated `getNếpSessionPlan()` now returns:

- internal explainable `plan` data;
- ordered learner-safe `practices` envelopes compiled from selected opportunities;
- diagnostics.

The future learner-facing adaptive route should consume `practices`, not reconstruct tasks from raw planner metadata.

## Remaining limits

V1 does not provide cryptographic attestation that a caller marked `responseSource="speech"` only after genuine microphone use. Browser speech APIs do not provide that attestation. The system should therefore treat speech source as application-observed interaction metadata, not anti-cheat proof.

V1 also does not yet:

- replace the full fixed mission UI with the adaptive `practices` sequence;
- persist a signed plan/session token;
- guarantee idempotency across duplicate direct server-action submissions;
- expose comprehension distractor choices through the practice envelope;
- execute multi-step pedagogic scaffolding around every selected candidate.

Those are separate execution/product layers. This slice first removes caller authority over learning truth.
