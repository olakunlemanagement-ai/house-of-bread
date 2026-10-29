import type { Metadata } from "next";
import { BeliefCards, type BeliefCard } from "@/components/shared/BeliefCards";
import { ButtonLink } from "@/components/shared/Button";
import { ImageSlot } from "@/components/shared/ImageSlot";
import { NEXT_STEP_COURSES, NextStep } from "@/components/shared/NextStep";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder } from "@/components/shared/Placeholder";
import { john6_33to35, ScriptureBlock } from "@/components/shared/ScriptureBlock";
import { bandClass, bandBodyClass, Section, SectionHeader } from "@/components/shared/Section";

export const metadata: Metadata = {
  title: "A teaching ministry",
  description:
    "Why House of Bread? The story behind the name, the teacher, what the ministry believes and how Scripture is handled, and how to get in touch.",
};

const handled: BeliefCard[] = [
  {
    slot: "about-belief-context",
    title: "Context first.",
    text: "Who wrote it, who received it, and what prompted it, before any verse is applied.",
  },
  {
    slot: "about-belief-scripture",
    title: "Scripture in full.",
    text: "Passages are quoted whole, with the verses either side where the argument depends on them.",
  },
  {
    slot: "about-belief-text",
    title: "A clear text.",
    text: "The King James Version is the primary text. Any other translation is labelled.",
  },
  {
    slot: "about-belief-plain",
    title: "Plain English.",
    text: "Rigorous without being academic, and warm without being vague.",
  },
];

/**
 * About, per docs/RESET-BRIEF.md section 5: the story (under 150 words),
 * the teacher, what we believe, then contact, and the next step to the
 * Academy. The full ministry name stays in brackets until confirmed.
 */
export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="wheat-field"
        tone="night"
        align="center"
        animate
        eyebrow="About"
        title="A teaching ministry"
        lead="The name comes from Bethlehem, the house of bread, where the Bread of Life was born."
      />

      {/* Our story: 96 words. Keep it under 150 (the brief). */}
      <section id="story" aria-labelledby="story-heading" className="bg-surface">
        <div className={`${bandClass} grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16`}>
          <div className="lg:col-span-6">
            <SectionHeader id="story-heading">Why House of Bread?</SectionHeader>
            <div className={`${bandBodyClass} max-w-2xl space-y-5 text-lg leading-relaxed text-ink`}>
              <p>
                Bethlehem, Beyth Lechem in Hebrew (Strong&apos;s H1035), means house of bread. It is the town
                where Jesus was born, the One who called Himself the bread of life. The ministry takes its
                name from that revelation.
              </p>
              <p>
                Its purpose is to bring believers into an accurate understanding of God&apos;s Word, and a
                revelation of Him through it, beyond the four walls of a church building. The teaching is
                online and verse by verse.
              </p>
              <p>
                Today it reaches believers in the United Kingdom, across Africa, in the United States, and
                wherever there is a phone and a connection.
              </p>
            </div>
          </div>
          <div className="lg:col-span-6">
            <ScriptureBlock variant="feature" passage="John 6:33-35" verses={john6_33to35} />
          </div>
        </div>
      </section>

      <section id="teacher" aria-labelledby="teacher-heading" className="bg-surface-warm">
        <div
          className={`${bandClass} grid gap-6 sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-center md:gap-14 lg:grid-cols-[minmax(0,20rem)_1fr]`}
        >
          <ImageSlot id="about-leadership" sizes="(min-width: 1024px) 20rem, (min-width: 640px) 14rem, 100vw" />
          <div>
            <h2 id="teacher-heading" className="text-h2">
              Who teaches?
            </h2>
            <p className="mt-4 max-w-2xl font-serif text-xl leading-snug text-ink sm:text-2xl md:leading-snug">
              Taught by Isaac Ola, team leader of{" "}
              <Placeholder>[House of Bread Ministries International]</Placeholder>. He teaches Scripture
              verse by verse, with care for what the text actually says.
            </p>
            <p className="mt-4 text-base text-ink-muted">
              <Placeholder>[SHORT BIOGRAPHY TO BE SUPPLIED]</Placeholder>
            </p>
          </div>
        </div>
      </section>

      <Section id="beliefs" title="What we believe">
        <BeliefCards cards={handled} />
        <div className="mt-8 max-w-3xl">
          <Placeholder block>
            [DOCTRINAL STATEMENT TO BE SUPPLIED BY THE MINISTRY. Layout: a short list of headed statements,
            each with supporting Scripture.]
          </Placeholder>
        </div>
      </Section>

      <Section id="contact" title="Want to talk to someone?" tone="mint" width="narrow">
        <p className="max-w-2xl text-lead text-ink-muted">
          Questions about the ministry, the Academy or the app are welcome.
        </p>
        <ButtonLink href="/contact" variant="secondary" className="mt-6 w-full sm:w-auto">
          Send a message
        </ButtonLink>
      </Section>

      <NextStep tone="warm" title={NEXT_STEP_COURSES.title} text={NEXT_STEP_COURSES.text}>
        <ButtonLink href="/academy">Browse courses</ButtonLink>
      </NextStep>
    </main>
  );
}
