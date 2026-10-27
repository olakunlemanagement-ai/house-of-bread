import type { Metadata, Route } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { CTACard } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { Icon } from "@/components/shared/icons";
import { ImageSlot } from "@/components/shared/ImageSlot";
import { StepList } from "@/components/shared/Lists";
import { NewsletterCard } from "@/components/shared/NewsletterCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge } from "@/components/shared/Placeholder";
import { Section } from "@/components/shared/Section";
import { TextCTA } from "@/components/shared/TextCTA";
import { courseCatalog } from "@/lib/academy";
import { academyCopy as copy } from "@/lib/content/copy";

export const metadata: Metadata = {
  title: "House of Bread Academy",
  description:
    "House of Bread Academy: Bible courses from House of Bread Global, taught from the King James Version in plain English, with Scripture read in its context. See the courses in preparation and hear when the Academy opens.",
};

export default async function AcademyPage() {
  const courses = (await courseCatalog.listCourses()).slice(0, 6);
  // Two columns for two or four cards, three for three, five or six.
  const courseGrid = courses.length % 3 === 0 || courses.length === 5 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow={copy.tagline}
        title="House of Bread Academy"
        lead={copy.lead}
        actions={
          <ButtonLink href={copy.waitlistHref} arrow>
            {copy.waitlistLabel}
          </ButtonLink>
        }
        loop="open-bible"
      />

      <Section id="courses" title={copy.courses.title} intro={copy.courses.intro}>
        {courses.length > 0 ? (
          <ul className={`grid gap-5 ${courseGrid}`}>
            {courses.map((course) => (
              <CTACard
                key={course.slug}
                icon="book"
                badge={course.status === "coming-soon" ? <PlaceholderBadge label="Coming soon" /> : null}
                title={course.title}
                cta={{ href: `/academy/${course.slug}` as Route, label: copy.courses.cta }}
              >
                {course.summary}
              </CTACard>
            ))}
          </ul>
        ) : (
          <EmptyState icon="book" action={{ href: copy.waitlistHref, label: copy.waitlistLabel }}>
            The first courses are being prepared.
          </EmptyState>
        )}
      </Section>

      <Section id="how" title={copy.steps.title} intro={copy.steps.intro} tone="warm">
        <StepList columns={3} steps={copy.steps.items.map((step) => ({ title: step.title, text: step.text }))} />
      </Section>

      <section id="why" aria-labelledby="why-heading" className="bg-surface">
        <div className="container-page reveal grid gap-12 py-20 md:py-30 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <span aria-hidden="true" className="block h-0.5 w-10 rounded-full bg-glyph" />
            <h2 id="why-heading" className="mt-5 text-h2">
              {copy.why.title}
            </h2>
            <p className="mt-4 max-w-3xl text-lead text-fg-muted">{copy.why.intro}</p>
            <dl className="mt-10 space-y-7 md:mt-12">
              {copy.why.items.map((item) => (
                <div key={item.title}>
                  <dt className="font-serif text-2xl font-semibold leading-snug text-ink">{item.title}</dt>
                  <dd className="mt-2 text-lg leading-relaxed text-ink-muted">
                    {item.text ?? <Placeholder>[TEACHER NAME AND A SHORT INTRODUCTION TO BE SUPPLIED]</Placeholder>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <ImageSlot
            id="academy-teacher"
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 384px, 100vw"
            className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none"
          />
        </div>
      </section>

      <Section id="questions" title={copy.questions.title} intro={copy.questions.intro} tone="mint" width="narrow">
        <div className="space-y-3">
          {copy.questions.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-card border border-border bg-surface shadow-soft transition-colors hover:border-border-strong"
            >
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-card px-5 py-4 font-sans text-lg font-semibold text-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-6 [&::-webkit-details-marker]:hidden">
                {item.question}
                <Icon
                  name="chevron-down"
                  className="size-5 shrink-0 text-glyph motion-safe:transition-transform motion-safe:duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="px-5 pb-5 text-lg leading-relaxed text-ink-muted sm:px-6">
                {item.answer ? <>{item.answer} </> : null}
                <Placeholder>{item.answer ? "[CONFIRM]" : `[CONFIRM: ${item.confirm}]`}</Placeholder>
              </p>
            </details>
          ))}
        </div>
        <div className="mt-8">
          <TextCTA href="/ask">{copy.questions.ask}</TextCTA>
        </div>
      </Section>

      <NewsletterCard
        idPrefix="academy-newsletter"
        heading={copy.closingHeading}
        text={copy.closingText}
        source="academy-waitlist"
      />
    </main>
  );
}
