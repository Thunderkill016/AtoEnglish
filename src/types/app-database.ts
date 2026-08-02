import type { RealTalkTables } from "@/types/real-talk-supabase.generated";
import type { Database } from "@/types/supabase";

type GeneratedPublicTables = Database["public"]["Tables"];
type PublicTablesWithRealTalk = Omit<
  GeneratedPublicTables,
  keyof RealTalkTables
> &
  RealTalkTables;

/**
 * App-level database type that reconciles the repository's full generated
 * Supabase type with the hosted Real Talk schema fragment.
 *
 * `Omit` makes this forward-compatible: once a local full regeneration adds
 * the same table names to `src/types/supabase.ts`, the hosted definitions here
 * replace rather than intersect with stale copies.
 */
export type AppDatabase = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables"> & {
    Tables: PublicTablesWithRealTalk;
  };
};
