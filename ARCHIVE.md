# AtoEnglish — Lịch sử archive (tham khảo)

**Trạng thái hiện tại:** **ACTIVE** — phát triển sản phẩm tại repo này.

**Tầm nhìn:** [`docs/product/VISION_VN.md`](./docs/product/VISION_VN.md)  
**Spec kỹ thuật:** [`docs/product/V2_PRODUCT.md`](./docs/product/V2_PRODUCT.md)

---

## Timeline

| Ngày | Sự kiện |
|------|---------|
| 2026-07-10 | Owner đóng tạm (dual curriculum, IA rối) — tag `archive/final-2026-07-10` |
| 2026-07-19/20 | Recovery snapshot + audit Codex |
| 2026-07-20 | **Mở lại phát triển** — mục tiêu: web học tiếng Anh tốt nhất cho người Việt tại VN |

Recovery freeze (read-only): `/home/thunder/Code/atoenglish-recovery/20260720T001449-0700/` @ `c06680f2`

Live: https://atoenglish.vercel.app

---

## Quy tắc phát triển

- **Một** curriculum mặc định: v2 LessonSpec A0→B1 (`NEXT_PUBLIC_CURRICULUM_V2` mặc định bật)
- Giữ chất lượng nội dung + speaking + SRS — không feature mill mù
- Autopilot chỉ bật khi owner + CI + remote SSOT ổn định
