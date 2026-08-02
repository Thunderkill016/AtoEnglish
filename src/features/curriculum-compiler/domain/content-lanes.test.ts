import { describe, expect, it } from "vitest";

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
  canPublishCapabilityLearningBundle,
  type CapabilityLearningBundle,
  type CapabilityLearningSpecification,
  type YouTubeCompanionAsset,
  type YouTubeCompanionUsagePolicy,
  validateCapabilityLearningBundle,
  YOUTUBE_COMPANION_USAGE_POLICY,
} from "@/features/curriculum-compiler/domain/content-lanes";

const CAPABILITY: CommunicativeCapability = {
  id: "a0.request_repetition",
  level: "A0",
  canDoVi: "Tôi có thể yêu cầu người khác nhắc lại khi không nghe rõ.",
  canDoEn: "I can ask someone to repeat when I do not hear clearly.",
  recommendedOrder: 1,
  prerequisiteIds: [],
  communicativeFunctions: ["requesting_repetition", "repairing_misunderstanding"],
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
    title: `Authorized repair conversation ${index}`,
    creator: `Creator ${index}`,
    sourceUrl: `https://www.youtube.com/watch?v=licensed-${index}`,
    mediaUrl: `https://www.youtube.com/embed/licensed-${index}`,
    mediaAccess: "youtube_embed",
    durationMs: 20_000,
    language: "en",
    rights: {
      basis: "written_permission",
      status: "human_verified",
      evidenceUrl: `https://example.com/rights/source-${index}`,
      reviewedBy: "content-editor",
      reviewedAt: "2026-08-02T07:30:00.000Z",
      attribution: `Authorized repair conversation ${index} by Creator ${index}`,
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
    primaryCapabilityId: CAPABILITY.id,
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
    targetCapabilityId: CAPABILITY.id,
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

function createCoreCurriculum(): CurriculumPackage {
  const roles: ClipRole[] = ["anchor", "interaction", "cold_transfer"];
  return {
    id: "a0-repetition-core",
    version: "1.0.0",
    titleVi: "Lõi học yêu cầu nhắc lại",
    capabilities: [structuredClone(CAPABILITY)],
    sourceAssets: roles.map((_, index) => createSource(index + 1)),
    transcriptSegments: roles.map((_, index) => createSegment(index + 1)),
    clips: roles.map((_, index) => createClip(index + 1)),
    treatments: roles.map((role, index) => createTreatment(index + 1, role)),
    publicationStatus: "pilot",
  };
}

function createSpecification(): CapabilityLearningSpecification {
  return {
    capabilityId: CAPABILITY.id,
    knowledge: {
      meaningAndUse: ["Dùng khi không nghe hoặc không hiểu rõ thông tin vừa được nói."],
      formulaicChunks: [
        "Could you say that again?",
        "Sorry, what was that?",
      ],
      grammarPatterns: ["Could you + base verb + object?"],
      speechFeatures: ["Weak form của could và nối âm trong could you."],
      interactionStrategies: [
        "Báo hiệu vấn đề, yêu cầu nhắc lại, nghe lại và xác nhận.",
      ],
      pragmaticsAndRegister: [
        "Mở đầu bằng Sorry để giảm độ trực diện trong ngữ cảnh trung tính.",
      ],
      vietnameseLearnerRisks: [
        "Không chỉ nói Again? trong bối cảnh cần lịch sự hoặc rõ mục đích.",
      ],
    },
    coreTreatmentIds: ["treatment-1", "treatment-2", "treatment-3"],
    companionAssetIds: ["companion-1"],
  };
}

function createCompanion(): YouTubeCompanionAsset {
  return {
    id: "companion-1",
    youtubeVideoId: "abc123DEF45",
    title: "Natural conversation repair example",
    creator: "Example Creator",
    watchUrl: "https://www.youtube.com/watch?v=abc123DEF45",
    embedUrl: "https://www.youtube-nocookie.com/embed/abc123DEF45",
    capabilityIds: [CAPABILITY.id],
    purpose: "speaker_variability",
    accentTags: ["american-english"],
    topicTags: ["repair", "daily-conversation"],
    startSeconds: 20,
    endSeconds: 70,
    embedStatus: "embed_verified",
    usagePolicy: structuredClone(YOUTUBE_COMPANION_USAGE_POLICY),
    activities: [
      {
        id: "companion-activity-1",
        kind: "communicative_intent_spotting",
        promptVi: "Hãy xác định lúc nào một người gặp vấn đề nghe hiểu và họ xử lý ra sao.",
        learningPurpose: "Nhận ra hành vi repair trong một giọng nói và bối cảnh mới.",
        requiresTranscript: false,
        storesSourceText: false,
        contributesToMastery: false,
      },
    ],
    publicationStatus: "pilot",
  };
}

function createBundle(): CapabilityLearningBundle {
  return {
    id: "a0-repetition-bundle",
    version: "1.0.0",
    titleVi: "Yêu cầu người khác nhắc lại",
    coreCurriculum: createCoreCurriculum(),
    capabilitySpecifications: [createSpecification()],
    youtubeCompanions: [createCompanion()],
    publicationStatus: "pilot",
  };
}

function codes(bundle: CapabilityLearningBundle) {
  return validateCapabilityLearningBundle(bundle).map((issue) => issue.code);
}

describe("Two-lane content model", () => {
  it("publishes a complete licensed core with an optional reviewed companion", () => {
    expect(canPublishCapabilityLearningBundle(createBundle())).toBe(true);
  });

  it("publishes a complete licensed core even when no companion is available", () => {
    const bundle = createBundle();
    bundle.youtubeCompanions = [];
    bundle.capabilitySpecifications[0].companionAssetIds = [];

    expect(canPublishCapabilityLearningBundle(bundle)).toBe(true);
  });

  it("does not allow a companion to replace licensed core treatments", () => {
    const bundle = createBundle();
    bundle.coreCurriculum.treatments = [];
    bundle.capabilitySpecifications[0].coreTreatmentIds = [];

    expect(codes(bundle)).toContain("core_curriculum_invalid");
    expect(codes(bundle)).toContain("missing_core_treatment");
  });

  it("requires every knowledge category to be complete", () => {
    const bundle = createBundle();
    bundle.capabilitySpecifications[0].knowledge.interactionStrategies = [];

    expect(codes(bundle)).toContain("incomplete_knowledge_coverage");
  });

  it("rejects a companion policy that stores transcripts or derived media", () => {
    const bundle = createBundle();
    bundle.youtubeCompanions[0].usagePolicy = {
      ...YOUTUBE_COMPANION_USAGE_POLICY,
      canStoreTranscript: true,
    } as unknown as YouTubeCompanionUsagePolicy;

    expect(codes(bundle)).toContain("invalid_companion_policy");
  });

  it("requires an embed check before a companion is learner-facing", () => {
    const bundle = createBundle();
    bundle.youtubeCompanions[0].embedStatus = "unreviewed";

    expect(codes(bundle)).toContain("companion_not_embed_verified");
  });

  it("keeps companion activities transcript-free and outside mastery", () => {
    const bundle = createBundle();
    bundle.youtubeCompanions[0].activities[0] = {
      ...bundle.youtubeCompanions[0].activities[0],
      contributesToMastery: true,
    } as unknown as YouTubeCompanionAsset["activities"][number];

    expect(codes(bundle)).toContain("invalid_companion_activity");
  });
});
