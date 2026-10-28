import type { Metadata } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { ContactForm } from "@/components/shared/ContactForm";
import { IconTile } from "@/components/shared/icons";
import { NextStep } from "@/components/shared/NextStep";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder } from "@/components/shared/Placeholder";
import { bandClass, SectionHeader } from "@/components/shared/Section";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with House of Bread Global. Questions about the ministry, live sessions, the Academy or the app are welcome.",
};

/** Contact: the form and the other ways to reach the ministry, then the next step to the Academy. */
export default function ContactPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="bread-steam"
        eyebrow="Contact"
        title="Get in touch"
        lead="Questions about the ministry, live sessions, the Academy or the app are welcome."
      />

      <div className="bg-surface">
        <div className={`${bandClass} grid gap-8 lg:grid-cols-12 lg:gap-10`}>
          <section
            aria-labelledby="message-heading"
            className="rounded-card border border-border bg-surface-raised p-6 shadow-soft sm:p-10 lg:col-span-7"
          >
            <h2 id="message-heading" className="mb-8 text-3xl">
              Send a message
            </h2>
            <ContactForm />
          </section>

          <aside
            aria-labelledby="reach-heading"
            className="space-y-6 rounded-card bg-surface-mint p-6 sm:p-10 lg:col-span-5"
          >
            <IconTile name="mail" size="lg" />
            <SectionHeader id="reach-heading" size="compact">
              Other ways to reach the ministry
            </SectionHeader>
            <Placeholder block>[RESPONSE TIME, EMAIL ADDRESS AND SOCIAL LINKS TO BE SUPPLIED]</Placeholder>
          </aside>
        </div>
      </div>

      <NextStep tone="warm" title="Ready to start?" text="Our free courses take you through it, one lesson at a time.">
        <ButtonLink href="/academy">Browse free courses</ButtonLink>
      </NextStep>
    </main>
  );
}
