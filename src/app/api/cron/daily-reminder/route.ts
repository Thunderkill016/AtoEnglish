import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Daily Streak Reminder Cron — runs every day at 19:00 ICT (12:00 UTC).
 * Sends push notifications to users who have NOT studied today to protect streaks.
 * Skips users who already completed a lesson today.
 *
 * vercel.json: { "crons": [{ "path": "/api/cron/daily-reminder", "schedule": "0 12 * * *" }] }
 * (12:00 UTC = 19:00 ICT daily)
 */
export async function GET(request: Request) {
  // Verify Vercel Cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // All users with push subscriptions
  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("user_id, endpoint, keys");

  if (error || !subscriptions?.length) {
    return NextResponse.json({ sent: 0, skipped: 0 });
  }

  // VN midnight today (UTC+7)
  const nowVN = new Date(Date.now() + 7 * 3600_000);
  const todayVN = nowVN.toISOString().slice(0, 10); // YYYY-MM-DD
  const todayStartUTC = new Date(todayVN + "T00:00:00+07:00").toISOString();

  let sent = 0;
  let skipped = 0;

  for (const sub of subscriptions) {
    // Check if user already studied today
    const [progressRes, activityRes] = await Promise.all([
      supabase
        .from("user_progress")
        .select("streak, last_active_date, current_level")
        .eq("user_id", sub.user_id)
        .single(),
      supabase
        .from("user_lesson_progress")
        .select("unit_id", { count: "exact", head: true })
        .eq("user_id", sub.user_id)
        .gte("completed_at", todayStartUTC),
    ]);

    const studiedToday = (activityRes.count ?? 0) > 0;
    if (studiedToday) { skipped++; continue; } // Already studied — no reminder needed

    const streak = progressRes.data?.streak ?? 0;
    const level = progressRes.data?.current_level ?? "A0";

    // Build motivating Vietnamese message based on streak length
    let title = "⏰ Đừng quên học hôm nay!";
    let body: string;

    if (streak >= 30) {
      title = `🔥 Streak ${streak} ngày — đừng để mất!`;
      body = `Bạn đang có streak ${streak} ngày liên tiếp. Chỉ cần 1 bài hôm nay để giữ lửa! 💪`;
    } else if (streak >= 7) {
      title = `🌟 Streak ${streak} ngày cần được bảo vệ!`;
      body = `${streak} ngày học liên tiếp rồi! Học thêm 1 bài hôm nay để không bị reset nhé.`;
    } else if (streak >= 3) {
      body = `Streak ${streak} ngày đang chờ bạn tiếp tục. Vào học ngay cấp ${level} nào! 📚`;
    } else if (streak === 0) {
      title = "🌱 Bắt đầu ngày học mới!";
      body = `Hôm nay chưa học bài nào. Chỉ 10 phút — bắt đầu từ cấp ${level} thôi! 🚀`;
    } else {
      body = `Hôm nay chưa học. Giữ thói quen học mỗi ngày — vào học ngay nhé! 📖`;
    }

    const pushSubscription: PushSubscriptionJSON = {
      endpoint: sub.endpoint,
      keys: sub.keys as { p256dh: string; auth: string },
    };

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://atoenglish.vercel.app"}/api/push/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscription: pushSubscription,
            payload: JSON.stringify({ title, body, url: "/dashboard" }),
          }),
        }
      );
      sent++;
    } catch {
      // Fire-and-forget — expired subscriptions silently skipped
    }
  }

  return NextResponse.json({
    sent,
    skipped,
    total: subscriptions.length,
    timestamp: new Date().toISOString(),
  });
}
