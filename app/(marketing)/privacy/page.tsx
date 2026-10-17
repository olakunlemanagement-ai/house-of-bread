import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NewsletterCard } from "@/components/shared/NewsletterCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge } from "@/components/shared/Placeholder";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How House of Bread Global collects, uses and protects personal data.",
};

// Draft structure for review by a qualified person before launch. It is not
// legal advice. Keep the visible badge until the policy is approved.
const sections: { id: string; title: string; body: ReactNode }[] = [
  {
    id: "responsible",
    title: "Who is responsible",
    body: <Placeholder>[LEGAL NAME, ADDRESS AND CONTACT EMAIL OF THE MINISTRY]</Placeholder>,
  },
  {
    id: "collected",
    title: "What is collected",
    body: "Email address and optional first name when subscribing, and name, email and message when using the contact form. Basic anonymous visit statistics.",
  },
  {
    id: "basis",
    title: "Why and on what basis",
    body: "To send the newsletter, with consent, and to reply to messages, as a legitimate interest.",
  },
  {
    id: "processors",
    title: "Who processes the data",
    body: "Kit (newsletter), Resend (contact form email), Vercel (hosting), Plausible (cookieless analytics). Add any others before launch.",
  },
  {
    id: "cookies",
    title: "Cookies",
    body: "No tracking cookies are used, so no cookie banner is shown. Embedded YouTube video loads only after a visitor chooses to play it.",
  },
  {
    id: "retention",
    title: "Retention",
    body: <Placeholder>[RETENTION PERIODS TO BE SUPPLIED]</Placeholder>,
  },
  {
    id: "transfers",
    title: "International transfers",
    body: <Placeholder>[TO BE CONFIRMED FOR EACH PROCESSOR]</Placeholder>,
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        Under UK GDPR and the Nigeria Data Protection Act, including access, correction, deletion
        and withdrawing consent, and how to exercise them.{" "}
        <Placeholder>[HOW TO EXERCISE THESE RIGHTS TO BE SUPPLIED]</Placeholder>
      </>
    ),
  },
  {
    id: "unsubscribing",
    title: "Unsubscribing",
    body: "Every email has an unsubscribe link.",
  },
  {
    id: "changes",
    title: "Changes and date",
    body: <Placeholder>[DATE OF LAST UPDATE]</Placeholder>,
  },
];

export default function PrivacyPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="Privacy"
        title="Privacy policy"
        lead="How House of Bread Global collects, uses and protects personal data."
        meta={<PlaceholderBadge label="Draft, under review" />}
      />

      <div className="bg-surface">
        <div className="container-page grid gap-12 py-18 md:py-24 lg:grid-cols-[16rem_1fr]">
          <nav aria-label="Policy sections" className="lg:sticky lg:top-24 lg:self-start">
            <ol className="space-y-1 rounded-card bg-surface-mint p-5 text-sm">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded-lg px-2 py-1.5 text-emerald-deep underline-offset-4 hover:underline"
                  >
                    {index + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <ol className="max-w-[68ch] space-y-12">
            {sections.map((section, index) => (
              <li key={section.id}>
                <section id={section.id} aria-labelledby={`${section.id}-heading`} className="scroll-mt-24">
                  <h2 id={`${section.id}-heading`} className="flex items-baseline gap-3 text-3xl">
                    <span className="font-sans text-base text-ink-muted">{index + 1}.</span>
                    {section.title}
                  </h2>
                  <p className="mt-3 font-serif text-lg leading-[1.7] text-ink">{section.body}</p>
                </section>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <NewsletterCard idPrefix="privacy-newsletter" />
    </main>
  );
}
