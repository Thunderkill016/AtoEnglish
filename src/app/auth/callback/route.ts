import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getOnboardingRedirectPath,
  getOnboardingStartingUnitIndex,
  mapQuizLevelToCefr,
} from "@/lib/onboarding";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  let destination = next;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const user = data.user;
      const level = searchParams.get("level") ?? "A0-A1";
      const mappedLevel = mapQuizLevelToCefr(level);

      const { data: existingProgress } = await supabase
        .from("user_progress")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      const isNewUser = !existingProgress;

      // Upsert user_progress — insert for new users, skip for returning users
      // (ignoreDuplicates preserves existing level/xp/streak on re-login)
      await supabase.from("user_progress").upsert(
        {
          user_id: user.id,
          current_level: mappedLevel,
          starting_unit_index: getOnboardingStartingUnitIndex(level),
          streak: 0,
          total_xp: 0,
        },
        { onConflict: "user_id", ignoreDuplicates: true }
      );

      // New signups with onboarding survey → first lesson micro-session (~3 min)
      if (isNewUser && searchParams.has("level")) {
        const time = searchParams.get("time") ?? "15min";
        destination = getOnboardingRedirectPath(level, time);
      }
    }
  }

  return NextResponse.redirect(`${origin}${destination}`);
}
