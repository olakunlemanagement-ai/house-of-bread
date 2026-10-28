import type { Metadata } from "next";
import type { Route } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { LinkCard } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { NextStep } from "@/components/shared/NextStep";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge } from "@/components/shared/Placeholder";
import { Section } from "@/components/shared/Section";
import { getAll } from "@/lib/content";
import { canonicalise } from "@/lib/scripture";

export const metadata: Metadata = {
  title: "Written teachings",
  description:
    "Written teaching from House of Bread Global on doctrine, interpretation and the questions believers actually ask.",
};

/** Written teaching: every piece as a card, then the next step to the Academy. */
export default function TeachingsPage() {
  const teachings = getAll("teaching");
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="dust-light"
        eyebrow="Teachings"
        title="Teaching written to be understood"
        lead="A growing library from the ministry on doctrine, interpretation and the questions believers actually ask. Rigorous without being academic."
      />

      <Section id="latest" title="What would you like to read?">
        {teachings.length > 0 ? (
          <ul className="grid gap-5 md:grid-cols-2">
            {teachings.map((entry) => (
              <li key={entry.slug} className="flex">
                <LinkCard
                  href={`/teachings/${entry.slug}` as Route}
                  title={entry.title}
                  eyebrow={entry.placeholder ? <PlaceholderBadge label="Sample, draft" /> : null}
                  footer={
                    <span className="flex flex-wrap gap-2 text-sm">
                      <Placeholder>[READING TIME]</Placeholder>
                      {entry.passages.length > 0 ? (
                        <span>{entry.passages.map(canonicalise).join(", ")}</span>
                      ) : null}
                    </span>
                  }
                >
                  {entry.description}
                </LinkCard>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon="scroll" action={{ href: "/subscribe", label: "Get new teaching by email" }}>
            The first teachings are being prepared. Subscribe to be told when they are published.
          </EmptyState>
        )}
      </Section>

      <NextStep title="Ready to go deeper?" text="Our free courses take you through it, one lesson at a time.">
        <ButtonLink href="/academy">Browse free courses</ButtonLink>
      </NextStep>
    </main>
  );
}
