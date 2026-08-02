import type { RealTalkLesson, RealTalkVideo } from "@/types/real-talk";

export const privateDraftPreviewVideo: RealTalkVideo = {
  id: "private-draft-preview",
  youtubeId: "abcdefghijk",
  title: "Meeting someone new",
  titleVi: "Gặp một người mới",
  channelName: "Controlled fixture",
  channelUrl: "https://www.youtube.com/@fixture",
  thumbnailUrl: "https://i.ytimg.com/vi/abcdefghijk/hqdefault.jpg",
  durationSeconds: 120,
  segment: { startSeconds: 20, endSeconds: 80 },
  level: "A1",
  topics: ["introductions", "clarification"],
  speakerCount: 2,
  speakers: [
    { label: "Speaker A", color: "#60a5fa" },
    { label: "Speaker B", color: "#34d399" },
  ],
  source: {
    watchUrl: "https://www.youtube.com/watch?v=abcdefghijk",
    metadataSource: "youtube_oembed",
    transcriptSource: "youtube_caption",
  },
};

export const privateDraftPreviewLesson: RealTalkLesson = {
  videoId: privateDraftPreviewVideo.id,
  title: "Meeting someone new",
  titleVi: "Làm quen trong một sự kiện cộng đồng",
  level: "A1",
  estimatedMinutes: 12,
  canDoStatement: "I can introduce myself and ask someone to repeat.",
  canDoStatementVi: "Tôi có thể tự giới thiệu và yêu cầu người khác nhắc lại.",
  environment: {
    titleVi: "Gặp người mới tại một sự kiện",
    situationVi: "Hai người tham dự gặp nhau lần đầu trước khi chương trình bắt đầu.",
    learnerRoleVi: "Khách tham dự mới",
    partnerRoleVi: "Một khách tham dự khác",
    realWorldGoalVi: "Trao đổi tên và xử lý khi bạn không nghe rõ.",
  },
  communicationEvents: [
    {
      id: "open",
      type: "open_interaction",
      descriptionVi: "Chào và trao đổi tên.",
      segmentIndices: [0, 1],
    },
    {
      id: "repair",
      type: "request_clarification",
      descriptionVi: "Yêu cầu nhắc lại.",
      segmentIndices: [2, 3],
    },
  ],
  transcript: [
    {
      index: 0,
      speaker: "Speaker A",
      startTime: 20,
      endTime: 22,
      textEn: "Hi, I'm Maya.",
      textVi: "Chào, tôi là Maya.",
    },
    {
      index: 1,
      speaker: "Speaker B",
      startTime: 22,
      endTime: 25,
      textEn: "Nice to meet you. I'm Alex.",
      textVi: "Rất vui được gặp bạn. Tôi là Alex.",
    },
    {
      index: 2,
      speaker: "Speaker A",
      startTime: 25,
      endTime: 28,
      textEn: "Sorry, could you repeat that again?",
      textVi: "Xin lỗi, bạn có thể nhắc lại không?",
    },
    {
      index: 3,
      speaker: "Speaker B",
      startTime: 28,
      endTime: 31,
      textEn: "Sure. I said I'm Alex.",
      textVi: "Được chứ. Tôi nói tôi là Alex.",
    },
  ],
  preWatch: {
    contextVi: "Bạn sẽ nghe hai người mới gặp nhau và xử lý khi một người không nghe rõ tên.",
    vocabulary: [
      {
        word: "nice to meet you",
        phonetic: "/naɪs tə miːt juː/",
        definition: "A polite phrase after an introduction.",
        meaningVi: "Rất vui được gặp bạn.",
        contextSentence: "Nice to meet you. I'm Alex.",
        timestamp: 22,
      },
    ],
    prediction: {
      questionVi: "Hai người sắp làm gì?",
      options: ["Làm quen", "Gọi món"],
      correctIndex: 0,
    },
    soundAlerts: [],
  },
  whileWatch: {
    gistQuestion: {
      questionVi: "Điều gì xảy ra trong cuộc trò chuyện?",
      options: ["Một người yêu cầu nhắc lại", "Họ gọi đồ uống"],
      correctIndex: 0,
    },
    focusPoints: [
      {
        type: "collocation",
        pattern: "Nice to meet you",
        explanationVi: "Cụm lịch sự sau khi biết tên người khác.",
        segmentIndices: [1],
      },
    ],
    keyMoments: [
      {
        timestamp: 25,
        descriptionVi: "Maya yêu cầu nhắc lại.",
        listenForVi: "Nghe cụm could you repeat.",
      },
    ],
  },
  postWatch: {
    comprehensionQuiz: [
      {
        id: "q1",
        questionVi: "Người thứ hai tên gì?",
        options: ["Alex", "Maya"],
        correctIndex: 0,
        explanationVi: "Người thứ hai nói: I'm Alex.",
        evidenceSegmentIndices: [1, 3],
      },
    ],
    fillInTheBlank: [
      {
        id: "f1",
        sentence: "Sorry, could you ___ that again?",
        hintVi: "nhắc lại",
        answer: "repeat",
        evidenceSegmentIndex: 2,
      },
    ],
    speakingDrills: [
      {
        id: "s1",
        phrase: "Nice to meet you",
        meaningVi: "Rất vui được gặp bạn.",
        timestamp: 22,
        tipVi: "Nói liền nhẹ cụm to meet.",
        evidenceSegmentIndex: 1,
      },
      {
        id: "s2",
        phrase: "Could you repeat that again",
        meaningVi: "Bạn có thể nhắc lại không?",
        timestamp: 25,
        tipVi: "Nhấn rõ từ repeat.",
        evidenceSegmentIndex: 2,
      },
    ],
    culturalNotes: [],
  },
  transferTask: {
    situationVi: "Bạn gặp một đồng nghiệp mới trong ngày đầu đi làm.",
    learnerGoalVi: "Tự giới thiệu và hỏi lại khi chưa nghe rõ tên.",
    promptVi: "Viết một phản hồi ngắn bằng tiếng Anh cho người đồng nghiệp mới.",
    successCriteriaVi: [
      "Nói tên của bạn",
      "Dùng một câu lịch sự để yêu cầu nhắc lại",
    ],
    suggestedLanguage: [
      "Nice to meet you",
      "Could you repeat that again",
    ],
  },
  generation: {
    status: "ai_draft",
    model: "gemini-test",
    generatedAt: "2026-08-02T00:00:00.000Z",
    persistence: "saved_private_draft",
    warnings: ["Controlled private preview fixture."],
  },
};
