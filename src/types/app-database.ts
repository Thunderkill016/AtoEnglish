import type {
  RealTalkFunctions,
  RealTalkTables,
} from "@/types/real-talk-supabase.generated";
import type { Database } from "@/types/supabase";

type GeneratedPublicTables = Database["public"]["Tables"];
type GeneratedPublicFunctions = Database["public"]["Functions"];
type PublicTablesWithRealTalk = Omit<
  GeneratedPublicTables,
  keyof RealTalkTables
> &
  RealTalkTables;
type PublicFunctionsWithRealTalk = Omit<
  GeneratedPublicFunctions,
  keyof RealTalkFunctions
> &
  RealTalkFunctions;

/**
 * App-level database type that reconciles the repository's full generated
 * Supabase type with the hosted Real Talk schema fragment and pending versioned
 * migrations in this branch.
 *
 * `Omit` makes this forward-compatible: once a full local regeneration adds the
 * same table or function names to `src/types/supabase.ts`, these definitions
 * replace rather than intersect with stale copies.
 */
export type AppDatabase = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables" | "Functions"> & {
    Tables: PublicTablesWithRealTalk;
    Functions: PublicFunctionsWithRealTalk;
  };
};
