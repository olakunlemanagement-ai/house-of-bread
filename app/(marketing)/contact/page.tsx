import type { Metadata } from "next";
import { ContactForm } from "@/components/shared/ContactForm";
import { IconTile } from "@/components/shared/icons";
import { NewsletterBand } from "@/components/shared/NewsletterBand";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder } from "@/components/shared/Placeholder";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with House of Bread Global.",
};

export default function ContactPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        lead="Questions about the teaching, classes or the app are welcome."
      />

      <div className="bg-surface">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.5fr_1fr]">
          <section
            aria-label="Contact form"
            className="rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-10"
          >
            <ContactForm />
          </section>

          <aside aria-label="Other ways to reach the ministry" className="space-y-6 rounded-3xl bg-surface-tint p-6 sm:p-10">
            <IconTile name="mail" size="lg" />
            <Placeholder block>[RESPONSE TIME, EMAIL ADDRESS AND SOCIAL LINKS TO BE SUPPLIED]</Placeholder>
          </aside>
        </div>
      </div>

      <NewsletterBand idPrefix="contact-newsletter" />
    </main>
  );
}
