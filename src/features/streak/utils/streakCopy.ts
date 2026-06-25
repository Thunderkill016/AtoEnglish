/**
 * Streak UI copy strings — Part 6 streakCopy.ts from research doc.
 * Maps each StreakStatus + context to display text.
 */

import type { StreakStatus } from "./streakCalculator";

export interface StreakCopy {
  /** Short label shown below the counter */
  label: string;
  /** Longer motivational subtitle */
  subtitle: string;
  /** CTA button text */
  cta: string;
  /** Emoji prefix for the state */
  emoji: string;
}

/**
 * getStreakDisplayCopy — returns UI copy for each streak state.
 * @param status  Current streak status
 * @param streak  Current streak count (days)
 * @param level   User's CEFR level string
 * @param hoursLeft  Hours until VN midnight (for at_risk state)
 */
export function getStreakDisplayCopy(
  status: StreakStatus,
  streak: number,
  level: string,
  hoursLeft?: number
): StreakCopy {
  switch (status) {
    case "zero":
      return {
        emoji: "⭕",
        label: "Chưa có streak",
        subtitle: "Học bài đầu tiên để bắt đầu hành trình!",
        cta: "Bắt đầu streak đầu tiên →",
      };

    case "active":
      if (streak < 3) {
        return {
          emoji: "🔥",
          label: `${streak} ngày`,
          subtitle: "Giữ đà đi! Mỗi ngày 1 bước nhỏ.",
          cta: "Học tiếp →",
        };
      }
      if (streak < 7) {
        return {
          emoji: "🔥",
          label: `${streak} ngày`,
          subtitle: `${7 - streak} ngày nữa để đạt badge "Tuần đầu" ⭐`,
          cta: "Giữ đà →",
        };
      }
      if (streak < 14) {
        return {
          emoji: "🔥",
          label: `${streak} ngày`,
          subtitle: "1 tuần liên tiếp! Não bạn đang hình thành kết nối mới 🧠",
          cta: "Tiếp tục →",
        };
      }
      if (streak < 30) {
        return {
          emoji: "🔥",
          label: `${streak} ngày`,
          subtitle: "2 tuần không bỏ cuộc — thói quen đang hình thành! 💪",
          cta: "Tiếp tục →",
        };
      }
      if (streak < 66) {
        return {
          emoji: "🔥",
          label: `${streak} ngày`,
          subtitle: `Cấp ${level} · ${66 - streak} ngày nữa → thói quen tự động!`,
          cta: "Học hôm nay →",
        };
      }
      if (streak < 100) {
        return {
          emoji: "🔥",
          label: `${streak} ngày`,
          subtitle: "Thói quen đã thành tự động! Bạn đang ở top 5% học viên 🏆",
          cta: "Tiếp tục →",
        };
      }
      return {
        emoji: "👑",
        label: `${streak} ngày`,
        subtitle: "HUYỀN THOẠI! Top 1% người học tiếng Anh 🎓",
        cta: "Tiếp tục →",
      };

    case "at_risk":
      return {
        emoji: "⚠️",
        label: `${streak} ngày — SẮP HẾT!`,
        subtitle: hoursLeft !== undefined
          ? `Còn ${hoursLeft}h để giữ streak. Chỉ 1 bài thôi!`
          : "Streak sắp hết! Học 1 bài ngay.",
        cta: "Cứu streak ngay →",
      };

    case "broken":
      return {
        emoji: "💔",
        label: "Streak bị gián đoạn",
        subtitle: streak > 0
          ? `Streak ${streak} ngày bị mất 😔 Sửa trong 24h (200 XP)`
          : "Streak bị gián đoạn. Bắt đầu lại nào!",
        cta: "Sửa streak (200 XP) →",
      };

    case "frozen":
      return {
        emoji: "❄️",
        label: `${streak} ngày — Đang được bảo vệ`,
        subtitle: "Streak Freeze đã được kích hoạt. Học ngày mai nhé!",
        cta: "Xem bài học →",
      };

    case "comeback":
      return {
        emoji: "🌱",
        label: "Chào mừng trở lại!",
        subtitle: "Bắt đầu streak mới hôm nay. Đừng nản — người giỏi cũng có ngày nghỉ!",
        cta: "Học ngay để bắt đầu streak mới →",
      };

    default:
      return {
        emoji: "🔥",
        label: `${streak} ngày`,
        subtitle: "Tiếp tục học nhé!",
        cta: "Học ngay →",
      };
  }
}

/** Milestone share card text for social sharing */
export function getMilestoneShareText(streak: number, level: string, completedLessons: number): string {
  return `🔥 Tôi vừa đạt ${streak} ngày học tiếng Anh liên tiếp trên AtoEnglish!\nCấp độ: ${level} | Bài học: ${completedLessons}\n➡️ atoenglish.vercel.app`;
}
