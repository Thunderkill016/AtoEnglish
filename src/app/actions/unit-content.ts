"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/types/supabase";
import { unit1 } from "@/lib/data/units/unit1";
import { unit2 } from "@/lib/data/units/unit2";
import { unit3 } from "@/lib/data/units/unit3";
import { unit4 } from "@/lib/data/units/unit4";
import type { UnitData } from "@/components/learn/UnitTemplate";

type UnitContentInsert =
  Database["public"]["Tables"]["unit_content"]["Insert"];

const UNIT_DATA: { unit_id: string; content: UnitData }[] = [
  { unit_id: "unit-1", content: unit1 },
  { unit_id: "unit-2", content: unit2 },
  { unit_id: "unit-3", content: unit3 },
  { unit_id: "unit-4", content: unit4 },
];

/**
 * Server Action: seed unit_content table from TypeScript data files.
 * Run once after applying migration 20260620112800_unit_content.sql.
 * Idempotent — safe to run multiple times (upsert on conflict).
 */
export async function seedUnitContent(): Promise<{
  success: boolean;
  results: { unitId: string; ok: boolean; error?: string }[];
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, results: [] };

  const results = await Promise.all(
    UNIT_DATA.map(async ({ unit_id, content }) => {
      const row: UnitContentInsert = {
        unit_id,
        content: content as unknown as Json,
        is_active: true,
      };

      const { error } = await supabase
        .from("unit_content")
        .upsert(row, { onConflict: "unit_id" });

      return { unitId: unit_id, ok: !error, error: error?.message };
    })
  );

  return { success: results.every((r) => r.ok), results };
}

/**
 * Fetch unit content from DB.
 * Returns null if not found (caller falls back to TS data).
 */
export async function getUnitContent(unitSlug: string): Promise<UnitData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("unit_content")
    .select("content")
    .eq("unit_id", unitSlug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return null;
  return data.content as unknown as UnitData;
}
