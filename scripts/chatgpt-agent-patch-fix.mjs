import fs from "node:fs";

const file = "scripts/chatgpt-agent-patch.mjs";
let text = fs.readFileSync(file, "utf8");

const beforeA = '"]) (\\"derives $name and preserves the completeUnit action contract\\", async ({ unit, score, stars, xp }) => {"';
const afterA = '"])(\\"derives $name and preserves the completeUnit action contract\\", async ({ unit, score, stars, xp }) => {"';
const beforeB = '"]) (\\"derives $name and preserves the completeUnit action contract\\", async ({ unit, score, stars }) => {"';
const afterB = '"])(\\"derives $name and preserves the completeUnit action contract\\", async ({ unit, score, stars }) => {"';

for (const [label, before, after] of [
  ["before marker", beforeA, afterA],
  ["after marker", beforeB, afterB],
]) {
  if (!text.includes(before)) throw new Error(`Missing ${label}`);
  text = text.replace(before, after);
}

fs.writeFileSync(file, text);
console.log("Corrected UnitTemplate test marker in patch script.");
