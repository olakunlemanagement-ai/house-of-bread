// Finds the worst case colours of each decorative loop, for the contrast
// check of any text that sits over one (through a scrim or glass card).
//
//   node scripts/loops/sample-extremes.mjs
//
// Decodes every frame of each final WebM to RGB and reports the darkest and
// brightest single pixel (by relative luminance) and the darkest and
// brightest frame (by mean luminance). Dark ink text is at its worst over
// the darkest pixel; white text would be at its worst over the brightest.
// Copy the values into scripts/check-contrast.mjs. No dependencies.

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HEIGHT, WIDTH, clips } from "./config.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const OUT = path.join(ROOT, "public", "media", "loops");
const FFMPEG = process.env.FFMPEG ?? "ffmpeg";

const linear = new Float64Array(256).map((_, v) => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
});
const luminance = (r, g, b) => 0.2126 * linear[r] + 0.7152 * linear[g] + 0.0722 * linear[b];
const hex = ([r, g, b]) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;

function sample(file) {
  const frameBytes = WIDTH * HEIGHT * 3;
  return new Promise((resolve, reject) => {
    const proc = spawn(FFMPEG, ["-v", "error", "-i", file, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]);
    let pending = Buffer.alloc(0);
    const result = {
      darkest: { l: Infinity, rgb: [0, 0, 0] },
      brightest: { l: -Infinity, rgb: [0, 0, 0] },
      darkFrame: { l: Infinity, index: 0 },
      brightFrame: { l: -Infinity, index: 0 },
      frames: 0,
    };
    const inspect = (buf) => {
      let sum = 0;
      for (let i = 0; i < buf.length; i += 3) {
        const l = luminance(buf[i], buf[i + 1], buf[i + 2]);
        sum += l;
        if (l < result.darkest.l) result.darkest = { l, rgb: [buf[i], buf[i + 1], buf[i + 2]] };
        if (l > result.brightest.l) result.brightest = { l, rgb: [buf[i], buf[i + 1], buf[i + 2]] };
      }
      const mean = sum / (buf.length / 3);
      if (mean < result.darkFrame.l) result.darkFrame = { l: mean, index: result.frames };
      if (mean > result.brightFrame.l) result.brightFrame = { l: mean, index: result.frames };
      result.frames++;
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
    proc.on("close", (code) => (code === 0 ? resolve(result) : reject(new Error(stderr))));
  });
}

for (const clip of clips.filter((c) => c.ship !== false)) {
  const r = await sample(path.join(OUT, `${clip.id}.webm`));
  console.log(
    `${clip.id.padEnd(14)} darkest px ${hex(r.darkest.rgb)} (L ${r.darkest.l.toFixed(4)})  ` +
      `brightest px ${hex(r.brightest.rgb)} (L ${r.brightest.l.toFixed(4)})  ` +
      `darkest frame #${r.darkFrame.index} mean L ${r.darkFrame.l.toFixed(3)}  ` +
      `brightest frame #${r.brightFrame.index} mean L ${r.brightFrame.l.toFixed(3)}`,
  );
}
