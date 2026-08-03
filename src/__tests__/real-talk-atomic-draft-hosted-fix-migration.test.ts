import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const sql = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/20260803081500_fix_real_talk_atomic_private_draft_conflict.sql",
  ),
  "utf8",
)
  .replace(/\s+/g, " ")
  .trim()
  .toLowerCase();

describe("hosted Real Talk atomic RPC conflict fix", () => {
  it("uses a named lesson uniqueness target", () => {
    expect(sql).toContain(
      "create or replace function public.upsert_real_talk_private_draft",
    );
    expect(sql).toContain(
      "on conflict on constraint real_talk_lessons_video_id_key do update",
    );
    expect(sql).not.toContain("on conflict (video_id) do update");
  });

  it("preserves security-invoker execution and explicit grants", () => {
    expect(sql).toContain("security invoker");
    expect(sql).toContain("from public");
    expect(sql).toContain("from anon");
    expect(sql).toContain("to authenticated");
    expect(sql).toContain("to service_role");
  });
});
