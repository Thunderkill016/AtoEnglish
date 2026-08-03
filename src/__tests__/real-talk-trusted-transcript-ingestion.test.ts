import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

function compact(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

const migration = compact(
  readFileSync(
    join(
      process.cwd(),
      "supabase/migrations/20260803022500_real_talk_trusted_transcript_ingestion.sql",
    ),
    "utf8",
  ),
);
const edgeFunction = readFileSync(
  join(
    process.cwd(),
    "supabase/functions/real-talk-transcript-review/index.ts",
  ),
  "utf8",
);

describe("Real Talk trusted transcript ingestion boundary", () => {
  it("creates a bounded transcript source registry with explicit provenance", () => {
    expect(migration).toContain(
      "create table if not exists public.real_talk_transcript_sources",
    );
    for (const column of [
      "source_external_id text not null",
      "canonical_source_url text not null",
      "source_reference text not null",
      "acquisition_mode text not null",
      "rights_basis text not null",
      "rights_reference text not null",
      "cues jsonb not null",
      "cue_digest text not null",
      "submitted_by uuid not null",
      "reviewed_by uuid",
      "reviewed_at timestamptz",
    ]) {
      expect(migration).toContain(column);
    }
    expect(migration).toContain("jsonb_array_length(cues) between 2 and 200");
    expect(migration).toContain("cue_digest ~ '^[0-9a-f]{64}$'");
  });

  it("requires rights compatibility and an independent reviewer", () => {
    expect(migration).toContain(
      "acquisition_mode = 'public_domain' and rights_basis = 'public_domain'",
    );
    expect(migration).toContain("reviewed_by <> submitted_by");
    expect(migration).toContain("review_status = 'human_verified'");
    expect(migration).toContain("reviewed_at is not null");
  });

  it("allows authenticated reads but removes every direct client write path", () => {
    expect(migration).toContain(
      "alter table public.real_talk_transcript_sources enable row level security",
    );
    expect(migration).toContain(
      "revoke all on table public.real_talk_transcript_sources from public, anon, authenticated",
    );
    expect(migration).toContain(
      "grant select on table public.real_talk_transcript_sources to authenticated",
    );
    expect(migration).toContain("for select to authenticated");
    expect(migration).toContain("review_status = 'human_verified'");
    expect(migration).not.toContain("grant insert");
    expect(migration).not.toContain("grant update");
    expect(migration).not.toContain("grant delete");
  });

  it("locks verified rows and does not add credential storage", () => {
    expect(migration).toContain("real_talk_lock_verified_transcript_source");
    expect(migration).toContain(
      "old.review_status = 'human_verified'",
    );
    expect(migration).toContain(
      "human-verified transcript sources are immutable",
    );
    expect(migration).not.toContain("oauth_token");
    expect(migration).not.toContain("access_token text");
    expect(migration).not.toContain("authorization_header");
    expect(migration).not.toContain("signed_url");
  });

  it("derives identities from Supabase Auth and gates approval by app metadata", () => {
    expect(edgeFunction).toContain("authClient.auth.getUser(token)");
    expect(edgeFunction).toContain("submitted_by: user.id");
    expect(edgeFunction).toContain("reviewed_by: user.id");
    expect(edgeFunction).toContain(
      "user.app_metadata?.real_talk_reviewer !== true",
    );
    expect(edgeFunction).toContain("row.submitted_by === user.id");
    expect(edgeFunction).not.toContain("submittedByUserId");
    expect(edgeFunction).not.toContain("reviewedByUserId");
  });

  it("computes the cue digest in the trusted function and rechecks it at approval", () => {
    expect(edgeFunction).toContain('crypto.subtle.digest("SHA-256", bytes)');
    expect(edgeFunction).toContain("reviewed.cueDigest !== row.cue_digest");
    expect(edgeFunction).toContain('review_status: "human_verified"');
    expect(edgeFunction).toContain(
      'const ADAPTER_ID = "supabase-reviewed-transcript-v1"',
    );
  });
});
