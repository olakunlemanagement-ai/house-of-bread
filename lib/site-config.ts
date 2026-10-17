export type SiteLinks = {
  /** YouTube channel. Null renders the [CHANNEL LINK] placeholder. */
  youtubeChannel: string | null;
  /** Other social pages, in display order. Empty renders a placeholder. */
  social: { label: string; href: string }[];
  /** Audio platforms (podcast and similar), in display order. Empty renders a placeholder. */
  audio: { label: string; href: string }[];
  /** Store links. Null renders a marked placeholder in the button's place. */
  googlePlay: string | null;
  appStore: string | null;
};

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
   * External links nobody has supplied yet. Do not invent them. Each null or
   * empty value is listed in docs/PLACEHOLDERS.md.
   * TODO: fill in from the ministry and the app developer.
   */
  links: {
    youtubeChannel: null,
    social: [],
    audio: [],
    googlePlay: null,
    appStore: null,
  } satisfies SiteLinks as SiteLinks,
} as const;
