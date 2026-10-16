import type { Metadata } from "next";
import type { Route } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { FeatureCard, LinkCard } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { NewsletterBand } from "@/components/shared/NewsletterBand";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge } from "@/components/shared/Placeholder";
import { Section } from "@/components/shared/Section";
import { placeholderTeachings } from "@/lib/content/placeholder-data";

export const metadata: Metadata = {
  title: "Teachings",
  description:
    "Written teaching from House of Bread Global on doctrine, interpretation and the questions believers actually ask.",
};

export default function TeachingsPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="Teachings"
        title="Teaching written to be understood"
        lead="A growing library from the ministry on doctrine, interpretation and the questions believers actually ask. Rigorous without being academic."
        actions={
          <ButtonLink href="/subscribe" tone="green" arrow>
            Subscribe for new teaching
          </ButtonLink>
        }
      />

      {/* Visual only until filtering is built. */}
      <Section id="topics" title="Topics">
        <ul className="grid gap-5 md:grid-cols-3">
          <FeatureCard icon="cross" title="Doctrine">
            What Scripture teaches, and how the argument is built.
          </FeatureCard>
          <FeatureCard icon="search" title="Interpretation">
            How to read a passage the way its first readers did.
          </FeatureCard>
          <FeatureCard icon="question" title="Questions believers ask">
            Clear answers, grounded in the text.
          </FeatureCard>
        </ul>
      </Section>

      <Section id="latest" title="Latest teachings" tone="tint">
        {placeholderTeachings.length > 0 ? (
          <ul className="grid gap-5 md:grid-cols-2">
            {placeholderTeachings.map((entry) => (
              <li key={entry.slug} className="flex">
                <LinkCard
                  href={`/teachings/${entry.slug}` as Route}
                  title={entry.title}
                  eyebrow={entry.sample ? <PlaceholderBadge label="Sample, draft" /> : null}
                  footer={
                    <span className="flex flex-wrap gap-2 text-sm">
                      <Placeholder>[READING TIME]</Placeholder>
                      <Placeholder>[PASSAGES]</Placeholder>
                    </span>
                  }
                >
                  <Placeholder>[SUMMARY TO BE SUPPLIED]</Placeholder>
                </LinkCard>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon="scroll" action={{ href: "/subscribe", label: "Subscribe for new teaching" }}>
            The first teachings are being prepared. Subscribe to be told when they are published.
          </EmptyState>
        )}
      </Section>

      <NewsletterBand idPrefix="teachings-newsletter" />
    </main>
  );
}
