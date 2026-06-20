/**
 * search-memories — Supabase Edge Function
 * Semantic search using Supabase built-in AI (gte-small, 384 dims) — FREE
 *
 * POST body:
 * {
 *   "query": "how does FSRS scheduling work?",
 *   "threshold": 0.70,        // optional, default 0.70
 *   "limit": 8,               // optional, default 8
 *   "project": "atoenglish",  // optional filter
 *   "category": "decision"    // optional filter
 * }
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: {
    query: string;
    threshold?: number;
    limit?: number;
    project?: string;
    category?: string;
  };

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.query?.trim()) {
    return new Response(JSON.stringify({ error: "query is required" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // 1. Embed query using built-in gte-small
    const model = new Supabase.ai.Session("gte-small");
    const embedding = await model.run(body.query.trim(), {
      mean_pool: true,
      normalize: true,
    }) as number[];

    // 2. Semantic search via match_memories RPC
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data, error } = await supabase.rpc("match_memories", {
      query_embedding: JSON.stringify(embedding),
      match_threshold: body.threshold ?? 0.70,
      match_count: body.limit ?? 8,
      filter_project: body.project ?? null,
      filter_category: body.category ?? null,
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({
        memories: data ?? [],
        count: data?.length ?? 0,
        query: body.query,
      }),
      { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err) {
    console.error("[search-memories]", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
