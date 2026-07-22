import type { CefrLevel, EvidenceType, RubricDimension } from "./schema";

export type SupportLevel =
  | "highly_supported"
  | "supported"
  | "partly_independent"
  | "independent";

export type ProgressionDimension =
  | "reception"
  | "interaction"
  | "production"
  | "mediation"
  | "language_control"
  | "lexical_range"
  | "pronunciation"
  | "fluency"
  | "discourse"
  | "repair";

export interface LevelAssessmentProfile {
  baselineSeconds: number;
  finalPerformanceSeconds: number;
  expectedSupport: SupportLevel;
  requiredEvidence: EvidenceType[];
  rubric: RubricDimension[];
  minimumIndependentDimensions: ProgressionDimension[];
  delayedTransferDays: number[];
}

export interface LevelProgressionProfile {
  level: CefrLevel;
  learnerPosition: string;
  exitCanDoVi: string;
  receptionVi: string[];
  interactionVi: string[];
  productionVi: string[];
  mediationVi: string[];
  languageDevelopment: {
    sentenceAndDiscourseVi: string[];
    grammarAsMeaningVi: string[];
    lexicalDevelopmentVi: string[];
  };
  pronunciationVi: {
    mainGoal: string;
    priorities: string[];
    notRequired: string[];
  };
  learningDesign: {
    lessonMinutes: [number, number];
    newCoreTargets: [number, number];
    recycledTargetRatio: [number, number];
    modelTurns: [number, number];
    controlledPracticeItems: [number, number];
    meaningfulProductionRequired: boolean;
  };
  assessment: LevelAssessmentProfile;
  visibleProgressMarkersVi: string[];
}

/**
 * Product-level interpretation of CEFR for Vietnamese adult learners.
 *
 * CEFR is deliberately language-neutral. These profiles turn CEFR can-do
 * progression into concrete English-course design constraints for AtoEnglish.
 * They are curriculum rules, not claims that a learner has obtained an
 * externally certified CEFR level.
 */
export const LEVEL_PROGRESSION_PROFILES: Record<
  CefrLevel,
  LevelProgressionProfile
> = {
  PRE_A1: {
    level: "PRE_A1",
    learnerPosition:
      "Người học mới bắt đầu, chủ yếu dựa vào từ đơn, cụm cố định, hình ảnh, cử chỉ và người đối thoại hỗ trợ.",
    exitCanDoVi:
      "Có thể hoàn thành các trao đổi sinh tồn rất ngắn về bản thân và nhu cầu tức thời khi người đối diện nói chậm, rõ và sẵn sàng giúp.",
    receptionVi: [
      "Nhận ra tên, số, giá, giờ, ngày và từ khóa quen thuộc trong lời nói rất chậm.",
      "Làm theo chỉ dẫn một bước có minh họa hoặc cử chỉ.",
      "Nhận biết ý định giao tiếp cơ bản: chào, hỏi, cảm ơn, xin lỗi, yêu cầu giúp đỡ.",
    ],
    interactionVi: [
      "Dùng lời chào, câu trả lời một cụm và câu hỏi đóng rất ngắn.",
      "Nói tên, đánh vần, xác nhận đúng/sai và yêu cầu lặp lại hoặc nói chậm.",
      "Hoàn thành 2–4 lượt trao đổi có khung và hỗ trợ rõ.",
    ],
    productionVi: [
      "Nói chuỗi 2–4 cụm đã luyện về tên, nơi ở, người thân hoặc nhu cầu.",
      "Điền hoặc đọc thông tin cá nhân tối thiểu.",
    ],
    mediationVi: [
      "Chỉ, đọc hoặc chuyển các thông tin cực ngắn như tên, số, giờ và giá.",
    ],
    languageDevelopment: {
      sentenceAndDiscourseVi: [
        "Từ đơn → cụm cố định → câu một mệnh đề rất ngắn.",
        "Không yêu cầu nối thành đoạn; độ chính xác tập trung vào thông tin cốt lõi.",
      ],
      grammarAsMeaningVi: [
        "be cho tên và nhận dạng",
        "this/that và số ít cơ bản",
        "mệnh lệnh lịch sự với please",
        "câu hỏi cố định: What is...? / How much...? / Where...?",
      ],
      lexicalDevelopmentVi: [
        "Ưu tiên 3–5 chunks có thể dùng ngay trong mỗi bài.",
        "Từ vựng luôn đi cùng hình ảnh, âm thanh, hành động hoặc tình huống cụ thể.",
        "Chưa dạy danh sách từ đồng nghĩa, collocation rộng hoặc nhiều nghĩa.",
      ],
    },
    pronunciationVi: {
      mainGoal:
        "Người nghe nhận ra được từ khóa và thông tin quan trọng; không đặt mục tiêu xóa giọng Việt.",
      priorities: [
        "bảng chữ cái và đánh vần tên",
        "độ dài nguyên âm ở các cặp gây nhầm thông tin",
        "phụ âm đầu và phụ âm cuối mang nghĩa",
        "nhịp chậm, tách cụm rõ",
      ],
      notRequired: [
        "IPA đầy đủ",
        "ngữ điệu bản ngữ",
        "nối âm nhanh",
        "chấm điểm accent",
        "accent bản ngữ",
      ],
    },
    learningDesign: {
      lessonMinutes: [8, 12],
      newCoreTargets: [3, 5],
      recycledTargetRatio: [0.2, 0.4],
      modelTurns: [2, 4],
      controlledPracticeItems: [4, 7],
      meaningfulProductionRequired: true,
    },
    assessment: {
      baselineSeconds: 10,
      finalPerformanceSeconds: 20,
      expectedSupport: "highly_supported",
      requiredEvidence: ["task_checklist", "self_assessment"],
      rubric: ["task_achievement", "comprehensibility", "interaction_repair"],
      minimumIndependentDimensions: ["interaction", "repair"],
      delayedTransferDays: [1, 7],
    },
    visibleProgressMarkersVi: [
      "Từ chỉ biết nghe/nhìn thành có thể tự nói cụm.",
      "Từ cần nhìn đáp án thành nói được với hình hoặc từ khóa.",
      "Từ im lặng khi không hiểu thành biết xin lặp lại hoặc nói chậm.",
    ],
  },

  A1: {
    level: "A1",
    learnerPosition:
      "Người dùng ngôn ngữ cơ bản có thể tạo câu đơn giản về thông tin cá nhân và nhu cầu cụ thể.",
    exitCanDoVi:
      "Có thể xử lý các tình huống quen thuộc bằng câu đơn giản, hỏi và trả lời thông tin cá nhân, đồng thời duy trì trao đổi ngắn khi người đối diện hợp tác.",
    receptionVi: [
      "Hiểu ý chính của câu và đoạn rất ngắn về bản thân, mua sắm, ăn uống, nơi chốn, lịch trình và công việc quen thuộc.",
      "Nhận ra thông tin cụ thể trong thông báo, tin nhắn hoặc hội thoại chậm.",
    ],
    interactionVi: [
      "Duy trì 4–8 lượt trao đổi trong tình huống quen thuộc.",
      "Hỏi câu follow-up đơn giản thay vì chỉ trả lời.",
      "Xác nhận thông tin, xin lặp lại và sửa hiểu nhầm cơ bản.",
    ],
    productionVi: [
      "Nói 20–45 giây bằng các câu đơn giản về người, nơi, thói quen và sở thích.",
      "Mô tả theo danh sách hoặc trình tự rất đơn giản.",
    ],
    mediationVi: [
      "Chuyển thông tin đơn giản từ lịch, thực đơn, biển báo, tin nhắn hoặc biểu mẫu.",
    ],
    languageDevelopment: {
      sentenceAndDiscourseVi: [
        "Câu một mệnh đề → chuỗi 3–6 câu đơn giản.",
        "Dùng and, but, because, then để nối ý cơ bản.",
      ],
      grammarAsMeaningVi: [
        "be và have cho thông tin cá nhân",
        "present simple cho thói quen",
        "can cho khả năng và yêu cầu",
        "there is/are và giới từ vị trí",
        "countable/uncountable và lượng cơ bản",
        "câu hỏi wh- và yes/no",
      ],
      lexicalDevelopmentVi: [
        "4–7 targets cốt lõi mỗi bài, ưu tiên chunks và high-frequency senses.",
        "Bắt đầu phân biệt receptive vocabulary và productive vocabulary.",
        "Tái sử dụng cùng từ qua nhiều chức năng thay vì liên tục thêm từ mới.",
      ],
    },
    pronunciationVi: {
      mainGoal:
        "Câu ngắn dễ hiểu và thông tin cốt lõi không bị mất.",
      priorities: [
        "phụ âm cuối phổ biến /s, z, t, d, k/",
        "phân biệt số ít/số nhiều và thì qua âm cuối",
        "trọng âm từ hai âm tiết phổ biến",
        "nhóm từ theo cụm nghĩa ngắn",
      ],
      notRequired: [
        "accent bản ngữ",
        "nối âm tốc độ cao",
        "mọi contrast nguyên âm",
      ],
    },
    learningDesign: {
      lessonMinutes: [10, 15],
      newCoreTargets: [4, 7],
      recycledTargetRatio: [0.3, 0.5],
      modelTurns: [4, 8],
      controlledPracticeItems: [6, 10],
      meaningfulProductionRequired: true,
    },
    assessment: {
      baselineSeconds: 20,
      finalPerformanceSeconds: 40,
      expectedSupport: "supported",
      requiredEvidence: ["task_checklist", "asr_transcript", "self_assessment"],
      rubric: [
        "task_achievement",
        "comprehensibility",
        "language_control",
        "interaction_repair",
      ],
      minimumIndependentDimensions: [
        "interaction",
        "production",
        "language_control",
        "repair",
      ],
      delayedTransferDays: [2, 7, 21],
    },
    visibleProgressMarkersVi: [
      "Từ câu rời rạc thành chuỗi câu ngắn có and/but/because.",
      "Từ phản hồi một từ thành có thể hỏi lại một câu đơn giản.",
      "Từ chỉ làm đúng bài mẫu thành xử lý biến thể quen thuộc.",
    ],
  },

  A2: {
    level: "A2",
    learnerPosition:
      "Người dùng cơ bản có thể trao đổi trực tiếp về công việc thường ngày, trải nghiệm và nhu cầu quen thuộc.",
    exitCanDoVi:
      "Có thể hoàn thành giao dịch và cuộc trao đổi quen thuộc, kể lại trải nghiệm, giải thích vấn đề đơn giản và thống nhất kế hoạch bằng chuỗi câu rõ.",
    receptionVi: [
      "Hiểu ý chính và chi tiết dự đoán được trong hội thoại rõ về công việc, du lịch, dịch vụ và trải nghiệm.",
      "Rút thông tin từ email ngắn, lịch trình, hướng dẫn và mô tả sự kiện.",
    ],
    interactionVi: [
      "Duy trì 6–12 lượt trao đổi về tình huống quen thuộc.",
      "Đề xuất, đồng ý, từ chối, so sánh và thống nhất phương án.",
      "Giải thích vấn đề đơn giản và yêu cầu hành động cụ thể.",
    ],
    productionVi: [
      "Nói 40–75 giây kể trải nghiệm, mô tả kế hoạch hoặc so sánh lựa chọn.",
      "Tạo chuỗi điểm theo trình tự thời gian hoặc quan hệ lý do-kết quả đơn giản.",
    ],
    mediationVi: [
      "Tóm tắt hoặc chuyển các điểm chính từ thông tin quen thuộc cho người khác.",
    ],
    languageDevelopment: {
      sentenceAndDiscourseVi: [
        "Chuỗi câu đơn giản → đoạn ngắn có mở đầu, trình tự và kết thúc.",
        "Dùng first, then, after that, so, because, if để tổ chức.",
      ],
      grammarAsMeaningVi: [
        "past simple cho sự kiện hoàn tất",
        "going to/present continuous cho kế hoạch",
        "will cho quyết định và dự đoán đơn giản",
        "comparatives/superlatives cho lựa chọn",
        "present perfect cơ bản cho kinh nghiệm",
        "modals cơ bản cho đề nghị, lời khuyên và nghĩa vụ",
      ],
      lexicalDevelopmentVi: [
        "5–8 targets cốt lõi; thêm collocation quen thuộc và các nghĩa thường gặp.",
        "Mở rộng từ chủ đề sang cụm chức năng: propose, compare, explain, complain.",
        "Bắt đầu yêu cầu paraphrase đơn giản khi thiếu từ.",
      ],
    },
    pronunciationVi: {
      mainGoal:
        "Đoạn nói ngắn giữ được nghĩa, mốc thời gian và quan hệ giữa các ý.",
      priorities: [
        "-ed và -s mang thông tin ngữ pháp",
        "trọng âm từ nhiều âm tiết quen thuộc",
        "nhấn từ mang nội dung",
        "ngắt cụm theo trình tự và lý do",
      ],
      notRequired: [
        "accent bản ngữ",
        "độ tự nhiên như người bản ngữ",
        "nối âm phức tạp",
        "tốc độ cao",
      ],
    },
    learningDesign: {
      lessonMinutes: [12, 18],
      newCoreTargets: [5, 8],
      recycledTargetRatio: [0.4, 0.6],
      modelTurns: [6, 10],
      controlledPracticeItems: [7, 12],
      meaningfulProductionRequired: true,
    },
    assessment: {
      baselineSeconds: 35,
      finalPerformanceSeconds: 70,
      expectedSupport: "partly_independent",
      requiredEvidence: ["task_checklist", "asr_transcript", "self_assessment"],
      rubric: [
        "task_achievement",
        "comprehensibility",
        "fluency",
        "language_control",
        "interaction_repair",
      ],
      minimumIndependentDimensions: [
        "reception",
        "interaction",
        "production",
        "language_control",
        "repair",
      ],
      delayedTransferDays: [3, 10, 30],
    },
    visibleProgressMarkersVi: [
      "Từ liệt kê câu thành kể hoặc giải thích có trình tự.",
      "Từ giao dịch theo kịch bản thành xử lý một thay đổi hoặc vấn đề nhỏ.",
      "Từ phụ thuộc từ chính xác thành biết diễn đạt lại bằng ngôn ngữ đơn giản.",
    ],
  },

  B1: {
    level: "B1",
    learnerPosition:
      "Người dùng độc lập có thể xử lý phần lớn tình huống quen thuộc và phát triển một chuỗi ý có liên kết.",
    exitCanDoVi:
      "Có thể trao đổi tương đối tự tin về công việc và đời sống quen thuộc, kể chuyện, giải thích vấn đề, bảo vệ quan điểm và đề xuất giải pháp bằng diễn ngôn kết nối.",
    receptionVi: [
      "Hiểu ý chính và nhiều chi tiết của lời nói chuẩn rõ về chủ đề quen thuộc và chuyên môn gần gũi.",
      "Theo dõi trình tự, lập luận đơn giản, thái độ và hành động được yêu cầu.",
    ],
    interactionVi: [
      "Chủ động mở, duy trì và kết thúc cuộc trao đổi quen thuộc.",
      "Hỏi để làm rõ, kiểm tra hiểu, phản hồi quan điểm và xử lý tình huống ít quen thuộc.",
      "Phân tích vấn đề và thương lượng hành động tiếp theo.",
    ],
    productionVi: [
      "Nói 60–120 giây thành một đoạn kết nối về trải nghiệm, quy trình, xu hướng, vấn đề hoặc quan điểm.",
      "Nêu lý do, ví dụ và kết luận; có thể vòng diễn đạt khi thiếu từ.",
    ],
    mediationVi: [
      "Tóm tắt, giải thích và chuyển các điểm chính của văn bản hoặc quy trình rõ về chủ đề quen thuộc.",
      "Giúp người khác hiểu quy định, hướng dẫn hoặc quyết định.",
    ],
    languageDevelopment: {
      sentenceAndDiscourseVi: [
        "Đoạn ngắn → diễn ngôn 1–2 phút theo cấu trúc kể chuyện, vấn đề-giải pháp hoặc quan điểm-lý do.",
        "Liên kết bằng however, although, therefore, for example, as a result và reference words.",
      ],
      grammarAsMeaningVi: [
        "past continuous/past perfect cho quan hệ sự kiện",
        "present perfect continuous cho tiến trình",
        "conditionals thực và dự đoán",
        "passive cho quy trình và focus thông tin",
        "relative clauses cho mô tả chính xác",
        "modal meanings cho nghĩa vụ, khả năng và suy luận cơ bản",
      ],
      lexicalDevelopmentVi: [
        "6–10 targets cốt lõi, nhiều collocation và chunks nghề nghiệp.",
        "Mở rộng nghĩa của từ quen thuộc và phrasal verbs theo nhiệm vụ, không theo danh sách.",
        "Phân biệt từ trung tính, thân mật và chuyên nghiệp cơ bản.",
      ],
    },
    pronunciationVi: {
      mainGoal:
        "Người nghe theo dõi được chuỗi ý mà không phải nỗ lực quá mức.",
      priorities: [
        "nhịp câu và prominence để làm nổi thông tin mới",
        "ngắt cụm ở ranh giới ý",
        "âm cuối và cụm phụ âm gây mất nghĩa",
        "tốc độ ổn định, giảm pause giữa cụm",
      ],
      notRequired: [
        "accent bản ngữ",
        "bắt chước một accent cụ thể",
        "tốc độ giống người bản ngữ",
        "mọi reduced form",
      ],
    },
    learningDesign: {
      lessonMinutes: [15, 20],
      newCoreTargets: [6, 10],
      recycledTargetRatio: [0.5, 0.7],
      modelTurns: [8, 14],
      controlledPracticeItems: [8, 14],
      meaningfulProductionRequired: true,
    },
    assessment: {
      baselineSeconds: 60,
      finalPerformanceSeconds: 110,
      expectedSupport: "partly_independent",
      requiredEvidence: ["task_checklist", "audio_recording", "self_assessment"],
      rubric: [
        "task_achievement",
        "comprehensibility",
        "fluency",
        "language_control",
        "interaction_repair",
      ],
      minimumIndependentDimensions: [
        "reception",
        "interaction",
        "production",
        "mediation",
        "discourse",
        "repair",
      ],
      delayedTransferDays: [7, 21, 45],
    },
    visibleProgressMarkersVi: [
      "Từ chuỗi câu thành đoạn có cấu trúc và thông tin ưu tiên.",
      "Từ mô tả hiện tượng thành giải thích nguyên nhân, tác động và giải pháp.",
      "Từ chờ câu hỏi thành chủ động hỏi, xác nhận và điều phối trao đổi.",
    ],
  },

  B2: {
    level: "B2",
    learnerPosition:
      "Người dùng độc lập có thể xử lý chủ đề cụ thể và trừu tượng, tương tác tương đối trôi chảy và phát triển lập luận.",
    exitCanDoVi:
      "Có thể tham gia hiệu quả vào trao đổi công việc và học thuật tương đối phức tạp, trình bày lập luận rõ, điều chỉnh mức độ chắc chắn và tổng hợp thông tin từ nhiều nguồn.",
    receptionVi: [
      "Theo dõi lập luận dài hơn, quan điểm, hàm ý và chi tiết quan trọng trong chủ đề quen thuộc hoặc thuộc chuyên môn.",
      "Phân biệt claim, evidence, limitation, stance và hành động được đề xuất.",
    ],
    interactionVi: [
      "Tương tác tự phát hơn, phát triển hoặc phản biện ý của người khác.",
      "Đàm phán điều kiện, xử lý ngoại lệ và điều chỉnh register.",
      "Quản lý hiểu nhầm bằng paraphrase, clarification và reformulation.",
    ],
    productionVi: [
      "Nói 90–180 giây có tổ chức, nêu luận điểm, lý do, bằng chứng, giới hạn và kết luận.",
      "Trình bày mức độ chắc chắn, thái độ và sắc thái thay vì chỉ đúng/sai.",
    ],
    mediationVi: [
      "Tổng hợp, tóm tắt và trình bày lại thông tin tương đối phức tạp một cách trung lập hoặc phù hợp với người nhận.",
      "Chọn lọc thông tin và làm rõ quan hệ giữa nhiều quan điểm.",
    ],
    languageDevelopment: {
      sentenceAndDiscourseVi: [
        "Đoạn kết nối → lập luận nhiều phần, narrative có đánh giá và synthesis.",
        "Dùng discourse moves theo chức năng: framing, concession, contrast, evidence, qualification, conclusion.",
      ],
      grammarAsMeaningVi: [
        "conditional và hypothetical meanings",
        "modal perfect và stance",
        "advanced passive/reporting structures",
        "participle clauses và information packaging",
        "inversion/cleft chỉ khi phục vụ nhấn mạnh",
        "hedging và qualification",
      ],
      lexicalDevelopmentVi: [
        "6–12 targets cốt lõi, ưu tiên precision, collocation, register và phraseology.",
        "Học từ theo claim/evidence/process/negotiation thay vì danh sách chủ đề lớn.",
        "Yêu cầu paraphrase và lựa chọn từ phù hợp người nghe.",
      ],
    },
    pronunciationVi: {
      mainGoal:
        "Duy trì tính dễ hiểu, nhịp lập luận và sắc thái trong đoạn nói dài.",
      priorities: [
        "prominence cho contrast và stance",
        "thought groups trong câu phức",
        "intonation cho certainty, politeness và turn management",
        "tốc độ linh hoạt, pause có chủ đích",
      ],
      notRequired: [
        "accent bản ngữ",
        "idiom hiếm",
        "tốc độ tối đa",
      ],
    },
    learningDesign: {
      lessonMinutes: [18, 25],
      newCoreTargets: [6, 12],
      recycledTargetRatio: [0.6, 0.8],
      modelTurns: [10, 18],
      controlledPracticeItems: [8, 14],
      meaningfulProductionRequired: true,
    },
    assessment: {
      baselineSeconds: 90,
      finalPerformanceSeconds: 170,
      expectedSupport: "independent",
      requiredEvidence: ["task_checklist", "audio_recording", "self_assessment"],
      rubric: [
        "task_achievement",
        "comprehensibility",
        "fluency",
        "language_control",
        "interaction_repair",
      ],
      minimumIndependentDimensions: [
        "reception",
        "interaction",
        "production",
        "mediation",
        "lexical_range",
        "discourse",
        "repair",
      ],
      delayedTransferDays: [7, 28, 60],
    },
    visibleProgressMarkersVi: [
      "Từ trình bày ý thành xây dựng và bảo vệ lập luận có giới hạn.",
      "Từ tóm tắt một nguồn thành tổng hợp và điều chỉnh cho người nhận.",
      "Từ phản hồi nội dung thành quản lý sắc thái, register và mức độ chắc chắn.",
    ],
  },
};

export function getLevelProgressionProfile(
  level: CefrLevel,
): LevelProgressionProfile {
  return LEVEL_PROGRESSION_PROFILES[level];
}
