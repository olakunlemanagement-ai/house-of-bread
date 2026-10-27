import type { Metadata } from "next";
import { ContactForm } from "@/components/shared/ContactForm";
import { IconTile } from "@/components/shared/icons";
import { NewsletterCard } from "@/components/shared/NewsletterCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder } from "@/components/shared/Placeholder";
import { Section, SectionHeader } from "@/components/shared/Section";
import { SocialLinks } from "@/components/shared/SocialLinks";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with House of Bread Global.",
};

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
        <div className="container-page grid gap-8 py-18 md:py-24 lg:grid-cols-12 lg:gap-10">
          <section
            aria-labelledby="message-heading"
            className="rounded-card border border-border bg-surface p-6 shadow-raised sm:p-10 lg:col-span-7"
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

      <Section
        id="follow"
        title="Follow the ministry"
        intro="Live sessions stream on YouTube, and the ministry shares teaching on its social pages."
        tone="warm"
      >
        <SocialLinks />
      </Section>

      <NewsletterCard idPrefix="contact-newsletter" />
    </main>
  );
}
