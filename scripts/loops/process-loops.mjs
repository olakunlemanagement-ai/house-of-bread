// Turns the raw Google Flow clips into the decorative loops the site serves.
//
//   node scripts/loops/process-loops.mjs              all shipped clips
//   node scripts/loops/process-loops.mjs wheat-field  one or more ids
//
// Needs ffmpeg on PATH (or FFMPEG=<path>). Raw clips are read from
// LOOPS_RAW_DIR, by default ../house-of-bread-assets/animations-raw beside
// the repo. They never enter the repo. Output goes to public/media/loops.
//
// Per clip: strip audio, crop if needed, key to white if needed, make the
// loop seamless, then encode VP9 WebM and H.264 MP4 and a WebP poster from
// the loop's first frame. A clip with a phone rendition also gets its own
// 4 s loop, cropped to the hero's phone aspect at 12 fps ("<id>-phone"). Each file
// is first encoded at a quality target. Only a file over budget is
// re-encoded at the budget bitrate, and the report says how much it lost.
// Exits 1 if any file is still over budget. No dependencies.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BUDGET,
  FPS,
  HEIGHT,
  PHONE,
  SEAM_SEARCH_FRAMES,
  WIDTH,
  XFADE_FRAMES,
  clips,
  phoneGeometry,
} from "./config.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const RAW = process.env.LOOPS_RAW_DIR ?? path.resolve(ROOT, "..", "house-of-bread-assets", "animations-raw");
const OUT = path.join(ROOT, "public", "media", "loops");
const FFMPEG = process.env.FFMPEG ?? "ffmpeg";
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "hob-loops-"));

// Quality targets tried first. Visually clean for soft, slow footage.
const QUALITY = { vp9Crf: 32, x264Crf: 22 };
// Leave room for container overhead and rate control overshoot.
const BUDGET_HEADROOM = 0.93;
const COLOUR_TAGS = ["-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv"];

function ffmpeg(args, { level = "error" } = {}) {
  const result = spawnSync(FFMPEG, ["-hide_banner", "-nostats", "-v", level, "-y", ...args], {
    encoding: "utf8",
    maxBuffer: 1 << 26,
  });
  if (result.status !== 0) {
    throw new Error(`ffmpeg failed (${result.status}): ${args.join(" ")}\n${result.stderr}`);
  }
  return result.stderr;
}

function rawGray(file, pre, w = 96, h = 54) {
  const result = spawnSync(
    FFMPEG,
    ["-hide_banner", "-v", "error", "-i", file, "-vf", `${pre},scale=${w}:${h},format=gray`, "-f", "rawvideo", "-"],
    { maxBuffer: 1 << 28 },
  );
  if (result.status !== 0) throw new Error(`ffmpeg failed reading ${file}\n${result.stderr}`);
  const size = w * h;
  const count = result.stdout.length / size;
  return { count, frame: (i) => result.stdout.subarray(i * size, (i + 1) * size) };
}

function meanAbsDiff(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += Math.abs(a[i] - b[i]);
  return sum / a.length;
}

/** Closest pair between the first and last second: frame b looks like frame a, so [a, b) loops. */
function findSeam(gray) {
  let best = { a: 0, b: gray.count - 1, diff: Infinity };
  for (let a = 0; a < SEAM_SEARCH_FRAMES; a++) {
    for (let b = gray.count - SEAM_SEARCH_FRAMES; b < gray.count; b++) {
      const diff = meanAbsDiff(gray.frame(a), gray.frame(b));
      if (diff < best.diff) best = { a, b, diff };
    }
  }
  const steps = [];
  for (let i = 1; i < gray.count; i++) steps.push(meanAbsDiff(gray.frame(i - 1), gray.frame(i)));
  steps.sort((x, y) => x - y);
  return { ...best, typicalStep: steps[Math.floor(steps.length / 2)] };
}

function preChain(clip) {
  const parts = [`fps=${FPS}`];
  if (clip.crop) parts.push(`crop=${clip.crop.w}:${clip.crop.h}:${clip.crop.x}:${clip.crop.y}`);
  parts.push(`scale=${WIDTH}:${HEIGHT}:flags=lanczos`, "setsar=1");
  return parts.join(",");
}

/**
 * Key low saturation pixels to white. Saturation is (max - min) / max. The
 * threshold rises for bright pixels, so the pale paper mat goes white while
 * pale crust stays, and a minimum chroma keeps dark neutral pixels (the
 * softbox rim) from leaking through on noise. Outside the safe box the mask
 * is zero, so the frame edge is always pure white.
 */
function keyWhiteGraph(input, output, { safe }) {
  const outside = `lt(X,${safe.x0})+gte(X,${safe.x1})+lt(Y,${safe.y0})+gte(Y,${safe.y1})`;
  const mask =
    "st(0,max(max(r(X,Y),g(X,Y)),b(X,Y)));" +
    "st(1,min(min(r(X,Y),g(X,Y)),b(X,Y)));" +
    "st(2,ld(0)-ld(1));" +
    "st(3,0.10+0.10*clip((ld(1)-160)/40,0,1));" +
    `if(${outside},0,255*clip((ld(2)/max(ld(0),1)-ld(3))*10,0,1)*clip((ld(2)-12)/10,0,1))`;
  return [
    `[${input}]format=gbrp,split=3[ka][kb][kc]`,
    `[kb]geq=r='${mask}':g='${mask}':b='${mask}',boxblur=1:1,format=gbrp[km]`,
    `[kc]geq=r=255:g=255:b=255,format=gbrp[kw]`,
    // White where the mask is 0, the source where it is 255. Then lift the
    // last few near white values to true white.
    `[kw][ka][km]maskedmerge=planes=7,format=gbrp,colorlevels=rimax=0.96:gimax=0.96:bimax=0.96[${output}]`,
  ];
}

function loopGraph(clip, seam) {
  const lines = [];
  let start;
  let end;
  if (clip.loop === "pingpong") {
    [start, end] = clip.segment;
    end += 1;
  } else {
    start = seam.a;
    end = seam.b;
  }
  lines.push(`[0:v]trim=start_frame=${start}:end_frame=${end},setpts=PTS-STARTPTS,${preChain(clip)}[pre]`);
  let source = "pre";
  if (clip.keyWhite) {
    lines.push(...keyWhiteGraph("pre", "keyed", clip.keyWhite));
    source = "keyed";
  }

  let frames;
  if (clip.loop === "pingpong") {
    // Forward s..e, then e-1 back to s+1, so the next pass starts at s.
    const length = end - start;
    lines.push(
      `[${source}]split[fwd][rev]`,
      `[rev]reverse,trim=start_frame=1:end_frame=${length - 1},setpts=PTS-STARTPTS[back]`,
      `[fwd][back]concat=n=2:v=1:a=0[loop]`,
    );
    frames = length * 2 - 2;
  } else {
    // [a, b) loops on its own except for the seam. Crossfade the last X
    // frames into the first X: the result starts at frame X and ends fully
    // faded into frame X - 1, so it wraps without a cut.
    const length = end - start;
    const x = clip.xfade ?? XFADE_FRAMES;
    lines.push(
      `[${source}]split[s1][s2]`,
      `[s1]trim=start_frame=${x},setpts=PTS-STARTPTS[body]`,
      `[s2]trim=end_frame=${x},setpts=PTS-STARTPTS[head]`,
      `[body][head]xfade=transition=fade:duration=${x / FPS}:offset=${(length - 2 * x) / FPS}[loop]`,
    );
    frames = length - x;
  }
  lines.push(`[loop]scale=out_color_matrix=bt709:out_range=tv,format=yuv444p[out]`);
  return { graph: lines.join(";"), frames };
}

function size(file) {
  return fs.statSync(file).size;
}

function ssim(file, reference, width, height) {
  const log = ffmpeg(
    [
      "-i",
      file,
      "-i",
      reference,
      "-lavfi",
      `[0:v]scale=${width}:${height}[a];[1:v]scale=${width}:${height}[b];[a][b]ssim`,
      "-f",
      "null",
      "-",
    ],
    { level: "info" },
  );
  const match = log.match(/All:([0-9.]+)/);
  return match ? Number(match[1]) : NaN;
}

function encode(codec, input, output, { width, height, denoise, crf, bitrate, crop, fps = FPS }) {
  const filters = [
    denoise ? "hqdn3d=2:2:4:4" : null,
    crop ?? null,
    fps === FPS ? null : `fps=${fps}`,
    `scale=${width}:${height}:flags=lanczos`,
    "format=yuv420p",
  ]
    .filter(Boolean)
    .join(",");
  const passlog = path.join(TMP, `pass-${path.basename(output)}`);
  const common = ["-i", input, "-an", "-vf", filters, ...COLOUR_TAGS, "-g", String(fps * 4)];
  const rate =
    codec === "vp9"
      ? ["-c:v", "libvpx-vp9", ...(bitrate ? ["-b:v", String(bitrate)] : ["-crf", String(crf), "-b:v", "0"]),
         "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", "-auto-alt-ref", "1", "-lag-in-frames", "25"]
      : ["-c:v", "libx264", "-preset", "veryslow", "-profile:v", "high",
         ...(bitrate ? ["-b:v", String(bitrate)] : ["-crf", String(crf)])];
  if (codec === "vp9" || bitrate) {
    ffmpeg([...common, ...rate, "-pass", "1", "-passlogfile", passlog, "-f", "null", "-"]);
    ffmpeg([...common, ...rate, "-pass", "2", "-passlogfile", passlog, ...muxer(codec), output]);
  } else {
    ffmpeg([...common, ...rate, ...muxer(codec), output]);
  }
}

function muxer(codec) {
  return codec === "vp9" ? ["-f", "webm", "-cues_to_front", "1"] : ["-f", "mp4", "-movflags", "+faststart"];
}

/** Quality target first. Over budget: two pass at the budget bitrate, tightening until it fits. */
function encodeWithinBudget(codec, input, output, opts, frames) {
  const clean = path.join(TMP, `clean-${path.basename(output)}`);
  encode(codec, input, clean, { ...opts, crf: codec === "vp9" ? QUALITY.vp9Crf : QUALITY.x264Crf });
  const cleanBytes = size(clean);
  if (cleanBytes <= opts.budget) {
    fs.copyFileSync(clean, output);
    return { file: output, bytes: cleanBytes, cleanBytes, mode: "quality" };
  }
  const seconds = frames / FPS;
  let bitrate = Math.floor((opts.budget * 8 * BUDGET_HEADROOM) / seconds);
  for (let attempt = 0; attempt < 4; attempt++) {
    encode(codec, input, output, { ...opts, bitrate });
    if (size(output) <= opts.budget) break;
    bitrate = Math.floor(bitrate * 0.92);
  }
  return {
    file: output,
    bytes: size(output),
    cleanBytes,
    mode: "budget",
    bitrate,
    ssimVsClean: ssim(output, clean, opts.width, opts.height),
  };
}

function processClip(clip) {
  const source = path.join(RAW, clip.source);
  if (!fs.existsSync(source)) throw new Error(`Missing raw clip ${source}`);
  console.log(`\n${clip.id}: ${clip.source}`);

  const gray = rawGray(source, preChain(clip));

  /**
   * A lossless loop master at 24 fps, 1280 x 720, and the source frame it
   * opens on. A given seam (phone loops) is used as is.
   */
  function buildMaster(spec, name, fixedSeam) {
    let seam = null;
    if (spec.loop === "xfade") {
      seam = fixedSeam ?? findSeam(gray);
      const diff = fixedSeam ? meanAbsDiff(gray.frame(seam.a), gray.frame(seam.b)) : seam.diff;
      console.log(`  ${name} seam: frame ${seam.b} -> ${seam.a}, diff ${diff.toFixed(2)}`);
    } else {
      console.log(`  ${name} ping-pong over frames ${spec.segment[0]} to ${spec.segment[1]}`);
    }
    const { graph, frames } = loopGraph(spec, seam);
    const master = path.join(TMP, `${clip.id}-${name}-master.mkv`);
    ffmpeg(["-i", source, "-an", "-filter_complex", graph, "-map", "[out]",
      "-c:v", "libx264", "-preset", "fast", "-crf", "4", "-pix_fmt", "yuv444p", ...COLOUR_TAGS, master]);
    const firstFrame = seam ? seam.a + (spec.xfade ?? XFADE_FRAMES) : spec.segment[0];
    return { master, frames, firstFrame };
  }

  const { master, frames, firstFrame } = buildMaster(clip, "full");
  const variants = [{ suffix: "", master, frames, width: WIDTH, height: HEIGHT, budget: BUDGET.full }];
  if (clip.phone) {
    // Its own 4 s loop, where the full one runs 4 to 8 s. It opens on the
    // poster's frame (the full loop's first), so the fade from poster to
    // video shows no change of picture.
    const spec = { ...clip, ...clip.phone };
    if (spec.loop === "pingpong") {
      // Forward 48 frames and back: 96 frames.
      spec.segment = [firstFrame, firstFrame + PHONE.frames / 2];
    }
    const xfade = spec.xfade ?? XFADE_FRAMES;
    const seam = spec.loop === "xfade" ? { a: firstFrame - xfade, b: firstFrame + PHONE.frames } : undefined;
    if (seam && (seam.a < 0 || seam.b > gray.count)) throw new Error(`${clip.id}: the phone loop runs off the clip`);
    if (spec.segment && spec.segment[1] >= gray.count) throw new Error(`${clip.id}: the phone loop runs off the clip`);
    const phone = buildMaster(spec, "phone", seam);
    if (phone.frames !== PHONE.frames) throw new Error(`${clip.id}: phone loop is ${phone.frames} frames, not ${PHONE.frames}`);
    if (phone.firstFrame !== firstFrame) throw new Error(`${clip.id}: phone loop opens on frame ${phone.firstFrame}, the poster on ${firstFrame}`);
    const geometry = phoneGeometry(spec.aspect);
    variants.push({ suffix: "-phone", ...phone, ...geometry, fps: PHONE.fps, budget: BUDGET.phone });
  }

  const results = [];
  for (const variant of variants) {
    for (const [codec, ext] of [["vp9", "webm"], ["x264", "mp4"]]) {
      const output = path.join(OUT, `${clip.id}${variant.suffix}.${ext}`);
      const opts = {
        width: variant.width,
        height: variant.height,
        budget: variant.budget,
        denoise: Boolean(clip.denoise),
        crop: variant.crop,
        fps: variant.fps,
      };
      results.push({ ...encodeWithinBudget(codec, variant.master, output, opts, variant.frames), budget: variant.budget, variant });
    }
  }

  // Poster: the loop's first frame, so the fade from poster to video is invisible.
  const poster = path.join(OUT, `${clip.id}-poster.webp`);
  ffmpeg(["-i", master, "-frames:v", "1", "-vf", `scale=${WIDTH}:-2`, "-c:v", "libwebp", "-quality", "70", poster]);
  results.push({ file: poster, bytes: size(poster), mode: "poster" });

  for (const r of results) {
    const kb = (r.bytes / 1000).toFixed(0).padStart(4);
    let note = r.mode;
    if (r.mode === "budget") {
      note += `: clean ${(r.cleanBytes / 1000).toFixed(0)} KB, now ${(r.bitrate / 1000).toFixed(0)} kbps, SSIM vs clean ${r.ssimVsClean.toFixed(4)}`;
    }
    const size = r.variant ? `  ${r.variant.width} x ${r.variant.height}, ${r.variant.fps ?? FPS} fps` : "";
    console.log(`  ${path.basename(r.file).padEnd(30)} ${kb} KB  ${note}${size}`);
  }
  for (const v of variants) {
    console.log(`  ${v.suffix || "full"}: ${v.frames} frames at 24 fps, ${(v.frames / FPS).toFixed(2)} s${clip.denoise ? ", denoised" : ""}`);
  }
  return { clip, results };
}

fs.mkdirSync(OUT, { recursive: true });
const wanted = process.argv.slice(2);
const selected = wanted.length ? clips.filter((c) => wanted.includes(c.id)) : clips.filter((c) => c.ship !== false);
if (wanted.length && selected.length !== wanted.length) {
  console.error(`Unknown id. Known: ${clips.map((c) => c.id).join(", ")}`);
  process.exit(2);
}

let failed = false;
try {
  for (const clip of selected) {
    const { results } = processClip(clip);
    for (const r of results) {
      if (r.budget && r.bytes > r.budget) {
        console.error(`  OVER BUDGET: ${path.basename(r.file)} ${r.bytes} > ${r.budget}`);
        failed = true;
      }
    }
  }
} finally {
  if (!process.env.KEEP_TMP) fs.rmSync(TMP, { recursive: true, force: true });
  else console.log(`\nIntermediates kept in ${TMP}`);
}
process.exit(failed ? 1 : 0);
