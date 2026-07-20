# Báo cáo Autopilot — AtoEnglish

> Cập nhật: **2026-07-20**
> Đọc file này khi về — agent tự ghi sau mỗi phiên.

## Trạng thái nhanh

| Mục | Giá trị |
|-----|---------|
| Daemon | **off** (chỉ bật khi owner + CI ổn) |
| Deploy Vercel | **Ready** production |
| Commit mới nhất | (see `git log -1`) reopen + infra |
| Task đang làm | none |
| Task ready còn lại | 0 (refill from roadmap if needed) |
| Circuit breaker | OK |
| Live | https://atoenglish.vercel.app |
| GitHub | **unarchived**, private, main synced |
| Supabase | `zpiwddskhduuykpxltun` (new, SG) |
| Radar | **PASS=13 FAIL=0** (2026-07-20) |

## Phiên revive-in-place (2026-07-20)

- Unarchive GitHub + push full local main
- Supabase project mới + 27 migrations (incl. `user_v2_lesson_progress`)
- Vercel env: new URL/keys + `NEXT_PUBLIC_CURRICULUM_V2=1`
- Production deploy Ready; live HTML → new Supabase host
- Auth: `site_url` + redirect allow list + `mailer_autoconfirm=true`
- Email signup smoke OK; RLS blocks anon insert on v2 progress
- Google OAuth: **chưa bật** (cần Client ID/Secret từ Google Cloud — owner)
- Vercel Git Integration: **chưa** (cần Login Connection trên Vercel dashboard) — deploy CLI + push vẫn work

## Delivered

| Task | Kết quả |
|------|---------|
| TASK-287 / 313 | done — migration live |
| Product cutover v2 default ON | live bottom tab `home` |
| product-radar | PASS=13 |

## Còn owner

1. **Google OAuth** — Supabase Dashboard → Auth → Providers → Google + redirect URI  
2. **Vercel ↔ GitHub Login Connection** — auto-deploy on push  
3. (Optional) Custom SMTP if tắt autoconfirm  

## Nhật ký

| 2026-07-20 | revive | unarchive + Supabase new + deploy + radar green | done |
| 2026-07-20 | TASK-287/313 | user_v2_lesson_progress applied | done |
