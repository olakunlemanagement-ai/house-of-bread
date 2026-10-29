import { describe, expect, it } from "vitest";
import {
  cleanDescription,
  cleanVideoTitle,
  decodeEntities,
  feedUrl,
  isPlaylistId,
  parseChannelId,
  parseFeed,
  parseYouTubeFeed,
  replaceDashes,
  uploadsPlaylistId,
} from "./feed";

// Same structure as a real channel feed checked on 17 October 2026, with
// neutral titles and made up ids.
function entry({
  id,
  title,
  published = "2026-10-16T12:00:21+00:00",
}: {
  id: string;
  title: string;
  published?: string;
}) {
  return `
 <entry>
  <id>yt:video:${id}</id>
  <yt:videoId>${id}</yt:videoId>
  <yt:channelId>UCaaaaaaaaaaaaaaaaaaaaaa</yt:channelId>
  <title>${title}</title>
  <link rel="alternate" href="https://www.youtube.com/watch?v=${id}"/>
  <author>
   <name>Sample channel</name>
   <uri>https://www.youtube.com/channel/UCaaaaaaaaaaaaaaaaaaaaaa</uri>
  </author>
  <published>${published}</published>
  <updated>2026-10-16T18:15:21+00:00</updated>
  <media:group>
   <media:title>${title}</media:title>
   <media:content url="https://www.youtube.com/v/${id}?version=3" type="application/x-shockwave-flash" width="640" height="390"/>
   <media:thumbnail url="https://i2.ytimg.com/vi/${id}/hqdefault.jpg" width="480" height="360"/>
   <media:description>Description &amp; notes</media:description>
  </media:group>
 </entry>`;
}

function feed(...entries: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
 <link rel="self" href="http://www.youtube.com/feeds/videos.xml?channel_id=UCaaaaaaaaaaaaaaaaaaaaaa"/>
 <id>yt:channel:aaaaaaaaaaaaaaaaaaaaaa</id>
 <title>Sample channel</title>
 <published>2008-11-25T00:46:52+00:00</published>${entries.join("")}
</feed>`;
}

describe("parseYouTubeFeed", () => {
  it("reads id, title, date and builds links from the id", () => {
    const [video] = parseYouTubeFeed(feed(entry({ id: "aV81SqB6HQg", title: "First teaching" })));
    expect(video).toEqual({
      id: "aV81SqB6HQg",
      title: "First teaching",
      publishedAt: "2026-10-16T12:00:21.000Z",
      url: "https://www.youtube.com/watch?v=aV81SqB6HQg",
      thumbnail: "https://i.ytimg.com/vi/aV81SqB6HQg/hqdefault.jpg",
    });
  });

  it("decodes entities in titles once", () => {
    const [video] = parseYouTubeFeed(
      feed(entry({ id: "aaaaaaaaaaa", title: "Faith &amp; works: &quot;James 2&quot; &#39;read&#39; &amp;lt;" })),
    );
    expect(video.title).toBe(`Faith & works: "James 2" 'read' &lt;`);
  });

  it("keeps at most the limit, newest first", () => {
    const xml = feed(
      ...Array.from({ length: 8 }, (_, i) =>
        entry({ id: `video000000${i}`.slice(-11), title: `Video ${i}`, published: `2026-10-0${i + 1}T10:00:00Z` }),
      ),
    );
    const videos = parseYouTubeFeed(xml, 6);
    expect(videos).toHaveLength(6);
    expect(videos.map((video) => video.title)).toEqual([
      "Video 7",
      "Video 6",
      "Video 5",
      "Video 4",
      "Video 3",
      "Video 2",
    ]);
  });

  it("skips entries with a bad id, a missing title or a duplicate id", () => {
    const xml = feed(
      entry({ id: "short", title: "Bad id" }),
      entry({ id: "bad id with", title: "Spaces" }),
      entry({ id: "bbbbbbbbbbb", title: "   " }),
      entry({ id: "ccccccccccc", title: "Kept" }),
      entry({ id: "ccccccccccc", title: "Duplicate" }),
    );
    expect(parseYouTubeFeed(xml).map((video) => video.title)).toEqual(["Kept"]);
  });

  it("never trusts markup or links inside an entry", () => {
    const xml = feed(
      entry({ id: "ddddddddddd", title: "&lt;script&gt;alert(1)&lt;/script&gt;Plain" }),
      entry({ id: "eeeeeeeeeee", title: "<b>Bold</b> title" }),
    );
    const titles = parseYouTubeFeed(xml).map((video) => video.title);
    expect(titles).toContain("Bold title");
    expect(titles.join(" ")).not.toContain("<b>");
    // Decoded text stays text. It is rendered by React, which escapes it.
    expect(titles).toContain("<script>alert(1)</script>Plain");
  });

  it("keeps a video with an invalid date, without a date", () => {
    const [video] = parseYouTubeFeed(feed(entry({ id: "fffffffffff", title: "Undated", published: "not a date" })));
    expect(video.publishedAt).toBeNull();
  });

  it("shortens very long titles", () => {
    const [video] = parseYouTubeFeed(feed(entry({ id: "ggggggggggg", title: "a".repeat(400) })));
    expect(video.title.length).toBe(200);
    expect(video.title.endsWith("...")).toBe(true);
  });

  it("returns an empty list for anything that is not a usable feed", () => {
    expect(parseYouTubeFeed("")).toEqual([]);
    expect(parseYouTubeFeed(undefined)).toEqual([]);
    expect(parseYouTubeFeed(404)).toEqual([]);
    expect(parseYouTubeFeed("<!DOCTYPE html><title>Error 404 (Not Found)!!1</title>")).toEqual([]);
    expect(parseYouTubeFeed(feed())).toEqual([]);
    expect(parseYouTubeFeed(feed(entry({ id: "hhhhhhhhhhh", title: "x" })), 0)).toEqual([]);
    expect(parseYouTubeFeed("x".repeat(2_000_001))).toEqual([]);
  });
});

describe("parseChannelId", () => {
  it("accepts a channel id and trims it", () => {
    expect(parseChannelId(" UCXuqSBlHAE6Xw-yeJA0Tunw ")).toBe("UCXuqSBlHAE6Xw-yeJA0Tunw");
  });

  it("rejects anything else", () => {
    expect(parseChannelId(undefined)).toBeNull();
    expect(parseChannelId("")).toBeNull();
    expect(parseChannelId("@houseofbread")).toBeNull();
    expect(parseChannelId("UCshort")).toBeNull();
    expect(parseChannelId("UCXuqSBlHAE6Xw-yeJA0Tunw&x=1")).toBeNull();
  });

  it("builds the feed address", () => {
    expect(feedUrl("UCXuqSBlHAE6Xw-yeJA0Tunw")).toBe(
      "https://www.youtube.com/feeds/videos.xml?channel_id=UCXuqSBlHAE6Xw-yeJA0Tunw",
    );
  });
});

describe("decodeEntities", () => {
  it("leaves unknown and invalid entities as written", () => {
    expect(decodeEntities("&nbsp; &#0; &#xD800; &#x1F600;")).toBe("&nbsp; &#0; &#xD800; \u{1F600}");
  });
});

describe("parseFeed", () => {
  it("reads the playlist's own title and date, and each entry's description and Shorts link", async () => {
    const { feedXml } = await import("./fixtures");
    const parsed = parseFeed(
      feedXml(
        [
          { id: "aV81SqB6HQg", title: "Long", description: "Line one\nLine two\n\n\n\nNext &amp; last" },
          { id: "bV81SqB6HQg", title: "Short", short: true },
        ],
        { title: "Bible Foundations Series", published: "2026-10-22T11:40:25+00:00" },
      ),
    );
    expect(parsed?.title).toBe("Bible Foundations Series");
    expect(parsed?.publishedAt).toBe("2026-10-22T11:40:25.000Z");
    expect(parsed?.entries.map((e) => [e.id, e.short])).toEqual([
      ["aV81SqB6HQg", false],
      ["bV81SqB6HQg", true],
    ]);
    expect(parsed?.entries[0].description).toBe("Line one\nLine two\n\nNext & last");
    expect(parsed?.entries[1].description).toBeNull();
  });

  it("keeps feed order (a playlist's own order)", async () => {
    const { feedXml, entries } = await import("./fixtures");
    const list = entries(3).reverse();
    expect(parseFeed(feedXml(list))?.entries.map((e) => e.id)).toEqual(list.map((e) => e.id));
  });

  it("returns null for anything that is not a feed, and an empty list for an empty feed", async () => {
    const { feedXml } = await import("./fixtures");
    expect(parseFeed("<!doctype html><title>Error</title>")).toBeNull();
    expect(parseFeed("")).toBeNull();
    expect(parseFeed(42)).toBeNull();
    expect(parseFeed(feedXml([]))?.entries).toEqual([]);
  });
});

describe("replaceDashes", () => {
  const em = String.fromCharCode(0x2014);
  const en = String.fromCharCode(0x2013);
  it("turns a dash between words into a comma and one between numbers into a hyphen", () => {
    expect(replaceDashes(`Grace ${em} the gift`)).toBe("Grace, the gift");
    expect(replaceDashes(`Grace${em}the gift`)).toBe("Grace, the gift");
    expect(replaceDashes(`Romans 3:21${en}26`)).toBe("Romans 3:21-26");
    expect(replaceDashes(`Part 1 ${en} 3`)).toBe("Part 1-3");
    expect(replaceDashes(`${em} a lead dash`)).toBe("a lead dash");
    expect(replaceDashes("No dashes - just a hyphen")).toBe("No dashes - just a hyphen");
  });

  it("cleans titles and descriptions too", () => {
    expect(cleanVideoTitle(`Faith ${em} Part 1`)).toBe("Faith, Part 1");
    expect(cleanDescription(`One ${em} two`)).toBe("One, two");
  });
});

describe("playlist ids", () => {
  it("accepts creator playlists, short ones included, and the uploads playlists", () => {
    expect(isPlaylistId("PLUHSYJnvnito")).toBe(true);
    expect(isPlaylistId("PL590L5WQmH8fJ54F369BLDSqIwcs-TCfs")).toBe(true);
    expect(isPlaylistId(uploadsPlaylistId("UCGkSJEWgmpHK7eR1ysKZZgA", "long"))).toBe(true);
  });

  it("rejects anything else", () => {
    for (const bad of ["", "PL", "PLshort", "XX1234567890ab", "PL<script>12345", "PL../../etc/pass", null]) {
      expect(isPlaylistId(bad)).toBe(false);
    }
  });

  it("builds the long-form and Shorts playlists from a channel id", () => {
    expect(uploadsPlaylistId("UCGkSJEWgmpHK7eR1ysKZZgA", "long")).toBe("UULFGkSJEWgmpHK7eR1ysKZZgA");
    expect(uploadsPlaylistId("UCGkSJEWgmpHK7eR1ysKZZgA", "short")).toBe("UUSHGkSJEWgmpHK7eR1ysKZZgA");
  });
});
