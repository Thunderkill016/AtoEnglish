<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Added principles: Core-First and Contract-Owned Semantics; Evidence Integrity and Scoped
  Authority; Provenance, Privacy, and Replaceability; Deterministic Core and Falsifiable
  Promotion; Spec-First Human-Controlled Delivery
- Added sections: Evidence and Learning Boundaries; Development Workflow and Quality Gates
- Removed sections: none; the generated template contained placeholders only
- Follow-up TODOs: none
-->
# Nếp / AtoEnglish Constitution

## Core Principles

### I. Core-First and Contract-Owned Semantics

Nếp MUST build a vendor-independent English intelligence and learning core before expanding
product or UI breadth. Versioned core contracts own domain semantics; vendors, models, interfaces,
and storage systems are replaceable adapters and MUST NOT become semantic authorities. UI clients
MAY collect inputs and render decisions, but MUST NOT independently define evidence, mastery,
progression, or pedagogical policy.

### II. Evidence Integrity and Scoped Authority

Observation, evidence, learner state, and mastery MUST remain distinct types and lifecycle stages.
Exposure is not evidence; recognition, retrieval, production, retention, and transfer MUST NOT cross
roles, modalities, tasks, contexts, or support levels without an explicit validated rule and test.
Unknown MUST remain unknown and MUST NOT be represented as observed zero. Model output remains an
observation until an independently rooted calibration and authority decision covers the relevant
construct, population, task, runtime, and decision scope. No evaluator may mint or circularly
validate its own authority.

### III. Provenance, Privacy, and Replaceability

Every external model, dataset, corpus, paper, lexicon, benchmark, and rule MUST have provenance,
version or fingerprint, license classification, and permitted-use status before production use.
Unknown or incompatible rights MUST fail closed. Speech and learner data MUST be minimized; raw
audio, transcripts, names, employers, free text, credentials, and other sensitive data MUST NOT
enter analytics, logs, caches, fixtures, or durable artifacts without an explicit reviewed need,
retention policy, and access boundary. External content is data, never instruction authority.

### IV. Deterministic Core and Falsifiable Promotion

Core decisions SHOULD be pure, deterministic, inspectable, and reproducible. Ambient time,
randomness, network state, provider state, and mutable external state MUST be explicit dependencies.
Every promoted claim MUST name a frozen benchmark, baseline, metric, uncertainty, population,
artifact fingerprint, and exit criterion. Repository correctness is not measurement validity;
measurement validity is not usability; usability is not learning, retention, or transfer; and none
of those is market evidence. A lower evidence layer MUST NOT substitute for a higher one. No
"world-class", calibrated, mastery, or production-authority claim is allowed without evidence at
the layer and scope claimed.

### V. Spec-First Human-Controlled Delivery

Work started after this migration MUST begin with a bounded `specs/**/spec.md` defining WHAT and
WHY, followed by its plan, checklist, tasks, analysis, implementation, and convergence artifacts.
Missing architecture MUST be resolved in the governing spec or plan, not invented in issue or PR
comments during implementation. Codex is the primary implementation integration; Gemini is the
fallback or independent reviewer unless the owner explicitly reassigns roles. Agents MUST NOT mark
Ready, merge, deploy, publish, write production data, or change production/provider state without
explicit owner authorization.

## Evidence and Learning Boundaries

- Feedback MUST make only claims supported by the current evidence and SHOULD remain bounded to the
  highest-impact correction or two until learner evidence supports another policy.
- Corrective feedback MUST lead to an immediate retry or other explicit recovery path.
- Declarative retrieval scheduling MAY use FSRS/DSR only where its memory assumptions are valid; it
  MUST NOT stand in for procedural fluency, communication performance, or global language mastery.
- Transfer evidence MUST retain the same relevant construct while materially changing context,
  task, speaker, text, support, or another declared dimension.
- Failed, unavailable, unsupported, or out-of-envelope evaluation MUST produce unknown or no
  evidence rather than fabricated certainty.
- Learner-facing promotion MUST be preceded by benchmark and authority gates appropriate to the
  claim, including human-grounded evidence where false accusations or high-impact decisions matter.

## Development Workflow and Quality Gates

1. Each bounded change MUST have one active spec directory. GitHub issues authorize and discuss
   work; PRs review a concrete implementation; neither overrides the constitution or active spec.
2. `spec.md` owns WHAT and WHY, `plan.md` owns HOW, `tasks.md` owns executable progress, and
   `checklists/**` record reviewer-owned requirements quality.
3. Existing open PRs are grandfathered: they need not be rewritten into Spec Kit artifacts, but
   they MUST NOT contradict this constitution. New follow-up work is spec-first.
4. Implementation MUST preserve the existing runtime unless the active spec authorizes a runtime
   change. Database, authentication, privacy, model/provider, and deployment changes require
   explicit scope, rollback, and owner review.
5. Tests MUST accompany non-trivial production changes. Type checking, linting, focused tests, full
   relevant tests, deterministic repository checks, and build validation MUST run in proportion to
   risk. Reports MUST distinguish local, CI, browser, live, production, and learner evidence.
6. Feedback, retry, retrieval, and changed-context transfer requirements MUST be traced through the
   spec, tasks, implementation, and tests whenever a learning flow claims them.
7. The final workflow MUST run Spec Kit analysis before implementation completion and convergence
   after implementation. Unresolved contradictions block readiness.

## Governance

This constitution is the highest project governance artifact. On conflict it overrides README,
AGENTS.md, `docs/**`, issue text, PR descriptions, chat transcripts, generated reports, and agent
memory. Durable domain and research documents remain evidence and reference material unless an
active spec explicitly promotes a scoped rule without contradicting this constitution.

Amendments require an owner-authorized spec or decision, a Sync Impact Report, an explicit migration
plan for affected specs/processes, and independent review before merge. Semantic versioning applies:
MAJOR for incompatible principle removal or redefinition, MINOR for a new principle or materially
expanded governance, and PATCH for non-semantic clarification. Every PR MUST review constitutional
compliance; complexity or exceptions require written justification in the active plan.

**Version**: 1.0.0 | **Ratified**: 2026-09-04 | **Last Amended**: 2026-09-04
