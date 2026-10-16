import Link from "next/link";
import { Button } from "./Button";
import { Field, Honeypot, Input, OpensSoonNote, inputClass } from "./forms";
import { Placeholder } from "./Placeholder";

const topics = [
  "General question",
  "Live sessions",
  "Classes and training",
  "The app",
  "Something else",
];

/**
 * Contact form. Real fields, action not wired up: the submit button is
 * disabled until the contact slice.
 * TODO: post to /api/contact (Resend), and add loading, success and error
 * states.
 */
export function ContactForm() {
  return (
    <form method="post" aria-describedby="contact-status" className="relative space-y-5">
      <Honeypot id="contact-website" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contact-name" label="Name">
          <Input id="contact-name" name="name" type="text" autoComplete="name" required />
        </Field>
        <Field id="contact-email" label="Email">
          <Input id="contact-email" name="email" type="email" autoComplete="email" inputMode="email" required />
        </Field>
      </div>
      <Field id="contact-topic" label="Topic">
        <select id="contact-topic" name="topic" className={inputClass("light")} defaultValue={topics[0]}>
          {topics.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
      </Field>
      <Field id="contact-message" label="Message">
        <textarea id="contact-message" name="message" rows={6} required className={inputClass("light")} />
      </Field>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button type="submit" disabled aria-describedby="contact-status">
          Send message
        </Button>
        <OpensSoonNote id="contact-status">Messaging opens soon</OpensSoonNote>
      </div>

      <p className="text-sm leading-relaxed text-ink-muted">
        <Placeholder>[CONTACT FORM PRIVACY WORDING TO BE SUPPLIED]</Placeholder>{" "}
        <Link href="/privacy" className="font-semibold text-green underline underline-offset-4">
          Read the privacy policy.
        </Link>
      </p>
    </form>
  );
}
