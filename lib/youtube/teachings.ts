import "server-only";
import { cacheLife } from "next/cache";
import { getAll } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { parseApiKey } from "./api";
import { catalogVideos, loadCatalog, moreTeachings, seriesOf, type Catalog, type Series, type Video, type VideoOverride } from "./catalog";
import { VIDEO_TITLE_PLACEHOLDER } from "./featured";
import { isPlaylistId, isVideoId, thumbnailUrl, watchUrl } from "./feed";
import { getVideoInfo } from "./oembed";

/**
 * Refreshed hourly, like the Home feed (./videos.ts). The long expire keeps
 * the last good page in place while YouTube is down: see getTeachingsCatalog.
 */
const catalogLife = { stale: 60 * 5, revalidate: 60 * 60, expire: 60 * 60 * 24 * 30 };

/** Manual titles and descriptions from content/videos, by video id. */
function videoOverrides(): Map<string, VideoOverride> {
  return new Map(
    getAll("video").map(({ slug, title, description }) => [slug, { title, description }] as const),
  );
}

/** True during `next build` and in development, where no earlier page exists to keep. */
function noPreviousPage(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV !== "production";
}

/**
 * Every teaching, Short and series, cached and refreshed hourly. Uses
 * YOUTUBE_API_KEY for series and durations when it is set.
 *
 * When a section's requests all fail at runtime this throws on purpose, as
 * getLatestVideos does: the refresh fails, and the last page that rendered
 * stays in place and is retried, instead of a fallback state being cached
 * as a success. At build time it returns what it has, with the sections'
 * fallback states, and retries after a minute. See docs/MEDIA-FEED.md.
 */
export async function getTeachingsCatalog(): Promise<Catalog> {
  "use cache";
  cacheLife(catalogLife);

  const catalog = await loadCatalog({
    channelIds: siteConfig.teachingChannels.map((channel) => channel.id),
    seriesPlaylistIds: siteConfig.seriesPlaylistIds,
    apiKey: parseApiKey(process.env.YOUTUBE_API_KEY),
    overrides: videoOverrides(),
  });
  const { source, failed } = catalog;
  console.info(
    `Teachings: videos from ${source.lists}, series from ${source.series}, durations ${source.durations ? "from the Data API" : "hidden"}.`,
  );

  if (failed.longForm || failed.series) {
    if (noPreviousPage()) {
      console.warn("Teachings: YouTube unavailable. Showing the fallback states, retrying in a minute.");
      cacheLife({ revalidate: 60 });
      return catalog;
    }
    throw new Error("Teachings: YouTube unavailable. Keeping the last good page.");
  }
  return catalog;
}

/** A video the catalog does not hold: the configured ids and overrides, with the best title known. */
async function outsideVideo(id: string): Promise<Video | null> {
  const override = videoOverrides().get(id);
  const configured =
    id === siteConfig.featuredTeachingId ||
    id === siteConfig.startHereVideoId ||
    id === siteConfig.links.featuredVideoId ||
    override !== undefined;
  const info = await getVideoInfo(id);
  const channels = new Set<string>(siteConfig.teachingChannels.map((channel) => channel.url));
  // A video from another channel never gets a page here, whatever the link says.
  if (!configured && !(info?.authorUrl && channels.has(info.authorUrl))) return null;
  return {
    id,
    title: override?.title ?? info?.title ?? VIDEO_TITLE_PLACEHOLDER,
    publishedAt: null,
    url: watchUrl(id),
    thumbnail: thumbnailUrl(id),
    description: override?.description ?? null,
    short: false,
    durationSeconds: null,
  };
}

/**
 * The featured teaching: the pinned one (siteConfig.featuredTeachingId),
 * from the catalog or oEmbed, or with none pinned the newest long-form
 * teaching, so the hero follows each new upload.
 */
export async function getFeaturedTeaching(catalog: Catalog): Promise<Video | null> {
  const id = siteConfig.featuredTeachingId;
  if (id === null) return catalog.longForm[0] ?? null;
  if (!isVideoId(id)) return null;
  return catalogVideos(catalog).get(id) ?? (await outsideVideo(id));
}

export type WatchTeaching = { video: Video; series: Series | null; more: Video[] };

/**
 * A watch page's data, or null for a video that is not ours: one in the
 * feeds or series, a configured one, or one oEmbed places on a teaching
 * channel (an older upload that has left the 15 item feeds).
 */
export async function getWatchTeaching(id: string): Promise<WatchTeaching | null> {
  if (!isVideoId(id)) return null;
  const catalog = await getTeachingsCatalog();
  const video = catalogVideos(catalog).get(id) ?? (await outsideVideo(id));
  if (!video) return null;
  return { video, series: seriesOf(catalog, id), more: moreTeachings(catalog, id) };
}

/** A series page's data, or null when the playlist is not one of ours. */
export async function getSeries(id: string): Promise<Series | null> {
  if (!isPlaylistId(id)) return null;
  const catalog = await getTeachingsCatalog();
  return catalog.series.find((series) => series.id === id) ?? null;
}

/** Watch pages prebuilt from the long-form list. The rest render on their first visit, then stay cached. */
const PREBUILT_TEACHINGS = 48;

/** The ids prebuilt at build time: the latest long-form teachings, every episode and the pinned featured one. */
export async function watchParams(): Promise<string[]> {
  const catalog = await getTeachingsCatalog();
  const ids = new Set<string>(siteConfig.featuredTeachingId ? [siteConfig.featuredTeachingId] : []);
  for (const video of [...catalog.longForm.slice(0, PREBUILT_TEACHINGS), ...catalog.series.flatMap((series) => series.episodes)]) {
    ids.add(video.id);
  }
  return [...ids].filter(isVideoId);
}

export async function seriesParams(): Promise<string[]> {
  const catalog = await getTeachingsCatalog();
  // The configured ids stand in when the feeds failed at build, so the route is never without a param.
  const ids = catalog.series.length > 0 ? catalog.series.map((series) => series.id) : siteConfig.seriesPlaylistIds;
  return ids.filter(isPlaylistId);
}
