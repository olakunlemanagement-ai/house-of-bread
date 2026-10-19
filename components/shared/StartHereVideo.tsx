import { resolveVideoWithTitle } from "@/lib/media/oembed";
import { getLatestVideos } from "@/lib/media/videos";
import { siteConfig } from "@/lib/site-config";
import { PhotoFrame } from "./Placeholder";
import { YouTubeFacade } from "./YouTubeFacade";

/**
 * The video in Home's "New here? Start here." slot: siteConfig.startHereVideoId
 * behind the click to load facade, titled from the feed, then YouTube
 * oEmbed, then the placeholder title. Without an id it falls back to the
 * channel's latest video, then to an image slot. Every case is a 16:9 box,
 * so the Suspense skeleton (YouTubeFacadeSkeleton) matches it.
 */
export async function StartHereVideo() {
  const feed = await getLatestVideos();
  const videos = feed.status === "ok" ? feed.videos : [];
  const video = (await resolveVideoWithTitle(siteConfig.startHereVideoId, videos)) ?? videos[0];

  if (video) {
    return <YouTubeFacade source={{ kind: "video", id: video.id }} title={video.title} />;
  }

  return <PhotoFrame media="video" label="Video to come" subject="A first teaching for someone new to the ministry" />;
}
