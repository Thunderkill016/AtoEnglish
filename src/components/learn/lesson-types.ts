import type { ReadingPassage } from "@/components/exercises/ReadingComprehensionExercise";

export interface VocabItem {
  id: number;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  example2?: string;
  collocation?: string;
  audio?: string;
  emoji?: string;
  image_url?: string;
  l1_interference_vn?: string;
}

export interface WarmupCard {
  id: string;
  word: string;
  phonetic?: string | null;
  meaning_vn: string;
  example_en?: string | null;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  text: string;
  translation: string;
}

export interface Dialogue {
  id: number;
  title: string;
  audio: string;
  desc: string;
  lines: DialogueLine[];
}

export interface WarmupGreeting {
  emoji: string;
  en: string;
  vn: string;
  context: string;
}

export interface ListenAndChooseItem {
  id: string;
  audio_text: string;
  options: string[];
  answer: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options?: string[];
  answer: string;
  type: "multiple-choice" | "cloze" | "translate" | "true-false";
  explanation_vn?: string;
}

export interface SpeakingData {
  level1Prompt: string;
  level1Placeholder: string;
  level2Situation: string;
  level2Hint: string;
}

export interface GrammarPoint {
  title: string;
  rule: string;
  conjugation?: Array<{
    subject: string;
    form: string;
    example: string;
  }>;
  examples: Array<{
    en: string;
    vn: string;
  }>;
  tip?: string;
  vnNote?: string;
  dialogueExample?: {
    speaker: string;
    text: string;
    translation: string;
    highlight: string;
  };
  ccq?: {
    question: string;
    options: string[];
    answer: string;
    explanation?: string;
  };
}

export interface PronunciationFocus {
  phoneme: string;
  description: string;
  examples: Array<{
    word: string;
    ipa: string;
    tip: string;
  }>;
  minimalPairs?: Array<[string, string]>;
}

export interface FluencyDrill {
  title?: string;
  timeLimit?: number;
  items: Array<{
    en: string;
    vn: string;
  }>;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface MatchingExercise {
  title?: string;
  pairs: MatchingPair[];
}

export interface SentenceScramble {
  id: string;
  prompt_vn: string;
  words: string[];
  answer: string;
}

export interface WordBankQuestion {
  id: string;
  prompt_vn: string;
  words: string[];
  answer: string;
  hint?: string;
}

export interface SentenceCorrectionExercise {
  id: string;
  sentence: string;
  errorWord: string;
  correction: string;
  explanation_vn: string;
  distractors?: string[];
}

export interface ListenArrangeItem {
  id: string;
  audio_text: string;
  prompt_vn: string;
  words: string[];
  answer: string;
}

export interface UnitData {
  unitId: string;
  title: string;
  level: string;
  xp: number;
  estimatedTime: number;
  description: string;
  badgeName: string;
  badgeEmoji: string;
  warmupGreetings: WarmupGreeting[];
  culturalNote: string;
  vocab: VocabItem[];
  grammar?: GrammarPoint;
  matchingExercise?: MatchingExercise;
  scrambleExercises?: SentenceScramble[];
  wordBankExercises?: WordBankQuestion[];
  sentenceCorrectionExercises?: SentenceCorrectionExercise[];
  listenAndArrangeExercises?: ListenArrangeItem[];
  practiceQuiz?: QuizQuestion[];
  practiceTranslate?: { id: string; prompt_vn: string; answer: string }[];
  dialogues: Dialogue[];
  dialogues_list?: Dialogue[];
  listenAndChoose: ListenAndChooseItem[];
  speaking: SpeakingData;
  quiz: QuizQuestion[];
  cumulativeReviewQuestions?: QuizQuestion[];
  situation?: string;
  learningOutcomes?: string[];
  pronunciationFocus?: PronunciationFocus;
  fluencyDrill?: FluencyDrill;
  readingPassage?: ReadingPassage;
  shadowingVideoId?: string;
  jobScenarios?: Array<{
    id: number;
    title: string;
    focus?: string;
    context?: string;
    l1Note?: string;
    example?: string;
  }>;
}
