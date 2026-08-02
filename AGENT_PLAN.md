# Agent Plan — Current Work Only

> Product truth: `docs/product/PRODUCT_TRUTH.md`  
> Architecture: `docs/product/NATURAL_COMMUNICATION_LEARNING_SYSTEM.md`  
> Ordered work: `docs/product/CURRENT_PRIORITY.md`  
> Cross-session state: `PROJECT_MEMORY.md`

## Current task

| Field | Value |
|---|---|
| Task | PRODUCT-ENV-001 — Make natural communication environments canonical |
| Status | draft pull request open |
| Branch | `product/natural-communication-environments` |
| Pull request | `#53` |
| Base | `feature/two-lane-content-model` / PR #50 |
| Goal | Align repository truth, branch state, and next work around environment-first learning with an invisible curriculum |

## Owner decision

Recorded on 2026-08-02:

- the website must feel like learning inside natural communication, not studying an academic syllabus;
- source videos should capture real interaction rather than be arranged or selected only to match a predetermined phrase lesson;
- curriculum remains necessary but should operate invisibly underneath the learner experience;
- learner-facing organization should use environments and practical goals;
- natural corpus collection begins from complete interactions and communication events;
- grammar, vocabulary, and pronunciation remain support for communication rather than the roadmap;
- transfer and delayed varied use remain mandatory evidence.

## Scope

Update high-authority product and agent documents:

- `PROJECT_MEMORY.md`;
- `AGENTS.md`;
- `AGENT_PLAN.md`;
- `AGENT_BACKLOG.md`;
- `docs/product/PRODUCT_TRUTH.md`;
- `docs/product/NATURAL_COMMUNICATION_LEARNING_SYSTEM.md`;
- `docs/product/CURRENT_PRIORITY.md`;
- `docs/product/DO_NOT_BUILD.md`;
- previous architecture references where needed.

Also synchronize exact current branch and PR state.

Forbidden in this PR:

- learner runtime implementation;
- media scraping or downloading;
- caption retrieval;
- source acceptance;
- database, auth, analytics, FSRS, XP, payment, or deployment changes;
- merge or production promotion.

## Current repository state

- `main`: `961e779886ff95b1b5f67d5e6997520d1facdb1a`.
- PR #47: `213e217a5f0e57b4f2aa0879716755b14381eaab`.
- PR #48: `d1e8038584ea7963d3ab5a6ab6ae9ab4cf103d6a`.
- PR #49: `0e96ba88400761e24953c6d2fd89b3e27210e033`.
- PR #50: `4f94223bec700ca89afc42b47a01b84404585c5f`.
- PR #51: `b0a009989385ba51663136b1efbcd2831a926562`.
- PR #52: `a874120a389c451cc39ac7a4cbd1fb4692f0fcce`, base restored to PR #50, draft, Verify #78 passed.
- PR #53: current active branch; final head must be recorded after all edits.

## Acceptance

- High-authority documents agree that natural communication environments are the learner-facing product.
- The invisible curriculum remains explicit and structured.
- Source collection is environment-first and event-first, not phrase-search-first.
- Earlier phrase-targeted batches are labelled exploratory rather than canonical.
- Initial five environments are explicit.
- Fixed clip quotas are replaced by coverage-quality and explicit-gap rules.
- Rights and naturalness remain separate gates.
- Current PR bases, branches, heads, draft states, and verification evidence are accurate.
- PR #52 is restored to base PR #50 and draft.
- PR #53 remains draft, unmerged, and undeployed.
- GitHub Verify passes on the exact final head.

## Next action

Finish document alignment, compare PR #53 against PR #50, update PR #53 with exact final head and checks, run Verify, then return the PR to draft if it was temporarily marked ready for CI.

After owner acceptance, open a separate bounded contract task for `CommunicationEvent`, `EnvironmentExperience`, and invisible-curriculum selection. Do not implement a broad ingestion or learner runtime in this documentation PR.