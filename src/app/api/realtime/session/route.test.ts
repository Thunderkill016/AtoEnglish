import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  after: vi.fn(),
  checkRateLimit: vi.fn(),
  resolveConversationInstructions: vi.fn(),
  startGuard: vi.fn(),
  getUser: vi.fn(),
  fetch: vi.fn(),
}));

vi.mock("next/server", () => ({
  after: mocks.after,
  NextResponse: {
    json: (body: unknown, init?: ResponseInit) => Response.json(body, init),
  },
}));

vi.mock("@/lib/security/rate-limit", () => ({
  createRateLimiter: () => ({ check: mocks.checkRateLimit }),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser: mocks.getUser },
  }),
}));

vi.mock("@/lib/realtime/session-task", () => ({
  resolveRealtimeConversationInstructions: mocks.resolveConversationInstructions,
}));

vi.mock("@/lib/realtime/sideband-guard", () => ({
  startRealtimeConversationGuard: mocks.startGuard,
}));

import { POST } from "@/app/api/realtime/session/route";

const SDP_OFFER = [
  "v=0",
  "o=- 1 1 IN IP4 127.0.0.1",
  "s=-",
  "t=0 0",
  "m=audio 9 UDP/TLS/RTP/SAVPF 111",
].join("\r\n");

function request(mode: "capture" | "conversation") {
  return new Request("http://localhost/api/realtime/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/sdp",
      "X-AtoEnglish-Realtime-Mode": mode,
    },
    body: SDP_OFFER,
  });
}

function providerResponse(location?: string) {
  const headers = new Headers({ "Content-Type": "application/sdp" });
  if (location) headers.set("Location", location);
  return new Response("v=0\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111\r\n", {
    status: 200,
    headers,
  });
}

describe("POST /api/realtime/session", () => {
  beforeEach(() => {
    process.env.OPENAI_API_KEY = "test-openai-key";
    mocks.after.mockReset();
    mocks.checkRateLimit.mockReset().mockResolvedValue({ success: true });
    mocks.resolveConversationInstructions.mockReset().mockReturnValue("Trusted canonical roleplay.");
    mocks.startGuard.mockReset().mockResolvedValue({ done: Promise.resolve() });
    mocks.getUser.mockReset().mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mocks.fetch.mockReset();
    vi.stubGlobal("fetch", mocks.fetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.OPENAI_API_KEY;
  });

  it("returns conversation SDP only after a valid call id is guarded", async () => {
    mocks.fetch.mockResolvedValue(providerResponse("/v1/realtime/calls/rtc_test123"));

    const response = await POST(request("conversation"));

    expect(response.status).toBe(200);
    expect(await response.text()).toContain("v=0");
    expect(mocks.startGuard).toHaveBeenCalledWith({
      callId: "rtc_test123",
      apiKey: "test-openai-key",
    });
    expect(mocks.after).toHaveBeenCalledOnce();

    const keepAlive = mocks.after.mock.calls[0]?.[0] as (() => Promise<void>) | undefined;
    expect(keepAlive).toBeTypeOf("function");
    await expect(keepAlive?.()).resolves.toBeUndefined();
  });

  it("fails closed when a conversation response has no valid call Location", async () => {
    mocks.fetch.mockResolvedValue(providerResponse());

    const response = await POST(request("conversation"));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      success: false,
      error: "Realtime provider không trả call identity hợp lệ.",
    });
    expect(mocks.startGuard).not.toHaveBeenCalled();
    expect(mocks.after).not.toHaveBeenCalled();
  });

  it("fails closed when the trusted sideband guard cannot attach", async () => {
    mocks.fetch.mockResolvedValue(providerResponse("/v1/realtime/calls/rtc_test123"));
    mocks.startGuard.mockRejectedValue(new Error("sideband unavailable"));

    const response = await POST(request("conversation"));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      success: false,
      error: "Không mở được realtime conversation an toàn.",
    });
    expect(mocks.after).not.toHaveBeenCalled();
  });

  it("keeps capture mode independent from sideband call identity", async () => {
    mocks.fetch.mockResolvedValue(providerResponse());

    const response = await POST(request("capture"));

    expect(response.status).toBe(200);
    expect(mocks.resolveConversationInstructions).not.toHaveBeenCalled();
    expect(mocks.startGuard).not.toHaveBeenCalled();
    expect(mocks.after).not.toHaveBeenCalled();
  });
});
