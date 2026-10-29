// The YouTube Data API v3, used only when YOUTUBE_API_KEY is set: playlists
// with their episode lists, and video durations. Server only by design: the
// key travels in a request header (never the URL, so no log line carries
// it), and no error message includes the key, a URL or a response body.
// Responses are third party input and pass through Zod. Framework free.

import { z } from "zod";
import { cleanDescription, cleanVideoTitle, isPlaylistId, isVideoId } from "./feed";
import { parseIsoDuration } from "./duration";

const API = "https://www.googleapis.com/youtube/v3";
const KEY_FORMAT = /^[A-Za-z0-9_-]{20,80}$/;

/** The API key from the environment, or null when unset or malformed. */
export function parseApiKey(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return KEY_FORMAT.test(trimmed) ? trimmed : null;
}

/** A failure from the Data API. The message never carries the key or the URL. */
export class YouTubeApiError extends Error {
  override name = "YouTubeApiError";
}

export type ApiOptions = { key: string; fetch?: typeof fetch; timeoutMs?: number };

async function call(path: string, params: Record<string, string>, { key, fetch: fetcher = fetch, timeoutMs = 6000 }: ApiOptions) {
  const url = `${API}/${path}?${new URLSearchParams(params).toString()}`;
  let response: Response;
  try {
    response = await fetcher(url, {
      headers: { Accept: "application/json", "X-Goog-Api-Key": key },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    const name = error instanceof Error ? error.name : "unknown error";
    throw new YouTubeApiError(`YouTube Data API ${path} request failed (${name})`);
  }
  if (!response.ok) throw new YouTubeApiError(`YouTube Data API ${path} returned status ${response.status}`);
  try {
    return (await response.json()) as unknown;
  } catch {
    throw new YouTubeApiError(`YouTube Data API ${path} returned no JSON`);
  }
}

const pageToken = z.string().max(200).optional();

const playlistsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        snippet: z.object({
          publishedAt: z.string().optional(),
          title: z.string().optional(),
          description: z.string().optional(),
        }),
        contentDetails: z.object({ itemCount: z.number().int().nonnegative().optional() }).optional(),
      }),
    )
    .default([]),
  nextPageToken: pageToken,
});

const playlistItemsSchema = z.object({
  items: z
    .array(
      z.object({
        snippet: z
          .object({ title: z.string().optional(), description: z.string().optional() })
          .optional(),
        contentDetails: z.object({ videoId: z.string(), videoPublishedAt: z.string().optional() }),
      }),
    )
    .default([]),
  nextPageToken: pageToken,
});

const videosSchema = z.object({
  items: z
    .array(z.object({ id: z.string(), contentDetails: z.object({ duration: z.string().optional() }).optional() }))
    .default([]),
});

function parse<T>(schema: z.ZodType<T>, body: unknown, path: string): T {
  const result = schema.safeParse(body);
  if (!result.success) throw new YouTubeApiError(`YouTube Data API ${path} returned an unexpected shape`);
  return result.data;
}

function isoOrNull(value: string | undefined): string | null {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isNaN(time) ? null : new Date(time).toISOString();
}

export type ApiPlaylist = {
  id: string;
  title: string;
  description: string | null;
  publishedAt: string | null;
  itemCount: number | null;
};

export type ApiPlaylistItem = {
  id: string;
  title: string;
  description: string | null;
  publishedAt: string | null;
};

function toPlaylists(body: z.output<typeof playlistsSchema>): ApiPlaylist[] {
  return body.items.flatMap((item) => {
    const title = cleanVideoTitle(item.snippet.title);
    if (!isPlaylistId(item.id) || !title) return [];
    return [
      {
        id: item.id,
        title,
        description: cleanDescription(item.snippet.description),
        publishedAt: isoOrNull(item.snippet.publishedAt),
        itemCount: item.contentDetails?.itemCount ?? null,
      },
    ];
  });
}

/** A channel's public playlists (the first 50). */
export async function fetchChannelPlaylists(channelId: string, options: ApiOptions): Promise<ApiPlaylist[]> {
  const body = await call("playlists", { part: "snippet,contentDetails", channelId, maxResults: "50" }, options);
  return toPlaylists(parse(playlistsSchema, body, "playlists"));
}

/** Named playlists, in one request (up to 50 ids). Unknown ids are left out. */
export async function fetchPlaylistsById(ids: string[], options: ApiOptions): Promise<ApiPlaylist[]> {
  const valid = ids.filter(isPlaylistId).slice(0, 50);
  if (valid.length === 0) return [];
  const body = await call("playlists", { part: "snippet,contentDetails", id: valid.join(","), maxResults: "50" }, options);
  return toPlaylists(parse(playlistsSchema, body, "playlists"));
}

// Removed and private videos stay in a playlist with these titles and no date.
const UNAVAILABLE = new Set(["Private video", "Deleted video"]);

/** A playlist's videos in playlist order, up to `maxPages` pages of 50. Private and deleted ones are left out. */
export async function fetchPlaylistItems(playlistId: string, options: ApiOptions & { maxPages?: number }): Promise<ApiPlaylistItem[]> {
  const items: ApiPlaylistItem[] = [];
  const seen = new Set<string>();
  let token: string | undefined;
  for (let page = 0; page < (options.maxPages ?? 4); page++) {
    const params: Record<string, string> = { part: "snippet,contentDetails", playlistId, maxResults: "50" };
    if (token) params.pageToken = token;
    const body = parse(playlistItemsSchema, await call("playlistItems", params, options), "playlistItems");
    for (const item of body.items) {
      const id = item.contentDetails.videoId;
      const rawTitle = item.snippet?.title ?? "";
      const title = cleanVideoTitle(rawTitle);
      if (!isVideoId(id) || seen.has(id) || !title || UNAVAILABLE.has(rawTitle.trim())) continue;
      seen.add(id);
      items.push({
        id,
        title,
        description: cleanDescription(item.snippet?.description),
        publishedAt: isoOrNull(item.contentDetails.videoPublishedAt),
      });
    }
    token = body.nextPageToken;
    if (!token) break;
  }
  return items;
}

/** Durations in seconds by video id, 50 ids per request. Videos with no usable duration are left out. */
export async function fetchDurations(ids: string[], options: ApiOptions): Promise<Map<string, number>> {
  const unique = [...new Set(ids.filter(isVideoId))];
  const durations = new Map<string, number>();
  for (let i = 0; i < unique.length; i += 50) {
    const batch = unique.slice(i, i + 50);
    const body = parse(videosSchema, await call("videos", { part: "contentDetails", id: batch.join(","), maxResults: "50" }, options), "videos");
    for (const item of body.items) {
      const seconds = parseIsoDuration(item.contentDetails?.duration);
      if (isVideoId(item.id) && seconds !== null) durations.set(item.id, seconds);
    }
  }
  return durations;
}
