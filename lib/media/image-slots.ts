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
//   "stock"        a free licence stock photo (CC0 or public domain, from
//                  Wikimedia Commons) fills the slot, with its credit
//                  recorded. No people. Still a placeholder until the
//                  ministry supplies its own photo.
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
export type ImageSlotStatus = "interim" | "stock" | "real-needed" | "final";

/** Where a stock photo came from. Only CC0 and public domain, so no on-page credit is owed. */
export type ImageCredit = { author: string; source: string; licence: "CC0" | "Public domain" };

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
  /** Required for a "stock" slot (slot-images.test.ts checks). */
  credit?: ImageCredit;
};

export const REAL_PHOTO_NEEDED = "real photo needed, do not use generated people";
export const REAL_SCREENSHOT_NEEDED = "real app screenshot needed, do not use generated screens";

export const IMAGE_SLOTS = {
  "home-teacher": {
    page: "Home, The teacher",
    ratio: "4/5",
    kind: "photo",
    brief: "Isaac Ola teaching",
    alt: "Isaac Ola teaching from an open Bible",
    status: "real-needed",
  },
  "home-start-here": {
    page: "Home, Teachings (only when no video resolves)",
    ratio: "16/9",
    kind: "video",
    brief: "a first teaching for someone new to the ministry",
    alt: "An open Bible on a dark wooden desk, ready for a first teaching",
    status: "stock",
    credit: {
      author: "John-Mark Kuznietsov (Unsplash)",
      source: "https://commons.wikimedia.org/wiki/File:John-Mark_Kuznietsov_2016-12-13_(Unsplash).jpg",
      licence: "CC0",
    },
  },
  // Home, "Where are you starting from?": one image per card, no people,
  // so a stock photo stands in until the ministry supplies its own.
  "home-start-new": {
    page: "Home, Where are you starting from? (01, New to the Bible)",
    ratio: "3/2",
    kind: "photo",
    brief: "a Bible opened for the first time, morning light",
    alt: "A Bible lying open on a wooden table in sunlight, autumn leaves around it",
    decorative: true,
    status: "stock",
    credit: {
      author: "Aaron Burden (Unsplash)",
      source:
        "https://commons.wikimedia.org/wiki/File:Bokeh_photo_of_an_English_Bible,_opened_at_Psalm_143,_with_fallen_leaves_(Unsplash).jpg",
      licence: "CC0",
    },
  },
  "home-start-connect": {
    page: "Home, Where are you starting from? (02, How the stories connect)",
    ratio: "3/2",
    kind: "photo",
    brief: "an open Bible, read from one book to the next",
    alt: "An open Bible on a table, its pages ready to read",
    decorative: true,
    status: "stock",
    credit: {
      author: "Aaron Burden (Unsplash)",
      source: "https://commons.wikimedia.org/wiki/File:Reading_Scripture_(Unsplash).jpg",
      licence: "CC0",
    },
  },
  "home-start-question": {
    page: "Home, Where are you starting from? (03, Carrying a question)",
    ratio: "3/2",
    kind: "photo",
    brief: "a notebook and pen, ready for a question",
    alt: "A pen resting on a closed notebook",
    decorative: true,
    status: "stock",
    credit: {
      author: "Thomas Martinsen (Unsplash)",
      source: "https://commons.wikimedia.org/wiki/File:Pen_on_a_notebook_(Unsplash).jpg",
      licence: "CC0",
    },
  },
  // About, "What we believe": one image per card, no people.
  "about-belief-context": {
    page: "/about, What we believe (01, Context first)",
    ratio: "3/2",
    kind: "photo",
    brief: "the Scriptures as first written, on scrolls",
    alt: "A set of Hebrew scrolls of the Scriptures laid open",
    decorative: true,
    status: "stock",
    credit: {
      author: "Pete Unseth",
      source: "https://commons.wikimedia.org/wiki/File:Entire_Tanakh_scroll_set.png",
      licence: "CC0",
    },
  },
  "about-belief-scripture": {
    page: "/about, What we believe (02, Scripture in full)",
    ratio: "3/2",
    kind: "photo",
    brief: "an open Bible, whole pages of text",
    alt: "A Bible lying open, its pages of text in close view",
    decorative: true,
    status: "stock",
    credit: {
      author: "John-Mark Kuznietsov (Unsplash)",
      source: "https://commons.wikimedia.org/wiki/File:Bible_(Unsplash).jpg",
      licence: "CC0",
    },
  },
  "about-belief-text": {
    page: "/about, What we believe (03, A clear text)",
    ratio: "3/2",
    kind: "photo",
    brief: "the title page of the 1611 King James Bible",
    alt: "The engraved title page of the first King James Bible, 1611",
    decorative: true,
    status: "stock",
    credit: {
      author: "Church of England, 1611 (University of Pennsylvania scan)",
      source: "https://commons.wikimedia.org/wiki/File:King-James-Version-Bible-first-edition-title-page-1611.png",
      licence: "Public domain",
    },
  },
  "about-belief-plain": {
    page: "/about, What we believe (04, Plain English)",
    ratio: "3/2",
    kind: "photo",
    brief: "an open Bible on a table in soft daylight",
    alt: "An open Bible on a table in soft daylight, plants behind it",
    decorative: true,
    status: "stock",
    credit: {
      author: "Ben White (Unsplash)",
      source: "https://commons.wikimedia.org/wiki/File:Open_book_(Unsplash).jpg",
      licence: "CC0",
    },
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
  "academy-teacher": {
    page: "/academy, Why learn here",
    ratio: "4/5",
    kind: "photo",
    brief: "the teacher leading an online class",
    alt: "The teacher of House of Bread Global leading an online Academy class, with the Bible open",
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
