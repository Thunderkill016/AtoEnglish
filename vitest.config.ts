import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const NODE_TESTS = [
  "src/__tests__/curriculum-quality.test.ts",
  "src/__tests__/learning-attempt-migration.test.ts",
];

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
    projects: [
      {
        extends: true,
        test: {
          name: "node-filesystem",
          environment: "node",
          include: NODE_TESTS,
        },
      },
      {
        extends: true,
        test: {
          name: "jsdom-unit",
          environment: "jsdom",
          include: ["src/**/*.{test,spec}.{ts,tsx}"],
          exclude: [
            "node_modules",
            ".next",
            ".next-dev",
            "src/__tests__/integration/**",
            ...NODE_TESTS,
          ],
        },
      },
    ],
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
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
