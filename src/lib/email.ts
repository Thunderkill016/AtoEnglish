/**
 * Email utilities using Resend
 * https://resend.com — free tier: 3,000 emails/month
 *
 * Set RESEND_API_KEY in Vercel environment variables.
 * Verify domain at: https://resend.com/domains
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "AtoEnglish <remind@atoenglish.vercel.app>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://atoenglish.vercel.app";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface WeeklyDigestData {
  email: string;
  displayName: string;
  streak: number;
  lessonsThisWeek: number;
  cardsThisWeek: number;
  activeDays: number;
  currentLevel: string;
}

export interface WinBackData {
  email: string;
  displayName: string;
  daysSince: number;
  streak: number;
  currentLevel: string;
}

// ─── Weekly Digest Email ──────────────────────────────────────────────────────
export async function sendWeeklyDigest(data: WeeklyDigestData) {
  if (!process.env.RESEND_API_KEY) return { success: false, error: "No RESEND_API_KEY" };

  const subject = data.streak >= 14
    ? `🔥 ${data.streak} ngày streak! Tuần học của ${data.displayName}`
    : data.lessonsThisWeek > 0
    ? `📚 Tuần này bạn học được ${data.lessonsThisWeek} bài — tiếp tục nhé!`
    : `👋 Tuần mới, cơ hội mới — học 1 bài thôi ${data.displayName}!`;

  const html = weeklyDigestHTML(data);

  try {
    await resend.emails.send({ from: FROM, to: data.email, subject, html });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown" };
  }
}

// ─── Win-Back Email ───────────────────────────────────────────────────────────
export async function sendWinBackEmail(data: WinBackData) {
  if (!process.env.RESEND_API_KEY) return { success: false, error: "No RESEND_API_KEY" };

  const subjects: Record<string, string> = {
    "7":  `👋 ${data.displayName} ơi, lâu rồi không thấy học...`,
    "14": `⏰ ${data.displayName}, streak đang chờ bạn quay lại!`,
    "30": `🌱 Chưa muộn đâu ${data.displayName} — bắt đầu lại nào!`,
  };
  const key = data.daysSince >= 30 ? "30" : data.daysSince >= 14 ? "14" : "7";
  const subject = subjects[key] ?? subjects["7"]!;
  const html = winBackHTML(data);

  try {
    await resend.emails.send({ from: FROM, to: data.email, subject, html });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown" };
  }
}

// ─── HTML Templates ───────────────────────────────────────────────────────────
function emailBase(content: string, previewText: string) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light dark"/>
<title>AtoEnglish</title>
<style>
  body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f4f5;color:#18181b;}
  .wrapper{max-width:540px;margin:0 auto;padding:24px 16px;}
  .card{background:#ffffff;border-radius:20px;padding:32px 28px;box-shadow:0 1px 3px rgba(0,0,0,0.08);}
  .logo{font-size:20px;font-weight:900;color:#10b981;text-decoration:none;letter-spacing:-0.5px;}
  .divider{height:1px;background:#f1f5f9;margin:24px 0;}
  .stat-row{display:flex;gap:12px;margin:20px 0;}
  .stat{flex:1;background:#f8fafc;border-radius:12px;padding:16px 12px;text-align:center;}
  .stat-value{font-size:24px;font-weight:900;color:#18181b;line-height:1;}
  .stat-label{font-size:11px;color:#71717a;font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-top:4px;}
  .cta{display:block;background:linear-gradient(135deg,#10b981,#14b8a6);color:#ffffff;text-align:center;padding:14px 24px;border-radius:14px;font-weight:800;font-size:15px;text-decoration:none;margin-top:24px;}
  .footer{text-align:center;font-size:11px;color:#a1a1aa;margin-top:20px;line-height:1.6;}
  .footer a{color:#71717a;text-decoration:underline;}
  @media(prefers-color-scheme:dark){body{background:#09090b;}.card{background:#18181b;color:#fafafa;}.stat{background:#27272a;}.stat-value{color:#fafafa;}.divider{background:#27272a;}}
</style>
</head>
<body>
<div style="display:none;max-height:0;overflow:hidden;">${previewText}</div>
<div class="wrapper">
  <div style="text-align:center;margin-bottom:20px;">
    <a href="${SITE_URL}" class="logo">🇬🇧 AtoEnglish</a>
  </div>
  <div class="card">
    ${content}
  </div>
  <div class="footer">
    <p>Bạn nhận email này vì đã đăng ký thông báo tại AtoEnglish.<br/>
    <a href="${SITE_URL}/settings">Tắt email nhắc nhở</a> · <a href="${SITE_URL}">Vào học ngay</a></p>
  </div>
</div>
</body>
</html>`;
}

function weeklyDigestHTML(d: WeeklyDigestData) {
  const grade =
    d.activeDays >= 6 ? "Xuất sắc 🏆" :
    d.activeDays >= 4 ? "Tốt lắm 💪" :
    d.activeDays >= 2 ? "Khá 📈" : "Cần cải thiện 📚";

  const content = `
    <h1 style="font-size:22px;font-weight:900;margin:0 0 4px;color:#18181b;">Tổng kết tuần học 📊</h1>
    <p style="margin:0 0 20px;color:#71717a;font-size:14px;">Xin chào <strong style="color:#10b981;">${d.displayName}</strong>! Đây là kết quả 7 ngày qua của bạn.</p>

    <div class="stat-row">
      <div class="stat">
        <div class="stat-value">${d.activeDays}<span style="font-size:14px;">/7</span></div>
        <div class="stat-label">Ngày học</div>
      </div>
      <div class="stat">
        <div class="stat-value">${d.lessonsThisWeek}</div>
        <div class="stat-label">Bài học</div>
      </div>
      <div class="stat">
        <div class="stat-value">${d.cardsThisWeek}</div>
        <div class="stat-label">Thẻ ôn</div>
      </div>
    </div>

    ${d.streak > 0 ? `
    <div style="background:linear-gradient(135deg,#fff7ed,#fef3c7);border:1px solid #f59e0b33;border-radius:12px;padding:14px 16px;margin-bottom:16px;">
      <p style="margin:0;font-size:14px;font-weight:700;color:#92400e;">🔥 Streak: <strong style="font-size:18px;">${d.streak} ngày</strong> liên tiếp — tiếp tục giữ vững!</p>
    </div>` : ""}

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:12px 16px;margin-bottom:20px;">
      <p style="margin:0;font-size:13px;color:#166534;font-weight:600;">Đánh giá tuần: <strong>${grade}</strong> · Cấp độ hiện tại: <strong>${d.currentLevel}</strong></p>
    </div>

    <a href="${SITE_URL}/dashboard" class="cta">📚 Tiếp tục học hôm nay →</a>

    <div class="divider"></div>
    <p style="font-size:13px;color:#71717a;text-align:center;margin:0;">Học mỗi ngày 10 phút — đủ để đạt B1 trong 6 tháng!</p>
  `;
  return emailBase(content, `${d.displayName} đã học ${d.activeDays}/7 ngày tuần này! Xem kết quả.`);
}

function winBackHTML(d: WinBackData) {
  const messages = {
    short: {
      heading: "Lâu rồi không thấy bạn học 👋",
      body: `Đã ${d.daysSince} ngày kể từ lần cuối bạn học. Chỉ cần 10 phút hôm nay để quay lại nhịp học nhé!`,
      cta: "Học 1 bài thôi →",
    },
    medium: {
      heading: "Streak đang chờ bạn quay lại ⏰",
      body: `${d.daysSince} ngày rồi ${d.displayName} ơi. Hàng trăm học viên AtoEnglish đang tiến bộ mỗi ngày — đừng để bị tụt lại!`,
      cta: "Quay lại ngay →",
    },
    long: {
      heading: "Chưa muộn đâu! 🌱",
      body: `Dù đã ${d.daysSince} ngày vắng bóng, chỉ cần 1 bài học ngày hôm nay là đủ để bắt đầu lại. Cấp ${d.currentLevel} đang chờ bạn tiếp tục!`,
      cta: "Bắt đầu lại nào →",
    },
  };

  const key = d.daysSince >= 30 ? "long" : d.daysSince >= 14 ? "medium" : "short";
  const msg = messages[key];

  const content = `
    <h1 style="font-size:22px;font-weight:900;margin:0 0 12px;color:#18181b;">${msg.heading}</h1>
    <p style="margin:0 0 20px;color:#71717a;font-size:14px;">Xin chào <strong style="color:#10b981;">${d.displayName}</strong>,</p>
    <p style="margin:0 0 20px;color:#3f3f46;font-size:15px;line-height:1.6;">${msg.body}</p>

    <div style="background:#fafafa;border-radius:12px;padding:16px;margin-bottom:20px;">
      <p style="margin:0;font-size:13px;color:#71717a;">Bạn đang ở cấp <strong style="color:#10b981;">${d.currentLevel}</strong>${d.streak > 0 ? ` · Streak tốt nhất: <strong>${d.streak} ngày</strong>` : ""}.</p>
    </div>

    <a href="${SITE_URL}/dashboard" class="cta">${msg.cta}</a>

    <div class="divider"></div>
    <p style="font-size:12px;color:#a1a1aa;text-align:center;margin:0;">"Consistency beats intensity — 10 phút mỗi ngày hơn 3 tiếng một tuần."</p>
  `;
  return emailBase(content, `${d.displayName} ơi, ${d.daysSince} ngày rồi — học 1 bài thôi nhé!`);
}
