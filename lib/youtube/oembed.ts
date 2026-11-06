import { cacheLife } from "next/cache";
import { z } from "zod";
import { hasPlaceholderTitle, resolveVideo } from "./featured";
import { cleanVideoTitle, isVideoId, type FeedVideo } from "./feed";

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

const oEmbedInfoSchema = z.object({
  title: z.string().trim().min(1).max(300),
  author_url: z.string().max(300).optional(),
});

export type OEmbedInfo = { title: string; authorUrl: string | null };

/** Title and channel URL from an oEmbed response body, or null if it is not one. */
export function parseOEmbedInfo(body: unknown): OEmbedInfo | null {
  const parsed = oEmbedInfoSchema.safeParse(body);
  if (!parsed.success) return null;
  const title = cleanVideoTitle(parsed.data.title);
  if (!title) return null;
  const author = parsed.data.author_url?.trim() ?? "";
  return { title, authorUrl: /^https:\/\/www\.youtube\.com\/[@A-Za-z0-9/_.-]+$/.test(author) ? author : null };
}

/**
 * What oEmbed said about one video. "missing": YouTube answered that it has
 * no public video by that id (400, 401, 403 or 404). "unreachable": no
 * usable answer at all (a network error, a timeout, another status, or a
 * body that is not oEmbed), so nothing is known either way.
 */
export type VideoLookup = { status: "found"; info: OEmbedInfo } | { status: "missing" } | { status: "unreachable" };

const MISSING_STATUSES = new Set([400, 401, 403, 404]);

/** Asks oEmbed for a video's title and channel URL. Never throws. */
export async function lookupVideo(id: string, fetchImpl: typeof fetch = fetch): Promise<VideoLookup> {
  if (!isVideoId(id)) return { status: "missing" };
  try {
    const response = await fetchImpl(oEmbedUrl(id), { signal: AbortSignal.timeout(5000) });
    if (MISSING_STATUSES.has(response.status)) return { status: "missing" };
    if (!response.ok) return { status: "unreachable" };
    const info = parseOEmbedInfo(await response.json());
    return info ? { status: "found", info } : { status: "unreachable" };
  } catch {
    return { status: "unreachable" };
  }
}

/**
 * A video's oEmbed answer, cached for days when found, for an hour when
 * YouTube said it has no such video (it may be new), and for a minute when
 * YouTube did not answer, so a watch page's unavailable state is short lived.
 */
export async function getVideoLookup(id: string): Promise<VideoLookup> {
  "use cache";
  cacheLife("days");
  const lookup = await lookupVideo(id);
  if (lookup.status === "missing") cacheLife({ stale: 60 * 5, revalidate: 60 * 60, expire: 60 * 60 * 24 });
  if (lookup.status === "unreachable") cacheLife({ revalidate: 60 });
  return lookup;
}
