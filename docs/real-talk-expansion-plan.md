# 🚀 Real Talk — Comprehensive Development Plan & Architecture Spec

> **Mục tiêu:** Phát triển module Real Talk từ phiên bản MVP hiện tại thành một giải pháp học tiếng Anh giao tiếp thực tế toàn diện, tích hợp sâu vào hệ thống **FSRS Spaced Repetition**, **AI Pronunciation Coaching**, và **Supabase Database Persistence** của AtoEnglish.

---

## 1. Định Hướng Sản Phẩm & Sự Tương Thích Với AtoEnglish

### 1.1 Khung Lý Thuyết (SLA Research & Product Truth)

Theo `docs/product/PRODUCT_TRUTH.md`, người học mục tiêu của AtoEnglish là người Việt trưởng thành mất gốc hoặc ngại nói. Module Real Talk bổ sung mảnh ghép còn thiếu: **Exposure vào hội thoại thực tế (Authentic Comprehensible Input)**.

```text
[YouTube Real Video]
        │
        ▼ (AI Scaffolding)
┌─────────────────────────────────────────────────────────────┐
│  Phase 1: Pre-Watch (Giảm anxiety, nạp từ vựng & âm khó)    │
│  Phase 2: While-Watch (Nghe hiểu đa cấp độ, focus patterns) │
│  Phase 3: Post-Watch (Quiz, Điền từ, Luyện nói & Shadowing)  │
└─────────────────────────────────────────────────────────────┘
        │
        ▼ (Spaced Retrieval)
[FSRS Flashcards Queue] ──► [Long-term Memory]
```

---

## 2. Các Trụ Cột Phát Triển Chi Tiết

### Trụ Cột 1: Tích Hợp Hệ Thống Ôn Tập FSRS (Spaced Repetition)

Từ vựng & cụm từ gặp trong video không thể dừng lại ở bài học mà phải đi vào hệ thống FSRS SRS của ứng dụng.

#### Flow tích hợp:

1. **Save Word Button**: Trong quá trình xem video hoặc làm phần Pre-Watch, người học có thể tap vào bất kỳ từ/cụm từ nào để bấm **"Thêm vào kho ôn tập"**.
2. **Auto Card Generation**: Hệ thống tự động tạo Flashcard bao gồm:
   - Front: Từ tiếng Anh + Audio phát âm (TTS)
   - Back: Nghĩa tiếng Việt + Dịch câu ngữ cảnh trong video + Link nhảy thẳng tới mốc thời gian (timestamp) của video.
3. **FSRS Scheduling**: Thẻ được đưa vào bảng `flashcards` hiện tại của Supabase với thuật toán FSRS-4.5.

```sql
-- Schema mở rộng cho flashcards từ Real Talk
ALTER TABLE flashcards
ADD COLUMN IF NOT EXISTS source_type VARCHAR(20) DEFAULT 'unit', -- 'unit' | 'real_talk'
ADD COLUMN IF NOT EXISTS real_talk_video_id TEXT,
ADD COLUMN IF NOT EXISTS real_talk_timestamp DECIMAL;
```

---

### Trụ Cột 2: AI Pronunciation Coaching & Shadowing Mode

Bổ sung tính năng Luyện nói & Shadowing có chấm điểm phát âm cho các câu thoại quan trọng trong video.

#### Flow Luyện Nói & Feedback:

1. **Model Audio**: Lấy audio gốc từ clip YouTube (thông qua timestamp start/end) hoặc Google TTS cho câu mẫu.
2. **User Recording**: Người học ghi âm câu nói qua HTML5 MediaRecorder (WAV 16kHz).
3. **Azure Speech Pronunciation Assessment**: Chấm điểm theo 4 tiêu chí:
   - **Accuracy** (Độ chính xác từng âm)
   - **Fluency** (Độ trôi chảy, không ngập ngừng)
   - **Completeness** (Đủ từ trong câu)
   - **Prosody/Intonation** (Ngữ điệu, đường đi tiếng nói)
4. **L1 Vietnamese Feedback (Tiếng Việt)**:
   - Nhận diện lỗi phổ biến của người Việt: Nuốt âm cuối (`/s/`, `/t/`, `/d/`), phát âm sai âm khó (`/θ/`, `/ð/`, `/r/`).
   - Phản hồi bằng tiếng Việt thân thiện, đưa ra hướng dẫn điều chỉnh khẩu hình cụ thể.

---

### Trụ Cột 3: Supabase Database Persistence & Library

Chuyển đổi từ dữ liệu static sang cơ sở dữ liệu Supabase hoàn chỉnh để lưu trữ bài học do người dùng/hệ thống tạo ra.

#### Database Schema:

```sql
-- 1. Bảng lưu trữ Video Nguồn
CREATE TABLE IF NOT EXISTS real_talk_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  youtube_id VARCHAR(20) NOT NULL,
  title TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  channel_name TEXT,
  channel_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INT NOT NULL,
  segment_start DECIMAL DEFAULT 0,
  segment_end DECIMAL NOT NULL,
  level VARCHAR(5) NOT NULL, -- 'A0', 'A1', 'A2', 'B1', 'B2'
  topics TEXT[],
  speaker_count INT DEFAULT 2,
  speakers JSONB NOT NULL, -- [{label: string, color: string}]
  created_by UUID REFERENCES auth.users(id),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Bảng lưu trữ Bài Học Chi Tiết
CREATE TABLE IF NOT EXISTS real_talk_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES real_talk_videos(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  level VARCHAR(5) NOT NULL,
  estimated_minutes INT DEFAULT 15,
  can_do_statement TEXT,
  can_do_statement_vi TEXT,
  transcript JSONB NOT NULL,   -- Array of transcript segments
  pre_watch JSONB NOT NULL,    -- Vocab, prediction, sound alerts
  while_watch JSONB NOT NULL,  -- Gist question, focus points, key moments
  post_watch JSONB NOT NULL,   -- Comprehension quiz, fill in blank, speaking drills, cultural notes
  generation_model TEXT,       -- 'gemini-2.0-flash'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Bảng lưu trữ Tiến Độ Học
CREATE TABLE IF NOT EXISTS real_talk_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES real_talk_videos(id) ON DELETE CASCADE,
  phase VARCHAR(20) NOT NULL, -- 'pre_watch', 'while_watch', 'post_watch', 'completed'
  quiz_score INT DEFAULT 0,
  speaking_scores JSONB DEFAULT '[]'::jsonb,
  saved_vocab TEXT[] DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, video_id)
);
```

---

### Trụ Cột 4: Pipeline Xử Lý Phụ Đề & AI Quality Control

Giải quyết bài toán video không có phụ đề chuẩn hoặc phụ đề tự động (auto-generated) bị sai lỗi chính tả.

#### Flow Xử Lý Phụ Đề Nâng Cao:

```text
YouTube URL
    │
    ├─► [1. Fetch Subtitles via youtube-transcript]
    │       │
    │       ├── Has Manual Captions? ──► [Pass directly to AI]
    │       └── Auto Captions / Low quality? ──► [Whisper/AssemblyAI Fallback API]
    │
    └─► [2. AI Post-Processing & Normalization (Gemini)]
            - Sửa lỗi chính tả & viết hoa
            - Thêm dấu câu (punctuation restoration)
            - Phân đoạn hội thoại theo speaker (Diarization)
            - Dịch chuẩn nghĩa tiếng Việt theo ngữ cảnh
```

---

## 3. Lộ Trình Triển Khai (Execution Roadmap)

### Phase 1: Storage & Public Library (đã có nền tảng)

- [x] Data Model & Types (`src/types/real-talk.ts`)
- [x] Complete UI Component Suite (Pre/While/Post phases, YouTube player, Transcript)
- [x] AI Generator Server Action via Gemini 2.0 Flash (`src/app/actions/real-talk.ts`)
- [x] Creator UI (`/real-talk/create`)
- [x] Migration SQL & RLS baseline cho Real Talk tables

### Phase 2: Speaking evidence and learner retention (current)

- [x] Thêm nút lưu từ vựng vào Flashcard queue
- [ ] Ghi transcript-match hoặc assessment result trung thực cho speaking drill
- [ ] Đẩy tiến độ hoàn thành bài học Real Talk vào Streak & XP System bằng transaction idempotent

### Phase 3: Provider-backed pronunciation assessment

- [ ] Tích hợp Azure Pronunciation Assessment khi có credential, calibration và provider tests
- [ ] Shadowing mode: local recording/replay. Không tự suy ra ngữ điệu từ transcript.

---

## 4. Tóm Tắt Đóng Góp Sản Phẩm

Real Talk giúp AtoEnglish vượt xa các ứng dụng học tiếng Anh truyền thống bằng cách:

1. Chi phí vận hành thấp (~$0.01/bài học được tạo qua Gemini Flash).
2. Tạo ra bài học từ bất kỳ nội dung nào người học yêu thích trên YouTube.
3. Giữ chân người học thông qua ngữ cảnh giao tiếp thực tế sinh động kết hợp giải thích tiếng Việt tận tình.
