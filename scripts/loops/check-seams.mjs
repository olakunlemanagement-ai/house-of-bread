// Checks every shipped loop file for a visible jump, a flash or a blank
// frame where it wraps from its last frame to its first, and for flicker
// anywhere in it.
//
//   node scripts/loops/check-seams.mjs
//
// Decodes each WebM and MP4 in public/media/loops at 96 x 54 grey and
// compares the wrap (last frame to first) with the file's typical frame to
// frame change. A wrap within 2.5 times the typical step reads as motion.
// A frame whose mean brightness jumps from both neighbours by more than 6
// levels is flicker or a blank frame. Exits 1 on any failure. Needs ffmpeg
// (or FFMPEG=<path>). No dependencies.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const DIR = path.join(ROOT, "public", "media", "loops");
const FFMPEG = process.env.FFMPEG ?? "ffmpeg";
const W = 96;
const H = 54;
const N = W * H;
const MAX_RATIO = 2.5;
const MAX_FLICKER = 6;

function frames(file) {
  const r = spawnSync(FFMPEG, ["-v", "error", "-i", file, "-vf", `scale=${W}:${H},format=gray`, "-f", "rawvideo", "-"], {
    maxBuffer: 1 << 28,
  });
  if (r.status !== 0) throw new Error(`ffmpeg failed on ${file}\n${r.stderr}`);
  const count = r.stdout.length / N;
  return Array.from({ length: count }, (_, i) => r.stdout.subarray(i * N, (i + 1) * N));
}

const mad = (a, b) => {
  let s = 0;
  for (let i = 0; i < N; i++) s += Math.abs(a[i] - b[i]);
  return s / N;
};
const mean = (a) => a.reduce((s, v) => s + v, 0) / N;

let failed = false;
const files = fs.readdirSync(DIR).filter((f) => /\.(webm|mp4)$/.test(f)).sort();
console.log("file                         frames  wrap step  typical  ratio  flicker");
for (const name of files) {
  const list = frames(path.join(DIR, name));
  const steps = [];
  for (let i = 1; i < list.length; i++) steps.push(mad(list[i - 1], list[i]));
  const typical = [...steps].sort((a, b) => a - b)[Math.floor(steps.length / 2)];
  const wrap = mad(list.at(-1), list[0]);
  const ratio = wrap / typical;
  // Brightness against both neighbours, the wrap included.
  const means = list.map(mean);
  const flicker = [];
  for (let i = 0; i < means.length; i++) {
    const prev = means[(i - 1 + means.length) % means.length];
    const next = means[(i + 1) % means.length];
    const d = Math.min(Math.abs(means[i] - prev), Math.abs(means[i] - next));
    if (d > MAX_FLICKER) flicker.push(i);
  }
  const ok = ratio <= MAX_RATIO && flicker.length === 0;
  if (!ok) failed = true;
  console.log(
    `${name.padEnd(28)} ${String(list.length).padStart(6)}  ${wrap.toFixed(2).padStart(9)}  ${typical.toFixed(2).padStart(7)}  ${ratio.toFixed(2).padStart(5)}  ${flicker.length ? `frames ${flicker.join(", ")}` : "none"}${ok ? "" : "  FAIL"}`,
  );
}
process.exit(failed ? 1 : 0);
