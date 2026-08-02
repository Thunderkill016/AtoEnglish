import { describe, expect, it } from "vitest";

import {
  NATURAL_A0_CANDIDATES_BATCH_2,
  REJECTED_NATURAL_A0_CANDIDATES,
  SHORTLISTED_NATURAL_A0_CANDIDATES,
} from "@/features/source-curation/data/natural-a0-candidates-batch-2";
import {
  type NaturalMediaCandidate,
  validateNaturalMediaCandidate,
} from "@/features/source-curation/domain/natural-media";

function validationCodes(candidate: NaturalMediaCandidate) {
  return validateNaturalMediaCandidate(candidate).map((issue) => issue.code);
}

describe("Natural media candidate validation", () => {
  it("keeps every shortlisted item valid as a discovery candidate", () => {
    for (const candidate of SHORTLISTED_NATURAL_A0_CANDIDATES) {
      expect(validateNaturalMediaCandidate(candidate)).toEqual([]);
    }
  });

  it("shortlists only strongly evidenced, non-scripted English interactions", () => {
    for (const candidate of SHORTLISTED_NATURAL_A0_CANDIDATES) {
      expect(candidate.spokenLanguage).toBe("en");
      expect(candidate.authenticity.scoreOutOfFive).toBeGreaterThanOrEqual(4);
      expect(candidate.authenticity.evidence.length).toBeGreaterThan(0);
      expect(candidate.authenticity.classification).not.toBe(
        "scripted_or_reenacted",
      );
      expect(candidate.authenticity.classification).not.toBe("unknown");
      expect(candidate.suitability.sensitiveContext).toBe(false);
    }
  });

  it("does not prematurely accept any discovered item for authoring", () => {
    expect(
      NATURAL_A0_CANDIDATES_BATCH_2.some(
        (candidate) => candidate.decision === "accepted_for_authoring",
      ),
    ).toBe(false);
  });

  it("records an explicit reason for every rejection", () => {
    expect(REJECTED_NATURAL_A0_CANDIDATES.length).toBeGreaterThan(0);
    for (const candidate of REJECTED_NATURAL_A0_CANDIDATES) {
      expect(candidate.rejectionReasons.length).toBeGreaterThan(0);
    }
  });

  it("rejects a staged dialogue from the natural-media shortlist", () => {
    const scriptedCandidate: NaturalMediaCandidate = {
      ...structuredClone(SHORTLISTED_NATURAL_A0_CANDIDATES[0]),
      id: "scripted-test-candidate",
      authenticity: {
        ...structuredClone(
          SHORTLISTED_NATURAL_A0_CANDIDATES[0].authenticity,
        ),
        classification: "scripted_or_reenacted",
      },
    };

    expect(validationCodes(scriptedCandidate)).toContain("scripted_content");
  });

  it("blocks authoring acceptance without four human review gates", () => {
    const prematureAcceptance: NaturalMediaCandidate = {
      ...structuredClone(SHORTLISTED_NATURAL_A0_CANDIDATES[0]),
      id: "premature-acceptance-test",
      decision: "accepted_for_authoring",
    };

    expect(validationCodes(prematureAcceptance)).toContain(
      "accepted_without_human_review",
    );
  });
});
