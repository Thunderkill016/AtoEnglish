import type { Metadata } from "next";
import { fetchCatalogVideos } from "@/app/actions/real-talk";
import RealTalkHub from "@/components/real-talk/RealTalkHub";

export const metadata: Metadata = {
  title: "Real Talk — Học từ cuộc trò chuyện thực tế | AtoEnglish",
  description:
    "Xem video trò chuyện thật từ YouTube và biến thành bài học tiếng Anh. Học từ vựng, nghe hiểu, và luyện nói theo người bản xứ.",
};

export default async function RealTalkPage() {
  const videos = await fetchCatalogVideos();
  return <RealTalkHub videos={videos} />;
}
