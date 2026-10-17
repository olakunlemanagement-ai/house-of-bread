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
  /** Audio platforms (podcast and similar), in display order. Empty renders a placeholder. */
  audio: { label: string; href: string }[];
  /**
   * The 60 to 90 second welcome video on Home, as a YouTube video id. Null
   * falls back to the latest video from the channel feed, then to a "Photo
   * and video to come" frame.
   */
  welcomeVideoId: string | null;
  /**
   * One occurrence of the regular live session, as ISO 8601 in UTC. The
   * region band shows it in each region's zone. Null renders a placeholder.
   */
  weeklySessionUtc: string | null;
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
    "A global teaching ministry serving believers across the UK, Africa and the United States. Live teaching, House of Bread Academy, written teaching, and the official House of Bread app.",
  /**
   * Global noindex flag. While true, every page tells search engines not to
   * index or follow it. Flip to false only at launch, once placeholder copy
   * is replaced. Pages that must never be indexed set their own robots
   * metadata and are unaffected by this flag.
   */
  noindex: true,
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
    audio: [],
    welcomeVideoId: null,
    weeklySessionUtc: null,
    googlePlay: null,
    appStore: null,
  } satisfies SiteLinks as SiteLinks,
} as const;
