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

// A1 Curriculum — 12 units — CEFR-aligned progression
// Grammar progression: To be → Wh-Q → Possessives → Present Simple →
//   like+V-ing → There is/are → How much → Countable/Uncountable →
//   Prepositions → Can/Can't → have/feel → Review
export const UNITS: UnitMetadata[] = [
  {
    id: "unit-1",
    title: "Unit 1: Greetings & Self-Introduction",
    description: "Học cách chào hỏi cơ bản, tự giới thiệu bản thân bằng tiếng Anh và thực hành phản xạ nói Shadowing / Roleplay.",
    level: "A1",
    route: "/learn/unit-1",
    xp: 80,
    estimatedTime: 40,
    tags: ["Từ vựng +12", "Giao tiếp", "To be"],
  },
  {
    id: "unit-2",
    title: "Unit 2: Personal Information",
    description: "Học cách hỏi và trả lời về thông tin cá nhân: tên, tuổi, nghề nghiệp và nơi sống bằng Wh- questions.",
    level: "A1",
    route: "/learn/unit-2",
    xp: 80,
    estimatedTime: 40,
    tags: ["Từ vựng +12", "Wh- Questions", "Nghề nghiệp"],
  },
  {
    id: "unit-3",
    title: "Unit 3: Family & Friends",
    description: "Mô tả gia đình, bạn bè và học cách sử dụng đại từ sở hữu cơ bản (my, his, her, their...).",
    level: "A1",
    route: "/learn/unit-3",
    xp: 80,
    estimatedTime: 45,
    tags: ["Từ vựng +12", "Gia đình", "Đại từ sở hữu"],
  },
  {
    id: "unit-4",
    title: "Unit 4: Daily Routines",
    description: "Học từ vựng về hoạt động thường nhật và cách dùng thì Hiện Tại Đơn để mô tả thói quen.",
    level: "A1",
    route: "/learn/unit-4",
    xp: 80,
    estimatedTime: 45,
    tags: ["Từ vựng +12", "Lịch trình", "Present Simple"],
  },
  {
    id: "unit-5",
    title: "Unit 5: Free Time & Hobbies",
    description: "Học cách nói về sở thích và hoạt động giải trí bằng cấu trúc 'like + V-ing'.",
    level: "A1",
    route: "/learn/unit-5",
    xp: 80,
    estimatedTime: 40,
    tags: ["Từ vựng +12", "Sở thích", "like + V-ing"],
  },
  {
    id: "unit-6",
    title: "Unit 6: Home & Daily Life",
    description: "Học từ vựng về nhà ở, đồ đạc và cách dùng 'There is/are' để mô tả không gian.",
    level: "A1",
    route: "/learn/unit-6",
    xp: 80,
    estimatedTime: 40,
    tags: ["Từ vựng +12", "Nhà cửa", "There is/are"],
  },
  {
    id: "unit-7",
    title: "Unit 7: Shopping & Prices",
    description: "Học từ vựng mua sắm, cách hỏi giá bằng 'How much is/are...?' và mặc cả tự nhiên.",
    level: "A1",
    route: "/learn/unit-7",
    xp: 85,
    estimatedTime: 45,
    tags: ["Từ vựng +12", "Mua sắm", "How much"],
  },
  {
    id: "unit-8",
    title: "Unit 8: Food & Ordering",
    description: "Học từ vựng đồ ăn, cách gọi món và phân biệt Countable/Uncountable nouns.",
    level: "A1",
    route: "/learn/unit-8",
    xp: 80,
    estimatedTime: 40,
    tags: ["Từ vựng +12", "Đồ ăn", "Countable/Uncountable"],
  },
  {
    id: "unit-9",
    title: "Unit 9: Places & Directions",
    description: "Học từ vựng địa điểm, cách hỏi và chỉ đường bằng giới từ nơi chốn (next to, opposite, between).",
    level: "A1",
    route: "/learn/unit-9",
    xp: 80,
    estimatedTime: 45,
    tags: ["Từ vựng +12", "Địa điểm", "Giới từ"],
  },
  {
    id: "unit-10",
    title: "Unit 10: Abilities & Daily Skills",
    description: "Học cách nói về khả năng bản thân bằng 'can/can't' và hỏi về kỹ năng của người khác.",
    level: "A1",
    route: "/learn/unit-10",
    xp: 80,
    estimatedTime: 40,
    tags: ["Từ vựng +12", "Kỹ năng", "Can / Can't"],
  },
  {
    id: "unit-11",
    title: "Unit 11: Health & Feelings",
    description: "Học từ vựng về sức khỏe, cảm xúc và cách diễn đạt tình trạng bản thân bằng 'have/feel'.",
    level: "A1",
    route: "/learn/unit-11",
    xp: 80,
    estimatedTime: 40,
    tags: ["Từ vựng +12", "Sức khỏe", "have / feel"],
  },
  {
    id: "unit-12",
    title: "Unit 12: Review & Real-life Application",
    description: "Ôn tập toàn bộ ngữ pháp và từ vựng A1, áp dụng vào các tình huống giao tiếp thực tế. Tổng hợp hành trình A1.",
    level: "A1",
    route: "/learn/unit-12",
    xp: 120,
    estimatedTime: 60,
    tags: ["Ôn tập tổng hợp", "Giao tiếp thực tế", "A1 Complete"],
  },
];
