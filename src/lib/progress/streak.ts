import { getVnDateKey, getVnYesterdayKey } from "@/lib/utils/vn-date";

/** Compute next streak given last active VN date. */
export function computeNextStreak(
  currentStreak: number,
  lastActiveDate: string | null,
  today: string = getVnDateKey(),
  yesterday: string = getVnYesterdayKey(),
): number {
  if (!lastActiveDate) return 1;
  if (lastActiveDate === today) return currentStreak;
  if (lastActiveDate === yesterday) return currentStreak + 1;
  return 1;
}