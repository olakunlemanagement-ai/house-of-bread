// Looks up the built image for a slot. The manifest is written by
// scripts/images/build-slots.mjs alongside public/images/slots/<id>.webp,
// and lib/media/slot-images.test.ts keeps the two in step.

import manifestJson from "./image-slots.manifest.json";
import { IMAGE_SLOTS, SLOT_IMAGE_DIR, type ImageSlotId, type SlotImage } from "./image-slots";

export const slotImageManifest = manifestJson as Partial<Record<string, SlotImage>>;

export function slotImageSrc(id: ImageSlotId): string {
  return `${SLOT_IMAGE_DIR}/${id}.webp`;
}

/**
 * The slot's image when one has been built, else undefined. A slot marked
 * "real-needed" never shows one, even if a file slipped through.
 */
export function getSlotImage(id: ImageSlotId): (SlotImage & { src: string }) | undefined {
  if (IMAGE_SLOTS[id].status === "real-needed") return undefined;
  const image = slotImageManifest[id];
  return image ? { ...image, src: slotImageSrc(id) } : undefined;
}
