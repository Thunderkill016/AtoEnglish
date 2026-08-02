import type { CapabilityKnowledgeCoverage } from "@/features/curriculum-compiler/domain/content-lanes";

export interface FirstA0KnowledgePlan {
  capabilityId: string;
  knowledge: CapabilityKnowledgeCoverage;
}

/**
 * Required knowledge for the first five A0 capabilities.
 *
 * This is the instructional core. Authentic clips provide evidence and examples,
 * but no source is allowed to silently define or narrow what the learner must know.
 */
export const FIRST_A0_KNOWLEDGE_COVERAGE: FirstA0KnowledgePlan[] = [
  {
    capabilityId: "a0.greet_someone",
    knowledge: {
      meaningAndUse: [
        "Mở một tương tác ngắn và cho người đối diện biết mình sẵn sàng giao tiếp.",
        "Nhận ra lời chào và đáp lại thay vì chỉ hiểu thụ động.",
      ],
      formulaicChunks: [
        "Hi.",
        "Hello.",
        "Good morning.",
        "Hi, nice to meet you.",
      ],
      grammarPatterns: [
        "Greeting + name or introduction chunk.",
        "Good + time-of-day noun for time-sensitive greetings.",
      ],
      speechFeatures: [
        "Ngữ điệu thân thiện và trọng âm chính trên từ chào.",
        "Nhận ra Hi và Hello ở tốc độ tự nhiên, kể cả khi rất ngắn.",
      ],
      interactionStrategies: [
        "Đáp lại lời chào trong một lượt ngắn rồi cho phép hội thoại tiếp tục.",
        "Kết hợp lời chào với tên khi cần mở đầu phần giới thiệu.",
      ],
      pragmaticsAndRegister: [
        "Hi thường thân mật hơn Hello; Good morning phù hợp ngữ cảnh trung tính hoặc lịch sự.",
        "Không cần kéo dài câu trả lời khi tình huống chỉ yêu cầu một lời chào ngắn.",
      ],
      vietnameseLearnerRisks: [
        "Hiểu lời chào nhưng im lặng vì cố tạo một câu trả lời dài hoàn hảo.",
        "Dùng Good morning không đúng thời điểm hoặc dùng Hello everyone khi chỉ nói với một người.",
      ],
    },
  },
  {
    capabilityId: "a0.say_ones_name",
    knowledge: {
      meaningAndUse: [
        "Cung cấp tên để người đối diện biết cách gọi mình trong phần mở đầu hội thoại.",
        "Chọn cách giới thiệu ngắn phù hợp thay vì dịch từng từ từ tiếng Việt.",
      ],
      formulaicChunks: [
        "I'm Minh.",
        "My name's Minh.",
        "You can call me Minh.",
      ],
      grammarPatterns: [
        "I am / I'm + name.",
        "My name is / My name's + name.",
        "You can call me + preferred name.",
      ],
      speechFeatures: [
        "Nhận ra và sử dụng contraction I'm và name's.",
        "Nối mượt I'm với tên riêng nhưng vẫn phát âm tên đủ rõ.",
      ],
      interactionStrategies: [
        "Chào trước, nói tên, rồi dừng để người kia có lượt phản hồi.",
        "Lặp hoặc đánh vần tên khi người nghe chưa hiểu.",
      ],
      pragmaticsAndRegister: [
        "Dùng tên gọi mong muốn trong giao tiếp; dùng đầy đủ họ tên khi bối cảnh chính thức yêu cầu.",
        "You can call me hữu ích khi tên pháp lý và tên thường gọi khác nhau.",
      ],
      vietnameseLearnerRisks: [
        "Nói I name Minh hoặc I am name Minh do thiếu mẫu cố định với động từ be.",
        "Đọc chậm từng từ My name is thay vì truy xuất cả cụm như một đơn vị.",
      ],
    },
  },
  {
    capabilityId: "a0.ask_others_name",
    knowledge: {
      meaningAndUse: [
        "Yêu cầu người đối diện cho biết tên và chuẩn bị nghe một câu trả lời ngắn.",
        "Dùng câu hỏi tên để tạo trao đổi hai chiều, không chỉ độc thoại giới thiệu bản thân.",
      ],
      formulaicChunks: [
        "What's your name?",
        "And you?",
        "May I ask your name?",
      ],
      grammarPatterns: [
        "What is / What's + possessive adjective + noun?",
        "And + pronoun? as a short reciprocal question after giving personal information.",
      ],
      speechFeatures: [
        "Nhận ra What's your ở dạng nối và giảm âm tự nhiên.",
        "Dùng ngữ điệu câu hỏi rõ nhưng không kéo cao quá mức ở mọi từ.",
      ],
      interactionStrategies: [
        "Giới thiệu tên mình trước rồi hỏi tên người khác khi điều đó làm câu hỏi tự nhiên hơn.",
        "Nghe tên, xác nhận hoặc dùng lại tên trong phản hồi tiếp theo.",
      ],
      pragmaticsAndRegister: [
        "What's your name? phù hợp nhiều tình huống nhưng có thể trực diện; May I ask your name? lịch sự hơn.",
        "And you? chỉ rõ nghĩa khi ngữ cảnh trước đó đã thiết lập loại thông tin đang trao đổi.",
      ],
      vietnameseLearnerRisks: [
        "Nói What your name? và bỏ động từ is.",
        "Hỏi được tên nhưng không nghe hoặc không phản hồi vì chỉ tập trung nhớ câu hỏi.",
      ],
    },
  },
  {
    capabilityId: "a0.say_where_from",
    knowledge: {
      meaningAndUse: [
        "Nói quê quán hoặc nơi xuất thân khi được hỏi trong phần giới thiệu cơ bản.",
        "Phân biệt nơi mình đến từ với nơi hiện đang sống khi bối cảnh cần rõ ràng.",
      ],
      formulaicChunks: [
        "I'm from Vietnam.",
        "I'm from Hanoi, Vietnam.",
        "I come from Vietnam.",
      ],
      grammarPatterns: [
        "I am / I'm + from + place.",
        "I come + from + place.",
        "Where are you from? as the common prompt that triggers this answer.",
      ],
      speechFeatures: [
        "Nhận ra from ở dạng yếu trong I'm from và trọng âm rơi vào tên địa điểm.",
        "Nối âm giữa I'm và from mà không bỏ mất động từ be.",
      ],
      interactionStrategies: [
        "Trả lời bằng một địa điểm đủ cụ thể cho ngữ cảnh rồi có thể hỏi lại And you?.",
        "Làm rõ city hoặc country khi người nghe chưa biết địa danh.",
      ],
      pragmaticsAndRegister: [
        "I'm from thường nói về nguồn gốc; I live in nói về nơi ở hiện tại và không nên trộn hai ý.",
        "Có thể thêm city, country để tránh mơ hồ trong hội thoại quốc tế.",
      ],
      vietnameseLearnerRisks: [
        "Nói I from Vietnam và bỏ động từ am.",
        "Nói I'm come from Vietnam do trộn hai cấu trúc đúng thành một cấu trúc sai.",
      ],
    },
  },
  {
    capabilityId: "a0.request_repetition",
    knowledge: {
      meaningAndUse: [
        "Giữ hội thoại tiếp tục khi không nghe rõ hoặc chưa hiểu thông tin vừa được nói.",
        "Báo hiệu vấn đề nghe hiểu thay vì giả vờ đã hiểu.",
      ],
      formulaicChunks: [
        "Could you say that again?",
        "Could you repeat that?",
        "Sorry, what was that?",
        "I didn't catch that.",
      ],
      grammarPatterns: [
        "Could you + base verb + object?",
        "I did not / didn't + base verb + object.",
        "What was + demonstrative pronoun? as a short repair question.",
      ],
      speechFeatures: [
        "Nhận ra weak form của could và dạng nối trong could you.",
        "Dùng trọng âm trên say, repeat, again hoặc catch để làm rõ mục đích repair.",
      ],
      interactionStrategies: [
        "Báo hiệu vấn đề, yêu cầu nhắc lại, nghe lần hai và xác nhận thông tin.",
        "Chuyển sang yêu cầu nói chậm hoặc xác nhận lựa chọn khi lặp lại vẫn chưa đủ.",
      ],
      pragmaticsAndRegister: [
        "Sorry giúp giảm độ trực diện; Could you... phù hợp ngữ cảnh trung tính và lịch sự.",
        "Again? có thể hiểu được nhưng quá ngắn trong nhiều tình huống dịch vụ hoặc công việc.",
      ],
      vietnameseLearnerRisks: [
        "Im lặng hoặc trả lời đại khi không nghe rõ vì sợ làm gián đoạn hội thoại.",
        "Học thuộc một câu duy nhất nhưng không nhận ra các biến thể tự nhiên từ người nói khác.",
      ],
    },
  },
];
