import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/security/rate-limit";

const rl = createRateLimiter(60, 60_000, "notifications-history");

/**
 * GET /api/notifications/history
 * Returns last 30 notifications for the authenticated user.
 *
 * PATCH /api/notifications/history
 * Body: { ids?: string[] } — marks specified (or all) as read.
 */

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const limit = await rl.check(user.id);
  if (!limit.success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const { data, error } = await supabase
    .from("notification_logs")
    .select("id, type, title, body, url, read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const unreadCount = (data ?? []).filter(n => !n.read).length;
  return NextResponse.json({ notifications: data ?? [], unreadCount });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const limit = await rl.check(user.id);
  if (!limit.success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  let ids: string[] | undefined;
  try {
    const body = await request.json() as { ids?: string[] };
    ids = body.ids;
  } catch { /* mark all */ }

  let query = supabase
    .from("notification_logs")
    .update({ read: true })
    .eq("user_id", user.id);

  if (ids && ids.length > 0) {
    query = query.in("id", ids);
  }

  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
