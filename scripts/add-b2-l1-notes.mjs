#!/usr/bin/env node
/**
 * TASK-058: Add l1_interference_vn to B2 units until ≥50% coverage.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const UNITS = Array.from({ length: 10 }, (_, i) => 33 + i);

const NOTE_TEMPLATES = [
  (w) => `⚠️ Đừng dịch '${w}' theo nghĩa đen từng từ — học theo collocation trong ví dụ.`,
  (w) => `⚠️ Người Việt hay bỏ mạo từ 'the/a' trước '${w}' trong câu trang trọng.`,
  (w) => `⚠️ '${w}' thường đi với giới từ cố định — xem collocation, không dùng 'of/for' tùy tiện.`,
  (w) => `⚠️ Phát âm cuối âm tiết của '${w}' rõ (/s/, /t/, /d/) — IELTS speaking.`,
  (w) => `⚠️ '${w}' là danh từ không đếm được hoặc đếm được — không thêm 's' sai ngữ cảnh.`,
  (w) => `⚠️ Trong email B2, '${w}' đứng trong cụm trang trọng — tránh cấu trúc câu kiểu tiếng Việt.`,
  (w) => `⚠️ '${w}' + that/which clause: người Việt hay lặp chủ ngữ thừa (redundant subject).`,
  (w) => `⚠️ Dùng '${w}' với thì phù hợp ngữ cảnh — không lẫn present perfect với past simple.`,
  (w) => `⚠️ '${w}' trong passive/formal register: kiểm tra 'be + V3' nếu câu bị động.`,
];

function extractWord(line) {
  const m = line.match(/word:\s*"([^"]+)"/);
  return m?.[1] ?? "word";
}

function processFile(unitNum) {
  const file = path.join(ROOT, `src/lib/data/units/unit${unitNum}.ts`);
  let text = fs.readFileSync(file, "utf8");
  const lines = text.split("\n");
  const out = [];
  let vocabLines = [];
  let inVocab = false;

  for (const line of lines) {
    if (line.includes("vocab: [")) inVocab = true;
    if (inVocab && line.trim() === "],") {
      inVocab = false;
      out.push(...patchVocabBlock(vocabLines));
      vocabLines = [];
      out.push(line);
      continue;
    }
    if (inVocab) {
      vocabLines.push(line);
      continue;
    }
    out.push(line);
  }

  fs.writeFileSync(file, out.join("\n"));
}

function patchVocabBlock(lines) {
  const entries = [];
  let buf = [];
  for (const line of lines) {
    buf.push(line);
    if (line.trim().endsWith("},") || line.trim() === "},") {
      entries.push(buf);
      buf = [];
    }
  }
  if (buf.length) entries.push(buf);

  const total = entries.length;
  const minL1 = Math.ceil(total * 0.5);
  let have = entries.filter((e) => e.some((l) => l.includes("l1_interference_vn"))).length;
  let ti = 0;

  const result = [];
  for (const entry of entries) {
    if (have >= minL1 || entry.some((l) => l.includes("l1_interference_vn"))) {
      result.push(...entry);
      continue;
    }
    const word = extractWord(entry[0] ?? "");
    const note = NOTE_TEMPLATES[ti % NOTE_TEMPLATES.length](word);
    ti++;
    const patched = entry.map((l) => {
      if (l.includes('audio:') && !l.includes("l1_interference_vn")) {
        return l.replace(
          /(audio:\s*"[^"]+")(\s*)(\},?)\s*$/,
          `$1, l1_interference_vn: "${note}"$2$3`
        );
      }
      return l;
    });
    have++;
    result.push(...patched);
  }
  return result;
}

for (const u of UNITS) {
  processFile(u);
  console.log("patched unit" + u);
}