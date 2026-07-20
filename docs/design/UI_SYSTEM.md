# UI — clean slate (2026-07-20)

> **Everything previous (Ato Surface, design-system/, glass kit) is removed.**

## Stack

- **shadcn/ui** (`src/components/ui/`) — Button, Card, Badge, Separator, Page
- Tailwind v4 semantic tokens: `bg-background`, `text-foreground`, `bg-card`, `text-primary`, `border-border`, `text-muted-foreground`
- Dark-first via `.dark` on `<html>`

## Rules

1. Import **only** from `@/components/ui/*` for UI chrome.
2. No parallel design kits. No glassmorphism layers. No ambient glow blobs.
3. Layout: `<Page>` + `<PageHeader>` + `<Card>` + `<Button>`.
4. Do not restyle lesson pedagogy content files for “looks”.
5. One visual language: quiet surfaces, strong primary CTA, clear hierarchy.

## Add components

```bash
npx shadcn@latest add <component>
```
