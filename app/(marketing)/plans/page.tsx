import type { Metadata } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { NEXT_STEP_COURSES, NextStep } from "@/components/shared/NextStep";
import { NumberedList } from "@/components/shared/NumberedList";
import { PageHeader } from "@/components/shared/PageHeader";
import { PlanCard } from "@/components/shared/PlanCard";
import { bandClass, Section, SectionHeader } from "@/components/shared/Section";
import { journeySteps } from "@/lib/content/copy";
import { placeholderPlans } from "@/lib/content/placeholder-data";

export const metadata: Metadata = {
  title: "Three journeys through the New Testament",
  description:
    "Three guided reading plans through the New Testament, in the order the books were written. 30, 60 and 90 day journeys in the official House of Bread app.",
};

/** The three journeys, how one works and why the order matters, then the next step to the Academy. */
export default function PlansPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="wheat-field"
        eyebrow="New Testament journeys"
        title="Three journeys through the New Testament"
        lead="Each journey follows the order the books were written, as events developed in the early Church, so the story reads in order. Available in the official House of Bread app."
        actions={<ButtonLink href="/app">Get the app</ButtonLink>}
      />

      <Section id="journeys" title="Which pace suits you?">
        <ul className="grid gap-4 md:grid-cols-3 md:items-stretch md:gap-5">
          {placeholderPlans.map((plan) => (
            <PlanCard key={plan.slug} {...plan} href={`/plans/${plan.slug}`} />
          ))}
        </ul>
      </Section>

      <Section id="how" title="How does a journey work?" tone="warm">
        <NumberedList items={journeySteps} />
      </Section>

      <section id="order" aria-labelledby="order-heading" className="bg-surface">
        <div className={`${bandClass} grid gap-6 lg:grid-cols-12 lg:gap-10`}>
          <div className="lg:col-span-5">
            <SectionHeader id="order-heading">Why does the order matter?</SectionHeader>
          </div>
          <p className="font-serif text-xl leading-relaxed text-ink sm:text-2xl lg:col-span-7">
            Reading the books in the order they were written lets each letter be heard against the
            events that prompted it. The same passage reads differently once the situation behind it
            is known.
          </p>
        </div>
      </section>

      <NextStep title={NEXT_STEP_COURSES.title} text={NEXT_STEP_COURSES.text}>
        <ButtonLink href="/academy">Browse courses</ButtonLink>
      </NextStep>
    </main>
  );
}
