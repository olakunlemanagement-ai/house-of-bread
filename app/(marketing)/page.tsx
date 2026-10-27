import type { Metadata, Route } from "next";
import { Suspense } from "react";
import { ButtonLink } from "@/components/shared/Button";
import { CourseCard } from "@/components/shared/CourseCard";
import { Hero } from "@/components/shared/Hero";
import { HomeTeachings, HomeTeachingsSkeleton } from "@/components/shared/HomeTeachings";
import { ImageSlot } from "@/components/shared/ImageSlot";
import { NumberedRows } from "@/components/shared/NumberedRows";
import { Placeholder } from "@/components/shared/Placeholder";
import { StoreButtons } from "@/components/shared/StoreButtons";
import { RevealHeading } from "@/components/shared/RevealHeading";
import { Typewriter } from "@/components/shared/Typewriter";
import { courseCatalog } from "@/lib/academy";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: { absolute: "House of Bread Global | Understand the Bible you've been reading" },
  description: siteConfig.description,
};

// One rhythm for every Home section: 48px on phones, 112px from md.
const band = "container-page py-12 md:py-28";

/**
 * Home, seven screens in the order of docs/RESET-BRIEF.md section 4, copy
 * word for word. One idea and one primary button per screen. Section tints
 * alternate white, cream and pale green, one per section. Every call to
 * action is a button. The mission types itself out once; section headings
 * reveal line by line once.
 */
export default async function HomePage() {
  const courses = await courseCatalog.listCourses();
  // Stand-ins until the ministry names the [foundations course] and the
  // [book-by-book course]: the first and second courses in the catalogue.
  const courseHref = (index: number): Route =>
    courses[index] ? (`/academy/${courses[index].slug}` as Route) : "/academy";

  return (
    <main id="main" tabIndex={-1}>
      {/* Screen 1: hero. */}
      <Hero />

      {/* Screen 2: the mission, a statement. */}
      <section aria-labelledby="mission-heading" className="bg-surface-warm">
        <div className={band}>
          <Typewriter
            id="mission-heading"
            className="max-w-[72rem] text-mission"
            text="We teach believers to read God's Word accurately, understand it deeply, and live it fully, wherever they are."
          />
          <p className="mt-8 max-w-2xl text-lead text-ink-muted">
            The name comes from Bethlehem, the house of bread, where the Bread of Life was born.
          </p>
          <ButtonLink href="/about" variant="secondary" className="mt-6 w-full sm:w-auto">
            Read our story
          </ButtonLink>
        </div>
      </section>

      {/* Screen 3: the Academy, the main action. */}
      <section id="academy" aria-labelledby="academy-heading" className="bg-surface">
        <div className={band}>
          <div className="max-w-3xl">
            <p className="eyebrow">The Academy</p>
            <RevealHeading
              id="academy-heading"
              className="mt-4 text-h2"
              text="Read the Bible for years and still feel you only know it in parts?"
            />
            <p className="mt-4 text-lead text-ink-muted">
              Our free courses take you through it, one lesson at a time.
            </p>
          </div>
          <ul className="mt-8 grid gap-4 md:mt-12 md:gap-5 lg:grid-cols-3">
            {courses.slice(0, 3).map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </ul>
          <ButtonLink href="/academy" className="mt-8 w-full sm:w-auto">
            Browse all free courses
          </ButtonLink>
        </div>
      </section>

      {/* Screen 4: where are you starting from? */}
      <section aria-labelledby="start-heading" className="bg-surface-mint">
        <div className={band}>
          <RevealHeading id="start-heading" className="max-w-3xl text-h2" text="Where are you starting from?" />
          <NumberedRows
            className="mt-8 md:mt-12"
            items={[
              {
                title: "New to the Bible.",
                text: "Start with the foundations: what the Bible is and how to read it.",
                href: courseHref(0),
                action: "Start this course",
              },
              {
                title: "You know the stories, but not how they connect.",
                text: "Go book by book and see the whole picture.",
                href: courseHref(1),
                action: "Start this course",
              },
              {
                title: "You're carrying a question.",
                text: "Ask it. You don't need to give your name.",
                href: "/ask",
                action: "Ask a question",
              },
            ]}
          />
        </div>
      </section>

      {/* Screen 5: teachings. The live line is the only mention of live meetings on Home. */}
      <section id="teachings" aria-labelledby="teachings-heading" className="bg-surface">
        <div className={band}>
          <div className="max-w-3xl">
            <RevealHeading id="teachings-heading" className="text-h2" text="Need a word for this season?" />
            <p className="mt-4 text-lead text-ink-muted">
              Sit under the teaching of the Word, wherever you are.
            </p>
          </div>
          {/* The async region: its height must match the skeleton's (scripts/check-noscript.mjs). */}
          <div data-region="home-teachings" className="mt-10 md:mt-12">
            <Suspense fallback={<HomeTeachingsSkeleton />}>
              <HomeTeachings />
            </Suspense>
          </div>
          <div className="mt-10">
            <ButtonLink href="/media" className="w-full sm:w-auto">
              See all teachings
            </ButtonLink>
          </div>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
            <p className="text-base text-ink-muted">New teaching live every Monday at 8 pm Lagos time.</p>
            <ButtonLink href={"/events#rhythm" as Route} variant="secondary" size="sm">
              See the session times
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Screen 6: the teacher. */}
      <section aria-labelledby="teacher-heading" className="bg-surface-warm">
        {/* Phones: the photo full width above the text. From sm: side by side. */}
        <div className={`${band} grid gap-8 sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-center md:gap-14 lg:grid-cols-[minmax(0,20rem)_1fr]`}>
          <ImageSlot
            id="home-teacher"
            sizes="(min-width: 1024px) 20rem, (min-width: 640px) 14rem, 100vw"
          />
          <div>
            <h2 id="teacher-heading" className="sr-only">
              The teacher
            </h2>
            <p className="max-w-2xl font-serif text-xl leading-snug text-ink sm:text-2xl md:text-3xl md:leading-snug">
              Taught by Isaac Ola, team leader of{" "}
              <Placeholder>[House of Bread Ministries International]</Placeholder>. He teaches Scripture
              verse by verse, with care for what the text actually says.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/about" variant="secondary" className="w-full sm:w-auto">
                Read our story
              </ButtonLink>
              <ButtonLink href={"/about#handled" as Route} variant="secondary" className="w-full sm:w-auto">
                What we believe
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Screen 7: the app, just before the footer. */}
      <section aria-labelledby="app-heading" className="bg-surface-mint">
        <div className={band}>
          <RevealHeading id="app-heading" className="max-w-3xl text-h2" text="Take the Word with you." />
          <p className="mt-4 max-w-2xl text-lead text-ink-muted">
            Daily reading and journeys through the New Testament, in your pocket.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink href="/app" className="w-full sm:w-auto">
              Get the app
            </ButtonLink>
            <StoreButtons hideMissing />
          </div>
        </div>
      </section>
    </main>
  );
}
