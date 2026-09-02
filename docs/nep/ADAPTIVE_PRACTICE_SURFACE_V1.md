# Adaptive Practice Surface V1

## Goal

Turn the adaptive core into an inspectable learner-facing preview without replacing the fixed Nếp vertical slice or exposing planner internals to the browser.

The new route is:

```text
/adaptive-preview
```

It is non-indexed and requires an authenticated learner state. `/data-preview` remains the fixed public reference slice.

## Browser trust boundary

The adaptive browser surface receives only learner-safe practice envelopes:

- lesson id/version;
- action id/candidate id;
- action kind/modality;
- title/instruction/prompt;
- learner-visible choice labels;
- optional Vietnamese task support;
- changed-context presentation flag.

It does not receive:

- target capability id;
- evidence type;
- evaluator id;
- targetSignals / requiredSignalGroups;
- remediation rules;
- planner scores/ranking reasons;
- internal blocked-candidate diagnostics.

`getNếpAdaptivePracticeQueue()` is a server-only projection over the internal planner action. The client component does not call `getNếpSessionPlan()` directly.

## Trusted execution

For each practice, the browser sends only observed interaction data to `recordNếpPracticeAttempt()`.

The server resolves canonical content and recomputes correctness, target, evidence type, evaluator, reveal semantics and remediation hints.

Raw learner speech/text is used transiently for deterministic evaluation and is not persisted as `response_text`.

## Session behavior

V1 uses short queues. After a persisted attempt:

1. feedback is shown;
2. the current practice is considered consumed for that queue whether correct or incorrect;
3. the learner moves to the next planned practice;
4. after the queue ends, the learner explicitly requests a fresh plan.

The client does not retry the same prompt repeatedly and does not simulate learner-state updates.

A wrong response is an observation. A future fresh plan decides whether to repeat, remediate or re-probe based on persisted state/error memory.

## Cold-start sequencing

Catalog bootstrap alone is not enough. A new target could still rank retrieval above recognition because normal ranking weights value retrieval/transfer potential.

V1 therefore adds this conservative hard gate:

```text
if target has a recognition candidate
and learner has zero persisted evidence for target
then non-recognition candidates are blocked by:
  cold-start-needs-recognition
```

The planner does not simulate recognition success inside the same plan. After the recognition attempt persists, the surface requests a new plan before retrieval/production can become eligible.

This rule applies only when the catalog actually provides a recognition candidate. Targets without recognition practice are not globally blocked by this gate.

## Speaking behavior

Speech practice prefers browser SpeechRecognition when available.

If the learner edits/types the transcript field, response source becomes `text`, so the existing learning-core policy prevents that response from becoming speaking evidence.

Transcript matching remains language-coverage feedback, not pronunciation scoring.

## Auth/session expiry

Adaptive planning requires login because it reads persisted learner state.

If authentication disappears after a plan has already loaded, trusted execution may still return canonical feedback but `persisted=false`. The adaptive surface does not advance that practice because learner state did not change; it asks the learner to sign in again.

## Empty/error behavior

An empty plan is shown explicitly. The client never bypasses prerequisites or manufactures mastery to fill the queue.

Infrastructure/read-model errors are surfaced as preview errors with a retry action.

## Deployment limitation

This route depends on the stacked learning-core migrations and RLS/read models. Those migrations have not been applied to production Supabase in this workstream.

Therefore repository CI can validate code/contracts, but an isolated Supabase migration/RLS integration test remains a deployment gate before enabling the adaptive route in production.

## Non-claims

The queue size, recognition-first cold-start rule, planner weights and current CAP-001/CAP-002 content are V1 product policies. They are not calibrated efficacy claims or evidence that this ordering is universally optimal.
