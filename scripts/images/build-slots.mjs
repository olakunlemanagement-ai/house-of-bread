// Builds the images that fill ImageSlots.
//
//   npm run images:build            build every raw file
//   npm run images:build -- --prune also drop built images with no raw file
//
// Reads <slot id>.png or <slot id>.jpg from SLOTS_RAW_DIR, by default
// ../house-of-bread-assets/slot-images-raw beside the repo. Raw files never
// enter the repo. Each is cropped to its slot's ratio (centred), resized to
// at most 1600 wide and written as public/images/slots/<id>.webp at 150 KB
// or less, stepping WebP quality down until it fits. The size, a 16 wide
// blur placeholder and the byte count go into
// lib/media/image-slots.manifest.json, which ImageSlot reads.
//
// Checks every file before writing anything. Exits 1 if a file name does
// not match a slot, the slot needs a real photo, or an image cannot reach
// the budget. Uses the sharp that Next.js already installs.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import {
  IMAGE_SLOTS,
  SLOT_IMAGE_BUDGET,
  SLOT_IMAGE_DIR,
  SLOT_IMAGE_MAX_WIDTH,
  lockReason,
  ratioValue,
} from "../../lib/media/image-slots.ts";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const RAW = process.env.SLOTS_RAW_DIR ?? path.resolve(ROOT, "..", "house-of-bread-assets", "slot-images-raw");
const OUT = path.join(ROOT, "public", ...SLOT_IMAGE_DIR.split("/").filter(Boolean));
const MANIFEST = path.join(ROOT, "lib", "media", "image-slots.manifest.json");
const PRUNE = process.argv.includes("--prune");

/** WebP qualities tried in order. The first that fits the budget is kept. */
const QUALITIES = [82, 76, 70, 64, 58, 52];
const BLUR_WIDTH = 16;
/** Below this width the image will look soft on large screens. Warn, do not fail. */
const SOFT_WIDTH = 1200;

const kb = (bytes) => `${(bytes / 1000).toFixed(1)} KB`;

function fail(errors) {
  console.error(`Slot images not built:\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  process.exit(1);
}

if (!fs.existsSync(RAW)) {
  fail([`raw folder not found: ${RAW}. Create it, or set SLOTS_RAW_DIR.`]);
}

// 1. Check every raw file name against the registry.
const errors = [];
const jobs = new Map();
for (const entry of fs.readdirSync(RAW, { withFileTypes: true })) {
  if (entry.name.startsWith(".")) continue;
  const match = /^(.+)\.(png|jpe?g)$/i.exec(entry.name);
  if (!entry.isFile() || !match) {
    errors.push(`${entry.name}: expected <slot id>.png or <slot id>.jpg`);
    continue;
  }
  const id = match[1];
  const slot = Object.hasOwn(IMAGE_SLOTS, id) ? IMAGE_SLOTS[id] : undefined;
  if (!slot) {
    errors.push(`${entry.name}: no slot named "${id}". Slots: ${Object.keys(IMAGE_SLOTS).join(", ")}`);
    continue;
  }
  const locked = lockReason(slot);
  if (locked) {
    errors.push(
      `${entry.name}: ${locked}. If this is a real photo, set the slot's status to "final" in lib/media/image-slots.ts`,
    );
    continue;
  }
  if (jobs.has(id)) {
    errors.push(`${entry.name}: a second raw file for "${id}" (${jobs.get(id)})`);
    continue;
  }
  jobs.set(id, entry.name);
}
if (errors.length > 0) fail(errors);

// 2. Crop, resize and encode in memory. Nothing is written until all fit.
async function build(id, name) {
  const ratio = ratioValue(IMAGE_SLOTS[id].ratio);
  const { data: upright, info } = await sharp(path.join(RAW, name)).rotate().toBuffer({ resolveWithObject: true });
  const cropWidth = Math.min(info.width, Math.floor(info.height * ratio));
  const width = Math.min(SLOT_IMAGE_MAX_WIDTH, cropWidth);
  const height = Math.round(width / ratio);
  const sized = await sharp(upright).resize(width, height, { fit: "cover", position: "centre" }).toBuffer();

  let webp;
  let quality;
  for (quality of QUALITIES) {
    webp = await sharp(sized).webp({ quality, effort: 6, smartSubsample: true }).toBuffer();
    if (webp.length <= SLOT_IMAGE_BUDGET) break;
  }
  if (webp.length > SLOT_IMAGE_BUDGET) {
    return { error: `${name}: ${kb(webp.length)} at quality ${quality}, over the ${kb(SLOT_IMAGE_BUDGET)} budget` };
  }

  const blur = await sharp(sized)
    .resize(BLUR_WIDTH, Math.max(1, Math.round(BLUR_WIDTH / ratio)))
    .webp({ quality: 40 })
    .toBuffer();

  return {
    id,
    name,
    quality,
    source: `${info.width}x${info.height}`,
    webp,
    entry: { width, height, bytes: webp.length, blurDataURL: `data:image/webp;base64,${blur.toString("base64")}` },
  };
}

const results = await Promise.all([...jobs].map(([id, name]) => build(id, name)));
const overBudget = results.filter((r) => r.error).map((r) => r.error);
if (overBudget.length > 0) fail(overBudget);

// 3. Write the images and the manifest, in registry order.
const previous = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};
const manifest = {};
const removed = [];
const kept = [];
fs.mkdirSync(OUT, { recursive: true });

for (const id of Object.keys(IMAGE_SLOTS)) {
  const built = results.find((r) => r.id === id);
  if (built) {
    fs.writeFileSync(path.join(OUT, `${id}.webp`), built.webp);
    manifest[id] = built.entry;
  } else if (previous[id]) {
    if (PRUNE || lockReason(IMAGE_SLOTS[id])) removed.push(id);
    else {
      manifest[id] = previous[id];
      kept.push(id);
    }
  }
}
// Outputs for slots that are gone, locked, or pruned.
for (const file of fs.readdirSync(OUT)) {
  const id = file.replace(/\.webp$/, "");
  if (!manifest[id]) {
    fs.rmSync(path.join(OUT, file));
    if (!removed.includes(id)) removed.push(id);
  }
}
fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

for (const r of results) {
  const soft = r.entry.width < SOFT_WIDTH ? `  (soft: source only ${r.source})` : "";
  console.log(
    `${r.id.padEnd(22)} ${`${r.entry.width}x${r.entry.height}`.padEnd(10)} ${kb(r.entry.bytes).padStart(9)}  q${r.quality}${soft}`,
  );
  console.log(`${"".padEnd(22)} alt: "${IMAGE_SLOTS[r.id].alt}"`);
}
if (kept.length > 0) console.log(`Kept with no raw file (use --prune to drop): ${kept.join(", ")}`);
if (removed.length > 0) console.log(`Removed: ${removed.join(", ")}`);
console.log(`Built ${results.length} slot image(s). Check each alt text against its image.`);
