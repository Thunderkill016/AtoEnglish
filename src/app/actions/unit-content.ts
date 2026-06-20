"use server";

import { createClient } from "@/lib/supabase/server";
import { unit1 } from "@/lib/data/units/unit1";
import { unit2 } from "@/lib/data/units/unit2";
import { unit3 } from "@/lib/data/units/unit3";
import { unit4 } from "@/lib/data/units/unit4";

const UNIT_DATA = [
  { unit_id: "unit-1", content: unit1 },
  { unit_id: "unit-2", content: unit2 },
  { unit_id: "unit-3", content: unit3 },
  { unit_id: "unit-4", content: unit4 },
];

/**
 * Server Action: seed unit_content table from TypeScript data files.
 *
 * Chạy 1 lần duy nhất sau khi apply migration 20260620112800_unit_content.sql.
 * Sau đó có thể update content trực tiếp qua Supabase SQL Editor.
 *
 * @returns Result with per-unit success/failure
 */
export async function seedUnitContent(): Promise<{
  success: boolean;
  results: { unitId: string; ok: boolean; error?: string }[];
}> {
  const supabase = await createClient();

  // Auth check — only allow in dev or for admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, results: [] };

  const results = await Promise.all(
    UNIT_DATA.map(async ({ unit_id, content }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("unit_content")
        .upsert({ unit_id, content }, { onConflict: "unit_id" });

      return { unitId: unit_id, ok: !error, error: error?.message };
    })
  );

  return { success: results.every((r) => r.ok), results };
}

/**
 * Fetch unit content from DB.
 * Falls back to TypeScript data if DB content not available.
 */
export async function getUnitContent(unitSlug: string) {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("unit_content")
    .select("content")
    .eq("unit_id", unitSlug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return null;
  return data.content;
}
