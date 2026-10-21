import { z } from "zod";

export const newsletterSources = [
  "footer",
  "subscribe-page",
  "live-notify",
  "plan-page",
  "academy-waitlist",
] as const;
export type NewsletterSource = (typeof newsletterSources)[number];

/** Treats an empty or whitespace-only string as absent. */
const optionalText = (max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(max).optional(),
  );

/**
 * Signup input. Accepts both JSON bodies and form posts, so the checkbox
 * arrives either as a boolean or as the string a checked box sends.
 * The honeypot is checked before this schema runs, so it is not listed.
 */
export const subscribeSchema = z.object({
  email: z.string().trim().max(254).pipe(z.email()),
  firstName: optionalText(100),
  liveNotify: z
    .union([z.boolean(), z.enum(["on", "true", "live-notify"])])
    .optional()
    .transform((value) => value !== undefined && value !== false),
  source: z.enum(newsletterSources),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;

/** Name of the hidden field people leave empty and many bots fill. */
export const HONEYPOT_FIELD = "website";
