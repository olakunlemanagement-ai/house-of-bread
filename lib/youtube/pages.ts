// What a watch page or a series page shows, decided from what YouTube
// answered. Framework free, so every outcome can be tested with fakes; the
// cached, Next-facing wrappers are in ./teachings.ts.
//
// Three outcomes, so an outage never looks like a missing page:
// - "ok": render the teaching or series.
// - "not-found": YouTube answered and the id is not ours. A real 404.
// - "unavailable": YouTube did not answer well enough to tell. A calm page
//   with a way back to Teachings, retried within a minute. Never a 500.

import { catalogVideos, moreTeachings, seriesOf, type Catalog, type Series, type Video } from "./catalog";
import { isPlaylistId, isVideoId } from "./feed";
import type { VideoLookup } from "./oembed";

export type WatchTeaching = {
  video: Video;
  series: Series | null;
  more: Video[];
  /** True when the catalog's lists failed, so the series and "More teachings" are missing, not empty. */
  partial: boolean;
};

export type WatchPage = { kind: "ok"; data: WatchTeaching } | { kind: "not-found" } | { kind: "unavailable" };

export type SeriesPage = { kind: "ok"; series: Series } | { kind: "not-found" } | { kind: "unavailable" };

export type WatchSources = {
  /** The Teachings catalog, or null when loading it failed outright. */
  catalog: Catalog | null;
  /** oEmbed's answer for one video. */
  lookup: (id: string) => Promise<VideoLookup>;
  /** True for an id the site names itself (featured, start here, content/videos), which always has a page. */
  configured: (id: string) => boolean;
  /** A video known only by id, given the best title available (null: the placeholder). */
  outside: (id: string, title: string | null) => Video;
  /** The teaching channels' handle URLs, as oEmbed reports them. */
  channelUrls: ReadonlySet<string>;
};

/**
 * One watch page. A video in the catalog renders with its series and "More
 * teachings". Any other id asks oEmbed: one on a teaching channel renders
 * (an older upload past the feeds' 15, or the catalog was down), one on
 * another channel or none at all is a 404, and no answer is "unavailable".
 * A configured id renders even without an answer, with the placeholder
 * title, as it always has.
 */
export async function decideWatchPage(id: string, sources: WatchSources): Promise<WatchPage> {
  if (!isVideoId(id)) return { kind: "not-found" };
  const { catalog } = sources;
  const ok = (video: Video): WatchPage => ({
    kind: "ok",
    data: {
      video,
      series: catalog ? seriesOf(catalog, id) : null,
      more: catalog ? moreTeachings(catalog, id) : [],
      partial: !catalog || catalog.failed.longForm,
    },
  });

  const listed = catalog ? catalogVideos(catalog).get(id) : undefined;
  if (listed) return ok(listed);

  const lookup = await sources.lookup(id);
  if (sources.configured(id)) {
    return ok(sources.outside(id, lookup.status === "found" ? lookup.info.title : null));
  }
  if (lookup.status === "unreachable") return { kind: "unavailable" };
  if (lookup.status === "missing") return { kind: "not-found" };
  const { authorUrl, title } = lookup.info;
  // A video from another channel never gets a page here, whatever the link says.
  return authorUrl && sources.channelUrls.has(authorUrl) ? ok(sources.outside(id, title)) : { kind: "not-found" };
}

/**
 * One series page. A 404 only when the series list arrived and the
 * playlist is not in it, and it is not one of the configured playlists. If
 * the catalog could not load, its series failed, or a configured playlist's
 * own feed failed, the page is "unavailable".
 */
export function decideSeriesPage(id: string, catalog: Catalog | null, configuredIds: readonly string[]): SeriesPage {
  if (!isPlaylistId(id)) return { kind: "not-found" };
  if (!catalog || catalog.failed.series) return { kind: "unavailable" };
  const series = catalog.series.find((item) => item.id === id);
  if (series) return { kind: "ok", series };
  return configuredIds.includes(id) ? { kind: "unavailable" } : { kind: "not-found" };
}
