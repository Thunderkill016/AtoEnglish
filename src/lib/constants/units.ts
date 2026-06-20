export interface UnitMetadata {
  id: string;
  title: string;
  description: string;
  level: string;
  route: string;
  xp: number;
  estimatedTime: number;
  tags: string[];
}

// CEFR-correct order: A1 → A1 → A1 → A2 → B1
// unit-4 = A2 Shopping, unit-5 = B1 Technology (swapped from original)
export const UNITS: UnitMetadata[] = [
  {
    id: "unit-1",
    title: "Unit 1: Greetings & Self-Introduction",
    description: "Học cách chào hỏi cơ bản, tự giới thiệu bản thân bằng tiếng Anh và thực hành phản xạ nói Shadowing / Roleplay.",
    level: "A1",
    route: "/learn/unit-1",
    xp: 80,
    estimatedTime: 40,
    tags: ["Từ vựng +12", "Giao tiếp", "Phát âm"],
  },
  {
    id: "unit-2",
    title: "Unit 2: Daily Routines & Time",
    description: "Học từ vựng về hoạt động thường nhật và cách hỏi/trả lời về giờ giấc trong tiếng Anh.",
    level: "A1",
    route: "/learn/unit-2",
    xp: 80,
    estimatedTime: 40,
    tags: ["Từ vựng +10", "Lịch trình", "Thì hiện tại"],
  },
  {
    id: "unit-3",
    title: "Unit 3: Family & Friends",
    description: "Mô tả gia đình, bạn bè và học cách sử dụng đại từ sở hữu cơ bản.",
    level: "A1",
    route: "/learn/unit-3",
    xp: 80,
    estimatedTime: 45,
    tags: ["Từ vựng +10", "Gia đình", "Đại từ sở hữu"],
  },
  {
    // A2 level — correct CEFR progression (was B1, now A2)
    id: "unit-4",
    title: "Unit 4: Shopping & Prices",
    description: "Học từ vựng mua sắm, cách hỏi giá và thương lượng. Sử dụng Comparatives để so sánh sản phẩm và giá cả trong tình huống thực tế.",
    level: "A2",
    route: "/learn/unit-4",
    xp: 90,
    estimatedTime: 45,
    tags: ["Từ vựng +8", "Mua sắm", "Comparatives"],
  },
  {
    // B1 level — correct CEFR progression (was A2, now B1)
    id: "unit-5",
    title: "Unit 5: Technology & Society",
    description: "Phân tích cấu trúc câu nâng cao và ý nghĩa của động từ khuyết thiếu trong văn cảnh thời đại số. Thực hành diễn đạt ý kiến trái chiều về tiến bộ công nghệ.",
    level: "B1",
    route: "/learn/unit-5",
    xp: 80,
    estimatedTime: 50,
    tags: ["Từ vựng +15", "Công nghệ", "Modal Verbs"],
  },
];
