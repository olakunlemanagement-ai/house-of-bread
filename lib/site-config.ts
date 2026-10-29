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
   * The featured video, as a YouTube video id. It leads the Teachings page
   * (/media) player ahead of the feed, and stands in on Home when the feed
   * is empty. Change this one value to replace it. Null puts the newest feed
   * video in the lead.
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
