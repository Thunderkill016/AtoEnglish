import type { Metadata } from "next";
import { realTalkVideos } from "@/lib/data/real-talk/videos";
import RealTalkHub from "@/components/real-talk/RealTalkHub";

export const metadata: Metadata = {
  title: "Real Talk — Học từ cuộc trò chuyện thực tế | AtoEnglish",
  description:
    "Xem video trò chuyện thật từ YouTube và biến thành bài học tiếng Anh. Học từ vựng, nghe hiểu, và luyện nói theo người bản xứ.",
};

export default function RealTalkPage() {
  return <RealTalkHub videos={realTalkVideos} />;
}
