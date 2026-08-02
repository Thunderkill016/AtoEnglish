import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/20260803010500_real_talk_transcript_provenance.sql",
  ),
  "utf8",
);

function compactSql(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

const sql = compactSql(migration);

describe("Real Talk transcript provenance migration", () => {
  it("persists acquisition, review, metadata, and digest fields", () => {
    expect(sql).toContain("transcript_acquisition_mode text not null");
    expect(sql).toContain("transcript_review_status text not null");
    expect(sql).toContain("transcript_source_metadata jsonb not null");
    expect(sql).toContain("transcript_cue_digest text");
  });

  it("allows only enumerated acquisition and review states", () => {
    for (const mode of [
      "creator_provided",
      "authorized_export",
      "licensed_source",
      "public_domain",
      "human_reviewed_upload",
      "approved_provider_api",
      "experimental_unofficial",
    ]) {
      expect(sql).toContain(`'${mode}'`);
    }

    for (const status of ["unreviewed", "machine_checked", "human_verified"]) {
      expect(sql).toContain(`'${status}'`);
    }
  });

  it("requires approved metadata, review, and a matching sha-256 digest", () => {
    expect(sql).toContain("real_talk_videos_approved_transcript_provenance_check");
    expect(sql).toContain("transcript_review_status = 'human_verified'");
    expect(sql).toContain("transcript_cue_digest ~ '^[0-9a-f]{64}$'");
    expect(sql).toContain("transcript_source_metadata -> 'provenance' ? 'rightsbasis'");
    expect(sql).toContain("transcript_source_metadata -> 'provenance' ? 'rightsreference'");
    expect(sql).toContain("transcript_source_metadata -> 'provenance' ? 'submittedbyuserid'");
    expect(sql).toContain("transcript_source_metadata -> 'provenance' ? 'reviewedbyuserid'");
    expect(sql).toContain("transcript_source_metadata -> 'provenance' ->> 'cuedigestsha256' = transcript_cue_digest");
  });

  it("prevents ordinary authenticated clients from self-approving provenance", () => {
    expect(sql).toContain("real_talk_enforce_transcript_provenance_write");
    expect(sql).toContain("requester_role = 'authenticated'");
    expect(sql).toContain("new.transcript_acquisition_mode <> 'experimental_unofficial'");
    expect(sql).toContain("approved transcript provenance requires a trusted server review path");
  });

  it("makes approved provenance immutable outside the service role", () => {
    expect(sql).toContain("old.transcript_acquisition_mode <> 'experimental_unofficial'");
    expect(sql).toContain("requester_role <> 'service_role'");
    expect(sql).toContain("approved transcript provenance is immutable for ordinary roles");
    expect(sql).toContain("before insert or update on public.real_talk_videos");
  });

  it("does not create columns intended to store credentials", () => {
    expect(sql).not.toContain("oauth_token");
    expect(sql).not.toContain("access_token text");
    expect(sql).not.toContain("authorization_header");
    expect(sql).not.toContain("signed_url");
  });
});
