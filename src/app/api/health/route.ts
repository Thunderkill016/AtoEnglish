import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";
export const revalidate = 0;

/**
 * GET /api/health
 * Uptime check endpoint for monitoring (Vercel, UptimeRobot, etc.)
 * Returns 200 if app + DB connection are healthy, 503 otherwise.
 */
export async function GET() {
  const start = Date.now();

  try {
    // Ping Supabase with a lightweight query
    const supabase = await createClient();
    const { error } = await supabase
      .from("user_progress")
      .select("user_id", { count: "exact", head: true })
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          status: "degraded",
          db: "error",
          error: error.message,
          latency_ms: Date.now() - start,
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        status: "ok",
        db: "connected",
        latency_ms: Date.now() - start,
        timestamp: new Date().toISOString(),
        version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache",
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        error: err instanceof Error ? err.message : "Unknown error",
        latency_ms: Date.now() - start,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
