import { describe, expect, it } from "vitest";
import { hasPlaceholderTitle, resolveVideo, VIDEO_TITLE_PLACEHOLDER } from "./featured";
import type { FeedVideo } from "./feed";

const inFeed: FeedVideo = {
  id: "wpNuDtvzMzs",
  title: "A teaching from the feed",
  publishedAt: "2026-10-16T12:00:21.000Z",
  url: "https://www.youtube.com/watch?v=wpNuDtvzMzs",
  thumbnail: "https://i.ytimg.com/vi/wpNuDtvzMzs/hqdefault.jpg",
};

describe("resolveVideo", () => {
  it("uses the feed entry when the video is in the feed", () => {
    expect(resolveVideo("wpNuDtvzMzs", [inFeed])).toBe(inFeed);
  });

  it("falls back to the placeholder title and the ytimg thumbnail", () => {
    const video = resolveVideo("wpNuDtvzMzs", []);
    expect(video).toEqual({
      id: "wpNuDtvzMzs",
      title: VIDEO_TITLE_PLACEHOLDER,
      publishedAt: null,
      url: "https://www.youtube.com/watch?v=wpNuDtvzMzs",
      thumbnail: "https://i.ytimg.com/vi/wpNuDtvzMzs/hqdefault.jpg",
    });
    expect(video && hasPlaceholderTitle(video)).toBe(true);
  });

  it("returns null for a missing or malformed id", () => {
    expect(resolveVideo(null, [inFeed])).toBeNull();
    expect(resolveVideo("not-an-id", [inFeed])).toBeNull();
    expect(resolveVideo("wpNuDtvzMzs/../x", [])).toBeNull();
  });
});
