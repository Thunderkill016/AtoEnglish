# Project structure — AtoEnglish

> Target layout after **docs cleanup 2026-07-10**.  
> `src/` follows Next.js 16 App Router — **không** đổi import path app trong pass này.

## Root (chỉ runtime + agent + entry docs)

```
atoenglish/
├── AGENTS.md                 # Agent rules (SSOT)
├── AGENT_*.md                # Autopilot queue (scripts/)
├── README.md
├── package.json · next.config.mjs · tsconfig.json · …
├── CONTENT_STYLE.md          # stub → docs/pedagogy/
├── LESSON_SYSTEM_FOUNDATION.md  # stub → docs/pedagogy/
├── … other *.md stubs
├── docs/                     # ← all product/pedagogy/design docs
├── src/                      # application code
├── scripts/                  # agent, radar, audio, ci
├── supabase/                 # migrations + config
├── e2e/                      # Playwright
├── public/                   # static + audio
├── archive/                  # curriculum-v1 policy + future physical archive
└── logs/agent/               # autopilot (gitignored logs)
```

## `docs/` taxonomy

```
docs/
├── README.md                 # index
├── STRUCTURE.md              # this file
├── product/                  # V2, product loop
├── pedagogy/                 # lesson science, curriculum, content style
├── design/                   # Ato Surface + design system
├── specs/                    # pages, security
└── archive/                  # deprecated plans (minimal redesign)
```

## `src/` (application)

```
src/
├── app/                      # Next.js routes
│   ├── (main)/               # authenticated shell
│   │   ├── home/ path/ me/   # v2 IA
│   │   ├── learn/ + learn/v2/
│   │   ├── speaking/
│   │   ├── dashboard/ flashcards/ …  # v1 surfaces
│   │   └── layout.tsx
│   ├── actions/              # Server Actions
│   ├── api/
│   └── page.tsx              # landing
├── components/
│   ├── design-system/        # Ato Surface primitives
│   ├── layout/               # Header, BottomNav
│   ├── learn/                # UnitTemplate + v2 player
│   ├── landing/ ui/ …
├── features/                 # domain modules (flashcards, srs, …)
├── lib/
│   ├── v2/                   # LessonSpec, path, lessons l-*, progress
│   ├── data/units/           # v1 curriculum (frozen)
│   ├── lessons/              # blueprint, content-standard, flow
│   ├── supabase/ srs/ security/ …
├── __tests__/
└── types/
```

## Design principles (folder hygiene)

1. **Root thin** — config + agent queue + README; long-form docs in `docs/`.
2. **v1 vs v2** — v2 code under `src/lib/v2/`; v1 data stays until cutover (`archive/curriculum-v1/README.md`).
3. **Agent files stay root** — `scripts/agent-*.sh` hard-code `AGENT_BACKLOG.md` paths.
4. **No empty maintenance dumps** in `docs/` — use `logs/agent/` for radar/session logs.
5. **Future** (not this pass): colocate feature UI under `features/*` only when imports migrate; avoid big-bang `src` moves mid-autopilot.

## Commands related to structure

```bash
npm run radar              # product smoke → logs/agent/
bash scripts/agent-pick-task.sh
```
