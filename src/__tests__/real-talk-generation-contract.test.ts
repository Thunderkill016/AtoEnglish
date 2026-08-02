import { describe, expect, it } from "vitest";

import {
  generatedLessonDraftSchema,
  selectConversationWindow,
  validateGeneratedDraftEvidence,
  type GeneratedLessonDraft,
  type SourceTranscriptItem,
} from "@/lib/real-talk/generation-contract";

const source: SourceTranscriptItem[] = [
  { text: "Hi, I'm Maya.", offset: 100, duration: 2 },
  { text: "Nice to meet you. I'm Alex.", offset: 102, duration: 3 },
  { text: "Sorry, could you repeat that again?", offset: 105, duration: 3 },
  { text: "Sure. I said I'm Alex.", offset: 108, duration: 3 },
];

const validDraft: GeneratedLessonDraft = {
  title: "Meeting someone new",
  titleVi: "Làm quen với người mới",
  level: "A1",
  estimatedMinutes: 12,
  canDoStatement: "I can introduce myself and ask for repetition.",
  canDoStatementVi: "Tôi có thể tự giới thiệu và yêu cầu người khác nhắc lại.",
  topics: ["introductions", "listening repair"],
  environment: {
    titleVi: "Gặp một người mới",
    situationVi: "Hai người mới gặp nhau trong một sự kiện cộng đồng.",
    learnerRoleVi: "Người tham dự mới",
    partnerRoleVi: "Một người tham dự khác",
    realWorldGoalVi: "Trao đổi tên và xử lý khi không nghe rõ.",
  },
  speakers: [
    { label: "Speaker A", color: "#60a5fa" },
    { label: "Speaker B", color: "#34d399" },
  ],
  transcript: [
    {
      index: 0,
      speaker: "Speaker A",
      startTime: 100,
      endTime: 102,
      textEn: "Hi, I'm Maya.",
      textVi: "Chào, tôi là Maya.",
    },
    {
      index: 1,
      speaker: "Speaker B",
      startTime: 102,
      endTime: 105,
      textEn: "Nice to meet you. I'm Alex.",
      textVi: "Rất vui được gặp bạn. Tôi là Alex.",
    },
    {
      index: 2,
      speaker: "Speaker A",
      startTime: 105,
      endTime: 108,
      textEn: "Sorry, could you repeat that again?",
      textVi: "Xin lỗi, bạn có thể nhắc lại được không?",
    },
    {
      index: 3,
      speaker: "Speaker B",
      startTime: 108,
      endTime: 111,
      textEn: "Sure. I said I'm Alex.",
      textVi: "Được chứ. Tôi nói tôi là Alex.",
    },
  ],
  communicationEvents: [
    {
      id: "open",
      type: "open_interaction",
      descriptionVi: "Mở đầu và trao đổi tên.",
      segmentIndices: [0, 1],
    },
    {
      id: "repair",
      type: "request_clarification",
      descriptionVi: "Yêu cầu nhắc lại khi không nghe rõ.",
      segmentIndices: [2, 3],
    },
  ],
  preWatch: {
    contextVi: "Bạn sẽ nghe hai người làm quen với nhau.",
    vocabulary: [
      {
        word: "nice to meet you",
        phonetic: "/naɪs tə miːt juː/",
        definition: "A polite phrase used after an introduction.",
        meaningVi: "Rất vui được gặp bạn.",
        contextSentence: "Nice to meet you. I'm Alex.",
        timestamp: 102,
      },
      {
        word: "repeat",
        phonetic: "/rɪˈpiːt/",
        definition: "To say something again.",
        meaningVi: "Nhắc lại.",
        contextSentence: "Sorry, could you repeat that again?",
        timestamp: 105,
      },
      {
        word: "I said",
        phonetic: "/aɪ sed/",
        definition: "Used to restate earlier information.",
        meaningVi: "Tôi đã nói là.",
        contextSentence: "Sure. I said I'm Alex.",
        timestamp: 108,
      },
    ],
    prediction: {
      questionVi: "Hai người sắp làm gì?",
      options: ["Làm quen", "Gọi món", "Hỏi đường"],
      correctIndex: 0,
    },
    soundAlerts: [],
  },
  whileWatch: {
    gistQuestion: {
      questionVi: "Vấn đề chính trong cuộc trò chuyện là gì?",
      options: ["Một người không nghe rõ tên", "Họ đang mua vé", "Họ đang tranh luận"],
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
        timestamp: 105,
        descriptionVi: "Người nói yêu cầu nhắc lại.",
        listenForVi: "Nghe cụm could you repeat.",
      },
    ],
  },
  postWatch: {
    comprehensionQuiz: [
      {
        id: "q1",
        questionVi: "Người thứ hai tên gì?",
        options: ["Alex", "Maya", "Sam"],
        correctIndex: 0,
        explanationVi: "Người thứ hai nói: I'm Alex.",
        evidenceSegmentIndices: [1, 3],
      },
      {
        id: "q2",
        questionVi: "Maya làm gì khi không nghe rõ?",
        options: ["Yêu cầu nhắc lại", "Rời đi", "Đổi chủ đề"],
        correctIndex: 0,
        explanationVi: "Cô ấy dùng cụm could you repeat that again.",
        evidenceSegmentIndices: [2],
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
        timestamp: 102,
        tipVi: "Nối nhẹ to meet.",
        evidenceSegmentIndex: 1,
      },
      {
        id: "s2",
        phrase: "Could you repeat that again",
        meaningVi: "Bạn có thể nhắc lại được không?",
        timestamp: 105,
        tipVi: "Nhấn vào repeat.",
        evidenceSegmentIndex: 2,
      },
    ],
    culturalNotes: [],
  },
  transferTask: {
    situationVi: "Bạn gặp một đồng nghiệp mới ở văn phòng.",
    learnerGoalVi: "Giới thiệu tên và hỏi lại nếu nghe chưa rõ.",
    promptVi: "Hãy phản hồi trong hai lượt, không đọc lại transcript.",
    successCriteriaVi: ["Nói tên của mình", "Dùng một câu yêu cầu nhắc lại"],
    suggestedLanguage: ["Nice to meet you", "Could you repeat that again"],
  },
};

describe("Real Talk generation contract", () => {
  it("accepts a bounded environment-first lesson draft", () => {
    expect(generatedLessonDraftSchema.safeParse(validDraft).success).toBe(true);
    expect(validateGeneratedDraftEvidence(validDraft, source)).toEqual([]);
  });

  it("rejects invented transcript lines even when their timestamps look valid", () => {
    const invalidDraft: GeneratedLessonDraft = {
      ...validDraft,
      transcript: validDraft.transcript.map((segment) =>
        segment.index === 1
          ? {
              ...segment,
              textEn: "Welcome to our advanced negotiation workshop.",
            }
          : segment,
      ),
    };

    expect(validateGeneratedDraftEvidence(invalidDraft, source)).toContain(
      "transcript_missing_source_evidence",
    );
  });

  it("rejects invented speaking phrases that are absent from the source", () => {
    const invalidDraft: GeneratedLessonDraft = {
      ...validDraft,
      postWatch: {
        ...validDraft.postWatch,
        speakingDrills: [
          ...validDraft.postWatch.speakingDrills.slice(0, 1),
          {
            ...validDraft.postWatch.speakingDrills[1],
            phrase: "Would you mind introducing yourself once more?",
          },
        ],
      },
    };

    expect(validateGeneratedDraftEvidence(invalidDraft, source)).toContain(
      "speaking_drill_missing_source_evidence",
    );
  });

  it("selects a dense interaction window instead of always taking the opening", () => {
    const longTranscript: SourceTranscriptItem[] = Array.from(
      { length: 70 },
      (_, index) => ({
        text:
          index >= 45 && index <= 49
            ? [
                "Hi, how are you?",
                "I'm good, thanks. What about you?",
                "Sorry, could you repeat that?",
                "Sure, I said I'm good.",
                "Okay, thanks.",
              ][index - 45]
            : "Background music continues",
        offset: index * 5,
        duration: 4,
      }),
    );

    const selected = selectConversationWindow(longTranscript, {
      maxDurationSeconds: 30,
      maxItems: 6,
    });

    expect(selected.some((item) => item.text.includes("repeat"))).toBe(true);
    expect(selected[0]?.offset).toBeGreaterThan(0);
  });
});
