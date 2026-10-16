import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IconTile, type IconName } from "@/components/shared/icons";
import { NewsletterBand } from "@/components/shared/NewsletterBand";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge } from "@/components/shared/Placeholder";
import { Section } from "@/components/shared/Section";
import { findBySlug, placeholderClasses } from "@/lib/content/placeholder-data";

// Render the full page before responding, so an unknown slug returns a real
// 404 status rather than a 200 shell with not found content streamed in.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return placeholderClasses.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/classes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = findBySlug(placeholderClasses, slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: "Class and training from House of Bread Global. Sample entry, details to be supplied.",
  };
}

const details: { id: string; title: string; icon: IconName }[] = [
  { id: "covers", title: "What it covers", icon: "book" },
  { id: "who", title: "Who it is for", icon: "people" },
  { id: "when", title: "When it runs", icon: "calendar" },
  { id: "join", title: "How to join", icon: "arrow-right" },
  { id: "cost", title: "Cost", icon: "compass" },
];

export default async function ClassPage({ params }: PageProps<"/classes/[slug]">) {
  const { slug } = await params;
  const entry = findBySlug(placeholderClasses, slug);
  if (!entry) notFound();

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="Classes and training"
        title={entry.title}
        lead={<Placeholder>[ONE LINE SUMMARY]</Placeholder>}
        meta={entry.sample ? <PlaceholderBadge label="Sample" /> : null}
      />

      {details.map((item, index) => (
        <Section
          key={item.id}
          id={item.id}
          title={item.title}
          tone={index % 2 === 0 ? "white" : "tint"}
          width="narrow"
        >
          <div className="flex items-start gap-5">
            <IconTile name={item.icon} />
            <div className="flex-1">
              <Placeholder block>[CLASS DETAILS TO BE SUPPLIED]</Placeholder>
            </div>
          </div>
        </Section>
      ))}

      <NewsletterBand idPrefix="class-newsletter" />
    </main>
  );
}
