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
// darkOf: the id of the light loop this clip stands in for in dark. Its
//   files are named "<darkOf>-dark", and lib/media/loops.ts lists it in
//   WITH_DARK.
//
// Raw dark clips were supplied on 22 October 2026 and mapped to their
// light clip by content. Each was checked frame by frame for faces,
// readable text, flicker and a loop jump (no flicker in any of them).

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
    // No 640 rendition: on phones it cost Home about 10 Lighthouse points,
    // so phones show the poster (19 October 2026).
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
  {
    id: "green-mesh",
    // Replaced clip-7.mp4 on 23 October 2026: teal to green satin with soft
    // folds and a fine glitter, rolling slowly under a diagonal highlight.
    source: "Green_gradient_mesh_abstract_shot_20261022232009.mp4",
    use: "About, closing band",
    loop: "xfade",
    // The folds change shape across the seam. A 2 s dissolve reads as drift.
    xfade: 48,
  },
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

  // Dark renditions, played in place of the light loop in dark.
  {
    id: "ambient-light-dark",
    darkOf: "ambient-light",
    source: "clip-1-dark.mp4",
    use: "Home hero background, dark",
    // Green and amber light through smoke on near black. The first four
    // seconds rise out of black, and until about 3.75 s the smoke's leading
    // edge reads as a face in profile, so only the full beam after it is
    // used. Four seconds is too short to crossfade, and smoke drifting back
    // reads as breath, so ping-pong it.
    loop: "pingpong",
    segment: [100, 191],
  },
  {
    id: "dust-light-dark",
    darkOf: "dust-light",
    source: "clip-2-dark.mp4",
    use: "Inner page headers, lg and up, dark",
    // A diagonal river of gold dust over soft green. Brightness climbs from
    // 53 to 69; a 2 s dissolve lets it settle back without a pulse.
    loop: "xfade",
    xfade: 48,
  },
  {
    id: "wheat-field-dark",
    darkOf: "wheat-field",
    source: "clip-3-dark.mp4",
    use: "About, The name, dark",
    // Wheat at dusk. The camera dollies, as in the light clip.
    loop: "pingpong",
    segment: [60, 132],
  },
  {
    id: "open-bible-dark",
    darkOf: "open-bible",
    source: "clip-5-dark.mp4",
    use: "Academy, Who the Academy is for, dark",
    // An open book under a lamp. From about 3 s the push in sharpens the
    // page into letter shaped glyphs, so only the soft first 2.5 s is used.
    loop: "pingpong",
    segment: [6, 66],
  },
  {
    id: "water-light-dark",
    darkOf: "water-light",
    source: "clip-6-dark.mp4",
    use: "App band, dark",
    // Gold and emerald caustics on a dark floor. The seam is barely a step.
    loop: "xfade",
  },
  {
    id: "bible-loaf-dark",
    darkOf: "bible-loaf",
    source: "clip-8-dark.mp4",
    use: "Home, Why House of Bread?, dark",
    // A loaf shaped like a Bible, tumbling on black. Mid turn its stamped
    // ridges turn mould green, and a full turn cannot loop, so only the last
    // two seconds of the cross facing the camera rock back and forth. Not
    // shipped while the light loaf is not.
    ship: false,
    loop: "pingpong",
    segment: [128, 172],
  },
];
