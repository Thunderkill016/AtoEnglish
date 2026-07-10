# Design System — AtoEnglish

> **Single Source of Truth** cho toàn bộ thiết kế AtoEnglish.  
> Mọi AI agent và developer phải tuân thủ file này để đảm bảo giao diện nhất quán.

---

## 1. Brand Identity

| Thuộc tính | Giá trị |
|-----------|---------|
| **App name** | AtoEnglish |
| **Tagline** | Tiếng Anh giao tiếp từ A đến Z |
| **Target** | Người Việt tự học tiếng Anh (A1–B1) |
| **Mood** | Thân thiện · Chuyên nghiệp · Truyền cảm hứng |
| **Visual style** | Dark mode · Glassmorphism · Emerald/Teal gradient |

---

## 2. Color Palette

### Brand Colors (Tailwind + OKLCH)

| Token | Light mode | Dark mode | Mô tả |
|-------|------------|-----------|-------|
| **Primary** | `oklch(0.52 0.14 160)` | `oklch(0.68 0.14 160)` | Emerald-500 equivalent |
| **Background** | `oklch(0.99 0.003 240)` | `oklch(0.12 0.008 240)` | Zinc-950 dark |
| **Card** | `oklch(1 0 0)` | `oklch(0.15 0.01 240)` | Zinc-900 dark |
| **Border** | `oklch(0.93 0.005 240)` | `oklch(1 0 0 / 7%)` | Subtle separator |
| **Destructive** | `oklch(0.577 0.245 27)` | `oklch(0.704 0.191 22)` | Red errors |
| **Muted fg** | `oklch(0.55 0.01 240)` | `oklch(0.65 0.01 240)` | Zinc-400 equivalent |

### Semantic Tailwind Classes (sử dụng trong code)

```
Brand green/teal:  emerald-500, teal-500, emerald-400, teal-400
Dark background:   zinc-950, zinc-900, zinc-800
Text:              white, zinc-100, zinc-300, zinc-400, zinc-500
Danger/Error:      red-400, red-500
Warning:           amber-400, amber-500
Info/Grammar:      violet-400, violet-500
Cumulative review: amber-500 (panel accent)
```

### Gradient Patterns

```css
/* Brand gradient — hero, CTA buttons */
bg-gradient-to-r from-emerald-500 to-teal-400

/* Progress bars */
bg-gradient-to-r from-emerald-500 to-teal-400

/* Dark page background */
bg-zinc-950

/* Card with glass effect */
bg-white/5 backdrop-blur-xl border border-white/10

/* Dark card solid */
bg-zinc-900 border border-zinc-800
```

---

## 3. Typography

### Font Family

| Dùng cho | Font | Import |
|----------|------|--------|
| **Tất cả** | **Plus Jakarta Sans** | `next/font/google` — `Plus_Jakarta_Sans` |
| CSS variable | `--font-sans` | Set trên `<html>` via `font.variable` |

### Font Scale (Tailwind text-*)

| Class | Size | Dùng cho |
|-------|------|---------|
| `text-xs` | 12px | Badges, labels, hints |
| `text-sm` | 14px | Body text, descriptions |
| `text-base` | 16px | Default body |
| `text-lg` | 18px | Sub-headings |
| `text-xl` | 20px | Section headings |
| `text-2xl` | 24px | Page headings |
| `text-3xl` | 30px | Hero sub-title |
| `text-4xl`+ | 36px+ | Hero title only |

### Font Weight

```
font-normal   → body text
font-medium   → labels, navigation items
font-semibold → card titles, stat values
font-bold     → headings, buttons
font-black    → hero h1, section h2 on lesson pages
```

---

## 4. Spacing System

Base unit: **4px** (Tailwind default)

| Token | px | Dùng cho |
|-------|----|---------|
| `p-1` | 4px | Tight badges |
| `p-2` | 8px | Small buttons, chips |
| `p-3` | 12px | Compact cards |
| `p-4` | 16px | Standard padding |
| `p-6` | 24px | Section padding, cards |
| `p-8` | 32px | Page sections |
| `p-12` | 48px | Large sections |
| `gap-2` | 8px | Tight item groups |
| `gap-4` | 16px | Standard flex/grid gap |
| `gap-6` | 24px | Card grids |
| `mb-6` | 24px | Standard section margin |

---

## 5. Border Radius

| Token | Value | Dùng cho |
|-------|-------|---------|
| `rounded` | 4px | Small elements |
| `rounded-lg` | 10px (`--radius`) | Cards, buttons |
| `rounded-xl` | 12px | Panels |
| `rounded-2xl` | 16px | Large cards |
| `rounded-full` | 9999px | Pills, avatars, badges |

---

## 6. Component Library

### Button

Source: `src/components/ui/button.tsx` (base-ui/react + cva)

```tsx
import { Button } from "@/components/ui/button";

// Variants
<Button variant="default">   // Emerald filled — primary CTA
<Button variant="outline">   // Bordered — secondary action
<Button variant="ghost">     // No background — tertiary
<Button variant="destructive"> // Red — danger
<Button variant="link">      // Underline text link

// Sizes
<Button size="default">      // h-8
<Button size="sm">           // h-7
<Button size="lg">           // h-9
<Button size="icon">         // 32×32 square
```

### Glassmorphism Card

```tsx
// Standard glass card pattern
<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
```

### Solid Dark Card

```tsx
<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
```

### Progress Bar

```tsx
<div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
  <motion.div
    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
    animate={{ width: `${progress}%` }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  />
</div>
```

### Badge / Chip

```tsx
// Level badge
<span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
  A1
</span>

// Grammar chip (violet)
<span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">
  Collocations
</span>
```

### Toast

Via `sonner` library:
```ts
toast.success("✅ Message")
toast.error("❌ Error message")
```

### Spotlight

```tsx
import { Spotlight } from "@/components/ui/spotlight";
<Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
```

### ScrollReveal

```tsx
import { ScrollReveal } from "@/components/ui/scroll-reveal";
<ScrollReveal>
  <YourComponent />
</ScrollReveal>
```

---

## 7. Animation System

### Framer Motion — Page/Section Transitions

```tsx
// Standard section entrance
const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -20 },
};

<AnimatePresence mode="wait">
  <motion.div
    key="section-id"
    variants={sectionVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.3 }}
  />
</AnimatePresence>
```

### CSS Keyframes (in globals.css @theme)

| Animation | Class | Mô tả |
|-----------|-------|-------|
| `spotlight` | `animate-spotlight` | Hero spotlight fade-in |
| `flamePulse` | `animate-flame` | Streak fire icon |
| `glowPulse` | `animate-glow-pulse` | Button glow effect |
| `floatEffect` | `animate-float` | Hero floating elements |
| `gradientShift` | `animate-gradient-shift` | Animated gradient backgrounds |
| `fadeInUpAnimation` | `animate-fade-in-up` | Card entrance animation |

### Hover Patterns

```css
hover:scale-105          /* Card hover */
hover:opacity-80         /* Button/link hover */
transition-all           /* Always include for smooth transitions */
duration-200             /* Standard 200ms */
```

---

## 8. Icon Library

**Lucide React** — consistent icon set.

```tsx
import { BookOpen, Mic, Layers, TrendingUp, Map, LayoutDashboard } from "lucide-react";

// Standard sizes
<Icon size={16} />   // Inline with text
<Icon size={20} />   // Button icons
<Icon size={24} />   // Section icons
```

---

## 9. Layout Patterns

### Protected App Layout

```
src/app/(main)/layout.tsx
├── Header (desktop) — fixed top
├── BottomNav (mobile) — fixed bottom
└── <main> content area (padding-bottom: 80px on mobile for nav)
```

### Page Max Width

```tsx
// Standard content width
<div className="max-w-3xl mx-auto px-4 py-4 sm:py-8">

// Wide dashboard
<div className="max-w-5xl mx-auto px-4 py-6">
```

### Responsive Breakpoints

| Breakpoint | Width | Usage |
|-----------|-------|-------|
| (default) | 0px+ | Mobile-first base |
| `sm:` | 640px | Tablet and up |
| `md:` | 768px | Desktop navigation visible |
| `lg:` | 1024px | Multi-column layouts |

---

## 10. Utility Helpers

```ts
// Conditional classNames — ALWAYS use cn()
import { cn } from "@/lib/utils";
cn("base-class", condition && "conditional-class", className)

// Custom CSS utility classes (from globals.css)
bg-glass          // Glassmorphism background (light + dark aware)
text-balance      // text-wrap: balance
```

---

## 11. Dark Mode

- **Default mode**: Dark (zinc-950 background)
- **Toggle**: `ThemeToggle` component — saves to localStorage
- **Implementation**: `class` strategy via `next-themes`
- **Tailwind**: `darkMode: "class"` in tailwind.config.ts

> ⚠️ **All new components must look good in BOTH dark and light modes.**

---

## 12. Accessibility Checklist

- [ ] All interactive elements have `aria-label` when text is absent
- [ ] Focus rings: `focus-visible:ring-2 focus-visible:ring-emerald-500`
- [ ] Skip-to-content link in root layout
- [ ] Color contrast ≥ 4.5:1 for body text
- [ ] Motion respects `prefers-reduced-motion`
- [ ] `<h1>` present on every page, proper heading hierarchy
