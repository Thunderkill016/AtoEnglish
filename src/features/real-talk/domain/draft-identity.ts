import type { RealTalkLevel } from "@/types/real-talk";

export function derivePrivateDraftSlug(params: {
  ownerId: string;
  youtubeId: string;
  level: RealTalkLevel;
}) {
  const ownerKey = params.ownerId.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const videoKey = params.youtubeId.replace(/[^a-z0-9_-]/gi, "");

  if (!ownerKey || !/^[\w-]{11}$/.test(videoKey)) {
    throw new Error("Cannot derive a private draft identity from invalid input.");
  }

  return `real-talk-${videoKey}-${params.level.toLowerCase()}-${ownerKey}`;
}
