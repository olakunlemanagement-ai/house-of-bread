import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppBand } from "@/components/shared/AppBand";
import { IconTile } from "@/components/shared/icons";
import { StepList } from "@/components/shared/Lists";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge } from "@/components/shared/Placeholder";
import { Section } from "@/components/shared/Section";
import { planSteps } from "@/lib/content/copy";
import { findBySlug, placeholderPlans } from "@/lib/content/placeholder-data";

// Render the full page before responding, so an unknown slug returns a real
// 404 status rather than a 200 shell with not found content streamed in.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return placeholderPlans.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/plans/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = findBySlug(placeholderPlans, slug);
  if (!entry) return {};
  return {
    title: entry.name,
    description: `${entry.line} A guided route through the New Testament, following the order the books were written.`,
  };
}

// Sample taken from the app. TODO: confirm against the app before launch.
const dayOneSample: Record<number, { readings: string; theme: string } | undefined> = {
  30: { readings: "James 1-5 and Galatians 1-3", theme: "Living faith and justification by faith." },
};

export default async function PlanPage({ params }: PageProps<"/plans/[slug]">) {
  const { slug } = await params;
  const plan = findBySlug(placeholderPlans, slug);
  if (!plan) notFound();

  const dayOne = dayOneSample[plan.days];

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="Reading plans"
        title={plan.name}
        meta={
          <dl className="flex flex-wrap gap-x-8 gap-y-2 text-lg text-on-green">
            <div className="flex gap-2">
              <dt className="text-on-green-muted">Days</dt>
              <dd className="font-bold">{plan.days}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-on-green-muted">Pace</dt>
              <dd className="font-bold">{plan.pace}</dd>
            </div>
          </dl>
        }
      />

      <Section id="about" title="About this plan" width="narrow">
        <p className="text-xl leading-relaxed text-ink">{plan.line}</p>
        <p className="mt-5 text-lg leading-relaxed text-ink-muted">
          Each plan follows the actual timeline the books were written, as events developed in the
          early Church, so the story reads in order.
        </p>
      </Section>

      <Section id="day-one" title="A look at day one" tone="tint" width="narrow">
        {dayOne ? (
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <IconTile name="book" />
              <p className="text-2xl font-bold text-green">Day 1</p>
              <PlaceholderBadge label="Sample, confirm against the app" />
            </div>
            <dl className="mt-6 space-y-4 text-lg">
              <div>
                <dt className="text-sm font-bold uppercase tracking-[0.16em] text-ink-muted">Reading</dt>
                <dd className="mt-1 text-ink">{dayOne.readings}</dd>
              </div>
              <div>
                <dt className="text-sm font-bold uppercase tracking-[0.16em] text-ink-muted">Theme</dt>
                <dd className="mt-1 font-serif text-xl text-ink">{dayOne.theme}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <Placeholder block>[DAY ONE READING TO BE CONFIRMED AGAINST THE APP]</Placeholder>
        )}
      </Section>

      <Section id="follow" title="How to follow it in the app">
        <StepList steps={planSteps} />
      </Section>

      <Section id="faq" title="Frequently asked" tone="tint" width="narrow">
        <Placeholder block>[FREQUENTLY ASKED QUESTIONS TO BE SUPPLIED]</Placeholder>
      </Section>

      <AppBand
        idPrefix="plan-app"
        heading="Open this plan in the app"
        note={<Placeholder>[APP DEEP LINK TO BE CONFIRMED]</Placeholder>}
      />
    </main>
  );
}
