import { cacheLife } from "next/cache";
import { z } from "zod";
import { hasPlaceholderTitle, resolveVideo } from "./featured";
import { isVideoId, type FeedVideo } from "./youtube-feed";

// A configured video that is not in the ministry's feed (for example one on
// the pastor's channel) has no known title. YouTube's oEmbed endpoint gives
// it, from the server only: nothing here reaches the browser, and no YouTube
// code loads before the visitor presses play.

const oEmbedSchema = z.object({ title: z.string().trim().min(1).max(300) });

/** The title from an oEmbed response body, or null if it is not one. */
export function parseOEmbedTitle(body: unknown): string | null {
  const parsed = oEmbedSchema.safeParse(body);
  return parsed.success ? parsed.data.title : null;
}

export function oEmbedUrl(id: string): string {
  const watch = `https://www.youtube.com/watch?v=${id}`;
  return `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(watch)}`;
}

/** Fetches a video's title. Null on any failure; never throws. */
export async function loadVideoTitle(id: string, fetchImpl: typeof fetch = fetch): Promise<string | null> {
  if (!isVideoId(id)) return null;
  try {
    const response = await fetchImpl(oEmbedUrl(id), { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return null;
    return parseOEmbedTitle(await response.json());
  } catch {
    return null;
  }
}

/** A video's title from oEmbed, cached for days, or for an hour after a failure. */
export async function getVideoTitle(id: string): Promise<string | null> {
  "use cache";
  cacheLife("days");
  const title = await loadVideoTitle(id);
  if (title === null) {
    console.warn("YouTube oEmbed title unavailable. Showing the placeholder title, retrying within the hour.");
    cacheLife({ stale: 60 * 5, revalidate: 60 * 60, expire: 60 * 60 * 24 });
  }
  return title;
}

/**
 * A configured video with the best title available: the feed's, then
 * oEmbed's, then the placeholder (docs/PLACEHOLDERS.md).
 */
export async function resolveVideoWithTitle(
  id: string | null,
  feed: FeedVideo[],
  lookup: (id: string) => Promise<string | null> = getVideoTitle,
): Promise<FeedVideo | null> {
  const video = resolveVideo(id, feed);
  if (!video || !hasPlaceholderTitle(video)) return video;
  const title = await lookup(video.id);
  return title ? { ...video, title } : video;
}
