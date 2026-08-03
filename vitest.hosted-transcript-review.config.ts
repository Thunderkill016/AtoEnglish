import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: [
      "src/__tests__/integration/real-talk-transcript-review-hosted.integration.test.ts",
    ],
    testTimeout: 60_000,
    hookTimeout: 30_000,
    pool: "forks",
    maxWorkers: 1,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});