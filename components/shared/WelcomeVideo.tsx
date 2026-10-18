import { resolveVideo } from "@/lib/media/featured";
import { getLatestVideos } from "@/lib/media/videos";
import { siteConfig } from "@/lib/site-config";
import { PhotoFrame } from "./Placeholder";
import { YouTubeFacade } from "./YouTubeFacade";

/**
 * The welcome video slot on Home. Uses siteConfig.links.welcomeVideoId when
 * it is set and well formed (its title from the feed, or the placeholder
 * title), otherwise the channel's latest video from the cached feed,
 * otherwise the "Photo and video to come" frame. Every case is a 16:9 box,
 * so the Suspense skeleton (YouTubeFacadeSkeleton) matches it.
 */
export async function WelcomeVideo() {
  const feed = await getLatestVideos();
  const videos = feed.status === "ok" ? feed.videos : [];
  const video = resolveVideo(siteConfig.links.welcomeVideoId, videos) ?? videos[0];

  if (video) {
    return <YouTubeFacade source={{ kind: "video", id: video.id }} title={video.title} />;
  }

  return (
    <PhotoFrame media="video" label="Photo and video to come" subject="A 60 to 90 second welcome from the ministry" />
  );
}
