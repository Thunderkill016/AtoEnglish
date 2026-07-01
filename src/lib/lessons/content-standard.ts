/**
 * Chuẩn nội dung bài học (SDL — Self-Directed Learning).
 * Mọi unit phải đạt trước khi ship. Kiểm tra: curriculum-quality.test.ts + audit-lesson-content.sh
 *
 * Tham chiếu mẫu: src/lib/data/units/unit1.ts
 * Blueprint (nội dung + cách học): src/lib/lessons/lesson-blueprint.ts
 */

export const LESSON_CONTENT_STANDARD = {
  /** Hook đầu bài — bắt buộc mọi unit */
  situationMinChars: 30,
  learningOutcomesMin: 2,
  learningOutcomesMax: 5,
  culturalNoteMinChars: 40,
  warmupGreetingsMin: 3,

  /** Vocab — cognitive load Nation & Webb */
  vocabMin: 8,
  vocabMax: 20,

  /** L1 interference (người Việt) — % từ có ghi chú lỗi thường gặp */
  l1MinRatioByLevel: {
    A0: 0.5,
    A1: 1,
    A2: 1,
    B1: 0.5,
    /** Mục tiêu 0.5 — TASK-058 (B2 L1 >=50% per center-ref VN CLT + §7) */
    B2: 0.5,
  } as Record<string, number>,

  l1NoteMinChars: 15,

  /** Output & review — TASK-153 raise for world-class (Babbel real convos + VN job) */
  fluencyDrillItemsMin: 5,
  /** shadowing via fluency/activate drill target 5+ */
  shadowingMin: 5,
  dialoguesMin: 2,
  /** job focused scenarios target ≥1 per unit (adult VN career needs) */
  jobScenariosMin: 1,
  /** Mục tiêu đạt 3 — TASK-059 (spiral review, Nation + center ref) */
  cumulativeReviewMin: 3,
  /** Mục tiêu 3 — TASK-057 đã nâng: mọi unit ≥3 practiceTranslate */
  practiceTranslateMin: 3,
  listenAndChooseMin: 5,
  finalQuizMin: 5,
} as const;

export interface ContentStandardViolation {
  field: string;
  message: string;
}

export interface UnitLike {
  level: string;
  situation?: string;
  learningOutcomes?: string[];
  culturalNote?: string;
  warmupGreetings?: unknown[];
  vocab?: Array<{ l1_interference_vn?: string }>;
  fluencyDrill?: { items?: unknown[] };
  dialogues?: unknown[];
  cumulativeReviewQuestions?: unknown[];
  practiceTranslate?: unknown[];
  listenAndChoose?: unknown[];
  quiz?: unknown[];
}

export function l1CoverageRatio(unit: UnitLike): number {
  const vocab = unit.vocab ?? [];
  if (vocab.length === 0) return 0;
  const withL1 = vocab.filter(
    (v) => (v.l1_interference_vn?.trim().length ?? 0) >= LESSON_CONTENT_STANDARD.l1NoteMinChars
  ).length;
  return withL1 / vocab.length;
}

export function validateLessonContentStandard(
  unit: UnitLike,
  fileLabel: string
): ContentStandardViolation[] {
  const s = LESSON_CONTENT_STANDARD;
  const violations: ContentStandardViolation[] = [];
  const tag = (field: string, msg: string) =>
    violations.push({ field, message: `${fileLabel}: ${msg}` });

  if (!unit.situation || unit.situation.trim().length < s.situationMinChars) {
    tag("situation", `situation phải ≥ ${s.situationMinChars} ký tự (tình huống thực tế)`);
  }

  const outcomes = unit.learningOutcomes ?? [];
  if (outcomes.length < s.learningOutcomesMin || outcomes.length > s.learningOutcomesMax) {
    tag(
      "learningOutcomes",
      `learningOutcomes phải ${s.learningOutcomesMin}–${s.learningOutcomesMax} mục`
    );
  }

  if (!unit.culturalNote || unit.culturalNote.replace(/<[^>]+>/g, "").trim().length < s.culturalNoteMinChars) {
    tag("culturalNote", `culturalNote phải ≥ ${s.culturalNoteMinChars} ký tự`);
  }

  if ((unit.warmupGreetings?.length ?? 0) < s.warmupGreetingsMin) {
    tag("warmupGreetings", `warmupGreetings phải ≥ ${s.warmupGreetingsMin} câu`);
  }

  const fluencyItems = unit.fluencyDrill?.items?.length ?? 0;
  if (fluencyItems < s.fluencyDrillItemsMin) {
    tag("fluencyDrill", `fluencyDrill.items phải ≥ ${s.fluencyDrillItemsMin}`);
  }

  if ((unit.cumulativeReviewQuestions?.length ?? 0) < s.cumulativeReviewMin) {
    tag("cumulativeReviewQuestions", `cumulativeReviewQuestions phải ≥ ${s.cumulativeReviewMin}`);
  }

  if ((unit.practiceTranslate?.length ?? 0) < s.practiceTranslateMin) {
    tag("practiceTranslate", `practiceTranslate phải ≥ ${s.practiceTranslateMin}`);
  }

  if ((unit.listenAndChoose?.length ?? 0) < s.listenAndChooseMin) {
    tag("listenAndChoose", `listenAndChoose phải ≥ ${s.listenAndChooseMin}`);
  }

  if ((unit.quiz?.length ?? 0) < s.finalQuizMin) {
    tag("quiz", `quiz phải ≥ ${s.finalQuizMin} câu`);
  }

  const dialoguesLen = (unit.dialogues?.length ?? 0);
  if (dialoguesLen < s.dialoguesMin) {
    tag("dialogues", `dialogues phải ≥ ${s.dialoguesMin} (Babbel-like real convos + job)`);
  }

  const minL1 = s.l1MinRatioByLevel[unit.level] ?? 0.5;
  const ratio = l1CoverageRatio(unit);
  if (ratio < minL1) {
    tag(
      "l1_interference_vn",
      `L1 notes ${Math.round(ratio * 100)}% < ${Math.round(minL1 * 100)}% yêu cầu level ${unit.level}`
    );
  }

  return violations;
}