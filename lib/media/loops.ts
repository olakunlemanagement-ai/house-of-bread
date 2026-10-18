// Decorative motion loops: short, silent, made by scripts/loops from raw
// clips kept outside the repo. Framework free.
//
// Every loop has a poster and a 1280 wide VP9 WebM plus H.264 MP4. A loop
// with a `mobile` rendition (640 wide) may play on phones; the rest show
// their poster there. Keep ids in step with scripts/loops/config.mjs.

export const LOOP_DIR = "/media/loops";

/** Bytes, 1 KB = 1000. The size test and the processing script both hold to these. */
export const LOOP_BUDGET = { full: 800_000, mobile: 300_000 } as const;

export type LoopSource = { webm: string; mp4: string };

export type Loop = {
  poster: string;
  full: LoopSource;
  mobile?: LoopSource;
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

function source(id: LoopId, suffix = ""): LoopSource {
  return { webm: `${LOOP_DIR}/${id}${suffix}.webm`, mp4: `${LOOP_DIR}/${id}${suffix}.mp4` };
}

export function getLoop(id: LoopId): Loop {
  return {
    poster: `${LOOP_DIR}/${id}-poster.webp`,
    full: source(id),
    mobile: WITH_MOBILE.has(id) ? source(id, "-640") : undefined,
  };
}
