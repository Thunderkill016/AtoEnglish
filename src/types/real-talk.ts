/**
 * Real Talk — Types for conversation-based English lessons.
 *
 * Source media stays separate from AI-generated lesson treatment. Generated
 * content is a private draft until source evidence and human review are complete.
 */

export type RealTalkLevel = "A0" | "A1" | "A2" | "B1" | "B2";

export interface RealTalkVideo {
  id: string;
  youtubeId: string;
  title: string;
  titleVi: string;
  channelName: string;
  channelUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  segment: { startSeconds: number; endSeconds: number };
  level: RealTalkLevel;
  topics: string[];
  speakerCount: number;
  speakers: SpeakerInfo[];
  source?: {
    watchUrl: string;
    metadataSource: "youtube_oembed" | "curated";
    transcriptSource: "youtube_caption" | "authorized_caption" | "manual";
  };
}

export interface SpeakerInfo {
  label: string;
  color: string;
}

export interface TranscriptSegment {
  index: number;
  speaker: string;
  startTime: number;
  endTime: number;
  textEn: string;
  textVi: string;
  words?: TranscriptWord[];
}

export interface TranscriptWord {
  word: string;
  startTime: number;
  endTime: number;
}

export interface RealTalkEnvironment {
  titleVi: string;
  situationVi: string;
  learnerRoleVi: string;
  partnerRoleVi: string;
  realWorldGoalVi: string;
}

export type CommunicationEventType =
  | "open_interaction"
  | "exchange_information"
  | "ask_follow_up"
  | "confirm_information"
  | "request_clarification"
  | "repair_misunderstanding"
  | "respond_and_continue"
  | "close_interaction"
  | "other";

export interface CommunicationEvent {
  id: string;
  type: CommunicationEventType;
  descriptionVi: string;
  segmentIndices: number[];
}

export interface TransferTask {
  situationVi: string;
  learnerGoalVi: string;
  promptVi: string;
  successCriteriaVi: string[];
  suggestedLanguage: string[];
}

export interface RealTalkGenerationMetadata {
  status: "ai_draft" | "human_reviewed" | "approved";
  model: string;
  generatedAt: string;
  persistence: "preview_only" | "saved_private_draft";
  warnings: string[];
}

export interface RealTalkLesson {
  videoId: string;
  title: string;
  titleVi: string;
  level: RealTalkLevel;
  estimatedMinutes: number;
  canDoStatement: string;
  canDoStatementVi: string;
  transcript: TranscriptSegment[];
  preWatch: PreWatchContent;
  whileWatch: WhileWatchContent;
  postWatch: PostWatchContent;
  environment?: RealTalkEnvironment;
  communicationEvents?: CommunicationEvent[];
  transferTask?: TransferTask;
  generation?: RealTalkGenerationMetadata;
}

export interface PreWatchContent {
  contextVi: string;
  vocabulary: VocabItem[];
  prediction: {
    questionVi: string;
    options: string[];
    correctIndex: number;
  };
  soundAlerts: SoundAlert[];
}

export interface VocabItem {
  word: string;
  phonetic: string;
  definition: string;
  meaningVi: string;
  contextSentence: string;
  timestamp: number;
  pronunciationNote?: string;
  l1InterferenceVn?: string;
}

export type PreWatchVocab = VocabItem;

export interface SoundAlert {
  sound: string;
  explanationVi: string;
  exampleWords: string[];
  commonMistakeVi: string;
}

export interface WhileWatchContent {
  gistQuestion: {
    questionVi: string;
    options: string[];
    correctIndex: number;
  };
  focusPoints: FocusPoint[];
  keyMoments: KeyMoment[];
}

export interface FocusPoint {
  type: "grammar" | "discourse_marker" | "collocation" | "idiom";
  pattern: string;
  explanationVi: string;
  segmentIndices: number[];
}

export interface KeyMoment {
  timestamp: number;
  descriptionVi: string;
  listenForVi: string;
}

export interface PostWatchContent {
  comprehensionQuiz: QuizQuestion[];
  fillInTheBlank: FillInBlankExercise[];
  speakingDrills: SpeakingDrill[];
  culturalNotes: CulturalNote[];
}

export interface QuizQuestion {
  id: string;
  questionVi: string;
  options: string[];
  correctIndex: number;
  explanationVi: string;
  evidenceSegmentIndices?: number[];
}

export interface FillInBlankExercise {
  id: string;
  sentence: string;
  hintVi: string;
  answer: string;
  alternatives?: string[];
  evidenceSegmentIndex?: number;
}

export interface SpeakingDrill {
  id: string;
  phrase: string;
  meaningVi: string;
  timestamp: number;
  tipVi: string;
  evidenceSegmentIndex?: number;
}

export interface CulturalNote {
  titleVi: string;
  contentVi: string;
  segmentIndex?: number;
}

export type LessonPhase =
  | "pre_watch"
  | "while_watch"
  | "post_watch"
  | "completed";

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
