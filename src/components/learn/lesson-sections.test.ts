import { describe, expect, it } from "vitest";

import {
  SECTION_LABELS,
  SECTION_ORDER,
  TOTAL_SECTIONS,
} from "./lesson-sections";

describe("lesson section constants", () => {
  it("preserves the pedagogical section order", () => {
    expect(SECTION_ORDER).toEqual([1, 2, 3, 4, 5, 10, 9, 6, 7, 8]);
    expect(TOTAL_SECTIONS).toBe(10);
  });

  it("preserves the current labels for every section", () => {
    expect(SECTION_LABELS).toEqual({
      1: "Khởi động",
      2: "Từ vựng",
      3: "Ngữ pháp",
      4: "Luyện tập",
      5: "Hội thoại",
      10: "Phản xạ",
      9: "Dịch câu",
      6: "Shadowing",
      7: "Luyện nói",
      8: "Hoàn thành",
    });
  });
});
