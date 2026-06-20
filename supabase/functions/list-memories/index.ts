/**
 * list-memories — Supabase Edge Function
 * List memories with optional category/project filter — no embedding needed
 *
 * POST body:
 * {
 *   "category": "bug",          // optional — filter by category
 *   "project": "atoenglish",    // optional — filter by project
 *   "limit": 20,                // optional, default 20
 *   "offset": 0                 // optional, default 0 (for pagination)
 * }
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: {
    category?: string;
    project?: string;
    limit?: number;
    offset?: number;
  } = {};

  try {
    body = await req.json();
  } catch {
    // Empty body is OK — list all memories
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    let query = supabase
      .from("project_memories")
      .select("id, content, category, project, metadata, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(body.limit ?? 20)
      .range(body.offset ?? 0, (body.offset ?? 0) + (body.limit ?? 20) - 1);

    if (body.category) query = query.eq("category", body.category);
    if (body.project) query = query.eq("project", body.project);

    const { data, error, count } = await query;

    if (error) throw error;

    // Group by category for easy overview
    const byCategory: Record<string, number> = {};
    (data ?? []).forEach((m) => {
      byCategory[m.category] = (byCategory[m.category] ?? 0) + 1;
    });

    return new Response(
      JSON.stringify({
        memories: data ?? [],
        count: data?.length ?? 0,
        total: count ?? 0,
        by_category: byCategory,
        filter: {
          category: body.category ?? null,
          project: body.project ?? "atoenglish",
        },
      }),
      { headers: { "Content-Type": "application/json", ...CORS } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { "Content-Type": "application/json", ...CORS } }
    );
  }
});
