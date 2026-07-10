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

---

## Roadmap

| Task | Scope |
|------|--------|
| TASK-260 | Tokens + primitives + this doc ✅ |
| TASK-261 | Header + BottomNav Ato glass ✅ |
| TASK-262 | Home pass — HomeClient on Screen/Surface/AppButton/PageHeader/Chip ✅ |
| TASK-263 | Learn + LessonPlayerV2 chrome ✅ |
| TASK-264 | Speaking hub |
| TASK-265 | Residual screens on roadmap |


### Shell notes (TASK-261)

- Header: zinc-950 glass, brand gradient mark, AppButton login.
- BottomNav/MainNav: emerald active pill + glow; 3 tabs Học · Ôn · Tôi.
- Full-screen hide: `/learn/unit*` and `/learn/v2/*` via `isLessonChromeHidden`.

### Learn + player chrome (TASK-263)

- `/learn` LearnClient: Screen(ato+ambient)/PageHeader/Chip/Surface unit rows; placement AppButton.
- `/learn/v2/[id]`: Screen + AppButton back + Chip CEFR + PageHeader; player stage card = Surface; nav/finish/retry/task = AppButton.
- **Do not** change quiz floor / stage logic (TASK-187).
