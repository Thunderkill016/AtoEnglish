import type { TimedTextCue } from "@/features/media-ingestion/domain/timed-text";
import type { YouTubeCompanionMetadata } from "@/features/media-ingestion/domain/youtube-companion-demo";

export interface TranscriptUseGrant {
  canStoreTranscript: true;
  canCreateDerivedLesson: true;
  evidenceReference: string;
}

export interface ListeningLessonDraft {
  status: "editor_draft";
  source: YouTubeCompanionMetadata;
  rightsEvidence: string;
  titleVi: string;
  transcriptCues: TimedTextCue[];
  activities: Array<{
    id: string;
    layer: "comprehension" | "acquisition" | "transfer";
    promptVi: string;
    cueIds: string[];
    exposesFullAnswer: boolean;
  }>;
  publicationBlocks: string[];
}

export function buildAuthorizedListeningLessonDraft(
  source: YouTubeCompanionMetadata,
  cues: TimedTextCue[],
  grant: TranscriptUseGrant,
): ListeningLessonDraft {
  if (!source.embeddable) {
    throw new Error("Video không cho phép embed bằng player chính thức.");
  }

  if (!grant.evidenceReference.trim()) {
    throw new Error("Thiếu bằng chứng quyền lưu transcript và tạo bài học phái sinh.");
  }

  if (cues.length === 0) {
    throw new Error("Không thể tạo bài học khi chưa có caption cue.");
  }

  const cueIds = cues.map((cue) => cue.id);

  return {
    status: "editor_draft",
    source,
    rightsEvidence: grant.evidenceReference.trim(),
    titleVi: `Bài nghe nháp: ${source.title}`,
    transcriptCues: cues,
    activities: [
      {
        id: "cold-listen",
        layer: "comprehension",
        promptVi: "Nghe không nhìn phụ đề và xác định mục đích chính của cuộc trò chuyện.",
        cueIds: [],
        exposesFullAnswer: false,
      },
      {
        id: "timed-detail-check",
        layer: "comprehension",
        promptVi: "Nghe lại từng đoạn và đối chiếu chi tiết với caption đã được cấp quyền.",
        cueIds,
        exposesFullAnswer: true,
      },
      {
        id: "reconstruct",
        layer: "acquisition",
        promptVi: "Ẩn caption, nghe lại rồi tái tạo các cụm giao tiếp quan trọng.",
        cueIds,
        exposesFullAnswer: false,
      },
      {
        id: "changed-context-response",
        layer: "transfer",
        promptVi: "Phản hồi bằng lời của bạn trong một tình huống mới có cùng mục đích giao tiếp.",
        cueIds: [],
        exposesFullAnswer: false,
      },
    ],
    publicationBlocks: [
      "Chưa kiểm tra audio-caption alignment thủ công.",
      "Chưa xác nhận speaker labels.",
      "Chưa review tính tự nhiên và giá trị sư phạm.",
      "Chưa duyệt bản dịch và communication-event annotation.",
    ],
  };
}
