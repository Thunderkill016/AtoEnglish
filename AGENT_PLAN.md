# Agent Plan — TASK-308 in progress

> Autopilot 2026-07-15

## TASK-308 — Author l-b1-13 Giao tiếp công sở

| Field | Value |
|-------|-------|
| Status | **in_progress** |
| Goal | B1 workplace communication (meetings, email phrases, polite disagreement, updates); spiral b1-12 health/social |
| Files | `src/lib/v2/lessons/l-b1-13.ts` · `index.ts` · `lesson-spec-v2.test.ts` |
| Gates | schema OK · lint 0 · unit tests pass |

### Steps

1. Author `l-b1-13.ts` mirroring l-b1-12 structure (lexis 12, dialogues 2, listen 5, controlled 6, quiz 6, spiral 4)
2. Grammar spine: meeting/update/email frames + polite disagree
3. Spiral review: b1-12 (should/ought to, How about…, symptoms)
4. Register in `index.ts`; extend tests (registry + sequential next after b1-12)
5. `npm run lint && npm run test` → commit → `bash scripts/git-push.sh main`

### Risks

- Push may block (GitHub archive / GitLab publickey) — local main SSOT if so
- Overlap with b1-08 soft disagree — keep workplace-specific (meeting/email/update frames)
- String length Zod caps (situation ≤600, culturalNote ≤800, lexis notes ≤400)

### Next ready

TASK-309 Author l-b1-14 Cổng B1 — dùng được (B1 14/14)
