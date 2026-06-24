import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Weekly XP Summary Cron — runs every Monday 09:00 ICT via Vercel Cron.
 * Fetches all users with push subscriptions and sends a personalised
 * weekly recap notification: streak, units completed this week.
 *
 * vercel.json: { "crons": [{ "path": "/api/cron/weekly-summary", "schedule": "0 2 * * 1" }] }
 * (2:00 UTC = 09:00 ICT every Monday)
 */
export async function GET(request: Request) {
  // Verify Vercel Cron secret header
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // Get all users with active push subscriptions
  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("user_id, endpoint, keys");

  if (error || !subscriptions?.length) {
    return NextResponse.json({ sent: 0 });
  }

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  let sent = 0;

  for (const sub of subscriptions) {
    // Get this user's weekly stats in parallel
    const [progressRes, unitsRes] = await Promise.all([
      supabase
        .from("user_progress")
        .select("streak, current_level")
        .eq("user_id", sub.user_id)
        .single(),
      supabase
        .from("user_lesson_progress")
        .select("unit_id")
        .eq("user_id", sub.user_id)
        .gte("completed_at", weekAgo.toISOString()),
    ]);

    const streak = progressRes.data?.streak ?? 0;
    const unitsThisWeek = unitsRes.data?.length ?? 0;

    // Build personalised Vietnamese message
    let body: string;
    if (unitsThisWeek === 0) {
      body = "Tuần này bạn chưa học bài nào. Hãy bắt đầu ngay hôm nay! 💪";
    } else if (streak >= 7) {
      body = `🔥 Streak ${streak} ngày! ${unitsThisWeek} bài học tuần này. Tuyệt vời — giữ vững nhé!`;
    } else {
      body = `Bạn đã hoàn thành ${unitsThisWeek} bài học tuần này${streak > 0 ? ` · Streak ${streak} ngày 🔥` : ""}. Tiếp tục nhé!`;
    }

    // Reconstruct PushSubscription JSON from stored endpoint + keys
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
            payload: JSON.stringify({
              title: "📊 Tổng kết tuần học",
              body,
              url: "/dashboard",
            }),
          }),
        }
      );
      sent++;
    } catch {
      // Fire-and-forget — skip expired subscriptions silently
    }
  }

  return NextResponse.json({ sent, total: subscriptions.length });
}
