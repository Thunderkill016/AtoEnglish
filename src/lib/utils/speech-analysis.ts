/**
 * Free, local, high-quality speech analysis for Vietnamese English learners.
 * No paid AI required. Combines:
 * - Normalized Levenshtein similarity
 * - Simple phonetic / L1 interference rules common for VN speakers
 * - Actionable feedback templates
 *
 * TASK-152: expanded L1 patterns (final cons, vowels, clusters, articles, 3sg, v/w, intonation).
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
 * VN L1 phonetic-friendly normalize for better transcript matching.
 * Applies common substitutions Vietnamese speakers make (and ASR often hears).
 * Pure local, no external deps. Improves free coach quality.
 */
function applyVnL1Normalize(text: string): string {
  return text
    .replace(/\bth(ink|ought|ank|is|at|ese|ose|ing|ree|ank|em|ose)\b/g, "t$1")
    .replace(/\bthis\b/g, "dis")
    .replace(/\bthat\b/g, "dat")
    .replace(/\bwith\b/g, "wit")
    .replace(/\b(s|t|k|d|p|b|g|z|sh|ch)\b(?=\s|$)/g, "") // drop final stops/fric often missed
    .replace(/\bed\b/g, "") // past -ed often weak
    .replace(/\bs\b/g, "") // plural s
    .replace(/\bve\b/g, "have")
    .replace(/\breally\b/g, "very") // allow swaps in score
    // More VN L1: final consonants full, linking tolerance, vowel rough for scoring
    .replace(/\b(\w+)[ptkbdg]\b/g, "$1") // tolerate omitted final stops
    .replace(/\b(get|put|pick|come|go|look|back)\s+(up|out|in|it|on|a)\b/g, "$1$2") // link C+V for match
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
  { pattern: /\bth(ink|ought|ank|is|at|ese|ose|ing|ree)\b/gi, tip: "Âm 'th' thường bị thay bằng 't' hoặc 'd'. Tập thổi nhẹ không rung dây thanh (unvoiced th)." },
  { pattern: /\b(s|t|k|d|p|b|g|z|sh)\s*$/gi, tip: "Người Việt hay nuốt âm cuối. Nói rõ âm cuối (cats, stopped, liked, has)." },
  { pattern: /\ba\s+(hour|apple|egg|umbrella|honest)\b/gi, tip: "Dùng 'an' trước nguyên âm. 'a hour' → 'an hour'." },
  { pattern: /\b(he|she|it)\s+(have|do|are|go|want|need)\b/gi, tip: "Chủ ngữ số ít thứ 3 cần -s: he has, she does, it is." },
  { pattern: /\bvery\s+(much|good|well|important)\b/gi, tip: "Thử 'really' hoặc 'quite' thay very cho tự nhiên hơn trong giao tiếp." },
  { pattern: /\bI\s+(am|was)\s+(from|in)\s+Vietnam\b/gi, tip: "Tốt, nhưng thử 'I'm Vietnamese' hoặc 'I come from Vietnam' nghe tự nhiên." },
  { pattern: /\b(ed|d)\s+(the|a|to|in)\b/gi, tip: "Past -ed: tập phát âm rõ /t/ /d/ /ɪd/ (stopped, needed). Hay bị bỏ." },
  { pattern: /\b(s|es)\s+(the|a|to)\b/gi, tip: "Plural/3rd -s: cats, goes — nói rõ âm cuối /s/ /z/." },
  { pattern: /\bget\s+(up|it|out)\b/gi, tip: "Nối âm (linking): 'get up' nghe như 'ge-dup'. Tập C+V linking cho flow." },
  { pattern: /\bship|sheep|bit|beat|live|leave\b/gi, tip: "Nguyên âm ngắn/dài (ship vs sheep, bit vs beat). Mở miệng rõ hơn cho /i:/." },
  { pattern: /\b(r|l)\b/gi, tip: "Âm /r/ và /l/ đôi khi lẫn. Tập lưỡi cuộn nhẹ cho r, chạm răng cho l." },
  // Enhanced for TASK-152: more final cons, tones/intonation influence, clusters
  { pattern: /\b\w+[ptkbdgzs]\b/gi, tip: "Âm cuối (final consonants) hay bị nuốt ở người Việt. Nói rõ /p t k d g s z/ cuối (stop, liked, dogs, has, cats) — mang ngữ pháp quan trọng." },
  { pattern: /\b(get|pick|put|come|go|back)\s+(up|out|in|it|a|the)\b/gi, tip: "Linking quan trọng: tập nối consonant cuối sang vowel sau cho tự nhiên (get_up → ge-dup)." },
  { pattern: /\?$/gi, tip: "Intonation: câu hỏi Anh lên giọng cuối (rise). Giọng Việt tonal hay giữ phẳng — nâng cao pitch cuối câu hỏi để rõ nghĩa." },
  { pattern: /(?<!\?)\.$/gi, tip: "Câu kể: xuống giọng cuối + nhấn stress từ quan trọng (cao hơn, dài hơn). Tránh flat intonation từ L1 tone." },
  { pattern: /\b\w{2,}[sz]\b/gi, tip: "Plural/3rd -s /z/: nói rõ rung nhẹ, không bỏ. 'has', 'goes', 'dogs'." },
  // TASK-152 more high-impact VN L1
  { pattern: /\b(v|w)ery|view|work|value|very\b/gi, tip: "/v/ rung môi dưới chạm răng trên; /w/ tròn môi không rung (very vs wary). Hay lẫn ở người Việt." },
  { pattern: /\b(a|the)\s+(important|apple|hour|honest|university)\b/gi, tip: "Article a/an/the: an + nguyên âm (an hour), the nhấn /ðə/ trước phụ âm. Hay bỏ article." },
  { pattern: /\bship|sheep|bit|beat|sit|seat|live|leave|fill|feel\b/gi, tip: "Nguyên âm ngắn/dài /ɪ/ vs /i:/ — ship vs sheep. Mở miệng rộng + giữ lâu hơn cho /i:/." },
  { pattern: /\b(he|she|it|this)\s+(go|do|have|want|need|work)\b/gi, tip: "3sg -s: he works, she has. Hay quên -s do L1 không chia." },
  { pattern: /\bstr|spl|scr|spr\b/gi, tip: "Cụm phụ âm đầu (str, spl): 'street' /str/ không bỏ r; tập chậm tách /s/ + /tr/." },
  { pattern: /\bæ|bad|man|cat|hat|map\b/gi, tip: "Nguyên âm /æ/ (bad, man) — mở miệng rộng ngang, không thành /e/ (bed)." },
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

  // Use VN L1 friendly norm for matching to tolerate common pronunciation + ASR artifacts
  const vnTarget = applyVnL1Normalize(cleanTarget);
  const vnTranscript = applyVnL1Normalize(cleanTranscript);

  const targetWords = vnTarget.split(/\s+/).filter(Boolean);
  const transcriptWords = vnTranscript.split(/\s+/).filter(Boolean);

  // Word-level best match similarity (more forgiving than full sentence)
  // + phonetic tolerance for VN learners
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

    // Tighter + allow phonetic leniency (0.5x len for tolerance)
    const tolerance = Math.max(2, Math.floor(tw.length * 0.5));
    if (bestIdx >= 0 && bestDist <= tolerance) {
      matched++;
      used.add(bestIdx);
    }
  }

  const similarity = Math.round((matched / Math.max(targetWords.length, 1)) * 100);

  // Collect specific L1 tips (test against original for accuracy)
  const tips: string[] = [];
  L1_PATTERNS.forEach(({ pattern, tip }) => {
    if (pattern.test(cleanTranscript) || pattern.test(cleanTarget) || pattern.test(vnTranscript)) {
      if (!tips.includes(tip)) tips.push(tip);
    }
  });

  // General feedback based on score — realistic + encouraging for adults
  let feedback = "";
  if (similarity >= 85) {
    feedback = "Xuất sắc! Phát âm và ý chính rất gần native. Tiếp tục giữ nhịp tự nhiên.";
  } else if (similarity >= 65) {
    feedback = "Khá tốt. Bạn truyền đạt được ý. Tập trung nối âm và âm cuối để tự tin hơn.";
  } else if (similarity >= 40) {
    feedback = "Tiến bộ rõ. Nghe mẫu 2-3 lần, shadowing chậm từng cụm rồi tăng tốc.";
  } else {
    feedback = "Bắt đầu bằng shadowing chậm: nghe → lặp theo → ghi âm so sánh. Tập trung 1-2 âm khó mỗi lần.";
  }

  // Add practice-type specific + research-backed advice
  if (practiceType === "shadowing") {
    tips.unshift("Shadowing đỉnh cao: bắt chước đúng nhịp, ngữ điệu lên-xuống và nối âm (C+V linking), không chỉ từ. Nghe không chữ trước.");
    tips.push("Hiệu quả cao nhất: 5-10 phút/ngày, từ chậm → tốc độ thật. Ghi âm bản thân so mẫu.");
  } else if (practiceType === "roleplay") {
    tips.push("Giao tiếp thật: dùng cụm từ + tự nhiên hóa. Tập trung nghe và đáp nhanh thay vì câu hoàn hảo.");
  } else if (practiceType === "journal") {
    tips.push("Nhật ký nói: nói tự do 30-60s về ngày của bạn. Dùng cấu trúc đã học trong unit.");
  }

  return {
    similarity: Math.max(0, Math.min(100, similarity)),
    wordsCorrect: matched,
    totalWords: targetWords.length,
    feedback,
    specificTips: tips.slice(0, 5), // up to 5 actionable
    correctedTranscript: transcript,
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
