import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ cacheLife: vi.fn() }));

const { loadVideoTitle, oEmbedUrl, parseOEmbedTitle, resolveVideoWithTitle } = await import("./oembed");
const { VIDEO_TITLE_PLACEHOLDER } = await import("./featured");

const ID = "wpNuDtvzMzs";

describe("parseOEmbedTitle", () => {
  it("reads the title", () => {
    expect(parseOEmbedTitle({ title: "Christianity is the slave master's tool?", type: "video" })).toBe(
      "Christianity is the slave master's tool?",
    );
  });

  it("rejects anything else", () => {
    expect(parseOEmbedTitle(null)).toBeNull();
    expect(parseOEmbedTitle({ title: "" })).toBeNull();
    expect(parseOEmbedTitle({ title: 42 })).toBeNull();
    expect(parseOEmbedTitle("<html>")).toBeNull();
  });
});

describe("loadVideoTitle", () => {
  it("asks oEmbed for the watch URL", async () => {
    const fetchImpl = vi.fn(async () => Response.json({ title: "A title" }));
    await expect(loadVideoTitle(ID, fetchImpl)).resolves.toBe("A title");
    expect(fetchImpl).toHaveBeenCalledWith(oEmbedUrl(ID), expect.anything());
    expect(oEmbedUrl(ID)).toBe(
      "https://www.youtube.com/oembed?format=json&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DwpNuDtvzMzs",
    );
  });

  it("returns null on a bad status, a network error or a malformed id", async () => {
    await expect(loadVideoTitle(ID, async () => new Response("", { status: 404 }))).resolves.toBeNull();
    await expect(
      loadVideoTitle(ID, async () => {
        throw new Error("offline");
      }),
    ).resolves.toBeNull();
    const never = vi.fn();
    await expect(loadVideoTitle("not an id", never)).resolves.toBeNull();
    expect(never).not.toHaveBeenCalled();
  });
});

describe("resolveVideoWithTitle", () => {
  it("keeps the feed's title without asking oEmbed", async () => {
    const lookup = vi.fn();
    const inFeed = {
      id: ID,
      title: "From the feed",
      publishedAt: null,
      url: `https://www.youtube.com/watch?v=${ID}` as const,
      thumbnail: `https://i.ytimg.com/vi/${ID}/hqdefault.jpg` as const,
    };
    await expect(resolveVideoWithTitle(ID, [inFeed], lookup)).resolves.toBe(inFeed);
    expect(lookup).not.toHaveBeenCalled();
  });

  it("uses oEmbed's title for a video outside the feed", async () => {
    const video = await resolveVideoWithTitle(ID, [], async () => "From oEmbed");
    expect(video?.title).toBe("From oEmbed");
  });

  it("keeps the placeholder when oEmbed fails", async () => {
    const video = await resolveVideoWithTitle(ID, [], async () => null);
    expect(video?.title).toBe(VIDEO_TITLE_PLACEHOLDER);
  });
});

describe("parseOEmbedInfo", () => {
  it("reads the title and the channel's handle URL", async () => {
    const { parseOEmbedInfo } = await import("./oembed");
    expect(
      parseOEmbedInfo({ title: "Understanding the New Testament", author_url: "https://www.youtube.com/@TheBrotherOla" }),
    ).toEqual({ title: "Understanding the New Testament", authorUrl: "https://www.youtube.com/@TheBrotherOla" });
  });

  it("drops an author URL that is not a plain YouTube channel URL", async () => {
    const { parseOEmbedInfo } = await import("./oembed");
    expect(parseOEmbedInfo({ title: "T", author_url: "https://evil.example/@x" })?.authorUrl).toBeNull();
    expect(parseOEmbedInfo({ title: "T", author_url: "https://www.youtube.com/@x?y=<z>" })?.authorUrl).toBeNull();
    expect(parseOEmbedInfo({ nope: true })).toBeNull();
  });
});

describe("lookupVideo", () => {
  const body = { title: "A teaching", author_url: "https://www.youtube.com/@HOBglobal" };

  it("finds a video with its title and channel", async () => {
    const { lookupVideo } = await import("./oembed");
    await expect(lookupVideo(ID, async () => Response.json(body))).resolves.toEqual({
      status: "found",
      info: { title: "A teaching", authorUrl: "https://www.youtube.com/@HOBglobal" },
    });
  });

  it("is missing when YouTube says there is no public video by that id", async () => {
    const { lookupVideo } = await import("./oembed");
    for (const status of [400, 401, 403, 404]) {
      await expect(lookupVideo(ID, async () => new Response("", { status }))).resolves.toEqual({ status: "missing" });
    }
  });

  it("is unreachable on a network error, a server error, a rate limit or a body that is not oEmbed", async () => {
    const { lookupVideo } = await import("./oembed");
    const offline = async (): Promise<Response> => {
      throw new TypeError("fetch failed");
    };
    await expect(lookupVideo(ID, offline)).resolves.toEqual({ status: "unreachable" });
    for (const status of [429, 500, 503]) {
      await expect(lookupVideo(ID, async () => new Response("", { status }))).resolves.toEqual({ status: "unreachable" });
    }
    await expect(lookupVideo(ID, async () => new Response("<html>consent</html>"))).resolves.toEqual({ status: "unreachable" });
  });
});
