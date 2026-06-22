import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

type ServerClient = SupabaseClient<Database>;

/**
 * Fetch all saved card words for a user (1 lightweight query, no curriculum IN list).
 */
export async function getUserSavedWords(
  supabase: ServerClient,
  userId: string,
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("cards")
    .select("word")
    .eq("user_id", userId);

  if (error || !data) return new Set();

  return new Set(data.map((c) => c.word.toLowerCase().trim()));
}