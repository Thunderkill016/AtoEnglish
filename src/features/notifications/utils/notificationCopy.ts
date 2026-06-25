/**
 * Notification copy library — Part 3.2 of streak_notification_research.md
 * All push/in-app notification titles and bodies in Vietnamese.
 * Tone: warm friend, not alarm or commercial spam.
 */

export type NotificationCopyKey =
  | "daily_reminder_gentle"
  | "streak_at_risk"
  | "streak_at_risk_final"
  | "streak_broken"
  | "streak_milestone_3"
  | "streak_milestone_7"
  | "streak_milestone_14"
  | "streak_milestone_30"
  | "streak_milestone_100"
  | "streak_milestone_365"
  | "comeback_3days"
  | "comeback_7days"
  | "lesson_complete_next"
  | "weekly_progress_report"
  | "freeze_consumed"
  | "cards_due_reminder";

export interface NotificationCopy {
  title: string;
  body: string;
  cta: string;
  tone: "encouraging" | "urgent" | "empathetic" | "celebratory" | "informational";
  url?: string;
}

type CopyBuilder = (vars: Record<string, string | number>) => NotificationCopy;

export const NOTIFICATION_COPY: Record<NotificationCopyKey, CopyBuilder> = {
  // ── Daily gentle reminder (>6h before midnight) ───────────────────────────
  daily_reminder_gentle: ({ level, streak }) => ({
    title: "📚 Thời gian học tiếng Anh rồi!",
    body: `Bạn đang ở cấp ${level}. Chỉ 10 phút để tiến thêm một bước!${streak ? ` 🔥 ${streak} ngày streak đang chờ bạn.` : ""}`,
    cta: "Học ngay",
    tone: "encouraging",
    url: "/dashboard",
  }),

  // ── Streak at risk (≤4h before midnight) ─────────────────────────────────
  streak_at_risk: ({ streak, hours }) => ({
    title: `⚠️ Streak ${streak} ngày sắp hết!`,
    body: `Còn ${hours}h nữa là sang ngày mới. Học 1 bài để giữ streak nhé!`,
    cta: "Cứu streak ngay",
    tone: "urgent",
    url: "/dashboard",
  }),

  // ── Final urgent (≤1.5h before midnight) ─────────────────────────────────
  streak_at_risk_final: ({ streak }) => ({
    title: `🚨 Streak ${streak} ngày — còn 1 tiếng!`,
    body: "Chỉ cần ôn 5 flashcard — 2 phút thôi. Đừng để mất streak này!",
    cta: "Ôn flashcard ngay",
    tone: "urgent",
    url: "/flashcards",
  }),

  // ── Streak broken (morning after) ─────────────────────────────────────────
  streak_broken: ({ streak }) => ({
    title: `💔 Streak ${streak} ngày bị gián đoạn`,
    body: "Đừng nản! Bạn có thể sửa streak trong 24h với 200 XP. Hoặc bắt đầu mới!",
    cta: "Sửa streak ngay",
    tone: "empathetic",
    url: "/dashboard",
  }),

  // ── Milestones ─────────────────────────────────────────────────────────────
  streak_milestone_3: () => ({
    title: "🌱 3 NGÀY LIÊN TIẾP!",
    body: "Tuyệt vời! Bạn đang xây dựng thói quen học tập. +50 XP bonus!",
    cta: "Xem huy hiệu",
    tone: "celebratory",
    url: "/progress",
  }),

  streak_milestone_7: () => ({
    title: "⭐ 7 NGÀY LIÊN TIẾP!",
    body: "Bạn vừa đạt streak 7 ngày! Nhận 1 Streak Freeze như phần thưởng 🎉 +100 XP",
    cta: "Xem huy hiệu",
    tone: "celebratory",
    url: "/progress",
  }),

  streak_milestone_14: () => ({
    title: "💪 2 TUẦN KIÊN TRÌ!",
    body: "14 ngày liên tiếp — não bạn đang hình thành thói quen thật sự! +200 XP",
    cta: "Xem tiến trình",
    tone: "celebratory",
    url: "/progress",
  }),

  streak_milestone_30: () => ({
    title: "🏆 MỘT THÁNG XUẤT SẮC!",
    body: "30 ngày! Bạn đang ở top 5% học viên kiên trì nhất. +500 XP + 2 Freezes 🎊",
    cta: "Chia sẻ thành tích",
    tone: "celebratory",
    url: "/progress",
  }),

  streak_milestone_100: () => ({
    title: "👑 100 NGÀY — HUYỀN THOẠI!",
    body: "Bạn thuộc TOP 1% người học. Thói quen học tiếng Anh đã là một phần của bạn. +2000 XP",
    cta: "Xem hall of fame",
    tone: "celebratory",
    url: "/progress",
  }),

  streak_milestone_365: () => ({
    title: "🎓 MỘT NĂM HỌC TIẾNG ANH!",
    body: "365 ngày liên tiếp. Bạn đã chứng minh điều không thể trở thành có thể. +5000 XP 🎓",
    cta: "Nhận bằng khen",
    tone: "celebratory",
    url: "/progress",
  }),

  // ── Comeback (3-6 day absence) ────────────────────────────────────────────
  comeback_3days: ({ name, cards }) => ({
    title: `👋 Chào mừng trở lại, ${name}!`,
    body: `Lâu rồi không học! Bạn có ${cards} thẻ từ đang chờ ôn. Bắt đầu streak mới nhé?`,
    cta: "Ôn ngay",
    tone: "encouraging",
    url: "/flashcards",
  }),

  // ── Comeback (7-13 day absence) ───────────────────────────────────────────
  comeback_7days: ({ name, days }) => ({
    title: `🌱 ${name} ơi, ${days} ngày rồi đó!`,
    body: "Học viên AtoEnglish học trung bình 15 phút/ngày đã lên cấp. Bắt đầu lại nào!",
    cta: "Quay lại học",
    tone: "encouraging",
    url: "/dashboard",
  }),

  // ── Lesson complete next prompt ────────────────────────────────────────────
  lesson_complete_next: ({ lesson, xp }) => ({
    title: `+${xp} XP! 🎉`,
    body: `Bài ${lesson} hoàn thành! Bài tiếp theo đang chờ...`,
    cta: "Bài tiếp theo →",
    tone: "encouraging",
    url: "/dashboard",
  }),

  // ── Weekly progress report (Monday 8AM) ───────────────────────────────────
  weekly_progress_report: ({ activeDays, streak, lessons, cards }) => ({
    title: `📊 Tuần học của bạn: ${activeDays}/7 ngày`,
    body: `Streak: ${streak}🔥 | ${lessons} bài | ${cards} thẻ. Tuần mới — tiếp tục nhé!`,
    cta: "Xem báo cáo đầy đủ",
    tone: "informational",
    url: "/progress",
  }),

  // ── Freeze consumed (morning after) ───────────────────────────────────────
  freeze_consumed: ({ streak, remaining }) => ({
    title: "❄️ Streak freeze đã được dùng hôm qua",
    body: `Streak ${streak} ngày vẫn an toàn! Còn ${remaining} freeze. Học hôm nay để giữ đà nhé.`,
    cta: "Học ngay",
    tone: "encouraging",
    url: "/dashboard",
  }),

  // ── Cards due reminder ─────────────────────────────────────────────────────
  cards_due_reminder: ({ count, minutes }) => ({
    title: `📚 ${count} thẻ từ đang chờ bạn ôn!`,
    body: `Ôn ${count} thẻ hôm nay để không quên — chỉ ~${minutes} phút thôi.`,
    cta: "Ôn flashcard",
    tone: "encouraging",
    url: "/flashcards",
  }),
};

/** Helper: get copy with variable substitution */
export function getNotificationCopy(
  key: NotificationCopyKey,
  vars: Record<string, string | number> = {}
): NotificationCopy {
  return NOTIFICATION_COPY[key](vars);
}
