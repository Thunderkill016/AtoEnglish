# Ato Surface — UI system

> **Status:** foundation (TASK-260 / WS-UI-01)  
> **Stack:** Next.js 16 · Tailwind v4 · Base UI · Framer Motion · lucide  
> **Not using:** Material UI, Ant Design, StyleX, Astro  

Goal: one visual language for shell + Home + Learn + Speak — **premium glass dark**, emerald/teal brand (Meta-polish density, not a new brand).

---

## Tokens (`globals.css` + `src/lib/ui/ato-surface.ts`)

| Token / map | Role |
|-------------|------|
| `--ato-canvas` | Page bg zinc-950 |
| `--ato-surface` / border | Glass card fill |
| `SURFACE_VARIANT.*` | default · interactive · success · warn · danger |
| `APP_BUTTON_VARIANT.*` | primary (gradient) · secondary · ghost · danger |
| `APP_BUTTON_SIZE` | sm · md · lg (min tap ≥40–48px) |
| `ATO_FOCUS` | emerald focus ring |
| `ATO_EYEBROW` | 11px uppercase label |

---

## Primitives (`src/components/design-system/`)

| Export | Use |
|--------|-----|
| `Screen` | Page shell; `ato` + `ambient` for Ato canvas |
| `Surface` | Glass cards |
| `AppButton` | Product CTA (prefer over one-off buttons) |
| `PageHeader` | Title + eyebrow + subtitle |
| `Chip` | Badges |
| `ThinProgress` / `ContinueCard` / … | Existing kit (migrate gradually) |
| `MinimalButton` | Legacy flat CTA — prefer `AppButton` on new work |

Import:

```ts
import { Screen, Surface, AppButton, PageHeader, Chip } from "@/components/design-system";
```

---

## Rules

1. **No new heavy UI library** (MUI/antd) without explicit product decision.  
2. New screens compose primitives — avoid one-off gradient classes when `AppButton` fits.  
3. Do not change IPOR / FSRS / lesson content for styling.  
4. Motion ≤ ~0.35s; respect `prefers-reduced-motion` where custom.  
5. Ship shell → Home → Learn chrome → Speak (WS-UI-02…05).  
6. **Brand is dark-first** (`bg-zinc-950` / class `dark` on `<html>`). Do not ship light `bg-white/60` dashboard cards as primary canvas — landing + app shell must match.

---

## Roadmap

| Task | Scope |
|------|--------|
| TASK-260 | Tokens + primitives + this doc ✅ |
| TASK-261 | Header + BottomNav Ato glass ✅ |
| TASK-262 | Home pass — HomeClient on Screen/Surface/AppButton/PageHeader/Chip ✅ |
| TASK-263 | Learn + LessonPlayerV2 chrome ✅ |
| TASK-264 | Speaking hub Ato Surface ✅ |
| TASK-265 | Residual screens **documented** (no code rewrite) ✅ |

**Core product chrome (shell → Home → Learn → Speak) is complete.** Further Ato passes are optional, incremental, and must not block A1 content factory.

### Shell notes (TASK-261)

- Header: zinc-950 glass, brand gradient mark, AppButton login.
- BottomNav/MainNav: emerald active pill + glow; 3 tabs Học · Ôn · Tôi.
- Full-screen hide: `/learn/unit*` and `/learn/v2/*` via `isLessonChromeHidden`.

### Learn + player chrome (TASK-263)

- `/learn` LearnClient: Screen(ato+ambient)/PageHeader/Chip/Surface unit rows; placement AppButton.
- `/learn/v2/[id]`: Screen + AppButton back + Chip CEFR + PageHeader; player stage card = Surface; nav/finish/retry/task = AppButton.
- **Do not** change quiz floor / stage logic (TASK-187).

### Speaking hub (TASK-264)

- `/speaking` SpeakingClient: Screen(ato+ambient)/PageHeader/Chip/Surface mode cards + guest local history rows; AppButton CTAs.
- Sub-routes (roleplay/shadowing/journal/phoneme) still use `SecondaryPageShell` — see residual table.

---

## Residual screens (TASK-265 inventory)

> **Policy:** document only. **No big-bang landing rewrite.** No mandatory Progress/Me restyle this cycle.  
> Prefer small per-route passes later if product needs visual parity; A1 content (`l-a1-03+`) takes priority over residual UI polish.

| Surface | Path / entry | Current chrome | Priority if revisited | Notes |
|---------|--------------|----------------|----------------------|--------|
| **Progress** | `/progress`, `/progress/weekly` | `SecondaryPageShell` + StatLine/ListSection/heatmap | P2 | Keep stats/actions logic; optional Screen+Surface wrap only |
| **Me hub** | `/me` | `SecondaryPageShell` + ListSection/PrimaryRow | P2 | Hub links only; low risk migrate |
| **Landing (marketing)** | `/` + `src/components/landing/*` | Custom marketing sections (Hero, Problem, FAQ…) | **P3 — deferred** | **Do not** force Ato Surface kit onto marketing; keep independent brand page. Incremental CTA/token alignment only if needed |
| Settings | `/settings` | `SecondaryPageShell` | P3 | Forms; migrate buttons → AppButton carefully |
| Roadmap | `/roadmap` | `SecondaryPageShell` | P3 | Placement highlight logic must stay |
| Flashcards / hard words | `/flashcards`, `/flashcards/hard` | `SecondaryPageShell` | P3 | FSRS flow untouched |
| Dashboard (legacy) | `/dashboard` | mix / minimal client | P3 | Home is primary; do not re-skin dashboard big-bang |
| Speaking sub-routes | `/speaking/{roleplay,shadowing,journal,phoneme}` | `SecondaryPageShell` wrappers | P2 | Hub already Ato; shells can follow hub language later |
| Placement / checkpoint / certificate / challenge / quiz / writing / grammar / pronunciation / invite / leaderboard / business | various | mostly `SecondaryPageShell` | P3 | One surface at a time if ever |

### Residual rules for future agents

1. **One route per task** — never “restyle all secondary pages” in one PR.  
2. **Landing is out of band** — no full rewrite of `src/app/page.tsx` or landing section tree without explicit product mandate.  
3. Compose existing primitives (`Screen` ato+ambient, `Surface`, `AppButton`, `PageHeader`, `Chip`) — no new UI library.  
4. Do not change IPOR / FSRS / lesson content / quiz floor for styling.  
5. After residual polish (if any), prefer **content factory** over more chrome.
