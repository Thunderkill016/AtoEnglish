import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P3 B1 — process language: first / then / after that / finally + sequence.
 * Core: sequence markers + present simple steps (SOP / how-to).
 * Work SOP scenarios. Spiral: b1-05 (if/when + will).
 * L1 notes ≥50% (B1 schema gate); aim 100% for VN adults.
 */
export const lessonB106: LessonSpec = {
  id: "l-b1-06",
  phase: "P3",
  cefr: "B1",
  title_vi: "Mô tả quy trình",
  estimatedMin: 40,
  canDo: [
    "Mô tả quy trình 3–5 bước: First → Then → After that → Finally",
    "Dùng next / before / after + present simple cho SOP / how-to",
    "Nói 45–60s work how-to: ≥4 sequence markers + clear steps",
  ],
  situation:
    "Office + IT: đồng nghiệp hỏi 'How do I submit the report?' / 'Walk me through the process.' Bạn trả lời 45–60 giây: First… Then… After that… Finally… · dùng next / before / step · ≥1 check hoặc submit.",
  culturalNote_vi:
    "Process language = mô tả thứ tự bước (SOP, how-to, onboarding). First / Then / Next / After that / Finally + present simple. Before + V-ing / N. After + V-ing / N. Soften: First, you need to… / After that, please… Tránh: First, you will going… / After that, you must to… / Finally, I will finished…",
  jobAngle: "Work SOP — submit report, install app, check list, download file, onboarding steps",
  lexis: [
    {
      id: "v1",
      word: "first",
      phonetic: "/fɜːst/",
      meaning_vi: "trước tiên / bước 1",
      example_en: "First, open the form on the portal.",
      l1_note_vi:
        "First, + present / imperative. Không: Firstly you will… (ok but First, is simpler at B1).",
    },
    {
      id: "v2",
      word: "then",
      phonetic: "/ðen/",
      meaning_vi: "sau đó (bước tiếp)",
      example_en: "Then, fill in your name and team.",
      l1_note_vi:
        "Then, + V. then ≠ than (so sánh). Không: Thening…",
    },
    {
      id: "v3",
      word: "after that",
      phonetic: "/ˈɑːftə ðæt/",
      meaning_vi: "sau đó (tiếp theo bước vừa rồi)",
      example_en: "After that, attach the PDF file.",
      l1_note_vi:
        "After that, + present. after + N/V-ing: after lunch / after finishing.",
    },
    {
      id: "v4",
      word: "finally",
      phonetic: "/ˈfaɪnəli/",
      meaning_vi: "cuối cùng",
      example_en: "Finally, click Submit and wait for the email.",
      l1_note_vi:
        "Finally, = last step. ≠ at last (cảm xúc chờ lâu). Không: finaly (sai chính tả).",
    },
    {
      id: "v5",
      word: "next",
      phonetic: "/nekst/",
      meaning_vi: "tiếp theo",
      example_en: "Next, check the date and the manager name.",
      l1_note_vi:
        "Next, + V. the next step. next week (thời gian) ≠ process next.",
    },
    {
      id: "v6",
      word: "step",
      phonetic: "/step/",
      meaning_vi: "bước (trong quy trình)",
      example_en: "This process has four steps.",
      l1_note_vi:
        "step 1 / the next step / follow the steps. Không: steppings.",
    },
    {
      id: "v7",
      word: "process",
      phonetic: "/ˈprəʊses/",
      meaning_vi: "quy trình / quá trình",
      example_en: "The onboarding process is simple.",
      l1_note_vi:
        "a process / the process. process (v) = xử lý. stress PRO-cess (n).",
    },
    {
      id: "v8",
      word: "check",
      phonetic: "/tʃek/",
      meaning_vi: "kiểm tra",
      example_en: "Before you submit, check the file name.",
      l1_note_vi:
        "check + N. double-check = kiểm tra lại. Không: check to the file.",
    },
    {
      id: "v9",
      word: "submit",
      phonetic: "/səbˈmɪt/",
      meaning_vi: "nộp / gửi (form, báo cáo)",
      example_en: "Finally, submit the report before 5 p.m.",
      l1_note_vi:
        "submit a form / report. past: submitted. Không: submit to send (thừa).",
    },
    {
      id: "v10",
      word: "download",
      phonetic: "/ˌdaʊnˈləʊd/",
      meaning_vi: "tải xuống",
      example_en: "First, download the app from the store.",
      l1_note_vi:
        "download + N. opposite: upload. Không: download down.",
    },
    {
      id: "v11",
      word: "install",
      phonetic: "/ɪnˈstɔːl/",
      meaning_vi: "cài đặt",
      example_en: "Then, install the app and open it.",
      l1_note_vi:
        "install software / an app. Không: installate (sai).",
    },
    {
      id: "v12",
      word: "before",
      phonetic: "/bɪˈfɔː/",
      meaning_vi: "trước khi",
      example_en: "Before you leave, save the file.",
      l1_note_vi:
        "before + clause / before + V-ing. Không: before to leave.",
    },
  ],
  grammar: {
    title: "Process language — sequence markers",
    rule: "First / Then / Next / After that / Finally + present · Before/After + V-ing",
    examples: [
      {
        en: "First, open the form. Then, fill in your details.",
        vi: "Trước tiên, mở form. Sau đó, điền thông tin.",
      },
      {
        en: "After that, attach the file. Finally, click Submit.",
        vi: "Sau đó, đính kèm file. Cuối cùng, bấm Submit.",
      },
      {
        en: "Before you submit, check the date and the name.",
        vi: "Trước khi nộp, kiểm tra ngày và tên.",
      },
    ],
    vnNote:
      "Mô tả quy trình: First → Then/Next → After that → Finally + present simple (hoặc imperative). Before/After + clause hoặc V-ing. Sai hay gặp: After that, you must to… / Finally, I will finished… / Before to submit…",
    ccq: {
      question: "Thứ tự markers đúng cho quy trình 4 bước?",
      options: [
        "First → Then → After that → Finally",
        "Finally → First → Then → After that",
        "After that → First → Finally → Then",
        "Then → Finally → First → After that",
      ],
      answer: "First → Then → After that → Finally",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Bước đầu quy trình thường bắt đầu bằng:",
      options: ["First,", "Finally,", "After that,", "Then only,"],
      answer: "First,",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "Bước cuối: ___, click Submit.",
      options: ["Finally", "First", "Before first", "Unless"],
      answer: "Finally",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: First / open / the / form / Then / fill / it / in",
      words: ["First", "open", "the", "form", "Then", "fill", "it", "in"],
      answer: "First open the form Then fill it in",
    },
    {
      id: "c4",
      type: "correction",
      prompt_vi: "Sửa: Before to submit, check the file.",
      stem: "Before to submit, check the file.",
      answer: "Before you submit, check the file.",
    },
    {
      id: "c5",
      type: "mcq",
      prompt_vi: "After that ≈",
      options: [
        "tiếp theo sau bước vừa rồi",
        "bước đầu tiên",
        "không bao giờ",
        "chỉ quá khứ",
      ],
      answer: "tiếp theo sau bước vừa rồi",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "before + V-ing đúng:",
      options: [
        "Before leaving, save the file",
        "Before to leave, save the file",
        "Before leave, save the file",
        "Before will leave, save",
      ],
      answer: "Before leaving, save the file",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Colleague — nộp báo cáo (SOP)",
        context_vi: "Đồng nghiệp hướng dẫn quy trình submit report trên portal.",
        lines: [
          {
            id: "1",
            speaker: "Lan",
            text: "How do I submit the weekly report?",
            translation_vi: "Mình nộp báo cáo tuần thế nào?",
          },
          {
            id: "2",
            speaker: "Minh",
            text: "First, open the form on the portal.",
            translation_vi: "Trước tiên, mở form trên portal.",
          },
          {
            id: "3",
            speaker: "Minh",
            text: "Then, fill in your name, team, and the date.",
            translation_vi: "Sau đó, điền tên, team và ngày.",
          },
          {
            id: "4",
            speaker: "Minh",
            text: "After that, attach the PDF file.",
            translation_vi: "Tiếp theo, đính kèm file PDF.",
          },
          {
            id: "5",
            speaker: "Lan",
            text: "Do I need to check anything before I submit?",
            translation_vi: "Mình cần check gì trước khi nộp không?",
          },
          {
            id: "6",
            speaker: "Minh",
            text: "Yes. Before you submit, check the file name. Finally, click Submit.",
            translation_vi:
              "Có. Trước khi nộp, check tên file. Cuối cùng, bấm Submit.",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "IT help — cài app công ty",
        context_vi: "IT hướng dẫn cài app: download → install → log in → check.",
        lines: [
          {
            id: "1",
            speaker: "Hoa",
            text: "Can you walk me through the install process?",
            translation_vi: "Bạn hướng dẫn quy trình cài giúp mình được không?",
          },
          {
            id: "2",
            speaker: "IT",
            text: "Sure. First, download the app from the company store.",
            translation_vi: "Được. Trước tiên, tải app từ store công ty.",
          },
          {
            id: "3",
            speaker: "IT",
            text: "Next, install it and open the app.",
            translation_vi: "Tiếp theo, cài rồi mở app.",
          },
          {
            id: "4",
            speaker: "Hoa",
            text: "What do I do after that?",
            translation_vi: "Sau đó mình làm gì?",
          },
          {
            id: "5",
            speaker: "IT",
            text: "After that, log in with your work email.",
            translation_vi: "Sau đó, đăng nhập bằng email công ty.",
          },
          {
            id: "6",
            speaker: "IT",
            text: "Finally, check that your team channel appears. If it does not load, message us.",
            translation_vi:
              "Cuối cùng, check kênh team hiện ra. Nếu không load, nhắn chúng tôi.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "First, open the form on the portal",
        options: [
          "First, open the form on the portal",
          "Finally, open the form on the portal",
          "First, you will opening the form",
          "First open form the portal on",
        ],
        answer: "First, open the form on the portal",
      },
      {
        id: "lac2",
        audio_text: "Then, fill in your name and team",
        options: [
          "Then, fill in your name and team",
          "Then, filling your name and team",
          "Than, fill in your name and team",
          "Then fill to your name and team",
        ],
        answer: "Then, fill in your name and team",
      },
      {
        id: "lac3",
        audio_text: "After that, attach the PDF file",
        options: [
          "After that, attach the PDF file",
          "After that, you must to attach the PDF",
          "Before that, attach the PDF file",
          "After that attach PDF the file",
        ],
        answer: "After that, attach the PDF file",
      },
      {
        id: "lac4",
        audio_text: "Finally, click Submit and wait",
        options: [
          "Finally, click Submit and wait",
          "First, click Submit and wait",
          "Finally, you will clicked Submit",
          "Finally click to Submit and wait",
        ],
        answer: "Finally, click Submit and wait",
      },
      {
        id: "lac5",
        audio_text: "Before you submit, check the file name",
        options: [
          "Before you submit, check the file name",
          "Before to submit, check the file name",
          "Before you will submit, check the name",
          "Before submit you, check the file name",
        ],
        answer: "Before you submit, check the file name",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "First, open the form on the portal.",
        vi: "Trước tiên, mở form trên portal.",
      },
      {
        en: "Then, fill in your name and team.",
        vi: "Sau đó, điền tên và team.",
      },
      {
        en: "After that, attach the PDF file.",
        vi: "Tiếp theo, đính kèm file PDF.",
      },
      {
        en: "Finally, click Submit and wait.",
        vi: "Cuối cùng, bấm Submit và chờ.",
      },
      {
        en: "Before you submit, check the file name.",
        vi: "Trước khi nộp, kiểm tra tên file.",
      },
      {
        en: "First, download the app from the store.",
        vi: "Trước tiên, tải app từ store.",
      },
      {
        en: "Next, install it and open the app.",
        vi: "Tiếp theo, cài rồi mở app.",
      },
      {
        en: "This process has four clear steps.",
        vi: "Quy trình này có bốn bước rõ.",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Nói 45–60s mô tả một quy trình work (nộp báo cáo / cài app / onboarding): First… → Then/Next… → After that… → Finally… · ≥1 before/check · có step hoặc process.",
    successCriteria_vi: [
      "Có First + Then (hoặc Next)",
      "Có After that + Finally",
      "Có before… check… hoặc check trước khi submit",
      "Có từ step / process / submit / install / download (ít nhất 1)",
    ],
    scaffold_en: [
      "First, …",
      "Then / Next, …",
      "After that, …",
      "Finally, … · Before you …, check…",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "First step marker:",
        options: ["First,", "Finally,", "After only,", "Unless,"],
        answer: "First,",
      },
      {
        id: "q2",
        type: "mcq",
        question: "Correct process line",
        options: [
          "After that, attach the file",
          "After that, you must to attach",
          "After that attach to the file",
          "After that, attaching will",
        ],
        answer: "After that, attach the file",
      },
      {
        id: "q3",
        type: "mcq",
        question: "Last step often uses:",
        options: ["Finally,", "First,", "Before first,", "If not ever,"],
        answer: "Finally,",
      },
      {
        id: "q4",
        type: "true-false",
        question: "Before to submit, check the file. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
      {
        id: "q5",
        type: "mcq",
        question: "then ≠",
        options: ["than (comparison)", "next step marker", "after that (near)", "sequence word"],
        answer: "than (comparison)",
      },
      {
        id: "q6",
        type: "mcq",
        question: "Typical sequence order",
        options: [
          "First → Then → After that → Finally",
          "Finally → First → Then",
          "After that → First only",
          "Then → First → Finally → never",
        ],
        answer: "First → Then → After that → Finally",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn b1-05) If clause uses:",
        options: [
          "present simple",
          "will always in if-clause",
          "past perfect only",
          "going to only",
        ],
        answer: "present simple",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn b1-05) Correct first conditional",
        options: [
          "If it rains, we will take a taxi",
          "If it will rain, we take a taxi",
          "If it rains, we takes a taxi",
          "When I will finish, I call",
        ],
        answer: "If it rains, we will take a taxi",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn b1-05) unless ≈",
        options: ["if not", "always must", "only past", "never when"],
        answer: "if not",
      },
      {
        id: "s4",
        type: "mcq",
        question: "(Ôn b1-05) When you finish, we ___ review the file.",
        options: ["will", "will to", "are will", "willing"],
        answer: "will",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "first /fɜːst/ · then /ðen/",
    description_vi:
      "first /fɜːst/ — /ɜː/ dài. then /ðen/ — /ð/ (không /d/ hay /z/). finally stress FAI-na-li. after that: /ˈɑːftə ðæt/. Nối: First_open · After_that. Stress: PRO-cess, sub-MIT, in-STALL.",
    examples: [
      { word: "first", tip_vi: "/fɜːst/ /ɜː/ dài" },
      { word: "then", tip_vi: "/ðen/ không /den/" },
      { word: "finally", tip_vi: "stress FAI- · không finaly" },
      { word: "process", tip_vi: "PRO-cess (n)" },
    ],
  },
};
