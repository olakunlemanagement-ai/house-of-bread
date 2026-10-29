// Test fixtures: YouTube feeds and Data API bodies in the shape checked
// against the real ones on 29 October 2026, with made up ids and neutral
// titles. Used only by the tests in this folder.

export type FixtureEntry = {
  id: string;
  title: string;
  published?: string;
  short?: boolean;
  description?: string;
};

export function entryXml({ id, title, published = "2026-10-16T12:00:21+00:00", short = false, description = "" }: FixtureEntry) {
  const link = short ? `https://www.youtube.com/shorts/${id}` : `https://www.youtube.com/watch?v=${id}`;
  return `
 <entry>
  <id>yt:video:${id}</id>
  <yt:videoId>${id}</yt:videoId>
  <yt:channelId>UCaaaaaaaaaaaaaaaaaaaaaa</yt:channelId>
  <title>${title}</title>
  <link rel="alternate" href="${link}"/>
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
   <media:description>${description}</media:description>
  </media:group>
 </entry>`;
}

/** A whole feed. `title` and `published` are the playlist's own, before the entries. */
export function feedXml(entries: FixtureEntry[], { title = "Sample channel", published = "2026-10-22T11:40:25+00:00" } = {}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
 <link rel="self" href="http://www.youtube.com/feeds/videos.xml?playlist_id=PLxxxxxxxxxxxx"/>
 <title>${title}</title>
 <published>${published}</published>${entries.map(entryXml).join("")}
</feed>`;
}

/** A made up, well formed video id: "v" then the number, padded to 11 characters. */
export function vid(n: number, prefix = "v"): string {
  return `${prefix}${String(n).padStart(10, "0")}`.slice(0, 11);
}

/** `count` entries, one hour apart, newest first, numbered from `start`. */
export function entries(count: number, { start = 1, prefix = "v", short = false, from = "2026-10-25T20:00:00Z" } = {}): FixtureEntry[] {
  const base = Date.parse(from);
  return Array.from({ length: count }, (_, i) => ({
    id: vid(start + i, prefix),
    title: `${short ? "Short" : "Teaching"} ${start + i}`,
    published: new Date(base - i * 3_600_000).toISOString(),
    short,
    description: `About teaching ${start + i}.`,
  }));
}

export const CHANNEL_A = "UCaaaaaaaaaaaaaaaaaaaaaa";
export const CHANNEL_B = "UCbbbbbbbbbbbbbbbbbbbbbb";
export const API_KEY = "AIzaFakeKeyForTests_1234567890abcdef";

type Route = { match: (url: URL) => boolean; respond: () => Response | Promise<Response> };

/** A fetch that answers from a list of routes, records every call, and fails anything unrouted. */
export function fakeFetch(routes: Route[]) {
  const calls: { url: string; headers: Record<string, string> }[] = [];
  const fetcher = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    calls.push({ url: url.href, headers: Object.fromEntries(new Headers(init?.headers).entries()) });
    const route = routes.find((r) => r.match(url));
    if (!route) throw new TypeError("fetch failed");
    return route.respond();
  }) as typeof fetch;
  return { fetch: fetcher, calls };
}

export const xml = (body: string) => () => new Response(body, { status: 200, headers: { "content-type": "application/atom+xml" } });
export const json = (body: unknown) => () => new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } });
export const status = (code: number) => () => new Response("<html>error</html>", { status: code });

/** Matches a feed URL by its playlist_id or channel_id. */
export const feedFor = (id: string) => (url: URL) =>
  url.hostname === "www.youtube.com" &&
  url.pathname === "/feeds/videos.xml" &&
  (url.searchParams.get("playlist_id") === id || url.searchParams.get("channel_id") === id);

export const apiFor = (path: string, check: (url: URL) => boolean = () => true) => (url: URL) =>
  url.hostname === "www.googleapis.com" && url.pathname === `/youtube/v3/${path}` && check(url);
