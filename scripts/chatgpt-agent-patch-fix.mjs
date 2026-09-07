import fs from "node:fs";

const scriptFile = "scripts/chatgpt-agent-patch.mjs";
let script = fs.readFileSync(scriptFile, "utf8");

for (const [label, before, after] of [
  [
    "before marker",
    '"]) (\\"derives $name and preserves the completeUnit action contract\\", async ({ unit, score, stars, xp }) => {"',
    '"])(\\"derives $name and preserves the completeUnit action contract\\", async ({ unit, score, stars, xp }) => {"',
  ],
  [
    "after marker",
    '"]) (\\"derives $name and preserves the completeUnit action contract\\", async ({ unit, score, stars }) => {"',
    '"])(\\"derives $name and preserves the completeUnit action contract\\", async ({ unit, score, stars }) => {"',
  ],
]) {
  if (!script.includes(before)) throw new Error(`Missing ${label}`);
  script = script.replace(before, after);
}
fs.writeFileSync(scriptFile, script);

const testFile = "src/components/learn/UnitTemplate.test.tsx";
let test = fs.readFileSync(testFile, "utf8");
const staleReset = "  streakMocks.checkMilestone.mockReset();\n  streakMocks.dismissMilestone.mockReset();\n";
if (!test.includes(staleReset)) throw new Error("Missing stale streak mock resets");
test = test.replace(staleReset, "");
fs.writeFileSync(testFile, test);

console.log("Corrected patch marker and removed stale streak test resets.");
