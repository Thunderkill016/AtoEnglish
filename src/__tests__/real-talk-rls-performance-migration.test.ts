import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const hardeningFilename = "20260802190000_real_talk_private_draft_gate.sql";
const performanceFilename = "20260802231000_real_talk_rls_performance.sql";
const performanceMigration = readFileSync(
  join(process.cwd(), "supabase/migrations", performanceFilename),
  "utf8",
);
const normalized = performanceMigration.replace(/\s+/g, " ").toLowerCase();

function policy(name: string) {
  const match = performanceMigration.match(
    new RegExp(`create policy "${name}"[\\s\\S]*?;`, "i"),
  );
  if (!match) throw new Error(`Missing optimized policy ${name}`);
  return match[0].replace(/\s+/g, " ").toLowerCase();
}

const policyNames = [
  "real_talk_videos_select",
  "real_talk_lessons_select",
  "real_talk_videos_insert",
  "real_talk_videos_update_owner",
  "real_talk_videos_delete_owner",
  "real_talk_lessons_insert",
  "real_talk_lessons_update_owner",
  "real_talk_lessons_delete_owner",
] as const;

describe("Real Talk RLS performance migration", () => {
  it("runs after the canonical private-draft gate", () => {
    expect(hardeningFilename.localeCompare(performanceFilename)).toBeLessThan(0);
  });

  it("adds a covering index for the review-user foreign key", () => {
    expect(normalized).toContain(
      "create index if not exists real_talk_lessons_reviewed_by_idx on public.real_talk_lessons(reviewed_by)",
    );
  });

  it("replaces all eight canonical policies", () => {
    for (const name of policyNames) {
      expect(normalized).toContain(
        `drop policy if exists "${name}" on public.`,
      );
      expect(() => policy(name)).not.toThrow();
    }
  });

  it("initializes auth claims once per statement in every policy", () => {
    for (const name of policyNames) {
      const definition = policy(name);
      expect(definition).not.toMatch(/(?<!select )auth\.role\(\)/);
      expect(definition).not.toMatch(/(?<!select )auth\.uid\(\)/);
      expect(definition).toContain("(select auth.role())");
    }

    for (const name of policyNames.filter((name) => name !== "real_talk_lessons_select")) {
      const definition = policy(name);
      if (definition.includes("created_by")) {
        expect(definition).toContain("(select auth.uid())");
      }
    }
  });
});
