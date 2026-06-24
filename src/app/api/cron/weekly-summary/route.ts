import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";
import { sendWeeklyDigest, sendWinBackEmail } from "@/lib/email";

/**
 * Weekly Summary Cron — Monday 08:00 ICT (01:00 UTC)
 * vercel.json: { "path": "/api/cron/weekly-summary", "schedule": "0 1 * * 1" }
 *
 * 1. Sends push notification to all subscribed users with weekly stats
 * 2. Sends weekly digest email to opted-in users (requires RESEND_API_KEY)
 * 3. Sends win-back email to users inactive 7/14/30 days
 */

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY ?? "";
const vapidSubject = process.env.VAPID_SUBJECT ?? "mailto:support@atoenglish.vercel.app";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  // Push: all subscribed users
  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("user_id, endpoint, keys");

  let pushSent = 0;
  const pushExpired: string[] = [];

  for (const sub of subscriptions ?? []) {
    const [progressRes, unitsRes] = await Promise.all([
      supabase
        .from("user_progress")
        .select("streak, current_level")
        .eq("user_id", sub.user_id)
        .maybeSingle(),
      supabase
        .from("user_lesson_progress")
        .select("unit_id", { count: "exact", head: true })
        .eq("user_id", sub.user_id)
        .gte("completed_at", weekAgo.toISOString()),
    ]);

    const streak = progressRes.data?.streak ?? 0;
    const units = unitsRes.count ?? 0;
    const level = progressRes.data?.current_level ?? "A0";

    let body: string;
    if (units === 0) {
      body = `Tuần này bạn chưa học bài nào! Hôm nay bắt đầu lại nhé — cấp ${level} đang chờ 💪`;
    } else if (streak >= 7) {
      body = `🔥 Streak ${streak} ngày! ${units} bài tuần này — xuất sắc! Tiếp tục nhé.`;
    } else {
      body = `${units} bài học tuần này${streak > 0 ? ` · Streak ${streak} ngày 🔥` : ""}. Xem báo cáo đầy đủ →`;
    }

    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: sub.keys as { p256dh: string; auth: string } },
        JSON.stringify({ title: "📊 Tổng kết tuần học", body, url: "/progress/weekly", icon: "/icon-192.png" }),
        { TTL: 86400 }
      );
      pushSent++;
    } catch (err) {
      const code = (err as { statusCode?: number }).statusCode;
      if (code === 410 || code === 404) pushExpired.push(sub.endpoint);
    }
  }

  // Clean expired push subscriptions
  if (pushExpired.length > 0) {
    await supabase.from("push_subscriptions").delete().in("endpoint", pushExpired);
  }

  // Email: weekly digest for opted-in users who have been active this week
  let emailSent = 0;
  let winbackSent = 0;

  if (process.env.RESEND_API_KEY) {
    // Get all users with email notifications enabled
    const { data: activeUsers } = await supabase
      .from("user_progress")
      .select("user_id, streak, current_level, last_active_date")
      .eq("email_notifications" as string, true);

    for (const user of activeUsers ?? []) {
      // Get their email from auth
      const { data: authUser } = await supabase.auth.admin.getUserById(user.user_id);
      const email = authUser.user?.email;
      const displayName = authUser.user?.user_metadata?.full_name
        ?? authUser.user?.email?.split("@")[0]
        ?? "bạn";

      if (!email) continue;

      const lastActive = user.last_active_date ? new Date(user.last_active_date) : null;
      const daysSince = lastActive
        ? Math.floor((Date.now() - lastActive.getTime()) / 86400000)
        : 999;

      // Win-back: inactive 7+ days
      if (daysSince >= 7) {
        const res = await sendWinBackEmail({
          email,
          displayName,
          daysSince,
          streak: user.streak ?? 0,
          currentLevel: user.current_level ?? "A0",
        });
        if (res.success) winbackSent++;
        continue;
      }

      // Weekly digest: active users
      const [lessonsRes, cardsRes, daysRes] = await Promise.all([
        supabase
          .from("user_lesson_progress")
          .select("unit_id", { count: "exact", head: true })
          .eq("user_id", user.user_id)
          .gte("completed_at", weekAgo.toISOString()),
        supabase
          .from("card_review_logs")
          .select("card_id", { count: "exact", head: true })
          .eq("user_id", user.user_id)
          .gte("created_at", weekAgo.toISOString()),
        supabase
          .from("card_review_logs")
          .select("created_at")
          .eq("user_id", user.user_id)
          .gte("created_at", weekAgo.toISOString()),
      ]);

      const activeDatesSet = new Set(
        (daysRes.data ?? []).map(r =>
          new Date(r.created_at).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" })
        )
      );

      const res = await sendWeeklyDigest({
        email,
        displayName,
        streak: user.streak ?? 0,
        lessonsThisWeek: lessonsRes.count ?? 0,
        cardsThisWeek: cardsRes.count ?? 0,
        activeDays: activeDatesSet.size,
        currentLevel: user.current_level ?? "A0",
      });
      if (res.success) emailSent++;
    }
  }

  return NextResponse.json({
    push: { sent: pushSent, expired: pushExpired.length },
    email: { digest: emailSent, winback: winbackSent, enabled: !!process.env.RESEND_API_KEY },
    timestamp: new Date().toISOString(),
  });
}
