export interface TrialCheckpointQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export const TRIAL_CHECKPOINT_PASS_THRESHOLD = 2;

export const TRIAL_CHECKPOINT_QUESTIONS: TrialCheckpointQuestion[] = [
  {
    id: "trial-1",
    question: "Chọn câu trả lời phù hợp cho 'What is your name?'",
    options: ["I am fine.", "My name is Lan.", "I am ten.", "Good morning."],
    answer: "My name is Lan.",
    explanation: "Dùng 'My name is...' hoặc 'I'm...' để nói tên của mình.",
  },
  {
    id: "trial-2",
    question: "Câu nào nói đúng nghề nghiệp của bạn?",
    options: [
      "I work designer.",
      "I work as a designer.",
      "I am work designer.",
      "My work is at designer.",
    ],
    answer: "I work as a designer.",
    explanation: "Dùng 'work as a/an + nghề nghiệp'.",
  },
  {
    id: "trial-3",
    question: "Bạn nên nói gì khi không nghe rõ người đối diện?",
    options: [
      "Could you say that again?",
      "I work at Ato.",
      "What do you work?",
      "Nice yesterday.",
    ],
    answer: "Could you say that again?",
    explanation: "Yêu cầu nhắc lại giúp bạn duy trì hội thoại thay vì đoán.",
  },
];

export function scoreTrialCheckpoint(answers: Record<string, string>) {
  const correctCount = TRIAL_CHECKPOINT_QUESTIONS.filter(
    (question) => answers[question.id] === question.answer,
  ).length;

  return {
    correctCount,
    passed: correctCount >= TRIAL_CHECKPOINT_PASS_THRESHOLD,
  };
}
