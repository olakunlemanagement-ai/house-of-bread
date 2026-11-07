import { describe, expect, it, vi } from "vitest";
import type { Catalog, Series, Video } from "./catalog";
import { vid } from "./fixtures";
import type { VideoLookup } from "./oembed";
import { decideSeriesPage, decideWatchPage, type WatchSources } from "./pages";

const OURS = "https://www.youtube.com/@HOBglobal";
const PLAYLIST = "PLUHSYJnvnito";

function video(id: string, title = `Teaching ${id}`): Video {
  return {
    id,
    title,
    publishedAt: "2026-10-16T12:00:21+00:00",
    url: `https://www.youtube.com/watch?v=${id}`,
    thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    description: null,
    short: false,
    durationSeconds: null,
  };
}

function series(id: string, episodes: Video[]): Series {
  return { id, title: "A series", description: null, publishedAt: null, episodes, countIsMinimum: false };
}

function catalog(overrides: Partial<Catalog> = {}): Catalog {
  return {
    longForm: [video(vid(1)), video(vid(2)), video(vid(3))],
    shorts: [],
    series: [series(PLAYLIST, [video(vid(1))])],
    failed: { longForm: false, shorts: false, series: false },
    source: { lists: "playlist feeds", series: "playlist feeds", durations: false },
    ...overrides,
  };
}

const failed: Catalog = catalog({
  longForm: [],
  series: [],
  failed: { longForm: true, shorts: true, series: true },
  source: { lists: "none", series: "none", durations: false },
});

function sources(lookup: VideoLookup, extra: Partial<WatchSources> = {}): WatchSources {
  return {
    catalog: catalog(),
    lookup: vi.fn(async () => lookup),
    configured: () => false,
    outside: (id, title) => video(id, title ?? "[Title]"),
    channelUrls: new Set([OURS]),
    ...extra,
  };
}

const found = (authorUrl: string | null, title = "From oEmbed"): VideoLookup => ({ status: "found", info: { title, authorUrl } });
const unreachable: VideoLookup = { status: "unreachable" };
const missing: VideoLookup = { status: "missing" };

describe("decideWatchPage", () => {
  it("renders a catalog video with its series and more teachings, without asking oEmbed", async () => {
    const s = sources(unreachable);
    const page = await decideWatchPage(vid(1), s);
    expect(page.kind).toBe("ok");
    if (page.kind !== "ok") return;
    expect(page.data.video.id).toBe(vid(1));
    expect(page.data.series?.id).toBe(PLAYLIST);
    expect(page.data.more.map((v) => v.id)).toEqual([vid(2), vid(3)]);
    expect(page.data.partial).toBe(false);
    expect(s.lookup).not.toHaveBeenCalled();
  });

  it("is unavailable, not an error, when the catalog failed and oEmbed does not answer", async () => {
    await expect(decideWatchPage(vid(9), sources(unreachable, { catalog: null }))).resolves.toEqual({ kind: "unavailable" });
    await expect(decideWatchPage(vid(9), sources(unreachable, { catalog: failed }))).resolves.toEqual({ kind: "unavailable" });
  });

  it("is unavailable when the video is not in the feeds and oEmbed does not answer", async () => {
    await expect(decideWatchPage(vid(9), sources(unreachable))).resolves.toEqual({ kind: "unavailable" });
  });

  it("still renders a teaching from oEmbed while the catalog is down, without series or more", async () => {
    const page = await decideWatchPage(vid(9), sources(found(OURS), { catalog: null }));
    expect(page).toEqual({ kind: "ok", data: { video: video(vid(9), "From oEmbed"), series: null, more: [], partial: true } });
    const fromFailed = await decideWatchPage(vid(9), sources(found(OURS), { catalog: failed }));
    expect(fromFailed.kind === "ok" && fromFailed.data.partial).toBe(true);
  });

  it("is a 404 for a video oEmbed places on another channel, or that YouTube says does not exist", async () => {
    await expect(decideWatchPage(vid(9), sources(found("https://www.youtube.com/@someone")))).resolves.toEqual({ kind: "not-found" });
    await expect(decideWatchPage(vid(9), sources(found(null)))).resolves.toEqual({ kind: "not-found" });
    await expect(decideWatchPage(vid(9), sources(missing, { catalog: null }))).resolves.toEqual({ kind: "not-found" });
  });

  it("renders a configured video even when nothing answers, with the placeholder title", async () => {
    const page = await decideWatchPage(vid(9), sources(unreachable, { catalog: null, configured: () => true }));
    expect(page.kind === "ok" && page.data.video.title).toBe("[Title]");
  });

  it("is a 404 for a malformed id, without asking anyone", async () => {
    const s = sources(unreachable, { catalog: null });
    await expect(decideWatchPage("not-an-id", s)).resolves.toEqual({ kind: "not-found" });
    expect(s.lookup).not.toHaveBeenCalled();
  });
});

describe("decideSeriesPage", () => {
  it("renders a series in the catalog", () => {
    expect(decideSeriesPage(PLAYLIST, catalog(), [])).toEqual({ kind: "ok", series: catalog().series[0] });
  });

  it("is unavailable, not a 404, when the catalog or its series could not load", () => {
    expect(decideSeriesPage(PLAYLIST, null, [])).toEqual({ kind: "unavailable" });
    expect(decideSeriesPage("PLzzzzzzzzzz", failed, [])).toEqual({ kind: "unavailable" });
  });

  it("is unavailable when a configured playlist is missing from a working list", () => {
    expect(decideSeriesPage(PLAYLIST, catalog({ series: [] }), [PLAYLIST])).toEqual({ kind: "unavailable" });
  });

  it("is a 404 only for a playlist that is not ours once the list has arrived", () => {
    expect(decideSeriesPage("PLzzzzzzzzzz", catalog(), [PLAYLIST])).toEqual({ kind: "not-found" });
    expect(decideSeriesPage("not a playlist", null, [])).toEqual({ kind: "not-found" });
  });
});
