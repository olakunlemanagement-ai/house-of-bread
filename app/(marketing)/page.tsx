import type { Metadata } from "next";
import Link from "next/link";
import { AppBand } from "@/components/shared/AppBand";
import { ButtonLink, textLinkClass } from "@/components/shared/Button";
import { FeatureCard } from "@/components/shared/Card";
import { CrossWatermark, CurveEdge, Leaves } from "@/components/shared/Decor";
import { EmptyState } from "@/components/shared/EmptyState";
import { IconTile } from "@/components/shared/icons";
import { LiveSessionCard } from "@/components/shared/LiveSessionCard";
import { NewsletterBand } from "@/components/shared/NewsletterBand";
import { PlanCard } from "@/components/shared/PlanCard";
import { john6_33to35, ScriptureBlock } from "@/components/shared/ScriptureBlock";
import { Section, SectionHeading } from "@/components/shared/Section";
import { introductionHeadings } from "@/lib/content/copy";
import { placeholderEvents, placeholderPlans, upcomingEvents } from "@/lib/content/placeholder-data";

export const metadata: Metadata = {
  title: { absolute: "House of Bread Global" },
  description:
    "Understand the Bible through the New Testament. Structured reading plans, every book explained, and careful teaching on doctrine, in the app and on the web.",
};

function Hero() {
  return (
    <div className="tone-green bg-green-hero relative overflow-hidden">
      <CrossWatermark className="bottom-12 right-[-3rem] h-[26rem] w-72 opacity-[0.07] sm:right-8 lg:right-24 lg:top-12 lg:h-[30rem] lg:w-80" />
      <Leaves className="-bottom-6 right-1/4 size-72 opacity-[0.06]" />
      <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-16 sm:px-6 sm:pb-36 sm:pt-24">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-lime">A teaching ministry</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
          Understand the Bible through the New Testament, not just read past it.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-on-green sm:text-xl">
          Structured reading plans, a clear explanation of every book, and careful teaching on
          doctrine. Scripture in context, with the background that makes it land.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <ButtonLink href="/plans" tone="green">
            Start a reading plan
          </ButtonLink>
          <ButtonLink href="/app" tone="green" variant="secondary">
            Get the app
          </ButtonLink>
          <Link href="/subscribe" className={`${textLinkClass} px-1 py-3`}>
            Join the newsletter
          </Link>
        </div>
        <p className="mt-12 text-sm font-bold tracking-[0.4em] text-lime">STUDY . PRAY . GROW</p>
      </div>
      <CurveEdge />
    </div>
  );
}

export default function HomePage() {
  const next = upcomingEvents(placeholderEvents)[0];

  return (
    <main id="main" tabIndex={-1}>
      <Hero />

      <Section id="next-live" title="Next live session">
        {next ? (
          <ul>
            <LiveSessionCard event={next} />
          </ul>
        ) : (
          <EmptyState icon="live">
            Live sessions stream on YouTube. The next date will appear here. Ask to be notified
            and it will arrive in your inbox.
          </EmptyState>
        )}
        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href="/subscribe">Notify me</ButtonLink>
          <ButtonLink href="/events" variant="secondary">
            See all sessions
          </ButtonLink>
        </div>
      </Section>

      <Section id="find" title="What you will find here" tone="tint">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard icon="book" title="In-depth Bible study">
            Every New Testament book explained. Who wrote it, who received it, and what it was
            written to settle.
          </FeatureCard>
          <FeatureCard icon="route" title="Guided study plans">
            Three routes from Matthew to Revelation, in the order the books were written.
          </FeatureCard>
          <FeatureCard icon="scroll" title="Trusted teaching">
            Written teaching on doctrine, interpretation and the questions believers actually ask.
          </FeatureCard>
          <FeatureCard icon="globe" title="A global ministry">
            Serving readers across the United Kingdom, Africa and the United States.
          </FeatureCard>
        </ul>
      </Section>

      <section aria-labelledby="context-heading" className="bg-surface-tint">
        <div className="mx-auto grid max-w-6xl gap-12 border-t border-border px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading id="context-heading">Context is not decoration</SectionHeading>
            <p className="mt-6 text-xl leading-relaxed text-ink sm:text-2xl sm:leading-relaxed">
              A letter read without knowing what prompted it will be misread, and most misreadings
              of the New Testament begin exactly there. Each book here starts with the situation
              behind it, so the argument makes sense before the verses are lifted out.
            </p>
            <p className="mt-8">
              <Link href="/new-testament" className={textLinkClass}>
                See how the books are explained
              </Link>
            </p>
          </div>
          <ScriptureBlock
            variant="dark"
            passage="John 6:33-35"
            label="The name behind the ministry"
            verses={john6_33to35}
          />
        </div>
      </section>

      <Section id="plans" title="Choose a pace that fits real life">
        <ul className="grid gap-6 md:grid-cols-3">
          {placeholderPlans.map((plan) => (
            <PlanCard key={plan.slug} {...plan} href={`/plans/${plan.slug}`} />
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Progress is tracked automatically in the app. Open it and continue exactly where the
          last session ended.
        </p>
      </Section>

      <Section id="books" title="Twenty-seven books, each with a written introduction" tone="tint">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {introductionHeadings.map((heading, index) => (
            <li key={heading} className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-5 shadow-card">
              <span aria-hidden="true" className="shrink-0">
                <IconTile name="book" size="sm" />
              </span>
              <span className="text-lg leading-snug text-ink">
                <span className="sr-only">{index + 1}. </span>
                {heading}.
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <ButtonLink href="/new-testament">Browse the books</ButtonLink>
        </div>
      </Section>

      <AppBand idPrefix="home-app" />

      <NewsletterBand idPrefix="home-newsletter" />
    </main>
  );
}
