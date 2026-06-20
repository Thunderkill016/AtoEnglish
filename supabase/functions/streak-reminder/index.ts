/**
 * Supabase Edge Function: streak-reminder
 *
 * Runs daily at 13:00 UTC (20:00 Vietnam time via Supabase cron)
 * Sends Web Push notifications to users who haven't studied today
 *
 * Setup in Supabase Dashboard → Edge Functions → Cron:
 *   Schedule: 0 13 * * *
 *   Function: streak-reminder
 *
 * Required secrets (set in Supabase Dashboard → Settings → Edge Functions):
 *   VAPID_PRIVATE_KEY   — generated with: npx web-push generate-vapid-keys
 *   VAPID_PUBLIC_KEY    — same command above
 *   VAPID_SUBJECT       — mailto:your@email.com
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

// Web Push via built-in crypto (Deno runtime)
async function sendWebPush(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: { title: string; body: string; icon: string }
): Promise<boolean> {
  const { endpoint, keys } = subscription;

  // Use web-push compatible library (or implement VAPID manually)
  // For simplicity, using fetch with VAPID Authorization header
  const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";
  const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";
  const vapidSubject = Deno.env.get("VAPID_SUBJECT") ?? "mailto:admin@atoenglish.app";

  if (!vapidPublicKey || !vapidPrivateKey) {
    console.error("[Push] VAPID keys not configured");
    return false;
  }

  try {
    // Import web-push for Deno
    const webpush = await import("npm:web-push@3");
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    await webpush.sendNotification(
      {
        endpoint,
        keys: { p256dh: keys.p256dh, auth: keys.auth },
      },
      JSON.stringify(payload)
    );
    return true;
  } catch (err) {
    console.error("[Push] Send failed:", err);
    return false;
  }
}

Deno.serve(async (req) => {
  // Only allow POST (from Supabase cron or manual trigger)
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStr = todayStart.toISOString();

  // Find users with active subscriptions who haven't logged XP today
  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("user_id, endpoint, keys")
    .not(
      "user_id",
      "in",
      `(
        SELECT DISTINCT user_id FROM card_review_logs
        WHERE created_at >= '${todayStr}'
        UNION
        SELECT DISTINCT user_id FROM completed_lessons
        WHERE completed_at >= '${todayStr}'
      )`
    )
    .limit(500); // safety cap

  if (error) {
    console.error("[Reminder] Query failed:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const payload = {
    title: "AtoEnglish 🔥",
    body: "Streak của bạn đang chờ! Chỉ 5 phút thôi — đừng để nó bị mất nhé.",
    icon: "/icon-192.png",
  };

  let sent = 0;
  let failed = 0;

  for (const sub of subscriptions ?? []) {
    const ok = await sendWebPush(sub, payload);
    if (ok) sent++; else failed++;
  }

  console.log(`[Reminder] Sent: ${sent}, Failed: ${failed}`);
  return new Response(
    JSON.stringify({ sent, failed, total: subscriptions?.length ?? 0 }),
    { headers: { "Content-Type": "application/json" } }
  );
});
