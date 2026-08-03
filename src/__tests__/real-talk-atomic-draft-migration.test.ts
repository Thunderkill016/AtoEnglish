import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/20260803013000_real_talk_atomic_private_draft.sql",
  ),
  "utf8",
);
const repository = readFileSync(
  join(
    process.cwd(),
    "src/features/real-talk/server/draft-repository.ts",
  ),
  "utf8",
);

function compactSql(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

const sql = compactSql(migration);

describe("Real Talk atomic private draft persistence", () => {
  it("uses one security-invoker RPC under caller RLS", () => {
    expect(sql).toContain(
      "create or replace function public.upsert_real_talk_private_draft",
    );
    expect(sql).toContain("language plpgsql security invoker");
    expect(sql).toContain("v_owner_id uuid := (select auth.uid())");
    expect(sql).toContain("authentication required for private draft persistence");
  });

  it("writes video and lesson inside the same function statement", () => {
    expect(sql).toContain("insert into public.real_talk_videos");
    expect(sql).toContain("insert into public.real_talk_lessons");
    expect(sql.indexOf("insert into public.real_talk_videos")).toBeLessThan(
      sql.indexOf("insert into public.real_talk_lessons"),
    );
    expect(sql).not.toContain("exception when");
  });

  it("keeps repeat generation on one owner-private draft identity", () => {
    expect(sql).toContain("on conflict (slug) do update");
    expect(sql).toContain("public.real_talk_videos.created_by = v_owner_id");
    expect(sql).toContain("public.real_talk_videos.is_public = false");
    expect(sql).toContain(
      "on conflict on constraint real_talk_lessons_video_id_key do update",
    );
  });

  it("cannot publish or elevate review state", () => {
    expect(sql).toContain("private draft rpc cannot publish a video");
    expect(sql).toContain("private draft rpc cannot elevate review state");
    expect(sql).toContain("generation_status = 'ai_draft'");
    expect(sql).toContain("reviewed_at = null");
    expect(sql).toContain("reviewed_by = null");
  });

  it("exposes the function only to authenticated and service roles", () => {
    expect(sql).toContain(
      "revoke all on function public.upsert_real_talk_private_draft(jsonb, jsonb) from public",
    );
    expect(sql).toContain(
      "revoke all on function public.upsert_real_talk_private_draft(jsonb, jsonb) from anon",
    );
    expect(sql).toContain("to authenticated");
    expect(sql).toContain("to service_role");
  });

  it("makes the repository call only the atomic RPC for draft writes", () => {
    expect(repository).toContain('"upsert_real_talk_private_draft"');
    expect(repository).toContain("supabase.rpc(");
    expect(repository).not.toContain('.from("real_talk_videos")');
    expect(repository).not.toContain('.from("real_talk_lessons")');
    expect(repository).toContain("Giao dịch đã bị hủy");
  });
});
