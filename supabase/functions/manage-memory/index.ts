/**
 * manage-memory — Supabase Edge Function
 * Handles DELETE and UPDATE operations on project_memories
 *
 * POST body:
 * { "action": "delete", "id": 5 }
 * { "action": "update", "id": 5, "content": "new content", "category": "bug", "metadata": {} }
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
    action: "delete" | "update";
    id: number;
    content?: string;
    category?: string;
    metadata?: Record<string, unknown>;
  };

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400, headers: { "Content-Type": "application/json", ...CORS },
    });
  }

  if (!body.id || !body.action) {
    return new Response(JSON.stringify({ error: "id and action are required" }), {
      status: 400, headers: { "Content-Type": "application/json", ...CORS },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    if (body.action === "delete") {
      const { error } = await supabase
        .from("project_memories")
        .delete()
        .eq("id", body.id);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, deleted_id: body.id }),
        { headers: { "Content-Type": "application/json", ...CORS } }
      );
    }

    if (body.action === "update") {
      if (!body.content?.trim()) {
        return new Response(JSON.stringify({ error: "content is required for update" }), {
          status: 400, headers: { "Content-Type": "application/json", ...CORS },
        });
      }

      // Re-embed the updated content
      const model = new Supabase.ai.Session("gte-small");
      const embedding = await model.run(body.content.trim(), {
        mean_pool: true,
        normalize: true,
      }) as number[];

      const updates: Record<string, unknown> = {
        content: body.content.trim(),
        embedding: JSON.stringify(embedding),
      };
      if (body.category) updates.category = body.category;
      if (body.metadata) {
        updates.metadata = {
          ...body.metadata,
          updated_at: new Date().toISOString(),
        };
      }

      const { data, error } = await supabase
        .from("project_memories")
        .update(updates)
        .eq("id", body.id)
        .select("id, content, category, created_at")
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, memory: data }),
        { headers: { "Content-Type": "application/json", ...CORS } }
      );
    }

    return new Response(JSON.stringify({ error: `Unknown action: ${body.action}` }), {
      status: 400, headers: { "Content-Type": "application/json", ...CORS },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { "Content-Type": "application/json", ...CORS } }
    );
  }
});
