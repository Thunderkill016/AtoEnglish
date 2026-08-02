import type { CurriculumValidationCode } from "@/features/curriculum-compiler/domain/validation";

export type TraceabilitySourceType =
  | "official_framework"
  | "web_standard"
  | "platform_constraint"
  | "research_evidence"
  | "pilot_hypothesis"
  | "internal_invariant";

export type TraceabilityStrength =
  | "required"
  | "evidence_informed"
  | "experimental";

export const TRACEABILITY_RULE_IDS = [
  "CEFR-ACTION-001",
  "CEFR-ALIGNMENT-001",
  "CEFR-PROGRESSION-001",
  "WCAG-CAPTIONS-001",
  "WEBVTT-TIMING-001",
  "YT-EMBED-001",
  "YT-CAPTIONS-001",
  "RIGHTS-PROVENANCE-001",
  "HUMAN-REVIEW-001",
  "RETRIEVAL-001",
  "TASK-TRANSFER-001",
  "SPEAKER-VARIABILITY-001",
  "CAPTION-SCAFFOLD-001",
  "PILOT-CLIP-WINDOW-001",
  "PILOT-COVERAGE-001",
  "PILOT-CHOICE-001",
  "INTERNAL-INTEGRITY-001",
] as const;

export type TraceabilityRuleId = (typeof TRACEABILITY_RULE_IDS)[number];

export interface TraceabilityRule {
  id: TraceabilityRuleId;
  sourceType: TraceabilitySourceType;
  strength: TraceabilityStrength;
  title: string;
  productInterpretation: string;
  sourceUrls: readonly string[];
}

export const TRACEABILITY_RULES = {
  "CEFR-ACTION-001": {
    id: "CEFR-ACTION-001",
    sourceType: "official_framework",
    strength: "required",
    title: "Action-oriented communicative capability",
    productInterpretation:
      "Curriculum nodes and outcomes describe what the learner can do in communication, not only grammar or content exposure.",
    sourceUrls: [
      "https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-in-the-classroom",
      "https://www.coe.int/en/web/common-european-framework-reference-languages/documents",
    ],
  },
  "CEFR-ALIGNMENT-001": {
    id: "CEFR-ALIGNMENT-001",
    sourceType: "official_framework",
    strength: "required",
    title: "Alignment of objectives, activities, and assessment",
    productInterpretation:
      "A speaking or interaction outcome must be practised and assessed through meaningful learner production, not only recognition questions.",
    sourceUrls: [
      "https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-in-the-classroom",
    ],
  },
  "CEFR-PROGRESSION-001": {
    id: "CEFR-PROGRESSION-001",
    sourceType: "official_framework",
    strength: "required",
    title: "Context-adapted progression",
    productInterpretation:
      "Capability progression is explicit and adapted to AtoEnglish learners; CEFR is a reference framework, not a ready-made syllabus.",
    sourceUrls: [
      "https://www.coe.int/en/web/common-european-framework-reference-languages/uses-and-objectives",
    ],
  },
  "WCAG-CAPTIONS-001": {
    id: "WCAG-CAPTIONS-001",
    sourceType: "web_standard",
    strength: "required",
    title: "Synchronized captions for prerecorded media",
    productInterpretation:
      "Learner-facing prerecorded synchronized media requires accurate, accessible captions and equivalent timed information.",
    sourceUrls: ["https://www.w3.org/TR/WCAG22/#captions-prerecorded"],
  },
  "WEBVTT-TIMING-001": {
    id: "WEBVTT-TIMING-001",
    sourceType: "web_standard",
    strength: "required",
    title: "Timed-text integrity",
    productInterpretation:
      "Caption and transcript cues preserve valid ordered time ranges linked to the underlying media.",
    sourceUrls: ["https://www.w3.org/TR/webvtt1/"],
  },
  "YT-EMBED-001": {
    id: "YT-EMBED-001",
    sourceType: "platform_constraint",
    strength: "required",
    title: "YouTube playback through supported embedding",
    productInterpretation:
      "YouTube sources use the supported IFrame Player model and only capabilities allowed by the platform and source rights.",
    sourceUrls: ["https://developers.google.com/youtube/iframe_api_reference"],
  },
  "YT-CAPTIONS-001": {
    id: "YT-CAPTIONS-001",
    sourceType: "platform_constraint",
    strength: "required",
    title: "YouTube caption access authorization",
    productInterpretation:
      "The product never assumes public videos expose downloadable caption content; official download requires authorization and edit permission.",
    sourceUrls: [
      "https://developers.google.com/youtube/v3/docs/captions/download",
      "https://developers.google.com/youtube/v3/docs/captions/list",
    ],
  },
  "RIGHTS-PROVENANCE-001": {
    id: "RIGHTS-PROVENANCE-001",
    sourceType: "platform_constraint",
    strength: "required",
    title: "Source permission and provenance",
    productInterpretation:
      "Embedding, transcript storage, ASR, derived lessons, self-hosting, and commercial use are reviewed as separate permissions with evidence.",
    sourceUrls: [
      "https://developers.google.com/youtube/terms/api-services-terms-of-service",
      "https://support.google.com/youtube/answer/2797468",
    ],
  },
  "HUMAN-REVIEW-001": {
    id: "HUMAN-REVIEW-001",
    sourceType: "internal_invariant",
    strength: "required",
    title: "Human publication review",
    productInterpretation:
      "Machine-generated rights judgments, transcripts, translations, speaker labels, treatments, and publication decisions remain drafts until human verification.",
    sourceUrls: [
      "https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html",
    ],
  },
  "RETRIEVAL-001": {
    id: "RETRIEVAL-001",
    sourceType: "research_evidence",
    strength: "evidence_informed",
    title: "Productive retrieval rather than repeated exposure alone",
    productInterpretation:
      "Acquisition activities require learners to retrieve usable language without continuously displaying the complete response.",
    sourceUrls: ["https://doi.org/10.1126/science.1199327"],
  },
  "TASK-TRANSFER-001": {
    id: "TASK-TRANSFER-001",
    sourceType: "research_evidence",
    strength: "evidence_informed",
    title: "Task repetition plus changed-task transfer",
    productInterpretation:
      "Practice may repeat a communicative task, but capability evidence also requires changed context, unseen input, or a new interaction.",
    sourceUrls: ["https://doi.org/10.1017/S0272263116000085"],
  },
  "SPEAKER-VARIABILITY-001": {
    id: "SPEAKER-VARIABILITY-001",
    sourceType: "research_evidence",
    strength: "evidence_informed",
    title: "Controlled speaker variability",
    productInterpretation:
      "A capability is encountered across multiple speakers and includes novel-speaker evidence, while variability is introduced progressively.",
    sourceUrls: [
      "https://doi.org/10.1017/S0272263125100879",
      "https://doi.org/10.1044/2021_JSLHR-21-00181",
    ],
  },
  "CAPTION-SCAFFOLD-001": {
    id: "CAPTION-SCAFFOLD-001",
    sourceType: "research_evidence",
    strength: "evidence_informed",
    title: "Captions as adjustable scaffolding",
    productInterpretation:
      "Captions support comprehension and noticing, but final listening and transfer attempts may reduce support to measure independent performance.",
    sourceUrls: [
      "https://doi.org/10.1016/j.system.2013.07.013",
      "https://doi.org/10.1111/lang.12697",
    ],
  },
  "PILOT-CLIP-WINDOW-001": {
    id: "PILOT-CLIP-WINDOW-001",
    sourceType: "pilot_hypothesis",
    strength: "experimental",
    title: "Communication Clip duration of 3–60 seconds",
    productInterpretation:
      "The first pilot constrains clips to 3–60 seconds to control scope and review cost; learner evidence may change this range.",
    sourceUrls: [],
  },
  "PILOT-COVERAGE-001": {
    id: "PILOT-COVERAGE-001",
    sourceType: "pilot_hypothesis",
    strength: "experimental",
    title: "Minimum clip, speaker, and role coverage",
    productInterpretation:
      "The pilot requires multiple clips and speakers plus anchor, interaction, and cold-transfer roles; thresholds must be validated with learners.",
    sourceUrls: [],
  },
  "PILOT-CHOICE-001": {
    id: "PILOT-CHOICE-001",
    sourceType: "pilot_hypothesis",
    strength: "experimental",
    title: "Bounded learner choice",
    productInterpretation:
      "Learners choose among a small reviewed set without bypassing prerequisites; the number and presentation of choices are pilot variables.",
    sourceUrls: [],
  },
  "INTERNAL-INTEGRITY-001": {
    id: "INTERNAL-INTEGRITY-001",
    sourceType: "internal_invariant",
    strength: "required",
    title: "Curriculum package referential integrity",
    productInterpretation:
      "IDs are unique, references resolve, time ranges are valid, segment order is stable, and prerequisite graphs are acyclic.",
    sourceUrls: [],
  },
} satisfies Record<TraceabilityRuleId, TraceabilityRule>;

export const TRACEABILITY_BY_VALIDATION_CODE = {
  missing_field: ["INTERNAL-INTEGRITY-001"],
  duplicate_id: ["INTERNAL-INTEGRITY-001"],
  invalid_url: ["RIGHTS-PROVENANCE-001", "INTERNAL-INTEGRITY-001"],
  invalid_duration: ["PILOT-CLIP-WINDOW-001", "INTERNAL-INTEGRITY-001"],
  invalid_rights: ["RIGHTS-PROVENANCE-001", "YT-CAPTIONS-001"],
  invalid_media_permission: ["RIGHTS-PROVENANCE-001", "YT-EMBED-001"],
  invalid_publication_status: ["HUMAN-REVIEW-001", "INTERNAL-INTEGRITY-001"],
  unknown_reference: ["INTERNAL-INTEGRITY-001"],
  invalid_timestamp: ["WEBVTT-TIMING-001", "INTERNAL-INTEGRITY-001"],
  segment_outside_source: ["WEBVTT-TIMING-001", "INTERNAL-INTEGRITY-001"],
  segment_outside_clip: ["WEBVTT-TIMING-001", "INTERNAL-INTEGRITY-001"],
  segment_order_mismatch: ["WEBVTT-TIMING-001", "INTERNAL-INTEGRITY-001"],
  missing_human_review: ["HUMAN-REVIEW-001", "WCAG-CAPTIONS-001"],
  missing_activity_layer: ["CEFR-ACTION-001", "CEFR-ALIGNMENT-001"],
  missing_retrieval: ["RETRIEVAL-001", "CEFR-ALIGNMENT-001"],
  invalid_transfer: ["TASK-TRANSFER-001", "CEFR-ALIGNMENT-001"],
  invalid_interaction: ["CEFR-ACTION-001", "TASK-TRANSFER-001"],
  invalid_cold_transfer: ["TASK-TRANSFER-001", "SPEAKER-VARIABILITY-001"],
  invalid_scaffold: ["CAPTION-SCAFFOLD-001", "WCAG-CAPTIONS-001"],
  invalid_learner_choice: ["PILOT-CHOICE-001", "CEFR-PROGRESSION-001"],
  prerequisite_cycle: ["CEFR-PROGRESSION-001", "INTERNAL-INTEGRITY-001"],
  missing_prerequisite: ["CEFR-PROGRESSION-001", "INTERNAL-INTEGRITY-001"],
  insufficient_clip_coverage: ["PILOT-COVERAGE-001", "TASK-TRANSFER-001"],
  insufficient_speaker_coverage: [
    "PILOT-COVERAGE-001",
    "SPEAKER-VARIABILITY-001",
  ],
  missing_clip_role: ["PILOT-COVERAGE-001", "TASK-TRANSFER-001"],
} satisfies Record<CurriculumValidationCode, readonly TraceabilityRuleId[]>;

export function getTraceabilityRulesForValidationCode(
  code: CurriculumValidationCode,
): readonly TraceabilityRule[] {
  return TRACEABILITY_BY_VALIDATION_CODE[code].map(
    (ruleId) => TRACEABILITY_RULES[ruleId],
  );
}
