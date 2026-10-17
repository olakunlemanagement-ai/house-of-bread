import { getLatestVideos } from "@/lib/media/videos";
import { isVideoId } from "@/lib/media/youtube-feed";
import { siteConfig } from "@/lib/site-config";
import { PhotoFrame } from "./Placeholder";
import { YouTubeFacade } from "./YouTubeFacade";

/**
 * The welcome video slot on Home. Uses siteConfig.links.welcomeVideoId when
 * it is set and well formed, otherwise the channel's latest video from the
 * cached feed, otherwise the "Photo and video to come" frame. Every case is
 * a 16:9 box, so the Suspense skeleton (YouTubeFacadeSkeleton) matches it.
 */
export async function WelcomeVideo() {
  const configured = siteConfig.links.welcomeVideoId;
  if (isVideoId(configured)) {
    return <YouTubeFacade source={{ kind: "video", id: configured }} title="A welcome from House of Bread Global" />;
  }

  const feed = await getLatestVideos();
  const latest = feed.status === "ok" ? feed.videos[0] : undefined;
  if (latest) {
    return <YouTubeFacade source={{ kind: "video", id: latest.id }} title={latest.title} />;
  }

  return (
    <PhotoFrame media="video" label="Photo and video to come" subject="A 60 to 90 second welcome from the ministry" />
  );
}
