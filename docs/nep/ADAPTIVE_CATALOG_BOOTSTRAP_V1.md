# Adaptive Catalog Bootstrap V1

## Problem

Session Planner V1 originally compiled only the CAP-002 first-meeting lesson. That lesson declares `CAP-001` as a prerequisite.

For a learner with no persisted skill state, every catalog candidate was therefore blocked by:

```text
prerequisite-not-ready:CAP-001
```

Because the catalog contained no CAP-001 practice, the planner had no legitimate way to help a new learner satisfy that prerequisite. This was a catalog deadlock, not a scoring problem.

## Decision

Do not bypass prerequisite gates and do not seed fake mastery.

Instead, add a real evidence-bearing CAP-001 bootstrap lesson and compile Session Planner from a canonical lesson registry.

The registry now contains:

```text
CAP-001: greet and close
CAP-002/CAP-003: first meeting + repair
```

The planner can therefore serve CAP-001 first, then unlock CAP-002 only after persisted evidence makes CAP-001 ready.

## CAP-001 bootstrap

The bootstrap lesson stays intentionally narrow:

- recognition: identify the social job of a greeting;
- retrieval: recall a greeting + acknowledgement from a cue;
- production: greet, acknowledge and close aloud;
- retention targets are published for later review.

It does not claim repair or transfer evidence. `qaLesson()` is now channel-aware, so repair/retry/transfer gates are required only for lessons that actually declare those evidence channels.

This does not weaken the existing CAP-002 first-meeting QA because that lesson still declares repair and transfer.

## Choice presentation

`LessonAction` now has optional learner-visible `choices`.

The correct target remains in hidden `targetSignals`; a safe practice envelope exposes only the labels, never a correctness marker.

This removes the previous fixed-preview hard-code and makes choice practice executable from adaptive planner output.

## Catalog closure gate

`validateNếpSessionCatalog()` statically checks:

- duplicate planner candidate IDs;
- every declared prerequisite target has at least one evidence-bearing practice candidate in the catalog.

A future capability may not enter the adaptive catalog with an unreachable prerequisite without failing this gate.

## Canonical registry

Planner compilation and server-authoritative execution now resolve lessons from the same `nepLessonRegistryV1`.

This prevents a planner candidate from referring to content that the trusted execution boundary cannot resolve.

## Cold-start behavior

With empty learner state, Session Planner should return eligible CAP-001 opportunities and keep CAP-002 blocked.

After independent CAP-001 retrieval/production evidence raises readiness above the prerequisite floor, a subsequent plan may include CAP-002.

The planner does not simulate mastery inside a session. Unlocking is based on persisted learner state, so a fresh plan is needed after evidence changes.

## Non-claims

This bootstrap ordering is a V1 product policy. It is not a claim that greeting/closing is universally the optimal first English capability or that the current readiness threshold is research-optimal.
