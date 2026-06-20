# UI Guidelines — AtoEnglish

> Hướng dẫn cách dùng component, layout pattern, và responsive design.  
> Đọc cùng với `DESIGN_SYSTEM.md`.

---

## 1. Nguyên tắc chung

1. **Mobile-first**: Tất cả layout bắt đầu từ mobile (375px), sau đó mở rộng lên tablet/desktop.
2. **Dark by default**: App mặc định dark mode. Light mode là opt-in.
3. **Tối giản**: Loại bỏ mọi thứ không cần thiết. Mỗi element phải có lý do tồn tại.
4. **Nhất quán**: Dùng component có sẵn trước khi tạo mới.
5. **Performance**: Ưu tiên Server Components, dùng `"use client"` chỉ khi cần.

---

## 2. Component Usage Rules

### Button

```tsx
// ✅ Primary action — 1 per screen section
<Button variant="default" size="lg" className="w-full sm:w-auto">
  Bắt đầu học
</Button>

// ✅ Secondary — back, cancel, skip
<Button variant="outline">Bỏ qua</Button>

// ✅ Danger — destructive actions only
<Button variant="destructive">Xóa tài khoản</Button>

// ❌ Sai — đừng dùng className thay thế hoàn toàn variant
<Button className="bg-red-500 text-white">...</Button>
```

### Cards

```tsx
// ✅ Glass card — landing page, overlays on dark backgrounds
<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">

// ✅ Solid card — dashboard stats, lesson list items
<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">

// ✅ Highlight card — XP/streak gamification
<div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">

// ❌ Sai — tránh nền trắng thuần trong dark sections
<div className="bg-white rounded-xl p-4">
```

### Forms / Inputs

```tsx
// ✅ Standard input pattern
<input
  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2
             text-white placeholder-zinc-500 focus:outline-none
             focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500
             transition-colors"
/>

// ✅ Textarea cho translation exercises
<textarea
  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3
             text-white placeholder-zinc-500 resize-none
             focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
  rows={3}
/>
```

### Loading States

```tsx
// ✅ Skeleton — cho content đang load
<div className="animate-pulse bg-zinc-800 rounded-lg h-20 w-full" />

// ✅ Spinner — cho actions (submit, navigate)
<div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent" />
```

### Empty States

```tsx
// ✅ Standard empty state
<div className="text-center py-12">
  <Icon className="mx-auto text-zinc-600 mb-3" size={40} />
  <p className="text-zinc-400 font-medium">Chưa có dữ liệu</p>
  <p className="text-zinc-600 text-sm mt-1">Mô tả ngắn về cách bắt đầu.</p>
</div>
```

---

## 3. Layout Patterns

### Protected Page Structure

```tsx
// src/app/(main)/[page]/page.tsx
export default async function SomePage() {
  // ✅ Parallel data fetching
  const [dataA, dataB] = await Promise.all([fetchA(), fetchB()]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 py-4 sm:py-8 pb-24">
        {/* pb-24 trên mobile để tránh BottomNav che nội dung */}
        <h1 className="text-2xl font-black text-white mb-6">Page Title</h1>
        <SomeClient data={dataA} />
      </div>
    </div>
  );
}
```

### Stat Grid (Dashboard pattern)

```tsx
// 2 cols mobile, 3 cols tablet+
<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
    <p className="text-2xl font-black text-white">{value}</p>
    <p className="text-xs text-zinc-400 mt-1">Label</p>
  </div>
</div>
```

### Section với Header

```tsx
<section className="mb-8">
  <div className="flex items-center gap-2 mb-4">
    <Icon className="text-emerald-400" size={20} />
    <h2 className="text-lg font-bold text-white">Section Title</h2>
    <span className="text-xs text-zinc-500 ml-auto">Optional meta</span>
  </div>
  {/* content */}
</section>
```

---

## 4. Navigation

### Desktop (Header) — `src/components/layout/header.tsx`
- Fixed top, `z-50`
- Logo left, nav items center, user menu right
- Hiển thị từ `md:` trở lên

### Mobile (BottomNav) — `src/components/layout/bottom-nav.tsx`
- Fixed bottom, `z-50`
- 5 icons: Dashboard · Learn · Speaking · Flashcards · Progress
- Active state: `text-emerald-400`

### Navigation Items

```ts
// src/lib/constants/navigation.ts
mainNavItems = [Dashboard, Learn, Speaking, Flashcards, Progress, Roadmap]
```

---

## 5. Page-specific Patterns

### Lesson Pages (UnitTemplate)

- Full-screen takeover — Header/BottomNav hidden via `LessonPageHider`
- Custom top progress bar with section name
- `SECTION_ORDER = [1, 5, 2, 3, 4, 9, 6, 7, 8]` — Hybrid pedagogical flow
- Back button top-left, always visible
- Section transitions via Framer Motion `AnimatePresence`

### Flashcard Page

- Card flip animation (CSS 3D transform)
- Rating buttons: Again · Hard · Good · Easy (FSRS ratings)
- Topic filter tabs

### Speaking Page

- Mic button prominent center
- Real-time transcript display
- Score visualization after session

---

## 6. Responsive Breakpoints Cheatsheet

```tsx
// Mobile only
<div className="block sm:hidden">

// Tablet and up
<div className="hidden sm:block">

// Desktop only
<div className="hidden md:block">

// Responsive text
<h1 className="text-2xl sm:text-3xl md:text-4xl font-black">

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

// Responsive padding
<div className="px-4 sm:px-6 lg:px-8">
```

---

## 7. Do's and Don'ts

### ✅ DO

- Dùng `cn()` từ `@/lib/utils` cho conditional classes
- Dùng `void asyncFn()` cho fire-and-forget Server Actions
- Dùng `Promise.all()` cho parallel data fetching
- Dùng `await createClient()` từ `@/lib/supabase/server` trong Server Components
- Dùng Framer Motion cho page-level transitions
- Thêm `transition-all duration-200` trên interactive elements

### ❌ DON'T

- Không dùng `console.log/error` trong production code
- Không dùng `as any` — dùng type assertion cụ thể
- Không hardcode màu (`#FF0000`) — dùng Tailwind tokens
- Không tạo component mới nếu đã có sẵn trong `src/components/`
- Không dùng inline `style={{}}` trừ khi dynamic value (e.g. `width: \`${pct}%\``)
- Không đặt `"use client"` trên Server Components không cần thiết
