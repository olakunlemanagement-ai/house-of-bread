// Every image slot on the site: where it sits, its shape, what belongs in it
// and whether a generated interim image may fill it. Framework free, so
// scripts/images/build-slots.mjs reads it directly. The table in
// docs/PLACEHOLDERS.md mirrors this list.
//
// status:
//   "interim"      an AI generated placeholder image may fill the slot until
//                  a real photo arrives. It still counts as a placeholder.
//   "real-needed"  people (the teacher, the congregation, the community) or
//                  the app's own screens. Only a real photo or screenshot
//                  will do, so the slot keeps the designed placeholder and
//                  the build script refuses any file for it.
//   "final"        a real photo or screenshot has been supplied. Switch a
//                  slot to "final" in the same commit that adds it.

/** Output budget per image in bytes, 1 KB = 1000. */
export const SLOT_IMAGE_BUDGET = 150_000;
/** Widest rendition kept. next/image makes the smaller ones. */
export const SLOT_IMAGE_MAX_WIDTH = 1600;
/** Public folder for built slot images, served at /images/slots/<id>.webp. */
export const SLOT_IMAGE_DIR = "/images/slots";

export type ImageSlotRatio = "16/9" | "4/5" | "1/1" | "3/2";
export type ImageSlotKind = "photo" | "video" | "screenshot";
export type ImageSlotStatus = "interim" | "real-needed" | "final";

export type ImageSlotDef = {
  page: string;
  ratio: ImageSlotRatio;
  kind: ImageSlotKind;
  /** What belongs here, as a phrase. Shown in the placeholder caption. */
  brief: string;
  /** Alt text for the image once present. Check it against the image when one lands. */
  alt: string;
  /** True only when the image adds nothing a reader would miss. Renders alt="". */
  decorative?: boolean;
  status: ImageSlotStatus;
};

export const REAL_PHOTO_NEEDED = "real photo needed, do not use generated people";
export const REAL_SCREENSHOT_NEEDED = "real app screenshot needed, do not use generated screens";

export const IMAGE_SLOTS = {
  "home-live-session": {
    page: "Home, Next live session",
    ratio: "4/5",
    kind: "photo",
    brief: "the teacher in a live session",
    alt: "The teacher on camera during a live teaching session, with the Bible open",
    status: "real-needed",
  },
  "home-start-here": {
    page: "Home, Start here (only when no video resolves)",
    ratio: "16/9",
    kind: "video",
    brief: "a first teaching for someone new to the ministry",
    alt: "An open Bible ready for a first teaching from House of Bread Global",
    status: "interim",
  },
  "about-mission": {
    page: "/about, Mission",
    ratio: "16/9",
    kind: "photo",
    brief: "believers following a live teaching online, with open Bibles",
    alt: "Believers following a live teaching online, with open Bibles beside the stream",
    status: "real-needed",
  },
  "about-leadership": {
    page: "/about, Leadership",
    ratio: "4/5",
    kind: "photo",
    brief: "a portrait of the teacher",
    alt: "Portrait of the teacher of House of Bread Global",
    status: "real-needed",
  },
  "events-how-it-works": {
    page: "/events, How it works",
    ratio: "4/5",
    kind: "photo",
    brief: "a session streaming live, the teacher on camera",
    alt: "A House of Bread session streaming live on YouTube, the teacher on camera",
    status: "real-needed",
  },
  "app-journeys": {
    page: "/app, New Testament journeys",
    ratio: "16/9",
    kind: "screenshot",
    brief: "a journey's daily reading and progress",
    alt: "The House of Bread app showing a journey's daily reading and progress",
    status: "real-needed",
  },
  "app-books": {
    page: "/app, Every book introduced",
    ratio: "16/9",
    kind: "screenshot",
    brief: "a book introduction",
    alt: "The House of Bread app showing the introduction to a New Testament book",
    status: "real-needed",
  },
  "app-translations": {
    page: "/app, Six translations",
    ratio: "16/9",
    kind: "screenshot",
    brief: "switching between translations",
    alt: "The House of Bread app switching a passage between Bible translations",
    status: "real-needed",
  },
  "app-teaching": {
    page: "/app, The ministry's teaching",
    ratio: "16/9",
    kind: "screenshot",
    brief: "the teaching library",
    alt: "The House of Bread app showing its library of written teaching",
    status: "real-needed",
  },
} as const satisfies Record<string, ImageSlotDef>;

export type ImageSlotId = keyof typeof IMAGE_SLOTS;

export const IMAGE_SLOT_IDS = Object.keys(IMAGE_SLOTS) as ImageSlotId[];

export function getImageSlot(id: ImageSlotId): ImageSlotDef {
  return IMAGE_SLOTS[id];
}

/** Why a slot refuses generated images, or undefined when it accepts them. */
export function lockReason(slot: ImageSlotDef): string | undefined {
  if (slot.status !== "real-needed") return undefined;
  return slot.kind === "screenshot" ? REAL_SCREENSHOT_NEEDED : REAL_PHOTO_NEEDED;
}

/** Width over height, from "w/h". */
export function ratioValue(ratio: ImageSlotRatio): number {
  const [w, h] = ratio.split("/").map(Number);
  return w / h;
}

/** A built slot image, as recorded in image-slots.manifest.json by the build script. */
export type SlotImage = {
  width: number;
  height: number;
  bytes: number;
  blurDataURL: string;
};
