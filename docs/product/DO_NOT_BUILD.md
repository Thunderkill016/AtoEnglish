# AtoEnglish Do-Not-Build Boundary — PROJECT RESET

**Status:** active reset guardrail  
**Effective:** 2026-09-06  
**Canonical state:** `docs/project/PROJECT_STATE.md`

Until PROJECT-RESET-001 (#151) is complete, do **not** start new product or R&D development merely because an old roadmap, PR, issue, spec or benchmark suggests a next step.

## Do not build during reset

- new learner-facing features;
- new curriculum breadth or large lesson rewrites;
- a new 28-day pilot implementation;
- YouTube-to-Curriculum, Real Talk or private-lesson expansion;
- new Realtime tutor behavior;
- new pronunciation/OpenPronounce scoring or model work;
- new learner-model, BKT, IRT, predictive-routing or adaptive-planner expansion;
- new Nếp Core ontology/provenance/authority/benchmark/native-evidence work;
- new agent orchestration or automatic task generation;
- speculative infrastructure or architecture refactors;
- production deployment, DB writes or schema migration as part of cleanup.

## Allowed during reset

- read-only audit;
- docs/source-of-truth cleanup;
- archiving superseded GitHub issues/PRs while preserving history;
- verification of the rescue branch;
- investigation of concrete production/security/privacy/data-integrity defects;
- preparation of bounded P0 fixes under separate issues.

## Exception

A P0 security, privacy, production-data-integrity, or release-consistency defect may be addressed separately when it is concrete and evidence-backed.

Current example: #152 / PR #87.

The previous 28-day-specific do-not-build list remains available in Git history and may be reused after a future product decision.
