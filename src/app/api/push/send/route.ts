/**
 * Web Push sender API route
 * POST /api/push/send
 *
 * Body: { subscription: PushSubscriptionJSON, payload: string }
 * Returns: { success: boolean }
 *
 * Uses web-push with VAPID for RFC 8292 compliant notifications.
 * Called by cron jobs and can be called directly for testing.
 */
import { NextResponse } from "next/server";
import webpush from "web-push";

// Configure VAPID once at module level
const vapidSubject = process.env.VAPID_SUBJECT ?? "mailto:support@atoenglish.vercel.app";
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY ?? "";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export const runtime = "nodejs"; // web-push needs Node crypto

export async function POST(request: Request) {
  // Internal-only: only allow from Vercel cron or same-origin (no auth header needed for internal calls)
  // Cron routes call this internally with no external exposure needed
  if (!vapidPublicKey || !vapidPrivateKey) {
    return NextResponse.json({ success: false, error: "VAPID keys not configured" }, { status: 500 });
  }

  let body: { subscription: PushSubscriptionJSON; payload: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { subscription, payload } = body;

  if (!subscription?.endpoint || !subscription?.keys) {
    return NextResponse.json({ success: false, error: "Invalid subscription" }, { status: 400 });
  }

  try {
    await webpush.sendNotification(
      subscription as webpush.PushSubscription,
      payload,
      {
        TTL: 60 * 60 * 24, // 24 hours
        urgency: "normal",
      }
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    // 410 Gone = subscription expired/revoked — caller should delete it
    const statusCode = (err as { statusCode?: number }).statusCode;
    if (statusCode === 410 || statusCode === 404) {
      return NextResponse.json({ success: false, expired: true }, { status: 410 });
    }
    return NextResponse.json({ success: false, error: "Push failed" }, { status: 500 });
  }
}
