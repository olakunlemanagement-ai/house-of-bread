import Link from "next/link";
import { Button } from "./Button";
import { Field, Honeypot, Input, OpensSoonNote, type FieldTone } from "./forms";

export type NewsletterTag = "footer" | "subscribe-page" | "live-notify" | "plan-page";

type NewsletterFormProps = {
  /** Unique per page, so field ids do not collide. */
  idPrefix: string;
  tag: NewsletterTag;
  tone?: FieldTone;
  /** Adds the "Remind me before each live session" checkbox. */
  withLiveNotify?: boolean;
  consent?: "standard" | "short";
};

// Copy for the states the newsletter slice will add. Kept here so the
// wording ships with the form.
export const newsletterMessages = {
  invalidEmail: "Enter a valid email address.",
  failure: "Something went wrong. Please try again in a moment.",
} as const;

/**
 * Newsletter signup. The fields are real, the action is not wired up yet:
 * the submit button is disabled, which also blocks submitting with Enter.
 * TODO: post to /api/subscribe in the newsletter slice, and add loading,
 * success and error states.
 */
export function NewsletterForm({
  idPrefix,
  tag,
  tone = "light",
  withLiveNotify = false,
  consent = "standard",
}: NewsletterFormProps) {
  const id = (name: string) => `${idPrefix}-${name}`;
  const linkClass =
    tone === "green"
      ? "font-semibold text-lime underline underline-offset-4"
      : "font-semibold text-green underline underline-offset-4";

  return (
    <form method="post" aria-describedby={id("status")} className="relative">
      <input type="hidden" name="tag" value={tag} />
      <Honeypot id={id("website")} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id("first-name")} label="First name" hint="(optional)">
          <Input id={id("first-name")} name="firstName" type="text" autoComplete="given-name" tone={tone} />
        </Field>
        <Field id={id("email")} label="Email">
          <Input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            tone={tone}
          />
        </Field>
      </div>

      {withLiveNotify ? (
        <div className="mt-5 flex items-start gap-3">
          <input
            id={id("live-notify")}
            name="liveNotify"
            type="checkbox"
            value="live-notify"
            className="mt-0.5 size-6 shrink-0 accent-green"
          />
          <label htmlFor={id("live-notify")} className="text-lg text-fg">
            Remind me before each live session
          </label>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" tone={tone} disabled aria-describedby={id("status")}>
          Subscribe
        </Button>
        <OpensSoonNote id={id("status")}>Signup opens soon</OpensSoonNote>
      </div>

      <p className="mt-5 max-w-xl text-sm leading-relaxed text-fg-muted">
        {consent === "standard"
          ? "By subscribing you agree to receive emails from House of Bread Global. You will be asked to confirm your address, and you can unsubscribe at any time. "
          : "By subscribing you agree to receive emails from House of Bread Global. You will be asked to confirm your address. "}
        <Link href="/privacy" className={linkClass}>
          Read the privacy policy.
        </Link>
      </p>
    </form>
  );
}
