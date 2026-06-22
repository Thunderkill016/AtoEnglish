import { getSpeakingXp } from "@/lib/constants/xp-rewards";

const VN_TIMEZONE = "Asia/Ho_Chi_Minh";

export function toVnDateKey(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleDateString("sv-SE", { timeZone: VN_TIMEZONE });
}

export function sumLessonXpOnDate(
  rows: Array<{ xp_earned: number | null; completed_at: string }>,
  dateKey: string,
): number {
  return rows.reduce((sum, row) => {
    if (toVnDateKey(row.completed_at) !== dateKey) return sum;
    return sum + (row.xp_earned ?? 0);
  }, 0);
}

export function sumSpeakingXpOnDate(
  rows: Array<{ practice_type: string; created_at: string }>,
  dateKey: string,
): number {
  return rows.reduce((sum, row) => {
    if (toVnDateKey(row.created_at) !== dateKey) return sum;
    return sum + getSpeakingXp(row.practice_type);
  }, 0);
}

export function hasSpeakingOnDate(
  rows: Array<{ created_at: string }>,
  dateKey: string,
): boolean {
  return rows.some((row) => toVnDateKey(row.created_at) === dateKey);
}

export function sumQuizXpOnDate(
  rows: Array<{ xp_earned: number; quiz_date: string }>,
  dateKey: string,
): number {
  return rows.reduce((sum, row) => {
    if (row.quiz_date !== dateKey) return sum;
    return sum + row.xp_earned;
  }, 0);
}