import type { Metadata } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { FeatureCard } from "@/components/shared/Card";
import { StepList } from "@/components/shared/Lists";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder } from "@/components/shared/Placeholder";
import { john6_33to35, ScriptureBlock } from "@/components/shared/ScriptureBlock";
import { Section } from "@/components/shared/Section";

const description =
  "House of Bread Global is a teaching ministry committed to doctrinal clarity and careful handling of Scripture, serving readers across the United Kingdom, Africa and the United States.";

export const metadata: Metadata = {
  title: "About",
  description,
};

export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="About"
        title="A teaching ministry built on the bread of life"
        lead="House of Bread Global is committed to doctrinal clarity and careful handling of Scripture, serving readers across the United Kingdom, Africa and the United States."
      />

      <section aria-labelledby="name-heading" className="bg-surface">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <span aria-hidden="true" className="block h-1 w-12 rounded-full bg-lime" />
            <h2 id="name-heading" className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              The name
            </h2>
            <p className="mt-6 text-xl leading-relaxed text-ink">
              The name comes from Bethlehem, the house of bread, and from the One who claimed the
              title for himself. The aim is not information for its own sake, but Scripture read
              well, understood clearly, and allowed to feed.
            </p>
          </div>
          <ScriptureBlock variant="dark" passage="John 6:33-35" verses={john6_33to35} />
        </div>
      </section>

      <Section id="does" title="What the ministry does" tone="tint">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon="scroll" title="Teaching">
            Written teaching on doctrine, interpretation and the questions believers actually ask.
          </FeatureCard>
          <FeatureCard icon="route" title="Reading plans">
            Guided routes through the New Testament in the order the books were written.
          </FeatureCard>
          <FeatureCard icon="live" title="Live sessions">
            Teaching streamed on YouTube, with reminders by email.
          </FeatureCard>
          <FeatureCard icon="people" title="Classes and training">
            Structured learning for those who want to go further than reading alone.
          </FeatureCard>
          <FeatureCard icon="phone" title="The app">
            Daily reading, six translations and progress tracking, on a phone.
          </FeatureCard>
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

      <Section id="teaches" title="Who teaches" tone="tint" width="narrow">
        <Placeholder block>[TEACHER NAME, PHOTO AND SHORT BIOGRAPHY TO BE SUPPLIED]</Placeholder>
      </Section>

      <Section id="doctrine" title="Doctrinal position" width="narrow">
        <Placeholder block>
          [DOCTRINAL STATEMENT TO BE SUPPLIED BY THE MINISTRY. Layout: a short list of headed
          statements, each with supporting Scripture.]
        </Placeholder>
      </Section>

      <section aria-label="Next steps" className="tone-green bg-green-band">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4 px-4 py-16 sm:px-6 md:py-20">
          <ButtonLink href="/subscribe" tone="green">
            Join the newsletter
          </ButtonLink>
          <ButtonLink href="/contact" tone="green" variant="secondary">
            Contact the ministry
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
