import type { Metadata } from "next";
import { AppBand } from "@/components/shared/AppBand";
import { StepList } from "@/components/shared/Lists";
import { PageHeader } from "@/components/shared/PageHeader";
import { PlanCard } from "@/components/shared/PlanCard";
import { Section } from "@/components/shared/Section";
import { planSteps } from "@/lib/content/copy";
import { placeholderPlans } from "@/lib/content/placeholder-data";

export const metadata: Metadata = {
  title: "Reading plans",
  description:
    "Three guided routes through the New Testament, following the order the books were written. 30, 60 and 90 day plans.",
};

export default function PlansPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="Reading plans"
        title="Three routes through the New Testament"
        lead="Each plan follows the actual timeline the books were written, as events developed in the early Church, so the story reads in order."
      />

      <Section id="plans" title="Choose a pace that fits real life">
        <ul className="grid gap-6 md:grid-cols-3">
          {placeholderPlans.map((plan) => (
            <PlanCard key={plan.slug} {...plan} href={`/plans/${plan.slug}`} />
          ))}
        </ul>
      </Section>

      <Section id="how" title="How the plans work" tone="tint">
        <StepList steps={planSteps} />
      </Section>

      <Section id="order" title="Why the order matters" width="narrow">
        <p className="text-xl leading-relaxed text-ink">
          Reading the books in the order they were written lets each letter be heard against the
          events that prompted it. The same passage reads differently once the situation behind it
          is known.
        </p>
      </Section>

      <AppBand idPrefix="plans-app" />
    </main>
  );
}
