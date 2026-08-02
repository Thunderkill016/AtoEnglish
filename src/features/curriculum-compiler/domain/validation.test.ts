import { describe, expect, it } from "vitest";

import { FIRST_A0_CAPABILITIES } from "@/features/curriculum-compiler/data/first-a0-capabilities";
import type {
  ClipRole,
  ClipTreatment,
  CommunicationClip,
  CommunicativeCapability,
  CurriculumPackage,
  LearningActivity,
  SourceAsset,
  TranscriptSegment,
} from "@/features/curriculum-compiler/domain/contracts";
import {
  canPublishCurriculum,
  validateCurriculumPackage,
} from "@/features/curriculum-compiler/domain/validation";

const TARGET_CAPABILITY: CommunicativeCapability = {
  id: "a0.request_repetition",
  level: "A0",
  canDoVi: "Tôi có thể yêu cầu người khác nhắc lại khi không nghe rõ.",
  canDoEn: "I can ask someone to repeat when I do not hear clearly.",
  recommendedOrder: 1,
  prerequisiteIds: [],
  communicativeFunctions: ["requesting_repetition"],
  evidencePolicy: {
    requiresComprehension: true,
    requiresProductiveRecall: true,
    requiresInteractionalUse: true,
    requiresDelayedTransfer: true,
    minimumDistinctClips: 3,
    minimumDistinctSpeakers: 3,
  },
};

function createSource(index: number): SourceAsset {
  return {
    id: `source-${index}`,
    provider: "youtube",
    title: `Authorized conversation ${index}`,
    creator: `Creator ${index}`,
    sourceUrl: `https://www.youtube.com/watch?v=authorized-${index}`,
    mediaUrl: `https://www.youtube.com/embed/authorized-${index}`,
    mediaAccess: "youtube_embed",
    durationMs: 20_000,
    language: "en",
    rights: {
      basis: "written_permission",
      status: "human_verified",
      evidenceUrl: `https://example.com/rights/source-${index}`,
      reviewedBy: "content-editor",
      reviewedAt: "2026-08-02T06:00:00.000Z",
      attribution: `Authorized conversation ${index} by Creator ${index}`,
      requiresAttribution: true,
      allowedUses: {
        canEmbed: true,
        canStoreTranscript: true,
        canRunAsr: true,
        canCreateDerivedLesson: true,
        canSelfHostMedia: false,
        canUseCommercially: true,
      },
    },
    transcriptProvenance: "creator_provided",
    transcriptSourceUrl: `https://example.com/transcripts/source-${index}`,
    publicationStatus: "pilot",
  };
}

function createSegment(index: number): TranscriptSegment {
  return {
    id: `segment-${index}`,
    sourceAssetId: `source-${index}`,
    speakerId: `speaker-${index}`,
    startMs: 1_000,
    endMs: 5_000,
    sourceText: "Sorry, could you say that again?",
    displayText: "Sorry, could you say that again?",
    translationVi: "Xin lỗi, bạn có thể nói lại được không?",
    transcriptStatus: "human_verified",
    translationStatus: "human_verified",
  };
}

function createClip(index: number): CommunicationClip {
  return {
    id: `clip-${index}`,
    sourceAssetId: `source-${index}`,
    segmentIds: [`segment-${index}`],
    startMs: 1_000,
    endMs: 5_000,
    primaryCapabilityId: TARGET_CAPABILITY.id,
    secondaryCapabilityIds: [],
    lexicalItems: ["say that again"],
    grammarPatterns: ["Could you + verb"],
    speechFeatures: ["linking", "weak_forms"],
    context: {
      relationship: "coworkers",
      setting: "workplace",
      formality: "neutral",
      channel: "in_person",
    },
    reviewStatus: "human_verified",
    publicationStatus: "pilot",
  };
}

function createActivities(index: number, role: ClipRole): LearningActivity[] {
  const evidenceSegmentIds = [`segment-${index}`];
  const targetItems = ["Could you say that again?"];

  return [
    {
      id: `activity-${index}-gist`,
      layer: "comprehension",
      kind: "gist_choice",
      promptVi: "Người nói đang yêu cầu điều gì?",
      evidenceSegmentIds,
      targetItems,
      requiresRetrieval: false,
      requiresLearnerProduction: false,
      exposesFullAnswer: false,
      changedContext: false,
      unseenInput: false,
    },
    {
      id: `activity-${index}-recall`,
      layer: "acquisition",
      kind: "productive_recall",
      promptVi: "Không nhìn mẫu, hãy yêu cầu người đối diện nói lại.",
      evidenceSegmentIds,
      targetItems,
      requiresRetrieval: true,
      requiresLearnerProduction: true,
      exposesFullAnswer: false,
      changedContext: false,
      unseenInput: false,
    },
    {
      id: `activity-${index}-transfer`,
      layer: "transfer",
      kind:
        role === "interaction"
          ? "multi_turn_interaction"
          : role === "cold_transfer"
            ? "unseen_speaker_response"
            : "personal_response",
      promptVi: "Phản hồi phù hợp trong tình huống mới.",
      evidenceSegmentIds,
      targetItems,
      requiresRetrieval: true,
      requiresLearnerProduction: true,
      exposesFullAnswer: false,
      changedContext: true,
      unseenInput: role === "cold_transfer",
    },
  ];
}

function createTreatment(index: number, role: ClipRole): ClipTreatment {
  return {
    id: `treatment-${index}`,
    clipId: `clip-${index}`,
    level: "A0",
    targetCapabilityId: TARGET_CAPABILITY.id,
    requiredCapabilityIds: [],
    role,
    learnerChoice: {
      titleVi: `Yêu cầu nhắc lại ${index}`,
      summaryVi: "Luyện phản ứng khi nghe không rõ với một người nói khác.",
      difficulty: role === "cold_transfer" ? "stretch" : "core",
      estimatedMinutes: 8,
      accentTags: [`speaker-${index}`],
      topicTags: ["repair", "workplace"],
    },
    activities: createActivities(index, role),
    supportPolicy: {
      initialCaption: role === "anchor" ? "bilingual" : "none",
      finalAttemptCaption: "none",
      allowSlowPlayback: true,
      scaffoldOrder: [
        "replay",
        "context_hint",
        "keyword_hint",
        "english_caption",
        "chunking",
        "vietnamese_meaning",
        "slow_playback",
      ],
    },
    reviewStatus: "human_verified",
    publicationStatus: "pilot",
  };
}

function createValidCurriculum(): CurriculumPackage {
  const roles: ClipRole[] = ["anchor", "interaction", "cold_transfer"];

  return {
    id: "a0-repair-pilot",
    version: "1.0.0",
    titleVi: "Yêu cầu người khác nhắc lại",
    capabilities: [structuredClone(TARGET_CAPABILITY)],
    sourceAssets: roles.map((_, index) => createSource(index + 1)),
    transcriptSegments: roles.map((_, index) => createSegment(index + 1)),
    clips: roles.map((_, index) => createClip(index + 1)),
    treatments: roles.map((role, index) => createTreatment(index + 1, role)),
    publicationStatus: "pilot",
  };
}

function validationCodes(curriculum: CurriculumPackage) {
  return validateCurriculumPackage(curriculum).map((issue) => issue.code);
}

describe("Curriculum compiler publication gates", () => {
  it("accepts a reviewed clip set with rights, three learning layers and varied transfer", () => {
    const curriculum = createValidCurriculum();

    expect(validateCurriculumPackage(curriculum)).toEqual([]);
    expect(canPublishCurriculum(curriculum)).toBe(true);
  });

  it("blocks learner-facing content when source rights are not human verified", () => {
    const curriculum = createValidCurriculum();
    curriculum.sourceAssets[0].rights.status = "needs_permission";
    curriculum.sourceAssets[0].rights.allowedUses.canCreateDerivedLesson = false;

    expect(validationCodes(curriculum)).toContain("invalid_rights");
    expect(canPublishCurriculum(curriculum)).toBe(false);
  });

  it("blocks learner-facing content when transcript or translation review is incomplete", () => {
    const curriculum = createValidCurriculum();
    curriculum.transcriptSegments[0].transcriptStatus = "machine_draft";
    curriculum.transcriptSegments[0].translationStatus = "editor_reviewed";

    expect(validationCodes(curriculum)).toContain("missing_human_review");
  });

  it("requires comprehension, acquisition and transfer in every treatment", () => {
    const curriculum = createValidCurriculum();
    curriculum.treatments[0].activities = curriculum.treatments[0].activities.filter(
      (activity) => activity.layer !== "transfer",
    );

    const codes = validationCodes(curriculum);
    expect(codes).toContain("missing_activity_layer");
    expect(codes).toContain("invalid_transfer");
  });

  it("rejects transfer that reveals the answer and does not change the situation", () => {
    const curriculum = createValidCurriculum();
    const transfer = curriculum.treatments[0].activities.find(
      (activity) => activity.layer === "transfer",
    );

    expect(transfer).toBeDefined();
    if (!transfer) throw new Error("Expected transfer activity");

    transfer.exposesFullAnswer = true;
    transfer.changedContext = false;
    transfer.unseenInput = false;

    expect(validationCodes(curriculum)).toContain("invalid_transfer");
  });

  it("rejects prerequisite cycles while keeping editorial order separate", () => {
    const capabilities = structuredClone(FIRST_A0_CAPABILITIES);
    const greeting = capabilities.find(
      (capability) => capability.id === "a0.greet_someone",
    );
    const repair = capabilities.find(
      (capability) => capability.id === "a0.request_repetition",
    );

    expect(greeting).toBeDefined();
    expect(repair).toBeDefined();
    if (!greeting || !repair) throw new Error("Missing first A0 capability");

    greeting.prerequisiteIds = [repair.id];
    repair.prerequisiteIds = [greeting.id];

    const curriculum: CurriculumPackage = {
      id: "invalid-graph",
      version: "1.0.0",
      titleVi: "Đồ thị lỗi",
      capabilities,
      sourceAssets: [],
      transcriptSegments: [],
      clips: [],
      treatments: [],
      publicationStatus: "draft",
    };

    expect(validationCodes(curriculum)).toContain("prerequisite_cycle");
  });

  it("blocks clip windows that exceed the source or the 60-second limit", () => {
    const curriculum = createValidCurriculum();
    curriculum.clips[0].endMs = 70_000;

    const codes = validationCodes(curriculum);
    expect(codes).toContain("invalid_duration");
    expect(codes).toContain("segment_outside_source");
  });

  it("requires multiple clips, speakers and a cold-transfer role per capability", () => {
    const curriculum = createValidCurriculum();
    curriculum.treatments = curriculum.treatments.filter(
      (treatment) => treatment.role !== "cold_transfer",
    );

    const codes = validationCodes(curriculum);
    expect(codes).toContain("insufficient_clip_coverage");
    expect(codes).toContain("insufficient_speaker_coverage");
    expect(codes).toContain("missing_clip_role");
  });

  it("defines the first A0 graph as five ordered capabilities without false hard dependencies", () => {
    expect(FIRST_A0_CAPABILITIES.map((capability) => capability.id)).toEqual([
      "a0.greet_someone",
      "a0.say_ones_name",
      "a0.ask_others_name",
      "a0.say_where_from",
      "a0.request_repetition",
    ]);

    const repair = FIRST_A0_CAPABILITIES.find(
      (capability) => capability.id === "a0.request_repetition",
    );
    expect(repair?.recommendedOrder).toBe(5);
    expect(repair?.prerequisiteIds).toEqual([]);

    const draftPackage: CurriculumPackage = {
      id: "first-a0-graph",
      version: "1.0.0",
      titleVi: "Năm năng lực A0 đầu tiên",
      capabilities: structuredClone(FIRST_A0_CAPABILITIES),
      sourceAssets: [],
      transcriptSegments: [],
      clips: [],
      treatments: [],
      publicationStatus: "draft",
    };

    expect(validateCurriculumPackage(draftPackage)).toEqual([]);
  });
});
