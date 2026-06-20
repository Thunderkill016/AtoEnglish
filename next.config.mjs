import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "sonner"],
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
    const isDev = process.env.NODE_ENV === "development";

    // In production: no unsafe-eval. In dev: Next.js HMR needs it.
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://browser.sentry-cdn.com; "
      : "script-src 'self' 'unsafe-inline' https://browser.sentry-cdn.com https://va.vercel-scripts.com; ";

    const csp = [
      "default-src 'self'; ",
      scriptSrc,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ",
      "img-src 'self' blob: data: https://lh3.googleusercontent.com https://*.supabase.co; ",
      "font-src 'self' data: https://fonts.gstatic.com; ",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.sentry.io https://*.upstash.io https://vitals.vercel-insights.com; ",
      "media-src 'self' blob: data:; ",
      "object-src 'none'; ",
      "worker-src 'self' blob:; ",
      "form-action 'self'; ",
      "frame-ancestors 'none'; ",
      "base-uri 'self';",
    ].join("");

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
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Content-Security-Policy",
            value: csp,
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
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableServerWebpackPlugin: !process.env.NEXT_PUBLIC_SENTRY_DSN,
  disableClientWebpackPlugin: !process.env.NEXT_PUBLIC_SENTRY_DSN,
  webpack: {
    autoInstrumentServerFunctions: true,
  },
});
