import type { UnitData } from "@/lib/lessons/lesson-spec";
import { GOLD_MISSION_01 } from "@/lib/missions/gold-mission-01";

const CHUNK_PHONETICS: Record<string, string> = {
  "introduce-name": "/haɪ, aɪm …/",
  "state-role": "/aɪ wɜːrk æz ə …/",
  "ask-name": "/wʌts jɔːr neɪm/",
  "nice-to-meet": "/naɪs tə miːt juː/",
  repeat: "/kʊd juː seɪ ðæt əˈɡen/",
  "did-not-catch": "/ˈsɑːri, aɪ ˈdɪdənt kætʃ ðæt/",
};

const CHUNK_EXAMPLES: Record<string, string> = {
  "introduce-name": "Hi, I'm Minh.",
  "state-role": "I work as a developer.",
  "ask-name": "What's your name?",
  "nice-to-meet": "Nice to meet you.",
  repeat: "Could you say that again?",
  "did-not-catch": "Sorry, I didn't catch that.",
};

/**
 * Minimal source lesson for the first speaking outcome.
 *
 * The legacy A0-1 curriculum remains available for historical reference, but it
 * is deliberately not shipped to MissionRunner. Every learner-facing item here
 * directly supports the mission: introduce yourself, state a role, ask a name,
 * and repair the conversation when you do not hear clearly.
 */
export const GOLD_DAY_ONE_UNIT: UnitData = {
  unitId: GOLD_MISSION_01.lessonId,
  title: `Bài A0-1: ${GOLD_MISSION_01.titleVi}`,
  level: "A0",
  xp: 60,
  estimatedTime: GOLD_MISSION_01.estimatedMinutes,
  description: GOLD_MISSION_01.canDoVi,
  badgeName: "Câu nói đầu tiên",
  badgeEmoji: "🎙️",
  situation: GOLD_MISSION_01.scenarioVi,
  learningOutcomes: [GOLD_MISSION_01.canDoVi],
  culturalNote:
    "Mục tiêu hôm nay không phải học thuộc một danh sách dài. Hãy dùng vài cụm ngắn để duy trì cuộc nói chuyện thật; khi chưa nghe rõ, yêu cầu người đối diện nói lại thay vì đoán.",
  warmupGreetings: GOLD_MISSION_01.targetChunks.slice(0, 3).map((chunk) => ({
    emoji:
      chunk.id === "introduce-name"
        ? "👋"
        : chunk.id === "state-role"
          ? "💼"
          : "❓",
    en: CHUNK_EXAMPLES[chunk.id] ?? chunk.english,
    vn: chunk.vietnamese,
    context: chunk.useWhenVi,
  })),
  vocab: GOLD_MISSION_01.targetChunks.map((chunk, index) => ({
    id: index + 1,
    word: chunk.english,
    phonetic: CHUNK_PHONETICS[chunk.id] ?? "",
    meaning: chunk.vietnamese,
    example: CHUNK_EXAMPLES[chunk.id] ?? chunk.english,
    example2: chunk.useWhenVi,
    collocation: "Cụm hoàn chỉnh dùng trong nhiệm vụ giao tiếp",
    emoji:
      chunk.id === "introduce-name"
        ? "👋"
        : chunk.id === "state-role"
          ? "💼"
          : chunk.id === "ask-name"
            ? "❓"
            : chunk.id === "nice-to-meet"
              ? "🤝"
              : "🔁",
    l1_interference_vn:
      chunk.id === "state-role"
        ? "⚠️ Dùng 'work as a/an + nghề nghiệp': I work as a developer."
        : chunk.id === "did-not-catch"
          ? "⚠️ Đây là cách lịch sự để báo bạn chưa nghe rõ; không cần giả vờ đã hiểu."
          : undefined,
  })),
  dialogues: [
    {
      id: 1,
      title: "Gặp Alex trước cuộc họp",
      audio: "",
      desc: "Một mẫu hội thoại ngắn chứa đúng bốn mục tiêu bắt buộc của nhiệm vụ.",
      lines: [
        {
          id: "gold-day-one-1",
          speaker: "Alex",
          text: "Hi, welcome to the team. What's your name?",
          translation: "Chào, chào mừng bạn đến với nhóm. Bạn tên gì?",
        },
        {
          id: "gold-day-one-2",
          speaker: "Minh",
          text: "Hi, I'm Minh. I work as a developer.",
          translation: "Chào, tôi là Minh. Tôi làm lập trình viên.",
        },
        {
          id: "gold-day-one-3",
          speaker: "Minh",
          text: "What's your name?",
          translation: "Bạn tên gì?",
        },
        {
          id: "gold-day-one-4",
          speaker: "Alex",
          text: "I'm Alex from customer success operations.",
          translation: "Tôi là Alex, thuộc nhóm vận hành chăm sóc khách hàng.",
        },
        {
          id: "gold-day-one-5",
          speaker: "Minh",
          text: "Sorry, I didn't catch that. Could you say that again?",
          translation: "Xin lỗi, tôi chưa nghe rõ. Bạn có thể nói lại không?",
        },
      ],
    },
  ],
  listenAndChoose: GOLD_MISSION_01.checkpoint.questions.map((question) => ({
    id: `listen-${question.id}`,
    audio_text: question.answer,
    options: question.options,
    answer: question.answer,
  })),
  speaking: {
    level1Prompt: "Hi, I'm {input}. I work as a ...",
    level1Placeholder: "Tên và công việc của bạn...",
    level2Situation: GOLD_MISSION_01.scenarioVi,
    level2Hint:
      "Hi, I'm ... / I work as a ... / What's your name? / Could you say that again?",
  },
  quiz: GOLD_MISSION_01.checkpoint.questions.map((question) => ({
    id: `gold-${question.id}`,
    question: question.questionVi,
    options: question.options,
    answer: question.answer,
    explanation_vn: question.explanationVi,
    type: "multiple-choice" as const,
  })),
};
