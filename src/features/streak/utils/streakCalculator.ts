/**
 * Streak Calculator — Pure functions (fully testable, no side effects)
 *
 * All date logic uses Vietnam timezone (UTC+7).
 * Research: Habit automaticity at 66 days (Lally, UCL).
 * Design: Minimum streak activity = 1 flashcard OR 1 lesson item.
 */

export type StreakStatus =
  | "zero"          // No streak yet / reset after 7+ day absence
  | "active"        // Studied today, streak 1-6 days
  | "growing"       // Studied today, streak 7+ days (identity phase)
  | "at_risk"       // Haven't studied, within 4h of VN midnight
  | "broken"        // Just missed midnight (show for current session)
  | "frozen"        // Streak freeze active today
  | "comeback";     // Returning after 3-14 day absence (streak = 0)

export interface StreakState {
  status: StreakStatus;
  current: number;
  best: number;
  freezesAvailable: number;
  /** Hours remaining until VN midnight (0-24) */
  hoursUntilMidnight: number;
  /** Whether today counts as "studied" */
  studiedToday: boolean;
  /** Days since last study session */
  daysSinceLastStudy: number;
  /** If true, show milestone celebration */
  isMilestoneDay: boolean;
  milestone?: number;
}

/** Milestones that trigger celebration — Day 66 is the UCL automaticity threshold */
export const STREAK_MILESTONES = [3, 7, 14, 30, 66, 100, 365] as const;

/** Returns "today" as YYYY-MM-DD string in Vietnam timezone (UTC+7) */
export function getTodayVN(): string {
  return new Date(Date.now() + 7 * 3600_000)
    .toISOString()
    .slice(0, 10);
}

/** Returns hours remaining until VN midnight */
export function getHoursUntilVNMidnight(): number {
  const nowVN = new Date(Date.now() + 7 * 3600_000);
  const hoursUsed = nowVN.getUTCHours() + nowVN.getUTCMinutes() / 60;
  return Math.max(0, 24 - hoursUsed);
}

/** Returns days between two YYYY-MM-DD strings */
export function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA + "T12:00:00Z");
  const b = new Date(dateB + "T12:00:00Z");
  return Math.round(Math.abs(a.getTime() - b.getTime()) / 86_400_000);
}

/**
 * Core function: compute current streak status from DB data.
 * Called on every page load and after every lesson/card review.
 */
export function computeStreakStatus(params: {
  streak: number;
  lastActiveDate: string | null;
  freezeCount: number;
  bestStreak: number;
}): StreakState {
  const { streak, lastActiveDate, freezeCount, bestStreak } = params;

  const todayVN = getTodayVN();
  const hoursUntilMidnight = getHoursUntilVNMidnight();

  // No history at all
  if (!lastActiveDate) {
    return {
      status: "zero",
      current: 0,
      best: bestStreak,
      freezesAvailable: freezeCount,
      hoursUntilMidnight,
      studiedToday: false,
      daysSinceLastStudy: 999,
      isMilestoneDay: false,
    };
  }

  const daysSince = daysBetween(lastActiveDate, todayVN);
  const studiedToday = lastActiveDate === todayVN;

  // Studied today — determine active vs at_risk vs milestone
  if (studiedToday) {
    const milestone = STREAK_MILESTONES.find(m => m === streak);
    return {
      status: streak >= 7 ? "growing" : "active",
      current: streak,
      best: bestStreak,
      freezesAvailable: freezeCount,
      hoursUntilMidnight,
      studiedToday: true,
      daysSinceLastStudy: 0,
      isMilestoneDay: !!milestone,
      milestone,
    };
  }

  // Yesterday → at risk (if within 4h of midnight) or active (plenty of time)
  if (daysSince === 1) {
    // Check if freeze is available and was last active yesterday → freeze auto-protected?
    // Freeze must be manually activated (per design decision)
    if (hoursUntilMidnight <= 4) {
      return {
        status: "at_risk",
        current: streak,
        best: bestStreak,
        freezesAvailable: freezeCount,
        hoursUntilMidnight,
        studiedToday: false,
        daysSinceLastStudy: 1,
        isMilestoneDay: false,
      };
    }
    // Still plenty of time today
    return {
      status: streak >= 7 ? "growing" : "active",
      current: streak,
      best: bestStreak,
      freezesAvailable: freezeCount,
      hoursUntilMidnight,
      studiedToday: false,
      daysSinceLastStudy: 1,
      isMilestoneDay: false,
    };
  }

  // Missed 2+ days → streak broken or comeback
  if (daysSince >= 2) {
    // 3-14 days: comeback opportunity
    if (daysSince >= 3 && daysSince <= 14) {
      return {
        status: "comeback",
        current: 0, // streak is 0 after breaking
        best: bestStreak,
        freezesAvailable: freezeCount,
        hoursUntilMidnight,
        studiedToday: false,
        daysSinceLastStudy: daysSince,
        isMilestoneDay: false,
      };
    }
    // 15+ days or long absence → zero
    return {
      status: daysSince === 2 ? "broken" : "zero",
      current: 0,
      best: bestStreak,
      freezesAvailable: freezeCount,
      hoursUntilMidnight,
      studiedToday: false,
      daysSinceLastStudy: daysSince,
      isMilestoneDay: false,
    };
  }

  // Default fallback
  return {
    status: "zero",
    current: 0,
    best: bestStreak,
    freezesAvailable: freezeCount,
    hoursUntilMidnight,
    studiedToday: false,
    daysSinceLastStudy: daysSince,
    isMilestoneDay: false,
  };
}

/** Milestone reward config — XP bonus + freezes granted */
export const MILESTONE_REWARDS: Record<number, { xpBonus: number; freezes: number; title: string; emoji: string }> = {
  3:   { xpBonus: 50,   freezes: 0, title: "Khởi đầu",         emoji: "🌱" },
  7:   { xpBonus: 100,  freezes: 1, title: "Tuần đầu",          emoji: "⭐" },
  14:  { xpBonus: 200,  freezes: 0, title: "Hai tuần kiên trì", emoji: "💪" },
  30:  { xpBonus: 500,  freezes: 2, title: "Một tháng",         emoji: "🏆" },
  66:  { xpBonus: 800,  freezes: 3, title: "Thói quen thật sự", emoji: "🧠" },
  100: { xpBonus: 2000, freezes: 3, title: "Huyền thoại",       emoji: "👑" },
  365: { xpBonus: 5000, freezes: 5, title: "Một năm học",       emoji: "🎓" },
};

/** Copy library for streak notifications — research-backed tones */
export function getStreakCopy(status: StreakStatus, streak: number, level: string, hoursLeft?: number): {
  title: string;
  body: string;
} {
  switch (status) {
    case "at_risk":
      if ((hoursLeft ?? 4) <= 1) {
        return {
          title: `🚨 Streak ${streak} ngày — còn 1 tiếng!`,
          body: "Chỉ cần ôn 5 flashcard — 2 phút thôi. Đừng để mất streak này!",
        };
      }
      return {
        title: `⚠️ Streak ${streak} ngày sắp hết!`,
        body: `Còn ${hoursLeft?.toFixed(0)}h nữa là sang ngày mới. Học 1 bài để giữ streak nhé!`,
      };

    case "broken":
      return {
        title: `💔 Streak ${streak > 0 ? streak : "của bạn"} bị gián đoạn`,
        body: "Đừng nản! Bắt đầu streak mới hôm nay — ngày 1 là ngày quan trọng nhất.",
      };

    case "comeback":
      return {
        title: "👋 Chào mừng trở lại!",
        body: `Lâu rồi không học! Bắt đầu streak mới từ hôm nay. Cấp ${level} đang chờ bạn.`,
      };

    case "growing":
      return {
        title: `🔥 ${streak} ngày streak!`,
        body: "Bạn đang cực kỳ consistent. Tiếp tục hôm nay để giữ momentum!",
      };

    default:
      return {
        title: "📚 Thời gian học tiếng Anh rồi!",
        body: `Chỉ 10 phút — bắt đầu 1 bài cấp ${level} để giữ thói quen!`,
      };
  }
}
