import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppBand } from "@/components/shared/AppBand";
import { ButtonLink } from "@/components/shared/Button";
import { IconTile } from "@/components/shared/icons";
import { StepList } from "@/components/shared/Lists";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge } from "@/components/shared/Placeholder";
import { Section } from "@/components/shared/Section";
import { journeySteps } from "@/lib/content/copy";
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
    description: `${entry.line} A guided journey through the New Testament in the official House of Bread app, following the order the books were written.`,
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
        eyebrow="New Testament journeys"
        title={plan.name}
        meta={
          <dl className="flex flex-wrap gap-3 text-on-green">
            <div className="flex gap-2 rounded-full border border-on-green/40 px-4 py-1.5">
              <dt className="text-on-green">Days</dt>
              <dd className="font-semibold">{plan.days}</dd>
            </div>
            <div className="flex gap-2 rounded-full border border-on-green/40 px-4 py-1.5">
              <dt className="text-on-green">Pace</dt>
              <dd className="font-semibold">{plan.pace}</dd>
            </div>
          </dl>
        }
        actions={
          <>
            <ButtonLink href="/app" tone="green" arrow>
              Start a journey in the app
            </ButtonLink>
            <ButtonLink href="/plans" tone="green" variant="secondary">
              Compare the three paces
            </ButtonLink>
          </>
        }
      />

      <Section id="about" title="About this journey" width="narrow">
        <p className="font-serif text-2xl leading-relaxed text-ink">{plan.line}</p>
        <p className="mt-5 text-lg leading-relaxed text-ink-muted">
          Each journey follows the order the books were written, as events developed in the early
          Church, so the story reads in order.
        </p>
      </Section>

      <Section id="day-one" title="A look at day one" tone="warm" width="narrow">
        {dayOne ? (
          <div className="rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <IconTile name="book" />
              <p className="font-serif text-3xl font-semibold text-emerald-deep">Day 1</p>
              <PlaceholderBadge label="Sample, confirm against the app" />
            </div>
            <dl className="mt-7 space-y-5 text-lg">
              <div>
                <dt className="eyebrow">Reading</dt>
                <dd className="mt-1 text-ink">{dayOne.readings}</dd>
              </div>
              <div>
                <dt className="eyebrow">Theme</dt>
                <dd className="mt-1 font-serif text-2xl text-ink">{dayOne.theme}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <Placeholder block>[DAY ONE READING TO BE CONFIRMED AGAINST THE APP]</Placeholder>
        )}
      </Section>

      <Section id="follow" title="How to follow it in the app">
        <StepList steps={journeySteps} />
      </Section>

      <Section id="faq" title="Frequently asked" tone="mint" width="narrow">
        <Placeholder block>[FREQUENTLY ASKED QUESTIONS TO BE SUPPLIED]</Placeholder>
      </Section>

      <AppBand
        idPrefix="plan-app"
        heading="Open this journey in the app"
        action={{ href: "/app", label: "Start a journey in the app" }}
        note={<Placeholder>[APP DEEP LINK TO BE CONFIRMED]</Placeholder>}
      />
    </main>
  );
}
