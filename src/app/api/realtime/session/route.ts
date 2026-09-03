import { createHash } from "node:crypto";

import { NextResponse } from "next/server";

import {
  buildOpenAIRealtimeSessionConfig,
  isOpenAIRealtimeMode,
  isPlausibleRealtimeSdpOffer,
} from "@/lib/realtime/openai-session";
import { resolveRealtimeConversationInstructions } from "@/lib/realtime/session-task";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const sessionLimiter = createRateLimiter(6, 60_000, "realtime-session");
const OPENAI_REALTIME_CALLS_URL = "https://api.openai.com/v1/realtime/calls";

function safetyIdentifier(userId: string) {
  return createHash("sha256")
    .update(`atoenglish-realtime:${userId}`)
    .digest("hex");
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "Realtime voice chưa được cấu hình trên server." },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: "Bạn cần đăng nhập để mở realtime voice." },
      { status: 401 },
    );
  }

  const rateCheck = await sessionLimiter.check(safetyIdentifier(user.id));
  if (!rateCheck.success) {
    return NextResponse.json(
      { success: false, error: "Đã mở quá nhiều voice session. Thử lại sau." },
      { status: 429 },
    );
  }

  const modeCandidate = request.headers.get("x-atoenglish-realtime-mode") ?? "capture";
  if (!isOpenAIRealtimeMode(modeCandidate)) {
    return NextResponse.json(
      { success: false, error: "Realtime mode không hợp lệ." },
      { status: 400 },
    );
  }
  const mode = modeCandidate;

  const conversationInstructions =
    mode === "conversation"
      ? (resolveRealtimeConversationInstructions(request.headers) ?? undefined)
      : undefined;
  if (mode === "conversation" && !conversationInstructions) {
    return NextResponse.json(
      {
        success: false,
        error: "Realtime conversation chỉ mở cho task Nếp hợp lệ được resolve trên server.",
      },
      { status: 400 },
    );
  }

  const contentType = request.headers.get("content-type")?.split(";")[0]?.trim();
  if (contentType !== "application/sdp") {
    return NextResponse.json(
      { success: false, error: "Realtime session yêu cầu SDP offer." },
      { status: 415 },
    );
  }

  const sdp = await request.text();
  if (!isPlausibleRealtimeSdpOffer(sdp)) {
    return NextResponse.json(
      { success: false, error: "SDP offer không hợp lệ." },
      { status: 400 },
    );
  }

  const formData = new FormData();
  formData.set("sdp", new Blob([sdp], { type: "application/sdp" }), "offer.sdp");
  formData.set(
    "session",
    new Blob(
      [JSON.stringify(buildOpenAIRealtimeSessionConfig(mode, conversationInstructions))],
      { type: "application/json" },
    ),
    "session.json",
  );

  try {
    const upstream = await fetch(OPENAI_REALTIME_CALLS_URL, {
      method: "POST",
      headers: {
        Accept: "application/sdp",
        Authorization: `Bearer ${apiKey}`,
        "OpenAI-Safety-Identifier": safetyIdentifier(user.id),
      },
      body: formData,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    if (!upstream.ok) {
      console.error("OpenAI realtime session creation failed", {
        status: upstream.status,
        requestId: upstream.headers.get("x-request-id"),
      });
      return NextResponse.json(
        { success: false, error: "Không mở được realtime voice session." },
        { status: 502 },
      );
    }

    const answerSdp = await upstream.text();
    if (!answerSdp.trim().startsWith("v=0")) {
      console.error("OpenAI realtime returned a non-SDP response", {
        requestId: upstream.headers.get("x-request-id"),
      });
      return NextResponse.json(
        { success: false, error: "Realtime provider trả dữ liệu không hợp lệ." },
        { status: 502 },
      );
    }

    return new Response(answerSdp, {
      status: 200,
      headers: {
        "Content-Type": "application/sdp",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    console.error("OpenAI realtime session request failed", {
      reason: timedOut ? "timeout" : "network",
    });
    return NextResponse.json(
      {
        success: false,
        error: timedOut
          ? "Realtime provider phản hồi quá chậm."
          : "Không kết nối được realtime provider.",
      },
      { status: 502 },
    );
  }
}
