# AtoEnglish — Project archived

**Status:** **ARCHIVED / CLOSED** (owner decision 2026-07-10)  
**Reason:** Product development stalled (design fragmentation, dual curriculum v1/v2, IA confusion). Owner chose permanent close rather than continue rebuild.

This repository is preserved for **history, code salvage, and learning** — not active product development.

---

## What is frozen here

| Layer | Location |
|-------|----------|
| App (Next.js 16) | `src/` |
| v1 curriculum (50 units) | `src/lib/data/units/` |
| v2 LessonSpec + lessons | `src/lib/v2/` |
| Design system (Ato Surface) | `src/components/design-system/`, `docs/design/` |
| Docs | `docs/` (see `docs/README.md`, `docs/STRUCTURE.md`) |
| Supabase migrations | `supabase/migrations/` |
| Agent / autopilot | `AGENT_*.md`, `scripts/agent-*.sh` |
| Master plan (last) | `docs/product/MASTER_AUTOPILOT_PLAN.md` |
| Live URL (may expire) | https://atoenglish.vercel.app |

---

## GitHub archive steps (owner)

1. Confirm all commits on `main` are pushed to `origin` (GitHub).
2. Tag: `archive/final-2026-07-10` (created with this closeout).
3. On GitHub → **Settings → General → Danger Zone → Archive this repository**.
4. Optional: download ZIP from GitHub **Code → Download ZIP** or clone with `--mirror`.
5. Optional: disconnect Vercel / pause Supabase project to stop billing.

---

## Salvage later (if reopening)

- Do **not** restart dual UI skins — one dark Ato Surface only.
- Prefer **one** curriculum path (v2 `l-*` or v1 units), not both as default.
- Auth + FSRS + RLS patterns remain reusable.

---

## Do not

- Run `agent-daemon` for new features (project closed).
- Force-push or rewrite history needed for archive (keep as-is).
- Delete this repo unless you already have a verified mirror.

*Closed by owner request. Code retained on GitHub.*
