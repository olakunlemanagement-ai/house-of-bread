// Source settings for each decorative loop. Read by process-loops.mjs and
// verify-white.mjs. Keep ids in step with lib/media/loops.ts.
//
// loop:
//   "xfade"    find the closest pair of frames between the first and last
//              second, trim there, then crossfade the tail into the head.
//   "pingpong" play a segment forward then backward. Used where the clip
//              brightens steadily, so a crossfade would pulse.
// denoise: false by default. Set only when a clip cannot reach its size
//   budget cleanly, and record why.

/** Size budgets in bytes (1 KB = 1000 bytes, the stricter reading). */
export const BUDGET = { full: 800_000, mobile: 300_000 };

export const FPS = 24;
export const WIDTH = 1280;
export const HEIGHT = 720;
export const MOBILE_WIDTH = 640;
export const MOBILE_HEIGHT = 360;

/** Default crossfade length at the loop point, in frames (1 s). A clip may set its own xfade. */
export const XFADE_FRAMES = 24;

/** How far into the head and tail the loop point search looks, in frames. */
export const SEAM_SEARCH_FRAMES = 24;

export const clips = [
  {
    id: "ambient-light",
    source: "clip-1.mp4",
    use: "Home hero background",
    // A dark sliver sits on the left edge mid height. Crop it, keep 16:9.
    crop: { x: 16, y: 4, w: 1264, h: 711 },
    loop: "xfade",
    // The ribbon changes shape across the seam. A 2 s dissolve reads as drift.
    xfade: 48,
    mobile: true,
  },
  {
    id: "dust-light",
    source: "clip-2.mp4",
    use: "Inner page headers, lg and up",
    // Brightness climbs from 121 to 184 over the clip. Ping-pong the middle
    // four seconds so the loop breathes gently rather than jumping.
    loop: "pingpong",
    segment: [48, 144],
  },
  {
    id: "wheat-field",
    source: "clip-3.mp4",
    use: "About, The name",
    // The camera dollies the whole time, so a crossfade ghosts the stalks.
    // Ping-pong three seconds: the push and pull reads as a breeze.
    loop: "pingpong",
    segment: [60, 132],
  },
  { id: "bread-steam", source: "clip-4.mp4", use: "Newsletter card", loop: "xfade" },
  {
    id: "open-bible",
    source: "clip-5.mp4",
    use: "Academy, Who the Academy is for",
    // A slow push in. A crossfade shows the Bible twice, so drift in and out.
    loop: "pingpong",
    segment: [48, 144],
  },
  { id: "water-light", source: "clip-6.mp4", use: "App band", loop: "xfade" },
  { id: "green-mesh", source: "clip-7.mp4", use: "Closing band", loop: "xfade" },
  {
    id: "bible-loaf",
    source: "clip-8.mp4",
    use: "Home, Why House of Bread?, multiply on white",
    // Not shipped (18 October 2026): the loop point shows a rotation jump and
    // the paper mat survives the key as a hard edged grey shape. Waiting for a
    // regenerated clip on seamless white. Build it by naming its id.
    ship: false,
    loop: "xfade",
    mobile: true,
    // Shot on a grey studio backdrop, not white. Key every low saturation
    // pixel to white so mix-blend-mode: multiply shows no box.
    keyWhite: {
      // The loaf stays inside x 218 to 1056 and y 224 to 658 in every frame.
      // Outside this box everything is forced white.
      safe: { x0: 190, x1: 1090, y0: 190, y1: 680 },
    },
  },
];
