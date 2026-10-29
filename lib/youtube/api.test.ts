import { describe, expect, it } from "vitest";
import { fetchDurations, fetchPlaylistItems, parseApiKey, YouTubeApiError } from "./api";
import { API_KEY, apiFor, fakeFetch, json, status, vid } from "./fixtures";

describe("parseApiKey", () => {
  it("accepts a key and trims it", () => {
    expect(parseApiKey(`  ${API_KEY}\n`)).toBe(API_KEY);
  });
  it.each([[undefined], [""], ["short"], ["has spaces in the middle of it ok"], [42]])("rejects %s", (value) => {
    expect(parseApiKey(value)).toBeNull();
  });
});

describe("fetchPlaylistItems", () => {
  it("follows page tokens and keeps playlist order, without duplicates", async () => {
    const page = (ids: string[], next?: string) => ({
      items: ids.map((id) => ({ snippet: { title: `T ${id}` }, contentDetails: { videoId: id } })),
      ...(next ? { nextPageToken: next } : {}),
    });
    const { fetch, calls } = fakeFetch([
      { match: apiFor("playlistItems", (u) => !u.searchParams.has("pageToken")), respond: json(page([vid(1), vid(2)], "NEXT")) },
      { match: apiFor("playlistItems", (u) => u.searchParams.get("pageToken") === "NEXT"), respond: json(page([vid(2), vid(3)])) },
    ]);
    const items = await fetchPlaylistItems("PLseriesAAAAAAA", { key: API_KEY, fetch });
    expect(items.map((item) => item.id)).toEqual([vid(1), vid(2), vid(3)]);
    expect(calls).toHaveLength(2);
  });

  it("throws a YouTubeApiError without the key on an unexpected shape", async () => {
    const { fetch } = fakeFetch([{ match: apiFor("playlistItems"), respond: json({ items: "nope" }) }]);
    const error = await fetchPlaylistItems("PLseriesAAAAAAA", { key: API_KEY, fetch }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(YouTubeApiError);
    expect(String(error)).not.toContain(API_KEY);
  });
});

describe("fetchDurations", () => {
  it("asks in batches of 50 and skips live streams and bad ids", async () => {
    const ids = Array.from({ length: 60 }, (_, i) => vid(i + 1));
    const { fetch, calls } = fakeFetch([
      {
        match: apiFor("videos"),
        respond: json({
          items: [
            { id: vid(1), contentDetails: { duration: "PT10M" } },
            { id: vid(2), contentDetails: { duration: "P0D" } },
            { id: "not-an-id", contentDetails: { duration: "PT1M" } },
          ],
        }),
      },
    ]);
    const durations = await fetchDurations([...ids, "bad"], { key: API_KEY, fetch });
    expect(calls).toHaveLength(2);
    expect([...durations]).toEqual([[vid(1), 600]]);
  });

  it("reports a failed status without the URL or key", async () => {
    const { fetch } = fakeFetch([{ match: apiFor("videos"), respond: status(403) }]);
    const error = await fetchDurations([vid(1)], { key: API_KEY, fetch }).catch((e: unknown) => e);
    expect(String(error)).toBe("YouTubeApiError: YouTube Data API videos returned status 403");
  });
});
