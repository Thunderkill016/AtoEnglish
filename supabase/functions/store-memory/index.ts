/**
 * store-memory — Supabase Edge Function
 * Uses Supabase built-in AI (gte-small, 384 dims) — ZERO cost, no API keys
 *
 * POST body:
 * {
 *   "content": "Decided to use FSRS v6 for spaced repetition",
 *   "category": "decision",       // decision|architecture|context|bug|feature|rule|task
 *   "project": "atoenglish",      // optional
 *   "metadata": {"importance": 8} // optional
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
    content: string;
    category?: string;
    project?: string;
    metadata?: Record<string, unknown>;
  };

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.content?.trim()) {
    return new Response(JSON.stringify({ error: "content is required" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // 1. Generate embedding using Supabase built-in AI (free, no API key needed)
    const model = new Supabase.ai.Session("gte-small");
    const embedding = await model.run(body.content.trim(), {
      mean_pool: true,
      normalize: true,
    }) as number[];

    // 2. Insert into DB using service role (bypasses RLS for agent writes)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data, error } = await supabase
      .from("project_memories")
      .insert({
        content: body.content.trim(),
        embedding: JSON.stringify(embedding),
        category: body.category ?? "context",
        project: body.project ?? "atoenglish",
        metadata: {
          ...body.metadata,
          stored_at: new Date().toISOString(),
        },
      })
      .select("id, content, category, created_at")
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, memory: data }),
      { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err) {
    console.error("[store-memory]", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
