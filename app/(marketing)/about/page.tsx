import type { Metadata } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { FeatureCard } from "@/components/shared/Card";
import { ClosingBand } from "@/components/shared/ClosingBand";
import { Flag } from "@/components/shared/Flags";
import { LoopVideo } from "@/components/shared/LoopVideo";
import { StepList } from "@/components/shared/Lists";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge, PhotoFrame } from "@/components/shared/Placeholder";
import { john6_33to35, ScriptureBlock } from "@/components/shared/ScriptureBlock";
import { Section, SectionHeader } from "@/components/shared/Section";
import { nameText, sessionRegions } from "@/lib/content/copy";

const description =
  "House of Bread Global is a teaching ministry committed to doctrinal clarity and careful handling of Scripture, serving believers across the United Kingdom, Africa and the United States.";

export const metadata: Metadata = {
  title: "About the ministry",
  description,
};

export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="About the ministry"
        title="A teaching ministry for believers who want to be fed"
        lead={description}
      />

      <section id="mission" aria-labelledby="mission-heading" className="bg-surface">
        <div className="container-page reveal grid gap-12 py-18 md:py-28 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeader id="mission-heading">Mission</SectionHeader>
            {/* Interim wording from the content pack, shown as a marked placeholder. */}
            <div data-placeholder className="mt-8 space-y-5">
              <p className="flex flex-wrap items-center gap-3 text-sm">
                <PlaceholderBadge label="Interim wording" />
                <Placeholder>[MISSION STATEMENT TO BE SUPPLIED BY THE MINISTRY]</Placeholder>
              </p>
              <p className="max-w-2xl font-serif text-2xl leading-relaxed text-ink sm:text-3xl sm:leading-snug">
                House of Bread Global teaches the Scriptures with doctrinal clarity and care, so that
                believers are fed, grounded and equipped for a stronger walk with God.
              </p>
            </div>
          </div>
          <PhotoFrame
            className="lg:col-span-5"
            subject="Believers following a live teaching online, with open Bibles"
          />
        </div>
      </section>

      <section id="the-name" aria-labelledby="the-name-heading" className="bg-surface-warm">
        <div className="container-page reveal grid gap-12 py-18 md:py-28 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeader id="the-name-heading">The name</SectionHeader>
            <p className="mt-7 font-serif text-2xl leading-relaxed text-ink">{nameText}</p>
          </div>
          <div className="lg:col-span-6">
            <ScriptureBlock variant="feature" passage="John 6:33-35" verses={john6_33to35} />
          </div>
          <LoopVideo
            id="wheat-field"
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="aspect-video overflow-hidden rounded-card border border-border shadow-soft lg:col-span-12 lg:aspect-[21/8]"
          />
        </div>
      </section>

      <Section id="offers" title="What the ministry offers">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon="live" title="Live teaching">
            Sessions streamed on YouTube, with reminders by email.
          </FeatureCard>
          <FeatureCard icon="people" title="House of Bread Academy">
            Bible classes that equip believers with knowledge of the truth, for those who want to
            go further than reading alone.
          </FeatureCard>
          <FeatureCard icon="scroll" title="Written teaching">
            Doctrine, interpretation and the questions believers actually ask.
          </FeatureCard>
          <FeatureCard icon="book" title="New Testament study">
            An introduction to every New Testament book, and three guided journeys through the
            whole.
          </FeatureCard>
          <FeatureCard icon="phone" title="The official app">
            The ministry&apos;s teaching, journeys and six translations on your phone.
          </FeatureCard>
        </ul>
      </Section>

      <Section
        id="regions"
        title="Where the ministry serves"
        intro="The ministry is online, serving believers across three regions, with sessions and teaching open to all."
        tone="mint"
      >
        <ul className="grid gap-5 md:grid-cols-3">
          {sessionRegions.map((region) => (
            <li key={region.name} className="rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8">
              <Flag code={region.flag} className="w-10" />
              <h3 className="mt-6 text-2xl">{region.name}</h3>
              <p className="mt-3 leading-relaxed text-ink-muted">
                Join live sessions and classes online. Session times are shown in {region.zoneLabel}.
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="handled" title="How Scripture is handled">
        <StepList
          steps={[
            {
              title: "Context first.",
              text: "Who wrote it, who received it, and what prompted it, before any verse is applied.",
            },
            {
              title: "Scripture in full.",
              text: "Passages are quoted whole, with the verses either side where the argument depends on them.",
            },
            {
              title: "A clear text.",
              text: "The King James Version is the primary text. Any other translation is labelled.",
            },
            {
              title: "Plain English.",
              text: "Rigorous without being academic, and warm without being vague.",
            },
          ]}
        />
      </Section>

      <section id="leadership" aria-labelledby="leadership-heading" className="bg-surface-warm">
        <div className="container-page reveal grid gap-12 py-18 md:py-28 lg:grid-cols-12 lg:items-center lg:gap-16">
          <PhotoFrame
            className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none"
            ratio="4/5"
            subject="Portrait of the teacher"
          />
          <div className="lg:col-span-7">
            <SectionHeader id="leadership-heading">Leadership</SectionHeader>
            <div className="mt-8">
              <Placeholder block>[TEACHER NAME, PHOTO AND SHORT BIOGRAPHY TO BE SUPPLIED]</Placeholder>
            </div>
          </div>
        </div>
      </section>

      <Section id="doctrine" title="Doctrinal position" width="narrow">
        <Placeholder block>
          [DOCTRINAL STATEMENT TO BE SUPPLIED BY THE MINISTRY. Layout: a short list of headed
          statements, each with supporting Scripture.]
        </Placeholder>
      </Section>

      <ClosingBand id="about-next" eyebrow="Study . Pray . Grow" title="Come and be fed by the Word.">
        <ButtonLink href="/events" arrow>
          Join a live session
        </ButtonLink>
        <ButtonLink href="/contact" variant="secondary">
          Contact the ministry
        </ButtonLink>
      </ClosingBand>
    </main>
  );
}
