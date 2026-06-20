import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(self), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            // Added *.sentry.io to connect-src for error reporting
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://browser.sentry-cdn.com; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' blob: data: https://lh3.googleusercontent.com https://*.supabase.co; " +
              "font-src 'self' data:; " +
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.sentry.io https://*.upstash.io; " +
              "media-src 'self' blob: data:; " +
              "object-src 'none';",
          },
        ],
      },
    ];
  },
  // Tách biệt thư mục build của Dev Server (.next-dev) và Production Build (.next)
  // để tránh xung đột làm lỗi Webpack cache dẫn đến mất CSS khi chạy build song song.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};

export default withSentryConfig(nextConfig, {
  // Sentry organization & project (set in env for CI)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Upload source maps to Sentry on production builds
  silent: !process.env.CI, // suppress output locally, show in CI
  widenClientFileUpload: true,

  // Automatically instrument Next.js data fetching methods
  autoInstrumentServerFunctions: true,

  // Hide source maps from client bundles (security)
  hideSourceMaps: true,

  // Disable Sentry completely if DSN not set (local dev without Sentry)
  disableServerWebpackPlugin: !process.env.NEXT_PUBLIC_SENTRY_DSN,
  disableClientWebpackPlugin: !process.env.NEXT_PUBLIC_SENTRY_DSN,
});
