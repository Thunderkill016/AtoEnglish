import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: [
      "src/__tests__/integration/real-talk-server-action-hosted.integration.test.ts",
    ],
    testTimeout: 60_000,
    hookTimeout: 60_000,
    sequence: { concurrent: false },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "server-only": resolve(
        __dirname,
        "./src/__tests__/helpers/server-only-stub.ts",
      ),
    },
  },
});
