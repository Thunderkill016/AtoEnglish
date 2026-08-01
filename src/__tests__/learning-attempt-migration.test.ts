import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve(
    process.cwd(),
    "supabase/migrations/20260731162613_learning_attempts.sql",
  ),
  "utf8",
);

describe("learning_attempts migration", () => {
  it("enables owner-only select and insert RLS", () => {
    expect(migration).toContain("alter table public.learning_attempts enable row level security");
    expect(migration).toContain("for select\n  to authenticated");
    expect(migration).toContain("for insert\n  to authenticated");
    expect(migration.match(/\(select auth\.uid\(\)\) = user_id/g)).toHaveLength(2);
  });

  it("is append-only for clients and excludes raw recordings or transcripts", () => {
    expect(migration).toContain("revoke all on table public.learning_attempts from anon, authenticated");
    expect(migration).toContain("grant select, insert on table public.learning_attempts to authenticated");
    expect(migration).not.toMatch(/for update|for delete/i);
    expect(migration).not.toMatch(/raw_audio|audio_url|transcript\s+text/i);
  });

  it("indexes the owner and stable activity lookup paths", () => {
    expect(migration).toContain("(user_id, created_at desc)");
    expect(migration).toContain("(user_id, lesson_id, activity_id, created_at desc)");
  });
});
