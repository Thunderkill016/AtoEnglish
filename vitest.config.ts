import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["./vitest.node.config.ts", "./vitest.jsdom.config.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "src/lib/auth-check.ts",
        "src/lib/security/**/*.ts",
        "src/lib/srs/**/*.ts",
        "src/lib/utils/**/*.ts",
      ],
      exclude: ["src/**/*.{test,spec}.{ts,tsx}", "src/__tests__/**"],
      thresholds: {
        lines: 70,
        functions: 55,
        branches: 60,
        statements: 70,
      },
    },
  },
});
