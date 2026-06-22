const VN_TIMEZONE = "Asia/Ho_Chi_Minh";

const VN_DAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"] as const;

/** YYYY-MM-DD in Vietnam timezone (stable localStorage / streak keys). */
export function getVnDateKey(date: Date = new Date()): string {
  return date.toLocaleDateString("sv-SE", { timeZone: VN_TIMEZONE });
}

/** Add/subtract calendar days from a YYYY-MM-DD key. */
export function addVnDays(dateKey: string, deltaDays: number): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const dt = new Date(Date.UTC(year, month - 1, day));
  dt.setUTCDate(dt.getUTCDate() + deltaDays);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Previous calendar day relative to a VN date key (timezone-safe). */
export function getVnYesterdayKey(from: Date = new Date()): string {
  return addVnDays(getVnDateKey(from), -1);
}

/** Weekday label (CN–T7) for a VN calendar date key. */
export function getVnWeekdayLabel(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const dow = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return VN_DAY_LABELS[dow];
}

/** Stable numeric index for daily rotation (word-of-day, etc.). */
export function getVnDayIndex(date: Date = new Date()): number {
  const key = getVnDateKey(date);
  const [year, month, day] = key.split("-").map(Number);
  return year * 1000 + month * 32 + day;
}

/** Whole hours until midnight in Vietnam (for streak countdown). */
export function getHoursUntilVnMidnight(date: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: VN_TIMEZONE,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).formatToParts(date);

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const second = Number(parts.find((p) => p.type === "second")?.value ?? 0);

  const secondsLeft = 24 * 3600 - (hour * 3600 + minute * 60 + second);
  return Math.max(1, Math.ceil(secondsLeft / 3600));
}