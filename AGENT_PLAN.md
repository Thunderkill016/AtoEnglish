# Agent Plan — Current Work Only

> This file describes current cleanup work only. Historical work belongs in Git commits and pull requests.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-008 — Verify old exercise components |
| Status | done — awaiting stacked PR review |
| Branch | `agent/cleanup-unused-exercises` |
| Goal | Remove unreachable legacy exercise components while preserving active lesson interactions and curriculum data |

## Completed in earlier cleanup batches

- Stopped automatic maintenance-task generation, commits, and direct pushes.
- Replaced oversized agent journals with concise current/open-work files.
- Added reproducible codebase inventory and durable cleanup evidence.
- Removed four foundation dead-code files.
- Removed the disconnected five-file notification-center UI group while preserving push and API infrastructure.

## Completed in CLEANUP-008

Removed after exact symbol/path verification:

- `src/components/exercises/ListenAndChooseExercise.tsx`
- `src/components/exercises/MatchingPairsGame.tsx`

Preserved active functionality:

- `DialogueSection` still consumes `listenAndChoose` content.
- `PracticeSection` still implements matching interactions and dictation sourced from lesson data.
- Unit data, lesson types, content standards, section order, scoring, and audio behavior remain unchanged.

## Validation completed

A full GitHub Actions checkout successfully ran before and after deletion:

```bash
npm ci --ignore-scripts --legacy-peer-deps
npm run inventory -- --write
npx tsc --noEmit
npm run lint
npm run test
```

Post-deletion results:

- source files scanned: 347 → 345
- unreachable candidates: 8 → 6
- TypeScript passed
- ESLint passed
- unit tests passed

The temporary validation workflow was removed after the final successful run.

## Next action

CLEANUP-010 — verify `src/components/landing/OutcomesSection.tsx` against the current landing-page composition on a separate branch and pull request.
