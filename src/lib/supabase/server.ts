import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { AppDatabase } from "@/types/app-database";

// Next.js 15+: cookies() is async and must be awaited.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<AppDatabase>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components cannot write cookies. Middleware refreshes them.
          }
        },
      },
    },
  );
}
