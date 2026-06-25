import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";

/**
 * Daily Streak Reminder Cron — vercel.json: "0 * * * *" (every hour)
 *
 * Strategy (research-backed, Duolingo-inspired):
 * 1. Run hourly — respect each user's preferred notification_hour
 * 2. Skip users who already studied today (lesson OR flashcard review)
 * 3. 7-state urgency system based on streak length + hours until VN midnight
 * 4. Milestone notifications: day 3/7/14/30/66/100 (UCL habit automaticity)
 * 5. At-risk escalation: ≤4h until midnight → "urgent" WebPush urgency level
 * 6. Variable reward: occasional encouragement even for studied-today users (10%)
 *
 * Copy principles (from research):
 * - Loss aversion 2×: "Đừng để X ngày bị reset" > "Học thêm 1 bài"
 * - Future-self framing: "Streak 30 ngày = thói quen tự động"
 * - Tiny habits: "Chỉ 5 phút" — minimal barrier framing
 * - Vietnamese context: warm friend tone, not Duo-guilt
 */

// VAPID config
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY ?? "";
const vapidSubject = process.env.VAPID_SUBJECT ?? "mailto:support@atoenglish.vercel.app";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export const runtime = "nodejs";
export const maxDuration = 60;

// Milestone days (UCL research: 66 days = habit automaticity threshold)
const MILESTONES = new Set([3, 7, 14, 21, 30, 50, 66, 100, 200, 365]);

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!vapidPublicKey || !vapidPrivateKey) {
    return NextResponse.json({ error: "VAPID keys not configured" }, { status: 500 });
  }

  // Current VN time
  const nowVN = new Date(Date.now() + 7 * 3600_000);
  const currentHourVN = nowVN.getUTCHours();
  const currentMinVN = nowVN.getUTCMinutes();
  const todayVN = nowVN.toISOString().slice(0, 10);
  const todayStartUTC = new Date(todayVN + "T00:00:00+07:00").toISOString();

  // Minutes until VN midnight
  const minsUntilMidnight = (23 - currentHourVN) * 60 + (60 - currentMinVN);
  const isAtRisk = minsUntilMidnight <= 240; // ≤4h until midnight = at-risk
  const isUrgent = minsUntilMidnight <= 90;  // ≤1.5h = urgent WebPush priority

  const supabase = await createClient();

  // Fetch subscriptions for users at their preferred hour
  const { data: rows, error } = await supabase
    .from("push_subscriptions")
    .select(`
      user_id,
      endpoint,
      keys,
      user_progress!inner(streak, best_streak, last_active_date, current_level, notification_hour)
    `)
    .eq("user_progress.notification_hour", currentHourVN);

  if (error || !rows?.length) {
    return NextResponse.json({ sent: 0, skipped: 0, hour: currentHourVN, mins_until_midnight: minsUntilMidnight });
  }

  // Batch check: who studied today (lesson or flashcard)?
  const userIds = rows.map((r) => r.user_id);

  const [{ data: studiedToday }, { data: reviewedToday }] = await Promise.all([
    supabase
      .from("user_lesson_progress")
      .select("user_id")
      .in("user_id", userIds)
      .gte("completed_at", todayStartUTC),
    supabase
      .from("card_review_logs")
      .select("user_id")
      .in("user_id", userIds)
      .gte("created_at", todayStartUTC),
  ]);

  const studiedSet = new Set([
    ...(studiedToday ?? []).map((r) => r.user_id),
    ...(reviewedToday ?? []).map((r) => r.user_id),
  ]);

  let sent = 0;
  let skipped = 0;
  const expired: string[] = [];

  // Collect notification log entries to batch-insert after the loop
  const notifLogs: Array<{
    user_id: string;
    type: string;
    title: string;
    body: string;
    url: string;
  }> = [];

  for (const row of rows) {
    // Skip users who already studied today (no nagging)
    // Exception: 10% variable reward chance for encouragement even after studying
    const hasStudied = studiedSet.has(row.user_id);
    if (hasStudied) {
      // 10% variable reward: send "well done" encouragement (Skinner schedule)
      const rollVariableReward = Math.random() < 0.10;
      if (!rollVariableReward) { skipped++; continue; }
    }

    // Type-safe access to joined user_progress
    const progress = Array.isArray(row.user_progress)
      ? row.user_progress[0]
      : row.user_progress;

    const streak = (progress as { streak: number } | null)?.streak ?? 0;
    const bestStreak = (progress as { best_streak?: number } | null)?.best_streak ?? 0;
    const lastActiveDate = (progress as { last_active_date?: string | null } | null)?.last_active_date ?? null;
    const level = (progress as { current_level: string } | null)?.current_level ?? "A0";

    // Determine if streak is "at risk" (last studied = yesterday, has not studied today)
    const yesterdayVN = new Date(nowVN);
    yesterdayVN.setDate(yesterdayVN.getDate() - 1);
    const yesterdayStr = yesterdayVN.toISOString().slice(0, 10);
    const streakAtRisk = !hasStudied && lastActiveDate === yesterdayStr && isAtRisk;

    const { title, body } = hasStudied
      ? buildEncouragementMessage(streak, level)
      : buildMessage(streak, bestStreak, level, streakAtRisk, isUrgent, minsUntilMidnight);

    const subscription: webpush.PushSubscription = {
      endpoint: row.endpoint,
      keys: row.keys as { p256dh: string; auth: string },
    };

    const notifUrl = streakAtRisk ? "/dashboard" : "/dashboard";
    const notifType = hasStudied
      ? "daily_reminder"
      : streakAtRisk
        ? isUrgent ? "streak_at_risk" : "streak_at_risk"
        : "daily_reminder";

    const payload = JSON.stringify({
      title,
      body,
      url: notifUrl,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: "streak-reminder", // Replaces previous notification (no spam)
      renotify: streakAtRisk, // Re-alert only for at-risk
    });

    const urgency: webpush.Urgency = isUrgent && !hasStudied ? "high" : "normal";

    try {
      await webpush.sendNotification(subscription, payload, {
        TTL: isUrgent ? 3600 : 86400,
        urgency,
      });
      sent++;

      // Queue notification log entry
      notifLogs.push({
        user_id: row.user_id,
        type: notifType,
        title,
        body,
        url: notifUrl,
      });
    } catch (err) {
      const code = (err as { statusCode?: number }).statusCode;
      if (code === 410 || code === 404) expired.push(row.endpoint);
    }
  }

  // Batch-insert notification logs (non-blocking, best-effort)
  if (notifLogs.length > 0) {
    await supabase.from("notification_logs").insert(notifLogs);
  }

  // Clean up expired subscriptions (410/404 = endpoint invalidated)
  if (expired.length > 0) {
    await supabase
      .from("push_subscriptions")
      .delete()
      .in("endpoint", expired);
  }

  return NextResponse.json({
    sent,
    skipped,
    expired: expired.length,
    total: rows.length,
    hour: currentHourVN,
    at_risk_mode: isAtRisk,
    urgent_mode: isUrgent,
    mins_until_midnight: minsUntilMidnight,
    timestamp: new Date().toISOString(),
  });
}

// ─── Message builders ─────────────────────────────────────────────────────────

function buildMessage(
  streak: number,
  bestStreak: number,
  level: string,
  atRisk: boolean,
  urgent: boolean,
  minsLeft: number
): { title: string; body: string } {
  const hoursLeft = Math.ceil(minsLeft / 60);

  // ── At-risk escalation (streak exists, hasn't studied, ≤4h until midnight) ──
  if (atRisk && streak >= 1) {
    if (urgent) {
      // ≤1.5h: Maximum urgency — loss aversion at its strongest
      return {
        title: `🚨 Chỉ còn ${hoursLeft}h! Streak ${streak} ngày sắp mất!`,
        body: `Chỉ cần 5 phút — 1 bài học hoặc 5 thẻ từ. Đừng để ${streak} ngày kiên trì bị xóa! ⏰`,
      };
    }
    // ≤4h: Urgency with freeze option
    return {
      title: `⚠️ Streak ${streak} ngày đang nguy hiểm! Còn ${hoursLeft}h`,
      body: `Bạn chưa học hôm nay. Vào học ngay (5 phút) hoặc dùng Streak Freeze để bảo vệ! 🛡️`,
    };
  }

  // ── Milestone celebrations (sent on the day they hit milestone) ──
  if (MILESTONES.has(streak)) {
    if (streak === 66) {
      return {
        title: `🏆 NGÀY 66 — Thói quen đã thành tự động!`,
        body: `Nghiên cứu UCL: 66 ngày = điểm tự động hóa thói quen. Bạn đã đạt được điều này! Tiếp tục học nhé 🧠`,
      };
    }
    if (streak === 30) {
      return {
        title: `🔥 1 tháng kiên trì — Streak ${streak} ngày!`,
        body: `30 ngày liên tiếp! Bạn đang xây dựng thói quen thực sự. Chỉ 36 ngày nữa là thói quen tự động! 💪`,
      };
    }
    if (streak === 7) {
      return {
        title: `⭐ 1 tuần hoàn hảo! Streak ${streak} ngày`,
        body: `7 ngày không bỏ buổi nào! Đây là tuần đầu tiên — cột mốc quan trọng nhất. Giữ vững nhé! 🌟`,
      };
    }
    if (streak === 100) {
      return {
        title: `💯 100 NGÀY — Bạn thuộc TOP 1% người học!`,
        body: `100 ngày streak — bạn đã làm điều mà 99% người dùng không đạt được. Tiếp tục chinh phục nhé! 🎯`,
      };
    }
    return {
      title: `🎉 Streak ${streak} ngày — Mốc mới!`,
      body: `Chúc mừng cột mốc ${streak} ngày! Học thêm hôm nay để tiếp tục chuỗi thành công nhé 🔥`,
    };
  }

  // ── Standard messages by streak length ──

  // High streak (≥30): Identity-level messaging
  if (streak >= 30) {
    return {
      title: `🔥 Streak ${streak} ngày — nhà vô địch!`,
      body: `${streak} ngày liên tiếp — bạn đang trong nhóm người học xuất sắc nhất. Học thêm 10 phút hôm nay! 🏆`,
    };
  }

  // Long streak (≥14): Loss aversion dominant
  if (streak >= 14) {
    const prev = bestStreak > streak ? ` (kỷ lục ${bestStreak} ngày)` : "";
    return {
      title: `🚨 Streak ${streak} ngày cần bảo vệ!`,
      body: `Đừng để ${streak} ngày${prev} trở về 0! Chỉ cần 1 bài hoặc 5 thẻ từ là xong 💪`,
    };
  }

  // Growing streak (7-13): Momentum framing
  if (streak >= 7) {
    return {
      title: `🔥 Streak ${streak} ngày — giữ momentum!`,
      body: `${streak} ngày kiên trì rồi! Học thêm 1 bài cấp ${level} để giữ lửa nhé 📚`,
    };
  }

  // Short streak (3-6): Progress principle
  if (streak >= 3) {
    return {
      title: `⚡ Streak ${streak} ngày — tiếp tục thôi!`,
      body: `Bạn đang trên đà tốt! Chỉ cần 10 phút hôm nay để giữ streak ${streak} ngày nhé 🌱`,
    };
  }

  // Just started (1-2): Tiny habits framing
  if (streak >= 1) {
    return {
      title: `📖 Bạn đã học hôm nay chưa?`,
      body: `Streak ${streak} ngày đang chờ được tiếp tục. Chỉ 5 phút — 1 bài hoặc ôn flashcard! ⚡`,
    };
  }

  // No streak: Gentle nudge (opportunity, not obligation)
  return {
    title: `☀️ Thời gian học tiếng Anh rồi!`,
    body: `Hôm nay là ngày tốt để bắt đầu thói quen học mỗi ngày. Cấp ${level} đang chờ bạn! 🚀`,
  };
}

/** Variable-reward encouragement for users who already studied today (10% trigger) */
function buildEncouragementMessage(streak: number, _level: string): { title: string; body: string } {
  const messages = [
    {
      title: `⭐ Tuyệt vời! Bạn đã học hôm nay rồi!`,
      body: `Streak ${streak} ngày được bảo vệ 🔥 Muốn ôn thêm flashcard không?`,
    },
    {
      title: `💪 Đỉnh lắm — ${streak} ngày streak!`,
      body: `Bạn đã học hôm nay rồi. Giỏi lắm! Ngày mai tiếp tục nhé 🌟`,
    },
    {
      title: `🎯 Streak ${streak} ngày — bạn ổn lắm!`,
      body: `Đã học hôm nay — nhiệm vụ hoàn thành! Hẹn gặp lại ngày mai 🔥`,
    },
  ];
  const picked = messages[Math.floor(Math.random() * messages.length)];
  return picked ?? messages[0]!;
}
