#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  validateLessonContentStandard,
  l1CoverageRatio,
  LESSON_CONTENT_STANDARD,
} from "../src/lib/lessons/content-standard.ts";

const root = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(root, "..", "src/lib/data/units");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts")).sort();

let fail = 0;
console.log("=== Audit nội dung bài học ===\n");
console.log("Chuẩn L1:", LESSON_CONTENT_STANDARD.l1MinRatioByLevel);

for (const file of files) {
  const mod = await import(path.join(dir, file));
  const unit = mod.default ?? Object.values(mod)[0];
  const violations = validateLessonContentStandard(unit, file);
  const l1 = Math.round(l1CoverageRatio(unit) * 100);
  if (violations.length) {
    fail++;
    console.log(`❌ ${file} [${unit.level}] L1=${l1}%`);
    violations.forEach((v) => console.log(`   - ${v.message}`));
  } else {
    console.log(`✅ ${file} [${unit.level}] L1=${l1}%`);
  }
}

console.log(fail ? `\n${fail}/${files.length} CHƯA ĐẠT` : `\n${files.length}/${files.length} ĐẠT CHUẨN`);
process.exit(fail ? 1 : 0);