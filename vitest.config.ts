import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", ".next-dev", "src/__tests__/integration/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      // Only measure coverage for pure utility/logic files — not Server Components,
      // Supabase clients, or React components that require live runtime/DB.
      include: [
        "src/lib/auth-check.ts",
        "src/lib/security/**/*.ts",
        "src/lib/srs/**/*.ts",
        "src/lib/utils/**/*.ts",
      ],
      exclude: ["src/**/*.{test,spec}.{ts,tsx}", "src/__tests__/**"],
      thresholds: {
        lines: 70,
        functions: 55,   // Upstash Redis impl can't be unit-tested without live Redis
        branches: 60,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
