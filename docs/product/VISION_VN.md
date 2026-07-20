# AtoEnglish — Tầm nhìn sản phẩm Việt Nam

> **Status:** ACTIVE (owner 2026-07-20)  
> **Mục tiêu:** Trang web học tiếng Anh **tốt nhất dành cho người Việt tại Việt Nam** — không phải bản dịch app nước ngoài.

---

## 1. North Star

**Outcome:** Người Việt đạt **CEFR B1 (Independent User)** — đủ dùng tiếng Anh độc lập trong đời sống và công việc cơ bản.

**Promise (VI):** *“Đạt B1 — đủ để dùng tiếng Anh độc lập.”*

**Đo thành công bằng:**
- Can-do thật (làm được gì sau mỗi phase)
- Intelligibility khi nói (người lạ hiểu, không cần lặp quá nhiều)
- Thói quen học 10–20 phút/ngày + SRS + speak

Không đo bằng XP, streak, hoặc số badge.

---

## 2. Moat — vì sao AtoEnglish khác app quốc tế

| Yếu tố | Duolingo / Babbel | AtoEnglish |
|--------|-------------------|------------|
| Giải thích | Anh hoặc dịch máy | **Tiếng Việt rõ**, contrast L1↔L2 |
| Lỗi phát âm VN | Generic | **Final consonant, stress, be/-s, word order** có hệ thống |
| Lộ trình | Gamified path | **A0→B1 LessonSpec**, can-do + gate |
| Speaking | Drill ngắn / chat AI | **Scripted → semi-free**, feedback VI actionable |
| Hứa hẹn | Streak, league | **Guided hours honest** (Cambridge A1 ~90–100h) |

Tham chiếu nghiên cứu: `/home/thunder/Code/docs/web-english-learning-research-v2.md`, `english-learning-product-reference.md`, `learning_content_design.md`.

---

## 3. Trụ cột sản phẩm

### A. Chương trình (content moat)

- **LessonSpec v2:** Engage → Lexis → Grammar → … → Task → Review  
- **42 bài** A0→B1 (`l-a0-01` … `l-b1-14`) — đã authored  
- Mỗi bài: ≤12 lexis, 1 grammar spine, `canDo[]` đo được  
- Phase gates: A2 checkpoint, **B1 certificate** milestone  

Code: `src/lib/v2/` · pedagogy: `docs/pedagogy/LESSON_SYSTEM_FOUNDATION.md`

### B. Trải nghiệm học (UX)

- Mobile-first web app (PWA-friendly)  
- **Học · Ôn · Tôi** — IA gọn, không portal 20 mục  
- `/home` = bài hôm nay + continue  
- `/path` = lộ trình B1 trực quan  
- Guest try-lesson → đăng ký khi thấy tiến bộ  

### C. Nói & nghe

- Shadowing, read-aloud, substitution, prompted answer  
- Feedback tiếng Việt — **trung thực** (không điểm ảo)  
- L1 pattern detection trong `speech-analysis`  
- Roadmap: Azure / OpenAI pronunciation khi scale  

### D. Ghi nhớ (SRS)

- FSRS v6 item-level: vocab, phrase, sentence frame, pronunciation target  
- Review đa dạng: nghe, chọn, gõ, nói — không chỉ flashcard  

### E. Tin cậy & VN compliance

- Privacy khớp data flow thật (Luật 91/2025)  
- Auth Supabase + RLS  
- Rate-limit AI, không lộ API key  

---

## 4. Đối tượng ưu tiên

1. **Người Việt mất gốc / false beginner** (18–40, nhu cầu công việc)  
2. **Sinh viên / học sinh** cần nền A1–B1 vững  
3. Secondary: người có nền nhưng yếu nói/nghe  

Không ưu tiên: IELTS 7+, C1 fluency, native accent.

---

## 5. Lộ trình phát triển (ưu tiên)

| Phase | Focus | Done when |
|-------|-------|-----------|
| **P0 — Cutover** | v2 default, IA thống nhất, bỏ dual curriculum UX | Flag ON, nav → `/home` |
| **P1 — Infra** | Supabase mới, auth sync, deploy ổn | Login + progress đa thiết bị |
| **P2 — Quality** | Speech label honest, content gates, landing VN | Tests + radar green |
| **P3 — Growth** | Pilot VN, WTP, SEO/Zalo content | D7 retention ≥25% |
| **P4 — Depth** | Business track, roleplay có kiểm soát, cert B1 | Sau gate B1 content |

---

## 6. Non-goals (tránh loãng)

- Không làm “app mọi thứ” kiểu portal Tiếng Anh 123  
- Không gamification rỗng (league spam, XP farm) làm core loop  
- Không free AI chat không giới hạn ở giai đoạn đầu  
- Không hứa “B1 trong 30 ngày” — honest về guided hours  

---

## 7. Tài liệu liên quan

| Doc | Vai trò |
|-----|---------|
| [V2_PRODUCT.md](./V2_PRODUCT.md) | Spec kỹ thuật v2 |
| [LESSON_SYSTEM_FOUNDATION.md](../pedagogy/LESSON_SYSTEM_FOUNDATION.md) | Hiến pháp sư phạm |
| [UI_SYSTEM.md](../design/UI_SYSTEM.md) | Ato Surface design |
| `/home/thunder/Code/docs/mvp-spec.md` | Research MVP foundation |

---

*Owner mandate 2026-07-20: phát triển trên repo chính `/home/thunder/Code/atoenglish` — không workspace RC riêng, không giới hạn pilot A1-only.*
