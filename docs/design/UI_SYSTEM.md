# UI System — shadcn/ui (SSOT)

> **Status:** ACTIVE (2026-07-20)  
> **Standard:** [shadcn/ui](https://ui.shadcn.com) · style **base-nova** · Base UI · Tailwind v4 · lucide  
> **Deprecated:** Ato Surface glass kit (`--ato-*`, glassmorphism-first). Do not extend it.

---

## 1. Why shadcn

| Trước (Ato Surface) | Nay (shadcn) |
|---------------------|--------------|
| Kit tự chế song song `ui/` | **Một** nguồn: `src/components/ui/` |
| Glass / blur / token riêng dễ lệch | Token CSS variables + Card/Button chuẩn |
| AppButton / Surface custom | `Button` · `Card` · `Badge` · `Separator` |

---

## 2. Rules (bắt buộc)

1. **New UI** = compose `@/components/ui/*` + Tailwind semantic tokens (`bg-background`, `text-foreground`, `bg-card`, `text-primary`, `border-border`).  
2. **No** MUI / Ant Design / new heavy library.  
3. **No** new glass utility layers or `--ato-*` tokens.  
4. Dark-first product: `<html class="dark">` (existing). Primary = emerald OKLCH (already in `globals.css`).  
5. Touch targets ≥ 40px on primary CTAs (`size="lg"` or `min-h-10`).  
6. Do not change lesson/IPOR/FSRS logic for styling.  
7. Legacy `@/components/design-system` is a **compat layer** only — re-exports / thin wrappers over shadcn. Prefer import from `@/components/ui` on new code.

```ts
// ✅ New code
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// ⚠️ Legacy only (existing screens)
import { Screen, AppButton } from "@/components/design-system"
```

---

## 3. Theme tokens

Defined in `src/app/globals.css` (`:root` / `.dark`):

| Token | Role |
|-------|------|
| `--background` / `--foreground` | Page canvas + body text |
| `--card` / `--card-foreground` | Panels |
| `--primary` / `--primary-foreground` | Brand CTA (emerald) |
| `--muted` / `--muted-foreground` | Secondary text |
| `--border` / `--input` / `--ring` | Borders + focus |
| `--radius` | Default control radius |

Do **not** hardcode `bg-zinc-950` / `bg-white/5` on new screens — use semantic classes.

---

## 4. Layout shell

| Piece | Implementation |
|-------|----------------|
| Page frame | `Screen` (compat) or `div className="min-h-dvh bg-background"` |
| Section card | `Card` + `CardHeader` / `CardContent` |
| Primary CTA | `Button` variant default |
| Secondary | `Button` variant outline / secondary |
| Labels | `Badge` |
| Dividers | `Separator` |

---

## 5. Migration order

1. Tokens + docs (this file) ✅  
2. Shell: Header, SecondaryPageShell, Screen/AppButton/Surface wrappers  
3. Path / Home / Me (high traffic)  
4. Lesson player chrome (no logic change)  
5. Residual routes one-by-one  

---

## 6. Related

- `components.json` — shadcn config  
- `src/components/ui/` — primitives  
- `docs/design/DESIGN_SYSTEM.md` — brand notes (update tokens only; UI kit = this file)  
