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

const roleplayFile = "src/app/(main)/speaking/ai-roleplay.tsx";
let roleplay = fs.readFileSync(roleplayFile, "utf8");
const roleplayConfettiImport = 'import confetti from "canvas-confetti";\n';
const roleplayConfettiBlock = '    confetti({\n      particleCount: 100,\n      spread: 70,\n      origin: { y: 0.6 }\n    });\n';
const roleplayXpToast = '    if (saveRes.success && saveRes.xpEarned) {\n      toast.success(`+${saveRes.xpEarned} XP — buổi hội thoại đã được lưu!`);\n    } else if (saveRes.success) {';
const roleplayNeutralToast = '    if (saveRes.success && saveRes.xpEarned) {\n      toast.success("Buổi hội thoại đã được lưu.");\n    } else if (saveRes.success) {';
if (!roleplay.includes(roleplayConfettiImport)) throw new Error("Missing roleplay confetti import");
if (!roleplay.includes(roleplayConfettiBlock)) throw new Error("Missing roleplay confetti block");
if (!roleplay.includes(roleplayXpToast)) throw new Error("Missing roleplay XP toast");
roleplay = roleplay
  .replace(roleplayConfettiImport, "")
  .replace(roleplayConfettiBlock, "")
  .replace(roleplayXpToast, roleplayNeutralToast);
fs.writeFileSync(roleplayFile, roleplay);

const shadowingFile = "src/app/(main)/speaking/shadowing-practice.tsx";
let shadowing = fs.readFileSync(shadowingFile, "utf8");
const shadowingConfettiImport = 'import confetti from "canvas-confetti";\n';
const shadowingConfettiBlock = '              confetti({\n                particleCount: 80,\n                spread: 60,\n                origin: { y: 0.7 }\n              });\n';
const shadowingXpToast = '            if (saveRes.success && saveRes.xpEarned) {\n              toast.success(`+${saveRes.xpEarned} XP — tiếp tục luyện hàng ngày!`);\n            } else if (saveRes.success) {';
const shadowingNeutralToast = '            if (saveRes.success && saveRes.xpEarned) {\n              toast.success("Buổi luyện nói đã được lưu.");\n            } else if (saveRes.success) {';
if (!shadowing.includes(shadowingConfettiImport)) throw new Error("Missing shadowing confetti import");
if (!shadowing.includes(shadowingConfettiBlock)) throw new Error("Missing shadowing confetti block");
if (!shadowing.includes(shadowingXpToast)) throw new Error("Missing shadowing XP toast");
shadowing = shadowing
  .replace(shadowingConfettiImport, "")
  .replace(shadowingConfettiBlock, "")
  .replace(shadowingXpToast, shadowingNeutralToast);
fs.writeFileSync(shadowingFile, shadowing);

console.log("Corrected patch markers and retired stale celebration code.");
