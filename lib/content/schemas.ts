// Zod frontmatter schemas, one per content type. SPEC-v3 section 4.
// Framework free with relative imports, so scripts/validate-content.ts can
// run this under plain Node.

import { z } from "zod";
import { IMAGE_SLOT_IDS, type ImageSlotId } from "../media/image-slots.ts";
import { bookById, canonicalise, parseReference } from "../scripture/index.ts";

const isoDate = z.iso.date({ error: "must be a date written as YYYY-MM-DD" });

/** A canonical scripture reference. Human spellings are rejected here, with the fix named. */
const passage = z.string().superRefine((value, ctx) => {
  const result = parseReference(value);
  if (!result.ok) {
    ctx.addIssue({ code: "custom", message: result.error });
    return;
  }
  const canonical = canonicalise(value);
  if (canonical !== value) {
    ctx.addIssue({ code: "custom", message: `write "${value}" in canonical form as "${canonical}"` });
  }
});

const shared = {
  title: z.string().min(1),
  /** Must match the file name. Checked by the loader. */
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lower case words joined by hyphens"),
  description: z.string().min(1),
  date: isoDate,
  updated: isoDate.optional(),
  passages: z.array(passage).default([]),
  series: z.string().min(1).optional(),
  /** Sample content, not supplied by the ministry. Pages show a placeholder badge. */
  placeholder: z.boolean().default(false),
};

export const teachingSchema = z.strictObject({ ...shared });

export const bookSchema = z.strictObject({ ...shared }).superRefine((data, ctx) => {
  if (bookById(data.slug)?.testament !== "NT") {
    ctx.addIssue({
      code: "custom",
      path: ["slug"],
      message: `"${data.slug}" is not a canonical New Testament book id, for example "1-corinthians"`,
    });
  }
});

export const planSchema = z.strictObject({
  ...shared,
  days: z.union([z.literal(30), z.literal(60), z.literal(90)]),
  pace: z.string().min(1),
});

// House of Bread Academy: Category, Course (with its Sections), Lesson.
// Totals (lessons and time per section and course) are computed in
// lib/academy, never typed here. Cross-file rules (a lesson's course and
// section exist, lesson numbers run 1 to N, one Start Here course) live in
// lib/content/academy-checks.ts.

const slugValue = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lower case words joined by hyphens");
const youtubeId = z.string().regex(/^[A-Za-z0-9_-]{11}$/, "must be a YouTube video id (11 characters)");
const positiveInt = z.number().int().positive();
const isImageSlotId = (value: unknown): value is ImageSlotId =>
  typeof value === "string" && (IMAGE_SLOT_IDS as readonly string[]).includes(value);
/** An image slot id from lib/media/image-slots.ts. */
const imageSlot = z.custom<ImageSlotId>(isImageSlotId, {
  error: (issue) => `"${String(issue.input)}" is not an image slot in lib/media/image-slots.ts`,
});
/** A downloadable file, served from /public/academy. PDF only for now. */
const academyFile = z.string().regex(/^\/academy\/[a-z0-9][a-z0-9/-]*\.pdf$/, "must be a PDF path under /academy, for example /academy/notes/lesson-1.pdf");

export const academyCategorySchema = z.strictObject({
  title: z.string().min(1),
  slug: slugValue,
  /** Display order on /academy, 1 first. */
  order: positiveInt,
  placeholder: z.boolean().default(false),
});

/** Course tags, a fixed list so the labels stay consistent. */
export const courseTags = ["New", "Small-group guide"] as const;
export const resourceKinds = ["PDF"] as const;

const sectionSchema = z.strictObject({
  number: positiveInt,
  title: z.string().min(1),
  /** One paragraph. */
  description: z.string().min(1),
  image: imageSlot,
});

/** Brackets mark a placeholder; the reference inside them is still checked. */
const unbracket = (value: string) => value.replace(/^\[(.*)\]$/, "$1");

export const academyCourseSchema = z
  .strictObject({
    title: shared.title,
    slug: shared.slug,
    /** Opens with a question, then two or three sentences. */
    description: shared.description,
    date: shared.date,
    updated: shared.updated,
    placeholder: shared.placeholder,
    /** The passage the course covers, canonical, for example "Matthew 1-4". */
    scriptureRange: z.string().min(1),
    teacher: z.string().min(1).default("[Isaac Ola]"),
    /** "Meet your teacher", one or two short paragraphs. */
    teacherBio: z.string().min(1).optional(),
    /** A category slug from content/academy/categories. */
    category: slugValue,
    /** Order within its category, 1 first. */
    order: positiveInt,
    /** The one course pinned beside the catalogue for newcomers. */
    startHere: z.boolean().default(false),
    tags: z.array(z.enum(courseTags)).default([]),
    /** "What you'll learn". */
    outcomes: z.array(z.string().min(1)).min(3).max(9),
    image: imageSlot,
    trailerVideoId: youtubeId.optional(),
    resources: z
      .array(z.strictObject({ title: z.string().min(1), kind: z.enum(resourceKinds), file: academyFile.optional() }))
      .default([]),
    sections: z.array(sectionSchema).min(1),
  })
  .superRefine((data, ctx) => {
    // The first sentence is a question: nothing ends a sentence before the first "?".
    if (!/^[^.!]*\?/.test(data.description)) {
      ctx.addIssue({ code: "custom", path: ["description"], message: "must open with a question, ending in ?" });
    }
    const bracketed = /^\[.*\]$/.test(data.scriptureRange);
    if (bracketed && !data.placeholder) {
      ctx.addIssue({ code: "custom", path: ["scriptureRange"], message: "is in [brackets], so the course must be marked placeholder: true" });
    }
    const range = unbracket(data.scriptureRange);
    const parsed = parseReference(range);
    if (!parsed.ok) {
      ctx.addIssue({ code: "custom", path: ["scriptureRange"], message: parsed.error });
    } else if (canonicalise(range) !== range) {
      ctx.addIssue({ code: "custom", path: ["scriptureRange"], message: `write "${range}" in canonical form as "${canonicalise(range)}"` });
    }
    data.sections.forEach((section, index) => {
      if (section.number !== index + 1) {
        ctx.addIssue({ code: "custom", path: ["sections", index, "number"], message: `must be ${index + 1}: sections are numbered 1, 2, 3 in order` });
      }
    });
  });

export const academyLessonSchema = z.strictObject({
  title: z.string().min(1),
  /** Must match the file name. The URL is /academy/<course>/<slug>. */
  slug: slugValue,
  /** The course slug. Must match the folder: content/academy/lessons/<course>/. */
  course: slugValue,
  /** The section number within the course. */
  section: positiveInt,
  /** Position in the whole course, 1 to N across every section. */
  number: positiveInt,
  /** One line. */
  description: z.string().min(1),
  minutes: z.number().int().positive().max(600),
  videoId: youtubeId.optional(),
  /** Plain text, paragraphs separated by a blank line. Moves to content/transcripts in stage two. */
  transcript: z.string().min(1).optional(),
  reflection: z.strictObject({ question: z.string().min(1), response: z.string().min(1) }).optional(),
  /** The lesson's notes as a PDF, for "Download notes". */
  notesFile: academyFile.optional(),
  placeholder: z.boolean().default(false),
});

export const eventKinds = ["live", "training", "meeting"] as const;
export const eventStatuses = ["scheduled", "live", "replay"] as const;

const timeZones = new Set(Intl.supportedValuesOf("timeZone"));
const youtubeHosts = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"]);

/** The facts only the ministry can supply. Null is allowed on placeholder events only. */
const eventFacts = ["startsAtUtc", "timeZone", "durationMinutes", "youtubeUrl"] as const;

export const eventSchema = z
  .strictObject({
    ...shared,
    kind: z.enum(eventKinds),
    status: z.enum(eventStatuses),
    startsAtUtc: z.iso
      .datetime({ error: "must be an ISO date and time in UTC ending in Z, for example 2026-11-01T18:00:00Z" })
      .nullable(),
    timeZone: z
      .string()
      .refine((zone) => timeZones.has(zone), {
        error: (issue) => `"${String(issue.input)}" is not a known IANA time zone, for example "Europe/London"`,
      })
      .nullable(),
    durationMinutes: z.number().int().positive().max(24 * 60).nullable(),
    youtubeUrl: z
      .url({ protocol: /^https$/, error: "must be an https URL" })
      .refine((url) => youtubeHosts.has(new URL(url).hostname), "must be a YouTube link")
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.placeholder) return;
    for (const field of eventFacts) {
      if (data[field] === null) {
        ctx.addIssue({
          code: "custom",
          path: [field],
          message: "is required unless the event is marked placeholder: true",
        });
      }
    }
  });


/**
 * A manual title or description for one YouTube video, shown on Teachings
 * in place of YouTube's own (lib/youtube). The file is named after the
 * video id: content/videos/<videoId>.mdx. The body is not used.
 */
export const videoSchema = z
  .strictObject({
    slug: z.string().regex(/^[A-Za-z0-9_-]{11}$/, "must be the YouTube video id (11 characters), matching the file name"),
    title: z.string().trim().min(1).max(200).optional(),
    /** One or two sentences for the hero and cards; paragraphs on the watch page. */
    description: z.string().trim().min(1).max(2000).optional(),
  })
  .refine((data) => data.title !== undefined || data.description !== undefined, {
    message: "needs a title, a description or both",
  });

export const schemas = {
  teaching: teachingSchema,
  book: bookSchema,
  plan: planSchema,
  event: eventSchema,
  academyCategory: academyCategorySchema,
  academyCourse: academyCourseSchema,
  academyLesson: academyLessonSchema,
  video: videoSchema,
} as const;

export type ContentType = keyof typeof schemas;

export const contentDirs: Record<ContentType, string> = {
  teaching: "teachings",
  book: "books",
  plan: "plans",
  event: "events",
  academyCategory: "academy/categories",
  academyCourse: "academy/courses",
  academyLesson: "academy/lessons",
  video: "videos",
};

export type ContentData = { [K in ContentType]: z.output<(typeof schemas)[K]> };

export type TeachingData = ContentData["teaching"];
export type BookData = ContentData["book"];
export type PlanData = ContentData["plan"];
export type EventData = ContentData["event"];
export type AcademyCategoryData = ContentData["academyCategory"];
export type AcademyCourseData = ContentData["academyCourse"];
export type AcademyLessonData = ContentData["academyLesson"];
export type VideoData = ContentData["video"];
export type EventKind = EventData["kind"];
export type EventStatus = EventData["status"];
