# Agent Plan — TASK-283 complete (local)

> Autopilot 2026-07-14

## TASK-287 — migration apply

| Status | **blocked** |
|--------|-------------|
| Reason | Supabase `vhpfskkredizeazlyzsh` removed (API + DNS NXDOMAIN) |
| Repo | Migration + types already present (TASK-279) |

## TASK-283 — Speaking subroutes Ato chrome

| Field | Value |
|-------|-------|
| Status | **done** |
| Gates | lint 0 · 233 unit tests |

### Delivered

- `SpeakingSubShell.tsx` — Screen ato ambient, Chip, PageHeader, AppButton → `/speaking`, Surface
- Pages: shadowing · roleplay · journal · phoneme (no SecondaryPageShell)

### Push

`bash scripts/git-push.sh main` — may fail (GitHub archive / GitLab key); local commit is source of truth.

### Next ready

Refill if ready &lt; 2. Prefer content/IA tasks that do not need live Supabase.
