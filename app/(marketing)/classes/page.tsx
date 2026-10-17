import type { Metadata } from "next";
import type { Route } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { LinkCard } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { FeatureList } from "@/components/shared/Lists";
import { NewsletterCard } from "@/components/shared/NewsletterCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge, PhotoFrame } from "@/components/shared/Placeholder";
import { Section, SectionHeader } from "@/components/shared/Section";
import { classAudience } from "@/lib/content/copy";
import { placeholderClasses } from "@/lib/content/placeholder-data";

export const metadata: Metadata = {
  title: "Classes and training",
  description:
    "Structured teaching from House of Bread Global for believers who want to go deeper. See what each class covers, who it is for and how to join.",
};

const audienceIcons = ["people", "route", "search", "book"] as const;

export default function ClassesPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="Classes and training"
        title="Go deeper in the Word"
        lead="Structured teaching from the ministry, taught with the same care for context and doctrine as everything else here."
        actions={
          <>
            <ButtonLink href="#join" tone="green" arrow>
              See how to join
            </ButtonLink>
            <ButtonLink href="/subscribe" tone="green" variant="secondary">
              Hear when enrolment opens
            </ButtonLink>
          </>
        }
      />

      <Section id="list" title="Classes">
        {placeholderClasses.length > 0 ? (
          <ul className="grid gap-5 md:grid-cols-2">
            {placeholderClasses.map((entry) => (
              <li key={entry.slug} className="flex">
                <LinkCard
                  href={`/classes/${entry.slug}` as Route}
                  title={entry.title}
                  eyebrow={entry.sample ? <PlaceholderBadge label="Sample" /> : null}
                  cta="View class"
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
          <EmptyState icon="people" action={{ href: "/subscribe", label: "Hear when enrolment opens" }}>
            Class details are being prepared. Subscribe to hear when enrolment opens.
          </EmptyState>
        )}
      </Section>

      <section id="for" aria-labelledby="for-heading" className="bg-surface-warm">
        <div className="container-page reveal grid gap-12 py-18 md:py-28 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeader id="for-heading">Who classes are for</SectionHeader>
            <div className="mt-10">
              <FeatureList
                columns={1}
                items={classAudience.map((text, index) => ({ icon: audienceIcons[index], text }))}
              />
            </div>
          </div>
          <PhotoFrame
            className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none"
            ratio="4/5"
            subject="A class in progress, believers with open Bibles"
          />
        </div>
      </section>

      <Section id="join" title="How to join" tone="mint" width="narrow">
        <Placeholder block>[JOINING METHOD TO BE SUPPLIED: form, WhatsApp link or email]</Placeholder>
      </Section>

      <NewsletterCard idPrefix="classes-newsletter" />
    </main>
  );
}
