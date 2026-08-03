import type { PendingLearningAttemptTable } from "@/types/pending-learning-attempts";
import type { Database } from "@/types/supabase";

type GeneratedPublicTables = Database["public"]["Tables"];
type PublicTablesWithPendingMigrations = Omit<
  GeneratedPublicTables,
  "learning_attempts"
> & {
  learning_attempts: PendingLearningAttemptTable;
};

/**
 * App-level database type layered on the full hosted Supabase snapshot.
 *
 * The only remaining overlay is `learning_attempts`, whose versioned
 * migration `20260731162613_learning_attempts.sql` is not present in the
 * hosted project. Real Talk provenance fields and the atomic draft RPC are
 * generated directly from hosted schema truth.
 */
export type AppDatabase = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables"> & {
    Tables: PublicTablesWithPendingMigrations;
  };
};
