import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const user = data.user;
      const level = searchParams.get("level") ?? "A0-A1";
      const cefrMap: Record<string, "A1" | "A2" | "B1" | "B2"> = {
        "A0-A1": "A1",
        "A2": "A2",
        "B1": "B1",
        "B2+": "B2",
      };
      const mappedLevel = cefrMap[level] || "A1";

      const time = searchParams.get("time") ?? "15min";
      const xpGoalMap: Record<string, number> = {
        "5min": 20, "15min": 50, "30min": 100, "60min": 200,
      };
      const dailyXpGoal = xpGoalMap[time] ?? 50;

      // Extract display name from Google OAuth metadata
      const displayName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Học viên";

      // Run both upserts in parallel — saves ~200ms vs sequential
      await Promise.all([
        // 1. user_progress: insert for new users, ignore for existing (preserves level/xp/streak)
        supabase.from("user_progress").upsert(
          {
            user_id: user.id,
            current_level: mappedLevel,
            streak: 0,
            total_xp: 0,
          },
          { onConflict: "user_id", ignoreDuplicates: true }
        ),
        // 2. users: always update display_name so it stays in sync with Google profile
        supabase.from("users").upsert(
          {
            id: user.id,
            email: user.email || "",
            display_name: displayName,
          },
          { onConflict: "id", ignoreDuplicates: false }
        ),
      ]);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
