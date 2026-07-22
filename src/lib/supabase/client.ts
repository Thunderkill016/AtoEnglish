import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}

/**
 * Use only for newly migrated tables that are not yet present in the generated
 * Database type. Refresh src/types/supabase.ts and migrate callers back to
 * createClient() when the next type generation pass runs.
 */
export function createUntypedClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
