// Builds the 3D card icons from Microsoft Fluent Emoji (MIT, see
// docs/CREDITS.md). Raw PNGs stay outside the repo; only the icons in use
// are written, as 160px WebP, and any file over 15 KB fails the build.
//
//   node scripts/icons/build-icons.mjs <folder of fluentui-emoji *_3d.png>
//
// Get a PNG from github.com/microsoft/fluentui-emoji, assets/<Name>/3D/.
// Uses sharp, which ships with Next.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = path.join(ROOT, "public", "icons", "3d");
const MAX_BYTES = 15 * 1024;
const SIZE = 160;

/** Output name -> Fluent file. Keep in step with components/shared/Icon3D.tsx. */
export const ICONS = {
  television: "television_3d.png",
  "graduation-cap": "graduation_cap_3d.png",
  scroll: "scroll_3d.png",
  "mobile-phone": "mobile_phone_3d.png",
  "latin-cross": "latin_cross_3d.png",
  "magnifying-glass": "magnifying_glass_tilted_left_3d.png",
  "green-heart": "green_heart_3d.png",
};

const source = process.argv[2];
if (!source) {
  console.error("Pass the folder holding the Fluent *_3d.png files.");
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });
let failed = false;
for (const [name, file] of Object.entries(ICONS)) {
  const out = path.join(OUT, `${name}.webp`);
  await sharp(path.join(source, file))
    .resize(SIZE, SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 82, alphaQuality: 90, effort: 6 })
    .toFile(out);
  const bytes = fs.statSync(out).size;
  const ok = bytes <= MAX_BYTES;
  failed ||= !ok;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}.webp ${(bytes / 1024).toFixed(1)} KB`);
}
if (failed) {
  console.error(`An icon is over ${MAX_BYTES / 1024} KB.`);
  process.exit(1);
}
