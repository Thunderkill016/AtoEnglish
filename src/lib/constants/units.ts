export interface UnitMetadata {
  id: string;
  title: string;
  description: string;
  level: string;
  route: string;
  xp: number;
  estimatedTime: number;
}

export const UNITS: UnitMetadata[] = [
  {
    id: "unit-1",
    title: "Unit 1: Greetings & Self-Introduction",
    description: "Học cách chào hỏi cơ bản, tự giới thiệu bản thân bằng tiếng Anh và thực hành phản xạ nói Shadowing / Roleplay.",
    level: "A1",
    route: "/learn/unit-1",
    xp: 80,
    estimatedTime: 40,
  },
  {
    id: "unit-2",
    title: "Unit 2: Daily Routines & Time",
    description: "Học từ vựng về hoạt động thường nhật và cách hỏi/trả lời về giờ giấc trong tiếng Anh.",
    level: "A1",
    route: "/learn/unit-2",
    xp: 80,
    estimatedTime: 40,
  },
  {
    id: "unit-3",
    title: "Unit 3: Family & Friends",
    description: "Mô tả gia đình, bạn bè và học cách sử dụng đại từ sở hữu cơ bản.",
    level: "A1",
    route: "/learn/unit-3",
    xp: 80,
    estimatedTime: 45,
  },
  {
    id: "unit-4",
    title: "Unit 4: Technology & Society",
    description: "Phân tích cấu trúc câu nâng cao và ý nghĩa của động từ khuyết thiếu trong văn cảnh thời đại số. Thực hành diễn đạt ý kiến trái chiều về tiến bộ công nghệ.",
    level: "B1",
    route: "/learn/unit-4",
    xp: 80,
    estimatedTime: 50,
  },
];
