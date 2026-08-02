export type FirstA0CapabilityId =
  | "a0.greet_someone"
  | "a0.say_ones_name"
  | "a0.ask_others_name"
  | "a0.say_where_from"
  | "a0.request_repetition";

export type SourceCandidateStatus =
  | "discovered"
  | "needs_rights_review"
  | "needs_media_review"
  | "needs_transcript_review"
  | "shortlisted"
  | "accepted_for_authoring"
  | "rejected";

export type YoutubeDiscoveryStatus =
  | "confirmed"
  | "needs_review"
  | "not_found"
  | "not_required";

export type RightsClaim =
  | "public_domain_notice"
  | "creative_commons_notice"
  | "written_permission"
  | "owned"
  | "unclear";

export type ReviewState = "not_started" | "in_progress" | "human_verified";

export interface CandidateClipWindow {
  id: string;
  approximateStartMs: number | null;
  approximateEndMs: number | null;
  evidenceText: string;
  targetCapabilityIds: FirstA0CapabilityId[];
  speakerLabel: string | null;
  notes: string;
}

export interface CandidateScore {
  capabilityFit: number;
  contextClarity: number;
  audioClarity: number;
  naturalness: number;
  a0TreatmentPotential: number;
  speakerDiversityValue: number;
  rightsEvidenceStrength: number;
  transcriptEvidenceStrength: number;
}

export interface SourceCandidate {
  id: string;
  title: string;
  provider: "dvids" | "youtube" | "government_archive" | "creator" | "other";
  sourceUrl: string;
  playbackUrl: string;
  durationMs: number;
  publishedAt: string;
  discoveredAt: string;

  youtube: {
    status: YoutubeDiscoveryStatus;
    url: string | null;
    officialUploadVerified: boolean;
  };

  rights: {
    claim: RightsClaim;
    evidenceUrl: string;
    review: ReviewState;
    note: string;
  };

  transcript: {
    evidence: "page_transcript" | "captions_available" | "partial_quote" | "none";
    evidenceUrl: string | null;
    review: ReviewState;
  };

  mediaReview: ReviewState;
  status: SourceCandidateStatus;
  candidateWindows: CandidateClipWindow[];
  scores: CandidateScore;
  strengths: string[];
  risks: string[];
  rejectionReason: string | null;
}

export interface SourceCandidateIssue {
  code:
    | "missing_field"
    | "invalid_url"
    | "invalid_duration"
    | "invalid_score"
    | "invalid_window"
    | "missing_capability"
    | "invalid_youtube_state"
    | "invalid_acceptance_state"
    | "invalid_rejection_state";
  path: string;
  message: string;
}

export interface CapabilityCoverage {
  capabilityId: FirstA0CapabilityId;
  candidateCount: number;
  candidateWindowCount: number;
  confirmedYoutubeCount: number;
  distinctSpeakerLabels: number;
  gap: "none" | "thin" | "missing";
}

export const FIRST_A0_CAPABILITY_IDS: FirstA0CapabilityId[] = [
  "a0.greet_someone",
  "a0.say_ones_name",
  "a0.ask_others_name",
  "a0.say_where_from",
  "a0.request_repetition",
];

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isYoutubeWatchUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") &&
      url.pathname === "/watch" &&
      Boolean(url.searchParams.get("v"))
    );
  } catch {
    return false;
  }
}

function scoreValues(score: CandidateScore) {
  return Object.values(score);
}

export function totalCandidateScore(score: CandidateScore) {
  return scoreValues(score).reduce((total, value) => total + value, 0);
}

export function validateSourceCandidate(candidate: SourceCandidate) {
  const issues: SourceCandidateIssue[] = [];
  const add = (
    code: SourceCandidateIssue["code"],
    path: string,
    message: string,
  ) => issues.push({ code, path, message });

  if (!candidate.id.trim() || !candidate.title.trim() || !candidate.publishedAt) {
    add("missing_field", candidate.id || "candidate", "Candidate identity is incomplete.");
  }

  for (const [field, url] of [
    ["sourceUrl", candidate.sourceUrl],
    ["playbackUrl", candidate.playbackUrl],
    ["rights.evidenceUrl", candidate.rights.evidenceUrl],
  ] as const) {
    if (!isHttpsUrl(url)) {
      add("invalid_url", `${candidate.id}.${field}`, `${field} must be HTTPS.`);
    }
  }

  if (
    candidate.transcript.evidenceUrl &&
    !isHttpsUrl(candidate.transcript.evidenceUrl)
  ) {
    add(
      "invalid_url",
      `${candidate.id}.transcript.evidenceUrl`,
      "Transcript evidence URL must be HTTPS.",
    );
  }

  if (!Number.isFinite(candidate.durationMs) || candidate.durationMs <= 0) {
    add(
      "invalid_duration",
      `${candidate.id}.durationMs`,
      "Candidate duration must be positive.",
    );
  }

  if (scoreValues(candidate.scores).some((value) => value < 0 || value > 5)) {
    add(
      "invalid_score",
      `${candidate.id}.scores`,
      "Every provisional score must be between 0 and 5.",
    );
  }

  if (
    candidate.youtube.status === "confirmed" &&
    (!candidate.youtube.url ||
      !isYoutubeWatchUrl(candidate.youtube.url) ||
      !candidate.youtube.officialUploadVerified)
  ) {
    add(
      "invalid_youtube_state",
      `${candidate.id}.youtube`,
      "Confirmed YouTube candidates require a verified exact watch URL.",
    );
  }

  if (
    candidate.youtube.status !== "confirmed" &&
    candidate.youtube.officialUploadVerified
  ) {
    add(
      "invalid_youtube_state",
      `${candidate.id}.youtube`,
      "An upload cannot be verified unless YouTube status is confirmed.",
    );
  }

  for (const window of candidate.candidateWindows) {
    if (window.targetCapabilityIds.length === 0) {
      add(
        "missing_capability",
        `${candidate.id}.candidateWindows.${window.id}`,
        "Every proposed window needs a target capability.",
      );
    }

    const hasStart = window.approximateStartMs !== null;
    const hasEnd = window.approximateEndMs !== null;
    if (hasStart !== hasEnd) {
      add(
        "invalid_window",
        `${candidate.id}.candidateWindows.${window.id}`,
        "Approximate timestamps must include both start and end or neither.",
      );
    }

    if (
      hasStart &&
      hasEnd &&
      (window.approximateStartMs! < 0 ||
        window.approximateEndMs! <= window.approximateStartMs! ||
        window.approximateEndMs! > candidate.durationMs)
    ) {
      add(
        "invalid_window",
        `${candidate.id}.candidateWindows.${window.id}`,
        "Candidate window must be a positive range inside the source duration.",
      );
    }

    if (!window.evidenceText.trim()) {
      add(
        "missing_field",
        `${candidate.id}.candidateWindows.${window.id}.evidenceText`,
        "A short discovery-evidence excerpt is required.",
      );
    }
  }

  if (candidate.status === "accepted_for_authoring") {
    if (
      candidate.rights.review !== "human_verified" ||
      candidate.mediaReview !== "human_verified" ||
      candidate.transcript.review !== "human_verified" ||
      candidate.candidateWindows.length === 0 ||
      candidate.candidateWindows.some(
        (window) =>
          window.approximateStartMs === null || window.approximateEndMs === null,
      )
    ) {
      add(
        "invalid_acceptance_state",
        candidate.id,
        "Accepted candidates require verified rights, media, transcript, and exact windows.",
      );
    }
  }

  if (
    candidate.status === "rejected" &&
    !candidate.rejectionReason?.trim()
  ) {
    add(
      "invalid_rejection_state",
      candidate.id,
      "Rejected candidates require a reason.",
    );
  }

  if (
    candidate.status !== "rejected" &&
    candidate.rejectionReason !== null
  ) {
    add(
      "invalid_rejection_state",
      candidate.id,
      "Only rejected candidates may carry a rejection reason.",
    );
  }

  return issues;
}

export function validateSourceCandidateBatch(candidates: readonly SourceCandidate[]) {
  const issues = candidates.flatMap(validateSourceCandidate);
  const seen = new Set<string>();

  for (const candidate of candidates) {
    if (seen.has(candidate.id)) {
      issues.push({
        code: "missing_field",
        path: candidate.id,
        message: "Candidate IDs must be unique.",
      });
    }
    seen.add(candidate.id);
  }

  return issues;
}

export function buildCapabilityCoverage(
  candidates: readonly SourceCandidate[],
): CapabilityCoverage[] {
  const active = candidates.filter((candidate) => candidate.status !== "rejected");

  return FIRST_A0_CAPABILITY_IDS.map((capabilityId) => {
    const relevant = active.filter((candidate) =>
      candidate.candidateWindows.some((window) =>
        window.targetCapabilityIds.includes(capabilityId),
      ),
    );
    const windows = relevant.flatMap((candidate) =>
      candidate.candidateWindows.filter((window) =>
        window.targetCapabilityIds.includes(capabilityId),
      ),
    );
    const speakers = new Set(
      windows
        .map((window) => window.speakerLabel)
        .filter((speaker): speaker is string => Boolean(speaker)),
    );

    const candidateCount = relevant.length;
    return {
      capabilityId,
      candidateCount,
      candidateWindowCount: windows.length,
      confirmedYoutubeCount: relevant.filter(
        (candidate) => candidate.youtube.status === "confirmed",
      ).length,
      distinctSpeakerLabels: speakers.size,
      gap:
        candidateCount === 0
          ? "missing"
          : candidateCount < 3 || speakers.size < 3
            ? "thin"
            : "none",
    };
  });
}
