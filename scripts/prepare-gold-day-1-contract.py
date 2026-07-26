from pathlib import Path

path = Path("src/lib/data/units/unitA01.ts")
text = path.read_text()

word_bank = '''  wordBankExercises: [
    {
      id: "gd1-wb1",
      prompt_vn: "Sắp xếp thành câu chào và giới thiệu tên.",
      words: ["Hi.", "I'm", "Minh.", "Nice", "to", "meet", "you."],
      answer: "Hi. I'm Minh. Nice to meet you.",
    },
    {
      id: "gd1-wb2",
      prompt_vn: "Sắp xếp thành câu hỏi cách đánh vần.",
      words: ["How", "do", "you", "spell", "that?"],
      answer: "How do you spell that?",
    },
    {
      id: "gd1-wb3",
      prompt_vn: "Sắp xếp thành câu xin người đối diện nói lại.",
      words: ["Sorry,", "could", "you", "say", "that", "again,", "please?"],
      answer: "Sorry, could you say that again, please?",
    },
  ],

'''

reading = '''  readingPassage: {
    id: "uA01-reading-1",
    title: "First day at reception",
    title_vn: "Ngày đầu tại quầy lễ tân",
    text:
      "Minh arrives at a new office. The receptionist asks his name. Minh says, ‘Hi. I'm Minh.’ The receptionist asks him to spell it, so he says, ‘M-I-N-H.’ Minh does not hear one sentence clearly, so he says, ‘Sorry, could you say that again, please?’ They finish with, ‘Nice to meet you.’",
    level: "A0",
    questions: [
      {
        id: "gd1-read-q1",
        question_vn: "Minh đang ở đâu?",
        options: ["Tại quầy lễ tân", "Trong nhà hàng", "Ở sân bay", "Trong siêu thị"],
        answer: "Tại quầy lễ tân",
        explanation_vn: "Đoạn đọc nói Minh đến một văn phòng mới và gặp nhân viên lễ tân.",
      },
      {
        id: "gd1-read-q2",
        question_vn: "Minh trả lời câu hỏi về tên như thế nào?",
        options: ["Hi. I'm Minh.", "I work here.", "I'm from Hanoi.", "Thank you."],
        answer: "Hi. I'm Minh.",
        explanation_vn: "Minh dùng cụm ‘Hi. I'm Minh.’ để chào và nói tên.",
      },
      {
        id: "gd1-read-q3",
        question_vn: "Minh đánh vần tên như thế nào?",
        options: ["M-I-N-H", "N-I-M-H", "M-E-N-H", "M-I-M-H"],
        answer: "M-I-N-H",
        explanation_vn: "Minh đọc từng chữ cái M-I-N-H.",
      },
      {
        id: "gd1-read-q4",
        question_vn: "Minh nói gì khi chưa nghe rõ?",
        options: [
          "Sorry, could you say that again, please?",
          "How do you spell that?",
          "What's your name?",
          "Nice to meet you.",
        ],
        answer: "Sorry, could you say that again, please?",
        explanation_vn: "Đây là câu repair chính của Day 1.",
      },
    ],
  },

'''

if "wordBankExercises:" not in text:
    marker = "  speaking: {"
    if marker not in text:
        raise SystemExit("Missing speaking marker")
    text = text.replace(marker, word_bank + marker, 1)

if "readingPassage:" not in text:
    marker = "  jobScenarios: ["
    if marker not in text:
        raise SystemExit("Missing jobScenarios marker")
    text = text.replace(marker, reading + marker, 1)

path.write_text(text)
