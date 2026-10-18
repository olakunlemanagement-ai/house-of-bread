import type { Metadata } from "next";
import type { Route } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { LinkCard } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { FeatureList } from "@/components/shared/Lists";
import { LoopVideo } from "@/components/shared/LoopVideo";
import { NewsletterCard } from "@/components/shared/NewsletterCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge } from "@/components/shared/Placeholder";
import { Section, SectionHeader } from "@/components/shared/Section";
import { classAudience } from "@/lib/content/copy";
import { getAll } from "@/lib/content";

export const metadata: Metadata = {
  title: "House of Bread Academy",
  description:
    "House of Bread Academy: the believers' Bible classes of House of Bread Global, equipping believers with knowledge of the truth. See what each class covers, who it is for and how to join.",
};

const audienceIcons = ["people", "route", "search", "book"] as const;

export default function AcademyPage() {
  const classes = getAll("class");
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="House of Bread Academy"
        title="Be equipped in the truth."
        lead="House of Bread Academy gives believers a structured place to study the Bible, so they are equipped with knowledge of the truth and ready to stand in it."
        actions={
          <>
            <ButtonLink href="#join" arrow>
              See how to join
            </ButtonLink>
            <ButtonLink href="/subscribe" variant="secondary">
              Hear when enrolment opens
            </ButtonLink>
          </>
        }
      />

      <Section id="list" title="Classes">
        {classes.length > 0 ? (
          <ul className="grid gap-5 md:grid-cols-2">
            {classes.map((entry) => (
              <li key={entry.slug} className="flex">
                <LinkCard
                  href={`/academy/${entry.slug}` as Route}
                  title={entry.title}
                  eyebrow={entry.placeholder ? <PlaceholderBadge label="Sample" /> : null}
                  cta="View class"
                >
                  <dl className="space-y-2">
                    <div>
                      <dt className="sr-only">Summary</dt>
                      <dd>{entry.description}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold text-ink">Who it is for: </dt>
                      <dd className="inline">{entry.audience ?? <Placeholder>[AUDIENCE]</Placeholder>}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold text-ink">When it runs: </dt>
                      <dd className="inline">{entry.schedule ?? <Placeholder>[DATES]</Placeholder>}</dd>
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
            <SectionHeader id="for-heading">Who the Academy is for</SectionHeader>
            <div className="mt-10">
              <FeatureList
                columns={1}
                items={classAudience.map((text, index) => ({ icon: audienceIcons[index], text }))}
              />
            </div>
          </div>
          <LoopVideo
            id="open-bible"
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 384px, 100vw"
            className="mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-card border border-border shadow-soft lg:col-span-5 lg:max-w-none"
          />
        </div>
      </section>

      <Section id="join" title="How to join" tone="mint" width="narrow">
        <Placeholder block>[JOINING METHOD TO BE SUPPLIED: form, WhatsApp link or email]</Placeholder>
      </Section>

      <NewsletterCard idPrefix="academy-newsletter" />
    </main>
  );
}
