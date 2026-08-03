import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const SAFE_NEXT_PREFIXES = ["/dashboard", "/real-talk", "/me", "/settings"];

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/real-talk/create";
  }

  return SAFE_NEXT_PREFIXES.some(
    (prefix) => value === prefix || value.startsWith(`${prefix}/`),
  )
    ? value
    : "/real-talk/create";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const destination = safeNextPath(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?mode=login&next=${encodeURIComponent(destination)}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      `${origin}/login?mode=login&next=${encodeURIComponent(destination)}`,
    );
  }

  return NextResponse.redirect(`${origin}${destination}`);
}
