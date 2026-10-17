// Parses a YouTube channel feed (Atom, from
// https://www.youtube.com/feeds/videos.xml?channel_id=...). Framework free and
// defensive: the feed is third party input, so anything malformed is skipped
// rather than trusted. Checked against a real feed on 17 October 2026: each
// <entry> carries <yt:videoId>, <title> (entity escaped), <published> (ISO
// 8601) and <media:thumbnail> on a numbered ytimg host. Links and thumbnails
// are rebuilt from the validated video id, never copied from the feed.

export type FeedVideo = {
  id: string;
  title: string;
  /** ISO 8601, or null when the feed's date is missing or invalid. */
  publishedAt: string | null;
  url: `https://${string}`;
  thumbnail: `https://${string}`;
};

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const CHANNEL_ID = /^UC[A-Za-z0-9_-]{22}$/;
const MAX_FEED_LENGTH = 2_000_000;
const MAX_TITLE_LENGTH = 200;

/** A channel id from the environment, or null if missing or not a channel id. */
export function parseChannelId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return CHANNEL_ID.test(trimmed) ? trimmed : null;
}

export function feedUrl(channelId: string): string {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
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

function cleanTitle(raw: string | null): string | null {
  if (!raw) return null;
  // Control characters out, whitespace collapsed. React escapes the result.
  const text = raw
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return null;
  return text.length > MAX_TITLE_LENGTH ? `${text.slice(0, MAX_TITLE_LENGTH - 3).trimEnd()}...` : text;
}

function cleanDate(raw: string | null): string | null {
  if (!raw) return null;
  const time = Date.parse(raw.trim());
  return Number.isNaN(time) ? null : new Date(time).toISOString();
}

/**
 * The newest videos in the feed, at most `limit`, newest first. Entries
 * without a valid video id or title are skipped, and duplicates dropped.
 * Returns an empty list for anything that is not a usable feed.
 */
export function parseYouTubeFeed(xml: unknown, limit = 6): FeedVideo[] {
  if (typeof xml !== "string" || xml.length === 0 || xml.length > MAX_FEED_LENGTH) return [];
  if (!Number.isInteger(limit) || limit < 1) return [];

  const seen = new Set<string>();
  const videos: FeedVideo[] = [];
  for (const [, block] of xml.matchAll(/<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/g)) {
    const id = textOf(block, "yt:videoId")?.trim() ?? "";
    if (!VIDEO_ID.test(id) || seen.has(id)) continue;
    const title = cleanTitle(textOf(block, "title") ?? textOf(block, "media:title"));
    if (!title) continue;
    seen.add(id);
    videos.push({
      id,
      title,
      publishedAt: cleanDate(textOf(block, "published")),
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    });
  }

  // Newest first. Undated entries keep their feed order, after dated ones.
  return videos
    .map((video, index) => ({ video, index }))
    .sort((a, b) => {
      const at = a.video.publishedAt ? Date.parse(a.video.publishedAt) : -Infinity;
      const bt = b.video.publishedAt ? Date.parse(b.video.publishedAt) : -Infinity;
      return bt === at ? a.index - b.index : bt - at;
    })
    .slice(0, limit)
    .map(({ video }) => video);
}
