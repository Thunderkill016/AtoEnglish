import { describe, expect, it } from "vitest";

import { resolveUnitPageMetadata } from "@/lib/lessons/unit-page-metadata";

describe("unit page metadata", () => {
  it("uses lesson data only for Gold Day 1", () => {
    expect(
      resolveUnitPageMetadata("unit-a0-1", {
        title: "Day 1: Nói tên và đánh vần",
        description: "Gold Day 1 description",
      }),
    ).toEqual({
      title: "Day 1: Nói tên và đánh vần",
      description: "Gold Day 1 description",
    });
  });

  it("preserves the existing catalog metadata for other units", () => {
    expect(
      resolveUnitPageMetadata("unit-a0-2", {
        title: "Unit A0-2: Số Đếm & Giá Tiền",
        description: "Lesson-data description that must not replace the catalog",
      }),
    ).toEqual({
      title: "Unit A0-2: Số Đếm & Đếm Số",
      description:
        "Học số từ 1–20 và cách hỏi giá tiền — từ vựng thiết yếu trong mọi giao dịch hàng ngày.",
    });
  });

  it("returns null for an unknown unit", () => {
    expect(resolveUnitPageMetadata("missing-unit")).toBeNull();
  });
});
