# Realtime Tutor Context V1

## Purpose

Allow AtoEnglish Realtime to act as a bounded conversation partner for canonical Nếp speech tasks without giving the model authority over curriculum, scoring, mastery, or hidden evaluator targets.

## Trust boundary

The browser may send only task identity:

- `lessonId`
- `lessonVersion`
- `actionId`

The server resolves the current lesson/action again from the canonical Nếp registry. Browser-authored prompts are not accepted as tutor instructions.

## Eligible actions

V1 context compilation allows only speech actions whose kind is:

- `produce`
- `repair`
- `transfer`

`retrieve` is deliberately excluded because an interactive partner can accidentally assist independent recall.

## Information excluded from the model prompt

The tutor context does not include:

- `targetSignals`
- `requiredSignalGroups`
- evidence type
- evaluator identity
- mastery state
- hidden answer keys

The trusted server continues to compile and persist learning attempts independently.

## Fail-closed behavior

`conversation` mode cannot create a Realtime session unless the server can resolve a valid eligible canonical task and build task-specific instructions. Missing, stale, malformed, or unsupported identities return an error before the provider call.

`capture` remains the safe default and does not require a task identity.

## Transport behavior

For conversation mode, the WebRTC client sends the canonical task identifiers as request headers alongside the SDP offer. Once the data channel opens it sends a bare `response.create` event so the provider begins from the server-authored session instructions; the browser does not supply a roleplay prompt.

## Evidence authority

Realtime transcripts remain transient input signals. The model must not grade, score pronunciation, declare mastery, or invent progress. Attempt → Evidence → LearnerSkillState remains server-authoritative.
