# Content Style Guide — AtoEnglish

> Hướng dẫn viết nội dung cho toàn bộ app: UI text, bài học, thông báo, và marketing copy.

---

## 1. Brand Voice

| Thuộc tính | Mô tả |
|-----------|-------|
| **Ngôn ngữ giao diện** | Tiếng Việt (app được design cho người Việt) |
| **Ngôn ngữ học** | Tiếng Anh (nội dung học, ví dụ, hội thoại) |
| **Tone** | Thân thiện · Khuyến khích · Không phán xét |
| **Persona** | Như người thầy giỏi: kiên nhẫn, rõ ràng, vui vẻ |
| **Tránh** | Học thuật quá, khô khan, máy móc, phức tạp |

---

## 2. UI Text (Vietnamese)

### Buttons & CTA

| Context | Text |
|---------|------|
| Primary CTA | "Bắt đầu học", "Tiếp tục", "Hoàn thành" |
| Skip | "Bỏ qua", "Để sau" |
| Try again | "Thử lại", "Ôn lại" |
| Submit | "Kiểm tra", "Nộp bài" |
| Continue lesson | "Tiếp theo →" |
| Complete unit | "Hoàn thành bài học 🎉" |

### Feedback Messages

```
✅ Chính xác! / Xuất sắc! / Tuyệt vời!
❌ Chưa đúng. Đáp án đúng là: [answer]
💡 Gợi ý: [hint text]
🔥 Streak [n] ngày! Cố lên!
🎉 Chúc mừng! Bạn nhận được [X] XP!
```

### Error Messages

```
"Bạn cần đăng nhập để tiếp tục."
"Có lỗi xảy ra. Vui lòng thử lại."
"Kết nối mạng không ổn định."
"Yêu cầu quá thường xuyên. Thử lại sau [X] giây."
```

### Empty States

```
"Chưa có thẻ nào để ôn tập hôm nay. 🎉"
"Hãy hoàn thành bài học để mở khóa flashcard."
"Chưa có buổi luyện nói nào. Bắt đầu ngay!"
```

---

## 3. Lesson Content (English learning material)

### Dialogue Style

- **Realistic**: Phản ánh tình huống thực tế người Việt hay gặp
- **Natural**: Dùng ngôn ngữ tự nhiên, không cứng nhắc
- **Progressive**: Unit đầu → ngắn gọn, unit sau → phức tạp hơn
- **Speaker labels**: "A:", "B:", hoặc tên nhân vật (Mai, Linh, David...)

```
✅ "Hi! I'm Mai. Nice to meet you!"
✅ "Excuse me, where is the nearest ATM?"
❌ "Greetings. I am a student at the university."
```

### Vocabulary Entries

```typescript
{
  word: "hello",              // Lowercase
  phonetic: "/həˈloʊ/",      // IPA notation
  meaning: "xin chào",       // Vietnamese, lowercase
  example: "Hello, how are you?",  // Full sentence
  example2: "Hello everyone!", // Optional second context
  collocation: "hello + [name]",   // Common pattern
}
```

### Grammar Explanations

- **Rule**: Công thức ngắn gọn (< 30 từ), dùng ký hiệu toán học
- **Explanation**: 1-2 câu tiếng Việt, dễ hiểu
- **Examples**: Tối thiểu 3 ví dụ, từ đơn giản → phức tạp
- **Tip**: Mẹo ghi nhớ thực tế (1 câu)
- **CCQ**: 1 câu hỏi kiểm tra hiểu bài (multiple choice)

```
Rule: "S + am/is/are + [noun/adj]"
Tip: "I = am | You/We/They = are | He/She/It = is. Nhớ bằng 'IAY'"
```

### Quiz Questions

- Câu hỏi rõ ràng, không mơ hồ
- Đáp án sai phải hợp lý (plausible distractors)
- Tối đa 4 lựa chọn cho multiple-choice
- Cloze: Để trống 1 từ quan trọng, không quá 2 blank per sentence

```
✅ "_____ your name? → What is"
✅ "She _____ a teacher. → is"
❌ "What is the correct form of to be in this sentence that has a third person singular subject?"
```

### VN→EN Translation Exercises

- Câu ngắn (< 12 từ tiếng Anh)
- Sát với từ vựng và ngữ pháp đã học trong unit đó
- Đáp án phải chính xác và tự nhiên

```
"Bạn tên là gì?" → "What is your name?" ✅
"Tôi đến từ Việt Nam." → "I am from Vietnam." ✅
```

### Sentence Scramble

- 4-8 từ mỗi câu
- Câu phải là câu hoàn chỉnh, có nghĩa
- Sắp xếp ngẫu nhiên nhưng không giống thứ tự gốc

---

## 4. Gamification Copy

### XP & Levels

| Hành động | XP |
|-----------|-----|
| Hoàn thành Unit (3 sao) | 50 XP |
| Hoàn thành Unit (2 sao) | ~42 XP |
| Hoàn thành Unit (1 sao) | ~35 XP |
| Buổi Speaking | +5/8 XP |
| Quiz bonus | +5-10 XP |

### Level Display Names

```
A1 → "A1 Beginner"
A2 → "A2 Elementary"
B1 → "B1 Intermediate"
B2 → "B2 Upper-Intermediate"
C1 → "C1 Advanced"
```

### Streak Messages

```
1-6 ngày:  "🔥 Streak [n] ngày! Cố lên!"
7-29 ngày: "🔥 [n] ngày liên tiếp! Ấn tượng!"
30+ ngày:  "🔥 [n] ngày! Bạn thật sự nghiêm túc!"
```

---

## 5. Notification & Push Messages

```
"⏰ Đến giờ ôn tập rồi! [n] thẻ đang chờ bạn."
"🔥 Đừng để mất streak [n] ngày của bạn!"
"🎯 Mục tiêu hôm nay: [X] XP. Bạn cần [Y] XP nữa!"
"🆕 Unit mới đã mở khóa: [Unit title]"
```

---

## 6. Blueprint — Cách xây nội dung = Cách học (1 khung)

> **File tham chiếu:** `src/lib/lessons/lesson-blueprint.ts` · **Mẫu vàng:** `unit1.ts` · **Luồng app:** `learning-flow.ts`

Mọi unit phải map **cùng thứ tự block** và **cùng IPOR**:

| Block | Nội dung (fields) | Cách học (app section) |
|-------|-------------------|------------------------|
| hook | situation, learningOutcomes, culturalNote | Khởi động §1 |
| warmup | warmupGreetings | Khởi động §1 + SRS |
| vocab | vocab (+ l1_interference) | Từ vựng §2 — **trước** dialogue |
| grammar | grammar + ccq | Ngữ pháp §3 |
| exercises | practice, listenAndChoose… | Luyện tập §4 |
| dialogues | dialogues | Hội thoại §5 — sau vocab |
| fluency | fluencyDrill | Phản xạ §10 |
| output | practiceTranslate, speaking | Dịch §9 → Shadow §6 → Nói §7 |
| review | quiz, cumulativeReview | Hoàn thành §8 + FSRS |

Autopilot/agent: đọc `formatBlueprintChecklistForAgent()` trước khi sửa `unit*.ts`.

## 7. Chuẩn SDL — Mọi bài học phải đạt

> Kiểm tra: `npm run test:content-standard` + `bash scripts/audit-lesson-content.sh`  
> Code: `src/lib/lessons/content-standard.ts`

| Hạng mục | Chuẩn |
|----------|--------|
| **situation** | ≥30 ký tự — tình huống thực tế người Việt hay gặp |
| **learningOutcomes** | 2–5 mục — đo được sau bài |
| **culturalNote** | ≥40 ký tự — ghi chú văn hóa / pragmatic |
| **warmupGreetings** | ≥3 câu — kích hoạt prior knowledge |
| **vocab** | 8–20 từ, audio path, example + collocation (A2+) |
| **l1_interference_vn** | A1/A2: 100% từ · B1/B2: ≥50% từ (lỗi người Việt hay mắc) |
| **fluencyDrill** | ≥5 câu — automaticity (Nation strand 4) |
| **practiceTranslate** | ≥3 câu VN→EN trong phạm vi unit |
| **listenAndChoose** | ≥5 câu |
| **quiz** | ≥5 câu, distractor hợp lý |
| **cumulativeReviewQuestions** | ≥3 câu ôn tích lũy |

**Không đạt chuẩn → không merge.** Autopilot TASK-057+ sửa content theo band level.

---

## 8. SEO & Meta Content

### Title Pattern

```
[Page name] — AtoEnglish
Dashboard — AtoEnglish
Học tiếng Anh miễn phí — AtoEnglish
```

### Meta Description Pattern

```
[Mô tả trang trong 150-160 ký tự, có từ khóa tiếng Anh + tiếng Việt]
"Luyện tiếng Anh giao tiếp với bài học A1-B1, flashcard FSRS, và AI speaking coach. Miễn phí hoàn toàn."
```

---

## 9. Terminology Glossary

| Thuật ngữ EN | Thuật ngữ VN (dùng trong app) |
|-------------|------------------------------|
| Unit | Bài học (Unit 1, Unit 2...) |
| Section | Phần (Phần 1, Phần 2...) |
| Flashcard | Thẻ ôn tập |
| SRS / FSRS | Hệ thống ôn tập thông minh |
| Streak | Chuỗi ngày học liên tiếp |
| XP | Điểm kinh nghiệm |
| Level | Trình độ (A1, A2...) |
| Quiz | Bài kiểm tra / Câu hỏi |
| Cloze | Điền vào chỗ trống |
| Shadowing | Luyện theo giọng |
| Grammar point | Điểm ngữ pháp |
| Collocation | Cụm từ thường đi cùng |
| CCQ | Câu hỏi kiểm tra hiểu bài |
| Warm-up | Khởi động |
| Cool-down | Tổng kết |
