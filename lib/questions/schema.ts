import { z } from "zod";

export const QUESTION_MIN = 10;
export const QUESTION_MAX = 1000;
/** More links than this and the question is rejected as likely spam. */
export const MAX_LINKS = 1;

export const questionTopics = ["scripture", "doctrine", "christian-living", "other"] as const;
export type QuestionTopic = (typeof questionTopics)[number];

export const topicLabels: Record<QuestionTopic, string> = {
  scripture: "Scripture",
  doctrine: "Doctrine",
  "christian-living": "Christian living",
  other: "Other",
};

/** Name of the hidden field people leave empty and many bots fill. */
export const HONEYPOT_FIELD = "website";

const LINK_PATTERN = /(?:https?:\/\/|www\.)\S+/gi;

export function countLinks(text: string): number {
  return text.match(LINK_PATTERN)?.length ?? 0;
}

// Line endings normalised, and control characters other than tab and new
// line removed, before the length is counted.
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const clean = (value: unknown) =>
  typeof value === "string" ? value.replace(/\r\n?/g, "\n").replace(CONTROL, "").trim() : value;

/**
 * An anonymous question. Only the text and an optional topic. The honeypot
 * is checked before this schema runs, so it is not listed.
 */
export const questionSchema = z.object({
  question: z.preprocess(
    clean,
    z
      .string()
      .min(QUESTION_MIN, "too-short")
      .max(QUESTION_MAX, "too-long")
      .refine((text) => countLinks(text) <= MAX_LINKS, "too-many-links"),
  ),
  topic: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.enum(questionTopics).optional(),
  ),
});

export type QuestionInput = z.infer<typeof questionSchema>;
