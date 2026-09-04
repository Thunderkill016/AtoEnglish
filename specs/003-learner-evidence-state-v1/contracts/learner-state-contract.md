# Contract: Learner Evidence State V1

**ID**: `nep.learner-evidence-state.v1`  
**Version**: 1

## Evidence ingress

- Raw observations, UI events, model scores, arbitrary records, detached envelopes, and parsed payloads are not learner evidence.
- Learner state accepts only in-process branded `CoreEvidenceForRouting` issued by `certifyCoreEvidence()` or `validateReferenceCoreEvidence()`.
- Trust markers are module-private; branded evidence is recursively frozen and loses trust identity when cloned/serialized.
- Repository-reference evidence may affect provisional routing only; durable evidence requires the independent authority path already owned by `certified-evidence.ts` / authority registry.

## Detached transport

- `sealCoreEvidence(evidence, sealedAt)` requires genuine branded evidence and an explicit valid timestamp.
- `parseCoreEvidenceEnvelope()` is total/non-throwing and validates structure + SHA-256 integrity for durable and reference envelopes without branding the result.
- Public SHA-256 is integrity, not provenance authentication.
- **No detached transport payload can acquire learner-state branding in V1.**
- `hydrateReferenceCoreEvidenceFromEnvelope()` is compatibility-only and succeeds solely when the supplied in-process envelope still contains an already-branded reference evidence object. A detached/JSON-cloned/rehashed envelope returns `invalid-envelope`.
- A future persisted-envelope authentication/hydration design is a separate contract and benchmark/review task.

## Ontology / activity / modality / role

- Every target resolves to a canonical executable ontology node.
- Communication-activity target requires matching event activity.
- Role and response modality must be allowed by the target node.
- Recognition/receptive evidence cannot silently create retrieval, production, retention, or transfer support.

## Transfer

- `near-transfer` role <-> `near-transfer` distance; `far-transfer` role <-> `far-transfer` distance; non-transfer roles use `same-context`.
- Transfer requires non-empty context, an already accepted prior distinct baseline context, and a changed context.
- First-event, duplicate-context, or role/distance-mismatched transfer fails closed.
- Failed near/far transfer increments the corresponding failed counter and never becomes same-context support.

## State / uncertainty

- No evidence -> explicit unknown, null routing score, maximal uncertainty.
- Conflict remains `conflicted-support`; no false neutral scalar.
- Projection declares `decisionScope: "routing-only"`; no `mastered` flag.

## Replay / lineage

- Accepted event identity and original lineage are retained.
- Duplicate IDs are rejected.
- Canonical ordering by `(occurredAt,eventId)` plus deterministic tie-breaking yields byte-equivalent batch/incremental replay.
- Support/reveal, transfer failure, and durable/reference statistics remain auditable.

## Compatibility / purity

- Legacy read adapters preserve `modelVersion: "nep.learner-evidence-state.v1"` and do not collapse insufficient/conflicted into unknown.
- No ambient clock, random source, DB, network, browser, provider, UI, deploy, or production-write dependency.