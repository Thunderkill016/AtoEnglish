import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { validateLessonContentStandard } from "@/lib/lessons/content-standard";

const unitsDir = path.join(__dirname, "../lib/data/units");
const files = fs.readdirSync(unitsDir).filter((f) => f.endsWith(".ts"));

/**
 * Gate chuẩn nội dung — autopilot phải pass trước khi đóng task content (TASK-057+).
 * Tách khỏi curriculum-quality để không block khi đang nâng chuẩn dần.
 */
describe("Lesson content standard (SDL)", () => {
  for (const file of files) {
    it(`${file} đạt chuẩn nội dung`, async () => {
      const mod = await import(path.join(unitsDir, file));
      const unit = mod.default ?? Object.values(mod)[0];
      const violations = validateLessonContentStandard(unit, file);
      expect(violations.map((v) => v.message).join("\n")).toBe("");
    });
  }
});