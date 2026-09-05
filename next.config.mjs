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
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Rewrite legacy no-hyphen audio paths (data declares /audio/unit19/...) to actual folders (unit-19/)
  // This makes native MP3 probe return 200; playUnitAudio uses native instead of TTS fallback.
  async rewrites() {
    return [
      {
        source: "/audio/unit(\\d+)/(.*)",
        destination: "/audio/unit-$1/$2",
      },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    // Dev keeps unsafe-eval for Next.js HMR. Production only permits the
    // narrower wasm-unsafe-eval needed by the local pronunciation WASM fallback.
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' 'unsafe-inline' https://browser.sentry-cdn.com https://cdn.jsdelivr.net; "
      : "script-src 'self' 'wasm-unsafe-eval' 'unsafe-inline' https://browser.sentry-cdn.com https://va.vercel-scripts.com https://cdn.jsdelivr.net; ";

    const csp = [
      "default-src 'self'; ",
      scriptSrc,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ",
      "img-src 'self' blob: data: https://lh3.googleusercontent.com https://*.supabase.co https://i.ytimg.com; ",
      "frame-src https://www.youtube-nocookie.com; ",
      "font-src 'self' data: https://fonts.gstatic.com; ",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.sentry.io https://*.upstash.io https://vitals.vercel-insights.com https://cdn.jsdelivr.net https://huggingface.co https://*.huggingface.co https://*.hf.co https://*.xethub.hf.co; ",
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
