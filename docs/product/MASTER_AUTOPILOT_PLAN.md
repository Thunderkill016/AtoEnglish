# Master Autopilot Plan — Audit 2026-07-10

> **Nguồn:** full route inventory + live smoke (PASS all HTTP 200) + explore audit + design debt.  
> **Không** xoá project. **Có** kế hoạch dọn + nâng cấp + content → B1, agent 24/7 chạy theo thứ tự này.  
> **Daemon:** `scripts/agent-daemon.sh` · refill **feature-only** · `ALLOW_MAINTENANCE_FALLBACK=0`.

---

## 1. Live smoke (prod)

| Check | Result |
|-------|--------|
| product-radar 13 paths | **PASS=13 FAIL=0** |
| Extra: roadmap, progress, settings, grammar, writing, business, placement, leaderboard, challenge, invite, certificate, unit-1/2, home, path, me, privacy, terms | **all 200** |

**Kết luận:** App **không down**. Vấn đề chính = **IA kép v1/v2**, **UI không thống nhất**, **content v2 chưa đủ path B1**, progress v2 local-only.

---

## 2. Giữ nguyên (không đốt)

- Supabase Auth + RLS + rate limit  
- FSRS + speaking coach + guest local  
- v1 50 units (prod default)  
- v2 LessonSpec + 14 bài authored (a0×8, a1×1–5, b1-01)  
- Ato Surface kit + dark-first theme  
- Product radar loop  

---

## 3. Vấn đề xếp hạng

| P | Issue |
|---|--------|
| **P0** | Content v2 lỗ hổng (14/42) — factory A1→A2→B1 |
| **P0** | IA: bottom-nav «Học» → `/dashboard` (v1) trong khi v2 = `/home` + `/learn/v2` |
| **P0** | v2 progress chỉ localStorage — cần DB + merge auth |
| **P0** | Design: dashboard/secondary còn light-card legacy vs landing dark |
| **P1** | FSRS seed từ LessonSpec lexis |
| **P1** | Gate A2/B1 + Path lock |
| **P1** | Speaking subroutes chrome Ato |
| **P1** | E2E guest→v2 complete smoke |
| **P2** | Soft-hide gamification noise khi flag v2 |
| **P2** | Cutover flag staging→prod checklist |
| **P3** | Landing chỉ align token, không rebuild marketing |

---

## 4. Lịch 24/7 (thứ tự bắt buộc)

### Wave A — Content factory A1 (đang ready)

| # | Task | Done khi |
|---|------|----------|
| A1 | Author l-a1-06 Nhà cửa | Zod + registry + sequential |
| A2 | Author l-a1-07 Mua sắm | idem |
| A3 | Author l-a1-08 Đồ ăn & order | idem |
| A4 | Author l-a1-09 Địa điểm | idem |
| A5 | Author l-a1-10 can | idem |
| A6 | Author l-a1-11 Sức khỏe | idem |
| A7 | Author l-a1-12 Ôn A1 | idem · **A1 12/12** |

### Wave B — Product spine (sau A1 full)

| # | Task | Done khi |
|---|------|----------|
| B1 | Nav Học → `/home` khi `isCurriculumV2()` else dashboard | Flag-aware 1 CTA |
| B2 | Dashboard dark Ato migrate (Surface cards, no white canvas) | Match landing |
| B3 | v2 progress Supabase table + RLS + sync | Multi-device |
| B4 | FSRS seed from LessonSpec lexis on complete | Cards appear |
| B5 | E2E: guest or auth → l-a1 lesson complete + floor | Playwright green |

### Wave C — A2 + chrome residual

| # | Task |
|---|------|
| C1–C8 | Author l-a2-01 … l-a2-08 (gate) |
| C9 | Speaking subroutes Ato chrome |
| C10 | Progress/Me Ato polish (residual) |

### Wave D — B1 + cutover

| # | Task |
|---|------|
| D1–D13 | Author remaining l-b1-* sequential |
| D14 | Gate B1 + cert wire v2 |
| D15 | Cutover checklist flag ON preview → prod |
| D16 | Soft-archive v1 learn behind flag |

---

## 5. Luật agent (mỗi task)

1. Một task / cycle · đọc AGENTS + CONTENT_STYLE pedagogy path  
2. Minimal diff · không schema trừ task B3  
3. `npm run lint && npm run test`  
4. Commit + `git-push.sh main`  
5. **Cấm** maintenance sweep rỗng  
6. UI: chỉ `design-system` + zinc-950 dark-first  

---

## 6. Success metrics

| Metric | Target |
|--------|--------|
| Authored v2 lessons | 42/42 path complete |
| Primary learn entry | `/home` when v2 flag |
| Dashboard | No light white primary canvas |
| Radar | FAIL=0 on prod after each deploy |
| North star | B1 gate playable end-to-end |

---

## 7. Bật 24/7

```bash
bash scripts/agent-daemon-start.sh   # nếu chưa chạy
tail -f logs/agent/daemon.log
```

Queue hiện tại: **TASK-270…273** (l-a1-06…09) rồi refill từ ROADMAP Wave A–D.

*Generated: full-project audit 2026-07-10 · do not re-open empty maint sweeps.*
