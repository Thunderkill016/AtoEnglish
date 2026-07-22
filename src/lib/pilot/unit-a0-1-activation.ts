import type { UnitMetadata } from "@/lib/constants/units";

export const UNIT_A0_1_ID = "unit-a0-1";

export const UNIT_A0_1_ACTIVATION_META: UnitMetadata = {
  id: UNIT_A0_1_ID,
  title: "Unit A0-1: Giới Thiệu Bản Thân Ở Công Việc",
  description:
    "Trong 10–15 phút, luyện nói tên, công việc, công ty, trách nhiệm và cách nhờ người đối diện nói chậm hơn.",
  level: "A0",
  route: "/learn/unit-a0-1",
  xp: 60,
  estimatedTime: 13,
  tags: ["Luyện nói", "Công việc", "5 câu hỏi cơ bản"],
};

export const ACTIVATION_STEPS = [
  { id: "model", label: "Nghe câu mẫu", minutes: 3 },
  { id: "questions", label: "5 câu hỏi", minutes: 3 },
  { id: "survival", label: "Câu cứu nguy", minutes: 2 },
  { id: "build", label: "Tạo bài nói", minutes: 3 },
  { id: "speak", label: "Nói & hoàn thành", minutes: 2 },
] as const;

export const CORE_WORK_LINES = [
  {
    en: "Hello. My name is Minh.",
    vn: "Xin chào. Tên tôi là Minh.",
    focus: "My name is + tên",
  },
  {
    en: "I work as a delivery driver.",
    vn: "Tôi làm tài xế giao hàng.",
    focus: "I work as + nghề nghiệp",
  },
  {
    en: "I work at Ato Delivery.",
    vn: "Tôi làm việc tại Ato Delivery.",
    focus: "I work at + công ty",
  },
  {
    en: "I am responsible for delivering customer orders.",
    vn: "Tôi chịu trách nhiệm giao đơn hàng cho khách.",
    focus: "I am responsible for + nhiệm vụ",
  },
] as const;

export const WORK_QUESTIONS = [
  {
    question: "What is your name?",
    meaning: "Bạn tên là gì?",
    answer: "My name is Minh.",
  },
  {
    question: "What do you do?",
    meaning: "Bạn làm nghề gì?",
    answer: "I work as a delivery driver.",
  },
  {
    question: "Where do you work?",
    meaning: "Bạn làm việc ở đâu?",
    answer: "I work at Ato Delivery.",
  },
  {
    question: "What are you responsible for?",
    meaning: "Bạn chịu trách nhiệm việc gì?",
    answer: "I am responsible for delivering customer orders.",
  },
  {
    question: "Could you spell your name?",
    meaning: "Bạn có thể đánh vần tên không?",
    answer: "M-I-N-H.",
  },
] as const;

export const SURVIVAL_PHRASES = [
  {
    en: "Could you speak more slowly, please?",
    vn: "Bạn có thể nói chậm hơn được không?",
  },
  {
    en: "Could you say that again, please?",
    vn: "Bạn có thể nói lại được không?",
  },
  {
    en: "I do not understand yet.",
    vn: "Tôi vẫn chưa hiểu.",
  },
] as const;

export interface WorkProfile {
  name: string;
  role: string;
  company: string;
  responsibility: string;
}

export const DEFAULT_WORK_PROFILE: WorkProfile = {
  name: "Minh",
  role: "a delivery driver",
  company: "Ato Delivery",
  responsibility: "delivering customer orders",
};

function clean(value: string, fallback: string): string {
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized || fallback;
}

export function buildWorkIntroduction(profile: WorkProfile): string {
  const name = clean(profile.name, DEFAULT_WORK_PROFILE.name);
  const role = clean(profile.role, DEFAULT_WORK_PROFILE.role);
  const company = clean(profile.company, DEFAULT_WORK_PROFILE.company);
  const responsibility = clean(
    profile.responsibility,
    DEFAULT_WORK_PROFILE.responsibility,
  );

  return [
    `Hello. My name is ${name}.`,
    `I work as ${role}.`,
    `I work at ${company}.`,
    `I am responsible for ${responsibility}.`,
  ].join(" ");
}

export const UNIT_A0_1_WORD_OF_DAY = {
  word: "responsible",
  phonetic: "/rɪˈspɑːnsəbəl/",
  meaning_vn: "chịu trách nhiệm",
  example_en: "I am responsible for delivering customer orders.",
  topic: "Giới thiệu công việc",
  level: "A0",
} as const;

export const ACTIVATION_QUIZ = [
  {
    id: "name",
    prompt: "Câu nào có nghĩa: ‘Tên tôi là Minh’ ?",
    options: ["I name Minh.", "My name is Minh.", "Me is Minh."],
    answer: "My name is Minh.",
  },
  {
    id: "role",
    prompt: "Câu nào nói nghề nghiệp đúng?",
    options: [
      "I work as a delivery driver.",
      "I work delivery driver.",
      "I am work a delivery driver.",
    ],
    answer: "I work as a delivery driver.",
  },
  {
    id: "responsibility",
    prompt: "Câu nào nói trách nhiệm công việc đúng?",
    options: [
      "I responsible delivering orders.",
      "I am responsible for delivering orders.",
      "I am responsibility orders.",
    ],
    answer: "I am responsible for delivering orders.",
  },
  {
    id: "slowly",
    prompt: "Khi người đối diện nói quá nhanh, bạn nói gì?",
    options: [
      "Could you speak more slowly, please?",
      "You speak slow now.",
      "Please stop English.",
    ],
    answer: "Could you speak more slowly, please?",
  },
] as const;

export function withPilotUnitOverrides(units: UnitMetadata[]): UnitMetadata[] {
  return units.map((unit) =>
    unit.id === UNIT_A0_1_ID ? UNIT_A0_1_ACTIVATION_META : unit,
  );
}
