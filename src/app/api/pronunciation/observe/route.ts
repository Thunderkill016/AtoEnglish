import { createHash } from "node:crypto";

import { NextResponse } from "next/server";

import {
  isAllowedPronunciationAudioType,
  OPENPRONOUNCE_MAX_AUDIO_BYTES,
  parseOpenPronounceProviderPayload,
  resolvePronunciationShadowTarget,
  toPronunciationShadowObservation,
} from "@/lib/pronunciation/openpronounce-shadow";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const observationLimiter = createRateLimiter(10, 60_000, "pronunciation-shadow");
const PROVIDER_WAKE_RETRY_DELAY_MS = 1_500;
const PROVIDER_ATTEMPT_TIMEOUTS_MS = [8_000, 42_000] as const;

function rateLimitIdentity(userId: string) {
  return createHash("sha256")
    .update(`atoenglish-pronunciation-shadow:${userId}`)
    .digest("hex");
}

function resolveProviderEndpoint() {
  const base = process.env.OPENPRONOUNCE_URL?.trim();
  if (!base) return null;

  try {
    const parsed = new URL(base);
    if (
      process.env.NODE_ENV === "production" &&
      parsed.protocol !== "https:"
    ) {
      return null;
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return new URL("/pronunciation", parsed).toString();
  } catch {
    return null;
  }
}

function providerHeaders() {
  const token = process.env.OPENPRONOUNCE_SERVICE_TOKEN?.trim();
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function buildProviderForm(
  audioBytes: ArrayBuffer,
  audioType: string,
  audioName: string,
  expectedWord: string,
) {
  const providerForm = new FormData();
  providerForm.set(
    "file",
    new Blob([audioBytes], { type: audioType }),
    audioName || "recording.webm",
  );
  providerForm.set("expected_text", expectedWord);
  providerForm.set("lang", "en");
  return providerForm;
}

async function fetchProviderWithWakeRetry(input: {
  endpoint: string;
  audioBytes: ArrayBuffer;
  audioType: string;
  audioName: string;
  expectedWord: string;
}) {
  let lastError: unknown = null;
  let lastResponse: Response | null = null;

  for (let attempt = 0; attempt < PROVIDER_ATTEMPT_TIMEOUTS_MS.length; attempt += 1) {
    if (attempt > 0) await sleep(PROVIDER_WAKE_RETRY_DELAY_MS);

    try {
      const response = await fetch(input.endpoint, {
        method: "POST",
        headers: providerHeaders(),
        body: buildProviderForm(
          input.audioBytes,
          input.audioType,
          input.audioName,
          input.expectedWord,
        ),
        cache: "no-store",
        signal: AbortSignal.timeout(PROVIDER_ATTEMPT_TIMEOUTS_MS[attempt]),
      });

      lastResponse = response;
      if (response.ok || (response.status !== 502 && response.status !== 503)) {
        return response;
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastResponse) return lastResponse;
  throw lastError instanceof Error ? lastError : new Error("provider_unreachable");
}

export async function POST(request: Request) {
  const endpoint = resolveProviderEndpoint();
  if (!endpoint) {
    return NextResponse.json(
      {
        success: false,
        observation: null,
        error: "Acoustic pronunciation shadow chưa được cấu hình trên server.",
      },
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
      {
        success: false,
        observation: null,
        error: "Bạn cần đăng nhập để gửi audio phân tích thử nghiệm.",
      },
      { status: 401 },
    );
  }

  const rateCheck = await observationLimiter.check(rateLimitIdentity(user.id));
  if (!rateCheck.success) {
    return NextResponse.json(
      {
        success: false,
        observation: null,
        error: "Đã gửi quá nhiều lượt audio. Thử lại sau một chút.",
      },
      { status: 429 },
    );
  }

  const requestContentType = request.headers.get("content-type") ?? "";
  if (!requestContentType.toLowerCase().startsWith("multipart/form-data")) {
    return NextResponse.json(
      {
        success: false,
        observation: null,
        error: "Pronunciation observation yêu cầu multipart audio upload.",
      },
      { status: 415 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { success: false, observation: null, error: "Audio upload không hợp lệ." },
      { status: 400 },
    );
  }

  const soundIdValue = formData.get("soundId");
  const audioValue = formData.get("audio");

  if (typeof soundIdValue !== "string") {
    return NextResponse.json(
      { success: false, observation: null, error: "Thiếu canonical sound id." },
      { status: 400 },
    );
  }

  const target = resolvePronunciationShadowTarget(soundIdValue);
  if (!target) {
    return NextResponse.json(
      { success: false, observation: null, error: "Canonical sound id không hợp lệ." },
      { status: 400 },
    );
  }

  if (!(audioValue instanceof File) || audioValue.size === 0) {
    return NextResponse.json(
      { success: false, observation: null, error: "Thiếu audio recording." },
      { status: 400 },
    );
  }

  if (audioValue.size > OPENPRONOUNCE_MAX_AUDIO_BYTES) {
    return NextResponse.json(
      { success: false, observation: null, error: "Audio recording quá lớn." },
      { status: 413 },
    );
  }

  if (!isAllowedPronunciationAudioType(audioValue.type)) {
    return NextResponse.json(
      { success: false, observation: null, error: "Định dạng audio không được hỗ trợ." },
      { status: 415 },
    );
  }

  const audioBytes = await audioValue.arrayBuffer();

  try {
    const upstream = await fetchProviderWithWakeRetry({
      endpoint,
      audioBytes,
      audioType: audioValue.type,
      audioName: audioValue.name,
      expectedWord: target.word,
    });

    if (!upstream.ok) {
      console.error("OpenPronounce shadow request failed", {
        status: upstream.status,
      });
      return NextResponse.json(
        {
          success: false,
          observation: null,
          error: "Acoustic analysis chưa dùng được cho lượt này.",
        },
        { status: 502 },
      );
    }

    let rawProviderPayload: unknown;
    try {
      rawProviderPayload = await upstream.json();
    } catch {
      rawProviderPayload = null;
    }

    const providerPayload = parseOpenPronounceProviderPayload(rawProviderPayload);
    if (!providerPayload) {
      console.error("OpenPronounce shadow returned an invalid bounded payload");
      return NextResponse.json(
        {
          success: false,
          observation: null,
          error: "Acoustic provider trả dữ liệu không hợp lệ.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        observation: toPronunciationShadowObservation(target, providerPayload),
        error: null,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    console.error("OpenPronounce shadow request failed before a usable observation", {
      reason: timedOut ? "timeout" : "network",
    });
    return NextResponse.json(
      {
        success: false,
        observation: null,
        error: timedOut
          ? "Acoustic analysis phản hồi quá chậm."
          : "Không kết nối được acoustic analysis service.",
      },
      { status: 502 },
    );
  }
}
