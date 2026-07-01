/**
 * Free, local, high-quality speech analysis for Vietnamese English learners.
 * No paid AI required. Combines:
 * - Normalized Levenshtein similarity
 * - Simple phonetic / L1 interference rules common for VN speakers
 * - Actionable feedback templates
 *
 * Evidence: Shadowing + targeted feedback + output practice show strong gains
 * (studies on TBLT, AI low-stakes practice for Vietnamese EFL).
 */

export interface SpeechAnalysisResult {
  similarity: number; // 0-100
  wordsCorrect: number;
  totalWords: number;
  feedback: string;
  specificTips: string[];
  correctedTranscript?: string;
}

/**
 * Simple but effective Levenshtein distance.
 */
function levenshtein(a: string, b: string): number {
  const alen = a.length;
  const blen = b.length;
  if (alen === 0) return blen;
  if (blen === 0) return alen;

  const matrix = Array.from({ length: alen + 1 }, () => Array(blen + 1).fill(0));

  for (let i = 0; i <= alen; i++) matrix[i][0] = i;
  for (let j = 0; j <= blen; j++) matrix[0][j] = j;

  for (let i = 1; i <= alen; i++) {
    for (let j = 1; j <= blen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return matrix[alen][blen];
}

function normalizeForComparison(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"()\-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Common Vietnamese L1 interference patterns + tips.
 * These are high-frequency real problems.
 */
const L1_PATTERNS: Array<{
  pattern: RegExp;
  tip: string;
  example?: string;
}> = [
  { pattern: /\bth(ink|ank|ing|at|is|is|ese|ose)\b/gi, tip: "Âm 'th' thường bị thay bằng 't' hoặc 'd'. Tập thổi nhẹ không rung dây thanh." },
  { pattern: /\b(s|t|k|d|p)\s*$/gi, tip: "Người Việt hay nuốt âm cuối. Nói rõ âm cuối (cats, stopped, liked)." },
  { pattern: /\ba\s+(hour|apple|egg|umbrella)\b/gi, tip: "Dùng 'an' trước nguyên âm. 'a hour' sai → 'an hour'." },
  { pattern: /\b(he|she|it)\s+(have|do|are)\b/gi, tip: "Chủ ngữ số ít thứ 3 cần -s: he has, she does, it is." },
  { pattern: /\bvery\s+(much|good)\b/gi, tip: "Trong một số ngữ cảnh 'very' + adj, nhưng hãy thử 'really' hoặc cụm từ tự nhiên hơn." },
  { pattern: /\bI\s+(am|was)\s+(from|in)\s+Vietnam\b/gi, tip: "Tốt, nhưng thử 'I'm Vietnamese' hoặc 'I come from Vietnam' nghe tự nhiên hơn." },
];

/**
 * Analyze learner transcript against target/reference.
 * Returns similarity + VN-specific actionable feedback.
 */
export function analyzeSpeaking(
  target: string,
  transcript: string,
  practiceType: "shadowing" | "roleplay" | "journal" = "roleplay"
): SpeechAnalysisResult {
  const cleanTarget = normalizeForComparison(target);
  const cleanTranscript = normalizeForComparison(transcript);

  if (!cleanTranscript) {
    return {
      similarity: 0,
      wordsCorrect: 0,
      totalWords: cleanTarget.split(" ").length,
      feedback: "Chưa nghe được gì. Hãy thử nói to và rõ hơn.",
      specificTips: ["Nói chậm lại một chút.", "Giữ micro gần miệng hơn."],
    };
  }

  const targetWords = cleanTarget.split(/\s+/).filter(Boolean);
  const transcriptWords = cleanTranscript.split(/\s+/).filter(Boolean);

  // Word-level best match similarity (more forgiving than full sentence)
  let matched = 0;
  const used = new Set<number>();

  for (const tw of targetWords) {
    let bestDist = Infinity;
    let bestIdx = -1;

    transcriptWords.forEach((uw, idx) => {
      if (used.has(idx)) return;
      const d = levenshtein(tw, uw);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = idx;
      }
    });

    if (bestIdx >= 0 && bestDist <= Math.max(2, Math.floor(tw.length * 0.4))) {
      matched++;
      used.add(bestIdx);
    }
  }

  const similarity = Math.round((matched / Math.max(targetWords.length, 1)) * 100);

  // Collect specific L1 tips
  const tips: string[] = [];
  L1_PATTERNS.forEach(({ pattern, tip }) => {
    if (pattern.test(cleanTranscript) || pattern.test(cleanTarget)) {
      if (!tips.includes(tip)) tips.push(tip);
    }
  });

  // General feedback based on score
  let feedback = "";
  if (similarity >= 85) {
    feedback = "Rất tốt! Ngữ điệu và từ vựng khá tự nhiên.";
  } else if (similarity >= 65) {
    feedback = "Khá ổn. Bạn đã nói được ý chính. Cải thiện thêm độ chính xác và nối âm.";
  } else if (similarity >= 40) {
    feedback = "Tiếp tục cố gắng. Tập trung nghe lại mẫu và nói theo từng cụm ngắn.";
  } else {
    feedback = "Hãy nghe mẫu thật kỹ rồi shadowing chậm trước khi nói tự do.";
  }

  // Add practice-type specific advice
  if (practiceType === "shadowing") {
    tips.unshift("Shadowing hiệu quả nhất khi bắt chước đúng nhịp và ngữ điệu, không chỉ từ.");
  } else if (practiceType === "roleplay") {
    tips.push("Trong giao tiếp thật, hãy dùng cụm từ gợi ý và tự nhiên hóa chúng.");
  }

  return {
    similarity: Math.max(0, Math.min(100, similarity)),
    wordsCorrect: matched,
    totalWords: targetWords.length,
    feedback,
    specificTips: tips.slice(0, 4), // keep it actionable, not overwhelming
    correctedTranscript: transcript, // could enhance later
  };
}

/**
 * Quick word count + basic encouragement (used as ultimate free fallback).
 */
export function basicWordCountFeedback(transcript: string): string {
  const w = (transcript || "").trim().split(/\s+/).filter(Boolean).length;
  if (w < 5) return `Bạn nói được ${w} từ. Hãy thử dài hơn một chút ở lượt sau.`;
  return `Bạn nói được ${w} từ. Tốt! Tiếp tục luyện tập để tăng độ trôi chảy.`;
}
