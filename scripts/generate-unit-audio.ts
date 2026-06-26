/**
 * Generate MP3 assets for a unit folder under public/audio/.
 * Usage: npx tsx scripts/generate-unit-audio.ts unit-a0-1
 *
 * Requires: gtts (devDependency) — Google Translate TTS, British English voice.
 */

import { mkdir } from "fs/promises";
import path from "path";
import gtts from "gtts";

import { unitA01 } from "../src/lib/data/units/unitA01";
import { unitA02 } from "../src/lib/data/units/unitA02";
import { unitA03 } from "../src/lib/data/units/unitA03";
import { unitA04 } from "../src/lib/data/units/unitA04";
import { unitA05 } from "../src/lib/data/units/unitA05";
import { unitA06 } from "../src/lib/data/units/unitA06";
import { unitA07 } from "../src/lib/data/units/unitA07";
import { unitA08 } from "../src/lib/data/units/unitA08";
import type { UnitData } from "../src/components/learn/UnitTemplate";

const UNITS: Record<string, UnitData> = {
  "unit-a0-1": unitA01,
  "unit-a0-2": unitA02,
  "unit-a0-3": unitA03,
  "unit-a0-4": unitA04,
  "unit-a0-5": unitA05,
  "unit-a0-6": unitA06,
  "unit-a0-7": unitA07,
  "unit-a0-8": unitA08,
};

function saveMp3(text: string, outPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tts = new gtts(text, "en");
    tts.save(outPath, (err: Error | null) => (err ? reject(err) : resolve()));
  });
}

function audioBasename(audioPath: string): string {
  return path.basename(audioPath);
}

async function generateUnit(unitId: string) {
  const unit = UNITS[unitId];
  if (!unit) {
    console.error(`Unknown unit: ${unitId}. Known: ${Object.keys(UNITS).join(", ")}`);
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), "public", "audio", unitId);
  await mkdir(outDir, { recursive: true });

  const jobs: Array<{ file: string; text: string }> = [];

  for (const v of unit.vocab) {
    if (v.audio) {
      jobs.push({ file: audioBasename(v.audio), text: v.word });
    }
  }

  const dialogues = unit.dialogues_list ?? (Array.isArray(unit.dialogues) ? unit.dialogues : unit.dialogues ? [unit.dialogues] : []);
  for (const d of dialogues) {
    if (d.audio && d.lines?.length) {
      const text = d.lines.map((l) => l.text).join(" ");
      jobs.push({ file: audioBasename(d.audio), text });
    }
  }

  console.log(`Generating ${jobs.length} clips → public/audio/${unitId}/`);

  for (const job of jobs) {
    const dest = path.join(outDir, job.file);
    process.stdout.write(`  ${job.file} ... `);
    await saveMp3(job.text, dest);
    console.log("ok");
  }

  console.log("Done.");
}

const unitId = process.argv[2] ?? "unit-a0-1";
generateUnit(unitId).catch((err) => {
  console.error(err);
  process.exit(1);
});