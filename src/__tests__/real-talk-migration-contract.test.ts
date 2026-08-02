import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const baselineFilename = "20260802185000_real_talk_private_draft_schema.sql";
const hardeningFilename = "20260802190000_real_talk_private_draft_gate.sql";
const migrationDirectory = join(process.cwd(), "supabase/migrations");
const baselineMigration = readFileSync(
  join(migrationDirectory, baselineFilename),
  "utf8",
);
const hardeningMigration = readFileSync(
  join(migrationDirectory, hardeningFilename),
  "utf8",
);
const baselineNormalized = baselineMigration.replace(/\s+/g, " ").toLowerCase();
const hardeningNormalized = hardeningMigration
  .replace(/\s+/g, " ")
  .toLowerCase();

function policy(name: string) {
  const match = hardeningMigration.match(
    new RegExp(`create policy "${name}"[\\s\\S]*?;`, "i"),
  );
  if (!match) throw new Error(`Missing policy ${name}`);
  return match[0].replace(/\s+/g, " ").toLowerCase();
}

describe("Real Talk private draft migration chain", () => {
  it("orders the baseline schema before the RLS hardening migration", () => {
    expect(baselineFilename.localeCompare(hardeningFilename)).toBeLessThan(0);
  });

  it("creates the two owner-private draft tables and deterministic identities", () => {
    expect(baselineNormalized).toContain(
      "create table if not exists public.real_talk_videos",
    );
    expect(baselineNormalized).toContain(
      "create table if not exists public.real_talk_lessons",
    );
    expect(baselineNormalized).toContain(
      "id uuid primary key default gen_random_uuid()",
    );
    expect(baselineNormalized).toContain("slug text not null unique");
    expect(baselineNormalized).toContain("video_id uuid not null unique");
    expect(baselineNormalized).toContain(
      "references public.real_talk_videos(id) on delete cascade",
    );
  });

  it("binds ownership and review identities to auth users", () => {
    expect(baselineNormalized).toContain(
      "created_by uuid references auth.users(id) on delete cascade",
    );
    expect(baselineNormalized).toContain(
      "reviewed_by uuid references auth.users(id) on delete set null",
    );
  });

  it("creates the complete persisted draft JSON contract", () => {
    for (const fragment of [
      "speakers jsonb not null default '[]'::jsonb",
      "transcript jsonb not null default '[]'::jsonb",
      "pre_watch jsonb not null default '{}'::jsonb",
      "while_watch jsonb not null default '{}'::jsonb",
      "post_watch jsonb not null default '{}'::jsonb",
      "environment jsonb not null default '{}'::jsonb",
      "communication_events jsonb not null default '[]'::jsonb",
      "transfer_task jsonb not null default '{}'::jsonb",
      "generation_warnings jsonb not null default '[]'::jsonb",
    ]) {
      expect(baselineNormalized).toContain(fragment);
    }
  });

  it("rejects malformed source IDs and invalid source windows", () => {
    expect(baselineNormalized).toContain(
      "check (youtube_id ~ '^[a-za-z0-9_-]{11}$')",
    );
    expect(baselineNormalized).toContain(
      "check (segment_end >= segment_start)",
    );
  });

  it("grants anonymous read access only and leaves writes to authenticated users", () => {
    expect(baselineNormalized).toContain(
      "grant select on public.real_talk_videos, public.real_talk_lessons to anon, authenticated",
    );
    expect(baselineNormalized).toContain(
      "grant insert, update, delete on public.real_talk_videos, public.real_talk_lessons to authenticated",
    );
    expect(baselineNormalized).not.toMatch(/grant insert[^;]*\bto anon\b/);
    expect(baselineNormalized).not.toMatch(/grant update[^;]*\bto anon\b/);
    expect(baselineNormalized).not.toMatch(/grant delete[^;]*\bto anon\b/);
  });
});

describe("Real Talk private draft RLS hardening contract", () => {
  it("makes generated video rows private by default and repairs legacy rows", () => {
    expect(hardeningNormalized).toContain(
      "alter table public.real_talk_videos alter column is_public set default false",
    );
    expect(hardeningNormalized).toContain(
      "update public.real_talk_videos set is_public = false where created_by is not null",
    );
    expect(hardeningNormalized).toContain("set generation_status = 'ai_draft'");
    expect(hardeningNormalized).toContain("reviewed_at = null");
    expect(hardeningNormalized).toContain("reviewed_by = null");
  });

  it("enables RLS and removes every previous policy before installing the canonical set", () => {
    expect(hardeningNormalized).toContain(
      "alter table public.real_talk_videos enable row level security",
    );
    expect(hardeningNormalized).toContain(
      "alter table public.real_talk_lessons enable row level security",
    );
    expect(hardeningNormalized).toContain("from pg_policies");
    expect(hardeningNormalized).toContain("tablename = 'real_talk_videos'");
    expect(hardeningNormalized).toContain("tablename = 'real_talk_lessons'");
    expect(hardeningNormalized).toContain(
      "drop policy if exists %i on public.real_talk_videos",
    );
    expect(hardeningNormalized).toContain(
      "drop policy if exists %i on public.real_talk_lessons",
    );
  });

  it("constrains lesson review state to explicit lifecycle values", () => {
    expect(hardeningNormalized).toContain(
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

  it("limits owner deletion to private video and ai_draft lesson rows", () => {
    const videoDelete = policy("real_talk_videos_delete_owner");
    const lessonDelete = policy("real_talk_lessons_delete_owner");

    expect(videoDelete).toContain("created_by = auth.uid()");
    expect(videoDelete).toContain("is_public = false");
    expect(lessonDelete).toContain("generation_status = 'ai_draft'");
    expect(lessonDelete).toContain("video.created_by = auth.uid()");
    expect(lessonDelete).toContain("video.is_public = false");
  });
});
