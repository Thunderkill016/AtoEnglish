import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const correctiveMigrationPath = resolve(
  process.cwd(),
  "supabase/migrations/20260902134000_privacy_safe_oral_observation.sql",
);

const correctiveMigration = readFileSync(correctiveMigrationPath, "utf8");

describe("privacy-safe oral evidence migration contract", () => {
  it("defines one database helper for observed oral response", () => {
    expect(correctiveMigration).toContain(
      "CREATE OR REPLACE FUNCTION private.has_observed_oral_response",
    );
    expect(correctiveMigration).toContain("p_metadata->>'responseSource'");
    expect(correctiveMigration).toContain("p_metadata->>'responseLength'");
  });

  it("allows response_text to remain nullable instead of inventing a transcript sentinel", () => {
    expect(correctiveMigration).toContain(
      "private.has_observed_oral_response(p_response_text, v_metadata)",
    );
    expect(correctiveMigration).not.toContain("__observed_speech__");
    expect(correctiveMigration).not.toContain("__speech_observed__");
  });

  it("uses the same privacy-safe invariant at the trigger boundary", () => {
    expect(correctiveMigration).toContain(
      "private.has_observed_oral_response(v_response_text, COALESCE(v_attempt_metadata, '{}'::jsonb))",
    );
    expect(correctiveMigration).toContain("v_attempt_metadata jsonb");
  });

  it("requires observed oral response for both success and failure, not success only", () => {
    const helperCheck = correctiveMigration.indexOf(
      "AND NOT private.has_observed_oral_response(p_response_text, v_metadata)",
    );
    const transferCheck = correctiveMigration.indexOf("IF p_evidence_type = 'transfer' THEN");

    expect(helperCheck).toBeGreaterThan(-1);
    expect(helperCheck).toBeLessThan(transferCheck);
    expect(
      correctiveMigration.slice(Math.max(0, helperCheck - 160), helperCheck),
    ).not.toContain("p_evidence_success");
  });
});
