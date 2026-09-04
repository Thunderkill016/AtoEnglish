# Agent Plan — Current Work Only

> Product truth: `docs/product/PRODUCT_TRUTH.md`  
> Architecture direction: `docs/product/YOUTUBE_TO_CURRICULUM.md`  
> Ordered work: `docs/product/CURRENT_PRIORITY.md`  
> Cross-session state: `PROJECT_MEMORY.md`

## Current task

| Field | Value |
|---|---|
| Task | CONTEXT-002 — Persist the canonical YouTube-to-Curriculum direction |
| Status | draft pull request open |
| Branch | `docs/persist-project-memory` |
| Pull request | `#47` |
| Goal | Make every new AI session recover the new product direction, current repository state, boundaries, and next safe action without the previous chat |

## Owner decision

Recorded on 2026-08-02:

- authentic YouTube and other legally usable conversation sources are the primary language input;
- AtoEnglish compiles short Communication Clips into a prerequisite-driven A0→B1 path;
- the unit is a clip, not a video;
- every complete treatment requires comprehension, acquisition, and transfer;
- the first validation slice is seven days, 20–30 clips, and five A0 capabilities;
- the old fixed 28-day workplace roadmap is superseded;
- PR #46 is technical proof, not the final product shape;
- mechanisms from PR #45 and merged Gold Day 1 may be reused inside the new core.

## Scope

Documentation and agent operating guidance only:

- `PROJECT_MEMORY.md`;
- `AGENTS.md`;
- `AGENT_PLAN.md`;
- `AGENT_BACKLOG.md`;
- `docs/product/PRODUCT_TRUTH.md`;
- `docs/product/YOUTUBE_TO_CURRICULUM.md`;
- `docs/product/CURRENT_PRIORITY.md`;
- `docs/product/DO_NOT_BUILD.md`;
- `docs/handoffs/**`.

Forbidden:

- runtime source changes;
- source ingestion implementation;
- curriculum corpus creation;
- tests or dependencies;
- database, auth, analytics, FSRS rules, payment, provider settings;
- deployment, merge, or production promotion.

## Acceptance

- High-authority documents agree on YouTube-to-Curriculum as canonical.
- A new session cannot reasonably infer that the 28-day workplace roadmap remains active.
- Communication Clip, prerequisite graph, three-layer lesson contract, rights boundary, and four learning-core responsibilities are explicit.
- The seven-day A0 pilot scope and five capabilities are explicit.
- PR #45, PR #46, merged #43, and stale #35 have correct roles.
- Session start/end handoff protocol remains mandatory.
- No secrets, learner data, raw chats, or temporary share tokens are committed.
- Final diff is documentation-only.
- GitHub Verify passes on the exact final head.

## Current repository evidence

- `main` snapshot head: `961e779886ff95b1b5f67d5e6997520d1facdb1a`.
- PR #43 is merged and supplies reusable Gold Day 1 mechanisms.
- PR #45 is an open draft mastery-mechanism experiment.
- PR #46 is an open draft one-clip authentic-media technical proof.
- PR #35 is older and stale.
- PR #47 is this open draft documentation reset.

Always verify live state before relying on this snapshot.

## Next action

Finish document alignment, collapse the branch to one clean commit, update PR #47 with the exact head, and wait for GitHub Verify. Do not merge.

After PR #47 is accepted, open a separate bounded task to define the Communication Clip, source-review, level-treatment, prerequisite, three-layer activity, and advancement contracts before collecting the 20–30 clip corpus.