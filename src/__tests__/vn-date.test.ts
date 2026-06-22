import { describe, it, expect } from "vitest";

import {
  addVnDays,
  getHoursUntilVnMidnight,
  getVnDateKey,
  getVnYesterdayKey,
  getVnWeekdayLabel,
} from "@/lib/utils/vn-date";

describe("vn-date", () => {
  it("formats date key as YYYY-MM-DD", () => {
    const key = getVnDateKey(new Date("2026-06-21T10:00:00+07:00"));
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("returns positive hours until VN midnight", () => {
    expect(getHoursUntilVnMidnight(new Date("2026-06-21T10:00:00+07:00"))).toBeGreaterThan(0);
    expect(getHoursUntilVnMidnight(new Date("2026-06-21T10:00:00+07:00"))).toBeLessThanOrEqual(24);
  });

  it("subtracts VN calendar days safely", () => {
    expect(getVnYesterdayKey(new Date("2026-06-21T10:00:00+07:00"))).toBe("2026-06-20");
    expect(addVnDays("2026-06-21", -2)).toBe("2026-06-19");
  });

  it("labels weekdays from VN date keys", () => {
    expect(getVnWeekdayLabel("2026-06-21")).toMatch(/^(CN|T2|T3|T4|T5|T6|T7)$/);
  });
});