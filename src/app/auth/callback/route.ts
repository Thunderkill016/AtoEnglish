import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { goalFromOnboardingTime } from "@/lib/constants/daily-xp-goal";
import { sanitizeRedirectPath } from "@/lib/auth/safe-redirect";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeRedirectPath(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const user = data.user;
  const level = searchParams.get("level") ?? "A0-A1";
  const cefrMap: Record<string, "A0" | "A1" | "A2" | "B1" | "B2"> = {
    "A0-A1": "A0",
    "A2": "A2",
    "B1": "B1",
    "B2+": "B2",
  };
  const mappedLevel = cefrMap[level] || "A0";

  const time = searchParams.get("time") ?? "15min";
  const dailyXpGoal = goalFromOnboardingTime(time);

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Học viên";

  await Promise.all([
    supabase.from("user_progress").upsert(
      {
        user_id: user.id,
        current_level: mappedLevel,
        streak: 0,
        total_xp: 0,
        daily_xp_goal: dailyXpGoal,
      },
      { onConflict: "user_id", ignoreDuplicates: true },
    ),
    supabase.from("users").upsert(
      {
        id: user.id,
        email: user.email || "",
        display_name: displayName,
      },
      { onConflict: "id", ignoreDuplicates: false },
    ),
  ]);

  return NextResponse.redirect(`${origin}${next}`);
}