import { readFile } from "node:fs/promises";

import {
  createSyntheticLearnerModelBenchmarkDataset,
  runLearnerModelBenchmark,
} from "../src/lib/learning/benchmark/learner-model-benchmark";

async function loadDataset(argument: string | undefined) {
  if (!argument || argument === "--synthetic") {
    return createSyntheticLearnerModelBenchmarkDataset();
  }
  const raw = await readFile(argument, "utf8");
  return JSON.parse(raw) as unknown;
}

async function main() {
  const dataset = await loadDataset(process.argv[2]);
  const report = runLearnerModelBenchmark(dataset);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Learner-model benchmark failed: ${message}\n`);
  process.exitCode = 1;
});
