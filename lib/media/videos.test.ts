import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const cacheLife = vi.fn();
vi.mock("next/cache", () => ({ cacheLife: (profile: unknown) => cacheLife(profile) }));

const { FeedUnavailableError, getLatestVideos, loadLatestVideos } = await import("./videos");

const CHANNEL = "UCXuqSBlHAE6Xw-yeJA0Tunw";

const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns="http://www.w3.org/2005/Atom">
 <entry>
  <yt:videoId>aV81SqB6HQg</yt:videoId>
  <title>First teaching</title>
  <published>2026-10-16T12:00:21+00:00</published>
 </entry>
</feed>`;
const emptyFeedXml = `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>Channel</title></feed>`;

const ok = (body: string) => new Response(body, { status: 200 });
const status = (code: number) => new Response("not found", { status: code });

/** A fetch that answers from the list in order, repeating the last answer. */
function fetchSequence(...answers: Array<Response | Error>) {
  let call = 0;
  return vi.fn(async () => {
    const answer = answers[Math.min(call++, answers.length - 1)];
    if (answer instanceof Error) throw answer;
    return answer.clone();
  });
}

const fast = { retryDelayMs: 0 };

describe("loadLatestVideos", () => {
  it("returns the videos from a good feed", async () => {
    const videos = await loadLatestVideos(CHANNEL, { ...fast, fetch: fetchSequence(ok(feedXml)) });
    expect(videos.map((video) => video.id)).toEqual(["aV81SqB6HQg"]);
  });

  it("retries once, so a single 404 does not fail", async () => {
    const fetch = fetchSequence(status(404), ok(feedXml));
    const videos = await loadLatestVideos(CHANNEL, { ...fast, fetch });
    expect(videos).toHaveLength(1);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("throws after every attempt fails", async () => {
    const fetch = fetchSequence(status(404));
    await expect(loadLatestVideos(CHANNEL, { ...fast, fetch })).rejects.toThrow("YouTube feed returned status 404");
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("treats a network error, a timeout and an HTML page as failures", async () => {
    for (const answer of [
      new TypeError(`fetch failed for https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL}`),
      new DOMException("The operation timed out.", "TimeoutError"),
      ok("<!DOCTYPE html><title>Error 404 (Not Found)!!1</title>"),
    ]) {
      await expect(loadLatestVideos(CHANNEL, { ...fast, fetch: fetchSequence(answer) })).rejects.toBeInstanceOf(
        FeedUnavailableError,
      );
    }
  });

  it("returns an empty list for a real feed with no videos", async () => {
    expect(await loadLatestVideos(CHANNEL, { ...fast, fetch: fetchSequence(ok(emptyFeedXml)) })).toEqual([]);
  });

  it("never puts the channel id in an error message", async () => {
    for (const answer of [
      status(500),
      new TypeError(`fetch failed for https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL}`),
      ok("not a feed"),
    ]) {
      const error = await loadLatestVideos(CHANNEL, { ...fast, fetch: fetchSequence(answer) }).catch((e: unknown) => e);
      expect(error).toBeInstanceOf(FeedUnavailableError);
      expect(String((error as Error).message)).not.toContain(CHANNEL);
      expect((error as Error).cause).toBeUndefined();
    }
  });
});

describe("getLatestVideos", () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    cacheLife.mockClear();
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("YOUTUBE_CHANNEL_ID", CHANNEL);
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PHASE", "");
    // The retry waits 750ms. Fake timers skip it.
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    warn.mockRestore();
  });

  /** Runs the cached function past the retry delay. Rejections reach the caller. */
  async function run() {
    const settled = getLatestVideos().then(
      (value) => ({ value }),
      (error: unknown) => ({ error }),
    );
    await vi.runAllTimersAsync();
    const outcome = await settled;
    if ("error" in outcome) throw outcome.error;
    return outcome.value;
  }

  function loggedText() {
    return warn.mock.calls.flat().map(String).join("\n");
  }

  it("returns the videos when the feed works", async () => {
    vi.stubGlobal("fetch", fetchSequence(ok(feedXml)));
    const feed = await run();
    expect(feed.status).toBe("ok");
    expect(warn).not.toHaveBeenCalled();
  });

  it("throws at runtime, so the last good page is kept, and logs without the channel id", async () => {
    vi.stubGlobal("fetch", fetchSequence(status(404)));
    const error = await run().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(FeedUnavailableError);
    expect((error as Error).message).not.toContain(CHANNEL);
    expect(loggedText()).toContain("Keeping the last good page");
    expect(loggedText()).not.toContain(CHANNEL);
  });

  it("shows the empty state during the build, where no earlier page exists, and retries sooner", async () => {
    vi.stubEnv("NEXT_PHASE", "phase-production-build");
    vi.stubGlobal("fetch", fetchSequence(new TypeError("fetch failed")));
    expect(await run()).toEqual({ status: "unavailable" });
    expect(cacheLife).toHaveBeenLastCalledWith({ revalidate: 60 });
    expect(loggedText()).toContain("Showing the empty state");
    expect(loggedText()).not.toContain(CHANNEL);
  });

  it("shows the empty state in development instead of the error overlay", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubGlobal("fetch", fetchSequence(status(503)));
    expect(await run()).toEqual({ status: "unavailable" });
  });

  it("shows the empty state for a channel with no videos", async () => {
    vi.stubGlobal("fetch", fetchSequence(ok(emptyFeedXml)));
    expect(await run()).toEqual({ status: "unavailable" });
  });

  it("is unavailable without a usable channel id, and never fetches", async () => {
    const fetch = fetchSequence(ok(feedXml));
    vi.stubGlobal("fetch", fetch);
    vi.stubEnv("YOUTUBE_CHANNEL_ID", "@houseofbread");
    expect(await run()).toEqual({ status: "unavailable" });
    expect(fetch).not.toHaveBeenCalled();
  });
});
