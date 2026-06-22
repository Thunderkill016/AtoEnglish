# Supabase Schema — AtoEnglish

## Source of truth

**Canonical migrations:** `supabase/migrations/` (apply in timestamp order).

**Generated types:** run `npm run db:types` after any migration → updates `src/types/supabase.ts`.

**Manual snapshots:** `supabase/archive/` — historical SQL, do not apply on production.

## Apply migrations

### Production (linked project)

```bash
# Mark already-applied migrations first if DB predates CLI tracking:
npx supabase migration repair --status applied <timestamp>

# Then push only new migrations:
npx supabase db push
```

### SQL Editor (quick fix)

Copy the latest migration file into Supabase Dashboard → SQL Editor → Run.

## Migration timeline

| Timestamp | Purpose |
|-----------|---------|
| `20240618000000` | Initial tables: users, user_progress, cards, lesson_history, user_sentences |
| `20260620000000` | card_review_logs |
| `20260620031424` | push_subscriptions |
| `20260620031600` | CEFR auto-progression functions |
| `20260620035100` | project_memories (vector) |
| `20260620105700` | user_flashcard_progress |
| `20260620112800` | unit_content |
| `20260620115300` | (no-op) card_review_logs dedupe |
| `20260621150000` | daily_xp_goal |
| `20260621160000` | Schema consolidation: last_active_date, user_lesson_progress, speaking_sessions, FSRS |
| `20260621160100` | card_review_logs RLS sync |