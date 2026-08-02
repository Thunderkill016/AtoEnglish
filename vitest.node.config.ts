import { defineProject } from "vitest/config";
import { resolve } from "node:path";

const REAL_TALK_NODE_TESTS = [
  "src/__tests__/real-talk-generation-contract.test.ts",
  "src/__tests__/real-talk-generation-result.test.ts",
  "src/__tests__/real-talk-transcript-source-policy.test.ts",
  "src/__tests__/real-talk-generation-action.test.ts",
  "src/__tests__/real-talk-migration-contract.test.ts",
  "src/__tests__/real-talk-draft-mapping.test.ts",
];

export default defineProject({
  test: {
    name: "node-filesystem",
    environment: "node",
    globals: true,
    include: [
      "src/__tests__/architecture-boundaries.test.ts",
      "src/__tests__/curriculum-quality.test.ts",
      "src/__tests__/learning-attempt-migration.test.ts",
      "src/__tests__/lesson-content-standard.test.ts",
      ...REAL_TALK_NODE_TESTS,
    ],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
