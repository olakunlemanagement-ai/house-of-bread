import { z } from "zod";

export const newsletterSources = [
  "footer",
  "subscribe-page",
  "live-notify",
  "plan-page",
  "academy-waitlist",
] as const;
export type NewsletterSource = (typeof newsletterSources)[number];

/**
 * Sources a link may ask /subscribe to use, as /subscribe?source=<source>.
 * Anything else, or no source, is recorded as "subscribe-page".
 */
export const linkableSources = ["academy-waitlist"] as const satisfies readonly NewsletterSource[];

/** The source for a /subscribe signup, from its ?source= query value. */
export function subscribePageSource(value: unknown): NewsletterSource {
  return (linkableSources as readonly unknown[]).includes(value)
    ? (value as (typeof linkableSources)[number])
    : "subscribe-page";
}

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
