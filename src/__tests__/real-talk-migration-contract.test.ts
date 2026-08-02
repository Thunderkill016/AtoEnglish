import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/20260802190000_real_talk_private_draft_gate.sql",
);
const migration = readFileSync(migrationPath, "utf8");
const normalized = migration.replace(/\s+/g, " ").toLowerCase();

function policy(name: string) {
  const match = migration.match(
    new RegExp(`create policy "${name}"[\\s\\S]*?;`, "i"),
  );
  if (!match) throw new Error(`Missing policy ${name}`);
  return match[0].replace(/\s+/g, " ").toLowerCase();
}

describe("Real Talk private draft migration contract", () => {
  it("makes generated video rows private by default and repairs legacy rows", () => {
    expect(normalized).toContain(
      "alter table public.real_talk_videos alter column is_public set default false",
    );
    expect(normalized).toContain(
      "update public.real_talk_videos set is_public = false where created_by is not null",
    );
    expect(normalized).toContain("set generation_status = 'ai_draft'");
    expect(normalized).toContain("reviewed_at = null");
    expect(normalized).toContain("reviewed_by = null");
  });

  it("constrains lesson review state to explicit lifecycle values", () => {
    expect(normalized).toContain(
      "check (generation_status in ('ai_draft', 'human_reviewed', 'approved'))",
    );
  });

  it("allows public reads while limiting private video reads to the owner", () => {
    const selectPolicy = policy("real_talk_videos_select");

    expect(selectPolicy).toContain("for select");
    expect(selectPolicy).toContain("is_public = true");
    expect(selectPolicy).toContain("auth.role() = 'authenticated'");
    expect(selectPolicy).toContain("created_by = auth.uid()");
  });

  it("limits private lesson reads through the owned or public parent video", () => {
    const selectPolicy = policy("real_talk_lessons_select");

    expect(selectPolicy).toContain("for select");
    expect(selectPolicy).toContain("video.id = real_talk_lessons.video_id");
    expect(selectPolicy).toContain("video.is_public = true");
    expect(selectPolicy).toContain("video.created_by = auth.uid()");
  });

  it("prevents anonymous, cross-owner, or public video draft inserts", () => {
    const insertPolicy = policy("real_talk_videos_insert");

    expect(insertPolicy).toContain("auth.role() = 'authenticated'");
    expect(insertPolicy).toContain("created_by = auth.uid()");
    expect(insertPolicy).toContain("is_public = false");
  });

  it("prevents ordinary users from inserting reviewed or approved lessons", () => {
    const insertPolicy = policy("real_talk_lessons_insert");

    expect(insertPolicy).toContain("generation_status = 'ai_draft'");
    expect(insertPolicy).toContain("reviewed_at is null");
    expect(insertPolicy).toContain("reviewed_by is null");
    expect(insertPolicy).toContain("video.created_by = auth.uid()");
    expect(insertPolicy).toContain("video.is_public = false");
  });

  it("prevents ordinary users from publishing videos or elevating lesson review state on update", () => {
    const videoUpdate = policy("real_talk_videos_update_owner");
    const lessonUpdate = policy("real_talk_lessons_update_owner");

    expect(videoUpdate).toContain("created_by = auth.uid()");
    expect(videoUpdate).toContain("is_public = false");
    expect(lessonUpdate).toContain("generation_status = 'ai_draft'");
    expect(lessonUpdate).toContain("reviewed_at is null");
    expect(lessonUpdate).toContain("reviewed_by is null");
    expect(lessonUpdate).toContain("video.created_by = auth.uid()");
    expect(lessonUpdate).toContain("video.is_public = false");
  });
});
