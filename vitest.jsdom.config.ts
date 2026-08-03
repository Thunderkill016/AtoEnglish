import react from "@vitejs/plugin-react";
import { configDefaults, defineProject } from "vitest/config";
import { resolve } from "node:path";

const NODE_TESTS = [
  "src/__tests__/curriculum-quality.test.ts",
  "src/__tests__/learning-attempt-migration.test.ts",
  "src/__tests__/lesson-content-standard.test.ts",
  "src/__tests__/real-talk-generation-contract.test.ts",
  "src/__tests__/real-talk-generation-result.test.ts",
  "src/__tests__/real-talk-transcript-source-policy.test.ts",
  "src/__tests__/real-talk-transcript-provenance-migration.test.ts",
  "src/__tests__/real-talk-trusted-transcript-ingestion.test.ts",
  "src/__tests__/real-talk-reviewed-transcript-adapter.test.ts",
  "src/__tests__/real-talk-generation-action.test.ts",
  "src/__tests__/real-talk-migration-contract.test.ts",
  "src/__tests__/real-talk-atomic-draft-migration.test.ts",
  "src/__tests__/real-talk-rls-performance-migration.test.ts",
  "src/__tests__/real-talk-draft-mapping.test.ts",
  "src/__tests__/real-talk-youtube-source.test.ts",
];

export default defineProject({
  plugins: [react()],
  test: {
    name: "jsdom-unit",
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      ...configDefaults.exclude,
      "src/__tests__/integration/**",
      ...NODE_TESTS,
    ],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});