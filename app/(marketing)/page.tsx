import type { Metadata } from "next";
import { AppBand } from "@/components/shared/AppBand";
import { BentoGrid, BentoTile } from "@/components/shared/BentoGrid";
import { ButtonLink } from "@/components/shared/Button";
import { TextCTA } from "@/components/shared/TextCTA";
import { FeatureCard } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { Hero } from "@/components/shared/Hero";
import { LiveSessionCard } from "@/components/shared/LiveSessionCard";
import { NewsletterCard } from "@/components/shared/NewsletterCard";
import { PhotoFrame } from "@/components/shared/Placeholder";
import { PlanCard } from "@/components/shared/PlanCard";
import { john6_33to35, ScriptureBlock } from "@/components/shared/ScriptureBlock";
import { Section, SectionHeader } from "@/components/shared/Section";
import { SocialLinks, YouTubeSubscribeButton } from "@/components/shared/SocialLinks";
import { homeStats, StatStrip } from "@/components/shared/StatStrip";
import { nameText } from "@/lib/content/copy";
import { placeholderEvents, placeholderPlans, upcomingEvents } from "@/lib/content/placeholder-data";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: { absolute: "House of Bread Global | A teaching ministry" },
  description: siteConfig.description,
};

export default function HomePage() {
  const next = upcomingEvents(placeholderEvents)[0];

  return (
    <main id="main" tabIndex={-1}>
      <Hero nextEvent={next} />

      {/* Stat strip overlaps the hero edge. Left columns only on desktop, clear of the phone. */}
      <div className="container-page relative z-20 -mt-24 lg:-mt-28">
        <StatStrip stats={homeStats} className="lg:w-7/12" />
      </div>

      <section id="ways" aria-labelledby="ways-heading" className="bg-surface-warm">
        <div className="container-page reveal pb-18 pt-18 md:pb-28 md:pt-24 lg:pt-36">
          <SectionHeader id="ways-heading">Four ways to be fed</SectionHeader>
          <div className="mt-10 md:mt-14">
            <BentoGrid>
              <BentoTile
                size="large"
                surface="green"
                icon="live"
                title="Live teaching"
                cta={{ href: "/events", label: "See upcoming sessions" }}
              >
                House of Bread Global teaches live on YouTube, with reminders so no session is
                missed.
              </BentoTile>
              <BentoTile
                size="medium"
                surface="white"
                icon="people"
                title="House of Bread Academy"
                cta={{ href: "/academy", label: "Explore the Academy" }}
              >
                Equipped in the truth. Bible classes that give believers a structured place to study
                the Word, taught with care for context and doctrine.
              </BentoTile>
              <BentoTile
                size="medium"
                surface="mint"
                icon="phone"
                title="The official app"
                cta={{ href: "/app", label: "Get the app" }}
              >
                Daily reading, New Testament journeys, six translations and the ministry&apos;s
                teaching, in your pocket.
              </BentoTile>
              <BentoTile
                size="small"
                surface="white"
                icon="scroll"
                title="Written teaching"
                cta={{ href: "/teachings", label: "Read the teachings" }}
              >
                Doctrine, interpretation and the questions believers actually ask.
              </BentoTile>
            </BentoGrid>
          </div>
        </div>
      </section>

      <section id="next-live" aria-labelledby="next-live-heading" className="bg-surface">
        <div className="container-page reveal grid gap-10 pb-18 md:pb-28 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-7">
            <SectionHeader id="next-live-heading">Next live session</SectionHeader>
            <div className="mt-10">
              {next ? (
                <LiveSessionCard event={next} idPrefix="home-next" />
              ) : (
                <EmptyState icon="live">
                  Sessions are announced here and by email. Ask for a reminder and the next date
                  arrives in your inbox.
                </EmptyState>
              )}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {/* The featured card carries its own reminder button. */}
              {next ? null : (
                <ButtonLink href="/subscribe" arrow className="w-full sm:w-auto">
                  Set a reminder
                </ButtonLink>
              )}
              <YouTubeSubscribeButton />
            </div>
          </div>
          <PhotoFrame
            className="lg:col-span-5"
            ratio="4/5"
            subject="A live teaching session, the teacher and those gathered"
          />
        </div>
      </section>

      <Section id="stands-for" title="What the ministry stands for" tone="mint">
        <ul className="grid gap-5 md:grid-cols-3">
          <FeatureCard icon="cross" title="Doctrinal clarity">
            Teaching that says plainly what Scripture says, and shows how the argument is built.
          </FeatureCard>
          <FeatureCard icon="book" title="Scripture in context">
            Passages are read with the background that makes them land, and quoted in full with the
            verses either side.
          </FeatureCard>
          <FeatureCard icon="heart" title="Plain, warm and rigorous">
            Written to be understood. Rigorous without being academic.
          </FeatureCard>
        </ul>
      </Section>

      <section id="name" aria-labelledby="name-heading" className="bg-surface">
        <div className="container-page reveal grid gap-12 py-18 md:py-28 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeader id="name-heading">Why House of Bread?</SectionHeader>
            <p className="mt-7 max-w-2xl font-serif text-2xl leading-relaxed text-ink">{nameText}</p>
            <p className="mt-8">
              <TextCTA href="/about">About the ministry</TextCTA>
            </p>
          </div>
          <div className="lg:col-span-5">
            <ScriptureBlock variant="dark" passage="John 6:33-35" verses={john6_33to35} />
          </div>
        </div>
      </section>

      <AppBand idPrefix="home-app" />

      <Section
        id="journeys"
        title="A journey through the New Testament"
        intro="Three guided routes from Matthew to Revelation, in the order the books were written."
        tone="warm"
      >
        <ul className="grid gap-5 md:grid-cols-3">
          {placeholderPlans.map((plan) => (
            <PlanCard key={plan.slug} {...plan} />
          ))}
        </ul>
        <div className="mt-10">
          <ButtonLink href="/plans" arrow className="w-full sm:w-auto">
            Start a journey in the app
          </ButtonLink>
        </div>
      </Section>

      <Section
        id="follow"
        title="Follow the ministry"
        intro="Live sessions stream on YouTube, and the ministry shares teaching on its social pages."
      >
        <SocialLinks />
      </Section>

      <NewsletterCard idPrefix="home-newsletter" />
    </main>
  );
}
