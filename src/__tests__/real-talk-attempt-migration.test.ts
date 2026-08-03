import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const attemptsMigration = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/20260803120000_real_talk_bounded_attempts.sql",
  ),
  "utf8",
);
const restoreMigration = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/20260803120500_real_talk_attempt_read_rpc.sql",
  ),
  "utf8",
);
const repository = readFileSync(
  join(
    process.cwd(),
    "src/features/real-talk/server/attempt-repository.ts",
  ),
  "utf8",
);

function compactSql(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

const sql = compactSql(attemptsMigration);
const restoreSql = compactSql(restoreMigration);

describe("bounded Real Talk attempt persistence", () => {
  it("stores only bounded scalar evidence", () => {
    expect(sql).toContain("create table if not exists public.real_talk_attempts");
    expect(sql).toContain("max_support_level integer");
    expect(sql).toContain("retrieval_attempted boolean");
    expect(sql).toContain("speak_confirmed boolean");
    expect(sql).toContain("transfer_attempted boolean");
    expect(sql).not.toContain("audio_url");
    expect(sql).not.toContain("speech_transcript");
    expect(sql).not.toContain("learner_text");
  });

  it("requires all productive gates before completed status", () => {
    expect(sql).toContain("real_talk_attempts_completion_evidence_check");
    expect(sql).toContain("first_listen_completed");
    expect(sql).toContain("retrieval_attempted");
    expect(sql).toContain("speak_confirmed");
    expect(sql).toContain("transfer_attempted");
    expect(sql).toContain("checkpoint = 'completed'");
    expect(sql).toContain("completed_at is not null");
  });

  it("derives user identity and completion inside the RPC", () => {
    expect(sql).toContain("v_user_id uuid := (select auth.uid())");
    expect(sql).toContain(
      "v_completed := v_first_listen and v_retrieval and v_speaking and v_transfer",
    );
    expect(sql).toContain("video.created_by = v_user_id");
    expect(sql).toContain("on conflict on constraint real_talk_attempts_user_lesson_key do update");
  });

  it("enforces owner-only RLS and hides the functions from anonymous callers", () => {
    expect(sql).toContain("user_id = auth.uid()");
    expect(sql).toContain(
      "revoke all on function public.save_real_talk_attempt(text, jsonb) from anon",
    );
    expect(restoreSql).toContain("attempt.user_id = auth.uid()");
    expect(restoreSql).toContain(
      "revoke all on function public.get_real_talk_attempt(text) from anon",
    );
  });

  it("uses only the save and restore RPCs from the repository", () => {
    expect(repository).toContain('"save_real_talk_attempt"');
    expect(repository).toContain('"get_real_talk_attempt"');
    expect(repository).not.toContain('.from("real_talk_attempts")');
  });
});
