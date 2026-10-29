import { describe, expect, it, vi } from "vitest";
import { loadCatalog, MAX_SERIES, moreTeachings, seriesOf, summarise, type CatalogOptions } from "./catalog";
import { uploadsPlaylistId } from "./feed";
import {
  API_KEY,
  apiFor,
  CHANNEL_A,
  CHANNEL_B,
  entries,
  fakeFetch,
  feedFor,
  feedXml,
  json,
  status,
  vid,
  xml,
} from "./fixtures";

const LONG_A = uploadsPlaylistId(CHANNEL_A, "long");
const SHORT_A = uploadsPlaylistId(CHANNEL_A, "short");
const LONG_B = uploadsPlaylistId(CHANNEL_B, "long");
const SHORT_B = uploadsPlaylistId(CHANNEL_B, "short");
const SERIES = "PLseriesAAAAAAA";

function options(fetcher: typeof fetch, extra: Partial<CatalogOptions> = {}): CatalogOptions {
  return {
    channelIds: [CHANNEL_A],
    seriesPlaylistIds: [],
    apiKey: null,
    fetch: fetcher,
    attempts: 1,
    retryDelayMs: 0,
    ...extra,
  };
}

describe("loadCatalog: long-form and Shorts from the playlist feeds", () => {
  it.each([0, 1, 4, 15])("keeps all %i long-form teachings, newest first", async (count) => {
    const { fetch } = fakeFetch([
      { match: feedFor(LONG_A), respond: xml(feedXml(entries(count).reverse())) },
      { match: feedFor(SHORT_A), respond: xml(feedXml([])) },
    ]);
    const catalog = await loadCatalog(options(fetch));
    expect(catalog.longForm.map((v) => v.id)).toEqual(entries(count).map((e) => e.id));
    expect(catalog.shorts).toEqual([]);
    expect(catalog.failed).toEqual({ longForm: false, shorts: false, series: false });
    expect(catalog.source.lists).toBe(count >= 0 ? "playlist feeds" : "none");
  });

  it("reads descriptions, and marks every UUSH entry as a Short", async () => {
    const { fetch } = fakeFetch([
      { match: feedFor(LONG_A), respond: xml(feedXml(entries(1))) },
      { match: feedFor(SHORT_A), respond: xml(feedXml(entries(2, { prefix: "s" }))) },
    ]);
    const catalog = await loadCatalog(options(fetch));
    expect(catalog.longForm[0]).toMatchObject({ description: "About teaching 1.", short: false, durationSeconds: null });
    expect(catalog.shorts.map((v) => v.short)).toEqual([true, true]);
  });

  it("merges two channels newest first and drops a video both list", async () => {
    const a = entries(3, { from: "2026-10-25T20:00:00Z" });
    const b = [...entries(2, { start: 10, from: "2026-10-25T19:30:00Z" }), a[0]];
    const { fetch } = fakeFetch([
      { match: feedFor(LONG_A), respond: xml(feedXml(a)) },
      { match: feedFor(SHORT_A), respond: xml(feedXml([])) },
      { match: feedFor(LONG_B), respond: xml(feedXml(b)) },
      { match: feedFor(SHORT_B), respond: xml(feedXml([])) },
    ]);
    const catalog = await loadCatalog(options(fetch, { channelIds: [CHANNEL_A, CHANNEL_B] }));
    expect(catalog.longForm.map((v) => v.id)).toEqual([vid(1), vid(10), vid(2), vid(11), vid(3)]);
  });
});

describe("loadCatalog: fallback to the channel feed", () => {
  it("splits the channel feed by its /shorts/ links when the playlist feeds fail", async () => {
    const mixed = [
      ...entries(3),
      ...entries(4, { prefix: "s", short: true, from: "2026-10-25T20:30:00Z" }),
    ];
    const { fetch } = fakeFetch([
      { match: feedFor(LONG_A), respond: status(404) },
      { match: feedFor(SHORT_A), respond: status(500) },
      { match: feedFor(CHANNEL_A), respond: xml(feedXml(mixed)) },
    ]);
    const catalog = await loadCatalog(options(fetch));
    expect(catalog.longForm.map((v) => v.id)).toEqual(entries(3).map((e) => e.id));
    expect(catalog.shorts).toHaveLength(4);
    expect(catalog.shorts.every((v) => v.short)).toBe(true);
    expect(catalog.source.lists).toBe("channel feed");
    expect(catalog.failed.longForm).toBe(false);
  });

  it("keeps a playlist feed that worked and takes only the other half from the channel feed", async () => {
    const { fetch } = fakeFetch([
      { match: feedFor(LONG_A), respond: xml(feedXml(entries(2))) },
      { match: feedFor(SHORT_A), respond: status(404) },
      { match: feedFor(CHANNEL_A), respond: xml(feedXml([...entries(5), ...entries(1, { prefix: "s", short: true })])) },
    ]);
    const catalog = await loadCatalog(options(fetch));
    expect(catalog.longForm).toHaveLength(2);
    expect(catalog.shorts.map((v) => v.id)).toEqual([vid(1, "s")]);
  });
});

describe("loadCatalog: feed down", () => {
  it("returns empty lists and marks the sections failed, without throwing", async () => {
    const { fetch } = fakeFetch([]);
    const catalog = await loadCatalog(options(fetch, { seriesPlaylistIds: [SERIES] }));
    expect(catalog.longForm).toEqual([]);
    expect(catalog.shorts).toEqual([]);
    expect(catalog.series).toEqual([]);
    expect(catalog.failed).toEqual({ longForm: true, shorts: true, series: true });
    expect(catalog.source).toEqual({ lists: "none", series: "none", durations: false });
  });

  it("treats an HTML error page with status 200 as a failure, not an empty channel", async () => {
    const page = () => new Response("<!doctype html><title>Oops</title>", { status: 200 });
    const { fetch } = fakeFetch([{ match: () => true, respond: page }]);
    const catalog = await loadCatalog(options(fetch));
    expect(catalog.failed.longForm).toBe(true);
  });

  it("does not mark a channel with no videos as failed", async () => {
    const { fetch } = fakeFetch([
      { match: feedFor(LONG_A), respond: xml(feedXml([])) },
      { match: feedFor(SHORT_A), respond: xml(feedXml([])) },
    ]);
    const catalog = await loadCatalog(options(fetch));
    expect(catalog.failed.longForm).toBe(false);
  });
});

describe("loadCatalog: series from the playlist feeds (no API key)", () => {
  const feeds = [
    { match: feedFor(LONG_A), respond: xml(feedXml(entries(2))) },
    { match: feedFor(SHORT_A), respond: xml(feedXml([])) },
  ];

  it("reads the playlist's name, creation date and episodes in playlist order", async () => {
    const episodes = entries(6, { start: 20 }).reverse();
    const { fetch } = fakeFetch([
      ...feeds,
      { match: feedFor(SERIES), respond: xml(feedXml(episodes, { title: "Bible Foundations Series", published: "2026-10-22T11:40:25+00:00" })) },
    ]);
    const catalog = await loadCatalog(options(fetch, { seriesPlaylistIds: [SERIES] }));
    expect(catalog.series).toHaveLength(1);
    const [series] = catalog.series;
    expect(series).toMatchObject({
      id: SERIES,
      title: "Bible Foundations Series",
      description: null,
      publishedAt: "2026-10-22T11:40:25.000Z",
      countIsMinimum: false,
    });
    expect(series.episodes.map((v) => v.id)).toEqual(episodes.map((e) => e.id));
    expect(catalog.source.series).toBe("playlist feeds");
  });

  it("marks a count at the feed's cap of 15 as a minimum", async () => {
    const { fetch } = fakeFetch([...feeds, { match: feedFor(SERIES), respond: xml(feedXml(entries(15, { start: 30 }))) }]);
    const catalog = await loadCatalog(options(fetch, { seriesPlaylistIds: [SERIES] }));
    expect(catalog.series[0].countIsMinimum).toBe(true);
  });

  it("orders several series newest first and keeps at most maxSeries", async () => {
    const ids = Array.from({ length: 10 }, (_, i) => `PLseries${String(i).padStart(7, "0")}`);
    const { fetch } = fakeFetch([
      ...feeds,
      ...ids.map((id, i) => ({
        match: feedFor(id),
        respond: xml(feedXml(entries(1, { start: 100 + i }), { title: `Series ${i}`, published: `2026-10-${String(10 + i).padStart(2, "0")}T00:00:00Z` })),
      })),
    ]);
    const catalog = await loadCatalog(options(fetch, { seriesPlaylistIds: ids, maxSeries: 8 }));
    expect(catalog.series.map((s) => s.title)).toEqual(["Series 9", "Series 8", "Series 7", "Series 6", "Series 5", "Series 4", "Series 3", "Series 2"]);
  });

  it("keeps up to MAX_SERIES by default, for the all series page", async () => {
    const ids = Array.from({ length: MAX_SERIES + 2 }, (_, i) => `PLseries${String(i).padStart(7, "0")}`);
    const { fetch } = fakeFetch([
      ...feeds,
      ...ids.map((id, i) => ({ match: feedFor(id), respond: xml(feedXml(entries(1, { start: 100 + i }), { title: `Series ${i}` })) })),
    ]);
    const catalog = await loadCatalog(options(fetch, { seriesPlaylistIds: ids }));
    expect(catalog.series).toHaveLength(MAX_SERIES);
  });

  it("leaves out an empty playlist and one whose feed failed", async () => {
    const { fetch } = fakeFetch([
      ...feeds,
      { match: feedFor(SERIES), respond: xml(feedXml([])) },
      { match: feedFor("PLotherBBBBBBBB"), respond: status(404) },
    ]);
    const catalog = await loadCatalog(options(fetch, { seriesPlaylistIds: [SERIES, "PLotherBBBBBBBB"] }));
    expect(catalog.series).toEqual([]);
    expect(catalog.failed.series).toBe(false);
  });

  it("never calls the Data API without a key, and shows no durations", async () => {
    const { fetch, calls } = fakeFetch([...feeds, { match: feedFor(SERIES), respond: xml(feedXml(entries(2))) }]);
    const catalog = await loadCatalog(options(fetch, { seriesPlaylistIds: [SERIES] }));
    expect(calls.some((call) => call.url.includes("googleapis"))).toBe(false);
    expect(catalog.longForm.every((v) => v.durationSeconds === null)).toBe(true);
    expect(catalog.source.durations).toBe(false);
  });
});

describe("loadCatalog: with the Data API", () => {
  const feeds = [
    { match: feedFor(LONG_A), respond: xml(feedXml(entries(2))) },
    { match: feedFor(SHORT_A), respond: xml(feedXml(entries(1, { prefix: "s" }))) },
  ];
  const playlists = {
    items: [
      {
        id: "PLnewerAAAAAAAA",
        snippet: { publishedAt: "2026-10-20T00:00:00Z", title: "Newer series", description: "What the series covers. And more." },
        contentDetails: { itemCount: 2 },
      },
      { id: "PLolderAAAAAAAA", snippet: { publishedAt: "2026-01-01T00:00:00Z", title: "Older series" }, contentDetails: { itemCount: 1 } },
      { id: "PLemptyAAAAAAAA", snippet: { publishedAt: "2026-10-21T00:00:00Z", title: "Empty" }, contentDetails: { itemCount: 0 } },
    ],
  };
  const items = (ids: string[]) => ({
    items: [
      ...ids.map((id) => ({ snippet: { title: `Episode ${id}`, description: "Notes" }, contentDetails: { videoId: id, videoPublishedAt: "2026-10-01T00:00:00Z" } })),
      { snippet: { title: "Private video", description: "" }, contentDetails: { videoId: vid(999) } },
    ],
  });
  const api = [
    { match: apiFor("playlists", (u) => u.searchParams.get("channelId") === CHANNEL_A), respond: json(playlists) },
    { match: apiFor("playlists", (u) => u.searchParams.has("id")), respond: json({ items: [] }) },
    { match: apiFor("playlistItems", (u) => u.searchParams.get("playlistId") === "PLnewerAAAAAAAA"), respond: json(items([vid(1), vid(2)])) },
    { match: apiFor("playlistItems", (u) => u.searchParams.get("playlistId") === "PLolderAAAAAAAA"), respond: json(items([vid(50)])) },
    {
      match: apiFor("videos"),
      respond: json({
        items: [
          { id: vid(1), contentDetails: { duration: "PT28M14S" } },
          { id: vid(2), contentDetails: { duration: "PT1H2M3S" } },
          { id: vid(1, "s"), contentDetails: { duration: "PT45S" } },
        ],
      }),
    },
  ];

  it("lists the channel's playlists newest first, skips empty ones and private videos, and adds durations", async () => {
    const { fetch } = fakeFetch([...feeds, ...api]);
    const catalog = await loadCatalog(options(fetch, { apiKey: API_KEY }));
    expect(catalog.source).toEqual({ lists: "playlist feeds", series: "data api", durations: true });
    expect(catalog.series.map((s) => s.title)).toEqual(["Newer series", "Older series"]);
    expect(catalog.series[0].description).toBe("What the series covers. And more.");
    expect(catalog.series[0].episodes.map((v) => v.id)).toEqual([vid(1), vid(2)]);
    expect(catalog.series[0].episodes[0].durationSeconds).toBe(1694);
    expect(catalog.longForm.map((v) => v.durationSeconds)).toEqual([1694, 3723]);
    expect(catalog.shorts[0].durationSeconds).toBe(45);
  });

  it("lists every upload from the Data API, past the feeds' cap of 15", async () => {
    const uploads = (ids: string[]) => ({
      items: ids.map((id, i) => ({
        snippet: { title: `Upload ${id}`, description: "Notes" },
        contentDetails: { videoId: id, videoPublishedAt: new Date(Date.parse("2026-10-01T00:00:00Z") - i * 86_400_000).toISOString() },
      })),
    });
    const older = Array.from({ length: 20 }, (_, i) => vid(200 + i));
    const { fetch } = fakeFetch([
      ...feeds,
      ...api,
      { match: apiFor("playlistItems", (u) => u.searchParams.get("playlistId") === LONG_A), respond: json(uploads([vid(1), ...older])) },
      { match: apiFor("playlistItems", (u) => u.searchParams.get("playlistId") === SHORT_A), respond: json(uploads([vid(1, "s")])) },
    ]);
    const catalog = await loadCatalog(options(fetch, { apiKey: API_KEY }));
    // The feed's two, then the API's older twenty; vid(1) is in both and listed once, with the feed's description.
    expect(catalog.longForm).toHaveLength(22);
    expect(catalog.longForm.slice(0, 2).map((v) => v.id)).toEqual([vid(1), vid(2)]);
    expect(catalog.longForm[0].description).toBe("About teaching 1.");
    expect(catalog.longForm.at(-1)?.id).toBe(older.at(-1));
    expect(catalog.shorts.map((v) => v.id)).toEqual([vid(1, "s")]);
    expect(catalog.longForm.every((v) => !v.short)).toBe(true);
  });

  it("sends the key in a header, never in the URL", async () => {
    const { fetch, calls } = fakeFetch([...feeds, ...api]);
    await loadCatalog(options(fetch, { apiKey: API_KEY }));
    const apiCalls = calls.filter((call) => call.url.includes("googleapis"));
    expect(apiCalls.length).toBeGreaterThan(0);
    for (const call of apiCalls) {
      expect(call.url).not.toContain(API_KEY);
      expect(call.headers["x-goog-api-key"]).toBe(API_KEY);
    }
  });

  it("falls back to the playlist feeds when the API fails, and never logs the key", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { fetch } = fakeFetch([
      ...feeds,
      { match: apiFor("playlists"), respond: status(403) },
      { match: apiFor("videos"), respond: status(403) },
      { match: feedFor(SERIES), respond: xml(feedXml(entries(3, { start: 40 }), { title: "From the feed" })) },
    ]);
    const catalog = await loadCatalog(options(fetch, { apiKey: API_KEY, seriesPlaylistIds: [SERIES] }));
    expect(catalog.source).toEqual({ lists: "playlist feeds", series: "playlist feeds", durations: false });
    expect(catalog.series[0].title).toBe("From the feed");
    expect(catalog.longForm.every((v) => v.durationSeconds === null)).toBe(true);
    const logged = warn.mock.calls.flat().join(" ");
    expect(logged).toContain("status 403");
    expect(logged).not.toContain(API_KEY);
    expect(logged).not.toContain("googleapis");
    warn.mockRestore();
  });
});

describe("loadCatalog: overrides", () => {
  it("replaces a video's title and description wherever it appears", async () => {
    const { fetch } = fakeFetch([
      { match: feedFor(LONG_A), respond: xml(feedXml(entries(2))) },
      { match: feedFor(SHORT_A), respond: xml(feedXml([])) },
      { match: feedFor(SERIES), respond: xml(feedXml(entries(1))) },
    ]);
    const overrides = new Map([[vid(1), { title: "A better title" }]]);
    const catalog = await loadCatalog(options(fetch, { overrides, seriesPlaylistIds: [SERIES] }));
    expect(catalog.longForm[0]).toMatchObject({ title: "A better title", description: "About teaching 1." });
    expect(catalog.series[0].episodes[0].title).toBe("A better title");
    expect(catalog.longForm[1].title).toBe("Teaching 2");
  });
});

describe("seriesOf and moreTeachings", () => {
  async function catalogWithSeries() {
    const { fetch } = fakeFetch([
      { match: feedFor(LONG_A), respond: xml(feedXml(entries(8, { start: 1 }))) },
      { match: feedFor(SHORT_A), respond: xml(feedXml([])) },
      { match: feedFor(SERIES), respond: xml(feedXml(entries(4, { start: 20 }), { title: "Series" })) },
    ]);
    return loadCatalog(options(fetch, { seriesPlaylistIds: [SERIES] }));
  }

  it("finds the series a video belongs to", async () => {
    const catalog = await catalogWithSeries();
    expect(seriesOf(catalog, vid(21))?.id).toBe(SERIES);
    expect(seriesOf(catalog, vid(1))).toBeNull();
  });

  it("offers the rest of the series from the next episode on, then the latest", async () => {
    const catalog = await catalogWithSeries();
    expect(moreTeachings(catalog, vid(21)).map((v) => v.id)).toEqual([vid(22), vid(23), vid(20), vid(1), vid(2), vid(3)]);
  });

  it("offers the latest teachings, without the current one, outside a series", async () => {
    const catalog = await catalogWithSeries();
    expect(moreTeachings(catalog, vid(2), 3).map((v) => v.id)).toEqual([vid(1), vid(3), vid(4)]);
  });
});

describe("summarise", () => {
  it("keeps whole sentences of the first paragraph that fit", () => {
    expect(summarise("The New Testament is a library with a shape. It has four parts.\n\nSecond paragraph.")).toBe(
      "The New Testament is a library with a shape. It has four parts.",
    );
  });

  it("stops before a sentence that would run past the limit", () => {
    const long = `First sentence. ${"word ".repeat(60)}end.`;
    expect(summarise(long)).toBe("First sentence.");
  });

  it("cuts one long sentence at a word, with an ellipsis", () => {
    const text = summarise("word ".repeat(80), 40);
    expect(text?.endsWith("...")).toBe(true);
    expect(text!.length).toBeLessThanOrEqual(40);
  });

  it("returns null for nothing", () => {
    expect(summarise(null)).toBeNull();
    expect(summarise("   ")).toBeNull();
  });
});
