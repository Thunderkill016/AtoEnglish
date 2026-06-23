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

      // Map onboarding quiz answer to CEFR level
      // "A0-A1" → "A0" (true beginner — learns from scratch)
      const cefrMap: Record<string, "A0" | "A1" | "A2" | "B1" | "B2"> = {
        "A0-A1": "A0",
        "A2":    "A2",
        "B1":    "B1",
        "B2+":   "B2",
      };
      const mappedLevel = cefrMap[level] || "A0";

      const time = searchParams.get("time") ?? "15min";
      const xpGoalMap: Record<string, number> = {
        "5min": 20, "15min": 50, "30min": 100, "60min": 200,
      };
      const dailyXpGoal = xpGoalMap[time] ?? 50;

      // Upsert user_progress — insert for new users, skip for returning users
      // (ignoreDuplicates preserves existing level/xp/streak on re-login)
      // display_name is NOT stored in a separate table — read from user_metadata
      await supabase.from("user_progress").upsert(
        {
          user_id: user.id,
          current_level: mappedLevel,
          streak: 0,
          total_xp: 0,
        },
        { onConflict: "user_id", ignoreDuplicates: true }
      );
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
