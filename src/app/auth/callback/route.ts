import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
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

      // Upsert: insert for new users, do nothing for existing users — 1 DB call instead of 2
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
