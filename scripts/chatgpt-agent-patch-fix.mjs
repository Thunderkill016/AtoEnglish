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

const checkpointFile = "src/app/(main)/checkpoint/[phase]/CheckpointClient.tsx";
let checkpoint = fs.readFileSync(checkpointFile, "utf8");
const confettiImport = 'import confetti from "canvas-confetti";\n';
const confettiEffect = '  useEffect(() => {\n    if (finished && passed) {\n      confetti({ particleCount: 200, spread: 90, origin: { y: 0.5 }, colors: ["#10b981", "#3b82f6", "#f59e0b"] });\n    }\n  }, [finished, passed]);\n\n';
if (!checkpoint.includes(confettiImport)) throw new Error("Missing checkpoint confetti import");
if (!checkpoint.includes(confettiEffect)) throw new Error("Missing checkpoint confetti effect");
checkpoint = checkpoint.replace(confettiImport, "").replace(confettiEffect, "");
fs.writeFileSync(checkpointFile, checkpoint);

const flashcardsFile = "src/app/(main)/flashcards/FlashcardsClient.tsx";
let flashcards = fs.readFileSync(flashcardsFile, "utf8");
const flashcardsConfettiImport = 'import confetti from "canvas-confetti";\n';
const flashcardsConfettiBlock = '          confetti({\n            particleCount: 150,\n            spread: 80,\n            origin: { y: 0.5 },\n            colors: ["#10b981", "#3b82f6", "#f59e0b"]\n          });\n';
if (!flashcards.includes(flashcardsConfettiImport)) throw new Error("Missing flashcards confetti import");
if (!flashcards.includes(flashcardsConfettiBlock)) throw new Error("Missing flashcards confetti block");
flashcards = flashcards.replace(flashcardsConfettiImport, "").replace(flashcardsConfettiBlock, "");
fs.writeFileSync(flashcardsFile, flashcards);

console.log("Corrected patch markers and retired stale celebration code.");
