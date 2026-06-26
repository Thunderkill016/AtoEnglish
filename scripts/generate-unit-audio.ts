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
import { unit1 } from "../src/lib/data/units/unit1";
import { unit2 } from "../src/lib/data/units/unit2";
import { unit3 } from "../src/lib/data/units/unit3";
import { unit4 } from "../src/lib/data/units/unit4";
import { unit5 } from "../src/lib/data/units/unit5";
import { unit6 } from "../src/lib/data/units/unit6";
import { unit7 } from "../src/lib/data/units/unit7";
import { unit8 } from "../src/lib/data/units/unit8";
import { unit9 } from "../src/lib/data/units/unit9";
import { unit10 } from "../src/lib/data/units/unit10";
import { unit11 } from "../src/lib/data/units/unit11";
import { unit12 } from "../src/lib/data/units/unit12";
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
  "unit-1": unit1,
  "unit-2": unit2,
  "unit-3": unit3,
  "unit-4": unit4,
  "unit-5": unit5,
  "unit-6": unit6,
  "unit-7": unit7,
  "unit-8": unit8,
  "unit-9": unit9,
  "unit-10": unit10,
  "unit-11": unit11,
  "unit-12": unit12,
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