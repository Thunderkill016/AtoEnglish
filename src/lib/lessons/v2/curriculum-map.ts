import type {
  CefrLevel,
  CommunicativeActivity,
  LessonDomain,
} from "./schema";

export type MissionMigrationDecision = "rewrite" | "split" | "merge-candidate";

export interface CurriculumMissionPlan {
  legacyUnitId: string;
  level: CefrLevel;
  titleVi: string;
  primaryActivity: CommunicativeActivity;
  domain: LessonDomain;
  canDoVi: string;
  migration: MissionMigrationDecision;
  notes?: string;
}

/**
 * First complete map from the 50 legacy routes to action-oriented missions.
 * Can-do wording is still Ato-adapted and must be checked against the official
 * CEFR descriptor set before individual lessons are marked production-ready.
 */
export const CURRICULUM_MISSION_MAP: CurriculumMissionPlan[] = [
  // ── Pre-A1 (legacy A0) ────────────────────────────────────────────────────
  {
    legacyUnitId: "unit-a0-1",
    level: "PRE_A1",
    titleVi: "Nói tên, đánh vần tên và xin người khác nói chậm",
    primaryActivity: "interaction",
    domain: "occupational",
    canDoVi:
      "Có thể dùng cụm từ rất cơ bản để nói tên, đánh vần và yêu cầu người đối diện nói chậm hoặc lặp lại.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-a0-2",
    level: "PRE_A1",
    titleVi: "Hiểu giá, nói số tiền và thanh toán đơn giản",
    primaryActivity: "interaction",
    domain: "public",
    canDoVi:
      "Có thể hiểu và nói các số, giá tiền rất quen thuộc trong một giao dịch ngắn có hỗ trợ.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-a0-3",
    level: "PRE_A1",
    titleVi: "Chỉ đúng đồ vật bằng màu sắc và kích thước",
    primaryActivity: "interaction",
    domain: "public",
    canDoVi:
      "Có thể nhận biết và dùng từ cơ bản về màu sắc, kích thước để chỉ một đồ vật cụ thể.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-a0-4",
    level: "PRE_A1",
    titleVi: "Chào, đáp lại và kết thúc một cuộc gặp ngắn",
    primaryActivity: "interaction",
    domain: "personal",
    canDoVi:
      "Có thể dùng và hiểu các lời chào, cảm ơn, xin lỗi và tạm biệt rất thông dụng.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-a0-5",
    level: "PRE_A1",
    titleVi: "Cho biết thông tin cá nhân tối thiểu",
    primaryActivity: "production",
    domain: "public",
    canDoVi:
      "Có thể nói hoặc điền tên, tuổi, quốc gia và thành phố bằng từ và cụm từ cơ bản.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-a0-6",
    level: "PRE_A1",
    titleVi: "Nói ai là người thân của mình",
    primaryActivity: "production",
    domain: "personal",
    canDoVi:
      "Có thể chỉ người trong ảnh và nói quan hệ gia đình bằng các cụm từ rất cơ bản.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-a0-7",
    level: "PRE_A1",
    titleVi: "Hiểu giờ và xác nhận một lịch hẹn đơn giản",
    primaryActivity: "interaction",
    domain: "occupational",
    canDoVi:
      "Có thể hiểu và nói giờ, ngày rất quen thuộc để xác nhận một cuộc hẹn ngắn.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-a0-8",
    level: "PRE_A1",
    titleVi: "Yêu cầu trợ giúp trong tình huống khẩn cấp",
    primaryActivity: "interaction",
    domain: "public",
    canDoVi:
      "Có thể dùng các cụm từ sinh tồn để nói mình cần giúp đỡ, bị đau, bị lạc hoặc cần gọi người hỗ trợ.",
    migration: "rewrite",
  },

  // ── A1 ────────────────────────────────────────────────────────────────────
  {
    legacyUnitId: "unit-1",
    level: "A1",
    titleVi: "Làm quen với một đồng nghiệp mới",
    primaryActivity: "interaction",
    domain: "occupational",
    canDoVi:
      "Có thể chào hỏi, tự giới thiệu và trao đổi vài thông tin cá nhân đơn giản với một đồng nghiệp mới.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-2",
    level: "A1",
    titleVi: "Hỏi và trả lời thông tin cá nhân, công việc",
    primaryActivity: "interaction",
    domain: "occupational",
    canDoVi:
      "Có thể hỏi và trả lời các câu đơn giản về tên, nơi sống, nghề nghiệp và nơi làm việc.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-3",
    level: "A1",
    titleVi: "Giới thiệu một người thân hoặc bạn bè",
    primaryActivity: "production",
    domain: "personal",
    canDoVi:
      "Có thể giới thiệu ngắn một người quen và nói quan hệ, tên và một vài đặc điểm cơ bản.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-4",
    level: "A1",
    titleVi: "Mô tả lịch sinh hoạt hoặc ca làm việc",
    primaryActivity: "production",
    domain: "occupational",
    canDoVi:
      "Có thể mô tả bằng các câu đơn giản những việc thường làm và thời gian thực hiện.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-5",
    level: "A1",
    titleVi: "Nói sở thích và rủ ai đó tham gia",
    primaryActivity: "interaction",
    domain: "personal",
    canDoVi:
      "Có thể nói mình thích hoặc không thích hoạt động nào và đưa ra một lời mời đơn giản.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-6",
    level: "A1",
    titleVi: "Mô tả nhà hoặc nơi làm việc và vị trí đồ vật",
    primaryActivity: "production",
    domain: "personal",
    canDoVi:
      "Có thể mô tả ngắn một không gian quen thuộc và nói đồ vật nằm ở đâu.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-7",
    level: "A1",
    titleVi: "Hỏi giá, chọn hàng và thanh toán",
    primaryActivity: "interaction",
    domain: "public",
    canDoVi:
      "Có thể hỏi giá, số lượng hoặc kích cỡ và hoàn thành một giao dịch mua hàng đơn giản.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-8",
    level: "A1",
    titleVi: "Gọi món và xử lý yêu cầu đơn giản",
    primaryActivity: "interaction",
    domain: "public",
    canDoVi:
      "Có thể gọi đồ ăn, đồ uống và đưa ra một yêu cầu rất đơn giản tại quán.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-9",
    level: "A1",
    titleVi: "Hỏi và làm theo chỉ đường ngắn",
    primaryActivity: "interaction",
    domain: "public",
    canDoVi:
      "Có thể hỏi vị trí và hiểu hoặc đưa ra chỉ dẫn rất ngắn tới một địa điểm gần.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-10",
    level: "A1",
    titleVi: "Nói khả năng và yêu cầu trợ giúp",
    primaryActivity: "interaction",
    domain: "occupational",
    canDoVi:
      "Có thể nói mình làm được hoặc chưa làm được việc gì và yêu cầu người khác hỗ trợ đơn giản.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-11",
    level: "A1",
    titleVi: "Mô tả cảm giác và triệu chứng cơ bản",
    primaryActivity: "interaction",
    domain: "public",
    canDoVi:
      "Có thể nói mình cảm thấy thế nào, chỉ một triệu chứng cơ bản và hiểu lời khuyên rất ngắn.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-12",
    level: "A1",
    titleVi: "Hoàn thành chuỗi việc trong một ngày đầu tiên",
    primaryActivity: "interaction",
    domain: "occupational",
    canDoVi:
      "Có thể kết hợp ngôn ngữ A1 để làm quen, hỏi thông tin, tìm địa điểm và xử lý một nhu cầu đơn giản.",
    migration: "split",
    notes: "Thay bài ôn ngữ pháp 60 phút bằng nhiều task ngắn và một performance mission.",
  },

  // ── A2 ────────────────────────────────────────────────────────────────────
  {
    legacyUnitId: "unit-13",
    level: "A2",
    titleVi: "Kể lại một cuối tuần hoặc sự kiện công việc",
    primaryActivity: "production",
    domain: "personal",
    canDoVi:
      "Có thể kể bằng chuỗi câu đơn giản điều đã xảy ra, khi nào và cảm nhận của mình.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-14",
    level: "A2",
    titleVi: "Thống nhất một kế hoạch và thời gian",
    primaryActivity: "interaction",
    domain: "occupational",
    canDoVi:
      "Có thể nói kế hoạch sắp tới, đề xuất thời gian và thống nhất một phương án quen thuộc.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-15",
    level: "A2",
    titleVi: "So sánh lựa chọn và đưa ra đề xuất",
    primaryActivity: "interaction",
    domain: "public",
    canDoVi:
      "Có thể so sánh những lựa chọn quen thuộc và giải thích ngắn vì sao một lựa chọn phù hợp hơn.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-16",
    level: "A2",
    titleVi: "Làm thủ tục chuyến đi và xử lý một vấn đề",
    primaryActivity: "interaction",
    domain: "public",
    canDoVi:
      "Có thể hỏi thông tin, làm thủ tục và giải thích một vấn đề đơn giản trong chuyến đi.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-17",
    level: "A2",
    titleVi: "Nói về kinh nghiệm và thành tích cá nhân",
    primaryActivity: "production",
    domain: "occupational",
    canDoVi:
      "Có thể nói ngắn về những việc đã từng làm, chưa từng làm và kinh nghiệm liên quan.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-18",
    level: "A2",
    titleVi: "Lập kế hoạch và giải quyết thay đổi trong một chuyến đi",
    primaryActivity: "interaction",
    domain: "public",
    canDoVi:
      "Có thể kết hợp ngôn ngữ A2 để lên kế hoạch, so sánh lựa chọn và xử lý một thay đổi quen thuộc.",
    migration: "split",
    notes: "Biến review dài thành scenario nhiều chặng và assessment tách riêng.",
  },

  // ── B1 ────────────────────────────────────────────────────────────────────
  {
    legacyUnitId: "unit-19",
    level: "B1",
    titleVi: "Kể một tình huống khó tại nơi làm việc",
    primaryActivity: "production",
    domain: "occupational",
    canDoVi:
      "Có thể kể rõ bối cảnh, diễn biến, hành động và kết quả của một tình huống quen thuộc.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-20",
    level: "B1",
    titleVi: "Tóm tắt một tin hoặc chuỗi sự kiện",
    primaryActivity: "mediation",
    domain: "public",
    canDoVi:
      "Có thể tóm tắt các điểm chính và thứ tự của một bản tin hoặc sự kiện quen thuộc.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-21",
    level: "B1",
    titleVi: "Thảo luận xu hướng và ảnh hưởng tương lai",
    primaryActivity: "interaction",
    domain: "occupational",
    canDoVi:
      "Có thể mô tả một xu hướng quen thuộc, dự đoán ảnh hưởng và đưa ra lý do ngắn.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-22",
    level: "B1",
    titleVi: "Giải thích quy định và đưa ra lời khuyên",
    primaryActivity: "mediation",
    domain: "occupational",
    canDoVi:
      "Có thể giải thích các quy định quen thuộc và phân biệt điều bắt buộc, được phép hoặc nên làm.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-23",
    level: "B1",
    titleVi: "Thảo luận điều kiện và hậu quả thực tế",
    primaryActivity: "interaction",
    domain: "occupational",
    canDoVi:
      "Có thể nêu điều kiện, hậu quả và phương án cho một vấn đề quen thuộc.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-24",
    level: "B1",
    titleVi: "Giải thích một quy trình cho người khác",
    primaryActivity: "mediation",
    domain: "occupational",
    canDoVi:
      "Có thể mô tả theo trình tự cách một sản phẩm, dịch vụ hoặc quy trình quen thuộc được thực hiện.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-25",
    level: "B1",
    titleVi: "Mô tả chính xác người, nơi hoặc vật cần tìm",
    primaryActivity: "production",
    domain: "public",
    canDoVi:
      "Có thể mô tả đủ chi tiết để người khác nhận ra một người, nơi hoặc vật quen thuộc.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-26",
    level: "B1",
    titleVi: "Nêu sở thích và bảo vệ lựa chọn",
    primaryActivity: "interaction",
    domain: "personal",
    canDoVi:
      "Có thể trình bày sở thích, so sánh lựa chọn và đưa ra lý do hoặc ví dụ hỗ trợ.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-27",
    level: "B1",
    titleVi: "Phân công, theo dõi và xử lý công việc",
    primaryActivity: "interaction",
    domain: "occupational",
    canDoVi:
      "Có thể trao đổi về nhiệm vụ, tiến độ, việc cần theo dõi và hành động tiếp theo trong nhóm.",
    migration: "rewrite",
    notes: "Không dạy 20 phrasal verbs như danh sách; chỉ chọn cụm phục vụ task quản lý công việc.",
  },
  {
    legacyUnitId: "unit-28",
    level: "B1",
    titleVi: "Báo cáo tiến độ và quá trình kéo dài",
    primaryActivity: "production",
    domain: "occupational",
    canDoVi:
      "Có thể nói một công việc đã diễn ra bao lâu, tiến triển thế nào và còn vấn đề gì.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-29",
    level: "B1",
    titleVi: "Phân tích vấn đề và đề xuất giải pháp",
    primaryActivity: "interaction",
    domain: "occupational",
    canDoVi:
      "Có thể giải thích nguyên nhân, tác động và đề xuất một hoặc nhiều giải pháp có lý do.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-30",
    level: "B1",
    titleVi: "Thảo luận một vấn đề sức khỏe hoặc môi trường",
    primaryActivity: "interaction",
    domain: "public",
    canDoVi:
      "Có thể trình bày quan điểm về một vấn đề quen thuộc, nêu nguyên nhân, hậu quả và ví dụ.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-31",
    level: "B1",
    titleVi: "Viết hoặc trình bày một đề xuất chuyên nghiệp",
    primaryActivity: "production",
    domain: "occupational",
    canDoVi:
      "Có thể trình bày đề xuất rõ ràng, nêu lý do và yêu cầu hành động bằng giọng điệu phù hợp.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-32",
    level: "B1",
    titleVi: "Giải quyết một vấn đề công việc từ đầu đến cuối",
    primaryActivity: "interaction",
    domain: "occupational",
    canDoVi:
      "Có thể kết hợp kỹ năng B1 để hiểu vấn đề, hỏi thêm, đề xuất giải pháp và báo cáo quyết định.",
    migration: "split",
    notes: "Tách performance assessment khỏi review và khỏi các tuyên bố IELTS/TOEIC không được chứng minh.",
  },

  // ── B2 ────────────────────────────────────────────────────────────────────
  {
    legacyUnitId: "unit-33",
    level: "B2",
    titleVi: "Ứng phó với câu hỏi giả định trong phỏng vấn",
    primaryActivity: "interaction",
    domain: "occupational",
    canDoVi:
      "Có thể phân tích một tình huống giả định, nêu hành động ưu tiên, lý do và hệ quả có thể xảy ra.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-34",
    level: "B2",
    titleVi: "Phân tích một quyết định sai và bài học rút ra",
    primaryActivity: "production",
    domain: "occupational",
    canDoVi:
      "Có thể đánh giá một sự kiện trong quá khứ, giải thích phương án khác và bài học cho tương lai.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-35",
    level: "B2",
    titleVi: "Đàm phán điều kiện và phương án dự phòng",
    primaryActivity: "interaction",
    domain: "occupational",
    canDoVi:
      "Có thể thương lượng điều kiện, giới hạn, ngoại lệ và phương án dự phòng một cách rõ ràng.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-36",
    level: "B2",
    titleVi: "Tóm tắt và báo cáo thông tin một cách trung lập",
    primaryActivity: "mediation",
    domain: "educational",
    canDoVi:
      "Có thể trình bày lại các phát hiện, tuyên bố và quan điểm từ nguồn khác với mức độ khách quan phù hợp.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-37",
    level: "B2",
    titleVi: "Rút gọn thông tin phức tạp thành bản tóm tắt rõ",
    primaryActivity: "mediation",
    domain: "occupational",
    canDoVi:
      "Có thể chọn lọc và diễn đạt súc tích các điểm chính từ thông tin tương đối phức tạp.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-38",
    level: "B2",
    titleVi: "Thuyết phục và nhấn mạnh điểm quan trọng",
    primaryActivity: "production",
    domain: "occupational",
    canDoVi:
      "Có thể xây dựng lập luận thuyết phục, nhấn mạnh ưu tiên và dùng ví dụ để tăng sức nặng.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-39",
    level: "B2",
    titleVi: "Suy luận từ bằng chứng và thể hiện mức độ chắc chắn",
    primaryActivity: "interaction",
    domain: "occupational",
    canDoVi:
      "Có thể suy luận về nguyên nhân hoặc sự kiện và thể hiện rõ mức độ chắc chắn của mình.",
    migration: "rewrite",
  },
  {
    legacyUnitId: "unit-40",
    level: "B2",
    titleVi: "Tổ chức một lập luận dài và mạch lạc",
    primaryActivity: "production",
    domain: "educational",
    canDoVi:
      "Có thể liên kết quan điểm, lý do, phản biện và kết luận thành một bài nói hoặc bài viết mạch lạc.",
    migration: "rewrite",
    notes: "Không dạy 30 discourse markers cùng lúc; chọn theo chức năng lập luận.",
  },
  {
    legacyUnitId: "unit-41",
    level: "B2",
    titleVi: "Thảo luận các chủ đề phức tạp bằng từ vựng chính xác",
    primaryActivity: "interaction",
    domain: "public",
    canDoVi:
      "Có thể thảo luận có chiều sâu về một chủ đề xã hội quen thuộc và điều chỉnh từ ngữ theo chủ đề.",
    migration: "split",
    notes: "60 từ và 5 chủ đề phải tách thành nhiều mission sessions; không thể là một core lesson.",
  },
  {
    legacyUnitId: "unit-42",
    level: "B2",
    titleVi: "Hoàn thành đánh giá năng lực giao tiếp B2",
    primaryActivity: "mediation",
    domain: "occupational",
    canDoVi:
      "Có thể kết hợp tiếp nhận, tương tác, sản xuất và mediation để hoàn thành một nhiệm vụ phức hợp ở mức B2.",
    migration: "split",
    notes: "Tách assessment theo kỹ năng; không suy ra điểm IELTS/TOEIC nếu chưa có nghiên cứu chuẩn hóa.",
  },
];

export const EXPECTED_MISSION_COUNT = 50;

export function getMissionPlan(legacyUnitId: string): CurriculumMissionPlan | undefined {
  return CURRICULUM_MISSION_MAP.find(
    (mission) => mission.legacyUnitId === legacyUnitId,
  );
}
