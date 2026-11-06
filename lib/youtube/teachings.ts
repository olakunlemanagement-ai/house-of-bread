import "server-only";
import { cacheLife } from "next/cache";
import { getAll } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { parseApiKey } from "./api";
import { catalogVideos, loadCatalog, type Catalog, type Video, type VideoOverride } from "./catalog";
import { VIDEO_TITLE_PLACEHOLDER } from "./featured";
import { isPlaylistId, isVideoId, thumbnailUrl, watchUrl } from "./feed";
import { getVideoLookup } from "./oembed";
import { decideSeriesPage, decideWatchPage, type SeriesPage, type WatchPage } from "./pages";

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

/** True for an id the site names itself, which always has a watch page. */
function isConfiguredVideo(id: string): boolean {
  return (
    id === siteConfig.featuredTeachingId ||
    id === siteConfig.startHereVideoId ||
    id === siteConfig.links.featuredVideoId ||
    videoOverrides().has(id)
  );
}

/** A video known only by id: content/videos overrides first, then the title given, then the placeholder. */
function outsideVideo(id: string, title: string | null): Video {
  const override = videoOverrides().get(id);
  return {
    id,
    title: override?.title ?? title ?? VIDEO_TITLE_PLACEHOLDER,
    publishedAt: null,
    url: watchUrl(id),
    thumbnail: thumbnailUrl(id),
    description: override?.description ?? null,
    short: false,
    durationSeconds: null,
  };
}

/** Read by a page in a fallback state, so that page renders again within a minute. */
async function retryWithinAMinute(): Promise<boolean> {
  "use cache";
  cacheLife({ revalidate: 60 });
  return true;
}

/**
 * The catalog, or null when it could not load at all (getTeachingsCatalog
 * throws at runtime when YouTube is down and no earlier result is cached).
 * A watch or series page then shows its unavailable state, retried within
 * a minute, instead of failing with a 500.
 */
async function catalogOrNull(): Promise<Catalog | null> {
  try {
    return await getTeachingsCatalog();
  } catch {
    await retryWithinAMinute();
    return null;
  }
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
  const listed = catalogVideos(catalog).get(id);
  if (listed) return listed;
  const lookup = await getVideoLookup(id);
  return outsideVideo(id, lookup.status === "found" ? lookup.info.title : null);
}

/**
 * A watch page: the teaching, a 404 for a video that is not ours, or the
 * unavailable state when YouTube cannot say (lib/youtube/pages.ts).
 */
export async function getWatchPage(id: string): Promise<WatchPage> {
  if (!isVideoId(id)) return { kind: "not-found" };
  const page = await decideWatchPage(id, {
    catalog: await catalogOrNull(),
    lookup: getVideoLookup,
    configured: isConfiguredVideo,
    outside: outsideVideo,
    channelUrls: new Set<string>(siteConfig.teachingChannels.map((channel) => channel.url)),
  });
  if (page.kind === "unavailable") console.warn("Teachings: YouTube unavailable. Showing a watch page's unavailable state.");
  return page;
}

/** A series page: the series, a 404 for a playlist that is not ours, or the unavailable state. */
export async function getSeriesPage(id: string): Promise<SeriesPage> {
  if (!isPlaylistId(id)) return { kind: "not-found" };
  const page = decideSeriesPage(id, await catalogOrNull(), siteConfig.seriesPlaylistIds);
  if (page.kind === "unavailable") {
    console.warn("Teachings: YouTube unavailable. Showing a series page's unavailable state.");
    // A build time catalog with failed series already retries in a minute; this covers every other case.
    await retryWithinAMinute();
  }
  return page;
}

/** Watch pages prebuilt from the long-form list. The rest render on their first visit, then stay cached. */
const PREBUILT_TEACHINGS = 48;

/**
 * The ids prebuilt at build time: the latest long-form teachings, every
 * episode and the configured ones. The configured ids always have a page,
 * so the list is never empty when the feeds fail at build (Next refuses
 * an empty list under Cache Components, and the deploy would fail).
 */
export async function watchParams(): Promise<string[]> {
  const catalog = await getTeachingsCatalog();
  const configured = [siteConfig.featuredTeachingId, siteConfig.startHereVideoId, siteConfig.links.featuredVideoId];
  const ids = new Set<string>(configured.filter((id): id is string => id !== null));
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
