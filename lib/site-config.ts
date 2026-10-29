import type { WeeklyRule } from "./schedule/weekly";

export type SocialPlatform = "instagram" | "youtube" | "tiktok" | "facebook" | "x" | "linktree";

export type SocialAccount = {
  platform: SocialPlatform;
  /** Plain profile URL. No tracking parameters. */
  href: `https://${string}`;
  /**
   * Who runs the account. The ministry must confirm which accounts are
   * official (docs/PLACEHOLDERS.md).
   */
  owner: "ministry" | "pastor";
};

export type SiteLinks = {
  /** The ministry's YouTube channel. Null renders the [CHANNEL LINK] placeholder. */
  youtubeChannel: string | null;
  /** Social accounts, in display order. Empty renders a placeholder. */
  social: SocialAccount[];
  /**
   * A YouTube video id that stands in on Home's teaching block when the
   * ministry feed is empty. Teachings has its own, featuredTeachingId.
   */
  featuredVideoId: string | null;
  /** Store links. Null renders a marked placeholder in the button's place. */
  googlePlay: string | null;
  appStore: string | null;
};

/**
 * The ministry's YouTube channel id. Public, not a secret: it is in every
 * channel URL. YOUTUBE_CHANNEL_ID in the environment carries the same value
 * for the video feed.
 */
export const YOUTUBE_CHANNEL_ID = "UCGkSJEWgmpHK7eR1ysKZZgA";

/**
 * The pastor's YouTube channel (@TheBrotherOla), added as a source of
 * teaching on 29 October 2026. Public, like the one above.
 */
export const PASTOR_CHANNEL_ID = "UCfPlw2N9OgpF3I6xBv4XZ5Q";

/** A channel whose videos fill Teachings. `url` is the channel's handle URL, as oEmbed reports it. */
export type TeachingChannel = { id: string; url: `https://www.youtube.com/@${string}` };

export const siteConfig = {
  name: "House of Bread Global",
  url: "https://hobglobal.online",
  description:
    "Courses and teaching that bring you into an accurate understanding of God's Word, and a real encounter with Him. A teaching ministry serving believers in the UK, Africa and the United States.",
  /**
   * Global noindex flag. While true, every page tells search engines not to
   * index or follow it. Flip to false only at launch, once placeholder copy
   * is replaced. Pages that must never be indexed set their own robots
   * metadata and are unaffected by this flag.
   */
  noindex: true,
  /**
   * The video in Home's "New here? Start here." slot, as a YouTube video id.
   * It plays behind the click to load facade. Its title comes from the feed,
   * then YouTube oEmbed, then a placeholder. Null falls back to the latest
   * feed video, then to an image slot.
   */
  startHereVideoId: "wpNuDtvzMzs" as string | null,
  /**
   * Teachings (/media) and its watch and series pages. Long-form videos and
   * Shorts come from every channel here, merged newest first. A watch page
   * exists only for a video from one of these channels (lib/youtube).
   */
  teachingChannels: [
    { id: YOUTUBE_CHANNEL_ID, url: "https://www.youtube.com/@HOBglobal" },
    { id: PASTOR_CHANNEL_ID, url: "https://www.youtube.com/@TheBrotherOla" },
  ] satisfies TeachingChannel[] as readonly TeachingChannel[],
  /**
   * The teaching that leads Teachings. Null (since 29 October 2026): the
   * newest long-form teaching on the teaching channels, so the hero moves
   * on by itself within the hour of each upload. Set a YouTube video id to
   * pin one instead. Its title and description come from the feed, then
   * YouTube oEmbed; content/videos/<id>.mdx overrides either.
   */
  featuredTeachingId: null as string | null,
  /**
   * Series shown under "Latest series" when there is no YOUTUBE_API_KEY
   * (with one, every playlist on the teaching channels shows by itself,
   * newest first, and these too). Playlist ids, from a playlist link's
   * `list=` value.
   */
  seriesPlaylistIds: ["PLUHSYJnvnito"] as readonly string[],
  /**
   * The regular live session: every Monday at 8:00 pm Lagos time (19:00 UTC).
   * Every page works out the next occurrence and each region's local time
   * from this one rule (lib/schedule). The duration is a placeholder until
   * the ministry confirms it (docs/PLACEHOLDERS.md).
   */
  liveSession: {
    weekday: "monday",
    time: "20:00",
    timeZone: "Africa/Lagos",
    durationMinutes: null,
  } satisfies WeeklyRule as WeeklyRule,
  /**
   * External links. Do not invent them. Each null or empty value is listed
   * in docs/PLACEHOLDERS.md.
   * TODO: fill in the rest from the ministry and the app developer.
   */
  links: {
    youtubeChannel: `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`,
    social: [
      { platform: "youtube", href: `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`, owner: "ministry" },
      { platform: "youtube", href: "https://www.youtube.com/@TheBrotherOla", owner: "pastor" },
      { platform: "instagram", href: "https://www.instagram.com/brother0la/", owner: "pastor" },
      { platform: "facebook", href: "https://www.facebook.com/brother0la", owner: "pastor" },
      { platform: "tiktok", href: "https://www.tiktok.com/@brotherola", owner: "pastor" },
      { platform: "x", href: "https://x.com/brotherola", owner: "pastor" },
      { platform: "linktree", href: "https://linktr.ee/brotherola", owner: "pastor" },
    ],
    featuredVideoId: "wpNuDtvzMzs",
    googlePlay: null,
    appStore: null,
  } satisfies SiteLinks as SiteLinks,
} as const;
