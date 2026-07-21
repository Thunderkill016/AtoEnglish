export const SECTION_LABELS: Record<number, string> = {
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
};

export const SECTION_ORDER = [1, 2, 3, 4, 5, 10, 9, 6, 7, 8] as const;

export type SectionNumber = (typeof SECTION_ORDER)[number];

export const TOTAL_SECTIONS = SECTION_ORDER.length;
