import type { Metadata } from "next";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { LinkCard } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { NewsletterCard } from "@/components/shared/NewsletterCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge } from "@/components/shared/Placeholder";
import { Prose } from "@/components/shared/Prose";
import { john6_33to35, ScriptureBlock } from "@/components/shared/ScriptureBlock";
import { Section } from "@/components/shared/Section";
import { findBySlug, placeholderTeachings } from "@/lib/content/placeholder-data";

// Render the full page before responding, so an unknown slug returns a real
// 404 status rather than a 200 shell with not found content streamed in.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return placeholderTeachings.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/teachings/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = findBySlug(placeholderTeachings, slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: "Teaching from House of Bread Global. Sample draft, content to be supplied.",
  };
}

export default async function TeachingPage({ params }: PageProps<"/teachings/[slug]">) {
  const { slug } = await params;
  const entry = findBySlug(placeholderTeachings, slug);
  if (!entry) notFound();

  const related = placeholderTeachings.filter((other) => other.slug !== entry.slug);

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="Teachings"
        title={entry.title}
        meta={
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {entry.sample ? <PlaceholderBadge label="Sample, draft" /> : null}
            <Placeholder>[DATE]</Placeholder>
            <Placeholder>[READING TIME]</Placeholder>
            <Placeholder>[PASSAGES AS LINKED CHIPS]</Placeholder>
          </div>
        }
      />

      <article aria-labelledby="body-heading" className="bg-surface">
        <div className="container-page py-18 md:py-24">
          <div className="mx-auto max-w-[68ch]">
            <h2 id="body-heading" className="sr-only">
              {entry.title}
            </h2>
            <Prose>
              <Placeholder block>
                [TEACHING BODY TO BE SUPPLIED. Sample layout only: body text in serif, with every
                quotation in a ScriptureBlock as below.]
              </Placeholder>
              <ScriptureBlock passage="John 6:33-35" verses={john6_33to35} />
            </Prose>
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
                  eyebrow={other.sample ? <PlaceholderBadge label="Sample, draft" /> : null}
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

      <NewsletterCard idPrefix="teaching-newsletter" />
    </main>
  );
}
