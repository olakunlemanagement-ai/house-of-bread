import { cacheLife } from "next/cache";
import { feedUrl, parseChannelId, parseYouTubeFeed, type FeedVideo } from "./youtube-feed";

export type VideoFeed = { status: "ok"; videos: FeedVideo[] } | { status: "unavailable" };

const unavailable: VideoFeed = { status: "unavailable" };

/**
 * The channel's latest six videos, fetched on the server at build time and
 * revalidated hourly. Uses YOUTUBE_CHANNEL_ID. Missing configuration, a
 * failed request (the feed endpoint returns 404 intermittently) or an empty
 * feed all return "unavailable", and the page shows its fallback.
 */
export async function getLatestVideos(): Promise<VideoFeed> {
  "use cache";
  cacheLife("hours");

  const channelId = parseChannelId(process.env.YOUTUBE_CHANNEL_ID);
  if (!channelId) return unavailable;

  try {
    const response = await fetch(feedUrl(channelId), {
      headers: { Accept: "application/atom+xml, application/xml;q=0.9" },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.warn(`YouTube feed request failed with status ${response.status}`);
      return unavailable;
    }
    const videos = parseYouTubeFeed(await response.text(), 6);
    return videos.length > 0 ? { status: "ok", videos } : unavailable;
  } catch (error) {
    console.warn("YouTube feed request failed", error instanceof Error ? error.name : "unknown error");
    return unavailable;
  }
}
