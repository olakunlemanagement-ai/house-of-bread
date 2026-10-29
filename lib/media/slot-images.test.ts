import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  IMAGE_SLOTS,
  IMAGE_SLOT_IDS,
  SLOT_IMAGE_BUDGET,
  SLOT_IMAGE_DIR,
  SLOT_IMAGE_MAX_WIDTH,
  lockReason,
  ratioValue,
  type ImageSlotDef,
  type ImageSlotId,
} from "./image-slots";
import { getSlotImage, slotImageManifest } from "./slot-images";

const OUT = path.join(process.cwd(), "public", SLOT_IMAGE_DIR);
const slots: Record<string, ImageSlotDef> = IMAGE_SLOTS;

describe("image slot registry", () => {
  it("uses kebab case ids", () => {
    for (const id of IMAGE_SLOT_IDS) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("gives every slot alt text unless it is decorative", () => {
    for (const id of IMAGE_SLOT_IDS) {
      const slot = slots[id];
      if (!slot.decorative) expect(slot.alt.trim().length, id).toBeGreaterThan(0);
    }
  });

  it("credits every stock photo, and only stock photos", () => {
    for (const id of IMAGE_SLOT_IDS) {
      const slot = slots[id];
      if (slot.status === "stock") {
        expect(slot.credit?.author, id).toBeTruthy();
        expect(slot.credit?.source, id).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      } else {
        expect(slot.credit, id).toBeUndefined();
      }
    }
  });

  it("locks every slot meant for people or app screens", () => {
    for (const id of ["home-teacher", "about-mission", "about-leadership", "academy-teacher", "events-how-it-works"] as const) {
      expect(lockReason(IMAGE_SLOTS[id]), id).toMatch(/real photo needed/);
    }
    for (const id of ["app-journeys", "app-books", "app-translations", "app-teaching"] as const) {
      expect(lockReason(IMAGE_SLOTS[id]), id).toMatch(/real app screenshot needed/);
    }
  });
});

describe("built slot images", () => {
  const entries = Object.entries(slotImageManifest);

  it("names only known slots, and none that need a real photo", () => {
    for (const [id] of entries) {
      expect(slots[id], `${id} is not in lib/media/image-slots.ts`).toBeDefined();
      expect(slots[id].status, id).not.toBe("real-needed");
    }
  });

  for (const [id, image] of entries) {
    if (!image || !slots[id]) continue;
    it(`${id}: file exists, fits the budget and the slot's ratio`, () => {
      const file = path.join(OUT, `${id}.webp`);
      expect(fs.existsSync(file), file).toBe(true);
      const bytes = fs.statSync(file).size;
      expect(bytes).toBe(image.bytes);
      expect(bytes).toBeLessThanOrEqual(SLOT_IMAGE_BUDGET);
      expect(image.width).toBeLessThanOrEqual(SLOT_IMAGE_MAX_WIDTH);
      expect(Math.abs(image.width / ratioValue(slots[id].ratio) - image.height)).toBeLessThanOrEqual(1);
      expect(image.blurDataURL).toMatch(/^data:image\/webp;base64,/);
      expect(image.blurDataURL.length).toBeLessThan(1_000);
    });
  }

  it("ships no file the manifest does not name", () => {
    const files = fs.existsSync(OUT) ? fs.readdirSync(OUT) : [];
    expect(files.filter((file) => !(file.replace(/\.webp$/, "") in slotImageManifest))).toEqual([]);
  });

  it("never serves an image for a slot that needs a real photo", () => {
    for (const id of IMAGE_SLOT_IDS) {
      if (IMAGE_SLOTS[id].status === "real-needed") expect(getSlotImage(id as ImageSlotId)).toBeUndefined();
    }
  });
});
