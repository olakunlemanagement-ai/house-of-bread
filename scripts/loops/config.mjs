// Source settings for each decorative loop. Read by process-loops.mjs and
// verify-white.mjs. Keep ids in step with lib/media/loops.ts.
//
// loop:
//   "xfade"    find the closest pair of frames between the first and last
//              second, trim there, then crossfade the tail into the head.
//   "pingpong" play a segment forward then backward. Used where the clip
//              brightens steadily, so a crossfade would pulse.
// seam: [a, b] fixed loop point of an "xfade" clip, in place of the search:
//   frames a to b - 1 loop, the tail crossfading into the head. For a clip
//   with an unusable head or tail, or no close pair of frames at all.
// blacks: [r, g, b] levels (0 to 255) pulled to 0, for a dark clip whose
//   background sits a little above black.
// denoise: false by default. Set only when a clip cannot reach its size
//   budget cleanly, and record why.
// darkOf: the id of the light loop this clip stands in for in dark. Its
//   files are named "<darkOf>-dark", and lib/media/loops.ts lists it in
//   WITH_DARK.
// phone: a phone rendition ("<id>-phone"), only for a hero loop that plays
//   on phones (Home and Academy). A centred crop of the 1280 x 720 master,
//   at most PHONE.maxWidth wide, PHONE.fps, a 4 s loop of its own, no audio.
//   The crop is centred so the video lines up with the 16:9 poster under
//   object-cover, and its aspect must be at least the widest phone frame's
//   (Home's hero is 0.63 at 767px), or poster and video scale differently.
//     aspect   [w, h] of the crop, taken from the full 720 height
//     loop     "pingpong", or "xfade" with xfade (frames)
//   It opens on the poster's frame (the full loop's first), so the fade
//   from poster to video shows no change; process-loops.mjs derives the
//   segment from it.
//   lib/media/loops.ts lists the light id in WITH_PHONE. A light loop with a
//   phone rendition needs one on its dark clip too.
//
// Raw dark clips were supplied on 22 October 2026 and mapped to their
// light clip by content. Each was checked frame by frame for faces,
// readable text, flicker and a loop jump (no flicker in any of them).

/** Size budgets in bytes (1 KB = 1000 bytes, the stricter reading). */
export const BUDGET = { full: 800_000, phone: 200_000 };

export const FPS = 24;
export const WIDTH = 1280;
export const HEIGHT = 720;

/**
 * Phone renditions: at most 540 wide, 12 fps (exactly every second source
 * frame, so motion stays even), 4 s long, so 96 source frames per loop.
 */
export const PHONE = { maxWidth: 540, fps: 12, frames: 96 };

/** Centred crop of the 1280 x 720 master to [w, h], and the output size: even, at most PHONE.maxWidth wide. */
export function phoneGeometry([aw, ah]) {
  const cropWidth = Math.round((HEIGHT * aw) / ah / 2) * 2;
  let width = Math.min(cropWidth, PHONE.maxWidth);
  // Both sides even (yuv420p) and the aspect exact.
  while ((width * ah) % aw !== 0 || ((width * ah) / aw) % 2 !== 0) width -= 2;
  return { crop: `crop=${cropWidth}:${HEIGHT}:${(WIDTH - cropWidth) / 2}:0`, width, height: (width * ah) / aw };
}

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
    // On phones the hero is a tall frame (375 x 1452 up to 767 x 1208), so a
    // 2:3 centre crop (480 x 720) covers it. The 640 rendition dropped on 19
    // October 2026 played from the first paint; this one waits for load and
    // idle (LoopVideoClient).
    phone: { aspect: [2, 3], loop: "xfade", xfade: 24 },
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
    use: "Academy hero, framed panel",
    // A slow push in. A crossfade shows the Bible twice, so drift in and out.
    loop: "pingpong",
    segment: [48, 144],
    // The Academy panel is 4:3 at every width. Two seconds in and out.
    phone: { aspect: [4, 3], loop: "pingpong" },
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
    // Two seconds from the full beam, past the face shaped edge.
    phone: { aspect: [2, 3], loop: "pingpong" },
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
    use: "Academy hero, framed panel, dark",
    // An open book under a lamp. From about 3 s the push in sharpens the
    // page into letter shaped glyphs, so only the soft first 2.5 s is used.
    loop: "pingpong",
    segment: [6, 66],
    phone: { aspect: [4, 3], loop: "pingpong" },
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
    id: "bread-steam-dark",
    darkOf: "bread-steam",
    // Supplied on 23 October 2026 with a doubled extension, used as named.
    source: "clip-4-dark.mp4.mp4",
    use: "Newsletter card, dark",
    // Steam rising from a golden crust on warm near black. Until 1.5 s the
    // steam builds from nothing (and at 0.8 to 1 s parts into twin curls),
    // and from 7.33 s it parts into two mirrored scroll curls round a
    // central column that read as a horned head. So only 1.5 to 7.17 s is
    // used. No pair of frames matches closely (every pair is about five
    // times the typical step), so the loop point is fixed at the ends of
    // that span for length, and the plumes dissolve over 2 s. Steam run
    // backwards sinks, so no ping-pong. No green on the crust in any frame
    // (hue 70 to 170 degrees: 0 pixels).
    loop: "xfade",
    seam: [36, 172],
    xfade: 48,
    // The background is RGB 18, 13, 7. Pull it to near black.
    blacks: [16, 11, 5],
  },
  {
    id: "green-mesh-dark",
    darkOf: "green-mesh",
    source: "clip-7-dark.mp4.mp4",
    use: "About, closing band, dark",
    // Green to teal satin rolling on near black. Until 2.67 s the satin
    // slides in from the left and brightens, so only 2.67 s to the end is
    // used. The ribbon's edges match at frames 64 and 191 but drift apart
    // either side, so a 2 s dissolve showed two top edges at once (up to
    // 26 of 180 rows apart). A 0.67 s dissolve keeps them within 11 rows.
    loop: "xfade",
    seam: [64, 191],
    xfade: 16,
    // The background is RGB 9, 9, 9. Pull it to near black.
    blacks: [8, 8, 8],
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
