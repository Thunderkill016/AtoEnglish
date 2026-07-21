import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  next: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: mocks.createServerClient,
}));

vi.mock("next/server", () => ({
  NextResponse: {
    next: mocks.next,
    redirect: mocks.redirect,
  },
}));

import { updateSession } from "./session";

type CookieOptions = Record<string, unknown>;
type StoredCookie = { name: string; value: string; options?: CookieOptions };

type MockResponse = {
  cookies: {
    set: ReturnType<typeof vi.fn>;
    getAll: ReturnType<typeof vi.fn>;
  };
};

const originalEnv = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

function createResponse(): MockResponse {
  const stored: StoredCookie[] = [];

  return {
    cookies: {
      set: vi.fn((name: string, value: string, options?: CookieOptions) => {
        const existingIndex = stored.findIndex((cookie) => cookie.name === name);
        const cookie = { name, value, options };

        if (existingIndex >= 0) stored[existingIndex] = cookie;
        else stored.push(cookie);
      }),
      getAll: vi.fn(() => stored.map(({ name, value, options }) => ({ name, value, ...options }))),
    },
  };
}

function createRequest(pathname: string) {
  return {
    cookies: {
      getAll: vi.fn(() => [{ name: "existing", value: "cookie" }]),
      set: vi.fn(),
    },
    nextUrl: {
      pathname,
      clone: () => new URL(`http://localhost${pathname}`),
    },
  };
}

function arrangeSupabaseUser(user: { id: string } | null, refreshed = true) {
  mocks.createServerClient.mockImplementation(
    (_url: string, _key: string, options: { cookies: { setAll: (cookies: StoredCookie[]) => void } }) => ({
      auth: {
        getUser: vi.fn(async () => {
          if (refreshed) {
            options.cookies.setAll([
              {
                name: "sb-session",
                value: "refreshed-token",
                options: { path: "/", httpOnly: true, sameSite: "lax" },
              },
            ]);
          }

          return { data: { user } };
        }),
      },
    })
  );
}

describe("updateSession", () => {
  let nextResponses: MockResponse[];
  let redirectResponses: MockResponse[];
  let redirectUrls: string[];

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";

    nextResponses = [];
    redirectResponses = [];
    redirectUrls = [];

    mocks.next.mockImplementation(() => {
      const response = createResponse();
      nextResponses.push(response);
      return response;
    });

    mocks.redirect.mockImplementation((url: URL) => {
      redirectUrls.push(url.toString());
      const response = createResponse();
      redirectResponses.push(response);
      return response;
    });
  });

  afterEach(() => {
    if (originalEnv.url === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = originalEnv.url;

    if (originalEnv.key === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalEnv.key;
  });

  it("passes through without creating a Supabase client when environment variables are missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const request = createRequest("/progress");

    const response = await updateSession(request as never);

    expect(response).toBe(nextResponses[0]);
    expect(mocks.createServerClient).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("does not perform an auth lookup for a public route", async () => {
    const getUser = vi.fn();
    mocks.createServerClient.mockReturnValue({ auth: { getUser } });
    const request = createRequest("/");

    const response = await updateSession(request as never);

    expect(response).toBe(nextResponses[0]);
    expect(getUser).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("redirects an unauthenticated protected request to login and preserves refreshed cookies", async () => {
    arrangeSupabaseUser(null);
    const request = createRequest("/progress");

    const response = await updateSession(request as never);

    expect(response).toBe(redirectResponses[0]);
    expect(redirectUrls[0]).toBe("http://localhost/login?next=%2Fprogress&mode=login");
    expect(request.cookies.set).toHaveBeenCalledWith("sb-session", "refreshed-token");
    expect(redirectResponses[0].cookies.set).toHaveBeenCalledWith(
      "sb-session",
      "refreshed-token",
      expect.objectContaining({ path: "/", httpOnly: true, sameSite: "lax" })
    );
  });

  it("redirects an authenticated login request to the dashboard and preserves refreshed cookies", async () => {
    arrangeSupabaseUser({ id: "user-1" });
    const request = createRequest("/login");

    const response = await updateSession(request as never);

    expect(response).toBe(redirectResponses[0]);
    expect(redirectUrls[0]).toBe("http://localhost/dashboard");
    expect(redirectResponses[0].cookies.set).toHaveBeenCalledWith(
      "sb-session",
      "refreshed-token",
      expect.objectContaining({ path: "/", httpOnly: true, sameSite: "lax" })
    );
  });

  it("returns the refreshed pass-through response for an authenticated protected request", async () => {
    arrangeSupabaseUser({ id: "user-1" });
    const request = createRequest("/settings");

    const response = await updateSession(request as never);

    expect(response).toBe(nextResponses[1]);
    expect(nextResponses[1].cookies.set).toHaveBeenCalledWith(
      "sb-session",
      "refreshed-token",
      expect.objectContaining({ path: "/", httpOnly: true, sameSite: "lax" })
    );
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
});
