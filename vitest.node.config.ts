import { defineProject } from "vitest/config";
import { resolve } from "node:path";

export default defineProject({
  test: {
    name: "node-filesystem",
    environment: "node",
    globals: true,
    include: [
      "src/__tests__/curriculum-quality.test.ts",
      "src/__tests__/learning-attempt-migration.test.ts",
      "src/__tests__/lesson-content-standard.test.ts",
    ],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
