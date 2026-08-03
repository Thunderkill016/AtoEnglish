import type { PendingLearningAttemptTable } from "@/types/pending-learning-attempts";
import type {
  RealTalkFunctions,
  RealTalkTables,
} from "@/types/real-talk-supabase.generated";
import type { Database } from "@/types/supabase";

type GeneratedPublicTables = Database["public"]["Tables"];
type GeneratedPublicFunctions = Database["public"]["Functions"];
type PublicTablesWithPendingMigrations = Omit<
  GeneratedPublicTables,
  keyof RealTalkTables | "learning_attempts"
> &
  RealTalkTables & {
    learning_attempts: PendingLearningAttemptTable;
  };
type PublicFunctionsWithPendingMigrations = Omit<
  GeneratedPublicFunctions,
  keyof RealTalkFunctions
> &
  RealTalkFunctions;

/**
 * App-level database type layered on the full hosted Supabase snapshot.
 *
 * The overlays are deliberately separate from `src/types/supabase.ts` because
 * their versioned migrations are not present in the hosted project:
 *
 * - `learning_attempts` waits on `20260731162613_learning_attempts.sql`;
 * - Real Talk provenance fields wait on T060;
 * - the atomic private-draft RPC waits on T067.
 *
 * `Omit` keeps regeneration safe: after an authorized hosted migration adds the
 * same table or function, the pending definition replaces rather than
 * intersects with the generated entry until the overlay is removed.
 */
export type AppDatabase = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables" | "Functions"> & {
    Tables: PublicTablesWithPendingMigrations;
    Functions: PublicFunctionsWithPendingMigrations;
  };
};
