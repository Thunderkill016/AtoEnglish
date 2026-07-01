/**
 * Blueprint tham chiếu — cách xây NỘI DUNG + CÁCH HỌC (1 khung duy nhất).
 *
 * Mẫu vàng: src/lib/data/units/unit1.ts
 * Luồng app: src/lib/lessons/learning-flow.ts (IPOR 10 bước)
 * Chuẩn số lượng: src/lib/lessons/content-standard.ts
 *
 * Mọi unit mới / refactor phải map field → section → phase giống blueprint này.
 */

import type { IporPhase } from "./learning-flow";

export const REFERENCE_UNIT_ID = "unit-1";
export const REFERENCE_UNIT_PATH = "src/lib/data/units/unit1.ts";

/** Thứ tự field trong file unit*.ts (cách xây nội dung) */
export const CONTENT_BLOCK_ORDER = [
  "meta",
  "hook",
  "warmup",
  "vocab",
  "grammar",
  "exercises_input",
  "dialogues",
  "fluency",
  "output",
  "review",
] as const;

export type ContentBlockId = (typeof CONTENT_BLOCK_ORDER)[number];

export interface LessonBlueprintBlock {
  id: ContentBlockId;
  /** Field UnitData tương ứng */
  fields: string[];
  /** Section app (learning-flow) */
  sectionIds: number[];
  phase: IporPhase;
  /** Cách học — hành vi người học */
  learnMethodVi: string;
  /** Cách viết nội dung — agent/autopilot */
  authorGuideVi: string;
}

/**
 * Blueprint đầy đủ — nội dung và cách học khớp nhau từng bước.
 * Section IDs khớp LESSON_SECTIONS trong learning-flow.ts.
 */
export const LESSON_BLUEPRINT: readonly LessonBlueprintBlock[] = [
  {
    id: "meta",
    fields: ["unitId", "title", "level", "xp", "estimatedTime", "description", "badgeName", "badgeEmoji"],
    sectionIds: [],
    phase: "input",
    learnMethodVi: "Biết bài học bao lâu, nhận badge gì — đặt kỳ vọng.",
    authorGuideVi: "description = 1 câu lợi ích thực tế cho người Việt.",
  },
  {
    id: "hook",
    fields: ["situation", "learningOutcomes", "culturalNote"],
    sectionIds: [1],
    phase: "input",
    learnMethodVi: "Đọc tình huống + mục tiêu trước khi học từ — biết vì sao học.",
    authorGuideVi:
      "situation = câu hỏi/tình huống cụ thể (không chung chung, ưu tiên job/career cho adult VN). learningOutcomes = 2–5 hành vi đo được. culturalNote = pragmatic Việt↔Anh.",
  },
  {
    id: "warmup",
    fields: ["warmupGreetings"],
    sectionIds: [1],
    phase: "input",
    learnMethodVi: "SRS ôn từ cũ + nghe 3 câu mẫu — kích hoạt prior knowledge.",
    authorGuideVi: "≥3 câu: en, vn, context (tình huống nhỏ).",
  },
  {
    id: "vocab",
    fields: ["vocab"],
    sectionIds: [2],
    phase: "input",
    learnMethodVi: "Active recall: nhìn EN → nhớ VN → lật thẻ. Pre-teach TRƯỚC dialogue.",
    authorGuideVi:
      "8–20 từ GSL/frequency. Mỗi từ: phonetic, meaning, example, audio, l1_interference_vn (A1+ bắt buộc). A2+: example2 + collocation.",
  },
  {
    id: "grammar",
    fields: ["grammar"],
    sectionIds: [3],
    phase: "processing",
    learnMethodVi: "Inductive: nhận mẫu từ ví dụ → quy tắc ngắn → CCQ kiểm tra hiểu.",
    authorGuideVi: "rule <30 từ. vnNote = lỗi L1. ccq 4 đáp án. dialogueExample optional.",
  },
  {
    id: "exercises_input",
    fields: [
      "matchingExercise",
      "scrambleExercises",
      "wordBankExercises",
      "sentenceCorrectionExercises",
      "listenAndArrangeExercises",
      "practiceQuiz",
      "listenAndChoose",
    ],
    sectionIds: [4, 5],
    phase: "processing",
    learnMethodVi: "Luyện tập + nghe chọn — ~80% đúng (flow). Phản hồi ngay khi sai.",
    authorGuideVi: "practiceQuiz + listenAndChoose ≥5. Scramble/wordBank khớp vocab+grammar unit.",
  },
  {
    id: "dialogues",
    fields: ["dialogues", "dialogues_list"],
    sectionIds: [5],
    phase: "input",
    learnMethodVi: "Nghe hội thoại SAU khi đã có vocab coverage 98% (Nation & Webb).",
    authorGuideVi: "≥1 dialogue, lines có translation VN. Chỉ dùng từ đã dạy + grammar unit.",
  },
  {
    id: "fluency",
    fields: ["fluencyDrill", "pronunciationFocus"],
    sectionIds: [10],
    phase: "processing",
    learnMethodVi: "Phản xạ nhanh — đọc/nói câu ngắn trong giới hạn thời gian.",
    authorGuideVi: "fluencyDrill.items ≥5 cặp en/vn. Nation Strand 4 automaticity.",
  },
  {
    id: "output",
    fields: ["practiceTranslate", "shadowingVideoId", "speaking"],
    sectionIds: [9, 6, 7],
    phase: "output",
    learnMethodVi: "Dịch VN→EN → shadowing → nói tự do. Bắt buộc sản xuất (không chỉ đọc).",
    authorGuideVi: "practiceTranslate ≥3 câu trong phạm vi unit. speaking level1+level2 prompts.",
  },
  {
    id: "review",
    fields: ["quiz", "cumulativeReviewQuestions", "readingPassage"],
    sectionIds: [8],
    phase: "review",
    learnMethodVi: "Quiz cuối + ôn tích lũy → seed FSRS. Đọc hiểu củng cố.",
    authorGuideVi: "quiz ≥5. cumulativeReview ≥3 (mục tiêu). readingPassage 4+ câu hỏi.",
  },
] as const;

/** Map section → blueprint blocks (cách học ↔ nội dung) */
export function getBlueprintForSection(sectionId: number): LessonBlueprintBlock[] {
  return LESSON_BLUEPRINT.filter((b) => b.sectionIds.includes(sectionId));
}

export function getBlueprintBlock(id: ContentBlockId): LessonBlueprintBlock | undefined {
  return LESSON_BLUEPRINT.find((b) => b.id === id);
}

/** Checklist ngắn cho autopilot khi sửa/viết unit */
export function formatBlueprintChecklistForAgent(): string {
  return LESSON_BLUEPRINT.map(
    (b, i) =>
      `${i + 1}. [${b.phase.toUpperCase()}] ${b.id}: fields=${b.fields.join(", ")} | học: ${b.learnMethodVi} | viết: ${b.authorGuideVi}`
  ).join("\n");
}