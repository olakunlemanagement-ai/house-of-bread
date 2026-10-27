import type { Metadata } from "next";
import { AppBand } from "@/components/shared/AppBand";
import { ButtonLink } from "@/components/shared/Button";
import { StepList } from "@/components/shared/Lists";
import { PageHeader } from "@/components/shared/PageHeader";
import { PlanCard } from "@/components/shared/PlanCard";
import { Section, SectionHeader } from "@/components/shared/Section";
import { journeySteps } from "@/lib/content/copy";
import { placeholderPlans } from "@/lib/content/placeholder-data";

export const metadata: Metadata = {
  title: "New Testament journeys (reading plans)",
  description:
    "Three guided reading plans through the New Testament, in the order the books were written. 30, 60 and 90 day journeys in the official House of Bread app.",
};

export default function PlansPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="wheat-field"
        eyebrow="New Testament journeys"
        title="Three journeys through the New Testament"
        lead="Each journey follows the order the books were written, as events developed in the early Church, so the story reads in order. Available in the official House of Bread app."
        actions={
          <>
            <ButtonLink href="/app">
              Start a journey in the app
            </ButtonLink>
            <ButtonLink href="#journeys" variant="secondary">
              Compare the three paces
            </ButtonLink>
          </>
        }
      />

      <Section id="journeys" title="Choose a pace">
        <ul className="grid gap-5 pt-4 md:grid-cols-3 md:items-stretch">
          {placeholderPlans.map((plan, index) => (
            <PlanCard key={plan.slug} {...plan} href={`/plans/${plan.slug}`} raised={index === 1} />
          ))}
        </ul>
      </Section>

      <Section id="how" title="How a journey works" tone="warm">
        <StepList
          steps={journeySteps.map((step, index) => ({
            ...step,
            icon: (["route", "phone", "check", "clock"] as const)[index],
          }))}
        />
      </Section>

      <section id="order" aria-labelledby="order-heading" className="bg-surface">
        <div className="container-page grid gap-10 py-18 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader id="order-heading">Why the order matters</SectionHeader>
          </div>
          <p className="font-serif text-2xl leading-relaxed text-ink lg:col-span-7 lg:pt-10">
            Reading the books in the order they were written lets each letter be heard against the
            events that prompted it. The same passage reads differently once the situation behind it
            is known.
          </p>
        </div>
      </section>

      <AppBand idPrefix="plans-app" action={{ href: "/app", label: "Start a journey in the app" }} />
    </main>
  );
}
