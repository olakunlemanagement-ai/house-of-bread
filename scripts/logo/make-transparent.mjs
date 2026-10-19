// Cuts the white background out of the supplied logo and writes
// public/logo-mark.png with an alpha channel.
//
//   node scripts/logo/make-transparent.mjs [source.png] [out.png]
//
// Only white joined to the image border is removed (a flood fill from the
// edge), so the white cross inside the emblem stays. The 1px ring where the
// mark meets the cleared background is feathered and un-mixed from white, so
// no light halo shows on a tinted background. Uses sharp, which ships with
// Next. Replace the output with the ministry's SVG when it arrives.

import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const source = process.argv[2] ?? path.join(ROOT, "public", "house-of-bread-logo.png");
const out = process.argv[3] ?? path.join(ROOT, "public", "logo-mark.png");

/** A pixel counts as background white when its darkest channel is at least this. */
const WHITE_MIN = 235;
/** Output height in pixels: 36px in the header at up to 3x, with room to spare. */
const HEIGHT = 256;

const { data, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const isWhite = (i) => Math.min(data[i], data[i + 1], data[i + 2]) >= WHITE_MIN;

// 1. Flood fill from the border through near white pixels.
const bg = new Uint8Array(W * H);
const stack = [];
const seed = (x, y) => {
  const p = y * W + x;
  if (!bg[p] && isWhite(p * 3)) {
    bg[p] = 1;
    stack.push(p);
  }
};
for (let x = 0; x < W; x++) {
  seed(x, 0);
  seed(x, H - 1);
}
for (let y = 0; y < H; y++) {
  seed(0, y);
  seed(W - 1, y);
}
while (stack.length) {
  const p = stack.pop();
  const x = p % W;
  const y = (p - x) / W;
  if (x > 0) seed(x - 1, y);
  if (x < W - 1) seed(x + 1, y);
  if (y > 0) seed(x, y - 1);
  if (y < H - 1) seed(x, y + 1);
}

// 2. The ring of mark pixels touching the background.
const touchesBg = (x, y) => {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < W && ny < H && bg[ny * W + nx]) return true;
    }
  }
  return false;
};
const ring = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (!bg[y * W + x] && touchesBg(x, y)) ring[y * W + x] = 1;
  }
}

// 3. Feather and defringe the ring: estimate the true colour from solid
// neighbours, solve c = a*f + (1-a)*255 for alpha, then un-mix from white.
const rgba = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const p = y * W + x;
    const i = p * 3;
    const o = p * 4;
    if (bg[p]) continue; // fully transparent
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    let a = 1;
    if (ring[p]) {
      let fr = 0;
      let fg = 0;
      let fb = 0;
      let n = 0;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          const q = ny * W + nx;
          if (bg[q] || ring[q]) continue;
          fr += data[q * 3];
          fg += data[q * 3 + 1];
          fb += data[q * 3 + 2];
          n++;
        }
      }
      if (n > 0) {
        const f = [fr / n, fg / n, fb / n];
        const c = [r, g, b];
        let num = 0;
        let den = 0;
        for (let k = 0; k < 3; k++) {
          num += (255 - c[k]) * (255 - f[k]);
          den += (255 - f[k]) ** 2;
        }
        a = den > 0 ? Math.min(1, Math.max(0, num / den)) : 1;
        [r, g, b] = f;
      } else {
        // A one pixel thin stroke: plain colour to alpha against white.
        a = Math.max(255 - r, 255 - g, 255 - b) / 255;
        if (a > 0) [r, g, b] = [r, g, b].map((v) => Math.min(255, Math.max(0, (v - 255 * (1 - a)) / a)));
      }
    }
    rgba[o] = Math.round(r);
    rgba[o + 1] = Math.round(g);
    rgba[o + 2] = Math.round(b);
    rgba[o + 3] = Math.round(a * 255);
  }
}

await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
  .resize({ height: HEIGHT, kernel: "lanczos3" })
  .png({ compressionLevel: 9, palette: false })
  .toFile(out);

const meta = await sharp(out).metadata();
console.log(`Wrote ${path.relative(ROOT, out)}: ${meta.width}x${meta.height}, alpha ${meta.hasAlpha}`);
