import { z } from "zod";
import { MAX_LINKS, QUESTION_MAX, QUESTION_MIN, questionTopics } from "./fields";

const LINK_PATTERN = /(?:https?:\/\/|www\.)\S+/gi;

export function countLinks(text: string): number {
  return text.match(LINK_PATTERN)?.length ?? 0;
}

// Line endings normalised, and control characters other than tab and new
// line removed, before the length is counted.
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
