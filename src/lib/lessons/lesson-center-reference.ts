/**
 * Tham chiếu thiết kế bài học từ trung tâm / chuẩn quốc tế.
 *
 * Dùng khi redesign unit*.ts — map phương pháp trung tâm → block AtoEnglish.
 * Không thay learning-flow.ts (IPOR 10 bước app); chỉ hướng dẫn VIẾT nội dung.
 *
 * Nguồn chính:
 * - British Council / CELTA: ESA (Engage → Study → Activate)
 * - Cambridge CEFR: can-do statements (= learningOutcomes)
 * - Paul Nation: Four Strands + pre-teach vocab (đã có trong unit1)
 * - Trung tâm VN (Apollo, ILA, BC Vietnam): CLT, tình huống thực, L1 contrast người lớn
 */

import type { ContentBlockId } from "./lesson-blueprint";

export interface CenterSource {
  id: string;
  name: string;
  /** Phương pháp cốt lõi */
  methodVi: string;
  /** URL tài liệu công khai (nếu có) */
  docUrl?: string;
}

/** Nguồn tham chiếu — agent đọc trước khi viết unit */
export const CENTER_SOURCES: readonly CenterSource[] = [
  {
    id: "bc-esa",
    name: "British Council — ESA (Engage / Study / Activate)",
    methodVi:
      "Engage: kích thích + warm-up. Study: ngôn ngữ mục tiêu (từ, mẫu câu, nghe). Activate: dùng tự do trong task giao tiếp.",
    docUrl: "https://www.teachingenglish.org.uk/",
  },
  {
    id: "celta-stages",
    name: "CELTA lesson stages",
    methodVi:
      "Lead-in → Presentation/Clarification → Controlled practice → Freer practice → Feedback. Không dạy grammar trước khi có ngữ cảnh.",
  },
  {
    id: "cambridge-cefr",
    name: "Cambridge CEFR",
    methodVi:
      "Mỗi bài = can-do descriptors đo được (A1…B2). learningOutcomes phải khớp band.",
    docUrl: "https://www.cambridgeenglish.org/exams-and-tests/cefr/",
  },
  {
    id: "nation-strands",
    name: "Paul Nation — Four Strands",
    methodVi:
      "Input có nghĩa + Output có nghĩa + Language-focused + Fluency. Vocab pre-teach trước dialogue.",
  },
  {
    id: "vn-clt",
    name: "Trung tâm VN (Apollo / ILA / BC Vietnam pattern)",
    methodVi:
      "CLT: học để nói được trong tình huống (công sở, du lịch, phỏng vấn). So sánh L1 Việt↔Anh rõ ràng. B1+ gắn TOEIC/IELTS task.",
  },
] as const;

export interface CenterBlockMapping {
  blockId: ContentBlockId;
  esaPhase: "Engage" | "Study" | "Activate" | "Review";
  celtaStage: string;
  centerGuideVi: string;
}

/**
 * Map block nội dung AtoEnglish ↔ giai đoạn trung tâm.
 * Thiết kế lại unit = mỗi block phải đạt guide bên dưới.
 */
export const CENTER_BLOCK_MAPPING: readonly CenterBlockMapping[] = [
  {
    blockId: "hook",
    esaPhase: "Engage",
    celtaStage: "Lead-in",
    centerGuideVi:
      "Giống slide mở đầu lớp BC: 1 tình huống thật + câu hỏi gợi mở. culturalNote = điểm khác biệt VN↔bản ngữ (pragmatic).",
  },
  {
    blockId: "warmup",
    esaPhase: "Engage",
    celtaStage: "Lead-in / activate schemata",
    centerGuideVi:
      "3 mẫu câu ngắn — như warm-up oral trong lớp Apollo: nghe → nhắc lại. Ôn unit trước (SRS).",
  },
  {
    blockId: "vocab",
    esaPhase: "Study",
    celtaStage: "Clarification — lexis",
    centerGuideVi:
      "Presentation lexis BC: IPA + collocation + ví dụ câu. BẮT BUỘC l1_interference_vn (lỗi VN) như correction trong lớp ILA.",
  },
  {
    blockId: "grammar",
    esaPhase: "Study",
    celtaStage: "Clarification — MF(P)",
    centerGuideVi:
      "Inductive CELTA: Meaning từ dialogue → Form (rule ngắn) → Pronunciation/usage. CCQ = concept checking (4 đáp án). vnNote = error correction tiếng Việt.",
  },
  {
    blockId: "exercises_input",
    esaPhase: "Study",
    celtaStage: "Controlled practice",
    centerGuideVi:
      "Gap-fill, matching, listen-and-choose — độ khó ~80% đúng. Distractor gần đúng như đề TOEIC Part 5.",
  },
  {
    blockId: "dialogues",
    esaPhase: "Study",
    celtaStage: "Meaningful input",
    centerGuideVi:
      "Script CLT: hội thoại tự nhiên, có translation. Chỉ từ đã học (98% coverage). Giống listening script BC Skills for Life.",
  },
  {
    blockId: "fluency",
    esaPhase: "Activate",
    celtaStage: "Fluency drill",
    centerGuideVi:
      "Nation strand 4 + drill nói nhanh như fluency activity cuối Study. Câu ngắn, lặp 5+ lần.",
  },
  {
    blockId: "output",
    esaPhase: "Activate",
    celtaStage: "Freer practice + task",
    centerGuideVi:
      "Task-based: dịch VN→EN (controlled production) → shadowing (pronunciation) → speaking level2 (role-play / situational). Bắt buộc SẢN XUẤT lời nói.",
  },
  {
    blockId: "review",
    esaPhase: "Review",
    celtaStage: "Feedback + consolidation",
    centerGuideVi:
      "Exit quiz + cumulative review (spiral curriculum như giáo trình trung tâm 12–24 tuần). readingPassage = skills integration B1+.",
  },
  {
    blockId: "meta",
    esaPhase: "Engage",
    celtaStage: "Aims on board",
    centerGuideVi:
      "description = 1 câu lợi ích (giống 'By the end of this lesson you will…'). XP/badge = động lực gamification, không thay can-do.",
  },
] as const;

/** Can-do pattern theo CEFR band — dùng cho learningOutcomes */
export const CEFR_OUTCOME_PATTERNS: Record<string, string[]> = {
  A0: [
    "Đọc/phát âm được …",
    "Nói được câu đơn giản …",
    "Hiểu và đáp lại …",
  ],
  A1: [
    "Giới thiệu / hỏi thăm về …",
    "Dùng [cấu trúc] trong tình huống hàng ngày",
    "Hiểu hội thoại ngắn về …",
  ],
  A2: [
    "Mô tả [chủ đề] bằng câu đơn và ghép",
    "Hỏi đáp trong tình huống [du lịch/mua sắm/…]",
    "Viết/nói đoạn ngắn về …",
  ],
  B1: [
    "Kể / giải thích quá khứ hoặc kinh nghiệm về …",
    "Thảo luận ý kiến và đưa ra lý do",
    "Dùng [grammar point] trong email/hội thoại công việc",
  ],
  B2: [
    "Thuyết trình / đàm phán / phản biện về …",
    "Dùng cấu trúc nâng cao trong phỏng vấn hoặc báo cáo",
    "Hiểu và tóm tắt văn bản chuyên ngành",
  ],
};

export function getCenterMapping(blockId: ContentBlockId): CenterBlockMapping | undefined {
  return CENTER_BLOCK_MAPPING.find((m) => m.blockId === blockId);
}

/** Checklist thiết kế theo trung tâm — inject autopilot */
export function formatCenterDesignGuideForAgent(): string {
  const sources = CENTER_SOURCES.map((s) => `• ${s.name}: ${s.methodVi}`).join("\n");
  const blocks = CENTER_BLOCK_MAPPING.map(
    (m) =>
      `[${m.esaPhase}/${m.celtaStage}] ${m.blockId}: ${m.centerGuideVi}`
  ).join("\n");
  return `=== THAM CHIẾU TRUNG TÂM (thiết kế nội dung) ===\n${sources}\n\n=== MAP TỪNG BLOCK ===\n${blocks}\n\nMẫu vàng triển khai: unit1.ts (SDL + ESA + L1 VN)`;
}