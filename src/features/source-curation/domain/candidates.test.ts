import { describe, expect, it } from "vitest";

import { FIRST_A0_SOURCE_CANDIDATES } from "@/features/source-curation/data/first-a0-candidates";
import {
  buildCapabilityCoverage,
  totalCandidateScore,
  validateSourceCandidateBatch,
} from "@/features/source-curation/domain/candidates";

describe("A0 source candidate curation", () => {
  it("keeps the discovery batch structurally valid without pretending it is publishable", () => {
    expect(validateSourceCandidateBatch(FIRST_A0_SOURCE_CANDIDATES)).toEqual([]);
    expect(FIRST_A0_SOURCE_CANDIDATES.length).toBe(10);
    expect(
      FIRST_A0_SOURCE_CANDIDATES.every(
        (candidate) => candidate.status !== "accepted_for_authoring",
      ),
    ).toBe(true);
    expect(
      FIRST_A0_SOURCE_CANDIDATES.every(
        (candidate) => candidate.rights.review !== "human_verified",
      ),
    ).toBe(true);
  });

  it("keeps provisional scores bounded and useful only for triage", () => {
    for (const candidate of FIRST_A0_SOURCE_CANDIDATES) {
      expect(totalCandidateScore(candidate.scores)).toBeGreaterThan(0);
      expect(totalCandidateScore(candidate.scores)).toBeLessThanOrEqual(40);
    }
  });

  it("shows that self-introduction is abundant while interactional repair is missing", () => {
    const coverage = buildCapabilityCoverage(FIRST_A0_SOURCE_CANDIDATES);
    const byCapability = new Map(
      coverage.map((entry) => [entry.capabilityId, entry]),
    );

    expect(byCapability.get("a0.say_ones_name")?.gap).toBe("none");
    expect(byCapability.get("a0.say_ones_name")?.candidateCount).toBeGreaterThanOrEqual(7);

    expect(byCapability.get("a0.greet_someone")?.gap).toBe("none");
    expect(byCapability.get("a0.say_where_from")?.gap).toBe("thin");
    expect(byCapability.get("a0.ask_others_name")?.gap).toBe("thin");
    expect(byCapability.get("a0.request_repetition")?.gap).toBe("missing");
  });

  it("does not claim that an unverified mirror is a confirmed YouTube source", () => {
    const withYoutubeUrl = FIRST_A0_SOURCE_CANDIDATES.filter(
      (candidate) => candidate.youtube.url !== null,
    );

    expect(withYoutubeUrl).toHaveLength(1);
    expect(withYoutubeUrl[0]?.youtube.status).toBe("needs_review");
    expect(withYoutubeUrl[0]?.youtube.officialUploadVerified).toBe(false);

    const coverage = buildCapabilityCoverage(FIRST_A0_SOURCE_CANDIDATES);
    expect(
      coverage.every((entry) => entry.confirmedYoutubeCount === 0),
    ).toBe(true);
  });
});
