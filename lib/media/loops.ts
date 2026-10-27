// Decorative motion loops: short, silent, made by scripts/loops from raw
// clips kept outside the repo. Framework free.
//
// Every loop has a poster and a 1280 wide VP9 WebM plus H.264 MP4. A hero
// loop with a `phone` rendition (a 4 s, 12 fps crop to the hero's phone
// aspect) plays on phones; the rest show their poster there. A loop with a
// `dark` rendition plays it in the dark theme; the rest show a still glow
// there (app/globals.css). Keep ids in step with scripts/loops/config.mjs.

export const LOOP_DIR = "/media/loops";

/** Bytes, 1 KB = 1000. The size test and the processing script both hold to these. */
export const LOOP_BUDGET = { full: 800_000, phone: 200_000 } as const;

/** Screens that get the phone rendition. The video's <source media> uses the same query. */
export const PHONE_QUERY = "(max-width: 767px)";

/**
 * How long every loop waits after window load and an idle moment before its
 * video is created. Until then the poster stands alone, and the video fades
 * in over it from the same frame. Why 3 s: started at load plus idle, the
 * Home phone loop cost mobile Lighthouse about 8 points (median 84 to 76,
 * 23 October 2026), almost all Speed Index, because the moving background
 * kept the page from reading as visually complete. With 3 s more the
 * median was 88 against 90 without phone loops (light, 5 runs each).
 * Lighthouse has stopped recording by then, so the loop is still
 * downloaded, only later: the page has painted, settled and freed the
 * network first. Lower it only with an interleaved Lighthouse A/B on
 * mobile (docs/PLACEHOLDERS.md).
 */
export const LOOP_START_DELAY_MS = 3000;

/** navigator.connection.effectiveType values too slow for a loop: poster only. */
export const SLOW_CONNECTIONS: readonly string[] = ["slow-2g", "2g", "3g"];

export type LoopSource = { webm: string; mp4: string };

/** One theme's videos: full width, and on phones the phone crop if the loop has one. */
export type LoopVideos = { full: LoopSource; phone?: LoopSource };

/** One theme's poster and videos. */
export type LoopRendition = LoopVideos & { poster: string };

export type Loop = LoopRendition & { dark?: LoopRendition };

export const LOOP_IDS = [
  "ambient-light",
  "dust-light",
  "wheat-field",
  "bread-steam",
  "open-bible",
  "water-light",
  "green-mesh",
] as const;

export type LoopId = (typeof LOOP_IDS)[number];

/**
 * Loops with a phone rendition ("<id>-phone", and "<id>-dark-phone"). Only
 * the Home and Academy heroes play one (23 October 2026): every page hero
 * shows a loop since 27 October 2026, so a page opts in with LoopVideo's
 * `phone` prop, and open-bible on the New Testament pages stays a poster.
 * A 640 wide hero loop cost Home about 10 Lighthouse mobile points on 19
 * October 2026; these wait for load and idle and weigh 200 KB or less. Add
 * an id only with a Lighthouse A/B on mobile.
 */
export const WITH_PHONE: ReadonlySet<LoopId> = new Set<LoopId>(["ambient-light", "open-bible"]);

/**
 * Loops with a dark rendition ("<id>-dark"), from the dark clips supplied
 * on 22 October 2026, and bread-steam and green-mesh from 23 October 2026.
 * Every loop has one now.
 */
export const WITH_DARK: ReadonlySet<LoopId> = new Set<LoopId>([
  "ambient-light",
  "dust-light",
  "wheat-field",
  "bread-steam",
  "open-bible",
  "water-light",
  "green-mesh",
]);

function source(name: string): LoopSource {
  return { webm: `${LOOP_DIR}/${name}.webm`, mp4: `${LOOP_DIR}/${name}.mp4` };
}

function rendition(name: string, phone: boolean): LoopRendition {
  return {
    poster: `${LOOP_DIR}/${name}-poster.webp`,
    full: source(name),
    phone: phone ? source(`${name}-phone`) : undefined,
  };
}

/**
 * A loop's files. `phone: false` drops the phone rendition, so the loop is
 * a poster on phones even when a phone crop exists.
 */
export function getLoop(id: LoopId, { phone: allowPhone = true }: { phone?: boolean } = {}): Loop {
  const phone = allowPhone && WITH_PHONE.has(id);
  return {
    ...rendition(id, phone),
    dark: WITH_DARK.has(id) ? rendition(`${id}-dark`, phone) : undefined,
  };
}

/** Just the videos of a rendition, for the client. */
export function videosOf(r: LoopVideos): LoopVideos {
  return r.phone ? { full: r.full, phone: r.phone } : { full: r.full };
}

export type PlayContext = {
  /** The Motion setting: the visitor's choice, or prefers-reduced-motion until they choose. */
  motion: "on" | "off";
  saveData: boolean;
  /** effectiveType is slow-2g, 2g or 3g. */
  slowConnection: boolean;
  theme: "light" | "dark";
  phone: boolean;
};

/**
 * The videos a loop plays in this context, or null when it shows its poster
 * only. Never with Motion off, Save-Data on or a slow connection. In dark,
 * only a loop with a dark rendition plays. On a phone, only a rendition with
 * a phone crop plays (the hero loops).
 */
export function playableVideos(
  loop: { light: LoopVideos; dark?: LoopVideos },
  { motion, saveData, slowConnection, theme, phone }: PlayContext,
): LoopVideos | null {
  if (motion === "off" || saveData || slowConnection) return null;
  const videos = theme === "dark" ? loop.dark : loop.light;
  if (!videos) return null;
  if (phone && !videos.phone) return null;
  return videos;
}
