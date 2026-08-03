import type { Json } from "@/types/supabase";

/**
 * Schema-shaped type for the versioned but unapplied migration
 * `20260731162613_learning_attempts.sql`.
 *
 * This must remain outside `src/types/supabase.ts`: that file is the generated
 * snapshot of the hosted project, where `learning_attempts` does not yet exist.
 * Remove this overlay only after explicit migration authorization, hosted
 * application, and a fresh generated type snapshot.
 */
export type PendingLearningAttemptTable = {
  Row: {
    activity_id: string;
    created_at: string;
    error_tags: string[];
    evaluator: string;
    evaluator_version: string;
    id: number;
    latency_ms: number | null;
    lesson_id: string;
    modality: string;
    score: number | null;
    session_id: string;
    status: string;
    user_id: string;
  };
  Insert: {
    activity_id: string;
    created_at?: string;
    error_tags?: string[];
    evaluator: string;
    evaluator_version: string;
    id?: never;
    latency_ms?: number | null;
    lesson_id: string;
    modality: string;
    score?: number | null;
    session_id: string;
    status: string;
    user_id: string;
  };
  Update: {
    activity_id?: string;
    created_at?: string;
    error_tags?: string[];
    evaluator?: string;
    evaluator_version?: string;
    id?: never;
    latency_ms?: number | null;
    lesson_id?: string;
    modality?: string;
    score?: number | null;
    session_id?: string;
    status?: string;
    user_id?: string;
  };
  Relationships: [];
};

// Keep the import referenced so this file fails when the generated Json type
// changes incompatibly; the table currently has no Json columns.
export type PendingLearningAttemptJsonCompatibility = Json;
