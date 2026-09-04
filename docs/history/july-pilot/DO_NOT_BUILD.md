# AtoEnglish do-not-build list

> **Document status:** historical; superseded and retained for provenance
> **Governing authority:** [constitution](../../../.specify/memory/constitution.md); it wins on conflict

**Updated:** 2026-07-24  
**Applies until:** the focused 28-day pilot has learner, learning, and market evidence

This document prevents technically attractive work from displacing the current product priority.

Items below are not necessarily bad ideas. They are deferred because they do not currently provide the shortest path to validating the first learner outcome.

## Product breadth

Do not build yet:

- a complete rebuild or expansion of the A0–B2/C1 curriculum;
- broad interview English, travel English, or general conversation tracks;
- a native mobile application;
- a curriculum CMS or visual lesson editor;
- social feeds, friend systems, clubs, or multiplayer learning;
- more leagues, badges, achievements, streak mechanics, or XP breadth;
- a custom payment platform;
- complex subscriptions, entitlement systems, or pricing experiments before paid demand exists.

## AI and speaking technology

Do not build yet:

- an open-ended AI conversation tutor;
- unrestricted chatbot practice detached from the current lesson;
- a proprietary speech-recognition model;
- phoneme-level pronunciation scoring infrastructure;
- native-accent imitation scoring;
- autonomous curriculum generation or publication;
- storing raw audio, transcripts, names, employers, or learner free text in analytics.

Use controlled lesson tasks, existing browser capabilities, bounded feedback, immediate retry, and human assessment where they are sufficient.

## Architecture and infrastructure

Do not build yet:

- a major rewrite of `UnitTemplate`;
- a microservice migration;
- a new generic workflow engine;
- infrastructure solely for hypothetical scale;
- a second database or event platform;
- a new design system unrelated to pilot blockers;
- broad dependency upgrades mixed with product work;
- generalized abstractions without two real use cases;
- remote sandbox infrastructure for ordinary trusted repository work;
- automated merge or production deployment by an agent.

Preserve the current modular monolith and extract only when a measured blocker requires it.

## CycleWarden and developer tooling

Do not expand CycleWarden with:

- generic multi-agent orchestration;
- additional coding-agent adapters before the primary Codex flow is useful on AtoEnglish;
- enterprise RBAC, SSO, compliance mappings, or organization governance;
- general web-research or product-research platforms;
- release and deployment automation;
- outcome-learning or self-improvement engines;
- new journals, records, digests, or abstractions without a current AtoEnglish blocker;
- work that cannot be demonstrated on a real AtoEnglish task.

CycleWarden is an internal development supervisor for AtoEnglish in this phase, not a second product that competes for equal attention.

## Premature measurement

Do not treat these as primary proof of product value:

- total registered accounts;
- page views without speaking-task activation;
- XP earned;
- streak length;
- lesson screens opened;
- repository test counts;
- CI success;
- positive comments about visual design without completion or speaking evidence.

The important evidence is activation, return, journey completion, speaking improvement, support cost, payment, renewal, and referral.

## Scope mixing

Do not combine a lesson outcome with changes to:

- authentication or onboarding;
- database schema or RLS;
- analytics infrastructure;
- XP, stars, streaks, leagues, achievements, or FSRS;
- payment;
- deployment;
- broad architecture;
- unrelated lessons.

Create separate tasks with separate evidence.

## Exception rule

A deferred item may be reconsidered only when all of the following are documented:

1. the exact current AtoEnglish blocker;
2. evidence that the blocker occurred in a real learner or development flow;
3. why an existing simpler solution is insufficient;
4. the smallest reversible implementation;
5. acceptance criteria and rollback plan;
6. the systems explicitly left out of scope.

Security, privacy, or data-integrity defects may bypass the normal product queue, but they still require bounded scope and verification.

## Default response to new ideas

When a new feature idea appears, ask:

> Does this help a target learner start, complete, improve, pay for, or return to the current 28-day speaking journey?

If the answer is not supported by current evidence, record the idea and continue the active priority instead of implementing it.
