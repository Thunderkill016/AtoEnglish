/**
 * Real Talk — Types for YouTube conversation-based English lessons.
 *
 * A curated YouTube conversation is processed into a structured lesson
 * following the Pre-While-Post pedagogical framework.
 */

// ─── Video Source ──────────────────────────────────────────────────────────────

export interface RealTalkVideo {
  /** Internal ID (slug-style, e.g. "ordering-coffee-cafe") */
  id: string;
  /** YouTube video ID (11-char) */
  youtubeId: string;
  /** Video title */
  title: string;
  /** Vietnamese title / description for learners */
  titleVi: string;
  /** YouTube channel name */
  channelName: string;
  /** Channel URL for attribution */
  channelUrl: string;
  /** Video thumbnail URL (computed from youtubeId) */
  thumbnailUrl: string;
  /** Total video duration in seconds */
  durationSeconds: number;
  /** Segment of video used for this lesson */
  segment: { startSeconds: number; endSeconds: number };
  /** CEFR difficulty level */
  level: "A0" | "A1" | "A2" | "B1" | "B2";
  /** Topic tags */
  topics: string[];
  /** Number of speakers */
  speakerCount: number;
  /** Speaker labels and colors */
  speakers: SpeakerInfo[];
}

export interface SpeakerInfo {
  /** Speaker label (e.g. "Speaker A", "Sarah") */
  label: string;
  /** Display color for subtitle highlighting */
  color: string;
}

// ─── Transcript ────────────────────────────────────────────────────────────────

export interface TranscriptSegment {
  /** Segment index (0-based) */
  index: number;
  /** Speaker label matching SpeakerInfo.label */
  speaker: string;
  /** Start time in seconds */
  startTime: number;
  /** End time in seconds */
  endTime: number;
  /** English text */
  textEn: string;
  /** Vietnamese translation */
  textVi: string;
  /** Individual words with timestamps for click-to-define */
  words?: TranscriptWord[];
}

export interface TranscriptWord {
  word: string;
  startTime: number;
  endTime: number;
}

// ─── Lesson Content ────────────────────────────────────────────────────────────

export interface RealTalkLesson {
  /** References the parent video */
  videoId: string;
  /** Lesson title */
  title: string;
  /** Vietnamese lesson title */
  titleVi: string;
  /** CEFR level */
  level: "A0" | "A1" | "A2" | "B1" | "B2";
  /** Estimated lesson duration in minutes */
  estimatedMinutes: number;
  /** Can-Do statement */
  canDoStatement: string;
  /** Can-Do statement in Vietnamese */
  canDoStatementVi: string;

  /** Full transcript */
  transcript: TranscriptSegment[];

  /** Pre-Watch phase content */
  preWatch: PreWatchContent;
  /** While-Watch phase content */
  whileWatch: WhileWatchContent;
  /** Post-Watch phase content */
  postWatch: PostWatchContent;
}

// ─── Pre-Watch ─────────────────────────────────────────────────────────────────

export interface PreWatchContent {
  /** Context setup text in Vietnamese */
  contextVi: string;
  /** Key vocabulary to front-load */
  vocabulary: VocabItem[];
  /** Prediction question */
  prediction: {
    questionVi: string;
    options: string[];
    /** Index of correct option (0-based) */
    correctIndex: number;
  };
  /** Sound alert — difficult sounds for Vietnamese learners */
  soundAlerts: SoundAlert[];
}

export interface VocabItem {
  /** English word or phrase */
  word: string;
  /** Phonetic transcription */
  phonetic: string;
  /** Simple English definition */
  definition: string;
  /** Vietnamese translation */
  meaningVi: string;
  /** Context sentence from the video */
  contextSentence: string;
  /** Timestamp in video where this word appears */
  timestamp: number;
  /** Pronunciation note for Vietnamese learners */
  pronunciationNote?: string;
  /** Common L1 interference error for Vietnamese speakers */
  l1InterferenceVn?: string;
}

export interface SoundAlert {
  /** The sound/phoneme */
  sound: string;
  /** Vietnamese explanation */
  explanationVi: string;
  /** Example words from the video */
  exampleWords: string[];
  /** Common Vietnamese mistake */
  commonMistakeVi: string;
}

// ─── While-Watch ───────────────────────────────────────────────────────────────

export interface WhileWatchContent {
  /** Gist question (watch without subtitles) */
  gistQuestion: {
    questionVi: string;
    options: string[];
    correctIndex: number;
  };
  /** Focus points — grammar/discourse markers to highlight */
  focusPoints: FocusPoint[];
  /** Timestamps of key moments to replay */
  keyMoments: KeyMoment[];
}

export interface FocusPoint {
  /** Type: grammar pattern or discourse marker */
  type: "grammar" | "discourse_marker" | "collocation" | "idiom";
  /** The pattern/marker */
  pattern: string;
  /** Vietnamese explanation */
  explanationVi: string;
  /** Transcript segment indices where this appears */
  segmentIndices: number[];
}

export interface KeyMoment {
  /** Timestamp in seconds */
  timestamp: number;
  /** Description in Vietnamese */
  descriptionVi: string;
  /** What to listen for */
  listenForVi: string;
}

// ─── Post-Watch ────────────────────────────────────────────────────────────────

export interface PostWatchContent {
  /** Comprehension quiz questions */
  comprehensionQuiz: QuizQuestion[];
  /** Fill-in-the-blank exercises */
  fillInTheBlank: FillInBlankExercise[];
  /** Key phrases for listen & repeat */
  speakingDrills: SpeakingDrill[];
  /** Cultural/usage notes */
  culturalNotes: CulturalNote[];
}

export interface QuizQuestion {
  id: string;
  /** Question in Vietnamese */
  questionVi: string;
  /** Answer options */
  options: string[];
  /** Index of correct answer */
  correctIndex: number;
  /** Explanation in Vietnamese */
  explanationVi: string;
}

export interface FillInBlankExercise {
  id: string;
  /** Sentence with ___ for blank */
  sentence: string;
  /** Vietnamese hint */
  hintVi: string;
  /** Correct answer */
  answer: string;
  /** Accept alternative answers */
  alternatives?: string[];
}

export interface SpeakingDrill {
  id: string;
  /** The phrase to repeat */
  phrase: string;
  /** Vietnamese translation */
  meaningVi: string;
  /** Timestamp in video */
  timestamp: number;
  /** Pronunciation tips for Vietnamese speakers */
  tipVi: string;
}

export interface CulturalNote {
  /** Note title */
  titleVi: string;
  /** Note content in Vietnamese */
  contentVi: string;
  /** Related transcript segment */
  segmentIndex?: number;
}

// ─── Learner Progress ──────────────────────────────────────────────────────────

export type LessonPhase =
  "pre_watch" | "while_watch" | "post_watch" | "completed";

export interface RealTalkProgress {
  lessonId: string;
  currentPhase: LessonPhase;
  preWatchCompleted: boolean;
  whileWatchCompleted: boolean;
  gistCorrect: boolean | null;
  comprehensionScore: number | null;
  fillInBlankScore: number | null;
  speakingCompleted: string[];
  vocabLearned: string[];
  completedAt: string | null;
}
