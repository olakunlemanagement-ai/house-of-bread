// Everything the Teachings pages show, gathered in one pass: the long-form
// teachings and Shorts of every teaching channel, the series (playlists)
// with their episodes, and durations when the Data API is available.
// Framework free: the cached, Next-facing wrapper is ./teachings.ts.
//
// Data paths, in order of preference:
// - Long-form and Shorts: each channel's UULF and UUSH playlist feeds. If
//   either fails, the channel feed instead, split by its /shorts/ links.
// - Series: with an API key, every playlist on the teaching channels plus
//   the configured ones, newest first. Without a key, or if the API fails,
//   the configured playlist ids (siteConfig.seriesPlaylistIds) from their
//   RSS feeds, which list 15 videos at most.
// - Durations: the Data API only. Without it, none.

import { fetchChannelPlaylists, fetchDurations, fetchPlaylistItems, fetchPlaylistsById, type ApiOptions } from "./api";
import {
  feedUrl,
  newestFirst,
  playlistFeedUrl,
  thumbnailUrl,
  uploadsPlaylistId,
  watchUrl,
  type FeedEntry,
} from "./feed";
import { fetchFeed, type RequestOptions } from "./request";

export type Video = FeedEntry & {
  /** Seconds, from the Data API. Null without it: no badge rather than a guess. */
  durationSeconds: number | null;
};

export type Series = {
  id: string;
  title: string;
  description: string | null;
  /** When the playlist was created. Orders the series grid, newest first. */
  publishedAt: string | null;
  /** In playlist order. */
  episodes: Video[];
  /** True when the RSS cap (15) was reached, so there may be more: shown as "15+ teachings". */
  countIsMinimum: boolean;
};

/** A manual title or description for one video, from content/videos (lib/content). */
export type VideoOverride = { title?: string; description?: string };

export type Catalog = {
  /** Long-form teachings from every channel, newest first. */
  longForm: Video[];
  /** Shorts from every channel, newest first. */
  shorts: Video[];
  /** Newest first, at most `maxSeries`. */
  series: Series[];
  /** True when every request for that section failed (not merely empty). */
  failed: { longForm: boolean; shorts: boolean; series: boolean };
  /** Which data path supplied each part, for the build log and docs/MEDIA-FEED.md. */
  source: {
    lists: "playlist feeds" | "channel feed" | "playlist and channel feeds" | "none";
    series: "data api" | "playlist feeds" | "none";
    durations: boolean;
  };
};

export type CatalogOptions = RequestOptions & {
  channelIds: readonly string[];
  seriesPlaylistIds: readonly string[];
  apiKey: string | null;
  overrides?: ReadonlyMap<string, VideoOverride>;
  maxSeries?: number;
};

/** RSS feeds list this many entries at most. */
export const FEED_CAP = 15;

const toVideo = (entry: FeedEntry): Video => ({ ...entry, durationSeconds: null });

function dedupe<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

type ChannelLists = { long: FeedEntry[]; short: FeedEntry[]; path: "playlist" | "channel" | "none" };

async function loadChannel(channelId: string, request: RequestOptions): Promise<ChannelLists> {
  const [long, short] = await Promise.allSettled([
    fetchFeed(playlistFeedUrl(uploadsPlaylistId(channelId, "long")), request),
    fetchFeed(playlistFeedUrl(uploadsPlaylistId(channelId, "short")), request),
  ]);
  if (long.status === "fulfilled" && short.status === "fulfilled") {
    return { long: long.value.entries, short: short.value.entries.map((entry) => ({ ...entry, short: true })), path: "playlist" };
  }
  try {
    const channel = await fetchFeed(feedUrl(channelId), request);
    return {
      long: long.status === "fulfilled" ? long.value.entries : channel.entries.filter((entry) => !entry.short),
      short: short.status === "fulfilled" ? short.value.entries : channel.entries.filter((entry) => entry.short),
      path: "channel",
    };
  } catch {
    return { long: [], short: [], path: "none" };
  }
}

async function seriesFromFeeds(ids: readonly string[], request: RequestOptions): Promise<{ series: Series[]; failed: boolean }> {
  const results = await Promise.allSettled(ids.map((id) => fetchFeed(playlistFeedUrl(id), request)));
  const series = results.flatMap((result, index): Series[] => {
    if (result.status !== "fulfilled" || result.value.entries.length === 0) return [];
    const feed = result.value;
    return [
      {
        id: ids[index],
        title: feed.title ?? "Series",
        description: null,
        publishedAt: feed.publishedAt,
        episodes: feed.entries.map(toVideo),
        countIsMinimum: feed.entries.length >= FEED_CAP,
      },
    ];
  });
  return { series, failed: ids.length > 0 && results.every((result) => result.status === "rejected") };
}

async function seriesFromApi(
  channelIds: readonly string[],
  configured: readonly string[],
  api: ApiOptions,
  maxSeries: number,
  shortIds: Set<string>,
): Promise<Series[]> {
  const lists = await Promise.all([
    ...channelIds.map((id) => fetchChannelPlaylists(id, api)),
    fetchPlaylistsById([...configured], api),
  ]);
  const playlists = newestFirst(dedupe(lists.flat()).filter((list) => list.itemCount !== 0)).slice(0, maxSeries);
  const items = await Promise.all(playlists.map((list) => fetchPlaylistItems(list.id, api)));
  return playlists
    .map((list, index): Series => ({
      id: list.id,
      title: list.title,
      description: list.description,
      publishedAt: list.publishedAt,
      episodes: items[index].map((item) => ({
        ...item,
        url: watchUrl(item.id),
        thumbnail: thumbnailUrl(item.id),
        short: shortIds.has(item.id),
        durationSeconds: null,
      })),
      countIsMinimum: items[index].length >= 200,
    }))
    .filter((series) => series.episodes.length > 0);
}

function applyOverride(video: Video, overrides: ReadonlyMap<string, VideoOverride> | undefined): Video {
  const override = overrides?.get(video.id);
  if (!override) return video;
  return { ...video, title: override.title ?? video.title, description: override.description ?? video.description };
}

/** Loads the whole catalog. Never throws: failures show in `failed`, for the caller to decide. */
export async function loadCatalog({
  channelIds,
  seriesPlaylistIds,
  apiKey,
  overrides,
  maxSeries = 8,
  ...request
}: CatalogOptions): Promise<Catalog> {
  const channels = await Promise.all(channelIds.map((id) => loadChannel(id, request)));
  const longForm = newestFirst(dedupe(channels.flatMap((channel) => channel.long))).map(toVideo);
  const shorts = newestFirst(dedupe(channels.flatMap((channel) => channel.short))).map(toVideo);
  const paths = new Set(channels.map((channel) => channel.path).filter((path) => path !== "none"));
  const listsFailed = channels.length > 0 && channels.every((channel) => channel.path === "none");

  const api: ApiOptions | null = apiKey ? { key: apiKey, fetch: request.fetch, timeoutMs: request.timeoutMs } : null;
  let series: Series[] = [];
  let seriesFailed = false;
  let seriesSource: Catalog["source"]["series"] = "none";
  if (api) {
    try {
      series = await seriesFromApi(channelIds, seriesPlaylistIds, api, maxSeries, new Set(shorts.map((video) => video.id)));
      seriesSource = "data api";
    } catch (error) {
      console.warn(`${error instanceof Error ? error.message : "YouTube Data API failed"}. Using the playlist feeds for series.`);
    }
  }
  if (seriesSource === "none" && seriesPlaylistIds.length > 0) {
    const fromFeeds = await seriesFromFeeds(seriesPlaylistIds, request);
    series = newestFirst(fromFeeds.series).slice(0, maxSeries);
    seriesFailed = fromFeeds.failed;
    if (!seriesFailed) seriesSource = "playlist feeds";
  }

  let durations = new Map<string, number>();
  if (api) {
    const ids = [...longForm, ...shorts, ...series.flatMap((s) => s.episodes)].map((video) => video.id);
    try {
      durations = await fetchDurations(ids, api);
    } catch (error) {
      console.warn(`${error instanceof Error ? error.message : "YouTube Data API failed"}. Hiding durations.`);
    }
  }

  const finish = (video: Video): Video =>
    applyOverride({ ...video, durationSeconds: durations.get(video.id) ?? null }, overrides);

  return {
    longForm: longForm.map(finish),
    shorts: shorts.map(finish),
    series: series.map((s) => ({ ...s, episodes: s.episodes.map(finish) })),
    failed: { longForm: listsFailed, shorts: listsFailed, series: seriesFailed },
    source: {
      lists:
        paths.size === 0
          ? "none"
          : paths.size === 2
            ? "playlist and channel feeds"
            : paths.has("playlist")
              ? "playlist feeds"
              : "channel feed",
      series: seriesSource,
      durations: durations.size > 0,
    },
  };
}

/** Every video the catalog knows, by id. */
export function catalogVideos(catalog: Catalog): Map<string, Video> {
  const all = new Map<string, Video>();
  for (const video of [...catalog.longForm, ...catalog.series.flatMap((s) => s.episodes), ...catalog.shorts]) {
    if (!all.has(video.id)) all.set(video.id, video);
  }
  return all;
}

/** The first series that holds the video, or null. */
export function seriesOf(catalog: Catalog, videoId: string): Series | null {
  return catalog.series.find((series) => series.episodes.some((video) => video.id === videoId)) ?? null;
}

/**
 * Up to `limit` other teachings for a watch page: the rest of its series,
 * in order from the next episode on, then the latest long-form teachings.
 */
export function moreTeachings(catalog: Catalog, videoId: string, limit = 6): Video[] {
  const series = seriesOf(catalog, videoId);
  const fromSeries = series
    ? (() => {
        const at = series.episodes.findIndex((video) => video.id === videoId);
        return [...series.episodes.slice(at + 1), ...series.episodes.slice(0, at)];
      })()
    : [];
  return dedupe([...fromSeries, ...catalog.longForm]).filter((video) => video.id !== videoId).slice(0, limit);
}

/**
 * One or two short lines from a description, for a hero or a card: the
 * first paragraph's sentences while they fit in `max` characters, or the
 * first sentence cut at a word. Null when there is no description.
 */
export function summarise(description: string | null, max = 160): string | null {
  const first = description?.split(/\n\s*\n/)[0]?.replace(/\s+/g, " ").trim();
  if (!first) return null;
  const sentences = first.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g) ?? [first];
  let text = "";
  for (const sentence of sentences) {
    const next = `${text} ${sentence.trim()}`.trim();
    if (next.length > max) break;
    text = next;
  }
  if (text) return text;
  const cut = first.slice(0, max - 3);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 1)).trimEnd()}...`;
}
