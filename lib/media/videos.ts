import { cacheLife } from "next/cache";
import { feedUrl, parseChannelId, parseYouTubeFeed, type FeedVideo } from "./youtube-feed";

export type VideoFeed = { status: "ok"; videos: FeedVideo[] } | { status: "unavailable" };

const unavailable: VideoFeed = { status: "unavailable" };

/**
 * Refreshed hourly. The long expire matters: a page past its expire is
 * rendered while the visitor waits, and a failed feed would then fail the
 * page instead of leaving the last good one in place.
 */
const feedLife = { stale: 60 * 5, revalidate: 60 * 60, expire: 60 * 60 * 24 * 30 };

/** A failure from the feed request. The message never carries the channel id. */
export class FeedUnavailableError extends Error {
  override name = "FeedUnavailableError";
}

type LoadOptions = {
  fetch?: typeof fetch;
  attempts?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
};

async function requestFeed(url: string, fetcher: typeof fetch, timeoutMs: number): Promise<FeedVideo[]> {
  let response: Response;
  try {
    response = await fetcher(url, {
      headers: { Accept: "application/atom+xml, application/xml;q=0.9" },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    // Only the error's name: a fetch error's message or cause can carry the URL.
    const name = error instanceof Error ? error.name : "unknown error";
    throw new FeedUnavailableError(`YouTube feed request failed (${name})`);
  }
  if (!response.ok) throw new FeedUnavailableError(`YouTube feed returned status ${response.status}`);

  const xml = await response.text();
  const videos = parseYouTubeFeed(xml, 6);
  // A real Atom feed with no entries is a channel with no videos. Anything
  // else that parses to nothing (an HTML error page, say) is a failure.
  if (videos.length === 0 && !/<feed[\s>]/.test(xml)) {
    throw new FeedUnavailableError("YouTube feed returned no usable feed");
  }
  return videos;
}

/**
 * The channel's latest six videos, newest first. Retries once, because the
 * feed endpoint fails intermittently. Throws FeedUnavailableError when every
 * attempt fails. Framework free, so it can be tested directly.
 */
export async function loadLatestVideos(
  channelId: string,
  { fetch: fetcher = fetch, attempts = 2, retryDelayMs = 750, timeoutMs = 6000 }: LoadOptions = {},
): Promise<FeedVideo[]> {
  let lastError = new FeedUnavailableError("YouTube feed request failed");
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await requestFeed(feedUrl(channelId), fetcher, timeoutMs);
    } catch (error) {
      lastError = error instanceof FeedUnavailableError ? error : new FeedUnavailableError("YouTube feed request failed");
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }
  throw lastError;
}

/**
 * True when no earlier page exists to fall back to: during `next build`, and
 * in development, where a thrown error would only show the error overlay.
 */
function noPreviousPage(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV !== "production";
}

/**
 * The channel's latest videos for the Library page, cached and refreshed
 * hourly. Uses YOUTUBE_CHANNEL_ID; without it the result is "unavailable".
 *
 * When the feed fails at runtime this throws on purpose. The refresh then
 * fails, and both Vercel's ISR and Next's own cache keep serving the last
 * page that rendered and retry within 30 seconds. Returning "unavailable"
 * instead would be cached as a success and replace the videos with the empty
 * state. The empty state therefore shows only when the build itself could
 * not fetch, or the channel has no videos. Next 16.4.2 fails the build if a
 * cached function throws, so at build time this falls back instead and
 * retries after a minute. See docs/MEDIA-FEED.md.
 */
export async function getLatestVideos(): Promise<VideoFeed> {
  "use cache";
  cacheLife(feedLife);

  const channelId = parseChannelId(process.env.YOUTUBE_CHANNEL_ID);
  if (!channelId) return unavailable;

  try {
    const videos = await loadLatestVideos(channelId);
    return videos.length > 0 ? { status: "ok", videos } : unavailable;
  } catch (error) {
    const message = error instanceof FeedUnavailableError ? error.message : "YouTube feed request failed";
    if (noPreviousPage()) {
      console.warn(`${message}. Showing the empty state, retrying in a minute.`);
      cacheLife({ revalidate: 60 });
      return unavailable;
    }
    console.warn(`${message}. Keeping the last good page.`);
    throw new FeedUnavailableError(message);
  }
}
