import { resolveVideoWithTitle } from "@/lib/media/oembed";
import { getLatestVideos } from "@/lib/media/videos";
import { isVideoId } from "@/lib/media/youtube-feed";
import { siteConfig, YOUTUBE_CHANNEL_ID } from "@/lib/site-config";
import { ImageSlot } from "./ImageSlot";
import { YouTubeFacade, YouTubeFacadeSkeleton } from "./YouTubeFacade";

/**
 * The video in Home's "New here? Start here." slot: siteConfig.startHereVideoId
 * behind the click to load facade, titled from the feed, then YouTube
 * oEmbed, then the placeholder title. Without an id it falls back to the
 * channel's latest video, then to an image slot (ImageSlot). Every case is a 16:9 box,
 * so the Suspense skeleton (StartHereVideoSkeleton) matches it.
 */
export async function StartHereVideo() {
  const feed = await getLatestVideos();
  const videos = feed.status === "ok" ? feed.videos : [];
  const video = (await resolveVideoWithTitle(siteConfig.startHereVideoId, videos)) ?? videos[0];

  if (video) {
    return <YouTubeFacade source={{ kind: "video", id: video.id }} title={video.title} />;
  }

  return <ImageSlot kind="video" brief="a first teaching for someone new to the ministry" />;
}

/**
 * Suspense fallback for StartHereVideo: the 16:9 skeleton with a link to the
 * configured video, or to the channel's videos page when none is set.
 */
export function StartHereVideoSkeleton() {
  const id = siteConfig.startHereVideoId;
  const href: `https://${string}` = isVideoId(id)
    ? `https://www.youtube.com/watch?v=${id}`
    : `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/videos`;
  return <YouTubeFacadeSkeleton href={href} name="the start here video" />;
}
