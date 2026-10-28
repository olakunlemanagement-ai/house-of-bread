import type { Metadata } from "next";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { LinkCard } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { ButtonLink } from "@/components/shared/Button";
import { NextStep } from "@/components/shared/NextStep";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge } from "@/components/shared/Placeholder";
import { MdxBody } from "@/components/shared/MdxBody";
import { bandClass, Section } from "@/components/shared/Section";
import { getAll, getEntry } from "@/lib/content";
import { formatContentDate } from "@/lib/content/dates";
import { canonicalise } from "@/lib/scripture";

// Render the full page before responding, so an unknown slug returns a real
// 404 status rather than a 200 shell with not found content streamed in.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return getAll("teaching").map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/teachings/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry("teaching", slug);
  if (!entry) return {};
  return { title: entry.data.title, description: entry.data.description };
}

export default async function TeachingPage({ params }: PageProps<"/teachings/[slug]">) {
  const { slug } = await params;
  const found = getEntry("teaching", slug);
  if (!found) notFound();
  const entry = found.data;

  const related = getAll("teaching").filter((other) => other.slug !== entry.slug);

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="dust-light"
        eyebrow="Teachings"
        title={entry.title}
        meta={
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {entry.placeholder ? <PlaceholderBadge label="Sample, draft" /> : null}
            <time dateTime={entry.date}>{formatContentDate(entry.date)}</time>
            <Placeholder>[READING TIME]</Placeholder>
            {entry.passages.length > 0 ? <span>{entry.passages.map(canonicalise).join(", ")}</span> : null}
          </div>
        }
      />

      <article aria-labelledby="body-heading" className="bg-surface">
        <div className={bandClass}>
          <div className="mx-auto max-w-[68ch]">
            <h2 id="body-heading" className="sr-only">
              {entry.title}
            </h2>
            <MdxBody source={found.body} />
          </div>
        </div>
      </article>

      <Section id="related" title="Related teachings" tone="warm">
        {related.length > 0 ? (
          <ul className="grid gap-5 md:grid-cols-2">
            {related.map((other) => (
              <li key={other.slug} className="flex">
                <LinkCard
                  href={`/teachings/${other.slug}` as Route}
                  title={other.title}
                  eyebrow={other.placeholder ? <PlaceholderBadge label="Sample, draft" /> : null}
                >
                  {other.description}
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
