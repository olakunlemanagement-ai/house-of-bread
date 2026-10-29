// Parses a YouTube feed (Atom, from
// https://www.youtube.com/feeds/videos.xml?channel_id=... or ?playlist_id=...,
// which share one shape). Framework free and defensive: the feed is third
// party input, so anything malformed is skipped rather than trusted. Checked
// against real feeds on 17 and 29 October 2026: each <entry> carries
// <yt:videoId>, <title> (entity escaped), <published> (ISO 8601), a
// <link rel="alternate"> (to /shorts/ for a Short) and <media:group> with
// <media:description>. A playlist feed also carries the playlist's own
// <title> and <published> before its first entry. Feeds list 15 entries at
// most. Links and thumbnails are rebuilt from the validated video id, never
// copied from the feed.

export type FeedVideo = {
  id: string;
  title: string;
  /** ISO 8601, or null when the feed's date is missing or invalid. */
  publishedAt: string | null;
  url: `https://${string}`;
  thumbnail: `https://${string}`;
};

/** A feed entry with everything the Teachings pages use. */
export type FeedEntry = FeedVideo & {
  /** Plain text paragraphs separated by blank lines, or null. */
  description: string | null;
  /** True when the feed links the entry to /shorts/. */
  short: boolean;
};

/** A whole feed: its own title and date (a playlist's name and creation date), and its entries. */
export type ParsedFeed = {
  title: string | null;
  publishedAt: string | null;
  entries: FeedEntry[];
};

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

/** True for a well formed YouTube video id (11 characters). */
export function isVideoId(value: unknown): value is string {
  return typeof value === "string" && VIDEO_ID.test(value);
}

const CHANNEL_ID = /^UC[A-Za-z0-9_-]{22}$/;
const MAX_FEED_LENGTH = 2_000_000;
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;

/** A channel id from the environment, or null if missing or not a channel id. */
export function parseChannelId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return CHANNEL_ID.test(trimmed) ? trimmed : null;
}

export function feedUrl(channelId: string): string {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
}

// Playlist ids: PL for a creator's playlists (usually 34 characters, but
// some are shorter, such as the 13 character PLUHSYJnvnito), and UULF and
// UUSH for a channel's long-form uploads and Shorts.
const PLAYLIST_ID = /^(?:PL|UU|OL)[A-Za-z0-9_-]{10,64}$/;

/** True for a well formed YouTube playlist id. */
export function isPlaylistId(value: unknown): value is string {
  return typeof value === "string" && PLAYLIST_ID.test(value);
}

export function playlistFeedUrl(playlistId: string): string {
  return `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(playlistId)}`;
}

/**
 * A channel's long-form uploads (UULF) or Shorts (UUSH) as a playlist id:
 * the prefix, then the channel id without its UC. Both feeds checked for
 * both channels on 29 October 2026.
 */
export function uploadsPlaylistId(channelId: string, kind: "long" | "short"): string {
  return `${kind === "long" ? "UULF" : "UUSH"}${channelId.slice(2)}`;
}

/** The standard 480 by 360 thumbnail, on the one image host the CSP allows. */
export function thumbnailUrl(id: string): `https://${string}` {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function watchUrl(id: string): `https://${string}` {
  return `https://www.youtube.com/watch?v=${id}`;
}

const named: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

/** One pass, so "&amp;lt;" becomes "&lt;" and is never decoded twice. */
export function decodeEntities(text: string): string {
  return text.replace(/&(#\d{1,7}|#x[0-9a-f]{1,6}|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const point = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      const valid = Number.isInteger(point) && point > 0 && point <= 0x10ffff && (point < 0xd800 || point > 0xdfff);
      return valid ? String.fromCodePoint(point) : match;
    }
    return named[code.toLowerCase()] ?? match;
  });
}

function textOf(block: string, tag: string): string | null {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)</${escaped}>`).exec(block);
  if (!match) return null;
  const cdata = /^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/.exec(match[1]);
  // Strip raw markup before decoding, so an escaped "&lt;" stays visible text.
  return cdata ? cdata[1] : decodeEntities(match[1].replace(/<[^>]*>/g, ""));
}

const EM_DASH = String.fromCharCode(0x2014);
const EN_DASH = String.fromCharCode(0x2013);
const dashBetweenNumbers = new RegExp(`(\\d)\\s*[${EN_DASH}${EM_DASH}]\\s*(?=\\d)`, "g");
const dashBetweenWords = new RegExp(`[ \\t]*[${EN_DASH}${EM_DASH}]+[ \\t]*`, "g");

/**
 * Third party text shown as site copy follows CLAUDE.md section 6: an em or
 * en dash between numbers becomes a hyphen, any other a comma.
 */
export function replaceDashes(text: string): string {
  return text
    .replace(dashBetweenNumbers, "$1-")
    .replace(dashBetweenWords, ", ")
    .replace(/^, /gm, "")
    .replace(/, $/gm, "")
    .replace(/([,.!?;:]), /g, "$1 ");
}

function cleanTitle(raw: string | null): string | null {
  if (!raw) return null;
  // Control characters out, whitespace collapsed. React escapes the result.
  const text = replaceDashes(
    raw
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  ).trim();
  if (!text) return null;
  return text.length > MAX_TITLE_LENGTH ? `${text.slice(0, MAX_TITLE_LENGTH - 3).trimEnd()}...` : text;
}

/** A title from any source (feed, oEmbed, API), cleaned the same way. */
export function cleanVideoTitle(raw: unknown): string | null {
  return typeof raw === "string" ? cleanTitle(raw) : null;
}

/**
 * A description as plain paragraphs: control characters out, spaces
 * collapsed inside each line, at most one blank line between paragraphs,
 * dashes replaced. Null when nothing is left.
 */
export function cleanDescription(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw) return null;
  const text = replaceDashes(
    raw
      .replace(/\r\n?/g, "\n")
      .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ")
      .split("\n")
      .map((line) => line.replace(/\s+/g, " ").trim())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n"),
  ).trim();
  if (!text) return null;
  return text.length > MAX_DESCRIPTION_LENGTH ? `${text.slice(0, MAX_DESCRIPTION_LENGTH - 3).trimEnd()}...` : text;
}

function cleanDate(raw: string | null): string | null {
  if (!raw) return null;
  const time = Date.parse(raw.trim());
  return Number.isNaN(time) ? null : new Date(time).toISOString();
}

/** Newest first. Undated entries keep their order, after dated ones. */
export function newestFirst<T extends { publishedAt: string | null }>(items: T[]): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const at = a.item.publishedAt ? Date.parse(a.item.publishedAt) : -Infinity;
      const bt = b.item.publishedAt ? Date.parse(b.item.publishedAt) : -Infinity;
      return bt === at ? a.index - b.index : bt - at;
    })
    .map(({ item }) => item);
}

/**
 * Every usable entry in a feed, in feed order (a playlist's own order),
 * with the feed's title and date. Entries without a valid video id or
 * title are skipped, and duplicates dropped. Null for anything that is not
 * an Atom feed, so a caller can tell an empty feed from an error page.
 */
export function parseFeed(xml: unknown): ParsedFeed | null {
  if (typeof xml !== "string" || xml.length === 0 || xml.length > MAX_FEED_LENGTH) return null;
  if (!/<feed[\s>]/.test(xml)) return null;

  const head = xml.split(/<entry[\s>]/)[0];
  const seen = new Set<string>();
  const entries: FeedEntry[] = [];
  for (const [, block] of xml.matchAll(/<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/g)) {
    const id = textOf(block, "yt:videoId")?.trim() ?? "";
    if (!isVideoId(id) || seen.has(id)) continue;
    const title = cleanTitle(textOf(block, "title") ?? textOf(block, "media:title"));
    if (!title) continue;
    seen.add(id);
    const link = /<link\s[^>]*rel="alternate"[^>]*href="([^"]*)"/.exec(block)?.[1] ?? "";
    entries.push({
      id,
      title,
      publishedAt: cleanDate(textOf(block, "published")),
      url: watchUrl(id),
      thumbnail: thumbnailUrl(id),
      description: cleanDescription(textOf(block, "media:description")),
      short: /^https:\/\/(?:www\.)?youtube\.com\/shorts\//.test(link),
    });
  }

  return { title: cleanTitle(textOf(head, "title")), publishedAt: cleanDate(textOf(head, "published")), entries };
}

/**
 * The newest videos in the feed, at most `limit`, newest first. Entries
 * without a valid video id or title are skipped, and duplicates dropped.
 * Returns an empty list for anything that is not a usable feed.
 */
export function parseYouTubeFeed(xml: unknown, limit = 6): FeedVideo[] {
  if (!Number.isInteger(limit) || limit < 1) return [];
  const feed = parseFeed(xml);
  if (!feed) return [];
  return newestFirst(feed.entries)
    .slice(0, limit)
    .map(({ id, title, publishedAt, url, thumbnail }) => ({ id, title, publishedAt, url, thumbnail }));
}
