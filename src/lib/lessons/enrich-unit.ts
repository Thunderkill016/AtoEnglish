import type { UnitData } from "@/components/learn/UnitTemplate";

/**
 * Ensure every unit shows hook-first UI even if content file lacks SDL fields.
 * Fallback derives from description + vocab themes (minimal, non-destructive).
 */
export function enrichUnitForLearning(unit: UnitData): UnitData {
  if (unit.situation && unit.learningOutcomes?.length) {
    return unit;
  }

  const situation =
    unit.situation ??
    `Bạn sẽ dùng tiếng Anh trong tình huống thực tế: ${unit.description}`;

  const learningOutcomes =
    unit.learningOutcomes?.length
      ? unit.learningOutcomes
      : [
          `Hiểu và dùng ${Math.min(unit.vocab.length, 12)} từ/cụm từ cốt lõi của bài`,
          unit.grammar ? `Áp dụng đúng: ${unit.grammar.title}` : "Nói được câu hoàn chỉnh trong ngữ cảnh",
          "Hoàn thành quiz với ≥ 80% để củng cố FSRS",
        ];

  return { ...unit, situation, learningOutcomes };
}