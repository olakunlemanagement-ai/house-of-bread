import type { Metadata } from "next";
import type { Route } from "next";
import { LinkCard } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { FeatureList } from "@/components/shared/Lists";
import { NewsletterBand } from "@/components/shared/NewsletterBand";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge } from "@/components/shared/Placeholder";
import { Section } from "@/components/shared/Section";
import { classAudience } from "@/lib/content/copy";
import { placeholderClasses } from "@/lib/content/placeholder-data";

export const metadata: Metadata = {
  title: "Classes and training",
  description:
    "Structured teaching for those who want to go further than reading alone. See what each class covers, who it is for and how to join.",
};

export default function ClassesPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="Classes and training"
        title="Go further than reading alone"
        lead="Structured teaching, taught with the same care for context and doctrine as everything else here."
      />

      <Section id="list" title="Class list">
        {placeholderClasses.length > 0 ? (
          <ul className="grid gap-6 md:grid-cols-2">
            {placeholderClasses.map((entry) => (
              <li key={entry.slug} className="flex">
                <LinkCard
                  href={`/classes/${entry.slug}` as Route}
                  title={entry.title}
                  eyebrow={entry.sample ? <PlaceholderBadge label="Sample" /> : null}
                >
                  <dl className="space-y-2">
                    <div>
                      <dt className="sr-only">Summary</dt>
                      <dd><Placeholder>[ONE LINE SUMMARY]</Placeholder></dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold text-ink">Who it is for: </dt>
                      <dd className="inline"><Placeholder>[AUDIENCE]</Placeholder></dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold text-ink">When it runs: </dt>
                      <dd className="inline"><Placeholder>[DATES]</Placeholder></dd>
                    </div>
                  </dl>
                </LinkCard>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon="people" action={{ href: "/subscribe", label: "Subscribe" }}>
            Class details are being prepared. Subscribe to hear when enrolment opens.
          </EmptyState>
        )}
      </Section>

      <Section id="join" title="How to join" tone="tint" width="narrow">
        <Placeholder block>[JOINING METHOD TO BE SUPPLIED: form, WhatsApp link or email]</Placeholder>
      </Section>

      <Section id="for" title="Who classes are for">
        <FeatureList items={classAudience} />
      </Section>

      <NewsletterBand idPrefix="classes-newsletter" />
    </main>
  );
}
