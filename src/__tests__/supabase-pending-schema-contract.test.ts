import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const hostedTypes = readFileSync(
  resolve(process.cwd(), "src/types/supabase.ts"),
  "utf8",
);
const appDatabase = readFileSync(
  resolve(process.cwd(), "src/types/app-database.ts"),
  "utf8",
);
const pendingLearningAttempts = readFileSync(
  resolve(process.cwd(), "src/types/pending-learning-attempts.ts"),
  "utf8",
);
const learningAttemptsMigration = readFileSync(
  resolve(
    process.cwd(),
    "supabase/migrations/20260731162613_learning_attempts.sql",
  ),
  "utf8",
);

describe("Supabase hosted and pending schema boundary", () => {
  it("keeps the generated hosted snapshot free of unapplied learning_attempts", () => {
    expect(hostedTypes).not.toContain("      learning_attempts: {");
    expect(hostedTypes).toContain("      real_talk_lessons: {");
    expect(hostedTypes).toContain("      real_talk_videos: {");
  });

  it("maps the unapplied migration through an explicit app-level overlay", () => {
    expect(learningAttemptsMigration).toContain(
      "create table public.learning_attempts",
    );
    expect(pendingLearningAttempts).toContain(
      "export type PendingLearningAttemptTable",
    );
    expect(appDatabase).toContain(
      'learning_attempts: PendingLearningAttemptTable;',
    );
    expect(appDatabase).toContain(
      "20260731162613_learning_attempts.sql",
    );
  });

  it("retains the pending Real Talk provenance and atomic RPC overlay", () => {
    expect(appDatabase).toContain("RealTalkTables");
    expect(appDatabase).toContain("RealTalkFunctions");
    expect(appDatabase).toContain("T060");
    expect(appDatabase).toContain("T067");
  });
});
