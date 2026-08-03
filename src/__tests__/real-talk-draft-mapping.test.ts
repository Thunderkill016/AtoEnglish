import { describe, expect, it } from "vitest";

import {
  mapPersistedRealTalkDraft,
  mapRealTalkLessonRow,
  mapRealTalkVideoRow,
} from "@/features/real-talk/server/draft-mapping";
import type { AppDatabase } from "@/types/app-database";

type VideoRow =
  AppDatabase["public"]["Tables"]["real_talk_videos"]["Row"];
type LessonRow =
  AppDatabase["public"]["Tables"]["real_talk_lessons"]["Row"];

const videoRow: VideoRow = {
  id: "video-row-id",
  slug: "real-talk-abcdefghijk-a1-owner",
  youtube_id: "abcdefghijk",
  title: "Natural conversation",
  title_vi: "Cuộc trò chuyện tự nhiên",
  channel_name: "Fixture channel",
  channel_url: "https://www.youtube.com/@fixture",
  thumbnail_url: null,
  duration_seconds: 180,
  segment_start: 42,
  segment_end: 96,
  level: "A1",
  topics: ["introductions", "repair"],
  speaker_count: 2,
  speakers: [
    { label: "Speaker A", color: "#60a5fa" },
    { label: "Speaker B", color: "#34d399" },
  ],
  created_by: "11111111-2222-4333-8444-555555555555",
  is_public: false,
  transcript_acquisition_mode: "experimental_unofficial",
  transcript_review_status: "unreviewed",
  transcript_source_metadata: {
    adapterId: "youtube-transcript-unofficial-v1",
    acquisitionMode: "experimental_unofficial",
    trust: "experimental",
  },
  transcript_cue_digest: null,
  created_at: "2026-08-02T12:00:00.000Z",
};

const environment = {
  titleVi: "Gặp đồng nghiệp mới",
  situationVi: "Hai người gặp nhau tại văn phòng.",
  learnerRoleVi: "Nhân viên mới",
  partnerRoleVi: "Đồng nghiệp",
  realWorldGoalVi: "Trao đổi tên và hỏi lại khi nghe chưa rõ.",
};

const communicationEvents = [
  {
    id: "open",
    type: "open_interaction",
    descriptionVi: "Mở đầu cuộc trò chuyện.",
    segmentIndices: [0, 1],
  },
  {
    id: "repair",
    type: "request_clarification",
    descriptionVi: "Yêu cầu nhắc lại.",
    segmentIndices: [2, 3],
  },
];

const transferTask = {
  situationVi: "Bạn gặp một khách hàng mới.",
  learnerGoalVi: "Giới thiệu và xử lý khi nghe sai tên.",
  promptVi: "Phản hồi trong hai lượt.",
  successCriteriaVi: ["Giới thiệu tên", "Yêu cầu nhắc lại"],
  suggestedLanguage: ["Nice to meet you", "Could you repeat that again"],
};

const lessonRow: LessonRow = {
  id: "lesson-row-id",
  video_id: videoRow.id,
  title: "Meeting someone new",
  title_vi: "Làm quen với người mới",
  level: "A1",
  estimated_minutes: 14,
  can_do_statement: "I can introduce myself and ask for repetition.",
  can_do_statement_vi: "Tôi có thể tự giới thiệu và yêu cầu nhắc lại.",
  transcript: [
    {
      index: 0,
      speaker: "Speaker A",
      startTime: 42,
      endTime: 45,
      textEn: "Hi, I'm Maya.",
      textVi: "Chào, tôi là Maya.",
    },
  ],
  pre_watch: {
    contextVi: "Bạn sẽ nghe hai người làm quen.",
    vocabulary: [],
    prediction: {
      questionVi: "Họ làm gì?",
      options: ["Làm quen", "Gọi món"],
      correctIndex: 0,
    },
    soundAlerts: [],
  },
  while_watch: {
    gistQuestion: {
      questionVi: "Ý chính?",
      options: ["Làm quen", "Tranh luận"],
      correctIndex: 0,
    },
    focusPoints: [],
    keyMoments: [],
  },
  post_watch: {
    comprehensionQuiz: [],
    fillInTheBlank: [],
    speakingDrills: [],
    culturalNotes: [],
  },
  environment,
  communication_events: communicationEvents,
  transfer_task: transferTask,
  generation_model: "gemini-test-model",
  generation_status: "human_reviewed",
  generation_warnings: [
    "Speaker labels cần kiểm tra.",
    17,
    null,
    "Bản dịch cần biên tập.",
  ],
  reviewed_at: "2026-08-02T13:00:00.000Z",
  reviewed_by: "99999999-8888-4777-8666-555555555555",
  created_at: "2026-08-02T12:30:00.000Z",
};

describe("Real Talk persisted draft mapping", () => {
  it("maps the persisted video source and bounded segment", () => {
    const video = mapRealTalkVideoRow(videoRow);

    expect(video).toMatchObject({
      id: videoRow.slug,
      youtubeId: "abcdefghijk",
      level: "A1",
      segment: { startSeconds: 42, endSeconds: 96 },
      source: {
        watchUrl: "https://www.youtube.com/watch?v=abcdefghijk",
        metadataSource: "youtube_oembed",
        transcriptSource: "youtube_caption",
      },
    });
    expect(video.thumbnailUrl).toBe(
      "https://i.ytimg.com/vi/abcdefghijk/hqdefault.jpg",
    );
  });

  it("preserves environment, events, transfer, model, status, and safe warnings on reload", () => {
    const mapped = mapPersistedRealTalkDraft(videoRow, lessonRow);

    expect(mapped.lesson.environment).toEqual(environment);
    expect(mapped.lesson.communicationEvents).toEqual(communicationEvents);
    expect(mapped.lesson.transferTask).toEqual(transferTask);
    expect(mapped.lesson.generation).toEqual({
      status: "human_reviewed",
      model: "gemini-test-model",
      generatedAt: lessonRow.created_at,
      persistence: "saved_private_draft",
      warnings: [
        "Speaker labels cần kiểm tra.",
        "Bản dịch cần biên tập.",
      ],
    });
  });

  it("falls back conservatively for unknown level and generation status", () => {
    const video = mapRealTalkVideoRow({ ...videoRow, level: "C9" });
    const lesson = mapRealTalkLessonRow(video, {
      ...lessonRow,
      level: "C9",
      generation_status: "published_without_review",
    });

    expect(video.level).toBe("A1");
    expect(lesson.level).toBe("A1");
    expect(lesson.generation?.status).toBe("ai_draft");
  });
});
