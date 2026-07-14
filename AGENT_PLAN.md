# Agent Plan — TASK-288 (in progress)

> Autopilot 2026-07-14: LessonSpec `l-a2-04` present perfect intro (ever/never).

| Field | Value |
|-------|-------|
| Task | TASK-288 — Author l-a2-04 Trải nghiệm & present perfect intro |
| Status | **in_progress** |
| Gates | lint · unit tests |

## Goal

Author playable A2 lesson `l-a2-04`: light present perfect (ever/never/Have you…?) with **travel + job interview** angle and full L1 VN notes (A2 schema 100%).

## Steps

1. Status → `in_progress` in AGENT_BACKLOG.md
2. Author `src/lib/v2/lessons/l-a2-04.ts` (mirror `l-a2-03` structure)
3. Registry `index.ts` → `l-a2-04`
4. Path already has order 24 (`Du lịch`) — align `title_vi` if needed
5. Tests: getLesson + next playable after a2-03 → a2-04
6. `npm run lint && npm run test` → commit + `bash scripts/git-push.sh main`

## Risks

- Push may fail (GitHub archive read-only / GitLab key) — local commit + journal SHA still mark done
- Do not deepen into for/since/PPC (reserved for a2-05 / b1-10)
- Schema: L1 100% on lexis; min dialogues/listen/fluency/quiz counts

## Scope out

- TASK-287 migration apply
- a2-05 full experience lesson
- Audio generation
