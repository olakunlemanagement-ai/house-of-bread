// Decorative motion loops: short, silent, made by scripts/loops from raw
// clips kept outside the repo. Framework free.
//
// Every loop has a poster and a 1280 wide VP9 WebM plus H.264 MP4. A loop
// with a `mobile` rendition (640 wide) may play on phones; the rest show
// their poster there. A loop with a `dark` rendition plays it in the dark
// theme; the rest show a still glow there (app/globals.css). Keep ids in
// step with scripts/loops/config.mjs.

export const LOOP_DIR = "/media/loops";

/** Bytes, 1 KB = 1000. The size test and the processing script both hold to these. */
export const LOOP_BUDGET = { full: 800_000, mobile: 300_000 } as const;

export type LoopSource = { webm: string; mp4: string };

/** One theme's poster and full width video. */
export type LoopRendition = { poster: string; full: LoopSource };

export type Loop = LoopRendition & {
  mobile?: LoopSource;
  dark?: LoopRendition;
};

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
 * Loops that have a 640 wide rendition and so may play on phones. Empty
 * since 19 October 2026: the hero loop cost Home about 10 Lighthouse mobile
 * points (1 s of blocking time under 4x CPU throttling), so phones show
 * posters only. Add an id back only with a Lighthouse A/B against main.
 */
const WITH_MOBILE: ReadonlySet<LoopId> = new Set<LoopId>([]);

/**
 * Loops with a dark rendition ("<id>-dark"), from the dark clips supplied
 * on 22 October 2026. No dark clip exists yet for bread-steam or green-mesh.
 */
export const WITH_DARK: ReadonlySet<LoopId> = new Set<LoopId>([
  "ambient-light",
  "dust-light",
  "wheat-field",
  "open-bible",
  "water-light",
]);

function source(name: string): LoopSource {
  return { webm: `${LOOP_DIR}/${name}.webm`, mp4: `${LOOP_DIR}/${name}.mp4` };
}

function rendition(name: string): LoopRendition {
  return { poster: `${LOOP_DIR}/${name}-poster.webp`, full: source(name) };
}

export function getLoop(id: LoopId): Loop {
  return {
    ...rendition(id),
    mobile: WITH_MOBILE.has(id) ? source(`${id}-640`) : undefined,
    dark: WITH_DARK.has(id) ? rendition(`${id}-dark`) : undefined,
  };
}

export type PlayContext = {
  /** The Motion setting: the visitor's choice, or prefers-reduced-motion until they choose. */
  motion: "on" | "off";
  saveData: boolean;
  theme: "light" | "dark";
  phone: boolean;
};

/**
 * The source a loop plays in this context, or null when it shows its poster
 * only. Motion off or Save-Data on: never. Dark renditions are full width
 * only, so a phone in dark shows the poster, as does a phone with no
 * mobile rendition.
 */
export function playableSource(
  loop: Pick<Loop, "full" | "mobile"> & { dark?: LoopSource },
  { motion, saveData, theme, phone }: PlayContext,
): LoopSource | null {
  if (motion === "off" || saveData) return null;
  if (theme === "dark") return phone ? null : (loop.dark ?? null);
  return phone ? (loop.mobile ?? null) : loop.full;
}
