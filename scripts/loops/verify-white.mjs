// Checks that a keyed loop is pure white wherever the subject never goes, so
// mix-blend-mode: multiply shows no box edge on a white page.
//
//   node scripts/loops/verify-white.mjs
//
// Decodes every frame of the final, encoded files (not the intermediate) to
// RGB, the way a browser would. Every pixel outside the clip's safe box, and
// every pixel in the outer 5% of the frame, must be 253 or above on all three
// channels. 253 under multiply darkens white by about 1%, which no one sees;
// a grey box edge starts to show from about 245. Exits 1 on failure. No
// dependencies.

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HEIGHT, MOBILE_HEIGHT, MOBILE_WIDTH, WIDTH, clips } from "./config.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const OUT = path.join(ROOT, "public", "media", "loops");
const FFMPEG = process.env.FFMPEG ?? "ffmpeg";
const MIN_WHITE = 253;

function check(file, width, height, safe) {
  const scale = width / WIDTH;
  const box = {
    x0: Math.floor(safe.x0 * scale),
    x1: Math.ceil(safe.x1 * scale),
    y0: Math.floor(safe.y0 * scale),
    y1: Math.ceil(safe.y1 * scale),
  };
  const ringX = Math.round(width * 0.05);
  const ringY = Math.round(height * 0.05);
  const frameBytes = width * height * 3;

  return new Promise((resolve, reject) => {
    const proc = spawn(FFMPEG, ["-v", "error", "-i", file, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]);
    let pending = Buffer.alloc(0);
    let frames = 0;
    let failingPixels = 0;
    let failingFrames = 0;
    let darkest = 255;

    const inspect = (buf) => {
      let bad = 0;
      for (let y = 0; y < height; y++) {
        const inRingY = y < ringY || y >= height - ringY;
        const outsideY = y < box.y0 || y >= box.y1;
        for (let x = 0; x < width; x++) {
          const checked = inRingY || outsideY || x < ringX || x >= width - ringX || x < box.x0 || x >= box.x1;
          if (!checked) continue;
          const i = (y * width + x) * 3;
          const min = Math.min(buf[i], buf[i + 1], buf[i + 2]);
          if (min < darkest) darkest = min;
          if (min < MIN_WHITE) bad++;
        }
      }
      frames++;
      if (bad) {
        failingFrames++;
        failingPixels += bad;
      }
    };

    proc.stdout.on("data", (chunk) => {
      pending = pending.length ? Buffer.concat([pending, chunk]) : chunk;
      while (pending.length >= frameBytes) {
        inspect(pending.subarray(0, frameBytes));
        pending = pending.subarray(frameBytes);
      }
    });
    let stderr = "";
    proc.stderr.on("data", (d) => (stderr += d));
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code !== 0) return reject(new Error(`ffmpeg failed on ${file}\n${stderr}`));
      resolve({ frames, failingFrames, failingPixels, darkest });
    });
  });
}

let failed = false;
const keyed = clips.filter((c) => c.keyWhite && (c.ship !== false || process.argv.includes(c.id)));
if (!keyed.length) console.log("No shipped loop is keyed to white. Name an id to check one anyway.");
for (const clip of keyed) {
  const variants = [{ suffix: "", width: WIDTH, height: HEIGHT }];
  if (clip.mobile) variants.push({ suffix: "-640", width: MOBILE_WIDTH, height: MOBILE_HEIGHT });
  for (const v of variants) {
    for (const ext of ["webm", "mp4"]) {
      const file = path.join(OUT, `${clip.id}${v.suffix}.${ext}`);
      if (!fs.existsSync(file)) {
        console.error(`${path.basename(file)}: missing`);
        failed = true;
        continue;
      }
      const r = await check(file, v.width, v.height, clip.keyWhite.safe);
      const ok = r.failingPixels === 0;
      if (!ok) failed = true;
      console.log(
        `${path.basename(file).padEnd(22)} ${ok ? "PASS" : "FAIL"}  ${r.frames} frames, darkest checked value ${r.darkest}` +
          (ok ? "" : `, ${r.failingPixels} pixels below ${MIN_WHITE} in ${r.failingFrames} frames`),
      );
    }
  }
}
process.exit(failed ? 1 : 0);
