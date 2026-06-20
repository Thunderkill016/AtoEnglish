import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Session Replay (chỉ production để giảm quota)
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,

  // Chỉ hiển thị Sentry debug trong development
  debug: process.env.NODE_ENV === "development",

  // Không gửi errors trong development
  enabled: process.env.NODE_ENV === "production",

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: false,
    }),
  ],

  // Bỏ qua các lỗi không liên quan
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
    /^Network Error$/,
    /^Failed to fetch$/,
    /ChunkLoadError/,
  ],

  // Gắn thêm context
  beforeSend(event) {
    // Không gửi lỗi rate limit (chúng đã được xử lý đúng cách)
    if (event.exception?.values?.[0]?.value?.includes("Too Many Requests")) {
      return null;
    }
    return event;
  },
});
