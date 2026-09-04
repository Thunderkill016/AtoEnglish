# Implementation Plan: Core Learner Model V1 (Learner Evidence Ledger & State Projection)

**Branch**: `gemini/learner-evidence-state-v1` | **Date**: 2026-09-04 | **Spec**: [spec.md](./spec.md)

---

## 1. Summary

Implement a pure TypeScript V1 learner evidence ledger and uncertainty-aware state projection module (`src/lib/core/learner-state.ts`) bound to canonical executable ontology construct IDs (`nep.english-ontology.v1`). Provide deterministic full-ledger projection and incremental state reduction, strict fail-closed validation of evidence events, explicit distinction between unknown and failure, role/modality/transfer boundaries, and comprehensive adversarial tests (`src/lib/core/learner-state.test.ts`).

---

## 2. Technical Context

- **Language/Version**: TypeScript 5 / Node.js >=22
- **Dependencies**: Existing core modules (`ontology.ts`, `certified-evidence.ts`, `domain.ts`, `task.ts`, `evidence-role.ts`) and Vitest; zero external runtime dependencies.
- **Storage**: None (Pure, persistence-neutral in-memory ledger and state projection).
- **Testing**: Vitest focused adversarial test suite, source-of-truth governance, typecheck, lint, repository-wide test suite, and content standards.
- **Constraints**: Pure deterministic functions; no ambient time (`Date.now()`); zero runtime, database, UI, network, or provider changes; detached envelopes are transport-only data and require explicit authenticated hydration before state ingress.
- **Scope**: Canonical construct keys, evidence event validation, sufficient statistics accumulation, uncertainty/sufficiency classification, deterministic replay, reducer equivalence, and fail-closed non-throwing envelope parsing.

---

## 3. Constitution Check

- **Core-First and Contract-Owned Semantics**: PASS. Contract `nep.learner-evidence-state.v1` is pure, persistence-neutral, and binds to executable ontology IDs.
- **Evidence Integrity and Scoped Authority**: PASS. Enforces observation != evidence != state != mastery. Explicitly scopes uncalibrated outputs to `decisionScope: "routing-only"`. Learner state accepts only in-process branded evidence; unkeyed SHA-256 transport envelopes cannot bypass in-process validation.
- **Provenance, Privacy, and Replaceability**: PASS. Preserves evidence audit lineage without ingesting sensitive raw learner payloads.
- **Deterministic Core and Falsifiable Promotion**: PASS. Zero ambient clock/randomness; deterministic canonical event ordering guarantees byte-identical projections.
- **Spec-First Human-Controlled Delivery**: PASS. Follows Spec Kit v1.0.4 workflow; branch remains Draft PR for independent review.

---

## 4. Project Structure

```text
specs/003-learner-evidence-state-v1/
  spec.md
  research.md
  data-model.md
  contracts/learner-state-contract.md
  checklists/requirements.md
  plan.md
  quickstart.md
  tasks.md
src/lib/core/
  learner-state.ts
  learner-state.test.ts
src/lib/learning/
  learner-state-read.ts (bounded compatibility if needed)
```

**Structure Decision**: Place the core learner model in `src/lib/core/learner-state.ts` alongside `ontology.ts` and `certified-evidence.ts` to form a cohesive, versioned core foundation, while ensuring existing `src/lib/learning/**` functions remain intact.
