import { UnitData } from "@/components/learn/UnitTemplate";

export const unit22: UnitData = {
  unitId: "unit-22",
  title: "Unit 22: Rules & Obligations",
  level: "B1",
  xp: 100,
  estimatedTime: 50,
  description: "Phân biệt must/have to/should/needn't để nói về nghĩa vụ và quy định — lỗi phổ biến nhất của người Việt khi làm việc môi trường quốc tế.",
  badgeName: "Người Tuân Thủ",
  badgeEmoji: "📋",
  situation: "Ngày đầu tiên tại công ty mới. HR giải thích nội quy: bạn MUST wear a badge at all times, you DON'T HAVE TO work overtime unless necessary, and you SHOULD always confirm meetings 24 hours in advance. Hiểu sai nghĩa các modal này → vi phạm quy định mà không biết.",
  learningOutcomes: [
    "Phân biệt must (bắt buộc nội tâm) vs have to (bắt buộc ngoại cảnh)",
    "Dùng should/shouldn't để đưa ra lời khuyên lịch sự",
    "Phân biệt needn't/don't have to (không cần) vs mustn't (không được phép)",
  ],
  culturalNote: 'Trong tiếng Anh công sở, <span class="text-emerald-400 font-semibold">must</span> nghe mạnh và nội tâm — như bạn tự đặt ra quy tắc cho mình. <span class="text-emerald-400 font-semibold">Have to</span> nghe như quy định bên ngoài đặt ra. Dùng nhầm có thể nghe kiêu ngạo hoặc quá cứng nhắc. Ví dụ: <span class="text-zinc-400">"I must finish this"</span> (tôi tự thấy phải làm) vs <span class="text-emerald-400">"I have to finish this"</span> (sếp/deadline bắt tôi làm).',
  warmupGreetings: [
    { emoji: "🪪", en: "You must wear your ID badge at all times in the building.", vn: "Bạn phải đeo thẻ ID mọi lúc trong tòa nhà.", context: "Quy định bắt buộc" },
    { emoji: "⏰", en: "You don't have to arrive before 8am — core hours are 9 to 6.", vn: "Bạn không cần đến trước 8 giờ sáng — giờ cốt lõi là 9 đến 6.", context: "Không bắt buộc" },
    { emoji: "💡", en: "You should always confirm your attendance at least 24 hours before a meeting.", vn: "Bạn nên xác nhận sự tham dự ít nhất 24 tiếng trước cuộc họp.", context: "Lời khuyên tốt" },
  ],
  vocab: [
    { id: 1, word: "regulation", emoji: "📜", phonetic: "/ˌreɡjuˈleɪʃən/", meaning: "quy định / điều lệ", example: "All employees must comply with health and safety regulations.", example2: "New regulations require companies to report emissions.", collocation: "comply with regulations / government regulation", audio: "/audio/unit22/regulation.mp3" },
    { id: 2, word: "mandatory", emoji: "✅", phonetic: "/ˈmændətəri/", meaning: "bắt buộc", example: "Attendance at the induction is mandatory for all new staff.", example2: "Safety training is mandatory in this industry.", collocation: "mandatory training / mandatory requirement", audio: "/audio/unit22/mandatory.mp3" },
    { id: 3, word: "comply", emoji: "🤝", phonetic: "/kəmˈplaɪ/", meaning: "tuân thủ", example: "All staff must comply with the company's code of conduct.", example2: "Failure to comply will result in disciplinary action.", collocation: "comply with / compliance with / non-compliance", audio: "/audio/unit22/comply.mp3" },
    { id: 4, word: "policy", emoji: "📄", phonetic: "/ˈpɒlɪsi/", meaning: "chính sách", example: "According to company policy, all expenses must be approved.", example2: "Our policy is to respond to clients within 24 hours.", collocation: "company policy / follow a policy / implement a policy", audio: "/audio/unit22/policy.mp3" },
    { id: 5, word: "obligation", emoji: "⚖️", phonetic: "/ˌɒblɪˈɡeɪʃən/", meaning: "nghĩa vụ / bổn phận", example: "You have an obligation to report any safety hazards.", example2: "There is no obligation to sign the contract today.", collocation: "legal obligation / fulfil an obligation / under no obligation", audio: "/audio/unit22/obligation.mp3" },
    { id: 6, word: "enforce", emoji: "🔒", phonetic: "/ɪnˈfɔːs/", meaning: "thực thi / áp dụng", example: "The company strictly enforces its data privacy policy.", example2: "Laws are meaningless if they are not enforced.", collocation: "enforce the rules / strictly enforce / law enforcement", audio: "/audio/unit22/enforce.mp3" },
    { id: 7, word: "violate", emoji: "❌", phonetic: "/ˈvaɪəleɪt/", meaning: "vi phạm", example: "You must not violate the confidentiality agreement.", example2: "The company was fined for violating safety standards.", collocation: "violate a rule / violate a contract / violation", audio: "/audio/unit22/violate.mp3" },
    { id: 8, word: "penalty", emoji: "💸", phonetic: "/ˈpenəlti/", meaning: "hình phạt / tiền phạt", example: "There is a penalty for late submission of tax returns.", example2: "The penalty for non-compliance can be severe.", collocation: "face a penalty / financial penalty / impose a penalty", audio: "/audio/unit22/penalty.mp3" },
    { id: 9, word: "procedure", emoji: "🔄", phonetic: "/prəˈsiːdʒər/", meaning: "quy trình / thủ tục", example: "You should follow the correct procedure for expense claims.", example2: "The standard procedure takes about three working days.", collocation: "standard procedure / follow a procedure / safety procedure", audio: "/audio/unit22/procedure.mp3" },
    { id: 10, word: "guideline", emoji: "📌", phonetic: "/ˈɡaɪdlaɪn/", meaning: "hướng dẫn / chỉ dẫn", example: "The guidelines state that reports must be submitted monthly.", example2: "Please follow the guidelines carefully to avoid errors.", collocation: "follow guidelines / set guidelines / official guidelines", audio: "/audio/unit22/guideline.mp3" },
    { id: 11, word: "authorize", emoji: "🔑", phonetic: "/ˈɔːθəraɪz/", meaning: "ủy quyền / cho phép", example: "Only authorized personnel are allowed in the server room.", example2: "You need a manager to authorize purchases over $500.", collocation: "authorized personnel / authorize access / prior authorization", audio: "/audio/unit22/authorize.mp3" },
    { id: 12, word: "confidential", emoji: "🔐", phonetic: "/ˌkɒnfɪˈdenʃəl/", meaning: "bảo mật / mật", example: "You must not share confidential information with outside parties.", example2: "All client data is strictly confidential.", collocation: "strictly confidential / confidential information / keep confidential", audio: "/audio/unit22/confidential.mp3" },
  ],
  dialogues: [
    {
      id: 1,
      title: "Buổi định hướng nhân viên mới",
      audio: "/audio/unit22/dialogue_1.mp3",
      desc: "HR giải thích quy định công ty cho Minh — nhân viên mới.",
      lines: [
        { id: "d1-1", speaker: "HR", text: "Welcome, Minh! Let me explain some important rules. You must wear your ID badge at all times in the office.", translation: "Chào mừng, Minh! Hãy để tôi giải thích một số quy tắc quan trọng. Bạn phải đeo thẻ ID mọi lúc trong văn phòng." },
        { id: "d1-2", speaker: "Minh", text: "Of course. Do I have to arrive at a specific time each morning?", translation: "Được chứ. Tôi có phải đến vào giờ cụ thể mỗi sáng không?" },
        { id: "d1-3", speaker: "HR", text: "You have to be at your desk by 9am. But you don't have to stay past 6pm unless there's an urgent deadline.", translation: "Bạn phải có mặt ở bàn làm việc trước 9 giờ sáng. Nhưng bạn không cần ở lại sau 6 giờ chiều trừ khi có deadline gấp." },
        { id: "d1-4", speaker: "Minh", text: "What about client information? Should I be careful about sharing it?", translation: "Còn thông tin khách hàng thì sao? Tôi có nên cẩn thận khi chia sẻ không?" },
        { id: "d1-5", speaker: "HR", text: "Absolutely. You must never share confidential client data. You mustn't send it by personal email — only through our secure system.", translation: "Chắc chắn rồi. Bạn không bao giờ được chia sẻ dữ liệu khách hàng bảo mật. Bạn không được gửi qua email cá nhân — chỉ qua hệ thống bảo mật của chúng tôi." },
        { id: "d1-6", speaker: "Minh", text: "I understand. Should I sign anything to confirm I've understood the policies?", translation: "Tôi hiểu rồi. Tôi có nên ký gì để xác nhận tôi đã hiểu các chính sách không?" },
      ],
    },
    {
      id: 2,
      title: "Giải thích quy trình cho khách",
      audio: "/audio/unit22/dialogue_2.mp3",
      desc: "Lan giải thích quy trình duyệt chi phí cho đồng nghiệp mới.",
      lines: [
        { id: "d2-1", speaker: "New Staff", text: "Do I have to get approval for every purchase?", translation: "Tôi có phải xin duyệt cho mỗi lần mua không?" },
        { id: "d2-2", speaker: "Lan", text: "For anything under $50, you don't have to. But for larger amounts, you must get manager authorization.", translation: "Với bất cứ thứ gì dưới 50 đô, bạn không cần. Nhưng với số tiền lớn hơn, bạn phải có ủy quyền từ quản lý." },
        { id: "d2-3", speaker: "New Staff", text: "Should I keep all my receipts?", translation: "Tôi có nên giữ tất cả biên lai không?" },
        { id: "d2-4", speaker: "Lan", text: "Yes, you must keep receipts for everything over $10. You needn't keep receipts for small items like coffee, though.", translation: "Có, bạn phải giữ biên lai cho mọi thứ trên 10 đô. Tuy nhiên, bạn không cần giữ biên lai cho những thứ nhỏ như cà phê." },
      ],
    },
  ],
  listenAndChoose: [
    { id: "lac1", audio_text: "You must wear your ID badge at all times in the building", options: ["You should wear your ID badge at all times in the building", "You must wear your ID badge at all times in the building", "You have to wearing your ID badge at all times", "You must to wear your ID badge at all times"], answer: "You must wear your ID badge at all times in the building" },
    { id: "lac2", audio_text: "You don't have to arrive before eight am", options: ["You don't must arrive before eight am", "You mustn't arrive before eight am", "You don't have to arrive before eight am", "You needn't to arrive before eight am"], answer: "You don't have to arrive before eight am" },
    { id: "lac3", audio_text: "You should always confirm your attendance twenty four hours before", options: ["You must always confirm your attendance twenty four hours before", "You should always confirm your attendance twenty four hours before", "You have to always confirm your attendance twenty four hours before", "You ought confirm your attendance twenty four hours before"], answer: "You should always confirm your attendance twenty four hours before" },
    { id: "lac4", audio_text: "You must never share confidential client data", options: ["You should never share confidential client data", "You don't have to share confidential client data", "You must never share confidential client data", "You needn't share confidential client data"], answer: "You must never share confidential client data" },
    { id: "lac5", audio_text: "For larger amounts you must get manager authorization", options: ["For larger amounts you should get manager authorization", "For larger amounts you must get manager authorization", "For larger amounts you have to getting manager authorization", "For larger amounts you must to get manager authorization"], answer: "For larger amounts you must get manager authorization" },
  ],
  speaking: {
    level1Prompt: "In our company, you must {input}. You don't have to {input}, but you should {input}.",
    level1Placeholder: "Ví dụ: wear a badge — work overtime — confirm meetings in advance...",
    level2Situation: "Bạn là HR đang giải thích quy định công ty cho nhân viên mới. Giải thích: (1) Những gì PHẢI làm (must/have to), (2) Những gì KHÔNG CẦN làm (don't have to/needn't), (3) Những gì NÊN làm (should), (4) Những gì KHÔNG ĐƯỢC làm (mustn't).",
    level2Hint: "You must/have to [mandatory rule]. You don't have to [optional]. However, you should [recommendation]. You mustn't [prohibition] — this is strictly enforced. If you violate [policy], there will be [consequence].",
  },
  grammar: {
    title: "Modal Verbs — Nghĩa Vụ, Khuyên Bảo & Cấm Đoán",
    rule: "MUST: Nghĩa vụ mạnh — người nói tự thấy bắt buộc\n→ 'I must finish this report.' (tôi tự đặt ra)\n\nHAVE TO: Nghĩa vụ ngoại cảnh — luật/quy định/người khác bắt buộc\n→ 'I have to wear a badge.' (công ty quy định)\n\nSHOULD: Lời khuyên — nên làm nhưng không bắt buộc\n→ 'You should arrive early for meetings.'\n\nDON'T HAVE TO / NEEDN'T: Không cần thiết (nhưng được phép)\n→ 'You don't have to work overtime.'\n\nMUSTN'T: Bị cấm — tuyệt đối không được làm\n→ 'You mustn't share confidential data.'",
    examples: [
      { en: "You must comply with all health regulations. (strong personal obligation)", vn: "Bạn phải tuân thủ tất cả quy định y tế." },
      { en: "I have to submit the report by Friday. (external rule/deadline)", vn: "Tôi phải nộp báo cáo trước thứ Sáu." },
      { en: "You mustn't share client data — it's strictly prohibited. (absolute prohibition)", vn: "Bạn không được chia sẻ dữ liệu khách hàng — bị cấm hoàn toàn." },
    ],
    tip: "Bí quyết: MUSTN'T ≠ DON'T HAVE TO. 'You mustn't do it' = bị CẤM. 'You don't have to do it' = không bắt buộc, nhưng bạn CÓ THỂ nếu muốn. Nhầm hai cái này → hiểu sai quy định hoàn toàn.",
    vnNote: "⚠️ Lưu ý người Việt: Tiếng Việt dùng 'phải' cho cả must và have to, 'không cần' cho don't have to và mustn't. Trong tiếng Anh, 4 modal này hoàn toàn khác nhau về mức độ bắt buộc và ý nghĩa pháp lý.",
    dialogueExample: {
      speaker: "HR",
      text: "You must wear your ID badge at all times. You have to be at your desk by 9am. You don't have to stay past 6pm. But you mustn't share confidential data — ever.",
      translation: "Bạn phải đeo thẻ ID mọi lúc. Bạn phải ở bàn làm việc trước 9 giờ. Bạn không cần ở lại sau 6 giờ. Nhưng bạn không được chia sẻ dữ liệu bảo mật — không bao giờ.",
      highlight: "must (strong rule) | have to (external rule) | don't have to (optional) | mustn't (prohibition)",
    },
    ccq: {
      question: "Câu nào có nghĩa: 'Không bắt buộc, nhưng bạn CÓ THỂ nếu muốn'?",
      options: [
        "You mustn't submit a report today.",
        "You must submit a report today.",
        "You don't have to submit a report today.",
        "You have to submit a report today.",
      ],
      answer: "You don't have to submit a report today.",
      explanation: "'Don't have to' = không bắt buộc nhưng được phép. Khác hoàn toàn với 'mustn't' = bị cấm.",
    },
  },
  practiceQuiz: [
    { id: "pq1", type: "multiple-choice", question: "Chọn đúng nghĩa: 'You ___  attend the training — it's optional.'", options: ["must", "mustn't", "have to", "don't have to"], answer: "don't have to" },
    { id: "pq2", type: "multiple-choice", question: "Chọn đúng: Hành động BỊ CẤM hoàn toàn.", options: ["You should share passwords.", "You don't have to share passwords.", "You mustn't share passwords.", "You needn't share passwords."], answer: "You mustn't share passwords." },
    { id: "pq3", type: "cloze", question: "Điền modal phù hợp: 'According to company policy, all visitors ___ sign in at reception.'", answer: "must / have to" },
    { id: "pq4", type: "multiple-choice", question: "Phân biệt must vs have to: 'I feel this is important, so I ___ finish it today.'", options: ["have to", "must", "should", "don't have to"], answer: "must" },
    { id: "pq5", type: "multiple-choice", question: "Câu nào diễn đạt LỜI KHUYÊN (không bắt buộc)?", options: ["You must arrive on time.", "You have to confirm attendance.", "You should confirm attendance in advance.", "You mustn't be late."], answer: "You should confirm attendance in advance." },
  ],
  matchingExercise: {
    title: "Nối modal với nghĩa đúng",
    pairs: [
      { left: "must", right: "bắt buộc (nội tâm)" },
      { left: "have to", right: "bắt buộc (ngoại cảnh)" },
      { left: "should", right: "nên làm" },
      { left: "mustn't", right: "bị cấm" },
      { left: "don't have to", right: "không bắt buộc" },
    ],
  },
  practiceTranslate: [
    {
      id: "pt-1",
      prompt_vn: "Nhân viên phải tuân thủ chính sách bảo mật của công ty.",
      answer: "Employees must comply with the company's data policy.",
    },
  ],

  sentenceCorrectionExercises: [
    {
      id: "sc22-1",
      sentence: "You must to wear a seatbelt when driving.",
      errorWord: "must to",
      correction: "must",
      explanation_vn: "'Must' là động từ khiếm khuyết — KHÔNG dùng 'to' sau 'must'. Đúng: 'must wear' (bare infinitive).",
    },
    {
      id: "sc22-2",
      sentence: "He don't have to works on weekends.",
      errorWord: "don't have to works",
      correction: "doesn't have to work",
      explanation_vn: "'He' → 'doesn't' + bare infinitive: 'doesn't have to WORK'. Không thêm '-s' sau 'to'.",
    },
  ],


  listenAndArrangeExercises: [
    {
      id: "la22-1",
      audio_text: "You must wear a helmet when riding a motorbike.",
      prompt_vn: "Bạn phải đội mũ bảo hiểm khi đi xe máy.",
      words: ["You", "must", "wear", "a", "helmet", "when", "riding", "a", "motorbike", ".", "have", "to"],
      answer: "You must wear a helmet when riding a motorbike .",
    },
    {
      id: "la22-2",
      audio_text: "She doesn't have to work on Saturdays.",
      prompt_vn: "Cô ấy không phải làm việc vào thứ Bảy.",
      words: ["She", "doesn't", "have", "to", "work", "on", "Saturdays", ".", "don't", "works"],
      answer: "She doesn't have to work on Saturdays .",
    },
  ],


  wordBankExercises: [
    {
      id: "wb1",
      prompt_vn: "Bạn phải đeo thẻ ID mọi lúc trong tòa nhà.",
      words: ["You", "must", "wear", "your", "ID", "badge", "at", "all", "times", "in", "the", "building", ".", "would", "could"],
      answer: "You must wear your ID badge at all times in the building .",
    },
    {
      id: "wb2",
      prompt_vn: "Bạn không được chia sẻ mật khẩu với ai.",
      words: ["You", "mustn't", "share", "your", "password", "with", "anyone", ".", "would", "could"],
      answer: "You mustn't share your password with anyone .",
    },
    {
      id: "wb3",
      prompt_vn: "Bạn không cần làm thêm giờ trừ khi có deadline gấp.",
      words: ["You", "don't", "have", "to", "work", "overtime", "unless", "there", "is", "an", "urgent", "deadline", ".", "would", "could"],
      answer: "You don't have to work overtime unless there is an urgent deadline .",
    },
  ],

  scrambleExercises: [
    { id: "s22-1", prompt_vn: "Bạn phải đeo thẻ ID mọi lúc trong tòa nhà.", words: ["You", "must", "wear", "your", "ID", "badge", "at", "all", "times", "in", "the", "building", "."], answer: "You must wear your ID badge at all times in the building ." },
    { id: "s22-2", prompt_vn: "Bạn không được chia sẻ mật khẩu với ai.", words: ["You", "mustn't", "share", "your", "password", "with", "anyone", "."], answer: "You mustn't share your password with anyone ." },
    { id: "s22-3", prompt_vn: "Bạn không cần làm thêm giờ trừ khi có deadline gấp.", words: ["You", "don't", "have", "to", "work", "overtime", "unless", "there", "is", "an", "urgent", "deadline", "."], answer: "You don't have to work overtime unless there is an urgent deadline ." },
  ],
  quiz: [
    { id: "fq1", type: "multiple-choice", question: "Dịch: 'Nhân viên phải tuân thủ chính sách bảo mật của công ty.'", options: ["Employees should comply with the company's data policy.", "Employees must comply with the company's data policy.", "Employees needn't comply with the company's data policy.", "Employees don't have to comply with the company's data policy."], answer: "Employees must comply with the company's data policy." },
    { id: "fq2", type: "cloze", question: "Điền: 'You ___ share confidential information — it's strictly prohibited.'", answer: "mustn't" },
    { id: "fq3", type: "multiple-choice", question: "Chọn đúng — Quy định từ BÊN NGOÀI đặt ra:", options: ["I must submit this — I feel it's important.", "I have to submit this — the deadline is tomorrow.", "I should submit this — it would be good.", "I needn't submit this yet."], answer: "I have to submit this — the deadline is tomorrow." },
    { id: "fq4", type: "translate", question: "Dịch: 'Bạn không cần xin duyệt cho những khoản dưới 50 đô.'", answer: "You don't have to get approval for amounts under $50." },
    { id: "fq5", type: "multiple-choice", question: "Câu nào đúng cho tình huống: hành vi tùy chọn, không bắt buộc?", options: ["Staff must attend the Friday meeting.", "Staff mustn't attend the Friday meeting.", "Staff don't have to attend the optional Friday meeting.", "Staff have to attend the Friday meeting."], answer: "Staff don't have to attend the optional Friday meeting." },
  ],
  cumulativeReviewQuestions: [
    { id: "cr22-1", question: "Ôn tập Unit 21 — Chọn đúng: 'By next year, we ___ into Asia.'", options: ["will expand", "will have expanded", "will be expanded", "expand"], answer: "will have expanded", type: "multiple-choice" },
    { id: "cr22-2", question: "Ôn tập Unit 20 — Điền: 'By the time I arrived, they ___ (sign) the deal.'", options: [], answer: "had signed", type: "cloze" },
    { id: "cr22-3", question: "Ôn tập Unit 19 — Câu kể chuyện tự nhiên nhất:", options: ["The server crashed. I fixed it.", "I was fixing the server when the power went out.", "I fix the server when power goes out.", "The server was crashed."], answer: "I was fixing the server when the power went out.", type: "multiple-choice" },
  ],
  fluencyDrill: {
    items: [
      { en: "You must wear your ID badge at all times", vn: "Bạn phải đeo thẻ ID mọi lúc" },
      { en: "You don't have to work overtime", vn: "Bạn không cần làm thêm giờ" },
      { en: "You should confirm meetings in advance", vn: "Bạn nên xác nhận cuộc họp trước" },
      { en: "You mustn't share confidential data", vn: "Bạn không được chia sẻ dữ liệu bảo mật" },
      { en: "Do I have to get manager approval?", vn: "Tôi có phải xin duyệt từ quản lý không?" },
      { en: "You needn't keep receipts under ten dollars", vn: "Bạn không cần giữ biên lai dưới 10 đô" },
      { en: "All staff must comply with safety regulations", vn: "Tất cả nhân viên phải tuân thủ quy định an toàn" },
      { en: "You should always follow the correct procedure", vn: "Bạn luôn nên tuân theo quy trình đúng" },
    ],
  },
  readingPassage: {
    id: "unit22-reading-1",
    title: "Office Rules and Policies",
    title_vn: "Đọc đoạn về quy định văn phòng",
    level: "B1" as const,
    text:
      "Welcome to TechViet! Before you start work, please read our office policies carefully. " +
      "All employees must wear their ID badge at all times in the building. " +
      "You must not share your login password with anyone, including colleagues. " +
      "Employees have to attend the Monday morning briefing unless they are on leave. " +
      "You don't have to work overtime, but you should inform your manager if you cannot finish your tasks on time. " +
      "Staff should respond to emails within 24 hours. " +
      "You must not use company computers for personal activities. " +
      "If you need to take sick leave, you have to notify HR before 9 AM. " +
      "All employees ought to complete the annual safety training by December 31st. " +
      "We hope you enjoy working here!",
    questions: [
      {
        id: "u22r-q1",
        question_vn: "Nhân viên phải đeo gì mọi lúc trong tòa nhà?",
        options: [
          "A uniform",
          "A helmet",
          "Their ID badge",
          "A visitor pass",
        ],
        answer: "Their ID badge",
        explanation_vn: "'All employees must wear their ID badge at all times in the building.'",
      },
      {
        id: "u22r-q2",
        question_vn: "Nhân viên phải họp vào khi nào?",
        options: [
          "Every Friday afternoon",
          "Monday morning briefing",
          "Every Wednesday",
          "Monthly team meetings",
        ],
        answer: "Monday morning briefing",
        explanation_vn: "'Employees have to attend the Monday morning briefing.'",
      },
      {
        id: "u22r-q3",
        question_vn: "Nhân viên nên trả lời email trong bao lâu?",
        options: ["12 hours", "24 hours", "48 hours", "72 hours"],
        answer: "24 hours",
        explanation_vn: "'Staff should respond to emails within 24 hours.'",
      },
      {
        id: "u22r-q4",
        question_vn: "Nếu cần nghỉ ốm, nhân viên phải thông báo cho ai và trước mấy giờ?",
        options: [
          "Their manager, before 8 AM",
          "HR, before 9 AM",
          "Their team, before 10 AM",
          "The director, before 8:30 AM",
        ],
        answer: "HR, before 9 AM",
        explanation_vn: "'you have to notify HR before 9 AM.'",
      },
    ],
  },
  shadowingVideoId: "4ALKkMNtlrY",
};

export default unit22;
