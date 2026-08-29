export type EvidenceSignal = {
  label: string;
  value: number;
  unit: string;
  note: string;
};

export type PreviewLessonStep = {
  id: string;
  eyebrow: string;
  title: string;
  instruction: string;
  english?: string;
  helper?: string;
};

export const marketEvidence: EvidenceSignal[] = [
  {
    label: "Cần lộ trình rõ ràng",
    value: 32,
    unit: "bài organic",
    note: "Tín hiệu nhu cầu mạnh nhất trong lớp organic đã adjudicate.",
  },
  {
    label: "Mất gốc / cần xây lại nền",
    value: 23,
    unit: "bài organic",
    note: "Người học không chỉ thiếu kiến thức; họ thiếu điểm bắt đầu đáng tin.",
  },
  {
    label: "Muốn giao tiếp / nói được",
    value: 14,
    unit: "bài organic",
    note: "Đầu ra nói cần xuất hiện trong learning loop, không đứng riêng thành tab phụ.",
  },
];

export const productEvidence: EvidenceSignal[] = [
  {
    label: "Performance / reliability",
    value: 33,
    unit: "người",
    note: "13 product threads: lag, lỗi và flow không ổn làm mất niềm tin.",
  },
  {
    label: "Trial / demo trước cam kết",
    value: 16,
    unit: "người",
    note: "10 product threads có tín hiệu muốn thử giá trị trước khi đăng ký.",
  },
  {
    label: "Content / pedagogy",
    value: 14,
    unit: "người",
    note: "10 product threads phản ánh bài học và cách dạy quan trọng hơn feature count.",
  },
];

export const curriculumInventory = {
  grammarConcepts: 145,
  lexicalEntries: 5325,
  cefr: [
    { level: "A1", count: 902 },
    { level: "A2", count: 872 },
    { level: "B1", count: 809 },
    { level: "B2", count: 1427 },
    { level: "C1", count: 1315 },
  ],
};

export const learnerSnapshot = {
  label: "False beginner",
  goal: "Nói được trong tình huống công việc ngắn",
  dailyMinutes: 12,
  currentAbility: "Nhận ra câu đơn giản nhưng lấy từ ra chậm khi phải nói",
  nextGap: "Tên + đánh vần + một câu xin nhắc lại",
};

export const todayMission = {
  day: 1,
  title: "Giới thiệu tên mà không đứng hình",
  subtitle: "Nói tên, đánh vần tên Việt và xử lý khi người kia nghe chưa rõ.",
  duration: "10–12 phút",
  canDo: "Sau bài này, anh có thể chào, nói tên, đánh vần và xin người đối diện nhắc lại.",
  targetChunks: [
    "Hi. My name is …",
    "That’s …",
    "Could you say that again?",
  ],
  grammarConstraint: "I’m / My name is — chỉ dùng như chunk phục vụ nhiệm vụ, không mở bài ngữ pháp rộng.",
  vocabularyConstraint: "Chỉ dùng từ/cụm A1 cần cho nhiệm vụ; không nhét vocabulary ngoài mục tiêu ngày.",
};

export const lessonSteps: PreviewLessonStep[] = [
  {
    id: "model",
    eyebrow: "01 · Model",
    title: "Nghe một mẫu ngắn",
    instruction: "Nghe trước. Không cần học thuộc từng chữ.",
    english: "Hi. My name is Minh. That’s M-I-N-H.",
    helper: "Nếp chỉ đưa đúng language cần cho task hôm nay.",
  },
  {
    id: "notice",
    eyebrow: "02 · Notice",
    title: "Nhìn ra 2 cụm sẽ dùng",
    instruction: "Tập trung vào khung nói, không học danh sách từ rời.",
    english: "My name is …  ·  That’s …",
    helper: "Grammar và vocabulary nằm dưới task, không biến thành hai môn riêng.",
  },
  {
    id: "retrieve",
    eyebrow: "03 · Retrieve",
    title: "Tự kéo câu ra khỏi trí nhớ",
    instruction: "Không nhìn nguyên mẫu. Điền câu anh sẽ nói.",
    helper: "Từ recognition chuyển sang retrieval trước khi nói tự do.",
  },
  {
    id: "transfer",
    eyebrow: "04 · Changed situation",
    title: "Đổi tình huống",
    instruction: "Một đồng nghiệp mới không nghe rõ tên anh. Hãy xử lý rồi giới thiệu lại.",
    english: "Sorry, what was your name?",
    helper: "Nếu chỉ lặp lại đúng màn hình cũ, Nếp chưa coi là usable.",
  },
  {
    id: "retry",
    eyebrow: "05 · Feedback → retry",
    title: "Sửa ít, nói lại ngay",
    instruction: "Nếp chỉ giữ 1–2 điểm sửa có tác động lớn rồi cho làm lại.",
    helper: "Một lỗi đúng hôm nay sẽ trở thành review item về sau.",
  },
];

export const reviewItems = [
  {
    phrase: "Could you say that again?",
    reason: "Đã cần gợi ý ở lần đầu",
    due: "Hôm nay",
    mode: "Recall trong tình huống mới",
  },
  {
    phrase: "That’s H-O-A-N-G.",
    reason: "Cần tăng tốc độ đánh vần",
    due: "Ngày mai",
    mode: "Nói từ cue, không nhìn câu mẫu",
  },
  {
    phrase: "My name is …",
    reason: "Chunk nền cho Day 1",
    due: "3 ngày nữa",
    mode: "Spaced retrieval",
  },
];

export const masteryPreview = [
  { label: "Hiểu mẫu", value: 100 },
  { label: "Gọi lại cụm", value: 72 },
  { label: "Tự nói", value: 58 },
  { label: "Đổi tình huống", value: 35 },
];
