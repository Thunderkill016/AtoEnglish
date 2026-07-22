import { LEVEL_CURRICULUM_VOLUME } from "./curriculum-volume";
import type { CefrLevel } from "./schema";

export type CoreCurriculumStage = "foundation" | "expansion" | "integration";

export interface ProductionMissionModule {
  id: string;
  level: CefrLevel;
  order: number;
  stage: CoreCurriculumStage;
  titleVi: string;
  canDoVi: string;
  legacySourceIds: string[];
}

export interface CheckpointSessionPlan {
  id: string;
  level: CefrLevel;
  checkpointNumber: number;
  afterModuleOrder: number;
  titleVi: string;
}

type ModuleRow = readonly [
  id: string,
  level: CefrLevel,
  order: number,
  stage: CoreCurriculumStage,
  titleVi: string,
  canDoVi: string,
  legacySourceIds: readonly string[],
];

const MODULE_ROWS: readonly ModuleRow[] = [
  // Pre-A1 — 8 core mission modules
  ["pre-a1-m01", "PRE_A1", 1, "foundation", "Nói và đánh vần tên", "Nói tên, đánh vần và xin người khác nói chậm hoặc lặp lại.", ["unit-a0-1"]],
  ["pre-a1-m02", "PRE_A1", 2, "foundation", "Hiểu số và thanh toán", "Hiểu giá quen thuộc, nói số tiền và hoàn thành giao dịch rất ngắn.", ["unit-a0-2"]],
  ["pre-a1-m03", "PRE_A1", 3, "foundation", "Chỉ đúng đồ vật", "Dùng màu sắc và kích thước để nhận biết hoặc chỉ một đồ vật cụ thể.", ["unit-a0-3"]],
  ["pre-a1-m04", "PRE_A1", 4, "expansion", "Chào và kết thúc cuộc gặp", "Chào, đáp lại, cảm ơn, xin lỗi và kết thúc một trao đổi ngắn.", ["unit-a0-4"]],
  ["pre-a1-m05", "PRE_A1", 5, "expansion", "Cho thông tin cá nhân tối thiểu", "Nói hoặc điền tên, tuổi, quốc gia và thành phố với hỗ trợ.", ["unit-a0-5"]],
  ["pre-a1-m06", "PRE_A1", 6, "expansion", "Giới thiệu người thân", "Chỉ người trong ảnh và nói tên cùng quan hệ gia đình.", ["unit-a0-6"]],
  ["pre-a1-m07", "PRE_A1", 7, "integration", "Xác nhận giờ và lịch hẹn", "Hiểu, nói và sửa một giờ hoặc ngày trong lịch hẹn đơn giản.", ["unit-a0-7"]],
  ["pre-a1-m08", "PRE_A1", 8, "integration", "Yêu cầu trợ giúp khẩn cấp", "Nói mình cần giúp, bị đau hoặc bị lạc và đưa vị trí cơ bản.", ["unit-a0-8"]],

  // A1 — 12 core mission modules
  ["a1-m01", "A1", 1, "foundation", "Làm quen với đồng nghiệp", "Chào, tự giới thiệu và hỏi lại một câu về người đối diện.", ["unit-1"]],
  ["a1-m02", "A1", 2, "foundation", "Trao đổi thông tin cá nhân và công việc", "Hỏi và trả lời về nơi sống, vai trò, nơi làm việc và nhóm.", ["unit-2"]],
  ["a1-m03", "A1", 3, "foundation", "Giới thiệu một người khác", "Giới thiệu người thân hoặc đồng nghiệp bằng vài đặc điểm cơ bản.", ["unit-3"]],
  ["a1-m04", "A1", 4, "foundation", "Mô tả lịch sinh hoạt và ca làm", "Nói 3–6 câu về hoạt động thường ngày, thời gian và tần suất.", ["unit-4"]],
  ["a1-m05", "A1", 5, "expansion", "Nói sở thích và đưa lời mời", "Nói thích/không thích, mời và đáp lại lời mời đơn giản.", ["unit-5"]],
  ["a1-m06", "A1", 6, "expansion", "Mô tả nhà và nơi làm việc", "Mô tả không gian quen thuộc và vị trí đồ vật.", ["unit-6"]],
  ["a1-m07", "A1", 7, "expansion", "Mua hàng và đổi lựa chọn", "Hỏi giá, kích cỡ, số lượng, chọn hàng và yêu cầu phương án khác.", ["unit-7"]],
  ["a1-m08", "A1", 8, "expansion", "Gọi món và sửa yêu cầu", "Gọi đồ ăn/uống, nói số lượng và sửa một chi tiết trong đơn.", ["unit-8"]],
  ["a1-m09", "A1", 9, "integration", "Hỏi và chỉ đường", "Hỏi vị trí, đưa chỉ dẫn ngắn và xác nhận lại tuyến đường.", ["unit-9"]],
  ["a1-m10", "A1", 10, "integration", "Nói khả năng và xin hỗ trợ", "Nói việc mình làm được/chưa làm được và yêu cầu hỗ trợ cụ thể.", ["unit-10"]],
  ["a1-m11", "A1", 11, "integration", "Mô tả cảm giác và triệu chứng", "Nói tình trạng, triệu chứng cơ bản và hiểu lời khuyên ngắn.", ["unit-11"]],
  ["a1-m12", "A1", 12, "integration", "Hoàn thành ngày đầu trong môi trường mới", "Kết hợp giới thiệu, hỏi thông tin, tìm địa điểm và xử lý nhu cầu quen thuộc.", ["unit-12"]],

  // A2 — 12 modules; legacy A2 was under-scoped at six broad routes
  ["a2-m01", "A2", 1, "foundation", "Kể một sự kiện gần đây", "Kể có trình tự một cuối tuần, buổi học hoặc sự kiện công việc.", ["unit-13"]],
  ["a2-m02", "A2", 2, "foundation", "Giải thích một sự cố đơn giản", "Nói chuyện gì xảy ra, nguyên nhân trực tiếp và cách xử lý ban đầu.", ["unit-13"]],
  ["a2-m03", "A2", 3, "foundation", "Lập kế hoạch và đề xuất thời gian", "Nói kế hoạch, đề xuất thời gian và thống nhất lựa chọn.", ["unit-14"]],
  ["a2-m04", "A2", 4, "foundation", "Đổi và thương lượng lại kế hoạch", "Giải thích thay đổi, đề xuất giờ mới và xác nhận phương án cuối.", ["unit-14"]],
  ["a2-m05", "A2", 5, "expansion", "So sánh nhiều lựa chọn", "So sánh giá, chất lượng, thời gian hoặc tiện ích của các phương án.", ["unit-15"]],
  ["a2-m06", "A2", 6, "expansion", "Đưa khuyến nghị có lý do", "Chọn một phương án và giải thích ngắn vì sao phù hợp hơn.", ["unit-15"]],
  ["a2-m07", "A2", 7, "expansion", "Làm thủ tục chuyến đi", "Hỏi thông tin, đưa giấy tờ và xác nhận chi tiết đặt chỗ.", ["unit-16"]],
  ["a2-m08", "A2", 8, "expansion", "Xử lý vấn đề dịch vụ", "Giải thích vấn đề với phòng, vé hoặc hành lý và yêu cầu giải pháp.", ["unit-16"]],
  ["a2-m09", "A2", 9, "integration", "Nói về kinh nghiệm và thành tích", "Nói những việc đã từng làm, kết quả và ví dụ liên quan.", ["unit-17"]],
  ["a2-m10", "A2", 10, "integration", "Báo cáo thay đổi và tiến bộ", "So sánh trước–nay và nói việc đã hoàn thành hoặc chưa hoàn thành.", ["unit-17"]],
  ["a2-m11", "A2", 11, "integration", "Đưa lời khuyên cho vấn đề quen thuộc", "Mô tả vấn đề, nêu nghĩa vụ/lựa chọn và đề xuất hành động.", ["unit-18"]],
  ["a2-m12", "A2", 12, "integration", "Điều chỉnh một kế hoạch nhiều bước", "Kết hợp kể, so sánh, thương lượng và giải quyết một thay đổi dự đoán được.", ["unit-18"]],

  // B1 — 16 core mission modules
  ["b1-m01", "B1", 1, "foundation", "Kể một tình huống khó", "Kể bối cảnh, vấn đề, hành động, kết quả và bài học.", ["unit-19"]],
  ["b1-m02", "B1", 2, "foundation", "Tóm tắt tin hoặc báo cáo", "Chọn ý chính, trình tự và nguồn từ một văn bản hoặc bản tin ngắn.", ["unit-20"]],
  ["b1-m03", "B1", 3, "foundation", "Thảo luận xu hướng và tác động", "Mô tả xu hướng, dự đoán ảnh hưởng và đưa lý do/ví dụ.", ["unit-21"]],
  ["b1-m04", "B1", 4, "foundation", "Giải thích quy định", "Phân biệt bắt buộc, được phép, cấm và lời khuyên trong policy quen thuộc.", ["unit-22"]],
  ["b1-m05", "B1", 5, "expansion", "Thảo luận điều kiện và hậu quả", "Nêu điều kiện thực tế, hệ quả và phương án dự phòng.", ["unit-23"]],
  ["b1-m06", "B1", 6, "expansion", "Giải thích một quy trình", "Trình bày các bước, điểm kiểm soát và kết quả của quy trình quen thuộc.", ["unit-24"]],
  ["b1-m07", "B1", 7, "expansion", "Mô tả chính xác người, nơi hoặc vật", "Thêm chi tiết có liên quan để người nghe nhận dạng đúng đối tượng.", ["unit-25"]],
  ["b1-m08", "B1", 8, "expansion", "Bảo vệ một lựa chọn", "So sánh giá trị, nêu ưu/nhược và phản hồi lựa chọn khác.", ["unit-26"]],
  ["b1-m09", "B1", 9, "integration", "Điều hành check-in công việc", "Phân công, xác nhận người phụ trách, deadline và bước tiếp theo.", ["unit-27"]],
  ["b1-m10", "B1", 10, "integration", "Báo cáo tiến độ dự án", "Nói thời lượng, phần đã xong, blocker và hỗ trợ cần thiết.", ["unit-28"]],
  ["b1-m11", "B1", 11, "integration", "Phân tích vấn đề và giải pháp", "Nêu nguyên nhân, tác động, giải pháp và lý do ưu tiên.", ["unit-29"]],
  ["b1-m12", "B1", 12, "integration", "Thảo luận một vấn đề xã hội quen thuộc", "Trình bày quan điểm, lý do, ví dụ và phản hồi ý kiến khác.", ["unit-30"]],
  ["b1-m13", "B1", 13, "integration", "Trình bày đề xuất chuyên nghiệp", "Nêu đề xuất, lợi ích, rủi ro và yêu cầu quyết định.", ["unit-31"]],
  ["b1-m14", "B1", 14, "integration", "Chuyển thông tin thành email hoặc báo cáo", "Tóm tắt thông tin cần thiết cho người nhận và dùng register phù hợp.", ["unit-31"]],
  ["b1-m15", "B1", 15, "integration", "Thương lượng quyết định trong cuộc họp", "Làm rõ ưu tiên, phản hồi phản đối và thống nhất hành động.", ["unit-32"]],
  ["b1-m16", "B1", 16, "integration", "Giải quyết vấn đề từ đầu đến cuối", "Tiếp nhận thông tin, hỏi thêm, đề xuất, thương lượng và báo cáo quyết định.", ["unit-32"]],

  // B2 — 16 core mission modules
  ["b2-m01", "B2", 1, "foundation", "Xử lý câu hỏi giả định", "Đóng khung vấn đề, nêu ưu tiên, phương án và hệ quả có thể xảy ra.", ["unit-33"]],
  ["b2-m02", "B2", 2, "foundation", "Phân tích quyết định trong quá khứ", "Đánh giá điều đã xảy ra, phương án khác và bài học cho tương lai.", ["unit-34"]],
  ["b2-m03", "B2", 3, "foundation", "Đàm phán điều kiện", "Thương lượng giới hạn, ngoại lệ, nghĩa vụ và điều kiện chấp nhận.", ["unit-35"]],
  ["b2-m04", "B2", 4, "foundation", "Xây phương án dự phòng", "Nêu giả định, trigger, fallback và hậu quả của từng phương án.", ["unit-35"]],
  ["b2-m05", "B2", 5, "expansion", "Báo cáo nguồn trung lập", "Trình bày lại tuyên bố và phát hiện với mức độ khách quan phù hợp.", ["unit-36"]],
  ["b2-m06", "B2", 6, "expansion", "Tổng hợp các nguồn khác nhau", "Kết hợp điểm chung, khác biệt và giới hạn từ hai hoặc nhiều nguồn.", ["unit-36", "unit-41"]],
  ["b2-m07", "B2", 7, "expansion", "Viết hoặc nói executive summary", "Chọn insight, tác động và hành động từ thông tin phức tạp.", ["unit-37"]],
  ["b2-m08", "B2", 8, "expansion", "Rút gọn và diễn đạt lại chính xác", "Loại chi tiết thừa, giữ nuance và sửa cách người nghe hiểu thông điệp.", ["unit-37"]],
  ["b2-m09", "B2", 9, "integration", "Thuyết phục và nhấn mạnh ưu tiên", "Xây lập luận, dùng bằng chứng và làm nổi bật điểm quyết định.", ["unit-38"]],
  ["b2-m10", "B2", 10, "integration", "Phản biện và nhượng bộ", "Thừa nhận điểm hợp lý, chỉ giới hạn và bảo vệ kết luận.", ["unit-38"]],
  ["b2-m11", "B2", 11, "integration", "Suy luận từ bằng chứng", "Phân biệt dữ kiện, suy luận và mức độ chắc chắn.", ["unit-39"]],
  ["b2-m12", "B2", 12, "integration", "Hedge và điều chỉnh mức chắc chắn", "Dùng ngôn ngữ phù hợp khi bằng chứng chưa đầy đủ hoặc thay đổi.", ["unit-39"]],
  ["b2-m13", "B2", 13, "integration", "Tổ chức lập luận nhiều phần", "Liên kết claim, reason, evidence, counterargument và conclusion.", ["unit-40"]],
  ["b2-m14", "B2", 14, "integration", "Dùng bằng chứng trong chủ đề phức tạp", "Thảo luận một chủ đề bằng từ vựng chính xác thay vì học danh sách rời.", ["unit-41"]],
  ["b2-m15", "B2", 15, "integration", "Điều chỉnh thông điệp theo audience", "Đổi register, mức chi tiết, stance và cách giải thích theo người nhận.", ["unit-40", "unit-41"]],
  ["b2-m16", "B2", 16, "integration", "Xử lý case lãnh đạo phức hợp", "Tổng hợp nguồn, thương lượng constraint, quyết định và bảo vệ phương án.", ["unit-42"]],
];

export const PRODUCTION_MISSION_MODULES: ProductionMissionModule[] =
  MODULE_ROWS.map(
    ([id, level, order, stage, titleVi, canDoVi, legacySourceIds]) => ({
      id,
      level,
      order,
      stage,
      titleVi,
      canDoVi,
      legacySourceIds: [...legacySourceIds],
    }),
  );

export const EXPECTED_PRODUCTION_MODULE_COUNT = 64;

export function getModulesForLevel(level: CefrLevel): ProductionMissionModule[] {
  return PRODUCTION_MISSION_MODULES.filter((module) => module.level === level)
    .sort((a, b) => a.order - b.order);
}

export function buildCheckpointPlans(
  level: CefrLevel,
): CheckpointSessionPlan[] {
  const volume = LEVEL_CURRICULUM_VOLUME[level];

  return Array.from({ length: volume.checkpointCount }, (_, index) => {
    const checkpointNumber = index + 1;
    const afterModuleOrder = Math.min(
      checkpointNumber * 4,
      volume.missionModuleCount,
    );

    return {
      id: `${level.toLowerCase()}-cp${checkpointNumber}`,
      level,
      checkpointNumber,
      afterModuleOrder,
      titleVi: `Checkpoint ${checkpointNumber}: kết hợp module ${Math.max(1, afterModuleOrder - 3)}–${afterModuleOrder}`,
    };
  });
}
