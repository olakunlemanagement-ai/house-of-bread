import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/shared/Button";
import { IconTile, type IconName } from "@/components/shared/icons";
import { NewsletterCard } from "@/components/shared/NewsletterCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge } from "@/components/shared/Placeholder";
import { SectionHeader } from "@/components/shared/Section";
import { MdxBody } from "@/components/shared/MdxBody";
import { getAll, getEntry } from "@/lib/content";

// Render the full page before responding, so an unknown slug returns a real
// 404 status rather than a 200 shell with not found content streamed in.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return getAll("class").map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/academy/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry("class", slug);
  if (!entry) return {};
  return { title: entry.data.title, description: entry.data.description };
}

type DetailId = "covers" | "who" | "when" | "join" | "cost";

const details: { id: DetailId; title: string; icon: IconName }[] = [
  { id: "covers", title: "What it covers", icon: "book" },
  { id: "who", title: "Who it is for", icon: "people" },
  { id: "when", title: "When it runs", icon: "calendar" },
  { id: "join", title: "How to join", icon: "arrow-right" },
  { id: "cost", title: "Cost", icon: "compass" },
];

export default async function ClassPage({ params }: PageProps<"/academy/[slug]">) {
  const { slug } = await params;
  const found = getEntry("class", slug);
  if (!found) notFound();
  const entry = found.data;
  const detail: Record<DetailId, ReactNode> = {
    covers: <MdxBody source={found.body} />,
    who: entry.audience,
    when: entry.schedule,
    join: entry.joinUrl ? (
      <ButtonLink href={entry.joinUrl as `https://${string}`} arrow>
        Join this class
      </ButtonLink>
    ) : undefined,
    cost: entry.cost,
  };

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="House of Bread Academy"
        title={entry.title}
        lead={entry.description}
        meta={entry.placeholder ? <PlaceholderBadge label="Sample" /> : null}
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

      <div className="bg-surface">
        <div className="container-page grid gap-5 py-18 md:grid-cols-2 md:py-28">
          {details.map((item, index) => (
            <section
              key={item.id}
              id={item.id}
              aria-labelledby={`${item.id}-heading`}
              className={`reveal rounded-card border border-border p-6 shadow-soft sm:p-8 ${
                index % 2 === 0 ? "bg-surface" : "bg-surface-mint"
              } ${index === 0 ? "md:col-span-2" : ""}`}
            >
              <div className="flex items-start gap-5">
                <IconTile name={item.icon} />
                <div className="flex-1">
                  <SectionHeader id={`${item.id}-heading`} size="compact">
                    {item.title}
                  </SectionHeader>
                  <div className="mt-6">
                    {detail[item.id] ?? <Placeholder block>[CLASS DETAILS TO BE SUPPLIED]</Placeholder>}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      <NewsletterCard idPrefix="class-newsletter" />
    </main>
  );
}
