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
    question: "Chữ cái nào đứng sau chữ 'D'?",
    options: ["C", "E", "F", "G"],
    answer: "E",
    explanation: "Thứ tự là A, B, C, D, E.",
  },
  {
    id: "trial-2",
    question: "Chọn câu trả lời phù hợp cho 'What is your name?'",
    options: ["I am fine.", "My name is Lan.", "I am ten.", "Good morning."],
    answer: "My name is Lan.",
    explanation: "Dùng 'My name is...' để nói tên của mình.",
  },
  {
    id: "trial-3",
    question: "Điền vào chỗ trống: 'My name ___ Minh.'",
    options: ["am", "are", "is", "be"],
    answer: "is",
    explanation: "Dùng 'is' sau 'My name'.",
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
