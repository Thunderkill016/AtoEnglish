# AtoEnglish do-not-build list

**Updated:** 2026-09-03  
**Purpose:** prevent wasted complexity while AtoEnglish deliberately pushes toward the current learning-technology frontier.

This document no longer bans advanced technology merely because it is advanced. Realtime voice, speech diagnostics, adaptive planning and AI-assisted learning are allowed when they close a measurable learner-outcome gap and preserve evidence integrity.

The rules below prevent AtoEnglish from confusing frontier development with indiscriminate feature accumulation.

## Do not build parallel learning truth

Do not create another independent system for:

- learner mastery;
- attempt history;
- evidence events;
- error memory;
- session planning;
- transfer/retention state;
- FSRS-compatible memory scheduling.

Main already contains canonical foundations for these areas. Extend or replace them only through a bounded migration with explicit reasons and compatibility/rollback plans.

## Do not build technology for its own sake

Do not add:

- AI agents that do not improve a specific learning loop;
- multi-agent orchestration because it looks more advanced;
- neural knowledge tracing without enough valid data to calibrate and beat a simpler baseline;
- reinforcement learning/contextual bandits before reliable reward/evaluation data exists;
- a custom ASR/TTS/foundation model when maintained external systems satisfy the requirement more safely/economically;
- a microservice split without a measured runtime/ownership blocker;
- a monorepo/package architecture without a real second deployment/reuse boundary;
- speculative scale infrastructure before a measured bottleneck;
- a second analytics or database platform without a concrete requirement the current stack cannot satisfy.

## Do not fake learning evidence

Never:

- equate completion with mastery;
- count an answer-bearing reveal as independent retrieval/production/repair/transfer evidence;
- count typed text fallback as speaking evidence;
- derive pronunciation mastery from transcript matching alone;
- report a phoneme/pronunciation/comprehensibility score without an acoustic evidence path and calibration appropriate to the claim;
- manufacture prerequisite mastery to fill an adaptive queue;
- let the browser declare correctness, evidence type, evaluator identity or target mastery when the server can resolve them canonically;
- silently reinterpret missing evidence as failure or success when the correct state is unknown.

## Do not turn AI into an unconstrained teacher

Do not expose a generic open-ended chatbot as the core learning experience with no task/evidence policy.

Realtime or generative AI must operate inside explicit boundaries such as:

- current capability/task;
- allowed difficulty/language resources;
- learner-state inputs;
- support/reveal policy;
- feedback budget;
- transfer conditions;
- privacy boundary;
- trusted server-side evidence compilation.

Generated content must not become canonical curriculum or mastery truth solely because a model produced it.

## Do not optimize the wrong metric

Do not treat these as proof of learning effectiveness:

- DAU/MAU alone;
- time in app;
- streak length;
- XP;
- lessons/screens opened;
- number of generated conversations;
- number of AI tokens/minutes consumed;
- repository test counts;
- CI success;
- visual-design preference without task success;
- learner satisfaction without ability evidence.

They may be useful operational metrics, but the product north star is durable transferable learning gain per learner minute.

## Do not overcorrect pronunciation toward nativeness

Do not build or market:

- native-accent imitation as the default goal;
- a single opaque pronunciation percentage presented as ground truth;
- punitive correction of harmless accent features that do not materially affect intelligibility/comprehensibility;
- speech feedback that overwhelms the communication task.

Prioritize high-impact intelligibility, comprehensibility, fluency and repair needs, with Vietnamese-specific calibration where possible.

## Do not persist sensitive learner speech by default

Do not persist raw audio, full transcripts, names, employers or free-form learner speech in analytics by default.

Prefer:

- transient processing;
- derived structured evidence;
- bounded error tags/signals;
- explicit retention and access rules.

Richer speech data may be collected only under a separately reviewed research/calibration protocol with a clear reason, consent/notice as required, retention policy and deletion path.

## Do not copy external code blindly

External/open-source reuse is encouraged, but never copy or vendor code without checking:

- license compatibility;
- repository/activity/maintenance state;
- security implications and dependency surface;
- framework/runtime compatibility;
- bundle/client cost;
- privacy/data routing;
- operational/API cost;
- whether adaptation is actually cheaper than a small local implementation.

Prefer official SDK/reference implementations when they directly match the task.

## Do not broaden curriculum before the engine needs it

Do not expand large curriculum breadth merely to create the appearance of completeness.

New capabilities/content should be added when they:

- exercise a missing learning mechanism;
- serve a validated learner need;
- are required for transfer/retention measurement;
- extend a proven engine to the next meaningful learner outcome.

The existing 50-unit catalog is an asset but not a mandate to preserve unit-first product behavior.

## Do not mix unrelated risk domains in one change

Keep separate pull requests for materially independent work such as:

- product policy/docs;
- canonical evidence/runtime convergence;
- realtime voice dependency/infrastructure;
- pronunciation/speech scoring;
- database/RLS migrations;
- analytics taxonomy;
- curriculum expansion;
- gamification;
- deployment infrastructure.

A task may cross boundaries only when the feature cannot function otherwise and the coupling, verification and rollback are explicit.

## Do not auto-merge or auto-deploy frontier changes

Agents may create branches, commits, tests and pull requests. The owner retains final merge/deployment authorization.

Production behavior involving authentication, learner evidence, speech privacy, database schema, AI providers or scoring must have a reversible rollout path.

## Current allowed frontier work

The following are explicitly allowed when implemented as bounded, reversible slices:

- converging legacy learning UI onto the canonical Nếp Attempt/Evidence runtime;
- realtime WebRTC voice using maintained SDK/reference implementations;
- conversation turn-taking and interruption handling;
- acoustic pronunciation/speech diagnostics behind calibration gates;
- Vietnamese-specific speech benchmarking/calibration;
- improved listening/decoding practice;
- Error Memory and remediation improvements;
- transfer and delayed-retention practice;
- explainable adaptive session planning;
- external open-source/library reuse;
- experiments that can measure learner outcome differences;
- more advanced learner models after real data supports them.

## Default decision rule

For a proposed frontier feature ask:

> What current learner/evidence limitation does this remove, what simpler existing option was considered, what outcome should improve, and how will we know whether it actually did?

If those answers are weak, do not build it yet. If they are strong, build the smallest reversible version and measure it.
