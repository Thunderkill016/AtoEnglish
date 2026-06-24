import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";

/**
 * Daily Streak Reminder Cron — vercel.json: "0 * * * *" (every hour)
 *
 * Strategy (inspired by Duolingo):
 * 1. Run hourly (not daily) so we can respect each user's preferred hour
 * 2. Only send to users whose notification_hour matches current VN hour
 * 3. Skip users who already studied today
 * 4. 5-level escalating copy based on streak risk
 *
 * vercel.json: { "path": "/api/cron/daily-reminder", "schedule": "0 * * * *" }
 */

// Configure VAPID
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY ?? "";
const vapidSubject = process.env.VAPID_SUBJECT ?? "mailto:support@atoenglish.vercel.app";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!vapidPublicKey || !vapidPrivateKey) {
    return NextResponse.json({ error: "VAPID keys not configured" }, { status: 500 });
  }

  // Current VN hour (UTC+7)
  const nowVN = new Date(Date.now() + 7 * 3600_000);
  const currentHourVN = nowVN.getUTCHours();
  const todayVN = nowVN.toISOString().slice(0, 10);
  const todayStartUTC = new Date(todayVN + "T00:00:00+07:00").toISOString();

  const supabase = await createClient();

  // Get subscriptions for users whose preferred hour = current VN hour
  // JOIN with user_progress to filter by notification_hour
  const { data: rows, error } = await supabase
    .from("push_subscriptions")
    .select(`
      user_id,
      endpoint,
      keys,
      user_progress!inner(streak, last_active_date, current_level, notification_hour)
    `)
    .eq("user_progress.notification_hour", currentHourVN);

  if (error || !rows?.length) {
    return NextResponse.json({ sent: 0, skipped: 0, hour: currentHourVN });
  }

  // Batch check who studied today
  const userIds = rows.map(r => r.user_id);
  const { data: studiedToday } = await supabase
    .from("user_lesson_progress")
    .select("user_id")
    .in("user_id", userIds)
    .gte("completed_at", todayStartUTC);

  const studiedSet = new Set((studiedToday ?? []).map(r => r.user_id));

  // Also check card reviews today (studying cards counts as activity)
  const { data: reviewedToday } = await supabase
    .from("card_review_logs")
    .select("user_id")
    .in("user_id", userIds)
    .gte("created_at", todayStartUTC);

  for (const r of reviewedToday ?? []) studiedSet.add(r.user_id);

  let sent = 0;
  let skipped = 0;
  const expired: string[] = [];

  for (const row of rows) {
    if (studiedSet.has(row.user_id)) { skipped++; continue; }

    // Type-safe access to joined user_progress
    const progress = Array.isArray(row.user_progress)
      ? row.user_progress[0]
      : row.user_progress;
    const streak = (progress as { streak: number } | null)?.streak ?? 0;
    const level = (progress as { current_level: string } | null)?.current_level ?? "A0";

    const { title, body } = buildMessage(streak, level);

    const subscription: webpush.PushSubscription = {
      endpoint: row.endpoint,
      keys: row.keys as { p256dh: string; auth: string },
    };

    const payload = JSON.stringify({
      title,
      body,
      url: "/dashboard",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
    });

    try {
      await webpush.sendNotification(subscription, payload, { TTL: 3600, urgency: "normal" });
      sent++;
    } catch (err) {
      const code = (err as { statusCode?: number }).statusCode;
      if (code === 410 || code === 404) {
        expired.push(row.endpoint);
      }
    }
  }

  // Clean up expired subscriptions
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
    timestamp: new Date().toISOString(),
  });
}

function buildMessage(streak: number, level: string): { title: string; body: string } {
  // Level 5: Long streak at risk (>= 14 days)
  if (streak >= 14) {
    return {
      title: `🚨 Streak ${streak} ngày đang nguy hiểm!`,
      body: `Đừng để ${streak} ngày streak bị reset! Chỉ cần 1 bài hoặc 5 thẻ từ — vào học ngay 💪`,
    };
  }
  // Level 4: Growing streak (7-13 days)
  if (streak >= 7) {
    return {
      title: `🔥 Streak ${streak} ngày — đừng để tắt lửa!`,
      body: `${streak} ngày kiên trì rồi! Học thêm 1 bài hôm nay để giữ momentum nhé.`,
    };
  }
  // Level 3: Short streak (3-6 days)
  if (streak >= 3) {
    return {
      title: `⚡ Streak ${streak} ngày cần được nuôi dưỡng!`,
      body: `Bạn đang trên đà tốt — vào học thêm 1 bài cấp ${level} để tiếp tục nhé! 📚`,
    };
  }
  // Level 2: First day or just started
  if (streak >= 1) {
    return {
      title: `📖 Hôm nay bạn đã học chưa?`,
      body: `Chỉ 10 phút — học 1 bài hoặc ôn flashcard để giữ streak ${streak} ngày của bạn!`,
    };
  }
  // Level 1: No streak — gentle nudge
  return {
    title: `☀️ Thời gian học tiếng Anh rồi!`,
    body: `Bắt đầu thói quen học mỗi ngày từ hôm nay. Cấp ${level} đang chờ bạn tiếp tục! 🚀`,
  };
}
