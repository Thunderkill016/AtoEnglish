export type NaturalMediaAuthenticityClass =
  | "spontaneous_real_world"
  | "live_unscripted_q_and_a"
  | "semi_structured_unscripted_interview"
  | "scripted_or_reenacted"
  | "unknown";

export type NaturalMediaReviewStatus =
  | "machine_discovered"
  | "needs_playback_review"
  | "human_verified"
  | "rejected";

export type NaturalMediaDecision =
  | "shortlist_for_manual_review"
  | "accepted_for_authoring"
  | "reject";

export interface NaturalMediaWindow {
  startMs: number;
  endMs: number;
}

export interface NaturalMediaCandidate {
  id: string;
  title: string;
  sourcePageUrl: string;
  timedTextUrl?: string;
  rightsEvidenceUrl: string;
  window: NaturalMediaWindow;
  targetCapabilityIds: string[];
  spokenLanguage: "en" | "non_en" | "mixed" | "unknown";
  authenticity: {
    classification: NaturalMediaAuthenticityClass;
    status: NaturalMediaReviewStatus;
    scoreOutOfFive: 1 | 2 | 3 | 4 | 5;
    evidence: string[];
    stagingSignals: string[];
    editingRisk: "low" | "medium" | "high";
  };
  sourceRights: {
    claim: "public_domain" | "cc_by" | "cc_by_sa" | "other" | "unknown";
    status: "claim_recorded" | "human_verified" | "rejected";
  };
  suitability: {
    ageAppropriate: boolean;
    sensitiveContext: boolean;
    audioReviewStatus: NaturalMediaReviewStatus;
    transcriptReviewStatus: NaturalMediaReviewStatus;
  };
  decision: NaturalMediaDecision;
  rejectionReasons: string[];
  notes: string[];
}

export type NaturalMediaValidationCode =
  | "missing_field"
  | "invalid_url"
  | "invalid_window"
  | "clip_too_short"
  | "clip_too_long"
  | "missing_capability"
  | "non_english_audio"
  | "scripted_content"
  | "insufficient_authenticity_evidence"
  | "sensitive_context"
  | "accepted_without_human_review";

export interface NaturalMediaValidationIssue {
  code: NaturalMediaValidationCode;
  path: string;
  message: string;
}

const isHttpsUrl = (value: string) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

export function validateNaturalMediaCandidate(
  candidate: NaturalMediaCandidate,
): NaturalMediaValidationIssue[] {
  const issues: NaturalMediaValidationIssue[] = [];
  const add = (
    code: NaturalMediaValidationCode,
    path: string,
    message: string,
  ) => issues.push({ code, path, message });

  if (!candidate.id.trim() || !candidate.title.trim()) {
    add("missing_field", candidate.id || "candidate", "ID and title are required.");
  }

  for (const [path, value] of [
    ["sourcePageUrl", candidate.sourcePageUrl],
    ["rightsEvidenceUrl", candidate.rightsEvidenceUrl],
    ...(candidate.timedTextUrl
      ? ([["timedTextUrl", candidate.timedTextUrl]] as const)
      : []),
  ] as const) {
    if (!isHttpsUrl(value)) {
      add("invalid_url", `${candidate.id}.${path}`, "A valid HTTPS URL is required.");
    }
  }

  const durationMs = candidate.window.endMs - candidate.window.startMs;
  if (candidate.window.startMs < 0 || durationMs <= 0) {
    add("invalid_window", `${candidate.id}.window`, "The media window is invalid.");
  } else if (durationMs < 3_000) {
    add("clip_too_short", `${candidate.id}.window`, "Candidate window is under three seconds.");
  } else if (durationMs > 60_000) {
    add("clip_too_long", `${candidate.id}.window`, "Candidate window is over sixty seconds.");
  }

  if (candidate.targetCapabilityIds.length === 0) {
    add("missing_capability", `${candidate.id}.targetCapabilityIds`, "At least one capability is required.");
  }

  if (candidate.decision !== "reject") {
    if (candidate.spokenLanguage !== "en") {
      add("non_english_audio", `${candidate.id}.spokenLanguage`, "Shortlisted core media must contain English audio.");
    }
    if (
      candidate.authenticity.classification === "scripted_or_reenacted" ||
      candidate.authenticity.classification === "unknown"
    ) {
      add("scripted_content", `${candidate.id}.authenticity`, "Scripted, reenacted, or unknown content cannot be shortlisted as natural speech.");
    }
    if (
      candidate.authenticity.scoreOutOfFive < 4 ||
      candidate.authenticity.evidence.length === 0
    ) {
      add(
        "insufficient_authenticity_evidence",
        `${candidate.id}.authenticity`,
        "A shortlist requires strong, recorded authenticity evidence.",
      );
    }
    if (candidate.suitability.sensitiveContext) {
      add("sensitive_context", `${candidate.id}.suitability`, "Sensitive contexts are excluded from the A0 pilot.");
    }
  }

  if (candidate.decision === "accepted_for_authoring") {
    const fullyReviewed =
      candidate.authenticity.status === "human_verified" &&
      candidate.sourceRights.status === "human_verified" &&
      candidate.suitability.audioReviewStatus === "human_verified" &&
      candidate.suitability.transcriptReviewStatus === "human_verified";

    if (!fullyReviewed) {
      add(
        "accepted_without_human_review",
        candidate.id,
        "Authoring acceptance requires human verification of authenticity, rights, audio, and transcript.",
      );
    }
  }

  return issues;
}
