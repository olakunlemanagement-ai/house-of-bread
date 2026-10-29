// Zod frontmatter schemas, one per content type. SPEC-v3 section 4.
// Framework free with relative imports, so scripts/validate-content.ts can
// run this under plain Node.

import { z } from "zod";
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

export const classSchema = z.strictObject({
  ...shared,
  audience: z.string().min(1).optional(),
  schedule: z.string().min(1).optional(),
  joinUrl: z.url({ protocol: /^https$/, error: "must be an https URL" }).optional(),
  cost: z.string().min(1).optional(),
  /** Number of lessons, shown on course cards. Until supplied, cards show "[6]". */
  lessons: z.number().int().positive().optional(),
  /** Typical length of one lesson in minutes. Until supplied, cards show "[20]". */
  minutesPerLesson: z.number().int().positive().optional(),
  /** "What you'll learn" on the course page: three to five short lines. */
  outcomes: z.array(z.string().min(1)).min(3).max(5).optional(),
  /** "Lessons" on the course page: the lesson titles, in order. */
  outline: z.array(z.string().min(1)).min(1).optional(),
  /** Who teaches it. Until supplied, the page shows "[Isaac Ola]". */
  teacher: z.string().min(1).optional(),
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
  class: classSchema,
  video: videoSchema,
} as const;

export type ContentType = keyof typeof schemas;

export const contentDirs: Record<ContentType, string> = {
  teaching: "teachings",
  book: "books",
  plan: "plans",
  event: "events",
  class: "classes",
  video: "videos",
};

export type ContentData = { [K in ContentType]: z.output<(typeof schemas)[K]> };

export type TeachingData = ContentData["teaching"];
export type BookData = ContentData["book"];
export type PlanData = ContentData["plan"];
export type EventData = ContentData["event"];
export type ClassData = ContentData["class"];
export type VideoData = ContentData["video"];
export type EventKind = EventData["kind"];
export type EventStatus = EventData["status"];
