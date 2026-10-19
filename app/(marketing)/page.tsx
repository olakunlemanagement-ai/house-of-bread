import type { Metadata } from "next";
import { Suspense } from "react";
import { AppBand } from "@/components/shared/AppBand";
import { BentoGrid, BentoTile } from "@/components/shared/BentoGrid";
import { ButtonLink } from "@/components/shared/Button";
import { TextCTA } from "@/components/shared/TextCTA";
import { StartHereVideo } from "@/components/shared/StartHereVideo";
import { YouTubeFacadeSkeleton } from "@/components/shared/YouTubeFacade";
import { FeatureCard } from "@/components/shared/Card";
import { Hero } from "@/components/shared/Hero";
import { NewsletterCard } from "@/components/shared/NewsletterCard";
import { ImageSlot } from "@/components/shared/ImageSlot";
import { PlanCard } from "@/components/shared/PlanCard";
import { john6_33to35, ScriptureBlock } from "@/components/shared/ScriptureBlock";
import { Section, SectionHeader } from "@/components/shared/Section";
import { SocialLinks, YouTubeSubscribeButton } from "@/components/shared/SocialLinks";
import { homeStats, StatStrip } from "@/components/shared/StatStrip";
import { nameText } from "@/lib/content/copy";
import { placeholderPlans } from "@/lib/content/placeholder-data";
import { getNextLiveSession } from "@/lib/schedule/next-session";
import { siteConfig } from "@/lib/site-config";
import { WEEKLY_SESSION_TITLE, WeeklySessionCard } from "@/components/shared/WeeklySessionCard";

export const metadata: Metadata = {
  title: { absolute: "House of Bread Global | A teaching ministry" },
  description: siteConfig.description,
};

export default async function HomePage() {
  // One occurrence, cached for an hour at most, feeds the hero chip and the card.
  const nextSession = await getNextLiveSession();

  return (
    <main id="main" tabIndex={-1}>
      <Hero
        nextSession={{ title: WEEKLY_SESSION_TITLE, startsAtUtc: nextSession, timeZone: siteConfig.liveSession.timeZone }}
      />

      {/* Figures sit just under the hero as a hairline row. */}
      <div className="container-page relative">
        <StatStrip stats={homeStats} />
      </div>

      <section id="start" aria-labelledby="start-heading" className="bg-surface">
        <div className="container-page py-20 md:py-30">
          {/* Heading beside the start here video on desktop, the four ways below. */}
          <div className="reveal grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
            <div className="lg:col-span-5">
              <SectionHeader id="start-heading">New here? Start here.</SectionHeader>
            </div>
            <div className="lg:col-span-7">
              <Suspense fallback={<YouTubeFacadeSkeleton />}>
                <StartHereVideo />
              </Suspense>
            </div>
          </div>
          {/* The next step for someone new: four ways in, each a card. */}
          <div id="ways" className="mt-16 md:mt-24">
            <SectionHeader id="ways-heading" as="h3" intro="Four ways to grow, wherever you are.">
              Make the most of House of Bread
            </SectionHeader>
            <div className="mt-10 md:mt-12">
              <BentoGrid>
              <BentoTile
                size="large"
                surface="mint"
                icon="live"
                icon3d="television"
                className="card-motion [--i:0]"
                title="Join the live session"
                cta={{ href: "/events", label: "See the live sessions" }}
              >
                Teaching streams live on YouTube every Monday evening, with reminders so no session
                is missed.
              </BentoTile>
              <BentoTile
                size="medium"
                surface="white"
                icon="people"
                icon3d="graduation-cap"
                className="card-motion [--i:1]"
                title="Learn in the Academy"
                cta={{ href: "/academy", label: "Explore the Academy" }}
              >
                Equipped in the truth. Bible classes that give believers a structured place to study
                the Word, taught with care for context and doctrine.
              </BentoTile>
              <BentoTile
                size="medium"
                surface="white"
                icon="scroll"
                icon3d="scroll"
                className="card-motion [--i:2]"
                title="Study the Word in writing"
                cta={{ href: "/teachings", label: "Read the teachings" }}
              >
                Doctrine, interpretation and the questions believers actually ask.
              </BentoTile>
              <BentoTile
                size="small"
                surface="warm"
                icon="phone"
                icon3d="mobile-phone"
                className="card-motion [--i:3]"
                title="Take the app with you"
                cta={{ href: "/app", label: "Get the app" }}
              >
                Daily reading, New Testament journeys, six translations and the ministry&apos;s
                teaching, in your pocket.
              </BentoTile>
              </BentoGrid>
            </div>
          </div>
        </div>
      </section>

      <section id="next-live" aria-labelledby="next-live-heading" className="bg-surface">
        <div className="container-page reveal grid gap-10 pb-18 md:pb-28 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-7">
            <SectionHeader id="next-live-heading">Next live session</SectionHeader>
            <div className="mt-10">
              <WeeklySessionCard serverIso={nextSession} idPrefix="home-next" />
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <YouTubeSubscribeButton />
            </div>
          </div>
          <ImageSlot
            className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none"
            ratio="4/5"
            brief="the teacher in a live session"
          />
        </div>
      </section>

      <Section id="stands-for" title="What the ministry stands for" tone="mint" reveal={false}>
        <ul className="grid gap-5 md:grid-cols-3">
          <FeatureCard icon="cross" icon3d="latin-cross" className="card-motion lift [--i:0]" title="Doctrinal clarity">
            Teaching that says plainly what Scripture says, and shows how the argument is built.
          </FeatureCard>
          <FeatureCard icon="book" icon3d="magnifying-glass" className="card-motion lift [--i:1]" title="Scripture in context">
            Passages are read with the background that makes them land, and quoted in full with the
            verses either side.
          </FeatureCard>
          <FeatureCard icon="heart" icon3d="green-heart" className="card-motion lift [--i:2]" title="Plain, warm and rigorous">
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
            <ScriptureBlock variant="feature" passage="John 6:33-35" verses={john6_33to35} />
          </div>
        </div>
      </section>

      <AppBand idPrefix="home-app" />

      <Section
        id="journeys"
        title="A journey through the New Testament"
        intro="Three guided routes from Matthew to Revelation, in the order the books were written."
        tone="warm"
        reveal={false}
      >
        <ul className="grid gap-5 md:grid-cols-3">
          {placeholderPlans.map((plan, index) => (
            <PlanCard key={plan.slug} {...plan} className={`card-motion lift [--i:${index}]`} />
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
